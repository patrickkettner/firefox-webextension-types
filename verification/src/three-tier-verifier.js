// Compares a .d.ts with the schemas in three tiers. Tier 1: every schema
// namespace and type is declared, and nothing is declared without a schema
// behind it. The same holds for the members of each namespace (functions,
// events, properties) and of each object type, and every definition of a
// function has an overload with its parameters. Tier 2: no property is
// readonly unless its schema says so. Tier 3: namespaces, and the types in
// each, are in code point order, checked with plain `>` so that a bug in the
// generator's comparator cannot hide here.

import { ADDED_MEMBERS } from "./declared-differences.js";

const RESERVED_PARAMETER_NAMES = {
  default: "defaultValue",
  delete: "deleteArg",
  function: "func",
  in: "inArg",
  var: "variable",
  new: "newArg",
  class: "classArg",
  export: "exportArg",
  import: "importArg",
};

function helperTypeNames(owner) {
  const names = new Set(["Result"]);
  const add = (p) => {
    const name = RESERVED_PARAMETER_NAMES[p.name] || p.name || "arg";
    names.add(name[0].toUpperCase() + name.slice(1));
  };
  for (const p of owner.parameters || []) {
    add(p);
    for (const q of p.parameters || []) add(q);
  }
  return names;
}

const lowerFirst = (name) => name[0].toLowerCase() + name.slice(1);

// True when an overload's parameters are this definition's, in order, with
// only optional ones or the async callback left out. A parameter the schema
// does not name matches any name.
function overloadFits(definition, overload) {
  const schema = (definition.parameters || []).map((p) => ({
    name: p.name ? lowerFirst(RESERVED_PARAMETER_NAMES[p.name] || p.name) : null,
    required: !p.optional && p.name !== definition.async,
  }));
  const emitted = overload.params.map((p) => lowerFirst(p.name));
  const fits = (i, j) => {
    if (i === emitted.length) return schema.slice(j).every((p) => !p.required);
    if (j === schema.length) return false;
    if ((schema[j].name === null || schema[j].name === emitted[i]) && fits(i + 1, j + 1)) return true;
    return !schema[j].required && fits(i, j + 1);
  };
  return fits(0, 0);
}

function resolveSchemaType(schemaUniverse, nsName, ref) {
  const dot = ref.lastIndexOf(".");
  if (dot < 0) return schemaUniverse.namespaces.get(nsName)?.types.get(ref);
  return schemaUniverse.namespaces.get(ref.slice(0, dot))?.types.get(ref.slice(dot + 1));
}

// Property, function and event names of an object type, with those of a type
// it $imports and of the $extend entries for it.
function schemaTypeMembers(schemaUniverse, nsName, type, seen = new Set()) {
  const names = new Set();
  if (!type || seen.has(type)) return names;
  seen.add(type);
  for (const name of Object.keys(type.properties || {})) names.add(name);
  for (const f of type.functions || []) names.add(f.name);
  for (const e of type.events || []) names.add(e.name);
  const add = (other) => {
    for (const name of schemaTypeMembers(schemaUniverse, nsName, other, seen)) names.add(name);
  };
  if (type.$import) add(resolveSchemaType(schemaUniverse, nsName, type.$import));
  for (const ext of schemaUniverse.namespaces.get(nsName)?.extends || []) {
    if (ext.$extend === type.id) add(ext);
  }
  return names;
}

// A string enum, alone or as one of the type's choices.
function hasEnumValues(type) {
  return Array.isArray(type?.enum) || (type?.choices || []).some((c) => Array.isArray(c.enum));
}

const SINGULAR = { functions: "function", events: "event", properties: "property" };

function setDifference(a, b) {
  return [...a].filter((x) => !b.has(x));
}

