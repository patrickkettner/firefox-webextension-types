import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, before, describe, it } from "node:test";
import {
  REASONS,
  compareToBaseline,
  describeAdded,
  describeStale,
  describeUnclassified,
  loadBaseline,
  updatedBaseline,
} from "../corpus/baseline.js";
import { checkAgainstDeclarations, checkCorpus } from "../corpus/check.js";
import { extractCorpus } from "../corpus/extract.js";
import { normaliseMessage } from "../corpus/families.js";

const firefoxRoot = process.env.TOPSRCDIR || process.env.MOZ_TOPSRCDIR || process.env.MOZILLA_CENTRAL;

// A miniature Firefox tree and a declaration file small enough to read.
const TEST_FILE = "toolkit/components/extensions/test/xpcshell/test_fixture.js";
const FIXTURE_LINES = [
  "add_task(async function test_fixture() {",
  "  await ExtensionTestUtils.loadExtension({",
  "    background() {",
  "      browser.tabs.remove(1);",
  "    },",
  "  });",
  "});",
  "function helper(browser) {",
  "  browser.tabs.remove('not a number');",
  "}",
  "async function background() {",
  "  const [tab] = await browser.tabs.query({});",
  "  await browser.tabs.remove(tab.id);",
  "  const tabs = await browser.tabs.query({});",
  "  tabs.nope();",
  "  browser.test.assertRejects(browser.tabs.remove('x'), /bad/);",
  "  browser.tabs.remove(missingName);",
  "  browser.test.assertEq(1, tabs.length);",
  "}",
];
const FIXTURE_SOURCE = FIXTURE_LINES.join("\n");
const lineOf = (text) => FIXTURE_LINES.findIndex((line) => line.includes(text)) + 1;

const FIXTURE_DECLARATIONS = `
declare namespace browser {
    export namespace tabs {
        export interface Tab { id?: number }
        export function query(info: {}): Promise<Tab[]>;
        export function remove(tabId: number): Promise<void>;
    }
}
`;

describe("corpus extraction and checking on a fixture", () => {
  let dir;
  let result;
  before(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "fx-corpus-fixture-"));
    const root = path.join(dir, "firefox");
    fs.mkdirSync(path.dirname(path.join(root, TEST_FILE)), { recursive: true });
    fs.writeFileSync(path.join(root, TEST_FILE), FIXTURE_SOURCE);
    const declarations = path.join(dir, "declarations");
    fs.mkdirSync(declarations);
    fs.writeFileSync(path.join(declarations, "global.d.ts"), FIXTURE_DECLARATIONS);
    fs.writeFileSync(path.join(declarations, "global-chrome.d.ts"), "declare namespace chrome {}\n");
    fs.mkdirSync(path.join(dir, "work"));
    result = checkAgainstDeclarations(root, declarations, path.join(dir, "work"));
  });
  after(() => fs.rmSync(dir, { recursive: true, force: true }));

  it("reports an optional id passed where a number is required, at the Firefox line", () => {
    const family = result.families.get(
      "TS2345 Argument of type 'number | undefined' is not assignable to parameter of type 'number'. @ result-of:tabs.query"
    );
    assert.ok(family, [...result.families.keys()].join("\n"));
    assert.equal(family.example, `${TEST_FILE}:${lineOf("tab.id")}`);
  });

  it("attributes a member read on a result to the API that produced it", () => {
    const family = result.families.get("TS2339 Property 'nope' does not exist on type 'Tab[]'. @ result-of:tabs.query");
    assert.equal(family?.example, `${TEST_FILE}:${lineOf("tabs.nope")}`);
  });

  it("sets aside diagnostics inside assertRejects and counts them", () => {
    assert.equal(result.stats.intentional, 1);
    assert.ok(![...result.families.values()].some((f) => f.example.endsWith(`:${lineOf("assertRejects")}`)));
  });

  it("ignores names the test defines outside the extracted code", () => {
    assert.ok(![...result.families.keys()].some((key) => key.startsWith("TS2304")));
  });

  it("ignores a function that shadows browser", () => {
    assert.ok(![...result.families.values()].some((f) => f.example.endsWith(`:${lineOf("not a number")}`)));
  });

  it("finds exactly the two families above", () => {
    assert.equal(result.families.size, 2, [...result.families.keys()].join("\n"));
  });

  it("ends every region with a semicolon so that neighbours cannot join", () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), "fx-corpus-extract-"));
    try {
      const root = path.join(dir, "firefox");
      const { files } = extractCorpus(root, out, new Set(["tabs"]));
      const [name] = Object.keys(files);
      const text = fs.readFileSync(path.join(out, name), "utf8");
      assert.equal(text.split("\n").length, FIXTURE_SOURCE.split("\n").length);
      assert.match(text, /\}\);\s*$/m);
      assert.ok(!/\}\)\s*\n\s*\(/.test(text));
    } finally {
      fs.rmSync(out, { recursive: true, force: true });
    }
  });
});

