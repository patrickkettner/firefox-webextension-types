import fs from "node:fs";
import path from "node:path";

// Reads the subset of WebIDL used by the files in WEBIDL_TYPES: enums and
// interfaces with attributes and operations. ChromeOnly and static members
// are not reachable from extension code and are skipped.

function stripComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
}

function splitTopLevel(text, separator) {
  const parts = [];
  let depth = 0;
  let current = "";
  for (const ch of text) {
    if (ch === "(" || ch === "<") depth++;
    if (ch === ")" || ch === ">") depth--;
    if (ch === separator && depth === 0) {
      parts.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim()) parts.push(current);
  return parts.map((p) => p.trim()).filter(Boolean);
}

function stripExtendedAttributes(text) {
  const attrs = [];
  const body = text.replace(/^\s*\[([^\]]*)\]\s*/, (_, inner) => {
    attrs.push(...inner.split(",").map((a) => a.trim()));
    return "";
  });
  return { attrs, body: body.trim() };
}

export function webidlTypeToTs(idlType, ownerName, attrName, eventHandlers) {
  let t = idlType.trim();
  let nullable = false;
  if (t.endsWith("?")) {
    nullable = true;
    t = t.slice(0, -1).trim();
  }
  let out;
  const union = /^\((.*)\)$/.exec(t);
  if (union) {
    out = union[1]
      .split(/\s+or\s+/)
      .map((m) => webidlTypeToTs(m, ownerName, attrName, eventHandlers))
      .join(" | ");
  } else if (/^sequence<(.*)>$/.test(t)) {
    out = `${webidlTypeToTs(/^sequence<(.*)>$/.exec(t)[1], ownerName, attrName, eventHandlers)}[]`;
  } else if (t === "DOMString" || t === "USVString" || t === "ByteString") {
    out = "string";
  } else if (t === "undefined") {
    out = "void";
  } else if (/^(unsigned )?(long long|long|short|octet)$|^(unrestricted )?(double|float)$/.test(t)) {
    out = "number";
  } else if (t === "EventHandler") {
    const eventType = eventHandlers[`${ownerName}.${attrName}`] || "Event";
    out = `((this: ${ownerName}, event: ${eventType}) => any) | null`;
  } else {
    out = t;
  }
  return nullable ? `${out} | null` : out;
}

function parseMember(text) {
  const { attrs, body } = stripExtendedAttributes(text);
  if (attrs.includes("ChromeOnly") || body.startsWith("static ") || body.startsWith("constructor")) {
    return null;
  }
  const attribute = /^(readonly\s+)?attribute\s+(.+?)\s+([A-Za-z_][A-Za-z0-9_]*)$/.exec(body);
  if (attribute) {
    return { kind: "attribute", name: attribute[3], type: attribute[2], readonly: Boolean(attribute[1]) };
  }
  const operation = /^(.+?)\s+([A-Za-z_][A-Za-z0-9_]*)\s*\((.*)\)$/s.exec(body);
  if (operation) {
    const params = splitTopLevel(operation[3], ",").map((p) => {
      const { body: paramBody } = stripExtendedAttributes(p);
      const optional = paramBody.startsWith("optional ");
      const noDefault = paramBody.replace(/^optional\s+/, "").replace(/\s*=\s*.*$/, "");
      const m = /^(.+?)\s+([A-Za-z_][A-Za-z0-9_]*)$/s.exec(noDefault.trim());
      return { name: m[2], type: m[1], optional };
    });
    return { kind: "operation", name: operation[2], returns: operation[1], params };
  }
  return null;
}

function readBracedBody(text, start) {
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === "{") depth++;
    if (text[i] === "}" && --depth === 0) {
      return { body: text.slice(start + 1, i), end: i };
    }
  }
  throw new Error("Unbalanced braces in WebIDL");
}

export function parseWebidl(text, sourceFile) {
  const clean = stripComments(text);
  const types = [];
  const declRe = /\b(enum|interface|dictionary)\s+([A-Za-z_][A-Za-z0-9_]*)\s*(?::\s*([A-Za-z_][A-Za-z0-9_]*))?\s*\{/g;
  let m;
  while ((m = declRe.exec(clean))) {
    const [, kind, name, parent] = m;
    const { body, end } = readBracedBody(clean, m.index + m[0].length - 1);
    declRe.lastIndex = end;
    if (kind === "enum") {
      const values = splitTopLevel(body, ",").map((v) => JSON.parse(v));
      types.push({ id: name, enum: values, _source_file: sourceFile });
    } else if (kind === "interface") {
      const members = splitTopLevel(body, ";").map(parseMember).filter(Boolean);
      types.push({ id: name, _webidl: { extends: parent || null, members }, _source_file: sourceFile });
    }
  }
  return types;
}

export function loadWebidlTypes(firefoxRoot, files) {
  const types = [];
  for (const rel of files) {
    const full = path.join(firefoxRoot, rel);
    if (!fs.existsSync(full)) {
      throw new Error(`WebIDL file not found: ${full}`);
    }
    types.push(...parseWebidl(fs.readFileSync(full, "utf8"), rel));
  }
  return types;
}
