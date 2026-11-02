import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildOnce,
  diffOutputs,
  ledgerProblems,
  readLedger,
  runSweep,
  sweepFailure,
  traceBuild,
  updateLedger,
} from "../src/key-ledger.js";
import { pairKey } from "../src/schema-trace.js";

const firefoxRoot = process.env.TOPSRCDIR || process.env.MOZ_TOPSRCDIR || process.env.MOZILLA_CENTRAL;
const needFirefox = !firefoxRoot && "no Firefox checkout: set TOPSRCDIR";

const pairs = (list) => new Map(list.map(([ctx, key, present, read]) => [pairKey(ctx, key), { present, read }]));

describe("ledger comparison logic", () => {
  const trace = pairs([
    ["functions[]", "name", 4, 4],
    ["functions[]", "format", 2, 0],
    ["events[]", "optional", 3, 3],
    ["events[]", "filters", 1, 0],
  ]);
  const entry = (context, key, status, extra = {}) => ({ context, key, status, ...extra });

  it("accepts a ledger that matches the trace", () => {
    const ledger = [
      entry("functions[]", "name", "consumed"),
      entry("functions[]", "format", "declined", { reason: "TypeScript has no string formats" }),
      entry("events[]", "optional", "consumed"),
      entry("events[]", "filters", "unresolved", { reason: "no finding names it" }),
    ];
    assert.deepEqual(ledgerProblems(trace, ledger), []);
  });

  it("names a pair that is in the schemas and missing from the ledger", () => {
    const ledger = [entry("functions[]", "name", "consumed"), entry("events[]", "optional", "consumed")];
    const text = ledgerProblems(trace, ledger).join("\n");
    assert.match(text, /key "format" in context "functions\[\]" is in the Firefox schemas but not in schema-key-ledger\.json/);
    assert.match(text, /npm run ledger:update/);
  });

  it("names a consumed pair that is no longer read", () => {
    const ledger = [
      entry("functions[]", "name", "consumed"),
      entry("functions[]", "format", "consumed"),
      entry("events[]", "optional", "consumed"),
      entry("events[]", "filters", "unresolved", { reason: "x" }),
    ];
    const [p] = ledgerProblems(trace, ledger);
    assert.match(p, /key "format" in context "functions\[\]" is marked consumed but the generator no longer reads it/);
  });

  it("names a declined pair that is now read", () => {
    const ledger = [
      entry("functions[]", "name", "declined", { reason: "ignored" }),
      entry("functions[]", "format", "declined", { reason: "r" }),
      entry("events[]", "optional", "consumed"),
      entry("events[]", "filters", "unresolved", { reason: "x" }),
    ];
    const [p] = ledgerProblems(trace, ledger);
    assert.match(p, /key "name" in context "functions\[\]" is marked declined \("ignored"\) but the generator now reads it/);
  });

  it("names an entry no schema has, and a declined or unresolved entry with no reason", () => {
    const ledger = [
      entry("functions[]", "name", "consumed"),
      entry("functions[]", "format", "declined"),
      entry("events[]", "optional", "consumed"),
      entry("events[]", "filters", "unresolved", { reason: " " }),
      entry("events[]", "gone", "consumed"),
    ];
    const text = ledgerProblems(trace, ledger).join("\n");
    assert.match(text, /key "gone" in context "events\[\]" is in schema-key-ledger\.json but no loaded schema has it/);
    assert.match(text, /key "format" in context "functions\[\]" is declined with no reason/);
    assert.match(text, /key "filters" in context "events\[\]" is unresolved with no reason/);
  });

  it("update keeps reasons for pairs that stay unread and never declines on its own", () => {
    const old = [
      entry("functions[]", "name", "declined", { reason: "was ignored" }),
      entry("functions[]", "format", "declined", { reason: "keep me", firefox: "a/b.js" }),
      entry("events[]", "optional", "consumed"),
      entry("events[]", "gone", "consumed"),
    ];
    const { entries, changes } = updateLedger(trace, old);
    const get = (c, k) => entries.find((e) => e.context === c && e.key === k);
    assert.equal(get("functions[]", "name").status, "consumed");
    assert.equal(get("functions[]", "name").reason, undefined);
    assert.deepEqual(get("functions[]", "format"), old[1]);
    assert.equal(get("events[]", "filters").status, "unresolved");
    assert.equal(get("events[]", "filters").reason, "");
    assert.ok(!get("events[]", "gone"));
    assert.equal(changes.length, 3);
  });

  it("update demotes a consumed pair that stopped being read and leaves readNoEffect alone", () => {
    const old = [
      entry("functions[]", "name", "consumed"),
      entry("functions[]", "format", "consumed"),
      entry("events[]", "optional", "unresolved", { reason: "r", readNoEffect: true }),
      entry("events[]", "filters", "unresolved", { reason: "r" }),
    ];
    const { entries } = updateLedger(trace, old);
    const get = (c, k) => entries.find((e) => e.context === c && e.key === k);
    assert.equal(get("functions[]", "format").status, "unresolved");
    assert.match(get("functions[]", "format").reason, /no longer read/);
    assert.equal(get("events[]", "optional").readNoEffect, true);
    assert.equal(get("events[]", "optional").status, "unresolved");
  });
});

