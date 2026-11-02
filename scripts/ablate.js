#!/usr/bin/env node
/**
 * Full ablation sweep. For every ledger entry, deletes that key from every
 * schema object in its context, regenerates, and compares with the unablated
 * output. Fails when a consumed pair changes nothing (read but ignored) or a
 * declined pair changes something (a use the trace missed).
 *
 * Needs TOPSRCDIR or --firefox-source. About 1 s per entry, one build at a
 * time by default, at nice 19 and idle IO priority.
 *
 *   --jobs N         N worker processes (default 1)
 *   --only TEXT      only entries whose "context key" contains TEXT
 *   --status A,B     only these statuses (default all)
 *
 * Exit 0 when every checked entry behaves as its status says, 1 otherwise.
 */

import { spawn, spawnSync } from "node:child_process";
import os from "node:os";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

import { resolveFirefoxPath } from "../src/generate.js";
import { readLedger, runSweep } from "../src/key-ledger.js";

const { values } = parseArgs({
  options: {
    "firefox-source": { type: "string" },
    jobs: { type: "string", default: "1" },
    only: { type: "string" },
    status: { type: "string" },
    shard: { type: "string" },
  },
  strict: false,
});

os.setPriority(0, 19);
spawnSync("ionice", ["-c3", "-p", String(process.pid)], { stdio: "ignore" });

const firefoxRoot = resolveFirefoxPath(values["firefox-source"]);
const statuses = values.status ? values.status.split(",") : null;
let entries = readLedger().filter(
  (e) => (!statuses || statuses.includes(e.status)) && (!values.only || `${e.context} ${e.key}`.includes(values.only))
);

if (values.shard) {
  const [i, n] = values.shard.split("/").map(Number);
  entries = entries.filter((_, idx) => idx % n === i);
  runSweep(firefoxRoot, entries, (entry, result, failure) => {
    console.log("RESULT " + JSON.stringify({ entry, effect: Boolean(result.threw) || result.changed.length > 0, failure }));
  });
  process.exit(0);
}

const jobs = Math.max(1, Number(values.jobs) || 1);
const started = Date.now();
const failures = [];
let done = 0;
let noEffect = 0;

function note({ entry, effect, failure }) {
  done++;
  if (!effect && entry.status === "unresolved") noEffect++;
  if (failure) {
    failures.push(failure);
    console.log(`FAIL ${failure}`);
  }
  if (done % 50 === 0) console.error(`${done}/${entries.length} checked, ${failures.length} failing`);
}

if (jobs === 1) {
  runSweep(firefoxRoot, entries, (entry, result, failure) =>
    note({ entry, effect: Boolean(result.threw) || result.changed.length > 0, failure })
  );
} else {
  const script = fileURLToPath(import.meta.url);
  const args = [];
  for (const k of ["firefox-source", "only", "status"]) if (values[k]) args.push(`--${k}`, values[k]);
  await Promise.all(
    Array.from({ length: jobs }, (_, i) =>
      new Promise((resolve, reject) => {
        const child = spawn(process.execPath, [script, ...args, "--shard", `${i}/${jobs}`], { stdio: ["ignore", "pipe", "inherit"] });
        let buf = "";
        child.stdout.on("data", (d) => {
          buf += d;
          let nl;
          while ((nl = buf.indexOf("\n")) >= 0) {
            const line = buf.slice(0, nl);
            buf = buf.slice(nl + 1);
            if (line.startsWith("RESULT ")) note(JSON.parse(line.slice(7)));
          }
        });
        child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`worker ${i} exited ${code}`))));
      })
    )
  );
}

const secs = Math.round((Date.now() - started) / 1000);
console.log(`${entries.length} entries checked in ${secs} s, ${failures.length} failing`);
process.exit(failures.length ? 1 : 0);
