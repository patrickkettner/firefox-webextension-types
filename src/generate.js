#!/usr/bin/env node
/**
 * Builds dist/ from a Firefox checkout:
 * - index.d.ts, firefox-desktop.d.ts, firefox-mobile.d.ts, chrome.d.ts, each with a
 *   .d.cts twin so the package.json "require" condition resolves CommonJS-flavored
 *   declarations
 * - global.d.ts and global-mobile.d.ts: ambient `browser` only
 * - global-chrome.d.ts and global-mobile-chrome.d.ts: the same plus an ambient `chrome`
 * - chrome-mv2.d.ts (with a .d.cts twin), global-chrome-mv2.d.ts and
 *   global-mobile-chrome-mv2.d.ts: `chrome` as a Manifest V2 extension page
 *   has it, with callback-only async functions
 * - user-script.d.ts (with a .d.cts twin) and global-user-script.d.ts: the
 *   `browser` and `chrome` of a user script
 * - index.js and index.cjs: runtime stubs
 * - provenance.json: Firefox version and commit, schema tree hash, artifact hashes
 */

import { execSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

import { resolveFirefoxPath } from "./firefox-root.js";
import { SchemaRegistry } from "./schema-loader.js";
import { TypeScriptEmitter } from "./emitter.js";
import { codePointCompare } from "./comparator.js";
import { EVENT_LISTENER_RETURNS, EVENT_TYPES, NORMALIZED_FILLS, SET_PROPERTIES } from "./overrides.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJ_ROOT = path.resolve(__dirname, "..");
const { version: GENERATOR_VERSION } = JSON.parse(fs.readFileSync(path.join(PROJ_ROOT, "package.json"), "utf8"));

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

function getFirefoxVersion(firefoxRoot) {
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

function getLastSchemaCommitSha(firefoxRoot) {
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

function computeSchemaTreeSha256(firefoxRoot, targetSchemas) {
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

  console.log(`Firefox ${firefoxVersion} at ${firefoxRoot}`);
  console.log(`Commit ${commitSha}, schemas last changed in ${lastSchemaCommitSha}`);
  console.log(`Writing to ${outDir}${emitCommitHeader ? ", with the commit in each header" : ""}`);

  const registry = new SchemaRegistry(firefoxRoot);

  const desktopSchemas = registry.getActiveSchemas("desktop");
  const mobileSchemas = registry.getActiveSchemas("mobile");
  const allSchemas = [...desktopSchemas, ...mobileSchemas];
  const schemaTreeSha256 = computeSchemaTreeSha256(firefoxRoot, allSchemas);
  console.log(`Schema tree SHA-256 ${schemaTreeSha256}`);

  const desktopNs = registry.loadTarget("desktop");
  const mobileNs = registry.loadTarget("mobile");
  console.log(`${Object.keys(desktopNs).length} desktop and ${Object.keys(mobileNs).length} mobile namespaces`);

  const write = (name, text) => fs.writeFileSync(path.join(outDir, name), text, "utf8");
  const namespacesFor = { desktop: desktopNs, mobile: mobileNs };
  const emitters = {};
  for (const target of ["desktop", "mobile"]) {
    emitters[target] = new TypeScriptEmitter({ target, commitSha, emitCommitHeader, surfaces: namespacesFor });
  }
  const gen = (target, mode, opts = {}) =>
    emitters[target].generate(namespacesFor[target], mode, { firefoxVersion, ...opts });

  // Module declarations. Each has a .d.cts twin for the "require" condition.
  const moduleFiles = {
    "index": "desktop",
    "firefox-desktop": "desktop",
    "firefox-mobile": "mobile",
  };
  for (const [base, target] of Object.entries(moduleFiles)) {
    const dts = gen(target, "module");
    write(`${base}.d.ts`, dts);
    write(`${base}.d.cts`, dts);
    console.log(`Wrote ${base}.d.ts and ${base}.d.cts`);
  }

  for (const [qualified, paths] of Object.entries(NORMALIZED_FILLS)) {
    for (const p of paths) {
      if (!Object.values(emitters).some((e) => e.filledPaths.has(`${qualified} ${p}`))) {
        throw new Error(`NORMALIZED_FILLS ${qualified}: ${p} names no property in the schemas. Update or delete it in src/overrides.js.`);
      }
    }
  }

  for (const key of SET_PROPERTIES) {
    if (!Object.values(emitters).some((e) => e.setProperties.has(key))) {
      throw new Error(`SET_PROPERTIES ${key} names no event argument property in the schemas. Update or delete it in src/overrides.js.`);
    }
  }

  for (const key of new Set([...Object.keys(EVENT_LISTENER_RETURNS), ...Object.keys(EVENT_TYPES)])) {
    if (!Object.values(emitters).some((e) => e.returnsUsed.has(key))) {
      throw new Error(`EVENT_LISTENER_RETURNS ${key} names no event in the schemas, or EVENT_TYPES names an event it does not. Update or delete it in src/overrides.js.`);
    }
  }

  write("chrome.d.ts", gen("desktop", "chrome", { importSpecifier: "./index.js" }));
  write("chrome.d.cts", gen("desktop", "chrome", { importSpecifier: "./index.cjs" }));
  console.log("Wrote chrome.d.ts and chrome.d.cts");
  write("chrome-mv2.d.ts", gen("desktop", "chrome-mv2", { importSpecifier: "./index.js" }));
  write("chrome-mv2.d.cts", gen("desktop", "chrome-mv2", { importSpecifier: "./index.cjs" }));
  console.log("Wrote chrome-mv2.d.ts and chrome-mv2.d.cts");
  write("user-script.d.ts", gen("desktop", "user-script", { importSpecifier: "./index.js" }));
  write("user-script.d.cts", gen("desktop", "user-script", { importSpecifier: "./index.cjs" }));
  write("global-user-script.d.ts", gen("desktop", "ambient-user-script", { importSpecifier: "./index.js" }));
  console.log("Wrote user-script.d.ts, user-script.d.cts and global-user-script.d.ts");

  // Ambient globals. The base files declare `browser` only so they can sit
  // beside @types/chrome. The -chrome variants add an ambient `chrome`.
  const ambientFiles = { "global": "desktop", "global-mobile": "mobile" };
  for (const [base, target] of Object.entries(ambientFiles)) {
    write(`${base}.d.ts`, gen(target, "ambient"));
    write(
      `${base}-chrome.d.ts`,
      gen(target, "ambient-chrome", { ambientBase: `./${base}.d.ts` })
    );
    write(`${base}-chrome-mv2.d.ts`, gen(target, "ambient-chrome-mv2", { ambientBase: `./${base}.d.ts` }));
    console.log(`Wrote ${base}.d.ts, ${base}-chrome.d.ts and ${base}-chrome-mv2.d.ts`);
  }

  // Runtime stubs. Each export forwards to the live global at access
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
  console.log("Wrote index.js and index.cjs");

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
    "chrome-mv2.d.ts",
    "chrome-mv2.d.cts",
    "global.d.ts",
    "global-chrome.d.ts",
    "global-chrome-mv2.d.ts",
    "global-mobile.d.ts",
    "global-mobile-chrome.d.ts",
    "global-mobile-chrome-mv2.d.ts",
    "user-script.d.ts",
    "user-script.d.cts",
    "global-user-script.d.ts",
  ];
  const provenance = {
    firefoxVersion,
    firefoxCommit: commitSha,
    lastSchemaModifyingCommit: lastSchemaCommitSha,
    schemaTreeSha256,
    generatorVersion: GENERATOR_VERSION,
    artifacts: Object.fromEntries(
      artifactNames.map((name) => [name, { sha256: fileHash(name) }])
    ),
  };
  fs.writeFileSync(
    path.join(outDir, "provenance.json"),
    JSON.stringify(provenance, null, 2) + "\n",
    "utf8"
  );
  console.log("Wrote provenance.json");
}

function main() {
  const { values } = parseArgs({
    options: {
      "firefox-source": { type: "string" },
      "out-dir": { type: "string" },
    },
    strict: false,
  });

  const firefoxRoot = resolveFirefoxPath(values["firefox-source"]);
  const outDir = values["out-dir"] || path.join(PROJ_ROOT, "dist");

  buildDeclarations(firefoxRoot, outDir);
}

// Run directly if invoked from CLI
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
