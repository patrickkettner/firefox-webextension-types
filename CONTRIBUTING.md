# Contributing

The README covers building and the main commands. This file covers the checks a change to the generator has to keep green, and how to update the files they read.

Every command here needs a Firefox checkout in `TOPSRCDIR`, or `--firefox-source <path>` where a script takes it.

## Firefox suites in `npm test`

Every suite that reads the Firefox checkout (the `dist/` check, the schema-key ledger, the test corpus, the overrides audits, the API name lint, the markup inventory, test citations, jar.mn conditionals and the determinism matrix) fails when `TOPSRCDIR` is unset, so a green `npm test` means they ran. `FWT_SKIP_FIREFOX=1` skips them, and each skipped suite says so in the output.

A test that asserts declaration text names its basis in a comment above it: `// Firefox: <file>`, `// TypeScript: <fact>`, `// Packaging: <fact>` or `// Tooling: <reason>`. `npm test` fails on a test with none, and on a Firefox basis that names a file the checkout does not have.

## TypeScript versions

`npm test` measures hover text and deprecation strike-through through the TypeScript language service. TypeScript 7 has no JavaScript API, so those tests load the TypeScript 5 release that `npm ci` installs as the `typescript-api` devDependency. The oldest supported release is installed as `typescript-oldest`. `package.json` pins both, and both are npm aliases of the `typescript` package, so `node_modules/.bin/tsc` is whichever one npm linked last and the scripts run `node_modules/typescript/bin/tsc` by path.

`npm test` also packs the package and compiles consumer code against the tarball with `typescript-oldest` and the repository's TypeScript 7, once with the default strict options and once with `exactOptionalPropertyTypes`. Set `CONSUMER_TS="typescript-oldest,typescript-api"` to add the TypeScript 5 release, or `CONSUMER_TS=""` to run TypeScript 7 only.

## Schema-key ledger

`schema-key-ledger.json` lists every key in the Firefox schemas by context, as consumed by the generator or declined with a reason. `npm test` fails when a key is missing from it or an entry is no longer true.

A consumed key must be read at every position that carries it, where a position is the schema file's path under the Firefox checkout, the namespace and the names leading to the object. The path keeps a desktop and an Android schema file of the same name apart. A position where the generator does not read it is listed in one of the entry's `unread` groups with a reason, or picked by a rule such as `asyncCallback`. Positions in an excluded namespace need no group.

After a Firefox update or an emitter change, run `npm run ledger:update` to refresh the statuses. A key it marks `unresolved` is new or no longer read, and `npm test` fails on it until the emitter uses it or the entry is declined with a reason and, for Firefox behavior, the Firefox file. A new unread position gets a group with an empty reason, which also fails until someone writes the reason.

A declined key on an object the generator enumerates or serializes (a spread, `Object.keys`, `JSON.stringify`) cannot be vouched for by the trace, so `npm test` deletes all such keys at once, rebuilds, and bisects to the key when the output changes.

`npm run ablate` deletes every key one at a time and fails when a consumed key changes no output byte. It takes a few minutes, runs one build at a time, and is not part of `npm test`. `npm run ablate -- --nice` runs it at low CPU and IO priority.

## `any` allowlist

`any-allowlist.json` lists every `any` keyword in `dist/` by declaration path, with its count and the schema or Firefox file that makes it `any`. `npm test` and `npm run verify` fail on a path it does not list, a count above the listed one, and an entry whose count no longer matches.

## Firefox test corpus

`npm test` also type-checks the `browser.*` calls in Firefox's own extension tests against freshly generated declarations. The code is extracted from `TOPSRCDIR` at test time, checked as JavaScript, and its diagnostics are grouped into families (error code, message with local names and long types elided, and the API involved). `corpus/baseline.json` lists every accepted family with a reason, a note and how many times it occurs. The test fails on a family that is not in the baseline, on a baseline family that no longer occurs, on a family whose count changed, on an entry still marked `unclassified`, and on an entry with no note. Calls inside `assertThrows` and `assertRejects` are set aside.

```bash
TOPSRCDIR=/path/to/firefox npm run corpus:update   # rewrite corpus/baseline.json
```

The update keeps the reason and note of every family that still occurs and marks new ones `unclassified`. Replace that with one of the reasons listed in `corpus/baseline.js` and a note that names the evidence.

## attw

`npm run verify` ends with `npm run attw`, which packs the package and checks it with `@arethetypeswrong/cli`. The ambient `/global*` entrypoints are checked with `cjs-resolves-to-esm` ignored. `scripts/attw.js` says why.
