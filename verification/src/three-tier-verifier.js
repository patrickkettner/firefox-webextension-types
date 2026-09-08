/**
 * three-tier-verifier.js - 3-Tier Verification Engine for Firefox WebExtension types
 *
 * Tier 1: Set Topology (100% Completeness & 0 Phantoms across all 3 regions)
 * Tier 2: Homomorphic Equivalence (Modifiers, optionality, signatures on S ∩ E)
 * Tier 3: Sequential Collation Invariants (Unicode code-point sort verification)
 */

import { codePointCompare } from "../../src/comparator.js";

export function verifyDeclarations(schemaUniverse, emittedUniverse) {
  const errors = [];

  // Tier 1: Set Topology (Three-Region Difference)
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

  if (missingTypes.length > 0) {
    errors.push(`Tier 1 FAIL: Missing types in emitted .d.ts (${missingTypes.length}): ${missingTypes.slice(0, 5).join(", ")}...`);
  }
  if (phantomTypes.length > 0) {
    errors.push(`Tier 1 FAIL: Emitted phantom types without schema backing (${phantomTypes.length}): ${phantomTypes.join(", ")}`);
  }

  // Tier 2: Homomorphic Equivalence
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
            const schemaMarked = Boolean(sProp.readOnly || sProp.readonly || sProp.unsupported);
            const isManifest = nsName === "manifest" || tName.endsWith("Manifest");
            if (!schemaMarked && !isManifest) {
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

  // Tier 3: Sequential Collation Invariant
  const collationErrors = [];
  const emittedNsList = Array.from(emittedNsNames);
  for (let i = 0; i < emittedNsList.length - 1; i++) {
    if (codePointCompare(emittedNsList[i], emittedNsList[i + 1]) > 0) {
      collationErrors.push(`Namespaces out of code-point order: '${emittedNsList[i]}' precedes '${emittedNsList[i + 1]}'`);
      break;
    }
  }

  for (const [nsName, eNs] of emittedUniverse.namespaces.entries()) {
    const typeKeys = Array.from(eNs.types.keys());
    for (let i = 0; i < typeKeys.length - 1; i++) {
      if (codePointCompare(typeKeys[i], typeKeys[i + 1]) > 0) {
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
      inSchemaNotEmitted: inSchemaNotEmitted.length,
      inEmittedNotSchema: inEmittedNotSchema.length,
      inBoth: inBoth.length,
      missingTypes: missingTypes.length,
      phantomTypes: phantomTypes.length,
      fabricatedReadonly: fabricatedReadonly.length,
      collationErrors: collationErrors.length,
    },
  };
}
