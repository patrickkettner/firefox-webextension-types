/**
 * key-ledger.js - the ledger of schema keys and the checks that keep it true.
 *
 * schema-key-ledger.json lists every (context, key) pair that occurs in the
 * Firefox schemas the generator loads. Each is "consumed" (the generator reads
 * it and the output depends on it) or "declined" (deliberately ignored, with a
 * reason). "unresolved" is what npm run ledger:update writes for a pair nobody
 * has decided yet, and ledgerProblems fails on it. Contexts are defined in
 * schema-trace.js.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

import { buildDeclarations } from "./generate.js";
import { codePointCompare } from "./comparator.js";
import { pairKey, setAblation, splitPair, startTrace, stopTrace } from "./schema-trace.js";

export const LEDGER_PATH = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "schema-key-ledger.json");
export const STATUSES = ["consumed", "declined", "unresolved"];

const ABOUT =
  "Every key in the Firefox schemas, by context. consumed: the generator reads it and output depends on it. " +
  "declined: ignored on purpose, reason required, firefox names the Firefox file when the reason is Firefox behavior. " +
  "unresolved: a new or newly unread pair nobody has decided, npm test fails until it is consumed or declined. " +
  "Regenerate statuses with npm run ledger:update, check with npm test and npm run ablate.";

export function readLedger(file = LEDGER_PATH) {
  return JSON.parse(fs.readFileSync(file, "utf8")).entries;
}

export function writeLedger(entries, file = LEDGER_PATH) {
  const sorted = [...entries].sort((a, b) => codePointCompare(a.context, b.context) || codePointCompare(a.key, b.key));
  const lines = sorted.map((e) => "    " + JSON.stringify(e));
  const text = `{\n  "about": ${JSON.stringify(ABOUT)},\n  "entries": [\n${lines.join(",\n")}\n  ]\n}\n`;
  fs.writeFileSync(file, text, "utf8");
}

export function ledgerKey(e) {
  return pairKey(e.context, e.key);
}

function silentBuild(firefoxRoot, outDir) {
  const log = console.log;
  console.log = () => {};
  try {
    buildDeclarations(firefoxRoot, outDir, {});
  } finally {
    console.log = log;
  }
}

// provenance.json only echoes the hashes of the other files.
function snapshotOutputs(dir) {
  const out = {};
  for (const name of fs.readdirSync(dir).sort()) {
    if (name === "provenance.json") continue;
    const buf = fs.readFileSync(path.join(dir, name));
    out[name] = { sha256: crypto.createHash("sha256").update(buf).digest("hex"), size: buf.length };
  }
  return out;
}

/**
 * Builds once into a scratch directory.
 *
 * @param {string} firefoxRoot
 * @param {{trace?: boolean, ablate?: object | null}} [options]
 * @returns {{outputs: Record<string, {sha256: string, size: number}>, pairs: Map<string, {present: number, read: number}> | null}}
 */
