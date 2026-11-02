import path from "node:path";

// A call with an `any` argument matches the first overload of its arity. If
// that overload takes a callback and returns void while a Promise overload
// of the same arity exists, `await fn(anyValue)` is typed void. This finds
// every overloaded function or method in a declaration file, generates calls
// with `any` arguments for every arity, and asks the checker which overload
// each call resolves to.

const PROBE_NAME = "any-argument-probe.ts";

function isPromiseReturn(ts, checker, signature) {
  const ret = checker.getReturnTypeOfSignature(signature);
  return ret.symbol?.name === "Promise";
}

function acceptsArity(signature, n) {
  const params = signature.getParameters();
  const rest = signature.declaration?.parameters?.some((p) => p.dotDotDotToken);
  return n >= signature.minArgumentCount && (rest || n <= params.length);
}

function arityRange(signatures) {
  let max = 0;
  for (const s of signatures) {
    const rest = s.declaration?.parameters?.some((p) => p.dotDotDotToken);
    max = Math.max(max, s.getParameters().length + (rest ? 1 : 0));
  }
  return { min: Math.min(...signatures.map((s) => s.minArgumentCount)), max };
}

// `function _eval` sits in its namespace unexported and `export { _eval as eval }`
// publishes it, so the declared name is not the name a caller writes and the
// symbol has no parent. The enclosing namespace's exports give both.
function enclosingNamespace(ts, checker, symbol, node) {
  if (symbol.parent) return symbol.parent;
  const block = node.parent;
  return block && ts.isModuleBlock(block) ? checker.getSymbolAtLocation(block.parent.name) : undefined;
}

function exportedName(ts, checker, symbol, parent) {
  for (const exported of checker.getExportsOfModule(parent)) {
    const target = exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
    if (target === symbol) return exported.name;
  }
  return symbol.name;
}

