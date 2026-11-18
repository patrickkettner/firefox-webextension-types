import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseWebidl, webidlTypeToTs } from "../src/webidl.js";

const IDL = `
/* comment */
enum Status { "a", "b" };
[Exposed=Window]
interface Thing : EventTarget {
  [ChromeOnly]
  static Thing create(unsigned long long id);
  constructor(DOMString type, optional ThingInit init = {});
  [Throws]
  undefined write((ArrayBuffer or Uint8Array) data);
  [Pure]
  readonly attribute Status status;
  attribute EventHandler ondata;
};
dictionary ThingInit { required ArrayBuffer data; };
`;

describe("WebIDL reader", () => {
  // Firefox: StreamFilter.webidl (interface, attribute, readonly attribute and EventHandler forms), StreamFilterDataEvent.webidl
  it("reads enums and interfaces, skipping ChromeOnly, static and constructor members", () => {
    const types = parseWebidl(IDL, "x.webidl");
    assert.deepEqual(types.map((t) => t.id), ["Status", "Thing"]);
    assert.deepEqual(types[0].enum, ["a", "b"]);
    const { extends: parent, members } = types[1]._webidl;
    assert.equal(parent, "EventTarget");
    assert.deepEqual(members.map((m) => m.name), ["write", "status", "ondata"]);
    assert.equal(members[1].readonly, true);
    assert.equal(members[0].params[0].type, "(ArrayBuffer or Uint8Array)");
  });

  // TypeScript: lib.dom.d.ts maps DOMString to string, undefined to void and EventHandler to a function or null
  // Firefox: StreamFilter.cpp (the event each handler receives)
  it("maps WebIDL types to TypeScript", () => {
    const handlers = { "Thing.ondata": "ThingDataEvent" };
    assert.equal(webidlTypeToTs("DOMString", "Thing", "x", handlers), "string");
    assert.equal(webidlTypeToTs("undefined", "Thing", "x", handlers), "void");
    assert.equal(webidlTypeToTs("unsigned long long", "Thing", "x", handlers), "number");
    assert.equal(webidlTypeToTs("(ArrayBuffer or Uint8Array)", "Thing", "x", handlers), "ArrayBuffer | Uint8Array");
    assert.equal(webidlTypeToTs("DOMString?", "Thing", "x", handlers), "string | null");
    assert.equal(
      webidlTypeToTs("EventHandler", "Thing", "ondata", handlers),
      "((this: Thing, event: ThingDataEvent) => any) | null"
    );
    assert.equal(
      webidlTypeToTs("EventHandler", "Thing", "onstop", handlers),
      "((this: Thing, event: Event) => any) | null"
    );
  });
});
