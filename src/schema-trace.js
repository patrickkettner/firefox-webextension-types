/**
 * schema-trace.js - read tracing and key ablation for the loaded schema JSON.
 *
 * Both modes are off unless switched on, and instrument() then returns its
 * input untouched, so generator output does not depend on this file.
 *
 * Tracing wraps every parsed schema object in a Proxy and records the
 * (context, key) pairs the generator reads. A context is the structural
 * position of the object (see contextOf), never a namespace or a name, so the
 * result is stable across Firefox updates. Reads and presence are keyed by the
 * pair "<context> <key>" with a tab between them.
 *
 * Copies would otherwise distort the result. Object.values, spreads,
 * JSON.stringify and structuredClone touch every key without using any of
 * them. Enumeration is told apart from use by the trap sequence: ownKeys, then
 * getOwnPropertyDescriptor(k) immediately followed by get(k) for each key in
 * order. That pair is a bulk copy and is not a read. A lone get, a has, or a
 * getOwnPropertyDescriptor that is not part of an enumeration is a read.
 * V8 orders JSON.stringify differently, so tracing wraps it to count nothing
 * while it runs (the generator only uses it for equality tests and on
 * primitives). structuredClone throws on a Proxy, so tracing swaps in a clone
 * that keeps the source's tracing identity. Object spreads of a schema node
 * lose it, so emitter code copies nodes with copyNode().
 *
 * Ablation deletes one key from every object in one context before the
 * generator sees the schema. Key injection is for controls.
 *
 * Env: FWT_TRACE_READS=<file> traces a normal run and writes the result as
 * JSON on exit.
 */

import fs from "node:fs";

const SEP = "\t";
const MAP_KEYS = new Set(["properties", "patternProperties"]);
const LEAF_KEYS = new Set(["default", "value"]);
const ROOTS = new Set(["types[]", "functions[]", "events[]", "properties{}"]);

const meta = new WeakMap();
const generated = new WeakMap();
const proxyToRaw = new WeakMap();
const rawToProxy = new WeakMap();
const enumerating = new WeakMap();
let justEnumerated = null;
let nextId = 1;

let tracing = false;
let ablation = null;
let presence = new Map();
let readIds = new Map();
let originalClone = null;
let originalStringify = null;
let suppressed = 0;

const isObj = (v) => v !== null && typeof v === "object";
const raw = (v) => (isObj(v) && proxyToRaw.has(v) ? proxyToRaw.get(v) : v);

export function pairKey(context, key) {
  return context + SEP + key;
}

export function splitPair(pair) {
  const i = pair.indexOf(SEP);
  return { context: pair.slice(0, i), key: pair.slice(i + 1) };
}

/**
 * Context of an object from the path of container segments leading to it.
 * The root is ns, types[], functions[], events[] or properties{}. What follows
 * is reduced to its last two segments with repeats collapsed, so that a
 * callback's parameters and a function's parameters share one context.
 *
 * @param {string[]} segs - starts with "ns", then e.g. "functions[]", "parameters[]".
 */
export function contextOf(segs) {
  let root = "ns";
  let rest = segs.slice(1);
  if (segs.length > 1 && ROOTS.has(segs[1])) {
    root = segs[1];
    rest = segs.slice(2);
  }
  const collapsed = [];
  for (const s of rest) if (collapsed[collapsed.length - 1] !== s) collapsed.push(s);
  return root + (collapsed.length ? " > " + collapsed.slice(-2).join(".") : "");
}

function recordRead(target, key) {
  if (!tracing || suppressed || typeof key !== "string" || key[0] === "_") return;
  const m = meta.get(target);
  if (!m || m.isMap || m.isArr) return;
  if (generated.get(target)?.has(key)) return;
  if (!Object.hasOwn(target, key)) return;
  let keys = readIds.get(m.id);
  if (!keys) readIds.set(m.id, (keys = new Set()));
  keys.add(key);
}

const handler = {
  get(target, key) {
    const bulk = justEnumerated && justEnumerated.target === target && justEnumerated.key === key;
    justEnumerated = null;
    if (!bulk) recordRead(target, key);
    const v = Reflect.get(target, key, target);
    return isObj(v) ? wrap(v) : v;
  },
  has(target, key) {
    justEnumerated = null;
    recordRead(target, key);
    return Reflect.has(target, key);
  },
  ownKeys(target) {
    const keys = Reflect.ownKeys(target);
    enumerating.set(target, { keys, next: 0 });
    justEnumerated = null;
    return keys;
  },
  getOwnPropertyDescriptor(target, key) {
    const state = enumerating.get(target);
    if (state && state.keys[state.next] === key) {
      state.next++;
      if (state.next >= state.keys.length) enumerating.delete(target);
      justEnumerated = { target, key };
    } else {
      justEnumerated = null;
      recordRead(target, key);
    }
    return Reflect.getOwnPropertyDescriptor(target, key);
  },
  set(target, key, value) {
    justEnumerated = null;
    target[key] = raw(value);
    markGenerated(target, [key]);
    return true;
  },
};

function markGenerated(target, keys) {
  let set = generated.get(target);
  if (!set) generated.set(target, (set = new Set()));
  for (const k of keys) set.add(k);
}

function wrap(v) {
  const r = raw(v);
  if (!isObj(r) || !meta.has(r)) return v;
  let p = rawToProxy.get(r);
  if (!p) {
    p = new Proxy(r, handler);
    rawToProxy.set(r, p);
    proxyToRaw.set(p, r);
  }
  return p;
}

