import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildDeclarations } from "../src/generate.js";
import {
  FUNCTION_TYPES,
  INTENTIONAL_FAILURE_CALLEES,
  apiChain,
  calleeName,
  chainOf,
  children,
  parseJs,
} from "./ast.js";
import { countApiCalls, extractCorpus } from "./extract.js";
import { familyKey } from "./families.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tsc = path.join(repoRoot, "node_modules/typescript/bin/tsc");

// The extracted code leaves out the test file around it, so names that the
// test defines elsewhere are unresolved and syntax that only parses inside
// the original file is rejected. None of that says anything about the
// declarations.
const TEST_CONTEXT_CODES = new Set(["TS2304", "TS2552", "TS2663", "TS2686", "TS18004"]);
const isTestContext = (code) => TEST_CONTEXT_CODES.has(code) || /^TS1\d{3}$/.test(code);

const DIAGNOSTIC = /^(.+?)\((\d+),(\d+)\): error (TS\d+): (.*)$/;

function silently(fn) {
  const log = console.log;
  console.log = () => {};
  try {
    return fn();
  } finally {
    console.log = log;
  }
}

function declaredNamespaces(declarationFile) {
  const text = fs.readFileSync(declarationFile, "utf8");
  return new Set([...text.matchAll(/^ {4}export namespace (\w+)/gm)].map((m) => m[1]));
}

function patternNames(pattern, names) {
  if (!pattern) return;
  if (pattern.type === "Identifier") names.add(pattern.name);
  else if (pattern.type === "ObjectPattern") {
    for (const p of pattern.properties) patternNames(p.type === "Property" ? p.value : p.argument, names);
  } else if (pattern.type === "ArrayPattern") pattern.elements.forEach((e) => patternNames(e, names));
  else if (pattern.type === "AssignmentPattern") patternNames(pattern.left, names);
  else if (pattern.type === "RestElement") patternNames(pattern.argument, names);
}

const apiName = (props) => props.join(".").replace(/\.(then|catch|finally)$/, "");

// Everything the classifier needs to know about one corpus file: where
// intentional-failure calls are, and which variables hold API results.
function analyse(text, namespaces) {
  const ast = parseJs(text);
  const lineStarts = [0];
  for (let i = 0; i < text.length; i++) if (text[i] === "\n") lineStarts.push(i + 1);
  const info = { ast, lineStarts, intentional: [], results: [] };
  if (!ast) return info;

  const holdsResult = (names, scope, source, definition) => {
    for (const name of names) {
      info.results.push({
        name,
        scopeStart: scope.start,
        scopeEnd: scope.end,
        source,
        definitionEnd: definition ? definition.end : null,
        definitionStart: definition ? definition.start : -1,
      });
    }
  };

  (function visit(node, functions) {
    const scope = functions.length ? functions.at(-1) : ast;
    if (node.type === "CallExpression") {
      const name = calleeName(node.callee);
      if (name && INTENTIONAL_FAILURE_CALLEES.has(name)) info.intentional.push([node.start, node.end]);
      const chain = apiChain(node.callee, namespaces);
      if (chain) {
        for (const arg of node.arguments) {
          if (!FUNCTION_TYPES.has(arg.type)) continue;
          const names = new Set();
          arg.params.forEach((p) => patternNames(p, names));
          holdsResult(names, arg, apiName(chain.props));
        }
      }
    }
    if (node.type === "VariableDeclarator" && node.init) {
      const chain = apiChain(node.init, namespaces);
      if (chain) {
        const names = new Set();
        patternNames(node.id, names);
        holdsResult(names, scope, apiName(chain.props), node.init);
      }
    }
    if (node.type === "AssignmentExpression" && node.left.type === "Identifier") {
      const chain = apiChain(node.right, namespaces);
      if (chain) holdsResult([node.left.name], scope, apiName(chain.props), node.right);
    }
    const next = FUNCTION_TYPES.has(node.type) ? [...functions, node] : functions;
    for (const child of children(node)) visit(child, next);
  })(ast, []);
  return info;
}

function nearestResult(info, name, position) {
  const candidates = info.results.filter(
    (r) =>
      r.name === name &&
      r.scopeStart <= position &&
      position < r.scopeEnd &&
      (r.definitionEnd === null || r.definitionEnd <= position)
  );
  candidates.sort(
    (a, b) => a.scopeEnd - a.scopeStart - (b.scopeEnd - b.scopeStart) || b.definitionStart - a.definitionStart
  );
  return candidates[0] ?? null;
}

function pathTo(ast, position) {
  const nodes = [];
  let node = ast;
  while (node) {
    nodes.push(node);
    node = children(node).find((c) => c.start <= position && position < c.end);
  }
  return nodes;
}

// Which API a diagnostic is about: the call or member chain it sits in, or
// the API that produced the variable it reads. null for everything else
// (test helpers, test globals, code that does not touch an API).
function apiOfDiagnostic(info, namespaces, position) {
  const nodes = pathTo(info.ast, position);
  let insideCallback = false;
  for (let i = nodes.length - 1; i >= 0; i--) {
    const node = nodes[i];
    const child = nodes[i + 1];
    if (FUNCTION_TYPES.has(node.type) && child && node.body === child) insideCallback = true;
    if (insideCallback) continue;
    if (node.type === "CallExpression" || node.type === "MemberExpression") {
      const chain = apiChain(node, namespaces);
      if (chain) return { api: apiName(chain.props), root: chain.props[0] };
      const { root, props } = chainOf(node);
      const result = root && props.length > 0 ? nearestResult(info, root, position) : null;
      if (result) return { api: `result-of:${result.source}`, root: result.source.split(".")[0] };
    }
    if (node.type === "Identifier" && i === nodes.length - 1) {
      const result = nearestResult(info, node.name, position);
      if (result) return { api: `result-of:${result.source}`, root: result.source.split(".")[0] };
    }
  }
  return null;
}

