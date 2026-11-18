#!/usr/bin/env node
/**
 * Runs @arethetypeswrong/cli on the packed package and exits 1 on any problem.
 *
 * The ambient entrypoints are checked with cjs-resolves-to-esm ignored. They
 * declare globals and have no .d.cts twin, since a twin would declare the
 * globals a second time (TS2300). test/consumer-matrix.test.js references
 * the global entrypoint from a .cts and a .mts file in one program.
 *
 * Run npm run build first.
 */

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const attw = path.join(root, "node_modules", ".bin", "attw");
const ambient = [
  "./global",
  "./global-chrome",
  "./global-chrome-mv2",
  "./global-mobile",
  "./global-mobile-chrome",
  "./global-mobile-chrome-mv2",
  "./global-user-script",
];

// The package ships its own types, so skip the lookup of @types on the registry.
const run = (...args) =>
  spawnSync(attw, ["--pack", root, "--no-definitely-typed", ...args], { stdio: "inherit" }).status;

const modules = run("--exclude-entrypoints", ...ambient);
const globals = run("--entrypoints", ...ambient, "--ignore-rules", "cjs-resolves-to-esm");
process.exit(modules === 0 && globals === 0 ? 0 : 1);
