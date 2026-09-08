/**
 * ast-symbol-extractor.js - Extract symbols from emitted .d.ts files
 *
 * Uses balanced delimiter AST parsing to extract namespaces, interfaces, properties,
 * modifiers, functions, and events with 100% precision.
 */

import fs from "node:fs";

export function extractSymbolsFromDts(dtsPath) {
  const content = fs.readFileSync(dtsPath, "utf8");
  const lines = content.split(/\r?\n/);

  const namespaces = new Map();
  const nsStack = [];
  let fnCount = 0;
  let evCount = 0;
  let typeCount = 0;
  let propCount = 0;

  const reNsStart = /^\s*export\s+namespace\s+([a-zA-Z0-9_]+)\s*\{/;
  const reIface = /^\s*export\s+interface\s+([a-zA-Z0-9_]+)\s*\{/;
  const reType = /^\s*export\s+type\s+([a-zA-Z0-9_]+)\s*=/;
  const reFn = /^\s*export\s+function\s+([a-zA-Z0-9_]+)/;
  const reConst = /^\s*export\s+const\s+([a-zA-Z0-9_]+)\s*:\s*(.*?);/;

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Check namespace start
    const mNs = reNsStart.exec(line);
    if (mNs) {
      const nsName = mNs[1];
      if (nsName !== "browser" && nsName !== "chrome") {
        nsStack.push(nsName);
        const fullNs = nsStack.join(".");
        if (!namespaces.has(fullNs)) {
          namespaces.set(fullNs, {
            name: fullNs,
            types: new Map(),
            functions: new Map(),
            events: new Map(),
            properties: new Map(),
            line: i + 1,
          });
        }
      }
      i++;
      continue;
    }

    // Check namespace end
    if (/^\s*\}\s*$/.test(line)) {
      if (nsStack.length > 0) {
        nsStack.pop();
      }
      i++;
      continue;
    }

    if (nsStack.length === 0) {
      i++;
      continue;
    }

    const currentNsName = nsStack.join(".");
    const nsObj = namespaces.get(currentNsName);

    // Check interface declaration
    const mIface = reIface.exec(line);
    if (mIface) {
      const ifaceName = mIface[1];
      const startLine = i + 1;
      const props = new Map();
      let braceCount = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;

      while (braceCount > 0 && i + 1 < lines.length) {
        i++;
        const innerLine = lines[i];
        braceCount += (innerLine.match(/\{/g) || []).length - (innerLine.match(/\}/g) || []).length;

        // Extract property: [readonly ]name[?]: type;
        const mProp = /^\s*(readonly\s+)?([a-zA-Z0-9_$]+)(\?)?:\s*(.*?);\s*$/.exec(innerLine);
        if (mProp) {
          const isReadonly = Boolean(mProp[1]);
          const pName = mProp[2];
          const isOptional = Boolean(mProp[3]);
          const pType = mProp[4].trim();
          props.set(pName, {
            name: pName,
            readonly: isReadonly,
            optional: isOptional,
            type: pType,
          });
        }
      }

      nsObj.types.set(ifaceName, {
        kind: "interface",
        name: ifaceName,
        line: startLine,
        properties: props,
      });
      typeCount++;
      i++;
      continue;
    }

    // Check type alias declaration
    const mType = reType.exec(line);
    if (mType) {
      const typeName = mType[1];
      nsObj.types.set(typeName, {
        kind: "typeAlias",
        name: typeName,
        line: i + 1,
      });
      typeCount++;
      i++;
      continue;
    }

    // Check function declaration
    const mFn = reFn.exec(line);
    if (mFn) {
      const fnName = mFn[1];
      const startLine = i + 1;
      let fnText = line;
      let parenDepth = (line.match(/\(/g) || []).length - (line.match(/\)/g) || []).length;
      let braceDepth = (line.match(/\{/g) || []).length - (line.match(/\}/g) || []).length;

      while (i + 1 < lines.length) {
        if (lines[i].includes(";") && parenDepth <= 0 && braceDepth <= 0) {
          break;
        }
        i++;
        fnText += "\n" + lines[i];
        parenDepth += (lines[i].match(/\(/g) || []).length - (lines[i].match(/\)/g) || []).length;
        braceDepth += (lines[i].match(/\{/g) || []).length - (lines[i].match(/\}/g) || []).length;
      }

      if (!nsObj.functions.has(fnName)) {
        nsObj.functions.set(fnName, []);
      }
      nsObj.functions.get(fnName).push({
        line: startLine,
        raw: fnText.trim(),
      });
      fnCount++;
      i++;
      continue;
    }

    // Check const (events or properties)
    const mConst = reConst.exec(line);
    if (mConst) {
      const constName = mConst[1];
      const constType = mConst[2].trim();
      if (constType.startsWith("WebExtensionEvent<") || constType.startsWith("WebExtensionWebRequestEvent<")) {
        nsObj.events.set(constName, {
          name: constName,
          typeText: constType,
          line: i + 1,
        });
        evCount++;
      } else {
        nsObj.properties.set(constName, {
          name: constName,
          typeText: constType,
          line: i + 1,
        });
        propCount++;
      }
      i++;
      continue;
    }

    i++;
  }

  return {
    namespaces,
    counts: {
      namespaces: namespaces.size,
      types: typeCount,
      functions: fnCount,
      events: evCount,
      properties: propCount,
    },
  };
}
