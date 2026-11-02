/**
 * emitter.js - TypeScript Definition Code Generator for Firefox WebExtensions
 *
 * Types come from the Firefox schemas; what the schemas cannot express comes
 * from src/overrides.js, where each entry names the Firefox file behind it.
 */

import { isAsyncFunction, resolveOverloads } from "./overload-resolver.js";
import { codePointCompare, entryCodePointCompare } from "./comparator.js";
import {
  ASYNC_RESULTS,
  EVENT_LISTENER_PROMISES,
  EVENT_PARAMETERS,
  FUNCTION_OVERRIDES,
  NULL_RESULTS,
  REQUIRED_EVENT_PARAMETERS,
  REQUIRED_RESULTS,
  PLATFORM_TYPES,
  TYPE_OVERRIDES,
  WEBIDL_EVENT_HANDLERS,
} from "./overrides.js";
import { webidlTypeToTs } from "./webidl.js";
import { copyNode } from "./schema-trace.js";

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

const TARGET_PRODUCT = { desktop: "Firefox", mobile: "Firefox for Android" };

// Schemas.sys.mjs: MIN_MANIFEST_VERSION and MAX_MANIFEST_VERSION.
const MIN_MANIFEST_VERSION = 2;
const MAX_MANIFEST_VERSION = 3;

// The three kinds of process an API can be injected into, named after the
// envType values ExtensionChild.sys.mjs shouldInject compares against.
const ENV_TYPES = ["addon_child", "content_child", "devtools_child"];

// ExtensionChild.sys.mjs shouldInject, one rule per clause.
function shouldInject(envType, allowedContexts) {
  if (envType === "content_child" && !allowedContexts.includes("content")) return false;
  if (envType === "devtools_child" && !allowedContexts.includes("devtools")) return false;
  if (envType !== "devtools_child" && allowedContexts.includes("devtools_only")) return false;
  if (envType !== "content_child" && allowedContexts.includes("content_only")) return false;
  return true;
}

function reachOf(allowedContexts) {
  return new Set(ENV_TYPES.filter((env) => shouldInject(env, allowedContexts)));
}

function sameSet(a, b) {
  return a.size === b.size && [...a].every((x) => b.has(x));
}

function contextNote(reach) {
  const addon = reach.has("addon_child");
  const content = reach.has("content_child");
  const devtools = reach.has("devtools_child");
  if (addon && content && devtools) return "Also available in content scripts and devtools pages.";
  if (addon && content) return "Also available in content scripts, but not in devtools pages.";
  if (addon && devtools) return "Also available in devtools pages, but not in content scripts.";
  if (addon) return "Not available in content scripts or devtools pages.";
  if (content && devtools) return "Only available in content scripts and devtools pages.";
  if (content) return "Only available in content scripts.";
  if (devtools) return "Only available in devtools pages.";
  return "Not injected into any context.";
}

// "Defaults to", "Default is", "the default value" and "by default" in a schema
// description.
const STATES_DEFAULT = /\bdefaults?\s+(?:to|is|value)\b|\(the default|\bby default\b/i;

function unescapeHtml(str) {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&hellip;/g, "…")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&amp;/g, "&");
}

// Tokens such as <all_urls> that are not markup stay visible in Markdown
// only inside backticks.
function quoteBareAngleTokens(text) {
  return text
    .split("`")
    .map((segment, i) => (i % 2 === 1 ? segment : segment.replace(/<\/?[a-zA-Z_][^<>]*>/g, "`$&`")))
    .join("`")
    .replace(/``/g, "");
}

/**
 * Renders schema description markup as Markdown: $(ref:) becomes a JSDoc
 * link, $(topic:)[label] its label, <code> and <var> backticks, <em> and
 * <b> emphasis, <p>, <br>, <ul> and <dl> line breaks and list items.
 */
