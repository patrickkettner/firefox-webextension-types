#!/usr/bin/env node
/**
 * Checks the hand-written tables in src/overrides.js against the Firefox
 * checkout, given as --firefox-source <path> or TOPSRCDIR, and the return
 * types in dist/ against the result tables. Exits 1 and prints one line per
 * problem, each saying what to change.
 */

import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { resolveFirefoxPath } from "../src/firefox-root.js";
import * as defaultOverrides from "../src/overrides.js";
import { loadIndependentSchemaUniverse } from "../verification/src/independent-schema-loader.js";
import { EXCLUDED_NAMESPACES as VERIFIER_EXCLUDED } from "../verification/src/declared-differences.js";

const PROJ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const NO_PAYLOAD_CATEGORIES = new Set(["none", "incidental", "indeterminate"]);
const ASYNC_FLAGS = new Set([true, "callback", "responseCallback"]);

// Every export of overrides.js except the evidence itself is a table.
function tablesOf(mod) {
  return Object.entries(mod).filter(([name]) => name !== "EVIDENCE");
}

export function tableKeys(value) {
  if (value instanceof Set) return [...value];
  if (value && typeof value === "object") return Object.keys(value);
  return [];
}

const asList = (evidence) => (Array.isArray(evidence) ? evidence : [evidence]);

// Every key of every table has evidence and every piece of evidence has a key.
export function checkEvidenceCoverage(mod) {
  const failures = [];
  const evidence = mod.EVIDENCE || {};
  for (const [name, table] of tablesOf(mod)) {
    const keys = tableKeys(table);
    const have = evidence[name];
    if (!have) {
      failures.push(
        `${name} has no EVIDENCE.${name} in src/overrides.js. Add one { file, anchor } per key, naming the Firefox code that produces the value.`
      );
      continue;
    }
    for (const key of keys) {
      const list = key in have ? asList(have[key]) : [];
      if (!list.length) {
        failures.push(
          `${name}.${key} has no evidence. Add EVIDENCE.${name}[${JSON.stringify(key)}] with the Firefox file and the line of code that backs this entry.`
        );
      }
      for (const item of list) {
        if (!item || typeof item.file !== "string" || typeof item.anchor !== "string" || !item.anchor.trim()) {
          failures.push(`EVIDENCE.${name}[${JSON.stringify(key)}] needs { file, anchor } with a non-empty anchor.`);
        }
      }
    }
    for (const key of Object.keys(have)) {
      if (!keys.includes(key)) {
        failures.push(
          `EVIDENCE.${name}[${JSON.stringify(key)}] has no matching entry in ${name}. Delete the evidence, or restore the entry if it was removed by mistake.`
        );
      }
    }
  }
  for (const name of Object.keys(evidence)) {
    if (!tablesOf(mod).some(([table]) => table === name)) {
      failures.push(`EVIDENCE.${name} names a table that is not exported from src/overrides.js. Delete it or export the table.`);
    }
  }
  return failures;
}

const collapseSpace = (s) => s.replace(/\s+/g, " ").trim();

// Each entry is { label, file, anchor }. The anchor is code or text that
// produces the behavior a hand-written entry copies, matched with runs of
// whitespace collapsed so it can span lines. Returns one message per entry
// that Firefox no longer backs.
export function checkEvidence(firefoxRoot, entries) {
  const failures = [];
  const cache = new Map();
  for (const { label, file, anchor } of entries) {
    const full = path.join(firefoxRoot, file);
    if (!cache.has(full)) {
      cache.set(full, fs.existsSync(full) ? collapseSpace(fs.readFileSync(full, "utf8")) : null);
    }
    const text = cache.get(full);
    if (text === null) {
      failures.push(
        `${label}: ${file} does not exist in this Firefox checkout. Find where Firefox implements this now, then update the file and anchor in src/overrides.js, or delete the entry if the behavior is gone.`
      );
    } else if (!text.includes(collapseSpace(anchor))) {
      failures.push(
        `${label}: ${file} no longer contains ${JSON.stringify(anchor)}. Read that file, check the entry still matches what Firefox does, then update the anchor in src/overrides.js (or fix the entry if it no longer holds).`
      );
    }
  }
  return failures;
}

export function evidenceEntries(mod) {
  const entries = [];
  for (const [name, byKey] of Object.entries(mod.EVIDENCE || {})) {
    for (const [key, evidence] of Object.entries(byKey)) {
      for (const { file, anchor } of asList(evidence)) {
        if (typeof file === "string" && typeof anchor === "string") {
          entries.push({ label: `${name}.${key}`, file, anchor });
        }
      }
    }
  }
  return entries;
}

