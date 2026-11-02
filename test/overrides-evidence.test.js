import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, before, describe, it } from "node:test";
import * as overrides from "../src/overrides.js";
import { checkEvidenceCoverage, checkRuleCode, evidenceEntries, tableKeys, verifyOverrides } from "../scripts/verify-overrides.js";
import { checkEvidence } from "../verification/src/independent-schema-loader.js";

const firefoxRoot = process.env.TOPSRCDIR || process.env.MOZ_TOPSRCDIR || process.env.MOZILLA_CENTRAL;

// These tests rest on nothing in the emitted declarations. They check the
// audit in scripts/verify-overrides.js, which compares src/overrides.js with
// Firefox source.

// Tooling: the audit in scripts/verify-overrides.js, no declaration text is asserted
describe("evidence for hand-written tables", () => {
  let fake;
  before(() => {
    fake = fs.mkdtempSync(path.join(os.tmpdir(), "fwt-evidence-"));
    fs.mkdirSync(path.join(fake, "toolkit"), { recursive: true });
    fs.writeFileSync(path.join(fake, "toolkit", "ext.js"), "function f() {\n    return   value;\n}\n");
  });
  after(() => fs.rmSync(fake, { recursive: true, force: true }));

  it("accepts an anchor that spans lines and indentation", () => {
    const entries = [{ label: "T.k", file: "toolkit/ext.js", anchor: "function f() { return value; }" }];
    assert.deepEqual(checkEvidence(fake, entries), []);
  });

  it("fails when the anchor no longer occurs and says what to do", () => {
    const entries = [{ label: "T.k", file: "toolkit/ext.js", anchor: "return other;" }];
    const [failure] = checkEvidence(fake, entries);
    assert.match(failure, /^T\.k: toolkit\/ext\.js no longer contains "return other;"/);
    assert.match(failure, /update the anchor in src\/overrides\.js/);
  });

  it("fails when the file is gone", () => {
    const entries = [{ label: "T.k", file: "toolkit/gone.js", anchor: "x" }];
    const [failure] = checkEvidence(fake, entries);
    assert.match(failure, /^T\.k: toolkit\/gone\.js does not exist/);
  });

  it("fails for a table entry with no evidence", () => {
    const mod = { A: { one: 1, two: 2 }, EVIDENCE: { A: { one: { file: "f", anchor: "a" } } } };
    const failures = checkEvidenceCoverage(mod);
    assert.equal(failures.length, 1);
    assert.match(failures[0], /A\.two has no evidence/);
  });

  it("fails for a table with no evidence block", () => {
    const failures = checkEvidenceCoverage({ B: new Set(["x"]), EVIDENCE: {} });
    assert.match(failures[0], /^B has no EVIDENCE\.B/);
  });

  it("fails for evidence whose entry was removed", () => {
    const mod = { A: { one: 1 }, EVIDENCE: { A: { one: { file: "f", anchor: "a" }, gone: { file: "f", anchor: "a" } } } };
    const failures = checkEvidenceCoverage(mod);
    assert.equal(failures.length, 1);
    assert.match(failures[0], /EVIDENCE\.A\["gone"\] has no matching entry in A/);
  });

  it("fails for an empty anchor", () => {
    const mod = { A: { one: 1 }, EVIDENCE: { A: { one: { file: "f", anchor: " " } } } };
    assert.match(checkEvidenceCoverage(mod)[0], /needs \{ file, anchor \} with a non-empty anchor/);
  });

  it("fails for a copied rule whose code is gone", () => {
    const mod = { HAND_COPIED_RULES: { r: { code: "src/emitter.js", symbol: "function noSuchRule" } } };
    assert.match(checkRuleCode(mod)[0], /HAND_COPIED_RULES\["r"\] points at "function noSuchRule" in src\/emitter\.js/);
  });

  it("covers every key of every table in src/overrides.js", () => {
    assert.deepEqual(checkEvidenceCoverage(overrides), []);
    assert.deepEqual(checkRuleCode(overrides), []);
    const keys = Object.entries(overrides)
      .filter(([name]) => name !== "EVIDENCE")
      .reduce((n, [, table]) => n + tableKeys(table).length, 0);
    assert.ok(keys > 50, `expected the tables to hold many entries, found ${keys}`);
  });
});

// Firefox: Schemas.sys.mjs (every anchor in the overrides table names a file in the checkout)
describe("evidence against the Firefox checkout", { skip: !firefoxRoot && "no Firefox checkout: set TOPSRCDIR" }, () => {
  it("every anchor in src/overrides.js occurs in its Firefox file", () => {
    assert.deepEqual(checkEvidence(firefoxRoot, evidenceEntries(overrides)), []);
  });

  it("fails when one real anchor is broken", () => {
    const broken = evidenceEntries(overrides);
    broken[0] = { ...broken[0], anchor: `${broken[0].anchor} NO_LONGER_THERE` };
    assert.equal(checkEvidence(firefoxRoot, broken).length, 1);
  });

  it("passes the whole audit", () => {
    assert.deepEqual(verifyOverrides(firefoxRoot), []);
  });
});
