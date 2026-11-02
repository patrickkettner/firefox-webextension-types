import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { findStringComparisons } from "./helpers/api-name-lint.js";
import { HAND_COPIED_RULES } from "../src/overrides.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FILES = ["src/emitter.js", "src/overload-resolver.js", "src/schema-loader.js"];

// A literal the generator may compare against. Everything else is treated as
// an API name, which belongs in src/overrides.js with Firefox evidence.
// `rule` names the HAND_COPIED_RULES entry that carries the Firefox evidence.
const ALLOWED = [
  // JavaScript typeof results.
  ...["object", "string", "number", "boolean", "function"].map((literal) => ({ literal, why: "typeof result or schema type kind" })),
  // Schema type kinds and the sentinel types the emitter builds. Schemas.sys.mjs defines the kinds.
  ...["integer", "null", "any", "array", "void", "unknown"].map((literal) => ({ literal, why: "schema type kind or emitted TypeScript keyword" })),
  // Which node a comparison reads, not what an API is called.
  ...["member", "namespace", "event", "type", "attribute"].map((literal) => ({ literal, why: "internal node kind" })),
  // Build targets and emit modes, set by generate.js.
  ...["desktop", "mobile", "ambient", "chrome", "ambient-chrome"].map((literal) => ({ literal, why: "build target or emit mode" })),
  // The async flag and callback names Schemas.sys.mjs FunctionEntry reads.
  ...["callback", "responseCallback"].map((literal) => ({ literal, why: "schema async flag and callback parameter name" })),
  // TypeScript reserved words: a strict-mode declaration cannot be called eval.
  { literal: "eval", why: "TypeScript reserved binding name, emitted as _eval" },
  // Text the emitter itself produced.
  ...[" | ", "| null", '"', "[", "{", ".", "//"].map((literal) => ({ literal, why: "emitted TypeScript text, or the JSON and // comment syntax of schema files" })),
  // Parameter naming that applies to any schema: a parameter named after its type gets a short name.
  ...["Request", "Options", "Details", "Info"].map((literal) => ({ literal, why: "generated parameter name, any API" })),
  // Firefox constants copied into the emitter, each backed by evidence in src/overrides.js.
  { literal: "content_child", rule: "injection.content_child needs content" },
  { literal: "devtools_child", rule: "injection.devtools_child needs devtools" },
  { literal: "addon_child", rule: "injection.envTypes" },
  { literal: "content", rule: "injection.content_child needs content" },
  { literal: "devtools", rule: "injection.devtools_child needs devtools" },
  { literal: "devtools_only", rule: "injection.devtools_only stays in devtools" },
  { literal: "content_only", rule: "injection.content_only stays in content" },
  { literal: String.raw`^[1-9]\\d*$`, rule: "object.numericKeys" },
];

const allowed = new Map(ALLOWED.map((entry) => [entry.literal, entry]));

// Tooling: a lint over src/, no declaration text is asserted.
describe("API names stay out of the generator", () => {
  it("finds a comparison against a namespace name", () => {
    const hits = findStringComparisons('if (nsName === "webRequest") {}\nif (nsName.includes("webRequest")) {}\n');
    assert.deepEqual(hits, [
      { line: 1, literal: "webRequest" },
      { line: 2, literal: "webRequest" },
    ]);
  });

  it("finds each form of comparison", () => {
    const source = [
      'if ("tabs" === ns) {}',
      'switch (n) { case "eval": break; }',
      'if (["a", "b"].includes(n)) {}',
      'if (n.startsWith("on")) {}',
      "if (set.has('x')) {}",
    ].join("\n");
    assert.deepEqual(
      findStringComparisons(source).map((h) => h.literal),
      ["tabs", "eval", "a", "b", "on", "x"]
    );
  });

  it("ignores comments and unrelated strings", () => {
    const source = '// ns === "webRequest"\n/* x === "tabs"\n   y === "menus" */\nconst s = "a // b";\nconst t = `${x}`;\n';
    assert.deepEqual(findStringComparisons(source), []);
  });

  it("allows a literal only when the allow list says why", () => {
    for (const entry of ALLOWED) assert.ok(entry.why || entry.rule, `${entry.literal} needs a reason`);
    for (const entry of ALLOWED.filter((e) => e.rule)) {
      assert.ok(entry.rule in HAND_COPIED_RULES, `${entry.literal}: HAND_COPIED_RULES has no rule ${entry.rule}`);
    }
  });

  for (const rel of FILES) {
    it(`${rel} compares against no API name`, () => {
      const source = fs.readFileSync(path.join(root, rel), "utf8");
      const failures = findStringComparisons(source)
        .filter((hit) => !allowed.has(hit.literal))
        .map(
          (hit) =>
            `${rel}:${hit.line} compares with ${JSON.stringify(hit.literal)}. An API name belongs in a table in src/overrides.js with Firefox evidence. If it is a TypeScript reserved word or a schema structural name, add it to ALLOWED in test/api-name-lint.test.js with the reason.`
        );
      assert.deepEqual(failures, []);
    });
  }

  it("every allowed literal is still compared somewhere", () => {
    const used = new Set(
      FILES.flatMap((rel) => findStringComparisons(fs.readFileSync(path.join(root, rel), "utf8")).map((h) => h.literal))
    );
    const stale = ALLOWED.filter((e) => !used.has(e.literal)).map((e) => e.literal);
    assert.deepEqual(stale, [], `remove these from ALLOWED in test/api-name-lint.test.js: ${stale.join(", ")}`);
  });
});
