// Reads the namespaces, types, functions, events and properties of an
// emitted .d.ts with the TypeScript parser from typescript-api.
//
// A namespace named after a function, event or type of the namespace it sits
// in holds that owner's named parameter and result types, and is recorded as
// a helper of its parent, not as a namespace.
//
// `chrome` files declare most of their members as `export import x =
// browser.<same path>.x`, and an interface as `extends Omit<browser.<same
// path>, ...>` with the members it declares again. Those are read from the
// declarations of the file passed as aliasSource. An alias or base to any
// other path, or to something the source does not declare, is recorded in
// aliasErrors. Without aliasSource only the path is checked.

import fs from "node:fs";
import ts from "typescript-api";

const ROOTS = new Set(["browser", "chrome"]);

function isExported(node) {
  return Boolean(node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword));
}

function readParams(sf, decl) {
  return decl.parameters.map((p) => ({
    name: p.name.getText(sf),
    optional: Boolean(p.questionToken || p.initializer),
    rest: Boolean(p.dotDotDotToken),
  }));
}

function emptyNamespace(name, line) {
  return {
    name,
    types: new Map(),
    functions: new Map(),
    events: new Map(),
    properties: new Map(),
    helpers: new Map(),
    line,
  };
}

function readHelper(body) {
  const types = [];
  const nested = new Map();
  for (const st of body.statements) {
    if (ts.isTypeAliasDeclaration(st) || ts.isInterfaceDeclaration(st)) types.push(st.name.text);
    else if (ts.isModuleDeclaration(st) && st.body && ts.isModuleBlock(st.body)) {
      nested.set(
        st.name.text,
        st.body.statements.filter((s) => ts.isTypeAliasDeclaration(s) || ts.isInterfaceDeclaration(s)).map((s) => s.name.text)
      );
    }
  }
  return { types, nested };
}

function readInterface(sf, decl, line) {
  const properties = new Map();
  const methods = new Map();
  for (const m of decl.members) {
    if (!m.name || !(ts.isIdentifier(m.name) || ts.isStringLiteral(m.name))) continue;
    const name = m.name.text;
    if (ts.isPropertySignature(m)) {
      properties.set(name, {
        name,
        readonly: Boolean(m.modifiers?.some((x) => x.kind === ts.SyntaxKind.ReadonlyKeyword)),
        optional: Boolean(m.questionToken),
        type: m.type ? m.type.getText(sf) : "",
      });
    } else if (ts.isMethodSignature(m)) {
      if (!methods.has(name)) methods.set(name, []);
      methods.get(name).push({ params: readParams(sf, m) });
    }
  }
  return { kind: "interface", name: decl.name.text, line, properties, methods };
}

function aliasTarget(st) {
  if (!ts.isImportEqualsDeclaration(st) || !isExported(st)) return null;
  return ts.isEntityName(st.moduleReference) ? st.moduleReference.getText() : null;
}

