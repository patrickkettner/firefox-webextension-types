#!/usr/bin/env node
/**
 * Rewrites the statuses in schema-key-ledger.json from a read trace of the
 * current generator. Declined and unresolved text is kept while a pair stays
 * unread. Prints every change. Needs TOPSRCDIR or --firefox-source.
 */

import fs from "node:fs";
import { parseArgs } from "node:util";

import { resolveFirefoxPath } from "../src/generate.js";
import { LEDGER_PATH, readLedger, traceBuild, updateLedger, writeLedger } from "../src/key-ledger.js";

const { values } = parseArgs({
  options: { "firefox-source": { type: "string" }, init: { type: "boolean", default: false } },
  strict: false,
});

const firefoxRoot = resolveFirefoxPath(values["firefox-source"]);
const existing = fs.existsSync(LEDGER_PATH) || !values.init ? readLedger() : [];
const { entries, changes } = updateLedger(traceBuild(firefoxRoot), existing);
writeLedger(entries);

for (const line of changes) console.log(line);
const count = (s) => entries.filter((e) => e.status === s).length;
console.log(
  `${entries.length} pairs: ${count("consumed")} consumed, ${count("declined")} declined, ${count("unresolved")} unresolved`
);
const blank = entries.filter((e) => e.status !== "consumed" && !String(e.reason ?? "").trim());
if (blank.length) {
  console.log(`${blank.length} entries need a reason in schema-key-ledger.json before npm test passes.`);
}