describe("family keys", () => {
  it("keep declaration names and drop test-local names", () => {
    assert.equal(
      normaliseMessage("'port.sender' is possibly 'undefined'."),
      "<expr>.sender is possibly 'undefined'."
    );
    assert.equal(
      normaliseMessage("Property 'proxyInfo' does not exist on type 'Details'. Did you mean 'proxy'?"),
      "Property 'proxyInfo' does not exist on type 'Details'."
    );
  });

  it("elide object literals, string literals and long type text", () => {
    assert.equal(
      normaliseMessage("Argument of type '{ a: number; }' is not assignable to parameter of type 'Rule'."),
      "Argument of type <type> is not assignable to parameter of type 'Rule'."
    );
    assert.equal(
      normaliseMessage("Type '\"foo\"' is not assignable to type 'X'."),
      "Type <type> is not assignable to type 'X'."
    );
  });
});

describe("baseline comparison", () => {
  const seen = new Map([
    ["kept", { count: 2, example: "a.js:1" }],
    ["new", { count: 1, example: "b.js:9" }],
  ]);
  const baseline = {
    kept: { reason: "stricter-declaration", note: "n", example: "a.js:1" },
    gone: { reason: "test-bug", note: "n", example: "c.js:3" },
    waiting: { reason: "unclassified", note: "", example: "d.js:4" },
  };

  it("sorts families into added, stale and unclassified", () => {
    const diff = compareToBaseline(seen, baseline);
    assert.deepEqual(diff.added, ["new"]);
    assert.deepEqual(diff.stale, ["gone", "waiting"]);
    assert.deepEqual(diff.unclassified, ["waiting"]);
  });

  it("names the family, an example and the update command in each message", () => {
    for (const text of [
      describeAdded(["new"], seen),
      describeStale(["gone"], baseline),
      describeUnclassified(["waiting"], baseline),
    ]) {
      assert.match(text, /npm run corpus:update|"reason"/);
    }
    assert.match(describeAdded(["new"], seen), /new\n\s+first seen at b\.js:9/);
    assert.match(describeAdded(["new"], seen), /npm run corpus:update/);
    assert.match(describeStale(["gone"], baseline), /last seen at c\.js:3/);
  });

  it("keeps reasons for surviving families and marks new ones unclassified", () => {
    const next = updatedBaseline(seen, baseline);
    assert.deepEqual(next.kept, baseline.kept);
    assert.equal(next.new.reason, "unclassified");
    assert.ok(!("gone" in next));
  });
});

describe("Firefox test corpus", { skip: !firefoxRoot && "no Firefox checkout: set TOPSRCDIR" }, () => {
  let dir;
  let run;
  const baseline = loadBaseline();
  before(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "fx-corpus-"));
    run = checkCorpus(firefoxRoot, dir);
  });
  after(() => fs.rmSync(dir, { recursive: true, force: true }));

  it("reads every extension test file", () => {
    assert.deepEqual(run.stats.unparsed, 0);
    assert.ok(run.stats.callSites > 5000, `only ${run.stats.callSites} API call sites were extracted`);
  });

  it("has no diagnostic family outside the baseline", () => {
    const { added } = compareToBaseline(run.families, baseline);
    assert.equal(added.length, 0, describeAdded(added, run.families));
  });

  it("has no baseline family that stopped occurring", () => {
    const { stale } = compareToBaseline(run.families, baseline);
    assert.equal(stale.length, 0, describeStale(stale, baseline));
  });

  it("has no unclassified baseline entry", () => {
    const { unclassified, unknownReason } = compareToBaseline(run.families, baseline);
    assert.equal(unclassified.length, 0, describeUnclassified(unclassified, baseline));
    assert.deepEqual(unknownReason, [], `reasons must be one of ${Object.keys(REASONS).join(", ")}`);
  });
});
