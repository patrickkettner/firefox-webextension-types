// Finds Firefox API names written into the generator's code. An API name,
// such as a namespace, function or type, belongs in src/overrides.js with
// Firefox evidence. The few the generator may use are on the allow list in
// test/api-name-lint.test.js, with the reason.
//
// The names come from the schemas of a Firefox checkout. The tokens come from
// acorn, so a name is found however the code spells it: a string, a template,
// a regular expression, or the key of an object literal. Comments are not
// tokens.

import * as acorn from "acorn";
import { SchemaRegistry, loadRawSchemaJson } from "../../src/schema-loader.js";

const IDENTIFIER = /^[A-Za-z_$][\w$]*$/;

/**
 * Namespace segments, type ids, function, event and property names, and the
 * functions and events of a type, from every schema the generator loads.
 *
 * @returns {Set<string>}
 */
export function apiNames(firefoxRoot) {
  const registry = new SchemaRegistry(firefoxRoot);
  const paths = new Set();
  for (const target of ["desktop", "mobile"]) {
    for (const schema of registry.getActiveSchemas(target)) paths.add(schema.path);
  }
  const names = new Set();
  const add = (name) => {
    if (typeof name === "string") for (const segment of name.split(".")) names.add(segment);
  };
  for (const schemaPath of paths) {
    const [entries] = loadRawSchemaJson(schemaPath);
    for (const entry of entries) {
      add(entry.namespace);
      for (const type of entry.types || []) {
        add(type.id);
        for (const fn of type.functions || []) add(fn.name);
        for (const ev of type.events || []) add(ev.name);
      }
      for (const fn of entry.functions || []) add(fn.name);
      for (const ev of entry.events || []) add(ev.name);
      for (const name of Object.keys(entry.properties || {})) add(name);
    }
  }
  return names;
}

// The words of a regular expression: `/^tabs$/` names tabs. Escapes such as
// \b and \d are dropped first so they do not join a word.
function regexWords(pattern) {
  return pattern.replace(/\\./g, " ").split(/\W+/).filter((w) => w.length > 1);
}

/**
 * Every literal token in the source: string literals, the text pieces of a
 * template literal, the words of a regular expression and the keys of object
 * literals.
 *
 * @returns {Array<{line: number, literal: string, kind: string}>}
 */
export function literalTokens(source) {
  const ast = acorn.parse(source, { ecmaVersion: "latest", sourceType: "module", locations: true });
  const tokens = [];
  const push = (node, literal, kind) => {
    if (literal) tokens.push({ line: node.loc.start.line, literal, kind });
  };
  (function walk(node, parent) {
    if (!node || typeof node.type !== "string") return;
    if (node.type === "Literal") {
      if (typeof node.value === "string") push(node, node.value, "string");
      if (node.regex) for (const word of regexWords(node.regex.pattern)) push(node, word, "regex");
    } else if (node.type === "TemplateElement") {
      push(node, node.value.cooked, "template");
    } else if (node.type === "Property" && !node.computed && parent.type === "ObjectExpression") {
      push(node, node.key.type === "Identifier" ? node.key.name : String(node.key.value), "key");
    }
    for (const key of Object.keys(node)) {
      if (key === "loc") continue;
      const child = node[key];
      if (Array.isArray(child)) child.forEach((c) => walk(c, node));
      else if (child && typeof child.type === "string") walk(child, node);
    }
  })(ast, null);
  return tokens;
}

/**
 * Tokens that name an API: a token that is an identifier, or a dotted path
 * of identifiers, with a segment in `names`.
 */
export function apiNameHits(source, names) {
  return literalTokens(source).filter(({ literal }) => {
    const segments = literal.split(".");
    return segments.every((s) => IDENTIFIER.test(s)) && segments.some((s) => names.has(s));
  });
}
