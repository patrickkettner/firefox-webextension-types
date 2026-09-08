/**
 * comparator.js - Strict Unicode code-point collation utilities
 *
 * Guarantees deterministic, bit-for-bit identical sort ordering across
 * all environments regardless of host OS, Node version, or ambient LANG/LC_ALL locale.
 */

/**
 * Compares two strings using UTF-16 code-unit binary ordering.
 * Exactly equivalent to ECMAScript standard default string comparison (a < b ? -1 : a > b ? 1 : 0).
 *
 * @param {string} a
 * @param {string} b
 * @returns {number} -1 if a < b, 1 if a > b, 0 if a === b
 */
export function codePointCompare(a, b) {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

/**
 * Compares two key-value entries by key using UTF-16 code-unit binary ordering.
 *
 * @param {[string, any]} entryA
 * @param {[string, any]} entryB
 * @returns {number}
 */
export function entryCodePointCompare([a], [b]) {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}
