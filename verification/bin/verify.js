#!/usr/bin/env node
// Runs the three-tier verifier on each declaration surface in dist/.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

import { loadIndependentSchemaUniverse } from "../src/independent-schema-loader.js";
import { extractSymbolsFromDts } from "../src/ast-symbol-extractor.js";
import { verifyDeclarations } from "../src/three-tier-verifier.js";
import { ADDED_MEMBERS, EXCLUDED_NAMESPACES } from "../src/declared-differences.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJ_ROOT = path.resolve(__dirname, "../..");

function runVerificationForTarget(firefoxRoot, target, dtsPath, aliasSourcePath = null) {
  console.log(`\n${path.basename(dtsPath)} against the ${target} schemas`);
  if (!fs.existsSync(dtsPath)) {
    console.error(`Error: no file at ${dtsPath}`);
    return false;
  }

  const schemaUniverse = loadIndependentSchemaUniverse(firefoxRoot, target, Object.keys(EXCLUDED_NAMESPACES));
  console.log("In the schemas, read by the verifier's own loader:");
  console.log(`  Schemas     : ${schemaUniverse.schemaFileCount}`);
  console.log(`  Namespaces  : ${schemaUniverse.counts.namespaces} (excluded on purpose: ${schemaUniverse.excluded.join(", ") || "none"})`);
  console.log(`  Types       : ${schemaUniverse.counts.types}`);
  console.log(`  Functions   : ${schemaUniverse.counts.functions}`);
  console.log(`  Events      : ${schemaUniverse.counts.events}`);
  console.log(`  Properties  : ${schemaUniverse.counts.properties}`);

  const aliasSource = aliasSourcePath ? extractSymbolsFromDts(aliasSourcePath) : null;
  const emittedUniverse = extractSymbolsFromDts(dtsPath, aliasSource);
  console.log(`Declared in ${path.basename(dtsPath)}:`);
  console.log(`  Namespaces  : ${emittedUniverse.counts.namespaces}`);
  console.log(`  Types       : ${emittedUniverse.counts.types}`);
  console.log(`  Functions   : ${emittedUniverse.counts.functions}`);
  console.log(`  Events      : ${emittedUniverse.counts.events}`);
  console.log(`  Properties  : ${emittedUniverse.counts.properties}\n`);

  const result = verifyDeclarations(schemaUniverse, emittedUniverse);

  console.log("Results:");
  if (aliasSource) console.log(`  Tier 1 Aliases     : ${result.summary.aliasErrors} not naming the same member of ${aliasSource.file}`);
  console.log(`  Tier 1 Set Topology: S\\E = ${result.summary.inSchemaNotEmitted}, E\\S = ${result.summary.inEmittedNotSchema}, S∩E = ${result.summary.inBoth}`);
  console.log(`  Tier 1 Phantoms    : ${result.summary.phantomTypes} types, ${result.summary.phantomHelpers} helper types`);
  console.log(
    `  Tier 1 Members     : ${result.summary.missingMembers} missing, ${result.summary.phantomMembers} without a schema, ` +
      `${result.summary.unrepresentedDefinitions} function definitions with no overload, ${result.summary.phantomOverloads} overloads with no definition`
  );
  console.log(`  Tier 2 Modifiers   : ${result.summary.fabricatedReadonly} fabricated readonly`);
  console.log(`  Tier 3 Collation   : ${result.summary.collationErrors} violations\n`);

  if (!result.passed) {
    console.error(`FAIL: ${target} verification detected violations:`);
    for (const err of result.errors) {
      console.error(`  [X] ${err}`);
    }
    return false;
  }

  const c = result.summary.checked;
  console.log(
    `PASS: ${path.basename(dtsPath)} declares each of the ${target} schemas' ${result.summary.inBoth} namespaces, their types, ` +
      `${c.functions} functions (an overload for each of ${c.definitions} definitions, and no overload that fits none), ${c.events} events, ` +
      `${c.properties} namespace properties and the ${c.typeMembers} members of the object types declared as interfaces, and nothing those schemas lack. ` +
      `No property is readonly unless its schema says so, and namespaces and types are in code point order. ` +
      `Parameter and return types are not compared.`
  );
  return true;
}

function runAllVerifications(options = {}) {
  // The verifier imports nothing from src/, so it reads the variables
  // src/firefox-root.js reads itself.
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

  console.log(`Verifying dist/ against the schemas in ${firefoxRoot}`);

  const cited = [
    ...Object.entries(EXCLUDED_NAMESPACES).map(([name, file]) => [`EXCLUDED_NAMESPACES ${name}`, file]),
    ...Object.entries(ADDED_MEMBERS).map(([name, file]) => [`ADDED_MEMBERS ${name}`, file]),
  ];
  const missingEvidence = cited.filter(([, file]) => !fs.existsSync(path.join(firefoxRoot, file)));
  if (missingEvidence.length) {
    for (const [entry, file] of missingEvidence) {
      console.error(`FAIL: verification/src/declared-differences.js ${entry} cites ${file}, which is not in the Firefox checkout.`);
    }
    return false;
  }

  // A chrome file declares its members as aliases of the browser file it
  // imports or references, so it is read together with that file.
  const surfaces = [
    ["desktop", "firefox-desktop.d.ts"],
    ["desktop", "index.d.ts"],
    ["mobile", "firefox-mobile.d.ts"],
    ["desktop", "global.d.ts"],
    ["mobile", "global-mobile.d.ts"],
    ["desktop", "chrome.d.ts", "index.d.ts"],
    ["desktop", "chrome-mv2.d.ts", "index.d.ts"],
    ["desktop", "global-chrome.d.ts", "global.d.ts"],
    ["desktop", "global-chrome-mv2.d.ts", "global.d.ts"],
    ["mobile", "global-mobile-chrome.d.ts", "global-mobile.d.ts"],
    ["mobile", "global-mobile-chrome-mv2.d.ts", "global-mobile.d.ts"],
  ];
  const dist = path.join(PROJ_ROOT, "dist");
  let ok = true;
  for (const [target, file, aliasSource] of surfaces) {
    ok = runVerificationForTarget(firefoxRoot, target, path.join(dist, file), aliasSource && path.join(dist, aliasSource)) && ok;
  }
  return ok;
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

main();
