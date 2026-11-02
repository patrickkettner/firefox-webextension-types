# firefox-webextension-types

Strictly-typed Firefox WebExtension declarations generated directly from Mozilla Central schemas.

## Installation

Install directly from GitHub:

```bash
npm install -D github:patrickkettner/firefox-webextension-types
```

## Requirements

TypeScript 4.9 or newer. The module entrypoints and every ambient entrypoint compile with `skipLibCheck: false` under `node16`, `nodenext` and `bundler` resolution on 4.9.5, 5.9.3 and 7.0.2 (`bundler` needs TypeScript 5.0 or newer, so it is not available on 4.9). On 4.7 and 4.8 a `.cts` file cannot import the package, and 4.6 has no `node16` resolution.

The ambient entrypoints are not picked up automatically on any version, including TypeScript 7.0.2. List one in `types` or reference it with a triple-slash directive, as shown below.

## Usage

### 1. Modular Imports

Import `browser` without polluting the global scope:

```typescript
import { browser } from "firefox-webextension-types";

// Target-specific entrypoints
import { browser as desktopBrowser } from "firefox-webextension-types/desktop";
import { browser as mobileBrowser } from "firefox-webextension-types/mobile";

async function getActiveTab() {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  return tab;
}
```

`import` and `require` both work. Under `node16` and `nodenext`, a `.cts` file or a CommonJS project gets the `.d.cts` declarations, so it type-checks the same as an ES module.

At runtime the imported `browser` and `chrome` are stand-in objects that forward every property read to `globalThis.browser` and `globalThis.chrome` at the moment of the read. A global assigned after the import, such as a mock installed inside a test, is seen. The stand-in is always an object, so `if (browser)` says nothing; feature-detect with `browser.runtime` or `"runtime" in browser`, both of which are `undefined` and `false` when no global exists.

The root entrypoint and `/desktop` are the desktop surface. `/mobile` is the Firefox for Android surface and has no `windows`, `bookmarks` and the other namespaces Android does not ship.

### 2. Ambient Globals

To declare an ambient `browser` across your project, add a global entrypoint to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["firefox-webextension-types/global"]
  }
}
```

Or via a triple-slash directive in any TypeScript file:

```typescript
/// <reference types="firefox-webextension-types/global" />
```

| Entrypoint | Declares |
|---|---|
| `firefox-webextension-types/global` | `browser`, desktop surface |
| `firefox-webextension-types/global-chrome` | `browser` and `chrome`, desktop surface |
| `firefox-webextension-types/global-mobile` | `browser`, Android surface |
| `firefox-webextension-types/global-mobile-chrome` | `browser` and `chrome`, Android surface |

The base entrypoints declare no `chrome`, so they leave that name to `@types/chrome`.

`@types/chrome` also declares a global `browser`. Two global `browser` declarations cannot share a program: with `skipLibCheck: false` TypeScript reports `TS2300: Duplicate identifier 'browser'`, and with `skipLibCheck: true` the error is hidden and `@types/chrome`'s `browser` is the one you get. If `@types/chrome` is installed, import `browser` from the module entrypoints instead. That combination compiles.

### 3. Chrome Compatibility Module

For extensions referencing `chrome.*` without an ambient global:

```typescript
import { chrome } from "firefox-webextension-types/chrome";
```

### 4. What the editor shows

Every namespace, function, event, property, type, type member and member of an inline object carries a JSDoc block built from the Firefox schema. Hovering shows the description, `@param` and `@returns`, the permission it needs (`@permission`, listing alternatives with `or`), the contexts it is injected into (content scripts and devtools pages are opt-in in Firefox, so most namespaces say "Not available in content scripts or devtools pages"), manifest version bounds, functions that must run from a user input handler, and `@platform` naming the surfaces that carry it (`desktop`, `mobile` or both). `$(ref:...)` links in the schema become `{@link browser....}` links.

`@deprecated` marks the schema's deprecated nodes and the ones Firefox drops at load time (`unsupported` in the schema). Those members are still declared, with a message saying Firefox does not support them, so editors strike them through.

### 5. Named parameter and result types

The object a function, event or type member takes inline has a name of its own, in a namespace merged with the owner: `browser.tabs.create.CreateProperties`, `browser.tabs.query.QueryInfo`, `browser.tabs.onUpdated.ChangeInfo`, `browser.types.Setting.get.Details`. The Promise payload is `Result` (`browser.tabs.create.Result`). The name is the parameter's name from the schema, capitalized, so it stays stable across Firefox versions. `devtools.inspectedWindow.eval` uses `_eval` as the holder, as `eval` cannot name a namespace.

### 6. Which Firefox it matches

`firefox-webextension-types/provenance.json` records the Firefox version (`firefoxVersion`, read from `browser/config/version.txt`), the source commit, and a hash of every declaration file. Each `.d.ts` header also names the version. The package version is its own semver and does not follow Firefox.

```typescript
import provenance from "firefox-webextension-types/provenance.json" with { type: "json" };
```

## Local Development & Linking

To develop against a local clone of this repository without installing from GitHub:

```bash
# In this repository
npm link

