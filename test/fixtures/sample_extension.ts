import { browser, chrome } from "../../dist/index.js";

async function testFirefoxAPIs() {
    // 1. Test Promise form
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (tabs.length > 0) {
        const tabId = tabs[0].id;
        if (tabId !== undefined) {
            const tab = await browser.tabs.get(tabId);
            console.log("Tab title:", tab.title);
        }
    }

    // 2. Test Callback form
    browser.tabs.query({ active: true }, (cbTabs) => {
        console.log("Callback tabs count:", cbTabs.length);
    });

    // 3. Test Alarms API
    browser.alarms.create("periodic-sync", { periodInMinutes: 15 });
    const alarm = await browser.alarms.get("periodic-sync");
    if (alarm) {
        console.log("Alarm scheduled:", alarm.scheduledTime);
    }

    // 4. Test Chrome compatibility namespace
    chrome.tabs.query({ active: true }, (chromeTabs) => {
        console.log("Chrome alias tabs:", chromeTabs.length);
    });
}
