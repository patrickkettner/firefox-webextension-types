// Rewrites corpus/baseline.json from a fresh run against a Firefox checkout.
// usage: TOPSRCDIR=/path/to/firefox node corpus/update-baseline.js
// Entries that still occur keep their reason and note. New ones are
// "unclassified" and fail the corpus test until someone classifies them.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { loadBaseline, saveBaseline, updatedBaseline } from "./baseline.js";
import { checkCorpus } from "./check.js";

const firefoxRoot = process.env.TOPSRCDIR || process.env.MOZ_TOPSRCDIR || process.env.MOZILLA_CENTRAL;
if (!firefoxRoot) {
  console.error("Set TOPSRCDIR to a Firefox checkout.");
  process.exit(1);
}

const workDir = fs.mkdtempSync(path.join(os.tmpdir(), "fx-corpus-"));
try {
  const previous = loadBaseline();
  const { families, stats } = checkCorpus(firefoxRoot, workDir);
  const next = updatedBaseline(families, previous);
  saveBaseline(next);
  const fresh = Object.keys(next).filter((key) => !(key in previous));
  const dropped = Object.keys(previous).filter((key) => !(key in next));
  console.log(
    `${stats.corpusFiles} corpus files, ${stats.callSites} API call sites, ${families.size} families ` +
      `(${fresh.length} new, ${dropped.length} dropped, ${stats.intentional} intentional-failure diagnostics set aside)`
  );
  for (const key of fresh) console.log(`  new: ${key}\n       ${next[key].example}`);
  for (const key of dropped) console.log(`  dropped: ${key}`);
} finally {
  fs.rmSync(workDir, { recursive: true, force: true });
}
