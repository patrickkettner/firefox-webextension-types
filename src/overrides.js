/**
 * overrides.js - Behaviour the schemas cannot express.
 *
 * Every entry names the Firefox file that defines the behaviour.
 */

// Namespaces the schema declares but Firefox does not expose to extensions.
export const EXCLUDED_NAMESPACES = {
  // toolkit/components/extensions/child/ext-test.js returns { test: {} }
  // unless the browser runs in automation.
  test: "toolkit/components/extensions/child/ext-test.js",
};

// TypeScript names for schema `isInstanceOf` values. Schemas.sys.mjs checks
// ChromeUtils.getClassName(value) against the string, so these are the
// platform classes an extension really has to hand over.
export const PLATFORM_TYPES = {
  global: "Window",
  Date: "globalThis.Date",
  Promise: "globalThis.Promise<unknown>",
  DirectoryEntry: "FileSystemDirectoryEntry",
  ImageData: "globalThis.ImageData",
  // Declared in dom/webidl/StreamFilter.webidl and loaded into the
  // webRequest namespace by WEBIDL_TYPES.
  StreamFilter: "browser.webRequest.StreamFilter",
};

// WebIDL files whose interfaces and enums are emitted into a namespace
// because a schema `isInstanceOf` names them.
export const WEBIDL_TYPES = {
  webRequest: ["dom/webidl/StreamFilter.webidl", "dom/webidl/StreamFilterDataEvent.webidl"],
};

// WebIDL declares these handlers as plain EventHandler. The event each one
// receives is in toolkit/components/extensions/webrequest/StreamFilter.cpp.
export const WEBIDL_EVENT_HANDLERS = {
  "StreamFilter.ondata": "StreamFilterDataEvent",
  "StreamFilter.onstart": "Event",
  "StreamFilter.onstop": "Event",
  "StreamFilter.onerror": "Event",
};

// Signature overrides for functions, keyed "namespace.function" or
// "namespace.Type.function".
export const FUNCTION_OVERRIDES = {
  // toolkit/components/extensions/child/ext-runtime.js returns the
  // normalized manifest (toolkit/components/extensions/Extension.sys.mjs).
  // Normalization fills absent optional keys with null.
  "runtime.getManifest": { returns: "browser.manifest.WebExtensionManifest" },
  "scripting.executeScript": {
    typeParameters: "<Args extends unknown[], Result>",
    parameters: { injection: "ScriptInjection<Args, Result>" },
    result: "InjectionResult<Awaited<Result>>[]",
  },
};

