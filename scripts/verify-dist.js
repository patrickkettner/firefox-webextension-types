#!/usr/bin/env node
/**
 * Checks that dist/ is what the generator produces from the Firefox checkout
 * today, byte for byte, provenance.json included. The build writes no commit
 * header into the declarations. provenance.json records the commit.
 *
 * Needs TOPSRCDIR or --firefox-source. Exits 1 and names every file that
 * differs, is missing, or is no longer produced.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

import { resolveFirefoxPath } from "../src/firefox-root.js";
import { buildDeclarations, getFirefoxCommitSha } from "../src/generate.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const REBUILD = "Run npm run build and commit dist/.";

/**
 * What to do about a dist/ that differs from a fresh build. When the checkout
 * is not at the Firefox commit dist/provenance.json records, the difference
 * can come from Firefox alone, so the advice is to check out that commit,
 * not to commit a rebuild.
 *
 * @param {string} firefoxRoot
 * @param {string} [distDir]
 * @returns {string}
 */
export function rebuildAdvice(firefoxRoot, distDir = path.join(root, "dist")) {
  let recorded;
  try {
    recorded = JSON.parse(fs.readFileSync(path.join(distDir, "provenance.json"), "utf8")).firefoxCommit;
  } catch {
    return REBUILD;
  }
  const current = getFirefoxCommitSha(firefoxRoot);
  if (!recorded || recorded === current) return REBUILD;
  const now = current === "unknown-commit" ? "a commit git cannot read" : `Firefox ${current}`;
  return (
    `dist/provenance.json records Firefox ${recorded}, and the checkout at ${firefoxRoot} is at ${now}. ` +
    `The differences can come from Firefox and not from this repository. ` +
    `Check out ${recorded} in the Firefox checkout and run this again to see what this repository changed.`
  );
}

function hashes(dir) {
  const out = {};
  for (const name of fs.readdirSync(dir).sort()) {
    out[name] = crypto.createHash("sha256").update(fs.readFileSync(path.join(dir, name))).digest("hex");
  }
  return out;
}

/**
 * One line per file in which dist differs from a fresh build, empty when
 * dist is current.
 *
 * @param {string} firefoxRoot
 * @param {string} [distDir]
 * @returns {string[]}
 */
export function distDifferences(firefoxRoot, distDir = path.join(root, "dist")) {
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "fwt-dist-"));
  const log = console.log;
  console.log = () => {};
  try {
    buildDeclarations(firefoxRoot, scratch);
  } finally {
    console.log = log;
  }
  try {
    const fresh = hashes(scratch);
    const committed = fs.existsSync(distDir) ? hashes(distDir) : {};
    const problems = [];
    for (const name of [...new Set([...Object.keys(fresh), ...Object.keys(committed)])].sort()) {
      if (!(name in committed)) problems.push(`dist/${name} is missing. The build produces it.`);
      else if (!(name in fresh)) problems.push(`dist/${name} is not produced by the build any more.`);
      else if (fresh[name] !== committed[name]) problems.push(`dist/${name} differs from a fresh build.`);
    }
    return problems;
  } finally {
    fs.rmSync(scratch, { recursive: true, force: true });
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { values } = parseArgs({ options: { "firefox-source": { type: "string" } }, strict: false });
  const firefoxRoot = resolveFirefoxPath(values["firefox-source"]);
  const problems = distDifferences(firefoxRoot);
  if (problems.length) {
    console.error(`dist/ is not what the generator produces:\n  ${problems.join("\n  ")}\n${rebuildAdvice(firefoxRoot)}`);
    process.exit(1);
  }
  console.log("dist/ matches a fresh build.");
}