// Registers meta for obj and everything below it, calling visit(obj, meta)
// for each plain object. A key whose value is a default or value payload is a
// leaf: its contents are data, not schema.
function walk(obj, segs, visit) {
  const isArr = Array.isArray(obj);
  const m = { id: nextId++, ctx: contextOf(segs), isMap: false, isArr };
  meta.set(obj, m);
  if (isArr) {
    for (const item of obj) if (isObj(item)) walk(item, segs, visit);
    return;
  }
  visit(obj, m);
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    if (!isObj(v) || LEAF_KEYS.has(k)) continue;
    if (Array.isArray(v)) {
      walk(v, segs.concat(k + "[]"), visit);
    } else if (MAP_KEYS.has(k)) {
      const mapSegs = segs.concat(k + "{}");
      meta.set(v, { id: nextId++, ctx: contextOf(mapSegs), isMap: true, isArr: false });
      for (const name of Object.keys(v)) if (isObj(v[name])) walk(v[name], mapSegs, visit);
    } else {
      walk(v, segs.concat(k), visit);
    }
  }
}

/**
 * Called by loadRawSchemaJson with the parsed entries. Returns them as they
 * are unless tracing or ablation is on.
 */
export function instrument(entries) {
  if (!tracing && !ablation) return entries;
  const spec = ablation;
  for (const entry of entries) {
    walk(entry, ["ns"], (obj, m) => {
      if (spec?.inject && (!spec.context || spec.context === m.ctx)) obj[spec.inject.key] = spec.inject.value;
      if (spec?.key && spec.context === m.ctx && Object.hasOwn(obj, spec.key)) delete obj[spec.key];
      if (tracing) {
        for (const k of Object.keys(obj)) {
          if (k[0] === "_") continue;
          const pair = pairKey(m.ctx, k);
          let p = presence.get(pair);
          if (!p) presence.set(pair, (p = { ids: new Set() }));
          p.ids.add(m.id);
        }
      }
    });
  }
  return tracing ? entries.map(wrap) : entries;
}

/**
 * Copy of a schema node with some keys overridden. The keys in overrides are
 * the generator's own, so reading them back is not a read of the input.
 * Equivalent to { ...base, ...overrides } when tracing is off.
 */
export function copyNode(base, overrides) {
  if (!tracing) return { ...base, ...overrides };
  const src = raw(base);
  const out = { ...src, ...overrides };
  const m = meta.get(src);
  if (!m) return out;
  meta.set(out, m);
  markGenerated(out, [...(generated.get(src) ?? []), ...Object.keys(overrides)]);
  return wrap(out);
}

function cloneTraced(v) {
  if (!isObj(v)) return v;
  const src = raw(v);
  const out = Array.isArray(src) ? [] : {};
  const m = meta.get(src);
  if (m) {
    meta.set(out, m);
    if (generated.has(src)) generated.set(out, new Set(generated.get(src)));
  }
  for (const k of Object.keys(src)) {
    const child = cloneTraced(src[k]);
    // A container with no tracing identity (an array sliced from a parameter
    // list) must hold proxies, or reads through it would go untracked.
    out[k] = !m && isObj(child) && meta.has(child) ? wrap(child) : child;
  }
  return out;
}

function isPlainTree(v) {
  if (!isObj(v)) return true;
  const r = raw(v);
  const proto = Object.getPrototypeOf(r);
  if (!Array.isArray(r) && proto !== Object.prototype && proto !== null) return false;
  return Object.keys(r).every((k) => isPlainTree(r[k]));
}

function tracedStructuredClone(v, ...rest) {
  if (!isObj(v) || !isPlainTree(v)) return originalClone(v, ...rest);
  const out = cloneTraced(v);
  return meta.has(out) ? wrap(out) : out;
}

export function startTrace() {
  presence = new Map();
  readIds = new Map();
  tracing = true;
  if (!originalClone) {
    originalClone = globalThis.structuredClone;
    originalStringify = JSON.stringify;
    globalThis.structuredClone = tracedStructuredClone;
    JSON.stringify = (...args) => {
      suppressed++;
      try {
        return originalStringify(...args);
      } finally {
        suppressed--;
      }
    };
  }
}

/**
 * Ends tracing and returns, per pair, how many objects carry the key and how
 * many of those the generator read it from.
 *
 * @returns {Map<string, {present: number, read: number}>}
 */
export function stopTrace() {
  tracing = false;
  if (originalClone) {
    globalThis.structuredClone = originalClone;
    JSON.stringify = originalStringify;
    originalClone = null;
    originalStringify = null;
  }
  const result = new Map();
  for (const [pair, p] of presence) {
    const { key } = splitPair(pair);
    let read = 0;
    for (const id of p.ids) if (readIds.get(id)?.has(key)) read++;
    result.set(pair, { present: p.ids.size, read });
  }
  presence = new Map();
  readIds = new Map();
  return result;
}

/**
 * Deletes spec.key from every object in spec.context for each schema loaded
 * until cleared. With spec.inject = {key, value}, adds that key to every
 * object instead (in spec.context if given). Pass null to clear.
 */
export function setAblation(spec) {
  ablation = spec;
}

if (process.env.FWT_TRACE_READS) {
  const out = process.env.FWT_TRACE_READS;
  startTrace();
  process.on("exit", () => {
    const result = stopTrace();
    const entries = [...result].map(([pair, c]) => ({ ...splitPair(pair), ...c }));
    fs.writeFileSync(out, JSON.stringify(entries, null, 1) + "\n");
  });
}
