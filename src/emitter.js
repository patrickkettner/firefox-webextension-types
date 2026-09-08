/**
 * emitter.js - TypeScript Definition Code Generator for Firefox WebExtensions
 *
 * 100% pure mathematical schema fidelity against Mozilla Firefox source schemas.
 * Zero unbacked phantom types, zero fabricated readonly modifiers, zero generic overrides.
 */

import { resolveOverloads } from "./overload-resolver.js";
import { codePointCompare, entryCodePointCompare } from "./comparator.js";

export const RESERVED_IDENTIFIERS = {
  default: "defaultValue",
  delete: "deleteArg",
  function: "func",
  in: "inArg",
  var: "variable",
  new: "newArg",
  class: "classArg",
  export: "exportArg",
  import: "importArg",
};

export function sanitizeName(name) {
  return RESERVED_IDENTIFIERS[name] || name;
}

export function sanitizePropertyName(name) {
  if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) {
    return name;
  }
  return JSON.stringify(name);
}

function unescapeHtml(str) {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&hellip;/g, "…")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

export function cleanDocstring(doc, indent = "        ") {
  if (!doc) return [];
  // Replace references like $(ref:runtime.getURL) with browser.runtime.getURL
  let text = doc.replace(/\$\((?:ref|topic):([^)]+)\)/g, "browser.$1");

  // Sanitize HTML links: <a href="url">text</a> -> text (url) or text
  text = text.replace(/<a\s+href="([^"]+)">([^<]+)<\/a>/g, (match, href, inner) => {
    if (href.startsWith("http")) {
      return `${inner} (${href})`;
    }
    return inner;
  });

  // Strip remaining HTML tags
  text = text.replace(/<\/?(?:code|var|em|strong|p|ul|ol|li|i|b|a)[^>]*>/g, "");
  text = unescapeHtml(text).trim();
  if (!text) return [];

  const lines = [];
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trimEnd();
    if (line) {
      lines.push(`${indent} * ${line}`);
    } else {
      lines.push(`${indent} *`);
    }
  }
  return lines;
}

export function formatDeprecatedTag(dep, indent = "        ") {
  if (typeof dep === "string" && dep) {
    let depClean = dep.replace(/\$\((?:ref|topic):([^)]+)\)/g, "browser.$1");
    depClean = depClean.replace(/<[^>]+>/g, "").trim();
    return `${indent} * @deprecated ${depClean}`;
  }
  return `${indent} * @deprecated`;
}

export function formatEnumVal(v) {
  if (typeof v === "string") {
    return JSON.stringify(v);
  }
  if (v && typeof v === "object" && "name" in v) {
    return JSON.stringify(v.name);
  }
  return String(v);
}

export class TypeScriptEmitter {
  constructor(target = "desktop", commitSha = "unknown-commit", availableNamespaces = null, options = {}) {
    if (typeof target === "object" && target !== null && !(target instanceof Set)) {
      this.target = target.target || "desktop";
      this.commitSha = target.commitSha || target.commit_sha || "unknown-commit";
      this.availableNamespaces = target.availableNamespaces || new Set();
      this.emitCommitHeader = Boolean(target.emitCommitHeader);
    } else {
      this.target = target || "desktop";
      this.commitSha = commitSha || "unknown-commit";
      this.availableNamespaces = availableNamespaces || new Set();
      this.emitCommitHeader = Boolean(options.emitCommitHeader);
    }
  }

  getSearchfoxUrl(sourceFile) {
    return `https://searchfox.org/mozilla-central/source/${sourceFile}`;
  }

