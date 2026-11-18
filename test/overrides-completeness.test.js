import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as overrides from "../src/overrides.js";
import { checkCompleteness, checkOptionalReturns, emittedReturns, schemaFacts } from "../scripts/verify-overrides.js";
import { loadIndependentSchemaUniverse } from "../verification/src/independent-schema-loader.js";
import { firefoxRoot, skipFirefox } from "./helpers/firefox-root.js";


// These tests rest on the audit in scripts/verify-overrides.js. The schema
// shapes they plant follow toolkit/components/extensions/Schemas.sys.mjs,
// where `async: true` adds a callback the schema never declares and
// `unsupported` entries are dropped at load.

const emptyMod = () => ({
  ASYNC_RESULTS: {},
  ASYNC_NO_PAYLOAD: {},
  NULL_RESULTS: new Set(),
  REQUIRED_RESULTS: new Set(),
  OPTIONAL_RESULT_UNDEFINED: new Set(),
  NULL_PROPERTIES: new Set(),
  NULL_RESULT_PROPERTIES: new Set(),
  OPEN_OBJECTS: new Set(),
  PLATFORM_TYPES: {},
  REF_TYPES: {},
  EVENT_LISTENER_PROMISES: {},
  EVENT_PARAMETERS: {},
  OPEN_EVENT_PARAMETERS: {},
  REQUIRED_EVENT_PARAMETERS: {},
  OPTIONAL_EVENT_PARAMETERS: {},
  FUNCTION_OVERRIDES: {},
  TYPE_OVERRIDES: {},
  EXCLUDED_NAMESPACES: new Set(["test"]),
});

const universe = ({ functions = [], events = [], types = [], properties = [] } = {}) => ({
  excluded: ["test"],
  namespaces: new Map([
    [
      "ns",
      {
        functions: new Map(functions.map((f) => [f.name, f])),
        events: new Map(events.map((e) => [e.name, e])),
        types: new Map(types.map((t) => [t.id, t])),
        properties: new Map(properties.map((p) => [p.name, p])),
      },
    ],
  ]),
});

const failuresFor = (mod, uni) => checkCompleteness(mod, schemaFacts([uni]));

