import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { TypeScriptEmitter, formatEnumVal } from "../src/emitter.js";
import { LoadedNamespace } from "../src/schema-loader.js";

describe("TypeScriptEmitter", () => {
  let emitter;

  beforeEach(() => {
    emitter = new TypeScriptEmitter("desktop", "testsha123");
    emitter.availableNamespaces = new Set([
      "tabs",
      "runtime",
      "storage",
      "manifest",
      "extension",
      "webRequest",
    ]);
  });

  it("formats enum values properly", () => {
    // Plain strings
    assert.equal(formatEnumVal("normal"), '"normal"');
    // Booleans
    assert.equal(formatEnumVal(true), "true");
    assert.equal(formatEnumVal(false), "false");
    // Objects with name (e.g. MutedInfoReason, ZoomSettingsMode)
    const dictVal = { name: "user", description: "Muted by user" };
    assert.equal(formatEnumVal(dictVal), '"user"');
    const dictVal2 = { name: "capture", description: "Muted by capture" };
    assert.equal(formatEnumVal(dictVal2), '"capture"');
  });

  it("maps primitive types", () => {
    assert.equal(emitter.emitType({ type: "string" }, "tabs"), "string");
    assert.equal(emitter.emitType({ type: "integer" }, "tabs"), "number");
    assert.equal(emitter.emitType({ type: "number" }, "tabs"), "number");
    assert.equal(emitter.emitType({ type: "boolean" }, "tabs"), "boolean");
    assert.equal(emitter.emitType({ type: "null" }, "tabs"), "null");
    assert.equal(emitter.emitType({ type: "any" }, "tabs"), "any");
  });

  it("emits string and object enums", () => {
    const typeInfo = { type: "string", enum: ["panel", "popup"] };
    assert.equal(emitter.emitType(typeInfo, "tabs"), '"panel" | "popup"');

    const dictEnum = {
      type: "string",
      enum: [
        { name: "user", description: "user muted" },
        { name: "capture", description: "capture muted" },
      ],
    };
    assert.equal(emitter.emitType(dictEnum, "tabs"), '"user" | "capture"');
  });

  it("emits choices union", () => {
    const typeInfo = {
      choices: [{ type: "string" }, { type: "integer" }],
    };
    assert.equal(emitter.emitType(typeInfo, "tabs"), "string | number");
  });

  it("preserves autocomplete on open string union", () => {
    const typeInfo = {
      choices: [
        { value: "panel" },
        { value: "popup" },
        { type: "string" },
      ],
    };
    const emitted = emitter.emitType(typeInfo, "tabs");
    assert.equal(emitted, '"panel" | "popup" | (string & {})');
  });

  it("resolves $ref within and across namespaces", () => {
    // Intra-namespace ref
    assert.equal(emitter.emitType({ $ref: "Tab" }, "tabs"), "Tab");
    // Cross-namespace ref in available namespaces
    assert.equal(
      emitter.emitType({ $ref: "runtime.Port" }, "tabs"),
      "browser.runtime.Port"
    );
    // Cross-namespace ref in unavailable namespace falls back to unknown
    assert.equal(emitter.emitType({ $ref: "unknownNs.Foo" }, "tabs"), "unknown");
  });

  it("resolves isInstanceOf Window and Window | null", () => {
    assert.equal(
      emitter.emitType({ type: "object", isInstanceOf: "Window" }, "extension"),
      "Window"
    );
    assert.equal(
      emitter.emitType(
        { type: "object", isInstanceOf: "Window", optional: true },
        "extension"
      ),
      "Window | null"
    );
  });

  it("emits array types including unions with parentheses", () => {
    assert.equal(
      emitter.emitType({ type: "array", items: { type: "string" } }, "tabs"),
      "string[]"
    );
    const unionItems = {
      type: "array",
      items: { choices: [{ type: "string" }, { type: "number" }] },
    };
    assert.equal(emitter.emitType(unionItems, "tabs"), "(string | number)[]");
  });

  it("emits inline object types", () => {
    const objType = {
      type: "object",
      properties: {
        url: { type: "string", description: "The URL" },
        active: { type: "boolean", optional: true },
      },
    };
    const emitted = emitter.emitType(objType, "tabs");
    assert.ok(emitted.includes("url: string;"));
    assert.ok(emitted.includes("active?: boolean;"));
  });

  it("adds index signature to empty interfaces to prevent matching primitives", () => {
    const ns = new LoadedNamespace("find");
    ns.types.CreateEngineRequest = { id: "CreateEngineRequest", type: "object" };
    const lines = [];
    emitter._emitNamespaceBody(ns, lines, "        ", "find");
    const fullText = lines.join("\n");
    assert.ok(fullText.includes("[key: string]: unknown;"));
  });

  it("emits specialized webRequest blocking event return types", () => {
    const ns = new LoadedNamespace("webRequest");
    ns.events.onBeforeRequest = {
      name: "onBeforeRequest",
      parameters: [{ name: "details", type: "object" }],
    };
    const lines = [];
    emitter._emitNamespaceBody(ns, lines, "        ", "webRequest");
    const fullText = lines.join("\n");
    assert.ok(fullText.includes("WebExtensionWebRequestEvent"));
    assert.ok(
      fullText.includes(
        "browser.webRequest.BlockingResponse | Promise<browser.webRequest.BlockingResponse> | void"
      )
    );
  });

  it("emits schema-faithful return type for runtime.getManifest", () => {
    const fn = {
      name: "getManifest",
      parameters: [],
      returns: { type: "object" },
    };
    const lines = emitter.emitFunctionOverloads(fn, "runtime", "        ");
    const fullText = lines.join("\n");
    assert.ok(fullText.includes("Record<string, unknown>"));
  });

  it("emits schema-faithful signature for runtime.sendMessage without fabricated generics", () => {
    const fn = {
      name: "sendMessage",
      async: "callback",
      parameters: [
        { name: "message", type: "any" },
        { name: "options", type: "object", optional: true },
        { name: "callback", type: "function" },
      ],
    };
    const lines = emitter.emitFunctionOverloads(fn, "runtime", "        ");
    const fullText = lines.join("\n");
    assert.ok(!fullText.includes("<TResponse"));
    assert.ok(fullText.includes("globalThis.Promise<void>"));
  });

  it("emits schema-faithful storage.StorageArea functions without unbacked generics", () => {
    const ns = new LoadedNamespace("storage");
    ns.types.StorageArea = {
      id: "StorageArea",
      type: "object",
      functions: [{ name: "get", async: "callback" }],
    };
    const lines = [];
    emitter._emitNamespaceBody(ns, lines, "        ", "storage");
    const fullText = lines.join("\n");
    assert.ok(!fullText.includes("get<T"));
    assert.ok(fullText.includes("get(): globalThis.Promise<void>;"));
  });

  it("emits inline object parameter for tabs.query without phantom TabsQueryInfo", () => {
    const ns = new LoadedNamespace("tabs");
    ns.functions.query = {
      name: "query",
      async: "callback",
      parameters: [
        {
          name: "queryInfo",
          type: "object",
          properties: {
            active: { type: "boolean", optional: true },
          },
        },
        { name: "callback", type: "function" },
      ],
    };
    const fullText = emitter.generate({ tabs: ns });
    assert.ok(!fullText.includes("TabsQueryInfo"));
    assert.ok(!fullText.includes("interface QueryInfo"));
    assert.ok(fullText.includes("active?: boolean;"));
  });

  it("marks immutable properties as readonly when specified in schema", () => {
    const ns = new LoadedNamespace("tabs");
    ns.types.Tab = {
      id: "Tab",
      type: "object",
      properties: {
        id: { type: "integer" },
        created: { type: "number", readOnly: true },
        url: { type: "string", optional: true },
      },
    };
    const lines = [];
    emitter._emitNamespaceBody(ns, lines, "        ", "tabs");
    const fullText = lines.join("\n");
    assert.ok(fullText.includes("id: number;"));
    assert.ok(!fullText.includes("readonly id: number;"));
    assert.ok(fullText.includes("readonly created: number;"));
    assert.ok(fullText.includes("url?: string;"));
  });

  it("emits @deprecated tag in JSDoc", () => {
    const fn = {
      name: "getURL",
      description: "Returns URL.",
      deprecated: "Please use $(ref:runtime.getURL).",
      parameters: [],
    };
    const lines = emitter.emitFunctionOverloads(fn, "extension", "        ");
    const fullText = lines.join("\n");
    assert.ok(
      fullText.includes("@deprecated Please use browser.runtime.getURL.")
    );
  });

  it("cleans parameter shadowing without trailing underscore", () => {
    const fn = {
      name: "createEngine",
      parameters: [
        { name: "CreateEngineRequest", $ref: "CreateEngineRequest" },
      ],
    };
    const lines = emitter.emitFunctionOverloads(fn, "find", "        ");
    const fullText = lines.join("\n");
    assert.ok(fullText.includes("request: CreateEngineRequest"));
    assert.ok(!fullText.includes("CreateEngineRequest_"));
  });

  it("initializes availableNamespaces in default constructor", () => {
    const freshEmitter = new TypeScriptEmitter();
    assert.ok(freshEmitter.availableNamespaces instanceof Set);
    const res = freshEmitter.emitType({ $ref: "foo.Bar" }, "test");
    assert.equal(res, "unknown");
  });
});
