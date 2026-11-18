# firefox-webextension-types

TypeScript declarations for Firefox WebExtensions, generated from the WebExtension schemas in the Firefox source tree.

## Installation

Install directly from GitHub:

```bash
npm install -D github:patrickkettner/firefox-webextension-types
```

## Requirements

TypeScript 4.9 or newer. The tests compile every entrypoint with `skipLibCheck: false` on TypeScript 4.9 and 7 under `node16`, `nodenext` and, from 5.0, `bundler` resolution. On 4.7 and 4.8 a `.cts` file cannot import the package, and 4.6 has no `node16` resolution.

The ambient entrypoints are not picked up automatically on any version, including TypeScript 7. List one in `types` or reference it with a triple-slash directive, as shown below.

## Usage

### Module imports

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

At runtime the imported `browser` and `chrome` are stand-in objects that forward every property read to `globalThis.browser` and `globalThis.chrome` at the moment of the read. A global assigned after the import, such as a mock installed inside a test, is seen. The stand-in is always an object, so `if (browser)` says nothing. Feature-detect with `browser.runtime` or `"runtime" in browser`, both of which are `undefined` and `false` when no global exists.

The root entrypoint and `/desktop` are the desktop surface. `/mobile` is the Firefox for Android surface and has no `windows`, `bookmarks` and the other namespaces Android does not ship.

### Ambient globals

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
| `firefox-webextension-types/global-chrome-mv2` | `browser` and the Manifest V2 page `chrome`, desktop surface |
| `firefox-webextension-types/global-mobile` | `browser`, Android surface |
| `firefox-webextension-types/global-mobile-chrome` | `browser` and `chrome`, Android surface |
| `firefox-webextension-types/global-mobile-chrome-mv2` | `browser` and the Manifest V2 page `chrome`, Android surface |
| `firefox-webextension-types/global-user-script` | `browser` and `chrome` of a user script |

The base entrypoints declare no `chrome`, so they leave that name to `@types/chrome`.

`@types/chrome` also declares a global `browser`. Two global `browser` declarations cannot share a program: with `skipLibCheck: false` TypeScript reports `TS2300: Duplicate identifier 'browser'`, and with `skipLibCheck: true` the error is hidden and `@types/chrome`'s `browser` is the one you get. If `@types/chrome` is installed, import `browser` from the module entrypoints instead.

### Chrome compatibility module

For extensions referencing `chrome.*` without an ambient global:

```typescript
import { chrome } from "firefox-webextension-types/chrome";
```

Firefox gives `chrome` two shapes. In content scripts and every page of a Manifest V3 extension, `chrome` is the same object as `browser`, and that is what the `chrome` and `global-chrome` entrypoints declare. In the background page, popup, options page, devtools page and other extension pages of a Manifest V2 extension, `chrome` is a separate object (`ExtensionPageChild.sys.mjs`). `Schemas.sys.mjs` passes each of its async functions an empty callback when none is given, and a call with a callback returns undefined, so `await chrome.tabs.query({})` reads `undefined`. Methods of `storage.local`, `storage.sync` and the `types.Setting` properties such as `privacy.network.networkPredictionEnabled` behave the same way.

For code that runs in those Manifest V2 pages, use the `-mv2` entrypoints. Their async functions return `void` and take a callback:

```typescript
import { chrome } from "firefox-webextension-types/chrome-mv2";

chrome.tabs.query({ active: true }, (tabs) => {
  console.log(tabs[0]?.url);
});
```

`browser` returns Promises in every context and manifest version.

### User scripts

A user script registered with `userScripts.register` runs in a world that has no `browser` or `chrome` unless `userScripts.configureWorld` turns on `messaging`. With it, both names are one object that `ExtensionUserScriptsContent.sys.mjs` builds by hand with `runtime.connect` and `runtime.sendMessage` and nothing else. `sendMessage` takes the message and an optional callback, and the extension receives it in `runtime.onUserScriptMessage`. The `user-script` and `global-user-script` entrypoints declare that object:

```typescript
import { browser } from "firefox-webextension-types/user-script";

const reply = await browser.runtime.sendMessage({ kind: "ping" });
```

### What the editor shows

Every namespace, function, event, property, type, type member and member of an inline object carries a JSDoc block built from the Firefox schema. Hovering shows the description with `@param` and `@returns`, and `@permission` names the permission it needs, joining alternatives with `or`. An event repeats its block on `addListener`, so hovering `browser.runtime.onMessage.addListener` shows the event's description and the listener's parameters.

The block also says which contexts the API is injected into. Content scripts and devtools pages are opt-in in Firefox, so most namespaces say "Not available in content scripts or devtools pages". It gives the manifest versions the API is available in and says when a function must be called from a user input handler. A namespace's block ends with `@platform` naming the surfaces that carry it (`desktop`, `mobile` or both), and a member's block has one only when its surfaces differ from its namespace's, as on `tabs.hide`, which only desktop has. A schema link such as `$(ref:tabs.Tab)` becomes `{@link browser.tabs.Tab}`. Editors show no comment inside a union or in front of an array element type, so the block of the property, parameter or type alias that holds one lists its choices and items, as on `content_security_policy`, which takes a string in Manifest V2 and an object in Manifest V3.

`@deprecated` marks the schema's deprecated nodes and the ones Firefox drops at load time (`unsupported` in the schema). Those members are still declared, with a message saying Firefox does not support them, so editors strike them through. An unsupported property of a value Firefox hands back, such as `processId` in the `webNavigation` event details, is declared as `processId?: undefined` because Firefox never sets it. An unsupported property of a value you pass in is declared `?: never`, because `ObjectType.checkProperty` in `Schemas.sys.mjs` rejects the key whenever it is present, even with the value `undefined`. Without `exactOptionalPropertyTypes` TypeScript still allows an explicit `undefined` there.

