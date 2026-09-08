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

export function generateLeadingOptionalOverloads(params) {
  let lastRequired = -1;
  for (let i = 0; i < params.length; i++) {
    if (!params[i].optional) {
      lastRequired = i;
    }
  }

  // If all parameters are optional: parameterless first, then specific overloads
  if (lastRequired === -1) {
    if (params.length === 0) {
      return [[]];
    }
    const overloads = [[]];
    for (let startIdx = params.length - 1; startIdx >= 0; startIdx--) {
      const overload = structuredClone(params.slice(startIdx));
      overload[0].optional = false;
      overloads.push(overload);
    }
    return overloads;
  }

  let firstRequired = -1;
  for (let i = 0; i < params.length; i++) {
    if (!params[i].optional) {
      firstRequired = i;
      break;
    }
  }

  if (firstRequired === 0) {
    return [params];
  }

  const overloads = [];
  for (let startIdx = 0; startIdx <= firstRequired; startIdx++) {
    const overload = structuredClone(params.slice(startIdx));
    for (let i = 0; i < firstRequired - startIdx; i++) {
      if (i < overload.length) {
        overload[i].optional = false;
      }
    }
    overloads.push(overload);
  }

  return overloads;
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
            if (p1[k].name !== p2[k].name || Boolean(p1[k].optional) !== Boolean(p2[k].optional)) {
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
    if (cbArgs.length > 0) {
      cbPayload = structuredClone(cbArgs[0]);
      if (typeof cbPayload === "object" && cbPayload !== null && "optional" in cbPayload) {
        cbPayload.optional = false;
      }
    } else if ("returns" in fnDict) {
      cbPayload = structuredClone(fnDict.returns);
      if (typeof cbPayload === "object" && cbPayload !== null && "optional" in cbPayload) {
        cbPayload.optional = false;
      }
    }
    for (const p of cbParam.parameters || []) {
      if ("optional" in p) {
        p.optional = false;
      }
    }
  } else {
    cbParam = null;
    nonCbParams = [...params];
    cbPayload = fnDict.returns || "void";
    if (typeof cbPayload === "object" && cbPayload !== null && cbPayload.optional) {
      cbPayload = structuredClone(cbPayload);
      cbPayload.optional = false;
    }
  }

  const baseOverloads = generateLeadingOptionalOverloads(nonCbParams);
  const hasCallback =
    cbParam !== null || fnDict.async === "callback" || fnDict.async === "responseCallback";

  const resolved = [];
  for (const bo of baseOverloads) {
    if (isAsync) {
      resolved.push({
        parameters: bo,
        returns: "void",
        is_promise: true,
        callback_payload: cbPayload,
      });
      if (hasCallback) {
        const variations = [bo];
        let curr = [...bo];
        while (curr.length > 0 && curr[curr.length - 1].optional) {
          curr = curr.slice(0, -1);
          variations.push(curr);
        }

        for (const variant of variations) {
          const cbBo = structuredClone(variant);
          for (const p of cbBo) {
            p.optional = false;
          }
          const cbP = cbParam
            ? structuredClone(cbParam)
            : { name: "callback", type: "function", optional: false };
          cbP.optional = false;
          for (const p of cbP.parameters || []) {
            if ("optional" in p) {
              p.optional = false;
            }
          }
          cbBo.push(cbP);
          resolved.push({
            parameters: cbBo,
            returns: "void",
            is_promise: false,
            callback_payload: cbPayload,
          });
        }
      }
    } else {
      resolved.push({
        parameters: bo,
        returns: fnDict.returns || "void",
        is_promise: false,
        callback_payload: null,
      });
    }
  }

  const seen = new Set();
  let deduped = [];
  for (const r of resolved) {
    const sig = JSON.stringify([
      r.is_promise,
      r.parameters.map((p) => [
        p.name,
        Boolean(p.optional),
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
