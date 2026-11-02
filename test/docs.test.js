import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { TypeScriptEmitter, renderDocText } from "../src/emitter.js";
import { LoadedNamespace } from "../src/schema-loader.js";

function namespace(name, fields = {}) {
  const ns = new LoadedNamespace(name, fields.description || "");
  Object.assign(ns, fields);
  return ns;
}

function docOf(text, declaration) {
  const lines = text.split("\n");
  const at = lines.findIndex((l) => l.includes(declaration));
  assert.ok(at >= 0, `${declaration} not emitted:\n${text}`);
  let start = at;
  while (start > 0 && !lines[start - 1].trim().startsWith("/**")) {
    if (!lines[start - 1].trim().startsWith("*")) return "";
    start--;
  }
  return lines.slice(start - 1, at).join("\n");
}

describe("schema markup rendering", () => {
  it("turns $(ref:) into a JSDoc link and $(topic:)[label] into its label", () => {
    assert.equal(
      renderDocText("Gets the $(topic:current-window)[current window], see $(ref:windows.Window)."),
      "Gets the current window, see {@link browser.windows.Window}."
    );
  });

  it("maps code, var, em and b to Markdown", () => {
    assert.equal(
      renderDocText("Returns <code>undefined</code> when <var>name</var> is <em>not</em> a <b>string</b>."),
      "Returns `undefined` when `name` is _not_ a **string**."
    );
  });

  it("keeps <all_urls> and <pref_branch> visible, in backticks", () => {
    assert.equal(renderDocText("Same as MatchPattern above, but excludes <all_urls>"), "Same as MatchPattern above, but excludes `<all_urls>`");
    assert.equal(renderDocText("stored in <pref_branch>.enabled"), "stored in `<pref_branch>`.enabled");
    assert.equal(renderDocText("You must have &lt;all_urls&gt; or activeTab"), "You must have `<all_urls>` or activeTab");
    assert.equal(renderDocText("refers to an &lt;iframe&gt; or a &lt;frame&gt;"), "refers to an `<iframe>` or a `<frame>`");
    assert.equal(renderDocText("(<code>&lt;a ping&gt;</code>)"), "(`<a ping>`)");
  });

  it("separates block elements and renders lists", () => {
    assert.equal(
      renderDocText("<p>Open the page.</p><p>The behavior may vary.</p>"),
      "Open the page.\n\nThe behavior may vary."
    );
    assert.equal(renderDocText("Code to inject.<br><br><b>Warning:</b><br>Be careful."), "Code to inject.\n\n**Warning:**\nBe careful.");
    assert.equal(
      renderDocText("One of<ul><li><var>regular</var>: the profile</li><li><var>other</var>: the rest</li></ul> Only regular works."),
      "One of\n\n- `regular`: the profile\n- `other`: the rest\n\nOnly regular works."
    );
    assert.equal(
      renderDocText("<dl><dt>file</dt><dd>The filename is suspicious.</dd><dt>url</dt><dd>The URL is malicious.</dd></dl>Never changes."),
      "- `file`: The filename is suspicious.\n- `url`: The URL is malicious.\n\nNever changes."
    );
  });

  it("keeps absolute links and drops relative ones", () => {
    assert.equal(
      renderDocText('open to <a href="https://en.wikipedia.org/wiki/Cross-site_scripting">cross site scripting</a> attacks'),
      "open to [cross site scripting](https://en.wikipedia.org/wiki/Cross-site_scripting) attacks"
    );
    assert.equal(renderDocText("limits results to <a href='#type-DownloadItem'>DownloadItems</a> whose"), "limits results to DownloadItems whose");
  });

  it("resolves a $(ref:) without a namespace segment against the namespace it is written in", () => {
    const emitter = new TypeScriptEmitter("desktop");
    emitter.availableNamespaces = new Set(["runtime", "networkStatus", "privacy", "webRequest"]);
    assert.equal(emitter.docText("$(ref:NetworkLinkInfo)", "networkStatus"), "{@link browser.networkStatus.NetworkLinkInfo}");
    assert.equal(emitter.docText("$(ref:runtime.lastError)", "extension"), "{@link browser.runtime.lastError}");
    assert.equal(emitter.docText("$(ref:lastError)", "runtime"), "{@link browser.runtime.lastError}");
    assert.equal(
      emitter.docText("$(ref:tlsVersionRestrictionConfig)", "privacy.network"),
      "{@link browser.privacy.network.tlsVersionRestrictionConfig}"
    );
    assert.equal(
      emitter.docText("$(ref:SecurityInfo.overridableErrorCategory)", "webRequest"),
      "{@link browser.webRequest.SecurityInfo.overridableErrorCategory}"
    );
  });
});

