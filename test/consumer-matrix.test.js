import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { installTypeScript } from "./helpers/install-typescript.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoTsc = path.join(repoRoot, "node_modules/.bin/tsc");
const typesChromeDir = path.join(repoRoot, "node_modules/@types/chrome");

// The package under test is the npm tarball, unpacked into node_modules of a
// scratch project, so every import goes through package.json "exports".
let workDir;
let consumerDir;
const compilers = [{ label: "repo", tsc: repoTsc }];

before(() => {
  workDir = fs.mkdtempSync(path.join(os.tmpdir(), "fwt-consumer-"));
  const packOut = execFileSync(
    "npm",
    ["pack", "--silent", "--pack-destination", workDir],
    { cwd: repoRoot, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }
  ).trim().split("\n").pop();
  consumerDir = path.join(workDir, "consumer");
  const pkgDir = path.join(consumerDir, "node_modules/firefox-webextension-types");
  fs.mkdirSync(pkgDir, { recursive: true });
  execFileSync("tar", ["-xzf", path.join(workDir, packOut), "-C", pkgDir, "--strip-components=1"]);
  fs.writeFileSync(path.join(consumerDir, "package.json"), '{"name":"consumer","private":true}\n');

  // CONSUMER_TS_VERSIONS="4.9.5,5.9.3" repeats every compile on those versions.
  for (const v of (process.env.CONSUMER_TS_VERSIONS || "").split(",").filter(Boolean)) {
    compilers.push({ label: v, tsc: installTypeScript(v).tsc });
  }
});

after(() => {
  if (workDir) fs.rmSync(workDir, { recursive: true, force: true });
});

