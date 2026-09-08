#!/usr/bin/env node
/**
 * verify-parity.js - Parity, schema coverage, and type safety audits for Firefox WebExtension types
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseJarMn } from "../src/jar-parser.js";
import { loadRawSchemaJson } from "../src/schema-loader.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJ = path.resolve(__dirname, "..");

export function getFirefoxRoot() {
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if (
      (args[i] === "--firefox-source" || args[i] === "--topsrcdir") &&
      i + 1 < args.length
    ) {
      const p = path.resolve(args[i + 1]);
      if (fs.existsSync(p)) return p;
      throw new Error(`Firefox repository from CLI argument (${args[i + 1]}) not found.`);
    }
  }

  const envMoz =
    process.env.TOPSRCDIR ||
    process.env.MOZ_TOPSRCDIR ||
    process.env.MOZILLA_CENTRAL;
  if (envMoz) {
    const p = path.resolve(envMoz);
    if (fs.existsSync(p)) return p;
    throw new Error(`Firefox repository from environment (${envMoz}) not found.`);
  }

  throw new Error(
    "Firefox repository not configured. Pass --firefox-source <path> or set the TOPSRCDIR environment variable."
  );
}

const MOZ = getFirefoxRoot();

export function getPlatformSchemas(platform) {
  const isAndroid = platform === "mobile";
  const schemas = [];

  const tkDir = path.join(MOZ, "toolkit", "components", "extensions", "schemas");
  const tkJar = path.join(tkDir, "jar.mn");
  for (const fname of parseJarMn(tkJar, isAndroid)) {
    const fpath = path.join(tkDir, fname);
    if (!fs.existsSync(fpath)) {
      throw new Error(`Schema file declared in jar.mn not found: ${fpath}`);
    }
    schemas.push(fpath);
  }

  if (platform === "desktop") {
    const brDir = path.join(MOZ, "browser", "components", "extensions", "schemas");
    const brJar = path.join(brDir, "jar.mn");
    for (const fname of parseJarMn(brJar, false)) {
      const fpath = path.join(brDir, fname);
      if (!fs.existsSync(fpath)) {
        throw new Error(`Schema file declared in jar.mn not found: ${fpath}`);
      }
      schemas.push(fpath);
    }
  } else if (platform === "mobile") {
    const mbDir = path.join(MOZ, "mobile", "shared", "components", "extensions", "schemas");
    const mbJar = path.join(mbDir, "jar.mn");
    for (const fname of parseJarMn(mbJar, true)) {
      const fpath = path.join(mbDir, fname);
      if (!fs.existsSync(fpath)) {
        throw new Error(`Schema file declared in jar.mn not found: ${fpath}`);
      }
      schemas.push(fpath);
    }
  }

  return schemas;
}

export function parseSchemaNamespaces(schemaPath) {
  const [data] = loadRawSchemaJson(schemaPath);
  const namespaces = [];
  for (const entry of data) {
    const ns = entry.namespace;
    if (ns && !ns.includes(".")) {
      namespaces.push(ns);
    }
  }
  return namespaces;
}

export function verifyPlatformSchemaCoverage(platform, dtsPath) {
  if (!fs.existsSync(dtsPath)) {
    console.log(`FAIL: Missing declaration file: ${dtsPath}`);
    return false;
  }

  const dtsContent = fs.readFileSync(dtsPath, "utf8");
  const schemas = getPlatformSchemas(platform);
  const parseErrors = [];
  const missingNamespaces = [];
  const skippedInternal = [];

  for (const schemaPath of schemas) {
    try {
      const nsList = parseSchemaNamespaces(schemaPath);
      for (const ns of nsList) {
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
    `PASS: 100% ${platform} schema coverage across ${schemas.length} schemas in ${path.basename(dtsPath)}.`
  );
  return true;
}

export function verifyNoInlineComments() {
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

  console.log("PASS: Zero inline '/* upstream any */' comments in emitted types.");
  return true;
}

