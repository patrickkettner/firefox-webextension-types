#!/usr/bin/env node
/**
 * Rewrites the statuses in schema-key-ledger.json from a read trace of the
 * current generator. Declined and unresolved text is kept while a pair stays
 * unread, and the reasons of a consumed entry's unread groups are kept while
 * their positions stay unread. A newly unread position goes into a group with
 * an empty reason. Prints every change. Needs TOPSRCDIR or --firefox-source.
 */

import { parseArgs } from "node:util";

import { resolveFirefoxPath } from "../src/firefox-root.js";
import { readLedger, traceBuild, updateLedger, writeLedger } from "../src/key-ledger.js";

const { values } = parseArgs({
  options: { "firefox-source": { type: "string" } },
  strict: false,
});

const firefoxRoot = resolveFirefoxPath(values["firefox-source"]);
const { entries, changes } = updateLedger(traceBuild(firefoxRoot), readLedger());
writeLedger(entries);

for (const line of changes) console.log(line);
const count = (s) => entries.filter((e) => e.status === s).length;
console.log(
  `${entries.length} pairs: ${count("consumed")} consumed, ${count("declined")} declined, ${count("unresolved")} unresolved`
);
const open = entries.filter((e) => e.status === "unresolved");
if (open.length) {
  console.log(`${open.length} unresolved entries fail npm test until each is consumed in src/emitter.js or declined with a reason.`);
}
const noReason = entries.filter((e) => (e.unread ?? []).some((g) => !String(g.reason ?? "").trim()));
if (noReason.length) {
  console.log(`${noReason.length} consumed entries have unread positions with no reason. npm test fails until each group has one.`);
}
