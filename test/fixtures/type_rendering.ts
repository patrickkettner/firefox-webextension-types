// Compile checks for additionalProperties, patternProperties, fixed-length
// arrays, isInstanceOf platform types and the StreamFilter WebIDL interface.
import { browser } from "../../dist/index.js";

declare const img: ImageData;

async function typedMaps() {
    browser.storage.onChanged.addListener((changes, areaName) => {
        const change: browser.storage.StorageChange = changes["key"];
        const area: string = areaName;
        return [change, area];
    });
    browser.storage.local.onChanged.addListener((changes) => {
        const value: unknown = changes["key"].newValue;
        return value;
    });
    const items = await browser.storage.local.get("k");
    const anyValue: string = items.k;

    const ok: browser.manifest.WebExtensionManifest = {
        manifest_version: 2,
        name: "ext",
        version: "1.0",
        icons: { 16: "icon16.png", "32": "icon32.png" },
        commands: { toggle: { suggested_key: { default: "Ctrl+Shift+Y" }, description: "toggle" } },
        experiment_apis: { api: { schema: "schema.json" } },
    };
    const badIconValue: browser.manifest.WebExtensionManifest = {
        manifest_version: 2,
        name: "ext",
        version: "1.0",
        // @ts-expect-error icon values are ExtensionFileUrl strings
        icons: { 16: 5 },
    };
    const badIconKey: browser.manifest.WebExtensionManifest = {
        manifest_version: 2,
        name: "ext",
        version: "1.0",
        // @ts-expect-error icon keys are numeric
        icons: { large: "icon.png" },
    };
    const badCommand: browser.manifest.WebExtensionManifest = {
        manifest_version: 2,
        name: "ext",
        version: "1.0",
        // @ts-expect-error a command is an object with suggested_key and description
        commands: { toggle: "Ctrl+Shift+Y" },
    };
    const badExperiment: browser.manifest.WebExtensionManifest = {
        manifest_version: 2,
        name: "ext",
        version: "1.0",
        // @ts-expect-error experiment_apis values are ExperimentAPI objects
        experiment_apis: { api: "schema.json" },
    };
    const experiment: browser.manifest.ThemeExperiment = { colors: { my_color: "--my-color" } };
    // @ts-expect-error ThemeExperiment maps hold strings
    const badExperimentColors: browser.manifest.ThemeExperiment = { colors: { my_color: 1 } };

    const notifications = await browser.notifications.getAll();
    const options: browser.notifications.CreateNotificationOptions = notifications["id"];

    const manifest = browser.runtime.getManifest();
    const version: string = manifest.version;
    manifest.name = "renamed";

    return [anyValue, ok, badIconValue, badIconKey, badCommand, badExperiment, experiment, badExperimentColors, options, version];
}

function fixedLengthArrays() {
    const four: browser.action.ColorArray = [1, 2, 3, 4];
    // @ts-expect-error ColorArray requires exactly 4 items
    const three: browser.action.ColorArray = [1, 2, 3];
    // @ts-expect-error ColorArray requires exactly 4 items
    const five: browser.action.ColorArray = [1, 2, 3, 4, 5];
    const rgb: browser.manifest.ThemeColor = [1, 2, 3];
    const rgba: browser.manifest.ThemeColor = [1, 2, 3, 4];
    const named: browser.manifest.ThemeColor = "red";
    // @ts-expect-error ThemeColor arrays have 3 or 4 items
    const two: browser.manifest.ThemeColor = [1, 2];
    return [four, three, five, rgb, rgba, named, two];
}

async function platformTypes() {
    await browser.action.setIcon({ imageData: img });
    await browser.action.setIcon({ imageData: { 16: img, 32: img } });
    await browser.pageAction.setIcon({ tabId: 1, imageData: img });
    await browser.sidebarAction.setIcon({ imageData: img });
    // @ts-expect-error Schemas.sys.mjs requires an ImageData instance
    await browser.action.setIcon({ imageData: { 16: { width: 16, height: 16 } } });
    const icon: browser.manifest.IconImageData = { 16: img };
    return icon;
}

function streamFilter() {
    const filter = browser.webRequest.filterResponseData("request-1");
    filter.ondata = (event) => {
        const data: ArrayBuffer = event.data;
        filter.write(data);
        filter.write(new Uint8Array(data));
    };
    filter.onstop = () => filter.close();
    filter.onerror = () => {
        const message: string = filter.error;
        return message;
    };
    filter.addEventListener("data", () => filter.disconnect());
    const status: browser.webRequest.StreamFilterStatus = filter.status;
    // @ts-expect-error write takes an ArrayBuffer or Uint8Array
    filter.write("text");
    // @ts-expect-error status is read-only
    filter.status = "closed";
    return status;
}

export { typedMaps, fixedLengthArrays, platformTypes, streamFilter };
