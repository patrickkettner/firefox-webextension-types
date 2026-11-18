import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildOnce,
  diffOutputs,
  ledgerProblems,
  readLedger,
  runSweep,
  sweepFailure,
  sweepTogether,
  traceBuild,
  unvouchedEntries,
  updateLedger,
} from "../src/key-ledger.js";
import { pairKey } from "../src/schema-trace.js";
import { firefoxRoot, skipFirefox } from "./helpers/firefox-root.js";


const pairs = (list) => new Map(list.map(([ctx, key, present, read, enumerated = 0]) => [pairKey(ctx, key), { present, read, enumerated }]));

// Tooling: the comparison runs on small fixtures, no declaration text is asserted
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
      entry("events[]", "filters", "declined", { reason: "Firefox ignores it" }),
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
      entry("events[]", "filters", "declined", { reason: "x" }),
    ];
    const [p] = ledgerProblems(trace, ledger);
    assert.match(p, /key "format" in context "functions\[\]" is marked consumed but the generator no longer reads it/);
  });

  it("names a declined pair that is now read", () => {
    const ledger = [
      entry("functions[]", "name", "declined", { reason: "ignored" }),
      entry("functions[]", "format", "declined", { reason: "r" }),
      entry("events[]", "optional", "consumed"),
      entry("events[]", "filters", "declined", { reason: "x" }),
    ];
    const [p] = ledgerProblems(trace, ledger);
    assert.match(p, /key "name" in context "functions\[\]" is marked declined \("ignored"\) but the generator now reads it/);
  });

  it("names an entry no schema has, and a declined entry with no reason", () => {
    const ledger = [
      entry("functions[]", "name", "consumed"),
      entry("functions[]", "format", "declined", { reason: " " }),
      entry("events[]", "optional", "consumed"),
      entry("events[]", "filters", "declined", { reason: "r" }),
      entry("events[]", "gone", "consumed"),
    ];
    const text = ledgerProblems(trace, ledger).join("\n");
    assert.match(text, /key "gone" in context "events\[\]" is in schema-key-ledger\.json but no loaded schema has it/);
    assert.match(text, /key "format" in context "functions\[\]" is declined with no reason/);
  });

  it("fails an unresolved entry, with or without a reason, and says what to do", () => {
    const ledger = [
      entry("functions[]", "name", "consumed"),
      entry("functions[]", "format", "unresolved", { reason: "no finding names it" }),
      entry("events[]", "optional", "consumed"),
      entry("events[]", "filters", "unresolved"),
    ];
    const problems = ledgerProblems(trace, ledger);
    assert.equal(problems.length, 2);
    assert.match(problems[0], /key "format" in context "functions\[\]" is unresolved \("no finding names it"\)/);
    assert.match(problems[1], /key "filters" in context "events\[\]" is unresolved\. Decide it/);
    for (const p of problems) {
      assert.match(p, /make src\/emitter\.js use it and run npm run ledger:update/);
      assert.match(p, /set the status to declined with a one-line "reason"/);
    }
  });

  it("cannot vouch for a declined or unresolved key on an object the generator enumerated", () => {
    const traced = pairs([
      ["events[]", "filters", 3, 0, 3],
      ["events[]", "optional", 3, 3, 3],
      ["functions[]", "format", 2, 0, 0],
      ["functions[]", "name", 4, 4, 0],
    ]);
    const ledger = [
      entry("events[]", "filters", "declined", { reason: "Firefox ignores it" }),
      entry("events[]", "optional", "consumed"),
      entry("functions[]", "format", "declined", { reason: "r" }),
      entry("functions[]", "name", "unresolved"),
    ];
    assert.deepEqual(unvouchedEntries(traced, ledger), [ledger[0]]);
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

  it("update demotes a consumed pair that stopped being read and promotes an unresolved one that is read", () => {
    const old = [
      entry("functions[]", "name", "consumed"),
      entry("functions[]", "format", "consumed"),
      entry("events[]", "optional", "unresolved", { reason: "r" }),
      entry("events[]", "filters", "unresolved", { reason: "r" }),
    ];
    const { entries } = updateLedger(trace, old);
    const get = (c, k) => entries.find((e) => e.context === c && e.key === k);
    assert.equal(get("functions[]", "format").status, "unresolved");
    assert.match(get("functions[]", "format").reason, /no longer read/);
    assert.deepEqual(get("events[]", "optional"), entry("events[]", "optional", "consumed"));
    assert.equal(get("events[]", "filters").status, "unresolved");
  });
});

