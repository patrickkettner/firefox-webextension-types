import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { checkSource, firefoxFileIndex, listTestFiles } from "./helpers/citations.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const firefoxRoot = process.env.TOPSRCDIR || process.env.MOZ_TOPSRCDIR || process.env.MOZILLA_CENTRAL;

// Tooling: the check on this repository's own tests, no declaration text is asserted.
describe("test citations", () => {
  const sample = (comment) => `${comment}\nit("x", () => {});\n`;

  it("fails a test that names no basis and says what to add", () => {
    const [failure] = checkSource("t.js", sample(""));
    assert.match(failure, /^t\.js:2: this test names no basis\. Add a comment above it/);
  });

  it("accepts a basis above the test, above its describe, or at the top of the file", () => {
    assert.deepEqual(checkSource("t.js", sample("// TypeScript: tuples are fixed length")), []);
    assert.deepEqual(checkSource("t.js", `// Tooling: a header\nit("x", () => {});\n`), []);
    const nested = '// Packaging: exports map\ndescribe("d", () => {\n  it("x", () => {});\n});\n';
    assert.deepEqual(checkSource("t.js", `import x from "y";\n${nested}`), []);
  });

  it("does not let a describe's basis leak to the next describe", () => {
    const text = '// Tooling: first\ndescribe("a", () => {\n  it("x", () => {});\n});\n\ndescribe("b", () => {\n  it("y", () => {});\n});\n';
    const failures = checkSource("t.js", `import x from "y";\n${text}`);
    assert.equal(failures.length, 1);
    assert.match(failures[0], /t\.js:8/);
  });

  it("fails a Firefox basis that names no file", () => {
    const [failure] = checkSource("t.js", sample("// Firefox: the schema says so"));
    assert.match(failure, /the "Firefox:" basis names no file/);
  });

  it("fails a Firefox file that is not in the checkout", () => {
    const exists = (file) => file === "Schemas.sys.mjs";
    assert.deepEqual(checkSource("t.js", sample("// Firefox: Schemas.sys.mjs (ObjectType)"), { fileExists: exists }), []);
    const [failure] = checkSource("t.js", sample("// Firefox: Gone.sys.mjs"), { fileExists: exists });
    assert.match(failure, /cites Gone\.sys\.mjs, which is not in the Firefox checkout/);
  });

  it("reads a Firefox basis that continues on the next comment line", () => {
    const text = "// Firefox: Schemas.sys.mjs,\n// tabs.json\n";
    const seen = [];
    checkSource("t.js", sample(text), { fileExists: (f) => (seen.push(f), true) });
    assert.deepEqual(seen, ["Schemas.sys.mjs", "tabs.json"]);
  });

  for (const rel of listTestFiles(root)) {
    it(`${rel} names a basis for every test`, () => {
      assert.deepEqual(checkSource(rel, fs.readFileSync(path.join(root, rel), "utf8")), []);
    });
  }

  it("every Firefox file the tests cite exists", { skip: !firefoxRoot && "no Firefox checkout: set TOPSRCDIR" }, () => {
    const names = firefoxFileIndex(firefoxRoot);
    const fileExists = (f) => (f.includes("/") ? fs.existsSync(path.join(firefoxRoot, f)) : names.has(f));
    const failures = listTestFiles(root).flatMap((rel) =>
      checkSource(rel, fs.readFileSync(path.join(root, rel), "utf8"), { fileExists })
    );
    assert.deepEqual(failures, []);
  });
});