function compile(tsc, { files, options = {}, types }) {
  const dir = fs.mkdtempSync(path.join(consumerDir, "case-"));
  try {
    for (const [name, content] of Object.entries(files)) {
      fs.writeFileSync(path.join(dir, name), content, "utf8");
    }
    fs.writeFileSync(
      path.join(dir, "tsconfig.json"),
      JSON.stringify({
        compilerOptions: {
          target: "ES2022",
          strict: true,
          skipLibCheck: false,
          noEmit: true,
          resolveJsonModule: true,
          types: types ?? [],
          ...options,
        },
        files: Object.keys(files),
      })
    );
    try {
      execFileSync(tsc, ["--project", dir], { encoding: "utf8", stdio: "pipe" });
      return { status: 0, output: "" };
    } catch (err) {
      return { status: err.status || 1, output: `${err.stdout || ""}${err.stderr || ""}` };
    }
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function expectClean(tsc, spec, what) {
  const res = compile(tsc, spec);
  assert.equal(res.status, 0, `${what} failed:\n${res.output}`);
}

const esmSource = `
import { browser } from "firefox-webextension-types";
import browserDefault from "firefox-webextension-types";
import { browser as desktopBrowser } from "firefox-webextension-types/desktop";
import { browser as mobileBrowser } from "firefox-webextension-types/mobile";
import { chrome } from "firefox-webextension-types/chrome";

export async function positive() {
    const tabs: browser.tabs.Tab[] = await browser.tabs.query({ active: true, currentWindow: true });
    const tabId: number | undefined = tabs[0].id;
    const manifest: browser.manifest.WebExtensionManifest = browser.runtime.getManifest();
    const p: browser.manifest.Permission = "tabs";
    await desktopBrowser.windows.getAll();
    await mobileBrowser.tabs.query({});
    await browserDefault.storage.local.get("theme");
    chrome.tabs.query({ active: true }, () => {});
    // @ts-expect-error test is {} outside automation (ext-test.js) and is not emitted
    desktopBrowser.test.log("test namespace is not on the canonical entrypoints");
}

export async function negative() {
    // @ts-expect-error the mobile surface has no windows namespace
    mobileBrowser.windows;
    // @ts-expect-error the mobile surface has no bookmarks namespace
    mobileBrowser.bookmarks;
    // @ts-expect-error tabs.discard is desktop only
    mobileBrowser.tabs.discard;
    // @ts-expect-error query takes an object
    await browser.tabs.query(42);
    // @ts-expect-error not a namespace
    browser.notARealNamespace;
    // @ts-expect-error primitives are not image data
    const bad: browser.action.ImageDataType = 42;
    const validImage: browser.action.ImageDataType = new ImageData(16, 16);
    // @ts-expect-error Schemas.sys.mjs requires an ImageData instance for isInstanceOf
    const badImage: browser.action.ImageDataType = { width: 16, height: 16 };
}
`;

const cjsSource = `
import pkg = require("firefox-webextension-types");
import desktop = require("firefox-webextension-types/desktop");
import mobile = require("firefox-webextension-types/mobile");
import chromeMod = require("firefox-webextension-types/chrome");
import prov = require("firefox-webextension-types/provenance.json");
import { browser } from "firefox-webextension-types";

export async function positive() {
    const tabs = await pkg.browser.tabs.query({ active: true });
    const t: browser.tabs.Tab[] = tabs;
    await desktop.browser.windows.getAll();
    await mobile.browser.tabs.query({});
    chromeMod.chrome.tabs.query({}, () => {});
    const version: string = prov.firefoxVersion;
    const commit: string = prov.firefoxCommit;
}

export function negative() {
    // @ts-expect-error mobile has no windows
    mobile.browser.windows;
    // @ts-expect-error firefoxVersion is a string
    const n: number = prov.firefoxVersion;
}
`;

const esmBundlerSource =
  esmSource +
  `
import prov from "firefox-webextension-types/provenance.json";
export const firefoxVersion: string = prov.firefoxVersion;
`;

const unexported = `
// @ts-expect-error dist files are not reachable except through exports
import * as direct from "firefox-webextension-types/dist/index.js";
// @ts-expect-error unknown subpath
import * as unknown from "firefox-webextension-types/nonexistent";
export { direct, unknown };
`;

for (const { label, tsc } of compilers) {
  // moduleResolution "bundler" arrived in TypeScript 5.0.
  const noBundler = Number(label.split(".")[0]) < 5 && "bundler resolution needs TypeScript 5";
  describe(`ConsumerMatrix (tarball, TypeScript ${label})`, () => {
    for (const res of ["node16", "nodenext"]) {
      it(`${res}: ESM (.mts) consumer resolves every module entrypoint`, () => {
        expectClean(
          tsc,
          {
            files: { "esm.mts": esmSource, "unexported.mts": unexported },
            options: { module: res, moduleResolution: res },
          },
          `${res} ESM`
        );
      });

      it(`${res}: CommonJS (.cts) consumer gets CommonJS declarations through the require condition`, () => {
        expectClean(
          tsc,
          {
            files: { "cjs.cts": cjsSource },
            options: { module: res, moduleResolution: res },
          },
          `${res} CJS`
        );
      });
    }

    it("bundler: module entrypoints and provenance.json resolve", { skip: noBundler }, () => {
      expectClean(
        tsc,
        {
          files: { "bundler.ts": esmBundlerSource, "unexported.ts": unexported },
          options: { module: "esnext", moduleResolution: "bundler" },
        },
        "bundler"
      );
    });

    it("importing the package does not declare globals in other files", () => {
      expectClean(
        tsc,
        {
          files: {
            "a.mts":
              'import { browser } from "firefox-webextension-types";\n' +
              "export async function f1() { await browser.tabs.query({}); }\n",
            "b.mts":
              "export async function f2() {\n" +
              "    // @ts-expect-error browser is not global\n" +
              "    await browser.tabs.query({});\n" +
              "}\n",
          },
          options: { module: "nodenext", moduleResolution: "nodenext" },
        },
        "module isolation"
      );
    });

    const ambient = {
      "firefox-webextension-types/global": `
        browser.tabs.query({});
        browser.windows;
        const t: browser.tabs.Tab | undefined = undefined;
        const ev: WebExtensionEvent<() => void> | undefined = undefined;
        // @ts-expect-error the base entrypoint declares no chrome
        chrome.tabs;
        // @ts-expect-error not a namespace
        browser.notARealNamespace;
        export {};`,
      "firefox-webextension-types/global-chrome": `
        browser.windows;
        chrome.tabs.query({ active: true }, () => {});
        export {};`,
      "firefox-webextension-types/global-mobile": `
        browser.tabs.query({});
        // @ts-expect-error the Android surface has no windows
        browser.windows;
        // @ts-expect-error nor bookmarks
        browser.bookmarks;
        // @ts-expect-error the base entrypoint declares no chrome
        chrome.tabs;
        export {};`,
      "firefox-webextension-types/global-mobile-chrome": `
        browser.tabs.query({});
        chrome.tabs.query({}, () => {});
        // @ts-expect-error the Android surface has no windows
        chrome.windows;
        export {};`,
    };
    for (const [entry, body] of Object.entries(ambient)) {
      for (const res of ["node16", "bundler"]) {
        it(`${entry} via tsconfig types (${res})`, { skip: res === "bundler" && noBundler }, () => {
          expectClean(
            tsc,
            {
              files: { "use.ts": body },
              types: [entry],
              options:
                res === "bundler"
                  ? { module: "esnext", moduleResolution: "bundler" }
                  : { module: "node16", moduleResolution: "node16" },
            },
            entry
          );
        });
      }
    }

    it("a triple-slash types reference loads the ambient entrypoint", () => {
      expectClean(
        tsc,
        {
          files: {
            "ref.ts":
              '/// <reference types="firefox-webextension-types/global" />\n' +
              "browser.tabs.query({});\n",
          },
          options: { module: "node16", moduleResolution: "node16" },
        },
        "triple-slash"
      );
    });

    it("without a types entry the ambient browser is not declared", () => {
      expectClean(
        tsc,
        {
          files: {
            "none.ts":
              "// @ts-expect-error nothing loaded the ambient entrypoint\n" +
              "browser.tabs;\n" +
              "export {};\n",
          },
          options: { module: "node16", moduleResolution: "node16" },
        },
        "no types entry"
      );
    });
  });
}

describe("ConsumerMatrix @types/chrome", { skip: !fs.existsSync(typesChromeDir) && "@types/chrome not installed" }, () => {
  function withTypesChrome() {
    const dest = path.join(consumerDir, "node_modules/@types");
    if (!fs.existsSync(dest)) {
      fs.cpSync(path.dirname(typesChromeDir), dest, { recursive: true });
    }
  }

  it("the module entrypoints coexist with the real @types/chrome", () => {
    withTypesChrome();
    expectClean(
      repoTsc,
      {
        files: {
          "both.mts":
            'import { browser } from "firefox-webextension-types";\n' +
            "browser.menus;\n" +
            "chrome.runtime.id;\n" +
            "// @ts-expect-error chrome has no menus; the imported browser does\n" +
            "chrome.menus;\n",
        },
        types: ["chrome"],
        options: { module: "node16", moduleResolution: "node16" },
      },
      "module + @types/chrome"
    );
  });

  it("the ambient entrypoints and @types/chrome both declare browser, and the clash is reported", () => {
    withTypesChrome();
    for (const order of [
      ["chrome", "firefox-webextension-types/global"],
      ["firefox-webextension-types/global", "chrome"],
    ]) {
      const res = compile(repoTsc, {
        files: { "clash.ts": "browser.tabs;\nexport {};\n" },
        types: order,
        options: { module: "node16", moduleResolution: "node16" },
      });
      assert.notEqual(res.status, 0, `expected a duplicate declaration error for ${order}`);
      assert.match(res.output, /TS2300/);
      assert.doesNotMatch(res.output, /TS2440/);
    }
  });
});

describe("Package metadata", () => {
  it("provenance.json carries the Firefox version and commit, and the d.ts headers carry the version", () => {
    const dist = path.join(repoRoot, "dist");
    const prov = JSON.parse(fs.readFileSync(path.join(dist, "provenance.json"), "utf8"));
    assert.match(prov.firefoxVersion, /^\d+\.\d+(\.\d+)?([ab]\d+)?$/);
    assert.match(prov.firefoxCommit, /^[0-9a-f]{40}$/);
    for (const name of ["index.d.ts", "firefox-desktop.d.ts", "firefox-mobile.d.ts", "global.d.ts", "global-mobile.d.ts"]) {
      const head = fs.readFileSync(path.join(dist, name), "utf8").split("\n").slice(0, 8).join("\n");
      assert.ok(
        head.includes(`// Firefox Version: ${prov.firefoxVersion}`),
        `${name} header does not name Firefox ${prov.firefoxVersion}`
      );
    }
  });

  it("every file named in package.json exports exists in the tarball", () => {
    const pkgDir = path.join(consumerDir, "node_modules/firefox-webextension-types");
    const pkg = JSON.parse(fs.readFileSync(path.join(pkgDir, "package.json"), "utf8"));
    const targets = [];
    const walk = (v) => {
      if (typeof v === "string") targets.push(v);
      else Object.values(v).forEach(walk);
    };
    walk(pkg.exports);
    for (const t of targets) {
      assert.ok(fs.existsSync(path.join(pkgDir, t)), `${t} is missing from the packed tarball`);
    }
  });
});
