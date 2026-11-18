import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";

import { contextOf, copyNode, instrument, pairKey, setAblation, startTrace, stopTrace } from "../src/schema-trace.js";

function sample() {
  return {
    namespace: "demo",
    functions: [
      {
        name: "f",
        description: "d",
        unusedKey: "x",
        parameters: [{ name: "p", type: "string", minimum: 1 }],
      },
    ],
    types: [{ id: "T", type: "object", properties: { a: { type: "string", other: 1 } } }],
  };
}

const FN = "functions[]";
const readOf = (result, context, key) => result.get(pairKey(context, key))?.read;

function trace(fn) {
  startTrace();
  const [entry] = instrument([sample()]);
  fn(entry, entry.functions[0]);
  return stopTrace();
}

// Tooling: the trace is this repository's instrumentation of the schema loader, no declaration text is asserted
describe("schema read tracing", () => {
  afterEach(() => {
    setAblation(null);
    stopTrace();
  });

  it("returns the parsed entries untouched when tracing and ablation are off", () => {
    const entries = [sample()];
    assert.equal(instrument(entries), entries);
    assert.equal(Object.getPrototypeOf(entries[0]), Object.prototype);
  });

  it("derives a context from the container path", () => {
    assert.equal(contextOf(["ns"]), "ns");
    assert.equal(contextOf(["ns", "functions[]"]), "functions[]");
    assert.equal(contextOf(["ns", "functions[]", "parameters[]", "parameters[]"]), "functions[] > parameters[]");
    assert.equal(
      contextOf(["ns", "types[]", "properties{}", "properties{}", "choices[]"]),
      "types[] > properties{}.choices[]"
    );
  });

  it("counts a plain get, an in test and a lone own-property probe as reads", () => {
    const r = trace((entry, fn) => {
      void fn.name;
      void ("description" in fn);
      Object.hasOwn(fn, "unusedKey");
    });
    assert.equal(readOf(r, FN, "name"), 1);
    assert.equal(readOf(r, FN, "description"), 1);
    assert.equal(readOf(r, FN, "unusedKey"), 1);
    assert.equal(readOf(r, FN, "parameters"), 0);
  });

  it("does not count bulk copies and enumeration as reads (negative control)", () => {
    const r = trace((entry, fn) => {
      void { ...fn };
      void Object.values(fn);
      void Object.entries(fn);
      void Object.assign({}, fn);
      void JSON.stringify(fn);
      void Object.keys(fn);
      void structuredClone(fn);
      for (const k in fn) void k;
    });
    for (const key of ["name", "description", "unusedKey", "parameters"]) {
      assert.equal(readOf(r, FN, key), 0, `${key} was counted as read by a bulk copy`);
    }
    assert.equal(readOf(r, "functions[] > parameters[]", "minimum"), 0);
  });

  it("counts a read of the last key straight after Object.keys", () => {
    const r = trace((entry, fn) => {
      Object.keys(fn);
      void fn.parameters;
    });
    assert.equal(readOf(r, FN, "parameters"), 1);
    assert.equal(readOf(r, FN, "unusedKey"), 0);
  });

  it("counts a read made through a copy of the node", () => {
    const r = trace((entry, fn) => {
      const copy = copyNode(fn, { parameters: [] });
      void copy.description;
      void copy.parameters;
    });
    assert.equal(readOf(r, FN, "description"), 1);
    assert.equal(readOf(r, FN, "parameters"), 0, "an overridden key is the generator's own");
  });

  it("counts a read made through structuredClone of a child", () => {
    const r = trace((entry, fn) => {
      const clone = structuredClone(fn.parameters);
      void clone[0].minimum;
    });
    assert.equal(readOf(r, "functions[] > parameters[]", "minimum"), 1);
    assert.equal(readOf(r, "functions[] > parameters[]", "type"), 0);
  });

  it("counts a read through a slice of a parameter list", () => {
    const r = trace((entry, fn) => {
      const part = structuredClone(fn.parameters.slice(0));
      void part[0].type;
    });
    assert.equal(readOf(r, "functions[] > parameters[]", "type"), 1);
  });

  it("does not count a key the generator wrote before reading it", () => {
    const r = trace((entry, fn) => {
      fn.name = "renamed";
      void fn.name;
    });
    assert.equal(readOf(r, FN, "name"), 0);
  });

  it("does not count property names of a property map, only the keys of what they hold", () => {
    const r = trace((entry) => {
      void entry.types[0].properties.a.type;
    });
    assert.equal(readOf(r, "types[] > properties{}", "type"), 1);
    assert.equal(readOf(r, "types[] > properties{}", "other"), 0);
    assert.equal(r.has(pairKey("types[]", "a")), false);
  });

  it("restores structuredClone and JSON.stringify after tracing", () => {
    const clone = structuredClone;
    const stringify = JSON.stringify;
    trace(() => {});
    assert.equal(structuredClone, clone);
    assert.equal(JSON.stringify, stringify);
  });

  it("deletes a key from one context only when ablating", () => {
    setAblation({ context: FN, key: "description" });
    const [entry] = instrument([sample()]);
    assert.equal("description" in entry.functions[0], false);
    assert.equal(entry.functions[0].name, "f");
  });

  it("injects a key into every object, so a control can see it is present and never read", () => {
    setAblation({ inject: { key: "zzUnusedKey", value: "x" } });
    startTrace();
    const [entry] = instrument([sample()]);
    JSON.stringify(entry);
    void { ...entry.functions[0] };
    const r = stopTrace();
    const injected = [...r].filter(([pair]) => pair.endsWith("\tzzUnusedKey"));
    assert.ok(injected.length >= 4);
    assert.ok(injected.every(([, c]) => c.present > 0 && c.read === 0));
  });
});