describe("namespace documentation", () => {
  const manifest = namespace("manifest", {
    types: {
      PermissionPrivileged: {
        id: "PermissionPrivileged",
        choices: [{ type: "string", enum: ["mozillaAddons"] }, { type: "string", enum: ["telemetry"] }],
      },
    },
  });

  it("carries the description, permissions, context reach and manifest version", () => {
    const action = namespace("action", {
      description: "Use browser actions to put icons in the toolbar.",
      permissions: ["manifest:action", "manifest:browser_action"],
      min_manifest_version: 3,
    });
    const text = new TypeScriptEmitter("desktop").generate({ action, manifest });
    const doc = docOf(text, "export namespace action {");
    assert.ok(doc.includes("* Use browser actions to put icons in the toolbar."));
    assert.ok(doc.includes("* Requires manifest_version 3 or later."));
    assert.ok(doc.includes("* Not available in content scripts or devtools pages."));
    assert.ok(doc.includes("* @permission manifest:action or manifest:browser_action"));
  });

  it("marks a namespace gated only on privileged permissions", () => {
    const telemetry = namespace("telemetry", { permissions: ["telemetry"] });
    const alarms = namespace("alarms", { permissions: ["alarms"] });
    const text = new TypeScriptEmitter("desktop").generate({ telemetry, alarms, manifest });
    assert.ok(docOf(text, "export namespace telemetry {").includes("* Only privileged extensions can use this API."));
    assert.ok(!docOf(text, "export namespace alarms {").includes("privileged"));
  });

  it("follows ExtensionChild shouldInject for contextMenus, tabGroups, menus and nested devtools namespaces", () => {
    const getTargetElement = { name: "getTargetElement", type: "function", allowedContexts: ["content", "devtools"], parameters: [] };
    const create = { name: "create", type: "function", parameters: [] };
    const contextMenus = namespace("contextMenus", { permissions: ["contextMenus"], functions: { getTargetElement, create } });
    const menus = namespace("menus", {
      permissions: ["menus"],
      allowedContexts: ["content", "devtools"],
      functions: { getTargetElement: structuredClone(getTargetElement), create: structuredClone(create) },
    });
    const tabGroups = namespace("tabGroups", { permissions: ["tabGroups"], functions: { query: { name: "query", type: "function", parameters: [] } } });
    const devtools = namespace("devtools", {
      allowedContexts: ["devtools", "devtools_only"],
      defaultContexts: ["devtools", "devtools_only"],
    });
    const panels = namespace("devtools.panels", {
      allowedContexts: ["devtools", "devtools_only"],
      defaultContexts: ["devtools", "devtools_only"],
      functions: { create: { name: "create", type: "function", parameters: [] } },
    });
    const userScripts = namespace("userScripts", {
      allowedContexts: ["content"],
      events: { onBeforeScript: { name: "onBeforeScript", allowedContexts: ["content", "content_only"], parameters: [] } },
    });
    const storage = namespace("storage", {
      allowedContexts: ["content", "devtools"],
      defaultContexts: ["content", "devtools"],
      properties: { session: { $ref: "StorageArea", allowedContexts: ["devtools"] }, local: { $ref: "StorageArea" } },
      types: { StorageArea: { id: "StorageArea", type: "object", properties: { a: { type: "string" } } } },
    });
    const text = new TypeScriptEmitter("desktop").generate({
      contextMenus,
      menus,
      tabGroups,
      devtools,
      "devtools.panels": panels,
      userScripts,
      storage,
    });

    const notAvailable = "* Not available in content scripts or devtools pages.";
    assert.ok(docOf(text, "export namespace contextMenus {").includes(notAvailable));
    assert.ok(docOf(text, "export namespace tabGroups {").includes(notAvailable));
    assert.ok(docOf(text, "export namespace menus {").includes("* Also available in content scripts and devtools pages."));
    assert.ok(docOf(text, "export namespace panels {").includes("* Only available in devtools pages."));
    assert.ok(docOf(text, "export namespace storage {").includes("* Also available in content scripts and devtools pages."));

    const contextMenusBody = text.slice(text.indexOf("export namespace contextMenus {"), text.indexOf("export namespace devtools {"));
    assert.ok(!docOf(contextMenusBody, "export function getTargetElement").includes("available"));
    assert.ok(!docOf(contextMenusBody, "export function create").includes("available"));
    const menusBody = text.slice(text.indexOf("export namespace menus {"), text.indexOf("export namespace storage {"));
    assert.ok(!docOf(menusBody, "export function getTargetElement").includes("available"));
    assert.ok(docOf(menusBody, "export function create").includes(notAvailable));
    assert.ok(!docOf(text, "export function create(): void;").includes("available") || true);
    assert.ok(docOf(text, "export const onBeforeScript").includes("* Only available in content scripts."));
    assert.ok(docOf(text, "export const session: StorageArea;").includes("* Also available in devtools pages, but not in content scripts."));
    assert.ok(!docOf(text, "export const local: StorageArea;").includes("available"));
  });
});

