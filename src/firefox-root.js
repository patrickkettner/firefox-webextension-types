import fs from "node:fs";
import path from "node:path";

// The Firefox checkout the tools read: the --firefox-source path when one is
// given, else the first of TOPSRCDIR, MOZ_TOPSRCDIR and MOZILLA_CENTRAL that
// is set. Null when none is.
export function configuredFirefoxRoot(cliPath = null) {
  const given = cliPath || process.env.TOPSRCDIR || process.env.MOZ_TOPSRCDIR || process.env.MOZILLA_CENTRAL;
  return given ? path.resolve(given) : null;
}

// The same path for a command line tool, which exits 1 with a message when no
// checkout is configured or the path does not exist.
export function resolveFirefoxPath(cliPath = null) {
  const root = configuredFirefoxRoot(cliPath);
  if (!root) {
    console.error("Error: no Firefox checkout. Pass --firefox-source <path> or set TOPSRCDIR.");
    process.exit(1);
  }
  if (!fs.existsSync(root)) {
    console.error(`Error: no Firefox checkout at ${root}.`);
    process.exit(1);
  }
  return root;
}
