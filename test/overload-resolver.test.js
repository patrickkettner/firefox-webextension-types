import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  resolveOverloads,
  identifyCallback,
  collapseUnifiableOverloads,
  generateLeadingOptionalOverloads,
} from "../src/overload-resolver.js";

const shape = (overloads) =>
  overloads.map((ov) => [
    ov.is_promise,
    ov.parameters.map((p) => `${p.name}${p.optional ? "?" : ""}${p.nullable ? "!" : ""}`).join(","),
  ]);

// Firefox: Schemas.sys.mjs (checkParameters skips optional parameters by position, FunctionEntry adds a callback for async), ExtensionCommon.sys.mjs (SpreadArgs)
describe("OverloadResolver", () => {
  it("identifies callback parameter correctly", () => {
    const params = [
      { name: "a", type: "string" },
      { name: "callback", type: "function" },
    ];
    assert.equal(identifyCallback(params, true), 1);
    assert.equal(identifyCallback(params, false), -1);
  });

  it("keeps a trailing optional list as one signature", () => {
    const overloads = generateLeadingOptionalOverloads([
      { name: "a", type: "string" },
      { name: "b", type: "string", optional: true },
    ]);
    assert.deepEqual(overloads.map((o) => o.map((p) => p.name)), [["a", "b"]]);
    assert.equal(overloads[0][1].optional, true);
  });

  it("splits a leading optional parameter into positional overloads and marks it nullable", () => {
    const fn = {
      name: "sendMessage",
      parameters: [
        { name: "extensionId", type: "string", optional: true },
        { name: "message", type: "any" },
        { name: "options", type: "object", optional: true },
      ],
    };
    assert.deepEqual(shape(resolveOverloads(fn)), [
      [false, "extensionId!,message,options?"],
      [false, "message,options?"],
    ]);
  });

  it("orders Promise overloads before callback overloads", () => {
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
    assert.deepEqual(shape(overloads), [
      [true, "keys?"],
      [false, "keys!,callback"],
      [false, "callback"],
    ]);
    assert.equal(overloads[0].callback_payload.type, "object");
  });

  it("keeps every parameter optional in an all-optional list", () => {
    const fn = {
      name: "reload",
      parameters: [
        { name: "tabId", type: "integer", optional: true },
        { name: "reloadProperties", type: "object", optional: true },
      ],
    };
    assert.deepEqual(shape(resolveOverloads(fn)), [
      [false, "reloadProperties?"],
      [false, "tabId?,reloadProperties?"],
    ]);
  });

  it("preserves the optional flag on the callback payload", () => {
    const fn = {
      name: "getCurrent",
      async: "callback",
      parameters: [
        {
          name: "callback",
          type: "function",
          parameters: [{ name: "tab", type: "object", optional: true }],
        },
      ],
    };
    const overloads = resolveOverloads(fn);
    assert.equal(overloads[0].is_promise, true);
    assert.equal(overloads[0].callback_payload.optional, true);
    const cbOv = overloads.find((ov) => !ov.is_promise);
    assert.equal(cbOv.parameters[0].parameters[0].optional, true);
  });

  it("resolves a multi-argument callback as a tuple payload", () => {
    const fn = {
      name: "eval",
      async: "callback",
      parameters: [
        { name: "expression", type: "string" },
        {
          name: "callback",
          type: "function",
          parameters: [
            { name: "result", type: "any" },
            { name: "exceptionInfo", type: "object", optional: true },
          ],
        },
      ],
    };
    const [promiseOv] = resolveOverloads(fn);
    assert.deepEqual(
      promiseOv.callback_payload.tuple.map((p) => p.name),
      ["result", "exceptionInfo"]
    );
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
