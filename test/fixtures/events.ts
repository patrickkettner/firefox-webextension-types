// Compile checks for event extraParameters, optional listener parameters,
// listener return types and runtime.Port.
import { browser } from "../../dist/index.js";

function extraParameters() {
    browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => [tabId, changeInfo, tab]);
    browser.tabs.onUpdated.addListener((tabId) => tabId, { properties: ["status", "url"], urls: ["*://*.example.com/*"] });
    browser.tabs.onUpdated.addListener((tabId) => tabId, null);
    browser.webNavigation.onCompleted.addListener((details) => details.url, { url: [{ hostSuffix: "example.com" }] });
    browser.webNavigation.onBeforeNavigate.addListener((details) => details, { url: [{ schemes: ["https"] }] });
    browser.proxy.onRequest.addListener((details) => ({ type: "direct" }), { urls: ["<all_urls>"] });
    browser.proxy.onRequest.addListener((details) => ({ type: "direct" }), { urls: ["<all_urls>"] }, ["requestHeaders"]);
    browser.webRequest.onBeforeRequest.addListener((details) => ({ cancel: true }), { urls: ["<all_urls>"] }, ["blocking"]);
    browser.webRequest.onBeforeRequest.addListener((details) => { details.requestBody; }, { urls: ["<all_urls>"] }, ["requestBody"]);
    browser.webRequest.onErrorOccurred.addListener((details) => details.error, { urls: ["<all_urls>"] });
    browser.activityLog.onExtensionActivity.addListener((details) => details, "some-ext-id");
    const listener = (details: { url: string }) => details.url;
    browser.webRequest.onCompleted.addListener(listener, { urls: ["<all_urls>"] });
    browser.webRequest.onCompleted.removeListener(listener);
    const registered: boolean = browser.webRequest.onCompleted.hasListener(listener);

    // @ts-expect-error filter is required (Schemas.sys.mjs Incorrect argument types)
    browser.webRequest.onBeforeRequest.addListener((details) => details);
    // @ts-expect-error extraInfoSpec entries are OnBeforeRequestOptions
    browser.webRequest.onBeforeRequest.addListener((details) => details, { urls: ["<all_urls>"] }, ["bogus"]);
    // @ts-expect-error onErrorOccurred takes no extraInfoSpec
    browser.webRequest.onErrorOccurred.addListener((details) => details, { urls: ["<all_urls>"] }, ["blocking"]);
    // @ts-expect-error UpdateFilter has no such key
    browser.tabs.onUpdated.addListener((tabId) => tabId, { bogus: true });
    // @ts-expect-error proxy.onRequest requires a filter
    browser.proxy.onRequest.addListener((details) => ({ type: "direct" }));
    return registered;
}

function listenerReturns() {
    browser.webRequest.onBeforeRequest.addListener(async () => {}, { urls: ["<all_urls>"] }, ["blocking"]);
    browser.webRequest.onBeforeRequest.addListener(async () => ({ cancel: true }), { urls: ["<all_urls>"] }, ["blocking"]);
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
        sendResponse({ ok: true });
        return true;
    });
    browser.runtime.onMessage.addListener(async (message) => ({ echo: message }));
    browser.runtime.onMessage.addListener(() => undefined);
    browser.runtime.onMessageExternal.addListener((message) => Promise.resolve(message));
    browser.runtime.onUserScriptMessage.addListener(() => false);
    // @ts-expect-error a string return is dropped by MessageEvent.wrapResponse
    browser.runtime.onMessage.addListener(() => "reply");
    // @ts-expect-error sendResponse takes one value
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => sendResponse(1, 2));

    browser.webRequest.onBeforeRequest.addListener(() => ({ cancel: true }), { urls: ["<all_urls>"] }, ["blocking"]);
    browser.webRequest.onHeadersReceived.addListener(async () => ({ responseHeaders: [] }), { urls: ["<all_urls>"] }, ["blocking"]);
    browser.webRequest.onAuthRequired.addListener(() => ({ authCredentials: { username: "u", password: "p" } }), { urls: ["<all_urls>"] }, ["blocking"]);
    browser.webRequest.onSendHeaders.addListener(() => {}, { urls: ["<all_urls>"] });
    // @ts-expect-error a blocking listener returns a BlockingResponse
    browser.webRequest.onBeforeRequest.addListener(() => 5, { urls: ["<all_urls>"] }, ["blocking"]);
}

function optionalListenerParameters() {
    browser.menus.onClicked.addListener((info, tab) => {
        // @ts-expect-error tab is missing when the click was not in a tab
        const required: number | undefined = tab.id;
        const optional: number | undefined = tab?.id;
        return [info.menuItemId, required, optional];
    });
    browser.contextMenus.onClicked.addListener((info, tab) => tab?.id);
    browser.commands.onCommand.addListener((command, tab) => [command, tab.id]);
    browser.action.onClicked.addListener((tab, info) => [tab.id, info?.button]);
}

function ports(port: browser.runtime.Port) {
    port.postMessage("a string");
    port.postMessage(42);
    port.postMessage(null);
    port.postMessage({ action: "ping" });
    // @ts-expect-error postMessage takes one message
    port.postMessage(1, 2);
    port.onMessage.addListener((message, sender) => {
        const action: string = message.action;
        sender.postMessage("ack");
        return action;
    });
    port.onMessage.addListener((message: string) => message);
    port.onDisconnect.addListener((p) => p.error?.message);
    const error: Error | null = port.error;
    port.disconnect();
    // @ts-expect-error disconnect takes no arguments
    port.disconnect(1);
    // @ts-expect-error Port events expose addListener, removeListener and hasListener only
    port.onMessage.hasListeners();
    return error;
}

function proxyErrors() {
    browser.proxy.onError.addListener((error) => {
        const file: string = error.fileName;
        const line: number = error.lineNumber;
        return [error.message, file, line, error.stack];
    });
    // @ts-expect-error the runtime emits a plain object without name
    browser.proxy.onError.addListener((error: Error) => error);
}

export { extraParameters, listenerReturns, optionalListenerParameters, ports, proxyErrors };
