/**
 * The ledger of schema keys and the checks that keep it true.
 *
 * schema-key-ledger.json lists every (context, key) pair that occurs in the
 * Firefox schemas the generator loads. Each is "consumed" (the generator reads
 * it and the output depends on it) or "declined" (deliberately ignored, with a
 * reason). "unresolved" is what npm run ledger:update writes for a pair nobody
 * has decided yet, and ledgerProblems fails on it. Contexts are defined in
 * schema-trace.js.
 *
 * A consumed pair is read at every position that carries the key, except
 * those its "unread" groups name. A group gives a reason and either the
 * positions ("at") or a rule that picks them. A position is the schema file,
 * the namespace and the names leading to the object, as schema-trace.js
 * writes it. Positions in an excluded namespace are never read and need no
 * group. So a generator change that stops reading a key in one place fails,
 * even while the key is still read elsewhere in its context.
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

import { buildDeclarations } from "./generate.js";
import { codePointCompare } from "./comparator.js";
import { EXCLUDED_NAMESPACES } from "./overrides.js";
import { pairKey, setAblation, splitPair, startTrace, stopTrace } from "./schema-trace.js";

const LEDGER_PATH = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "schema-key-ledger.json");
export const STATUSES = ["consumed", "declined", "unresolved"];

// Rules an "unread" group can name instead of listing positions.
const UNREAD_RULES = {
  // The parameter a function's "async" names becomes the Promise, and the
  // callback overload always takes it.
  asyncCallback: (position) => position.role === "asyncCallback",
};

const ABOUT =
  "Every key in the Firefox schemas, by context. consumed: the generator reads it and output depends on it, " +
  "at every position that carries it except those an unread group names with a reason. " +
  "declined: ignored on purpose, reason required, firefox names the Firefox file when the reason is Firefox behavior. " +
  "unresolved: a new or newly unread pair nobody has decided, npm test fails until it is consumed or declined. " +
  "Regenerate statuses with npm run ledger:update, check with npm test and npm run ablate.";

export function readLedger(file = LEDGER_PATH) {
  return JSON.parse(fs.readFileSync(file, "utf8")).entries;
}

function formatEntry(e) {
  if (!e.unread) return "    " + JSON.stringify(e);
  const { unread, ...rest } = e;
  const groups = unread.map((g) => {
    const { at, ...head } = g;
    if (!at) return "      " + JSON.stringify(head);
    const lines = at.map((w) => "          " + JSON.stringify(w));
    return `      ${JSON.stringify(head).slice(0, -1)},"at":[\n${lines.join(",\n")}\n        ]}`;
  });
  return `    ${JSON.stringify(rest).slice(0, -1)},"unread":[\n${groups.join(",\n")}\n    ]}`;
}

export function writeLedger(entries, file = LEDGER_PATH) {
  const sorted = [...entries].sort((a, b) => codePointCompare(a.context, b.context) || codePointCompare(a.key, b.key));
  const lines = sorted.map(formatEntry);
  const text = `{\n  "about": ${JSON.stringify(ABOUT)},\n  "entries": [\n${lines.join(",\n")}\n  ]\n}\n`;
  fs.writeFileSync(file, text, "utf8");
}

function ledgerKey(e) {
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
 * @returns {{outputs: Record<string, {sha256: string, size: number}>, pairs: Map<string, {present: number, read: number, enumerated: number}> | null}}
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

// The unread positions of a traced pair that need a group: not in an
// excluded namespace.
function unreadPositions(c, excluded) {
  return (c.unread ?? []).filter((u) => !excluded.has(u.namespace));
}

function groupCovers(group, position) {
  if (group.rule) return Boolean(UNREAD_RULES[group.rule]?.(position));
  return (group.at ?? []).includes(position.where);
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
 * @param {Map<string, {present: number, read: number, enumerated: number, unread?: object[]}>} pairs
 * @param {Array<object>} entries
 * @param {{firefoxRoot?: string, excluded?: Set<string>}} [options] - excluded: namespaces whose positions need no unread group.
 * @returns {string[]}
 */