function parseDiagnostics(output) {
  const found = [];
  for (const line of output.split("\n")) {
    const m = DIAGNOSTIC.exec(line);
    if (m) found.push({ file: m[1], line: +m[2], column: +m[3], code: m[4], message: m[5], detail: [] });
    else if (found.length && /^\s+/.test(line)) found.at(-1).detail.push(line.trim());
  }
  return found;
}

/**
 * Generates declarations from `firefoxRoot`, then checks the extension code
 * in its tests against them. See `checkAgainstDeclarations`.
 */
export function checkCorpus(firefoxRoot, workDir) {
  const declarationDir = path.join(workDir, "declarations");
  silently(() => buildDeclarations(firefoxRoot, declarationDir, { emitCommitHeader: false }));
  return checkAgainstDeclarations(firefoxRoot, declarationDir, workDir);
}

/**
 * Extracts the extension code in Firefox's own tests, type-checks it as
 * JavaScript against `global.d.ts` and `global-chrome.d.ts` in
 * `declarationDir`, and groups the diagnostics into families.
 *
 * Diagnostics that are not about an API call, its arguments or its result
 * are dropped as noise. Diagnostics inside assertThrows-style calls are
 * counted in `stats.intentional` and otherwise ignored.
 *
 * Returns `{ families, stats }`. `families` maps a family key to
 * `{ count, example }`, where `example` is `path/to/test.js:line` in Firefox.
 */
export function checkAgainstDeclarations(firefoxRoot, declarationDir, workDir) {
  
  const corpusDir = path.join(workDir, "corpus");
  // browser.test is the harness, not part of the declarations. Counting it as
  // an API lets whole background functions be extracted when they only reach
  // the real APIs through it, and its diagnostics are dropped as noise.
  const namespaces = new Set([...declaredNamespaces(path.join(declarationDir, "global.d.ts")), "test"]);
  const { files, stats: extraction } = extractCorpus(firefoxRoot, corpusDir, namespaces);
  const names = Object.keys(files);

  const tsconfig = path.join(workDir, "tsconfig.json");
  fs.writeFileSync(
    tsconfig,
    JSON.stringify({
      compilerOptions: {
        target: "ES2022",
        module: "esnext",
        moduleResolution: "bundler",
        allowJs: true,
        checkJs: true,
        noEmit: true,
        strict: true,
        noImplicitAny: false,
        skipLibCheck: true,
        types: [],
        lib: ["ES2022", "DOM", "DOM.Iterable"],
        maxNodeModuleJsDepth: 0,
      },
      files: [
        path.join(declarationDir, "global.d.ts"),
        path.join(declarationDir, "global-chrome.d.ts"),
        ...names.map((n) => path.join(corpusDir, n)),
      ],
    })
  );
  const run = spawnSync(process.execPath, [tsc, "-p", tsconfig, "--pretty", "false"], {
    cwd: workDir,
    encoding: "utf8",
    maxBuffer: 1 << 28,
  });
  if (run.error || run.status > 2) {
    throw new Error(`tsc failed to run (status ${run.status}): ${run.error ?? run.stderr}${run.stdout}`.slice(0, 2000));
  }

  const analysed = new Map();
  const infoFor = (file, text) => {
    if (!analysed.has(file)) analysed.set(file, analyse(text, namespaces));
    return analysed.get(file);
  };

  const stats = {
    sourceFiles: extraction.sourceFiles,
    unparsed: extraction.unparsed.length,
    corpusFiles: names.length,
    callSites: 0,
    diagnostics: 0,
    inScope: 0,
    intentional: 0,
  };
  for (const name of names) {
    const text = fs.readFileSync(path.join(corpusDir, name), "utf8");
    const info = infoFor(path.join(corpusDir, name), text);
    if (info.ast) stats.callSites += countApiCalls(info.ast, namespaces);
  }

  const families = new Map();
  for (const d of parseDiagnostics(run.stdout)) {
    stats.diagnostics++;
    const file = path.resolve(workDir, d.file);
    const origin = files[path.basename(file)];
    if (!origin || isTestContext(d.code)) continue;
    const info = infoFor(file, fs.readFileSync(file, "utf8"));
    if (!info.ast) continue;
    const position = info.lineStarts[d.line - 1] + d.column - 1;
    const scope = apiOfDiagnostic(info, namespaces, position);
    if (!scope || scope.root === "test") continue;
    if (info.intentional.some(([start, end]) => start <= position && position < end)) {
      stats.intentional++;
      continue;
    }
    stats.inScope++;
    const key = familyKey(d.code, d.message, scope.api, d.detail);
    const family = families.get(key) ?? { count: 0, example: `${origin.source}:${origin.firstLine + d.line - 1}` };
    family.count++;
    families.set(key, family);
  }
  return { families, stats };
}
