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
import { checkEvidence } from "../verification/src/independent-schema-loader.js";

const PROJ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

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

export function verifyOverrides(firefoxRoot, mod = defaultOverrides) {
  return [...checkEvidenceCoverage(mod), ...checkRuleCode(mod), ...checkEvidence(firefoxRoot, evidenceEntries(mod))];
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
  console.log(`PASS: ${anchors} evidence anchors found in Firefox.`);
}
