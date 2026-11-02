// Every markup form that occurs in a schema description or deprecation string
// must be one the doc renderer treats explicitly. A new form in a Firefox
// schema fails here with the form and a file it occurs in, so someone decides
// what it should render as before it ships as raw text in a hover.
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { renderDocText } from "../src/emitter.js";
import {
  collectDocStrings,
  describeUnknown,
  firefoxRootFromEnv,
  inventoryOf,
  unknownForms,
} from "./helpers/markup-inventory.js";

// form -> [input, what renderDocText gives for it]
const HANDLED_MARKUP = {
  "$(ref:)": ["$(ref:tabs.Tab)", "{@link browser.tabs.Tab}"],
  "$(topic:)": ["$(topic:current-window)[current window]", "current window"],
  "<a>": ['<a href="https://e.com/x">e</a>', "[e](https://e.com/x)"],
  "<b>": ["<b>x</b>", "**x**"],
  "<strong>": ["<strong>x</strong>", "**x**"],
  "<em>": ["<em>x</em>", "_x_"],
  "<i>": ["<i>x</i>", "_x_"],
  "<code>": ["<code>x</code>", "`x`"],
  "<var>": ["<var>x</var>", "`x`"],
  "<p>": ["<p>a</p><p>b</p>", "a\n\nb"],
  "<br>": ["a<br>b", "a\nb"],
  "<ul>": ["<ul><li>a</li></ul>", "- a"],
  "<ol>": ["<ol><li>a</li></ol>", "- a"],
  "<li>": ["<ul><li>a</li><li>b</li></ul>", "- a\n- b"],
  "<dl>": ["<dl><dt>k</dt><dd>v</dd></dl>", "- `k`: v"],
  "<dt>": ["<dl><dt>k</dt><dd>v</dd></dl>", "- `k`: v"],
  "<dd>": ["<dl><dt>k</dt><dd>v</dd></dl>", "- `k`: v"],
  "&lt;": ["a &lt;b", "a <b"],
  "&gt;": ["a &gt; b", "a > b"],
  "&mdash;": ["a &mdash; b", "a — b"],
  "&ndash;": ["a &ndash; b", "a – b"],
  "&hellip;": ["a&hellip;", "a…"],
  "&quot;": ["&quot;a&quot;", '"a"'],
  "&amp;": ["a &amp; b", "a & b"],
  "&nbsp;": ["a&nbsp;b", "a b"],
  "&#39;": ["a&#39;b", "a'b"],
};

// Tag-like text that the schemas write as literal words, not markup. The
// renderer keeps it visible by wrapping it in backticks.
const LITERAL_TOKENS = {
  "<all_urls>": ["match <all_urls> here", "match `<all_urls>` here"],
  "<pref_branch>": ["stored in <pref_branch>.enabled", "stored in `<pref_branch>`.enabled"],
  "<webview>": ["identifies the <webview> of a call", "identifies the `<webview>` of a call"],
  "<dim>": ["<dim>x</dim>", "`<dim>`x`</dim>`"],
  "<match>": ["<match>x</match>", "`<match>`x`</match>`"],
};

const HANDLED = new Set([...Object.keys(HANDLED_MARKUP), ...Object.keys(LITERAL_TOKENS)]);

const firefoxRoot = firefoxRootFromEnv();

// Tooling: the table is this repository's renderer contract, no generated declaration text is asserted
describe("description markup inventory", () => {
  it("renderDocText gives each handled form the Markdown this table says", () => {
    for (const [form, [input, expected]] of Object.entries({ ...HANDLED_MARKUP, ...LITERAL_TOKENS })) {
      assert.equal(renderDocText(input), expected, `${form}: ${JSON.stringify(input)}`);
    }
  });

  it("reports a form the table does not list, naming it and where it occurs", () => {
    const forms = inventoryOf([
      { text: "see $(url:x) and <blink>this</blink> &copy;", file: "toolkit/components/extensions/schemas/fake.json" },
    ]);
    const message = describeUnknown(unknownForms(forms, HANDLED));
    for (const form of ["$(url:)", "<blink>", "&copy;"]) assert.ok(message.includes(form), message);
    assert.ok(message.includes("fake.json"), message);
  });

  // Firefox: tabs.json, manifest.json (schema descriptions, which carry the markup forms)
  describe("schemas", { skip: !firefoxRoot && "no Firefox checkout: set TOPSRCDIR" }, () => {
    const strings = firefoxRoot ? collectDocStrings(firefoxRoot) : [];
    const forms = inventoryOf(strings);

    it("every markup form in a description is one renderDocText handles", () => {
      const unknown = unknownForms(forms, HANDLED);
      assert.deepEqual(unknown, [], `Unhandled markup in schema descriptions:\n${describeUnknown(unknown)}`);
    });

    it("no rendered description keeps raw $( markup, an entity or a markup tag outside backticks", () => {
      const markupTags = Object.keys(HANDLED_MARKUP).filter((f) => f.startsWith("<")).map((f) => f.slice(1, -1));
      const leftover = new RegExp(`\\$\\(|&#?\\w+;|</?(?:${markupTags.join("|")})[\\s>/]`);
      const bad = [];
      for (const { text, file } of strings) {
        const rendered = renderDocText(text);
        const outsideCode = rendered.split("`").filter((_, i) => i % 2 === 0).join("");
        if (leftover.test(outsideCode)) bad.push(`${file}: ${JSON.stringify(rendered.slice(0, 120))}`);
      }
      assert.deepEqual(bad, [], `renderDocText left raw markup in:\n${bad.join("\n")}`);
    });
  });
});