# In your extension repository
npm link firefox-webextension-types
```

Or reference declarations directly via `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "firefox-webextension-types": ["./path/to/firefox-webextension-types/dist/index.d.ts"],
      "firefox-webextension-types/desktop": ["./path/to/firefox-webextension-types/dist/firefox-desktop.d.ts"],
      "firefox-webextension-types/mobile": ["./path/to/firefox-webextension-types/dist/firefox-mobile.d.ts"],
      "firefox-webextension-types/global": ["./path/to/firefox-webextension-types/dist/global.d.ts"],
      "firefox-webextension-types/chrome": ["./path/to/firefox-webextension-types/dist/chrome.d.ts"]
    }
  }
}
```

## Regenerating Declarations

Regenerating declarations from raw Mozilla schemas requires Node.js 18+ and a local Firefox repository checkout ([mozilla-firefox/firefox](https://github.com/mozilla-firefox/firefox)). Provide the checkout path via `--firefox-source` or set `TOPSRCDIR`.

```bash
export TOPSRCDIR="/path/to/firefox"

npm run build      # Ingest schemas and emit declarations into dist/
npm test           # Run test suite
npm run verify     # Run schema parity and type integrity audits, then attw
npm run typecheck  # Validate declarations with tsc
npm run attw       # Check the packed tarball with @arethetypeswrong/cli (part of verify)
```

`schema-key-ledger.json` lists every key in the Firefox schemas by context, as consumed by the generator or declined with a reason. `npm test` fails when a key is missing from it or an entry is no longer true. After a Firefox update or an emitter change, run `npm run ledger:update` to refresh the statuses. A key it marks `unresolved` is new or no longer read, and `npm test` fails on it until the emitter uses it or the entry is declined with a reason and, for Firefox behavior, the Firefox file. `npm run ablate` deletes each key in turn and fails when a consumed key changes no output byte. It takes a few minutes, runs one build at a time at low priority, and is not part of `npm test`.

`npm test` measures hover text and deprecation strike-through through the TypeScript language service. The installed TypeScript 7 has no JavaScript API, so the first run installs TypeScript 5.9.3 into `node_modules/.cache/` and later runs reuse it.

`npm test` also packs the package and compiles consumer code against the tarball on TypeScript 4.9.5 and 7.0.2, the ends of the supported range, once with the default strict options and once with `exactOptionalPropertyTypes`. Set `CONSUMER_TS_VERSIONS="4.9.5,5.9.3"` to run other versions as well as 7.0.2, or `CONSUMER_TS_VERSIONS=""` to run 7.0.2 only.

`npm run verify` ends with `npm run attw`, which packs the package and checks it with `@arethetypeswrong/cli`. The four ambient `/global*` entrypoints are checked with `cjs-resolves-to-esm` ignored, because nothing imports them and a `.d.cts` copy would declare the globals twice for a project that mixes `.cts` and `.mts` files. `scripts/attw.js` has the reasoning.

## License

The generator, its tests, and everything else in this repository are licensed under the [Apache License 2.0](LICENSE).

The declaration files in `dist/` are generated from Firefox's WebExtension schema files. Their documentation comments and API shapes are derived from those schemas, which are subject to the [Mozilla Public License 2.0](LICENSE-MPL-2.0). Parts of those schemas originated from Chromium and are covered by a BSD-style license, reproduced in [LICENSE-CHROMIUM](LICENSE-CHROMIUM). [NOTICE](NOTICE) carries the same attribution and ships with the npm package.
