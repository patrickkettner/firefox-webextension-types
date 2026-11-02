import fs from "node:fs";
import path from "node:path";

// A test that asserts declaration text needs a stated basis, in a comment
// directly above the test, above an enclosing describe, or at the top of the
// file. One of:
//   // Firefox: <file>, <file> (what the file says)
//   // TypeScript: <fact about the language or the language service>
//   // Packaging: <fact about npm, exports maps or the tarball>
//   // Tooling: <why no declaration text is asserted>
// A Firefox basis names files that exist in the checkout.

const TAG = /\b(Firefox|TypeScript|Packaging|Tooling):\s*(.*)$/;
const FILE = /[A-Za-z0-9_./-]+\.(?:json|sys\.mjs|mjs|js|webidl|cpp|mn|ts)\b/g;
const SEARCH_DIRS = [
  "toolkit/components/extensions",
  "browser/components/extensions",
  "mobile/shared/components/extensions",
  "dom/webidl",
  "toolkit/modules",
  "toolkit/components/downloads",
  "toolkit/components/places",
  "devtools/shared/performance-new",
];

export function firefoxFileIndex(firefoxRoot) {
  const names = new Set();
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) walk(path.join(dir, entry.name));
      else names.add(entry.name);
    }
  };
  for (const rel of SEARCH_DIRS) {
    const dir = path.join(firefoxRoot, rel);
    if (fs.existsSync(dir)) walk(dir);
  }
  return names;
}

function leadingComment(lines, at) {
  const block = [];
  for (let i = at - 1; i >= 0 && /^\s*\/\//.test(lines[i]); i--) block.unshift(lines[i].replace(/^\s*\/\/\s?/, ""));
  return block;
}

function headerComment(lines) {
  const block = [];
  for (const line of lines) {
    if (/^\s*(\/\/|\/\*|\*)/.test(line) || !line.trim()) block.push(line.replace(/^\s*(\/\/|\/\*+|\*\/?)\s?/, ""));
    else break;
  }
  return block;
}

// Returns { basis, files } for the comment lines: the tags found and the
// files named after each Firefox tag.
function readBasis(commentLines) {
  const tags = new Set();
  const files = [];
  let current = null;
  for (const line of commentLines) {
    const m = line.match(TAG);
    if (m) {
      current = m[1];
      tags.add(current);
      if (current === "Firefox") files.push(...(m[2].match(FILE) || []));
    } else if (current === "Firefox") {
      files.push(...(line.match(FILE) || []));
    }
  }
  return { tags, files };
}

// source: file text. Returns failure messages.
export function checkSource(name, source, { fileExists = null } = {}) {
  const lines = source.split("\n");
  const failures = [];
  const header = readBasis(headerComment(lines));
  const describes = [];
  lines.forEach((line, i) => {
    const indent = line.match(/^\s*/)[0].length;
    const close = line.match(/^(\s*)\}\);?\s*$/);
    if (close) {
      while (describes.length && describes[describes.length - 1].indent >= close[1].length) describes.pop();
    }
    if (/^\s*describe\(/.test(line)) {
      describes.push({ indent, basis: readBasis(leadingComment(lines, i)) });
      return;
    }
    if (!/^\s*(it|test)\(/.test(line)) return;
    const where = `${name}:${i + 1}`;
    const sources = [readBasis(leadingComment(lines, i)), ...describes.map((d) => d.basis).reverse(), header];
    const tags = sources.flatMap((s) => [...s.tags]);
    if (!tags.length) {
      failures.push(
        `${where}: this test names no basis. Add a comment above it starting with "// Firefox: <file>", "// TypeScript: <fact>", "// Packaging: <fact>" or "// Tooling: <reason>". If it only checks what the generator happens to print, delete it or rewrite it against a Firefox fact.`
      );
      return;
    }
    const cited = sources.filter((s) => s.tags.has("Firefox"));
    if (tags.every((t) => t === "Firefox") && !cited.some((s) => s.files.length)) {
      failures.push(`${where}: the "Firefox:" basis names no file. Name the schema or implementation file it rests on, for example Schemas.sys.mjs.`);
    }
  });
  const cites = new Set(
    [header, ...lines.map((_, i) => null)].filter(Boolean).flatMap((s) => s.files)
  );
  lines.forEach((line, i) => {
    if (/^\s*describe\(|^\s*(it|test)\(/.test(line)) readBasis(leadingComment(lines, i)).files.forEach((f) => cites.add(f));
  });
  if (fileExists) {
    for (const file of cites) {
      if (!fileExists(file)) {
        failures.push(
          `${name}: cites ${file}, which is not in the Firefox checkout. Fix the file name or cite the file that holds the behavior now.`
        );
      }
    }
  }
  return failures;
}

export function listTestFiles(root) {
  const out = [];
  for (const dir of ["test", "verification/test"]) {
    for (const f of fs.readdirSync(path.join(root, dir)).sort()) {
      if (f.endsWith(".test.js")) out.push(path.join(dir, f));
    }
  }
  return out;
}
