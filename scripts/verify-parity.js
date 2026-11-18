#!/usr/bin/env node
// Checks dist/ and package.json. Each top-level schema namespace has a
// namespace in firefox-desktop.d.ts and firefox-mobile.d.ts, six
// declarations in index.d.ts have their expected text, no declaration file
// has an empty interface, a dead overload, a callback parameter marked
// optional or an "upstream any" comment, and every file package.json names
// exists.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { resolveFirefoxPath } from "../src/firefox-root.js";
import { SchemaRegistry, loadRawSchemaJson } from "../src/schema-loader.js";
import { EXCLUDED_NAMESPACES } from "../verification/src/declared-differences.js";
import { findDeadOverloads } from "./lib/dead-overloads.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJ = path.resolve(__dirname, "..");

const { values } = parseArgs({
  options: { "firefox-source": { type: "string" } },
  strict: false,
});
const MOZ = resolveFirefoxPath(values["firefox-source"]);

function getPlatformSchemas(platform) {
  return new SchemaRegistry(MOZ).getActiveSchemas(platform).map((s) => s.path);
}

function parseSchemaNamespaces(schemaPath) {
  const [data] = loadRawSchemaJson(schemaPath);
  const namespaces = [];
  for (const entry of data) {
    const ns = entry.namespace;
    if (ns && !ns.includes(".") && !Object.hasOwn(EXCLUDED_NAMESPACES, ns)) {
      namespaces.push(ns);
    }
  }
  return namespaces;
}

function verifyPlatformSchemaCoverage(platform, dtsPath) {
  if (!fs.existsSync(dtsPath)) {
    console.log(`FAIL: Missing declaration file: ${dtsPath}`);
    return false;
  }

  const dtsContent = fs.readFileSync(dtsPath, "utf8");
  const schemas = getPlatformSchemas(platform);
  const parseErrors = [];
  const missingNamespaces = [];
  const checked = new Set();

  for (const schemaPath of schemas) {
    try {
      const nsList = parseSchemaNamespaces(schemaPath);
      for (const ns of nsList) {
        checked.add(ns);
        const pattern = `export namespace ${ns} {`;
        if (!dtsContent.includes(pattern)) {
          missingNamespaces.push(
            `${path.basename(schemaPath)} -> namespace '${ns}' missing in ${path.basename(dtsPath)}`
          );
        }
      }
    } catch (e) {
      parseErrors.push(`${schemaPath}: ${e.message}`);
    }
  }

  if (parseErrors.length > 0) {
    console.log(`FAIL: Schema parsing errors encountered for ${platform}:`);
    for (const err of parseErrors) {
      console.log(`  ${err}`);
    }
    return false;
  }

  if (missingNamespaces.length > 0) {
    console.log(`FAIL: Missing namespaces in ${path.basename(dtsPath)}:`);
    for (const m of missingNamespaces) {
      console.log(`  ${m}`);
    }
    return false;
  }

  console.log(
    `PASS: ${path.basename(dtsPath)} declares a namespace for each of the ${checked.size} top-level namespaces in the ${schemas.length} ${platform} schemas.`
  );
  return true;
}

function verifyNoInlineComments() {
  const distDir = path.join(PROJ, "dist");
  const dtsFiles = fs.readdirSync(distDir).filter((f) => f.endsWith(".d.ts"));
  if (dtsFiles.length === 0) {
    console.log("FAIL: No .d.ts files found in dist/");
    return false;
  }

  const found = [];
  for (const f of dtsFiles) {
    const content = fs.readFileSync(path.join(distDir, f), "utf8");
    if (content.includes("/* upstream any */")) {
      found.push(`${f}: contains '/* upstream any */'`);
    }
  }

  if (found.length > 0) {
    console.log("FAIL: Found inline upstream any comments in emitted types:");
    for (const u of found) {
      console.log(`  ${u}`);
    }
    return false;
  }

  console.log("PASS: No declaration file in dist/ has an '/* upstream any */' comment.");
  return true;
}

