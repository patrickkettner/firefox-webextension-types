// Behaviour that was already right and must stay so: mixed permission
// arrays, Promise-returning menu handlers, untyped Port messages, callback
// forms, void for no-op async functions, null for optional object returns,
// Promise for every async: true function, required parameters kept required.
import { browser } from "../../dist/index.js";

async function keptBehaviour(info: browser.permissions.Permissions) {
    const mixed = info.permissions?.includes("webRequest");
    await browser.permissions.request({ permissions: ["bookmarks", "userScripts"] });
    browser.menus.create({ id: "a", title: "a", onclick: () => browser.runtime.openOptionsPage() });
    browser.runtime.sendMessage({ a: 1 }, (response) => response);
    browser.storage.local.get((items) => items);
    browser.tabs.query({}, (tabs) => tabs.length);
    const noop: void = await browser.telemetry.scalarAdd("name", 1);
    const warmed: void = await browser.tabs.warmup(1);
    const page: Window | null = browser.extension.getBackgroundPage();
    const element: Element | null = browser.menus.getTargetElement(1);
    await browser.find.highlightResults().catch(() => {});
    await browser.theme.reset();
    await browser.pageAction.setPopup({ tabId: 1, popup: "p.html" });
    await browser.declarativeNetRequest.getDisabledRuleIds({ rulesetId: "r" });
    // @ts-expect-error options is required by the schema
    await browser.declarativeNetRequest.getDisabledRuleIds();
    const opened: void = await browser.action.openPopup();
    const cleared: void = await browser.alarms.clearAll();
    return [mixed, noop, warmed, page, element, opened, cleared];
}

function portMessages(port: browser.runtime.Port) {
    port.onMessage.addListener((message) => {
        if (message.action === "x") {
            return message.payload;
        }
    });
    port.onMessage.addListener((message: { action: string }) => message.action);
}

export { keptBehaviour, portMessages };
