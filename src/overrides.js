/**
 * overrides.js - Behaviour the schemas cannot express.
 *
 * Every entry names the Firefox file that defines the behaviour. Nothing in
 * here is derived from another type package.
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
};
