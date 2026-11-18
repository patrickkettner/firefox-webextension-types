// Every markup form that occurs in a schema description or deprecation string
// must be one the doc renderer treats explicitly. A new form in a Firefox
// schema fails here with the form and a file it occurs in, so someone decides
// what it should render as before it ships as raw text in a hover.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { renderDocText } from "../src/emitter.js";
import {
  collectDocStrings,
  describeUnknown,
  inventoryOf,
  unknownForms,
} from "./helpers/markup-inventory.js";
import { firefoxRoot, skipFirefox } from "./helpers/firefox-root.js";

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
  "&mdash;": ["a &mdash; b", "a, b"],
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

const MARKUP_TAGS = Object.keys(HANDLED_MARKUP).filter((f) => f.startsWith("<")).map((f) => f.slice(1, -1));
const BARE_MARKUP_TAG = new RegExp(`</?(?:${MARKUP_TAGS.join("|")})\\s*/?>`);

const segments = (text, inside) => text.split("`").filter((_, i) => i % 2 === (inside ? 1 : 0));

const DIST = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "dist");
const distDeclarations = () =>
  fs
    .readdirSync(DIST)
    .filter((f) => /\.d\.c?ts$/.test(f))
    .map((f) => ({ file: f, text: fs.readFileSync(path.join(DIST, f), "utf8") }));

// Tooling: the table is this repository's renderer contract, no generated declaration text is asserted
describe("description markup inventory", () => {
  it("renderDocText gives each handled form the Markdown this table says", () => {
    for (const [form, [input, expected]] of Object.entries({ ...HANDLED_MARKUP, ...LITERAL_TOKENS })) {
      assert.equal(renderDocText(input), expected, `${form}: ${JSON.stringify(input)}`);
    }
  });

  it("renders a <code> closed by a second <code> as one code span", () => {
    assert.equal(renderDocText("its value is always <code>false<code>."), "its value is always `false`.");
  });

  it("dist/ has no markup tag inside backticks and no em dash", () => {
    const bad = [];
    for (const { file, text } of distDeclarations()) {
      text.split("\n").forEach((line, i) => {
        if (line.includes("\u2014")) bad.push(`${file}:${i + 1} em dash: ${line.trim().slice(0, 120)}`);
        if (segments(line, true).some((s) => BARE_MARKUP_TAG.test(s))) {
          bad.push(`${file}:${i + 1} markup tag in backticks: ${line.trim().slice(0, 120)}`);
        }
      });
    }
    assert.deepEqual(bad, [], bad.join("\n"));
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
  describe("schemas", { skip: skipFirefox }, () => {
    const strings = firefoxRoot ? collectDocStrings(firefoxRoot) : [];
    const forms = inventoryOf(strings);

    it("every markup form in a description is one renderDocText handles", () => {
      const unknown = unknownForms(forms, HANDLED);
      assert.deepEqual(unknown, [], `Unhandled markup in schema descriptions:\n${describeUnknown(unknown)}`);
    });

    it("no rendered description keeps raw $( markup, an entity or a markup tag, in backticks or out", () => {
      const leftover = new RegExp(`\\$\\(|&#?\\w+;|</?(?:${MARKUP_TAGS.join("|")})[\\s>/]`);
      const bad = [];
      for (const { text, file } of strings) {
        const rendered = renderDocText(text);
        const outside = segments(rendered, false).join("");
        if (leftover.test(outside) || segments(rendered, true).some((s) => BARE_MARKUP_TAG.test(s))) {
          bad.push(`${file}: ${JSON.stringify(rendered.slice(0, 120))}`);
        }
      }
      assert.deepEqual(bad, [], `renderDocText left raw markup in:\n${bad.join("\n")}`);
    });
  });
});
