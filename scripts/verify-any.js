#!/usr/bin/env node
/**
 * Counts every `any` keyword in dist/ by declaration path and compares the
 * counts with any-allowlist.json. Exits 1 on a path the allowlist does not
 * list, on a count above the listed one, and on an entry whose count is no
 * longer what dist/ has, so the list stays exact.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { anyPathsInDir } from "./lib/any-paths.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ALLOWLIST_PATH = path.join(root, "any-allowlist.json");

/**
 * @param {Map<string, number>} counts - path -> occurrences in dist/
 * @param {Record<string, {count: number, reason: string}>} entries
 * @returns {string[]}
 */
export function anyProblems(counts, entries) {
  const problems = [];
  for (const [p, n] of counts) {
    const entry = entries[p];
    if (!entry) {
      problems.push(
        `${p} has ${n} any that any-allowlist.json does not list. Give it a real type in the generator, or add the path ` +
          `with its count and the schema or Firefox file that makes it any.`
      );
    } else if (n > entry.count) {
      problems.push(`${p} has ${n} any, and any-allowlist.json allows ${entry.count}. Find the new one in dist/.`);
    } else if (n < entry.count) {
      problems.push(`${p} has ${n} any, and any-allowlist.json lists ${entry.count}. Lower the count in the allowlist.`);
    }
  }
  for (const [p, entry] of Object.entries(entries)) {
    if (!counts.has(p)) problems.push(`${p} has no any in dist/ any more. Delete its entry from any-allowlist.json.`);
    if (!String(entry.reason ?? "").trim()) problems.push(`${p} has no reason in any-allowlist.json.`);
  }
  return problems;
}

export function checkDist(distDir = path.join(root, "dist")) {
  const { entries } = JSON.parse(fs.readFileSync(ALLOWLIST_PATH, "utf8"));
  const counts = anyPathsInDir(distDir);
  return { problems: anyProblems(counts, entries), counts };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { problems, counts } = checkDist();
  if (problems.length) {
    console.log(`FAIL: any in dist/ disagrees with any-allowlist.json in ${problems.length} places:`);
    for (const p of problems) console.log(`  [X] ${p}`);
    process.exit(1);
  }
  let total = 0;
  for (const n of counts.values()) total += n;
  console.log(
    `PASS: Every any in dist/ (${total} at ${counts.size} declaration paths, each path counted in the file that has it most often) ` +
      `is listed in any-allowlist.json with its count.`
  );
}
