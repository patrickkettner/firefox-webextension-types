import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { apiNameHits, apiNames, literalTokens } from "./helpers/api-name-lint.js";
import { firefoxRoot, skipFirefox } from "./helpers/firefox-root.js";
import { HAND_COPIED_RULES } from "../src/overrides.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FILES = ["src/emitter.js", "src/overload-resolver.js", "src/schema-loader.js"];

// An API name the generator may write. Everything else belongs in
// src/overrides.js with Firefox evidence. `rule` names the HAND_COPIED_RULES
// entry that carries the evidence.
const ALLOWED = [
  { literal: "events", why: "the schema section a type's events live in, read by key" },
  { literal: "permissions", why: "the schema key, passed through to the JSDoc options" },
  { literal: "eval", why: "TypeScript reserved binding name, emitted as _eval" },
  { literal: "devtools", rule: "injection.devtools_child needs devtools" },
];

const allowed = new Map(ALLOWED.map((entry) => [entry.literal, entry]));
const describeHit = (rel, hit) =>
  `${rel}:${hit.line} writes ${JSON.stringify(hit.literal)} as a ${hit.kind}. An API name belongs in a table in src/overrides.js with Firefox evidence. If the generator has to know it, add it to ALLOWED in test/api-name-lint.test.js with the reason.`;

// Tooling: a lint over src/, no declaration text is asserted.
describe("API names stay out of the generator", () => {
  const names = new Set(["tabs", "webRequest", "Tab"]);
  const literals = (source) => apiNameHits(source, names).map((h) => h.literal);

  it("finds a comparison against a namespace name", () => {
    const hits = apiNameHits('if (nsName === "webRequest") {}\nif (nsName.includes("webRequest")) {}\n', names);
    assert.deepEqual(hits, [
      { line: 1, literal: "webRequest", kind: "string" },
      { line: 2, literal: "webRequest", kind: "string" },
    ]);
  });

  it("finds a name however the code spells it", () => {
    const spellings = {
      regex: "if (/^tabs$/.test(nsName)) {}",
      set: 'if (new Set(["tabs"]).has(nsName)) {}',
      constant: 'const T = "tabs";\nif (nsName === T) {}',
      array: 'const SPECIAL = [\n  "windows",\n  "tabs",\n];\nif (SPECIAL.includes(nsName)) {}',
      key: "const BY_NAME = { tabs: 1 };\nif (BY_NAME[nsName]) {}",
      template: "const t = `tabs`;",
      path: 'if (name === "tabs.Tab") {}',
    };
    for (const [how, source] of Object.entries(spellings)) {
      assert.deepEqual(literals(source), how === "path" ? ["tabs.Tab"] : ["tabs"], `${how}: ${source}`);
    }
  });

  it("ignores comments, prose and names that are not API names", () => {
    const source = [
      '// ns === "webRequest"',
      '/* x === "tabs"\n   y === "menus" */',
      'const s = "export namespace tabs {";',
      'const t = `${x}.tabs`;',
      'if (n.startsWith("on")) {}',
      "const re = /\\btab\\b/;",
    ].join("\n");
    assert.deepEqual(apiNameHits(source, names), []);
  });

  it("reads the words of a regular expression without its escapes", () => {
    assert.deepEqual(
      literalTokens("const re = /^\\d+(tabs|Tab)\\b$/;").map((t) => t.literal),
      ["tabs", "Tab"]
    );
  });

  it("allows a literal only when the allow list says why", () => {
    for (const entry of ALLOWED) assert.ok(entry.why || entry.rule, `${entry.literal} needs a reason`);
    for (const entry of ALLOWED.filter((e) => e.rule)) {
      assert.ok(entry.rule in HAND_COPIED_RULES, `${entry.literal}: HAND_COPIED_RULES has no rule ${entry.rule}`);
    }
  });

  // Firefox: every schema under toolkit, browser and mobile jar.mn (the names come from them)
  describe("against the Firefox schemas", { skip: skipFirefox }, () => {
    const apiNameSet = firefoxRoot ? apiNames(firefoxRoot) : new Set();
    const hitsIn = (rel) => apiNameHits(fs.readFileSync(path.join(root, rel), "utf8"), apiNameSet);

    it("knows the namespaces, functions, events and types", () => {
      for (const name of ["tabs", "query", "onUpdated", "Tab", "devtools", "panels", "lastError"]) {
        assert.ok(apiNameSet.has(name), `${name} missing from the API names`);
      }
    });

    for (const rel of FILES) {
      it(`${rel} writes no API name`, () => {
        const failures = hitsIn(rel)
          .filter((hit) => !allowed.has(hit.literal))
          .map((hit) => describeHit(rel, hit));
        assert.deepEqual(failures, []);
      });
    }

    it("every allowed literal is still written somewhere", () => {
      const used = new Set(FILES.flatMap((rel) => hitsIn(rel).map((h) => h.literal)));
      const stale = ALLOWED.filter((e) => !used.has(e.literal)).map((e) => e.literal);
      assert.deepEqual(stale, [], `remove these from ALLOWED in test/api-name-lint.test.js: ${stale.join(", ")}`);
    });
  });
});