export function ledgerProblems(pairs, entries, { firefoxRoot, excluded = EXCLUDED_NAMESPACES } = {}) {
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
    } else if (e.status === "consumed") {
      problems.push(...unreadProblems(e, unreadPositions(c, excluded), name(e), regen));
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
    if (e.unread && e.status !== "consumed") {
      problems.push(`${name(e)} is ${e.status} and has unread groups, which only a consumed entry can have. Delete them.`);
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

function unreadProblems(e, positions, label, regen) {
  const problems = [];
  const groups = e.unread ?? [];
  for (const u of positions) {
    if (!groups.some((g) => groupCovers(g, u))) {
      problems.push(
        `${label} is not read at ${u.where}, and no unread group of its entry names that position. ` +
          `If the generator stopped reading it there, restore the read in src/. If it should stay unread, ` +
          `npm run ledger:update adds the position to a group with an empty reason. Write the reason. ${regen}`
      );
    }
  }
  groups.forEach((g, i) => {
    const where = `unread group ${i + 1} of ${label}`;
    if (!String(g.reason ?? "").trim()) problems.push(`${where} has no reason. Say why the generator does not read these positions.`);
    if (g.rule && !UNREAD_RULES[g.rule]) problems.push(`${where} names rule "${g.rule}". Use one of ${Object.keys(UNREAD_RULES).join(", ")}.`);
    if (g.rule && g.at) problems.push(`${where} has both a rule and positions. Use one.`);
    if (!g.rule && !(g.at ?? []).length) problems.push(`${where} names no position and no rule. Delete it.`);
    if (g.rule && UNREAD_RULES[g.rule] && !positions.some((u) => groupCovers(g, u))) {
      problems.push(`${where} has rule "${g.rule}", and the generator now reads every position it picks. Delete the group. ${regen}`);
    }
    for (const w of g.at ?? []) {
      if (!positions.some((u) => u.where === w)) {
        problems.push(`${where} lists ${w}, which the generator now reads or no schema has. Delete it. ${regen}`);
      }
    }
  });
  return problems;
}

/**
 * Entries the trace cannot vouch for: not consumed, and some object carrying
 * the key was enumerated or serialized, so the generator could depend on the
 * key through a copy the trace never sees. Deleting the key is the only
 * check left, and the key-ledger test runs that sweep on these.
 */
export function unvouchedEntries(pairs, entries) {
  return entries.filter((e) => e.status !== "consumed" && (pairs.get(ledgerKey(e))?.enumerated ?? 0) > 0);
}

/**
 * New entry list from a trace. Statuses follow the reads. Declined and
 * unresolved entries keep their text while the pair stays unread. Nothing is
 * ever declined here: a pair that is new or newly unread becomes unresolved
 * and needs a person.
 *
 * @returns {{entries: object[], changes: string[]}}
 */
export function updateLedger(pairs, entries, { excluded = EXCLUDED_NAMESPACES } = {}) {
  const old = new Map(entries.map((e) => [ledgerKey(e), e]));
  const out = [];
  const changes = [];
  for (const [pair, c] of pairs) {
    const { context, key } = splitPair(pair);
    const prev = old.get(pair);
    const label = `${context} / ${key}`;
    if (c.read > 0) {
      const entry = { context, key, status: "consumed" };
      const unread = updateUnread(prev?.status === "consumed" ? prev.unread ?? [] : [], unreadPositions(c, excluded), label, changes);
      if (unread.length) entry.unread = unread;
      out.push(entry);
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

// Keeps each group's reason, drops positions that are now read or gone, and
// puts unread positions no group covers into a group with an empty reason.
function updateUnread(groups, positions, label, changes) {
  const kept = [];
  for (const g of groups) {
    if (g.rule) {
      if (positions.some((u) => groupCovers(g, u))) kept.push(g);
      else changes.push(`unread rule ${g.rule} no longer picks a position, dropped: ${label}`);
      continue;
    }
    const at = (g.at ?? []).filter((w) => positions.some((u) => u.where === w));
    for (const w of g.at ?? []) if (!at.includes(w)) changes.push(`now read, or gone, at ${w}: ${label}`);
    if (at.length) kept.push({ ...g, at });
  }
  const uncovered = positions.filter((u) => !kept.some((g) => groupCovers(g, u))).map((u) => u.where);
  if (uncovered.length) {
    let open = kept.find((g) => !g.rule && !String(g.reason ?? "").trim());
    if (!open) kept.push((open = { reason: "", at: [] }));
    open.at = [...open.at, ...uncovered].sort(codePointCompare);
    for (const w of uncovered) changes.push(`not read at ${w}, needs a reason: ${label}`);
  }
  return kept;
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
 * Deletes the keys of all entries at once, rebuilds, and compares with the
 * unablated build. When nothing changes, every entry is as its status says
 * and two builds were enough. When something changes, the entries are
 * bisected until each change is pinned on one entry, and sweepFailure says
 * what that means for it. A group that changes the output when neither half
 * does on its own fails as a group, naming every key in it, since the output
 * depends on two of them together. Two deletions that cancel each other out
 * would hide here, and only the one-at-a-time sweep in npm run ablate sees
 * them.
 *
 * @param {object[]} entries - ledger entries to try together.
 * @param {(ablate: object[] | null) => Record<string, {sha256: string, size: number}>} build - outputs of a build with those keys deleted.
 * @returns {string[]}
 */
export function sweepTogether(entries, build) {
  const base = build(null);
  const failures = [];
  const check = (group) => {
    if (group.length === 0) return false;
    let result;
    try {
      result = diffOutputs(base, build(group.map(({ context, key }) => ({ context, key }))));
    } catch (err) {
      result = { changed: [], bytes: 0, threw: String(err.message).slice(0, 160) };
    }
    const effect = Boolean(result.threw) || result.changed.length > 0;
    if (!effect) return false;
    if (group.length === 1) {
      const failure = sweepFailure(group[0], result);
      if (failure) failures.push(failure);
      return true;
    }
    const half = Math.ceil(group.length / 2);
    const first = check(group.slice(0, half));
    const second = check(group.slice(half));
    if (!first && !second) {
      const names = group.map((e) => `"${e.key}" in context "${e.context}"`).join(", ");
      failures.push(
        `Deleting the keys ${names} together changes the output` +
          `${result.threw ? ` (the generator throws: ${result.threw})` : ` (${result.changed.length} files, ${result.bytes} bytes)`}, ` +
          `but deleting either half of them does not. The output depends on at least two of them at once, for example ` +
          `a fallback from one key to another. Read tracing missed those uses. Find the reads, then mark the entries consumed.`
      );
    }
    return true;
  };
  check(entries);
  return failures;
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
