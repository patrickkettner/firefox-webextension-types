import assert from "node:assert/strict";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import { firefoxRoot, skipFirefox } from "../../test/helpers/firefox-root.js";
import { extractSymbolsFromDts } from "../src/ast-symbol-extractor.js";
import { EXCLUDED_NAMESPACES } from "../src/declared-differences.js";
import { loadIndependentSchemaUniverse } from "../src/independent-schema-loader.js";
import { verifyDeclarations } from "../src/three-tier-verifier.js";

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../dist");

// Firefox: every schema under toolkit, browser and mobile jar.mn, read by the verifier's own loader
describe("dist/ against the schemas, with the verifier's own exclusions", { skip: skipFirefox }, () => {
  for (const [target, file, aliasSource] of [
    ["desktop", "index.d.ts"],
    ["mobile", "firefox-mobile.d.ts"],
    ["desktop", "chrome-mv2.d.ts", "index.d.ts"],
    ["mobile", "global-mobile-chrome-mv2.d.ts", "global-mobile.d.ts"],
  ]) {
    it(`${file} declares every ${target} namespace, type and member, and nothing more`, () => {
      const schemas = loadIndependentSchemaUniverse(firefoxRoot, target, Object.keys(EXCLUDED_NAMESPACES));
      const source = aliasSource ? extractSymbolsFromDts(path.join(dist, aliasSource)) : null;
      const result = verifyDeclarations(schemas, extractSymbolsFromDts(path.join(dist, file), source));
      assert.deepEqual(result.errors, []);
    });
  }
});
