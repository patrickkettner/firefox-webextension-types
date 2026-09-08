// Consumer test file to verify real-world TypeScript consumption
import { browser, chrome, WebExtensionEvent } from "../dist/index.js";

async function testWebExtensionConsumer() {
    // 1. tabs API
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (tabs.length > 0) {
        const tabId = tabs[0].id;
        if (tabId !== undefined) {
            // Test pure optional reload overloads
            await browser.tabs.reload(tabId);
            await browser.tabs.reload(tabId, { bypassCache: true });
            await browser.tabs.reload({ bypassCache: true });
            await browser.tabs.reload();

            // Callback version of reload
            browser.tabs.reload(tabId, () => {});
            browser.tabs.reload({ bypassCache: true }, () => {});
            browser.tabs.reload(() => {});

            await browser.tabs.sendMessage(tabId, { greeting: "hello" });
        }
    }

    // 2. runtime API - leading optional overloads
    await browser.runtime.sendMessage("my-extension-id", { action: "ping" });
    await browser.runtime.sendMessage({ action: "ping" });

    // 3. storage API - interface with methods
    await browser.storage.local.set({ theme: "dark", count: 42 });
    const data = await browser.storage.local.get("theme");

    // 4. Pure async APIs
    const identities = await browser.contextualIdentities.query({ name: "Personal" });

    // 5. Enum type safety
    const reason: browser.tabs.MutedInfoReason = "user";
    const zoomMode: browser.tabs.ZoomSettingsMode = "automatic";

    // 6. Events API
    browser.tabs.onActivated.addListener((activeInfo) => {
        const currentTab: number = activeInfo.tabId;
        const currentWindow: number = activeInfo.windowId;
    });

    // 7. WebRequest specialized event
    browser.webRequest.onBeforeRequest.addListener(
        (details) => {
            if (details.url.includes("track")) {
                return { cancel: true };
            }
        },
        { urls: ["<all_urls>"] },
        ["blocking"]
    );

    // 8. Chrome namespace compatibility
    chrome.tabs.query({ active: true }, (result) => {
        if (result && result.length > 0) {
            console.log(result[0].id);
        }
    });

    // 9. Named ES module type imports
    type TabsNs = typeof browser.tabs;
    const testTab: browser.tabs.Tab = { id: 1, index: 0, highlighted: false, active: true, pinned: false, incognito: false };

    // 10. Generic WebExtensionEvent typing
    const testEvent: WebExtensionEvent<(info: { tabId: number }) => void> = {
        addListener: () => {},
        removeListener: () => {},
        hasListener: () => true
    };

    // 11. Action setTitle with imported Details properties (tabId, windowId)
    await browser.action.setTitle({ tabId: 1, windowId: 2, title: "Test Action" });

    // 12. browserAction inherited from action via $import
    await browser.browserAction.setTitle({ title: "Test browserAction" });
    browser.browserAction.onClicked.addListener((tab) => {
        console.log(tab.id);
    });

    // 13. contextMenus inherited from menus via $import
    browser.contextMenus.create({ id: "test-menu", title: "Context Menu Item" });

    // 14. windows.getAll with imported GetInfo properties (populate)
    const allWindows = await browser.windows.getAll({ populate: true });

    // 15. WebExtensionManifest with imported ManifestBase properties
    const testManifest: browser.manifest.WebExtensionManifest = {
        manifest_version: 3,
        name: "Test Extension",
        version: "1.0.0",
        description: "Test description"
    };

    // 16. scripting.updateContentScripts with imported RegisteredContentScript properties
    await browser.scripting.updateContentScripts([
        { id: "script-1", persistAcrossSessions: false }
    ]);

    // 17. userScripts.update with imported RegisteredUserScript properties
    await browser.userScripts.update([
        { id: "userscript-1" }
    ]);

    // 18. trial.ml createEngine and runEngine with typed requests
    const createReq: browser.trial.ml.CreateEngineRequest = {};
    await browser.trial.ml.createEngine(createReq);
    const runReq: browser.trial.ml.RunEngineRequest = {};
    await browser.trial.ml.runEngine(runReq);

    // 19. devtools.inspectedWindow.Resource typed usage
    const resources: browser.devtools.inspectedWindow.Resource[] = await browser.devtools.inspectedWindow.getResources();
    if (resources.length > 0) {
        const content: string = await resources[0].getContent();
    }

    // 20. devtools.panels.ExtensionPanel typed usage
    const panel: browser.devtools.panels.ExtensionPanel = await browser.devtools.panels.create(
        "My Panel",
        "icon.png",
        "panel.html"
    );
    panel.onShown.addListener((win) => {});
}