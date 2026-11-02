import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const firefoxRoot =
  process.env.TOPSRCDIR || process.env.MOZ_TOPSRCDIR || process.env.MOZILLA_CENTRAL;

// jar-parser.js evaluates only ANDROID. Any other conditional in a manifest it
// reads would be silently mis-evaluated, so fail when one appears.
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