export function buildOnce(firefoxRoot, { trace = false, ablate = null } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fwt-keyledger-"));
  let pairs = null;
  try {
    setAblation(ablate);
    if (trace) startTrace();
    try {
      silentBuild(firefoxRoot, dir);
    } finally {
      if (trace) pairs = stopTrace();
      setAblation(null);
    }
    return { outputs: snapshotOutputs(dir), pairs };
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

export function traceBuild(firefoxRoot, ablate = null) {
  return buildOnce(firefoxRoot, { trace: true, ablate }).pairs;
}

export function diffOutputs(base, cur) {
  const changed = [];
  let bytes = 0;
  for (const f of new Set([...Object.keys(base), ...Object.keys(cur)])) {
    if (base[f]?.sha256 === cur[f]?.sha256) continue;
    changed.push(f);
    bytes += Math.abs((cur[f]?.size ?? 0) - (base[f]?.size ?? 0));
  }
  return { changed, bytes };
}

/**
 * Problems between a trace and the ledger, each with the pair and what to do.
 * An unresolved entry is always a problem.
 *
 * @param {Map<string, {present: number, read: number}>} pairs
 * @param {Array<object>} entries
 * @param {{firefoxRoot?: string}} [options]
 * @returns {string[]}
 */
export function ledgerProblems(pairs, entries, { firefoxRoot } = {}) {
  const problems = [];
  const byKey = new Map(entries.map((e) => [ledgerKey(e), e]));
  const name = (e) => `key "${e.key}" in context "${e.context}"`;
  const regen = 'Run "npm run ledger:update" to refresh statuses, then review the diff of schema-key-ledger.json.';

  for (const [pair, c] of pairs) {
    const { context, key } = splitPair(pair);
    const e = byKey.get(pair);
    if (!e) {
      problems.push(
        `${name({ key, context })} is in the Firefox schemas but not in schema-key-ledger.json. ` +
          `Either make src/emitter.js use it so the output changes, or decline it. ${regen} ` +
          `A new pair the generator does not read is added as unresolved with an empty reason: write the reason, ` +
          `or change the status to declined with a reason and, for Firefox behavior, the Firefox file in "firefox".`
      );
    } else if (e.status === "consumed" && c.read === 0) {
      problems.push(
        `${name(e)} is marked consumed but the generator no longer reads it. ` +
          `Restore the read in src/, or if dropping it is intended change the status to declined and give the reason. ${regen}`
      );
    } else if (e.status === "declined" && c.read > 0) {
      problems.push(
        `${name(e)} is marked declined ("${e.reason}") but the generator now reads it. ` +
          `If the output depends on it, change the status to consumed and delete the reason (npm run ledger:update does this). ` +
          `If the read is accidental, remove it.`
      );
    }
  }

  for (const e of entries) {
    if (!STATUSES.includes(e.status)) {
      problems.push(`${name(e)} has status "${e.status}". Use one of ${STATUSES.join(", ")}.`);
      continue;
    }
    if (!pairs.has(ledgerKey(e))) {
      problems.push(
        `${name(e)} is in schema-key-ledger.json but no loaded schema has it. Delete the entry (npm run ledger:update does this).`
      );
    }
    if (e.status === "unresolved") {
      problems.push(
        `${name(e)} is unresolved${e.reason ? ` ("${e.reason}")` : ""}. Decide it in schema-key-ledger.json. ` +
          `If the output should depend on it, make src/emitter.js use it and run npm run ledger:update. ` +
          `Otherwise set the status to declined with a one-line "reason" and, when the reason is Firefox behavior, ` +
          `the Firefox file in "firefox". Check the Firefox source (toolkit/components/extensions/Schemas.sys.mjs) before declining.`
      );
    } else if (e.status === "declined" && !String(e.reason ?? "").trim()) {
      problems.push(`${name(e)} is declined with no reason. Add a one-line "reason" to its entry in schema-key-ledger.json.`);
    }
    if (e.firefox && firefoxRoot && !fs.existsSync(path.join(firefoxRoot, e.firefox))) {
      problems.push(`${name(e)} cites ${e.firefox}, which does not exist under ${firefoxRoot}. Fix the "firefox" path.`);
    }
  }
  return problems;
}

/**
 * New entry list from a trace. Statuses follow the reads. Declined and
 * unresolved entries keep their text while the pair stays unread. Nothing is
 * ever declined here: a pair that is new or newly unread becomes unresolved
 * and needs a person.
 *
 * @returns {{entries: object[], changes: string[]}}
 */
export function updateLedger(pairs, entries) {
  const old = new Map(entries.map((e) => [ledgerKey(e), e]));
  const out = [];
  const changes = [];
  for (const [pair, c] of pairs) {
    const { context, key } = splitPair(pair);
    const prev = old.get(pair);
    const label = `${context} / ${key}`;
    if (c.read > 0) {
      out.push({ context, key, status: "consumed" });
      if (!prev) changes.push(`new, consumed: ${label}`);
      else if (prev.status !== "consumed") changes.push(`${prev.status} -> consumed: ${label}`);
    } else if (prev && prev.status !== "consumed") {
      out.push(prev);
    } else {
      out.push({ context, key, status: "unresolved", reason: prev ? "no longer read by the generator, was consumed" : "" });
      changes.push(prev ? `consumed -> unresolved (no longer read): ${label}` : `new, unresolved (not read): ${label}`);
    }
  }
  for (const [pair, e] of old) {
    if (!pairs.has(pair)) changes.push(`removed, no schema has it: ${e.context} / ${e.key}`);
  }
  return { entries: out, changes };
}

/**
 * What a sweep result means for an entry, or null when it is as expected.
 *
 * @param {object} entry
 * @param {{changed: string[], bytes: number, threw?: string}} result
 */
export function sweepFailure(entry, result) {
  const effect = Boolean(result.threw) || result.changed.length > 0;
  const name = `key "${entry.key}" in context "${entry.context}"`;
  if (entry.status === "consumed" && !effect) {
    return (
      `${name} is consumed but deleting it from the schemas changes no output byte. ` +
      `The generator reads it and ignores the result. Make the output depend on it, or stop reading it and ` +
      `mark the entry declined with a reason.`
    );
  }
  if (entry.status === "declined" && effect) {
    return (
      `${name} is declined ("${entry.reason}") but deleting it changes the output` +
      `${result.threw ? ` (the generator throws: ${result.threw})` : ` (${result.changed.length} files, ${result.bytes} bytes)`}. ` +
      `Read tracing missed a use of it. Find the read, then mark the entry consumed.`
    );
  }
  if (entry.status === "unresolved" && effect) {
    return `${name} is unresolved and unread by the trace, yet deleting it changes the output. Read tracing missed a use of it.`;
  }
  return null;
}

/**
 * Deletes each entry's key from its context, rebuilds, and compares with the
 * unablated build. One build at a time.
 *
 * @param {string} firefoxRoot
 * @param {object[]} entries - ledger entries to try.
 * @param {(entry: object, result: object, failure: string | null) => void} [onResult]
 */
export function runSweep(firefoxRoot, entries, onResult = () => {}) {
  const base = buildOnce(firefoxRoot).outputs;
  const failures = [];
  for (const entry of entries) {
    let result;
    try {
      const { outputs } = buildOnce(firefoxRoot, { ablate: { context: entry.context, key: entry.key } });
      result = diffOutputs(base, outputs);
    } catch (err) {
      result = { changed: [], bytes: 0, threw: String(err.message).slice(0, 160) };
    }
    const failure = sweepFailure(entry, result);
    if (failure) failures.push(failure);
    onResult(entry, result, failure);
  }
  return failures;
}
