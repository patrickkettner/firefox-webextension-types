// Tooling: environment and command line handling, no declaration text is asserted

import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function run(args, env = {}) {
  const clean = { ...process.env };
  for (const name of ["TOPSRCDIR", "MOZ_TOPSRCDIR", "MOZILLA_CENTRAL", "FWT_SKIP_FIREFOX"]) delete clean[name];
  return spawnSync(process.execPath, args, { cwd: root, env: { ...clean, ...env }, encoding: "utf8" });
}

describe("FWT_SKIP_FIREFOX", () => {
  const load = ["--input-type=module", "-e", `await import(${JSON.stringify(pathToFileURL(path.join(root, "test/helpers/firefox-root.js")).href)})`];

  it("skips the Firefox suites only when it is 1", () => {
    assert.equal(run(load, { FWT_SKIP_FIREFOX: "1" }).status, 0);
    for (const value of ["0", "true", ""]) {
      const { status, stderr } = run(load, { FWT_SKIP_FIREFOX: value });
      assert.notEqual(status, 0, `FWT_SKIP_FIREFOX=${value} opted out`);
      assert.match(stderr, /No Firefox checkout/);
    }
  });
});

describe("npm run ablate filters", () => {
  it("rejects a status the ledger does not use", () => {
    const { status, stderr } = run(["scripts/ablate.js", "--status", "consumd"]);
    assert.equal(status, 1);
    assert.match(stderr, /Unknown --status consumd/);
  });

  it("fails when the filters select no entry", () => {
    const { status, stderr } = run(["scripts/ablate.js", "--status", "declined", "--only", "no such context or key"]);
    assert.equal(status, 1);
    assert.match(stderr, /No ledger entry matches/);
  });
});

describe("Firefox checkout option", () => {
  for (const script of ["src/generate.js", "scripts/verify-parity.js", "scripts/verify-overrides.js"]) {
    it(`${script} takes the checkout from --firefox-source or TOPSRCDIR only`, () => {
      const { status, stderr } = run([script, "--topsrcdir", "/nonexistent-firefox-checkout"]);
      assert.equal(status, 1);
      assert.match(stderr, /no Firefox checkout\. Pass --firefox-source <path> or set TOPSRCDIR\./);
    });
  }
});
