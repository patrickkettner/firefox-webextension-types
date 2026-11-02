/**
 * overload-resolver.js - Dual Promise/Callback overload generation and signature optimization
 */

export function isAsyncFunction(fnDict) {
  return ["callback", true, "responseCallback"].includes(fnDict.async);
}

export function identifyCallback(params, isAsync) {
  if (!isAsync) {
    return -1;
  }
  for (let i = 0; i < params.length; i++) {
    const name = params[i].name;
    if (name === "callback" || name === "responseCallback") {
      return i;
    }
  }
  if (params.length > 0 && params[params.length - 1].type === "function") {
    return params.length - 1;
  }
  return -1;
}

// Schemas.sys.mjs checkParameters skips optional parameters by position and
// substitutes the default for an explicit null or undefined. Optional
// parameters that trail every required one stay `?` in a single signature.
// An optional parameter followed by a required one yields two overloads,
// one without it and one where it is kept in place and marked nullable,
// because null and undefined are still accepted there.
export function generateLeadingOptionalOverloads(params) {
  let lastRequired = -1;
  for (let i = 0; i < params.length; i++) {
    if (!params[i].optional) {
      lastRequired = i;
    }
  }

  const build = (index, chosen) => {
    if (index > lastRequired) {
      return [[...chosen, ...structuredClone(params.slice(index))]];
    }
    const p = structuredClone(params[index]);
    if (!p.optional) {
      return build(index + 1, [...chosen, p]);
    }
    p.optional = false;
    p.nullable = true;
    return [...build(index + 1, [...chosen, p]), ...build(index + 1, chosen)];
  };

  if (lastRequired === -1) {
    if (params.length === 0) {
      return [[]];
    }
    const overloads = [];
    for (let startIdx = params.length - 1; startIdx >= 0; startIdx--) {
      overloads.push(structuredClone(params.slice(startIdx)));
    }
    return overloads;
  }

  return build(0, []);
}

export function collapseUnifiableOverloads(overloads) {
  let i = 0;
  while (i < overloads.length) {
    let j = i + 1;
    let merged = false;
    while (j < overloads.length) {
      const ov1 = overloads[i];
      const ov2 = overloads[j];
      if (
        ov1.is_promise === ov2.is_promise &&
        JSON.stringify(ov1.returns) === JSON.stringify(ov2.returns) &&
        JSON.stringify(ov1.callback_payload) === JSON.stringify(ov2.callback_payload)
      ) {
        const p1 = ov1.parameters || [];
        const p2 = ov2.parameters || [];
        if (p1.length === p2.length && p1.length > 0) {
          const diffIndices = [];
          let namesMatch = true;
          for (let k = 0; k < p1.length; k++) {
            if (
              p1[k].name !== p2[k].name ||
              Boolean(p1[k].optional) !== Boolean(p2[k].optional) ||
              Boolean(p1[k].nullable) !== Boolean(p2[k].nullable)
            ) {
              namesMatch = false;
              break;
            }
            if (JSON.stringify(p1[k]) !== JSON.stringify(p2[k])) {
              diffIndices.push(k);
            }
          }
          if (namesMatch && diffIndices.length === 1) {
            const k = diffIndices[0];
            const c1 = p1[k].choices ? p1[k].choices : [p1[k]];
            const c2 = p2[k].choices ? p2[k].choices : [p2[k]];
            const mergedParam = structuredClone(p1[k]);
            const mergedChoices = [...c1];
            for (const c of c2) {
              if (!mergedChoices.some((existing) => JSON.stringify(existing) === JSON.stringify(c))) {
                mergedChoices.push(c);
              }
            }
            mergedParam.choices = mergedChoices;
            if ("type" in mergedParam && "choices" in mergedParam) {
              delete mergedParam.type;
            }
            p1[k] = mergedParam;
            overloads.splice(j, 1);
            merged = true;
            break;
          }
        }
      }
      j++;
    }
    if (!merged) {
      i++;
    }
  }
  return overloads;
}

export function resolveOverloads(fnDict) {
  const params = fnDict.parameters || [];
  const isAsync = isAsyncFunction(fnDict);
  const cbIdx = identifyCallback(params, isAsync);

  let cbParam = null;
  let nonCbParams;
  let cbPayload;

  if (cbIdx !== -1) {
    cbParam = structuredClone(params[cbIdx]);
    nonCbParams = [...params.slice(0, cbIdx), ...params.slice(cbIdx + 1)];
    cbPayload = "void";
    const cbArgs = cbParam.parameters || [];
    if (cbArgs.length === 1) {
      cbPayload = structuredClone(cbArgs[0]);
    } else if (cbArgs.length > 1) {
      // ExtensionCommon.sys.mjs resolves a SpreadArgs result with the whole
      // argument array when it holds more than one value.
      cbPayload = { tuple: structuredClone(cbArgs) };
    } else if ("returns" in fnDict) {
      cbPayload = structuredClone(fnDict.returns);
    }
  } else {
    cbParam = null;
    nonCbParams = [...params];
    cbPayload = fnDict.returns || "void";
  }

  const baseOverloads = generateLeadingOptionalOverloads(nonCbParams);
  const hasCallback =
    cbParam !== null || fnDict.async === "callback" || fnDict.async === "responseCallback";

  const promiseOverloads = [];
  const callbackOverloads = [];
  for (const bo of baseOverloads) {
    if (!isAsync) {
      promiseOverloads.push({
        parameters: bo,
        returns: fnDict.returns || "void",
        is_promise: false,
        callback_payload: null,
      });
      continue;
    }
    promiseOverloads.push({
      parameters: bo,
      returns: "void",
      is_promise: true,
      callback_payload: cbPayload,
    });
    if (!hasCallback) {
      continue;
    }
    const variations = [bo];
    let curr = [...bo];
    while (curr.length > 0 && curr[curr.length - 1].optional) {
      curr = curr.slice(0, -1);
      variations.push(curr);
    }
    for (const variant of variations) {
      const cbBo = structuredClone(variant);
      for (const p of cbBo) {
        if (p.optional) {
          p.optional = false;
          p.nullable = true;
        }
      }
      const cbP = cbParam
        ? structuredClone(cbParam)
        : { name: "callback", type: "function", optional: false };
      cbP.optional = false;
      cbBo.push(cbP);
      callbackOverloads.push({
        parameters: cbBo,
        returns: "void",
        is_promise: false,
        callback_payload: cbPayload,
      });
    }
  }
  // Promise forms first, so an `any` argument resolves to the Promise form.
  const resolved = [...promiseOverloads, ...callbackOverloads];

  const seen = new Set();
  let deduped = [];
  for (const r of resolved) {
    const sig = JSON.stringify([
      r.is_promise,
      r.parameters.map((p) => [
        p.name,
        Boolean(p.optional),
        Boolean(p.nullable),
        p.type,
        p.$ref,
        JSON.stringify(p.choices),
      ]),
    ]);
    if (!seen.has(sig)) {
      seen.add(sig);
      deduped.push(r);
    }
  }

  deduped = collapseUnifiableOverloads(deduped);
  return deduped;
}