function collectOverloaded(ts, checker, sourceFile) {
  const found = new Map();
  const visit = (node) => {
    const callable =
      ts.isFunctionDeclaration(node) || ts.isMethodSignature(node) || ts.isMethodDeclaration(node);
    if (callable && node.name) {
      const symbol = checker.getSymbolAtLocation(node.name);
      if (symbol && !found.has(symbol)) {
        const signatures = checker.getTypeOfSymbolAtLocation(symbol, node).getCallSignatures();
        if (signatures.length > 1) found.set(symbol, { node, signatures });
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return found;
}

function compilerOptions(ts) {
  return {
    strict: true,
    target: ts.ScriptTarget.ES2022,
    lib: ["lib.es2022.d.ts", "lib.dom.d.ts"],
    skipLibCheck: true,
    types: [],
    noEmit: true,
  };
}

/**
 * @returns {{ overloads: number, calls: number, failures: string[] }}
 */
export function probeAnyArguments(ts, declarationFile) {
  const options = compilerOptions(ts);
  const first = ts.createProgram([declarationFile], options);
  const firstChecker = first.getTypeChecker();
  const overloaded = collectOverloaded(ts, firstChecker, first.getSourceFile(declarationFile));

  // Methods need an instance of the interface that declares them.
  const instances = new Map();
  const lines = ["declare const anyValue: any;"];
  const meta = [];
  const label = (symbol) => firstChecker.getFullyQualifiedName(symbol);
  const nameOf = (symbol) => {
    const { node } = overloaded.get(symbol);
    if (!ts.isFunctionDeclaration(node)) return label(symbol);
    const parent = enclosingNamespace(ts, firstChecker, symbol, node);
    return parent ? `${label(parent)}.${exportedName(ts, firstChecker, symbol, parent)}` : symbol.name;
  };
  for (const [symbol, { node, signatures }] of overloaded) {
    let callee;
    if (ts.isFunctionDeclaration(node)) {
      const parent = enclosingNamespace(ts, firstChecker, symbol, node);
      callee = parent ? `${label(parent)}.${exportedName(ts, firstChecker, symbol, parent)}` : symbol.name;
    } else {
      const owner = symbol.parent;
      if (!instances.has(owner)) {
        const typeParams = owner.declarations
          .flatMap((d) => d.typeParameters ?? [])
          .map(() => "any");
        const typeName = label(owner) + (typeParams.length ? `<${typeParams.join(", ")}>` : "");
        instances.set(owner, `probeInstance${instances.size}`);
        lines.push(`declare const ${instances.get(owner)}: ${typeName};`);
      }
      callee = `${instances.get(owner)}.${symbol.name}`;
    }
    const { min, max } = arityRange(signatures);
    for (let n = min; n <= max; n++) {
      const variants = [{ position: "all", args: Array(n).fill("anyValue") }];
      // One position is `any` and the rest carry the types of a Promise
      // overload of this arity, so only the `any` argument is in doubt.
      const promiseOverload = signatures.find((s) => acceptsArity(s, n) && isPromiseReturn(ts, firstChecker, s));
      if (promiseOverload && n > 1) {
        const types = promiseOverload.getParameters().slice(0, n).map((param) => {
          const type = firstChecker.getTypeOfSymbolAtLocation(param, node);
          return firstChecker.typeToString(
            type,
            undefined,
            ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseFullyQualifiedType | ts.TypeFormatFlags.InTypeAlias
          );
        });
        if (types.length === n) {
          for (let i = 0; i < n; i++) {
            variants.push({ position: i, args: types.map((t, j) => (j === i ? "anyValue" : `(undefined as unknown as ${t})`)) });
          }
        }
      }
      for (const { position, args } of variants) {
        lines.push(`void ${callee}(${args.join(", ")});`);
        meta.push({ name: nameOf(symbol), n, position, symbol, callee });
      }
    }
  }

  const probePath = path.join(path.dirname(declarationFile), PROBE_NAME);
  const probeText = lines.join("\n") + "\n";
  const host = ts.createCompilerHost(options);
  const getSourceFile = host.getSourceFile.bind(host);
  host.getSourceFile = (file, languageVersion, ...rest) =>
    file === probePath ? ts.createSourceFile(file, probeText, languageVersion, true) : getSourceFile(file, languageVersion, ...rest);
  const fileExists = host.fileExists.bind(host);
  host.fileExists = (file) => file === probePath || fileExists(file);
  const program = ts.createProgram([declarationFile, probePath], options, host);
  const checker = program.getTypeChecker();
  const probe = program.getSourceFile(probePath);

  const calls = [];
  const collect = (node) => {
    if (ts.isCallExpression(node) && ts.isVoidExpression(node.parent) && node.parent.parent && ts.isExpressionStatement(node.parent.parent)) {
      calls.push(node);
    }
    ts.forEachChild(node, collect);
  };
  collect(probe);

  const failures = program
    .getSemanticDiagnostics(probe)
    .map((d) => `probe does not compile, a type could not be written out: ${ts.flattenDiagnosticMessageText(d.messageText, "\n")} in ${JSON.stringify(probeText.split("\n")[probe.getLineAndCharacterOfPosition(d.start).line].slice(0, 160))}`);
  const bySymbol = new Map();
  for (const [symbol, { signatures }] of overloaded) bySymbol.set(nameOf(symbol), signatures);
  if (calls.length !== meta.length) {
    throw new Error(`probe generated ${meta.length} calls but the checker found ${calls.length}`);
  }
  calls.forEach((call, index) => {
    const { name, n, position } = meta[index];
    const where = position === "all" ? `${n} any argument(s)` : `any at argument ${position} of ${n}, the rest typed as the Promise overload`;
    const chosen = checker.getResolvedSignature(call);
    if (!chosen || !chosen.declaration) {
      failures.push(`${name}: no overload accepts ${where}`);
      return;
    }
    const returnsVoid = (checker.getReturnTypeOfSignature(chosen).flags & ts.TypeFlags.Void) !== 0;
    if (!returnsVoid) return;
    const signatures = bySymbol.get(name);
    const promiseOverload = signatures.find((s) => acceptsArity(s, n) && isPromiseReturn(ts, checker, s));
    if (promiseOverload) {
      failures.push(
        `${name}: ${where} selects\n    ${checker.signatureToString(chosen)}\n  which returns void, but this overload of the same arity returns a Promise:\n    ${checker.signatureToString(promiseOverload)}`
      );
    }
  });
  return { overloads: overloaded.size, calls: calls.length, failures };
}
