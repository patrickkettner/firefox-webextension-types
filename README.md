# firefox-webextension-types

Strictly-typed Firefox WebExtension declarations generated directly from Mozilla Central schemas.

## Installation

Install directly from GitHub:

```bash
npm install -D github:patrickkettner/firefox-webextension-types
```

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

### 2. Ambient Globals

To declare ambient `browser` and `chrome` globals across your project, add the global entrypoint to your `tsconfig.json`:

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

### 3. Chrome Compatibility Module

For extensions referencing `chrome.*` without `@types/chrome` collisions:

```typescript
import { chrome } from "firefox-webextension-types/chrome";
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
npm run verify     # Run schema parity and type integrity audits
npm run typecheck  # Validate declarations with tsc
```

## License

The generator, its tests, and everything else in this repository are licensed under the [Apache License 2.0](LICENSE).

The declaration files in `dist/` are generated from Firefox's WebExtension schema files. Their documentation comments and API shapes are derived from those schemas, which are subject to the [Mozilla Public License 2.0](LICENSE-MPL-2.0). Parts of those schemas originated from Chromium and are covered by a BSD-style license, reproduced in [LICENSE-CHROMIUM](LICENSE-CHROMIUM). [NOTICE](NOTICE) carries the same attribution and ships with the npm package.