// Firefox: Schemas.sys.mjs (async adds a callback the schema never declares, unsupported entries are dropped)
describe("overrides completeness against synthetic schemas", () => {
  it("passes an empty schema with empty tables", () => {
    assert.deepEqual(failuresFor(emptyMod(), universe()), []);
  });

  it("fails an async function with no callback payload that no table lists", () => {
    const [failure] = failuresFor(emptyMod(), universe({ functions: [{ name: "go", async: true, parameters: [] }] }));
    assert.match(failure, /async function ns\.go: .*neither ASYNC_RESULTS nor ASYNC_NO_PAYLOAD has it/);
    assert.match(failure, /Read its implementation in Firefox/);
  });

  it("treats a callback with no parameters as no payload", () => {
    const fn = { name: "go", async: "callback", parameters: [{ type: "function", name: "callback", parameters: [] }] };
    assert.equal(failuresFor(emptyMod(), universe({ functions: [fn] })).length, 1);
  });

  it("accepts the function once it is classified", () => {
    const mod = emptyMod();
    mod.ASYNC_NO_PAYLOAD["ns.go"] = "none";
    assert.deepEqual(failuresFor(mod, universe({ functions: [{ name: "go", async: true }] })), []);
    const typed = emptyMod();
    typed.ASYNC_RESULTS["ns.go"] = "boolean";
    assert.deepEqual(failuresFor(typed, universe({ functions: [{ name: "go", async: true }] })), []);
  });

  it("does not ask for a function with a callback payload, returns or unsupported", () => {
    const withPayload = {
      name: "a",
      async: "callback",
      parameters: [{ type: "function", name: "callback", parameters: [{ name: "x", type: "string" }] }],
    };
    const withReturns = { name: "b", async: true, returns: { type: "string" } };
    const unsupported = { name: "c", async: true, unsupported: true };
    assert.deepEqual(failuresFor(emptyMod(), universe({ functions: [withPayload, withReturns, unsupported] })), []);
  });

  it("finds a function declared on a type", () => {
    const type = { id: "Area", functions: [{ name: "set", async: true }] };
    const [failure] = failuresFor(emptyMod(), universe({ types: [type] }));
    assert.match(failure, /ns\.Area\.set/);
  });

  it("fails an entry the schema no longer needs", () => {
    const mod = emptyMod();
    mod.ASYNC_NO_PAYLOAD["ns.gone"] = "none";
    assert.match(failuresFor(mod, universe())[0], /ns\.gone: is in ASYNC_RESULTS or ASYNC_NO_PAYLOAD but the schema no longer declares it/);
  });

  it("fails a function listed in both async tables", () => {
    const mod = emptyMod();
    mod.ASYNC_NO_PAYLOAD["ns.go"] = "none";
    mod.ASYNC_RESULTS["ns.go"] = "boolean";
    const failures = failuresFor(mod, universe({ functions: [{ name: "go", async: true }] }));
    assert.match(failures[0], /ns\.go is in both ASYNC_RESULTS and ASYNC_NO_PAYLOAD/);
  });

  it("fails an unknown ASYNC_NO_PAYLOAD category", () => {
    const mod = emptyMod();
    mod.ASYNC_NO_PAYLOAD["ns.go"] = "void";
    const failures = failuresFor(mod, universe({ functions: [{ name: "go", async: true }] }));
    assert.match(failures[0], /category "void"\. Use one of: none, incidental, indeterminate/);
  });

  it("fails an isInstanceOf name that PLATFORM_TYPES does not map", () => {
    const fn = { name: "f", parameters: [{ name: "p", type: "object", isInstanceOf: "Blob" }] };
    const [failure] = failuresFor(emptyMod(), universe({ functions: [fn] }));
    assert.match(failure, /platform type Blob: a schema uses isInstanceOf "Blob" and PLATFORM_TYPES has no mapping/);
    const mod = emptyMod();
    mod.PLATFORM_TYPES.Blob = "Blob";
    assert.deepEqual(failuresFor(mod, universe({ functions: [fn] })), []);
  });

  it("fails a PLATFORM_TYPES entry no schema uses", () => {
    const mod = emptyMod();
    mod.PLATFORM_TYPES.Blob = "Blob";
    assert.match(failuresFor(mod, universe())[0], /platform type Blob: is in PLATFORM_TYPES but no emitted schema uses it/);
  });

  it("fails an optional callback payload nobody classified", () => {
    const fn = {
      name: "get",
      async: "callback",
      parameters: [{ type: "function", name: "callback", parameters: [{ name: "x", type: "string", optional: true }] }],
    };
    const [failure] = failuresFor(emptyMod(), universe({ functions: [fn] }));
    assert.match(failure, /optional result ns\.get: .*NULL_RESULTS \(null\), REQUIRED_RESULTS/);
    const mod = emptyMod();
    mod.OPTIONAL_RESULT_UNDEFINED.add("ns.get");
    assert.deepEqual(failuresFor(mod, universe({ functions: [fn] })), []);
  });

  it("fails an event with returns that EVENT_LISTENER_PROMISES lacks", () => {
    const ev = { name: "onX", type: "function", returns: { type: "boolean" } };
    assert.match(failuresFor(emptyMod(), universe({ events: [ev] }))[0], /event listener Promise ns\.onX/);
  });

  it("fails a bare event parameter and an optional event parameter that no table covers", () => {
    const ev = {
      name: "onX",
      type: "function",
      parameters: [
        { name: "blob", type: "object" },
        { name: "extra", type: "string", optional: true },
      ],
    };
    const failures = failuresFor(emptyMod(), universe({ events: [ev] }));
    assert.equal(failures.length, 2);
    assert.match(failures.join("\n"), /bare event parameter ns\.onX:blob/);
    assert.match(failures.join("\n"), /optional event parameter ns\.onX:extra/);
    const mod = emptyMod();
    mod.OPEN_EVENT_PARAMETERS["ns.onX"] = ["blob"];
    mod.OPTIONAL_EVENT_PARAMETERS["ns.onX"] = ["extra"];
    assert.deepEqual(failuresFor(mod, universe({ events: [ev] })), []);
  });

  it("fails a REF_TYPES entry no schema refers to", () => {
    const mod = emptyMod();
    mod.REF_TYPES.Gone = "unknown";
    assert.match(failuresFor(mod, universe())[0], /REF_TYPES Gone: no schema uses this \$ref any more/);
    const fn = { name: "f", parameters: [{ name: "p", $ref: "Gone" }] };
    assert.deepEqual(failuresFor(mod, universe({ functions: [fn] })), []);
  });

  it("fails an override for a function or type the schema dropped", () => {
    const mod = emptyMod();
    mod.FUNCTION_OVERRIDES["ns.gone"] = { returns: "string" };
    mod.TYPE_OVERRIDES["ns.Gone"] = { properties: {} };
    const failures = failuresFor(mod, universe());
    assert.match(failures.join("\n"), /FUNCTION_OVERRIDES ns\.gone: not in the Firefox schemas any more/);
    assert.match(failures.join("\n"), /TYPE_OVERRIDES ns\.Gone: not in the Firefox schemas any more/);
  });
});

