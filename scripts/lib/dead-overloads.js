// Finds overloads TypeScript can never choose. Overload resolution takes the
// first signature that accepts the call, so a signature is dead when an
// earlier one with the same name accepts every argument list it accepts:
// no more required parameters, at least as many in all, and each parameter
// type assignable to the earlier one's.

import ts from "typescript-api";

const OPTIONS = {
  strict: true,
  noEmit: true,
  target: ts.ScriptTarget.ES2022,
  lib: ["lib.es2022.d.ts", "lib.dom.d.ts"],
  types: [],
};

function program(fileName, text) {
  const host = ts.createCompilerHost(OPTIONS);
  if (text !== undefined) {
    const getSourceFile = host.getSourceFile.bind(host);
    host.getSourceFile = (name, lang, ...rest) =>
      name === fileName ? ts.createSourceFile(name, text, lang, true) : getSourceFile(name, lang, ...rest);
    const fileExists = host.fileExists.bind(host);
    host.fileExists = (name) => name === fileName || fileExists(name);
  }
  return ts.createProgram([fileName], OPTIONS, host);
}

function shape(checker, decl) {
  const params = decl.parameters.filter((p) => !(ts.isIdentifier(p.name) && p.name.text === "this"));
  let required = 0;
  let rest = null;
  const types = [];
  for (const p of params) {
    const type = checker.getTypeAtLocation(p);
    if (p.dotDotDotToken) {
      rest = checker.getIndexTypeOfType(type, ts.IndexKind.Number) ?? checker.getAnyType();
      break;
    }
    types.push(p.questionToken || p.initializer ? checker.getUnionType([type, checker.getUndefinedType()]) : type);
    if (!p.questionToken && !p.initializer) required = types.length;
  }
  // count is the positions to compare: every declared one, and one past them
  // for a rest parameter.
  return {
    required,
    max: rest ? Infinity : types.length,
    count: types.length + (rest ? 1 : 0),
    at: (k) => (k < types.length ? types[k] : rest),
  };
}

// True when every argument list `later` accepts is also accepted by `earlier`.
function covers(checker, earlier, later) {
  if (earlier.required > later.required || earlier.max < later.max) return false;
  for (let k = 0; k < Math.max(later.count, earlier.count); k++) {
    const t = later.at(k);
    if (!t) break;
    const target = earlier.at(k);
    // any is assignable to every type, but an argument typed any by the later
    // overload can be anything, which only an any or unknown parameter takes.
    if (t.flags & ts.TypeFlags.Any && !(target.flags & (ts.TypeFlags.Any | ts.TypeFlags.Unknown))) return false;
    if (!checker.isTypeAssignableTo(t, target)) return false;
  }
  return true;
}

function nameOf(node) {
  if (ts.isCallSignatureDeclaration(node)) return "(call)";
  return node.name && (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name)) ? node.name.text : null;
}

/**
 * @param {string} fileName - a .d.ts file, read from disk unless text is given.
 * @param {string} [text]
 * @returns {{dead: string[], signatures: number, functions: number, overloadSets: number}}
 */
export function findDeadOverloads(fileName, text) {
  const prog = program(fileName, text);
  const checker = prog.getTypeChecker();
  const source = prog.getSourceFile(fileName);
  const dead = [];
  let signatures = 0;
  let functions = 0;
  let overloadSets = 0;

  const checkGroup = (owner, members) => {
    const groups = new Map();
    for (const m of members) {
      const isFn = ts.isFunctionDeclaration(m);
      if (!isFn && !ts.isMethodSignature(m) && !ts.isCallSignatureDeclaration(m)) continue;
      const name = nameOf(m);
      if (name === null) continue;
      signatures++;
      if (isFn) functions++;
      if (!groups.has(name)) groups.set(name, []);
      groups.get(name).push(m);
    }
    for (const [name, decls] of groups) {
      if (decls.length < 2) continue;
      overloadSets++;
      const shapes = decls.map((d) => shape(checker, d));
      for (let j = 1; j < decls.length; j++) {
        const i = shapes.findIndex((s, idx) => idx < j && covers(checker, s, shapes[j]));
        if (i < 0) continue;
        const sig = (d) => d.getText(source).replace(/\s+/g, " ").replace(/^export /, "");
        dead.push(
          `${owner ? owner + "." : ""}${name}: overload ${j + 1} can never be chosen, overload ${i + 1} accepts every call it does. ` +
            `Overload ${i + 1}: ${sig(decls[i])} Overload ${j + 1}: ${sig(decls[j])}`
        );
      }
    }
  };

  const visit = (node, owner) => {
    if (ts.isSourceFile(node)) {
      checkGroup(owner, node.statements);
    } else if (ts.isModuleDeclaration(node) && node.body && ts.isModuleBlock(node.body)) {
      owner = owner ? `${owner}.${node.name.text}` : node.name.text;
      checkGroup(owner, node.body.statements);
    } else if (ts.isInterfaceDeclaration(node)) {
      owner = owner ? `${owner}.${node.name.text}` : node.name.text;
      checkGroup(owner, node.members);
    } else if (ts.isTypeLiteralNode(node)) {
      checkGroup(owner ? `${owner}.{}` : "{}", node.members);
    }
    ts.forEachChild(node, (child) => visit(child, owner));
  };
  visit(source, "");
  return { dead, signatures, functions, overloadSets };
}
