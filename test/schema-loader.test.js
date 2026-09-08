import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { parseJarMn } from "../src/jar-parser.js";
import { loadRawSchemaJson, SchemaRegistry } from "../src/schema-loader.js";

describe("JarParser", () => {
  let tempDir;
  let jarPath;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "jar-test-"));
    jarPath = path.join(tempDir, "jar.mn");
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("throws error for missing jar.mn", () => {
    assert.throws(
      () => parseJarMn(path.join(tempDir, "nonexistent.mn")),
      /jar\.mn manifest not found/
    );
  });

  it("parses desktop schemas properly", () => {
    const content = `
# This Source Code Form is subject...
#ifndef ANDROID
content/extensions/schemas/desktop_only.json
#endif
#ifdef ANDROID
content/extensions/schemas/mobile_only.json
#endif
#if defined(FOO)
content/extensions/schemas/foo.json
#endif
content/extensions/schemas/common.json
`;
    fs.writeFileSync(jarPath, content, "utf8");
    const files = parseJarMn(jarPath, false);
    assert.ok(files.includes("desktop_only.json"));
    assert.ok(!files.includes("mobile_only.json"));
    assert.ok(files.includes("foo.json"));
    assert.ok(files.includes("common.json"));
  });

  it("parses android/mobile schemas properly", () => {
    const content = `
#ifndef ANDROID
content/extensions/schemas/desktop_only.json
#endif
#ifdef ANDROID
content/extensions/schemas/mobile_only.json
#endif
`;
    fs.writeFileSync(jarPath, content, "utf8");
    const files = parseJarMn(jarPath, true);
    assert.ok(!files.includes("desktop_only.json"));
    assert.ok(files.includes("mobile_only.json"));
  });
});

