import fs from "node:fs";
import path from "node:path";
import { parseJarMn } from "./jar-parser.js";
import { codePointCompare, entryCodePointCompare } from "./comparator.js";

/**
 * Strips comments from raw schema JSON and returns the parsed object/array.
 *
 * @param {string} schemaPath - Absolute path to the schema JSON file.
 * @returns {[Array<Record<string, any>>, string]} Parsed schema entries and raw text.
 */
export function loadRawSchemaJson(schemaPath) {
  const rawText = fs.readFileSync(schemaPath, "utf8");

  // Strip multi-line block comments /* ... */
  const cleanComments = rawText.replace(/\/\*[\s\S]*?\*\//g, "");

  // Strip single-line comments // ...
  const lines = cleanComments
    .split(/\r?\n/)
    .filter((l) => !l.trim().startsWith("//"));
  const cleanText = lines.join("\n").trim();

  if (!cleanText || (cleanText[0] !== "[" && cleanText[0] !== "{")) {
    throw new Error(
      `Failed to parse schema JSON in ${schemaPath}: clean JSON does not start with '[' or '{'`
    );
  }

  let data;
  try {
    data = JSON.parse(cleanText);
  } catch (err) {
    throw new Error(`Failed to parse schema JSON in ${schemaPath}: ${err.message}`);
  }

  return [Array.isArray(data) ? data : [data], rawText];
}

export class LoadedNamespace {
  constructor(name, description = "", permissions = []) {
    this.name = name;
    this.description = description;
    this.permissions = Array.from(permissions);
    this.types = {};
    this.functions = {};
    this.events = {};
    this.properties = {};
    this.imports = [];
    this._extend_buffer = {};
  }
}

export class SchemaRegistry {
  constructor(firefoxRoot) {
    this.firefoxRoot = path.resolve(firefoxRoot);
    this.geckoRoot = this.firefoxRoot;
    this.toolkitDir = path.join(this.firefoxRoot, "toolkit", "components", "extensions", "schemas");
    this.browserDir = path.join(this.firefoxRoot, "browser", "components", "extensions", "schemas");
    this.mobileDir = path.join(this.firefoxRoot, "mobile", "shared", "components", "extensions", "schemas");
  }

  /**
   * Returns list of { path, tier } for target: 'desktop' or 'mobile'.
   *
   * @param {"desktop" | "mobile"} target
   * @returns {Array<{ path: string, tier: string }>}
   */
  getActiveSchemas(target) {
    const schemas = [];
    const isAndroid = target === "mobile";
    let manifestIndex = 0;

    // 1. Toolkit schemas
    const tkJar = path.join(this.toolkitDir, "jar.mn");
    if (!fs.existsSync(tkJar)) {
      throw new Error(`Primary toolkit schema manifest not found: ${tkJar}`);
    }
    const tkFiles = parseJarMn(tkJar, isAndroid);
    for (const fname of tkFiles) {
      const fpath = path.join(this.toolkitDir, fname);
      if (!fs.existsSync(fpath)) {
        throw new Error(`Schema file declared in jar.mn not found: ${fpath}`);
      }
      schemas.push({ path: fpath, tier: "toolkit", manifestIndex: manifestIndex++ });
    }

    // 2. Platform-specific schemas
    if (target === "desktop") {
      const brJar = path.join(this.browserDir, "jar.mn");
      if (!fs.existsSync(brJar)) {
        throw new Error(`Browser schema manifest not found: ${brJar}`);
      }
      const brFiles = parseJarMn(brJar, false);
      for (const fname of brFiles) {
        const fpath = path.join(this.browserDir, fname);
        if (!fs.existsSync(fpath)) {
          throw new Error(`Schema file declared in jar.mn not found: ${fpath}`);
        }
        schemas.push({ path: fpath, tier: "browser", manifestIndex: manifestIndex++ });
      }
    } else if (target === "mobile") {
      const mbJar = path.join(this.mobileDir, "jar.mn");
      if (!fs.existsSync(mbJar)) {
        throw new Error(`Mobile schema manifest not found: ${mbJar}`);
      }
      const mbFiles = parseJarMn(mbJar, true);
      for (const fname of mbFiles) {
        const fpath = path.join(this.mobileDir, fname);
        if (!fs.existsSync(fpath)) {
          throw new Error(`Schema file declared in jar.mn not found: ${fpath}`);
        }
        schemas.push({ path: fpath, tier: "mobile", manifestIndex: manifestIndex++ });
      }
    } else {
      throw new Error(`Unknown target '${target}': expected 'desktop' or 'mobile'`);
    }

    return schemas;
  }

  /**
   * Loads all active schemas for a target ('desktop' or 'mobile'),
   * handling namespace merging, $extend accumulation and resolution.
   *
   * @param {"desktop" | "mobile"} target
   * @returns {Record<string, LoadedNamespace>}
   */
  loadTarget(target) {
    const namespaces = {};
    const activeSchemas = this.getActiveSchemas(target);

    // Platform schemas override toolkit schemas with identical filename (e.g. tabs.json)
    // ECMA-262 compliant weak ordering: toolkit (0) < browser/mobile (1), preserved by manifestIndex
    const TIER_ORDER = { toolkit: 0, browser: 1, mobile: 1 };
    activeSchemas.sort((a, b) => {
      const diff = (TIER_ORDER[a.tier] ?? 99) - (TIER_ORDER[b.tier] ?? 99);
      if (diff !== 0) return diff;
      return (a.manifestIndex ?? 0) - (b.manifestIndex ?? 0);
    });

    for (const { path: schemaPath, tier } of activeSchemas) {
      const relPath = path.relative(this.firefoxRoot, schemaPath);
      const [rawEntries] = loadRawSchemaJson(schemaPath);

      for (const entry of rawEntries) {
        const nsName = entry.namespace;
        if (!nsName) continue;

        if (!namespaces[nsName]) {
          namespaces[nsName] = new LoadedNamespace(
            nsName,
            entry.description || "",
            entry.permissions || []
          );
        }
        const ns = namespaces[nsName];

        if (!ns.description && entry.description) {
          ns.description = entry.description;
        }

        if (Array.isArray(entry.permissions)) {
          for (const p of entry.permissions) {
            if (!ns.permissions.includes(p)) {
              ns.permissions.push(p);
            }
          }
        }

        if (entry.$import) {
          ns.imports.push(entry.$import);
        }

        if (Array.isArray(entry.types)) {
          for (const t of entry.types) {
            if (t.$extend) {
              const targetTypeId = t.$extend;
              if (ns.types[targetTypeId]) {
                const baseType = ns.types[targetTypeId];
                if (Array.isArray(t.choices) && Array.isArray(baseType.choices)) {
                  baseType.choices.push(...t.choices);
                } else if (Array.isArray(t.choices)) {
                  baseType.choices = structuredClone(t.choices);
                }
                if (t.properties && baseType.properties) {
                  Object.assign(baseType.properties, t.properties);
                } else if (t.properties) {
                  baseType.properties = structuredClone(t.properties);
                }
              } else {
                if (!ns._extend_buffer[targetTypeId]) {
                  ns._extend_buffer[targetTypeId] = [];
                }
                ns._extend_buffer[targetTypeId].push(t);
              }
            } else if (t.id) {
              const typeId = t.id;
              t._source_file = relPath;
              ns.types[typeId] = t;

              if (ns._extend_buffer[typeId]) {
                for (const ext of ns._extend_buffer[typeId]) {
                  if (Array.isArray(ext.choices) && Array.isArray(t.choices)) {
                    t.choices.push(...ext.choices);
                  } else if (Array.isArray(ext.choices)) {
                    t.choices = structuredClone(ext.choices);
                  }
                  if (ext.properties && t.properties) {
                    Object.assign(t.properties, ext.properties);
                  } else if (ext.properties) {
                    t.properties = structuredClone(ext.properties);
                  }
                }
                delete ns._extend_buffer[typeId];
              }
            }
          }
        }

        if (Array.isArray(entry.functions)) {
          for (const fn of entry.functions) {
            if (fn.name) {
              fn._source_file = relPath;
              ns.functions[fn.name] = fn;
            }
          }
        }

        if (Array.isArray(entry.events)) {
          for (const ev of entry.events) {
            if (ev.name) {
              ev._source_file = relPath;
              ns.events[ev.name] = ev;
            }
          }
        }

        if (entry.properties && typeof entry.properties === "object") {
          for (const [propName, propVal] of Object.entries(entry.properties)) {
            if (propVal && typeof propVal === "object") {
              propVal._source_file = relPath;
              ns.properties[propName] = propVal;
            }
          }
        }
      }
    }

    // Cross-namespace $extend draining (e.g. extending manifest.WebExtensionManifest)
    const sortedNsEntries = Object.entries(namespaces).sort(entryCodePointCompare);
    for (const [nsName, ns] of sortedNsEntries) {
      const sortedExtBuffer = Object.entries(ns._extend_buffer).sort(entryCodePointCompare);
      for (const [targetId, exts] of sortedExtBuffer) {
        for (const otherNs of Object.values(namespaces)) {
          if (otherNs.types[targetId]) {
            const base = otherNs.types[targetId];
            for (const ext of exts) {
              if (Array.isArray(ext.choices) && Array.isArray(base.choices)) {
                base.choices.push(...ext.choices);
              } else if (Array.isArray(ext.choices)) {
                base.choices = structuredClone(ext.choices);
              }
              if (ext.properties && base.properties) {
                Object.assign(base.properties, ext.properties);
              } else if (ext.properties) {
                base.properties = structuredClone(ext.properties);
              }
            }
            delete ns._extend_buffer[targetId];
            break;
          }
        }
      }
    }

    // Audit _extend_buffer for any unresolved extensions
    for (const [nsName, ns] of Object.entries(namespaces).sort(entryCodePointCompare)) {
      for (const [targetId, exts] of Object.entries(ns._extend_buffer).sort(entryCodePointCompare)) {
        if (exts && exts.length > 0) {
          process.emitWarning(
            `Unresolved $extend buffer for '${targetId}' in namespace '${nsName}' (${exts.length} extensions)`,
            "UserWarning"
          );
        }
      }
    }

    // Resolve namespace-level $import (e.g. browserAction -> action, contextMenus -> menus)
    let pendingImports = true;
    while (pendingImports) {
      pendingImports = false;
      for (const [nsName, ns] of Object.entries(namespaces).sort(entryCodePointCompare)) {
        for (const superNsName of [...ns.imports].sort(codePointCompare)) {
          if (namespaces[superNsName]) {
            const superNs = namespaces[superNsName];
            for (const [tid, tval] of Object.entries(superNs.types)) {
              if (!ns.types[tid]) {
                ns.types[tid] = structuredClone(tval);
              }
            }
            for (const [fname, fval] of Object.entries(superNs.functions)) {
              if (!ns.functions[fname]) {
                ns.functions[fname] = structuredClone(fval);
              }
            }
            for (const [ename, evalue] of Object.entries(superNs.events)) {
              if (!ns.events[ename]) {
                ns.events[ename] = structuredClone(evalue);
              }
            }
            for (const [pname, pval] of Object.entries(superNs.properties)) {
              if (!ns.properties[pname]) {
                ns.properties[pname] = structuredClone(pval);
              }
            }
            for (const p of superNs.permissions) {
              if (!ns.permissions.includes(p)) {
                ns.permissions.push(p);
              }
            }
            if (!ns.description && superNs.description) {
              ns.description = superNs.description;
            }
            ns.imports = ns.imports.filter((item) => item !== superNsName);
            pendingImports = true;
          }
        }
      }
    }

    // Resolve type-level and inline $import across all namespaces
    function findTypeDef(importPath, currentNs) {
      if (importPath.includes(".")) {
        const parts = importPath.split(".");
        const targetNsName = parts.slice(0, -1).join(".");
        const targetTid = parts[parts.length - 1];
        if (namespaces[targetNsName] && namespaces[targetNsName].types[targetTid]) {
          return namespaces[targetNsName].types[targetTid];
        }
      } else {
        if (currentNs.types[importPath]) {
          return currentNs.types[importPath];
        }
      }
      return null;
    }

    function resolveObjImports(obj, currentNs, depth = 0) {
      if (depth > 25 || !obj) return;
      if (typeof obj === "object" && !Array.isArray(obj)) {
        if (obj.$import) {
          const base = findTypeDef(obj.$import, currentNs);
          if (base) {
            resolveObjImports(base, currentNs, depth + 1);
            if (base.properties) {
              if (!obj.properties) obj.properties = {};
              for (const [pk, pv] of Object.entries(base.properties)) {
                if (!(pk in obj.properties)) {
                  obj.properties[pk] = structuredClone(pv);
                }
              }
            }
            if (Array.isArray(base.choices)) {
              if (!Array.isArray(obj.choices)) obj.choices = [];
              for (const ch of base.choices) {
                if (!obj.choices.some((existing) => JSON.stringify(existing) === JSON.stringify(ch))) {
                  obj.choices.push(structuredClone(ch));
                }
              }
            }
            if (base.patternProperties) {
              if (!obj.patternProperties) obj.patternProperties = {};
              for (const [ppk, ppv] of Object.entries(base.patternProperties)) {
                if (!(ppk in obj.patternProperties)) {
                  obj.patternProperties[ppk] = structuredClone(ppv);
                }
              }
            }
            if (!("type" in obj) && "type" in base) {
              obj.type = base.type;
            }
          }
        }

        for (const v of Object.values(obj)) {
          resolveObjImports(v, currentNs, depth + 1);
        }
      } else if (Array.isArray(obj)) {
        for (const item of obj) {
          resolveObjImports(item, currentNs, depth + 1);
        }
      }
    }

    for (const ns of Object.values(namespaces)) {
      for (const t of Object.values(ns.types)) {
        resolveObjImports(t, ns);
      }
      for (const fn of Object.values(ns.functions)) {
        resolveObjImports(fn, ns);
      }
      for (const ev of Object.values(ns.events)) {
        resolveObjImports(ev, ns);
      }
      for (const prop of Object.values(ns.properties)) {
        resolveObjImports(prop, ns);
      }
    }

    return namespaces;
  }
}
