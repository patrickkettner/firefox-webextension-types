import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { findDeadOverloads } from "../scripts/lib/dead-overloads.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const check = (text) => findDeadOverloads(path.join(root, "virtual.d.ts"), text).dead;

// TypeScript: overload resolution takes the first signature that accepts the call
describe("dead overload check", () => {
  it("fails a parameterless overload after one whose parameters are all optional", () => {
    const [dead] = check("export namespace alarms {\n  export function clearAll(name?: string): Promise<boolean>;\n  export function clearAll(): Promise<void>;\n}\n");
    assert.match(dead, /^alarms\.clearAll: overload 2 can never be chosen, overload 1 accepts every call it does/);
  });

  it("passes the same overloads in the order TypeScript can reach", () => {
    assert.deepEqual(check("export namespace a {\n  export function f(): void;\n  export function f(name?: string): void;\n}\n"), []);
  });

  it("reads past JSDoc {@link} braces and nested namespaces", () => {
    const text =
      "export namespace a {\n  /** See {@link b.c}. */\n  export namespace inner {\n    export interface X { y: { z: string } }\n  }\n" +
      "  export function f(x?: string | null): void;\n  export function f(x: string): void;\n}\n";
    assert.equal(check(text).length, 1);
  });

  it("does not treat a parameter typed any as covered by a narrower one", () => {
    assert.deepEqual(check("export namespace a {\n  export function f(id: string, m: any): void;\n  export function f(m: any, o: number): void;\n}\n"), []);
  });

  it("checks interface methods and rest parameters", () => {
    assert.equal(check("export interface I {\n  m(x?: string): void;\n  m(): void;\n}\n").length, 1);
    assert.equal(check("export namespace a {\n  export function f(...r: unknown[]): void;\n  export function f(a: string, b: number): void;\n}\n").length, 1);
    assert.deepEqual(check("export namespace a {\n  export function f(a?: string, b?: number): void;\n  export function f(...r: string[]): void;\n}\n"), []);
  });

  it("visits every function declared in dist/index.d.ts", () => {
    const file = path.join(root, "dist", "index.d.ts");
    const declared = fs.readFileSync(file, "utf8").split("\n").filter((l) => /^\s*(export\s+)?function\s/.test(l)).length;
    const result = findDeadOverloads(file);
    assert.equal(result.functions, declared);
    assert.deepEqual(result.dead, []);
  });
});
