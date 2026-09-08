#!/usr/bin/env node
/**
 * generate.js - Main Generator Entrypoint for firefox-webextension-types
 *
 * 100% Pure Schema Fidelity Generator:
 * - Emits all 67 Desktop namespaces into dist/firefox-desktop.d.ts and dist/index.d.ts
 * - Emits all 44 Mobile namespaces into dist/firefox-mobile.d.ts
 * - Emits ambient declarations into dist/global.d.ts
 * - Emits chrome compatibility module into dist/chrome.d.ts
 * - Emits runtime stubs into dist/index.js and dist/index.cjs
 * - Emits content-addressed provenance into dist/provenance.json
 */

import { execSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

import { SchemaRegistry } from "./schema-loader.js";
import { TypeScriptEmitter } from "./emitter.js";
import { codePointCompare } from "./comparator.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJ_ROOT = path.resolve(__dirname, "..");

export function resolveFirefoxPath(cliPath) {
  if (cliPath) {
    const p = path.resolve(cliPath);
    if (!fs.existsSync(p)) {
      console.error(`Error: Firefox repository not found at ${p}`);
      process.exit(1);
    }
    return p;
  }

  const env =
    process.env.TOPSRCDIR ||
    process.env.MOZ_TOPSRCDIR ||
    process.env.MOZILLA_CENTRAL;
  if (env) {
    const p = path.resolve(env);
    if (!fs.existsSync(p)) {
      console.error(`Error: Firefox repository from environment (${env}) not found.`);
      process.exit(1);
    }
    return p;
  }

  console.error(
    "Error: Firefox repository path not provided.\n" +
      "Please pass --firefox-source <path> or set the TOPSRCDIR environment variable."
  );
  process.exit(1);
}

export function getFirefoxCommitSha(firefoxRoot) {
  try {
    const out = execSync(`git -C "${firefoxRoot}" rev-parse HEAD`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    return out.trim();
  } catch {
    return "unknown-commit";
  }
}

export const getGeckoCommitSha = getFirefoxCommitSha;

export function getLastSchemaCommitSha(firefoxRoot) {
  try {
    const out = execSync(
      `git -C "${firefoxRoot}" log -1 --format=%H -- toolkit/components/extensions/schemas browser/components/extensions/schemas mobile/shared/components/extensions/schemas`,
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
    );
    return out.trim() || "unknown-commit";
  } catch {
    return "unknown-commit";
  }
}

export function computeSchemaTreeSha256(firefoxRoot, targetSchemas) {
  const allPaths = Array.from(new Set(targetSchemas.map((s) => s.path))).sort(codePointCompare);
  const hash = crypto.createHash("sha256");
  for (const p of allPaths) {
    const rel = path.relative(firefoxRoot, p);
    hash.update(rel + "\n");
    hash.update(fs.readFileSync(p));
  }
  return hash.digest("hex");
}

export function buildDeclarations(firefoxRootPath, outDirPath, options = {}) {
  const firefoxRoot = path.resolve(firefoxRootPath);
  const outDir = path.resolve(outDirPath);
  fs.mkdirSync(outDir, { recursive: true });

  const commitSha = getFirefoxCommitSha(firefoxRoot);
  const lastSchemaCommitSha = getLastSchemaCommitSha(firefoxRoot);
  const emitCommitHeader = Boolean(options.emitCommitHeader);

  console.log("=== Generating Firefox WebExtension Types (100% Schema Pure) ===");
  console.log(`Firefox Source      : ${firefoxRoot}`);
  console.log(`Firefox Commit      : ${commitSha}`);
  console.log(`Last Schema Commit  : ${lastSchemaCommitSha}`);
  console.log(`Emit Commit Header  : ${emitCommitHeader}`);
  console.log(`Output Dir          : ${outDir}\n`);

  const registry = new SchemaRegistry(firefoxRoot);

  const desktopSchemas = registry.getActiveSchemas("desktop");
  const mobileSchemas = registry.getActiveSchemas("mobile");
  const allSchemas = [...desktopSchemas, ...mobileSchemas];
  const schemaTreeSha256 = computeSchemaTreeSha256(firefoxRoot, allSchemas);
  console.log(`Schema Tree SHA-256 : ${schemaTreeSha256}\n`);

  console.log("-> Ingesting Firefox Desktop schemas...");
  const desktopNs = registry.loadTarget("desktop");
  console.log(`   Discovered ${Object.keys(desktopNs).length} namespaces.`);

  console.log("-> Ingesting Firefox Android / GeckoView schemas...");
  const mobileNs = registry.loadTarget("mobile");
  console.log(`   Discovered ${Object.keys(mobileNs).length} namespaces.`);

  // 1. Pure schema Desktop declarations (Canonical)
  const emitterDesktop = new TypeScriptEmitter({
    target: "desktop",
    commitSha,
    emitCommitHeader,
  });
  const desktopDts = emitterDesktop.generate(desktopNs, "module");
  fs.writeFileSync(path.join(outDir, "firefox-desktop.d.ts"), desktopDts, "utf8");
  fs.writeFileSync(path.join(outDir, "index.d.ts"), desktopDts, "utf8");
  console.log(`   Emitted: firefox-desktop.d.ts and index.d.ts (${Object.keys(desktopNs).length} namespaces)`);

  // 2. Pure schema Mobile declarations
  const emitterMobile = new TypeScriptEmitter({
    target: "mobile",
    commitSha,
    emitCommitHeader,
  });
  const mobileDts = emitterMobile.generate(mobileNs, "module");
  fs.writeFileSync(path.join(outDir, "firefox-mobile.d.ts"), mobileDts, "utf8");
  console.log(`   Emitted: firefox-mobile.d.ts (${Object.keys(mobileNs).length} namespaces)`);

  // 3. Ambient global declarations
  const ambientDts = emitterDesktop.generate(desktopNs, "ambient");
  fs.writeFileSync(path.join(outDir, "global.d.ts"), ambientDts, "utf8");
  console.log("   Emitted: global.d.ts (Ambient Global)");

  // 4. Isolated Chrome compatibility module
  const chromeDts = emitterDesktop.generate(desktopNs, "chrome");
  fs.writeFileSync(path.join(outDir, "chrome.d.ts"), chromeDts, "utf8");
  console.log("   Emitted: chrome.d.ts (Chrome Compatibility)");

  // 5. Runtime stubs
  const runtimeStubEsm =
    '// Runtime placeholder for types-only package\n' +
    'export const browser = typeof globalThis !== "undefined" ? globalThis.browser : undefined;\n' +
    'export const chrome = typeof globalThis !== "undefined" ? globalThis.chrome : undefined;\n' +
    'export default browser;\n';
  fs.writeFileSync(path.join(outDir, "index.js"), runtimeStubEsm, "utf8");

  const runtimeStubCjs =
    '// Runtime placeholder for types-only package (CommonJS)\n' +
    'const browser = typeof globalThis !== "undefined" ? globalThis.browser : undefined;\n' +
    'const chrome = typeof globalThis !== "undefined" ? globalThis.chrome : undefined;\n' +
    'module.exports = {\n' +
    '  browser,\n' +
    '  chrome,\n' +
    '  default: browser,\n' +
    '};\n';
  fs.writeFileSync(path.join(outDir, "index.cjs"), runtimeStubCjs, "utf8");
  console.log("   Emitted: index.js and index.cjs (Runtime Stubs)");

  // 6. Write provenance.json
  const fileHash = (rel) => {
    const full = path.join(outDir, rel);
    return crypto.createHash("sha256").update(fs.readFileSync(full)).digest("hex");
  };

  const provenance = {
    firefoxCommit: commitSha,
    lastSchemaModifyingCommit: lastSchemaCommitSha,
    schemaTreeSha256,
    generatorVersion: "0.2.0",
    artifacts: {
      "index.d.ts": { sha256: fileHash("index.d.ts") },
      "firefox-desktop.d.ts": { sha256: fileHash("firefox-desktop.d.ts") },
      "firefox-mobile.d.ts": { sha256: fileHash("firefox-mobile.d.ts") },
      "global.d.ts": { sha256: fileHash("global.d.ts") },
      "chrome.d.ts": { sha256: fileHash("chrome.d.ts") },
    },
  };
  fs.writeFileSync(
    path.join(outDir, "provenance.json"),
    JSON.stringify(provenance, null, 2) + "\n",
    "utf8"
  );
  console.log("   Emitted: provenance.json (Content-Addressed Provenance)");

  console.log(`\nAll declarations successfully generated into ${outDir}`);
}

function main() {
  const { values } = parseArgs({
    options: {
      "firefox-source": { type: "string" },
      topsrcdir: { type: "string" },
      "out-dir": { type: "string" },
      "commit-header": { type: "boolean", default: false },
      "no-commit-header": { type: "boolean", default: false },
    },
    strict: false,
  });

  const firefoxRoot = resolveFirefoxPath(
    values["firefox-source"] || values.topsrcdir
  );
  const outDir = values["out-dir"] || path.join(PROJ_ROOT, "dist");
  const emitCommitHeader = values["commit-header"] && !values["no-commit-header"];

  buildDeclarations(firefoxRoot, outDir, { emitCommitHeader });
}

// Run directly if invoked from CLI
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