export function verifyDeclarations(schemaUniverse, emittedUniverse) {
  const errors = [];

  // Tier 1
  const aliasErrors = emittedUniverse.aliasErrors ?? [];
  if (aliasErrors.length > 0) {
    errors.push(`Tier 1 FAIL: Aliases that do not name the same browser member (${aliasErrors.length}): ${aliasErrors.slice(0, 5).join(" ")}`);
  }
  const schemaNsNames = new Set(schemaUniverse.namespaces.keys());
  const emittedNsNames = new Set(emittedUniverse.namespaces.keys());

  const inSchemaNotEmitted = [];
  const inEmittedNotSchema = [];
  const inBoth = [];

  for (const ns of schemaNsNames) {
    if (emittedNsNames.has(ns)) {
      inBoth.push(ns);
    } else {
      inSchemaNotEmitted.push(ns);
    }
  }

  for (const ns of emittedNsNames) {
    if (!schemaNsNames.has(ns)) {
      inEmittedNotSchema.push(ns);
    }
  }

  if (inSchemaNotEmitted.length > 0) {
    errors.push(`Tier 1 FAIL: Missing namespaces in emitted .d.ts (${inSchemaNotEmitted.length}): ${inSchemaNotEmitted.join(", ")}`);
  }
  if (inEmittedNotSchema.length > 0) {
    errors.push(`Tier 1 FAIL: Emitted phantom namespaces with no schema backing (${inEmittedNotSchema.length}): ${inEmittedNotSchema.join(", ")}`);
  }

  // Type-level set difference within matched namespaces
  const missingTypes = [];
  const phantomTypes = [];

  for (const nsName of inBoth) {
    const sNs = schemaUniverse.namespaces.get(nsName);
    const eNs = emittedUniverse.namespaces.get(nsName);

    const sTypes = new Set(sNs.types.keys());
    const eTypes = new Set(eNs.types.keys());

    for (const t of sTypes) {
      if (!eTypes.has(t)) {
        missingTypes.push(`${nsName}.${t}`);
      }
    }

    for (const t of eTypes) {
      if (!sTypes.has(t)) {
        phantomTypes.push(`${nsName}.${t}`);
      }
    }
  }

  // Helper namespaces: one per function, event or type member, holding only
  // types named after that owner's parameters or its result.
  const phantomHelpers = [];
  for (const nsName of inBoth) {
    const sNs = schemaUniverse.namespaces.get(nsName);
    const eNs = emittedUniverse.namespaces.get(nsName);
    for (const [holder, helper] of (eNs.helpers || new Map()).entries()) {
      const schemaName = holder.startsWith("_") ? holder.slice(1) : holder;
      const owner = sNs.functions.get(schemaName) || sNs.events.get(schemaName);
      if (owner) {
        for (const t of helper.types) {
          if (!helperTypeNames(owner).has(t)) phantomHelpers.push(`${nsName}.${holder}.${t}`);
        }
        for (const nestedName of helper.nested.keys()) {
          phantomHelpers.push(`${nsName}.${holder}.${nestedName}`);
        }
        continue;
      }
      const ownerType = sNs.types.get(holder);
      if (!ownerType) {
        phantomHelpers.push(`${nsName}.${holder}`);
        continue;
      }
      for (const t of helper.types) {
        phantomHelpers.push(`${nsName}.${holder}.${t}`);
      }
      for (const [memberName, types] of helper.nested.entries()) {
        const member =
          (ownerType.functions || []).find((f) => f.name === memberName) ||
          (ownerType.events || []).find((e) => e.name === memberName);
        if (!member) {
          phantomHelpers.push(`${nsName}.${holder}.${memberName}`);
          continue;
        }
        for (const t of types) {
          if (!helperTypeNames(member).has(t)) phantomHelpers.push(`${nsName}.${holder}.${memberName}.${t}`);
        }
      }
    }
  }
  if (phantomHelpers.length > 0) {
    errors.push(`Tier 1 FAIL: Helper types not named after a schema parameter or result (${phantomHelpers.length}): ${phantomHelpers.slice(0, 5).join(", ")}`);
  }

  if (missingTypes.length > 0) {
    errors.push(`Tier 1 FAIL: Missing types in emitted .d.ts (${missingTypes.length}): ${missingTypes.slice(0, 5).join(", ")}...`);
  }
  if (phantomTypes.length > 0) {
    errors.push(`Tier 1 FAIL: Emitted phantom types without schema backing (${phantomTypes.length}): ${phantomTypes.join(", ")}`);
  }

  // Tier 1 members
  const missingMembers = [];
  const phantomMembers = [];
  const unrepresentedDefinitions = [];
  const phantomOverloads = [];
  const checked = { functions: 0, definitions: 0, overloads: 0, events: 0, properties: 0, typeMembers: 0 };

  for (const nsName of inBoth) {
    const sNs = schemaUniverse.namespaces.get(nsName);
    const eNs = emittedUniverse.namespaces.get(nsName);

    for (const kind of ["functions", "events", "properties"]) {
      const sNames = new Set(sNs[kind].keys());
      const eNames = new Set(eNs[kind].keys());
      checked[kind] += sNames.size;
      for (const name of setDifference(sNames, eNames)) missingMembers.push(`${SINGULAR[kind]} ${nsName}.${name}`);
      for (const name of setDifference(eNames, sNames)) {
        // An enum type is also declared as a constant holding its values.
        if (kind === "properties" && hasEnumValues(sNs.types.get(name))) continue;
        phantomMembers.push(`${SINGULAR[kind]} ${nsName}.${name}`);
      }
    }

    const definitions = sNs.functionDefinitions || new Map([...sNs.functions].map(([n, f]) => [n, [f]]));
    for (const [fnName, defs] of definitions) {
      const overloads = eNs.functions.get(fnName);
      if (!overloads) continue;
      checked.definitions += defs.length;
      checked.overloads += overloads.length;
      defs.forEach((def, i) => {
        if (!overloads.some((o) => overloadFits(def, o))) {
          const params = (def.parameters || []).map((p) => `${p.name || "?"}${p.optional ? "?" : ""}`).join(", ");
          unrepresentedDefinitions.push(`${nsName}.${fnName} definition ${i + 1} of ${defs.length} (${params})`);
        }
      });
      for (const o of overloads) {
        if (!defs.some((def) => overloadFits(def, o))) {
          phantomOverloads.push(`${nsName}.${fnName}(${o.params.map((p) => p.name).join(", ")})`);
        }
      }
    }

    for (const [tName, eType] of eNs.types) {
      const sType = sNs.types.get(tName);
      if (!sType || eType.kind !== "interface") continue;
      const sNames = schemaTypeMembers(schemaUniverse, nsName, sType);
      const eNames = new Set([...eType.properties.keys(), ...(eType.methods || new Map()).keys()]);
      checked.typeMembers += sNames.size;
      for (const name of setDifference(sNames, eNames)) missingMembers.push(`member ${nsName}.${tName}.${name}`);
      for (const name of setDifference(eNames, sNames)) {
        if (!ADDED_MEMBERS[`${nsName}.${tName}.${name}`]) phantomMembers.push(`member ${nsName}.${tName}.${name}`);
      }
    }
  }

  if (missingMembers.length > 0) {
    errors.push(`Tier 1 FAIL: Schema members missing from the emitted .d.ts (${missingMembers.length}): ${missingMembers.slice(0, 10).join(", ")}`);
  }
  if (phantomMembers.length > 0) {
    errors.push(`Tier 1 FAIL: Emitted members with no schema behind them (${phantomMembers.length}): ${phantomMembers.slice(0, 10).join(", ")}`);
  }
  if (unrepresentedDefinitions.length > 0) {
    errors.push(
      `Tier 1 FAIL: Function definitions with no overload taking their parameters (${unrepresentedDefinitions.length}): ` +
        unrepresentedDefinitions.slice(0, 10).join(", ")
    );
  }
  if (phantomOverloads.length > 0) {
    errors.push(
      `Tier 1 FAIL: Overloads whose parameters match no schema definition (${phantomOverloads.length}): ${phantomOverloads.slice(0, 10).join(", ")}`
    );
  }

  // Tier 2
  const fabricatedReadonly = [];

  for (const nsName of inBoth) {
    const sNs = schemaUniverse.namespaces.get(nsName);
    const eNs = emittedUniverse.namespaces.get(nsName);

    for (const [tName, eType] of eNs.types.entries()) {
      if (eType.kind === "interface" && sNs.types.has(tName)) {
        const sType = sNs.types.get(tName);
        const sProps = sType.properties || {};

        for (const [pName, eProp] of eType.properties.entries()) {
          const sProp = sProps[pName];
          if (sProp && eProp.readonly) {
            const schemaMarked = Boolean(sProp.readOnly || sProp.readonly);
            if (!schemaMarked) {
              fabricatedReadonly.push(`${nsName}.${tName}.${pName}`);
            }
          }
        }
      }
    }
  }

  if (fabricatedReadonly.length > 0) {
    errors.push(`Tier 2 FAIL: Found ${fabricatedReadonly.length} fabricated readonly properties not in schemas: ${fabricatedReadonly.slice(0, 5).join(", ")}`);
  }

  // Tier 3
  const collationErrors = [];
  const emittedNsList = Array.from(emittedNsNames);
  for (let i = 0; i < emittedNsList.length - 1; i++) {
    if (emittedNsList[i] > emittedNsList[i + 1]) {
      collationErrors.push(`Namespaces out of code-point order: '${emittedNsList[i]}' precedes '${emittedNsList[i + 1]}'`);
      break;
    }
  }

  for (const [nsName, eNs] of emittedUniverse.namespaces.entries()) {
    const typeKeys = Array.from(eNs.types.keys());
    for (let i = 0; i < typeKeys.length - 1; i++) {
      if (typeKeys[i] > typeKeys[i + 1]) {
        collationErrors.push(`${nsName}: types out of code-point order: '${typeKeys[i]}' precedes '${typeKeys[i + 1]}'`);
        break;
      }
    }
  }

  if (collationErrors.length > 0) {
    errors.push(`Tier 3 FAIL: Collation violations (${collationErrors.length}): ${collationErrors.slice(0, 3).join("; ")}`);
  }

  return {
    passed: errors.length === 0,
    errors,
    summary: {
      aliasErrors: aliasErrors.length,
      inSchemaNotEmitted: inSchemaNotEmitted.length,
      inEmittedNotSchema: inEmittedNotSchema.length,
      inBoth: inBoth.length,
      missingTypes: missingTypes.length,
      phantomTypes: phantomTypes.length,
      phantomHelpers: phantomHelpers.length,
      missingMembers: missingMembers.length,
      phantomMembers: phantomMembers.length,
      unrepresentedDefinitions: unrepresentedDefinitions.length,
      phantomOverloads: phantomOverloads.length,
      checked,
      fabricatedReadonly: fabricatedReadonly.length,
      collationErrors: collationErrors.length,
    },
  };
}
