// Where the declarations may differ from the schemas, kept here and not read
// from src/, so that a change to the generator's tables cannot widen it.
// Leaving a namespace out of dist/ takes an entry here as well as in
// EXCLUDED_NAMESPACES in src/overrides.js, and scripts/verify-overrides.js
// fails when the two lists differ. Each entry names the Firefox file that
// shows the difference is real.

// Namespaces a schema declares and Firefox does not expose to extensions.
export const EXCLUDED_NAMESPACES = {
  test: "toolkit/components/extensions/child/ext-test.js",
};

// Members the declarations carry that no schema declares.

export const ADDED_MEMBERS = {
  "runtime.Port.error": "toolkit/components/extensions/ExtensionChild.sys.mjs",
};