// Firefox: every schema under toolkit, browser and mobile jar.mn
describe("overrides completeness against the Firefox checkout", { skip: skipFirefox }, () => {
  const load = () =>
    ["desktop", "mobile"].map((target) => loadIndependentSchemaUniverse(firefoxRoot, target, overrides.EXCLUDED_NAMESPACES));

  it("has an entry for every schema construct a table exists for", () => {
    assert.deepEqual(checkCompleteness(overrides, schemaFacts(load())), []);
  });

  it("fails when Firefox gains an async function with no result type", () => {
    const universes = load();
    universes[0].namespaces.get("tabs").functions.set("brandNew", { name: "brandNew", async: true, parameters: [] });
    const failures = checkCompleteness(overrides, schemaFacts(universes));
    assert.equal(failures.length, 1);
    assert.match(failures[0], /async function tabs\.brandNew/);
  });

  it("fails when Firefox gains an isInstanceOf name", () => {
    const universes = load();
    universes[0].namespaces.get("tabs").functions.set("brandNew", {
      name: "brandNew",
      parameters: [{ name: "p", type: "object", isInstanceOf: "Blob" }],
    });
    const failures = checkCompleteness(overrides, schemaFacts(universes));
    assert.match(failures.join("\n"), /platform type Blob/);
  });

  it("fails when src/overrides.js leaves out a namespace the verifier's own list does not", () => {
    const mod = { ...overrides, EXCLUDED_NAMESPACES: new Set(["test", "idle"]) };
    const universes = ["desktop", "mobile"].map((target) => loadIndependentSchemaUniverse(firefoxRoot, target, mod.EXCLUDED_NAMESPACES));
    const failures = checkCompleteness(mod, schemaFacts(universes));
    assert.equal(failures.length, 1, failures.join("\n"));
    assert.match(failures[0], /EXCLUDED_NAMESPACES idle: src\/overrides\.js leaves this namespace out of dist\/, but verification\/src\/declared-differences\.js does not list it/);
  });

  it("fails when a table entry is removed", () => {
    const mod = structuredClone({ ...overrides });
    delete mod.ASYNC_NO_PAYLOAD["tabs.reload"];
    const failures = checkCompleteness(mod, schemaFacts(load()));
    assert.equal(failures.length, 1);
    assert.match(failures[0], /async function tabs\.reload/);
  });
});

// Firefox: ExtensionCommon.sys.mjs (BaseContext.lastError returns null when no error is pending)
describe("NULL_PROPERTIES against synthetic schemas", () => {
  it("fails an entry whose property the schema no longer has", () => {
    const mod = { ...emptyMod(), NULL_PROPERTIES: new Set(["ns.lastError"]) };
    const [failure] = failuresFor(mod, universe());
    assert.match(failure, /NULL_PROPERTIES ns\.lastError: not in the Firefox schemas any more/);
  });

  it("passes an entry whose property is in the schema", () => {
    const mod = { ...emptyMod(), NULL_PROPERTIES: new Set(["ns.lastError"]) };
    assert.deepEqual(failuresFor(mod, universe({ properties: [{ name: "lastError", type: "object" }] })), []);
  });
});

// Firefox: theme.json (colors takes additionalProperties), toolkit/mozapps/extensions/LightweightThemeManager.sys.mjs (loadColors uses a key a theme_experiment declares)
describe("OPEN_OBJECTS against synthetic schemas", () => {
  it("fails an entry whose property the schema no longer has", () => {
    const mod = { ...emptyMod(), OPEN_OBJECTS: new Set(["ns.ThemeType.colors"]) };
    const [failure] = failuresFor(mod, universe());
    assert.match(failure, /OPEN_OBJECTS ns\.ThemeType\.colors: not in the Firefox schemas any more/);
  });

  it("passes an entry whose property is in the schema", () => {
    const mod = { ...emptyMod(), OPEN_OBJECTS: new Set(["ns.ThemeType.colors"]) };
    const theme = { id: "ThemeType", type: "object", properties: { colors: { type: "object", additionalProperties: { type: "string" } } } };
    assert.deepEqual(failuresFor(mod, universe({ types: [theme] })), []);
  });
});