function verifySoundnessAndFixedTypes() {
  const indexDts = fs.readFileSync(path.join(PROJ, "dist", "index.d.ts"), "utf8");
  const errors = [];

  if (!/getManifest\(\): Normalized<browser\.manifest\.WebExtensionManifest, "[^>]*"permissions"[^>]*>;/.test(indexDts)) {
    errors.push("runtime.getManifest() not typed as Normalized<browser.manifest.WebExtensionManifest, ...> naming the keys normalization fills");
  }

  if (!indexDts.includes("getViews(fetchProperties?: getViews.FetchProperties | null): Window[];")) {
    errors.push("extension.getViews() not typed as Window[]");
  }

  if (!indexDts.includes("getBackgroundPage(): Window | null;")) {
    errors.push("extension.getBackgroundPage() not typed as Window | null");
  }

  if (!indexDts.includes("bytes?: ArrayBuffer | undefined;")) {
    errors.push("webRequest.UploadData.bytes not typed as ArrayBuffer");
  }

  if (
    !indexDts.includes(
      "BlockingResponse | globalThis.Promise<BlockingResponse | void> | void"
    )
  ) {
    errors.push("webRequest blocking listener return type incorrect");
  }

  if (!indexDts.includes("(string & {})")) {
    errors.push("Open string literal union (string & {}) not found in index.d.ts");
  }

  if (errors.length > 0) {
    console.log("FAIL: Soundness checks failed:");
    for (const e of errors) {
      console.log(`  ${e}`);
    }
    return false;
  }

  console.log(
    "PASS: index.d.ts has the text of six declarations: runtime.getManifest() as Normalized<WebExtensionManifest, ...>, " +
      "extension.getViews() as Window[], extension.getBackgroundPage() as Window | null, UploadData.bytes as ArrayBuffer, " +
      "the blocking webRequest listener return, and an open (string & {}) union."
  );
  return true;
}

function verifyZeroEmptyInterfaces() {
  const distDir = path.join(PROJ, "dist");
  const dtsFiles = fs.readdirSync(distDir).filter((f) => f.endsWith(".d.ts"));
  const emptyInterfaces = [];

  for (const f of dtsFiles) {
    const content = fs.readFileSync(path.join(distDir, f), "utf8");
    const matches = Array.from(content.matchAll(/interface\s+([A-Za-z0-9_]+)\s*\{\s*\}/g));
    if (matches.length > 0) {
      emptyInterfaces.push(`${f}: empty interfaces ${matches.map((m) => m[1]).join(", ")}`);
    }
  }

  if (emptyInterfaces.length > 0) {
    console.log("FAIL: Found empty interfaces without index signatures:");
    for (const e of emptyInterfaces) {
      console.log(`  ${e}`);
    }
    return false;
  }

  console.log("PASS: No declaration file in dist/ has an interface with an empty body.");
  return true;
}

function verifyZeroDeadOverloads() {
  const distDir = path.join(PROJ, "dist");
  const files = fs.readdirSync(distDir).filter((f) => f.endsWith(".d.ts") || f.endsWith(".d.cts")).sort();
  const byText = new Map();
  for (const f of files) {
    const text = fs.readFileSync(path.join(distDir, f), "utf8");
    if (!byText.has(text)) byText.set(text, []);
    byText.get(text).push(f);
  }

  const deadOverloads = [];
  let functions = 0;
  let signatures = 0;
  let overloadSets = 0;
  for (const names of byText.values()) {
    const result = findDeadOverloads(path.join(distDir, names[0]));
    functions += result.functions;
    signatures += result.signatures;
    overloadSets += result.overloadSets;
    for (const d of result.dead) deadOverloads.push(`${names.join(", ")}: ${d}`);
  }

  if (deadOverloads.length > 0) {
    console.log("FAIL: Found dead overloads:");
    for (const d of deadOverloads) {
      console.log(`  ${d}`);
    }
    return false;
  }

  console.log(
    `PASS: No overload is shadowed by an earlier one that accepts every call it does, in ${overloadSets} overload sets ` +
      `(${signatures} signatures, ${functions} of them function declarations) in the ${byText.size} distinct declaration files among the ${files.length} in dist/.`
  );
  return true;
}

