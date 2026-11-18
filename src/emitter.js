/**
 * Writes TypeScript declarations for the loaded schemas. What the schemas
 * cannot express comes from src/overrides.js, where each entry names the
 * Firefox file behind it.
 */

import { isAsyncFunction, resolveOverloads } from "./overload-resolver.js";
import { codePointCompare, entryCodePointCompare } from "./comparator.js";
import {
  ASYNC_RESULTS,
  EVENT_LISTENER_PROMISES,
  EVENT_LISTENER_RETURNS,
  EVENT_PARAMETERS,
  EVENT_TYPES,
  FUNCTION_OVERRIDES,
  MANIFEST_TYPES,
  MANIFEST_VERSION_RANGE,
  NORMALIZED_FILLS,
  NORMALIZED_RESULTS,
  NULL_PROPERTIES,
  NULL_RESULT_PROPERTIES,
  NULL_RESULTS,
  OPEN_OBJECTS,
  REQUIRED_EVENT_PARAMETERS,
  REQUIRED_RESULTS,
  PLATFORM_TYPES,
  SET_PROPERTIES,
  REF_TYPES,
  TYPE_OVERRIDES,
  USER_SCRIPT_API,
  WEBIDL_EVENT_HANDLERS,
} from "./overrides.js";
import { webidlTypeToTs } from "./webidl.js";
import { copyNode } from "./schema-trace.js";

const RESERVED_IDENTIFIERS = {
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

function sanitizeName(name) {
  return RESERVED_IDENTIFIERS[name] || name;
}

function sanitizePropertyName(name) {
  if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) {
    return name;
  }
  return JSON.stringify(name);
}

const TARGET_PRODUCT = { desktop: "Firefox", mobile: "Firefox for Android" };

const MIN_MANIFEST_VERSION = MANIFEST_VERSION_RANGE.min;
const MAX_MANIFEST_VERSION = MANIFEST_VERSION_RANGE.max;

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
    .replace(/\s*&mdash;\s*/g, ", ")
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
    .replace(/<(code|var)>([\s\S]*?)<\/?\1>/g, "`$2`")
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