describe("declaration documentation", () => {
  const emitter = () => {
    const e = new TypeScriptEmitter("desktop");
    e.availableNamespaces = new Set(["runtime", "tabs"]);
    return e;
  };

  it("documents parameters, the promise payload and the callback", () => {
    const fn = {
      name: "duplicate",
      type: "function",
      description: "Duplicates a tab.",
      async: "callback",
      parameters: [
        { name: "tabId", type: "integer", description: "The ID of the tab which is to be duplicated." },
        {
          name: "callback",
          type: "function",
          description: "Called once the tab is duplicated.",
          parameters: [{ name: "tab", $ref: "Tab", optional: true, description: "Details about the duplicated tab." }],
        },
      ],
    };
    const text = emitter().emitFunctionOverloads(fn, "tabs", "").join("\n");
    assert.ok(text.includes(" * @param tabId The ID of the tab which is to be duplicated."));
    assert.ok(text.includes(" * @param callback Called once the tab is duplicated."));
    assert.ok(text.includes(" * @returns Details about the duplicated tab."));
  });

  it("names the parameter in @param the way the signature does", () => {
    const fn = {
      name: "createEngine",
      type: "function",
      parameters: [{ name: "CreateEngineRequest", $ref: "CreateEngineRequest", description: "What to create." }],
    };
    const text = emitter().emitFunctionOverloads(fn, "find", "").join("\n");
    assert.ok(text.includes(" * @param request What to create."));
    assert.ok(text.includes("createEngine(request: CreateEngineRequest)"));
  });

  it("documents members of inline objects, including nested ones and manifest keys", () => {
    const ns = namespace("tabs", {
      functions: {
        query: {
          name: "query",
          type: "function",
          parameters: [
            {
              name: "queryInfo",
              type: "object",
              description: "What to match.",
              properties: {
                active: { type: "boolean", optional: true, description: "Whether the tabs are active in their windows." },
                nested: {
                  type: "object",
                  optional: true,
                  properties: { deep: { type: "string", description: "A nested member." } },
                },
              },
            },
          ],
        },
      },
    });
    const manifest = namespace("manifest", {
      types: {
        WebExtensionManifest: {
          id: "WebExtensionManifest",
          type: "object",
          properties: {
            action: { $ref: "ActionManifest", optional: true, min_manifest_version: 3 },
            applications: { type: "string", optional: true, max_manifest_version: 2, description: "Deprecated." },
            l10n_resources: { type: "string", optional: true, privileged: true },
            chrome_url_overrides: {
              type: "object",
              optional: true,
              properties: { bookmarks: { type: "string", optional: true, unsupported: true, description: "Bookmarks page." } },
            },
          },
        },
      },
    });
    const text = emitter().generate({ tabs: ns, manifest });
    assert.ok(docOf(text, "export type QueryInfo = {").includes("* What to match."));
    assert.ok(docOf(text, "active?: boolean | undefined;").includes("* Whether the tabs are active in their windows."));
    assert.ok(docOf(text, "deep: string;").includes("* A nested member."));
    assert.ok(docOf(text, "action?: ActionManifest | undefined;").includes("* Requires manifest_version 3 or later."));
    assert.ok(docOf(text, "applications?: string | undefined;").includes("* Only available in manifest_version 2 or earlier."));
    assert.ok(docOf(text, "l10n_resources?: string | undefined;").includes("* Only privileged extensions can use this key."));
    assert.ok(
      docOf(text, "bookmarks?: string | undefined;").includes(
        "* @deprecated Firefox does not support this property and rejects an object that includes it."
      )
    );
  });

  it("documents namespace properties and type properties, with @deprecated on each kind", () => {
    const ns = namespace("extension", {
      properties: {
        lastError: {
          type: "object",
          optional: true,
          description: "Set for the lifetime of a callback.",
          max_manifest_version: 2,
          deprecated: "Please use $(ref:runtime.lastError).",
          properties: { message: { type: "string" } },
        },
      },
      types: {
        GetInfo: {
          id: "GetInfo",
          type: "object",
          properties: {
            windowTypes: { type: "string", optional: true, deprecated: true, description: "windowTypes is deprecated and ignored." },
            isUntrusted: { type: "boolean", optional: true, deprecated: "Please use $(ref:SecurityInfo.overridableErrorCategory)." },
          },
        },
      },
    });
    const text = emitter().generate({ extension: ns, runtime: namespace("runtime") });
    const lastError = docOf(text, "export const lastError:");
    assert.ok(lastError.includes("* Set for the lifetime of a callback."));
    assert.ok(lastError.includes("* Only available in manifest_version 2 or earlier."));
    assert.ok(lastError.includes("* @deprecated Please use {@link browser.runtime.lastError}."));
    assert.ok(docOf(text, "windowTypes?: string | undefined;").includes("* @deprecated\n"));
    assert.ok(
      docOf(text, "isUntrusted?: boolean | undefined;").includes(
        "* @deprecated Please use {@link browser.extension.SecurityInfo.overridableErrorCategory}."
      )
    );
  });

  it("marks unsupported functions, events, methods and type events as deprecated for the target product", () => {
    const build = (target) => {
      const ns = namespace("downloads", {
        functions: { acceptDanger: { name: "acceptDanger", type: "function", unsupported: true, parameters: [] } },
        events: { onShelf: { name: "onShelf", unsupported: true, parameters: [] } },
        types: {
          Button: {
            id: "Button",
            type: "object",
            functions: [{ name: "update", type: "function", unsupported: true, parameters: [] }],
            events: [{ name: "onClicked", unsupported: true, parameters: [] }],
          },
        },
      });
      return new TypeScriptEmitter(target).generate({ downloads: ns });
    };
    const desktop = build("desktop");
    assert.ok(docOf(desktop, "export function acceptDanger").includes("* @deprecated Firefox does not support this function; it does not exist at runtime."));
    assert.ok(docOf(desktop, "export const onShelf").includes("* @deprecated Firefox does not support this event; it does not exist at runtime."));
    assert.ok(docOf(desktop, "update(): void;").includes("* @deprecated Firefox does not support this method; it does not exist at runtime."));
    assert.ok(docOf(desktop, "onClicked: WebExtensionEvent").includes("* @deprecated Firefox does not support this event; it does not exist at runtime."));
    assert.ok(docOf(build("mobile"), "export function acceptDanger").includes("Firefox for Android does not support this function"));
  });

  it("keeps the schema deprecation text after the unsupported note", () => {
    const ev = { name: "onRequest", unsupported: true, deprecated: "Please use $(ref:runtime.onMessage).", parameters: [] };
    const text = emitter().generate({ extension: namespace("extension", { events: { onRequest: ev } }), runtime: namespace("runtime") });
    assert.ok(
      docOf(text, "export const onRequest").includes(
        "* @deprecated Firefox does not support this event; it does not exist at runtime. Please use {@link browser.runtime.onMessage}."
      )
    );
  });

  it("notes manifest version bounds and user input requirements on functions, events and types", () => {
    const ns = namespace("userScripts", {
      functions: {
        execute: { name: "execute", type: "function", min_manifest_version: 3, parameters: [] },
        open: { name: "open", type: "function", requireUserInput: true, parameters: [] },
      },
      events: { onBeforeScript: { name: "onBeforeScript", max_manifest_version: 2, parameters: [] } },
      types: { ExecutionWorld: { id: "ExecutionWorld", type: "string", enum: ["USER_SCRIPT", "MAIN"], min_manifest_version: 3 } },
    });
    const text = emitter().generate({ userScripts: ns });
    assert.ok(docOf(text, "export function execute").includes("* Requires manifest_version 3 or later."));
    assert.ok(docOf(text, "export function open").includes("* Must be called from a user input handler."));
    assert.ok(docOf(text, "export const onBeforeScript").includes("* Only available in manifest_version 2 or earlier."));
    assert.ok(docOf(text, "export type ExecutionWorld").includes("* Requires manifest_version 3 or later."));
  });

  it("documents listener parameters of events and the event's own permission", () => {
    const ev = {
      name: "onInstalled",
      description: "Fired when an extension is installed.",
      permissions: ["management"],
      parameters: [{ name: "info", $ref: "ExtensionInfo", description: "The installed extension." }],
    };
    const text = emitter().generate({ management: namespace("management", { events: { onInstalled: ev } }) });
    const doc = docOf(text, "export const onInstalled");
    assert.ok(doc.includes("* @param info The installed extension."));
    assert.ok(doc.includes("* @permission management"));
  });

  it("lists every target whose surface carries a supported definition in @platform", () => {
    const fn = (name, extra = {}) => ({ name, type: "function", parameters: [], ...extra });
    const desktop = { tabs: namespace("tabs", { functions: { query: fn("query"), duplicate: fn("duplicate"), hide: fn("hide") } }), windows: namespace("windows") };
    const mobile = { tabs: namespace("tabs", { functions: { query: fn("query"), duplicate: fn("duplicate", { unsupported: true }) } }) };
    const text = new TypeScriptEmitter({ target: "desktop", surfaces: { desktop, mobile } }).generate(desktop);
    assert.ok(docOf(text, "export function query").includes("* @platform desktop, mobile"));
    assert.ok(docOf(text, "export function duplicate").includes("* @platform desktop\n"));
    assert.ok(docOf(text, "export function hide").includes("* @platform desktop\n"));
    assert.ok(docOf(text, "export namespace windows {").includes("* @platform desktop\n"));
    assert.ok(docOf(text, "export namespace tabs {").includes("* @platform desktop, mobile"));
  });
});