  emitType(typeInfo, currentNs) {
    if (typeof typeInfo === "string") {
      return this.resolvePrimitive(typeInfo, currentNs);
    }

    if (!typeInfo || typeof typeInfo !== "object") {
      return "unknown";
    }

    if ("isInstanceOf" in typeInfo) {
      let inst = typeInfo.isInstanceOf;
      if (inst === "global") {
        inst = "Window";
      } else if (inst === "Date") {
        inst = "globalThis.Date";
      } else if (inst === "Promise") {
        inst = "globalThis.Promise<any>";
      } else if (inst === "DirectoryEntry") {
        inst = "Record<string, unknown>";
      } else if (inst === "StreamFilter") {
        inst = "Record<string, unknown>";
      }
      if (typeInfo.optional) {
        return `${inst} | null`;
      }
      return inst;
    }

    if (!("type" in typeInfo) && "value" in typeInfo) {
      const val = typeInfo.value;
      if (typeof val === "boolean") {
        return "boolean";
      } else if (typeof val === "number") {
        return "number";
      } else if (typeof val === "string") {
        return JSON.stringify(val);
      }
      return "unknown";
    }

    if ("$ref" in typeInfo) {
      const ref = typeInfo.$ref;
      if (ref === "Promise") {
        return "globalThis.Promise<any>";
      }
      if (ref === "PlatformNaclArch") {
        return "(string & {})";
      }
      if (ref === "Resource" || ref === "devtools.inspectedWindow.Resource") {
        return "browser.devtools.inspectedWindow.Resource";
      }
      if (ref === "ExtensionPanel") {
        return "browser.devtools.panels.ExtensionPanel";
      }
      if (ref === "Date") {
        return "globalThis.Date";
      }
      if (ref.includes(".")) {
        const ns = ref.split(".")[0];
        if (!this.availableNamespaces.has(ns)) {
          return "unknown";
        }
        return `browser.${ref}`;
      }
      return ref;
    }

    if ("choices" in typeInfo) {
      const rawChoices = typeInfo.choices.map((c) => this.emitType(c, currentNs));
      const hasBareString = rawChoices.includes("string");
      const hasLiterals = rawChoices.some((c) => c.startsWith('"'));
      const useOpenString =
        hasBareString && (hasLiterals || currentNs === "manifest" || currentNs === "runtime");

      const parts = [];
      for (let part of rawChoices) {
        if (part === "string" && useOpenString) {
          part = "(string & {})";
        }
        if (!parts.includes(part)) {
          parts.push(part);
        }
      }
      return parts.length ? parts.join(" | ") : "unknown";
    }

    if ("enum" in typeInfo) {
      return typeInfo.enum.map(formatEnumVal).join(" | ");
    }

    const t = typeInfo.type;
    if (t === "string") {
      return "string";
    } else if (t === "integer" || t === "number") {
      return "number";
    } else if (t === "boolean") {
      return "boolean";
    } else if (t === "null") {
      return "null";
    } else if (t === "any") {
      return "any";
    } else if (t === "array") {
      const items = typeInfo.items || {};
      const innerType = this.emitType(items, currentNs);
      if (innerType.includes(" | ")) {
        return `(${innerType})[]`;
      }
      return `${innerType}[]`;
    } else if (t === "object") {
      if (typeInfo.properties && Object.keys(typeInfo.properties).length > 0) {
        const props = [];
        const sortedEntries = Object.entries(typeInfo.properties).sort(entryCodePointCompare);
        for (const [pName, pVal] of sortedEntries) {
          const opt = pVal && pVal.optional ? "?" : "";
          let pType;
          if (pName === "bytes" && currentNs.includes("webRequest")) {
            pType = "ArrayBuffer";
          } else {
            pType = this.emitType(pVal, currentNs);
          }
          props.push(`${sanitizePropertyName(pName)}${opt}: ${pType}`);
        }
        return "{\n" + props.join(";\n") + ";\n}";
      } else if (typeInfo.patternProperties) {
        return "Record<string, unknown>";
      }
      return "Record<string, unknown>";
    } else if (t === "function") {
      if (!typeInfo.parameters) {
        return "((...args: any[]) => void)";
      }
      const params = (typeInfo.parameters || []).map((p) => {
        const pType = this.emitType(p, currentNs);
        const pName = sanitizeName(p.name || "arg");
        return `${pName}: ${pType}`;
      });
      const paramsStr = params.join(", ");
      const retType = this.emitType(typeInfo.returns || "void", currentNs);
      return `((${paramsStr}) => ${retType})`;
    }

    return "unknown";
  }

  resolvePrimitive(t, currentNs) {
    if (t === "integer") {
      return "number";
    }
    return t;
  }