// Value an async function resolves with when its schema has no callback
// parameters and no `returns`. Keyed like FUNCTION_OVERRIDES; types are
// written as seen from inside that namespace. browserAction imports action,
// so both names are listed.
export const ASYNC_RESULTS = {
  // toolkit/components/extensions/ExtensionActions.sys.mjs
  "action.getBadgeTextColor": "ColorArray",
  "action.isEnabled": "boolean",
  "browserAction.getBadgeTextColor": "ColorArray",
  "browserAction.isEnabled": "boolean",
  // toolkit/components/extensions/parent/ext-captivePortal.js
  "captivePortal.getState": '"unknown" | "not_captive" | "unlocked_portal" | "locked_portal"',
  "captivePortal.getLastChecked": "number",
  // toolkit/components/extensions/child/ext-contentScripts.js
  "contentScripts.register": "RegisteredContentScript",
  // toolkit/components/extensions/parent/ext-contextualIdentities.js
  "contextualIdentities.create": "ContextualIdentity",
  "contextualIdentities.get": "ContextualIdentity",
  "contextualIdentities.query": "ContextualIdentity[]",
  "contextualIdentities.remove": "ContextualIdentity",
  "contextualIdentities.update": "ContextualIdentity",
  // toolkit/components/extensions/parent/ext-dns.js
  "dns.resolve": "DNSRecord",
  // browser/components/extensions/parent/ext-find.js (mergeFindResults) and
  // toolkit/components/extensions/FindContent.sys.mjs (range and rect data)
  "find.find":
    "{ count: number; rangeData?: { framePos: number; text: string; startTextNodePos: number; startOffset: number; endTextNodePos: number; endOffset: number }[]; rectData?: { text: string; rectsAndTexts: { rectList: { top: number; left: number; bottom: number; right: number }[]; textList: string[] } }[] }",
  // toolkit/components/extensions/parent/ext-geckoProfiler.js
  "geckoProfiler.getProfile": "Record<string, unknown>",
  "geckoProfiler.getProfileAsArrayBuffer": "ArrayBuffer",
  "geckoProfiler.getProfileAsGzippedArrayBuffer": "ArrayBuffer",
  // devtools/shared/performance-new/symbolication.sys.mjs
  "geckoProfiler.getSymbols": "[addresses: Uint32Array, index: Uint32Array, buffer: Uint8Array]",
  // toolkit/components/extensions/parent/ext-networkStatus.js
  "networkStatus.getLinkInfo": "NetworkLinkInfo",
  // toolkit/components/extensions/ExtensionActions.sys.mjs
  "pageAction.isShown": "boolean",
  // toolkit/components/extensions/parent/ext-permissions.js
  "permissions.remove": "boolean",
  // browser/components/extensions/parent/ext-pkcs11.js
  "pkcs11.getModuleSlots":
    "{ name: string; token: { name: string; manufacturer: string; HWVersion: string; FWVersion: string; serial: string; isLoggedIn: boolean } | null }[]",
  "pkcs11.isModuleInstalled": "boolean",
  // browser/components/extensions/parent/ext-search.js
  "search.get": "SearchEngine[]",
  // browser/components/extensions/parent/ext-sessions.js: JSON.parse of a
  // value stored through setTabValue, whose schema type is any.
  "sessions.getTabValue": "any",
  "sessions.getWindowValue": "any",
  // browser/components/extensions/parent/ext-sidebarAction.js
  "sidebarAction.getPanel": "string",
  "sidebarAction.getTitle": "string",
  "sidebarAction.isOpen": "boolean",
  // toolkit/components/extensions/parent/ext-tabs-base.js (data URL)
  "tabs.captureTab": "string",
  // browser/components/extensions/parent/ext-tabs.js (ids of the hidden tabs)
  "tabs.hide": "number[]",
  // toolkit/components/extensions/parent/ext-telemetry.js
  "telemetry.canUpload": "boolean",
  // toolkit/components/extensions/parent/ext-theme.js: the normalized
  // theme, so absent optional keys are null.
  "theme.getCurrent": "browser.manifest.ThemeType",
  // toolkit/components/extensions/parent/ext-trial-ml.js
  "trial.ml.deleteCachedModels": "boolean",
  "trial.ml.runEngine": "unknown",
  // toolkit/components/extensions/ExtensionPreferencesManager.sys.mjs
  "types.Setting.clear": "boolean",
  "types.Setting.set": "boolean",
  // toolkit/components/extensions/webrequest/WebRequest.sys.mjs: undefined
  // once the channel is gone.
  "webRequest.getSecurityInfo": "SecurityInfo | undefined",
};

// Functions whose schema-optional callback payload is null, not undefined.
export const NULL_RESULTS = new Set([
  // toolkit/components/extensions/parent/ext-contextualIdentities.js
  "contextualIdentities.getSiteAssociation",
  // toolkit/components/extensions/parent/ext-cookies.js
  "cookies.get",
  "cookies.remove",
  "cookies.set",
  // toolkit/components/extensions/child/ext-backgroundPage.js
  "runtime.getBackgroundPage",
  // toolkit/components/extensions/parent/ext-webNavigation.js
  "webNavigation.getAllFrames",
  "webNavigation.getFrame",
]);

// Functions whose schema-optional callback payload is always supplied, so
// the payload type carries no `undefined`. A rejection replaces every
// path that would otherwise resolve nothing.
export const REQUIRED_RESULTS = new Set([
  // browser/components/extensions/parent/ext-tabs.js: create, update and
  // duplicate end in tabManager.convert(nativeTab), and
  // mobile/shared/components/extensions/ext-tabs.js does the same for create
  // and update. A tab the extension cannot access makes convert throw.
  "tabs.create",
  "tabs.duplicate",
  "tabs.update",
  // toolkit/components/extensions/parent/ext-tabs-base.js: queryContent
  // throws "Missing host permission for the tab" when no frame answers, so
  // the array always has at least one element.
  "tabs.executeScript",
  // browser/components/extensions/parent/ext-windows.js ends in
  // win.convert({ populate: true }).
  "windows.create",
  // toolkit/components/extensions/parent/ext-downloads.js returns the
  // canvas data URL, or img.decode() rejects.
  "downloads.getFileIcon",
  // toolkit/components/extensions/parent/ext-identity.js resolves with the
  // redirect URL, or rejects.
  "identity.launchWebAuthFlow",
]);

