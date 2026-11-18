// Every `any` keyword in a declaration file, counted by the path of names
// that leads to it: namespaces, the declaration, then parameters and
// properties, with "return" for a return type. Overloads share a path, so
// the count says how many there are.

import fs from "node:fs";
import ts from "typescript-api";

function segment(node, child) {
  if (
    ts.isModuleDeclaration(node) ||
    ts.isInterfaceDeclaration(node) ||
    ts.isTypeAliasDeclaration(node) ||
    ts.isFunctionDeclaration(node) ||
    ts.isMethodSignature(node) ||
    ts.isPropertySignature(node) ||
    ts.isParameter(node) ||
    ts.isVariableDeclaration(node) ||
    ts.isTypeParameterDeclaration(node)
  ) {
    const name = node.name && (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name)) ? node.name.text : null;
    const isReturn = (ts.isFunctionDeclaration(node) || ts.isMethodSignature(node)) && node.type === child;
    return [name, isReturn ? "return" : null].filter(Boolean);
  }
  if ((ts.isFunctionTypeNode(node) || ts.isCallSignatureDeclaration(node)) && node.type === child) return ["return"];
  return [];
}

/**
 * @param {string} file
 * @returns {Map<string, number>} path -> occurrences
 */
export function anyPaths(file) {
  const sf = ts.createSourceFile(file, fs.readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true);
  const counts = new Map();
  const visit = (node) => {
    if (node.kind === ts.SyntaxKind.AnyKeyword) {
      const parts = [];
      for (let child = node, parent = node.parent; parent; child = parent, parent = parent.parent) {
        parts.unshift(...segment(parent, child));
      }
      const key = parts.join(".");
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return counts;
}

/**
 * The largest count of each path over the distinct declaration files in a
 * directory, so an any that only one entrypoint declares still counts.
 *
 * @param {string} dir
 * @returns {Map<string, number>}
 */
export function anyPathsInDir(dir) {
  const seen = new Set();
  const out = new Map();
  for (const name of fs.readdirSync(dir).sort()) {
    if (!name.endsWith(".d.ts") && !name.endsWith(".d.cts")) continue;
    const text = fs.readFileSync(`${dir}/${name}`, "utf8");
    if (seen.has(text)) continue;
    seen.add(text);
    for (const [key, n] of anyPaths(`${dir}/${name}`)) out.set(key, Math.max(out.get(key) ?? 0, n));
  }
  return out;
}
