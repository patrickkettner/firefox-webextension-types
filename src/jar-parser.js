import fs from "node:fs";
import path from "node:path";

/**
 * Parses jar.mn manifest files used in Mozilla source trees to determine
 * which schemas are active for a given platform target.
 *
 * @param {string} manifestPath - Path to jar.mn file.
 * @param {boolean} isAndroid - True if targeting mobile/Android.
 * @returns {string[]} List of active JSON schema filenames.
 */
export function parseJarMn(manifestPath, isAndroid = false) {
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`jar.mn manifest not found at ${manifestPath}`);
  }

  const activeFiles = [];
  const content = fs.readFileSync(manifestPath, "utf8");
  const lines = content.split(/\r?\n/);
  const conditionStack = [true];

  for (const line of lines) {
    const stripped = line.trim();
    if (!stripped || stripped.startsWith("# This Source")) {
      continue;
    }

    if (stripped.startsWith("#ifndef ANDROID")) {
      conditionStack.push(!isAndroid);
      continue;
    } else if (stripped.startsWith("#ifdef ANDROID")) {
      conditionStack.push(isAndroid);
      continue;
    } else if (stripped.startsWith("#ifndef")) {
      conditionStack.push(true);
      continue;
    } else if (stripped.startsWith("#ifdef")) {
      conditionStack.push(false);
      continue;
    } else if (stripped.startsWith("#if")) {
      conditionStack.push(true);
      continue;
    } else if (stripped.startsWith("#else")) {
      if (conditionStack.length > 1) {
        conditionStack[conditionStack.length - 1] = !conditionStack[conditionStack.length - 1];
      }
      continue;
    } else if (stripped.startsWith("#endif")) {
      if (conditionStack.length > 1) {
        conditionStack.pop();
      }
      continue;
    } else if (stripped.startsWith("#")) {
      continue;
    }

    if (conditionStack.every(Boolean)) {
      const parts = stripped.split(/\s+/);
      for (const part of parts) {
        if (part.endsWith(".json")) {
          const filename = path.basename(part);
          activeFiles.push(filename);
        }
      }
    }
  }

  return activeFiles;
}