export function extractSymbolsFromDts(dtsPath, aliasSource = null) {
  const text = fs.readFileSync(dtsPath, "utf8");
  const sf = ts.createSourceFile(dtsPath, text, ts.ScriptTarget.Latest, true);
  const lineOf = (node) => sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;

  const namespaces = new Map();
  const aliasErrors = [];
  let fnCount = 0;
  let evCount = 0;
  let typeCount = 0;
  let propCount = 0;

  const countNamespace = (ns) => {
    typeCount += ns.types.size;
    evCount += ns.events.size;
    propCount += ns.properties.size;
    for (const overloads of ns.functions.values()) fnCount += overloads.length;
  };

  // Copies what `browser.<path>` names in aliasSource into this file's
  // namespaces: a namespace and the ones under it, or one member of `ns`.
  const readAlias = (st, ns, path) => {
    const target = aliasTarget(st);
    const where = `${path} (line ${lineOf(st)})`;
    if (target !== `browser.${path}`) {
      aliasErrors.push(`${where} aliases ${target}, not browser.${path}.`);
      return;
    }
    if (!aliasSource) return;
    if (aliasSource.namespaces.has(path)) {
      for (const [srcName, srcNs] of aliasSource.namespaces) {
        if (srcName !== path && !srcName.startsWith(`${path}.`)) continue;
        namespaces.set(srcName, srcNs);
        countNamespace(srcNs);
      }
      return;
    }
    const name = st.name.text;
    const srcNs = ns && aliasSource.namespaces.get(ns.name);
    const kinds = ["types", "functions", "events", "properties"].filter((k) => srcNs?.[k].has(name));
    if (!kinds.length) {
      aliasErrors.push(`${where} aliases browser.${path}, which ${aliasSource.file} does not declare.`);
      return;
    }
    for (const kind of kinds) {
      const value = srcNs[kind].get(name);
      ns[kind].set(name, value);
      if (kind === "types") typeCount++;
      else if (kind === "events") evCount++;
      else if (kind === "properties") propCount++;
      else fnCount += value.length;
    }
    if (srcNs.helpers.has(name)) ns.helpers.set(name, srcNs.helpers.get(name));
  };

  // An interface that extends a browser type, or Omit of one, has the
  // members of that type it does not omit or declare itself.
  const inherit = (iface, base, path) => {
    const omitted = new Set();
    let ref = base;
    if (ts.isIdentifier(base.expression) && base.expression.text === "Omit" && base.typeArguments?.length === 2) {
      [ref] = base.typeArguments;
      const keys = base.typeArguments[1];
      for (const k of ts.isUnionTypeNode(keys) ? keys.types : [keys]) {
        if (ts.isLiteralTypeNode(k) && ts.isStringLiteral(k.literal)) omitted.add(k.literal.text);
      }
    }
    const target = ts.isTypeReferenceNode(ref) ? ref.typeName.getText(sf) : ref.expression?.getText(sf);
    if (!target?.startsWith("browser.")) return;
    const where = `${path} (line ${lineOf(base)})`;
    if (target !== `browser.${path}`) {
      aliasErrors.push(`${where} extends ${target}, not browser.${path}.`);
      return;
    }
    if (!aliasSource) return;
    const cut = path.lastIndexOf(".");
    const srcType = aliasSource.namespaces.get(path.slice(0, cut))?.types.get(path.slice(cut + 1));
    if (srcType?.kind !== "interface") {
      aliasErrors.push(`${where} extends browser.${path}, which ${aliasSource.file} does not declare as an interface.`);
      return;
    }
    for (const kind of ["properties", "methods"]) {
      for (const [name, member] of srcType[kind]) {
        if (!omitted.has(name) && !iface.properties.has(name) && !iface.methods.has(name)) iface[kind].set(name, member);
      }
    }
  };

  const readNamespace = (decl, prefix) => {
    const name = prefix ? `${prefix}.${decl.name.text}` : decl.name.text;
    if (!namespaces.has(name)) namespaces.set(name, emptyNamespace(name, lineOf(decl)));
    const ns = namespaces.get(name);
    const children = [];
    for (const st of decl.body.statements) {
      if (ts.isModuleDeclaration(st) && st.body && ts.isModuleBlock(st.body)) {
        children.push(st);
      } else if (aliasTarget(st)) {
        const path = `${name}.${st.name.text}`;
        if (aliasSource?.namespaces.has(path)) children.push(st);
        else readAlias(st, ns, path);
      } else if (ts.isInterfaceDeclaration(st) && isExported(st)) {
        const iface = readInterface(sf, st, lineOf(st));
        for (const base of st.heritageClauses?.flatMap((h) => h.types) ?? []) inherit(iface, base, `${name}.${st.name.text}`);
        ns.types.set(st.name.text, iface);
        typeCount++;
      } else if (ts.isTypeAliasDeclaration(st) && isExported(st)) {
        ns.types.set(st.name.text, { kind: "typeAlias", name: st.name.text, line: lineOf(st) });
        typeCount++;
      } else if (ts.isFunctionDeclaration(st) && st.name) {
        if (!ns.functions.has(st.name.text)) ns.functions.set(st.name.text, []);
        ns.functions.get(st.name.text).push({
          line: lineOf(st),
          raw: st.getText(sf),
          params: readParams(sf, st),
        });
        fnCount++;
      } else if (ts.isVariableStatement(st)) {
        for (const v of st.declarationList.declarations) {
          const typeText = v.type ? v.type.getText(sf) : "";
          const entry = { name: v.name.getText(sf), typeText, line: lineOf(v) };
          if (/^(Omit<)?WebExtensionEvent</.test(typeText)) {
            ns.events.set(entry.name, entry);
            evCount++;
          } else {
            ns.properties.set(entry.name, entry);
            propCount++;
          }
        }
      }
    }
    for (const child of children) {
      const childName = child.name.text;
      if (ts.isImportEqualsDeclaration(child)) {
        readAlias(child, ns, `${name}.${childName}`);
      } else if (ns.functions.has(childName) || ns.events.has(childName) || ns.types.has(childName)) {
        ns.helpers.set(childName, readHelper(child.body));
      } else {
        readNamespace(child, name);
      }
    }
    // A function named after a reserved word is declared under another name
    // and exported as itself: export { _eval as eval }.
    for (const st of decl.body.statements) {
      if (!ts.isExportDeclaration(st) || !st.exportClause || !ts.isNamedExports(st.exportClause)) continue;
      for (const spec of st.exportClause.elements) {
        const local = spec.propertyName?.text;
        if (local && ns.functions.has(local)) {
          ns.functions.set(spec.name.text, ns.functions.get(local));
          ns.functions.delete(local);
        }
      }
    }
  };

  for (const st of sf.statements) {
    if (ts.isModuleDeclaration(st) && ROOTS.has(st.name.text) && st.body && ts.isModuleBlock(st.body)) {
      for (const inner of st.body.statements) {
        if (ts.isModuleDeclaration(inner) && inner.body && ts.isModuleBlock(inner.body)) readNamespace(inner, "");
        else if (aliasTarget(inner)) readAlias(inner, null, inner.name.text);
      }
    }
  }

  return {
    file: dtsPath.split("/").pop(),
    namespaces,
    aliasErrors,
    counts: {
      namespaces: namespaces.size,
      types: typeCount,
      functions: fnCount,
      events: evCount,
      properties: propCount,
    },
  };
}
