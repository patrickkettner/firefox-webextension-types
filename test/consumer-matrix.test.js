import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tscPath = fs.existsSync(path.join(repoRoot, "node_modules/.bin/tsc"))
  ? path.join(repoRoot, "node_modules/.bin/tsc")
  : "tsc";

function compileInHarness(files, customPaths = null) {
  const tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), "tsc-harness-"));
  try {
    const defaultPaths = {
      "firefox-webextension-types": [path.join(repoRoot, "dist/index.d.ts")],
    };
    const tsconfig = {
      compilerOptions: {
        target: "ES2022",
        module: "NodeNext",
        moduleResolution: "NodeNext",
        strict: true,
        skipLibCheck: false,
        noEmit: true,
        paths: customPaths || defaultPaths,
      },
    };
    fs.writeFileSync(
      path.join(tmpdir, "tsconfig.json"),
      JSON.stringify(tsconfig, null, 2),
      "utf8"
    );

    for (const [filename, content] of Object.entries(files)) {
      fs.writeFileSync(path.join(tmpdir, filename), content, "utf8");
    }

    try {
      const stdout = execFileSync(
        tscPath,
        ["--project", path.join(tmpdir, "tsconfig.json")],
        {
          encoding: "utf8",
          stdio: "pipe",
        }
      );
      return { status: 0, stdout, stderr: "" };
    } catch (err) {
      return {
        status: err.status || 1,
        stdout: err.stdout || "",
        stderr: err.stderr || "",
      };
    }
  } finally {
    fs.rmSync(tmpdir, { recursive: true, force: true });
  }
}

