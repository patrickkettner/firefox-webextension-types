// Reads small chrome declaration files whose members are aliases of a
// browser file, and checks what the extractor takes from the browser file
// and which aliases it rejects.

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, describe, it } from "node:test";

import { extractSymbolsFromDts } from "../src/ast-symbol-extractor.js";

const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fwt-alias-"));
after(() => fs.rmSync(dir, { recursive: true, force: true }));

const write = (name, text) => {
  fs.writeFileSync(path.join(dir, name), text);
  return path.join(dir, name);
};

const source = extractSymbolsFromDts(
  write(
    "browser.d.ts",
    "export namespace browser {\n  export namespace alarms {\n    export const onAlarm: WebExtensionEvent<() => void>;\n  }\n" +
      "  export namespace tabs {\n    export interface Tab { id: number; url: string }\n    export function remove(tabId: number): void;\n" +
      "    export const onCreated: WebExtensionEvent<() => void>;\n  }\n}\n"
  )
);

const chrome = (body) => extractSymbolsFromDts(write("chrome.d.ts", `export namespace chrome {\n${body}\n}\n`), source);

// Tooling: chrome declarations written as aliases of browser ones
describe("aliases of browser declarations", () => {
  it("takes an aliased namespace, member and interface base from the browser file", () => {
    const out = chrome(
      "  export import alarms = browser.alarms;\n  export namespace tabs {\n" +
        "    export interface Tab extends Omit<browser.tabs.Tab, \"url\"> { url: string | undefined }\n" +
        "    export import onCreated = browser.tabs.onCreated;\n    export function remove(tabId: number, callback: () => void): void;\n  }"
    );
    assert.deepEqual(out.aliasErrors, []);
    assert.ok(out.namespaces.get("alarms").events.has("onAlarm"));
    const tabs = out.namespaces.get("tabs");
    assert.ok(tabs.events.has("onCreated"));
    assert.deepEqual([...tabs.types.get("Tab").properties.keys()].sort(), ["id", "url"]);
    assert.equal(tabs.types.get("Tab").properties.get("url").type, "string | undefined");
  });

  it("rejects an alias or base that names another path", () => {
    const out = chrome(
      "  export import alarms = browser.tabs;\n  export namespace tabs {\n" +
        "    export interface Tab extends browser.alarms.Tab {}\n    export import onCreated = browser.alarms.onAlarm;\n  }"
    );
    assert.equal(out.aliasErrors.length, 3, out.aliasErrors.join("\n"));
    assert.match(out.aliasErrors.join("\n"), /alarms \(line 2\) aliases browser\.tabs, not browser\.alarms\./);
  });

  it("rejects an alias to something the browser file does not declare", () => {
    const out = chrome("  export namespace tabs {\n    export import onRemoved = browser.tabs.onRemoved;\n  }");
    assert.match(out.aliasErrors.join("\n"), /aliases browser\.tabs\.onRemoved, which browser\.d\.ts does not declare/);
  });

  it("leaves out a member an Omit base drops and the interface does not declare again", () => {
    const out = chrome("  export namespace tabs {\n    export interface Tab extends Omit<browser.tabs.Tab, \"url\"> {}\n  }");
    assert.deepEqual([...out.namespaces.get("tabs").types.get("Tab").properties.keys()], ["id"]);
  });
});
