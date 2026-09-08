#!/usr/bin/env node
/**
 * verify.js - CLI runner for 3-Tier Independent Verification
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

import { loadIndependentSchemaUniverse } from "../src/independent-schema-loader.js";
import { extractSymbolsFromDts } from "../src/ast-symbol-extractor.js";
import { verifyDeclarations } from "../src/three-tier-verifier.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJ_ROOT = path.resolve(__dirname, "../..");

export function runVerificationForTarget(firefoxRoot, target, dtsPath) {
  console.log(`\n--- Auditing ${target.toUpperCase()}: ${path.basename(dtsPath)} ---`);
  if (!fs.existsSync(dtsPath)) {
    console.error(`Error: Artifact not found at ${dtsPath}`);
    return false;
  }

  const schemaUniverse = loadIndependentSchemaUniverse(firefoxRoot, target);
  console.log(`Schema Universe Denominators (Independent Parser):`);
  console.log(`  Schemas     : ${schemaUniverse.schemaFileCount}`);
  console.log(`  Namespaces  : ${schemaUniverse.counts.namespaces}`);
  console.log(`  Types       : ${schemaUniverse.counts.types}`);
  console.log(`  Functions   : ${schemaUniverse.counts.functions}`);
  console.log(`  Events      : ${schemaUniverse.counts.events}`);
  console.log(`  Properties  : ${schemaUniverse.counts.properties}`);

  const emittedUniverse = extractSymbolsFromDts(dtsPath);
  console.log(`Emitted Universe Denominators (AST Extractor):`);
  console.log(`  Namespaces  : ${emittedUniverse.counts.namespaces}`);
  console.log(`  Types       : ${emittedUniverse.counts.types}`);
  console.log(`  Functions   : ${emittedUniverse.counts.functions}`);
  console.log(`  Events      : ${emittedUniverse.counts.events}`);
  console.log(`  Properties  : ${emittedUniverse.counts.properties}\n`);

  const result = verifyDeclarations(schemaUniverse, emittedUniverse);

  console.log("Audit Results:");
  console.log(`  Tier 1 Set Topology: S\\E = ${result.summary.inSchemaNotEmitted}, E\\S = ${result.summary.inEmittedNotSchema}, S∩E = ${result.summary.inBoth}`);
  console.log(`  Tier 1 Phantoms    : ${result.summary.phantomTypes}`);
  console.log(`  Tier 2 Modifiers   : ${result.summary.fabricatedReadonly} fabricated readonly`);
  console.log(`  Tier 3 Collation   : ${result.summary.collationErrors} violations\n`);

  if (!result.passed) {
    console.error(`FAIL: ${target} verification detected violations:`);
    for (const err of result.errors) {
      console.error(`  [X] ${err}`);
    }
    return false;
  }

  console.log(`PASS: 100% ${target} schema completeness and accuracy verified!`);
  return true;
}

export function runAllVerifications(options = {}) {
  const firefoxRoot =
    options.firefoxSource ||
    process.env.TOPSRCDIR ||
    process.env.MOZ_TOPSRCDIR ||
    process.env.MOZILLA_CENTRAL;
  if (!firefoxRoot) {
    throw new Error(
      "Firefox repository not configured. Pass --firefox-source <path> or set the TOPSRCDIR environment variable."
    );
  }

  console.log("=== 3-Tier Independent Verification Audit ===");
  console.log(`Firefox Root : ${firefoxRoot}`);

  const okDesktop = runVerificationForTarget(
    firefoxRoot,
    "desktop",
    path.join(PROJ_ROOT, "dist", "firefox-desktop.d.ts")
  );

  const okIndex = runVerificationForTarget(
    firefoxRoot,
    "desktop",
    path.join(PROJ_ROOT, "dist", "index.d.ts")
  );

  const okMobile = runVerificationForTarget(
    firefoxRoot,
    "mobile",
    path.join(PROJ_ROOT, "dist", "firefox-mobile.d.ts")
  );

  return okDesktop && okIndex && okMobile;
}

function main() {
  const { values } = parseArgs({
    options: {
      "firefox-source": { type: "string" },
    },
    strict: false,
  });

  const ok = runAllVerifications({
    firefoxSource: values["firefox-source"],
  });

  if (!ok) {
    process.exit(1);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
