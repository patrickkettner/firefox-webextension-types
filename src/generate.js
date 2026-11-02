#!/usr/bin/env node
/**
 * generate.js - Main Generator Entrypoint for firefox-webextension-types
 *
 * Output in dist/:
 * - index.d.ts, firefox-desktop.d.ts, firefox-mobile.d.ts, chrome.d.ts, each with a
 *   .d.cts twin so the package.json "require" condition resolves CommonJS-flavoured
 *   declarations
 * - global.d.ts and global-mobile.d.ts: ambient `browser` only
 * - global-chrome.d.ts and global-mobile-chrome.d.ts: the same plus an ambient `chrome`
 * - index.js and index.cjs: runtime stubs
 * - provenance.json: Firefox version and commit, schema tree hash, artifact hashes
 *
 * Namespace counts are logged at run time from the loaded schemas.
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

export function getFirefoxVersion(firefoxRoot) {
  const file = path.join(firefoxRoot, "browser", "config", "version.txt");
  if (!fs.existsSync(file)) {
    throw new Error(`Firefox version file not found: ${file}`);
  }
  const version = fs.readFileSync(file, "utf8").trim();
  if (!version) {
    throw new Error(`Firefox version file is empty: ${file}`);
  }
  return version;
}

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
  const firefoxVersion = getFirefoxVersion(firefoxRoot);
  const lastSchemaCommitSha = getLastSchemaCommitSha(firefoxRoot);
  const emitCommitHeader = Boolean(options.emitCommitHeader);

  console.log("=== Generating Firefox WebExtension Types (100% Schema Pure) ===");
  console.log(`Firefox Source      : ${firefoxRoot}`);
  console.log(`Firefox Version     : ${firefoxVersion}`);
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

  const write = (name, text) => fs.writeFileSync(path.join(outDir, name), text, "utf8");
  const namespacesFor = { desktop: desktopNs, mobile: mobileNs };
  const emitters = {};
  for (const target of ["desktop", "mobile"]) {
    emitters[target] = new TypeScriptEmitter({ target, commitSha, emitCommitHeader, surfaces: namespacesFor });
  }
  const gen = (target, mode, opts = {}) =>
    emitters[target].generate(namespacesFor[target], mode, { firefoxVersion, ...opts });

  // 1. Module declarations. Each has a .d.cts twin for the "require" condition.
  const moduleFiles = {
    "index": "desktop",
    "firefox-desktop": "desktop",
    "firefox-mobile": "mobile",
  };
  for (const [base, target] of Object.entries(moduleFiles)) {
    const dts = gen(target, "module");
    write(`${base}.d.ts`, dts);
    write(`${base}.d.cts`, dts);
    console.log(`   Emitted: ${base}.d.ts and ${base}.d.cts (${Object.keys(namespacesFor[target]).length} namespaces)`);
  }

  // 2. Chrome compatibility module (desktop)
  write("chrome.d.ts", gen("desktop", "chrome", { importSpecifier: "./index.js" }));
  write("chrome.d.cts", gen("desktop", "chrome", { importSpecifier: "./index.cjs" }));
  console.log("   Emitted: chrome.d.ts and chrome.d.cts (Chrome Compatibility)");

  // 3. Ambient globals. The base files declare `browser` only so they can sit
  // beside @types/chrome; the -chrome variants add an ambient `chrome`.
  const ambientFiles = { "global": "desktop", "global-mobile": "mobile" };
  for (const [base, target] of Object.entries(ambientFiles)) {
    write(`${base}.d.ts`, gen(target, "ambient"));
    write(
      `${base}-chrome.d.ts`,
      gen(target, "ambient-chrome", { ambientBase: `./${base}.d.ts` })
    );
    console.log(`   Emitted: ${base}.d.ts and ${base}-chrome.d.ts (Ambient Global, ${target})`);
  }

  // 5. Runtime stubs. Each export forwards to the live global at access
  // time, so a `browser` assigned after import (a test mock) is still seen.
  const liveGlobal = `function liveGlobal(name) {
  const current = () => globalThis[name];
  return new Proxy(Object.create(null), {
    get: (_, key) => {
      const target = current();
      return target == null ? undefined : Reflect.get(target, key, target);
    },
    has: (_, key) => {
      const target = current();
      return target != null && key in target;
    },
    ownKeys: () => {
      const target = current();
      return target == null ? [] : Reflect.ownKeys(target);
    },
    getOwnPropertyDescriptor: (_, key) => {
      const target = current();
      const descriptor = target == null ? undefined : Reflect.getOwnPropertyDescriptor(target, key);
      return descriptor && { ...descriptor, configurable: true };
    },
    set: (_, key, value) => {
      const target = current();
      return target != null && Reflect.set(target, key, value, target);
    },
    deleteProperty: (_, key) => {
      const target = current();
      return target != null && Reflect.deleteProperty(target, key);
    },
  });
}
`;
  const runtimeStubEsm =
    "// Runtime stand-ins for the types-only package: every property read goes\n" +
    "// to globalThis.browser or globalThis.chrome at access time.\n" +
    liveGlobal +
    'export const browser = liveGlobal("browser");\n' +
    'export const chrome = liveGlobal("chrome");\n' +
    "export default browser;\n";
  fs.writeFileSync(path.join(outDir, "index.js"), runtimeStubEsm, "utf8");

  const runtimeStubCjs =
    "// Runtime stand-ins for the types-only package (CommonJS): every property\n" +
    "// read goes to globalThis.browser or globalThis.chrome at access time.\n" +
    liveGlobal +
    'const browser = liveGlobal("browser");\n' +
    'const chrome = liveGlobal("chrome");\n' +
    "module.exports = { browser, chrome, default: browser };\n";
  fs.writeFileSync(path.join(outDir, "index.cjs"), runtimeStubCjs, "utf8");
  console.log("   Emitted: index.js and index.cjs (Runtime Stubs)");

  // 6. Write provenance.json
  const fileHash = (rel) => {
    const full = path.join(outDir, rel);
    return crypto.createHash("sha256").update(fs.readFileSync(full)).digest("hex");
  };

  const artifactNames = [
    "index.d.ts",
    "index.d.cts",
    "firefox-desktop.d.ts",
    "firefox-desktop.d.cts",
    "firefox-mobile.d.ts",
    "firefox-mobile.d.cts",
    "chrome.d.ts",
    "chrome.d.cts",
    "global.d.ts",
    "global-chrome.d.ts",
    "global-mobile.d.ts",
    "global-mobile-chrome.d.ts",
  ];
  const provenance = {
    firefoxVersion,
    firefoxCommit: commitSha,
    lastSchemaModifyingCommit: lastSchemaCommitSha,
    schemaTreeSha256,
    generatorVersion: "0.2.0",
    artifacts: Object.fromEntries(
      artifactNames.map((name) => [name, { sha256: fileHash(name) }])
    ),
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