function verifyZeroCallbackOptionalParameters() {
  const distDir = path.join(PROJ, "dist");
  const dtsFiles = fs.readdirSync(distDir).filter((f) => f.endsWith(".d.ts"));
  const callbackIssues = [];

  for (const f of dtsFiles) {
    const content = fs.readFileSync(path.join(distDir, f), "utf8");
    const cbOpt = Array.from(content.matchAll(/\(\([a-zA-Z0-9_]+\?:\s*[^)]*\)\s*=>/g));
    if (cbOpt.length > 0) {
      callbackIssues.push(
        `${f}: ${cbOpt.length} callbacks with optional parameters (e.g. ${cbOpt.slice(0, 3).map((m) => m[0]).join(", ")})`
      );
    }
  }

  if (callbackIssues.length > 0) {
    console.log("FAIL: Found callback optional parameters:");
    for (const c of callbackIssues) {
      console.log(`  ${c}`);
    }
    return false;
  }

  console.log("PASS: No callback type in dist/ has a parameter marked optional with ?.");
  return true;
}

function verifyPackageExports() {
  const pkgPath = path.join(PROJ, "package.json");
  if (!fs.existsSync(pkgPath)) {
    console.log(`FAIL: package.json missing at ${pkgPath}`);
    return false;
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  const errors = [];

  // Check main & types
  const mainFile = path.join(PROJ, pkg.main || "");
  if (!fs.existsSync(mainFile)) {
    errors.push(`package.json 'main' (${pkg.main}) does not exist on disk`);
  }

  const typesFile = path.join(PROJ, pkg.types || "");
  if (!fs.existsSync(typesFile)) {
    errors.push(`package.json 'types' (${pkg.types}) does not exist on disk`);
  }

  // Check exports map
  const exportsMap = pkg.exports || {};
  const checkTarget = (where, target) => {
    if (typeof target === "string") {
      if (!fs.existsSync(path.join(PROJ, target.replace(/^\.\//, "")))) {
        errors.push(`package.json exports${where} (${target}) does not exist on disk`);
      }
    } else if (target && typeof target === "object") {
      for (const [cond, inner] of Object.entries(target)) {
        checkTarget(`${where}['${cond}']`, inner);
      }
    }
  };
  for (const [subpath, entry] of Object.entries(exportsMap)) {
    checkTarget(`['${subpath}']`, entry);
  }

  // Check typesVersions
  const typesVersions = (pkg.typesVersions && pkg.typesVersions["*"]) || {};
  for (const [key, pathList] of Object.entries(typesVersions)) {
    for (const relPath of pathList) {
      const p = path.join(PROJ, relPath);
      if (!fs.existsSync(p)) {
        errors.push(`package.json typesVersions['*']['${key}'] (${relPath}) does not exist on disk`);
      }
    }
  }

  if (errors.length > 0) {
    console.log("FAIL: Package exports verification failed:");
    for (const e of errors) {
      console.log(`  ${e}`);
    }
    return false;
  }

  console.log("PASS: Every file package.json names in main, types, exports and typesVersions exists on disk.");
  return true;
}

function runAllAudits() {
  console.log("Running verification audits...");
  console.log(`  Project: ${PROJ}`);
  console.log(`  Mozilla: ${MOZ}`);

  const results = [
    verifyPlatformSchemaCoverage("desktop", path.join(PROJ, "dist", "firefox-desktop.d.ts")),
    verifyPlatformSchemaCoverage("mobile", path.join(PROJ, "dist", "firefox-mobile.d.ts")),
    verifyNoInlineComments(),
    verifySoundnessAndFixedTypes(),
    verifyZeroEmptyInterfaces(),
    verifyZeroDeadOverloads(),
    verifyZeroCallbackOptionalParameters(),
    verifyPackageExports(),
  ];

  if (!results.every(Boolean)) {
    console.log("Audits FAILED.");
    process.exit(1);
  }

  console.log("All audits PASSED successfully.");
}

runAllAudits();
