import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { it } from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// TypeScript: the fixtures under test/ compile against dist/index.d.ts with the repository tsconfig, which is what npm run typecheck runs
it("compiles the test fixtures against dist/index.d.ts", () => {
  const tsc = path.join(root, "node_modules", "typescript", "bin", "tsc");
  const res = spawnSync(process.execPath, [tsc, "--noEmit", "-p", root], { encoding: "utf8" });
  assert.equal(res.status, 0, res.stdout + res.stderr);
});
