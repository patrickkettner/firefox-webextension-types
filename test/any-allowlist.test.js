import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";

import { anyPaths } from "../scripts/lib/any-paths.js";
import { anyProblems, checkDist } from "../scripts/verify-any.js";

const paths = (text) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "fwt-any-"));
  try {
    fs.writeFileSync(path.join(dir, "x.d.ts"), text);
    return anyPaths(path.join(dir, "x.d.ts"));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
};

// TypeScript: the any keyword, found by the parser and not in comments or names
describe("any by declaration path", () => {
  it("names the namespace, declaration, parameter and return position", () => {
    const counts = paths(
      "/** any text in a comment */\ndeclare namespace browser {\n  export namespace runtime {\n" +
        "    export function send(message: any): Promise<any>;\n    export function send(message: any, cb: (response: any) => void): void;\n" +
        "    export interface Port { postMessage: (message: any) => void; company: string }\n  }\n}\n"
    );
    assert.deepEqual(Object.fromEntries(counts), {
      "browser.runtime.send.message": 2,
      "browser.runtime.send.return": 1,
      "browser.runtime.send.cb.response": 1,
      "browser.runtime.Port.postMessage.message": 1,
    });
  });

  it("fails a new path, a higher count, a stale entry and a missing reason", () => {
    const entries = {
      "a.b": { count: 1, reason: "r" },
      "a.c": { count: 2, reason: "r" },
      "a.gone": { count: 1, reason: "r" },
      "a.d": { count: 1, reason: " " },
    };
    const problems = anyProblems(new Map([["a.b", 1], ["a.c", 3], ["a.new", 1], ["a.d", 1]]), entries).join("\n");
    assert.match(problems, /a\.new has 1 any that any-allowlist\.json does not list/);
    assert.match(problems, /a\.c has 3 any, and any-allowlist\.json allows 2/);
    assert.match(problems, /a\.gone has no any in dist\/ any more/);
    assert.match(problems, /a\.d has no reason/);
    assert.doesNotMatch(problems, /a\.b /);
  });

  it("dist/ has exactly the any that any-allowlist.json lists", () => {
    assert.deepEqual(checkDist().problems, []);
  });
});