export function verifySoundnessAndFixedTypes() {
  const indexDts = fs.readFileSync(path.join(PROJ, "dist", "index.d.ts"), "utf8");
  const errors = [];

  if (!indexDts.includes("getManifest(): Record<string, unknown>;")) {
    errors.push("runtime.getManifest() not typed as Record<string, unknown>");
  }

  if (!indexDts.includes("getViews(): Window[];")) {
    errors.push("extension.getViews() not typed as Window[]");
  }

  if (!indexDts.includes("getBackgroundPage(): Window | null;")) {
    errors.push("extension.getBackgroundPage() not typed as Window | null");
  }

  if (!indexDts.includes("bytes?: ArrayBuffer;")) {
    errors.push("webRequest.UploadData.bytes not typed as ArrayBuffer");
  }

  if (
    !indexDts.includes(
      "browser.webRequest.BlockingResponse | Promise<browser.webRequest.BlockingResponse> | void"
    )
  ) {
    errors.push("WebExtensionWebRequestEvent listener return type incorrect");
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
    "PASS: All soundness fixes verified (manifest, Window, ArrayBuffer, BlockingResponse, (string & {}))."
  );
  return true;
}

export function verifyZeroEmptyInterfaces() {
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

  console.log(
    "PASS: Zero empty interfaces (all empty schema objects emit [key: string]: unknown)."
  );
  return true;
}

export function verifyZeroDeadOverloads() {
  const distDir = path.join(PROJ, "dist");
  const dtsFiles = fs.readdirSync(distDir).filter((f) => f.endsWith(".d.ts"));
  const deadOverloads = [];

  for (const dtsFile of dtsFiles) {
    const content = fs.readFileSync(path.join(distDir, dtsFile), "utf8");
    const nsBlocks = Array.from(
      content.matchAll(/namespace\s+([A-Za-z0-9_]+)\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}/g)
    );

    for (const [, nsName, block] of nsBlocks) {
      const fnMatches = Array.from(
        block.matchAll(/(?:export\s+)?function\s+([A-Za-z0-9_]+)\s*\((.*?)\)\s*:\s*([^;]+);/g)
      );
      const fnGroups = new Map();
      for (const [, name, params, ret] of fnMatches) {
        if (!fnGroups.has(name)) fnGroups.set(name, []);
        fnGroups.get(name).push([params.trim(), ret.trim()]);
      }

      for (const [name, sigs] of fnGroups.entries()) {
        if (sigs.length <= 1) continue;
        let seenAllOptional = false;
        for (const [params] of sigs) {
          const isParameterless = params.length === 0;
          if (isParameterless && seenAllOptional) {
            deadOverloads.push(
              `${dtsFile}: ${nsName}.${name} parameterless shadowed by all-optional overload`
            );
            break;
          }
          if (params) {
            const paramList = params
              .split(",")
              .map((p) => p.trim())
              .filter(Boolean);
            const allOpt = paramList.every((p) => p.includes("?:"));
            if (allOpt) {
              seenAllOptional = true;
            }
          }
        }
      }
    }
  }

  if (deadOverloads.length > 0) {
    console.log("FAIL: Found dead overloads:");
    for (const d of deadOverloads) {
      console.log(`  ${d}`);
    }
    return false;
  }

  console.log(
    "PASS: Zero dead overloads (specific/parameterless precede all-optional overloads)."
  );
  return true;
}

export function verifyZeroCallbackOptionalParameters() {
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

  console.log("PASS: Zero callback optional parameters ((arg: Type) => void emitted cleanly).");
  return true;
}

export function verifyPackageExports() {
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
  for (const [subpath, entry] of Object.entries(exportsMap)) {
    if (typeof entry === "object" && entry !== null) {
      for (const [cond, relPath] of Object.entries(entry)) {
        const p = path.join(PROJ, relPath.replace(/^\.\//, ""));
        if (!fs.existsSync(p)) {
          errors.push(
            `package.json exports['${subpath}']['${cond}'] (${relPath}) does not exist on disk`
          );
        }
      }
    } else if (typeof entry === "string") {
      const p = path.join(PROJ, entry.replace(/^\.\//, ""));
      if (!fs.existsSync(p)) {
        errors.push(`package.json exports['${subpath}'] (${entry}) does not exist on disk`);
      }
    }
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

  console.log("PASS: Package exports, main, types, and typesVersions verified on disk.");
  return true;
}

export function runAllAudits() {
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

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runAllAudits();
}