describe("SchemaLoader", () => {
  let tempDir;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "schema-test-"));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("strips comments in loadRawSchemaJson", () => {
    const jsonPath = path.join(tempDir, "test.json");
    const content = `// line comment
/* block
comment */
[
    {
        "namespace": "test",
        "description": "test desc"
    }
]
`;
    fs.writeFileSync(jsonPath, content, "utf8");
    const [data] = loadRawSchemaJson(jsonPath);
    assert.equal(data.length, 1);
    assert.equal(data[0].namespace, "test");
  });

  it("throws error for invalid JSON start", () => {
    const jsonPath = path.join(tempDir, "test2.json");
    const content = `// line comment
"namespace": "test"
`;
    fs.writeFileSync(jsonPath, content, "utf8");
    assert.throws(() => loadRawSchemaJson(jsonPath), /does not start with/);
  });

  it("supports bidirectional $extend in SchemaRegistry", () => {
    const firefoxDir = tempDir;
    const toolkit = path.join(firefoxDir, "toolkit", "components", "extensions", "schemas");
    const browser = path.join(firefoxDir, "browser", "components", "extensions", "schemas");
    fs.mkdirSync(toolkit, { recursive: true });
    fs.mkdirSync(browser, { recursive: true });
    fs.writeFileSync(path.join(browser, "jar.mn"), "", "utf8");

    fs.writeFileSync(
      path.join(toolkit, "jar.mn"),
      "extend_before.json\ncommon.json\nextend_after.json\n",
      "utf8"
    );

    fs.writeFileSync(
      path.join(toolkit, "extend_before.json"),
      JSON.stringify([
        {
          namespace: "test_extend",
          types: [
            {
              $extend: "BaseType",
              properties: {
                before_prop: { type: "boolean" },
              },
              choices: [{ type: "string" }],
            },
          ],
        },
      ]),
      "utf8"
    );

    fs.writeFileSync(
      path.join(toolkit, "common.json"),
      JSON.stringify([
        {
          namespace: "test_extend",
          types: [
            {
              id: "BaseType",
              properties: {
                base_prop: { type: "string" },
              },
              choices: [{ type: "integer" }],
            },
          ],
        },
      ]),
      "utf8"
    );

    fs.writeFileSync(
      path.join(toolkit, "extend_after.json"),
      JSON.stringify([
        {
          namespace: "test_extend",
          types: [
            {
              $extend: "BaseType",
              properties: {
                after_prop: { type: "integer" },
              },
              choices: [{ type: "boolean" }],
            },
          ],
        },
      ]),
      "utf8"
    );

    const registry = new SchemaRegistry(firefoxDir);
    const namespaces = registry.loadTarget("desktop");

    const ns = namespaces.test_extend;
    const baseType = ns.types.BaseType;

    // Verify properties merged from before and after
    assert.ok("base_prop" in baseType.properties);
    assert.ok("before_prop" in baseType.properties);
    assert.ok("after_prop" in baseType.properties);

    // Verify choices merged
    assert.equal(baseType.choices.length, 3);
  });

  it("populates unpopulated base properties on $extend", () => {
    const firefoxDir = tempDir;
    const unpopDir = path.join(firefoxDir, "unpop_test");
    const tk = path.join(unpopDir, "toolkit", "components", "extensions", "schemas");
    const br = path.join(unpopDir, "browser", "components", "extensions", "schemas");
    fs.mkdirSync(tk, { recursive: true });
    fs.mkdirSync(br, { recursive: true });
    fs.writeFileSync(path.join(tk, "jar.mn"), "base.json\nextend.json\n", "utf8");
    fs.writeFileSync(path.join(br, "jar.mn"), "", "utf8");

    fs.writeFileSync(
      path.join(tk, "base.json"),
      JSON.stringify([
        {
          namespace: "test_unpop",
          types: [{ id: "UnpopBase", type: "object" }],
        },
      ]),
      "utf8"
    );

    fs.writeFileSync(
      path.join(tk, "extend.json"),
      JSON.stringify([
        {
          namespace: "test_unpop",
          types: [
            {
              $extend: "UnpopBase",
              properties: {
                added_prop: { type: "string" },
              },
            },
          ],
        },
      ]),
      "utf8"
    );

    const registry = new SchemaRegistry(unpopDir);
    const ns = registry.loadTarget("desktop");
    const base = ns.test_unpop.types.UnpopBase;
    assert.ok("properties" in base);
    assert.ok("added_prop" in base.properties);
  });

  it("throws error when manifest is missing", () => {
    const emptyDir = path.join(tempDir, "nonexistent_firefox");
    fs.mkdirSync(emptyDir, { recursive: true });
    const registry = new SchemaRegistry(emptyDir);
    assert.throws(() => registry.loadTarget("desktop"), /manifest not found/);
  });

  it("emits warning for undrained $extend buffer", async () => {
    const firefoxDir = tempDir;
    const warnDir = path.join(firefoxDir, "warn_test");
    const tk = path.join(warnDir, "toolkit", "components", "extensions", "schemas");
    const br = path.join(warnDir, "browser", "components", "extensions", "schemas");
    fs.mkdirSync(tk, { recursive: true });
    fs.mkdirSync(br, { recursive: true });
    fs.writeFileSync(path.join(tk, "jar.mn"), "orphan_extend.json\n", "utf8");
    fs.writeFileSync(path.join(br, "jar.mn"), "", "utf8");

    fs.writeFileSync(
      path.join(tk, "orphan_extend.json"),
      JSON.stringify([
        {
          namespace: "test_warn",
          types: [
            {
              $extend: "NonexistentType",
              properties: { foo: { type: "string" } },
            },
          ],
        },
      ]),
      "utf8"
    );

    const warnings = [];
    const onWarning = (warning) => warnings.push(warning.message);
    process.on("warning", onWarning);

    try {
      const registry = new SchemaRegistry(warnDir);
      registry.loadTarget("desktop");
      await new Promise((resolve) => setImmediate(resolve));
      assert.ok(warnings.some((msg) => msg.includes("Unresolved $extend buffer")));
    } finally {
      process.off("warning", onWarning);
    }
  });

  it("inherits types, functions, events, properties via namespace $import", () => {
    const firefoxDir = tempDir;
    const nsImpDir = path.join(firefoxDir, "ns_imp_test");
    const tk = path.join(nsImpDir, "toolkit", "components", "extensions", "schemas");
    const br = path.join(nsImpDir, "browser", "components", "extensions", "schemas");
    fs.mkdirSync(tk, { recursive: true });
    fs.mkdirSync(br, { recursive: true });
    fs.writeFileSync(path.join(tk, "jar.mn"), "action.json\nbrowser_action.json\n", "utf8");
    fs.writeFileSync(path.join(br, "jar.mn"), "", "utf8");

    fs.writeFileSync(
      path.join(tk, "action.json"),
      JSON.stringify([
        {
          namespace: "action",
          types: [{ id: "ColorArray", type: "array", items: { type: "integer" } }],
          functions: [
            {
              name: "setTitle",
              type: "function",
              parameters: [{ name: "details", type: "object" }],
            },
          ],
          events: [{ name: "onClicked", type: "function" }],
          properties: { propA: { type: "string" } },
        },
      ]),
      "utf8"
    );

    fs.writeFileSync(
      path.join(tk, "browser_action.json"),
      JSON.stringify([
        {
          namespace: "browserAction",
          $import: "action",
        },
      ]),
      "utf8"
    );

    const registry = new SchemaRegistry(nsImpDir);
    const namespaces = registry.loadTarget("desktop");
    const ba = namespaces.browserAction;
    assert.ok("ColorArray" in ba.types);
    assert.ok("setTitle" in ba.functions);
    assert.ok("onClicked" in ba.events);
    assert.ok("propA" in ba.properties);
  });

  it("merges properties via type $import", () => {
    const firefoxDir = tempDir;
    const tImpDir = path.join(firefoxDir, "t_imp_test");
    const tk = path.join(tImpDir, "toolkit", "components", "extensions", "schemas");
    const br = path.join(tImpDir, "browser", "components", "extensions", "schemas");
    fs.mkdirSync(tk, { recursive: true });
    fs.mkdirSync(br, { recursive: true });
    fs.writeFileSync(path.join(tk, "jar.mn"), "manifest.json\n", "utf8");
    fs.writeFileSync(path.join(br, "jar.mn"), "", "utf8");

    fs.writeFileSync(
      path.join(tk, "manifest.json"),
      JSON.stringify([
        {
          namespace: "manifest",
          types: [
            {
              id: "ManifestBase",
              type: "object",
              properties: {
                manifest_version: { type: "integer" },
                name: { type: "string" },
                version: { type: "string" },
              },
            },
            {
              id: "WebExtensionManifest",
              type: "object",
              $import: "ManifestBase",
              properties: {
                description: { type: "string" },
              },
            },
          ],
        },
      ]),
      "utf8"
    );

    const registry = new SchemaRegistry(tImpDir);
    const namespaces = registry.loadTarget("desktop");
    const manifest = namespaces.manifest.types.WebExtensionManifest;
    assert.ok("manifest_version" in manifest.properties);
    assert.ok("name" in manifest.properties);
    assert.ok("version" in manifest.properties);
    assert.ok("description" in manifest.properties);
  });

  it("merges properties via parameter $import", () => {
    const firefoxDir = tempDir;
    const pImpDir = path.join(firefoxDir, "p_imp_test");
    const tk = path.join(pImpDir, "toolkit", "components", "extensions", "schemas");
    const br = path.join(pImpDir, "browser", "components", "extensions", "schemas");
    fs.mkdirSync(tk, { recursive: true });
    fs.mkdirSync(br, { recursive: true });
    fs.writeFileSync(path.join(tk, "jar.mn"), "schema.json\n", "utf8");
    fs.writeFileSync(path.join(br, "jar.mn"), "", "utf8");

    fs.writeFileSync(
      path.join(tk, "schema.json"),
      JSON.stringify([
        {
          namespace: "action",
          types: [
            {
              id: "Details",
              type: "object",
              properties: {
                tabId: { type: "integer", optional: true },
                windowId: { type: "integer", optional: true },
              },
            },
          ],
          functions: [
            {
              name: "setTitle",
              type: "function",
              parameters: [
                {
                  name: "details",
                  type: "object",
                  $import: "Details",
                  properties: {
                    title: { type: "string" },
                  },
                },
              ],
            },
          ],
        },
      ]),
      "utf8"
    );

    const registry = new SchemaRegistry(pImpDir);
    const namespaces = registry.loadTarget("desktop");
    const detailsParam = namespaces.action.functions.setTitle.parameters[0];
    assert.ok("tabId" in detailsParam.properties);
    assert.ok("windowId" in detailsParam.properties);
    assert.ok("title" in detailsParam.properties);
  });
});
