import fs from "node:fs";
import path from "node:path";

import { configuredFirefoxRoot } from "../../src/firefox-root.js";

// Every suite that reads a Firefox checkout takes its root from here. With
// no checkout the import throws, so npm test is red rather than green with
// those suites skipped. FWT_SKIP_FIREFOX=1 is the opt-out, and the skip
// reason names it so the output says what did not run. Any other value,
// FWT_SKIP_FIREFOX=0 included, is not an opt-out.

const SKIP_VARIABLE = "FWT_SKIP_FIREFOX";

const configured = configuredFirefoxRoot();
const optedOut = process.env[SKIP_VARIABLE] === "1";

if (!configured && !optedOut) {
  throw new Error(
    "No Firefox checkout. Set TOPSRCDIR to one (mozilla-firefox/firefox) so the suites that read its schemas run, " +
      `or set ${SKIP_VARIABLE}=1 to skip them. A run with them skipped is not a complete npm test.`
  );
}

if (configured && !fs.existsSync(path.join(configured, "browser", "config", "version.txt"))) {
  throw new Error(`TOPSRCDIR (${configured}) is not a Firefox checkout: browser/config/version.txt is missing.`);
}

/** Absolute path of the Firefox checkout, or null when the suites are opted out. */
export const firefoxRoot = configured;

/** The describe/it `skip` option for a Firefox-backed suite: false, or the reason. */
export const skipFirefox =
  !firefoxRoot && `${SKIP_VARIABLE} is set, so the suites that read the Firefox checkout did not run. This npm test is incomplete.`;