### Named parameter and result types

The object a function, event or type member takes inline has a name of its own, in a namespace merged with the owner: `browser.tabs.create.CreateProperties`, `browser.tabs.query.QueryInfo`, `browser.tabs.onUpdated.ChangeInfo`, `browser.types.Setting.get.Details`. The Promise payload is `Result` (`browser.tabs.create.Result`). The name is the parameter's name from the schema, capitalized, so it stays stable across Firefox versions. `devtools.inspectedWindow.eval` uses `_eval` as the holder, as `eval` cannot name a namespace.

### Null, `Normalizable` and `Normalized`

Firefox normalizes what an extension hands it against the schema, and `ObjectType.checkProperty` in `Schemas.sys.mjs` reads `null` on an optional property as absent. So an optional property of a value you pass in accepts `null` as well as `undefined`, except on a property Firefox does not support.

A type Firefox also hands back is declared the way it comes back. Where it is passed in, it is wrapped in `Normalizable<T>`, which adds that `null` to its optional properties, recursively. That is what a hover shows for `partitionKey` in `browser.cookies.get()`. A value Firefox hands back has `null` only where Firefox sets it, such as the `partitionKey` of a cookie that is not partitioned.

`Normalized<T, Defaults>` is a value Firefox normalized and hands back, such as the results of `runtime.getManifest()` and `theme.getCurrent()`. An optional key the extension left out reads as `null`. `Defaults` lists the keys Firefox fills in, with their schema default (`permissions`, `content_scripts.run_at`) or after normalization (`options_ui.browser_style`), and those are never `null`. A path ending in `?` can still be missing, such as `host_permissions` in a Manifest V2 extension.

### Which Firefox it matches

`firefox-webextension-types/provenance.json` records the Firefox version (`firefoxVersion`, read from `browser/config/version.txt`), the source commit, and a hash of every declaration file. Each `.d.ts` header also names the version. The package version is its own semver and does not follow Firefox.

```typescript
// A .cts file, with resolveJsonModule
import provenance = require("firefox-webextension-types/provenance.json");
```

With `moduleResolution: "bundler"` and `resolveJsonModule`, `import provenance from "firefox-webextension-types/provenance.json"` works too.

## Local development and linking

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
      "firefox-webextension-types/chrome": ["./path/to/firefox-webextension-types/dist/chrome.d.ts"],
      "firefox-webextension-types/chrome-mv2": ["./path/to/firefox-webextension-types/dist/chrome-mv2.d.ts"]
    }
  }
}
```

## Regenerating declarations

Building needs Node.js 20 or newer and a Firefox checkout ([mozilla-firefox/firefox](https://github.com/mozilla-firefox/firefox)), given as `--firefox-source <path>` or in `TOPSRCDIR`.

```bash
export TOPSRCDIR="/path/to/firefox"

npm run build      # write dist/ from the checkout's schemas
npm test           # the test suite, which needs TOPSRCDIR
npm run verify     # the checks listed below, then attw
npm run typecheck  # compile the test fixtures against dist/index.d.ts (also part of npm test)
```

`dist/` is committed, and `npm test` and `npm run verify` fail when it is not byte for byte what the generator produces from the checkout, `provenance.json` included. `provenance.json` records the checkout's commit, so after the checkout moves, rebuild and commit `dist/` even when no schema changed.

`npm run verify` runs these in order and stops at the first that fails:

- `scripts/verify-dist.js` checks `dist/` against a fresh build.
- `verification/bin/verify.js` is an independent verifier. It reads the schemas with its own loader and imports nothing from `src/`. For each `.d.ts` file in `dist/`, it checks that each schema namespace, type, function, event, property and object type member is declared and that nothing else is, that every definition of a function has an overload, that nothing is `readonly` unless its schema says so, and that namespaces and types are in code point order. The places where the declarations may differ from the schemas are in `verification/src/declared-differences.js`, each with the Firefox file that shows why.
- `scripts/verify-parity.js` checks that `firefox-desktop.d.ts` and `firefox-mobile.d.ts` have each top-level schema namespace, the text of six declarations in `index.d.ts`, that no declaration file has an empty interface, a dead overload, a callback parameter marked optional or an `/* upstream any */` comment, and that every file `package.json` names exists.
- `scripts/verify-overrides.js` checks the hand-written tables in `src/overrides.js`. Each entry cites a snippet of a Firefox file that must still be in the checkout, each table must cover every schema construct it exists for and nothing the schemas no longer have, and the return types in `dist/` must match the result tables.
- `scripts/verify-any.js` checks every `any` in `dist/` against `any-allowlist.json`.
- `npm run attw` checks the packed tarball with `@arethetypeswrong/cli`.

[CONTRIBUTING.md](CONTRIBUTING.md) covers the schema-key ledger, `npm run ablate`, the `any` allowlist, the Firefox test corpus and the TypeScript versions the tests use.

## License

The generator, its tests, and everything else in this repository are licensed under the [Apache License 2.0](LICENSE).

The declaration files in `dist/` are generated from Firefox's WebExtension schema files. Their documentation comments and API shapes are derived from those schemas, which are subject to the [Mozilla Public License 2.0](LICENSE-MPL-2.0). Parts of those schemas originated from Chromium and are covered by a BSD-style license, reproduced in [LICENSE-CHROMIUM](LICENSE-CHROMIUM). [NOTICE](NOTICE) carries the same attribution and ships with the npm package.