export function renderDocText(text, resolveRef = (ref) => `browser.${ref}`) {
  if (!text) return "";
  let out = text
    .replace(/\$\(ref:([^)]+)\)/g, (_, ref) => {
      const target = resolveRef(ref);
      return target === null ? `\`browser.${ref}\`` : `{@link ${target}}`;
    })
    .replace(/\$\(topic:([^)]+)\)(?:\[([^\]]*)\])?/g, (_, topic, label) => label ?? topic)
    .replace(/<a\s+href=(["'])([^"']*)\1[^>]*>([\s\S]*?)<\/a>/g, (_, q, href, inner) =>
      /^https?:\/\//.test(href) ? `[${inner}](${href})` : inner
    )
    .replace(/<(code|var)>([\s\S]*?)<\/\1>/g, "`$2`")
    .replace(/<(em|i)>([\s\S]*?)<\/\1>/g, "_$2_")
    .replace(/<(b|strong)>([\s\S]*?)<\/\1>/g, "**$2**")
    .replace(/<dt>([\s\S]*?)<\/dt>/g, "\n- `$1`")
    .replace(/<dd>([\s\S]*?)<\/dd>/g, ": $1")
    .replace(/<li>([\s\S]*?)<\/li>/g, "\n- $1")
    .replace(/<(?:dl|ul|ol)>/g, "\n")
    .replace(/<\/(?:dl|ul|ol)>/g, "\n\n")
    .replace(/<\/p>/g, "\n\n")
    .replace(/<p>/g, "")
    .replace(/<br\s*\/?>/g, "\n");
  out = quoteBareAngleTokens(unescapeHtml(out));
  return out
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function commentLines(text, indent) {
  return text.split("\n").map((line) => (line ? `${indent} * ${line}` : `${indent} *`));
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

function capitalize(name) {
  return name[0].toUpperCase() + name.slice(1);
}

function withRequiredPayload(fn) {
  return copyNode(fn, {
    parameters: fn.parameters.map((p) =>
      p.type === "function" && p.parameters
        ? copyNode(p, { parameters: p.parameters.map((q) => copyNode(q, { optional: false })) })
        : p
    ),
  });
}

function isInlineObject(t) {
  return Boolean(
    t &&
      typeof t === "object" &&
      t.type === "object" &&
      !("$ref" in t) &&
      !("choices" in t) &&
      !("isInstanceOf" in t) &&
      typeof t.ts !== "string" &&
      t.properties &&
      Object.keys(t.properties).length > 0
  );
}

function allUnsupported(definition) {
  return [definition, ...(definition._alternates || [])].every((d) => d.unsupported);
}

export class TypeScriptEmitter {
  constructor(target = "desktop", commitSha = "unknown-commit", availableNamespaces = null, options = {}) {
    if (typeof target === "object" && target !== null && !(target instanceof Set)) {
      this.target = target.target || "desktop";
      this.commitSha = target.commitSha || target.commit_sha || "unknown-commit";
      this.availableNamespaces = target.availableNamespaces || new Set();
      this.emitCommitHeader = Boolean(target.emitCommitHeader);
      this.surfaces = target.surfaces || null;
    } else {
      this.target = target || "desktop";
      this.commitSha = commitSha || "unknown-commit";
      this.availableNamespaces = availableNamespaces || new Set();
      this.emitCommitHeader = Boolean(options.emitCommitHeader);
      this.surfaces = options.surfaces || null;
    }
    this.namespaces = {};
  }

  getSearchfoxUrl(sourceFile) {
    return `https://searchfox.org/mozilla-central/source/${sourceFile}`;
  }

  // A $(ref:) whose first segment is not a namespace names something in the
  // namespace the description sits in. A namespace that exists only on
  // another surface has nothing to link to here, so the result is null.
  resolveRef(ref, nsName) {
    const first = ref.split(".")[0];
    if (!nsName || this.availableNamespaces.has(first) || first === nsName.split(".")[0]) {
      return `browser.${ref}`;
    }
    const onOtherSurface = Object.values(this.surfaces || {}).some((namespaces) =>
      Object.keys(namespaces).some((name) => name.split(".")[0] === first)
    );
    if (onOtherSurface) return null;
    return `browser.${nsName}.${ref}`;
  }

  docText(text, nsName) {
    return renderDocText(text, (ref) => this.resolveRef(ref, nsName));
  }

  emitType(typeInfo, currentNs, indent = "") {
    if (typeof typeInfo === "string") {
      return this.resolvePrimitive(typeInfo, currentNs);
    }

    if (!typeInfo || typeof typeInfo !== "object") {
      return "unknown";
    }

    if (typeof typeInfo.ts === "string") {
      return typeInfo.ts;
    }

    if (typeof typeInfo._helper === "string") {
      return typeInfo._helper;
    }

    if (Array.isArray(typeInfo.tuple)) {
      const elements = typeInfo.tuple.map(
        (p) => `${sanitizeName(p.name || "arg")}: ${this.emitValueType(p, currentNs, indent)}`
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

    if (!Object.keys(typeInfo).includes("type") && "value" in typeInfo) {
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
      const rawChoices = typeInfo.choices.map((c) => this.emitType(c, currentNs, indent));
      const choiceDocs = typeInfo.choices.map((c) => this.choiceDoc(c, currentNs));
      const hasBareString = rawChoices.includes("string");
      const hasLiterals = rawChoices.some((c) => c.startsWith('"'));
      const useOpenString =
        hasBareString && (hasLiterals || currentNs === "manifest" || currentNs === "runtime");

      const members = rawChoices.map((raw, i) => ({
        type: raw === "string" && useOpenString ? "(string & {})" : raw,
        ...choiceDocs[i],
      }));
      return members.length ? this.joinUnion(members) : "unknown";
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
      const innerType = this.emitType(items, currentNs, indent);
      const itemDoc = this.inlineDoc(items.description, currentNs);
      // Schemas.sys.mjs ArrayType.normalize rejects any other length. The
      // bounds are only read where the schema gives both.
      const bounds = Object.keys(typeInfo);
      if (bounds.includes("minItems") && bounds.includes("maxItems") && typeInfo.minItems === typeInfo.maxItems) {
        return `[${new Array(typeInfo.maxItems).fill(itemDoc + innerType).join(", ")}]`;
      }
      if (innerType.includes(" | ")) {
        return `(${itemDoc}${innerType})[]`;
      }
      return `${itemDoc}${innerType}[]`;
    } else if (t === "object") {
      if (typeInfo.properties && Object.keys(typeInfo.properties).length > 0) {
        return this.emitObjectLiteral(typeInfo, currentNs, indent);
      }
      return this.emitMapType(typeInfo, currentNs);
    } else if (t === "function") {
      if (!typeInfo.parameters) {
        return "((...args: any[]) => void)";
      }
      const params = (typeInfo.parameters || []).map((p) => {
        const pType = this.emitValueType(p, currentNs, indent);
        const pName = sanitizeName(p.name || "arg");
        return `${pName}: ${pType}`;
      });
      const paramsStr = params.join(", ");
      const retType = isAsyncFunction(typeInfo)
        ? "globalThis.Promise<void>"
        : this.emitType(typeInfo.returns || "void", currentNs, indent);
      return `((${paramsStr}) => ${retType})`;
    }

    return "unknown";
  }

  // Schemas.sys.mjs ObjectType.normalize hands a key outside `properties` to
  // additionalProperties, and AnyType accepts every value. That matters for
  // an object the extension hands to Firefox, and the manifest is the one
  // place such an object has open keys: BrowserSpecificSettings takes the
  // settings of other browsers. Port and lastError are values Firefox hands
  // to the extension, and a $ref here is manifest.json UnrecognizedProperty,
  // which accepts the key with a warning, so a misspelled key stays a
  // compile error.
  acceptsAnyKey(typeInfo, nsName) {
    if (nsName !== "manifest") return false;
    const additional = typeInfo.additionalProperties;
    return Boolean(additional) && typeof additional === "object" && additional.type === "any";
  }

  emitObjectLiteral(typeInfo, currentNs, indent) {
    const inner = indent + "    ";
    const lines = ["{"];
    const sortedEntries = Object.entries(typeInfo.properties).sort(entryCodePointCompare);
    for (const [pName, pVal] of sortedEntries) {
      lines.push(...this.memberDoc(pVal, currentNs, inner));
      const pType = this.emitType(pVal, currentNs, inner);
      lines.push(`${inner}${sanitizePropertyName(pName)}${this.optionalProperty(pVal, pType)};`);
    }
    lines.push(`${indent}}`);
    return lines.join("\n");
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
  emitValueType(p, currentNs, indent = "") {
    const t = this.emitType(p, currentNs, indent);
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

  /**
   * Assembles one JSDoc block. Every field is optional; an empty spec gives
   * no lines at all.
   */
  jsdoc(spec, indent) {
    const body = [];
    if (spec.description) {
      body.push(...commentLines(spec.description, indent));
    }
    const notes = (spec.notes || []).filter(Boolean);
    if (notes.length) {
      if (body.length) body.push(`${indent} *`);
      body.push(...notes.map((n) => `${indent} * ${n}`));
    }
    const tags = [];
    for (const [name, text] of spec.params || []) {
      tags.push(...commentLines(`@param ${name} ${text}`, indent));
    }
    if (spec.returns) {
      tags.push(...commentLines(`@returns ${spec.returns}`, indent));
    }
    if (spec.deprecated !== null && spec.deprecated !== undefined) {
      tags.push(`${indent} * @deprecated${spec.deprecated ? ` ${spec.deprecated}` : ""}`);
    }
    if (spec.see) {
      tags.push(`${indent} * @see ${spec.see}`);
    }
    if (spec.permissions && spec.permissions.length) {
      tags.push(`${indent} * @permission ${[...spec.permissions].sort(codePointCompare).join(" or ")}`);
    }
    if (spec.platforms && spec.platforms.length) {
      tags.push(`${indent} * @platform ${spec.platforms.join(", ")}`);
    }
    if (tags.length) {
      if (body.length) body.push(`${indent} *`);
      body.push(...tags);
    }
    if (!body.length) return [];
    return [`${indent}/**`, ...body, `${indent} */`];
  }

  // Schemas.sys.mjs drops `unsupported` entries at load (Namespace.init,
  // SubModuleType.parseSchema, TypeProperty.getDescriptor) and rejects a
  // value carrying an unsupported property (ObjectType.checkProperty).
  deprecationText(node, nsName, kind) {
    const parts = [];
    if (node.unsupported) {
      const product = TARGET_PRODUCT[this.target] || "Firefox";
      parts.push(
        kind === "member"
          ? `${product} does not support this property and rejects an object that includes it.`
          : `${product} does not support this ${kind}; it does not exist at runtime.`
      );
    }
    if (typeof node.deprecated === "string" && node.deprecated) {
      parts.push(this.docText(node.deprecated, nsName).replace(/\n+/g, " "));
    }
    if (!parts.length) {
      return node.deprecated ? "" : null;
    }
    return parts.join(" ");
  }

  // A one-line comment for a type that has no declaration of its own. A
  // schema description can run over several lines, so they are joined.
  // TypeScript does not surface a comment inside a union or in front of an
  // array element type, so it shows in the declaration text only.
  inlineDoc(description, nsName, notes = []) {
    const text = [this.docText(description, nsName).replace(/\n+/g, " "), ...notes].filter(Boolean).join(" ");
    return text ? `/** ${text} */ ` : "";
  }

  // The comments in front of one union member: its description and manifest
  // version bounds, then a deprecation tag. Every Schemas.sys.mjs type reads `deprecated` (Entry)
  // and warns when it normalizes a value (checkDeprecated), so a choice can
  // be deprecated on its own.
  choiceDoc(choice, nsName) {
    const text = this.deprecationText(choice, nsName, "member");
    return {
      notes: this.inlineDoc(choice.description, nsName, this.manifestVersionNotes(choice)),
      deprecated: text === null ? "" : `/** @deprecated${text ? ` ${text}` : ""} */ `,
    };
  }

  // Two choices that emit the same type appear once. When their notes differ
  // the type holds for both, so neither note applies and both are dropped.
  joinUnion(members) {
    const seen = new Map();
    for (const { type, notes, deprecated } of members) {
      const key = deprecated + type;
      const prior = seen.get(key);
      if (!prior) seen.set(key, { type, notes, deprecated });
      else if (prior.notes !== notes) prior.notes = "";
    }
    return [...seen.values()].map((m) => m.notes + m.deprecated + m.type).join(" | ");
  }

  // Schemas.sys.mjs ObjectType.checkProperty and CallEntry.checkParameters
  // substitute the schema default for an omitted optional value. A
  // description that already says so is left alone.
  defaultNote(node) {
    if (node.default === undefined || STATES_DEFAULT.test(node.description || "")) return null;
    return `Defaults to \`${JSON.stringify(node.default)}\`.`;
  }

  manifestVersionNotes(node) {
    const notes = [];
    if (node.min_manifest_version !== undefined && node.min_manifest_version > MIN_MANIFEST_VERSION) {
      notes.push(`Requires manifest_version ${node.min_manifest_version} or later.`);
    }
    if (node.max_manifest_version !== undefined && node.max_manifest_version < MAX_MANIFEST_VERSION) {
      notes.push(`Only available in manifest_version ${node.max_manifest_version} or earlier.`);
    }
    return notes;
  }

  // Which contexts reach a namespace: Schemas.sys.mjs InjectionEntry uses the
  // entry's own allowedContexts, else the parent's defaultContexts, and a
  // member is only reachable through every namespace above it.
  namespaceReach(nsName) {
    let reach = new Set(ENV_TYPES);
    let parentDefaults = [];
    const parts = nsName.split(".");
    for (let i = 1; i <= parts.length; i++) {
      const ns = this.namespaces[parts.slice(0, i).join(".")];
      const own = (ns && ns.allowedContexts) || [];
      reach = new Set([...reach].filter((env) => reachOf(own.length ? own : parentDefaults).has(env)));
      parentDefaults = (ns && ns.defaultContexts) || [];
    }
    return reach;
  }

  memberReach(node, nsName) {
    const ns = this.namespaces[nsName];
    const own = node.allowedContexts || [];
    const allowed = own.length ? own : (ns && ns.defaultContexts) || [];
    const nsReach = this.namespaceReach(nsName);
    return new Set([...nsReach].filter((env) => reachOf(allowed).has(env)));
  }

  memberContextNote(node, nsName) {
    const reach = this.memberReach(node, nsName);
    return sameSet(reach, this.namespaceReach(nsName)) ? null : contextNote(reach);
  }

  // Targets whose surface carries the symbol with at least one supported
  // definition. Without the other surfaces loaded, the build target stands.
  platformsFor(nsName, kind, name, ownerTypeId = null) {
    if (!this.surfaces) {
      return [this.target];
    }
    const present = (namespaces) => {
      const ns = namespaces[nsName];
      if (!ns) return false;
      if (kind === "namespace") return true;
      if (ownerTypeId) {
        const owner = ns.types[ownerTypeId];
        const list = owner ? owner[kind === "event" ? "events" : "functions"] || [] : [];
        return list.some((m) => m.name === name && !m.unsupported);
      }
      const bucket = { function: ns.functions, event: ns.events, property: ns.properties, type: ns.types }[kind];
      const node = bucket && bucket[name];
      return Boolean(node) && (kind === "type" || !allUnsupported(node));
    };
    return Object.keys(this.surfaces).filter((t) => present(this.surfaces[t]));
  }

  // JSDoc for a property of an object type: a schema type property, a
  // manifest key or a member of an inline parameter object.
  memberDoc(pVal, nsName, indent) {
    if (!pVal || typeof pVal !== "object") return [];
    const notes = this.manifestVersionNotes(pVal);
    // Extension.sys.mjs rejects or ignores a privileged manifest key in an
    // unprivileged extension.
    if (pVal.privileged) {
      notes.push("Only privileged extensions can use this key.");
    }
    notes.push(this.defaultNote(pVal));
    const params =
      pVal.type === "function"
        ? (pVal.parameters || [])
            .filter((q) => q.description)
            .map((q) => [sanitizeName(q.name || "arg"), this.docText(q.description, nsName)])
        : [];
    return this.jsdoc(
      {
        description: this.docText(pVal.description, nsName),
        notes,
        params,
        deprecated: this.deprecationText(pVal, nsName, "member"),
        permissions: pVal.permissions,
      },
      indent
    );
  }

  // Names the inline object types of a function, method or event after the
  // parameter they type, in a namespace merged with the owner, and marks
  // each schema node so every later emission references that name. A
  // function override states the return type whole, so the schema's returns
  // object is not named.
  nameHelpers(node, holder, currentNs, returnsOverridden = false) {
    const helpers = [];
    const register = (name, typeInfo) => {
      const existing = helpers.find((h) => h.name === name);
      if (existing) {
        if (JSON.stringify(existing.typeInfo) !== JSON.stringify(typeInfo)) {
          throw new Error(`${currentNs}.${holder}: two different inline types would be named ${name}`);
        }
        typeInfo._helper = `${holder}.${name}`;
        return;
      }
      helpers.push({ name, typeInfo });
      typeInfo._helper = `${holder}.${name}`;
    };
    const params = node.parameters || [];
    for (const p of params) {
      if (p.type === "function") {
        const payload = p.parameters || [];
        if (payload.length === 1 && isInlineObject(payload[0])) {
          register("Result", payload[0]);
        } else {
          for (const q of payload) {
            if (isInlineObject(q)) register(capitalize(sanitizeName(q.name || "arg")), q);
          }
        }
      } else if (isInlineObject(p)) {
        register(capitalize(sanitizeName(p.name || "arg")), p);
      }
    }
    if (!returnsOverridden && isInlineObject(node.returns)) {
      register("Result", node.returns);
    }
    return helpers;
  }

  emitHelperTypes(helpers, currentNs, indent) {
    const out = [];
    for (const { name, typeInfo } of helpers) {
      out.push(...this.jsdoc({ description: this.docText(typeInfo.description, currentNs) }, indent));
      const literal = this.emitObjectLiteral(typeInfo, currentNs, indent);
      out.push(`${indent}export type ${name} = ${literal};`);
    }
    return out;
  }

  emitFunctionOverloads(fn, currentNs, indent, isMethod = false, ownerTypeId = null) {
    return this.emitFunction(fn, currentNs, indent, isMethod, ownerTypeId).lines;
  }

  // The declaration lines plus the inline object types named after its
  // parameters, which the caller places in a namespace merged with it.
  emitFunction(fn, currentNs, indent, isMethod = false, ownerTypeId = null) {
    const lines = [];
    const name = sanitizeName(fn.name || "");
    const fnKey = [currentNs, ownerTypeId, fn.name].filter(Boolean).join(".");
    if (REQUIRED_RESULTS.has(fnKey)) {
      fn = withRequiredPayload(fn);
    }
    const override = FUNCTION_OVERRIDES[fnKey] || {};
    const sourceFile = fn._source_file || "";
    const holder = name === "eval" ? "_eval" : name;
    const helpers = this.nameHelpers(fn, ownerTypeId ? `${ownerTypeId}.${holder}` : holder, currentNs, "returns" in override);

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

    const emitParam = (p, ov) => {
      const isOpt = Boolean(p.optional);
      let pName = sanitizeName(p.name || "arg");
      let pType;
      if (override.parameters && override.parameters[p.name]) {
        pType = override.parameters[p.name];
      } else if (p.type === "function" && asyncResult && !(p.parameters || []).length) {
        pType = `((result: ${asyncResult}) => void)`;
      } else if (p.type === "function" && override.result && (p.parameters || []).length === 1) {
        pType = `((${sanitizeName(p.parameters[0].name)}: ${override.result}) => void)`;
      } else {
        pType = this.emitType(p, currentNs, indent);
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
      return { name: pName, text: `${pName}${isOpt ? "?" : ""}: ${pType}` };
    };

    const docParams = [];
    const seenParams = new Set();
    for (const ov of overloads) {
      for (const p of ov.parameters) {
        const { name: emitted } = emitParam(p, ov);
        if (seenParams.has(emitted)) continue;
        seenParams.add(emitted);
        const text = [p.description ? this.docText(p.description, currentNs) : "", this.defaultNote(p)];
        if (text[0] || text[1]) {
          docParams.push([emitted, text.filter(Boolean).join(" ")]);
        }
      }
    }
    const callback = (fn.parameters || []).find((p) => p.type === "function");
    const payload = callback && (callback.parameters || []).length === 1 ? callback.parameters[0] : null;
    const returnsText = (fn.returns && fn.returns.description) || (payload && payload.description) || "";

    const notes = this.manifestVersionNotes(fn);
    // ExtensionChild.sys.mjs callAsyncFunction rejects the call unless the
    // window is handling user input.
    if (fn.requireUserInput) {
      notes.push("Must be called from a user input handler.");
    }
    if (!isMethod) {
      notes.push(this.memberContextNote(fn, currentNs));
    }
    const jsdoc = this.jsdoc(
      {
        description: this.docText(fn.description, currentNs),
        notes,
        params: docParams,
        returns: this.docText(returnsText, currentNs),
        deprecated: this.deprecationText(fn, currentNs, isMethod ? "method" : "function"),
        see: sourceFile ? this.getSearchfoxUrl(sourceFile) : null,
        permissions: fn.permissions,
        platforms: this.platformsFor(currentNs, "function", fn.name, ownerTypeId),
      },
      indent
    );

    for (let i = 0; i < overloads.length; i++) {
      const ov = overloads[i];
      if (i === 0) {
        lines.push(...jsdoc);
      }

      const paramsStr = ov.parameters.map((p) => emitParam(p, ov).text).join(", ");
      let actualRet;
      if (ov.is_promise) {
        actualRet = `globalThis.Promise<${this.promiseResult(ov.callback_payload, fnKey, currentNs)}>`;
      } else {
        actualRet = override.returns || this.emitType(ov.returns, currentNs, indent);
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

    return { lines, helpers, holder };
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

  // Schemas.sys.mjs Event.parseSchema skips an event's `returns` ("We ignore
  // these properties for now"), so the schema is the only statement of what a
  // listener hands back, and `optional` there means it may hand back nothing.
  listenerReturns(ev, evKey, nsName, indent) {
    if (!ev.returns) {
      return "void";
    }
    const value = this.emitType(ev.returns, nsName, indent);
    const optional = Boolean(ev.returns.optional);
    const parts = [value];
    if (evKey in EVENT_LISTENER_PROMISES) {
      const resolved = EVENT_LISTENER_PROMISES[evKey] ?? value;
      const open = resolved === "unknown" || resolved === "any";
      parts.push(`Promise<${optional && !open ? `${resolved} | void` : resolved}>`);
    }
    if (optional) {
      parts.push("void");
    }
    return parts.join(" | ");
  }

  // Schemas.sys.mjs Event.getDescriptor: addListener(listener, ...extraParameters)
  // checks the extra arguments like function parameters, so an optional one
  // also takes null; removeListener and hasListener take the listener only.
  emitEventType(ev, nsName, ownerTypeId = null, indent = "") {
    const evKey = [nsName, ownerTypeId, ev.name].filter(Boolean).join(".");
    const paramOverrides = EVENT_PARAMETERS[evKey] || {};
    const required = REQUIRED_EVENT_PARAMETERS[evKey] || [];
    const params = (ev.parameters || []).map((p) => (required.includes(p.name) ? copyNode(p, { optional: false }) : p));
    const signature = params.map((p, i) => {
      const name = sanitizeName(p.name || "details");
      if (paramOverrides[p.name]) {
        return `${name}: ${paramOverrides[p.name]}`;
      }
      const trailingOptional = p.optional && params.slice(i).every((q) => q.optional);
      if (trailingOptional) {
        return `${name}?: ${this.emitType(p, nsName, indent)}`;
      }
      return `${name}: ${this.emitValueType(p, nsName, indent)}`;
    });
    const returns = this.listenerReturns(ev, evKey, nsName, indent);
    const listener = `(${signature.join(", ")}) => ${returns}`;
    const extras = ev.extraParameters || [];
    if (extras.length === 0) {
      return `WebExtensionEvent<${listener}>`;
    }
    const extraSignature = extras.map((p) => {
      const name = sanitizeName(p.name || "arg");
      const type = this.emitType(p, nsName, indent);
      return p.optional ? `${name}?: ${type} | null` : `${name}: ${type}`;
    });
    return (
      `Omit<WebExtensionEvent<${listener}>, "addListener"> & { ` +
      `addListener(callback: ${listener}, ${extraSignature.join(", ")}): void }`
    );
  }

  eventDoc(ev, nsName, indent, ownerTypeId = null) {
    const params = (ev.parameters || [])
      .filter((p) => p.description)
      .map((p) => [sanitizeName(p.name || "details"), this.docText(p.description, nsName)]);
    // addListener takes these after the listener (see emitEventType).
    for (const p of ev.extraParameters || []) {
      if (p.description) params.push([sanitizeName(p.name || "arg"), this.docText(p.description, nsName)]);
    }
    const notes = this.manifestVersionNotes(ev);
    if (!ownerTypeId) {
      notes.push(this.memberContextNote(ev, nsName));
    }
    return this.jsdoc(
      {
        description: this.docText(ev.description, nsName),
        notes,
        params,
        returns: ev.returns ? this.docText(ev.returns.description, nsName) : "",
        deprecated: this.deprecationText(ev, nsName, "event"),
        see: ev._source_file ? this.getSearchfoxUrl(ev._source_file) : null,
        permissions: ev.permissions,
        platforms: this.platformsFor(nsName, "event", ev.name, ownerTypeId),
      },
      indent
    );
  }

  // The constants Schemas.sys.mjs injects for a string enum type. Every
  // supported type of a namespace is a key of that namespace
  // (Namespace.init skips `unsupported` ones, and $extend entries land on the
  // type they extend). Entry.getDescriptor is empty for every kind of type
  // except two. StringType.getDescriptor builds { [value.toUpperCase()]: value }
  // from `enum`, and ChoiceType.getDescriptor merges that object over its
  // choices, in order, but only when every choice is a string enum. A choice
  // outside the manifest version is left out. A $ref, an object or a
  // non-string enum gets nothing. Whether the key is injected at all follows
  // the same rules as any member (InjectionEntry: manifest version,
  // allowedContexts, and the namespace's own permissions, where an empty list
  // such as the manifest namespace's is never granted, see neverInjected).
  enumConstants(tInfo) {
    if (tInfo.unsupported || tInfo._webidl) return null;
    const stringEnum = (t) => t.type === "string" && Array.isArray(t.enum);
    let sources;
    if (stringEnum(tInfo)) {
      sources = [tInfo];
    } else if (Array.isArray(tInfo.choices) && tInfo.choices.length && tInfo.choices.every(stringEnum)) {
      sources = tInfo.choices;
    } else {
      return null;
    }
    const constants = new Map();
    for (const source of sources) {
      for (const entry of source.enum) {
        const value = typeof entry === "object" ? entry.name : entry;
        constants.set(value.toUpperCase(), {
          value,
          description: typeof entry === "object" ? entry.description : undefined,
          source,
        });
      }
    }
    return constants;
  }

  emitEnumConstants(typeId, tInfo, ns, nsName, indent) {
    if (ns.neverInjected) return [];
    const constants = this.enumConstants(tInfo);
    if (!constants || !constants.size) return [];
    const inner = indent + "    ";
    const lines = [
      ...this.jsdoc(
        {
          description: this.docText(tInfo.description, nsName),
          notes: [...this.manifestVersionNotes(tInfo), this.memberContextNote(tInfo, nsName)],
          deprecated: this.deprecationText(tInfo, nsName, "type"),
          platforms: this.platformsFor(nsName, "type", typeId),
        },
        indent
      ),
      `${indent}export const ${typeId}: {`,
    ];
    for (const [key, { value, description, source }] of constants) {
      lines.push(
        ...this.jsdoc(
          {
            description: description ? this.docText(description, nsName) : "",
            notes: source === tInfo ? [] : this.manifestVersionNotes(source),
          },
          inner
        )
      );
      lines.push(`${inner}${sanitizePropertyName(key)}: ${formatEnumVal(value)};`);
    }
    lines.push(`${indent}};`);
    return lines;
  }

  emitHelperNamespace(holder, helpers, nsName, indent) {
    if (!helpers.length) return [];
    return [
      `${indent}export namespace ${holder} {`,
      ...this.emitHelperTypes(helpers, nsName, indent + "    "),
      `${indent}}`,
    ];
  }

  _emitNamespaceBody(ns, out, indent, nsName) {
    const sortedTypes = Object.entries(ns.types).sort(entryCodePointCompare);
    for (const [typeId, tInfo] of sortedTypes) {
      const typeHelpers = [];
      out.push(
        ...this.jsdoc(
          {
            description: this.docText(tInfo.description, nsName),
            notes: this.manifestVersionNotes(tInfo),
            deprecated: this.deprecationText(tInfo, nsName, "type"),
            see: tInfo._source_file ? this.getSearchfoxUrl(tInfo._source_file) : null,
            platforms: this.platformsFor(nsName, "type", typeId),
          },
          indent
        )
      );

      if ("enum" in tInfo) {
        const enumStr = tInfo.enum.map(formatEnumVal).join(" | ");
        out.push(`${indent}export type ${typeId} = ${enumStr};`);
      } else if (tInfo._webidl) {
        out.push(...this.emitWebidlInterface(typeId, tInfo._webidl, indent));
      } else if ("isInstanceOf" in tInfo) {
        out.push(`${indent}export type ${typeId} = ${this.emitType(tInfo, nsName, indent)};`);
      } else if ("choices" in tInfo) {
        const members = [];
        let hasBareString = false;
        for (const c of tInfo.choices) {
          const cStr = this.emitType(c, nsName, indent);
          if (cStr === "string") {
            hasBareString = true;
          } else {
            members.push({ type: cStr, ...this.choiceDoc(c, nsName) });
          }
        }
        if (hasBareString) {
          members.push({ type: "(string & {})", notes: "", deprecated: "" });
        }
        const unionStr = this.joinUnion(members);
        out.push(`${indent}export type ${typeId} = ${unionStr};`);
      } else if (tInfo.type === "object" || "properties" in tInfo) {
        const typeOverride = TYPE_OVERRIDES[`${nsName}.${typeId}`] || {};
        const overriddenProps = typeOverride.properties || {};
        out.push(`${indent}export interface ${typeId}${typeOverride.typeParameters || ""} {`);

        const propsDict = { ...(tInfo.properties || {}) };
        for (const [pName, ts] of Object.entries(overriddenProps)) {
          propsDict[pName] = pName in propsDict ? copyNode(propsDict[pName], { ts }) : { ts };
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
          const inner = indent + "    ";
          const sortedProps = Object.entries(propsDict).sort(entryCodePointCompare);
          for (const [pName, pVal] of sortedProps) {
            out.push(...this.memberDoc(pVal, nsName, inner));
            const pType = this.emitType(pVal, nsName, inner);

            out.push(
              `${inner}${sanitizePropertyName(pName)}${this.optionalProperty(pVal, pType)};`
            );
          }
          if (this.acceptsAnyKey(tInfo, nsName)) out.push(`${inner}[key: string]: unknown;`);

          const sortedFnsList = [...fnsList].sort((a, b) =>
            codePointCompare(a.name || "", b.name || "")
          );
          for (const fn of sortedFnsList) {
            for (const definition of [fn, ...(fn._alternates || [])]) {
              const { lines, helpers, holder } = this.emitFunction(definition, nsName, inner, true, typeId);
              out.push(...lines);
              typeHelpers.push({ holder, helpers });
            }
          }

          const sortedEvsList = [...evsList].sort((a, b) =>
            codePointCompare(a.name || "", b.name || "")
          );
          for (const ev of sortedEvsList) {
            const evName = sanitizeName(ev.name || "event");
            const helpers = this.nameHelpers(ev, `${typeId}.${evName}`, nsName);
            out.push(...this.eventDoc(ev, nsName, inner, typeId));
            out.push(`${inner}${evName}: ${this.emitEventType(ev, nsName, typeId, inner)};`);
            typeHelpers.push({ holder: evName, helpers });
          }
        }

        out.push(`${indent}}`);
        const helperBlocks = typeHelpers.filter(({ helpers }) => helpers.length);
        if (helperBlocks.length) {
          out.push(`${indent}export namespace ${typeId} {`);
          for (const { holder, helpers } of helperBlocks) {
            out.push(...this.emitHelperNamespace(holder, helpers, nsName, indent + "    "));
          }
          out.push(`${indent}}`);
        }
      } else {
        const baseT = this.emitType(tInfo, nsName, indent);
        out.push(`${indent}export type ${typeId} = ${baseT};`);
      }
      out.push(...this.emitEnumConstants(typeId, tInfo, ns, nsName, indent));
      out.push("");
    }

    const sortedProps = Object.entries(ns.properties).sort(entryCodePointCompare);
    for (const [pName, pVal] of sortedProps) {
      out.push(
        ...this.jsdoc(
          {
            description: this.docText(pVal.description, nsName),
            notes: [...this.manifestVersionNotes(pVal), this.memberContextNote(pVal, nsName)],
            deprecated: this.deprecationText(pVal, nsName, "property"),
            see: pVal._source_file ? this.getSearchfoxUrl(pVal._source_file) : null,
            permissions: pVal.permissions,
            platforms: this.platformsFor(nsName, "property", pName),
          },
          indent
        )
      );
      const pType = this.emitType(pVal, nsName, indent);
      out.push(`${indent}export const ${sanitizeName(pName)}: ${pType};`);
    }
    if (sortedProps.length) {
      out.push("");
    }

    const sortedEvents = Object.entries(ns.events).sort(entryCodePointCompare);
    for (const [evName, evVal] of sortedEvents) {
      const holder = sanitizeName(evName);
      const helpers = this.nameHelpers(evVal, holder, nsName);
      out.push(...this.eventDoc(evVal, nsName, indent));
      out.push(`${indent}export const ${holder}: ${this.emitEventType(evVal, nsName, null, indent)};`);
      out.push(...this.emitHelperNamespace(holder, helpers, nsName, indent));
      out.push("");
    }

    const sortedFns = Object.entries(ns.functions).sort(entryCodePointCompare);
    for (const [fnName, fnVal] of sortedFns) {
      const helperBlocks = [];
      for (const definition of [fnVal, ...(fnVal._alternates || [])]) {
        const { lines, helpers, holder } = this.emitFunction(definition, nsName, indent);
        out.push(...lines);
        for (const h of helpers) {
          const existing = helperBlocks.find((x) => x.name === h.name);
          if (existing && JSON.stringify(existing.typeInfo) !== JSON.stringify(h.typeInfo)) {
            throw new Error(`${nsName}.${fnName}: two definitions would both name an inline type ${h.name}`);
          }
          if (!existing) helperBlocks.push({ ...h, holder });
        }
      }
      if (helperBlocks.length) {
        out.push(...this.emitHelperNamespace(helperBlocks[0].holder, helperBlocks, nsName, indent));
      }
      out.push("");
    }
  }

  // Extension.sys.mjs PRIVILEGED_PERMS: the manifest schema lists the same
  // names as PermissionPrivileged, so a namespace gated only on those is
  // unusable by an ordinary extension.
  privilegedPermissions() {
    const manifest = this.namespaces.manifest;
    const type = manifest && manifest.types.PermissionPrivileged;
    const names = new Set();
    for (const choice of (type && type.choices) || []) {
      for (const value of choice.enum || []) {
        names.add(typeof value === "string" ? value : value.name);
      }
    }
    return names;
  }

  namespaceDoc(ns, nsName, indent) {
    const notes = this.manifestVersionNotes(ns);
    const privileged = this.privilegedPermissions();
    const perms = ns.permissions || [];
    if (perms.length && perms.every((p) => privileged.has(p))) {
      notes.push("Only privileged extensions can use this API.");
    }
    notes.push(contextNote(this.namespaceReach(nsName)));
    return this.jsdoc(
      {
        description: this.docText(ns.description, nsName),
        notes,
        permissions: perms,
        platforms: this.platformsFor(nsName, "namespace"),
      },
      indent
    );
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
    this.namespaces = namespaces;

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
    out.push("");
    out.push(`${ambient ? "declare" : "export"} namespace browser {`);

    for (const nsName of sortedRoots) {
      const ns = namespaces[nsName];
      if (ns) {
        out.push(...this.namespaceDoc(ns, nsName, "    "));
      }
      out.push(`    export namespace ${nsName} {`);

      if (ns) {
        this._emitNamespaceBody(ns, out, "        ", nsName);
      }

      if (subNsMap[nsName]) {
        const sortedSubList = [...subNsMap[nsName]].sort(([a], [b]) =>
          codePointCompare(a, b)
        );
        for (const [subName, subNs] of sortedSubList) {
          out.push(...this.namespaceDoc(subNs, `${nsName}.${subName}`, "        "));
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
