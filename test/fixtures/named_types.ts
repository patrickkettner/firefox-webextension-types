// Compile checks for the named parameter and result types: one namespace per
// function, event or type member, named after it, holding a type per inline
// object parameter plus Result for the payload.
import { browser } from "../../dist/index.js";

const createProperties: browser.tabs.create.CreateProperties = { url: "https://example.com", active: true };
const queryInfo: browser.tabs.query.QueryInfo = { active: true, currentWindow: true };
const changeInfo: browser.tabs.onUpdated.ChangeInfo = { status: "complete" };
const settingDetails: browser.types.Setting.get.Details = { incognito: false };
const evalOptions: browser.devtools.inspectedWindow._eval.Options = { frameURL: "https://example.com/" };
declare const frame: browser.webNavigation.getFrame.Result;
const removed: browser.cookies.remove.Result = { url: "x", name: "n", storeId: "s", firstPartyDomain: "" };

async function namedTypes() {
    await browser.tabs.create(createProperties);
    const tabs = await browser.tabs.query(queryInfo);
    browser.tabs.onUpdated.addListener((tabId: number, info: browser.tabs.onUpdated.ChangeInfo) => [tabId, info]);
    const setting: browser.types.Setting.get.Result = await browser.privacy.network.peerConnectionEnabled.get(settingDetails);
    return [tabs, setting, changeInfo, evalOptions, frame, removed];
}

// @ts-expect-error the schema does not describe this property
const unknownProperty: browser.tabs.create.CreateProperties = { nope: 1 };
// @ts-expect-error a type name is not a property of the function value
browser.tabs.create.CreateProperties;
// @ts-expect-error a type name is not a property of the event value
browser.tabs.onUpdated.ChangeInfo;

// Schemas.sys.mjs StringType.getDescriptor injects each string enum as an
// object of constants, so one name is both a type and a value.
const platformOs: browser.runtime.PlatformOs = browser.runtime.PlatformOs.MAC;
const resourceType: browser.declarativeNetRequest.ResourceType = browser.declarativeNetRequest.ResourceType.MAIN_FRAME;
const windowType: browser.tabs.WindowType = browser.tabs.WindowType.NORMAL;
// @ts-expect-error the constants object has no member the enum lacks
browser.runtime.PlatformOs.BOGUS;

export { namedTypes, unknownProperty, platformOs, resourceType, windowType };
