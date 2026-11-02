// Compiled by test/emitter.test.js with exactOptionalPropertyTypes on:
// Schemas.sys.mjs ObjectType.normalize treats an explicit undefined on an
// optional property as absent.
import { browser } from "../../dist/index.js";

export async function explicitUndefined(url: string | undefined) {
    await browser.tabs.create({ url });
    await browser.tabs.create({ url: undefined, active: undefined });
    const manifest: browser.manifest.WebExtensionManifest = {
        manifest_version: 3,
        name: "ext",
        version: "1.0",
        description: undefined,
    };
    return manifest;
}
