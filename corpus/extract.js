import fs from "node:fs";
import path from "node:path";
import { FUNCTION_TYPES, apiChain, children, parseJs, propertyKey } from "./ast.js";

// Directories in a Firefox checkout that hold extension code written by
// Firefox's own tests.
export const CORPUS_ROOTS = [
  "toolkit/components/extensions/test/xpcshell",
  "toolkit/components/extensions/test/mochitest",
  "toolkit/components/extensions/test/browser",
  "browser/components/extensions/test/browser",
  "browser/components/extensions/test/xpcshell",
  "browser/components/extensions/test/mochitest",
  "mobile/shared/components/extensions/test/xpcshell",
  "mobile/android/geckoview/src/androidTest/assets/web_extensions",
  "mobile/android/fenix/app/src/androidTest/appAssets/extensions",
  "mobile/android/android-components/samples/browser/src/main/assets/extensions",
];

// Everything under these roots is extension code, not just the backgrounds.
const WHOLE_FILE_ROOTS = CORPUS_ROOTS.filter((root) => root.startsWith("mobile/android/"));

const SOURCE_FILE = /\.(js|mjs|html|sjs)$/;
const API_MENTION = /\b(browser|chrome)\.[a-zA-Z]+/;

function walk(dir, found = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, found);
    else if (SOURCE_FILE.test(entry.name)) found.push(full);
  }
  return found.sort();
}

const blank = (text) => text.replace(/[^\n]/g, " ");

// Keeps only the inline <script> bodies of an HTML file, in place, so line
// numbers stay those of the HTML file.
function inlineScripts(html) {
  const chars = blank(html).split("");
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  for (let m = re.exec(html); m; m = re.exec(html)) {
    if (/\bsrc\s*=/.test(m[1])) continue;
    const start = m.index + m[0].indexOf(">") + 1;
    for (let i = 0; i < m[2].length; i++) chars[start + i] = m[2][i];
  }
  return chars.join("");
}

function declaresBrowser(fn) {
  return fn.params.some((p) => p.type === "Identifier" && p.name === "browser");
}

function isFileMapEntry(property) {
  const key = propertyKey(property);
  return key !== null && /\.m?js$/.test(key);
}

// Function values that are an extension's background script, or one of the
// scripts in a `files: {...}` map.
function forcedFunctions(ast) {
  const forced = new Set();
  (function visit(node) {
    if (node.type === "Property") {
      const key = propertyKey(node);
      if (key === "background" && FUNCTION_TYPES.has(node.value.type)) forced.add(node.value);
      if (key === "files" && node.value.type === "ObjectExpression") {
        for (const entry of node.value.properties) {
          if (entry.type === "Property" && isFileMapEntry(entry) && FUNCTION_TYPES.has(entry.value.type)) {
            forced.add(entry.value);
          }
        }
      }
    }
    children(node).forEach(visit);
  })(ast);
  return forced;
}

// Maps each function to whether its own body (not a nested function's)
// names an API namespace, and whether it shadows `browser`.
function annotateFunctions(ast, namespaces) {
  const info = new Map();
  (function visit(node, current) {
    let scope = current;
    if (FUNCTION_TYPES.has(node.type)) {
      scope = { usesApi: false, shadows: declaresBrowser(node) };
      info.set(node, scope);
    }
    if (scope) {
      if (node.type === "VariableDeclarator" && node.id.type === "Identifier" && node.id.name === "browser") {
        scope.shadows = true;
      }
      if (node.type === "MemberExpression" && !node.computed && node.object.type === "Identifier") {
        const { name } = node.object;
        if ((name === "browser" || name === "chrome") && namespaces.has(node.property.name)) scope.usesApi = true;
      }
    }
    for (const child of children(node)) visit(child, scope);
  })(ast, null);
  return info;
}

// Outermost function regions that hold extension code.
function functionRegions(ast, namespaces) {
  const forced = forcedFunctions(ast);
  const info = annotateFunctions(ast, namespaces);
  const regions = [];
  (function select(node, parent) {
    if (FUNCTION_TYPES.has(node.type)) {
      const { usesApi, shadows } = info.get(node);
      if (forced.has(node) || (usesApi && !shadows)) {
        const method = parent?.type === "Property" && (parent.method || parent.kind !== "init");
        regions.push({ start: method ? parent.start : node.start, end: node.end, method });
        return;
      }
    }
    children(node).forEach((child) => select(child, node));
  })(ast, null);
  return regions;
}

