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
