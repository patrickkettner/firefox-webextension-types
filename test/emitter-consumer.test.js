import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { TypeScriptEmitter } from "../src/emitter.js";
import { LoadedNamespace } from "../src/schema-loader.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tsc = path.join(root, "node_modules", "typescript", "bin", "tsc");

// Declarations the emitter produces from schema nodes, checked by compiling
// consumer code against them with the strictest settings a consumer can
// pick. A `@ts-expect-error` that goes unused fails the compile too, so each
// case pins both what must compile and what must not.
describe("consumer code against emitted declarations", () => {
  let dir;
  let caseNo = 0;

  before(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "fwt-emitter-consumer-"));
  });
  after(() => fs.rmSync(dir, { recursive: true, force: true }));

  function namespace(name, members) {
    const ns = new LoadedNamespace(name);
    Object.assign(ns, members);
    return ns;
  }

  function compile(namespaces, consumer) {
    const caseDir = path.join(dir, `case-${caseNo++}`);
    fs.mkdirSync(caseDir);
    const text = new TypeScriptEmitter("desktop", "testsha123").generate(namespaces, "module");
    fs.writeFileSync(path.join(caseDir, "index.d.ts"), text);
    fs.writeFileSync(path.join(caseDir, "consumer.ts"), consumer);
    const res = spawnSync(
      process.execPath,
      [
        tsc,
        "--ignoreConfig",
        "--noEmit",
        "--strict",
        "--exactOptionalPropertyTypes",
        "--target",
        "es2022",
        "--module",
        "nodenext",
        "--moduleResolution",
        "nodenext",
        "--lib",
        "es2022,dom",
        path.join(caseDir, "consumer.ts"),
      ],
      { encoding: "utf8" }
    );
    return { status: res.status, output: res.stdout + res.stderr, text };
  }

  // Firefox: Schemas.sys.mjs (ObjectType.normalize writes null for an absent optional property), ext-runtime.js (getManifest), ext-theme.js (getCurrent), ExtensionShortcuts.sys.mjs (allCommands)
  it("types a normalized manifest value as null where the manifest left it out", () => {
    const optionsUi = {
      type: "object",
      optional: true,
      properties: { page: { type: "string" }, open_in_tab: { type: "boolean", optional: true } },
    };
    const manifest = namespace("manifest", {
      types: {
        WebExtensionManifest: {
          id: "WebExtensionManifest",
          type: "object",
          properties: {
            name: { type: "string" },
            version: { type: "string" },
            options_ui: optionsUi,
            permissions: { type: "array", optional: true, items: { type: "string" } },
          },
        },
        ThemeType: {
          id: "ThemeType",
          type: "object",
          properties: {
            colors: { type: "object", optional: true, properties: { frame: { type: "string", optional: true } } },
          },
        },
      },
    });
    const runtime = namespace("runtime", {
      functions: {
        getManifest: {
          name: "getManifest",
          type: "function",
          parameters: [],
          returns: { type: "object", properties: {}, additionalProperties: { type: "any" } },
        },
      },
    });
    const theme = namespace("theme", {
      functions: {
        getCurrent: {
          name: "getCurrent",
          type: "function",
          async: true,
          parameters: [{ name: "windowId", type: "integer", optional: true }],
        },
      },
    });
    const commands = namespace("commands", {
      types: {
        Command: {
          id: "Command",
          type: "object",
          properties: {
            name: { type: "string", optional: true },
            description: { type: "string", optional: true },
            shortcut: { type: "string", optional: true },
          },
        },
      },
      functions: {
        getAll: {
          name: "getAll",
          type: "function",
          async: "callback",
          parameters: [
            { name: "callback", type: "function", parameters: [{ name: "commands", type: "array", items: { $ref: "Command" } }] },
          ],
        },
      },
    });

    const { status, output } = compile(
      { manifest, runtime, theme, commands },
      `import { browser } from "./index.js";

export async function reads() {
    const m = browser.runtime.getManifest();
    const name: string = m.name;
    // @ts-expect-error options_ui is null when the manifest leaves it out
    if (m.options_ui !== undefined) m.options_ui.page;
    if (m.options_ui) {
        const page: string = m.options_ui.page;
        // @ts-expect-error open_in_tab is null when the manifest leaves it out
        const inTab: boolean | undefined = m.options_ui.open_in_tab;
        return [page, inTab];
    }
    // @ts-expect-error permissions is null when the manifest leaves it out
    if (m.permissions !== undefined) m.permissions.length;

    const t = await browser.theme.getCurrent();
    // @ts-expect-error colors is null for a theme that sets none
    if (t.colors !== undefined) t.colors.frame;

    const [c] = await browser.commands.getAll();
    // @ts-expect-error description is null when the manifest gives none
    if (c.description !== undefined) c.description.length;
    return name;
}

export function writes() {
    const bare: browser.manifest.WebExtensionManifest = { name: "ext", version: "1.0" };
    const explicit: browser.manifest.WebExtensionManifest = { name: "ext", version: "1.0", options_ui: undefined };
    const full: browser.manifest.WebExtensionManifest = { name: "ext", version: "1.0", options_ui: { page: "o.html" } };
    const theme: browser.manifest.ThemeType = { colors: { frame: "red" } };
    return [bare, explicit, full, theme];
}
`
    );
    assert.equal(status, 0, output);
  });

  // Firefox: Schemas.sys.mjs (ObjectType.checkProperty writes the schema default for an absent optional property, skips one gated to another manifest version and leaves out a missing "omit-key-if-missing" one), ext-runtime.js (getManifest)
  it("types a manifest key normalization fills with its default as present and never null", () => {
    const manifest = namespace("manifest", {
      types: {
        WebExtensionManifest: {
          id: "WebExtensionManifest",
          type: "object",
          properties: {
            name: { type: "string" },
            incognito: { type: "string", enum: ["spanning", "split"], optional: true, default: "spanning" },
            permissions: { type: "array", items: { type: "string" }, optional: true, default: [] },
            host_permissions: { type: "array", items: { type: "string" }, optional: true, default: [], min_manifest_version: 3 },
            menu: { type: "string", optional: "omit-key-if-missing", default: "main" },
            options_ui: { type: "object", optional: true, properties: { page: { type: "string" } } },
            background: {
              optional: true,
              choices: [
                {
                  type: "object",
                  properties: {
                    page: { type: "string", optional: true },
                    persistent: { type: "boolean", optional: true, default: true, max_manifest_version: 2 },
                  },
                },
                { type: "object", properties: { service_worker: { type: "string" } } },
              ],
            },
            content_scripts: { type: "array", optional: true, items: { $ref: "ContentScript" } },
            experiment_apis: { type: "object", optional: true, additionalProperties: { $ref: "ExperimentAPI" } },
          },
        },
        ContentScript: {
          id: "ContentScript",
          type: "object",
          properties: {
            js: { type: "array", items: { type: "string" }, optional: true },
            run_at: { type: "string", enum: ["document_start", "document_idle"], optional: true, default: "document_idle" },
          },
        },
        ExperimentAPI: {
          id: "ExperimentAPI",
          type: "object",
          properties: {
            parent: {
              type: "object",
              optional: true,
              properties: { events: { type: "array", items: { type: "string" }, optional: true, default: [] } },
            },
          },
        },
      },
    });
    const runtime = namespace("runtime", {
      functions: { getManifest: { name: "getManifest", type: "function", parameters: [], returns: { type: "object" } } },
    });

    const { status, output, text } = compile(
      { manifest, runtime },
      `import { browser } from "./index.js";

export function reads() {
    const m = browser.runtime.getManifest();
    const incognito: "spanning" | "split" = m.incognito;
    const permissions: string[] = m.permissions;
    // @ts-expect-error host_permissions is left out below manifest_version 3
    const hosts: string[] = m.host_permissions;
    const maybeHosts: string[] | undefined = m.host_permissions;
    const menu: string | undefined = m.menu;
    // @ts-expect-error options_ui is null when the manifest leaves it out
    const options: { page: string } | undefined = m.options_ui;
    if (m.background && "persistent" in m.background) {
        const persistent: boolean | undefined = m.background.persistent;
    }
    if (m.background && "page" in m.background) {
        // @ts-expect-error page is null when the background leaves it out
        const page: string | undefined = m.background.page;
    }
    for (const script of m.content_scripts ?? []) {
        const runAt: "document_start" | "document_idle" = script.run_at;
        // @ts-expect-error js is null when the content script leaves it out
        const js: string[] | undefined = script.js;
    }
    const api = m.experiment_apis?.["x"];
    if (api?.parent) {
        const events: string[] = api.parent.events;
    }
    const back: browser.manifest.WebExtensionManifest = m;
    return [incognito, permissions, hosts, maybeHosts, menu, options, back];
}
`
    );
    assert.equal(status, 0, output);
    assert.ok(
      text.includes(
        'getManifest(): Normalized<browser.manifest.WebExtensionManifest, "background.persistent?" | "content_scripts.run_at" | "experiment_apis.*.parent.events" | "host_permissions?" | "incognito" | "menu?" | "permissions">;'
      )
    );
  });

  // Firefox: Extension.sys.mjs (parseManifest sets browser_style with ??= for options_ui and the actions after normalization), ext-runtime.js (getManifest)
  it("types a manifest key Firefox fills in after normalization as never null", () => {
    const action = { type: "object", optional: true, properties: { browser_style: { type: "boolean", optional: true }, default_title: { type: "string", optional: true } } };
    const manifest = namespace("manifest", {
      types: {
        WebExtensionManifest: {
          id: "WebExtensionManifest",
          type: "object",
          properties: {
            name: { type: "string" },
            page_action: action,
            options_ui: {
              type: "object",
              optional: true,
              properties: { page: { type: "string" }, browser_style: { type: "boolean", optional: true }, open_in_tab: { type: "boolean", optional: true } },
            },
          },
        },
      },
    });
    const runtime = namespace("runtime", {
      functions: { getManifest: { name: "getManifest", type: "function", parameters: [], returns: { type: "object" } } },
    });
    const { status, output, text } = compile(
      { manifest, runtime },
      `import { browser } from "./index.js";

export function reads() {
    const m = browser.runtime.getManifest();
    // @ts-expect-error options_ui is null when the manifest leaves it out
    m.options_ui.browser_style;
    if (m.options_ui && m.page_action) {
        const styled: boolean = m.options_ui.browser_style;
        const actionStyled: boolean = m.page_action.browser_style;
        // @ts-expect-error open_in_tab is null when the manifest leaves it out
        const inTab: boolean | undefined = m.options_ui.open_in_tab;
        // @ts-expect-error default_title is null when the manifest leaves it out
        const title: string | undefined = m.page_action.default_title;
        return [styled, actionStyled, inTab, title];
    }
    return [];
}
`
    );
    assert.equal(status, 0, output);
    assert.match(text, /Normalized<browser\.manifest\.WebExtensionManifest, "options_ui\.browser_style" \| "page_action\.browser_style">/);
  });

  // Firefox: Schemas.sys.mjs (ObjectType.checkProperty takes null on an optional property as absent and rejects an unsupported one), Extension.sys.mjs (parseManifest normalizes the manifest), ext-theme.js (getCurrent hands back the normalized theme), ext-notifications.js (getAll hands back the normalized options)
  it("lets null stand for an absent optional property on the way in and nowhere else", () => {
    const manifest = namespace("manifest", {
      types: {
        WebExtensionManifest: {
          id: "WebExtensionManifest",
          type: "object",
          properties: {
            name: { type: "string" },
            theme: { $ref: "ThemeType", optional: true },
            nacl_modules: { type: "string", optional: true, unsupported: true },
          },
        },
        ThemeType: {
          id: "ThemeType",
          type: "object",
          properties: {
            colors: { type: "object", optional: true, properties: { frame: { type: "string", optional: true } } },
          },
        },
      },
    });
    const theme = namespace("theme", {
      functions: {
        getCurrent: { name: "getCurrent", type: "function", async: true, parameters: [] },
        update: {
          name: "update",
          type: "function",
          async: true,
          parameters: [{ name: "details", $ref: "manifest.ThemeType" }],
        },
      },
    });
    const zoomCallback = { name: "callback", type: "function", parameters: [{ name: "zoomSettings", $ref: "ZoomSettings" }] };
    const tabs = namespace("tabs", {
      types: {
        ZoomSettings: {
          id: "ZoomSettings",
          type: "object",
          properties: {
            mode: { type: "string", optional: true, enum: ["automatic", "manual"] },
            defaultZoomFactor: { type: "number", optional: true },
          },
        },
      },
      functions: {
        create: {
          name: "create",
          type: "function",
          async: true,
          parameters: [
            {
              name: "createProperties",
              type: "object",
              properties: {
                url: { type: "string", optional: true },
                icons: { type: "object", optional: true, patternProperties: { "^[1-9]\\d*$": { type: "string" } } },
              },
            },
          ],
        },
        getZoomSettings: { name: "getZoomSettings", type: "function", async: "callback", parameters: [zoomCallback] },
        setZoomSettings: {
          name: "setZoomSettings",
          type: "function",
          async: true,
          parameters: [{ name: "zoomSettings", $ref: "ZoomSettings" }],
        },
      },
      events: {
        onUpdated: {
          name: "onUpdated",
          type: "function",
          parameters: [
            { name: "changeInfo", type: "object", properties: { status: { type: "string", optional: true } } },
          ],
        },
      },
    });
    const notifications = namespace("notifications", {
      types: {
        CreateNotificationOptions: {
          id: "CreateNotificationOptions",
          type: "object",
          properties: { title: { type: "string" }, iconUrl: { type: "string", optional: true } },
        },
      },
      functions: {
        create: {
          name: "create",
          type: "function",
          async: true,
          parameters: [{ name: "options", $ref: "CreateNotificationOptions" }],
        },
        getAll: {
          name: "getAll",
          type: "function",
          async: "callback",
          parameters: [
            {
              name: "callback",
              type: "function",
              parameters: [
                { name: "notifications", type: "object", additionalProperties: { $ref: "CreateNotificationOptions" } },
              ],
            },
          ],
        },
      },
    });

    const { status, output } = compile(
      { manifest, theme, tabs, notifications },
      `import { browser } from "./index.js";

export async function handedIn() {
    await browser.theme.update(await browser.theme.getCurrent());
    await browser.theme.update({ colors: { frame: null } });
    await browser.tabs.create({ url: null, icons: null });
    await browser.tabs.setZoomSettings({ mode: null });
    await browser.tabs.setZoomSettings(await browser.tabs.getZoomSettings());
    await browser.notifications.create({ title: "t", iconUrl: null });
    const manifest: browser.manifest.WebExtensionManifest = { name: "ext", theme: null };
    // @ts-expect-error Firefox rejects an unsupported property whatever its value
    const unsupported: browser.manifest.WebExtensionManifest = { name: "ext", nacl_modules: null };
    // @ts-expect-error even undefined, since ObjectType.checkProperty tests that the key is present
    const undefinedUnsupported: browser.manifest.WebExtensionManifest = { name: "ext", nacl_modules: undefined };
    // @ts-expect-error and a value of the schema type
    const typedUnsupported: browser.manifest.WebExtensionManifest = { name: "ext", nacl_modules: "x" };
    // @ts-expect-error a key of a pattern map is never optional, so null is checked as a string
    await browser.tabs.create({ icons: { 16: null } });
    return [manifest, unsupported, undefinedUnsupported, typedUnsupported];
}

export async function handedBack() {
    const zoom = await browser.tabs.getZoomSettings();
    const mode: "automatic" | "manual" | undefined = zoom.mode;
    // @ts-expect-error getZoomSettings never reads a mode as null
    const nulled: browser.tabs.ZoomSettings = { mode: null };
    browser.tabs.onUpdated.addListener((changeInfo) => {
        const status: string | undefined = changeInfo.status;
        return status;
    });
    const shown = (await browser.notifications.getAll())["n"];
    // @ts-expect-error getAll reads iconUrl as null when create left it out
    const icon: string | undefined = shown?.iconUrl;
    return [mode, nulled, icon];
}
`
    );
    assert.equal(status, 0, output);
  });

  // Firefox: web_navigation.json (processId and error are unsupported), ext-webNavigation.js (the event data has no processId and copies error), WebNavigation.sys.mjs (error is "Error code" and the status), runtime.json (nacl_arch is unsupported), ExtensionParent.sys.mjs (PlatformInfo has os and arch only)
  it("reads an unsupported property of a value Firefox hands back as never set", () => {
    const unsupportedId = { type: "integer", unsupported: true, description: "The ID of the process." };
    const webNavigation = namespace("webNavigation", {
      events: {
        onErrorOccurred: {
          name: "onErrorOccurred",
          type: "function",
          parameters: [
            {
              name: "details",
              type: "object",
              properties: {
                url: { type: "string" },
                processId: unsupportedId,
                error: { unsupported: true, type: "string", description: "The error description." },
              },
            },
          ],
        },
      },
    });
    const runtime = namespace("runtime", {
      types: {
        PlatformInfo: {
          id: "PlatformInfo",
          type: "object",
          properties: { os: { type: "string" }, nacl_arch: { unsupported: true, type: "string" } },
        },
      },
      functions: {
        getPlatformInfo: {
          name: "getPlatformInfo",
          type: "function",
          async: "callback",
          parameters: [{ name: "callback", type: "function", parameters: [{ name: "platformInfo", $ref: "PlatformInfo" }] }],
        },
      },
    });
    const { status, output, text } = compile(
      { webNavigation, runtime },
      `import { browser } from "./index.js";

browser.webNavigation.onErrorOccurred.addListener((details) => {
    const error: string = details.error;
    const processId: undefined = details.processId;
    // @ts-expect-error Firefox never sets processId
    const number: number = details.processId;
    return [error, processId, number];
});

export async function platform() {
    const info = await browser.runtime.getPlatformInfo();
    const arch: undefined = info.nacl_arch;
    // @ts-expect-error Firefox never sets nacl_arch
    const named: string = info.nacl_arch;
    return [arch, named];
}
`
    );
    assert.equal(status, 0, output);
    assert.match(text, /@deprecated Firefox does not support this property and never sets it\.\n\s*\*\/\n\s*processId\?: undefined;/);
    assert.match(text, /\* The error description\.\n\s*\*\/\n\s*error: string;/);
  });

  // Firefox: ProxyChannelFilter.sys.mjs (applyFilter awaits the listener and builds the proxy from its result, ProxyInfoData validates each one), ext-proxy.js (returns what fire.sync gets back), proxy.json (onRequest declares no returns)
  it("types what a proxy.onRequest listener returns as Firefox reads it", () => {
    const proxy = namespace("proxy", {
      events: {
        onRequest: {
          name: "onRequest",
          type: "function",
          parameters: [{ name: "details", type: "object", properties: { url: { type: "string" } } }],
        },
      },
    });
    const { status, output, text } = compile(
      { proxy },
      `import { browser } from "./index.js";

browser.proxy.onRequest.addListener(() => ({ type: "http", host: "proxy.example", port: 8080 }));
browser.proxy.onRequest.addListener(() => [{ type: "socks", host: "a.example", port: "1080", proxyDNS: true }, { type: "direct" }]);
browser.proxy.onRequest.addListener(async () => ({ type: "masque", host: "m.example", port: 443, masqueTemplate: "/{target_host}" }));
browser.proxy.onRequest.addListener(() => null);
browser.proxy.onRequest.addListener((details) => {
    if (details.url.startsWith("https:")) return { type: "https", host: "proxy.example", port: 443 };
});
// @ts-expect-error Firefox takes no PAC string
browser.proxy.onRequest.addListener(() => "PROXY proxy.example:8080");
// @ts-expect-error Firefox has no ftp proxy type
browser.proxy.onRequest.addListener(() => ({ type: "ftp", host: "proxy.example", port: 21 }));
// @ts-expect-error proxyDNS can only be true for SOCKS
browser.proxy.onRequest.addListener(() => ({ type: "http", host: "proxy.example", port: 8080, proxyDNS: true }));
// @ts-expect-error a MASQUE proxy needs masqueTemplate
browser.proxy.onRequest.addListener(() => ({ type: "masque", host: "m.example", port: 443 }));
`
    );
    assert.equal(status, 0, output);
    assert.match(text, /export namespace onRequest \{[\s\S]*?\* A proxy for the request, as an onRequest listener returns it, alone or in a failover list\.\n\s*\*\/\n\s*export type Result = /);
  });

  // Firefox: ext-cookies.js (getExtPartitionKey returns null for an unpartitioned cookie, convertCookie and remove copy it), ext-publicSuffix.js (getKnownSuffix returns null)
  it("types a result property Firefox sets to null as null", () => {
    const partitionKey = { $ref: "PartitionKey", optional: true };
    const cookies = namespace("cookies", {
      types: {
        PartitionKey: {
          id: "PartitionKey",
          type: "object",
          properties: { topLevelSite: { type: "string", optional: true } },
        },
        Cookie: {
          id: "Cookie",
          type: "object",
          properties: { name: { type: "string" }, partitionKey },
        },
      },
      functions: {
        remove: {
          name: "remove",
          type: "function",
          async: "callback",
          parameters: [
            { name: "details", type: "object", properties: { name: { type: "string" } } },
            {
              name: "callback",
              type: "function",
              parameters: [
                { name: "details", type: "object", optional: true, properties: { name: { type: "string" }, partitionKey } },
              ],
            },
          ],
        },
      },
    });
    const publicSuffix = namespace("publicSuffix", {
      functions: {
        getKnownSuffix: {
          name: "getKnownSuffix",
          type: "function",
          parameters: [{ name: "hostname", type: "string" }],
          returns: { type: "string", optional: true },
        },
      },
    });
    const { status, output } = compile(
      { cookies, publicSuffix },
      `import { browser } from "./index.js";

export async function reads(cookie: browser.cookies.Cookie) {
    // @ts-expect-error partitionKey is null for a cookie that is not partitioned
    const own: browser.cookies.PartitionKey | undefined = cookie.partitionKey;
    const removed = await browser.cookies.remove({ name: "a" });
    // @ts-expect-error partitionKey is null for a cookie that is not partitioned
    const key: browser.cookies.PartitionKey | undefined = removed?.partitionKey;
    // @ts-expect-error getKnownSuffix returns null when there is no known suffix
    const suffix: string = browser.publicSuffix.getKnownSuffix("localhost");
    return [own, key, suffix];
}
`
    );
    assert.equal(status, 0, output);
  });

  // Firefox: ext-scripting.js (func is spread with args and its result awaited), Schemas.sys.mjs (an explicit undefined on an optional property is absent)
  // TypeScript: a function type before `| undefined` needs parentheses or the union lands on its return type
  it("keeps an optional override function property optional and its return type whole", () => {
    const scripting = namespace("scripting", {
      types: {
        ScriptInjection: {
          id: "ScriptInjection",
          type: "object",
          properties: {
            args: { type: "array", optional: true, items: { type: "any" } },
            func: { type: "function", optional: true },
            target: { type: "object", properties: { tabId: { type: "integer" } } },
          },
        },
      },
    });
    const { status, output } = compile(
      { scripting },
      `import { browser } from "./index.js";

export function injections() {
    const absent: browser.scripting.ScriptInjection<[], number> = { target: { tabId: 1 }, func: undefined };
    const counts: browser.scripting.ScriptInjection<[], number> = { target: { tabId: 1 }, func: () => 1 };
    // @ts-expect-error func returns Result, not Result | undefined
    const silent: browser.scripting.ScriptInjection<[], number> = { target: { tabId: 1 }, func: () => undefined };
    return [absent, counts, silent];
}
`
    );
    assert.equal(status, 0, output);
  });

  // Firefox: theme.json (images, colors and properties take additionalProperties), Schemas.sys.mjs (ObjectType.normalize hands every other key to additionalProperties), toolkit/mozapps/extensions/LightweightThemeManager.sys.mjs (loadColors, loadImages and loadProperties use a key a theme_experiment declares)
  it("takes a theme key outside the named ones with the value type the schema gives it", () => {
    const manifest = namespace("manifest", {
      types: {
        UnrecognizedProperty: { id: "UnrecognizedProperty", type: "any", deprecated: "An unexpected property was found in the WebExtension manifest." },
        ThemeColor: { id: "ThemeColor", choices: [{ type: "string" }, { type: "array", items: { type: "integer" } }] },
        ThemeType: {
          id: "ThemeType",
          type: "object",
          additionalProperties: { $ref: "UnrecognizedProperty" },
          properties: {
            images: {
              type: "object",
              optional: true,
              additionalProperties: { type: "string" },
              properties: { additional_backgrounds: { type: "array", optional: true, items: { type: "string" } } },
            },
            colors: {
              type: "object",
              optional: true,
              additionalProperties: { $ref: "ThemeColor" },
              properties: { frame: { $ref: "ThemeColor", optional: true } },
            },
            properties: {
              type: "object",
              optional: true,
              additionalProperties: { type: "string" },
              properties: {
                color_scheme: { type: "string", optional: true, enum: ["light", "dark"] },
                additional_backgrounds_tiling: { type: "array", optional: true, items: { type: "string", enum: ["repeat"] } },
              },
            },
          },
        },
      },
    });
    const theme = namespace("theme", {
      functions: {
        getCurrent: { name: "getCurrent", type: "function", async: true, parameters: [] },
        update: { name: "update", type: "function", async: true, parameters: [{ name: "details", $ref: "manifest.ThemeType" }] },
      },
    });
    const { status, output } = compile(
      { manifest, theme },
      `import { browser } from "./index.js";

export async function experiment() {
    await browser.theme.update({
        colors: { frame: "red", experiment_color: [0, 0, 0] },
        images: { additional_backgrounds: ["a.png"], experiment_image: "b.png" },
        properties: { color_scheme: "dark", additional_backgrounds_tiling: ["repeat"], experiment_property: "x" },
    });
    // @ts-expect-error ThemeColor normalizes a string or an array, never a number
    await browser.theme.update({ colors: { experiment_color: 5 } });
    // @ts-expect-error the theme itself takes no other key
    await browser.theme.update({ experiment_section: {} });
    const current = await browser.theme.getCurrent();
    return current.colors?.["experiment_color"];
}
`
    );
    assert.equal(status, 0, output);
  });
});