describe("sweep verdicts", () => {
  const none = { changed: [], bytes: 0 };
  const some = { changed: ["index.d.ts"], bytes: 12 };

  it("fails a consumed pair whose deletion changes nothing", () => {
    assert.match(sweepFailure({ context: "c", key: "k", status: "consumed" }, none), /consumed but deleting it .* changes no output byte/);
  });
  it("passes a consumed pair whose deletion changes output, or throws", () => {
    assert.equal(sweepFailure({ context: "c", key: "k", status: "consumed" }, some), null);
    assert.equal(sweepFailure({ context: "c", key: "k", status: "consumed" }, { ...none, threw: "boom" }), null);
  });
  it("fails a declined pair whose deletion changes output", () => {
    assert.match(sweepFailure({ context: "c", key: "k", status: "declined", reason: "r" }, some), /declined .* changes the output/);
    assert.equal(sweepFailure({ context: "c", key: "k", status: "declined", reason: "r" }, none), null);
  });
  it("expects readNoEffect pairs to stay without effect", () => {
    const e = { context: "c", key: "k", status: "unresolved", reason: "r", readNoEffect: true };
    assert.equal(sweepFailure(e, none), null);
    assert.match(sweepFailure(e, some), /Set status consumed and remove readNoEffect/);
  });
});

describe("schema key ledger against the Firefox schemas", { skip: needFirefox }, () => {
  const traced = firefoxRoot ? traceBuild(firefoxRoot) : null;

  it("covers every key in the schemas, and every entry is still true", () => {
    const problems = ledgerProblems(traced, readLedger(), { firefoxRoot });
    assert.equal(problems.length, 0, "\n" + problems.join("\n\n"));
  });

  it("produces the same output with tracing on and off", () => {
    const plain = buildOnce(firefoxRoot).outputs;
    const withTrace = buildOnce(firefoxRoot, { trace: true }).outputs;
    assert.deepEqual(diffOutputs(plain, withTrace).changed, []);
  });

  it("negative control: an injected key nobody reads shows present and never read", () => {
    const injected = traceBuild(firefoxRoot, { inject: { key: "zzUnusedKey", value: "x" } });
    const rows = [...injected].filter(([pair]) => pair.endsWith("\tzzUnusedKey"));
    assert.ok(rows.length > 20, `expected zzUnusedKey in many contexts, found ${rows.length}`);
    const read = rows.filter(([, c]) => c.read > 0).map(([pair]) => pair.replace("\t", " / "));
    assert.deepEqual(read, [], "tracing counts a copy or enumeration of the node as a read of this key");
  });

  it("positive control: keys the emitter uses show reads", () => {
    for (const key of ["name", "description"]) {
      const c = traced.get(pairKey("functions[]", key));
      assert.ok(c && c.read > 0, `functions[] ${key} shows no reads: tracing lost them`);
    }
    const c = traced.get(pairKey("functions[] > parameters[]", "optional"));
    assert.ok(c && c.read > 0, "functions[] > parameters[] optional shows no reads");
  });

  it("sweep controls: deleting a used key changes output, deleting an unread one does not", () => {
    const planted = [
      { context: "functions[]", key: "description", status: "consumed" },
      { context: "functions[]", key: "allowCrossOriginArguments", status: "consumed" },
      { context: "functions[]", key: "description", status: "declined", reason: "planted" },
    ];
    const failures = runSweep(firefoxRoot, planted);
    assert.equal(failures.length, 2, failures.join("\n"));
    assert.match(failures[0], /key "allowCrossOriginArguments" .* consumed but deleting it/);
    assert.match(failures[1], /key "description" .* declined \("planted"\) but .* changes the output/);
  });
});