// Property types on schema types. A name the schema does not declare is
// added as a required property.
export const TYPE_OVERRIDES = {
  // toolkit/components/extensions/webrequest/WebRequestUpload.sys.mjs yields
  // { bytes: buffer } with a fresh ArrayBuffer per chunk. The schema types
  // the property as any.
  "webRequest.UploadData": {
    properties: { bytes: "ArrayBuffer" },
  },
  // toolkit/components/extensions/ExtensionChild.sys.mjs (Port.getAPI,
  // recvPortMessage, recvPortDisconnect): the message is whatever was
  // posted, listeners also receive the port, and error is null until a
  // disconnect carries one.
  "runtime.Port": {
    properties: {
      disconnect: "() => void",
      error: "Error | null",
      onDisconnect: "WebExtensionEvent<(port: Port) => void>",
      onMessage: "WebExtensionEvent<(message: any, port: Port) => void>",
      postMessage: "(message: any) => void",
    },
  },
  // toolkit/components/extensions/child/ext-scripting.js spreads `args`
  // into `func`; toolkit/components/extensions/ExtensionContent.sys.mjs
  // awaits the script result.
  "scripting.ScriptInjection": {
    typeParameters: "<Args extends unknown[] = unknown[], Result = unknown>",
    properties: {
      args: "Args",
      func: "(...args: Args) => Result",
    },
  },
  "scripting.InjectionResult": {
    typeParameters: "<Result = unknown>",
    properties: { result: "Result" },
  },
};

// Listener return types for events whose schema `returns` is only part of
// the story.
export const EVENT_LISTENER_RETURNS = {
  // toolkit/components/extensions/ExtensionChild.sys.mjs (MessageEvent.wrapResponse):
  // only `true` or a Promise keeps the channel open; anything else is dropped.
  "runtime.onMessage": "boolean | Promise<unknown> | void",
  "runtime.onMessageExternal": "boolean | Promise<unknown> | void",
  "runtime.onUserScriptMessage": "boolean | Promise<unknown> | void",
  // toolkit/components/extensions/webrequest/WebRequest.sys.mjs awaits a
  // thenable result from a blocking listener.
  "webRequest.onAuthRequired":
    "browser.webRequest.BlockingResponse | Promise<browser.webRequest.BlockingResponse> | void",
  "webRequest.onBeforeRequest":
    "browser.webRequest.BlockingResponse | Promise<browser.webRequest.BlockingResponse> | void",
  "webRequest.onBeforeSendHeaders":
    "browser.webRequest.BlockingResponse | Promise<browser.webRequest.BlockingResponse> | void",
  "webRequest.onHeadersReceived":
    "browser.webRequest.BlockingResponse | Promise<browser.webRequest.BlockingResponse> | void",
};

// Event parameter types the schema leaves as a bare object or function.
export const EVENT_PARAMETERS = {
  // toolkit/components/extensions/ProxyChannelFilter.sys.mjs emits a plain
  // object with these four keys, not an Error.
  "proxy.onError": {
    error: "{ message: string; fileName: string; lineNumber: number; stack: string }",
  },
  // toolkit/components/extensions/ExtensionChild.sys.mjs (MessageEvent.wrapResponse):
  // sendResponse takes one value.
  "runtime.onMessage": { sendResponse: "(response?: unknown) => void" },
  "runtime.onMessageExternal": { sendResponse: "(response?: unknown) => void" },
  "runtime.onUserScriptMessage": { sendResponse: "(response?: unknown) => void" },
};

// Event parameters the schema marks optional that Firefox always passes.
export const REQUIRED_EVENT_PARAMETERS = {
  // browser/components/extensions/parent/ext-commands.js calls
  // tabManager.convert(tabTracker.activeTab). With no active tab that throws
  // before fire.async runs (TabManager.canAccessTab reads
  // nativeTab.documentGlobal), so a listener never sees a missing tab.
  // toolkit/components/extensions/ExtensionShortcuts.sys.mjs registers keys
  // only in browser windows, so a key press implies a window to read it from.
  "commands.onCommand": ["tab"],
};
