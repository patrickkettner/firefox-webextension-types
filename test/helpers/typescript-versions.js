import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

// The older TypeScript versions the tests need are devDependencies under
// these aliases, so npm ci installs them and nothing is fetched at test
// time. package.json names each version once, in the alias spec.
export const API = "typescript-api";
export const OLDEST = "typescript-oldest";

// npm links node_modules/.bin/tsc to whichever TypeScript it unpacked last,
// so the repo compiler is reached by its package path.
export const repoTsc = path.join(repoRoot, "node_modules/typescript/bin/tsc");

export function typeScript(alias) {
  const dir = path.join(repoRoot, "node_modules", alias);
  const manifest = path.join(dir, "package.json");
  if (!fs.existsSync(manifest)) {
    throw new Error(`${alias} is not installed under node_modules. Run npm ci.`);
  }
  const { version } = JSON.parse(fs.readFileSync(manifest, "utf8"));
  return { version, tsc: path.join(dir, "bin/tsc"), api: path.join(dir, "lib/typescript.js") };
}
