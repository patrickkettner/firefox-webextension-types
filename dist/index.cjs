// Runtime placeholder for types-only package (CommonJS)
const browser = typeof globalThis !== "undefined" ? globalThis.browser : undefined;
const chrome = typeof globalThis !== "undefined" ? globalThis.chrome : undefined;
module.exports = {
  browser,
  chrome,
  default: browser,
};
