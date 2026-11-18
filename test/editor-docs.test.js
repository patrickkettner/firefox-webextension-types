// What an editor shows for the generated declarations, measured through the
// TypeScript language service: strike-through (suggestion diagnostics 6385
// and 6387 for @deprecated), hover text and signature help.
import { before, describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { API, typeScript } from "./helpers/typescript-versions.js";
import { languageService } from "./helpers/language-service.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const built = fs.existsSync(path.join(repoRoot, "dist/index.d.ts"));
const consumerPath = path.join(repoRoot, "test/editor-docs-consumer.ts");

// Each line is one probe. `/*@*/` marks the hover or signature help position.
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
browser.tabs./*@*/hide(1);
browser./*@*/tabs.remove(1);
browser.action.isEnabled(/*@*/1);
browser.tabs.create({ url: "x" });
browser.menus.create({ title: "x", command: "/*@*/" });
declare const focusFlag: boolean;
declare const createData: browser.windows.create.CreateData;
browser.windows.create({ /*@*/focused: false });
browser.windows.create({ /*@*/focused: true });
browser.windows.create({ /*@*/focused: focusFlag });
browser.windows.create({ /*@*/url: "x" });
browser.windows.create(/*@*/);
browser.windows.create(createData);
browser.windows.create({ /*@*/focused: false }, (window) => {});
browser.windows.create({ /*@*/focused: true }, (window) => {});
const theme = await browser.theme.getCurrent();
/*@*/theme;
const manifest = browser.runtime.getManifest();
manifest./*@*/options_ui;
const answeredByCallback: void = browser.runtime.sendMessage("hello", /*@*/(response) => {});
const sentToExtension: Promise<any> = browser.runtime.sendMessage("other@example", /*@*/{ kind: "ping" });
const sentWithOptions: Promise<any> = browser.runtime.sendMessage("hello", /*@*/{});
const sentToExtensionByCallback: void = browser.runtime.sendMessage("other@example", "hello", /*@*/(response) => {});
browser.windows./*@*/create;
browser.runtime.onMessage./*@*/addListener(() => {});
browser.tabs.onUpdated./*@*/addListener(() => {});
browser.runtime./*@*/requestUpdateCheck();
browser.devtools.inspectedWindow./*@*/eval("x");
declare const resource: browser.devtools.inspectedWindow.Resource;
resource./*@*/getContent();
declare const request: browser.devtools.network.Request;
request./*@*/getContent();
browser.omnibox.onInputChanged./*@*/addListener((text, suggest) => {});
manifest./*@*/content_security_policy;
manifest./*@*/permissions;
declare const contextType: browser.menus./*@*/ContextType;
declare const urlFilter: browser.events.UrlFilter;
urlFilter./*@*/ports;
browser.menus.create({ /*@*/command: "_execute_action" });
`;

let ts;
let service;

before(() => {
  if (!built) return;
  ts = createRequire(import.meta.url)(typeScript(API).api);
  const options = {
    strict: true,
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.NodeNext,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    lib: ["lib.es2022.d.ts", "lib.dom.d.ts"],
    noEmit: true,
  };
  service = languageService(ts, consumerPath, options, { [consumerPath]: consumer });
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

function typeHover(lineText) {
  const info = service.getQuickInfoAtPosition(consumerPath, probe(lineText));
  assert.ok(info, `no quick info for ${lineText}`);
  return ts.displayPartsToString(info.displayParts);
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
      [
        "create",
        "ftpProtocolEnabled",
        "getContent",
        "getURL",
        "isUntrusted",
        "lastError",
        "providers",
        "removeAppcache",
        "requestUpdateCheck",
        "windowTypes",
      ]
    );
  });

  // TypeScript: a call that resolves to an overload tagged @deprecated is reported as 6387, a tag inside a union is ignored
  // Firefox: windows.json (windows.create focused: the choice false is deprecated), Schemas.sys.mjs (checkDeprecated)
  it("strikes through a call that passes the deprecated literal, and no other call", () => {
    const calls = [...consumer.matchAll(/^browser\.windows\.create\(.*$/gm)];
    const struck = new Set(
      service
        .getSuggestionDiagnostics(consumerPath)
        .filter((d) => d.code === 6387)
        .map((d) => consumer.slice(0, d.start).split("\n").length)
    );
    const lineOf = (m) => consumer.slice(0, m.index).split("\n").length;
    assert.deepEqual(
      calls.filter((m) => struck.has(lineOf(m))).map((m) => m[0]),
      ["browser.windows.create({ /*@*/focused: false });", "browser.windows.create({ /*@*/focused: false }, (window) => {});"]
    );
    assert.equal(calls.length, 8);
  });

  // TypeScript: hover shows the JSDoc of the property
  // Firefox: windows.json (windows.create focused: the choice false is deprecated)
  it("says in the hover of the property which literal is deprecated", () => {
    const { doc } = hover("browser.windows.create({ /*@*/focused: false });");
    assert.ok(
      doc.includes("`false` is deprecated: Opening inactive windows is not supported."),
      doc
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
      removeAppcache.tags.includes("deprecated:Firefox does not support this function. It does not exist at runtime."),
      removeAppcache.tags.join("\n")
    );

    const query = hover("browser.tabs./*@*/query({});");
    assert.ok(query.tags.some((t) => t.startsWith("see:https://searchfox.org/")), query.tags.join("\n"));

    const help = service.getSignatureHelpItems(consumerPath, probe("browser.tabs.duplicate(/*@*/1);"), {});
    const param = help.items[help.selectedItemIndex].parameters[0];
    assert.equal(param.name, "tabId");
    assert.equal(ts.displayPartsToString(param.documentation), "The ID of the tab which is to be duplicated.");
  });

  // TypeScript: hover shows the tags of the symbol under the cursor only
  // Firefox: tabs.json (browser and mobile, hide only in browser)
  it("shows @platform on a namespace, and on a member only when its targets differ", () => {
    const tabs = hover("browser./*@*/tabs.remove(1);");
    assert.ok(tabs.tags.includes("platform:desktop, mobile"), tabs.tags.join("\n"));
    assert.ok(!hover("browser.tabs./*@*/query({});").tags.some((t) => t.startsWith("platform:")));
    assert.ok(hover("browser.tabs./*@*/hide(1);").tags.includes("platform:desktop"));
  });

  // TypeScript: no hover or signature help shows a comment in front of a union member
  // Firefox: browser_action.json (isEnabled details is Details or an integer tab id)
  it("documents the choices of a parameter in its @param", () => {
    const help = service.getSignatureHelpItems(consumerPath, probe("browser.action.isEnabled(/*@*/1);"), {});
    const param = help.items[help.selectedItemIndex].parameters[0];
    assert.equal(param.name, "details");
    assert.match(ts.displayPartsToString(param.documentation), /`number`: The id of the tab for which you want to query its enabled state\./);
  });

  // TypeScript: a comment on a parameter of a function type shows in no hover or signature help
  // Firefox: runtime.json (requestUpdateCheck), devtools_inspected_window.json (eval, Resource.getContent), devtools_network.json (Request.getContent), omnibox.json (onInputChanged suggest)
  it("documents each value a callback receives in @returns, and the parameters of a listener's function parameter in its @param", () => {
    const returns = (lineText) => hover(lineText).tags.find((t) => t.startsWith("returns:")) ?? "";
    assert.match(returns("browser.runtime./*@*/requestUpdateCheck();"), /`status`: Result of the update check\.\n- `details`: If an update is available/);
    assert.match(returns('browser.devtools.inspectedWindow./*@*/eval("x");'), /`result`: The result of evaluation\.\n- `exceptionInfo`: An object providing details/);
    assert.match(returns("resource./*@*/getContent();"), /`content`: Content of the resource \(potentially encoded\)\.\n- `encoding`: Empty if content is not encoded/);
    assert.match(returns("request./*@*/getContent();"), /`content`: Content of the response body \(potentially encoded\)\.\n- `encoding`: /);
    const onInputChanged = hover("browser.omnibox.onInputChanged./*@*/addListener");
    assert.ok(
      onInputChanged.tags.some((t) => t.startsWith("param:suggest ") && t.includes("\n- `suggestResults`: Array of suggest results")),
      onInputChanged.tags.join("\n")
    );
  });

  // TypeScript: no hover shows a comment inside a union or in front of an array element type
  // Firefox: manifest.json (content_security_policy and permissions choices by manifest version), menus.json (ContextType browser_action and action, command internal commands), events.json (UrlFilter ports items are a port or a range)
  it("documents the choices of a property or type alias where its hover shows them", () => {
    const csp = hover("manifest./*@*/content_security_policy;").doc;
    assert.match(csp, /- `string`: Only available in manifest_version 2 or earlier\.\n- `object`: Requires manifest_version 3 or later\./);
    assert.match(hover("manifest./*@*/permissions;").doc, /- `PermissionOrOrigin\[\]`: Only available in manifest_version 2 or earlier\./);
    assert.match(hover("declare const contextType: browser.menus./*@*/ContextType;").doc, /- `"browser_action"`: Only available in manifest_version 2 or earlier\.\n- `"action"`: Requires manifest_version 3 or later\./);
    assert.match(hover("urlFilter./*@*/ports;").doc, /- `number`: A specific port\.\n- `\[number, number\]`: A pair of integers/);
    assert.match(hover('browser.menus.create({ /*@*/command: "_execute_action" });').doc, /`"_execute_action"`, `"_execute_page_action"`, `"_execute_sidebar_action"`: Manifest V3 supports internal commands/);
  });

  // TypeScript: completion details show the comment of the first overload, and hover on a method shows the comment of the method, not of the object that holds it
// Firefox: windows.json (windows.create, the choice false of focused is deprecated), runtime.json (onMessage), tabs.json (onUpdated and its filter)
describe("completion and addListener docs", { skip: !built && "dist not built" }, () => {
  it("shows the windows.create description in completion, with the deprecation only on the overload that takes it", () => {
    const at = probe("browser.windows./*@*/create;");
    const entry = service.getCompletionsAtPosition(consumerPath, at, {}).entries.find((e) => e.name === "create");
    assert.doesNotMatch(entry.kindModifiers, /deprecated/);
    const details = service.getCompletionEntryDetails(consumerPath, at, "create", {}, undefined, undefined, entry.data);
    const description = "Creates (opens) a new browser with any optional sizing, position or default URL provided.";
    assert.equal(ts.displayPartsToString(details.documentation), description);

    const deprecated = hover("browser.windows.create({ /*@*/focused: false });");
    const call = (lineText) => {
      const info = service.getQuickInfoAtPosition(consumerPath, consumer.indexOf(lineText) + "browser.windows.".length);
      return { doc: ts.displayPartsToString(info.documentation), tags: (info.tags || []).map((t) => t.name) };
    };
    assert.ok(deprecated.doc.includes("`false` is deprecated"), deprecated.doc);
    assert.deepEqual(call("browser.windows.create({ /*@*/url: \"x\" });"), {
      doc: description,
      tags: ["param", "returns", "see"],
    });
    assert.equal(call("browser.windows.create({ /*@*/focused: false });").doc, description);
    assert.ok(call("browser.windows.create({ /*@*/focused: false });").tags.includes("deprecated"));
  });

  it("shows the event description and its parameter docs on addListener", () => {
    const onMessage = hover("browser.runtime.onMessage./*@*/addListener");
    assert.equal(onMessage.doc, "Fired when a message is sent from either an extension process or a content script.");
    assert.ok(onMessage.tags.includes("param:message The message sent by the calling script."), onMessage.tags.join("\n"));

    const onUpdated = hover("browser.tabs.onUpdated./*@*/addListener");
    assert.equal(onUpdated.doc, "Fired when a tab is updated.");
    assert.ok(onUpdated.tags.includes("param:tab Gives the state of the tab that was updated."), onUpdated.tags.join("\n"));
    assert.ok(onUpdated.tags.some((t) => t.startsWith("param:filter ")), onUpdated.tags.join("\n"));
  });
});

// TypeScript: signature help names the parameters of the overload a call resolves to
// Firefox: ext-runtime.js (parseBonkersArgs pops a trailing function as the callback, reads one argument as the message, and two as message and options only when the second is null, undefined or empty), Schemas.sys.mjs (checkParameters leaves an ambiguous call to the implementation)
describe("runtime.sendMessage overloads", { skip: !built && "dist not built" }, () => {
  const resolved = (lineText) => {
    const help = service.getSignatureHelpItems(consumerPath, probe(lineText), {});
    return help.items[help.selectedItemIndex].parameters.map((p) => p.name);
  };

  it("reads a string and a function as the message and its callback", () => {
    assert.deepEqual(resolved('sendMessage("hello", /*@*/(response)'), ["message", "responseCallback"]);
  });

  it("reads a string and an object with keys as extensionId and message, and an empty object as options", () => {
    assert.deepEqual(resolved('sendMessage("other@example", /*@*/{ kind: "ping" })'), ["extensionId", "message", "options"]);
    assert.deepEqual(resolved('sendMessage("hello", /*@*/{})'), ["message", "options"]);
    assert.deepEqual(resolved('sendMessage("other@example", "hello", /*@*/(response)'), [
      "extensionId",
      "message",
      "responseCallback",
    ]);
  });
});

// TypeScript: hover prints an intersection of mapped types as `A & B`, an empty one included
  // Firefox: ext-theme.js (getCurrent hands back the normalized theme), Extension.sys.mjs (parseManifest sets options_ui.browser_style)
  it("shows a normalized value as one object, split in two only where Firefox fills keys in", () => {
    const theme = typeHover("/*@*/theme;");
    assert.ok(
      theme.startsWith(
        "const theme: {\n    colors?: {\n        [x: string]: browser.manifest.ThemeColor | null;\n        accentcolor?: browser.manifest.ThemeColor | null | undefined;\n"
      ),
      theme
    );
    assert.doesNotMatch(theme, /\{\} &/);

    const optionsUi = typeHover("manifest./*@*/options_ui;");
    assert.ok(optionsUi.startsWith("(property) options_ui?: ({\n    browser_style: boolean;\n} & {\n"), optionsUi);
    assert.match(optionsUi, /\n    page: browser\.manifest\.ExtensionURL;\n\}\) \| null \| undefined$/);
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
