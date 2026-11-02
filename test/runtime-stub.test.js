import { afterEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");
const built = fs.existsSync(path.join(dist, "index.js")) && fs.existsSync(path.join(dist, "index.cjs"));

function check(moduleExports) {
  const { browser, chrome } = moduleExports;
  assert.equal(moduleExports.default, browser);
  assert.equal(typeof browser, "object");
  assert.equal(browser.runtime, undefined);
  assert.equal("runtime" in browser, false);
  assert.deepEqual(Object.keys(browser), []);

  const mock = { runtime: { id: "mock-id", getURL: (p) => `moz-extension://mock/${p}` } };
  globalThis.browser = mock;
  assert.equal(browser.runtime, mock.runtime);
  assert.equal(browser.runtime.id, "mock-id");
  assert.equal(browser.runtime.getURL("a.html"), "moz-extension://mock/a.html");
  assert.equal("runtime" in browser, true);
  assert.deepEqual(Object.keys(browser), ["runtime"]);

  globalThis.browser = { runtime: { id: "second" } };
  assert.equal(browser.runtime.id, "second");
  browser.tabs = { TAB_ID_NONE: -1 };
  assert.equal(globalThis.browser.tabs.TAB_ID_NONE, -1);
  delete browser.tabs;
  assert.equal("tabs" in globalThis.browser, false);

  delete globalThis.browser;
  assert.equal(browser.runtime, undefined);

  assert.equal(chrome.runtime, undefined);
  globalThis.chrome = { runtime: { id: "chrome-mock" } };
  assert.equal(chrome.runtime.id, "chrome-mock");
}

// Packaging: the ESM and CommonJS entrypoints read globalThis.browser when accessed
describe("runtime stubs", { skip: !built && "dist not built" }, () => {
  afterEach(() => {
    delete globalThis.browser;
    delete globalThis.chrome;
  });

  it("the ESM export reads globalThis.browser at access time, so a mock assigned after import is seen", async () => {
    check(await import(pathToFileURL(path.join(dist, "index.js")).href));
  });

  it("the CommonJS export does the same", () => {
    check(createRequire(import.meta.url)(path.join(dist, "index.cjs")));
  });
});
