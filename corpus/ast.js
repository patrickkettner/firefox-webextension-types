import * as acorn from "acorn";

export const FUNCTION_TYPES = new Set(["FunctionExpression", "ArrowFunctionExpression", "FunctionDeclaration"]);

export function parseJs(text) {
  const options = {
    ecmaVersion: "latest",
    allowReturnOutsideFunction: true,
    allowAwaitOutsideFunction: true,
    allowHashBang: true,
    allowImportExportEverywhere: true,
  };
  for (const sourceType of ["script", "module"]) {
    try {
      return acorn.parse(text, { ...options, sourceType });
    } catch {
      // retry as the other source type
    }
  }
  return null;
}

export function children(node) {
  const out = [];
  for (const [key, value] of Object.entries(node)) {
    if (key === "type" || key === "start" || key === "end") continue;
    if (Array.isArray(value)) {
      for (const item of value) if (item && typeof item.type === "string") out.push(item);
    } else if (value && typeof value.type === "string") {
      out.push(value);
    }
  }
  return out;
}

export function propertyKey(property) {
  if (property.computed) return null;
  if (property.key.type === "Identifier") return property.key.name;
  if (property.key.type === "Literal") return String(property.key.value);
  return null;
}

// Peels calls, member accesses, optional chains and awaits off an expression
// and returns the root identifier with the property names walked on the way.
export function chainOf(expression) {
  let current = expression;
  const props = [];
  for (;;) {
    if (current.type === "CallExpression") current = current.callee;
    else if (current.type === "MemberExpression") {
      const p = current.property;
      props.unshift(current.computed ? (p.type === "Literal" ? String(p.value) : "?") : p.name);
      current = current.object;
    } else if (current.type === "ChainExpression") current = current.expression;
    else if (current.type === "AwaitExpression") current = current.argument;
    else break;
  }
  return { root: current.type === "Identifier" ? current.name : null, props };
}

export function apiChain(expression, namespaces) {
  const chain = chainOf(expression);
  const isApiRoot = chain.root === "browser" || chain.root === "chrome";
  return isApiRoot && chain.props.length > 0 && namespaces.has(chain.props[0]) ? chain : null;
}

// Callee names whose arguments are expected to fail. Calls inside these are
// counted separately and never become families.
export const INTENTIONAL_FAILURE_CALLEES = new Set([
  "assertThrows",
  "assertRejects",
  "assertSetIconThrows",
  "throws",
  "rejects",
  "expectError",
  "throwsGen",
]);

export function calleeName(callee) {
  if (callee.type === "Identifier") return callee.name;
  if (callee.type === "MemberExpression" && !callee.computed) return callee.property.name;
  return null;
}
