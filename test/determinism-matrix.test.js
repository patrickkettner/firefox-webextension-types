/**
 * determinism-matrix.test.js - Regression test verifying bit-for-bit determinism
 * across locales, timezones, and environments.
 */

import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";

import { buildDeclarations } from "../src/generate.js";

describe("Determinism Matrix", () => {
  const firefoxRoot =
    process.env.TOPSRCDIR ||
    process.env.MOZ_TOPSRCDIR ||
    process.env.MOZILLA_CENTRAL;

  function hashDir(dir) {
    const hashes = {};
    function walk(curr) {
      for (const entry of fs.readdirSync(curr, { withFileTypes: true })) {
        const full = path.join(curr, entry.name);
        if (entry.isDirectory()) {
          walk(full);
        } else if (entry.isFile() && entry.name.endsWith(".d.ts")) {
          const rel = path.relative(dir, full);
          hashes[rel] = crypto.createHash("sha256").update(fs.readFileSync(full)).digest("hex");
        }
      }
    }
    walk(dir);
    return hashes;
  }

  it("produces 100% bit-for-bit identical output across locales and timezones", {
    skip: !firefoxRoot && "no Firefox checkout: set TOPSRCDIR",
  }, () => {
    const matrix = [
      { LANG: "C", LC_ALL: "C", TZ: "UTC" },
      { LANG: "en_US.UTF-8", LC_ALL: "en_US.UTF-8", TZ: "America/New_York" },
      { LANG: "cs_CZ.UTF-8", LC_ALL: "cs_CZ.UTF-8", TZ: "Europe/Prague" },
      { LANG: "tr_TR.UTF-8", LC_ALL: "tr_TR.UTF-8", TZ: "Asia/Istanbul" },
    ];

    const results = [];
    const tempDirs = [];

    try {
      for (const env of matrix) {
        const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "ff-types-det-"));
        tempDirs.push(outDir);

        const oldLang = process.env.LANG;
        const oldLCall = process.env.LC_ALL;
        const oldTz = process.env.TZ;

        process.env.LANG = env.LANG;
        process.env.LC_ALL = env.LC_ALL;
        process.env.TZ = env.TZ;

        try {
          buildDeclarations(firefoxRoot, outDir, { emitCommitHeader: false });
          const hashes = hashDir(outDir);
          results.push({ env, hashes });
        } finally {
          if (oldLang !== undefined) process.env.LANG = oldLang; else delete process.env.LANG;
          if (oldLCall !== undefined) process.env.LC_ALL = oldLCall; else delete process.env.LC_ALL;
          if (oldTz !== undefined) process.env.TZ = oldTz; else delete process.env.TZ;
        }
      }

      // Assert all results match the first baseline
      const baseline = results[0];
      for (let i = 1; i < results.length; i++) {
        const compare = results[i];
        assert.deepStrictEqual(
          compare.hashes,
          baseline.hashes,
          `Output diverged under locale ${compare.env.LANG} vs baseline ${baseline.env.LANG}`
        );
      }
    } finally {
      for (const d of tempDirs) {
        fs.rmSync(d, { recursive: true, force: true });
      }
    }
  });
});
