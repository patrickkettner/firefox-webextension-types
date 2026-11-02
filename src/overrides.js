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
  Window: "Window",
  Date: "globalThis.Date",
  DirectoryEntry: "FileSystemDirectoryEntry",
  ImageData: "globalThis.ImageData",
  ArrayBuffer: "ArrayBuffer",
  Element: "Element",
  // Declared in dom/webidl/StreamFilter.webidl and loaded into the
  // webRequest namespace by WEBIDL_TYPES.
  StreamFilter: "browser.webRequest.StreamFilter",
};

// TypeScript names for schema `$ref` values that would not resolve by name.
// A $ref the schema never defines, or one written without the namespace of a
// nested namespace, gets this type instead of a guess.
export const REF_TYPES = {
  // toolkit/components/extensions/schemas/runtime.json refers to a type no
  // schema defines, from an unsupported property.
  PlatformNaclArch: "(string & {})",
  // browser/components/extensions/schemas/devtools_inspected_window.json
  // and devtools_panels.json name these types from the nested namespaces
  // devtools.inspectedWindow and devtools.panels.
  Resource: "browser.devtools.inspectedWindow.Resource",
  "devtools.inspectedWindow.Resource": "browser.devtools.inspectedWindow.Resource",
  ExtensionPanel: "browser.devtools.panels.ExtensionPanel",
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

// Async functions whose schema declares no callback payload and no `returns`
// and that ASYNC_RESULTS does not type. The emitter gives them Promise<void>.
// The value says what the implementation really resolves with:
//   none          nothing, or null where no data is meant
//   incidental    a value the API does not document, so void stays
//   indeterminate the value comes from a promise Firefox does not pin down
// A function that does resolve a documented value belongs in ASYNC_RESULTS.
// The audit fails when a schema function of this kind is in neither table.
export const ASYNC_NO_PAYLOAD = {
  "alarms.create": "none",
  "alarms.clearAll": "none",
  "action.setTitle": "none",
  "action.setIcon": "none",
  "action.setPopup": "none",
  "action.setBadgeText": "none",
  "action.setBadgeBackgroundColor": "none",
  "action.setBadgeTextColor": "none",
  "action.enable": "none",
  "action.disable": "none",
  "action.openPopup": "none",
  "browserAction.setTitle": "none",
  "browserAction.setIcon": "none",
  "browserAction.setPopup": "none",
  "browserAction.setBadgeText": "none",
  "browserAction.setBadgeBackgroundColor": "none",
  "browserAction.setBadgeTextColor": "none",
  "browserAction.enable": "none",
  "browserAction.disable": "none",
  "browserAction.openPopup": "none",
  "bookmarks.remove": "none",
  "bookmarks.removeTree": "none",
  "browsingData.remove": "incidental",
  "browsingData.removeCache": "incidental",
  "browsingData.removeCookies": "incidental",
  "browsingData.removeDownloads": "incidental",
  "browsingData.removeFormData": "incidental",
  "browsingData.removeHistory": "incidental",
  "browsingData.removeLocalStorage": "incidental",
  "browsingData.removePasswords": "incidental",
  "browsingData.removePluginData": "incidental",
  "clipboard.setImageData": "none",
  "commands.update": "none",
  "commands.reset": "none",
  "commands.openShortcutSettings": "none",
  "contentScripts.RegisteredContentScript.unregister": "none",
  "contextMenus.update": "none",
  "contextMenus.remove": "none",
  "contextMenus.removeAll": "none",
  "contextMenus.refresh": "none",
  "contextualIdentities.move": "none",
  "contextualIdentities.setSiteAssociation": "none",
  "contextualIdentities.removeSiteAssociation": "none",
  "declarativeNetRequest.updateDynamicRules": "none",
  "declarativeNetRequest.updateSessionRules": "none",
  "declarativeNetRequest.updateEnabledRulesets": "none",
  "declarativeNetRequest.updateStaticRules": "none",
  "devtools.panels.ExtensionSidebarPane.setExpression": "none",
  "devtools.panels.ExtensionSidebarPane.setObject": "none",
  "devtools.panels.ExtensionSidebarPane.setPage": "none",
  "downloads.pause": "indeterminate",
  "downloads.resume": "indeterminate",
  "downloads.cancel": "indeterminate",
  "downloads.open": "none",
  "downloads.removeFile": "none",
  "find.highlightResults": "none",
  "find.removeHighlighting": "none",
  "geckoProfiler.start": "none",
  "geckoProfiler.stop": "none",
  "geckoProfiler.pause": "none",
  "geckoProfiler.resume": "none",
  "geckoProfiler.dumpProfileToFile": "none",
  "history.addUrl": "none",
  "history.deleteUrl": "none",
  "history.deleteRange": "none",
  "history.deleteAll": "none",
  "management.uninstallSelf": "none",
  "management.setEnabled": "none",
  "menus.update": "none",
  "menus.remove": "none",
  "menus.removeAll": "none",
  "menus.refresh": "none",
  "pageAction.show": "none",
  "pageAction.hide": "none",
  "pageAction.setIcon": "none",
  "pageAction.setPopup": "none",
  "pageAction.openPopup": "none",
  "pkcs11.installModule": "none",
  "pkcs11.uninstallModule": "none",
  "runtime.openOptionsPage": "none",
  "runtime.setUninstallURL": "none",
  "scripting.insertCSS": "none",
  "scripting.removeCSS": "none",
  "scripting.registerContentScripts": "none",
  "scripting.unregisterContentScripts": "none",
  "scripting.updateContentScripts": "none",
  "search.search": "none",
  "search.query": "none",
  "sessions.forgetClosedTab": "none",
  "sessions.forgetClosedWindow": "none",
  "sessions.setTabValue": "none",
  "sessions.removeTabValue": "none",
  "sessions.setWindowValue": "none",
  "sessions.removeWindowValue": "none",
  "sidebarAction.setTitle": "none",
  "sidebarAction.setIcon": "none",
  "sidebarAction.setPanel": "none",
  "sidebarAction.open": "none",
  "sidebarAction.close": "none",
  "sidebarAction.toggle": "none",
  "storage.StorageArea.set": "none",
  "storage.StorageArea.remove": "none",
  "storage.StorageArea.clear": "none",
  "tabs.reload": "none",
  "tabs.warmup": "none",
  "tabs.remove": "none",
  "tabs.discard": "none",
  "tabs.toggleReaderMode": "none",
  "tabs.insertCSS": "none",
  "tabs.removeCSS": "none",
  "tabs.setZoom": "none",
  "tabs.setZoomSettings": "none",
  "tabs.printPreview": "none",
  "tabs.show": "none",
  "tabs.moveInSuccession": "none",
  "tabs.goForward": "none",
  "tabs.goBack": "none",
  "tabs.ungroup": "none",
  "telemetry.submitPing": "none",
  "telemetry.scalarAdd": "none",
  "telemetry.scalarSet": "none",
  "telemetry.scalarSetMaximum": "none",
  "telemetry.keyedScalarAdd": "none",
  "telemetry.keyedScalarSet": "none",
  "telemetry.keyedScalarSetMaximum": "none",
  "telemetry.recordEvent": "none",
  "telemetry.registerScalars": "none",
  "telemetry.registerEvents": "none",
  "telemetry.setEventRecordingEnabled": "none",
  "theme.update": "none",
  "theme.reset": "none",
  "trial.ml.createEngine": "none",
  // The manifest_version 3 form. The manifest_version 2 form in
  // toolkit/components/extensions/child/ext-userScripts.js resolves an
  // object with unregister(), and the generator drops that overload.
  "userScripts.register": "none",
  "userScripts.update": "none",
  "userScripts.unregister": "none",
  "userScripts.configureWorld": "none",
  "userScripts.resetWorldConfiguration": "none",
  "webRequest.handlerBehaviorChanged": "none",
  "windows.remove": "none",
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

// Functions whose schema-optional callback payload really is undefined on
// some path. Every function with an optional payload is in exactly one of
// NULL_RESULTS, REQUIRED_RESULTS and this set.
export const OPTIONAL_RESULT_UNDEFINED = new Set([
  // toolkit/components/extensions/parent/ext-alarms.js
  "alarms.get",
  // browser/components/extensions/parent/ext-tabs.js
  "tabs.getCurrent",
]);

// Namespace properties that read as null when nothing is pending. The schema
// marks them optional and the extension.lastError description says
// undefined, but BaseContext starts `_lastError` at null and resets it to null
// after every callback, and both getters return it unchanged.
export const NULL_PROPERTIES = new Set(["extension.lastError", "runtime.lastError"]);

// Functions whose schema-optional callback payload is always supplied, so
// the payload type carries no `undefined`. A rejection replaces every
// path that would otherwise resolve nothing.
export const REQUIRED_RESULTS = new Set([
  // browser/components/extensions/parent/ext-tabs.js: create, update and
  // duplicate end in tabManager.convert(...), and
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

// Events whose listener may also return a Promise. The synchronous part of
// the return type comes from the schema's `returns` and `optional`. The value
// is what the Promise resolves with, or null when it resolves with the
// schema's `returns` type.
export const EVENT_LISTENER_PROMISES = {
  // toolkit/components/extensions/ExtensionChild.sys.mjs (MessageEvent.wrapResponse):
  // only `true` or a Promise keeps the channel open, and a Promise resolves
  // with the response, whatever it is.
  "runtime.onMessage": "unknown",
  "runtime.onMessageExternal": "unknown",
  "runtime.onUserScriptMessage": "unknown",
  // toolkit/components/extensions/webrequest/WebRequest.sys.mjs
  // (applyChanges) awaits a thenable result from a blocking listener and
  // skips a resolved value that is not an object.
  "webRequest.onAuthRequired": null,
  "webRequest.onBeforeRequest": null,
  "webRequest.onBeforeSendHeaders": null,
  "webRequest.onHeadersReceived": null,
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

// Event parameters the schema marks optional that Firefox does leave out on
// some path. Every optional event parameter is here or in
// REQUIRED_EVENT_PARAMETERS.
export const OPTIONAL_EVENT_PARAMETERS = {
  "action.onClicked": ["info"],
  "browserAction.onClicked": ["info"],
  "pageAction.onClicked": ["info"],
  "contextMenus.onClicked": ["tab"],
  "menus.onClicked": ["tab"],
  "runtime.onMessage": ["message"],
  "runtime.onMessageExternal": ["message"],
  "runtime.onUserScriptMessage": ["message"],
  "webRequest.onAuthRequired": ["asyncCallback"],
};

// Event parameters the schema leaves as a bare object that Firefox fills
// with a shape the schema does not describe, so the type stays open.
export const OPEN_EVENT_PARAMETERS = {
  // toolkit/components/extensions/parent/ext-trial-ml.js forwards the
  // progress object of the ML engine.
  "trial.ml.onProgress": ["progressData"],
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

// Hand-copied constants from Firefox that src/ reads. The anchors in
// EVIDENCE.MANIFEST_VERSION_RANGE include the value, so a change in Firefox
// fails the audit.
export const MANIFEST_VERSION_RANGE = { min: 2, max: 3 };

// Firefox rules that src/ re-implements in code. Each key names the rule and
// its value says where the copy lives, so the audit can tell when the code
// that needed the evidence is gone.
export const HAND_COPIED_RULES = {
  "injection.envTypes": { code: "src/emitter.js", symbol: "const ENV_TYPES" },
  "injection.content_child needs content": { code: "src/emitter.js", symbol: "function shouldInject" },
  "injection.devtools_child needs devtools": { code: "src/emitter.js", symbol: "function shouldInject" },
  "injection.devtools_only stays in devtools": { code: "src/emitter.js", symbol: "function shouldInject" },
  "injection.content_only stays in content": { code: "src/emitter.js", symbol: "function shouldInject" },
  "callback.spreadArgs": { code: "src/overload-resolver.js", symbol: "cbArgs.length > 1" },
  "function.requireUserInput": { code: "src/emitter.js", symbol: "fn.requireUserInput" },
  "array.fixedLength": { code: "src/emitter.js", symbol: "typeInfo.minItems === typeInfo.maxItems" },
  "object.numericKeys": { code: "src/emitter.js", symbol: "^[1-9]\\\\d*$" },
};

// Where each hand-written entry above comes from. Every key of every table
// in this file needs an entry here, and `npm run verify` fails when a file is
// missing or an anchor no longer occurs. An anchor is the code that produces
// the value, not a comment about it. A key may list several { file, anchor }
// pairs when more than one place backs it. Paths are relative to the Firefox
// checkout and anchors match with runs of whitespace collapsed.
const TK = "toolkit/components/extensions/";
const BR = "browser/components/extensions/";
const at = (file, anchor) => ({ file, anchor });

const ACTIONS = TK + "ExtensionActions.sys.mjs";
const SCHEMAS = TK + "Schemas.sys.mjs";
const EXT_CHILD = TK + "ExtensionChild.sys.mjs";
const EXT_CONTENT = TK + "ExtensionContent.sys.mjs";
const TABS_BASE = TK + "parent/ext-tabs-base.js";
const WEB_REQUEST = TK + "webrequest/WebRequest.sys.mjs";
const STREAM_FILTER_IDL = "dom/webidl/StreamFilter.webidl";
const NORMALIZED_NULLS = [
  at(SCHEMAS, "default: schema.default === undefined ? null : schema.default,"),
  at(SCHEMAS, '} else if (optional !== "omit-key-if-missing") { result[prop] = propType.default; }'),
];
const WEB_REQUEST_PROMISE = [
  at(WEB_REQUEST, "if (isThenable(result)) { channel.suspend(markerText); try { result = await result;"),
  at(WEB_REQUEST, 'if (!result || typeof result !== "object") { continue; }'),
];
const ACTION_ENABLED = at(ACTIONS, 'return this.getPropertyFromDetails(details ?? {}, "enabled");');
const ACTION_TEXT_COLOR = at(ACTIONS, "return this.getTextColor(values);");
const PAGE_ACTION_SHOWN = at(ACTIONS, "isShown: ({ tabId }) => { let tab = this.getTab(tabId); return this.isShownForTab(tab); },");
const TAB_CONVERT = at(BR + "parent/ext-tabs.js", "return tabManager.convert(nativeTab);");

const ACTION_NONE = {
  setTitle: at(ACTIONS, 'setTitle: details => { this.setPropertyFromDetails(details, "title", details.title); },'),
  setIcon: at(ACTIONS, "this.normalizeIcon(details, extension, context) ); },"),
  setPopup: at(ACTIONS, 'this.setPropertyFromDetails(details, "popup", url); },'),
  setBadgeText: at(ACTIONS, 'this.setPropertyFromDetails(details, "badgeText", details.text); },'),
  setBadgeBackgroundColor: at(ACTIONS, "values.badgeDefaultColor = null; } },"),
  setBadgeTextColor: at(ACTIONS, 'this.setPropertyFromDetails(details, "badgeTextColor", color); },'),
  enable: [
    at(ACTIONS, "enable: (...args) => this.enable(...args),"),
    at(ACTIONS, 'this.setPropertyFromDetails({ tabId }, "enabled", true); }'),
  ],
  disable: [
    at(ACTIONS, "disable: (...args) => this.disable(...args),"),
    at(ACTIONS, 'this.setPropertyFromDetails({ tabId }, "enabled", false); }'),
  ],
  openPopup: [
    at(BR + "parent/ext-browserAction.js", "await this.openPopup(window, !isHandlingUserInput); } },"),
    at(BR + "parent/ext-browserAction.js", "toolbarButton.dispatchEvent(event); }"),
  ],
};
const MENUS = BR + "parent/ext-menus.js";
const MENUS_NONE = {
  update: [
    at(MENUS, "menuItem.setProps(updateProperties); ExtensionMenus.updateMenu(extension, id, updateProperties); },"),
    at(BR + "child/ext-menus.js", "onClickedProp.unsetListenerFromAnyContext(id); } // else onclick is not set so it should not be changed. }); },"),
  ],
  remove: at(MENUS, "menuItem.remove(); ExtensionMenus.deleteMenus(extension, menuIds); },"),
  removeAll: at(MENUS, "ExtensionMenus.deleteAllMenus(extension); },"),
  refresh: at(MENUS, "refresh() { gMenuBuilder.rebuildMenu(extension); },"),
};
const BROWSING_DATA = TK + "parent/ext-browsingData.js";
const BROWSING_DATA_ALL = at(BROWSING_DATA, "return Promise.all(removalPromises);");
const browsingData = (call) => [at(BROWSING_DATA, `return impl.doRemoval(options, ${call});`), BROWSING_DATA_ALL];
const DOWNLOADS = TK + "parent/ext-downloads.js";
const DOWNLOAD_CORE = "toolkit/components/downloads/DownloadCore.sys.mjs";
const SCRIPTING = TK + "parent/ext-scripting.js";
const PAGE_ACTION = BR + "parent/ext-pageAction.js";
const SIDEBAR = BR + "parent/ext-sidebarAction.js";
const SESSIONS = BR + "parent/ext-sessions.js";
const TABS = BR + "parent/ext-tabs.js";
const TELEMETRY = TK + "parent/ext-telemetry.js";
const GECKO_PROFILER = TK + "parent/ext-geckoProfiler.js";
const USER_SCRIPTS = TK + "parent/ext-userScripts.js";
const STORAGE_SYNC = TK + "ExtensionStorageSync.sys.mjs";
const CHILD_STORAGE = TK + "child/ext-storage.js";
const noOp = (name, bug) => at(TELEMETRY, `${name} { desktopCheck(); // No-op since bug ${bug}. },`);
const DEVTOOLS_PANELS = BR + "parent/ext-devtools-panels.js";
const DNR = TK + "ExtensionDNR.sys.mjs";
const SHORTCUTS = TK + "ExtensionShortcuts.sys.mjs";
const CONTEXTUAL = TK + "parent/ext-contextualIdentities.js";

const CLICK_INFO = [
  at(BR + "parent/ext-browserAction.js", 'this.buttonDelegate.emit("click", tab, clickInfo);'),
  at(ACTIONS, "triggerClickOrPopup(tab, clickInfo = undefined) {"),
];
const MENU_CLICK_TAB = at(BR + "parent/ext-menus.js", "let tab = nativeTab && extension.tabManager.convert(nativeTab);");
const MESSAGE_ARG = at(EXT_CHILD, "result = fire.raw(message, sender, sendResponse);");
const ASYNC_NO_PAYLOAD_EVIDENCE = {
  "alarms.create": at(TK + "parent/ext-alarms.js", "self.alarms.set(alarm.name, alarm); },"),
  "alarms.clearAll": at(TK + "parent/ext-alarms.js", "for (let alarm of self.alarms.values()) { alarm.clear(); } },"),
  "action.setTitle": ACTION_NONE.setTitle,
  "action.setIcon": ACTION_NONE.setIcon,
  "action.setPopup": ACTION_NONE.setPopup,
  "action.setBadgeText": ACTION_NONE.setBadgeText,
  "action.setBadgeBackgroundColor": ACTION_NONE.setBadgeBackgroundColor,
  "action.setBadgeTextColor": ACTION_NONE.setBadgeTextColor,
  "action.enable": ACTION_NONE.enable,
  "action.disable": ACTION_NONE.disable,
  "action.openPopup": ACTION_NONE.openPopup,
  "browserAction.setTitle": ACTION_NONE.setTitle,
  "browserAction.setIcon": ACTION_NONE.setIcon,
  "browserAction.setPopup": ACTION_NONE.setPopup,
  "browserAction.setBadgeText": ACTION_NONE.setBadgeText,
  "browserAction.setBadgeBackgroundColor": ACTION_NONE.setBadgeBackgroundColor,
  "browserAction.setBadgeTextColor": ACTION_NONE.setBadgeTextColor,
  "browserAction.enable": ACTION_NONE.enable,
  "browserAction.disable": ACTION_NONE.disable,
  "browserAction.openPopup": ACTION_NONE.openPopup,
  "bookmarks.remove": [
    at(BR + "parent/ext-bookmarks.js", ".remove(info, { preventRemovalOfNonEmptyFolders: true }) .catch(error => Promise.reject({ message: error.message }));"),
    at("toolkit/components/places/Bookmarks.sys.mjs", "await removeBookmarks(removeItems, options);"),
  ],
  "bookmarks.removeTree": [
    at(BR + "parent/ext-bookmarks.js", ".remove(info) .catch(error => Promise.reject({ message: error.message }));"),
    at("toolkit/components/places/Bookmarks.sys.mjs", "await removeBookmarks(removeItems, options);"),
  ],
  "browsingData.remove": browsingData("dataToRemove"),
  "browsingData.removeCache": browsingData("{ cache: true }"),
  "browsingData.removeCookies": browsingData("{ cookies: true }"),
  "browsingData.removeDownloads": browsingData("{ downloads: true }"),
  "browsingData.removeFormData": browsingData("{ formData: true }"),
  "browsingData.removeHistory": browsingData("{ history: true }"),
  "browsingData.removeLocalStorage": browsingData("{ localStorage: true }"),
  "browsingData.removePasswords": browsingData("{ passwords: true }"),
  "browsingData.removePluginData": browsingData("{ pluginData: true }"),
  "clipboard.setImageData": at(
    TK + "parent/ext-clipboard.js",
    "Services.clipboard.setData( transferable, null, Services.clipboard.kGlobalClipboard ); },"
  ),
  "commands.update": [
    at(BR + "parent/ext-commands.js", "update: args => this.extension.shortcuts.updateCommand(args),"),
    at(SHORTCUTS, "if (command.shortcut !== oldShortcut) { this.onShortcutChanged({ name, newShortcut: command.shortcut, oldShortcut, }); } }"),
  ],
  "commands.reset": [
    at(BR + "parent/ext-commands.js", "reset: name => this.extension.shortcuts.resetCommand(name),"),
    at(SHORTCUTS, "this.registerKeys(commands); } }"),
  ],
  "commands.openShortcutSettings": [
    at(BR + "parent/ext-commands.js", "openShortcutSettings: () => this.extension.shortcuts.openShortcutSettings(),"),
    at(SHORTCUTS, "await window.BrowserAddonUI.openAddonsMgr(viewId); }"),
  ],
  "contentScripts.RegisteredContentScript.unregister": [
    at(
      TK + "parent/ext-contentScripts.js",
      'await extension.broadcast("Extension:UnregisterContentScripts", { id: extension.id, scriptIds: [scriptId], }); },'
    ),
    at(TK + "child/ext-contentScripts.js", "unregister: () => { return context.wrapPromise(this.unregister()); },"),
  ],
  "contextMenus.update": MENUS_NONE.update,
  "contextMenus.remove": MENUS_NONE.remove,
  "contextMenus.removeAll": MENUS_NONE.removeAll,
  "contextMenus.refresh": MENUS_NONE.refresh,
  "contextualIdentities.move": at(CONTEXTUAL, "`Contextual identities failed to move: ${cookieStoreIds}` ); } },"),
  "contextualIdentities.setSiteAssociation": at(CONTEXTUAL, "ContextualIdentityService.setSiteAssociation(site, containerId); },"),
  "contextualIdentities.removeSiteAssociation": at(CONTEXTUAL, "ContextualIdentityService.removeSiteAssociation(details.site); },"),
  "declarativeNetRequest.updateDynamicRules": [
    at(TK + "parent/ext-declarativeNetRequest.js", "return ExtensionDNR.updateDynamicRules(extension, {"),
    at(DNR, "await lazy.ExtensionDNRStore.updateDynamicRules(extension, updateRuleOptions); }"),
  ],
  "declarativeNetRequest.updateSessionRules": at(
    TK + "parent/ext-declarativeNetRequest.js",
    "ruleManager.setSessionRules(validatedRules); },"
  ),
  "declarativeNetRequest.updateEnabledRulesets": [
    at(TK + "parent/ext-declarativeNetRequest.js", "return ExtensionDNR.updateEnabledStaticRulesets(extension, {"),
    at(DNR, "await lazy.ExtensionDNRStore.updateEnabledStaticRulesets( extension, updateRulesetOptions ); }"),
  ],
  "declarativeNetRequest.updateStaticRules": [
    at(TK + "parent/ext-declarativeNetRequest.js", "return ExtensionDNR.updateStaticRules(extension, {"),
    at(DNR, "await lazy.ExtensionDNRStore.updateStaticRules( extension, updateStaticRulesOptions ); }"),
  ],
  "devtools.panels.ExtensionSidebarPane.setExpression": [
    at(DEVTOOLS_PANELS, "return sidebar.setExpressionResult(evalResult, rootTitle); },"),
    at(DEVTOOLS_PANELS, "this._setLazySidebarInit(() => { this.extensionSidebar.setExpressionResult(expressionResult, rootTitle); }); } }"),
  ],
  "devtools.panels.ExtensionSidebarPane.setObject": [
    at(DEVTOOLS_PANELS, "return sidebar.setObject(jsonObject, rootTitle); },"),
    at(DEVTOOLS_PANELS, "this._setLazySidebarInit(() => this.extensionSidebar.setObject(object)); } }"),
  ],
  "devtools.panels.ExtensionSidebarPane.setPage": [
    at(DEVTOOLS_PANELS, "return sidebar.setPage(extensionPageURL); },"),
    at(DEVTOOLS_PANELS, "this._setLazySidebarInit(() => this.extensionSidebar.setExtensionPage(WEBEXT_PANELS_URL) ); } }"),
  ],
  "downloads.pause": [
    at(DOWNLOADS, "return item.download.cancel();"),
    at(DOWNLOAD_CORE, "this._promiseCanceled = new Promise(resolve => { this._currentAttempt.then(resolve, resolve); });"),
  ],
  "downloads.resume": [
    at(DOWNLOADS, "item.error = null; return item.download.start();"),
    at(DOWNLOAD_CORE, "return this._currentAttempt;"),
  ],
  "downloads.cancel": [
    at(DOWNLOADS, "return item.download.finalize(true);"),
    at(DOWNLOAD_CORE, "promise = this.cancel();"),
  ],
  "downloads.open": [
    at(DOWNLOADS, "return download.launch();"),
    at(
      "toolkit/components/downloads/DownloadIntegration.sys.mjs",
      "lazy.NetUtil.newURI(file), Services.scriptSecurityManager.getSystemPrincipal() ); },"
    ),
  ],
  "downloads.removeFile": at(DOWNLOADS, "inadvertent disclosure of potentially sensitive information. throw err; } },"),
  "find.highlightResults": [
    at(BR + "parent/ext-find.js", 'return runFindOperation(context, params, "HighlightResults");'),
    at(BR + "parent/ext-find.js", 'else if (responses.includes("Success")) { return; }'),
  ],
  "find.removeHighlighting": at(BR + "parent/ext-find.js", 'sendMessageToAllActors(tab.linkedBrowser, "ClearHighlighting", {}); },'),
  "geckoProfiler.start": at(GECKO_PROFILER, "[], 0, windowLength ); } },"),
  "geckoProfiler.stop": at(GECKO_PROFILER, "Services.profiler.StopProfiler(); },"),
  "geckoProfiler.pause": at(GECKO_PROFILER, "Services.profiler.Pause(); },"),
  "geckoProfiler.resume": at(GECKO_PROFILER, "Services.profiler.Resume(); },"),
  "geckoProfiler.dumpProfileToFile": at(GECKO_PROFILER, "throw new ExtensionError(`Dumping profile to ${filePath} failed.`); } },"),
  "history.addUrl": at(BR + "parent/ext-history.js", "return PlacesUtils.history.insert(pageInfo).then(() => undefined);"),
  "history.deleteUrl": at(BR + "parent/ext-history.js", "return PlacesUtils.history.remove(url).then(() => undefined);"),
  "history.deleteRange": at(BR + "parent/ext-history.js", ".removeVisitsByFilter(newFilter) .then(() => undefined);"),
  "history.deleteAll": [
    at(BR + "parent/ext-history.js", "return PlacesUtils.history.clear();"),
    at("toolkit/components/places/History.sys.mjs", "var clear = async function (db) {"),
  ],
  "management.uninstallSelf": at(TK + "parent/ext-management.js", "addon.uninstall(); },"),
  "management.setEnabled": at(TK + "parent/ext-management.js", "await addon.disable(); } },"),
  "menus.update": MENUS_NONE.update,
  "menus.remove": MENUS_NONE.remove,
  "menus.removeAll": MENUS_NONE.removeAll,
  "menus.refresh": MENUS_NONE.refresh,
  "pageAction.show": [at(ACTIONS, "show: (...args) => this.enable(...args),"), ACTION_NONE.enable[1]],
  "pageAction.hide": [at(ACTIONS, "hide: (...args) => this.disable(...args),"), ACTION_NONE.disable[1]],
  "pageAction.setIcon": ACTION_NONE.setIcon,
  "pageAction.setPopup": ACTION_NONE.setPopup,
  "pageAction.openPopup": [
    at(PAGE_ACTION, "action.throwIfOpenPopupIsBlockedByAnyAction(window); this.triggerAction(window); },"),
    at(PAGE_ACTION, "triggerAction(window) { this.handleClick(window, { button: 0, modifiers: [] }); }"),
  ],
  "pkcs11.installModule": at(BR + "parent/ext-pkcs11.js", "await pkcs11db.addModule( manifest.description, manifest.path, flags, 0 ); },"),
  "pkcs11.uninstallModule": at(BR + "parent/ext-pkcs11.js", "await pkcs11db.deleteModule(module.name); },"),
  "runtime.openOptionsPage": at(TK + "parent/ext-runtime.js", "return openOptionsPage(extension).then(() => {});"),
  "runtime.setUninstallURL": at(TK + "parent/ext-runtime.js", "extension.uninstallURL = url; return Promise.resolve(); },"),
  "scripting.insertCSS": at(SCRIPTING, 'return execute(context, details, "css", "insertCSS").then(() => {});'),
  "scripting.removeCSS": at(SCRIPTING, 'return execute(context, details, "css", "removeCSS").then(() => {});'),
  "scripting.registerContentScripts": at(
    SCRIPTING,
    'await extension.broadcast("Extension:RegisterContentScripts", { id: extension.id, scripts: Array.from(scriptsToRegister.values()), }); },'
  ),
  "scripting.unregisterContentScripts": at(
    SCRIPTING,
    'await extension.broadcast("Extension:UnregisterContentScripts", { id: extension.id, scriptIds, }); },'
  ),
  "scripting.updateContentScripts": at(
    SCRIPTING,
    'await extension.broadcast("Extension:UpdateContentScripts", { id: extension.id, scripts: Array.from(scriptsToUpdate.values()), }); },'
  ),
  "search.search": at(BR + "parent/ext-search.js", 'sapSource: "webextension", }); },'),
  "search.query": at(BR + "parent/ext-search.js", 'await SearchUIUtils.loadSearch({ window: windowTracker.topWindow, searchText: queryProperties.text,'),
  "sessions.forgetClosedTab": at(SESSIONS, "SessionStore.forgetClosedTabById(closedId, window); },"),
  "sessions.forgetClosedWindow": at(SESSIONS, "SessionStore.forgetClosedWindow(closedWindowIndex); },"),
  "sessions.setTabValue": at(SESSIONS, "SessionStore.setCustomTabValue( tab, encodedKey, JSON.stringify(value) ); },"),
  "sessions.removeTabValue": at(SESSIONS, "SessionStore.deleteCustomTabValue(tab, encodedKey); },"),
  "sessions.setWindowValue": at(SESSIONS, "SessionStore.setCustomWindowValue( win, encodedKey, JSON.stringify(value) ); },"),
  "sessions.removeWindowValue": at(SESSIONS, "SessionStore.deleteCustomWindowValue(win, encodedKey); },"),
  "sidebarAction.setTitle": at(SIDEBAR, 'async setTitle(details) { sidebarAction.setPropertyFromDetails(details, "title", details.title); },'),
  "sidebarAction.setIcon": at(SIDEBAR, 'sidebarAction.setPropertyFromDetails(details, "icon", icon); },'),
  "sidebarAction.setPanel": at(SIDEBAR, 'sidebarAction.setPropertyFromDetails(details, "panel", url); },'),
  "sidebarAction.open": [at(SIDEBAR, "sidebarAction.open(window); } },"), at(SIDEBAR, "SidebarController.show(this.id); } }")],
  "sidebarAction.close": [at(SIDEBAR, "sidebarAction.close(window); } },"), at(SIDEBAR, "window.SidebarController.hide(); } }")],
  "sidebarAction.toggle": [at(SIDEBAR, "sidebarAction.toggle(window); } },"), at(SIDEBAR, "} else { SidebarController.hide(); } }")],
  "storage.StorageArea.set": [
    at(
      STORAGE_SYNC,
      "let changes = this._parseRustStorageValueChangeList( await rustStore.set(extId, ...sargs) ); this.notifyListeners(extId, changes); return null;"
    ),
    at(CHILD_STORAGE, "const changes = await db.set(items, { serialize, }); if (changes) { fireOnChanged(changes); } } ); },"),
    at(TK + "parent/ext-storage.js", "extensionStorageSession.set(extension, items); },"),
  ],
  "storage.StorageArea.remove": [
    at(
      STORAGE_SYNC,
      "let changes = this._parseRustStorageValueChangeList( await rustStore.remove(extId, ...sargs) ); this.notifyListeners(extId, changes); return null;"
    ),
    at(CHILD_STORAGE, "const changes = await db.remove(keys); if (changes) { fireOnChanged(changes); } },"),
    at(TK + "parent/ext-storage.js", "extensionStorageSession.remove(extension, keys); },"),
  ],
  "storage.StorageArea.clear": [
    at(
      STORAGE_SYNC,
      "let changes = this._parseRustStorageValueChangeList( await rustStore.clear(extId) ); this.notifyListeners(extId, changes); return null;"
    ),
    at(CHILD_STORAGE, "const changes = await db.clear(context.extension); if (changes) { fireOnChanged(changes); } },"),
    at(TK + "parent/ext-storage.js", "extensionStorageSession.clear(extension); },"),
  ],
  "tabs.reload": at(TABS, "nativeTab.linkedBrowser.reloadWithFlags(flags); },"),
  "tabs.warmup": at(TABS, "tabbrowser.warmupTab(nativeTab); },"),
  "tabs.remove": at(TABS, "suppressWarnAboutClosingWindow: true, }); } },"),
  "tabs.discard": at(TABS, "renderDiscarded: true, skipOnClose: false, }); } },"),
  "tabs.toggleReaderMode": at(TABS, '"Reader:ToggleReaderMode", {}, "AboutReader" ); },'),
  "tabs.insertCSS": [
    at(TABS, "return tab.insertCSS(context, details); },"),
    at(TABS_BASE, 'return this._execute(context, details, "css", "insertCSS").then(() => {});'),
  ],
  "tabs.removeCSS": [
    at(TABS, "return tab.removeCSS(context, details); },"),
    at(TABS_BASE, 'return this._execute(context, details, "css", "removeCSS").then(() => {});'),
  ],
  "tabs.setZoom": at(TABS, "return Promise.resolve(); },"),
  "tabs.setZoomSettings": at(TABS, "`Unsupported zoom settings: ${JSON.stringify(settings)}` ); } },"),
  "tabs.printPreview": at(TABS, "printPreview() { return Promise.resolve(this.print()); },"),
  "tabs.show": at(TABS, "tab.documentGlobal.gBrowser.showTab(tab); } } },"),
  "tabs.moveInSuccession": at(TABS, "referenceWindow.gBrowser.setSuccessor(previousTab, lastSuccessor); } },"),
  "tabs.goForward": at(TABS, "nativeTab.linkedBrowser.goForward(false); },"),
  "tabs.goBack": at(TABS, "nativeTab.linkedBrowser.goBack(false); },"),
  "tabs.ungroup": at(TABS, "group.documentGlobal.gBrowser.moveTabsAfter(tabs, group); } } },"),
  "telemetry.submitPing": at(TELEMETRY, "TelemetryController.submitExternalPing(type, payload, options); } catch (ex) {"),
  "telemetry.scalarAdd": noOp("scalarAdd(_name, _value)", "1930196 (Fx134)"),
  "telemetry.scalarSet": noOp("scalarSet(_name, _value)", "1930196 (Fx134)"),
  "telemetry.scalarSetMaximum": noOp("scalarSetMaximum(_name, _value)", "1930196 (Fx134)"),
  "telemetry.keyedScalarAdd": noOp("keyedScalarAdd(_name, _key, _value)", "1930196 (Fx134)"),
  "telemetry.keyedScalarSet": noOp("keyedScalarSet(_name, _key, _value)", "1930196 (Fx134)"),
  "telemetry.keyedScalarSetMaximum": noOp("keyedScalarSetMaximum(_name, _key, _value)", "1930196 (Fx134)"),
  "telemetry.recordEvent": noOp("recordEvent(_category, _method, _object, _value, _extra)", "1894533 (Fx132)"),
  "telemetry.registerScalars": noOp("registerScalars(_category, _data)", "1930196 (Fx134)"),
  "telemetry.registerEvents": noOp("registerEvents(_category, _data)", "1894533 (Fx132)"),
  "telemetry.setEventRecordingEnabled": noOp("setEventRecordingEnabled(_category, _enabled)", "1920562 (Fx133)"),
  "theme.update": at(TK + "parent/ext-theme.js", "experiment: this.extension.manifest.theme_experiment, }); },"),
  "theme.reset": at(TK + "parent/ext-theme.js", "if (defaultTheme.extension === extension) { Theme.unload(); } },"),
  "trial.ml.createEngine": at(
    TK + "parent/ext-trial-ml.js",
    "await this.#createEngine(this.#pipelineOptions); } catch (error) { throw new ExtensionError(error.message); } },"
  ),
  "userScripts.register": at(USER_SCRIPTS, "await usm.registerNewScripts(scripts); });"),
  "userScripts.update": at(USER_SCRIPTS, "await usm.updateScripts(scripts); });"),
  "userScripts.unregister": at(USER_SCRIPTS, "await usm.unregisterScripts(ids); });"),
  "userScripts.configureWorld": at(USER_SCRIPTS, "await usm.configureWorld(properties); });"),
  "userScripts.resetWorldConfiguration": at(USER_SCRIPTS, "await usm.resetWorldConfiguration(worldId); });"),
  "webRequest.handlerBehaviorChanged": at(TK + "parent/ext-webRequest.js", 'ChromeUtils.clearResourceCache({ target: "content" }); },'),
  "windows.remove": at(BR + "parent/ext-windows.js", 'windowTracker.addListener("domwindowclosed", listener); }); },'),
};

const LAST_ERROR_VALUE = [
  at(TK + "ExtensionCommon.sys.mjs", "get lastError() { this.checkedLastError = true; return this._lastError; }"),
  at(TK + "ExtensionCommon.sys.mjs", "this._lastError = null;"),
  at(TK + "ExtensionCommon.sys.mjs", "} finally { if (!this.checkedLastError) {"),
];

export const EVIDENCE = {
  EXCLUDED_NAMESPACES: {
    test: at(TK + "child/ext-test.js", "if (!Cu.isInAutomation && !isXpcshell) { return { test: {} };"),
  },
  PLATFORM_TYPES: {
    Window: at(TK + "schemas/runtime.json", '"isInstanceOf": "Window"'),
    global: at(BR + "child/ext-devtools-panels.js", 'this.emit("shown", this.panelContext.contentWindow);'),
    Date: at(TK + "schemas/extension_types.json", '"isInstanceOf": "Date"'),
    ArrayBuffer: at(TK + "schemas/clipboard.json", '"isInstanceOf": "ArrayBuffer"'),
    Element: [
      at(BR + "schemas/menus_child.json", '"isInstanceOf": "Element"'),
      at(SCHEMAS, '(this.isInstanceOf !== "Element" || value.nodeType !== 1)'),
    ],
    DirectoryEntry: at(TK + "schemas/runtime.json", '"isInstanceOf": "DirectoryEntry"'),
    ImageData: at(TK + "schemas/browser_action.json", '"isInstanceOf": "ImageData"'),
    StreamFilter: at(TK + "schemas/web_request.json", '"isInstanceOf": "StreamFilter"'),
  },
  REF_TYPES: {
    PlatformNaclArch: at(TK + "schemas/runtime.json", '"$ref": "PlatformNaclArch"'),
    Resource: at(BR + "schemas/devtools_inspected_window.json", '"$ref": "Resource"'),
    "devtools.inspectedWindow.Resource": at(BR + "schemas/devtools_panels.json", '"$ref": "devtools.inspectedWindow.Resource"'),
    ExtensionPanel: at(BR + "schemas/devtools_panels.json", '"$ref": "ExtensionPanel"'),
  },
  WEBIDL_TYPES: {
    webRequest: [
      at(STREAM_FILTER_IDL, "interface StreamFilter : EventTarget"),
      at("dom/webidl/StreamFilterDataEvent.webidl", "interface StreamFilterDataEvent : Event"),
    ],
  },
  WEBIDL_EVENT_HANDLERS: {
    "StreamFilter.ondata": [
      at(STREAM_FILTER_IDL, "attribute EventHandler ondata;"),
      at(TK + "webrequest/StreamFilter.cpp", 'StreamFilterDataEvent::Constructor(this, u"data"_ns, init);'),
    ],
    "StreamFilter.onstart": [
      at(STREAM_FILTER_IDL, "attribute EventHandler onstart;"),
      at(TK + "webrequest/StreamFilterChild.cpp", 'mStreamFilter->FireEvent(u"start"_ns);'),
    ],
    "StreamFilter.onstop": [
      at(STREAM_FILTER_IDL, "attribute EventHandler onstop;"),
      at(TK + "webrequest/StreamFilterChild.cpp", 'mStreamFilter->FireEvent(u"stop"_ns);'),
    ],
    "StreamFilter.onerror": [
      at(STREAM_FILTER_IDL, "attribute EventHandler onerror;"),
      at(TK + "webrequest/StreamFilter.cpp", 'FireEvent(u"error"_ns);'),
    ],
  },
  FUNCTION_OVERRIDES: {
    "runtime.getManifest": [
      at(TK + "child/ext-runtime.js", "return Cu.cloneInto(extension.manifest, context.cloneScope);"),
      at(TK + "Extension.sys.mjs", "manifest = normalized.value;"),
      ...NORMALIZED_NULLS,
    ],
    "scripting.executeScript": [
      at(TK + "child/ext-scripting.js", "parentDetails.func = `(${func.toString()})(${serializedArgs});`;"),
      at(EXT_CONTENT, "const result = await promise; return { frameId, documentId, result };"),
    ],
  },
  ASYNC_RESULTS: {
    "action.getBadgeTextColor": ACTION_TEXT_COLOR,
    "action.isEnabled": ACTION_ENABLED,
    "browserAction.getBadgeTextColor": ACTION_TEXT_COLOR,
    "browserAction.isEnabled": ACTION_ENABLED,
    "captivePortal.getState": [
      at(TK + "parent/ext-captivePortal.js", "return self.nameForCPSState(gCPS.state);"),
      at(TK + "parent/ext-captivePortal.js", 'case gCPS.LOCKED_PORTAL: return "locked_portal";'),
    ],
    "captivePortal.getLastChecked": at(TK + "parent/ext-captivePortal.js", "return gCPS.lastChecked;"),
    "contentScripts.register": at(
      TK + "child/ext-contentScripts.js",
      "return Cu.cloneInto(registeredScript.api(), context.cloneScope, {"
    ),
    "contextualIdentities.create": at(
      TK + "parent/ext-contextualIdentities.js",
      "resolveContainerColor(details.color) ); return convertIdentity(identity);"
    ),
    "contextualIdentities.get": at(
      TK + "parent/ext-contextualIdentities.js",
      "getPublicIdentityFromId(containerId); return convertIdentity(identity);"
    ),
    "contextualIdentities.query": at(TK + "parent/ext-contextualIdentities.js", "return identities;"),
    "contextualIdentities.remove": at(TK + "parent/ext-contextualIdentities.js", "return convertedIdentity;"),
    "contextualIdentities.update": at(
      TK + "parent/ext-contextualIdentities.js",
      "`Contextual identity failed to update: ${cookieStoreId}` ); } return convertIdentity(identity);"
    ),
    "dns.resolve": at(TK + "parent/ext-dns.js", "return resolve(response);"),
    "find.find": [
      at(BR + "parent/ext-find.js", "return mergeFindResults(params, results);"),
      at(TK + "FindContent.sys.mjs", "data.startTextNodePos = nodeCountWin;"),
      at(TK + "FindContent.sys.mjs", "rectData.push({ text: range.toString(), rectsAndTexts });"),
      at("toolkit/modules/Geometry.sys.mjs", "this.right = x + w; this.bottom = y + h;"),
    ],
    "geckoProfiler.getProfile": at(TK + "parent/ext-geckoProfiler.js", "return Services.profiler.getProfileDataAsync();"),
    "geckoProfiler.getProfileAsArrayBuffer": at(
      TK + "parent/ext-geckoProfiler.js",
      "return Services.profiler.getProfileDataAsArrayBuffer();"
    ),
    "geckoProfiler.getProfileAsGzippedArrayBuffer": at(
      TK + "parent/ext-geckoProfiler.js",
      "return Services.profiler.getProfileDataAsGzippedArrayBuffer();"
    ),
    "geckoProfiler.getSymbols": [
      at(TK + "parent/ext-geckoProfiler.js", "return symbolicationService.getSymbolTable(debugName, breakpadId);"),
      at("devtools/shared/performance-new/symbolication.sys.mjs", "@returns {Promise<SymbolTableAsTuple>}"),
      at(
        "devtools/client/performance-new/@types/perf.d.ts",
        "export type SymbolTableAsTuple = [Uint32Array, Uint32Array, Uint8Array];"
      ),
    ],
    "networkStatus.getLinkInfo": at(
      TK + "parent/ext-networkStatus.js",
      "return { id: gNetworkLinkService.networkID || undefined, status: getLinkStatus(), type: getLinkType(), };"
    ),
    "pageAction.isShown": PAGE_ACTION_SHOWN,
    "permissions.remove": at(
      TK + "parent/ext-permissions.js",
      "await ExtensionPermissions.remove( extension.id, permissions, extension ); return true;"
    ),
    "pkcs11.getModuleSlots": at(
      BR + "parent/ext-pkcs11.js",
      "slotobj.token = { name: token.tokenName, manufacturer: token.tokenManID, HWVersion: token.tokenHWVersion, FWVersion: token.tokenFWVersion, serial: token.tokenSerialNumber, isLoggedIn: token.isLoggedIn, };"
    ),
    "pkcs11.isModuleInstalled": at(BR + "parent/ext-pkcs11.js", "return (await findModuleByPath(manifest.path)) !== null;"),
    "search.get": at(BR + "parent/ext-search.js", "return Promise.all( visibleEngines.map(async engine => {"),
    "sessions.getTabValue": at(
      BR + "parent/ext-sessions.js",
      "let value = SessionStore.getCustomTabValue(tab, encodedKey); if (value) { return JSON.parse(value); }"
    ),
    "sessions.getWindowValue": at(
      BR + "parent/ext-sessions.js",
      "let value = SessionStore.getCustomWindowValue(win, encodedKey); if (value) { return JSON.parse(value); }"
    ),
    "sidebarAction.getPanel": at(
      BR + "parent/ext-sidebarAction.js",
      'return sidebarAction.getPropertyFromDetails(details, "panel");'
    ),
    "sidebarAction.getTitle": at(
      BR + "parent/ext-sidebarAction.js",
      'return sidebarAction.getPropertyFromDetails(details, "title");'
    ),
    "sidebarAction.isOpen": at(
      BR + "parent/ext-sidebarAction.js",
      "return SidebarController.isOpen && this.id == SidebarController.currentID;"
    ),
    "tabs.captureTab": [
      at(BR + "parent/ext-tabs.js", "return tab.capture(context, zoom, options);"),
      at(TABS_BASE, "reader.readAsDataURL(blob);"),
    ],
    "tabs.hide": at(BR + "parent/ext-tabs.js", "hidden.push(tabTracker.getId(tab)); } } }"),
    "telemetry.canUpload": at(
      TK + "parent/ext-telemetry.js",
      '"canUpload" in TelemetryController ? TelemetryController.canUpload() : Services.prefs.getBoolPref('
    ),
    "theme.getCurrent": [
      at(TK + "parent/ext-theme.js", "return Promise.resolve(windowOverrides.get(browserWindow).details);"),
      at(TK + "parent/ext-theme.js", "details: manifest.theme,"),
      ...NORMALIZED_NULLS,
    ],
    "trial.ml.deleteCachedModels": at(
      TK + "parent/ext-trial-ml.js",
      'deletedBy: "webextensions-api", }); return true;'
    ),
    "trial.ml.runEngine": at(TK + "parent/ext-trial-ml.js", "return this.#runEngine(request);"),
    "types.Setting.clear": at(
      TK + "ExtensionPreferencesManager.sys.mjs",
      "return ExtensionPreferencesManager.removeSetting(extensionId, name);"
    ),
    "types.Setting.set": at(
      TK + "ExtensionPreferencesManager.sys.mjs",
      "return ExtensionPreferencesManager.setSetting( extensionId, name, details.value );"
    ),
    "webRequest.getSecurityInfo": at(
      WEB_REQUEST,
      "if (channel) { return lazy.SecurityInfo.getSecurityInfo( channel.channel, details.options ); }"
    ),
  },
  NULL_PROPERTIES: {
    "extension.lastError": [at(TK + "child/ext-extension.js", "get lastError() { return context.lastError; }"), ...LAST_ERROR_VALUE],
    "runtime.lastError": [at(TK + "child/ext-runtime.js", "get lastError() { return context.lastError; }"), ...LAST_ERROR_VALUE],
  },
  OPTIONAL_RESULT_UNDEFINED: {
    "alarms.get": at(
      TK + "parent/ext-alarms.js",
      "return Promise.resolve(self.alarms.get(name).data); } return Promise.resolve();"
    ),
    "tabs.getCurrent": at(
      BR + "parent/ext-tabs.js",
      "tabData = tabManager.get(context.tabId).convert(); } return Promise.resolve(tabData);"
    ),
  },
  OPTIONAL_EVENT_PARAMETERS: {
    "action.onClicked": CLICK_INFO,
    "browserAction.onClicked": CLICK_INFO,
    "pageAction.onClicked": [
      at(BR + "parent/ext-pageAction.js", 'this.buttonDelegate.emit("click", tab, clickInfo);'),
      at(ACTIONS, "triggerClickOrPopup(tab, clickInfo = undefined) {"),
    ],
    "contextMenus.onClicked": MENU_CLICK_TAB,
    "menus.onClicked": MENU_CLICK_TAB,
    "runtime.onMessage": MESSAGE_ARG,
    "runtime.onMessageExternal": MESSAGE_ARG,
    "runtime.onUserScriptMessage": MESSAGE_ARG,
    "webRequest.onAuthRequired": at(TK + "child/ext-webRequest.js", "fire.raw(details, asyncCallback);"),
  },
  OPEN_EVENT_PARAMETERS: {
    "trial.ml.onProgress": at(TK + "parent/ext-trial-ml.js", "extension.emit(ENGINE_EVENT, progressData);"),
  },
  NULL_RESULTS: {
    "contextualIdentities.getSiteAssociation": at(
      TK + "parent/ext-contextualIdentities.js",
      "getSiteAssociation(site); if (!containerId) { return null; }"
    ),
    "cookies.get": at(TK + "parent/ext-cookies.js", "return Promise.resolve(null);"),
    "cookies.remove": at(TK + "parent/ext-cookies.js", "return Promise.resolve(null); },"),
    "cookies.set": at(TK + "parent/ext-cookies.js", "return self.cookies.get(details);"),
    "runtime.getBackgroundPage": at(
      TK + "child/ext-backgroundPage.js",
      "return view.contentWindow; } } return null; }"
    ),
    "webNavigation.getAllFrames": at(TK + "parent/ext-webNavigation.js", "if (tab.discarded) { return null; }"),
    "webNavigation.getFrame": at(
      TK + "parent/ext-webNavigation.js",
      "// Invalid ID, no longer existing (e.g. discarded), etc. return null;"
    ),
  },
  REQUIRED_RESULTS: {
    "tabs.create": [
      at(BR + "parent/ext-tabs.js", "return tabManager.convert(nativeTab, currentTabSize);"),
      at("mobile/shared/components/extensions/ext-tabs.js", "return tabManager.convert(nativeTab);"),
      at(TABS_BASE, "return this.getWrapper(nativeTab).convert(fallbackTabSize);"),
    ],
    "tabs.duplicate": [
      at(BR + "parent/ext-tabs.js", "() => resolve(tabManager.convert(newTab)),"),
      at(TABS_BASE, "return this.getWrapper(nativeTab).convert(fallbackTabSize);"),
    ],
    "tabs.update": [
      TAB_CONVERT,
      at("mobile/shared/components/extensions/ext-tabs.js", "return tabManager.convert(nativeTab);"),
      at(TABS_BASE, "return this.getWrapper(nativeTab).convert(fallbackTabSize);"),
    ],
    "tabs.executeScript": at(TABS_BASE, 'let errorMessage = "Missing host permission for the tab";'),
    "windows.create": at(BR + "parent/ext-windows.js", "return win.convert({ populate: true });"),
    "downloads.getFileIcon": at(TK + "parent/ext-downloads.js", 'let dataURL = canvas.toDataURL("image/png");'),
    "identity.launchWebAuthFlow": at(
      TK + "parent/ext-identity.js",
      "if (responseURL.startsWith(redirectURI)) { resolve(responseURL);"
    ),
  },
  TYPE_OVERRIDES: {
    "webRequest.UploadData": at(TK + "webrequest/WebRequestUpload.sys.mjs", "let chunk = { bytes: buffer };"),
    "runtime.Port": [
      at(EXT_CHILD, "error: null, onMessage: this.onMessage.api(), onDisconnect: this.onDisconnect.api(), postMessage: this.sendPortMessage.bind(this), disconnect: () => this.conduit.close(),"),
      at(EXT_CHILD, "this.onMessage.emit(holder.deserialize(this.api), this.api);"),
      at(EXT_CHILD, "this.api.error = error && this.context.normalizeError(error);"),
    ],
    "scripting.ScriptInjection": at(
      TK + "child/ext-scripting.js",
      "parentDetails.func = `(${func.toString()})(${serializedArgs});`;"
    ),
    "scripting.InjectionResult": at(EXT_CONTENT, "const result = await promise; return { frameId, documentId, result };"),
  },
  EVENT_LISTENER_PROMISES: {
    "runtime.onMessage": [
      at(EXT_CHILD, 'this.onMessage = new MessageEvent(context, "runtime.onMessage");'),
      at(EXT_CHILD, "return StrongPromise.wrap(result, fire.location); } else if (result === true) {"),
    ],
    "runtime.onMessageExternal": [
      at(EXT_CHILD, 'this.onMessageEx = new MessageEvent(context, "runtime.onMessageExternal");'),
      at(EXT_CHILD, "return StrongPromise.wrap(result, fire.location); } else if (result === true) {"),
    ],
    "runtime.onUserScriptMessage": [
      at(EXT_CHILD, 'new MessageEvent(this.context, "runtime.onUserScriptMessage")'),
      at(EXT_CHILD, "return StrongPromise.wrap(result, fire.location); } else if (result === true) {"),
    ],
    "webRequest.onAuthRequired": WEB_REQUEST_PROMISE,
    "webRequest.onBeforeRequest": WEB_REQUEST_PROMISE,
    "webRequest.onBeforeSendHeaders": WEB_REQUEST_PROMISE,
    "webRequest.onHeadersReceived": WEB_REQUEST_PROMISE,
  },
  EVENT_PARAMETERS: {
    "proxy.onError": at(
      TK + "ProxyChannelFilter.sys.mjs",
      'this.extension.emit("proxy-error", { message: error.message, fileName: error.fileName, lineNumber: error.lineNumber, stack: error.stack, });'
    ),
    "runtime.onMessage": at(EXT_CHILD, "sendResponse = Cu.exportFunction(value => {"),
    "runtime.onMessageExternal": at(EXT_CHILD, "sendResponse = Cu.exportFunction(value => {"),
    "runtime.onUserScriptMessage": at(EXT_CHILD, "sendResponse = Cu.exportFunction(value => {"),
  },
  REQUIRED_EVENT_PARAMETERS: {
    "commands.onCommand": [
      at(BR + "parent/ext-commands.js", "fire.async(commandName, tabManager.convert(nativeTab));"),
      at(BR + "parent/ext-browser.js", "this.extension.canAccessWindow(nativeTab.documentGlobal)"),
      at(TK + "ExtensionShortcuts.sys.mjs", "for (let window of lazy.global.windowTracker.browserWindows()) { this.registerKeysToDocument(window, commands);"),
    ],
  },
  ASYNC_NO_PAYLOAD: ASYNC_NO_PAYLOAD_EVIDENCE,
  HAND_COPIED_RULES: {
    "injection.envTypes": [
      at(EXT_CHILD, 'this.context.envType === "content_child" &&'),
      at(EXT_CHILD, 'this.context.envType === "devtools_child" &&'),
      at(TK + "ExtensionPageChild.sys.mjs", 'Object.assign(params, { envType: "addon_child" })'),
    ],
    "injection.content_child needs content": at(
      EXT_CHILD,
      'this.context.envType === "content_child" && !allowedContexts.includes("content")'
    ),
    "injection.devtools_child needs devtools": at(
      EXT_CHILD,
      'this.context.envType === "devtools_child" && !allowedContexts.includes("devtools")'
    ),
    "injection.devtools_only stays in devtools": at(
      EXT_CHILD,
      'this.context.envType !== "devtools_child" && allowedContexts.includes("devtools_only")'
    ),
    "injection.content_only stays in content": at(
      EXT_CHILD,
      'this.context.envType !== "content_child" && allowedContexts.includes("content_only")'
    ),
    "callback.spreadArgs": at(
      TK + "ExtensionCommon.sys.mjs",
      "applySafe(resolve, value.length == 1 ? value : [value], caller);"
    ),
    "function.requireUserInput": at(
      EXT_CHILD,
      "if (requireUserInput) { if (!isHandlingUserInput) {"
    ),
    "array.fixedLength": at(
      SCHEMAS,
      "if (result.length > this.maxItems) { return context.error( `Array requires at most ${this.maxItems} items;"
    ),
    "object.numericKeys": at(TK + "schemas/browser_action.json", '"^[1-9]\\\\d*$": { "$ref": "ImageDataType" }'),
  },
  MANIFEST_VERSION_RANGE: {
    min: at(SCHEMAS, "const MIN_MANIFEST_VERSION = 2;"),
    max: at(SCHEMAS, "const MAX_MANIFEST_VERSION = 3;"),
  },
};
