import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

/**
 * A TypeScript language service over one root file, reading every other file
 * from disk. `inMemory` maps a path to text served in its place, for a probe
 * file that is never written.
 */
export function languageService(ts, rootFile, options, inMemory = {}) {
  const read = (file) => (file in inMemory ? inMemory[file] : ts.sys.readFile(file));
  const host = {
    getScriptFileNames: () => [rootFile],
    getScriptVersion: () => "1",
    getScriptSnapshot: (file) => {
      const text = read(file);
      return text === undefined ? undefined : ts.ScriptSnapshot.fromString(text);
    },
    getCurrentDirectory: () => repoRoot,
    getCompilationSettings: () => options,
    getDefaultLibFileName: (o) => ts.getDefaultLibFilePath(o),
    fileExists: (file) => file in inMemory || ts.sys.fileExists(file),
    readFile: read,
    readDirectory: ts.sys.readDirectory,
    directoryExists: ts.sys.directoryExists,
    getDirectories: ts.sys.getDirectories,
  };
  return ts.createLanguageService(host, ts.createDocumentRegistry());
}