// Firefox: ext-cookies.js (getExtPartitionKey returns null for an unpartitioned cookie)
describe("NULL_RESULT_PROPERTIES against synthetic schemas", () => {
  const cookie = { id: "Cookie", type: "object", properties: { partitionKey: { type: "object", optional: true } } };
  const remove = {
    name: "remove",
    async: "callback",
    parameters: [{ name: "callback", type: "function", parameters: [{ name: "details", type: "object", properties: { partitionKey: { type: "object" } } }] }],
  };

  it("fails an entry whose property the schema no longer has", () => {
    const mod = { ...emptyMod(), NULL_RESULT_PROPERTIES: new Set(["ns.Cookie.partitionKey", "ns.remove.partitionKey"]) };
    const failures = failuresFor(mod, universe()).join("\n");
    assert.match(failures, /NULL_RESULT_PROPERTIES ns\.Cookie\.partitionKey: not in the Firefox schemas any more/);
    assert.match(failures, /NULL_RESULT_PROPERTIES ns\.remove\.partitionKey: not in the Firefox schemas any more/);
  });

  it("passes entries for a type property and a property of what a function resolves with", () => {
    const mod = { ...emptyMod(), NULL_RESULT_PROPERTIES: new Set(["ns.Cookie.partitionKey", "ns.remove.partitionKey"]) };
    assert.deepEqual(failuresFor(mod, universe({ types: [cookie], functions: [remove] })), []);
  });
});

// Firefox: ext-publicSuffix.js (getKnownSuffix returns null when there is no known suffix)
describe("optional return values against synthetic declarations", () => {
  const getSuffix = { name: "getSuffix", parameters: [], returns: { type: "string", optional: true } };
  const facts = schemaFacts([universe({ functions: [getSuffix], types: [{ id: "Host", type: "object", functions: [getSuffix] }] })]);
  const declared = (...returns) =>
    emittedReturns(
      ["export namespace browser {", "    export namespace ns {", ...returns.map((r) => `        export function getSuffix(): ${r};`), "        export interface Host {", "            getSuffix(): string | null;", "        }", "    }", "}"].join("\n")
    );
  const listing = (table) => {
    const mod = emptyMod();
    mod[table].add("ns.getSuffix");
    mod[table].add("ns.Host.getSuffix");
    return mod;
  };

  it("fails a synchronous function with an optional return value that no table lists", () => {
    const failures = failuresFor(emptyMod(), universe({ functions: [getSuffix] }));
    assert.equal(failures.length, 1);
    assert.match(failures[0], /optional result ns\.getSuffix: the schema makes the callback payload or return value optional/);
  });

  it("fails a NULL_RESULTS function declared without null and says what to change", () => {
    const mod = listing("NULL_RESULTS");
    const failures = checkOptionalReturns(mod, facts, declared("string", "Array<string | null>"));
    assert.deepEqual(failures, [
      "optional return ns.getSuffix: NULL_RESULTS says Firefox returns null, but dist/ declares it returning string. Make the emitter add null to the return type, then run npm run build.",
      "optional return ns.getSuffix: NULL_RESULTS says Firefox returns null, but dist/ declares it returning Array<string | null>. Make the emitter add null to the return type, then run npm run build.",
    ]);
    assert.deepEqual(checkOptionalReturns(mod, facts, declared("string | null")), []);
  });

  it("wants undefined for an OPTIONAL_RESULT_UNDEFINED function, not null", () => {
    const mod = listing("OPTIONAL_RESULT_UNDEFINED");
    const failures = checkOptionalReturns(mod, facts, declared("(string | undefined)"));
    assert.equal(failures.length, 1);
    assert.match(failures[0], /optional return ns\.Host\.getSuffix: OPTIONAL_RESULT_UNDEFINED says Firefox returns undefined/);
  });

  it("fails a REQUIRED_RESULTS function declared with null or undefined", () => {
    const mod = listing("REQUIRED_RESULTS");
    const failures = checkOptionalReturns(mod, facts, declared("string | undefined"));
    assert.equal(failures.length, 2);
    assert.match(failures.join("\n"), /optional return ns\.getSuffix: REQUIRED_RESULTS says Firefox always returns a value/);
    assert.match(failures.join("\n"), /optional return ns\.Host\.getSuffix: REQUIRED_RESULTS says Firefox always returns a value/);
  });

  it("fails a listed function dist/ does not declare", () => {
    const [failure] = checkOptionalReturns(listing("NULL_RESULTS"), facts, new Map());
    assert.match(failure, /optional return ns\.Host\.getSuffix: dist\/ declares no function by this name/);
  });
});
