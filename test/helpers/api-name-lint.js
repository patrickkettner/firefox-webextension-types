// Finds string literals the generator compares against. An API name, such as
// a namespace, function or type, belongs in src/overrides.js with Firefox
// evidence. Everything else a comparison may use is on the allow list in
// test/api-name-lint.test.js, with the reason.

const QUOTED = String.raw`(["'\`])((?:\\.|(?!\1).)*)\1`;
const PATTERNS = [
  new RegExp(String.raw`(?:===|!==|==|!=)\s*${QUOTED}`, "g"),
  new RegExp(String.raw`${QUOTED}\s*(?:===|!==|==|!=)`, "g"),
  new RegExp(String.raw`\.(?:includes|startsWith|endsWith|indexOf|lastIndexOf|has)\(\s*${QUOTED}`, "g"),
  new RegExp(String.raw`\bcase\s+${QUOTED}\s*:`, "g"),
];
const LITERAL_ARRAY = /\[((?:\s*(["'`])(?:\\.|(?!\2).)*\2\s*,?)+)\]\s*\.(?:includes|indexOf)\(/g;
const LITERAL = /(["'`])((?:\\.|(?!\1).)*)\1/g;

// Replaces comments with spaces so a quoted word in a comment is not a hit.
function stripComments(source) {
  const out = [];
  let inBlock = false;
  for (const raw of source.split("\n")) {
    let line = "";
    let quote = null;
    for (let i = 0; i < raw.length; i++) {
      const c = raw[i];
      if (inBlock) {
        if (c === "*" && raw[i + 1] === "/") {
          inBlock = false;
          i++;
        }
        continue;
      }
      if (quote) {
        line += c;
        if (c === "\\") line += raw[++i] ?? "";
        else if (c === quote) quote = null;
        continue;
      }
      if (c === '"' || c === "'" || c === "`") {
        quote = c;
        line += c;
      } else if (c === "/" && raw[i + 1] === "*") {
        inBlock = true;
        i++;
      } else if (c === "/" && raw[i + 1] === "/" && (i === 0 || /\s/.test(raw[i - 1]))) {
        break;
      } else {
        line += c;
      }
    }
    out.push(line);
  }
  return out;
}

export function findStringComparisons(source) {
  const hits = [];
  stripComments(source).forEach((line, i) => {
    const found = new Set();
    for (const pattern of PATTERNS) {
      for (const m of line.matchAll(pattern)) found.add(m[2]);
    }
    for (const m of line.matchAll(LITERAL_ARRAY)) {
      for (const lit of m[1].matchAll(LITERAL)) found.add(lit[2]);
    }
    for (const literal of found) {
      if (literal !== "") hits.push({ line: i + 1, literal });
    }
  });
  return hits;
}