// HAND_COPIED_RULES say where in src/ the copy lives. A rule whose code is
// gone no longer needs its evidence.
export function checkRuleCode(mod, projRoot = PROJ) {
  const failures = [];
  for (const [rule, { code, symbol }] of Object.entries(mod.HAND_COPIED_RULES || {})) {
    const full = path.join(projRoot, code);
    if (!fs.existsSync(full) || !fs.readFileSync(full, "utf8").includes(symbol)) {
      failures.push(
        `HAND_COPIED_RULES[${JSON.stringify(rule)}] points at ${JSON.stringify(symbol)} in ${code}, which is gone. Update the pointer if the code moved, or delete the rule and its evidence.`
      );
    }
  }
  return failures;
}

function walk(node, visit) {
  if (Array.isArray(node)) {
    for (const item of node) walk(item, visit);
  } else if (node && typeof node === "object") {
    visit(node);
    for (const value of Object.values(node)) walk(value, visit);
  }
}

const isBareObject = (p) =>
  p.type === "object" && !p.properties && !p.$ref && !p.isInstanceOf && !p.additionalProperties && !p.patternProperties;

// What the schemas contain that a table exists for. Read from the raw schema
// JSON with the clean-room loader, not through the generator.
export function schemaFacts(universes) {
  const facts = {
    asyncNoPayload: new Set(),
    optionalPayload: new Set(),
    optionalReturns: new Set(),
    isInstanceOf: new Set(),
    refs: new Set(),
    eventsWithReturns: new Set(),
    bareEventParams: new Set(),
    optionalEventParams: new Set(),
    functions: new Set(),
    events: new Set(),
    types: new Set(),
    resultProperties: new Set(),
    properties: new Set(),
    excluded: new Set(),
  };
  for (const universe of universes) {
    for (const name of universe.excluded) facts.excluded.add(name);
    for (const [nsName, ns] of universe.namespaces) {
      const functions = [...ns.functions.values()].map((f) => [null, f]);
      const events = [...ns.events.values()].map((e) => [null, e]);
      for (const type of ns.types.values()) {
        facts.types.add(`${nsName}.${type.id}`);
        for (const name of Object.keys(type.properties || {})) facts.resultProperties.add(`${nsName}.${type.id}.${name}`);
        for (const f of type.functions || []) functions.push([type.id, f]);
        for (const e of type.events || []) events.push([type.id, e]);
      }
      for (const name of ns.properties.keys()) facts.properties.add(`${nsName}.${name}`);
      const keyOf = (owner, member) => [nsName, owner, member.name].filter(Boolean).join(".");
      walk([...ns.types.values(), ...ns.functions.values(), ...ns.events.values(), ...ns.properties.values()], (node) => {
        if (typeof node.isInstanceOf === "string") facts.isInstanceOf.add(node.isInstanceOf);
        if (typeof node.$ref === "string") facts.refs.add(node.$ref);
      });
      for (const [owner, fn] of functions) {
        const key = keyOf(owner, fn);
        facts.functions.add(key);
        if (fn.unsupported) continue;
        if (!ASYNC_FLAGS.has(fn.async)) {
          if (fn.returns?.optional) facts.optionalReturns.add(key);
          continue;
        }
        const params = fn.parameters || [];
        let cb = params.findIndex((p) => p.name === "callback" || p.name === "responseCallback");
        if (cb < 0 && params.length && params[params.length - 1].type === "function") cb = params.length - 1;
        const cbArgs = cb >= 0 ? params[cb].parameters || [] : [];
        if (cbArgs.length === 0 && !fn.returns) facts.asyncNoPayload.add(key);
        if (cbArgs.length === 1 && cbArgs[0].optional) facts.optionalPayload.add(key);
        if (cbArgs.length === 1) {
          for (const name of Object.keys(cbArgs[0].properties || {})) facts.resultProperties.add(`${key}.${name}`);
        }
      }
      for (const [owner, ev] of events) {
        const key = keyOf(owner, ev);
        facts.events.add(key);
        if (ev.unsupported) continue;
        if (ev.returns) facts.eventsWithReturns.add(key);
        for (const p of ev.parameters || []) {
          if (isBareObject(p) || (p.type === "function" && !(p.parameters || []).length && !p.returns)) {
            facts.bareEventParams.add(`${key}:${p.name}`);
          }
          if (p.optional) facts.optionalEventParams.add(`${key}:${p.name}`);
        }
      }
    }
  }
  return facts;
}

