// What an editor shows for the generated declarations, measured through the
// TypeScript language service: strike-through (suggestion diagnostics 6385
// and 6387 for @deprecated), hover text and signature help.
import { before, describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { installTypeScript } from "./helpers/install-typescript.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const built = fs.existsSync(path.join(repoRoot, "dist/index.d.ts"));
const consumerPath = path.join(repoRoot, "test/editor-docs-consumer.ts");

// Each line is one probe; `/*@*/` marks the hover or signature help position.
const consumer = `import { browser } from "../dist/index.js";
browser.extension./*@*/lastError;
browser.browsingData./*@*/removeAppcache({});
browser.browserSettings./*@*/ftpProtocolEnabled;
browser.extension./*@*/getURL("x");
declare const info: browser.webRequest.SecurityInfo;
info./*@*/isUntrusted;
declare const getInfo: browser.windows.GetInfo;
getInfo./*@*/windowTypes;
declare const topSitesOptions: browser.topSites.get.Options;
topSitesOptions./*@*/providers;
browser.topSites.get({ /*@*/providers: ["activityStream"] });
browser.tabs.query({ /*@*/active: true });
browser./*@*/alarms.clear("x");
browser.tabs./*@*/TAB_ID_NONE;
browser.tabs.duplicate(/*@*/1);
browser.tabs./*@*/query({});
browser.tabs.create({ url: "x" });
browser.menus.create({ title: "x", command: "/*@*/" });
`;

let ts;
let service;

before(() => {
  if (!built) return;
  ts = createRequire(import.meta.url)(installTypeScript("5.9.3").api);
  const options = {
    strict: true,
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.NodeNext,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    lib: ["lib.es2022.d.ts", "lib.dom.d.ts"],
    noEmit: true,
  };
  const host = {
    getScriptFileNames: () => [consumerPath],
    getScriptVersion: () => "1",
    getScriptSnapshot: (file) => {
      const text = file === consumerPath ? consumer : fs.existsSync(file) ? fs.readFileSync(file, "utf8") : undefined;
      return text === undefined ? undefined : ts.ScriptSnapshot.fromString(text);
    },
    getCurrentDirectory: () => repoRoot,
    getCompilationSettings: () => options,
    getDefaultLibFileName: (o) => ts.getDefaultLibFilePath(o),
    fileExists: (file) => file === consumerPath || ts.sys.fileExists(file),
    readFile: (file) => (file === consumerPath ? consumer : ts.sys.readFile(file)),
    readDirectory: ts.sys.readDirectory,
    directoryExists: ts.sys.directoryExists,
    getDirectories: ts.sys.getDirectories,
  };
  service = ts.createLanguageService(host, ts.createDocumentRegistry());
});

function probe(lineText) {
  const start = consumer.indexOf(lineText);
  assert.ok(start >= 0, `probe line not found: ${lineText}`);
  const marker = consumer.indexOf("/*@*/", start);
  return marker + "/*@*/".length;
}

function hover(lineText) {
  const info = service.getQuickInfoAtPosition(consumerPath, probe(lineText));
  assert.ok(info, `no quick info for ${lineText}`);
  const doc = ts.displayPartsToString(info.documentation);
  const tags = (info.tags || []).map((t) => `${t.name}:${ts.displayPartsToString(t.text)}`);
  return { doc, tags };
}

// TypeScript: the language service reports @deprecated as suggestion diagnostics 6385 and 6387 and shows JSDoc in hover
// Firefox: browsing_data.json (removeAppcache is unsupported), extension.json (lastError is deprecated)
describe("editor documentation", { skip: !built && "dist not built" }, () => {
  it("compiles the probe file", () => {
    const errors = service.getSemanticDiagnostics(consumerPath).concat(service.getSyntacticDiagnostics(consumerPath));
    assert.deepEqual(errors.map((d) => ts.flattenDiagnosticMessageText(d.messageText, "\n")), []);
  });

  it("reports every deprecated kind as deprecated: property, function, type property, parameter member", () => {
    const deprecated = service
      .getSuggestionDiagnostics(consumerPath)
      .filter((d) => d.reportsDeprecated)
      .map((d) => consumer.slice(d.start, d.start + d.length));
    assert.deepEqual(
      [...new Set(deprecated)].sort(),
      ["ftpProtocolEnabled", "getURL", "isUntrusted", "lastError", "providers", "removeAppcache", "windowTypes"]
    );
  });

  it("shows member, namespace, constant and parameter docs", () => {
    assert.equal(hover("browser.tabs.query({ /*@*/active: true });").doc, "Whether the tabs are active in their windows.");

    const alarms = hover("browser./*@*/alarms.clear");
    assert.ok(alarms.doc.includes("Not available in content scripts or devtools pages."), alarms.doc);
    assert.ok(alarms.tags.includes("permission:alarms"), alarms.tags.join("\n"));

    assert.equal(hover("browser.tabs./*@*/TAB_ID_NONE;").doc, "An ID which represents the absence of a browser tab.");

    const providers = hover("browser.topSites.get({ /*@*/providers: [\"activityStream\"] });");
    assert.ok(
      providers.tags.some((t) => t.startsWith("deprecated:Please use the other options")),
      providers.tags.join("\n")
    );

    const removeAppcache = hover("browser.browsingData./*@*/removeAppcache({});");
    assert.ok(
      removeAppcache.tags.includes("deprecated:Firefox does not support this function; it does not exist at runtime."),
      removeAppcache.tags.join("\n")
    );

    const query = hover("browser.tabs./*@*/query({});");
    assert.ok(query.tags.includes("platform:desktop, mobile"), query.tags.join("\n"));
    assert.ok(query.tags.some((t) => t.startsWith("see:https://searchfox.org/")), query.tags.join("\n"));

    const help = service.getSignatureHelpItems(consumerPath, probe("browser.tabs.duplicate(/*@*/1);"), {});
    const param = help.items[help.selectedItemIndex].parameters[0];
    assert.equal(param.name, "tabId");
    assert.equal(ts.displayPartsToString(param.documentation), "The ID of the tab which is to be duplicated.");
  });
});

// TypeScript: string | "a" is reduced to string, which drops the literals from completion, and (string & {}) | "a" is not reduced
// Firefox: menus.json (command accepts any string and names the internal commands), Schemas.sys.mjs (ChoiceType accepts a value matching any choice)
describe("completion of open string unions", { skip: !built && "dist not built" }, () => {
  it("offers the literal values of a string that also accepts any other string", () => {
    const completions = service.getCompletionsAtPosition(consumerPath, probe('command: "/*@*/"'), {});
    const names = (completions?.entries || []).map((e) => e.name);
    assert.ok(names.includes("_execute_browser_action"), names.join(" "));
  });

  it("writes every union that mixes string with literals as (string & {})", () => {
    const offenders = [];
    for (const name of ["index.d.ts", "firefox-mobile.d.ts"]) {
      const file = path.join(repoRoot, "dist", name);
      const source = ts.createSourceFile(file, fs.readFileSync(file, "utf8"), ts.ScriptTarget.ES2022, true);
      const visit = (node) => {
        if (ts.isUnionTypeNode(node)) {
          const hasString = node.types.some((t) => t.kind === ts.SyntaxKind.StringKeyword);
          const hasLiteral = node.types.some((t) => ts.isLiteralTypeNode(t) && ts.isStringLiteral(t.literal));
          if (hasString && hasLiteral) {
            const { line } = source.getLineAndCharacterOfPosition(node.getStart());
            offenders.push(`${name}:${line + 1} ${node.getText().slice(0, 80)}`);
          }
        }
        ts.forEachChild(node, visit);
      };
      visit(source);
    }
    assert.deepEqual(offenders, []);
  });
});
