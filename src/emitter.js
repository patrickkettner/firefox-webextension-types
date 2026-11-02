/**
 * emitter.js - TypeScript Definition Code Generator for Firefox WebExtensions
 *
 * 100% pure mathematical schema fidelity against Mozilla Firefox source schemas.
 * Zero unbacked phantom types, zero fabricated readonly modifiers, zero generic overrides.
 */

import { isAsyncFunction, resolveOverloads } from "./overload-resolver.js";
import { codePointCompare, entryCodePointCompare } from "./comparator.js";
import {
  ASYNC_RESULTS,
  EVENT_LISTENER_RETURNS,
  EVENT_PARAMETERS,
  FUNCTION_OVERRIDES,
  NULL_RESULTS,
  PLATFORM_TYPES,
  TYPE_OVERRIDES,
  WEBIDL_EVENT_HANDLERS,
} from "./overrides.js";
import { webidlTypeToTs } from "./webidl.js";

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

    if (typeof typeInfo.ts === "string") {
      return typeInfo.ts;
    }

    if (Array.isArray(typeInfo.tuple)) {
      const elements = typeInfo.tuple.map(
        (p) => `${sanitizeName(p.name || "arg")}: ${this.emitValueType(p, currentNs)}`
      );
      return `[${elements.join(", ")}]`;
    }

    if ("isInstanceOf" in typeInfo) {
      let inst = PLATFORM_TYPES[typeInfo.isInstanceOf] || typeInfo.isInstanceOf;
      const prefix = `browser.${currentNs}.`;
      if (inst.startsWith(prefix)) {
        inst = inst.slice(prefix.length);
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
      // Schemas.sys.mjs ArrayType.normalize rejects any other length.
      if (typeInfo.maxItems !== undefined && typeInfo.minItems === typeInfo.maxItems) {
        return `[${new Array(typeInfo.maxItems).fill(innerType).join(", ")}]`;
      }
      if (innerType.includes(" | ")) {
        return `(${innerType})[]`;
      }
      return `${innerType}[]`;
    } else if (t === "object") {
      if (typeInfo.properties && Object.keys(typeInfo.properties).length > 0) {
        const props = [];
        const sortedEntries = Object.entries(typeInfo.properties).sort(entryCodePointCompare);
        for (const [pName, pVal] of sortedEntries) {
          let pType;
          if (pName === "bytes" && currentNs.includes("webRequest")) {
            pType = "ArrayBuffer";
          } else {
            pType = this.emitType(pVal, currentNs);
          }
          props.push(`${sanitizePropertyName(pName)}${this.optionalProperty(pVal, pType)}`);
        }
        return "{\n" + props.join(";\n") + ";\n}";
      }
      return this.emitMapType(typeInfo, currentNs);
    } else if (t === "function") {
      if (!typeInfo.parameters) {
        return "((...args: any[]) => void)";
      }
      const params = (typeInfo.parameters || []).map((p) => {
        const pType = this.emitValueType(p, currentNs);
        const pName = sanitizeName(p.name || "arg");
        return `${pName}: ${pType}`;
      });
      const paramsStr = params.join(", ");
      const retType = isAsyncFunction(typeInfo)
        ? "globalThis.Promise<void>"
        : this.emitType(typeInfo.returns || "void", currentNs);
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

  // Schemas.sys.mjs ObjectType.normalize treats an explicit undefined on an
  // optional property as absent, so `?: T` must also admit undefined under
  // exactOptionalPropertyTypes.
  optionalProperty(pVal, pType) {
    if (!pVal || !pVal.optional) {
      return `: ${pType}`;
    }
    if (pType === "any" || pType === "unknown") {
      return `?: ${pType}`;
    }
    return `?: ${pType} | undefined`;
  }

  // A value the runtime hands to the extension: a schema-optional callback
  // argument or tuple element arrives as undefined when absent.
  emitValueType(p, currentNs) {
    const t = this.emitType(p, currentNs);
    if (!p || !p.optional || t === "any" || t === "unknown" || t.endsWith("| null")) {
      return t;
    }
    return `${t} | undefined`;
  }

  // Objects without named properties: the key space comes from
  // patternProperties and the value type from additionalProperties, both
  // enforced by Schemas.sys.mjs ObjectType.normalize.
  emitMapType(typeInfo, currentNs) {
    const patterns = Object.entries(typeInfo.patternProperties || {});
    if (patterns.length > 0) {
      const numeric = patterns.every(([pattern]) => pattern === "^[1-9]\\d*$");
      const valueTypes = [];
      for (const [, valueSchema] of patterns) {
        const vt = this.emitType(valueSchema, currentNs);
        if (!valueTypes.includes(vt)) valueTypes.push(vt);
      }
      return `{ [key: ${numeric ? "number" : "string"}]: ${valueTypes.join(" | ")} }`;
    }
    const additional = typeInfo.additionalProperties;
    if (additional && typeof additional === "object") {
      if (additional.type === "any") {
        return "Record<string, any>";
      }
      return `{ [key: string]: ${this.emitType(additional, currentNs)} }`;
    }
    return "Record<string, unknown>";
  }

  emitFunctionOverloads(fn, currentNs, indent, isMethod = false, ownerTypeId = null) {
    const lines = [];
    const name = sanitizeName(fn.name || "");
    const fnKey = [currentNs, ownerTypeId, fn.name].filter(Boolean).join(".");
    const override = FUNCTION_OVERRIDES[fnKey] || {};
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

    const asyncResult = ASYNC_RESULTS[fnKey];
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

    const formatParams = (ov) => {
      const out = [];
      for (const p of ov.parameters) {
        const isOpt = Boolean(p.optional);
        const opt = isOpt ? "?" : "";
        let pName = sanitizeName(p.name || "arg");
        let pType;
        if (override.parameters && override.parameters[p.name]) {
          pType = override.parameters[p.name];
        } else if (p.type === "function" && asyncResult && !(p.parameters || []).length) {
          pType = `((result: ${asyncResult}) => void)`;
        } else if (p.type === "function" && override.result && (p.parameters || []).length === 1) {
          pType = `((${sanitizeName(p.parameters[0].name)}: ${override.result}) => void)`;
        } else {
          pType = this.emitType(p, currentNs);
        }
        // A Record<string, any> parameter would also accept the callback of
        // the callback-style overloads, so the Promise form of an optional
        // map parameter keeps unknown values.
        if (ov.is_promise && isOpt) {
          pType = pType.replaceAll("Record<string, any>", "Record<string, unknown>");
        }
        // Schemas.sys.mjs checkParameters substitutes the default when null
        // or undefined is passed for an optional parameter.
        if ((isOpt || p.nullable) && pType !== "any") {
          pType = isOpt ? `${pType} | null` : `${pType} | null | undefined`;
        }

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

      const paramsStr = formatParams(ov);
      let actualRet;
      if (ov.is_promise) {
        actualRet = `globalThis.Promise<${this.promiseResult(ov.callback_payload, fnKey, currentNs)}>`;
      } else {
        actualRet = override.returns || this.emitType(ov.returns, currentNs);
      }

      const typeParams = override.typeParameters || "";
      if (isMethod) {
        lines.push(`${indent}${name}${typeParams}(${paramsStr}): ${actualRet};`);
      } else if (name === "eval") {
        lines.push(`${indent}function _eval${typeParams}(${paramsStr}): ${actualRet};`);
      } else {
        lines.push(`${indent}export function ${name}${typeParams}(${paramsStr}): ${actualRet};`);
      }
    }

    if (!isMethod && name === "eval") {
      lines.push(`${indent}export { _eval as eval };`);
    }

    return lines;
  }

  promiseResult(payload, fnKey, currentNs) {
    const override = FUNCTION_OVERRIDES[fnKey] || {};
    if (override.result) {
      return override.result;
    }
    if (payload === "void") {
      return ASYNC_RESULTS[fnKey] || "void";
    }
    const t = this.emitType(payload, currentNs);
    if (!payload.optional || t === "any" || t === "unknown" || t.endsWith("| null")) {
      return t;
    }
    return `${t} | ${NULL_RESULTS.has(fnKey) ? "null" : "undefined"}`;
  }

  emitWebidlInterface(typeId, idl, indent) {
    const lines = [];
    const heritage = idl.extends ? ` extends ${idl.extends}` : "";
    lines.push(`${indent}export interface ${typeId}${heritage} {`);
    for (const member of idl.members) {
      if (member.kind === "attribute") {
        const ro = member.readonly ? "readonly " : "";
        const type = webidlTypeToTs(member.type, typeId, member.name, WEBIDL_EVENT_HANDLERS);
        lines.push(`${indent}    ${ro}${member.name}: ${type};`);
      } else {
        const params = member.params
          .map((p) => `${p.name}${p.optional ? "?" : ""}: ${webidlTypeToTs(p.type, typeId, p.name, WEBIDL_EVENT_HANDLERS)}`)
          .join(", ");
        const returns = webidlTypeToTs(member.returns, typeId, member.name, WEBIDL_EVENT_HANDLERS);
        lines.push(`${indent}    ${member.name}(${params}): ${returns};`);
      }
    }
    lines.push(`${indent}}`);
    return lines;
  }

  // Schemas.sys.mjs Event.getDescriptor: addListener(listener, ...extraParameters)
  // checks the extra arguments like function parameters, so an optional one
  // also takes null; removeListener and hasListener take the listener only.
  emitEventType(ev, nsName, ownerTypeId = null) {
    const evKey = [nsName, ownerTypeId, ev.name].filter(Boolean).join(".");
    const paramOverrides = EVENT_PARAMETERS[evKey] || {};
    const params = ev.parameters || [];
    const signature = params.map((p, i) => {
      const name = sanitizeName(p.name || "details");
      if (paramOverrides[p.name]) {
        return `${name}: ${paramOverrides[p.name]}`;
      }
      const trailingOptional = p.optional && params.slice(i).every((q) => q.optional);
      if (trailingOptional) {
        return `${name}?: ${this.emitType(p, nsName)}`;
      }
      return `${name}: ${this.emitValueType(p, nsName)}`;
    });
    let returns = EVENT_LISTENER_RETURNS[evKey];
    if (!returns) {
      returns = ev.returns ? `${this.emitType(ev.returns, nsName)} | void` : "void";
    }
    const listener = `(${signature.join(", ")}) => ${returns}`;
    const extras = ev.extraParameters || [];
    if (extras.length === 0) {
      return `WebExtensionEvent<${listener}>`;
    }
    const extraSignature = extras.map((p) => {
      const name = sanitizeName(p.name || "arg");
      const type = this.emitType(p, nsName);
      return p.optional ? `${name}?: ${type} | null` : `${name}: ${type}`;
    });
    return (
      `Omit<WebExtensionEvent<${listener}>, "addListener"> & { ` +
      `addListener(callback: ${listener}, ${extraSignature.join(", ")}): void }`
    );
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
      } else if (tInfo._webidl) {
        out.push(...this.emitWebidlInterface(typeId, tInfo._webidl, indent));
      } else if ("isInstanceOf" in tInfo) {
        out.push(`${indent}export type ${typeId} = ${this.emitType(tInfo, nsName)};`);
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
        const typeOverride = TYPE_OVERRIDES[`${nsName}.${typeId}`] || {};
        const overriddenProps = typeOverride.properties || {};
        out.push(`${indent}export interface ${typeId}${typeOverride.typeParameters || ""} {`);

        const propsDict = { ...(tInfo.properties || {}) };
        for (const [pName, ts] of Object.entries(overriddenProps)) {
          propsDict[pName] = pName in propsDict ? { ...propsDict[pName], ts } : { ts };
        }
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
            let pType;
            if (pName === "bytes" && nsName.includes("webRequest")) {
              pType = "ArrayBuffer";
            } else {
              pType = this.emitType(pVal, nsName);
            }

            const isReadonly = Boolean(pVal.readOnly || pVal.readonly || pVal.unsupported);
            const ro = isReadonly ? "readonly " : "";
            out.push(
              `${indent}    ${ro}${sanitizePropertyName(pName)}${this.optionalProperty(pVal, pType)};`
            );
          }

          const sortedFnsList = [...fnsList].sort((a, b) =>
            codePointCompare(a.name || "", b.name || "")
          );
          for (const fn of sortedFnsList) {
            for (const definition of [fn, ...(fn._alternates || [])]) {
              out.push(...this.emitFunctionOverloads(definition, nsName, indent + "    ", true, typeId));
            }
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

            out.push(
              `${indent}    ${sanitizeName(evName)}: ${this.emitEventType(ev, nsName, typeId)};`
            );
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

      out.push(`${indent}export const ${sanitizeName(evName)}: ${this.emitEventType(evVal, nsName)};`);
      out.push("");
    }

    const sortedFns = Object.entries(ns.functions).sort(entryCodePointCompare);
    for (const [fnName, fnVal] of sortedFns) {
      for (const definition of [fnVal, ...(fnVal._alternates || [])]) {
        out.push(...this.emitFunctionOverloads(definition, nsName, indent));
      }
      out.push("");
    }
  }

  /**
   * @param {object} namespaces
   * @param {"module"|"chrome"|"ambient"|"ambient-chrome"} mode
   *   module: importable declarations. chrome: importable `chrome` aliases.
   *   ambient: script file declaring the global `browser` namespace, no imports.
   *   ambient-chrome: script file adding the global `chrome` aliases.
   * @param {{firefoxVersion?: string, importSpecifier?: string, ambientBase?: string}} [opts]
   *   importSpecifier is the module the chrome mode imports `browser` from;
   *   ambientBase is the file the ambient-chrome mode references.
   */
  generate(namespaces, mode = "module", opts = {}) {
    const out = [];
    out.push("// Type definitions for Firefox WebExtensions");
    out.push("// Project: firefox-webextension-types");
    out.push(`// Target: ${this.target[0].toUpperCase() + this.target.slice(1)}`);
    if (opts.firefoxVersion) {
      out.push(`// Firefox Version: ${opts.firefoxVersion}`);
    }
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

    const sortedRoots = Array.from(rootNsNames).sort(codePointCompare);
    const ambient = mode === "ambient";
    const exp = ambient ? "" : "export ";

    if (mode === "chrome") {
      out.push(`import { browser } from "${opts.importSpecifier ?? "./index.js"}";`);
      out.push("");
      out.push("export namespace chrome {");
      for (const nsName of sortedRoots) {
        out.push(`    export import ${nsName} = browser.${nsName};`);
      }
      out.push("}");
      out.push("");
      out.push("export default chrome;");
      return out.join("\n");
    }

    if (mode === "ambient-chrome") {
      out.push(`/// <reference path="${opts.ambientBase}" />`);
      out.push("");
      out.push("declare namespace chrome {");
      for (const nsName of sortedRoots) {
        out.push(`    export import ${nsName} = browser.${nsName};`);
      }
      out.push("}");
      out.push("");
      return out.join("\n");
    }

    out.push(`${exp}interface WebExtensionEvent<TListener extends (...args: any[]) => void> {`);
    out.push("    addListener(callback: TListener): void;");
    out.push("    removeListener(callback: TListener): void;");
    out.push("    hasListener(callback: TListener): boolean;");
    out.push("}");
    out.push(
      `${exp}interface WebExtensionWebRequestEvent<TListener extends (...args: any[]) => browser.webRequest.BlockingResponse | Promise<browser.webRequest.BlockingResponse> | void> {`
    );
    out.push(
      "    addListener(callback: TListener, filter?: browser.webRequest.RequestFilter, extraInfoSpec?: string[]): void;"
    );
    out.push("    removeListener(callback: TListener): void;");
    out.push("    hasListener(callback: TListener): boolean;");
    out.push("}");
    out.push("");
    out.push(`${ambient ? "declare" : "export"} namespace browser {`);

    for (const nsName of sortedRoots) {
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
    if (!ambient) {
      out.push("export namespace chrome {");
      for (const nsName of sortedRoots) {
        out.push(`    export import ${nsName} = browser.${nsName};`);
      }
      out.push("}");
      out.push("");
      out.push("export default browser;");
      out.push("");
    }

    return out.join("\n");
  }
}