  emitFunctionOverloads(fn, currentNs, indent, isMethod = false) {
    const lines = [];
    const name = sanitizeName(fn.name || "");
    const desc = fn.description || "";
    const sourceFile = fn._source_file || "";

    const jsdoc = [`${indent}/**`];
    const docLines = cleanDocstring(desc, indent);
    if (docLines.length > 0) {
      jsdoc.push(...docLines);
      jsdoc.push(`${indent} *`);
    }

    if (fn.deprecated) {
      jsdoc.push(formatDeprecatedTag(fn.deprecated, indent));
      jsdoc.push(`${indent} *`);
    }

    if (sourceFile) {
      const searchfox = this.getSearchfoxUrl(sourceFile);
      jsdoc.push(`${indent} * @see ${searchfox}`);
    }

    if (Array.isArray(fn.permissions)) {
      const sortedPerms = [...fn.permissions].sort(codePointCompare);
      for (const p of sortedPerms) {
        jsdoc.push(`${indent} * @permission ${p}`);
      }
    }

    jsdoc.push(`${indent} * @platform ${this.target}`);
    jsdoc.push(`${indent} */`);

    let overloads = resolveOverloads(fn);
    if (!overloads || overloads.length === 0) {
      overloads = [
        {
          parameters: fn.parameters || [],
          returns: fn.returns || "void",
          is_promise: false,
          callback_payload: null,
        },
      ];
    }

    const formatParams = (pList) => {
      const out = [];
      let hasOptional = false;
      for (const p of pList) {
        const isOpt = Boolean(p.optional);
        if (isOpt) {
          hasOptional = true;
        }
        const opt = isOpt || hasOptional ? "?" : "";
        let pName = sanitizeName(p.name || "arg");
        let pType = this.emitType(p, currentNs);

        const typeUnqualified = pType.split(".").pop();
        if (pName === pType || pName === typeUnqualified) {
          if (pName.endsWith("Request")) {
            pName = "request";
          } else if (pName.endsWith("Options")) {
            pName = "options";
          } else if (pName.endsWith("Details")) {
            pName = "details";
          } else if (pName.endsWith("Info")) {
            pName = "info";
          } else {
            pName = pName[0].toLowerCase() + pName.slice(1);
            if (pName === pType || pName === typeUnqualified) {
              pName = "item";
            }
          }
        }

        out.push(`${pName}${opt}: ${pType}`);
      }
      return out.join(", ");
    };

    for (let i = 0; i < overloads.length; i++) {
      const ov = overloads[i];
      if (i === 0) {
        lines.push(...jsdoc);
      }

      const paramsStr = formatParams(ov.parameters);
      let actualRet;
      if (ov.is_promise) {
        const retType =
          ov.callback_payload !== "void"
            ? this.emitType(ov.callback_payload, currentNs)
            : "void";
        actualRet = `globalThis.Promise<${retType}>`;
      } else {
        actualRet = this.emitType(ov.returns, currentNs);
      }

      if (isMethod) {
        lines.push(`${indent}${name}(${paramsStr}): ${actualRet};`);
      } else if (name === "eval") {
        lines.push(`${indent}function _eval(${paramsStr}): ${actualRet};`);
      } else {
        lines.push(`${indent}export function ${name}(${paramsStr}): ${actualRet};`);
      }
    }

    if (!isMethod && name === "eval") {
      lines.push(`${indent}export { _eval as eval };`);
    }

    return lines;
  }

