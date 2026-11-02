import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
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
    assert.ok(emitted.includes("active?: boolean | undefined;"));
  });

  it("adds index signature to empty interfaces to prevent matching primitives", () => {
    const ns = new LoadedNamespace("find");
    ns.types.CreateEngineRequest = { id: "CreateEngineRequest", type: "object" };
    const lines = [];
    emitter._emitNamespaceBody(ns, lines, "        ", "find");
    const fullText = lines.join("\n");
    assert.ok(fullText.includes("[key: string]: unknown;"));
  });

  it("emits extraParameters on addListener and the blocking return type for webRequest", () => {
    const ns = new LoadedNamespace("webRequest");
    ns.events.onBeforeRequest = {
      name: "onBeforeRequest",
      parameters: [{ name: "details", type: "object", properties: { url: { type: "string" } } }],
      returns: { $ref: "BlockingResponse", optional: true },
      extraParameters: [
        { name: "filter", $ref: "RequestFilter" },
        { name: "extraInfoSpec", type: "array", optional: true, items: { $ref: "OnBeforeRequestOptions" } },
      ],
    };
    ns.events.onErrorOccurred = {
      name: "onErrorOccurred",
      parameters: [{ name: "details", type: "object", properties: { url: { type: "string" } } }],
      extraParameters: [{ name: "filter", $ref: "RequestFilter" }],
    };
    const lines = [];
    emitter._emitNamespaceBody(ns, lines, "        ", "webRequest");
    const fullText = lines.join("\n");
    const blocking = "browser.webRequest.BlockingResponse | Promise<browser.webRequest.BlockingResponse> | void";
    assert.ok(fullText.includes(`export const onBeforeRequest: Omit<WebExtensionEvent<(details: onBeforeRequest.Details) => ${blocking}>, "addListener"> & { addListener(callback: (details: onBeforeRequest.Details) => ${blocking}, filter: RequestFilter, extraInfoSpec?: OnBeforeRequestOptions[] | null): void };`));
    assert.ok(fullText.includes(`export const onErrorOccurred: Omit<WebExtensionEvent<(details: onErrorOccurred.Details) => void>, "addListener"> & { addListener(callback: (details: onErrorOccurred.Details) => void, filter: RequestFilter): void };`));
    assert.ok(fullText.includes("export namespace onBeforeRequest {\n            export type Details = {\n                url: string;\n            };\n        }"));
    assert.ok(!fullText.includes("WebExtensionWebRequestEvent"));
  });

  it("emits optional extraParameters and optional listener parameters", () => {
    const ns = new LoadedNamespace("tabs");
    ns.events.onUpdated = {
      name: "onUpdated",
      parameters: [{ name: "tabId", type: "integer" }],
      extraParameters: [{ name: "filter", $ref: "UpdateFilter", optional: true }],
    };
    ns.events.onClicked = {
      name: "onClicked",
      parameters: [
        { name: "info", $ref: "OnClickData" },
        { name: "tab", $ref: "Tab", optional: true },
      ],
    };
    ns.events.onRequest = {
      name: "onRequest",
      parameters: [
        { name: "request", type: "any", optional: true },
        { name: "sender", $ref: "MessageSender" },
      ],
    };
    const lines = [];
    emitter._emitNamespaceBody(ns, lines, "        ", "tabs");
    const fullText = lines.join("\n");
    assert.ok(fullText.includes("addListener(callback: (tabId: number) => void, filter?: UpdateFilter | null): void };"));
    assert.ok(fullText.includes("export const onClicked: WebExtensionEvent<(info: OnClickData, tab?: Tab) => void>;"));
    assert.ok(fullText.includes("export const onRequest: WebExtensionEvent<(request: any, sender: MessageSender) => void>;"));
  });

  it("applies the runtime shape of messaging and proxy error listeners", () => {
    const runtime = new LoadedNamespace("runtime");
    runtime.events.onMessage = {
      name: "onMessage",
      parameters: [
        { name: "message", type: "any", optional: true },
        { name: "sender", $ref: "MessageSender" },
        { name: "sendResponse", type: "function" },
      ],
      returns: { type: "boolean", optional: true },
    };
    runtime.types.Port = {
      id: "Port",
      type: "object",
      properties: {
        name: { type: "string" },
        disconnect: { type: "function" },
        onDisconnect: { $ref: "events.Event" },
        onMessage: { $ref: "events.Event" },
        postMessage: { type: "function" },
      },
      additionalProperties: { type: "any" },
    };
    const lines = [];
    emitter._emitNamespaceBody(runtime, lines, "        ", "runtime");
    const fullText = lines.join("\n");
    assert.ok(
      fullText.includes(
        "export const onMessage: WebExtensionEvent<(message: any, sender: MessageSender, sendResponse: (response?: unknown) => void) => boolean | Promise<unknown> | void>;"
      )
    );
    assert.ok(fullText.includes("error: Error | null;"));
    assert.ok(fullText.includes("onMessage: WebExtensionEvent<(message: any, port: Port) => void>;"));
    assert.ok(fullText.includes("onDisconnect: WebExtensionEvent<(port: Port) => void>;"));
    assert.ok(fullText.includes("postMessage: (message: any) => void;"));
    assert.ok(fullText.includes("disconnect: () => void;"));

    const proxy = new LoadedNamespace("proxy");
    proxy.events.onError = { name: "onError", parameters: [{ name: "error", type: "object" }] };
    const proxyLines = [];
    emitter._emitNamespaceBody(proxy, proxyLines, "        ", "proxy");
    assert.ok(
      proxyLines.join("\n").includes(
        "export const onError: WebExtensionEvent<(error: { message: string; fileName: string; lineNumber: number; stack: string }) => void>;"
      )
    );
  });

  it("types runtime.getManifest as the normalized WebExtensionManifest", () => {
    const fn = {
      name: "getManifest",
      parameters: [],
      returns: { type: "object", properties: {}, additionalProperties: { type: "any" } },
    };
    const lines = emitter.emitFunctionOverloads(fn, "runtime", "        ");
    const fullText = lines.join("\n");
    assert.ok(fullText.includes("getManifest(): browser.manifest.WebExtensionManifest;"));
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
    assert.ok(fullText.includes("active?: boolean | undefined;"));
  });

  it("does not mark unsupported properties readonly", () => {
    const ns = new LoadedNamespace("tabs");
    ns.types.Tab = {
      id: "Tab",
      type: "object",
      properties: {
        id: { type: "integer" },
        removed: { type: "number", optional: true, unsupported: true },
        created: { type: "number", readOnly: true },
      },
    };
    const lines = [];
    emitter._emitNamespaceBody(ns, lines, "        ", "tabs");
    const fullText = lines.join("\n");
    assert.ok(fullText.includes("removed?: number | undefined;"));
    assert.ok(fullText.includes("created: number;"));
    assert.ok(!fullText.includes("readonly"));
  });

  it("renders typed maps as index signatures", () => {
    assert.equal(
      emitter.emitType({ type: "object", additionalProperties: { $ref: "StorageChange" } }, "storage"),
      "{ [key: string]: StorageChange }"
    );
    assert.equal(
      emitter.emitType({ type: "object", additionalProperties: { type: "any" } }, "storage"),
      "Record<string, any>"
    );
    assert.equal(emitter.emitType({ type: "object", additionalProperties: true }, "storage"), "Record<string, unknown>");
    assert.equal(emitter.emitType({ type: "object" }, "proxy"), "Record<string, unknown>");
    assert.equal(
      emitter.emitType(
        { type: "object", patternProperties: { "^[1-9]\\d*$": { type: "string" } }, additionalProperties: false },
        "manifest"
      ),
      "{ [key: number]: string }"
    );
    assert.equal(
      emitter.emitType(
        { type: "object", patternProperties: { "^[a-z]+$": { type: "string" }, "^[a-z]{2}$": { type: "object" } } },
        "manifest"
      ),
      "{ [key: string]: string | Record<string, unknown> }"
    );
  });

  it("renders fixed-length arrays as tuples", () => {
    assert.equal(
      emitter.emitType({ type: "array", items: { type: "integer" }, minItems: 4, maxItems: 4 }, "action"),
      "[number, number, number, number]"
    );
    assert.equal(
      emitter.emitType({ type: "array", items: { type: "string" }, minItems: 1 }, "tabs"),
      "string[]"
    );
    assert.equal(
      emitter.emitType({ type: "array", items: { type: "string" }, maxItems: 15 }, "manifest"),
      "string[]"
    );
  });

  it("maps isInstanceOf to the platform class", () => {
    assert.equal(
      emitter.emitType({ type: "object", isInstanceOf: "ImageData", additionalProperties: { type: "any" } }, "action"),
      "globalThis.ImageData"
    );
    assert.equal(
      emitter.emitType({ type: "object", isInstanceOf: "StreamFilter", additionalProperties: { type: "any" } }, "webRequest"),
      "StreamFilter"
    );
    assert.equal(
      emitter.emitType({ type: "object", isInstanceOf: "StreamFilter", additionalProperties: { type: "any" } }, "tabs"),
      "browser.webRequest.StreamFilter"
    );
    const ns = new LoadedNamespace("action");
    ns.types.ImageDataType = {
      id: "ImageDataType",
      type: "object",
      isInstanceOf: "ImageData",
      additionalProperties: { type: "any" },
    };
    const lines = [];
    emitter._emitNamespaceBody(ns, lines, "        ", "action");
    assert.ok(lines.join("\n").includes("export type ImageDataType = globalThis.ImageData;"));
  });

  it("emits WebIDL-backed interfaces", () => {
    const ns = new LoadedNamespace("webRequest");
    ns.types.StreamFilter = {
      id: "StreamFilter",
      _webidl: {
        extends: "EventTarget",
        members: [
          { kind: "operation", name: "write", returns: "undefined", params: [{ name: "data", type: "(ArrayBuffer or Uint8Array)", optional: false }] },
          { kind: "attribute", name: "error", type: "DOMString", readonly: true },
          { kind: "attribute", name: "ondata", type: "EventHandler", readonly: false },
        ],
      },
    };
    const lines = [];
    emitter._emitNamespaceBody(ns, lines, "        ", "webRequest");
    const fullText = lines.join("\n");
    assert.ok(fullText.includes("export interface StreamFilter extends EventTarget {"));
    assert.ok(fullText.includes("write(data: ArrayBuffer | Uint8Array): void;"));
    assert.ok(fullText.includes("readonly error: string;"));
    assert.ok(fullText.includes("ondata: ((this: StreamFilter, event: StreamFilterDataEvent) => any) | null;"));
  });

  it("lets optional properties take an explicit undefined", () => {
    const emitted = emitter.emitType(
      { type: "object", properties: { url: { type: "string", optional: true }, data: { type: "any", optional: true } } },
      "tabs"
    );
    assert.ok(emitted.includes("url?: string | undefined;"));
    assert.ok(emitted.includes("data?: any;"));
  });

  it("lets optional and leading-optional parameters take null and undefined", () => {
    const fn = {
      name: "sendMessage",
      async: "responseCallback",
      parameters: [
        { name: "extensionId", type: "string", optional: true },
        { name: "message", type: "any" },
        { name: "options", type: "object", optional: true },
        { name: "responseCallback", type: "function", parameters: [{ name: "response", type: "any" }] },
      ],
    };
    const fullText = emitter.emitFunctionOverloads(fn, "runtime", "").join("\n");
    assert.ok(
      fullText.includes(
        "export function sendMessage(extensionId: string | null | undefined, message: any, options?: Record<string, unknown> | null): globalThis.Promise<any>;"
      )
    );
    assert.ok(fullText.includes("export function sendMessage(message: any, options?: Record<string, unknown> | null): globalThis.Promise<any>;"));
    const promiseLines = fullText.split("\n").filter((l) => l.includes("globalThis.Promise"));
    const callbackLines = fullText.split("\n").filter((l) => l.includes("responseCallback: "));
    assert.ok(fullText.indexOf(promiseLines.at(-1)) < fullText.indexOf(callbackLines[0]));
  });

  it("resolves the Promise from the implementation when the schema has no payload", () => {
    const fn = {
      name: "query",
      async: true,
      parameters: [{ name: "details", type: "object", properties: { name: { type: "string", optional: true } } }],
    };
    const fullText = emitter.emitFunctionOverloads(fn, "contextualIdentities", "").join("\n");
    assert.ok(fullText.includes("globalThis.Promise<ContextualIdentity[]>"));

    const cb = {
      name: "isOpen",
      async: "callback",
      parameters: [
        { name: "details", type: "object" },
        { name: "callback", type: "function", parameters: [] },
      ],
    };
    const cbText = emitter.emitFunctionOverloads(cb, "sidebarAction", "").join("\n");
    assert.ok(cbText.includes("globalThis.Promise<boolean>"));
    assert.ok(cbText.includes("callback: ((result: boolean) => void)): void;"));
  });

  it("keeps a schema-optional payload optional, null where the implementation returns null", () => {
    const get = {
      name: "get",
      async: "callback",
      parameters: [
        { name: "name", type: "string" },
        { name: "callback", type: "function", parameters: [{ name: "alarm", $ref: "Alarm", optional: true }] },
      ],
    };
    const alarmText = emitter.emitFunctionOverloads(get, "alarms", "").join("\n");
    assert.ok(alarmText.includes("globalThis.Promise<Alarm | undefined>"));
    assert.ok(alarmText.includes("callback: ((alarm: Alarm | undefined) => void)"));

    const cookie = {
      name: "get",
      async: "callback",
      parameters: [
        { name: "details", type: "object" },
        { name: "callback", type: "function", parameters: [{ name: "cookie", $ref: "Cookie", optional: true }] },
      ],
    };
    const cookieText = emitter.emitFunctionOverloads(cookie, "cookies", "").join("\n");
    assert.ok(cookieText.includes("globalThis.Promise<Cookie | null>"));
  });

  it("resolves a multi-argument callback as a tuple", () => {
    const fn = {
      name: "eval",
      async: "callback",
      parameters: [
        { name: "expression", type: "string" },
        {
          name: "callback",
          type: "function",
          parameters: [
            { name: "result", type: "any" },
            { name: "exceptionInfo", $ref: "ExceptionInfo", optional: true },
          ],
        },
      ],
    };
    const fullText = emitter.emitFunctionOverloads(fn, "devtools.inspectedWindow", "").join("\n");
    assert.ok(fullText.includes("globalThis.Promise<[result: any, exceptionInfo: ExceptionInfo | undefined]>"));
  });

  it("types scripting.executeScript over its func, args and awaited result", () => {
    const ns = new LoadedNamespace("scripting");
    ns.types.ScriptInjection = {
      id: "ScriptInjection",
      type: "object",
      properties: {
        args: { type: "array", optional: true, items: { type: "any" } },
        func: { type: "function", optional: true },
        target: { type: "object" },
      },
    };
    ns.types.InjectionResult = {
      id: "InjectionResult",
      type: "object",
      properties: { frameId: { type: "integer" }, result: { type: "any", optional: true } },
    };
    ns.functions.executeScript = {
      name: "executeScript",
      async: "callback",
      parameters: [
        { name: "injection", $ref: "ScriptInjection" },
        {
          name: "callback",
          type: "function",
          parameters: [{ name: "results", type: "array", items: { $ref: "InjectionResult" } }],
        },
      ],
    };
    const lines = [];
    emitter._emitNamespaceBody(ns, lines, "", "scripting");
    const fullText = lines.join("\n");
    assert.ok(fullText.includes("export interface ScriptInjection<Args extends unknown[] = unknown[], Result = unknown> {"));
    assert.ok(fullText.includes("args?: Args | undefined;"));
    assert.ok(fullText.includes("func?: (...args: Args) => Result | undefined;"));
    assert.ok(fullText.includes("export interface InjectionResult<Result = unknown> {"));
    assert.ok(fullText.includes("result?: Result | undefined;"));
    assert.ok(
      fullText.includes(
        "export function executeScript<Args extends unknown[], Result>(injection: ScriptInjection<Args, Result>): globalThis.Promise<InjectionResult<Awaited<Result>>[]>;"
      )
    );
    assert.ok(fullText.includes("callback: ((results: InjectionResult<Awaited<Result>>[]) => void)): void;"));
  });

  it("emits every manifest-version definition of a function as overloads", () => {
    const ns = new LoadedNamespace("userScripts");
    ns.functions.register = {
      name: "register",
      max_manifest_version: 2,
      async: "callback",
      parameters: [
        { name: "userScriptOptions", $ref: "UserScriptOptions" },
        {
          name: "callback",
          type: "function",
          parameters: [
            {
              name: "legacyRegisteredUserScript",
              type: "object",
              properties: { unregister: { type: "function", async: true, parameters: [] } },
            },
          ],
        },
      ],
      _alternates: [
        {
          name: "register",
          min_manifest_version: 3,
          async: true,
          parameters: [{ name: "scripts", type: "array", items: { $ref: "RegisteredUserScript" } }],
        },
      ],
    };
    const lines = [];
    emitter._emitNamespaceBody(ns, lines, "", "userScripts");
    const fullText = lines.join("\n");
    assert.ok(fullText.includes("export function register(userScriptOptions: UserScriptOptions): globalThis.Promise<register.Result>;"));
    assert.ok(fullText.includes("export namespace register {\n    export type Result = {\n        unregister: (() => globalThis.Promise<void>);\n    };\n}"));
    assert.ok(fullText.includes("export function register(scripts: RegisteredUserScript[]): globalThis.Promise<void>;"));
  });

  it("does not fabricate readonly for manifest properties", () => {
    const ns = new LoadedNamespace("manifest");
    ns.types.WebExtensionManifest = {
      id: "WebExtensionManifest",
      type: "object",
      properties: {
        name: { type: "string" },
        version: { type: "string" },
      },
    };
    const lines = [];
    emitter._emitNamespaceBody(ns, lines, "        ", "manifest");
    const fullText = lines.join("\n");
    assert.ok(fullText.includes("name: string;"));
    assert.ok(!fullText.includes("readonly"));
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
      fullText.includes("@deprecated Please use {@link browser.runtime.getURL}.")
    );
  });

  it("types webRequest.UploadData.bytes as ArrayBuffer and no other bytes property", () => {
    const ns = new LoadedNamespace("webRequest");
    ns.types.UploadData = {
      id: "UploadData",
      type: "object",
      properties: {
        bytes: { type: "any", optional: true },
        file: { type: "string", optional: true },
      },
    };
    ns.types.Chunk = {
      id: "Chunk",
      type: "object",
      properties: { bytes: { type: "string" } },
    };
    const lines = [];
    emitter._emitNamespaceBody(ns, lines, "        ", "webRequest");
    const fullText = lines.join("\n");
    assert.ok(fullText.includes("bytes?: ArrayBuffer | undefined;"));
    assert.ok(fullText.includes("bytes: string;"));
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

  it("compiles the exactOptionalPropertyTypes fixture against dist", () => {
    const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
    if (!fs.existsSync(path.join(root, "dist", "index.d.ts"))) {
      return;
    }
    const res = spawnSync(
      process.execPath,
      [
        path.join(root, "node_modules", "typescript", "bin", "tsc"),
        "--ignoreConfig",
        "--noEmit",
        "--strict",
        "--exactOptionalPropertyTypes",
        "--target",
        "es2022",
        "--module",
        "nodenext",
        "--moduleResolution",
        "nodenext",
        "--lib",
        "es2022,dom",
        path.join(root, "test", "fixtures", "exact_optional.ts"),
      ],
      { encoding: "utf8" }
    );
    assert.equal(res.status, 0, res.stdout + res.stderr);
  });
});
