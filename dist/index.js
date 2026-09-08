// Runtime placeholder for types-only package
export const browser = typeof globalThis !== "undefined" ? globalThis.browser : undefined;
export const chrome = typeof globalThis !== "undefined" ? globalThis.chrome : undefined;
export default browser;