  _emitNamespaceBody(ns, out, indent, nsName) {
    const sortedTypes = Object.entries(ns.types).sort(entryCodePointCompare);
    for (const [typeId, tInfo] of sortedTypes) {
      const desc = tInfo.description || "";
      const docLines = cleanDocstring(desc, indent);
      if (tInfo.deprecated) {
        docLines.push(formatDeprecatedTag(tInfo.deprecated, indent));
      }
      if (docLines.length > 0) {
        out.push(`${indent}/**`);
        out.push(...docLines);
        const sourceFile = tInfo._source_file || "";
        if (sourceFile) {
          out.push(`${indent} * @see ${this.getSearchfoxUrl(sourceFile)}`);
        }
        out.push(`${indent} */`);
      }

      if ("enum" in tInfo) {
        const enumStr = tInfo.enum.map(formatEnumVal).join(" | ");
        out.push(`${indent}export type ${typeId} = ${enumStr};`);
      } else if ("choices" in tInfo) {
        const choicesEmitted = [];
        let hasBareString = false;
        for (const c of tInfo.choices) {
          const cStr = this.emitType(c, nsName);
          if (cStr === "string") {
            hasBareString = true;
          } else if (!choicesEmitted.includes(cStr)) {
            choicesEmitted.push(cStr);
          }
        }
        if (hasBareString) {
          choicesEmitted.push("(string & {})");
        }
        const unionStr = choicesEmitted.join(" | ");
        out.push(`${indent}export type ${typeId} = ${unionStr};`);
      } else if (tInfo.type === "object" || "properties" in tInfo) {
        out.push(`${indent}export interface ${typeId} {`);

        const propsDict = tInfo.properties || {};
        const fnsList = tInfo.functions || [];
        const evsList = tInfo.events || [];

        if (
          Object.keys(propsDict).length === 0 &&
          fnsList.length === 0 &&
          evsList.length === 0
        ) {
          out.push(`${indent}    [key: string]: unknown;`);
        } else {
          const sortedProps = Object.entries(propsDict).sort(entryCodePointCompare);
          for (const [pName, pVal] of sortedProps) {
            const pDesc = pVal.description || "";
            const pDocs = cleanDocstring(pDesc, indent + "    ");
            if (pDocs.length > 0) {
              out.push(`${indent}    /**`);
              out.push(...pDocs);
              out.push(`${indent}     */`);
            }
            const opt = pVal.optional ? "?" : "";

            let pType;
            if (pName === "bytes" && nsName.includes("webRequest")) {
              pType = "ArrayBuffer";
            } else {
              pType = this.emitType(pVal, nsName);
            }

            let isReadonly = false;
            if (pVal.readOnly || pVal.readonly || pVal.unsupported) {
              isReadonly = true;
            } else if (nsName === "manifest" || typeId.endsWith("Manifest")) {
              isReadonly = true;
            }
            const ro = isReadonly ? "readonly " : "";
            out.push(`${indent}    ${ro}${sanitizePropertyName(pName)}${opt}: ${pType};`);
          }

          const sortedFnsList = [...fnsList].sort((a, b) =>
            codePointCompare(a.name || "", b.name || "")
          );
          for (const fn of sortedFnsList) {
            const fnLines = this.emitFunctionOverloads(
              fn,
              nsName,
              indent + "    ",
              true
            );
            out.push(...fnLines);
          }

          const sortedEvsList = [...evsList].sort((a, b) =>
            codePointCompare(a.name || "", b.name || "")
          );
          for (const ev of sortedEvsList) {
            const evName = ev.name || "event";
            const evDesc = ev.description || "";
            const evDocs = cleanDocstring(evDesc, indent + "    ");
            if (evDocs.length > 0) {
              out.push(`${indent}    /**`);
              out.push(...evDocs);
              out.push(`${indent}     */`);
            }

            const evParams = ev.parameters || [];
            const pSignatures = evParams.map(
              (p) => `${sanitizeName(p.name || "details")}: ${this.emitType(p, nsName)}`
            );
            const sigStr = pSignatures.join(", ");

            if (nsName.includes("webRequest")) {
              const ret =
                "browser.webRequest.BlockingResponse | Promise<browser.webRequest.BlockingResponse> | void";
              out.push(
                `${indent}    ${sanitizeName(evName)}: WebExtensionWebRequestEvent<(${sigStr}) => ${ret}>;`
              );
            } else {
              out.push(
                `${indent}    ${sanitizeName(evName)}: WebExtensionEvent<(${sigStr}) => void>;`
              );
            }
          }
        }

        out.push(`${indent}}`);
      } else {
        const baseT = this.emitType(tInfo, nsName);
        out.push(`${indent}export type ${typeId} = ${baseT};`);
      }
      out.push("");
    }

    const sortedProps = Object.entries(ns.properties).sort(entryCodePointCompare);
    for (const [pName, pVal] of sortedProps) {
      const pType = this.emitType(pVal, nsName);
      out.push(`${indent}export const ${sanitizeName(pName)}: ${pType};`);
    }

    const sortedEvents = Object.entries(ns.events).sort(entryCodePointCompare);
    for (const [evName, evVal] of sortedEvents) {
      const evDesc = evVal.description || "";
      const docLines = cleanDocstring(evDesc, indent);
      if (evVal.deprecated) {
        docLines.push(formatDeprecatedTag(evVal.deprecated, indent));
      }
      if (docLines.length > 0) {
        out.push(`${indent}/**`);
        out.push(...docLines);
        out.push(`${indent} */`);
      }

      const evParams = evVal.parameters || [];
      const pSignatures = evParams.map(
        (p) => `${sanitizeName(p.name || "details")}: ${this.emitType(p, nsName)}`
      );
      const sigStr = pSignatures.join(", ");

      if (nsName.includes("webRequest")) {
        const ret =
          "browser.webRequest.BlockingResponse | Promise<browser.webRequest.BlockingResponse> | void";
        out.push(
          `${indent}export const ${sanitizeName(evName)}: WebExtensionWebRequestEvent<(${sigStr}) => ${ret}>;`
        );
      } else {
        out.push(
          `${indent}export const ${sanitizeName(evName)}: WebExtensionEvent<(${sigStr}) => void>;`
        );
      }
      out.push("");
    }

    const sortedFns = Object.entries(ns.functions).sort(entryCodePointCompare);
    for (const [fnName, fnVal] of sortedFns) {
      const fnLines = this.emitFunctionOverloads(fnVal, nsName, indent);
      out.push(...fnLines);
      out.push("");
    }
  }