// Extension code held in a string, for example `background: "browser.x()"`.
function stringRegions(ast, lineOf) {
  const found = [];
  (function visit(node) {
    if (node.type === "Property") {
      const key = propertyKey(node);
      const holdsScript = key === "background" || (key !== null && /\.m?js$/.test(key));
      const { value } = node;
      let code = null;
      if (holdsScript && value.type === "Literal" && typeof value.value === "string" && value.value.length > 20) {
        code = value.value;
      } else if (holdsScript && value.type === "TemplateLiteral" && value.expressions.length === 0) {
        code = value.quasis[0].value.cooked;
      }
      if (code !== null && API_MENTION.test(code)) found.push({ code, line: lineOf(value.start) });
    }
    children(node).forEach(visit);
  })(ast);
  return found;
}

function lineIndex(text) {
  const starts = [0];
  for (let i = 0; i < text.length; i++) if (text[i] === "\n") starts.push(i + 1);
  return (offset) => {
    let lo = 0;
    let hi = starts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (starts[mid] <= offset) lo = mid;
      else hi = mid - 1;
    }
    return lo + 1;
  };
}

// Keeps every region where it was and blanks everything else, so a line in
// the corpus file is the same line in the Firefox file. Each region is
// terminated with a semicolon so that a region cannot join the next one into
// one expression.
function lineStablePlacement(text, regions) {
  let out = "";
  let last = 0;
  for (const r of [...regions].sort((a, b) => a.start - b.start)) {
    out += blank(text.slice(last, r.start));
    out += (r.method ? "({" : "(") + text.slice(r.start, r.end) + (r.method ? "});" : ");");
    last = r.end;
  }
  return out + blank(text.slice(last));
}

function corpusName(relative, suffix = "") {
  return relative.replace(/[\\/]/g, "__") + suffix + ".js";
}

/**
 * Writes the extension code found in Firefox's own tests into `outDir`, one
 * JavaScript file per source file, and returns a map from each written file
 * to the Firefox source file and the line its first line corresponds to.
 *
 * Code is taken from background scripts, from any function that calls an API
 * namespace directly, from whole files under the Android asset roots and
 * `data/` or `file_*` helpers, and from background code held in strings.
 * Code assembled at runtime is not seen.
 */
export function extractCorpus(firefoxRoot, outDir, namespaces) {
  fs.mkdirSync(outDir, { recursive: true });
  const written = {};
  const stats = { sourceFiles: 0, unparsed: [] };

  for (const root of CORPUS_ROOTS) {
    const rootDir = path.join(firefoxRoot, root);
    if (!fs.existsSync(rootDir)) continue;
    const wholeRoot = WHOLE_FILE_ROOTS.includes(root);

    for (const file of walk(rootDir)) {
      stats.sourceFiles++;
      const relative = path.relative(firefoxRoot, file).split(path.sep).join("/");
      const raw = fs.readFileSync(file, "utf8");
      const text = file.endsWith(".html") ? inlineScripts(raw) : raw;
      const ast = parseJs(text);
      if (!ast) {
        stats.unparsed.push(relative);
        continue;
      }

      const lineOf = lineIndex(text);
      const wholeFile =
        !file.endsWith(".html") &&
        (wholeRoot || relative.includes("/data/") || path.basename(file).startsWith("file_")) &&
        API_MENTION.test(text);

      if (wholeFile) {
        const name = corpusName(relative);
        fs.writeFileSync(path.join(outDir, name), `(function(){${text}\n});\n`);
        written[name] = { source: relative, firstLine: 1 };
        continue;
      }

      const regions = functionRegions(ast, namespaces);
      if (regions.length) {
        const name = corpusName(relative);
        fs.writeFileSync(path.join(outDir, name), lineStablePlacement(text, regions));
        written[name] = { source: relative, firstLine: 1 };
      }
      stringRegions(ast, lineOf).forEach((region, i) => {
        const body = `(async function(){${region.code}\n});\n`;
        if (!parseJs(body)) {
          stats.unparsed.push(`${relative} (string region ${i})`);
          return;
        }
        const name = corpusName(relative, `.str${i}`);
        fs.writeFileSync(path.join(outDir, name), body);
        written[name] = { source: relative, firstLine: region.line };
      });
    }
  }
  return { files: written, stats };
}

// Counts API calls such as browser.tabs.query(), excluding browser.test.
export function countApiCalls(ast, namespaces) {
  let count = 0;
  (function visit(node) {
    if (node.type === "CallExpression" && node.callee.type === "MemberExpression") {
      const chain = apiChain(node.callee, namespaces);
      if (chain && chain.props[0] !== "test") count++;
    }
    children(node).forEach(visit);
  })(ast);
  return count;
}
