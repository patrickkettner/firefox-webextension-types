/**
 * independent-schema-loader.js - Clean-room schema universe reader
 *
 * Completely independent of src/. Reads Mozilla source tree schemas directly.
 */

import fs from "node:fs";
import path from "node:path";

function stripComments(raw) {
  const noBlock = raw.replace(/\/\*[\s\S]*?\*\//g, "");
  return noBlock
    .split(/\r?\n/)
    .filter((l) => !l.trim().startsWith("//"))
    .join("\n")
    .trim();
}

function parseJarFiles(jarPath, isAndroid = false) {
  if (!fs.existsSync(jarPath)) return [];
  const content = fs.readFileSync(jarPath, "utf8");
  const lines = content.split(/\r?\n/);
  const conditionStack = [true];
  const files = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("# This Source")) continue;

    if (trimmed.startsWith("#ifndef ANDROID")) {
      conditionStack.push(!isAndroid);
      continue;
    } else if (trimmed.startsWith("#ifdef ANDROID")) {
      conditionStack.push(isAndroid);
      continue;
    } else if (trimmed.startsWith("#ifndef")) {
      conditionStack.push(true);
      continue;
    } else if (trimmed.startsWith("#ifdef")) {
      conditionStack.push(false);
      continue;
    } else if (trimmed.startsWith("#if")) {
      conditionStack.push(true);
      continue;
    } else if (trimmed.startsWith("#else")) {
      if (conditionStack.length > 1) {
        conditionStack[conditionStack.length - 1] = !conditionStack[conditionStack.length - 1];
      }
      continue;
    } else if (trimmed.startsWith("#endif")) {
      if (conditionStack.length > 1) {
        conditionStack.pop();
      }
      continue;
    } else if (trimmed.startsWith("#")) {
      continue;
    }

    if (conditionStack.every(Boolean)) {
      const parts = trimmed.split(/\s+/);
      for (const part of parts) {
        if (part.endsWith(".json")) {
          files.push(path.basename(part));
        }
      }
    }
  }
  return files;
}

export function loadIndependentSchemaUniverse(firefoxRoot, target = "desktop") {
  const isAndroid = target === "mobile";
  const schemaFiles = [];

  // 1. Toolkit
  const tkDir = path.join(firefoxRoot, "toolkit", "components", "extensions", "schemas");
  const tkJar = path.join(tkDir, "jar.mn");
  for (const f of parseJarFiles(tkJar, isAndroid)) {
    const full = path.join(tkDir, f);
    if (!fs.existsSync(full)) {
      throw new Error(`Schema file declared in jar.mn not found: ${full}`);
    }
    schemaFiles.push(full);
  }

  // 2. Platform
  if (target === "desktop") {
    const brDir = path.join(firefoxRoot, "browser", "components", "extensions", "schemas");
    const brJar = path.join(brDir, "jar.mn");
    for (const f of parseJarFiles(brJar, false)) {
      const full = path.join(brDir, f);
      if (!fs.existsSync(full)) {
        throw new Error(`Schema file declared in jar.mn not found: ${full}`);
      }
      schemaFiles.push(full);
    }
  } else if (target === "mobile") {
    const mbDir = path.join(firefoxRoot, "mobile", "shared", "components", "extensions", "schemas");
    const mbJar = path.join(mbDir, "jar.mn");
    for (const f of parseJarFiles(mbJar, true)) {
      const full = path.join(mbDir, f);
      if (!fs.existsSync(full)) {
        throw new Error(`Schema file declared in jar.mn not found: ${full}`);
      }
      schemaFiles.push(full);
    }
  }

  const namespaces = new Map();
  let fnCount = 0;
  let evCount = 0;
  let typeCount = 0;
  let propCount = 0;

  for (const sf of schemaFiles) {
    const raw = fs.readFileSync(sf, "utf8");
    const clean = stripComments(raw);
    if (!clean || (clean[0] !== "[" && clean[0] !== "{")) continue;

    let entries;
    try {
      entries = JSON.parse(clean);
    } catch (err) {
      throw new Error(`Failed to parse schema JSON in ${sf}: ${err.message}`);
    }
    if (!Array.isArray(entries)) entries = [entries];

    for (const entry of entries) {
      const nsName = entry.namespace;
      if (!nsName) continue;

      if (!namespaces.has(nsName)) {
        namespaces.set(nsName, {
          name: nsName,
          imports: [],
          types: new Map(),
          functions: new Map(),
          events: new Map(),
          properties: new Map(),
        });
      }
      const ns = namespaces.get(nsName);

      if (entry.$import) {
        ns.imports.push(entry.$import);
      }

      if (Array.isArray(entry.types)) {
        for (const t of entry.types) {
          if (t.id) {
            ns.types.set(t.id, t);
            typeCount++;
          }
        }
      }

      if (Array.isArray(entry.functions)) {
        for (const fn of entry.functions) {
          if (fn.name) {
            ns.functions.set(fn.name, fn);
            fnCount++;
          }
        }
      }

      if (Array.isArray(entry.events)) {
        for (const ev of entry.events) {
          if (ev.name) {
            ns.events.set(ev.name, ev);
            evCount++;
          }
        }
      }

      if (entry.properties && typeof entry.properties === "object") {
        for (const [pName, pVal] of Object.entries(entry.properties)) {
          ns.properties.set(pName, pVal);
          propCount++;
        }
      }
    }
  }

  // Resolve namespace-level $import (e.g. browserAction -> action, contextMenus -> menus)
  let pending = true;
  while (pending) {
    pending = false;
    for (const [nsName, ns] of namespaces.entries()) {
      for (const superNsName of [...ns.imports]) {
        if (namespaces.has(superNsName)) {
          const superNs = namespaces.get(superNsName);
          for (const [tid, tval] of superNs.types.entries()) {
            if (!ns.types.has(tid)) {
              ns.types.set(tid, tval);
              typeCount++;
            }
          }
          for (const [fname, fval] of superNs.functions.entries()) {
            if (!ns.functions.has(fname)) {
              ns.functions.set(fname, fval);
              fnCount++;
            }
          }
          for (const [ename, evalue] of superNs.events.entries()) {
            if (!ns.events.has(ename)) {
              ns.events.set(ename, evalue);
              evCount++;
            }
          }
          for (const [pname, pval] of superNs.properties.entries()) {
            if (!ns.properties.has(pname)) {
              ns.properties.set(pname, pval);
              propCount++;
            }
          }
          ns.imports = ns.imports.filter((i) => i !== superNsName);
          pending = true;
        }
      }
    }
  }

  return {
    namespaces,
    schemaFileCount: schemaFiles.length,
    counts: {
      namespaces: namespaces.size,
      types: typeCount,
      functions: fnCount,
      events: evCount,
      properties: propCount,
    },
  };
}