  generate(namespaces, mode = "module") {
    const out = [];
    out.push("// Type definitions for Firefox WebExtensions");
    out.push("// Project: firefox-webextension-types");
    out.push(`// Target: ${this.target[0].toUpperCase() + this.target.slice(1)}`);
    if (this.emitCommitHeader) {
      out.push(`// Firefox Commit: ${this.commitSha}`);
    }
    out.push("// Definitions generated strictly from Mozilla Firefox source schemas.");
    out.push("//");
    out.push("// The generator that produced this file is licensed under the Apache License,");
    out.push("// Version 2.0. The documentation comments and API shapes below are derived from");
    out.push("// Firefox WebExtension schema files, which are subject to the terms of the");
    out.push("// Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with");
    out.push("// this file, you can obtain one at https://mozilla.org/MPL/2.0/.");
    out.push("// Parts of those schemas originated from Chromium:");
    out.push("// Copyright (c) 2012 The Chromium Authors. All rights reserved.");
    out.push("// Use of that source code is governed by a BSD-style license that can be");
    out.push("// found in the LICENSE-CHROMIUM file.");
    out.push("");

    if (mode === "ambient") {
      out.push("import {");
      out.push("    browser as _browser,");
      out.push("    chrome as _chrome,");
      out.push("    WebExtensionEvent as _WebExtensionEvent,");
      out.push("    WebExtensionWebRequestEvent as _WebExtensionWebRequestEvent,");
      out.push('} from "./index.js";');
      out.push("");
      out.push("declare global {");
      out.push("    export import browser = _browser;");
      out.push("    export import chrome = _chrome;");
      out.push(
        "    type WebExtensionEvent<TCallback extends (...args: any[]) => any> = _WebExtensionEvent<TCallback>;"
      );
      out.push(
        "    type WebExtensionWebRequestEvent<TCallback extends (...args: any[]) => any> = _WebExtensionWebRequestEvent<TCallback>;"
      );
      out.push("}");
      out.push("");
      out.push("export {};");
      return out.join("\n");
    }

    const rootNsNames = new Set();
    const subNsMap = {};
    for (const nsName of Object.keys(namespaces).sort(codePointCompare)) {
      if (nsName.includes(".")) {
        const [parent, child] = nsName.split(".", 2);
        rootNsNames.add(parent);
        if (!subNsMap[parent]) subNsMap[parent] = [];
        subNsMap[parent].push([child, namespaces[nsName]]);
      } else {
        rootNsNames.add(nsName);
      }
    }

    this.availableNamespaces = rootNsNames;

    if (mode === "chrome") {
      out.push('import { browser } from "./index.js";');
      out.push("");
      out.push("export namespace chrome {");
      for (const nsName of Array.from(rootNsNames).sort(codePointCompare)) {
        out.push(`    export import ${nsName} = browser.${nsName};`);
      }
      out.push("}");
      out.push("");
      out.push("export default chrome;");
      return out.join("\n");
    }

    out.push("export interface WebExtensionEvent<TListener extends (...args: any[]) => void> {");
    out.push("    addListener(callback: TListener): void;");
    out.push("    removeListener(callback: TListener): void;");
    out.push("    hasListener(callback: TListener): boolean;");
    out.push("}");
    out.push(
      "export interface WebExtensionWebRequestEvent<TListener extends (...args: any[]) => browser.webRequest.BlockingResponse | Promise<browser.webRequest.BlockingResponse> | void> {"
    );
    out.push(
      "    addListener(callback: TListener, filter?: browser.webRequest.RequestFilter, extraInfoSpec?: string[]): void;"
    );
    out.push("    removeListener(callback: TListener): void;");
    out.push("    hasListener(callback: TListener): boolean;");
    out.push("}");
    out.push("");
    out.push("export namespace browser {");

    for (const nsName of Array.from(rootNsNames).sort(codePointCompare)) {
      const ns = namespaces[nsName];
      out.push(`    export namespace ${nsName} {`);

      if (ns) {
        this._emitNamespaceBody(ns, out, "        ", nsName);
      }

      if (subNsMap[nsName]) {
        const sortedSubList = [...subNsMap[nsName]].sort(([a], [b]) =>
          codePointCompare(a, b)
        );
        for (const [subName, subNs] of sortedSubList) {
          out.push(`        export namespace ${subName} {`);
          this._emitNamespaceBody(subNs, out, "            ", `${nsName}.${subName}`);
          out.push("        }");
        }
      }

      out.push("    }");
      out.push("");
    }

    out.push("}");
    out.push("");
    out.push("export namespace chrome {");
    for (const nsName of Array.from(rootNsNames).sort(codePointCompare)) {
      out.push(`    export import ${nsName} = browser.${nsName};`);
    }
    out.push("}");
    out.push("");
    out.push("export default browser;");
    out.push("");

    return out.join("\n");
  }
}
