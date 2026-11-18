// Builds dist/ under several locales and timezones and checks the output is
// the same byte for byte. Each locale row builds in a child process, since the
// locale is read at startup.

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import { buildDeclarations } from "../src/generate.js";
import { firefoxRoot, skipFirefox } from "./helpers/firefox-root.js";

// Tooling: generator output must not depend on locale or timezone, no declaration text is asserted
describe("Determinism Matrix", () => {
  function hashDir(dir) {
    const hashes = {};
    function walk(curr) {
      for (const entry of fs.readdirSync(curr, { withFileTypes: true })) {
        const full = path.join(curr, entry.name);
        if (entry.isDirectory()) {
          walk(full);
        } else if (entry.isFile() && /\.(d\.c?ts|c?js|json)$/.test(entry.name)) {
          const rel = path.relative(dir, full);
          hashes[rel] = crypto.createHash("sha256").update(fs.readFileSync(full)).digest("hex");
        }
      }
    }
    walk(dir);
    return hashes;
  }

  it("emits a .d.cts twin identical to each module .d.ts", { skip: skipFirefox }, () => {
    const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "ff-types-cts-"));
    try {
      buildDeclarations(firefoxRoot, outDir, { emitCommitHeader: false });
      for (const base of ["index", "firefox-desktop", "firefox-mobile"]) {
        assert.equal(
          fs.readFileSync(path.join(outDir, `${base}.d.cts`), "utf8"),
          fs.readFileSync(path.join(outDir, `${base}.d.ts`), "utf8"),
          `${base}.d.cts differs from ${base}.d.ts`
        );
      }
      const chromeCts = fs.readFileSync(path.join(outDir, "chrome.d.cts"), "utf8");
      assert.ok(chromeCts.includes('from "./index.cjs"'));
      assert.ok(!chromeCts.includes('"./index.js"'));
    } finally {
      fs.rmSync(outDir, { recursive: true, force: true });
    }
  });

  // ICU reads the locale once at startup, so a row is a child process with
  // the env set at launch. An env change inside this process would leave
  // every row on the locale this process started with.
  it("produces byte-identical output across locales and timezones", { skip: skipFirefox }, () => {
    const matrix = [
      { LANG: "C", LC_ALL: "C", TZ: "UTC" },
      { LANG: "en_US.UTF-8", LC_ALL: "en_US.UTF-8", TZ: "America/New_York" },
      { LANG: "cs_CZ.UTF-8", LC_ALL: "cs_CZ.UTF-8", TZ: "Europe/Prague" },
      { LANG: "tr_TR.UTF-8", LC_ALL: "tr_TR.UTF-8", TZ: "Asia/Istanbul" },
    ];
    const generate = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src", "generate.js");
    const results = [];
    const tempDirs = [];

    try {
      for (const row of matrix) {
        const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "ff-types-det-"));
        tempDirs.push(outDir);
        const env = { ...process.env, ...row };
        const locale = spawnSync(process.execPath, ["-p", "Intl.DateTimeFormat().resolvedOptions().locale"], { env, encoding: "utf8" }).stdout.trim();
        const language = row.LANG.split(/[_.]/)[0];
        if (language !== "C") {
          assert.ok(
            locale.startsWith(language),
            `a child under LANG=${row.LANG} resolved Intl locale ${locale}, so this Node has no ICU data for it and the row proves nothing`
          );
        }
        const run = spawnSync(process.execPath, [generate, "--firefox-source", firefoxRoot, "--out-dir", outDir], { env, encoding: "utf8" });
        assert.equal(run.status, 0, `build under ${JSON.stringify(row)} failed:\n${run.stderr}${run.stdout}`);
        results.push({ row, locale, hashes: hashDir(outDir) });
      }

      const baseline = results[0];
      for (const compare of results.slice(1)) {
        assert.deepStrictEqual(
          compare.hashes,
          baseline.hashes,
          `Output diverged under locale ${compare.row.LANG} (Intl ${compare.locale}) vs baseline ${baseline.row.LANG} (Intl ${baseline.locale})`
        );
      }
    } finally {
      for (const d of tempDirs) {
        fs.rmSync(d, { recursive: true, force: true });
      }
    }
  });
});
