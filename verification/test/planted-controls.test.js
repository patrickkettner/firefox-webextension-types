/**
 * planted-controls.test.js - Negative control harness for 3-tier verifier
 *
 * Demonstrates that the verifier fails RED on planted defects, then passes GREEN on clean input.
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { verifyDeclarations } from "../src/three-tier-verifier.js";

describe("ThreeTierVerifier Planted Controls", () => {
  function makeBaseUniverses() {
    const schemaUniverse = {
      namespaces: new Map([
        [
          "tabs",
          {
            name: "tabs",
            types: new Map([
              [
                "Tab",
                {
                  id: "Tab",
                  properties: {
                    id: { type: "integer" },
                    url: { type: "string" },
                  },
                },
              ],
            ]),
            functions: new Map(),
            events: new Map(),
            properties: new Map(),
          },
        ],
      ]),
      schemaFileCount: 1,
      counts: { namespaces: 1, types: 1, functions: 0, events: 0, properties: 0 },
    };

    const emittedUniverse = {
      namespaces: new Map([
        [
          "tabs",
          {
            name: "tabs",
            types: new Map([
              [
                "Tab",
                {
                  kind: "interface",
                  name: "Tab",
                  properties: new Map([
                    ["id", { name: "id", readonly: false, optional: false, type: "number" }],
                    ["url", { name: "url", readonly: false, optional: false, type: "string" }],
                  ]),
                },
              ],
            ]),
            functions: new Map(),
            events: new Map(),
            properties: new Map(),
          },
        ],
      ]),
      counts: { namespaces: 1, types: 1, functions: 0, events: 0, properties: 0 },
    };

    return { schemaUniverse, emittedUniverse };
  }

  it("NEGATIVE CONTROL 1: fails RED on missing namespace (S \\ E)", () => {
    const { schemaUniverse, emittedUniverse } = makeBaseUniverses();
    schemaUniverse.namespaces.set("cookies", {
      name: "cookies",
      types: new Map(),
      functions: new Map(),
      events: new Map(),
      properties: new Map(),
    });

    const result = verifyDeclarations(schemaUniverse, emittedUniverse, { strict: true });
    assert.strictEqual(result.passed, false, "Expected verifier to fail RED on missing namespace");
    assert.ok(result.errors.some((e) => e.includes("Missing namespaces")));
    assert.strictEqual(result.summary.inSchemaNotEmitted, 1);
  });

  it("NEGATIVE CONTROL 2: fails RED on unauthorized phantom type (E \\ S)", () => {
    const { schemaUniverse, emittedUniverse } = makeBaseUniverses();
    const tabsNs = emittedUniverse.namespaces.get("tabs");
    tabsNs.types.set("UnbackedPhantomInterface", {
      kind: "interface",
      name: "UnbackedPhantomInterface",
      properties: new Map(),
    });

    const result = verifyDeclarations(schemaUniverse, emittedUniverse, { strict: true });
    assert.strictEqual(result.passed, false, "Expected verifier to fail RED on phantom type");
    assert.ok(result.errors.some((e) => e.includes("Emitted phantom types")));
    assert.strictEqual(result.summary.phantomTypes, 1);
  });

  it("NEGATIVE CONTROL 2b: fails RED on a helper type not named after a parameter", () => {
    const { schemaUniverse, emittedUniverse } = makeBaseUniverses();
    schemaUniverse.namespaces.get("tabs").functions.set("query", {
      name: "query",
      parameters: [{ name: "queryInfo", type: "object", properties: { active: { type: "boolean" } } }],
    });
    const tabsNs = emittedUniverse.namespaces.get("tabs");
    tabsNs.functions.set("query", [{ line: 1, raw: "export function query(queryInfo: query.QueryInfo): void;" }]);
    tabsNs.helpers = new Map([["query", { types: ["QueryInfo", "Bogus"], nested: new Map() }]]);

    const result = verifyDeclarations(schemaUniverse, emittedUniverse, { strict: true });
    assert.strictEqual(result.passed, false, "Expected verifier to fail RED on a stray helper type");
    assert.ok(result.errors.some((e) => e.includes("tabs.query.Bogus")));
    assert.strictEqual(result.summary.phantomHelpers, 1);

    tabsNs.helpers.set("query", { types: ["QueryInfo", "Result"], nested: new Map() });
    assert.strictEqual(verifyDeclarations(schemaUniverse, emittedUniverse, { strict: true }).passed, true);
  });

  it("NEGATIVE CONTROL 3: fails RED on fabricated readonly modifier", () => {
    const { schemaUniverse, emittedUniverse } = makeBaseUniverses();
    const tabsNs = emittedUniverse.namespaces.get("tabs");
    const tabIface = tabsNs.types.get("Tab");
    // Plant fabricated readonly on 'id' which has no readOnly: true in schema
    tabIface.properties.get("id").readonly = true;

    const result = verifyDeclarations(schemaUniverse, emittedUniverse, { strict: true });
    assert.strictEqual(result.passed, false, "Expected verifier to fail RED on fabricated readonly");
    assert.ok(result.errors.some((e) => e.includes("fabricated readonly")));
    assert.strictEqual(result.summary.fabricatedReadonly, 1);
  });

  it("NEGATIVE CONTROL 3b: fails RED on fabricated readonly in the manifest namespace", () => {
    const { schemaUniverse, emittedUniverse } = makeBaseUniverses();
    schemaUniverse.namespaces.set("manifest", {
      name: "manifest",
      types: new Map([
        ["WebExtensionManifest", { id: "WebExtensionManifest", properties: { name: { type: "string" } } }],
      ]),
      functions: new Map(),
      events: new Map(),
      properties: new Map(),
    });
    emittedUniverse.namespaces = new Map([
      ["manifest", {
        name: "manifest",
        types: new Map([
          ["WebExtensionManifest", {
            kind: "interface",
            name: "WebExtensionManifest",
            properties: new Map([
              ["name", { name: "name", readonly: true, optional: false, type: "string" }],
            ]),
          }],
        ]),
        functions: new Map(),
        events: new Map(),
        properties: new Map(),
      }],
      ["tabs", emittedUniverse.namespaces.get("tabs")],
    ]);

    const result = verifyDeclarations(schemaUniverse, emittedUniverse, { strict: true });
    assert.strictEqual(result.passed, false, "Expected verifier to fail RED on manifest readonly");
    assert.ok(result.errors.some((e) => e.includes("manifest.WebExtensionManifest.name")));
    assert.strictEqual(result.summary.fabricatedReadonly, 1);
  });

  it("NEGATIVE CONTROL 4: fails RED on sequential collation violation", () => {
    const { schemaUniverse, emittedUniverse } = makeBaseUniverses();
    // Add two namespaces in reverse code-point order
    emittedUniverse.namespaces = new Map([
      ["tabs", emittedUniverse.namespaces.get("tabs")],
      ["alarms", { name: "alarms", types: new Map(), functions: new Map(), events: new Map(), properties: new Map() }],
    ]);
    schemaUniverse.namespaces.set("alarms", {
      name: "alarms",
      types: new Map(),
      functions: new Map(),
      events: new Map(),
      properties: new Map(),
    });

    const result = verifyDeclarations(schemaUniverse, emittedUniverse, { strict: true });
    assert.strictEqual(result.passed, false, "Expected verifier to fail RED on collation violation");
    assert.ok(result.errors.some((e) => e.includes("Collation violations")));
    assert.strictEqual(result.summary.collationErrors, 1);
  });

  it("POSITIVE CONTROL: passes GREEN on clean matching universe", () => {
    const { schemaUniverse, emittedUniverse } = makeBaseUniverses();
    const result = verifyDeclarations(schemaUniverse, emittedUniverse, { strict: true });
    assert.strictEqual(result.passed, true, "Expected verifier to pass GREEN on clean input");
    assert.strictEqual(result.errors.length, 0);
  });
});