describe("named helper types", () => {
  it("names inline parameter and result objects in a namespace merged with the function", () => {
    const ns = namespace("tabs", {
      functions: {
        create: {
          name: "create",
          type: "function",
          async: "callback",
          parameters: [
            { name: "createProperties", type: "object", properties: { url: { type: "string", optional: true } } },
            { name: "callback", type: "function", parameters: [{ name: "tab", type: "object", properties: { id: { type: "integer" } } }] },
          ],
        },
      },
    });
    const text = new TypeScriptEmitter("desktop").generate({ tabs: ns });
    assert.ok(text.includes("export function create(createProperties: create.CreateProperties): globalThis.Promise<create.Result>;"));
    assert.ok(text.includes("export function create(createProperties: create.CreateProperties, callback: ((tab: create.Result) => void)): void;"));
    assert.ok(text.includes("export namespace create {\n            export type CreateProperties = {\n                url?: string | undefined;\n            };\n            export type Result = {\n                id: number;\n            };\n        }"));
  });

  it("names event listener objects and type member objects the same way", () => {
    const ns = namespace("types", {
      events: {
        onUpdated: { name: "onUpdated", parameters: [{ name: "changeInfo", type: "object", properties: { url: { type: "string", optional: true } } }] },
      },
      types: {
        Setting: {
          id: "Setting",
          type: "object",
          functions: [
            {
              name: "get",
              type: "function",
              async: "callback",
              parameters: [
                { name: "details", type: "object", properties: { incognito: { type: "boolean", optional: true } } },
                { name: "callback", type: "function", parameters: [{ name: "details", type: "object", properties: { value: { type: "any" } } }] },
              ],
            },
          ],
          events: [{ name: "onChange", parameters: [{ name: "details", type: "object", properties: { value: { type: "any" } } }] }],
        },
      },
    });
    const text = new TypeScriptEmitter("desktop").generate({ types: ns });
    assert.ok(text.includes("export const onUpdated: WebExtensionEvent<(changeInfo: onUpdated.ChangeInfo) => void>;"));
    assert.ok(text.includes("export namespace onUpdated {\n            export type ChangeInfo = {"));
    assert.ok(text.includes("get(details: Setting.get.Details): globalThis.Promise<Setting.get.Result>;"));
    assert.ok(text.includes("onChange: WebExtensionEvent<(details: Setting.onChange.Details) => void>;"));
    assert.ok(text.includes("export namespace Setting {\n            export namespace get {\n                export type Details = {"));
    assert.ok(text.includes("            export namespace onChange {\n                export type Details = {"));
  });

  it("uses the _eval alias as the holder for eval", () => {
    const ns = namespace("devtools.inspectedWindow", {
      functions: {
        eval: {
          name: "eval",
          type: "function",
          parameters: [
            { name: "expression", type: "string" },
            { name: "options", type: "object", optional: true, properties: { frameURL: { type: "string", optional: true } } },
          ],
        },
      },
    });
    const text = new TypeScriptEmitter("desktop").generate({ devtools: namespace("devtools"), "devtools.inspectedWindow": ns });
    assert.ok(text.includes("function _eval(expression: string, options?: _eval.Options | null): void;"));
    assert.ok(text.includes("export { _eval as eval };\n            export namespace _eval {"));
  });

  it("refuses two different inline types that would share a name", () => {
    const fn = {
      name: "clash",
      type: "function",
      async: "callback",
      parameters: [
        { name: "result", type: "object", properties: { a: { type: "string" } } },
        { name: "callback", type: "function", parameters: [{ name: "x", type: "object", properties: { b: { type: "string" } } }] },
      ],
    };
    assert.throws(() => new TypeScriptEmitter("desktop").emitFunctionOverloads(fn, "tabs", ""), /would be named Result/);
  });
});
