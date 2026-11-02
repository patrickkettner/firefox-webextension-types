import fs from "node:fs";
import path from "node:path";
import { SchemaRegistry, loadRawSchemaJson } from "../../src/schema-loader.js";

export function firefoxRootFromEnv() {
  return process.env.TOPSRCDIR || process.env.MOZ_TOPSRCDIR || process.env.MOZILLA_CENTRAL;
}

// Every string the emitter passes through renderDocText: schema `description`
// values and string-valued `deprecated` values.
export function collectDocStrings(firefoxRoot) {
  const registry = new SchemaRegistry(firefoxRoot);
  const found = [];
  const seen = new Set();
  const walk = (node, file) => {
    if (Array.isArray(node)) return node.forEach((x) => walk(x, file));
    if (!node || typeof node !== "object") return;
    for (const [key, value] of Object.entries(node)) {
      if ((key === "description" || key === "deprecated") && typeof value === "string") {
        found.push({ text: value, file });
      } else {
        walk(value, file);
      }
    }
  };
  for (const target of ["desktop", "mobile"]) {
    for (const schema of registry.getActiveSchemas(target)) {
      if (seen.has(schema.path)) continue;
      seen.add(schema.path);
      walk(loadRawSchemaJson(schema.path)[0], path.relative(firefoxRoot, schema.path));
    }
  }
  return found;
}

// A form is `$(kind:)`, `<tag>` (open and close tags share one entry, attributes
// are ignored) or an entity such as `&mdash;`. The first file and a snippet
// where each form occurs are kept so a failure can point at a real place.
export function inventoryOf(strings) {
  const forms = new Map();
  const add = (form, file, text, index) => {
    if (!forms.has(form)) {
      forms.set(form, { count: 0, file, snippet: text.slice(Math.max(0, index - 30), index + 50) });
    }
    forms.get(form).count++;
  };
  for (const { text, file } of strings) {
    for (const m of text.matchAll(/\$\(([A-Za-z]\w*):/g)) add(`$(${m[1]}:)`, file, text, m.index);
    for (const m of text.matchAll(/\$\((?![A-Za-z]\w*:)/g)) add("$( without a kind", file, text, m.index);
    for (const m of text.matchAll(/<\/?([A-Za-z][\w-]*)[^<>]*>/g)) add(`<${m[1].toLowerCase()}>`, file, text, m.index);
    for (const m of text.matchAll(/<(?![/A-Za-z])/g)) add("< not followed by a tag name", file, text, m.index);
    for (const m of text.matchAll(/&#?\w+;/g)) add(m[0], file, text, m.index);
  }
  return forms;
}

export function unknownForms(forms, handled) {
  return [...forms].filter(([form]) => !handled.has(form));
}

export function describeUnknown(unknown) {
  return unknown
    .map(
      ([form, info]) =>
        `${form} occurs ${info.count} time(s), first in ${info.file}: ...${JSON.stringify(info.snippet)}...\n` +
        `  Add it to HANDLED in test/markup-inventory.test.js together with the Markdown renderDocText in src/emitter.js should give it.`
    )
    .join("\n");
}