// A function or conditional type binds looser than `|`, so an override
// string of that shape needs parentheses before a union member is appended.
function grouped(t) {
  let depth = 0;
  for (const [token] of t.matchAll(/=>| extends |[()[\]{}<>]/g)) {
    if (token.length > 1) {
      if (depth === 0) return `(${t})`;
    } else {
      depth += /[([{<]/.test(token) ? 1 : -1;
    }
  }
  return t;
}

// The members of a union type, split where `|` is outside any brackets,
// string literal or comment.
function unionMembers(t) {
  const members = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < t.length; i++) {
    if (t.startsWith("/*", i)) {
      i = t.indexOf("*/", i) + 1;
    } else if (t[i] === '"') {
      while (t[++i] !== '"') if (t[i] === "\\") i++;
    } else if (t.startsWith("=>", i)) {
      i++;
    } else if ("([{<".includes(t[i])) {
      depth++;
    } else if (")]}>".includes(t[i])) {
      depth--;
    } else if (depth === 0 && t.startsWith(" | ", i)) {
      members.push(t.slice(start, i));
      start = i + 3;
    }
  }
  members.push(t.slice(start));
  return members;
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

// The object `node` with each property that NULL_RESULT_PROPERTIES names as
// `${key}.${property}` marked as reading null.
function withNullProperties(node, key) {
  const names = Object.keys(node.properties || {}).filter((name) => NULL_RESULT_PROPERTIES.has(`${key}.${name}`));
  if (!names.length) return node;
  const properties = { ...node.properties };
  for (const name of names) properties[name] = copyNode(properties[name], { readsNull: true });
  return copyNode(node, { properties });
}

function withNullResultProperties(fn, fnKey) {
  return copyNode(fn, {
    parameters: (fn.parameters || []).map((p) =>
      p.type === "function" && p.parameters?.length === 1
        ? copyNode(p, { parameters: [withNullProperties(p.parameters[0], fnKey)] })
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

// Which `chrome` each context gets, from ExtensionPageChild.sys.mjs,
// ExtensionContent.sys.mjs and ExtensionUserScriptsContent.sys.mjs.
const CHROME_DOC = [
  "/**",
  " * `chrome` in a content script or a page of a Manifest V3 extension, which",
  " * is the same object as `browser`. In a page or devtools page of a Manifest",
  " * V2 extension an async function of `chrome` returns undefined, and the",
  " * chrome-mv2 entrypoints declare that object. The user-script entrypoints",
  " * declare the `chrome` of a user script.",
  " */",
];
const USER_SCRIPT_DOC = [
  "/**",
  " * `browser` in a user script whose world has messaging enabled. Firefox",
  " * builds it by hand with the functions below and nothing else, and a world",
  " * without messaging has no `browser`. `chrome` is the same object.",
  " */",
];
const MV2_DOC = [
  "/**",
  " * `chrome` in a page or devtools page of a Manifest V2 extension. Every async",
  " * function takes a callback and returns undefined, even when it is called",
  " * without one. Content scripts get the same object as `browser`.",
  " */",
];

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
    this.filledPaths = new Set();
    this.setProperties = new Set();
    this.returnsUsed = new Set();
    this.typeUse = new Map();
  }

  // Pinned to the commit provenance.json records, so the link opens the
  // schema these declarations were built from.
  getSearchfoxUrl(sourceFile) {
    const rev = /^[0-9a-f]{40}$/.test(this.commitSha) ? `rev/${this.commitSha}` : "source";
    return `https://searchfox.org/firefox-main/${rev}/${sourceFile}`;
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

  qualifiedRef(ref, nsName) {
    const mapped = Object.hasOwn(REF_TYPES, ref) ? REF_TYPES[ref] : "";
    if (mapped.startsWith("browser.")) return mapped.slice("browser.".length);
    return ref.includes(".") ? ref : `${nsName}.${ref}`;
  }

  findType(ref, nsName) {
    const qualified = this.qualifiedRef(ref, nsName);
    const dot = qualified.lastIndexOf(".");
    const ns = this.namespaces[qualified.slice(0, dot)];
    const node = ns && ns.types[qualified.slice(dot + 1)];
    return node ? { qualified, nsName: qualified.slice(0, dot), node } : null;
  }

  // Schemas.sys.mjs normalizes a value the extension hands to Firefox
  // against its schema: CallEntry.checkParameters for the arguments of a
  // function or method and the extra arguments of addListener, and
  // Extension.sys.mjs parseManifest for the manifest. There
  // ObjectType.checkProperty takes null on an optional property as absent.
  // Nothing normalizes a value Firefox hands back, what a listener returns,
  // or what the extension passes to a function Firefox gave it, except for a
  // result that hands the input back (NORMALIZED_RESULTS). A named type only
  // ever handed in is declared with null on its optional properties. One that
  // also comes back is declared as it comes back, and wrapped in Normalizable
  // where it is handed in. The arguments of a function Firefox hands to the
  // extension, such as the suggest callback of omnibox.onInputChanged, go
  // back to Firefox without normalization ("raw"). They count as values
  // that come back, and a type only ever used that way is noted as raw.
  classifyTypes() {
    // The nodes under `node` that its declaration is built from, read in the
    // order emitType reads them. A named object type is an interface of its
    // properties.
    const nestedNodes = (node, named) => {
      if ("isInstanceOf" in node || "$ref" in node) return [];
      if ("choices" in node) return node.choices;
      if ("enum" in node) return [];
      if (node.type === "array") return [node.items];
      if (node.type !== "object") return [];
      const properties = Object.values(node.properties || {});
      if (properties.length || named) return properties;
      const patterns = Object.values(node.patternProperties || {});
      return patterns.length ? patterns : [node.additionalProperties];
    };
    const use = new Map();
    const seen = new Set();
    const walk = (node, nsName, input, named = false) => {
      if (!node || typeof node !== "object") return;
      if ("$ref" in node) {
        const target = this.findType(node.$ref, nsName);
        if (!target || seen.has(`${input} ${target.qualified}`)) return;
        seen.add(`${input} ${target.qualified}`);
        const direction = input === true ? "in" : input === "raw" ? "raw" : "out";
        use.set(target.qualified, { ...use.get(target.qualified), [direction]: true });
        walk(target.node, target.nsName, input, true);
        return;
      }
      // Firefox calls a function the extension hands over, so its arguments
      // come back out. The extension calls a function Firefox hands over.
      const opaque = "isInstanceOf" in node || "choices" in node || "enum" in node;
      if (!opaque && node.type === "function") {
        for (const p of node.parameters || []) walk(p, nsName, input === false ? "raw" : false);
        return;
      }
      for (const value of nestedNodes(node, named)) walk(value, nsName, input);
    };
    const call = (fn, nsName, key) => {
      const handsBack = NORMALIZED_RESULTS.has(key);
      for (const definition of [fn, ...(fn._alternates || [])]) {
        for (const p of definition.parameters || []) {
          if (handsBack && p.type === "function") {
            for (const q of p.parameters || []) walk(q, nsName, true);
          } else {
            walk(p, nsName, true);
          }
        }
        if (!FUNCTION_OVERRIDES[key]?.returns) walk(definition.returns, nsName, handsBack);
      }
    };
    const listen = (ev, nsName) => {
      for (const p of ev.parameters || []) walk(p, nsName, false);
      for (const p of ev.extraParameters || []) walk(p, nsName, true);
      walk(ev.returns, nsName, false);
    };
    for (const [nsName, ns] of Object.entries(this.namespaces)) {
      for (const [name, fn] of Object.entries(ns.functions)) call(fn, nsName, `${nsName}.${name}`);
      for (const ev of Object.values(ns.events)) listen(ev, nsName);
      for (const prop of Object.values(ns.properties)) walk(prop, nsName, false);
      for (const [typeId, type] of Object.entries(ns.types)) {
        for (const fn of type.functions || []) call(fn, nsName, `${nsName}.${typeId}.${fn.name}`);
        for (const ev of type.events || []) listen(ev, nsName);
      }
    }
    for (const ref of MANIFEST_TYPES) walk({ $ref: ref }, "", true);

    const gainsNull = (node, nsName, visited, named = false) => {
      if (!node || typeof node !== "object") return false;
      if ("$ref" in node) {
        const target = this.findType(node.$ref, nsName);
        if (!target || visited.has(target.qualified)) return false;
        visited.add(target.qualified);
        return gainsNull(target.node, target.nsName, visited, true);
      }
      return nestedNodes(node, named).some(
        (value) => value && ((value.optional && !value.unsupported) || gainsNull(value, nsName, visited))
      );
    };
    this.typeUse = new Map();
    for (const [qualified, { in: input, out, raw }] of use) {
      const output = out || raw;
      this.typeUse.set(qualified, {
        declareInput: Boolean(input && !output),
        wrapInput: Boolean(input && output && gainsNull({ $ref: qualified }, "", new Set())),
        rawOnly: Boolean(raw && !input && !out),
      });
    }
  }

  // Where a named type is declared: true for a value Firefox normalizes on
  // the way in, "raw" for one the extension passes to a function Firefox
  // handed it, false for one Firefox hands to the extension.
  typePosition(qualified) {
    const use = this.typeUse.get(qualified);
    if (use?.declareInput) return true;
    return use?.rawOnly ? "raw" : false;
  }

  // The properties under the type `qualified` that ObjectType.checkProperty
  // fills with their schema default, as the dotted paths Normalized takes.
  // One gated to a manifest version is left out in the other, and one marked
  // "omit-key-if-missing" is left out when missing, so its path ends in `?`.
  // An unsupported property is never written. Normalized matches a path by
  // key in every member of a union, so a key that has a default in one
  // member and none in another cannot be expressed.
  normalizedDefaults(qualified) {
    const fills = NORMALIZED_FILLS[qualified] || [];
    const found = new Map();
    const note = (path, mark) => found.set(path, new Set(found.get(path)).add(mark));
    const visit = (node, nsName, prefix, trail, named = false) => {
      if (!node || typeof node !== "object" || "isInstanceOf" in node) return;
      if ("$ref" in node) {
        const target = this.findType(node.$ref, nsName);
        if (!target || trail.includes(target.qualified)) return;
        visit(target.node, target.nsName, prefix, [...trail, target.qualified], true);
        return;
      }
      if ("choices" in node) {
        for (const choice of node.choices) visit(choice, nsName, prefix, trail);
        return;
      }
      if ("enum" in node) return;
      if (node.type === "array") {
        visit(node.items, nsName, prefix, trail);
        return;
      }
      if (node.type !== "object") return;
      const properties = Object.entries(node.properties || {});
      if (!properties.length && !named) {
        const patterns = Object.values(node.patternProperties || {});
        for (const value of patterns.length ? patterns : [node.additionalProperties]) {
          visit(value, nsName, `${prefix}*.`, trail);
        }
        return;
      }
      for (const [name, p] of properties) {
        const path = prefix + name;
        if (p.unsupported) continue;
        if (fills.includes(path)) {
          this.filledPaths.add(`${qualified} ${path}`);
          note(path, "");
        } else if (p.default === undefined || p.default === null) {
          note(path, "none");
        } else {
          const gated =
            (p.min_manifest_version ?? MIN_MANIFEST_VERSION) > MIN_MANIFEST_VERSION ||
            (p.max_manifest_version ?? MAX_MANIFEST_VERSION) < MAX_MANIFEST_VERSION;
          note(path, gated || p.optional === "omit-key-if-missing" ? "?" : "");
        }
        visit(p, nsName, `${path}.`, trail);
      }
    };
    visit({ $ref: qualified }, "", "", []);
    const paths = [];
    for (const [path, marks] of found) {
      if (marks.size > 1) {
        throw new Error(`${qualified}: ${path} is filled with a default in one shape and not in another`);
      }
      const [mark] = marks;
      if (mark !== "none") paths.push(path + mark);
    }
    return paths.sort(codePointCompare);
  }

  // An override names a normalized value as Normalized<browser.ns.Type>.
  // The paths normalization fills are read from the schema here.
  withDefaults(text) {
    return text.replace(/\bNormalized<browser\.([\w.]+)>/g, (whole, qualified) => {
      const paths = this.normalizedDefaults(qualified);
      return paths.length ? `Normalized<browser.${qualified}, ${paths.map((p) => JSON.stringify(p)).join(" | ")}>` : whole;
    });
  }

  // `input` is true for a value the extension hands to Firefox, which
  // normalizes it against the schema on the way in, "raw" for one the
  // extension passes to a function Firefox handed it, which nothing
  // normalizes, and false for a value Firefox hands to the extension.
  // An editor shows no comment inside a type, so the doc of what holds it
  // describes its choices and array items (typeDocLines).
  emitType(typeInfo, currentNs, indent = "", input = false) {
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
        (p) => `${sanitizeName(p.name || "arg")}: ${this.emitValueType(p, currentNs, indent, input)}`
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

    // Schemas.sys.mjs injects a property with a value as a ValueProperty,
    // whose descriptor is that value whatever its type says.
    if ("value" in typeInfo) {
      const val = typeInfo.value;
      if (["boolean", "number", "string"].includes(typeof val)) {
        return JSON.stringify(val);
      }
      return "unknown";
    }

    if ("$ref" in typeInfo) {
      const ref = typeInfo.$ref;
      if (Object.hasOwn(REF_TYPES, ref)) {
        return REF_TYPES[ref];
      }
      let name = ref;
      if (ref.includes(".")) {
        const ns = ref.split(".")[0];
        if (!this.availableNamespaces.has(ns)) {
          return "unknown";
        }
        name = `browser.${ref}`;
      }
      return input === true && this.typeUse.get(this.qualifiedRef(ref, currentNs))?.wrapInput ? `Normalizable<${name}>` : name;
    }

    if ("choices" in typeInfo) {
      const rawChoices = typeInfo.choices.map((c) => this.emitType(c, currentNs, indent, input));
      const hasBareString = rawChoices.includes("string");
      const hasLiterals = rawChoices.some((c) => c.startsWith('"'));
      const useOpenString = hasBareString && hasLiterals;

      const members = rawChoices.map((raw) => (raw === "string" && useOpenString ? "(string & {})" : raw));
      return members.length ? [...new Set(members)].join(" | ") : "unknown";
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
      const innerType = this.emitType(items, currentNs, indent, input);
      // Schemas.sys.mjs ArrayType.normalize rejects any other length. The
      // bounds are only read where the schema gives both.
      const bounds = Object.keys(typeInfo);
      if (bounds.includes("minItems") && bounds.includes("maxItems") && typeInfo.minItems === typeInfo.maxItems) {
        return `[${new Array(typeInfo.maxItems).fill(innerType).join(", ")}]`;
      }
      if (innerType.includes(" | ")) {
        return `(${innerType})[]`;
      }
      return `${innerType}[]`;
    } else if (t === "object") {
      if (typeInfo.properties && Object.keys(typeInfo.properties).length > 0) {
        return this.emitObjectLiteral(typeInfo, currentNs, indent, input);
      }
      return this.emitMapType(typeInfo, currentNs, input);
    } else if (t === "function") {
      if (!typeInfo.parameters) {
        return "((...args: any[]) => void)";
      }
      const params = (typeInfo.parameters || []).map((p) => {
        const pType = this.emitValueType(p, currentNs, indent, input === false ? "raw" : false);
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
  // place such an object has open keys (the namespace the schema gives an
  // empty permissions list, see neverInjected): BrowserSpecificSettings takes the
  // settings of other browsers. Port and lastError are values Firefox hands
  // to the extension, and a $ref here is manifest.json UnrecognizedProperty,
  // which accepts the key with a warning, so a misspelled key stays a
  // compile error.
  acceptsAnyKey(typeInfo, nsName) {
    if (!this.namespaces[nsName]?.neverInjected) return false;
    const additional = typeInfo.additionalProperties;
    return Boolean(additional) && typeof additional === "object" && additional.type === "any";
  }

  emitObjectLiteral(typeInfo, currentNs, indent, input = false) {
    const inner = indent + "    ";
    const lines = ["{"];
    const declared = [];
    const sortedEntries = Object.entries(typeInfo.properties).sort(entryCodePointCompare);
    for (const [pName, pVal] of sortedEntries) {
      lines.push(...this.memberDoc(pVal, currentNs, inner, input));
      const pType = this.emitType(pVal, currentNs, inner, input);
      const declaration = this.optionalProperty(pVal, pType, input);
      declared.push(declaration);
      lines.push(`${inner}${sanitizePropertyName(pName)}${declaration};`);
    }
    if (typeInfo._openKeys) lines.push(`${inner}[key: string]: ${this.otherKeysType(typeInfo, currentNs, input, declared)};`);
    lines.push(`${indent}}`);
    return lines.join("\n");
  }

  // Schemas.sys.mjs ObjectType.normalize hands a key outside `properties` to
  // additionalProperties, and for an OPEN_OBJECTS entry Firefox uses such a
  // key, so any other key takes a value of that type. TypeScript holds the
  // named properties to the index signature too, so their types are in it as
  // well. `declared` is what follows each property name.
  otherKeysType(typeInfo, currentNs, input, declared) {
    const own = unionMembers(this.emitType(typeInfo.additionalProperties, currentNs, "", input));
    const named = declared.flatMap((d) => unionMembers(d.replace(/^\??: /, "")));
    const subsumed = (m) => own.includes("string") && /^"[^"]*"$/.test(m);
    const members = [...new Set([...own, ...named.filter((m) => !subsumed(m))])];
    const nullish = ["null", "undefined"].filter((m) => members.includes(m));
    return [...members.filter((m) => !nullish.includes(m)), ...nullish].join(" | ");
  }

  resolvePrimitive(t, currentNs) {
    if (t === "integer") {
      return "number";
    }
    return t;
  }

  // Schemas.sys.mjs ObjectType.checkProperty treats an explicit undefined
  // on an optional property as absent, so `?: T` must also admit undefined
  // under exactOptionalPropertyTypes. It treats null the same way, which only
  // matters for a value Firefox normalizes on the way in. An unsupported
  // property of such a value is rejected when its key is present, even with
  // the value undefined, which only exactOptionalPropertyTypes can express.
  // Firefox never sets one on a value it hands back (SET_PROPERTIES lists
  // where the schema is wrong).
  optionalProperty(pVal, pType, input = false) {
    if (pVal?.unsupported && input === true) return "?: never";
    if (pVal?.unsupported && input === false) return "?: undefined";
    if (pVal?.readsNull) pType = `${grouped(pType)} | null`;
    if (!pVal || !pVal.optional) {
      return `: ${pType}`;
    }
    if (pType === "any" || pType === "unknown") {
      return `?: ${pType}`;
    }
    const orNull = input === true && !pVal.unsupported && !pType.endsWith("| null") ? " | null" : "";
    return `?: ${grouped(pType)}${orNull} | undefined`;
  }

  // A value the runtime hands to the extension: a schema-optional callback
  // argument or tuple element arrives as undefined when absent.
  emitValueType(p, currentNs, indent = "", input = false) {
    const t = this.emitType(p, currentNs, indent, input);
    if (!p || !p.optional || t === "any" || t === "unknown" || t.endsWith("| null")) {
      return t;
    }
    return `${grouped(t)} | undefined`;
  }

  // Objects without named properties: the key space comes from
  // patternProperties and the value type from additionalProperties, both
  // enforced by Schemas.sys.mjs ObjectType.normalize.
  emitMapType(typeInfo, currentNs, input = false) {
    const patterns = Object.entries(typeInfo.patternProperties || {});
    if (patterns.length > 0) {
      const numeric = patterns.every(([pattern]) => pattern === "^[1-9]\\d*$");
      const valueTypes = [];
      for (const [, valueSchema] of patterns) {
        const vt = this.emitType(valueSchema, currentNs, "", input);
        if (!valueTypes.includes(vt)) valueTypes.push(vt);
      }
      return `{ [key: ${numeric ? "number" : "string"}]: ${valueTypes.join(" | ")} }`;
    }
    const additional = typeInfo.additionalProperties;
    if (additional && typeof additional === "object") {
      if (additional.type === "any") {
        return "Record<string, any>";
      }
      return `{ [key: string]: ${this.emitType(additional, currentNs, "", input)} }`;
    }
    return "Record<string, unknown>";
  }

  /** Assembles one JSDoc block. */
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
    if (spec.list?.length) {
      if (body.length) body.push(`${indent} *`);
      body.push(...spec.list.map((item) => `${indent} * ${item}`));
    }
    const tags = [];
    // A list starts on the line after its tag, so it renders as a list.
    const tagText = (text) => (text.startsWith("- ") ? `\n${text}` : ` ${text}`);
    for (const [name, text] of spec.params || []) {
      tags.push(...commentLines(`@param ${name}${tagText(text)}`, indent));
    }
    if (spec.returns) {
      tags.push(...commentLines(`@returns${tagText(spec.returns)}`, indent));
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
  // value carrying an unsupported property (ObjectType.checkProperty). Only
  // a value it normalizes is checked, and `input` says where a member sits,
  // as emitType reads it.
  deprecationText(node, nsName, kind, input = true) {
    const parts = [];
    if (node.unsupported) {
      const product = TARGET_PRODUCT[this.target] || "Firefox";
      const member = {
        true: "rejects an object that includes it",
        raw: "ignores it",
        false: "never sets it",
      }[String(input)];
      parts.push(
        kind === "member"
          ? `${product} does not support this property and ${member}.`
          : `${product} does not support this ${kind}. It does not exist at runtime.`
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

  // An editor shows no comment inside a union or in front of an array
  // element type, so the doc of what holds the type lists its choices and
  // the description of its items, one list item each. Every Schemas.sys.mjs
  // type reads `deprecated` (Entry) and warns when it normalizes a value
  // (checkDeprecated), so a choice can be deprecated on its own. memberDoc
  // notes a deprecated literal choice of the property itself already
  // (deprecatedLiterals), and passes `literalDeprecations` false.
  typeDocLines(node, nsName, literalDeprecations = true) {
    if (!node || typeof node !== "object") return [];
    if (node.items && typeof node.items === "object") {
      const own = this.docText(node.items.description || "", nsName).replace(/\n+/g, " ");
      return [...(own ? [`- Each item: ${own}`] : []), ...this.typeDocLines(node.items, nsName)];
    }
    return (node.choices || []).flatMap((c) => {
      const deprecated = Array.isArray(c.enum) && !literalDeprecations ? null : this.deprecationText(c, nsName, "member");
      const text = [
        this.docText(c.description || "", nsName).replace(/\n+/g, " "),
        ...this.manifestVersionNotes(c),
        deprecated === null ? "" : `Deprecated.${deprecated ? ` ${deprecated}` : ""}`,
      ]
        .filter(Boolean)
        .join(" ");
      return text ? [`- ${this.choiceLabel(c, nsName)}: ${text}`] : [];
    });
  }

  // A choice of literals is labeled with them, any other with its type, or
  // with its schema type when that runs long.
  choiceLabel(c, nsName) {
    if (Array.isArray(c.enum)) return c.enum.map((v) => `\`${formatEnumVal(v)}\``).join(", ");
    const t = this.emitType(c, nsName);
    if (!t.includes("\n") && t.length <= 40) return `\`${t}\``;
    return `\`${c.type === "integer" ? "number" : c.type ?? "value"}\``;
  }

  // An editor shows no comment on a parameter of a function type, so what
  // holds the function lists the values it is called with, one item each.
  functionParamLines(fnNode, nsName) {
    return (fnNode?.type === "function" ? fnNode.parameters || [] : [])
      .filter((q) => q.description)
      .map((q) => `- \`${sanitizeName(q.name || "arg")}\`: ${this.docText(q.description, nsName).replace(/\n+/g, " ")}`);
  }

  // The literal values of the choices of `node` that are deprecated, each
  // with the deprecation text. Schemas.sys.mjs checkDeprecated warns when
  // a value matching a deprecated choice is normalized.
  deprecatedLiterals(node, nsName) {
    const found = [];
    for (const choice of node.choices || []) {
      const text = this.deprecationText(choice, nsName, "member");
      if (text === null || !Array.isArray(choice.enum)) continue;
      for (const value of choice.enum) found.push({ literal: formatEnumVal(value), text });
    }
    return found;
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

  // The @platform of a member: its targets, or null when they are those of
  // its owner, the type that holds it or else its namespace. A namespace
  // always has the tag.
  memberPlatforms(nsName, kind, name, ownerTypeId = null) {
    const own = this.platformsFor(nsName, kind, name, ownerTypeId);
    const owner = ownerTypeId ? this.platformsFor(nsName, "type", ownerTypeId) : this.platformsFor(nsName, "namespace");
    return own.join() === owner.join() ? null : own;
  }

  // JSDoc for a property of an object type: a schema type property, a
  // manifest key or a member of an inline parameter object.
  memberDoc(pVal, nsName, indent, input = true) {
    if (!pVal || typeof pVal !== "object") return [];
    const notes = this.manifestVersionNotes(pVal);
    // Extension.sys.mjs rejects or ignores a privileged manifest key in an
    // unprivileged extension.
    if (pVal.privileged) {
      notes.push("Only privileged extensions can use this key.");
    }
    notes.push(this.defaultNote(pVal));
    for (const { literal, text } of this.deprecatedLiterals(pVal, nsName)) {
      notes.push(`\`${literal}\` is deprecated${text ? `: ${text}` : "."}`);
    }
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
        list: this.typeDocLines(pVal, nsName, false),
        params,
        deprecated: this.deprecationText(pVal, nsName, "member", input),
        permissions: pVal.permissions,
      },
      indent
    );
  }

  // Names the inline object types of a function, method or event after the
  // parameter they type, in a namespace merged with the owner, and marks
  // each schema node so every later emission references that name. A
  // function override states the return type whole, so the schema's returns
  // object is not named. The arguments of a function are input, the
  // arguments of an event listener are not.
  nameHelpers(node, holder, currentNs, returnsOverridden = false, isEvent = false, typedParameters = {}) {
    const helpers = [];
    const register = (name, typeInfo, input = false) => {
      const existing = helpers.find((h) => h.name === name);
      if (existing) {
        if (JSON.stringify(existing.typeInfo) !== JSON.stringify(typeInfo)) {
          throw new Error(`${currentNs}.${holder}: two different inline types would be named ${name}`);
        }
        typeInfo._helper = `${holder}.${name}`;
        return;
      }
      helpers.push({ name, typeInfo, input });
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
      } else if (isInlineObject(p) && !typedParameters[p.name]) {
        register(capitalize(sanitizeName(p.name || "arg")), p, !isEvent);
      }
    }
    if (!returnsOverridden && isInlineObject(node.returns)) {
      register("Result", node.returns);
    }
    return helpers;
  }

  // The types EVENT_TYPES declares beside the inline types of an event.
  eventTypes(evKey) {
    return Object.entries(EVENT_TYPES[evKey] || {}).map(([name, { description, type }]) => ({ name, description, type }));
  }

  emitHelperTypes(helpers, currentNs, indent) {
    const out = [];
    for (const { name, typeInfo, input, description, type } of helpers) {
      if (type) {
        out.push(...this.jsdoc({ description }, indent), `${indent}export type ${name} = ${type};`);
        continue;
      }
      out.push(...this.jsdoc({ description: this.docText(typeInfo.description, currentNs) }, indent));
      const literal = this.emitObjectLiteral(typeInfo, currentNs, indent, input);
      out.push(`${indent}export type ${name} = ${literal};`);
    }
    return out;
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
    if ([...NULL_RESULT_PROPERTIES].some((key) => key.startsWith(`${fnKey}.`))) {
      fn = withNullResultProperties(fn, fnKey);
    }
    const override = FUNCTION_OVERRIDES[fnKey] || {};
    const sourceFile = fn._source_file || "";
    const holder = name === "eval" ? "_eval" : name;
    const helpers = this.nameHelpers(
      fn,
      ownerTypeId ? `${ownerTypeId}.${holder}` : holder,
      currentNs,
      "returns" in override,
      false,
      override.parameters
    );

    const asyncResult = ASYNC_RESULTS[fnKey];
    let overloads = override.overloads ? this.listedOverloads(fn, fnKey, override.overloads) : resolveOverloads(fn);
    if (override.promiseOnly) overloads = overloads.filter((ov) => ov.is_promise);
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
        pType = `((result: ${this.withDefaults(asyncResult)}) => void)`;
      } else if (p.type === "function" && (p.parameters || []).length === 1) {
        // The callback is handed the value the Promise form resolves with.
        const [payload] = p.parameters;
        pType = `((${sanitizeName(payload.name || "arg")}: ${this.promiseResult(payload, fnKey, currentNs, indent)}) => void)`;
      } else {
        pType = this.emitType(p, currentNs, indent, true);
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
        pType = isOpt ? `${grouped(pType)} | null` : `${grouped(pType)} | null | undefined`;
      }

      const typeUnqualified = pType.split(".").pop();
      if (pName === pType || pName === typeUnqualified) {
        pName = pName[0].toLowerCase() + pName.slice(1);
        if (pName === pType || pName === typeUnqualified) {
          pName = "item";
        }
      }
      return { name: pName, type: pType, optional: isOpt, text: `${pName}${isOpt ? "?" : ""}: ${pType}` };
    };

    const docParams = [];
    const seenParams = new Set();
    for (const ov of overloads) {
      for (const p of ov.parameters) {
        const { name: emitted } = emitParam(p, ov);
        if (seenParams.has(emitted)) continue;
        seenParams.add(emitted);
        const head = [p.description ? this.docText(p.description, currentNs) : "", this.defaultNote(p)].filter(Boolean).join(" ");
        const choices = override.parameters?.[p.name] ? [] : this.typeDocLines(p, currentNs);
        const text = [head, ...choices].filter(Boolean).join("\n");
        if (text) {
          docParams.push([emitted, text]);
        }
      }
    }
    const callback = (fn.parameters || []).find((p) => p.type === "function");
    const payloads = callback?.parameters || [];
    const returnsText = fn.returns?.description
      ? this.docText(fn.returns.description, currentNs)
      : payloads.length === 1
        ? this.docText(payloads[0].description || "", currentNs)
        : this.functionParamLines(callback, currentNs).join("\n");

    const notes = this.manifestVersionNotes(fn);
    // ExtensionChild.sys.mjs callAsyncFunction rejects the call unless the
    // window is handling user input.
    if (fn.requireUserInput) {
      notes.push("Must be called from a user input handler.");
    }
    if (!isMethod) {
      notes.push(this.memberContextNote(fn, currentNs));
    }
    const docSpec = {
      description: this.docText(fn.description, currentNs),
      notes,
      params: docParams,
      returns: returnsText,
      deprecated: this.deprecationText(fn, currentNs, isMethod ? "method" : "function"),
      see: sourceFile ? this.getSearchfoxUrl(sourceFile) : null,
      permissions: fn.permissions,
      platforms: this.memberPlatforms(currentNs, "function", fn.name, ownerTypeId),
    };
    const jsdoc = this.jsdoc(docSpec, indent);

    const signature = (paramsStr, actualRet) => {
      const typeParams = override.typeParameters || "";
      if (isMethod) return `${indent}${name}${typeParams}(${paramsStr}): ${actualRet};`;
      if (name === "eval") return `${indent}function _eval${typeParams}(${paramsStr}): ${actualRet};`;
      return `${indent}export function ${name}${typeParams}(${paramsStr}): ${actualRet};`;
    };

    for (let i = 0; i < overloads.length; i++) {
      const ov = overloads[i];
      let actualRet;
      if (ov.is_promise) {
        actualRet = this.callbackOnly
          ? "void"
          : `globalThis.Promise<${this.promiseResult(ov.callback_payload, fnKey, currentNs, indent)}>`;
      } else {
        actualRet = override.returns ? this.withDefaults(override.returns) : this.optionalResult(ov.returns, fnKey, currentNs, indent);
      }

      // TypeScript's language service ignores a @deprecated tag on a choice
      // inside a union. A call that picks the deprecated literal resolves to
      // the overload placed before the normal one and is struck through.
      // Completion shows the comment of the first overload, so the
      // deprecated one carries the whole comment too.
      ov.parameters.forEach((p, at) => {
        if (!isInlineObject(p) || (override.parameters && override.parameters[p.name])) return;
        for (const [key, value] of Object.entries(p.properties || {}).sort(entryCodePointCompare)) {
          for (const { literal, text } of this.deprecatedLiterals(value, currentNs)) {
            const members = ov.parameters.map((q, k) => {
              const emitted = emitParam(q, ov);
              if (k === at) {
                const narrowed = `${this.emitType(q, currentNs, indent, true)} & { ${sanitizePropertyName(key)}: ${literal} }`;
                return `${emitted.name}: ${narrowed}`;
              }
              // A required parameter cannot follow an optional one.
              return k < at && emitted.optional ? `${emitted.name}: ${emitted.type} | undefined` : emitted.text;
            });
            const literalNote = `\`${key}: ${literal}\` is deprecated${text ? `: ${text}` : "."}`;
            const deprecated = [docSpec.deprecated, literalNote].filter(Boolean).join(" ");
            lines.push(...this.jsdoc({ ...docSpec, deprecated }, indent), signature(members.join(", "), actualRet));
          }
        }
      });

      if (i === 0) {
        lines.push(...jsdoc);
      }

      const paramsStr = ov.parameters.map((p) => emitParam(p, ov).text).join(", ");
      lines.push(signature(paramsStr, actualRet));
    }

    if (!isMethod && name === "eval") {
      lines.push(`${indent}export { _eval as eval };`);
    }

    return { lines, helpers, holder };
  }

  // The Promise and callback forms of the overloads FUNCTION_OVERRIDES lists
  // for `fn`, fewest parameters first. Firefox takes a trailing function as
  // the callback before it reads the other arguments, so a callback form
  // goes before a longer list's Promise form of the same length. Among forms
  // of one length the Promise form goes first, so an `any` argument picks it,
  // and the listed order holds otherwise.
  listedOverloads(fn, fnKey, lists) {
    const parameters = fn.parameters || [];
    const callback = parameters.filter((p) => p.type === "function" && p.name === fn.async);
    return lists.flatMap((names) => {
      const listed = names.map((name) => {
        const p = parameters.find((q) => q.name === name);
        if (!p || p === callback[0]) {
          throw new Error(`FUNCTION_OVERRIDES ${fnKey}: an overload names ${name}, which is not a parameter of the schema function.`);
        }
        return p;
      });
      const kept = listed.map((p, i) =>
        p.optional && listed.slice(i + 1).some((q) => !q.optional) ? copyNode(p, { optional: false, nullable: true }) : p
      );
      return resolveOverloads(copyNode(fn, { parameters: [...kept, ...callback] }));
    }).sort((a, b) => a.parameters.length - b.parameters.length || Number(b.is_promise) - Number(a.is_promise));
  }

  promiseResult(payload, fnKey, currentNs, indent = "") {
    const override = FUNCTION_OVERRIDES[fnKey] || {};
    if (override.result) {
      return this.withDefaults(override.result);
    }
    if (payload === "void") {
      return ASYNC_RESULTS[fnKey] ? this.withDefaults(ASYNC_RESULTS[fnKey]) : "void";
    }
    return this.optionalResult(payload, fnKey, currentNs, indent);
  }

  // A schema-optional result reads as null for a NULL_RESULTS function and
  // as undefined otherwise. REQUIRED_RESULTS drops the optional flag.
  optionalResult(node, fnKey, currentNs, indent) {
    if (node.optional && REQUIRED_RESULTS.has(fnKey)) node = copyNode(node, { optional: false });
    const t = this.emitType(node, currentNs, indent);
    if (!node.optional || t === "any" || t === "unknown" || t.endsWith("| null")) {
      return t;
    }
    return `${grouped(t)} | ${NULL_RESULTS.has(fnKey) ? "null" : "undefined"}`;
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
    if (Object.hasOwn(EVENT_LISTENER_RETURNS, evKey)) {
      if (ev.returns) {
        throw new Error(`EVENT_LISTENER_RETURNS ${evKey}: the schema now gives the event a returns. Delete the entry from src/overrides.js.`);
      }
      this.returnsUsed.add(evKey);
      return EVENT_LISTENER_RETURNS[evKey];
    }
    if (!ev.returns) {
      return "void";
    }
    const value = this.emitType(ev.returns, nsName, indent);
    const optional = Boolean(ev.returns.optional);
    const parts = [value];
    if (evKey in EVENT_LISTENER_PROMISES) {
      const resolved = EVENT_LISTENER_PROMISES[evKey] ?? value;
      const open = resolved === "unknown" || resolved === "any";
      parts.push(`globalThis.Promise<${optional && !open ? `${resolved} | void` : resolved}>`);
    }
    if (optional) {
      parts.push("void");
    }
    return parts.join(" | ");
  }

  // The event `ev` with each argument property SET_PROPERTIES names as
  // `${evKey}.${parameter}.${property}` declared as set.
  withSetProperties(ev, evKey) {
    const parameters = (ev.parameters || []).map((p) => {
      const names = Object.keys(p.properties || {}).filter((name) => SET_PROPERTIES.has(`${evKey}.${p.name}.${name}`));
      if (!names.length) return p;
      const properties = { ...p.properties };
      for (const name of names) {
        const key = `${evKey}.${p.name}.${name}`;
        if (!properties[name].unsupported) {
          throw new Error(`SET_PROPERTIES ${key}: the schema no longer marks it unsupported. Delete it from src/overrides.js.`);
        }
        properties[name] = copyNode(properties[name], { unsupported: false });
        this.setProperties.add(key);
      }
      return copyNode(p, { properties });
    });
    return parameters.some((p, i) => p !== ev.parameters[i]) ? copyNode(ev, { parameters }) : ev;
  }

  // Schemas.sys.mjs Event.getDescriptor: addListener(listener, ...extraParameters)
  // checks the extra arguments like function parameters, so an optional one
  // also takes null. removeListener and hasListener take the listener only.
  // An editor shows the comment of the method it hovers, not of the event
  // that holds it, so a documented event declares addListener itself and
  // repeats the event's comment there.
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
    const documented = Boolean(ev.description) || [...(ev.parameters || []), ...extras].some((p) => p.description);
    if (extras.length === 0 && !documented) {
      return `WebExtensionEvent<${listener}>`;
    }
    const extraSignature = extras.map((p) => {
      const name = sanitizeName(p.name || "arg");
      const type = this.emitType(p, nsName, indent, true);
      return p.optional ? `${name}?: ${type} | null` : `${name}: ${type}`;
    });
    const addListener = `addListener(${[`callback: ${listener}`, ...extraSignature].join(", ")}): void`;
    if (!documented) {
      return `Omit<WebExtensionEvent<${listener}>, "addListener"> & { ${addListener} }`;
    }
    return [
      `Omit<WebExtensionEvent<${listener}>, "addListener"> & {`,
      ...this.eventDoc(ev, nsName, `${indent}    `, ownerTypeId),
      `${indent}    ${addListener};`,
      `${indent}}`,
    ].join("\n");
  }

  eventDoc(ev, nsName, indent, ownerTypeId = null) {
    const params = (ev.parameters || [])
      .map((p) => [
        sanitizeName(p.name || "details"),
        [this.docText(p.description || "", nsName), ...this.functionParamLines(p, nsName)].filter(Boolean).join("\n"),
      ])
      .filter(([, text]) => text);
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
        platforms: this.memberPlatforms(nsName, "event", ev.name, ownerTypeId),
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
          platforms: this.memberPlatforms(nsName, "type", typeId),
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
      const input = this.typePosition(`${nsName}.${typeId}`);
      out.push(
        ...this.jsdoc(
          {
            description: this.docText(tInfo.description, nsName),
            notes: this.manifestVersionNotes(tInfo),
            list: this.typeDocLines(tInfo, nsName),
            deprecated: this.deprecationText(tInfo, nsName, "type"),
            see: tInfo._source_file ? this.getSearchfoxUrl(tInfo._source_file) : null,
            platforms: this.memberPlatforms(nsName, "type", typeId),
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
          const cStr = this.emitType(c, nsName, indent, input);
          if (cStr === "string") {
            hasBareString = true;
          } else {
            members.push(cStr);
          }
        }
        if (hasBareString) {
          members.push("(string & {})");
        }
        out.push(`${indent}export type ${typeId} = ${[...new Set(members)].join(" | ")};`);
      } else if (tInfo.type === "object" || "properties" in tInfo) {
        const typeOverride = TYPE_OVERRIDES[`${nsName}.${typeId}`] || {};
        const overriddenProps = typeOverride.properties || {};
        out.push(`${indent}export interface ${typeId}${typeOverride.typeParameters || ""} {`);

        const propsDict = { ...withNullProperties(tInfo, `${nsName}.${typeId}`).properties };
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
            out.push(...this.memberDoc(pVal, nsName, inner, input));
            const open = OPEN_OBJECTS.has(`${nsName}.${typeId}.${pName}`);
            const pType = this.emitType(open ? copyNode(pVal, { _openKeys: true }) : pVal, nsName, inner, input);

            out.push(
              `${inner}${sanitizePropertyName(pName)}${this.optionalProperty(pVal, pType, input)};`
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
          for (const schemaEv of sortedEvsList) {
            const ev = this.withSetProperties(schemaEv, `${nsName}.${typeId}.${schemaEv.name}`);
            const evName = sanitizeName(ev.name || "event");
            const helpers = [
              ...this.nameHelpers(ev, `${typeId}.${evName}`, nsName, false, true),
              ...this.eventTypes(`${nsName}.${typeId}.${ev.name}`),
            ];
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
        const baseT = this.emitType(tInfo, nsName, indent, input);
        out.push(`${indent}export type ${typeId} = ${baseT};`);
      }
      out.push(...this.emitEnumConstants(typeId, tInfo, ns, nsName, indent));
      out.push("");
    }

    const sortedProps = Object.entries(ns.properties).sort(entryCodePointCompare);
    for (const [pName, pVal] of sortedProps) {
      const readsNull = NULL_PROPERTIES.has(`${nsName}.${pName}`);
      out.push(...this.propertyDoc(pName, pVal, nsName, indent));
      const pType = this.emitType(pVal, nsName, indent);
      out.push(`${indent}export const ${sanitizeName(pName)}: ${pType}${readsNull ? " | null" : ""};`);
    }
    if (sortedProps.length) {
      out.push("");
    }

    const sortedEvents = Object.entries(ns.events).sort(entryCodePointCompare);
    for (const [evName, schemaEv] of sortedEvents) {
      const evVal = this.withSetProperties(schemaEv, `${nsName}.${evName}`);
      const holder = sanitizeName(evName);
      const helpers = [...this.nameHelpers(evVal, holder, nsName, false, true), ...this.eventTypes(`${nsName}.${evName}`)];
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

  propertyDoc(pName, pVal, nsName, indent) {
    const readsNull = NULL_PROPERTIES.has(`${nsName}.${pName}`);
    return this.jsdoc(
      {
        description: this.docText(pVal.description, nsName),
        notes: [
          ...this.manifestVersionNotes(pVal),
          this.memberContextNote(pVal, nsName),
          readsNull ? "Firefox returns `null` when no value is pending." : null,
        ],
        list: this.typeDocLines(pVal, nsName),
        deprecated: this.deprecationText(pVal, nsName, "property"),
        see: pVal._source_file ? this.getSearchfoxUrl(pVal._source_file) : null,
        permissions: pVal.permissions,
        platforms: this.memberPlatforms(nsName, "property", pName),
      },
      indent
    );
  }

  // ExtensionPageChild.sys.mjs gives an extension page or devtools page of a
  // Manifest V2 extension a `chrome` object whose context sets
  // isChromeCompat. For it Schemas.sys.mjs FunctionEntry passes an empty
  // callback to every async function called without one, and wrapPromise
  // returns undefined when it has a callback. That holds for the functions
  // of a namespace and for the methods SubModuleProperty injects into a
  // namespace property, such as storage.local.get. Everything else is what
  // `browser` holds, so it is declared as an alias of it.
  //
  // The types whose methods SubModuleProperty injects, as qualified names.
  submoduleTypes() {
    const found = new Set();
    for (const [nsName, ns] of Object.entries(this.namespaces)) {
      for (const pVal of Object.values(ns.properties)) {
        const target = "$ref" in pVal ? this.findType(pVal.$ref, nsName) : null;
        if (target && (target.node.functions || []).some((fn) => fn.async)) found.add(target.qualified);
      }
    }
    return found;
  }

  // Whether `chrome` in a Manifest V2 page differs from `browser` in the
  // namespace `nsName`, not counting namespaces nested in it.
  differsInMv2(nsName, submodules) {
    const ns = this.namespaces[nsName];
    if (!ns) return false;
    const refsSubmodule = (pVal) => "$ref" in pVal && submodules.has(this.findType(pVal.$ref, nsName)?.qualified);
    return (
      Object.values(ns.functions).some((fn) => fn.async) ||
      Object.keys(ns.types).some((typeId) => submodules.has(`${nsName}.${typeId}`)) ||
      Object.values(ns.properties).some(refsSubmodule)
    );
  }

  emitMv2Body(nsName, submodules, indent) {
    const ns = this.namespaces[nsName];
    const out = [];
    const target = `browser.${nsName}`;
    for (const [typeId, tInfo] of Object.entries(ns.types).sort(entryCodePointCompare)) {
      if (!submodules.has(`${nsName}.${typeId}`)) {
        out.push(`${indent}export import ${typeId} = ${target}.${typeId};`);
        continue;
      }
      const methods = [...(tInfo.functions || [])].filter((fn) => fn.async).sort((a, b) => codePointCompare(a.name, b.name));
      const omitted = methods.map((fn) => JSON.stringify(fn.name)).join(" | ");
      const holders = [];
      out.push(`${indent}export interface ${typeId} extends Omit<${target}.${typeId}, ${omitted}> {`);
      for (const fn of methods) {
        for (const definition of [fn, ...(fn._alternates || [])]) {
          const { lines, helpers, holder } = this.emitFunction(definition, nsName, `${indent}    `, true, typeId);
          out.push(...lines);
          if (helpers.length && !holders.includes(holder)) holders.push(holder);
        }
      }
      out.push(`${indent}}`);
      if (holders.length) {
        out.push(`${indent}export namespace ${typeId} {`);
        for (const holder of holders) out.push(`${indent}    export import ${holder} = ${target}.${typeId}.${holder};`);
        out.push(`${indent}}`);
      }
    }
    for (const [pName, pVal] of Object.entries(ns.properties).sort(entryCodePointCompare)) {
      const name = sanitizeName(pName);
      const submodule = "$ref" in pVal ? this.findType(pVal.$ref, nsName)?.qualified : null;
      if (submodule && submodules.has(submodule)) {
        out.push(...this.propertyDoc(pName, pVal, nsName, indent), `${indent}export const ${name}: chrome.${submodule};`);
      } else {
        out.push(`${indent}export import ${name} = ${target}.${name};`);
      }
    }
    for (const evName of Object.keys(ns.events).sort(codePointCompare)) {
      out.push(`${indent}export import ${sanitizeName(evName)} = ${target}.${sanitizeName(evName)};`);
    }
    for (const [fnName, fnVal] of Object.entries(ns.functions).sort(entryCodePointCompare)) {
      if (!fnVal.async) {
        out.push(`${indent}export import ${sanitizeName(fnName)} = ${target}.${sanitizeName(fnName)};`);
        continue;
      }
      const helperNames = [];
      let holderName = null;
      for (const definition of [fnVal, ...(fnVal._alternates || [])]) {
        const { lines, helpers, holder } = this.emitFunction(definition, nsName, indent);
        out.push(...lines);
        holderName = holder;
        for (const h of helpers) if (!helperNames.includes(h.name)) helperNames.push(h.name);
      }
      if (helperNames.length) {
        out.push(`${indent}export namespace ${holderName} {`);
        for (const h of helperNames) out.push(`${indent}    export type ${h} = ${target}.${holderName}.${h};`);
        out.push(`${indent}}`);
      }
    }
    return out;
  }

  // The `chrome` namespace of a Manifest V2 extension page.
  emitMv2Chrome(sortedRoots, subNsMap, declare) {
    const submodules = this.submoduleTypes();
    this.callbackOnly = true;
    const out = [...MV2_DOC, `${declare ? "declare" : "export"} namespace chrome {`];
    for (const root of sortedRoots) {
      const subs = [...(subNsMap[root] || [])].sort(([a], [b]) => codePointCompare(a, b));
      const subDiffers = subs.map(([sub]) => this.differsInMv2(`${root}.${sub}`, submodules));
      if (!this.differsInMv2(root, submodules) && !subDiffers.includes(true)) {
        out.push(`    export import ${root} = browser.${root};`);
        continue;
      }
      if (this.namespaces[root]) out.push(...this.namespaceDoc(this.namespaces[root], root, "    "));
      out.push(`    export namespace ${root} {`);
      if (this.namespaces[root]) out.push(...this.emitMv2Body(root, submodules, "        "));
      subs.forEach(([sub], i) => {
        if (!subDiffers[i]) {
          out.push(`        export import ${sub} = browser.${root}.${sub};`);
          return;
        }
        out.push(
          ...this.namespaceDoc(this.namespaces[`${root}.${sub}`], `${root}.${sub}`, "        "),
          `        export namespace ${sub} {`,
          ...this.emitMv2Body(`${root}.${sub}`, submodules, "            "),
          "        }"
        );
      });
      out.push("    }");
    }
    out.push("}", "");
    this.callbackOnly = false;
    return out;
  }

  // The `browser` and `chrome` of a user script, from USER_SCRIPT_API. The
  // module form imports the extension API for its types and the ambient form
  // reaches it through an import type, so neither declares that API.
  emitUserScript(ambient, importSpecifier) {
    const api = ambient ? `import("${importSpecifier}").browser.` : "extension.";
    const byNamespace = new Map();
    for (const [key, entry] of Object.entries(USER_SCRIPT_API).sort(entryCodePointCompare)) {
      const dot = key.lastIndexOf(".");
      const nsName = key.slice(0, dot);
      if (!byNamespace.has(nsName)) byNamespace.set(nsName, []);
      byNamespace.get(nsName).push([key.slice(dot + 1), entry]);
    }
    const out = ambient ? [] : [`import type { browser as extension } from "${importSpecifier}";`, ""];
    out.push(...USER_SCRIPT_DOC, `${ambient ? "declare" : "export"} namespace browser {`);
    for (const [nsName, functions] of byNamespace) {
      out.push(`    export namespace ${nsName} {`);
      for (const [fnName, { doc, overloads }] of functions) {
        out.push(...this.jsdoc({ description: doc }, "        "));
        for (const signature of overloads) {
          out.push(`        export function ${fnName}${signature.replace(/\bbrowser\./g, api)};`);
        }
      }
      out.push("    }");
    }
    out.push("}", "", `${ambient ? "declare" : "export"} namespace chrome {`);
    for (const nsName of byNamespace.keys()) out.push(`    export import ${nsName} = browser.${nsName};`);
    out.push("}", "");
    if (!ambient) out.push("export default browser;", "");
    return out;
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
   * @param {"module"|"chrome"|"ambient"|"ambient-chrome"|"chrome-mv2"|"ambient-chrome-mv2"|"user-script"|"ambient-user-script"} mode
   *   module: importable declarations. chrome: importable `chrome` aliases.
   *   ambient: script file declaring the global `browser` namespace, no imports.
   *   ambient-chrome: script file adding the global `chrome` aliases.
   *   chrome-mv2 and ambient-chrome-mv2: the same for the `chrome` of a
   *   Manifest V2 extension page, where async functions take callbacks only.
   *   user-script and ambient-user-script: the `browser` and `chrome` of a
   *   user script.
   * @param {{firefoxVersion?: string, importSpecifier?: string, ambientBase?: string}} [opts]
   *   importSpecifier is the module the chrome mode imports `browser` from.
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

    if (mode === "user-script" || mode === "ambient-user-script") {
      out.push(...this.emitUserScript(mode === "ambient-user-script", opts.importSpecifier ?? "./index.js"));
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
    this.namespaces = namespaces;
    this.classifyTypes();

    const sortedRoots = Array.from(rootNsNames).sort(codePointCompare);
    const ambient = mode === "ambient";
    const exp = ambient ? "" : "export ";

    if (mode === "chrome") {
      out.push(`import { browser } from "${opts.importSpecifier ?? "./index.js"}";`);
      out.push("");
      out.push(...CHROME_DOC, "export namespace chrome {");
      for (const nsName of sortedRoots) {
        out.push(`    export import ${nsName} = browser.${nsName};`);
      }
      out.push("}");
      out.push("");
      out.push("export default chrome;");
      return out.join("\n");
    }

    if (mode === "chrome-mv2" || mode === "ambient-chrome-mv2") {
      if (mode === "chrome-mv2") {
        out.push(`import { browser, type Normalizable, type Normalized } from "${opts.importSpecifier ?? "./index.js"}";`, "");
        out.push(...this.emitMv2Chrome(sortedRoots, subNsMap, false), "export default chrome;", "");
      } else {
        out.push(`/// <reference path="${opts.ambientBase}" />`, "");
        out.push(...this.emitMv2Chrome(sortedRoots, subNsMap, true));
      }
      return out.join("\n");
    }

    if (mode === "ambient-chrome") {
      out.push(`/// <reference path="${opts.ambientBase}" />`);
      out.push("");
      out.push(...CHROME_DOC, "declare namespace chrome {");
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
    // Schemas.sys.mjs ObjectType.checkProperty writes the schema default for
    // an absent optional property, null when there is none, and leaves a
    // property gated to another manifest version out, so a key stays optional.
    // Arrays, unions and nested objects are normalized the same way. The
    // paths come from normalizedDefaults.
    const under = (key) => `Defaults extends \`\${${key}}.\${infer Rest}\` ? Rest : never`;
    out.push("/**");
    out.push(" * A value as Firefox's schema normalization hands it back: an absent");
    out.push(" * optional property reads as null, recursively. Defaults names the");
    out.push(" * properties Firefox fills in, with their schema default or after");
    out.push(" * normalization, as dotted paths with `*` for any key of a map. Those");
    out.push(" * are never null, and always present unless the path ends in `?`.");
    out.push(" */");
    out.push(`${exp}type Normalized<T, Defaults extends string = never> = T extends string | number | boolean | null | undefined`);
    out.push("    ? T");
    out.push("    : T extends readonly unknown[]");
    out.push("        ? { [K in keyof T]: Normalized<T[K], Defaults> }");
    // With no key of T in Defaults the type is one mapped type, so an editor
    // shows a plain object instead of `{} & { ... }`.
    out.push("        : T extends object");
    out.push("            ? [Extract<keyof T, Defaults>] extends [never]");
    out.push("                ? { [K in keyof T]: NormalizedProperty<T, K, Defaults> }");
    out.push("                : {");
    out.push("                      [K in keyof T as K extends Defaults ? K : never]-?: NormalizedProperty<T, K, Defaults>;");
    out.push("                  } & {");
    out.push("                      [K in keyof T as K extends Defaults ? never : K]: NormalizedProperty<T, K, Defaults>;");
    out.push("                  }");
    out.push("            : T;");
    out.push("");
    // `${Extract<K, Defaults> & string}?` is `${K}?` when Defaults names K and
    // never otherwise, so one test covers K and `${K}?`.
    out.push("/**");
    out.push(" * One property of a Normalized object. A key Defaults names, alone or");
    out.push(" * with `?`, is never null.");
    out.push(" */");
    out.push("type NormalizedProperty<T, K extends keyof T, Defaults extends string> = `${K & string}?` extends Defaults | `${Extract<K, Defaults> & string}?`");
    out.push(`    ? Normalized<Exclude<T[K], null | undefined>, ${under("K & string")}>`);
    out.push(`    : Normalized<Exclude<T[K], undefined>, ${under('string extends K ? "*" : K & string')}>`);
    out.push("        | (string extends K ? never : number extends K ? never : {} extends Pick<T, K> ? null : never);");
    out.push("");
    out.push("/**");
    out.push(" * A value as Firefox's schema normalization accepts it: an optional");
    out.push(" * property may also be null, which reads as absent, recursively.");
    out.push(" */");
    out.push(`${exp}type Normalizable<T> = T extends string | number | boolean | null | undefined | ((...args: never[]) => unknown)`);
    out.push("    ? T");
    out.push("    : T extends readonly unknown[]");
    out.push("        ? { [K in keyof T]: Normalizable<T[K]> }");
    out.push("        : T extends object");
    out.push("            ? { [K in keyof T]: Normalizable<T[K]> | (string extends K ? never : number extends K ? never : {} extends Pick<T, K> ? null : never) }");
    out.push("            : T;");
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
      out.push(...CHROME_DOC, "export namespace chrome {");
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
