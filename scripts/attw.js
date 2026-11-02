#!/usr/bin/env node
/**
 * Runs @arethetypeswrong/cli on the packed package and exits 1 on any problem.
 *
 * The four ambient entrypoints are checked on their own with
 * cjs-resolves-to-esm ignored. They are script files that declare globals for
 * a tsconfig "types" entry or a triple-slash reference, and nothing imports
 * them, so the format of the file does not matter. A .cts and a .mts file that
 * both reference one compile clean today. A .d.cts twin, which the module
 * entrypoints have, would load a second copy of the globals for the CommonJS
 * file and fail with TS2300 Duplicate identifier. The rule stays on for every
 * other entrypoint, where a missing twin would be a real defect.
 *
 * Run npm run build first. attw reads dist/ through npm pack.
 */

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const attw = path.join(root, "node_modules", ".bin", "attw");
const ambient = ["./global", "./global-chrome", "./global-mobile", "./global-mobile-chrome"];

// The package ships its own types, so skip the lookup of @types on the registry.
const run = (...args) =>
  spawnSync(attw, ["--pack", root, "--no-definitely-typed", ...args], { stdio: "inherit" }).status;

const modules = run("--exclude-entrypoints", ...ambient);
const globals = run("--entrypoints", ...ambient, "--ignore-rules", "cjs-resolves-to-esm");
process.exit(modules === 0 && globals === 0 ? 0 : 1);
