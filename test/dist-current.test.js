import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { REBUILD, distDifferences, rebuildAdvice } from "../scripts/verify-dist.js";
import { getFirefoxCommitSha } from "../src/generate.js";
import { firefoxRoot, skipFirefox } from "./helpers/firefox-root.js";

// Tooling: dist/ against a fresh build, no declaration text is asserted. The
// suites that read dist/ check what is committed, so a stale dist/ would let
// them pass on output the generator no longer produces.
describe("committed dist", { skip: skipFirefox }, () => {
  it("is byte for byte what the generator produces from the Firefox checkout", () => {
    const problems = distDifferences(firefoxRoot);
    assert.deepEqual(problems, [], `${problems.join("\n")}\n${rebuildAdvice(firefoxRoot)}`);
  });
});

// Tooling: the advice printed under a dist/ mismatch, no declaration text is asserted
describe("advice for a stale dist", { skip: skipFirefox }, () => {
  const withProvenance = (firefoxCommit, fn) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fwt-provenance-"));
    try {
      fs.writeFileSync(path.join(dir, "provenance.json"), JSON.stringify({ firefoxCommit }));
      return fn(dir);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  };

  it("says to rebuild and commit when the checkout is at the recorded commit", () => {
    const head = getFirefoxCommitSha(firefoxRoot);
    assert.equal(withProvenance(head, (dir) => rebuildAdvice(firefoxRoot, dir)), REBUILD);
  });

  it("names both commits and does not say to commit when the checkout is elsewhere", () => {
    const head = getFirefoxCommitSha(firefoxRoot);
    const recorded = "0123456789abcdef0123456789abcdef01234567";
    const advice = withProvenance(recorded, (dir) => rebuildAdvice(firefoxRoot, dir));
    assert.ok(advice.includes(recorded), advice);
    assert.ok(advice.includes(head), advice);
    assert.doesNotMatch(advice, /commit dist/);
  });
});
