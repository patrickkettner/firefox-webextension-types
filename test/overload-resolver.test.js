import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  resolveOverloads,
  identifyCallback,
  collapseUnifiableOverloads,
} from "../src/overload-resolver.js";

describe("OverloadResolver", () => {
  it("identifies callback parameter correctly", () => {
    const params = [
      { name: "a", type: "string" },
      { name: "callback", type: "function" },
    ];
    assert.equal(identifyCallback(params, true), 1);
    assert.equal(identifyCallback(params, false), -1);
  });

  it("handles leading optional parameters", () => {
    const fn = {
      name: "sendMessage",
      parameters: [
        { name: "extensionId", type: "string", optional: true },
        { name: "message", type: "any" },
        { name: "options", type: "object", optional: true },
      ],
    };
    const overloads = resolveOverloads(fn);
    assert.equal(overloads.length, 2);
    assert.equal(overloads[0].parameters[0].name, "extensionId");
    assert.equal(overloads[0].parameters[0].optional, false);
    assert.equal(overloads[1].parameters[0].name, "message");
  });

  it("generates async overloads (promise and callback)", () => {
    const fn = {
      name: "get",
      async: "callback",
      parameters: [
        { name: "keys", type: "any", optional: true },
        {
          name: "callback",
          type: "function",
          parameters: [{ name: "items", type: "object" }],
        },
      ],
    };
    const overloads = resolveOverloads(fn);
    assert.equal(overloads.length, 4);

    // Parameterless overloads precede all-optional overloads
    assert.equal(overloads[0].is_promise, true);
    assert.equal(overloads[0].parameters.length, 0);

    assert.equal(overloads[1].is_promise, false);
    assert.equal(overloads[1].parameters.length, 1);
    assert.equal(overloads[1].parameters[0].name, "callback");

    assert.equal(overloads[2].is_promise, true);
    assert.equal(overloads[2].parameters[0].name, "keys");
    assert.equal(overloads[2].callback_payload.type, "object");

    assert.equal(overloads[3].is_promise, false);
    assert.equal(overloads[3].parameters.length, 2);
    assert.equal(overloads[3].parameters[1].name, "callback");
  });

  it("handles pure optional parameters in correct order", () => {
    const fn = {
      name: "reload",
      parameters: [
        { name: "tabId", type: "integer", optional: true },
        { name: "reloadProperties", type: "object", optional: true },
      ],
    };
    const overloads = resolveOverloads(fn);
    assert.equal(overloads.length, 3);
    // 1. Parameterless
    assert.equal(overloads[0].parameters.length, 0);
    // 2. 1 parameter (reloadProperties)
    assert.equal(overloads[1].parameters.length, 1);
    assert.equal(overloads[1].parameters[0].name, "reloadProperties");
    // 3. 2 parameters (tabId, reloadProperties)
    assert.equal(overloads[2].parameters.length, 2);
    assert.equal(overloads[2].parameters[0].name, "tabId");
    assert.equal(overloads[2].parameters[0].optional, false);
  });

  it("strips optional flag from callback arguments", () => {
    const fn = {
      name: "getTab",
      async: "callback",
      parameters: [
        { name: "tabId", type: "integer" },
        {
          name: "callback",
          type: "function",
          parameters: [{ name: "tab", type: "object", optional: true }],
        },
      ],
    };
    const overloads = resolveOverloads(fn);
    const cbOv = overloads.find((ov) => !ov.is_promise);
    const cbParam = cbOv.parameters[1];
    assert.equal(cbParam.parameters[0].optional, false);
  });

  it("unifies single parameter overloads differing by one argument type", () => {
    const overloads = [
      {
        parameters: [{ name: "windowId", type: "integer", optional: true }],
        returns: "void",
        is_promise: false,
        callback_payload: null,
      },
      {
        parameters: [{ name: "windowId", type: "null", optional: true }],
        returns: "void",
        is_promise: false,
        callback_payload: null,
      },
    ];
    const unified = collapseUnifiableOverloads(overloads);
    assert.equal(unified.length, 1);
    assert.ok("choices" in unified[0].parameters[0]);
    assert.equal(unified[0].parameters[0].choices.length, 2);
  });

  it("does not synthesize callback overloads when async is true without callback", () => {
    const fn = {
      name: "getState",
      async: true,
      parameters: [],
    };
    const overloads = resolveOverloads(fn);
    assert.equal(overloads.length, 1);
    assert.equal(overloads[0].is_promise, true);
    assert.equal(overloads[0].parameters.length, 0);

    const fn2 = {
      name: "query",
      async: true,
      parameters: [{ name: "details", type: "object" }],
    };
    const overloads2 = resolveOverloads(fn2);
    assert.equal(overloads2.length, 1);
    assert.equal(overloads2[0].is_promise, true);
    assert.equal(overloads2[0].parameters.length, 1);
    assert.equal(overloads2[0].parameters[0].name, "details");
  });
});
