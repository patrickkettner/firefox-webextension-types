import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { parseJarMn } from "../src/jar-parser.js";

const firefoxRoot =
  process.env.TOPSRCDIR || process.env.MOZ_TOPSRCDIR || process.env.MOZILLA_CENTRAL;

// jar-parser.js evaluates only ANDROID. Any other conditional in a manifest it
// reads would be silently mis-evaluated, so fail when one appears.
// Firefox: jar.mn in the toolkit, browser and mobile schema directories
describe("jar.mn conditionals", { skip: !firefoxRoot && "no Firefox checkout: set TOPSRCDIR" }, () => {
  const manifests = [
    "toolkit/components/extensions/schemas/jar.mn",
    "browser/components/extensions/schemas/jar.mn",
    "mobile/shared/components/extensions/schemas/jar.mn",
  ];
  for (const rel of manifests) {
    it(`${rel} uses only ANDROID conditionals`, () => {
      const lines = fs.readFileSync(path.join(firefoxRoot, rel), "utf8").split(/\r?\n/);
      for (const line of lines) {
        const m = line.trim().match(/^#\s*(ifdef|ifndef|if|elif|else|endif|elifdef|elifndef)\b\s*(.*)$/);
        if (!m) continue;
        if (m[1] === "else" || m[1] === "endif") continue;
        assert.ok(
          (m[1] === "ifdef" || m[1] === "ifndef") && m[2].trim() === "ANDROID",
          `${rel}: unmodelled conditional "${line.trim()}" needs jar-parser.js support`
        );
      }
    });
  }
});

// Firefox: jar.mn (only #ifdef ANDROID and #ifndef ANDROID appear, any other directive must fail loudly)
describe("parseJarMn conditionals", () => {
  function parse(body, isAndroid = false) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "jar-mn-"));
    const file = path.join(dir, "jar.mn");
    fs.writeFileSync(file, body);
    try {
      return { file, result: () => parseJarMn(file, isAndroid) };
    } finally {
      process.on("exit", () => fs.rmSync(dir, { recursive: true, force: true }));
    }
  }

  it("evaluates ANDROID conditionals for both targets", () => {
    const body = "#ifdef ANDROID\n  a.json\n#else\n  b.json\n#endif\n#ifndef ANDROID\n  c.json\n#endif\n";
    assert.deepEqual(parse(body, true).result(), ["a.json"]);
    assert.deepEqual(parse(body, false).result(), ["b.json", "c.json"]);
  });

  for (const directive of ["#ifdef NIGHTLY_BUILD", "#ifndef NIGHTLY_BUILD", "#if defined(FOO)", "#elif FOO", "#elifdef FOO", "#elifndef FOO"]) {
    it(`throws on "${directive}" naming file, line and condition`, () => {
      const { file, result } = parse(`a.json\n${directive}\n  b.json\n#endif\n`);
      assert.throws(result, (err) => {
        assert.ok(err.message.includes(`${file}:2`), err.message);
        assert.ok(err.message.includes(directive.split(/\s+/).slice(1).join(" ")), err.message);
        return true;
      });
    });
  }
});