// Tooling: the per-position checks run on fixtures, no declaration text is asserted
describe("unread positions of a consumed pair", () => {
  const at = (where, extra = {}) => ({ where, namespace: "ns", role: null, ...extra });
  const traced = (unread) => new Map([[pairKey("functions[] > parameters[]", "optional"), { present: 5, read: 5 - unread.length, enumerated: 0, unread }]]);
  const entry = (unread) => ({ context: "functions[] > parameters[]", key: "optional", status: "consumed", ...(unread ? { unread } : {}) });

  it("fails a position the generator stopped reading, though the key is still read elsewhere in its context", () => {
    const [p] = ledgerProblems(traced([at("a.json:ns.functions[f].parameters[x]")]), [entry()]);
    assert.match(p, /key "optional" in context "functions\[\] > parameters\[\]" is not read at a\.json:ns\.functions\[f\]\.parameters\[x\], and no unread group/);
  });

  it("accepts a position a group lists or a rule picks, and one in an excluded namespace", () => {
    const unread = [at("a.json:ns.functions[f].parameters[x]"), at("a.json:ns.functions[g].parameters[callback]", { role: "asyncCallback" }), at("t.json:test.functions[h].parameters[y]", { namespace: "test" })];
    const groups = [{ reason: "r", at: ["a.json:ns.functions[f].parameters[x]"] }, { reason: "r", rule: "asyncCallback" }];
    assert.deepEqual(ledgerProblems(traced(unread), [entry(groups)]), []);
  });

  it("fails a listed position the generator now reads, a group with no reason, and a rule that picks nothing", () => {
    const groups = [{ reason: "r", at: ["a.json:ns.functions[f].parameters[x]"] }, { reason: " ", at: ["a.json:ns.functions[g].parameters[y]"] }, { reason: "r", rule: "asyncCallback" }];
    const text = ledgerProblems(traced([at("a.json:ns.functions[g].parameters[y]")]), [entry(groups)]).join("\n");
    assert.match(text, /lists a\.json:ns\.functions\[f\]\.parameters\[x\], which the generator now reads or no schema has/);
    assert.match(text, /unread group 2 of .* has no reason/);
    assert.match(text, /rule "asyncCallback", and the generator now reads every position it picks/);
  });

  it("update keeps reasons, drops positions now read, and adds new ones with an empty reason", () => {
    const old = [entry([{ reason: "kept", at: ["a.json:ns.functions[f].parameters[x]", "a.json:ns.functions[gone].parameters[z]"] }])];
    const { entries, changes } = updateLedger(traced([at("a.json:ns.functions[f].parameters[x]"), at("a.json:ns.functions[new].parameters[n]")]), old);
    assert.deepEqual(entries[0].unread, [
      { reason: "kept", at: ["a.json:ns.functions[f].parameters[x]"] },
      { reason: "", at: ["a.json:ns.functions[new].parameters[n]"] },
    ]);
    assert.ok(changes.some((c) => c.includes("not read at a.json:ns.functions[new].parameters[n], needs a reason")));
  });
});

