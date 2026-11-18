import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BASELINE_FILE = path.join(path.dirname(fileURLToPath(import.meta.url)), "baseline.json");

const UPDATE_COMMAND = "TOPSRCDIR=/path/to/firefox npm run corpus:update";

// Why a family is accepted. Every entry also carries a note that names the
// evidence, for example a schema file or a Firefox test file.
export const REASONS = {
  "stricter-declaration":
    "the declaration follows the schema, which is stricter than the test (an optional field the test reads unchecked, a nullable result)",
  "schema-omission": "Firefox implements it at runtime but its schema does not declare it",
  "test-bug": "the Firefox test is wrong",
  "test-intentional": "the test passes invalid input on purpose without an assertThrows-style helper",
  "test-typing":
    "checkJs types the test's JavaScript more strictly than it was written (widened strings, a variable reused for different results, expando properties, destructured parameters)",
  cascade: "follows another family, through a call that failed overload resolution",
  "privileged-only": "an API that only exists for the test harness or privileged extensions",
  unclassified: "new, needs a reason",
};

export function loadBaseline(file = BASELINE_FILE) {
  if (!fs.existsSync(file)) return {};
  return JSON.parse(fs.readFileSync(file, "utf8")).families;
}

export function saveBaseline(families, file = BASELINE_FILE) {
  const sorted = Object.fromEntries(
    Object.entries(families).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
  );
  fs.writeFileSync(file, `${JSON.stringify({ families: sorted }, null, 2)}\n`);
}

/**
 * Builds the baseline a run should produce: every family seen, with its
 * count, and with the reason and note of the existing entry when there is
 * one, else `unclassified`.
 */
export function updatedBaseline(seen, previous) {
  const next = {};
  for (const [key, { count, example }] of seen) {
    const old = previous[key];
    next[key] = old
      ? { reason: old.reason, note: old.note, count, example }
      : { reason: "unclassified", note: "", count, example };
  }
  return next;
}

/**
 * Compares the families a run saw with the baseline.
 * `added`: seen, not in the baseline. `stale`: in the baseline, not seen.
 * `countChanged`: seen a different number of times than the baseline says.
 * `unclassified`: baseline entries still waiting for a reason.
 * `unknownReason` and `emptyNote`: entries that do not say why they are accepted.
 */
export function compareToBaseline(seen, baseline) {
  const keys = Object.keys(baseline);
  return {
    added: [...seen.keys()].filter((key) => !(key in baseline)),
    stale: keys.filter((key) => !seen.has(key)),
    countChanged: keys.filter((key) => seen.has(key) && seen.get(key).count !== baseline[key].count),
    unclassified: keys.filter((key) => baseline[key].reason === "unclassified"),
    unknownReason: keys.filter((key) => !(baseline[key].reason in REASONS)),
    emptyNote: keys.filter((key) => baseline[key].reason !== "unclassified" && !String(baseline[key].note ?? "").trim()),
  };
}

const list = (keys, describe) => keys.slice(0, 5).map(describe).join("\n") + (keys.length > 5 ? `\n  ... and ${keys.length - 5} more` : "");

export function describeAdded(keys, seen) {
  return (
    `${keys.length} diagnostic ${keys.length === 1 ? "family" : "families"} not in corpus/baseline.json. ` +
    `A declaration change made Firefox's own test code stop type-checking in a way it did not before.\n` +
    list(keys, (key) => `  ${key}\n    first seen at ${seen.get(key).example}, ${seen.get(key).count} occurrence(s)`) +
    `\nIf the new family is a real declaration bug, fix the generator. If it is accepted, ` +
    `run \`${UPDATE_COMMAND}\` and replace "unclassified" in corpus/baseline.json with a reason and a note.`
  );
}

export function describeStale(keys, baseline) {
  return (
    `${keys.length} baseline ${keys.length === 1 ? "family" : "families"} no longer occur in Firefox's test code, ` +
    `so a Firefox test changed, or a declaration change stopped them (a fix is welcome, a regression that hides a call is not). ` +
    `Resolve any new family first, since it can account for these.\n` +
    list(keys, (key) => `  ${key}\n    last seen at ${baseline[key].example}`) +
    `\nRun \`${UPDATE_COMMAND}\` to drop ${keys.length === 1 ? "it" : "them"}.`
  );
}

export function describeCountChanged(keys, seen, baseline) {
  return (
    `${keys.length} baseline ${keys.length === 1 ? "family occurs" : "families occur"} a different number of times than corpus/baseline.json says. ` +
    `More occurrences mean a declaration change reached more of Firefox's test code, fewer mean a test changed or a call stopped being checked.\n` +
    list(keys, (key) => `  ${key}\n    ${baseline[key].count} in the baseline, ${seen.get(key).count} now, first seen at ${seen.get(key).example}`) +
    `\nIf the new count is accepted, run \`${UPDATE_COMMAND}\` and check the diff of corpus/baseline.json.`
  );
}

export function describeEmptyNote(keys, baseline) {
  return (
    `${keys.length} baseline ${keys.length === 1 ? "entry has" : "entries have"} a reason but no note in corpus/baseline.json.\n` +
    list(keys, (key) => `  ${key}\n    reason ${baseline[key].reason}, example ${baseline[key].example}`) +
    `\nWrite a "note" that names the evidence: the schema file or the Firefox file.`
  );
}

export function describeUnclassified(keys, baseline) {
  return (
    `${keys.length} baseline ${keys.length === 1 ? "entry is" : "entries are"} still "unclassified" in corpus/baseline.json.\n` +
    list(keys, (key) => `  ${key}\n    example ${baseline[key].example}`) +
    `\nSet "reason" to one of ${Object.keys(REASONS).filter((r) => r !== "unclassified").join(", ")} and write a "note" that names the evidence.`
  );
}