function compareSets(label, expected, actual, { missing, extra }) {
  const failures = [];
  for (const item of [...expected].sort()) {
    if (!actual.has(item)) failures.push(`${item}: ${missing(item)}`);
  }
  for (const item of [...actual].sort()) {
    if (!expected.has(item)) failures.push(`${item}: ${extra(item)}`);
  }
  return failures.map((f) => `${label} ${f}`);
}

const pairs = (table) =>
  new Set(Object.entries(table).flatMap(([event, names]) => (Array.isArray(names) ? names : Object.keys(names)).map((n) => `${event}:${n}`)));

// A table must have an entry for every schema construct it exists for, and
// no entry for a construct the schema no longer has.
export function checkCompleteness(mod, facts) {
  const failures = [];
  const asyncResults = new Set(Object.keys(mod.ASYNC_RESULTS));
  const noPayload = new Set(Object.keys(mod.ASYNC_NO_PAYLOAD));

  for (const key of asyncResults) {
    if (noPayload.has(key)) {
      failures.push(`${key} is in both ASYNC_RESULTS and ASYNC_NO_PAYLOAD. Keep it in ASYNC_RESULTS if it resolves a documented value, otherwise in ASYNC_NO_PAYLOAD.`);
    }
  }
  for (const [key, category] of Object.entries(mod.ASYNC_NO_PAYLOAD)) {
    if (!NO_PAYLOAD_CATEGORIES.has(category)) {
      failures.push(`ASYNC_NO_PAYLOAD ${key} has category ${JSON.stringify(category)}. Use one of: ${[...NO_PAYLOAD_CATEGORIES].join(", ")}.`);
    }
  }
  failures.push(
    ...compareSets("async function", facts.asyncNoPayload, new Set([...asyncResults, ...noPayload]), {
      missing: () =>
        "the schema declares it async with no callback payload and no `returns`, and neither ASYNC_RESULTS nor ASYNC_NO_PAYLOAD has it. Read its implementation in Firefox. Add it to ASYNC_RESULTS with the type it resolves, or to ASYNC_NO_PAYLOAD as none, incidental or indeterminate, and add an EVIDENCE anchor either way.",
      extra: () =>
        "is in ASYNC_RESULTS or ASYNC_NO_PAYLOAD but the schema no longer declares it async without a result type. Firefox removed it or gave it a result type. Delete the entry and its evidence.",
    })
  );

  const optionalResults = [mod.NULL_RESULTS, mod.REQUIRED_RESULTS, mod.OPTIONAL_RESULT_UNDEFINED];
  const classified = new Map();
  for (const table of optionalResults) {
    for (const key of tableKeys(table)) classified.set(key, (classified.get(key) || 0) + 1);
  }
  for (const [key, count] of classified) {
    if (count > 1) failures.push(`${key} is in more than one of NULL_RESULTS, REQUIRED_RESULTS and OPTIONAL_RESULT_UNDEFINED. Keep the one that matches Firefox.`);
  }
  failures.push(
    ...compareSets("optional result", new Set([...facts.optionalPayload, ...facts.optionalReturns]), new Set(classified.keys()), {
      missing: () =>
        "the schema makes the callback payload or return value optional and no table says what Firefox hands back. Read its implementation, then add it to NULL_RESULTS (null), REQUIRED_RESULTS (always a value) or OPTIONAL_RESULT_UNDEFINED, with an EVIDENCE anchor.",
      extra: () =>
        "is classified but its callback payload or return value is no longer optional in the schema. Delete the entry and its evidence.",
    })
  );

  failures.push(
    ...compareSets("platform type", facts.isInstanceOf, new Set(Object.keys(mod.PLATFORM_TYPES)), {
      missing: (name) =>
        `a schema uses isInstanceOf ${JSON.stringify(name)} and PLATFORM_TYPES has no mapping. Add the TypeScript type for it with an EVIDENCE anchor in the schema that uses it.`,
      extra: () =>
        "is in PLATFORM_TYPES but no emitted schema uses it as isInstanceOf. Delete the entry and its evidence.",
    })
  );

  failures.push(
    ...compareSets("event listener Promise", facts.eventsWithReturns, new Set(Object.keys(mod.EVENT_LISTENER_PROMISES)), {
      missing: () =>
        "the schema gives this event a `returns` and EVENT_LISTENER_PROMISES has no entry. Read how Firefox treats a Promise from the listener and add it with an EVIDENCE anchor.",
      extra: () => "is in EVENT_LISTENER_PROMISES but the schema event has no `returns`. Delete the entry and its evidence.",
    })
  );

  failures.push(
    ...compareSets("bare event parameter", facts.bareEventParams, new Set([...pairs(mod.EVENT_PARAMETERS), ...pairs(mod.OPEN_EVENT_PARAMETERS)]), {
      missing: () =>
        "the schema leaves this event parameter as a bare object or function. Read what Firefox passes, then give it a type in EVENT_PARAMETERS, or list it in OPEN_EVENT_PARAMETERS when the shape is documented outside the schema, with an EVIDENCE anchor.",
      extra: () => "is typed in EVENT_PARAMETERS or OPEN_EVENT_PARAMETERS but the schema no longer leaves it bare. Delete the entry and its evidence.",
    })
  );

  failures.push(
    ...compareSets("optional event parameter", facts.optionalEventParams, new Set([...pairs(mod.REQUIRED_EVENT_PARAMETERS), ...pairs(mod.OPTIONAL_EVENT_PARAMETERS)]), {
      missing: () =>
        "the schema marks this event parameter optional. Read how Firefox fires the event, then list it in REQUIRED_EVENT_PARAMETERS (always passed) or OPTIONAL_EVENT_PARAMETERS (sometimes missing), with an EVIDENCE anchor.",
      extra: () => "is listed but the schema no longer marks it optional. Delete the entry and its evidence.",
    })
  );

  for (const ref of Object.keys(mod.REF_TYPES)) {
    if (!facts.refs.has(ref)) {
      failures.push(
        `REF_TYPES ${ref}: no schema uses this $ref any more. Firefox fixed or removed it. Delete the entry and its evidence.`
      );
    }
  }

  const missingMembers = (label, keys, known) =>
    [...keys].filter((k) => !known.has(k)).map((k) => `${label} ${k}: not in the Firefox schemas any more. Firefox renamed or removed it. Update or delete the entry and its evidence.`);
  failures.push(...missingMembers("FUNCTION_OVERRIDES", Object.keys(mod.FUNCTION_OVERRIDES), facts.functions));
  failures.push(...missingMembers("TYPE_OVERRIDES", Object.keys(mod.TYPE_OVERRIDES), facts.types));
  failures.push(...missingMembers("NORMALIZED_FILLS", tableKeys(mod.NORMALIZED_FILLS), facts.types));
  failures.push(...missingMembers("NULL_PROPERTIES", tableKeys(mod.NULL_PROPERTIES), facts.properties));
  failures.push(...missingMembers("NULL_RESULT_PROPERTIES", tableKeys(mod.NULL_RESULT_PROPERTIES), facts.resultProperties));
  failures.push(...missingMembers("OPEN_OBJECTS", tableKeys(mod.OPEN_OBJECTS), facts.resultProperties));

  for (const name of tableKeys(mod.EXCLUDED_NAMESPACES)) {
    if (!facts.excluded.has(name)) {
      failures.push(`EXCLUDED_NAMESPACES ${name}: no schema declares this namespace any more. Delete the entry and its evidence.`);
    }
    if (!Object.hasOwn(VERIFIER_EXCLUDED, name)) {
      failures.push(
        `EXCLUDED_NAMESPACES ${name}: src/overrides.js leaves this namespace out of dist/, but ` +
          `verification/src/declared-differences.js does not list it, so npm run verify expects it declared. ` +
          `If Firefox really hides it from extensions, add it there too with the Firefox file that shows it.`
      );
    }
  }
  for (const name of Object.keys(VERIFIER_EXCLUDED)) {
    if (!tableKeys(mod.EXCLUDED_NAMESPACES).includes(name)) {
      failures.push(
        `EXCLUDED_NAMESPACES ${name}: verification/src/declared-differences.js lists this namespace as left out, ` +
          `but src/overrides.js does not leave it out. Remove it from one of the two.`
      );
    }
  }
  return failures;
}

