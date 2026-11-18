/**
 * Read tracing and key ablation for the loaded schema JSON.
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
 * Each object also gets a position: the schema file, the namespace and the
 * names (or indexes) leading to it, such as
 * alarms.json:alarms.functions[create].parameters[callback]. A context groups
 * many positions, and the trace returns the positions where a key is present
 * and was not read, so a check can see one position stop being read while
 * others in its context still are.
 *
 * An enumeration or a JSON.stringify still hands the generator every key of
 * the node, so the trace records which objects were enumerated. A declined
 * key on such an object cannot be vouched for by the trace alone, and the
 * key-ledger test ablates it.
 *
 * Ablation deletes a key from every object in one context before the
 * generator sees the schema, or several such keys at once. Key injection is
 * for controls.
 */

const SEP = "\t";
const MAP_KEYS = new Set(["properties", "patternProperties"]);
const LEAF_KEYS = new Set(["default", "value"]);
const ROOTS = new Set(["types[]", "functions[]", "events[]", "properties{}"]);

const meta = new WeakMap();
const generated = new WeakMap();
const proxyToRaw = new WeakMap();
const rawToProxy = new WeakMap();
const enumerating = new WeakMap();
let enumeratedIds = new Set();
let justEnumerated = null;
let nextId = 1;

let tracing = false;
let ablation = null;
let presence = new Map();
let readIds = new Map();
let carriers = new Map();
let walkingNamespace = null;
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

function markEnumerated(target) {
  if (!tracing) return;
  const m = meta.get(target);
  if (m && !m.isMap && !m.isArr) enumeratedIds.add(m.id);
}

// JSON.stringify reaches every node below its argument.
function markSerialized(value) {
  if (!isObj(value)) return;
  const r = raw(value);
  markEnumerated(r);
  for (const k of Object.keys(r)) markSerialized(r[k]);
}

const handler = {
  get(target, key) {
    const bulk = justEnumerated && justEnumerated.target === target && justEnumerated.key === key;
    justEnumerated = null;
    const state = enumerating.get(target);
    if (state) state.pending = false;
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
    markEnumerated(target);
    enumerating.set(target, { keys, next: 0, pending: false, keysOnly: false });
    justEnumerated = null;
    return keys;
  },
  getOwnPropertyDescriptor(target, key) {
    const state = enumerating.get(target);
    if (state && state.keys[state.next] === key) {
      // Object.keys asks for every descriptor and never reads a value. A
      // descriptor that follows one with no get() in between shows that.
      if (state.pending) state.keysOnly = true;
      state.pending = true;
      state.next++;
      if (state.next >= state.keys.length) enumerating.delete(target);
      justEnumerated = state.keysOnly ? null : { target, key };
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
// leaf: its contents are data, not schema. An array item is named by its name,
// id or $extend, else its index, with " #2" on a repeated name.
function walk(obj, segs, visit, where, role = null, parentAsync = null) {
  const isArr = Array.isArray(obj);
  const m = { id: nextId++, ctx: contextOf(segs), isMap: false, isArr, where, role, ns: walkingNamespace };
  meta.set(obj, m);
  if (isArr) {
    const seen = new Map();
    obj.forEach((item, i) => {
      if (!isObj(item)) return;
      let label = String(item.name ?? item.id ?? (item.$extend ? `$extend ${item.$extend}` : i));
      const n = (seen.get(label) ?? 0) + 1;
      seen.set(label, n);
      if (n > 1) label += ` #${n}`;
      walk(item, segs, visit, `${where}[${label}]`, item.name === parentAsync ? "asyncCallback" : null);
    });
    return;
  }
  visit(obj, m);
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    if (!isObj(v) || LEAF_KEYS.has(k)) continue;
    if (Array.isArray(v)) {
      walk(v, segs.concat(k + "[]"), visit, `${where}.${k}`, null, k === "parameters" && typeof obj.async === "string" ? obj.async : null);
    } else if (MAP_KEYS.has(k)) {
      const mapSegs = segs.concat(k + "{}");
      meta.set(v, { id: nextId++, ctx: contextOf(mapSegs), isMap: true, isArr: false });
      for (const name of Object.keys(v)) if (isObj(v[name])) walk(v[name], mapSegs, visit, `${where}.${k}{${name}}`);
    } else {
      walk(v, segs.concat(k), visit, `${where}.${k}`);
    }
  }
}

/**
 * Called by loadRawSchemaJson with the parsed entries. Returns them as they
 * are unless tracing or ablation is on.
 */
export function instrument(entries, source = "") {
  if (!tracing && !ablation) return entries;
  const specs = [].concat(ablation ?? []);
  for (const entry of entries) {
    walkingNamespace = entry.namespace;
    walk(entry, ["ns"], (obj, m) => {
      for (const spec of specs) {
        if (spec.inject && (!spec.context || spec.context === m.ctx)) obj[spec.inject.key] = spec.inject.value;
        if (spec.key && spec.context === m.ctx && Object.hasOwn(obj, spec.key)) delete obj[spec.key];
      }
      if (tracing) {
        for (const k of Object.keys(obj)) {
          if (k[0] === "_") continue;
          const pair = pairKey(m.ctx, k);
          let p = presence.get(pair);
          if (!p) presence.set(pair, (p = { ids: new Set() }));
          p.ids.add(m.id);
          carriers.set(m.id, m);
        }
      }
    }, `${source}:${entry.namespace}`);
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

/**
 * The values of a node for a traversal that reads no key. Each value keeps
 * its tracing identity, so reads through it are still counted, and the
 * enumeration itself is not recorded. Equivalent to Object.values(node)
 * when tracing is off.
 */
export function nodeValues(node) {
  if (!tracing) return Object.values(node);
  return Object.values(raw(node)).map(wrap);
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
  carriers = new Map();
  enumeratedIds = new Set();
  tracing = true;
  if (!originalClone) {
    originalClone = globalThis.structuredClone;
    originalStringify = JSON.stringify;
    globalThis.structuredClone = tracedStructuredClone;
    JSON.stringify = (...args) => {
      markSerialized(args[0]);
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
 * Ends tracing and returns, per pair, how many objects carry the key, how
 * many of those the generator read it from, how many it enumerated or
 * serialized, and the positions of the objects it did not read it from. A
 * position carried by several loaded objects (a toolkit schema loads once
 * per target) counts as unread when any of them was not read. role is
 * "asyncCallback" for the parameter its function's async names.
 *
 * @returns {Map<string, {present: number, read: number, enumerated: number, unread: Array<{where: string, namespace: string, role: string | null}>}>}
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
    let enumerated = 0;
    const unread = new Map();
    for (const id of p.ids) {
      if (readIds.get(id)?.has(key)) read++;
      else {
        const m = carriers.get(id);
        unread.set(m.where, { where: m.where, namespace: m.ns, role: m.role });
      }
      if (enumeratedIds.has(id)) enumerated++;
    }
    result.set(pair, { present: p.ids.size, read, enumerated, unread: [...unread.values()] });
  }
  presence = new Map();
  readIds = new Map();
  enumeratedIds = new Set();
  carriers = new Map();
  return result;
}

/**
 * Deletes spec.key from every object in spec.context for each schema loaded
 * until cleared. With spec.inject = {key, value}, adds that key to every
 * object instead (in spec.context if given). A list of specs applies each.
 * Pass null to clear.
 */
export function setAblation(spec) {
  ablation = spec;
}
