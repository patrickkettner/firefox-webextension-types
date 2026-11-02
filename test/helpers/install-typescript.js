import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

// A second TypeScript cannot be a devDependency: npm links one package's
// `tsc` bin for both. The version lives under node_modules/.cache instead,
// installed on first use and reused afterwards.
export function installTypeScript(version) {
  const dir = path.join(repoRoot, "node_modules/.cache", `typescript-${version}`);
  const pkg = path.join(dir, "node_modules/typescript");
  if (!fs.existsSync(path.join(pkg, "lib/typescript.js"))) {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "package.json"), "{}\n");
    execFileSync("npm", ["install", "--silent", "--no-audit", "--no-fund", "--no-save", `typescript@${version}`], {
      cwd: dir,
      stdio: "pipe",
    });
  }
  return { dir: pkg, tsc: path.join(pkg, "bin/tsc"), api: path.join(pkg, "lib/typescript.js") };
}