// The return type of every function an emitted declaration file declares,
// keyed like the tables, one entry per overload. Each entry has the type's
// text and which of null, undefined, any and unknown are members of its
// top-level union.
export function emittedReturns(text) {
  const ts = createRequire(import.meta.url)("typescript-api");
  const source = ts.createSourceFile("emitted.d.ts", text, ts.ScriptTarget.Latest, false);
  const returns = new Map();
  const members = (node) => {
    if (ts.isParenthesizedTypeNode(node)) return members(node.type);
    if (ts.isUnionTypeNode(node)) return node.types.flatMap(members);
    if (ts.isLiteralTypeNode(node) && node.literal.kind === ts.SyntaxKind.NullKeyword) return ["null"];
    const keyword = {
      [ts.SyntaxKind.UndefinedKeyword]: "undefined",
      [ts.SyntaxKind.AnyKeyword]: "any",
      [ts.SyntaxKind.UnknownKeyword]: "unknown",
    }[node.kind];
    return keyword ? [keyword] : [];
  };
  const add = (key, type) => {
    if (!type) return;
    const list = returns.get(key) || [];
    list.push({ text: type.getText(source), members: new Set(members(type)) });
    returns.set(key, list);
  };
  const visit = (statements, owner) => {
    for (const node of statements) {
      if (ts.isModuleDeclaration(node) && node.body && ts.isModuleBlock(node.body)) {
        const name = node.name.text;
        if (owner) visit(node.body.statements, [...owner, name]);
        else if (name === "browser") visit(node.body.statements, []);
      } else if (owner && ts.isFunctionDeclaration(node) && node.name) {
        add([...owner, node.name.text].join("."), node.type);
      } else if (owner && ts.isInterfaceDeclaration(node)) {
        for (const member of node.members) {
          if (ts.isMethodSignature(member) && member.name && ts.isIdentifier(member.name)) {
            add([...owner, node.name.text, member.name.text].join("."), member.type);
          }
        }
      }
    }
  };
  visit(source.statements, null);
  return returns;
}

