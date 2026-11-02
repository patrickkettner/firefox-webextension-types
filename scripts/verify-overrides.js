#!/usr/bin/env node
/**
 * verify-overrides.js - Checks the hand-written tables in src/overrides.js
 * against the Firefox checkout.
 *
 * Needs a Firefox checkout (--firefox-source <path> or TOPSRCDIR). Exits 1
 * and prints one line per problem, each saying what to change.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as defaultOverrides from "../src/overrides.js";
import {
  EXCLUDED_NAMESPACES as INDEPENDENT_EXCLUDED,
  checkEvidence,
  loadIndependentSchemaUniverse,
} from "../verification/src/independent-schema-loader.js";

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
    isInstanceOf: new Set(),
    refs: new Set(),
    eventsWithReturns: new Set(),
    bareEventParams: new Set(),
    optionalEventParams: new Set(),
    functions: new Set(),
    events: new Set(),
    types: new Set(),
    excluded: new Set(),
  };
  for (const universe of universes) {
    for (const name of universe.excluded) facts.excluded.add(name);
    for (const [nsName, ns] of universe.namespaces) {
      const functions = [...ns.functions.values()].map((f) => [null, f]);
      const events = [...ns.events.values()].map((e) => [null, e]);
      for (const type of ns.types.values()) {
        facts.types.add(`${nsName}.${type.id}`);
        for (const f of type.functions || []) functions.push([type.id, f]);
        for (const e of type.events || []) events.push([type.id, e]);
      }
      const keyOf = (owner, member) => [nsName, owner, member.name].filter(Boolean).join(".");
      walk([...ns.types.values(), ...ns.functions.values(), ...ns.events.values(), ...ns.properties.values()], (node) => {
        if (typeof node.isInstanceOf === "string") facts.isInstanceOf.add(node.isInstanceOf);
        if (typeof node.$ref === "string") facts.refs.add(node.$ref);
      });
      for (const [owner, fn] of functions) {
        const key = keyOf(owner, fn);
        facts.functions.add(key);
        if (fn.unsupported || !ASYNC_FLAGS.has(fn.async)) continue;
        const params = fn.parameters || [];
        let cb = params.findIndex((p) => p.name === "callback" || p.name === "responseCallback");
        if (cb < 0 && params.length && params[params.length - 1].type === "function") cb = params.length - 1;
        const cbArgs = cb >= 0 ? params[cb].parameters || [] : [];
        if (cbArgs.length === 0 && !fn.returns) facts.asyncNoPayload.add(key);
        if (cbArgs.length === 1 && cbArgs[0].optional) facts.optionalPayload.add(key);
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
    ...compareSets("optional result", facts.optionalPayload, new Set(classified.keys()), {
      missing: () =>
        "the schema makes the callback payload optional and no table says what Firefox resolves with. Read its implementation, then add it to NULL_RESULTS (resolves null), REQUIRED_RESULTS (always a value) or OPTIONAL_RESULT_UNDEFINED, with an EVIDENCE anchor.",
      extra: () =>
        "is classified but its callback payload is no longer optional in the schema. Delete the entry and its evidence.",
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

  const excludedInSrc = new Set(Object.keys(mod.EXCLUDED_NAMESPACES));
  for (const name of excludedInSrc) {
    if (!(name in INDEPENDENT_EXCLUDED)) {
      failures.push(`EXCLUDED_NAMESPACES ${name}: not in verification/src/independent-schema-loader.js EXCLUDED_NAMESPACES. Add it there too, with the same Firefox evidence.`);
    }
  }
  for (const name of Object.keys(INDEPENDENT_EXCLUDED)) {
    if (!excludedInSrc.has(name)) {
      failures.push(`EXCLUDED_NAMESPACES ${name}: only in verification/src/independent-schema-loader.js. Add it to src/overrides.js too, or delete it there.`);
    }
  }
  for (const name of excludedInSrc) {
    if (!facts.excluded.has(name)) {
      failures.push(`EXCLUDED_NAMESPACES ${name}: no schema declares this namespace any more. Delete the entry and its evidence.`);
    }
  }
  return failures;
}

export function verifyOverrides(firefoxRoot, mod = defaultOverrides, universes = null) {
  const failures = [...checkEvidenceCoverage(mod), ...checkRuleCode(mod)];
  failures.push(...checkEvidence(firefoxRoot, evidenceEntries(mod)));
  const loaded = universes || ["desktop", "mobile"].map((target) => loadIndependentSchemaUniverse(firefoxRoot, target));
  failures.push(...checkCompleteness(mod, schemaFacts(loaded)));
  return failures;
}

function firefoxRootFromArgs() {
  const args = process.argv.slice(2);
  const at = args.findIndex((a) => a === "--firefox-source" || a === "--topsrcdir");
  const root = at >= 0 ? args[at + 1] : process.env.TOPSRCDIR || process.env.MOZ_TOPSRCDIR || process.env.MOZILLA_CENTRAL;
  if (!root || !fs.existsSync(root)) {
    throw new Error("Firefox checkout not found. Pass --firefox-source <path> or set TOPSRCDIR.");
  }
  return path.resolve(root);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const failures = verifyOverrides(firefoxRootFromArgs());
  if (failures.length) {
    console.log(`FAIL: src/overrides.js disagrees with Firefox in ${failures.length} places:`);
    for (const f of failures) console.log(`  [X] ${f}`);
    process.exit(1);
  }
  const anchors = evidenceEntries(defaultOverrides).length;
  console.log(`PASS: ${anchors} evidence anchors found in Firefox and every table complete against the schemas.`);
}
