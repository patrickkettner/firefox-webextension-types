// Every {@link X} in the emitted declarations must point at a declaration.
// An editor shows an unresolved link as plain text, so a wrong target is a
// silent loss. Resolution goes through the TypeScript language service, the
// same way an editor does it.
import { before, describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { installTypeScript } from "./helpers/install-typescript.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(repoRoot, "dist");
const files = ["index.d.ts", "firefox-desktop.d.ts", "firefox-mobile.d.ts", "global.d.ts", "global-mobile.d.ts"];
const built = files.every((f) => fs.existsSync(path.join(dist, f)));

let ts;

before(() => {
  if (built) ts = createRequire(import.meta.url)(installTypeScript("5.9.3").api);
});

function unresolvedLinks(name) {
  const file = path.join(dist, name);
  const text = fs.readFileSync(file, "utf8");
  const options = {
    strict: true,
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.NodeNext,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    skipLibCheck: true,
    types: [],
    noEmit: true,
  };
  const host = {
    getScriptFileNames: () => [file],
    getScriptVersion: () => "1",
    getScriptSnapshot: (f) => (fs.existsSync(f) ? ts.ScriptSnapshot.fromString(fs.readFileSync(f, "utf8")) : undefined),
    getCurrentDirectory: () => repoRoot,
    getCompilationSettings: () => options,
    getDefaultLibFileName: (o) => ts.getDefaultLibFilePath(o),
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
    directoryExists: ts.sys.directoryExists,
    getDirectories: ts.sys.getDirectories,
  };
  const service = ts.createLanguageService(host, ts.createDocumentRegistry());
  const unresolved = [];
  let total = 0;
  for (const m of text.matchAll(/\{@link\s+([^\s}|]+)[^}]*\}/g)) {
    total++;
    const target = m[1];
    // The last character of a qualified name resolves the whole chain.
    const at = m.index + m[0].indexOf(target) + target.length - 1;
    const definitions = service.getDefinitionAtPosition(file, at);
    if (!definitions || definitions.length === 0) {
      const line = text.slice(0, m.index).split("\n").length;
      unresolved.push(`${name}:${line} {@link ${target}}`);
    }
  }
  return { total, unresolved };
}

// TypeScript: the language service resolves a {@link} target through getDefinitionAtPosition, as an editor does
describe("{@link} targets", { skip: !built && "dist not built" }, () => {
  for (const name of files) {
    it(`every link in ${name} resolves to a declaration`, (t) => {
      const { total, unresolved } = unresolvedLinks(name);
      assert.ok(total > 0, `${name} has no {@link} at all, the scan is looking in the wrong place`);
      t.diagnostic(`${total} links, ${total - unresolved.length} resolved`);
      assert.deepEqual(
        unresolved,
        [],
        `${unresolved.length} of ${total} {@link} targets in dist/${name} name no declaration.\n` +
          `A target comes from a schema $(ref:x). If x is a namespace this surface lacks, resolveRef in src/emitter.js ` +
          `should return null so the text is not a link.\n${unresolved.join("\n")}`
      );
    });
  }
});