describe("ConsumerMatrix", () => {
  it("verifies NodeNext ESM consumption of root, desktop, and mobile entrypoints", () => {
    const paths = {
      "firefox-webextension-types": [path.join(repoRoot, "dist/index.d.ts")],
      "firefox-webextension-types/desktop": [
        path.join(repoRoot, "dist/firefox-desktop.d.ts"),
      ],
      "firefox-webextension-types/mobile": [
        path.join(repoRoot, "dist/firefox-mobile.d.ts"),
      ],
    };
    const code =
      'import { browser } from "firefox-webextension-types";\n' +
      'import { browser as desktopBrowser } from "firefox-webextension-types/desktop";\n' +
      'import { browser as mobileBrowser } from "firefox-webextension-types/mobile";\n' +
      "async function testEsm() {\n" +
      "    const manifest: Record<string, unknown> = browser.runtime.getManifest();\n" +
      "    const views: Window[] = browser.extension.getViews();\n" +
      "    const bg: Window | null = browser.extension.getBackgroundPage();\n" +
      "    const tabs: browser.tabs.Tab[] = await browser.tabs.query({ active: true, currentWindow: true });\n" +
      '    const resp: any = await browser.runtime.sendMessage({ action: "ping" });\n' +
      '    const settings: Record<string, unknown> = await browser.storage.local.get("theme");\n' +
      '    const p1: browser.manifest.Permission = "tabs";\n' +
      '    const p2: browser.manifest.Permission = "custom-extension-perm";\n' +
      "    const dTabs = await desktopBrowser.tabs.query({});\n" +
      "    const mTabs = await mobileBrowser.tabs.query({});\n" +
      "}\n";

    const res = compileInHarness({ "consumer.mts": code }, paths);
    assert.equal(
      res.status,
      0,
      `ESM compilation failed:\n${res.stdout}\n${res.stderr}`
    );
  });

  it("verifies schema-pure Tab optional id and access to browser.test on canonical entrypoints", () => {
    const paths = {
      "firefox-webextension-types": [path.join(repoRoot, "dist/index.d.ts")],
      "firefox-webextension-types/desktop": [
        path.join(repoRoot, "dist/firefox-desktop.d.ts"),
      ],
    };
    const code =
      'import { browser } from "firefox-webextension-types";\n' +
      'import { browser as desktopBrowser } from "firefox-webextension-types/desktop";\n' +
      "async function testPureSchema() {\n" +
      "    const tabs = await browser.tabs.query({});\n" +
      "    const tabId: number | undefined = tabs[0].id;\n" +
      "    desktopBrowser.test.log('running test namespace function');\n" +
      "}\n";

    const res = compileInHarness({ "consumer.mts": code }, paths);
    assert.equal(
      res.status,
      0,
      `Pure schema compilation failed:\n${res.stdout}\n${res.stderr}`
    );
  });

  it("verifies NodeNext CommonJS consumption of root entrypoint", () => {
    const code =
      'import pkg = require("firefox-webextension-types");\n' +
      "const { browser, chrome } = pkg;\n" +
      "async function testCjs() {\n" +
      "    const manifest = browser.runtime.getManifest();\n" +
      "    const tabs = await browser.tabs.query({ active: true });\n" +
      "}\n";

    const res = compileInHarness({ "consumer.cts": code });
    assert.equal(
      res.status,
      0,
      `CJS compilation failed:\n${res.stdout}\n${res.stderr}`
    );
  });

  it("verifies ambient global declarations without module pollution", () => {
    const tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), "tsc-ambient-"));
    try {
      const globalPath = path.join(repoRoot, "dist/global.d.ts");
      const testTs = path.join(tmpdir, "test.ts");
      fs.writeFileSync(
        testTs,
        `/// <reference path="${globalPath}" />\n` +
          "function testAmbient() {\n" +
          '    browser.tabs.create({ url: "https://mozilla.org" });\n' +
          '    chrome.tabs.create({ url: "https://mozilla.org" });\n' +
          "}\n",
        "utf8"
      );

      const stdout = execFileSync(
        tscPath,
        [
          "--ignoreConfig",
          "--noEmit",
          "--strict",
          "--skipLibCheck",
          "false",
          testTs,
        ],
        { encoding: "utf8", stdio: "pipe" }
      );
      assert.ok(true);
    } finally {
      fs.rmSync(tmpdir, { recursive: true, force: true });
    }
  });

  it("verifies importing firefox-webextension-types does NOT pollute global scope in other files", () => {
    const files = {
      "file1.mts":
        'import { browser } from "firefox-webextension-types";\n' +
        "export async function f1() { await browser.tabs.query({}); }\n",
      "file2.mts":
        "export async function f2() {\n" +
        "    // @ts-expect-error browser should NOT be in global scope\n" +
        "    await browser.tabs.query({});\n" +
        "}\n",
    };
    const res = compileInHarness(files);
    assert.equal(
      res.status,
      0,
      `Module isolation verification failed:\n${res.stdout}\n${res.stderr}`
    );
  });

  it("verifies coexistence with @types/chrome without TS2440 or TS2300 collisions", () => {
    const code =
      "declare namespace chrome {\n" +
      "    export namespace runtime {\n" +
      "        export function getURL(path: string): string;\n" +
      "    }\n" +
      "}\n" +
      'import { browser } from "firefox-webextension-types";\n' +
      "function testChromeCoexistence() {\n" +
      '    const url = chrome.runtime.getURL("icon.png");\n' +
      "    const manifest = browser.runtime.getManifest();\n" +
      "}\n";

    const res = compileInHarness({ "consumer.mts": code });
    assert.equal(
      res.status,
      0,
      `Chrome coexistence failed:\n${res.stdout}\n${res.stderr}`
    );
  });

  it("verifies dedicated ./chrome entrypoint for chrome API compatibility", () => {
    const paths = {
      "firefox-webextension-types/chrome": [
        path.join(repoRoot, "dist/chrome.d.ts"),
      ],
    };
    const code =
      'import { chrome } from "firefox-webextension-types/chrome";\n' +
      "function testChromeModule() {\n" +
      "    const manifest = chrome.runtime.getManifest();\n" +
      "}\n";

    const res = compileInHarness({ "consumer.mts": code }, paths);
    assert.equal(
      res.status,
      0,
      `Chrome compatibility module failed:\n${res.stdout}\n${res.stderr}`
    );
  });

  it("verifies empty schema objects reject primitives via index signature", () => {
    const code =
      'import { browser } from "firefox-webextension-types";\n' +
      "// @ts-expect-error\n" +
      "const badNumber: browser.action.ImageDataType = 42;\n" +
      "// @ts-expect-error\n" +
      'const badString: browser.action.ImageDataType = "test";\n' +
      "// @ts-expect-error\n" +
      "const badBool: browser.action.ImageDataType = true;\n" +
      "const validObj: browser.action.ImageDataType = { width: 16, height: 16 };\n";

    const res = compileInHarness({ "consumer.mts": code });
    assert.equal(
      res.status,
      0,
      `Empty interface protection failed:\n${res.stdout}\n${res.stderr}`
    );
  });
});