// Tooling: the verdicts run on fixtures, no declaration text is asserted
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
  it("deletes keys together and bisects to the ones that change the output", () => {
    const entries = ["a", "b", "c", "d", "e"].map((key) => ({ context: "c", key, status: "declined", reason: "r" }));
    const builds = [];
    // The output depends on b and d alone.
    const build = (ablate) => {
      const gone = new Set((ablate ?? []).map((s) => s.key));
      builds.push([...gone].join(""));
      const text = ["b", "d"].filter((k) => !gone.has(k)).join("");
      return { "index.d.ts": { sha256: text, size: text.length } };
    };
    const failures = sweepTogether(entries, build);
    assert.equal(failures.length, 2, failures.join("\n"));
    assert.match(failures[0], /key "b" in context "c" is declined .* changes the output/);
    assert.match(failures[1], /key "d" in context "c" is declined .* changes the output/);
    assert.deepEqual(builds[0], "");
    assert.deepEqual(builds[1], "abcde");
    assert.deepEqual(sweepTogether(entries.filter((e) => e.key !== "b" && e.key !== "d"), build), []);
  });

  it("fails a group whose keys change the output only when deleted together, naming each key", () => {
    const entries = ["a", "b", "c"].map((key) => ({ context: "c", key, status: "declined", reason: "r" }));
    // The output reads a || b, so it changes only when both are gone.
    const build = (ablate) => {
      const gone = new Set((ablate ?? []).map((s) => s.key));
      const text = gone.has("a") && gone.has("b") ? "" : "x";
      return { "index.d.ts": { sha256: text, size: text.length } };
    };
    const failures = sweepTogether(entries, build);
    assert.equal(failures.length, 1, failures.join("\n"));
    assert.match(failures[0], /Deleting the keys "a" in context "c", "b" in context "c" together changes the output/);
    assert.match(failures[0], /deleting either half of them does not/);

    // Split across the halves of the first bisection, the whole group is named.
    const [a, b, c] = entries;
    const [split] = sweepTogether([a, c, b], build);
    assert.match(split, /Deleting the keys "a" in context "c", "c" in context "c", "b" in context "c" together/);
  });

  it("fails an unresolved pair that is unread yet changes output", () => {
    const e = { context: "c", key: "k", status: "unresolved", reason: "r" };
    assert.equal(sweepFailure(e, none), null);
    assert.match(sweepFailure(e, some), /unresolved and unread by the trace, yet deleting it changes the output/);
  });
});

// Firefox: Schemas.sys.mjs (it reads each schema key the ledger lists), tabs.json, manifest.json
describe("schema key ledger against the Firefox schemas", { skip: skipFirefox }, () => {
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

  // A spread, Object.keys or JSON.stringify of a node hands the generator every
  // key without a read the trace can see. Deleting those keys is the check.
  it("deletes every declined or unresolved key on an object the generator enumerates or serializes, and nothing changes", () => {
    const entries = unvouchedEntries(traced, readLedger());
    const failures = sweepTogether(entries, (ablate) => buildOnce(firefoxRoot, { ablate }).outputs);
    assert.deepEqual(failures, [], "\n" + failures.join("\n\n"));
  });

  it("negative control: an injected key nobody reads shows present and never read", () => {
    const injected = traceBuild(firefoxRoot, { inject: { key: "zzUnusedKey", value: "x" } });
    const rows = [...injected].filter(([pair]) => pair.endsWith("\tzzUnusedKey"));
    assert.ok(rows.length > 20, `expected zzUnusedKey in many contexts, found ${rows.length}`);
    const read = rows.filter(([, c]) => c.read > 0).map(([pair]) => pair.replace("\t", " / "));
    assert.deepEqual(read, [], "tracing counts a copy or enumeration of the node as a read of this key");
  });

  it("records each carrier's position by file, namespace and names", () => {
    const c = traced.get(pairKey("functions[] > parameters[]", "optional"));
    const callback = c.unread.find((u) => u.where === "toolkit/components/extensions/schemas/alarms.json:alarms.functions[create].parameters[callback]");
    assert.equal(callback?.role, "asyncCallback");
    assert.ok(c.unread.some((u) => u.namespace === "test"), "the excluded test namespace carries the key and is never read");
  });

  // Firefox: mobile/shared/components/extensions/schemas/tabs.json (Tab.openerTabId is unsupported on Android), browser/components/extensions/schemas/tabs.json (it is supported on desktop)
  it("keeps a desktop and an Android schema file of the same name apart", () => {
    const opener = (dir) => `${dir}/components/extensions/schemas/tabs.json:tabs.types[Tab].properties{openerTabId}`;
    const unread = traced.get(pairKey("types[] > properties{}", "optional")).unread.map((u) => u.where);
    assert.ok(unread.includes(opener("mobile/shared")), unread.filter((w) => w.includes("openerTabId")).join("\n"));
    assert.ok(!unread.includes(opener("browser")));
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
