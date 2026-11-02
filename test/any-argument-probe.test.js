// EMP-4: an `any` argument must not select a void callback overload when a
// Promise overload of the same arity exists. The probe calls every overloaded
// function and method in the ambient declarations with `any` arguments and
// asks the TypeScript checker which overload each call resolves to.
import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { installTypeScript } from "./helpers/install-typescript.js";
import { probeAnyArguments } from "./helpers/any-probe.js";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(repoRoot, "dist");
const surfaces = ["global.d.ts", "global-mobile.d.ts"];
const built = surfaces.every((f) => fs.existsSync(path.join(dist, f)));

let ts;

before(() => {
  ts = createRequire(import.meta.url)(installTypeScript("5.9.3").api);
});

describe("any-argument overload probe", () => {
  describe("on a synthetic declaration", () => {
    let dir;
    const probe = (source) => {
      dir ??= fs.mkdtempSync(path.join(os.tmpdir(), "fwt-anyprobe-"));
      const file = path.join(dir, `case-${Math.random().toString(36).slice(2)}.d.ts`);
      fs.writeFileSync(file, source);
      return probeAnyArguments(ts, file);
    };

    it("fails when the callback overload is declared before the Promise overload", () => {
      const result = probe(`declare namespace browser.storage {
        function get(callback: (items: object) => void): void;
        function get(keys: string): Promise<object>;
      }
      declare namespace browser.tabs {
        interface Area {
          read(callback: () => void): void;
          read(id: number): Promise<number>;
        }
      }`);
      assert.equal(result.overloads, 2);
      assert.equal(result.failures.length, 2, result.failures.join("\n"));
      assert.match(result.failures[0], /browser\.storage\.get: 1 any argument\(s\) selects/);
    });

    it("passes when the Promise overload comes first", () => {
      const result = probe(`declare namespace browser.storage {
        function get(keys: string): Promise<object>;
        function get(callback: (items: object) => void): void;
      }`);
      assert.deepEqual(result.failures, []);
    });

    after(() => dir && fs.rmSync(dir, { recursive: true, force: true }));
  });

  describe("on the generated declarations", { skip: !built && "dist not built" }, () => {
    for (const name of surfaces) {
      it(`${name}: no any argument picks a void overload over a Promise overload`, (t) => {
        const { overloads, calls, failures } = probeAnyArguments(ts, path.join(dist, name));
        assert.ok(overloads > 0 && calls > overloads, `probe found ${overloads} overloads and ${calls} calls, which is too few`);
        t.diagnostic(`${overloads} overloaded functions, ${calls} probe calls`);
        assert.deepEqual(
          failures,
          [],
          `${failures.length} call(s) with an any argument resolve to a void overload in dist/${name}.\n` +
            `Order the Promise overload before the callback overload in src/overload-resolver.js.\n${failures.join("\n")}`
        );
      });
    }
  });
});
