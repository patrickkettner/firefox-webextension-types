// A family is one kind of complaint about one API. Its key has no line
// numbers, local variable names, string literals or long type text, so it
// survives unrelated edits to the Firefox tests.

const MAX_TYPE_TEXT = 40;

// The subject of a message such as `'tab.id' is possibly 'undefined'` is a
// local expression. Its root is a variable name in the test, its last
// property name is the declaration's.
function normaliseQuoted(span, isSubject) {
  if (isSubject) return span.includes(".") ? `<expr>.${span.split(".").at(-1)}` : "<expr>";
  if (span.includes("{") || span.includes('"') || span.length > MAX_TYPE_TEXT) {
    // `& void` marks the type TypeScript gives a call that failed overload
    // resolution, which is worth seeing in the key.
    return span.endsWith("& void") ? "<type> & void" : "<type>";
  }
  return `'${span}'`;
}

export function normaliseMessage(message) {
  return message
    .replace(/\s*Did you mean '[^']*'\?/g, "")
    .replace(/'([^']*)'/g, (whole, span, offset, text) => {
      const subject = offset === 0 && /^'[^']*' (is|are|has|implicitly)\b/.test(text);
      return normaliseQuoted(span, subject);
    })
    .replace(/\d+/g, "N");
}

// A message whose own text is elided, or an overload failure, says little.
// The last elaboration line names the actual mismatch, so it joins the key.
export function familyKey(code, message, api, detail = []) {
  const text = normaliseMessage(message);
  const vague = text.includes("<type>") || code === "TS2769";
  const cause = vague && detail.length ? ` :: ${normaliseMessage(detail.at(-1))}` : "";
  return `${code} ${text}${cause} @ ${api}`;
}
