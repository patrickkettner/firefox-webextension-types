// Compile checks for optional parameters, overload order, Promise payloads
// and the hand-typed functions.
import { browser } from "../../dist/index.js";

declare const maybeId: number | undefined;
declare const maybeName: string | undefined;
declare const untyped: any;

async function optionalParameters() {
    await browser.tabs.goBack(maybeId);
    await browser.tabs.getZoom(maybeId);
    await browser.alarms.get(maybeName);
    await browser.windows.getAll(undefined);
    await browser.theme.reset(null);
    await browser.storage.local.get(null);
    await browser.storage.local.get(undefined);
    await browser.storage.local.getBytesInUse(null);
    await browser.tabs.reload({ bypassCache: true });
    await browser.tabs.reload(5, null);
    await browser.tabs.reload();
    await browser.runtime.sendMessage({ action: "ping" }, null);
    await browser.runtime.sendMessage(null, { action: "ping" });
    // @ts-expect-error tabId is required
    await browser.tabs.get(undefined);
    // @ts-expect-error tabId is a number
    await browser.tabs.get("1");
}

function callbackForms() {
    browser.storage.local.get((items) => items);
    browser.storage.local.get("k", (items) => items);
    browser.tabs.query({}, (tabs) => tabs.length);
    browser.runtime.sendMessage({ a: 1 }, (response) => response);
    browser.tabs.reload(() => {});
    browser.tabs.reload(5, () => {});
}

async function untypedArgumentPicksPromise() {
    const items: Promise<Record<string, any>> = browser.storage.local.get(untyped);
    const zoom: Promise<number> = browser.tabs.getZoom(untyped);
    const win: Promise<browser.windows.Window> = browser.windows.create(untyped);
    return [items, zoom, win];
}

async function promisePayloads() {
    const identities = await browser.contextualIdentities.query({});
    const count: number = identities.length;
    const one: browser.contextualIdentities.ContextualIdentity = await browser.contextualIdentities.get("firefox-container-1");
    const open: boolean = await browser.sidebarAction.isOpen({});
    const record: browser.dns.DNSRecord = await browser.dns.resolve("example.com");
    const hidden: number[] = await browser.tabs.hide([1, 2]);
    const image: string = await browser.tabs.captureTab();
    const theme: browser.manifest.ThemeType = await browser.theme.getCurrent();
    const stored = await browser.sessions.getTabValue(1, "k");
    const anything: string = stored;
    const info: browser.webRequest.SecurityInfo | undefined = await browser.webRequest.getSecurityInfo("1");
    const enabled: boolean = await browser.action.isEnabled();
    const color: browser.action.ColorArray = await browser.browserAction.getBadgeTextColor({});
    const removed: boolean = await browser.permissions.remove({ permissions: ["bookmarks"] });
    const registered = await browser.contentScripts.register({ matches: ["<all_urls>"] });
    await registered.unregister();
    const found = await browser.find.find("needle");
    const total: number = found.count;
    const cleared: void = await browser.alarms.clearAll();
    const written: void = await browser.storage.local.set({ a: 1 });
    return [count, one, open, record, hidden, image, theme, anything, info, enabled, color, removed, total, cleared, written];
}

async function optionalPayloads() {
    const tab = await browser.tabs.getCurrent();
    // @ts-expect-error getCurrent resolves undefined outside a tab
    const id: number | undefined = tab.id;
    const maybeTabId: number | undefined = tab?.id;
    const alarm = await browser.alarms.get("x");
    // @ts-expect-error alarms.get resolves undefined when no alarm matches
    const name: string = alarm.name;
    const cookie = await browser.cookies.get({ name: "a", url: "https://example.com/" });
    // @ts-expect-error cookies.get resolves null when nothing matches
    const value: string = cookie.value;
    const removedCookie = await browser.cookies.remove({ name: "a", url: "https://example.com/" });
    const removedUrl: string | undefined = removedCookie?.url;
    const frame = await browser.webNavigation.getFrame({ tabId: 1, frameId: 0 });
    const frameUrl: string | undefined = frame?.url;
    const frames = await browser.webNavigation.getAllFrames({ tabId: 1 });
    const frameCount: number | undefined = frames?.length;
    const page = await browser.runtime.getBackgroundPage();
    const doc: Document | undefined = page?.document;
    return [id, maybeTabId, name, value, removedUrl, frameUrl, frameCount, doc];
}

async function alwaysSuppliedPayloads() {
    const created: number | undefined = (await browser.tabs.create({ url: "about:blank" })).id;
    const duplicated: number | undefined = (await browser.tabs.duplicate(1)).id;
    const updated: number | undefined = (await browser.tabs.update(1, { active: true })).id;
    const results: any[] = await browser.tabs.executeScript(1, { code: "1" });
    const first: any = results[0];
    const opened: number | undefined = (await browser.windows.create({})).id;
    const icon: string = (await browser.downloads.getFileIcon(1)).toUpperCase();
    const redirect: string = (await browser.identity.launchWebAuthFlow({ url: "https://example.com", interactive: true })).trim();
    browser.tabs.create({ url: "about:blank" }, (tab) => tab.id);
    browser.tabs.update(1, { active: true }, (tab) => tab.id);
    browser.windows.create({}, (win) => win.id);
    browser.tabs.executeScript(1, { code: "1" }, (found) => found.length);
    browser.downloads.getFileIcon(1, (iconURL) => iconURL.length);
    const evaluated = await browser.devtools.inspectedWindow.eval("1");
    // @ts-expect-error exceptionInfo is absent when the expression did not throw
    const description: string = evaluated[1].description;
    return [created, duplicated, updated, first, opened, icon, redirect, description];
}

async function tuplePayloads() {
    const [result, exceptionInfo] = await browser.devtools.inspectedWindow.eval("1 + 1");
    const isException: boolean | undefined = exceptionInfo?.isException;
    browser.devtools.inspectedWindow.eval("1", (value, info) => [value, info]);
    return [result, isException];
}

async function executeScript() {
    const [asyncResult] = await browser.scripting.executeScript({ target: { tabId: 1 }, func: async () => "s" });
    const text: string | undefined = asyncResult.result;
    const [numberResult] = await browser.scripting.executeScript({ target: { tabId: 1 }, func: () => 1 });
    const num: number | undefined = numberResult.result;
    const frameId: number = numberResult.frameId;
    await browser.scripting.executeScript({ target: { tabId: 1 }, func: (x: number) => x + 1, args: [41] });
    // @ts-expect-error args must match the func parameters
    await browser.scripting.executeScript({ target: { tabId: 1 }, func: (x: number) => x + 1, args: ["no"] });
    browser.scripting.executeScript({ target: { tabId: 1 }, func: () => 1 }, (results) => results[0].result);
    await browser.scripting.executeScript({ target: { tabId: 1 }, files: ["a.js"] });
    return [text, num, frameId];
}

async function userScripts() {
    const legacy = await browser.userScripts.register({ js: [{ code: "1" }], matches: ["<all_urls>"] });
    await legacy.unregister();
    await browser.userScripts.register([{ id: "a", js: [{ code: "1" }], matches: ["<all_urls>"] }]);
}

declare const area: "local" | "sync" | "session";
async function storageAreaUnion() {
    await browser.storage[area].remove("k");
    await browser.storage[area].set({ k: 1 });
    const all = await browser.storage[area].get(null);
    return all;
}

export {
    optionalParameters,
    callbackForms,
    untypedArgumentPicksPromise,
    promisePayloads,
    optionalPayloads,
    alwaysSuppliedPayloads,
    tuplePayloads,
    executeScript,
    userScripts,
    storageAreaUnion,
};