// A function whose schema return value is optional has to return the null
// or undefined its result table names, in every declaration the build
// emits. A REQUIRED_RESULTS entry says Firefox always returns a value.
export function checkOptionalReturns(mod, facts, returns) {
  const failures = [];
  for (const key of [...facts.optionalReturns].sort()) {
    const table = ["NULL_RESULTS", "OPTIONAL_RESULT_UNDEFINED", "REQUIRED_RESULTS"].find((name) => tableKeys(mod[name]).includes(key));
    if (!table) continue;
    const wants = { NULL_RESULTS: "null", OPTIONAL_RESULT_UNDEFINED: "undefined" }[table];
    const declared = returns.get(key) || [];
    if (!declared.length) {
      failures.push(`optional return ${key}: dist/ declares no function by this name. Run npm run build, then check why the emitter leaves it out.`);
    }
    for (const { text, members } of declared) {
      const open = members.has("any") || members.has("unknown");
      if (wants && !open && !members.has(wants)) {
        failures.push(
          `optional return ${key}: ${table} says Firefox returns ${wants}, but dist/ declares it returning ${text}. Make the emitter add ${wants} to the return type, then run npm run build.`
        );
      } else if (!wants && (members.has("null") || members.has("undefined"))) {
        failures.push(
          `optional return ${key}: ${table} says Firefox always returns a value, but dist/ declares it returning ${text}. Make the emitter drop null and undefined from the return type, then run npm run build.`
        );
      }
    }
  }
  return [...new Set(failures)];
}

export function verifyOverrides(firefoxRoot, mod = defaultOverrides, universes = null) {
  const failures = [...checkEvidenceCoverage(mod), ...checkRuleCode(mod)];
  failures.push(...checkEvidence(firefoxRoot, evidenceEntries(mod)));
  const loaded =
    universes ||
    ["desktop", "mobile"].map((target) => loadIndependentSchemaUniverse(firefoxRoot, target, tableKeys(mod.EXCLUDED_NAMESPACES)));
  const facts = schemaFacts(loaded);
  failures.push(...checkCompleteness(mod, facts));
  const returns = new Map();
  for (const file of ["firefox-desktop.d.ts", "firefox-mobile.d.ts"]) {
    for (const [key, list] of emittedReturns(fs.readFileSync(path.join(PROJ, "dist", file), "utf8"))) {
      returns.set(key, [...(returns.get(key) || []), ...list]);
    }
  }
  failures.push(...checkOptionalReturns(mod, facts, returns));
  return failures;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { values } = parseArgs({
    options: { "firefox-source": { type: "string" } },
    strict: false,
  });
  const failures = verifyOverrides(resolveFirefoxPath(values["firefox-source"]));
  if (failures.length) {
    console.log(`FAIL: src/overrides.js or dist/ disagrees with Firefox in ${failures.length} places:`);
    for (const f of failures) console.log(`  [X] ${f}`);
    process.exit(1);
  }
  const anchors = evidenceEntries(defaultOverrides).length;
  console.log(`PASS: ${anchors} evidence anchors found in Firefox and every table complete against the schemas and dist/.`);
}
