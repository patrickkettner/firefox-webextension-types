// Type definitions for Firefox WebExtensions
// Project: firefox-webextension-types
// Target: Desktop
// Firefox Version: 161.0a1
// Definitions generated strictly from Mozilla Firefox source schemas.
//
// The generator that produced this file is licensed under the Apache License,
// Version 2.0. The documentation comments and API shapes below are derived from
// Firefox WebExtension schema files, which are subject to the terms of the
// Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with
// this file, you can obtain one at https://mozilla.org/MPL/2.0/.
// Parts of those schemas originated from Chromium:
// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of that source code is governed by a BSD-style license that can be
// found in the LICENSE-CHROMIUM file.

export interface WebExtensionEvent<TListener extends (...args: any[]) => void> {
    addListener(callback: TListener): void;
    removeListener(callback: TListener): void;
    hasListener(callback: TListener): boolean;
}

export namespace browser {
    /**
     * Use browser actions to put icons in the main browser toolbar, to the right of the address bar. In addition to its icon, a browser action can also have a tooltip, a badge, and a popup.
     *
     * Requires manifest_version 3 or later.
     * Not available in content scripts or devtools pages.
     *
     * @permission manifest:action or manifest:browser_action
     * @platform desktop, mobile
     */
    export namespace action {
        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export type ColorArray = [number, number, number, number];

        /**
         * An array of four integers in the range [0,255] that make up the RGBA color of the badge. For example, opaque red is `[255, 0, 0, 255]`. Can also be a string with a CSS value, with opaque red being `#FF0000` or `#F00`.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export type ColorValue = ColorArray | null | (string & {});

        /**
         * Specifies to which tab or window the value should be set, or from which one it should be retrieved. If no tab nor window is specified, the global value is set or retrieved.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export interface Details {
            /**
             * When setting a value, it will be specific to the specified tab, and will automatically reset when the tab navigates. When getting, specifies the tab to get the value from; if there is no tab-specific value, the window one will be inherited.
             */
            tabId?: number | undefined;
            /**
             * When setting a value, it will be specific to the specified window. When getting, specifies the window to get the value from; if there is no window-specific value, the global one will be inherited.
             */
            windowId?: number | undefined;
        }

        /**
         * Pixel data for an image. Must be an ImageData object (for example, from a `canvas` element).
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export type ImageDataType = globalThis.ImageData;

        /**
         * Information sent when a browser action is clicked.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export interface OnClickData {
            /**
             * An integer value of button by which menu item was clicked.
             */
            button?: number | undefined;
            /**
             * An array of keyboard modifiers that were held while the menu item was clicked.
             */
            modifiers: ("Shift" | "Alt" | "Command" | "Ctrl" | "MacCtrl")[];
        }

        /**
         * Fired when a browser action icon is clicked.  This event will not fire if the browser action has a popup.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export const onClicked: WebExtensionEvent<(tab: browser.tabs.Tab, info?: OnClickData) => void>;

        /**
         * Fired when user-specified settings relating to an extension's action change.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export const onUserSettingsChanged: WebExtensionEvent<(change: onUserSettingsChanged.Change) => void>;
        export namespace onUserSettingsChanged {
            export type Change = {
                /**
                 * Whether the extension's action icon is visible on browser windows' top-level toolbar (i.e., whether the extension has been 'pinned' by the user).
                 */
                isOnToolbar?: boolean | undefined;
            };
        }

        /**
         * Disables the browser action for a tab.
         *
         * @param tabId The id of the tab for which you want to modify the browser action.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export function disable(tabId?: number | null): globalThis.Promise<void>;
        export function disable(tabId: number | null | undefined, callback: (() => void)): void;
        export function disable(callback: (() => void)): void;

        /**
         * Enables the browser action for a tab. By default, browser actions are enabled.
         *
         * @param tabId The id of the tab for which you want to modify the browser action.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export function enable(tabId?: number | null): globalThis.Promise<void>;
        export function enable(tabId: number | null | undefined, callback: (() => void)): void;
        export function enable(callback: (() => void)): void;

        /**
         * Gets the background color of the browser action badge.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export function getBadgeBackgroundColor(details: Details): globalThis.Promise<ColorArray>;
        export function getBadgeBackgroundColor(details: Details, callback: ((result: ColorArray) => void)): void;

        /**
         * Gets the badge text of the browser action. If no tab nor window is specified is specified, the global badge text is returned.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export function getBadgeText(details: Details): globalThis.Promise<string>;
        export function getBadgeText(details: Details, callback: ((result: string) => void)): void;

        /**
         * Gets the text color of the browser action badge.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export function getBadgeTextColor(details: Details): globalThis.Promise<ColorArray>;

        /**
         * Gets the html document set as the popup for this browser action.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export function getPopup(details: Details): globalThis.Promise<string>;
        export function getPopup(details: Details, callback: ((result: string) => void)): void;

        /**
         * Gets the title of the browser action.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export function getTitle(details: Details): globalThis.Promise<string>;
        export function getTitle(details: Details, callback: ((result: string) => void)): void;

        /**
         * Returns the user-specified settings relating to an extension's action.
         *
         * @returns The collection of user-specified settings relating to an extension's action.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export function getUserSettings(): globalThis.Promise<getUserSettings.Result>;
        export function getUserSettings(callback: ((userSettings: getUserSettings.Result) => void)): void;
        export namespace getUserSettings {
            /**
             * The collection of user-specified settings relating to an extension's action.
             */
            export type Result = {
                /**
                 * Whether the extension's action icon is visible on browser windows' top-level toolbar (i.e., whether the extension has been 'pinned' by the user).
                 */
                isOnToolbar?: boolean | undefined;
            };
        }

        /**
         * Checks whether the browser action is enabled.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export function isEnabled(details?: Details | number | null): globalThis.Promise<boolean>;

        /**
         * Opens the extension popup window in the specified window.
         *
         * @param options An object with information about the popup to open.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export function openPopup(options?: openPopup.Options | null): globalThis.Promise<void>;
        export namespace openPopup {
            /**
             * An object with information about the popup to open.
             */
            export type Options = {
                /**
                 * Defaults to the current window.
                 */
                windowId?: number | undefined;
            };
        }

        /**
         * Sets the background color for the badge.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export function setBadgeBackgroundColor(details: setBadgeBackgroundColor.Details): globalThis.Promise<void>;
        export function setBadgeBackgroundColor(details: setBadgeBackgroundColor.Details, callback: (() => void)): void;
        export namespace setBadgeBackgroundColor {
            export type Details = {
                color: ColorValue;
                /**
                 * When setting a value, it will be specific to the specified tab, and will automatically reset when the tab navigates. When getting, specifies the tab to get the value from; if there is no tab-specific value, the window one will be inherited.
                 */
                tabId?: number | undefined;
                /**
                 * When setting a value, it will be specific to the specified window. When getting, specifies the window to get the value from; if there is no window-specific value, the global one will be inherited.
                 */
                windowId?: number | undefined;
            };
        }

        /**
         * Sets the badge text for the browser action. The badge is displayed on top of the icon.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export function setBadgeText(details: setBadgeText.Details): globalThis.Promise<void>;
        export function setBadgeText(details: setBadgeText.Details, callback: (() => void)): void;
        export namespace setBadgeText {
            export type Details = {
                /**
                 * When setting a value, it will be specific to the specified tab, and will automatically reset when the tab navigates. When getting, specifies the tab to get the value from; if there is no tab-specific value, the window one will be inherited.
                 */
                tabId?: number | undefined;
                /**
                 * Any number of characters can be passed, but only about four can fit in the space.
                 */
                text: string | null;
                /**
                 * When setting a value, it will be specific to the specified window. When getting, specifies the window to get the value from; if there is no window-specific value, the global one will be inherited.
                 */
                windowId?: number | undefined;
            };
        }

        /**
         * Sets the text color for the badge.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export function setBadgeTextColor(details: setBadgeTextColor.Details): globalThis.Promise<void>;
        export namespace setBadgeTextColor {
            export type Details = {
                color: ColorValue;
                /**
                 * When setting a value, it will be specific to the specified tab, and will automatically reset when the tab navigates. When getting, specifies the tab to get the value from; if there is no tab-specific value, the window one will be inherited.
                 */
                tabId?: number | undefined;
                /**
                 * When setting a value, it will be specific to the specified window. When getting, specifies the window to get the value from; if there is no window-specific value, the global one will be inherited.
                 */
                windowId?: number | undefined;
            };
        }

        /**
         * Sets the icon for the browser action. The icon can be specified either as the path to an image file or as the pixel data from a canvas element, or as dictionary of either one of those. Either the **path** or the **imageData** property must be specified.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export function setIcon(details: setIcon.Details): globalThis.Promise<void>;
        export function setIcon(details: setIcon.Details, callback: (() => void)): void;
        export namespace setIcon {
            export type Details = {
                /**
                 * Either an ImageData object or a dictionary {size -> ImageData} representing icon to be set. If the icon is specified as a dictionary, the actual image to be used is chosen depending on screen's pixel density. If the number of image pixels that fit into one screen space unit equals `scale`, then image with size `scale` * 19 will be selected. Initially only scales 1 and 2 will be supported. At least one image must be specified. Note that 'details.imageData = foo' is equivalent to 'details.imageData = {'19': foo}'
                 */
                imageData?: ImageDataType | { [key: number]: ImageDataType } | undefined;
                /**
                 * Either a relative image path or a dictionary {size -> relative image path} pointing to icon to be set. If the icon is specified as a dictionary, the actual image to be used is chosen depending on screen's pixel density. If the number of image pixels that fit into one screen space unit equals `scale`, then image with size `scale` * 19 will be selected. Initially only scales 1 and 2 will be supported. At least one image must be specified. Note that 'details.path = foo' is equivalent to 'details.imageData = {'19': foo}'
                 */
                path?: string | { [key: number]: string } | undefined;
                /**
                 * When setting a value, it will be specific to the specified tab, and will automatically reset when the tab navigates. When getting, specifies the tab to get the value from; if there is no tab-specific value, the window one will be inherited.
                 */
                tabId?: number | undefined;
                /**
                 * When setting a value, it will be specific to the specified window. When getting, specifies the window to get the value from; if there is no window-specific value, the global one will be inherited.
                 */
                windowId?: number | undefined;
            };
        }

        /**
         * Sets the html document to be opened as a popup when the user clicks on the browser action's icon.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export function setPopup(details: setPopup.Details): globalThis.Promise<void>;
        export function setPopup(details: setPopup.Details, callback: (() => void)): void;
        export namespace setPopup {
            export type Details = {
                /**
                 * The html file to show in a popup.  If set to the empty string (''), no popup is shown.
                 */
                popup: string | null;
                /**
                 * When setting a value, it will be specific to the specified tab, and will automatically reset when the tab navigates. When getting, specifies the tab to get the value from; if there is no tab-specific value, the window one will be inherited.
                 */
                tabId?: number | undefined;
                /**
                 * When setting a value, it will be specific to the specified window. When getting, specifies the window to get the value from; if there is no window-specific value, the global one will be inherited.
                 */
                windowId?: number | undefined;
            };
        }

        /**
         * Sets the title of the browser action. This shows up in the tooltip.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export function setTitle(details: setTitle.Details): globalThis.Promise<void>;
        export function setTitle(details: setTitle.Details, callback: (() => void)): void;
        export namespace setTitle {
            export type Details = {
                /**
                 * When setting a value, it will be specific to the specified tab, and will automatically reset when the tab navigates. When getting, specifies the tab to get the value from; if there is no tab-specific value, the window one will be inherited.
                 */
                tabId?: number | undefined;
                /**
                 * The string the browser action should display when moused over.
                 */
                title: string | null;
                /**
                 * When setting a value, it will be specific to the specified window. When getting, specifies the window to get the value from; if there is no window-specific value, the global one will be inherited.
                 */
                windowId?: number | undefined;
            };
        }

    }

    /**
     * Monitor extension activity
     *
     * Only privileged extensions can use this API.
     * Not available in content scripts or devtools pages.
     *
     * @permission activityLog
     * @platform desktop, mobile
     */
    export namespace activityLog {
        /**
         * Receives an activityItem for each logging event.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/activity_log.json
         * @platform desktop, mobile
         */
        export const onExtensionActivity: Omit<WebExtensionEvent<(details: onExtensionActivity.Details) => void>, "addListener"> & { addListener(callback: (details: onExtensionActivity.Details) => void, id: string): void };
        export namespace onExtensionActivity {
            export type Details = {
                data: {
                    /**
                     * A list of arguments passed to the call.
                     */
                    args?: any[] | undefined;
                    /**
                     * The result of the call.
                     */
                    result?: Record<string, unknown> | undefined;
                    /**
                     * The tab associated with this event if it is a tab or content script.
                     */
                    tabId?: number | undefined;
                    /**
                     * If the type is content_script, this is the url of the script that was injected.
                     */
                    url?: string | undefined;
                };
                /**
                 * The name of the api call or event, or the script url if this is a content or user script event.
                 */
                name: string;
                /**
                 * The date string when this call is triggered.
                 */
                timeStamp: browser.extensionTypes.Date;
                /**
                 * The type of log entry.  api_call is a function call made by the extension and api_event is an event callback to the extension.  content_script is logged when a content script is injected.
                 */
                type: "api_call" | "api_event" | "content_script" | "user_script";
                /**
                 * The type of view where the activity occurred.  Content scripts will not have a viewType.
                 */
                viewType?: "background" | "popup" | "sidebar" | "tab" | "devtools_page" | "devtools_panel" | undefined;
            };
        }

    }

    /**
     * Not available in content scripts or devtools pages.
     *
     * @permission alarms
     * @platform desktop, mobile
     */
    export namespace alarms {
        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/alarms.json
         * @platform desktop, mobile
         */
        export interface Alarm {
            /**
             * Name of this alarm.
             */
            name: string;
            /**
             * When present, signals that the alarm triggers periodically after so many minutes.
             */
            periodInMinutes?: number | undefined;
            /**
             * Time when the alarm is scheduled to fire, in milliseconds past the epoch.
             */
            scheduledTime: number;
        }

        /**
         * Fired when an alarm has expired. Useful for transient background pages.
         *
         * @param name The alarm that has expired.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/alarms.json
         * @platform desktop, mobile
         */
        export const onAlarm: WebExtensionEvent<(name: Alarm) => void>;

        /**
         * Clears the alarm with the given name.
         *
         * @param name The name of the alarm to clear. Defaults to the empty string.
         * @returns Whether an alarm of the given name was found to clear.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/alarms.json
         * @platform desktop, mobile
         */
        export function clear(name?: string | null): globalThis.Promise<boolean>;
        export function clear(name: string | null | undefined, callback: ((wasCleared: boolean) => void)): void;
        export function clear(callback: ((wasCleared: boolean) => void)): void;

        /**
         * Clears all alarms.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/alarms.json
         * @platform desktop, mobile
         */
        export function clearAll(): globalThis.Promise<void>;
        export function clearAll(callback: (() => void)): void;

        /**
         * Creates an alarm. After the delay is expired, the onAlarm event is fired. If there is another alarm with the same name (or no name if none is specified), it will be cancelled and replaced by this alarm.
         *
         * @param name Optional name to identify this alarm. Defaults to the empty string.
         * @param alarmInfo Details about the alarm. The alarm first fires either at 'when' milliseconds past the epoch (if 'when' is provided), after 'delayInMinutes' minutes from the current time (if 'delayInMinutes' is provided instead), or after 'periodInMinutes' minutes from the current time (if only 'periodInMinutes' is provided). Users should never provide both 'when' and 'delayInMinutes'. If 'periodInMinutes' is provided, then the alarm recurs repeatedly after that many minutes.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/alarms.json
         * @platform desktop, mobile
         */
        export function create(name: string | null | undefined, alarmInfo: create.AlarmInfo): globalThis.Promise<void>;
        export function create(alarmInfo: create.AlarmInfo): globalThis.Promise<void>;
        export function create(name: string | null | undefined, alarmInfo: create.AlarmInfo, callback: (() => void)): void;
        export function create(alarmInfo: create.AlarmInfo, callback: (() => void)): void;
        export namespace create {
            /**
             * Details about the alarm. The alarm first fires either at 'when' milliseconds past the epoch (if 'when' is provided), after 'delayInMinutes' minutes from the current time (if 'delayInMinutes' is provided instead), or after 'periodInMinutes' minutes from the current time (if only 'periodInMinutes' is provided). Users should never provide both 'when' and 'delayInMinutes'. If 'periodInMinutes' is provided, then the alarm recurs repeatedly after that many minutes.
             */
            export type AlarmInfo = {
                /**
                 * Number of minutes from the current time after which the alarm should first fire.
                 */
                delayInMinutes?: number | undefined;
                /**
                 * Number of minutes after which the alarm should recur repeatedly.
                 */
                periodInMinutes?: number | undefined;
                /**
                 * Time when the alarm is scheduled to first fire, in milliseconds past the epoch.
                 */
                when?: number | undefined;
            };
        }

        /**
         * Retrieves details about the specified alarm.
         *
         * @param name The name of the alarm to get. Defaults to the empty string.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/alarms.json
         * @platform desktop, mobile
         */
        export function get(name?: string | null): globalThis.Promise<Alarm | undefined>;
        export function get(name: string | null | undefined, callback: ((alarm: Alarm | undefined) => void)): void;
        export function get(callback: ((alarm: Alarm | undefined) => void)): void;

        /**
         * Gets an array of all the alarms.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/alarms.json
         * @platform desktop, mobile
         */
        export function getAll(): globalThis.Promise<Alarm[]>;
        export function getAll(callback: ((alarms: Alarm[]) => void)): void;

    }

    /**
     * Use the `browser.bookmarks` API to create, organize, and otherwise manipulate bookmarks. Also see Override Pages, which you can use to create a custom Bookmark Manager page.
     *
     * Not available in content scripts or devtools pages.
     *
     * @permission bookmarks
     * @platform desktop
     */
    export namespace bookmarks {
        /**
         * A node (either a bookmark or a folder) in the bookmark tree.  Child nodes are ordered within their parent folder.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/bookmarks.json
         * @platform desktop
         */
        export interface BookmarkTreeNode {
            /**
             * An ordered list of children of this node.
             */
            children?: BookmarkTreeNode[] | undefined;
            /**
             * When this node was created, in milliseconds since the epoch (`new Date(dateAdded)`).
             */
            dateAdded?: number | undefined;
            /**
             * When the contents of this folder last changed, in milliseconds since the epoch.
             */
            dateGroupModified?: number | undefined;
            /**
             * The unique identifier for the node. IDs are unique within the current profile, and they remain valid even after the browser is restarted.
             */
            id: string;
            /**
             * The 0-based position of this node within its parent folder.
             */
            index?: number | undefined;
            /**
             * The `id` of the parent folder.  Omitted for the root node.
             */
            parentId?: string | undefined;
            /**
             * The text displayed for the node.
             */
            title: string;
            /**
             * Indicates the type of the BookmarkTreeNode, which can be one of bookmark, folder or separator.
             */
            type?: BookmarkTreeNodeType | undefined;
            /**
             * Indicates the reason why this node is unmodifiable. The `managed` value indicates that this node was configured by the system administrator or by the custodian of a supervised user. Omitted if the node can be modified by the user and the extension (default).
             */
            unmodifiable?: BookmarkTreeNodeUnmodifiable | undefined;
            /**
             * The URL navigated to when a user clicks the bookmark. Omitted for folders.
             */
            url?: string | undefined;
        }

        /**
         * Indicates the type of a BookmarkTreeNode, which can be one of bookmark, folder or separator.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/bookmarks.json
         * @platform desktop
         */
        export type BookmarkTreeNodeType = "bookmark" | "folder" | "separator";

        /**
         * Indicates the reason why this node is unmodifiable. The `managed` value indicates that this node was configured by the system administrator or by the custodian of a supervised user. Omitted if the node can be modified by the user and the extension (default).
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/bookmarks.json
         * @platform desktop
         */
        export type BookmarkTreeNodeUnmodifiable = "managed";

        /**
         * Object passed to the create() function.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/bookmarks.json
         * @platform desktop
         */
        export interface CreateDetails {
            index?: number | undefined;
            /**
             * Defaults to the Other Bookmarks folder.
             */
            parentId?: string | undefined;
            title?: string | undefined;
            /**
             * Indicates the type of BookmarkTreeNode to create, which can be one of bookmark, folder or separator.
             */
            type?: BookmarkTreeNodeType | undefined;
            url?: string | undefined;
        }

        /**
         * Fired when a bookmark or folder changes.  **Note:** Currently, only title and url changes trigger this.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/bookmarks.json
         * @platform desktop
         */
        export const onChanged: WebExtensionEvent<(id: string, changeInfo: onChanged.ChangeInfo) => void>;
        export namespace onChanged {
            export type ChangeInfo = {
                title: string;
                url?: string | undefined;
            };
        }

        /**
         * Fired when the children of a folder have changed their order due to the order being sorted in the UI.  This is not called as a result of a move().
         *
         * @deprecated Firefox does not support this event; it does not exist at runtime.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/bookmarks.json
         */
        export const onChildrenReordered: WebExtensionEvent<(id: string, reorderInfo: onChildrenReordered.ReorderInfo) => void>;
        export namespace onChildrenReordered {
            export type ReorderInfo = {
                childIds: string[];
            };
        }

        /**
         * Fired when a bookmark or folder is created.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/bookmarks.json
         * @platform desktop
         */
        export const onCreated: WebExtensionEvent<(id: string, bookmark: BookmarkTreeNode) => void>;

        /**
         * Fired when a bookmark import session is begun.  Expensive observers should ignore onCreated updates until onImportEnded is fired.  Observers should still handle other notifications immediately.
         *
         * @deprecated Firefox does not support this event; it does not exist at runtime.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/bookmarks.json
         */
        export const onImportBegan: WebExtensionEvent<() => void>;

        /**
         * Fired when a bookmark import session is ended.
         *
         * @deprecated Firefox does not support this event; it does not exist at runtime.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/bookmarks.json
         */
        export const onImportEnded: WebExtensionEvent<() => void>;

        /**
         * Fired when a bookmark or folder is moved to a different parent folder.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/bookmarks.json
         * @platform desktop
         */
        export const onMoved: WebExtensionEvent<(id: string, moveInfo: onMoved.MoveInfo) => void>;
        export namespace onMoved {
            export type MoveInfo = {
                index: number;
                oldIndex: number;
                oldParentId: string;
                parentId: string;
            };
        }

        /**
         * Fired when a bookmark or folder is removed.  When a folder is removed recursively, a single notification is fired for the folder, and none for its contents.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/bookmarks.json
         * @platform desktop
         */
        export const onRemoved: WebExtensionEvent<(id: string, removeInfo: onRemoved.RemoveInfo) => void>;
        export namespace onRemoved {
            export type RemoveInfo = {
                index: number;
                node: BookmarkTreeNode;
                parentId: string;
            };
        }

        /**
         * Creates a bookmark or folder under the specified parentId.  If url is NULL or missing, it will be a folder.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/bookmarks.json
         * @platform desktop
         */
        export function create(bookmark: CreateDetails): globalThis.Promise<BookmarkTreeNode>;
        export function create(bookmark: CreateDetails, callback: ((result: BookmarkTreeNode) => void)): void;

        /**
         * Retrieves the specified BookmarkTreeNode(s).
         *
         * @param idOrIdList A single string-valued id, or an array of string-valued ids
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/bookmarks.json
         * @platform desktop
         */
        export function get(idOrIdList: string | string[]): globalThis.Promise<BookmarkTreeNode[]>;
        export function get(idOrIdList: string | string[], callback: ((results: BookmarkTreeNode[]) => void)): void;

        /**
         * Retrieves the children of the specified BookmarkTreeNode id.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/bookmarks.json
         * @platform desktop
         */
        export function getChildren(id: string): globalThis.Promise<BookmarkTreeNode[]>;
        export function getChildren(id: string, callback: ((results: BookmarkTreeNode[]) => void)): void;

        /**
         * Retrieves the recently added bookmarks.
         *
         * @param numberOfItems The maximum number of items to return.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/bookmarks.json
         * @platform desktop
         */
        export function getRecent(numberOfItems: number): globalThis.Promise<BookmarkTreeNode[]>;
        export function getRecent(numberOfItems: number, callback: ((results: BookmarkTreeNode[]) => void)): void;

        /**
         * Retrieves part of the Bookmarks hierarchy, starting at the specified node.
         *
         * @param id The ID of the root of the subtree to retrieve.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/bookmarks.json
         * @platform desktop
         */
        export function getSubTree(id: string): globalThis.Promise<BookmarkTreeNode[]>;
        export function getSubTree(id: string, callback: ((results: BookmarkTreeNode[]) => void)): void;

        /**
         * Retrieves the entire Bookmarks hierarchy.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/bookmarks.json
         * @platform desktop
         */
        export function getTree(): globalThis.Promise<BookmarkTreeNode[]>;
        export function getTree(callback: ((results: BookmarkTreeNode[]) => void)): void;

        /**
         * Moves the specified BookmarkTreeNode to the provided location.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/bookmarks.json
         * @platform desktop
         */
        export function move(id: string, destination: move.Destination): globalThis.Promise<BookmarkTreeNode>;
        export function move(id: string, destination: move.Destination, callback: ((result: BookmarkTreeNode) => void)): void;
        export namespace move {
            export type Destination = {
                index?: number | undefined;
                parentId?: string | undefined;
            };
        }

        /**
         * Removes a bookmark or an empty bookmark folder.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/bookmarks.json
         * @platform desktop
         */
        export function remove(id: string): globalThis.Promise<void>;
        export function remove(id: string, callback: (() => void)): void;

        /**
         * Recursively removes a bookmark folder.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/bookmarks.json
         * @platform desktop
         */
        export function removeTree(id: string): globalThis.Promise<void>;
        export function removeTree(id: string, callback: (() => void)): void;

        /**
         * Searches for BookmarkTreeNodes matching the given query. Queries specified with an object produce BookmarkTreeNodes matching all specified properties.
         *
         * @param query Either a string of words that are matched against bookmark URLs and titles, or an object. If an object, the properties `query`, `url`, and `title` may be specified and bookmarks matching all specified properties will be produced.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/bookmarks.json
         * @platform desktop
         */
        export function search(query: string | {
            /**
             * A string of words that are matched against bookmark URLs and titles.
             */
            query?: string | undefined;
            /**
             * The title of the bookmark; matches verbatim.
             */
            title?: string | undefined;
            /**
             * The URL of the bookmark; matches verbatim. Note that folders have no URL.
             */
            url?: string | undefined;
        }): globalThis.Promise<BookmarkTreeNode[]>;
        export function search(query: string | {
            /**
             * A string of words that are matched against bookmark URLs and titles.
             */
            query?: string | undefined;
            /**
             * The title of the bookmark; matches verbatim.
             */
            title?: string | undefined;
            /**
             * The URL of the bookmark; matches verbatim. Note that folders have no URL.
             */
            url?: string | undefined;
        }, callback: ((results: BookmarkTreeNode[]) => void)): void;

        /**
         * Updates the properties of a bookmark or folder. Specify only the properties that you want to change; unspecified properties will be left unchanged.  **Note:** Currently, only 'title' and 'url' are supported.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/bookmarks.json
         * @platform desktop
         */
        export function update(id: string, changes: update.Changes): globalThis.Promise<BookmarkTreeNode>;
        export function update(id: string, changes: update.Changes, callback: ((result: BookmarkTreeNode) => void)): void;
        export namespace update {
            export type Changes = {
                title?: string | undefined;
                url?: string | undefined;
            };
        }

    }

    /**
     * Use browser actions to put icons in the main browser toolbar, to the right of the address bar. In addition to its icon, a browser action can also have a tooltip, a badge, and a popup.
     *
     * Only available in manifest_version 2 or earlier.
     * Not available in content scripts or devtools pages.
     *
     * @permission manifest:action or manifest:browser_action
     * @platform desktop, mobile
     */
    export namespace browserAction {
        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export type ColorArray = [number, number, number, number];

        /**
         * An array of four integers in the range [0,255] that make up the RGBA color of the badge. For example, opaque red is `[255, 0, 0, 255]`. Can also be a string with a CSS value, with opaque red being `#FF0000` or `#F00`.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export type ColorValue = ColorArray | null | (string & {});

        /**
         * Specifies to which tab or window the value should be set, or from which one it should be retrieved. If no tab nor window is specified, the global value is set or retrieved.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export interface Details {
            /**
             * When setting a value, it will be specific to the specified tab, and will automatically reset when the tab navigates. When getting, specifies the tab to get the value from; if there is no tab-specific value, the window one will be inherited.
             */
            tabId?: number | undefined;
            /**
             * When setting a value, it will be specific to the specified window. When getting, specifies the window to get the value from; if there is no window-specific value, the global one will be inherited.
             */
            windowId?: number | undefined;
        }

        /**
         * Pixel data for an image. Must be an ImageData object (for example, from a `canvas` element).
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export type ImageDataType = globalThis.ImageData;

        /**
         * Information sent when a browser action is clicked.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export interface OnClickData {
            /**
             * An integer value of button by which menu item was clicked.
             */
            button?: number | undefined;
            /**
             * An array of keyboard modifiers that were held while the menu item was clicked.
             */
            modifiers: ("Shift" | "Alt" | "Command" | "Ctrl" | "MacCtrl")[];
        }

        /**
         * Fired when a browser action icon is clicked.  This event will not fire if the browser action has a popup.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export const onClicked: WebExtensionEvent<(tab: browser.tabs.Tab, info?: OnClickData) => void>;

        /**
         * Fired when user-specified settings relating to an extension's action change.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export const onUserSettingsChanged: WebExtensionEvent<(change: onUserSettingsChanged.Change) => void>;
        export namespace onUserSettingsChanged {
            export type Change = {
                /**
                 * Whether the extension's action icon is visible on browser windows' top-level toolbar (i.e., whether the extension has been 'pinned' by the user).
                 */
                isOnToolbar?: boolean | undefined;
            };
        }

        /**
         * Disables the browser action for a tab.
         *
         * @param tabId The id of the tab for which you want to modify the browser action.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export function disable(tabId?: number | null): globalThis.Promise<void>;
        export function disable(tabId: number | null | undefined, callback: (() => void)): void;
        export function disable(callback: (() => void)): void;

        /**
         * Enables the browser action for a tab. By default, browser actions are enabled.
         *
         * @param tabId The id of the tab for which you want to modify the browser action.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export function enable(tabId?: number | null): globalThis.Promise<void>;
        export function enable(tabId: number | null | undefined, callback: (() => void)): void;
        export function enable(callback: (() => void)): void;

        /**
         * Gets the background color of the browser action badge.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export function getBadgeBackgroundColor(details: Details): globalThis.Promise<ColorArray>;
        export function getBadgeBackgroundColor(details: Details, callback: ((result: ColorArray) => void)): void;

        /**
         * Gets the badge text of the browser action. If no tab nor window is specified is specified, the global badge text is returned.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export function getBadgeText(details: Details): globalThis.Promise<string>;
        export function getBadgeText(details: Details, callback: ((result: string) => void)): void;

        /**
         * Gets the text color of the browser action badge.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export function getBadgeTextColor(details: Details): globalThis.Promise<ColorArray>;

        /**
         * Gets the html document set as the popup for this browser action.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export function getPopup(details: Details): globalThis.Promise<string>;
        export function getPopup(details: Details, callback: ((result: string) => void)): void;

        /**
         * Gets the title of the browser action.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export function getTitle(details: Details): globalThis.Promise<string>;
        export function getTitle(details: Details, callback: ((result: string) => void)): void;

        /**
         * Returns the user-specified settings relating to an extension's action.
         *
         * @returns The collection of user-specified settings relating to an extension's action.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export function getUserSettings(): globalThis.Promise<getUserSettings.Result>;
        export function getUserSettings(callback: ((userSettings: getUserSettings.Result) => void)): void;
        export namespace getUserSettings {
            /**
             * The collection of user-specified settings relating to an extension's action.
             */
            export type Result = {
                /**
                 * Whether the extension's action icon is visible on browser windows' top-level toolbar (i.e., whether the extension has been 'pinned' by the user).
                 */
                isOnToolbar?: boolean | undefined;
            };
        }

        /**
         * Checks whether the browser action is enabled.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export function isEnabled(details?: Details | number | null): globalThis.Promise<boolean>;

        /**
         * Opens the extension popup window in the specified window.
         *
         * @param options An object with information about the popup to open.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export function openPopup(options?: openPopup.Options | null): globalThis.Promise<void>;
        export namespace openPopup {
            /**
             * An object with information about the popup to open.
             */
            export type Options = {
                /**
                 * Defaults to the current window.
                 */
                windowId?: number | undefined;
            };
        }

        /**
         * Sets the background color for the badge.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export function setBadgeBackgroundColor(details: setBadgeBackgroundColor.Details): globalThis.Promise<void>;
        export function setBadgeBackgroundColor(details: setBadgeBackgroundColor.Details, callback: (() => void)): void;
        export namespace setBadgeBackgroundColor {
            export type Details = {
                color: ColorValue;
                /**
                 * When setting a value, it will be specific to the specified tab, and will automatically reset when the tab navigates. When getting, specifies the tab to get the value from; if there is no tab-specific value, the window one will be inherited.
                 */
                tabId?: number | undefined;
                /**
                 * When setting a value, it will be specific to the specified window. When getting, specifies the window to get the value from; if there is no window-specific value, the global one will be inherited.
                 */
                windowId?: number | undefined;
            };
        }

        /**
         * Sets the badge text for the browser action. The badge is displayed on top of the icon.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export function setBadgeText(details: setBadgeText.Details): globalThis.Promise<void>;
        export function setBadgeText(details: setBadgeText.Details, callback: (() => void)): void;
        export namespace setBadgeText {
            export type Details = {
                /**
                 * When setting a value, it will be specific to the specified tab, and will automatically reset when the tab navigates. When getting, specifies the tab to get the value from; if there is no tab-specific value, the window one will be inherited.
                 */
                tabId?: number | undefined;
                /**
                 * Any number of characters can be passed, but only about four can fit in the space.
                 */
                text: string | null;
                /**
                 * When setting a value, it will be specific to the specified window. When getting, specifies the window to get the value from; if there is no window-specific value, the global one will be inherited.
                 */
                windowId?: number | undefined;
            };
        }

        /**
         * Sets the text color for the badge.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export function setBadgeTextColor(details: setBadgeTextColor.Details): globalThis.Promise<void>;
        export namespace setBadgeTextColor {
            export type Details = {
                color: ColorValue;
                /**
                 * When setting a value, it will be specific to the specified tab, and will automatically reset when the tab navigates. When getting, specifies the tab to get the value from; if there is no tab-specific value, the window one will be inherited.
                 */
                tabId?: number | undefined;
                /**
                 * When setting a value, it will be specific to the specified window. When getting, specifies the window to get the value from; if there is no window-specific value, the global one will be inherited.
                 */
                windowId?: number | undefined;
            };
        }

        /**
         * Sets the icon for the browser action. The icon can be specified either as the path to an image file or as the pixel data from a canvas element, or as dictionary of either one of those. Either the **path** or the **imageData** property must be specified.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export function setIcon(details: setIcon.Details): globalThis.Promise<void>;
        export function setIcon(details: setIcon.Details, callback: (() => void)): void;
        export namespace setIcon {
            export type Details = {
                /**
                 * Either an ImageData object or a dictionary {size -> ImageData} representing icon to be set. If the icon is specified as a dictionary, the actual image to be used is chosen depending on screen's pixel density. If the number of image pixels that fit into one screen space unit equals `scale`, then image with size `scale` * 19 will be selected. Initially only scales 1 and 2 will be supported. At least one image must be specified. Note that 'details.imageData = foo' is equivalent to 'details.imageData = {'19': foo}'
                 */
                imageData?: ImageDataType | { [key: number]: ImageDataType } | undefined;
                /**
                 * Either a relative image path or a dictionary {size -> relative image path} pointing to icon to be set. If the icon is specified as a dictionary, the actual image to be used is chosen depending on screen's pixel density. If the number of image pixels that fit into one screen space unit equals `scale`, then image with size `scale` * 19 will be selected. Initially only scales 1 and 2 will be supported. At least one image must be specified. Note that 'details.path = foo' is equivalent to 'details.imageData = {'19': foo}'
                 */
                path?: string | { [key: number]: string } | undefined;
                /**
                 * When setting a value, it will be specific to the specified tab, and will automatically reset when the tab navigates. When getting, specifies the tab to get the value from; if there is no tab-specific value, the window one will be inherited.
                 */
                tabId?: number | undefined;
                /**
                 * When setting a value, it will be specific to the specified window. When getting, specifies the window to get the value from; if there is no window-specific value, the global one will be inherited.
                 */
                windowId?: number | undefined;
            };
        }

        /**
         * Sets the html document to be opened as a popup when the user clicks on the browser action's icon.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export function setPopup(details: setPopup.Details): globalThis.Promise<void>;
        export function setPopup(details: setPopup.Details, callback: (() => void)): void;
        export namespace setPopup {
            export type Details = {
                /**
                 * The html file to show in a popup.  If set to the empty string (''), no popup is shown.
                 */
                popup: string | null;
                /**
                 * When setting a value, it will be specific to the specified tab, and will automatically reset when the tab navigates. When getting, specifies the tab to get the value from; if there is no tab-specific value, the window one will be inherited.
                 */
                tabId?: number | undefined;
                /**
                 * When setting a value, it will be specific to the specified window. When getting, specifies the window to get the value from; if there is no window-specific value, the global one will be inherited.
                 */
                windowId?: number | undefined;
            };
        }

        /**
         * Sets the title of the browser action. This shows up in the tooltip.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export function setTitle(details: setTitle.Details): globalThis.Promise<void>;
        export function setTitle(details: setTitle.Details, callback: (() => void)): void;
        export namespace setTitle {
            export type Details = {
                /**
                 * When setting a value, it will be specific to the specified tab, and will automatically reset when the tab navigates. When getting, specifies the tab to get the value from; if there is no tab-specific value, the window one will be inherited.
                 */
                tabId?: number | undefined;
                /**
                 * The string the browser action should display when moused over.
                 */
                title: string | null;
                /**
                 * When setting a value, it will be specific to the specified window. When getting, specifies the window to get the value from; if there is no window-specific value, the global one will be inherited.
                 */
                windowId?: number | undefined;
            };
        }

    }

    /**
     * Use the `browser.browserSettings` API to control global settings of the browser.
     *
     * Not available in content scripts or devtools pages.
     *
     * @permission browserSettings
     * @platform desktop, mobile
     */
    export namespace browserSettings {
        /**
         * Color management mode.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_settings.json
         * @platform desktop, mobile
         */
        export type ColorManagementMode = "off" | "full" | "tagged_only";

        /**
         * After which mouse event context menus should popup.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_settings.json
         * @platform desktop, mobile
         */
        export type ContextMenuMouseEvent = "mouseup" | "mousedown";

        /**
         * How images should be animated in the browser.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_settings.json
         * @platform desktop, mobile
         */
        export type ImageAnimationBehavior = "normal" | "none" | "once";

        /**
         * Allows or disallows pop-up windows from opening in response to user events.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_settings.json
         * @platform desktop, mobile
         */
        export const allowPopupsForUserEvents: browser.types.Setting;
        /**
         * Enables or disables the browser cache.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_settings.json
         * @platform desktop, mobile
         */
        export const cacheEnabled: browser.types.Setting;
        /**
         * This boolean setting controls whether the selected tab can be closed with a double click.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_settings.json
         * @platform desktop, mobile
         */
        export const closeTabsByDoubleClick: browser.types.Setting;
        /**
         * Controls after which mouse event context menus popup. This setting's value is of type ContextMenuMouseEvent, which has possible values of `mouseup` and `mousedown`.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_settings.json
         * @platform desktop, mobile
         */
        export const contextMenuShowEvent: browser.types.Setting;
        /**
         * Returns whether the FTP protocol is enabled. Read-only.
         *
         * @deprecated FTP support was removed from Firefox in bug 1574475
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_settings.json
         * @platform desktop, mobile
         */
        export const ftpProtocolEnabled: browser.types.Setting;
        /**
         * Returns the value of the overridden home page. Read-only.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_settings.json
         * @platform desktop, mobile
         */
        export const homepageOverride: browser.types.Setting;
        /**
         * Controls the behaviour of image animation in the browser. This setting's value is of type ImageAnimationBehavior, defaulting to `normal`.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_settings.json
         * @platform desktop, mobile
         */
        export const imageAnimationBehavior: browser.types.Setting;
        /**
         * Returns the value of the overridden new tab page. Read-only.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_settings.json
         * @platform desktop, mobile
         */
        export const newTabPageOverride: browser.types.Setting;
        /**
         * Controls where new tabs are opened. `afterCurrent` will open all new tabs next to the current tab, `relatedAfterCurrent` will open only related tabs next to the current tab, and `atEnd` will open all tabs at the end of the tab strip. The default is `relatedAfterCurrent`.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_settings.json
         * @platform desktop, mobile
         */
        export const newTabPosition: browser.types.Setting;
        /**
         * This boolean setting controls whether bookmarks are opened in the current tab or in a new tab.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_settings.json
         * @platform desktop, mobile
         */
        export const openBookmarksInNewTabs: browser.types.Setting;
        /**
         * This boolean setting controls whether search results are opened in the current tab or in a new tab.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_settings.json
         * @platform desktop, mobile
         */
        export const openSearchResultsInNewTabs: browser.types.Setting;
        /**
         * This boolean setting controls whether urlbar results are opened in the current tab or in a new tab.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_settings.json
         * @platform desktop, mobile
         */
        export const openUrlbarResultsInNewTabs: browser.types.Setting;
        /**
         * This setting controls whether a light or dark color scheme overrides the page's preferred color scheme.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_settings.json
         * @platform desktop, mobile
         */
        export const overrideContentColorScheme: browser.types.Setting;
        /**
         * This setting controls whether the user-chosen colors override the page's colors.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_settings.json
         * @platform desktop, mobile
         */
        export const overrideDocumentColors: browser.types.Setting;
        /**
         * This setting controls whether the document's fonts are used.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_settings.json
         * @platform desktop, mobile
         */
        export const useDocumentFonts: browser.types.Setting;
        /**
         * This boolean setting controls whether vertical tabs are enabled.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_settings.json
         * @platform desktop, mobile
         */
        export const verticalTabs: browser.types.Setting;
        /**
         * Disables webAPI notifications.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_settings.json
         * @platform desktop, mobile
         */
        export const webNotificationsDisabled: browser.types.Setting;
        /**
         * This boolean setting controls whether zoom is applied to the full page or to text only.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_settings.json
         * @platform desktop, mobile
         */
        export const zoomFullPage: browser.types.Setting;
        /**
         * This boolean setting controls whether zoom is applied on a per-site basis or to the current tab only. If privacy.resistFingerprinting is true, this setting has no effect and zoom is applied to the current tab only.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_settings.json
         * @platform desktop, mobile
         */
        export const zoomSiteSpecific: browser.types.Setting;

        /**
         * Use the `browserSettings.colorManagement` API to query and set items related to color management.
         *
         * Not available in content scripts or devtools pages.
         *
         * @permission browserSettings
         * @platform desktop, mobile
         */
        export namespace colorManagement {
            /**
             * This setting controls the mode used for color management and must be a string from {@link browser.browserSettings.ColorManagementMode}
             *
             * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_settings.json
             * @platform desktop, mobile
             */
            export const mode: browser.types.Setting;
            /**
             * This boolean setting controls whether or not native sRGB color management is used.
             *
             * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_settings.json
             * @platform desktop, mobile
             */
            export const useNativeSRGB: browser.types.Setting;
            /**
             * This boolean setting controls whether or not the WebRender compositor is used.
             *
             * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_settings.json
             * @platform desktop, mobile
             */
            export const useWebRenderCompositor: browser.types.Setting;

        }
    }

    /**
     * Use the `chrome.browsingData` API to remove browsing data from a user's local profile.
     *
     * Not available in content scripts or devtools pages.
     *
     * @permission browsingData
     * @platform desktop, mobile
     */
    export namespace browsingData {
        /**
         * A set of data types. Missing data types are interpreted as `false`.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browsing_data.json
         * @platform desktop, mobile
         */
        export interface DataTypeSet {
            /**
             * The browser's cache. Note: when removing data, this clears the _entire_ cache: it is not limited to the range you specify.
             */
            cache?: boolean | undefined;
            /**
             * The browser's cookies.
             */
            cookies?: boolean | undefined;
            /**
             * The browser's download list.
             */
            downloads?: boolean | undefined;
            /**
             * The browser's stored form data.
             */
            formData?: boolean | undefined;
            /**
             * The browser's history.
             */
            history?: boolean | undefined;
            /**
             * Websites' IndexedDB data.
             */
            indexedDB?: boolean | undefined;
            /**
             * Websites' local storage data.
             */
            localStorage?: boolean | undefined;
            /**
             * Stored passwords.
             */
            passwords?: boolean | undefined;
            /**
             * Plugins' data.
             */
            pluginData?: boolean | undefined;
            /**
             * Server-bound certificates.
             */
            serverBoundCertificates?: boolean | undefined;
            /**
             * Service Workers.
             */
            serviceWorkers?: boolean | undefined;
        }

        /**
         * Options that determine exactly what data will be removed.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browsing_data.json
         * @platform desktop, mobile
         */
        export interface RemovalOptions {
            /**
             * Only remove data associated with this specific cookieStoreId.
             */
            cookieStoreId?: string | undefined;
            /**
             * Only remove data associated with these hostnames (only applies to cookies and localStorage).
             */
            hostnames?: string[] | undefined;
            /**
             * An object whose properties specify which origin types ought to be cleared. If this object isn't specified, it defaults to clearing only "unprotected" origins. Please ensure that you _really_ want to remove application data before adding 'protectedWeb' or 'extensions'.
             */
            originTypes?: {
                /**
                 * Extensions and packaged applications a user has installed (be _really_ careful!).
                 */
                extension?: boolean | undefined;
                /**
                 * Websites that have been installed as hosted applications (be careful!).
                 */
                protectedWeb?: boolean | undefined;
                /**
                 * Normal websites.
                 */
                unprotectedWeb?: boolean | undefined;
            } | undefined;
            /**
             * Remove data accumulated on or after this date, represented in milliseconds since the epoch (accessible via the `getTime` method of the JavaScript `Date` object). If absent, defaults to 0 (which would remove all browsing data).
             */
            since?: browser.extensionTypes.Date | undefined;
        }

        /**
         * Clears various types of browsing data stored in a user's profile.
         *
         * @param dataToRemove The set of data types to remove.
         * @param callback Called when deletion has completed.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browsing_data.json
         * @platform desktop, mobile
         */
        export function remove(options: RemovalOptions, dataToRemove: DataTypeSet): globalThis.Promise<void>;
        export function remove(options: RemovalOptions, dataToRemove: DataTypeSet, callback: (() => void)): void;

        /**
         * Clears websites' appcache data.
         *
         * @param callback Called when websites' appcache data has been cleared.
         * @deprecated Firefox does not support this function; it does not exist at runtime.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browsing_data.json
         */
        export function removeAppcache(options: RemovalOptions): globalThis.Promise<void>;
        export function removeAppcache(options: RemovalOptions, callback: (() => void)): void;

        /**
         * Clears the browser's cache.
         *
         * @param callback Called when the browser's cache has been cleared.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browsing_data.json
         * @platform desktop, mobile
         */
        export function removeCache(options: RemovalOptions): globalThis.Promise<void>;
        export function removeCache(options: RemovalOptions, callback: (() => void)): void;

        /**
         * Clears the browser's cookies and server-bound certificates modified within a particular timeframe.
         *
         * @param callback Called when the browser's cookies and server-bound certificates have been cleared.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browsing_data.json
         * @platform desktop, mobile
         */
        export function removeCookies(options: RemovalOptions): globalThis.Promise<void>;
        export function removeCookies(options: RemovalOptions, callback: (() => void)): void;

        /**
         * Clears the browser's list of downloaded files (_not_ the downloaded files themselves).
         *
         * @param callback Called when the browser's list of downloaded files has been cleared.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browsing_data.json
         * @platform desktop, mobile
         */
        export function removeDownloads(options: RemovalOptions): globalThis.Promise<void>;
        export function removeDownloads(options: RemovalOptions, callback: (() => void)): void;

        /**
         * Clears websites' file system data.
         *
         * @param callback Called when websites' file systems have been cleared.
         * @deprecated Firefox does not support this function; it does not exist at runtime.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browsing_data.json
         */
        export function removeFileSystems(options: RemovalOptions): globalThis.Promise<void>;
        export function removeFileSystems(options: RemovalOptions, callback: (() => void)): void;

        /**
         * Clears the browser's stored form data (autofill).
         *
         * @param callback Called when the browser's form data has been cleared.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browsing_data.json
         * @platform desktop, mobile
         */
        export function removeFormData(options: RemovalOptions): globalThis.Promise<void>;
        export function removeFormData(options: RemovalOptions, callback: (() => void)): void;

        /**
         * Clears the browser's history.
         *
         * @param callback Called when the browser's history has cleared.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browsing_data.json
         * @platform desktop, mobile
         */
        export function removeHistory(options: RemovalOptions): globalThis.Promise<void>;
        export function removeHistory(options: RemovalOptions, callback: (() => void)): void;

        /**
         * Clears websites' IndexedDB data.
         *
         * @param callback Called when websites' IndexedDB data has been cleared.
         * @deprecated Firefox does not support this function; it does not exist at runtime.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browsing_data.json
         */
        export function removeIndexedDB(options: RemovalOptions): globalThis.Promise<void>;
        export function removeIndexedDB(options: RemovalOptions, callback: (() => void)): void;

        /**
         * Clears websites' local storage data.
         *
         * @param callback Called when websites' local storage has been cleared.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browsing_data.json
         * @platform desktop, mobile
         */
        export function removeLocalStorage(options: RemovalOptions): globalThis.Promise<void>;
        export function removeLocalStorage(options: RemovalOptions, callback: (() => void)): void;

        /**
         * Clears the browser's stored passwords.
         *
         * @param callback Called when the browser's passwords have been cleared.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browsing_data.json
         * @platform desktop, mobile
         */
        export function removePasswords(options: RemovalOptions): globalThis.Promise<void>;
        export function removePasswords(options: RemovalOptions, callback: (() => void)): void;

        /**
         * Clears plugins' data.
         *
         * @param callback Called when plugins' data has been cleared.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browsing_data.json
         * @platform desktop, mobile
         */
        export function removePluginData(options: RemovalOptions): globalThis.Promise<void>;
        export function removePluginData(options: RemovalOptions, callback: (() => void)): void;

        /**
         * Clears websites' WebSQL data.
         *
         * @param callback Called when websites' WebSQL databases have been cleared.
         * @deprecated Firefox does not support this function; it does not exist at runtime.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browsing_data.json
         */
        export function removeWebSQL(options: RemovalOptions): globalThis.Promise<void>;
        export function removeWebSQL(options: RemovalOptions, callback: (() => void)): void;

        /**
         * Reports which types of data are currently selected in the 'Clear browsing data' settings UI.  Note: some of the data types included in this API are not available in the settings UI, and some UI settings control more than one data type listed here.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browsing_data.json
         * @platform desktop, mobile
         */
        export function settings(): globalThis.Promise<settings.Result>;
        export function settings(callback: ((result: settings.Result) => void)): void;
        export namespace settings {
            export type Result = {
                /**
                 * All of the types will be present in the result, with values of `true` if they are permitted to be removed (e.g., by enterprise policy) and `false` if not.
                 */
                dataRemovalPermitted: DataTypeSet;
                /**
                 * All of the types will be present in the result, with values of `true` if they are both selected to be removed and permitted to be removed, otherwise `false`.
                 */
                dataToRemove: DataTypeSet;
                options: RemovalOptions;
            };
        }

    }

    /**
     * This API provides the ability detect the captive portal state of the users connection.
     *
     * Not available in content scripts or devtools pages.
     *
     * @permission captivePortal
     * @platform desktop
     */
    export namespace captivePortal {
        /**
         * Return the canonical captive-portal detection URL. Read-only.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/captive_portal.json
         * @platform desktop
         */
        export const canonicalURL: browser.types.Setting;

        /**
         * This notification will be emitted when the captive portal service has determined that we can connect to the internet. The service will pass either `captive` if there is an unlocked captive portal present, or `clear` if no captive portal was detected.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/captive_portal.json
         * @platform desktop
         */
        export const onConnectivityAvailable: WebExtensionEvent<(status: "captive" | "clear") => void>;

        /**
         * Fired when the captive portal state changes.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/captive_portal.json
         * @platform desktop
         */
        export const onStateChanged: WebExtensionEvent<(details: onStateChanged.Details) => void>;
        export namespace onStateChanged {
            export type Details = {
                /**
                 * The current captive portal state.
                 */
                state: "unknown" | "not_captive" | "unlocked_portal" | "locked_portal";
            };
        }

        /**
         * Returns the time difference between NOW and the last time a request was completed in milliseconds.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/captive_portal.json
         * @platform desktop
         */
        export function getLastChecked(): globalThis.Promise<number>;

        /**
         * Returns the current portal state, one of `unknown`, `not_captive`, `unlocked_portal`, `locked_portal`.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/captive_portal.json
         * @platform desktop
         */
        export function getState(): globalThis.Promise<"unknown" | "not_captive" | "unlocked_portal" | "locked_portal">;

    }

    /**
     * Offers the ability to write to the clipboard. Reading is not supported because the clipboard can already be read through the standard web platform APIs.
     *
     * Not available in content scripts or devtools pages.
     *
     * @permission clipboardWrite
     * @platform desktop, mobile
     */
    export namespace clipboard {
        /**
         * Copy an image to the clipboard. The image is re-encoded before it is written to the clipboard. If the image is invalid, the clipboard is not modified.
         *
         * @param imageData The image data to be copied.
         * @param imageType The type of imageData.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/clipboard.json
         * @platform desktop, mobile
         */
        export function setImageData(imageData: ArrayBuffer, imageType: "jpeg" | "png"): globalThis.Promise<void>;

    }

    /**
     * Use the commands API to add keyboard shortcuts that trigger actions in your extension, for example, an action to open the browser action or send a command to the xtension.
     *
     * Not available in content scripts or devtools pages.
     *
     * @permission manifest:commands
     * @platform desktop
     */
    export namespace commands {
        /**
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/commands.json
         * @platform desktop
         */
        export interface Command {
            /**
             * The Extension Command description
             */
            description?: string | undefined;
            /**
             * The name of the Extension Command
             */
            name?: string | undefined;
            /**
             * The shortcut active for this command, or blank if not active.
             */
            shortcut?: string | undefined;
        }

        /**
         * Fired when a registered command's shortcut is changed.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/commands.json
         * @platform desktop
         */
        export const onChanged: WebExtensionEvent<(changeInfo: onChanged.ChangeInfo) => void>;
        export namespace onChanged {
            export type ChangeInfo = {
                /**
                 * The name of the shortcut.
                 */
                name: string;
                /**
                 * The new shortcut active for this command, or blank if not active.
                 */
                newShortcut: string;
                /**
                 * The old shortcut which is no longer active for this command, or blank if the shortcut was previously inactive.
                 */
                oldShortcut: string;
            };
        }

        /**
         * Fired when a registered command is activated using a keyboard shortcut.
         *
         * @param tab Details of the {@link browser.tabs.Tab} where the command was activated.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/commands.json
         * @platform desktop
         */
        export const onCommand: WebExtensionEvent<(command: string, tab?: browser.tabs.Tab) => void>;

        /**
         * Returns all the registered extension commands for this extension and their shortcut (if active).
         *
         * @param callback Called to return the registered commands.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/commands.json
         * @platform desktop
         */
        export function getAll(): globalThis.Promise<Command[]>;
        export function getAll(callback: ((commands: Command[]) => void)): void;

        /**
         * Open extension shortcuts configuration page.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/commands.json
         * @platform desktop
         */
        export function openShortcutSettings(): globalThis.Promise<void>;

        /**
         * Reset a command's details to what is specified in the manifest.
         *
         * @param name The name of the command.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/commands.json
         * @platform desktop
         */
        export function reset(name: string): globalThis.Promise<void>;

        /**
         * Update the details of an already defined command.
         *
         * @param detail The new description for the command.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/commands.json
         * @platform desktop
         */
        export function update(detail: update.Detail): globalThis.Promise<void>;
        export namespace update {
            /**
             * The new description for the command.
             */
            export type Detail = {
                /**
                 * The new description for the command.
                 */
                description?: string | undefined;
                /**
                 * The name of the command.
                 */
                name: string;
                shortcut?: string | undefined;
            };
        }

    }

    /**
     * Only available in manifest_version 2 or earlier.
     * Not available in content scripts or devtools pages.
     *
     * @platform desktop, mobile
     */
    export namespace contentScripts {
        /**
         * An object that represents a content script registered programmatically
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/content_scripts.json
         * @platform desktop, mobile
         */
        export interface RegisteredContentScript {
            /**
             * Unregister a content script registered programmatically
             *
             * @platform desktop, mobile
             */
            unregister(): globalThis.Promise<void>;
        }

        /**
         * Details of a content script registered programmatically
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/content_scripts.json
         * @platform desktop, mobile
         */
        export interface RegisteredContentScriptOptions {
            /**
             * If allFrames is `true`, implies that the JavaScript or CSS should be injected into all frames of current page. By default, it's `false` and is only injected into the top frame.
             */
            allFrames?: boolean | undefined;
            /**
             * limit the set of matched tabs to those that belong to the given cookie store id
             */
            cookieStoreId?: string[] | string | undefined;
            /**
             * The list of CSS files to inject
             */
            css?: browser.extensionTypes.ExtensionFileOrCode[] | undefined;
            /**
             * The css origin of the stylesheet to inject. Defaults to "author".
             */
            cssOrigin?: browser.extensionTypes.CSSOrigin | undefined;
            excludeGlobs?: string[] | undefined;
            excludeMatches?: browser.manifest.MatchPattern[] | undefined;
            includeGlobs?: string[] | undefined;
            /**
             * The list of JS files to inject
             */
            js?: browser.extensionTypes.ExtensionFileOrCode[] | undefined;
            /**
             * If matchAboutBlank is true, then the code is also injected in about:blank and about:srcdoc frames if your extension has access to its parent document. Ignored if matchOriginAsFallback is specified. By default it is `false`.
             */
            matchAboutBlank?: boolean | undefined;
            /**
             * If matchOriginAsFallback is true, then the code is also injected in about:, data:, blob: when their origin matches the pattern in 'matches', even if the actual document origin is opaque (due to the use of CSP sandbox or iframe sandbox). Match patterns in 'matches' must specify a wildcard path glob. By default it is `false`.
             */
            matchOriginAsFallback?: boolean | undefined;
            matches: browser.manifest.MatchPattern[];
            /**
             * The soonest that the JavaScript or CSS will be injected into the tab. Defaults to "document_idle".
             */
            runAt?: browser.extensionTypes.RunAt | undefined;
            /**
             * The JavaScript world for a script to execute within. Defaults to "ISOLATED".
             */
            world?: browser.extensionTypes.ExecutionWorld | undefined;
        }

        /**
         * Register a content script programmatically
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/content_scripts.json
         * @platform desktop, mobile
         */
        export function register(contentScriptOptions: RegisteredContentScriptOptions): globalThis.Promise<RegisteredContentScript>;

    }

    /**
     * Use the browser.contextMenus API to add items to the browser's context menu. You can choose what types of objects your context menu additions apply to, such as images, hyperlinks, and pages.
     *
     * Not available in content scripts or devtools pages.
     *
     * @permission contextMenus
     * @platform desktop
     */
    export namespace contextMenus {
        /**
         * The different contexts a menu can appear in. Specifying 'all' is equivalent to the combination of all other contexts except for 'tab' and 'tools_menu'.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         * @platform desktop
         */
        export type ContextType = "all" | "page" | "frame" | "selection" | "link" | "editable" | "password" | "image" | "video" | "audio" | "launcher" | "bookmark" | "page_action" | "tab" | "tools_menu" | "browser_action" | "action";

        /**
         * The type of menu item.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         * @platform desktop
         */
        export type ItemType = "normal" | "checkbox" | "radio" | "separator";

        /**
         * Information sent when a context menu item is clicked.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         * @platform desktop
         */
        export interface OnClickData {
            /**
             * The id of the bookmark where the context menu was clicked, if it was on a bookmark.
             */
            bookmarkId?: string | undefined;
            /**
             * An integer value of button by which menu item was clicked.
             */
            button?: number | undefined;
            /**
             * A flag indicating the state of a checkbox or radio item after it is clicked.
             */
            checked?: boolean | undefined;
            /**
             * A flag indicating whether the element is editable (text input, textarea, etc.).
             */
            editable: boolean;
            /**
             * The id of the frame of the element where the context menu was clicked.
             */
            frameId?: number | undefined;
            /**
             * The URL of the frame of the element where the context menu was clicked, if it was in a frame.
             */
            frameUrl?: string | undefined;
            /**
             * If the element is a link, the text of that link.
             */
            linkText?: string | undefined;
            /**
             * If the element is a link, the URL it points to.
             */
            linkUrl?: string | undefined;
            /**
             * One of 'image', 'video', or 'audio' if the context menu was activated on one of these types of elements.
             */
            mediaType?: string | undefined;
            /**
             * The ID of the menu item that was clicked.
             */
            menuItemId: number | string;
            /**
             * An array of keyboard modifiers that were held while the menu item was clicked.
             */
            modifiers: ("Shift" | "Alt" | "Command" | "Ctrl" | "MacCtrl")[];
            /**
             * The URL of the page where the menu item was clicked. This property is not set if the click occured in a context where there is no current page, such as in a launcher context menu.
             */
            pageUrl?: string | undefined;
            /**
             * The parent ID, if any, for the item clicked.
             */
            parentMenuItemId?: number | string | undefined;
            /**
             * The text for the context selection, if any.
             */
            selectionText?: string | undefined;
            /**
             * Will be present for elements with a 'src' URL.
             */
            srcUrl?: string | undefined;
            /**
             * An identifier of the clicked element, if any. Use menus.getTargetElement in the page to find the corresponding element.
             */
            targetElementId?: number | undefined;
            /**
             * The type of view where the menu is clicked. May be unset if the menu is not associated with a view.
             */
            viewType?: browser.extension.ViewType | undefined;
            /**
             * A flag indicating the state of a checkbox or radio item before it was clicked.
             */
            wasChecked?: boolean | undefined;
        }

        /**
         * The maximum number of top level extension items that can be added to an extension action context menu. Any items beyond this limit will be ignored.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         * @platform desktop
         */
        export const ACTION_MENU_TOP_LEVEL_LIMIT: number;

        /**
         * Fired when a context menu item is clicked.
         *
         * @param info Information about the item clicked and the context where the click happened.
         * @param tab The details of the tab where the click took place. If the click did not take place in a tab, this parameter will be missing.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         * @platform desktop
         */
        export const onClicked: WebExtensionEvent<(info: OnClickData, tab?: browser.tabs.Tab) => void>;

        /**
         * Fired when a menu is hidden. This event is only fired if onShown has fired before.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         * @platform desktop
         */
        export const onHidden: WebExtensionEvent<() => void>;

        /**
         * Fired when a menu is shown. The extension can add, modify or remove menu items and call menus.refresh() to update the menu.
         *
         * @param info Information about the context of the menu action and the created menu items. For more information about each property, see OnClickData. The following properties are only set if the extension has host permissions for the given context: linkUrl, linkText, srcUrl, pageUrl, frameUrl, selectionText.
         * @param tab The details of the tab where the menu was opened.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         * @platform desktop
         */
        export const onShown: WebExtensionEvent<(info: onShown.Info, tab: browser.tabs.Tab) => void>;
        export namespace onShown {
            /**
             * Information about the context of the menu action and the created menu items. For more information about each property, see OnClickData. The following properties are only set if the extension has host permissions for the given context: linkUrl, linkText, srcUrl, pageUrl, frameUrl, selectionText.
             */
            export type Info = {
                /**
                 * A list of all contexts that apply to the menu.
                 */
                contexts: ContextType[];
                editable: boolean;
                frameUrl?: string | undefined;
                linkText?: string | undefined;
                linkUrl?: string | undefined;
                mediaType?: string | undefined;
                /**
                 * A list of IDs of the menu items that were shown.
                 */
                menuIds: (number | string)[];
                pageUrl?: string | undefined;
                selectionText?: string | undefined;
                srcUrl?: string | undefined;
                targetElementId?: number | undefined;
                viewType?: browser.extension.ViewType | undefined;
            };
        }

        /**
         * Creates a new context menu item. Note that if an error occurs during creation, you may not find out until the creation callback fires (the details will be in {@link browser.runtime.lastError}).
         *
         * @param callback Called when the item has been created in the browser. If there were any problems creating the item, details will be available in {@link browser.runtime.lastError}.
         * @returns The ID of the newly created item.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         * @platform desktop
         */
        export function create(createProperties: create.CreateProperties, callback?: (() => void) | null): number | string;
        export namespace create {
            export type CreateProperties = {
                /**
                 * The initial state of a checkbox or radio item: true for selected and false for unselected. Only one radio item can be selected at a time in a given group of radio items.
                 */
                checked?: boolean | undefined;
                /**
                 * Specifies a command to issue for the context click.
                 */
                command?: (string & {}) | "_execute_browser_action" | "_execute_page_action" | "_execute_sidebar_action" | "_execute_action" | "_execute_page_action" | "_execute_sidebar_action" | undefined;
                /**
                 * List of contexts this menu item will appear in. Defaults to ['page'] if not specified.
                 */
                contexts?: ContextType[] | undefined;
                /**
                 * Lets you restrict the item to apply only to documents whose URL matches one of the given patterns. (This applies to frames as well.) For details on the format of a pattern, see Match Patterns.
                 */
                documentUrlPatterns?: string[] | undefined;
                /**
                 * Whether this context menu item is enabled or disabled. Defaults to true.
                 */
                enabled?: boolean | undefined;
                icons?: { [key: number]: string } | undefined;
                /**
                 * The unique ID to assign to this item. Mandatory for event pages. Cannot be the same as another ID for this extension.
                 */
                id?: string | undefined;
                /**
                 * A function that will be called back when the menu item is clicked. Event pages cannot use this; instead, they should register a listener for {@link browser.contextMenus.onClicked}.
                 *
                 * Only available in manifest_version 2 or earlier.
                 */
                onclick?: ((info: OnClickData, tab: browser.tabs.Tab) => void) | undefined;
                /**
                 * The ID of a parent menu item; this makes the item a child of a previously added item.
                 */
                parentId?: number | string | undefined;
                /**
                 * Similar to documentUrlPatterns, but lets you filter based on the src attribute of img/audio/video tags and the href of anchor tags.
                 */
                targetUrlPatterns?: string[] | undefined;
                /**
                 * The text to be displayed in the item; this is _required_ unless `type` is 'separator'. When the context is 'selection', you can use `%s` within the string to show the selected text. For example, if this parameter's value is "Translate '%s' to Pig Latin" and the user selects the word "cool", the context menu item for the selection is "Translate 'cool' to Pig Latin".
                 */
                title?: string | undefined;
                /**
                 * The type of menu item. Defaults to 'normal' if not specified.
                 */
                type?: ItemType | undefined;
                /**
                 * List of view types where the menu item will be shown. Defaults to any view, including those without a viewType.
                 */
                viewTypes?: browser.extension.ViewType[] | undefined;
                /**
                 * Whether the item is visible in the menu.
                 */
                visible?: boolean | undefined;
            };
        }

        /**
         * Retrieve the element that was associated with a recent contextmenu event.
         *
         * @param targetElementId The identifier of the clicked element, available as info.targetElementId in the menus.onShown, onClicked or onclick event.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus_child.json
         * @platform desktop
         */
        export function getTargetElement(targetElementId: number): Element | null;

        /**
         * Show the matching menu items from this extension instead of the default menu. This should be called during a 'contextmenu' DOM event handler, and only applies to the menu that opens after this event.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         * @permission menus.overrideContext
         * @platform desktop
         */
        export function overrideContext(contextOptions: overrideContext.ContextOptions): void;
        export namespace overrideContext {
            export type ContextOptions = {
                /**
                 * Required when context is 'bookmark'. Requires 'bookmark' permission.
                 */
                bookmarkId?: string | undefined;
                /**
                 * ContextType to override, to allow menu items from other extensions in the menu. Currently only 'bookmark' and 'tab' are supported. showDefaults cannot be used with this option.
                 */
                context?: "bookmark" | "tab" | undefined;
                /**
                 * Whether to also include default menu items in the menu.
                 */
                showDefaults?: boolean | undefined;
                /**
                 * Required when context is 'tab'. Requires 'tabs' permission.
                 */
                tabId?: number | undefined;
            };
        }

        /**
         * Updates the extension items in the shown menu, including changes that have been made since the menu was shown. Has no effect if the menu is hidden. Rebuilding a shown menu is an expensive operation, only invoke this method when necessary.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         * @platform desktop
         */
        export function refresh(): globalThis.Promise<void>;

        /**
         * Removes a context menu item.
         *
         * @param menuItemId The ID of the context menu item to remove.
         * @param callback Called when the context menu has been removed.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         * @platform desktop
         */
        export function remove(menuItemId: number | string): globalThis.Promise<void>;
        export function remove(menuItemId: number | string, callback: (() => void)): void;

        /**
         * Removes all context menu items added by this extension.
         *
         * @param callback Called when removal is complete.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         * @platform desktop
         */
        export function removeAll(): globalThis.Promise<void>;
        export function removeAll(callback: (() => void)): void;

        /**
         * Updates a previously created context menu item.
         *
         * @param id The ID of the item to update.
         * @param updateProperties The properties to update. Accepts the same values as the create function.
         * @param callback Called when the context menu has been updated.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         * @platform desktop
         */
        export function update(id: number | string, updateProperties: update.UpdateProperties): globalThis.Promise<void>;
        export function update(id: number | string, updateProperties: update.UpdateProperties, callback: (() => void)): void;
        export namespace update {
            /**
             * The properties to update. Accepts the same values as the create function.
             */
            export type UpdateProperties = {
                checked?: boolean | undefined;
                contexts?: ContextType[] | undefined;
                documentUrlPatterns?: string[] | undefined;
                enabled?: boolean | undefined;
                icons?: { [key: number]: string } | undefined;
                /**
                 * Only available in manifest_version 2 or earlier.
                 */
                onclick?: ((info: OnClickData, tab: browser.tabs.Tab) => void) | undefined;
                /**
                 * Note: You cannot change an item to be a child of one of its own descendants.
                 */
                parentId?: number | string | undefined;
                targetUrlPatterns?: string[] | undefined;
                title?: string | undefined;
                type?: ItemType | undefined;
                viewTypes?: browser.extension.ViewType[] | undefined;
                /**
                 * Whether the item is visible in the menu.
                 */
                visible?: boolean | undefined;
            };
        }

    }

    /**
     * Use the `browser.contextualIdentities` API to query and modify contextual identity, also called as containers.
     *
     * Not available in content scripts or devtools pages.
     *
     * @permission contextualIdentities
     * @platform desktop
     */
    export namespace contextualIdentities {
        /**
         * Represents information about a contextual identity.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/contextual_identities.json
         * @platform desktop
         */
        export interface ContextualIdentity {
            /**
             * The color name of the contextual identity.
             */
            color: string;
            /**
             * The color hash of the contextual identity.
             */
            colorCode: string;
            /**
             * The cookie store ID of the contextual identity.
             */
            cookieStoreId: string;
            /**
             * The icon name of the contextual identity.
             */
            icon: string;
            /**
             * The icon url of the contextual identity.
             */
            iconUrl: string;
            /**
             * The name of the contextual identity.
             */
            name: string;
        }

        /**
         * Represents the association between a site and a contextual identity.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/contextual_identities.json
         * @platform desktop
         */
        export interface SiteAssociation {
            /**
             * The cookie store ID of the contextual identity the host is associated with.
             */
            cookieStoreId: string;
            /**
             * The associated host, normalized to lower case and encoded as ASCII.
             */
            site: string;
        }

        /**
         * Fired when a new container is created.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/contextual_identities.json
         * @platform desktop
         */
        export const onCreated: WebExtensionEvent<(changeInfo: onCreated.ChangeInfo) => void>;
        export namespace onCreated {
            export type ChangeInfo = {
                /**
                 * Contextual identity that has been created
                 */
                contextualIdentity: ContextualIdentity;
            };
        }

        /**
         * Fired when a container is removed.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/contextual_identities.json
         * @platform desktop
         */
        export const onRemoved: WebExtensionEvent<(changeInfo: onRemoved.ChangeInfo) => void>;
        export namespace onRemoved {
            export type ChangeInfo = {
                /**
                 * Contextual identity that has been removed
                 */
                contextualIdentity: ContextualIdentity;
            };
        }

        /**
         * Fired when a site-to-container association is added, changed, or removed.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/contextual_identities.json
         * @platform desktop
         */
        export const onSiteAssociationChanged: WebExtensionEvent<(changeInfo: onSiteAssociationChanged.ChangeInfo) => void>;
        export namespace onSiteAssociationChanged {
            export type ChangeInfo = {
                /**
                 * The cookie store ID of the now-associated container, or omitted if the association was removed.
                 */
                cookieStoreId?: string | undefined;
                /**
                 * The host whose association changed.
                 */
                site: string;
            };
        }

        /**
         * Fired when a container is updated.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/contextual_identities.json
         * @platform desktop
         */
        export const onUpdated: WebExtensionEvent<(changeInfo: onUpdated.ChangeInfo) => void>;
        export namespace onUpdated {
            export type ChangeInfo = {
                /**
                 * Contextual identity that has been updated
                 */
                contextualIdentity: ContextualIdentity;
            };
        }

        /**
         * Creates a contextual identity with the given data.
         *
         * @param details Details about the contextual identity being created.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/contextual_identities.json
         * @platform desktop
         */
        export function create(details: create.Details): globalThis.Promise<ContextualIdentity>;
        export namespace create {
            /**
             * Details about the contextual identity being created.
             */
            export type Details = {
                /**
                 * The color of the contextual identity.
                 */
                color: string;
                /**
                 * The icon of the contextual identity.
                 */
                icon: string;
                /**
                 * The name of the contextual identity.
                 */
                name: string;
            };
        }

        /**
         * Retrieves information about a single contextual identity.
         *
         * @param cookieStoreId The ID of the contextual identity cookie store.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/contextual_identities.json
         * @platform desktop
         */
        export function get(cookieStoreId: string): globalThis.Promise<ContextualIdentity>;

        /**
         * Retrieves the association of a site, or null if the site is not associated with any container.
         *
         * @param details Details about the site to look up.
         * @returns The association of the site, null if the site is not associated with any container.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/contextual_identities.json
         * @platform desktop
         */
        export function getSiteAssociation(details: getSiteAssociation.Details): globalThis.Promise<SiteAssociation | null>;
        export function getSiteAssociation(details: getSiteAssociation.Details, callback: ((association: SiteAssociation | undefined) => void)): void;
        export namespace getSiteAssociation {
            /**
             * Details about the site to look up.
             */
            export type Details = {
                /**
                 * The host to look up.
                 */
                site: string;
            };
        }

        /**
         * Retrieves the list of colors supported by contextual identities.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/contextual_identities.json
         * @platform desktop
         */
        export function getSupportedColors(): globalThis.Promise<{
    /**
     * The color name, as accepted by the color property of create and update.
     */
    color: string;
    /**
     * The color hash for this color name.
     */
    colorCode: string;
}[]>;
        export function getSupportedColors(callback: ((colors: {
            /**
             * The color name, as accepted by the color property of create and update.
             */
            color: string;
            /**
             * The color hash for this color name.
             */
            colorCode: string;
        }[]) => void)): void;

        /**
         * Retrieves the list of icons supported by contextual identities.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/contextual_identities.json
         * @platform desktop
         */
        export function getSupportedIcons(): globalThis.Promise<{
    /**
     * The icon name, as accepted by the icon property of create and update.
     */
    icon: string;
    /**
     * The icon url for this icon name.
     */
    iconUrl: string;
}[]>;
        export function getSupportedIcons(callback: ((icons: {
            /**
             * The icon name, as accepted by the icon property of create and update.
             */
            icon: string;
            /**
             * The icon url for this icon name.
             */
            iconUrl: string;
        }[]) => void)): void;

        /**
         * Reorder one or more contextual identities by their cookieStoreIDs to a given position.
         *
         * @param cookieStoreIds The ID or list of IDs of the contextual identity cookie stores.
         * @param position The position the contextual identity should move to.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/contextual_identities.json
         * @platform desktop
         */
        export function move(cookieStoreIds: string | string[], position: number): globalThis.Promise<void>;

        /**
         * Retrieves all contextual identities
         *
         * @param details Information to filter the contextual identities being retrieved.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/contextual_identities.json
         * @platform desktop
         */
        export function query(details: query.Details): globalThis.Promise<ContextualIdentity[]>;
        export namespace query {
            /**
             * Information to filter the contextual identities being retrieved.
             */
            export type Details = {
                /**
                 * Filters the contextual identity by name.
                 */
                name?: string | undefined;
            };
        }

        /**
         * Retrieves the list of site-to-container associations.
         *
         * @param details Information to filter the associations being retrieved.
         * @returns The site-to-container associations.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/contextual_identities.json
         * @platform desktop
         */
        export function querySiteAssociations(details: querySiteAssociations.Details): globalThis.Promise<SiteAssociation[]>;
        export function querySiteAssociations(details: querySiteAssociations.Details, callback: ((associations: SiteAssociation[]) => void)): void;
        export namespace querySiteAssociations {
            /**
             * Information to filter the associations being retrieved.
             */
            export type Details = {
                /**
                 * If provided, only associations for this container are returned.
                 */
                cookieStoreId?: string | undefined;
            };
        }

        /**
         * Deletes a contextual identity by its cookie Store ID.
         *
         * @param cookieStoreId The ID of the contextual identity cookie store.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/contextual_identities.json
         * @platform desktop
         */
        export function remove(cookieStoreId: string): globalThis.Promise<ContextualIdentity>;

        /**
         * Removes the container association for a site.
         *
         * @param details Details about the site association to remove.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/contextual_identities.json
         * @platform desktop
         */
        export function removeSiteAssociation(details: removeSiteAssociation.Details): globalThis.Promise<void>;
        export namespace removeSiteAssociation {
            /**
             * Details about the site association to remove.
             */
            export type Details = {
                /**
                 * The host whose container association should be removed.
                 */
                site: string;
            };
        }

        /**
         * Associates a site with a container. Top-level navigations to that site will load in the given container.
         *
         * @param details Details about the site association.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/contextual_identities.json
         * @platform desktop
         */
        export function setSiteAssociation(details: setSiteAssociation.Details): globalThis.Promise<void>;
        export namespace setSiteAssociation {
            /**
             * Details about the site association.
             */
            export type Details = {
                /**
                 * The cookie store ID of the container to associate the site with.
                 */
                cookieStoreId: string;
                /**
                 * The host to associate with the container (matched as an exact host).
                 */
                site: string;
            };
        }

        /**
         * Updates a contextual identity with the given data.
         *
         * @param cookieStoreId The ID of the contextual identity cookie store.
         * @param details Details about the contextual identity being created.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/contextual_identities.json
         * @platform desktop
         */
        export function update(cookieStoreId: string, details: update.Details): globalThis.Promise<ContextualIdentity>;
        export namespace update {
            /**
             * Details about the contextual identity being created.
             */
            export type Details = {
                /**
                 * The color of the contextual identity.
                 */
                color?: string | undefined;
                /**
                 * The icon of the contextual identity.
                 */
                icon?: string | undefined;
                /**
                 * The name of the contextual identity.
                 */
                name?: string | undefined;
            };
        }

    }

    /**
     * Use the `browser.cookies` API to query and modify cookies, and to be notified when they change.
     *
     * Not available in content scripts or devtools pages.
     *
     * @permission cookies
     * @platform desktop, mobile
     */
    export namespace cookies {
        /**
         * Represents information about an HTTP cookie.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/cookies.json
         * @platform desktop, mobile
         */
        export interface Cookie {
            /**
             * The domain of the cookie (e.g. "www.google.com", "example.com").
             */
            domain: string;
            /**
             * The expiration date of the cookie as the number of seconds since the UNIX epoch. Not provided for session cookies.
             */
            expirationDate?: number | undefined;
            /**
             * The first-party domain of the cookie.
             */
            firstPartyDomain: string;
            /**
             * True if the cookie is a host-only cookie (i.e. a request's host must exactly match the domain of the cookie).
             */
            hostOnly: boolean;
            /**
             * True if the cookie is marked as HttpOnly (i.e. the cookie is inaccessible to client-side scripts).
             */
            httpOnly: boolean;
            /**
             * The name of the cookie.
             */
            name: string;
            /**
             * The cookie's storage partition, if any. null if not partitioned.
             */
            partitionKey?: PartitionKey | undefined;
            /**
             * The path of the cookie.
             */
            path: string;
            /**
             * The cookie's same-site status (i.e. whether the cookie is sent with cross-site requests).
             */
            sameSite: SameSiteStatus;
            /**
             * True if the cookie is marked as Secure (i.e. its scope is limited to secure channels, typically HTTPS).
             */
            secure: boolean;
            /**
             * True if the cookie is a session cookie, as opposed to a persistent cookie with an expiration date.
             */
            session: boolean;
            /**
             * The ID of the cookie store containing this cookie, as provided in getAllCookieStores().
             */
            storeId: string;
            /**
             * The value of the cookie.
             */
            value: string;
        }

        /**
         * Represents a cookie store in the browser. An incognito mode window, for instance, uses a separate cookie store from a non-incognito window.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/cookies.json
         * @platform desktop, mobile
         */
        export interface CookieStore {
            /**
             * The unique identifier for the cookie store.
             */
            id: string;
            /**
             * Indicates if this is an incognito cookie store
             */
            incognito: boolean;
            /**
             * Identifiers of all the browser tabs that share this cookie store.
             */
            tabIds: number[];
        }

        /**
         * The underlying reason behind the cookie's change. If a cookie was inserted, or removed via an explicit call to {@link browser.cookies.remove}, "cause" will be "explicit". If a cookie was automatically removed due to expiry, "cause" will be "expired". If a cookie was removed due to being overwritten with an already-expired expiration date, "cause" will be set to "expired_overwrite".  If a cookie was automatically removed due to garbage collection, "cause" will be "evicted".  If a cookie was automatically removed due to a "set" call that overwrote it, "cause" will be "overwrite". Plan your response accordingly.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/cookies.json
         * @platform desktop, mobile
         */
        export type OnChangedCause = "evicted" | "expired" | "explicit" | "expired_overwrite" | "overwrite";

        /**
         * The description of the storage partition of a cookie. This object may be omitted (null) if a cookie is not partitioned.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/cookies.json
         * @platform desktop, mobile
         */
        export interface PartitionKey {
            /**
             * Whether or not the cookie is in a third-party context, respecting ancestor chains.
             */
            hasCrossSiteAncestor?: boolean | undefined;
            /**
             * The first-party URL of the cookie, if the cookie is in storage partitioned by the top-level site.
             */
            topLevelSite?: string | undefined;
        }

        /**
         * A cookie's 'SameSite' state (https://tools.ietf.org/html/draft-west-first-party-cookies). 'no_restriction' corresponds to a cookie set without a 'SameSite' attribute, 'lax' to 'SameSite=Lax', and 'strict' to 'SameSite=Strict'.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/cookies.json
         * @platform desktop, mobile
         */
        export type SameSiteStatus = "unspecified" | "no_restriction" | "lax" | "strict";

        /**
         * Fired when a cookie is set or removed. As a special case, note that updating a cookie's properties is implemented as a two step process: the cookie to be updated is first removed entirely, generating a notification with "cause" of "overwrite" .  Afterwards, a new cookie is written with the updated values, generating a second notification with "cause" "explicit".
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/cookies.json
         * @platform desktop, mobile
         */
        export const onChanged: WebExtensionEvent<(changeInfo: onChanged.ChangeInfo) => void>;
        export namespace onChanged {
            export type ChangeInfo = {
                /**
                 * The underlying reason behind the cookie's change.
                 */
                cause: OnChangedCause;
                /**
                 * Information about the cookie that was set or removed.
                 */
                cookie: Cookie;
                /**
                 * True if a cookie was removed.
                 */
                removed: boolean;
            };
        }

        /**
         * Retrieves information about a single cookie. If more than one cookie of the same name exists for the given URL, the one with the longest path will be returned. For cookies with the same path length, the cookie with the earliest creation time will be returned.
         *
         * @param details Details to identify the cookie being retrieved.
         * @returns Contains details about the cookie. This parameter is null if no such cookie was found.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/cookies.json
         * @platform desktop, mobile
         */
        export function get(details: get.Details): globalThis.Promise<Cookie | null>;
        export function get(details: get.Details, callback: ((cookie: Cookie | undefined) => void)): void;
        export namespace get {
            /**
             * Details to identify the cookie being retrieved.
             */
            export type Details = {
                /**
                 * The first-party domain which the cookie to retrieve is associated. This attribute is required if First-Party Isolation is enabled.
                 */
                firstPartyDomain?: string | undefined;
                /**
                 * The name of the cookie to retrieve.
                 */
                name: string;
                /**
                 * The storage partition, if the cookie is part of partitioned storage. By default, only non-partitioned cookies are returned.
                 */
                partitionKey?: PartitionKey | undefined;
                /**
                 * The ID of the cookie store in which to look for the cookie. By default, the current execution context's cookie store will be used.
                 */
                storeId?: string | undefined;
                /**
                 * The URL with which the cookie to retrieve is associated. This argument may be a full URL, in which case any data following the URL path (e.g. the query string) is simply ignored. If host permissions for this URL are not specified in the manifest file, the API call will fail.
                 */
                url: string;
            };
        }

        /**
         * Retrieves all cookies from a single cookie store that match the given information.  The cookies returned will be sorted, with those with the longest path first.  If multiple cookies have the same path length, those with the earliest creation time will be first.
         *
         * @param details Information to filter the cookies being retrieved.
         * @returns All the existing, unexpired cookies that match the given cookie info.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/cookies.json
         * @platform desktop, mobile
         */
        export function getAll(details: getAll.Details): globalThis.Promise<Cookie[]>;
        export function getAll(details: getAll.Details, callback: ((cookies: Cookie[]) => void)): void;
        export namespace getAll {
            /**
             * Information to filter the cookies being retrieved.
             */
            export type Details = {
                /**
                 * Restricts the retrieved cookies to those whose domains match or are subdomains of this one.
                 */
                domain?: string | undefined;
                /**
                 * Restricts the retrieved cookies to those whose first-party domains match this one. This attribute is required if First-Party Isolation is enabled. To not filter by a specific first-party domain, use `null` or `undefined`.
                 */
                firstPartyDomain?: string | undefined;
                /**
                 * Filters the cookies by name.
                 */
                name?: string | undefined;
                /**
                 * Selects a specific storage partition to look up cookies. Defaults to null, in which case only non-partitioned cookies are retrieved. If an object iis passed, partitioned cookies are also included, and filtered based on the keys present in the given PartitionKey description. An empty object ({}) returns all cookies (partitioned + unpartitioned), a non-empty object (e.g. {topLevelSite: '...'}) only returns cookies whose partition match all given attributes.
                 */
                partitionKey?: PartitionKey | undefined;
                /**
                 * Restricts the retrieved cookies to those whose path exactly matches this string.
                 */
                path?: string | undefined;
                /**
                 * Filters the cookies by their Secure property.
                 */
                secure?: boolean | undefined;
                /**
                 * Filters out session vs. persistent cookies.
                 */
                session?: boolean | undefined;
                /**
                 * The cookie store to retrieve cookies from. If omitted, the current execution context's cookie store will be used.
                 */
                storeId?: string | undefined;
                /**
                 * Restricts the retrieved cookies to those that would match the given URL.
                 */
                url?: string | undefined;
            };
        }

        /**
         * Lists all existing cookie stores.
         *
         * @returns All the existing cookie stores.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/cookies.json
         * @platform desktop, mobile
         */
        export function getAllCookieStores(): globalThis.Promise<CookieStore[]>;
        export function getAllCookieStores(callback: ((cookieStores: CookieStore[]) => void)): void;

        /**
         * Deletes a cookie by name.
         *
         * @param details Information to identify the cookie to remove.
         * @returns Contains details about the cookie that's been removed.  If removal failed for any reason, this will be "null", and {@link browser.runtime.lastError} will be set.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/cookies.json
         * @platform desktop, mobile
         */
        export function remove(details: remove.Details): globalThis.Promise<remove.Result | null>;
        export function remove(details: remove.Details, callback: ((details: remove.Result | undefined) => void)): void;
        export namespace remove {
            /**
             * Information to identify the cookie to remove.
             */
            export type Details = {
                /**
                 * The first-party domain associated with the cookie. This attribute is required if First-Party Isolation is enabled.
                 */
                firstPartyDomain?: string | undefined;
                /**
                 * The name of the cookie to remove.
                 */
                name: string;
                /**
                 * The storage partition, if the cookie is part of partitioned storage. By default, non-partitioned storage is used.
                 */
                partitionKey?: PartitionKey | undefined;
                /**
                 * The ID of the cookie store to look in for the cookie. If unspecified, the cookie is looked for by default in the current execution context's cookie store.
                 */
                storeId?: string | undefined;
                /**
                 * The URL associated with the cookie. If host permissions for this URL are not specified in the manifest file, the API call will fail.
                 */
                url: string;
            };
            /**
             * Contains details about the cookie that's been removed.  If removal failed for any reason, this will be "null", and {@link browser.runtime.lastError} will be set.
             */
            export type Result = {
                /**
                 * The first-party domain associated with the cookie that's been removed.
                 */
                firstPartyDomain: string;
                /**
                 * The name of the cookie that's been removed.
                 */
                name: string;
                /**
                 * The storage partition, if the cookie is part of partitioned storage. null if not partitioned.
                 */
                partitionKey?: PartitionKey | undefined;
                /**
                 * The ID of the cookie store from which the cookie was removed.
                 */
                storeId: string;
                /**
                 * The URL associated with the cookie that's been removed.
                 */
                url: string;
            };
        }

        /**
         * Sets a cookie with the given cookie data; may overwrite equivalent cookies if they exist.
         *
         * @param details Details about the cookie being set.
         * @returns Contains details about the cookie that's been set.  If setting failed for any reason, this will be "null", and {@link browser.runtime.lastError} will be set.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/cookies.json
         * @platform desktop, mobile
         */
        export function set(details: set.Details): globalThis.Promise<Cookie | null>;
        export function set(details: set.Details, callback: ((cookie: Cookie | undefined) => void)): void;
        export namespace set {
            /**
             * Details about the cookie being set.
             */
            export type Details = {
                /**
                 * The domain of the cookie. If omitted, the cookie becomes a host-only cookie.
                 */
                domain?: string | undefined;
                /**
                 * The expiration date of the cookie as the number of seconds since the UNIX epoch. If omitted, the cookie becomes a session cookie.
                 */
                expirationDate?: number | undefined;
                /**
                 * The first-party domain of the cookie. This attribute is required if First-Party Isolation is enabled.
                 */
                firstPartyDomain?: string | undefined;
                /**
                 * Whether the cookie should be marked as HttpOnly. Defaults to false.
                 */
                httpOnly?: boolean | undefined;
                /**
                 * The name of the cookie. Empty by default if omitted.
                 */
                name?: string | undefined;
                /**
                 * The storage partition, if the cookie is part of partitioned storage. By default, non-partitioned storage is used.
                 */
                partitionKey?: PartitionKey | undefined;
                /**
                 * The path of the cookie. Defaults to the path portion of the url parameter.
                 */
                path?: string | undefined;
                /**
                 * The cookie's same-site status.
                 */
                sameSite?: SameSiteStatus | undefined;
                /**
                 * Whether the cookie should be marked as Secure. Defaults to false.
                 */
                secure?: boolean | undefined;
                /**
                 * The ID of the cookie store in which to set the cookie. By default, the cookie is set in the current execution context's cookie store.
                 */
                storeId?: string | undefined;
                /**
                 * The request-URI to associate with the setting of the cookie. This value can affect the default domain and path values of the created cookie. If host permissions for this URL are not specified in the manifest file, the API call will fail.
                 */
                url: string;
                /**
                 * The value of the cookie. Empty by default if omitted.
                 */
                value?: string | undefined;
            };
        }

    }

    /**
     * Use the declarativeNetRequest API to block or modify network requests by specifying declarative rules.
     *
     * Not available in content scripts or devtools pages.
     *
     * @permission declarativeNetRequest or declarativeNetRequestWithHostAccess
     * @platform desktop, mobile
     */
    export namespace declarativeNetRequest {
        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         * @platform desktop, mobile
         */
        export interface GetRulesFilter {
            /**
             * If specified, only rules with matching IDs are included.
             */
            ruleIds?: number[] | undefined;
        }

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         * @platform desktop, mobile
         */
        export interface MatchedRule {
            /**
             * ID of the extension, if this rule belongs to a different extension.
             */
            extensionId?: string | undefined;
            /**
             * A matching rule's ID.
             */
            ruleId: number;
            /**
             * ID of the Ruleset this rule belongs to.
             */
            rulesetId: string;
        }

        /**
         * How the requested resource will be used. Comparable to the webRequest.ResourceType type. object_subrequest is unsupported.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         * @platform desktop, mobile
         */
        export type ResourceType = "main_frame" | "sub_frame" | "stylesheet" | "script" | "image" | "object" | "object_subrequest" | "xmlhttprequest" | "xslt" | "ping" | "beacon" | "xml_dtd" | "font" | "media" | "websocket" | "csp_report" | "imageset" | "web_manifest" | "speculative" | "json" | "other";

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         * @platform desktop, mobile
         */
        export interface Rule {
            /**
             * The action to take if this rule is matched.
             */
            action: {
                /**
                 * Describes how the redirect should be performed. Only valid when type is 'redirect'.
                 */
                redirect?: {
                    /**
                     * Path relative to the extension directory. Should start with '/'.
                     */
                    extensionPath?: string | undefined;
                    /**
                     * Substitution pattern for rules which specify a 'regexFilter'. The first match of regexFilter within the url will be replaced with this pattern. Within regexSubstitution, backslash-escaped digits (\1 to \9) can be used to insert the corresponding capture groups. \0 refers to the entire matching text.
                     */
                    regexSubstitution?: string | undefined;
                    /**
                     * Url transformations to perform.
                     */
                    transform?: URLTransform | undefined;
                    /**
                     * The redirect url. Redirects to JavaScript urls are not allowed.
                     */
                    url?: string | undefined;
                } | undefined;
                /**
                 * The request headers to modify for the request. Only valid when type is 'modifyHeaders'.
                 */
                requestHeaders?: ({
                    /**
                     * The name of the request header to be modified.
                     */
                    header: string;
                    /**
                     * The operation to be performed on a header.
                     */
                    operation: "append" | "set" | "remove";
                    /**
                     * The new value for the header. Must be specified for the 'append' and 'set' operations.
                     */
                    value?: string | undefined;
                })[] | undefined;
                /**
                 * The response headers to modify for the request. Only valid when type is 'modifyHeaders'.
                 */
                responseHeaders?: ({
                    /**
                     * The name of the response header to be modified.
                     */
                    header: string;
                    /**
                     * The operation to be performed on a header.
                     */
                    operation: "append" | "set" | "remove";
                    /**
                     * The new value for the header. Must be specified for the 'append' and 'set' operations.
                     */
                    value?: string | undefined;
                })[] | undefined;
                type: "block" | "redirect" | "allow" | "upgradeScheme" | "modifyHeaders" | "allowAllRequests";
            };
            /**
             * The condition under which this rule is triggered.
             */
            condition: {
                /**
                 * Specifies whether the network request is first-party or third-party to the domain from which it originated. If omitted, all requests are matched.
                 */
                domainType?: "firstParty" | "thirdParty" | undefined;
                /**
                 * The rule will not match network requests originating from the list of 'initiatorDomains'. If the list is empty or omitted, no domains are excluded. This takes precedence over 'initiatorDomains'.
                 */
                excludedInitiatorDomains?: string[] | undefined;
                /**
                 * The rule will not match network requests when the domains matches one from the list of 'excludedRequestDomains'. If the list is empty or omitted, no domains are excluded. This takes precedence over 'requestDomains'.
                 */
                excludedRequestDomains?: string[] | undefined;
                /**
                 * List of request methods which the rule won't match. Cannot be specified if 'requestMethods' is specified. If neither of them is specified, all request methods are matched.
                 */
                excludedRequestMethods?: string[] | undefined;
                /**
                 * List of resource types which the rule won't match. Cannot be specified if 'resourceTypes' is specified. If neither of them is specified, all resource types except 'main_frame' are matched.
                 */
                excludedResourceTypes?: ResourceType[] | undefined;
                /**
                 * List of tabIds which the rule should not match. An ID of -1 excludes requests which don't originate from a tab. Only supported for session-scoped rules.
                 */
                excludedTabIds?: number[] | undefined;
                /**
                 * The rule will only match network requests originating from the list of 'initiatorDomains'. If the list is omitted, the rule is applied to requests from all domains.
                 */
                initiatorDomains?: string[] | undefined;
                /**
                 * Whether 'urlFilter' or 'regexFilter' is case-sensitive.
                 */
                isUrlFilterCaseSensitive?: boolean | undefined;
                /**
                 * Regular expression to match against the network request url. Only one of 'urlFilter' or 'regexFilter' can be specified.
                 */
                regexFilter?: string | undefined;
                /**
                 * The rule will only match network requests when the domain matches one from the list of 'requestDomains'. If the list is omitted, the rule is applied to requests from all domains.
                 */
                requestDomains?: string[] | undefined;
                /**
                 * List of HTTP request methods which the rule can match. Should be a lower-case method such as 'connect', 'delete', 'get', 'head', 'options', 'patch', 'post', 'put'.'
                 */
                requestMethods?: string[] | undefined;
                /**
                 * List of resource types which the rule can match. When the rule action is 'allowAllRequests', this must be specified and may only contain 'main_frame' or 'sub_frame'. Cannot be specified if 'excludedResourceTypes' is specified. If neither of them is specified, all resource types except 'main_frame' are matched.
                 */
                resourceTypes?: ResourceType[] | undefined;
                /**
                 * List of tabIds which the rule should match. An ID of -1 matches requests which don't originate from a tab. Only supported for session-scoped rules.
                 */
                tabIds?: number[] | undefined;
                /**
                 * TODO: link to doc explaining supported pattern. The pattern which is matched against the network request url. Only one of 'urlFilter' or 'regexFilter' can be specified.
                 */
                urlFilter?: string | undefined;
            };
            /**
             * An id which uniquely identifies a rule. Mandatory and should be >= 1.
             */
            id: number;
            /**
             * Rule priority. Defaults to 1. When specified, should be >= 1
             */
            priority?: number | undefined;
        }

        /**
         * Describes the type of the Rule.action.redirect.transform property.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         * @platform desktop, mobile
         */
        export interface URLTransform {
            /**
             * The new fragment for the request. Should be either empty, in which case the existing fragment is cleared; or should begin with '#'.
             */
            fragment?: string | undefined;
            /**
             * The new host name for the request.
             */
            host?: string | undefined;
            /**
             * The new password for the request.
             */
            password?: string | undefined;
            /**
             * The new path for the request. If empty, the existing path is cleared.
             */
            path?: string | undefined;
            /**
             * The new port for the request. If empty, the existing port is cleared.
             */
            port?: string | undefined;
            /**
             * The new query for the request. Should be either empty, in which case the existing query is cleared; or should begin with '?'. Cannot be specified if 'queryTransform' is specified.
             */
            query?: string | undefined;
            /**
             * Add, remove or replace query key-value pairs. Cannot be specified if 'query' is specified.
             */
            queryTransform?: {
                /**
                 * The list of query key-value pairs to be added or replaced.
                 */
                addOrReplaceParams?: ({
                    key: string;
                    /**
                     * If true, the query key is replaced only if it's already present. Otherwise, the key is also added if it's missing.
                     */
                    replaceOnly?: boolean | undefined;
                    value: string;
                })[] | undefined;
                /**
                 * The list of query keys to be removed.
                 */
                removeParams?: string[] | undefined;
            } | undefined;
            /**
             * The new scheme for the request.
             */
            scheme?: "http" | "https" | "moz-extension" | undefined;
            /**
             * The new username for the request.
             */
            username?: string | undefined;
        }

        /**
         * Describes the reason why a given regular expression isn't supported.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         * @platform desktop, mobile
         */
        export type UnsupportedRegexReason = "syntaxError" | "memoryLimitExceeded";

        /**
         * Ruleset ID for the dynamic rules added by the extension.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         * @platform desktop, mobile
         */
        export const DYNAMIC_RULESET_ID: string;
        /**
         * The minimum number of static rules guaranteed to an extension across its enabled static rulesets. Any rules above this limit will count towards the global static rule limit.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         * @platform desktop, mobile
         */
        export const GUARANTEED_MINIMUM_STATIC_RULES: number;
        /**
         * The maximum number of static rules that can be disabled on each static ruleset.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         * @platform desktop, mobile
         */
        export const MAX_NUMBER_OF_DISABLED_STATIC_RULES: number;
        /**
         * Deprecated property returning the maximum number of dynamic and session rules an extension can add, replaced by MAX_NUMBER_OF_DYNAMIC_RULES/MAX_NUMBER_OF_SESSION_RULES.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         * @platform desktop, mobile
         */
        export const MAX_NUMBER_OF_DYNAMIC_AND_SESSION_RULES: number;
        /**
         * The maximum number of dynamic session rules an extension can add.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         * @platform desktop, mobile
         */
        export const MAX_NUMBER_OF_DYNAMIC_RULES: number;
        /**
         * The maximum number of static Rulesets an extension can enable at any one time.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         * @platform desktop, mobile
         */
        export const MAX_NUMBER_OF_ENABLED_STATIC_RULESETS: number;
        /**
         * The maximum number of regular expression rules that an extension can add. This limit is evaluated separately for the set of session rules, dynamic rules and those specified in the rule_resources file.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         * @platform desktop, mobile
         */
        export const MAX_NUMBER_OF_REGEX_RULES: number;
        /**
         * The maximum number of dynamic session rules an extension can add.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         * @platform desktop, mobile
         */
        export const MAX_NUMBER_OF_SESSION_RULES: number;
        /**
         * The maximum number of static Rulesets an extension can specify as part of the rule_resources manifest key.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         * @platform desktop, mobile
         */
        export const MAX_NUMBER_OF_STATIC_RULESETS: number;
        /**
         * Ruleset ID for the session-scoped rules added by the extension.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         * @platform desktop, mobile
         */
        export const SESSION_RULESET_ID: string;

        /**
         * Returns the remaining number of static rules an extension can enable
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         * @platform desktop, mobile
         */
        export function getAvailableStaticRuleCount(): globalThis.Promise<number>;
        export function getAvailableStaticRuleCount(callback: ((count: number) => void)): void;

        /**
         * Returns the list of individual disabled static rules from a given static ruleset id.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         * @platform desktop, mobile
         */
        export function getDisabledRuleIds(options: getDisabledRuleIds.Options): globalThis.Promise<number[]>;
        export function getDisabledRuleIds(options: getDisabledRuleIds.Options, callback: ((disabledRuleIds: number[]) => void)): void;
        export namespace getDisabledRuleIds {
            export type Options = {
                rulesetId: string;
            };
        }

        /**
         * Returns the current set of dynamic rules for the extension.
         *
         * @param filter An object to filter the set of dynamic rules for the extension.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         * @platform desktop, mobile
         */
        export function getDynamicRules(filter?: GetRulesFilter | null): globalThis.Promise<Rule[]>;
        export function getDynamicRules(filter: GetRulesFilter | null | undefined, callback: ((dynamicRules: Rule[]) => void)): void;
        export function getDynamicRules(callback: ((dynamicRules: Rule[]) => void)): void;

        /**
         * Returns the ids for the current set of enabled static rulesets.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         * @platform desktop, mobile
         */
        export function getEnabledRulesets(): globalThis.Promise<string[]>;
        export function getEnabledRulesets(callback: ((rulesetIds: string[]) => void)): void;

        /**
         * Returns the current set of session scoped rules for the extension.
         *
         * @param filter An object to filter the set of session scoped rules for the extension.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         * @platform desktop, mobile
         */
        export function getSessionRules(filter?: GetRulesFilter | null): globalThis.Promise<Rule[]>;
        export function getSessionRules(filter: GetRulesFilter | null | undefined, callback: ((sessionRules: Rule[]) => void)): void;
        export function getSessionRules(callback: ((sessionRules: Rule[]) => void)): void;

        /**
         * Checks if the given regular expression will be supported as a 'regexFilter' rule condition.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         * @platform desktop, mobile
         */
        export function isRegexSupported(regexOptions: isRegexSupported.RegexOptions): globalThis.Promise<isRegexSupported.Result>;
        export function isRegexSupported(regexOptions: isRegexSupported.RegexOptions, callback: ((result: isRegexSupported.Result) => void)): void;
        export namespace isRegexSupported {
            export type RegexOptions = {
                /**
                 * Whether the 'regex' specified is case sensitive.
                 */
                isCaseSensitive?: boolean | undefined;
                /**
                 * The regular expresson to check.
                 */
                regex: string;
                /**
                 * Whether the 'regex' specified requires capturing. Capturing is only required for redirect rules which specify a 'regexSubstition' action.
                 */
                requireCapturing?: boolean | undefined;
            };
            export type Result = {
                /**
                 * Whether the given regex is supported
                 */
                isSupported: boolean;
                /**
                 * Specifies the reason why the regular expression is not supported. Only provided if 'isSupported' is false.
                 */
                reason?: UnsupportedRegexReason | undefined;
            };
        }

        /**
         * Checks if any of the extension's declarativeNetRequest rules would match a hypothetical request.
         *
         * @param request The details of the request to test.
         * @param callback Called with the details of matched rules.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         * @permission declarativeNetRequestFeedback
         * @platform desktop, mobile
         */
        export function testMatchOutcome(request: testMatchOutcome.Request, options?: testMatchOutcome.Options | null): globalThis.Promise<testMatchOutcome.Result>;
        export function testMatchOutcome(request: testMatchOutcome.Request, options: testMatchOutcome.Options | null | undefined, callback: ((result: testMatchOutcome.Result) => void)): void;
        export function testMatchOutcome(request: testMatchOutcome.Request, callback: ((result: testMatchOutcome.Result) => void)): void;
        export namespace testMatchOutcome {
            /**
             * The details of the request to test.
             */
            export type Request = {
                /**
                 * The initiator URL (if any) for the hypothetical request.
                 */
                initiator?: string | undefined;
                /**
                 * Standard HTTP method of the hypothetical request.
                 */
                method?: string | undefined;
                /**
                 * The ID of the tab in which the hypothetical request takes place. Does not need to correspond to a real tab ID. Default is -1, meaning that the request isn't related to a tab.
                 */
                tabId?: number | undefined;
                /**
                 * The resource type of the hypothetical request.
                 */
                type: ResourceType;
                /**
                 * The URL of the hypothetical request.
                 */
                url: string;
            };
            export type Options = {
                /**
                 * Whether to account for rules from other installed extensions during rule evaluation.
                 */
                includeOtherExtensions?: boolean | undefined;
            };
            export type Result = {
                /**
                 * The rules (if any) that match the hypothetical request.
                 */
                matchedRules: MatchedRule[];
            };
        }

        /**
         * Modifies the current set of dynamic rules for the extension. The rules with IDs listed in options.removeRuleIds are first removed, and then the rules given in options.addRules are added. These rules are persisted across browser sessions and extension updates.
         *
         * @param callback Called when the dynamic rules have been updated
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         * @platform desktop, mobile
         */
        export function updateDynamicRules(options: updateDynamicRules.Options): globalThis.Promise<void>;
        export function updateDynamicRules(options: updateDynamicRules.Options, callback: (() => void)): void;
        export namespace updateDynamicRules {
            export type Options = {
                /**
                 * Rules to add.
                 */
                addRules?: Rule[] | undefined;
                /**
                 * IDs of the rules to remove. Any invalid IDs will be ignored.
                 */
                removeRuleIds?: number[] | undefined;
            };
        }

        /**
         * Modifies the static rulesets enabled/disabled state.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         * @platform desktop, mobile
         */
        export function updateEnabledRulesets(updateRulesetOptions: updateEnabledRulesets.UpdateRulesetOptions): globalThis.Promise<void>;
        export function updateEnabledRulesets(updateRulesetOptions: updateEnabledRulesets.UpdateRulesetOptions, callback: (() => void)): void;
        export namespace updateEnabledRulesets {
            export type UpdateRulesetOptions = {
                disableRulesetIds?: string[] | undefined;
                enableRulesetIds?: string[] | undefined;
            };
        }

        /**
         * Modifies the current set of session scoped rules for the extension. The rules with IDs listed in options.removeRuleIds are first removed, and then the rules given in options.addRules are added. These rules are not persisted across sessions and are backed in memory.
         *
         * @param callback Called when the session rules have been updated
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         * @platform desktop, mobile
         */
        export function updateSessionRules(options: updateSessionRules.Options): globalThis.Promise<void>;
        export function updateSessionRules(options: updateSessionRules.Options, callback: (() => void)): void;
        export namespace updateSessionRules {
            export type Options = {
                /**
                 * Rules to add.
                 */
                addRules?: Rule[] | undefined;
                /**
                 * IDs of the rules to remove. Any invalid IDs will be ignored.
                 */
                removeRuleIds?: number[] | undefined;
            };
        }

        /**
         * Modified individual static rules enabled/disabled state. Changes to rules belonging to a disabled ruleset will take effect when the ruleset becomes enabled.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         * @platform desktop, mobile
         */
        export function updateStaticRules(options: updateStaticRules.Options): globalThis.Promise<void>;
        export function updateStaticRules(options: updateStaticRules.Options, callback: (() => void)): void;
        export namespace updateStaticRules {
            export type Options = {
                disableRuleIds?: number[] | undefined;
                enableRuleIds?: number[] | undefined;
                rulesetId: string;
            };
        }

    }

    /**
     * Only available in devtools pages.
     *
     * @permission manifest:devtools_page
     * @platform desktop
     */
    export namespace devtools {
        /**
         * Use the `chrome.devtools.inspectedWindow` API to interact with the inspected window: obtain the tab ID for the inspected page, evaluate the code in the context of the inspected window, reload the page, or obtain the list of resources within the page.
         *
         * Only available in devtools pages.
         *
         * @platform desktop
         */
        export namespace inspectedWindow {
            /**
             * A resource within the inspected page, such as a document, a script, or an image.
             *
             * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/devtools_inspected_window.json
             * @platform desktop
             */
            export interface Resource {
                /**
                 * The URL of the resource.
                 */
                url: string;
                /**
                 * Gets the content of the resource.
                 *
                 * @param callback A function that receives resource content when the request completes.
                 * @deprecated Firefox does not support this method; it does not exist at runtime.
                 */
                getContent(): globalThis.Promise<[content: string, encoding: string]>;
                getContent(callback: ((content: string, encoding: string) => void)): void;
                /**
                 * Sets the content of the resource.
                 *
                 * @param content New content of the resource. Only resources with the text type are currently supported.
                 * @param commit True if the user has finished editing the resource, and the new content of the resource should be persisted; false if this is a minor change sent in progress of the user editing the resource.
                 * @param callback A function called upon request completion.
                 * @returns Set to undefined if the resource content was set successfully; describes error otherwise.
                 * @deprecated Firefox does not support this method; it does not exist at runtime.
                 */
                setContent(content: string, commit: boolean): globalThis.Promise<Record<string, any> | undefined>;
                setContent(content: string, commit: boolean, callback: ((error: Record<string, any> | undefined) => void)): void;
            }

            /**
             * The ID of the tab being inspected. This ID may be used with chrome.tabs.* API.
             *
             * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/devtools_inspected_window.json
             * @platform desktop
             */
            export const tabId: number;

            /**
             * Fired when a new resource is added to the inspected page.
             *
             * @deprecated Firefox does not support this event; it does not exist at runtime.
             * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/devtools_inspected_window.json
             */
            export const onResourceAdded: WebExtensionEvent<(resource: browser.devtools.inspectedWindow.Resource) => void>;

            /**
             * Fired when a new revision of the resource is committed (e.g. user saves an edited version of the resource in the Developer Tools).
             *
             * @param content New content of the resource.
             * @deprecated Firefox does not support this event; it does not exist at runtime.
             * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/devtools_inspected_window.json
             */
            export const onResourceContentCommitted: WebExtensionEvent<(resource: browser.devtools.inspectedWindow.Resource, content: string) => void>;

            /**
             * Evaluates a JavaScript expression in the context of the main frame of the inspected page. The expression must evaluate to a JSON-compliant object, otherwise an exception is thrown. The eval function can report either a DevTools-side error or a JavaScript exception that occurs during evaluation. In either case, the `result` parameter of the callback is `undefined`. In the case of a DevTools-side error, the `isException` parameter is non-null and has `isError` set to true and `code` set to an error code. In the case of a JavaScript error, `isException` is set to true and `value` is set to the string value of thrown object.
             *
             * @param expression An expression to evaluate.
             * @param options The options parameter can contain one or more options.
             * @param callback A function called when evaluation completes.
             * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/devtools_inspected_window.json
             * @platform desktop
             */
            function _eval(expression: string, options?: _eval.Options | null): globalThis.Promise<[result: any, exceptionInfo: _eval.ExceptionInfo | undefined]>;
            function _eval(expression: string, options: _eval.Options | null | undefined, callback: ((result: any, exceptionInfo: _eval.ExceptionInfo | undefined) => void)): void;
            function _eval(expression: string, callback: ((result: any, exceptionInfo: _eval.ExceptionInfo | undefined) => void)): void;
            export { _eval as eval };
            export namespace _eval {
                /**
                 * The options parameter can contain one or more options.
                 */
                export type Options = {
                    /**
                     * Evaluate the expression in the context of a content script of an extension that matches the specified origin. If given, contextSecurityOrigin overrides the 'true' setting on userContentScriptContext.
                     *
                     * @deprecated Firefox does not support this property and rejects an object that includes it.
                     */
                    contextSecurityOrigin?: string | undefined;
                    /**
                     * If specified, the expression is evaluated on the iframe whose URL matches the one specified. By default, the expression is evaluated in the top frame of the inspected page.
                     *
                     * @deprecated Firefox does not support this property and rejects an object that includes it.
                     */
                    frameURL?: string | undefined;
                    /**
                     * Evaluate the expression in the context of the content script of the calling extension, provided that the content script is already injected into the inspected page. If not, the expression is not evaluated and the callback is invoked with the exception parameter set to an object that has the `isError` field set to true and the `code` field set to `E_NOTFOUND`.
                     *
                     * @deprecated Firefox does not support this property and rejects an object that includes it.
                     */
                    useContentScriptContext?: boolean | undefined;
                };
                /**
                 * An object providing details if an exception occurred while evaluating the expression.
                 */
                export type ExceptionInfo = {
                    /**
                     * Set if the error occurred on the DevTools side before the expression is evaluated.
                     */
                    code: string;
                    /**
                     * Set if the error occurred on the DevTools side before the expression is evaluated.
                     */
                    description: string;
                    /**
                     * Set if the error occurred on the DevTools side before the expression is evaluated, contains the array of the values that may be substituted into the description string to provide more information about the cause of the error.
                     */
                    details: any[];
                    /**
                     * Set if the error occurred on the DevTools side before the expression is evaluated.
                     */
                    isError: boolean;
                    /**
                     * Set if the evaluated code produces an unhandled exception.
                     */
                    isException: boolean;
                    /**
                     * Set if the evaluated code produces an unhandled exception.
                     */
                    value: string;
                };
            }

            /**
             * Retrieves the list of resources from the inspected page.
             *
             * @param callback A function that receives the list of resources when the request completes.
             * @returns The resources within the page.
             * @deprecated Firefox does not support this function; it does not exist at runtime.
             * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/devtools_inspected_window.json
             */
            export function getResources(): globalThis.Promise<browser.devtools.inspectedWindow.Resource[]>;
            export function getResources(callback: ((resources: browser.devtools.inspectedWindow.Resource[]) => void)): void;

            /**
             * Reloads the inspected page.
             *
             * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/devtools_inspected_window.json
             * @platform desktop
             */
            export function reload(reloadOptions?: reload.ReloadOptions | null): void;
            export namespace reload {
                export type ReloadOptions = {
                    /**
                     * When true, the loader will bypass the cache for all inspected page resources loaded before the `load` event is fired. The effect is similar to pressing Ctrl+Shift+R in the inspected window or within the Developer Tools window.
                     */
                    ignoreCache?: boolean | undefined;
                    /**
                     * If specified, the script will be injected into every frame of the inspected page immediately upon load, before any of the frame's scripts. The script will not be injected after subsequent reloads—for example, if the user presses Ctrl+R.
                     */
                    injectedScript?: string | undefined;
                    /**
                     * If specified, this script evaluates into a function that accepts three string arguments: the source to preprocess, the URL of the source, and a function name if the source is an DOM event handler. The preprocessorerScript function should return a string to be compiled by Chrome in place of the input source. In the case that the source is a DOM event handler, the returned source must compile to a single JS function.
                     *
                     * @deprecated Firefox does not support this property and rejects an object that includes it. Please avoid using this parameter, it will be removed soon.
                     */
                    preprocessorScript?: string | undefined;
                    /**
                     * If specified, the string will override the value of the `User-Agent` HTTP header that's sent while loading the resources of the inspected page. The string will also override the value of the `navigator.userAgent` property that's returned to any scripts that are running within the inspected page.
                     */
                    userAgent?: string | undefined;
                };
            }

        }
        /**
         * Use the `chrome.devtools.network` API to retrieve the information about network requests displayed by the Developer Tools in the Network panel.
         *
         * Only available in devtools pages.
         *
         * @platform desktop
         */
        export namespace network {
            /**
             * Represents a network request for a document resource (script, image and so on). See HAR Specification for reference.
             *
             * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/devtools_network.json
             * @platform desktop
             */
            export interface Request {
                /**
                 * Returns content of the response body.
                 *
                 * @param callback A function that receives the response body when the request completes.
                 * @platform desktop
                 */
                getContent(): globalThis.Promise<[content: string, encoding: string]>;
                getContent(callback: ((content: string, encoding: string) => void)): void;
            }

            /**
             * Fired when the inspected window navigates to a new page.
             *
             * @param url URL of the new page.
             * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/devtools_network.json
             * @platform desktop
             */
            export const onNavigated: WebExtensionEvent<(url: string) => void>;

            /**
             * Fired when a network request is finished and all request data are available.
             *
             * @param request Description of a network request in the form of a HAR entry. See HAR specification for details.
             * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/devtools_network.json
             * @platform desktop
             */
            export const onRequestFinished: WebExtensionEvent<(request: Request) => void>;

            /**
             * Returns HAR log that contains all known network requests.
             *
             * @param callback A function that receives the HAR log when the request completes.
             * @returns A HAR log. See HAR specification for details.
             * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/devtools_network.json
             * @platform desktop
             */
            export function getHAR(): globalThis.Promise<Record<string, any>>;
            export function getHAR(callback: ((harLog: Record<string, any>) => void)): void;

        }
        /**
         * Use the `chrome.devtools.panels` API to integrate your extension into Developer Tools window UI: create your own panels, access existing panels, and add sidebars.
         *
         * Only available in devtools pages.
         *
         * @platform desktop
         */
        export namespace panels {
            /**
             * A button created by the extension.
             *
             * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/devtools_panels.json
             * @platform desktop
             */
            export interface Button {
                /**
                 * Updates the attributes of the button. If some of the arguments are omitted or `null`, the corresponding attributes are not updated.
                 *
                 * @param disabled Whether the button is disabled.
                 * @param tooltipText Text shown as a tooltip when user hovers the mouse over the button.
                 * @param iconPath Path to the new icon of the button.
                 * @deprecated Firefox does not support this method; it does not exist at runtime.
                 */
                update(disabled?: boolean | null): void;
                update(tooltipText?: string | null, disabled?: boolean | null): void;
                update(iconPath?: string | null, tooltipText?: string | null, disabled?: boolean | null): void;
                /**
                 * Fired when the button is clicked.
                 *
                 * @deprecated Firefox does not support this event; it does not exist at runtime.
                 */
                onClicked: WebExtensionEvent<() => void>;
            }

            /**
             * Represents the Elements panel.
             *
             * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/devtools_panels.json
             * @platform desktop
             */
            export interface ElementsPanel {
                /**
                 * Creates a pane within panel's sidebar.
                 *
                 * @param title Text that is displayed in sidebar caption.
                 * @param callback A callback invoked when the sidebar is created.
                 * @returns An ExtensionSidebarPane object for created sidebar pane.
                 * @platform desktop
                 */
                createSidebarPane(title: string): globalThis.Promise<ExtensionSidebarPane>;
                createSidebarPane(title: string, callback: ((result: ExtensionSidebarPane) => void)): void;
                /**
                 * Fired when an object is selected in the panel.
                 *
                 * @platform desktop
                 */
                onSelectionChanged: WebExtensionEvent<() => void>;
            }

            /**
             * Represents a panel created by extension.
             *
             * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/devtools_panels.json
             * @platform desktop
             */
            export interface ExtensionPanel {
                /**
                 * Appends a button to the status bar of the panel.
                 *
                 * @param iconPath Path to the icon of the button. The file should contain a 64x24-pixel image composed of two 32x24 icons. The left icon is used when the button is inactive; the right icon is displayed when the button is pressed.
                 * @param tooltipText Text shown as a tooltip when user hovers the mouse over the button.
                 * @param disabled Whether the button is disabled.
                 * @deprecated Firefox does not support this method; it does not exist at runtime.
                 */
                createStatusBarButton(iconPath: string, tooltipText: string, disabled: boolean): Button;
                /**
                 * Fired when the user switches away from the panel.
                 *
                 * @platform desktop
                 */
                onHidden: WebExtensionEvent<() => void>;
                /**
                 * Fired upon a search action (start of a new search, search result navigation, or search being canceled).
                 *
                 * @param action Type of search action being performed.
                 * @param queryString Query string (only for 'performSearch').
                 * @deprecated Firefox does not support this event; it does not exist at runtime.
                 */
                onSearch: WebExtensionEvent<(action: string, queryString?: string) => void>;
                /**
                 * Fired when the user switches to the panel.
                 *
                 * @param window The JavaScript `window` object of panel's page.
                 * @platform desktop
                 */
                onShown: WebExtensionEvent<(window: Window) => void>;
            }

            /**
             * A sidebar created by the extension.
             *
             * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/devtools_panels.json
             * @platform desktop
             */
            export interface ExtensionSidebarPane {
                /**
                 * Sets an expression that is evaluated within the inspected page. The result is displayed in the sidebar pane.
                 *
                 * @param expression An expression to be evaluated in context of the inspected page. JavaScript objects and DOM nodes are displayed in an expandable tree similar to the console/watch.
                 * @param rootTitle An optional title for the root of the expression tree.
                 * @param callback A callback invoked after the sidebar pane is updated with the expression evaluation results.
                 * @platform desktop
                 */
                setExpression(expression: string, rootTitle?: string | null): globalThis.Promise<void>;
                setExpression(expression: string, rootTitle: string | null | undefined, callback: ((...args: any[]) => void)): void;
                setExpression(expression: string, callback: ((...args: any[]) => void)): void;
                /**
                 * Sets the height of the sidebar.
                 *
                 * @param height A CSS-like size specification, such as `'100px'` or `'12ex'`.
                 * @deprecated Firefox does not support this method; it does not exist at runtime.
                 */
                setHeight(height: string): void;
                /**
                 * Sets a JSON-compliant object to be displayed in the sidebar pane.
                 *
                 * @param jsonObject An object to be displayed in context of the inspected page. Evaluated in the context of the caller (API client).
                 * @param rootTitle An optional title for the root of the expression tree.
                 * @param callback A callback invoked after the sidebar is updated with the object.
                 * @platform desktop
                 */
                setObject(jsonObject: string, rootTitle?: string | null): globalThis.Promise<void>;
                setObject(jsonObject: string, rootTitle: string | null | undefined, callback: ((...args: any[]) => void)): void;
                setObject(jsonObject: string, callback: ((...args: any[]) => void)): void;
                /**
                 * Sets an HTML page to be displayed in the sidebar pane.
                 *
                 * @param path Relative path of an extension page to display within the sidebar.
                 * @platform desktop
                 */
                setPage(path: browser.manifest.ExtensionURL): globalThis.Promise<void>;
                /**
                 * Fired when the sidebar pane becomes hidden as a result of the user switching away from the panel that hosts the sidebar pane.
                 *
                 * @platform desktop
                 */
                onHidden: WebExtensionEvent<() => void>;
                /**
                 * Fired when the sidebar pane becomes visible as a result of user switching to the panel that hosts it.
                 *
                 * @param window The JavaScript `window` object of the sidebar page, if one was set with the `setPage()` method.
                 * @platform desktop
                 */
                onShown: WebExtensionEvent<(window: Window) => void>;
            }

            /**
             * Represents the Sources panel.
             *
             * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/devtools_panels.json
             * @platform desktop
             */
            export interface SourcesPanel {
                /**
                 * Creates a pane within panel's sidebar.
                 *
                 * @param title Text that is displayed in sidebar caption.
                 * @param callback A callback invoked when the sidebar is created.
                 * @returns An ExtensionSidebarPane object for created sidebar pane.
                 * @deprecated Firefox does not support this method; it does not exist at runtime.
                 */
                createSidebarPane(title: string, callback?: ((result: ExtensionSidebarPane) => void) | null): void;
                /**
                 * Fired when an object is selected in the panel.
                 *
                 * @deprecated Firefox does not support this event; it does not exist at runtime.
                 */
                onSelectionChanged: WebExtensionEvent<() => void>;
            }

            /**
             * Elements panel.
             *
             * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/devtools_panels.json
             * @platform desktop
             */
            export const elements: ElementsPanel;
            /**
             * Sources panel.
             *
             * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/devtools_panels.json
             * @platform desktop
             */
            export const sources: SourcesPanel;
            /**
             * The name of the current devtools theme.
             *
             * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/devtools_panels.json
             * @platform desktop
             */
            export const themeName: string;

            /**
             * Fired when the devtools theme changes.
             *
             * @param themeName The name of the current devtools theme.
             * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/devtools_panels.json
             * @platform desktop
             */
            export const onThemeChanged: WebExtensionEvent<(themeName: string) => void>;

            /**
             * Creates an extension panel.
             *
             * @param title Title that is displayed next to the extension icon in the Developer Tools toolbar.
             * @param iconPath Path of the panel's icon relative to the extension directory, or an empty string to use the default extension icon as the panel icon.
             * @param pagePath Path of the panel's HTML page relative to the extension directory.
             * @param callback A function that is called when the panel is created.
             * @returns An ExtensionPanel object representing the created panel.
             * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/devtools_panels.json
             * @platform desktop
             */
            export function create(title: string, iconPath: "" | browser.manifest.ExtensionURL, pagePath: browser.manifest.ExtensionURL): globalThis.Promise<browser.devtools.panels.ExtensionPanel>;
            export function create(title: string, iconPath: "" | browser.manifest.ExtensionURL, pagePath: browser.manifest.ExtensionURL, callback: ((panel: browser.devtools.panels.ExtensionPanel) => void)): void;

            /**
             * Requests DevTools to open a URL in a Developer Tools panel.
             *
             * @param url The URL of the resource to open.
             * @param lineNumber Specifies the line number to scroll to when the resource is loaded.
             * @param callback A function that is called when the resource has been successfully loaded.
             * @deprecated Firefox does not support this function; it does not exist at runtime.
             * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/devtools_panels.json
             */
            export function openResource(url: string, lineNumber: number): globalThis.Promise<void>;
            export function openResource(url: string, lineNumber: number, callback: ((...args: any[]) => void)): void;

            /**
             * Specifies the function to be called when the user clicks a resource link in the Developer Tools window. To unset the handler, either call the method with no parameters or pass null as the parameter.
             *
             * @param callback A function that is called when the user clicks on a valid resource link in Developer Tools window. Note that if the user clicks an invalid URL or an XHR, this function is not called.
             * @returns A {@link browser.devtools.inspectedWindow.Resource} object for the resource that was clicked.
             * @deprecated Firefox does not support this function; it does not exist at runtime.
             * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/devtools_panels.json
             */
            export function setOpenResourceHandler(): globalThis.Promise<browser.devtools.inspectedWindow.Resource>;
            export function setOpenResourceHandler(callback: ((resource: browser.devtools.inspectedWindow.Resource) => void)): void;

        }
    }

    /**
     * Asynchronous DNS API
     *
     * Not available in content scripts or devtools pages.
     *
     * @permission dns
     * @platform desktop, mobile
     */
    export namespace dns {
        /**
         * An object encapsulating a DNS Record.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/dns.json
         * @platform desktop, mobile
         */
        export interface DNSRecord {
            addresses: string[];
            /**
             * The canonical hostname for this record.  this value is empty if the record was not fetched with the 'canonical_name' flag.
             */
            canonicalName?: string | undefined;
            /**
             * Record retreived with TRR.
             */
            isTRR: string;
        }

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/dns.json
         * @platform desktop, mobile
         */
        export type ResolveFlags = ("allow_name_collisions" | "bypass_cache" | "canonical_name" | "disable_ipv4" | "disable_ipv6" | "disable_trr" | "offline" | "priority_low" | "priority_medium" | "speculate")[];

        /**
         * Resolves a hostname to a DNS record.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/dns.json
         * @platform desktop, mobile
         */
        export function resolve(hostname: string, flags?: ResolveFlags | null): globalThis.Promise<DNSRecord>;

    }

    /**
     * Not available in content scripts or devtools pages.
     *
     * @permission downloads
     * @platform desktop, mobile
     */
    export namespace downloads {
        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         * @platform desktop, mobile
         */
        export interface BooleanDelta {
            current?: boolean | undefined;
            previous?: boolean | undefined;
        }

        /**
         * - `file`: The download's filename is suspicious.
         * - `url`: The download's URL is known to be malicious.
         * - `content`: The downloaded file is known to be malicious.
         * - `uncommon`: The download's URL is not commonly downloaded and could be dangerous.
         * - `safe`: The download presents no known danger to the user's computer.
         *
         * These string constants will never change, however the set of DangerTypes may change.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         * @platform desktop, mobile
         */
        export type DangerType = "file" | "url" | "content" | "uncommon" | "host" | "unwanted" | "safe" | "accepted";

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         * @platform desktop, mobile
         */
        export interface DoubleDelta {
            current?: number | undefined;
            previous?: number | undefined;
        }

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         * @platform desktop, mobile
         */
        export interface DownloadItem {
            byExtensionId?: string | undefined;
            byExtensionName?: string | undefined;
            /**
             * Number of bytes received so far from the host, without considering file compression.
             */
            bytesReceived: number;
            canResume: boolean;
            /**
             * The cookie store ID of the contextual identity.
             */
            cookieStoreId?: string | undefined;
            /**
             * Indication of whether this download is thought to be safe or known to be suspicious.
             */
            danger: DangerType;
            /**
             * Number of milliseconds between the unix epoch and when this download ended.
             */
            endTime?: string | undefined;
            /**
             * Number indicating why a download was interrupted.
             */
            error?: InterruptReason | undefined;
            estimatedEndTime?: string | undefined;
            exists: boolean;
            /**
             * Number of bytes in the whole file post-decompression, or -1 if unknown.
             */
            fileSize: number;
            /**
             * Absolute local path.
             */
            filename: string;
            /**
             * An identifier that is persistent across browser sessions.
             */
            id: number;
            /**
             * False if this download is recorded in the history, true if it is not recorded.
             */
            incognito: boolean;
            /**
             * The file's MIME type.
             */
            mime?: string | undefined;
            /**
             * True if the download has stopped reading data from the host, but kept the connection open.
             */
            paused: boolean;
            referrer?: string | undefined;
            /**
             * Number of milliseconds between the unix epoch and when this download began.
             */
            startTime: string;
            /**
             * Indicates whether the download is progressing, interrupted, or complete.
             */
            state: State;
            /**
             * Number of bytes in the whole file, without considering file compression, or -1 if unknown.
             */
            totalBytes: number;
            /**
             * Absolute URL.
             */
            url: string;
        }

        /**
         * Parameters that combine to specify a predicate that can be used to select a set of downloads.  Used for example in search() and erase()
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         * @platform desktop, mobile
         */
        export interface DownloadQuery {
            /**
             * Number of bytes received so far from the host, without considering file compression.
             */
            bytesReceived?: number | undefined;
            /**
             * The cookie store ID of the contextual identity.
             */
            cookieStoreId?: string | undefined;
            /**
             * Indication of whether this download is thought to be safe or known to be suspicious.
             */
            danger?: DangerType | undefined;
            endTime?: string | undefined;
            /**
             * Limits results to downloads that ended after the given ms since the epoch.
             */
            endedAfter?: DownloadTime | undefined;
            /**
             * Limits results to downloads that ended before the given ms since the epoch.
             */
            endedBefore?: DownloadTime | undefined;
            /**
             * Why a download was interrupted.
             */
            error?: InterruptReason | undefined;
            exists?: boolean | undefined;
            /**
             * Number of bytes in the whole file post-decompression, or -1 if unknown.
             */
            fileSize?: number | undefined;
            /**
             * Absolute local path.
             */
            filename?: string | undefined;
            /**
             * Limits results to DownloadItems whose `filename` matches the given regular expression.
             */
            filenameRegex?: string | undefined;
            id?: number | undefined;
            /**
             * Setting this integer limits the number of results. Otherwise, all matching DownloadItems will be returned.
             */
            limit?: number | undefined;
            /**
             * The file's MIME type.
             */
            mime?: string | undefined;
            /**
             * Setting elements of this array to DownloadItem properties in order to sort the search results. For example, setting `orderBy='startTime'` sorts the DownloadItems by their start time in ascending order. To specify descending order, prefix `orderBy` with a hyphen: '-startTime'.
             */
            orderBy?: string[] | undefined;
            /**
             * True if the download has stopped reading data from the host, but kept the connection open.
             */
            paused?: boolean | undefined;
            /**
             * This array of search terms limits results to DownloadItems whose `filename` or `url` contain all of the search terms that do not begin with a dash '-' and none of the search terms that do begin with a dash.
             */
            query?: string[] | undefined;
            startTime?: string | undefined;
            /**
             * Limits results to downloads that started after the given ms since the epoch.
             */
            startedAfter?: DownloadTime | undefined;
            /**
             * Limits results to downloads that started before the given ms since the epoch.
             */
            startedBefore?: DownloadTime | undefined;
            /**
             * Indicates whether the download is progressing, interrupted, or complete.
             */
            state?: State | undefined;
            /**
             * Number of bytes in the whole file, without considering file compression, or -1 if unknown.
             */
            totalBytes?: number | undefined;
            /**
             * Limits results to downloads whose totalBytes is greater than the given integer.
             */
            totalBytesGreater?: number | undefined;
            /**
             * Limits results to downloads whose totalBytes is less than the given integer.
             */
            totalBytesLess?: number | undefined;
            /**
             * Absolute URL.
             */
            url?: string | undefined;
            /**
             * Limits results to DownloadItems whose `url` matches the given regular expression.
             */
            urlRegex?: string | undefined;
        }

        /**
         * A time specified as a Date object, a number or string representing milliseconds since the epoch, or an ISO 8601 string
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         * @platform desktop, mobile
         */
        export type DownloadTime = browser.extensionTypes.Date | (string & {});

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         * @platform desktop, mobile
         */
        export type FilenameConflictAction = "uniquify" | "overwrite" | "prompt";

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         * @platform desktop, mobile
         */
        export type InterruptReason = "FILE_FAILED" | "FILE_ACCESS_DENIED" | "FILE_NO_SPACE" | "FILE_NAME_TOO_LONG" | "FILE_TOO_LARGE" | "FILE_VIRUS_INFECTED" | "FILE_TRANSIENT_ERROR" | "FILE_BLOCKED" | "FILE_SECURITY_CHECK_FAILED" | "FILE_TOO_SHORT" | "NETWORK_FAILED" | "NETWORK_TIMEOUT" | "NETWORK_DISCONNECTED" | "NETWORK_SERVER_DOWN" | "NETWORK_INVALID_REQUEST" | "SERVER_FAILED" | "SERVER_NO_RANGE" | "SERVER_BAD_CONTENT" | "SERVER_UNAUTHORIZED" | "SERVER_CERT_PROBLEM" | "SERVER_FORBIDDEN" | "USER_CANCELED" | "USER_SHUTDOWN" | "CRASH";

        /**
         * - `in_progress`: The download is currently receiving data from the server.
         * - `interrupted`: An error broke the connection with the file host.
         * - `complete`: The download completed successfully.
         *
         * These string constants will never change, however the set of States may change.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         * @platform desktop, mobile
         */
        export type State = "in_progress" | "interrupted" | "complete";

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         * @platform desktop, mobile
         */
        export interface StringDelta {
            current?: string | undefined;
            previous?: string | undefined;
        }

        /**
         * When any of a DownloadItem's properties except `bytesReceived` changes, this event fires with the `downloadId` and an object containing the properties that changed.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         * @platform desktop, mobile
         */
        export const onChanged: WebExtensionEvent<(downloadDelta: onChanged.DownloadDelta) => void>;
        export namespace onChanged {
            export type DownloadDelta = {
                canResume?: BooleanDelta | undefined;
                /**
                 * Describes a change in a DownloadItem's `danger`.
                 */
                danger?: StringDelta | undefined;
                /**
                 * Describes a change in a DownloadItem's `endTime`.
                 */
                endTime?: StringDelta | undefined;
                /**
                 * Describes a change in a DownloadItem's `error`.
                 */
                error?: StringDelta | undefined;
                exists?: BooleanDelta | undefined;
                /**
                 * Describes a change in a DownloadItem's `fileSize`.
                 */
                fileSize?: DoubleDelta | undefined;
                /**
                 * Describes a change in a DownloadItem's `filename`.
                 */
                filename?: StringDelta | undefined;
                /**
                 * The `id` of the DownloadItem that changed.
                 */
                id: number;
                /**
                 * Describes a change in a DownloadItem's `mime`.
                 */
                mime?: StringDelta | undefined;
                /**
                 * Describes a change in a DownloadItem's `paused`.
                 */
                paused?: BooleanDelta | undefined;
                /**
                 * Describes a change in a DownloadItem's `startTime`.
                 */
                startTime?: StringDelta | undefined;
                /**
                 * Describes a change in a DownloadItem's `state`.
                 */
                state?: StringDelta | undefined;
                /**
                 * Describes a change in a DownloadItem's `totalBytes`.
                 */
                totalBytes?: DoubleDelta | undefined;
                /**
                 * Describes a change in a DownloadItem's `url`.
                 */
                url?: StringDelta | undefined;
            };
        }

        /**
         * This event fires with the DownloadItem object when a download begins.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         * @platform desktop, mobile
         */
        export const onCreated: WebExtensionEvent<(downloadItem: DownloadItem) => void>;

        /**
         * Fires with the `downloadId` when a download is erased from history.
         *
         * @param downloadId The `id` of the DownloadItem that was erased.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         * @platform desktop, mobile
         */
        export const onErased: WebExtensionEvent<(downloadId: number) => void>;

        /**
         * Prompt the user to either accept or cancel a dangerous download. `acceptDanger()` does not automatically accept dangerous downloads.
         *
         * @deprecated Firefox does not support this function; it does not exist at runtime.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         */
        export function acceptDanger(downloadId: number, callback?: (() => void) | null): void;

        /**
         * Cancel a download. When `callback` is run, the download is cancelled, completed, interrupted or doesn't exist anymore.
         *
         * @param downloadId The id of the download to cancel.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         * @platform desktop, mobile
         */
        export function cancel(downloadId: number): globalThis.Promise<void>;
        export function cancel(downloadId: number, callback: (() => void)): void;

        /**
         * Download a URL. If the URL uses the HTTP[S] protocol, then the request will include all cookies currently set for its hostname. If both `filename` and `saveAs` are specified, then the Save As dialog will be displayed, pre-populated with the specified `filename`. If the download started successfully, `callback` will be called with the new DownloadItem's `downloadId`. If there was an error starting the download, then `callback` will be called with `downloadId=undefined` and chrome.extension.lastError will contain a descriptive string. The error strings are not guaranteed to remain backwards compatible between releases. You must not parse it.
         *
         * @param options What to download and how.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         * @platform desktop, mobile
         */
        export function download(options: download.Options): globalThis.Promise<number>;
        export function download(options: download.Options, callback: ((downloadId: number) => void)): void;
        export namespace download {
            /**
             * What to download and how.
             */
            export type Options = {
                /**
                 * When this flag is set to `true`, then the browser will allow downloads to proceed after encountering HTTP errors such as `404 Not Found`.
                 */
                allowHttpErrors?: boolean | undefined;
                /**
                 * Post body.
                 */
                body?: string | undefined;
                conflictAction?: FilenameConflictAction | undefined;
                /**
                 * The cookie store ID of the contextual identity; requires "cookies" permission.
                 */
                cookieStoreId?: string | undefined;
                /**
                 * A file path relative to the Downloads directory to contain the downloaded file.
                 */
                filename?: string | undefined;
                /**
                 * Extra HTTP headers to send with the request if the URL uses the HTTP[s] protocol. Each header is represented as a dictionary containing the keys `name` and either `value` or `binaryValue`, restricted to those allowed by XMLHttpRequest.
                 */
                headers?: {
                    /**
                     * Name of the HTTP header.
                     */
                    name: string;
                    /**
                     * Value of the HTTP header.
                     */
                    value: string;
                }[] | undefined;
                /**
                 * Whether to associate the download with a private browsing session.
                 */
                incognito?: boolean | undefined;
                /**
                 * The HTTP method to use if the URL uses the HTTP[S] protocol.
                 */
                method?: "GET" | "POST" | undefined;
                /**
                 * Use a file-chooser to allow the user to select a filename. If the option is not specified, the file chooser will be shown only if the Firefox "Always ask you where to save files" option is enabled (i.e. the pref `browser.download.useDownloadDir` is set to `false`).
                 */
                saveAs?: boolean | undefined;
                /**
                 * The URL to download.
                 */
                url: string;
            };
        }

        /**
         * Initiate dragging the file to another application.
         *
         * @deprecated Firefox does not support this function; it does not exist at runtime.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         */
        export function drag(downloadId: number): void;

        /**
         * Erase matching DownloadItems from history
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         * @platform desktop, mobile
         */
        export function erase(query: DownloadQuery): globalThis.Promise<number[]>;
        export function erase(query: DownloadQuery, callback: ((erasedIds: number[]) => void)): void;

        /**
         * Retrieve an icon for the specified download. For new downloads, file icons are available after the onCreated event has been received. The image returned by this function while a download is in progress may be different from the image returned after the download is complete. Icon retrieval is done by querying the underlying operating system or toolkit depending on the platform. The icon that is returned will therefore depend on a number of factors including state of the download, platform, registered file types and visual theme. If a file icon cannot be determined, chrome.extension.lastError will contain an error message.
         *
         * @param downloadId The identifier for the download.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         * @platform desktop, mobile
         */
        export function getFileIcon(downloadId: number, options?: getFileIcon.Options | null): globalThis.Promise<string | undefined>;
        export function getFileIcon(downloadId: number, options: getFileIcon.Options | null | undefined, callback: ((iconURL: string | undefined) => void)): void;
        export function getFileIcon(downloadId: number, callback: ((iconURL: string | undefined) => void)): void;
        export namespace getFileIcon {
            export type Options = {
                /**
                 * The size of the icon.  The returned icon will be square with dimensions size * size pixels.  The default size for the icon is 32x32 pixels.
                 */
                size?: number | undefined;
            };
        }

        /**
         * Open the downloaded file.
         *
         * Must be called from a user input handler.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         * @permission downloads.open
         * @platform desktop, mobile
         */
        export function open(downloadId: number): globalThis.Promise<void>;
        export function open(downloadId: number, callback: (() => void)): void;

        /**
         * Pause the download. If the request was successful the download is in a paused state. Otherwise chrome.extension.lastError contains an error message. The request will fail if the download is not active.
         *
         * @param downloadId The id of the download to pause.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         * @platform desktop, mobile
         */
        export function pause(downloadId: number): globalThis.Promise<void>;
        export function pause(downloadId: number, callback: (() => void)): void;

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         * @platform desktop, mobile
         */
        export function removeFile(downloadId: number): globalThis.Promise<void>;
        export function removeFile(downloadId: number, callback: (() => void)): void;

        /**
         * Resume a paused download. If the request was successful the download is in progress and unpaused. Otherwise chrome.extension.lastError contains an error message. The request will fail if the download is not active.
         *
         * @param downloadId The id of the download to resume.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         * @platform desktop, mobile
         */
        export function resume(downloadId: number): globalThis.Promise<void>;
        export function resume(downloadId: number, callback: (() => void)): void;

        /**
         * Find DownloadItems. Set `query` to the empty object to get all DownloadItems. To get a specific DownloadItem, set only the `id` field.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         * @platform desktop, mobile
         */
        export function search(query: DownloadQuery): globalThis.Promise<DownloadItem[]>;
        export function search(query: DownloadQuery, callback: ((results: DownloadItem[]) => void)): void;

        /**
         * @deprecated Firefox does not support this function; it does not exist at runtime.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         */
        export function setShelfEnabled(enabled: boolean): void;

        /**
         * Show the downloaded file in its folder in a file manager.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         * @platform desktop, mobile
         */
        export function show(downloadId: number): globalThis.Promise<boolean>;
        export function show(downloadId: number, callback: ((success: boolean) => void)): void;

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         * @platform desktop, mobile
         */
        export function showDefaultFolder(): void;

    }

    /**
     * The `chrome.events` namespace contains common types used by APIs dispatching events to notify you when something interesting happens.
     *
     * Not available in content scripts or devtools pages.
     *
     * @platform desktop, mobile
     */
    export namespace events {
        /**
         * An object which allows the addition and removal of listeners for a Chrome event.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/events.json
         * @platform desktop, mobile
         */
        export interface Event {
            /**
             * Registers an event listener _callback_ to an event.
             *
             * @param callback Called when an event occurs. The parameters of this function depend on the type of event.
             * @platform desktop, mobile
             */
            addListener(callback: ((...args: any[]) => void)): void;
            /**
             * Registers rules to handle events.
             *
             * @param eventName Name of the event this function affects.
             * @param webViewInstanceId If provided, this is an integer that uniquely identfies the `<webview>` associated with this function call.
             * @param rules Rules to be registered. These do not replace previously registered rules.
             * @param callback Called with registered rules.
             * @returns Rules that were registered, the optional parameters are filled with values.
             * @deprecated Firefox does not support this method; it does not exist at runtime.
             */
            addRules(eventName: string, webViewInstanceId: number, rules: Rule[], callback?: ((rules: Rule[]) => void) | null): void;
            /**
             * Returns currently registered rules.
             *
             * @param eventName Name of the event this function affects.
             * @param webViewInstanceId If provided, this is an integer that uniquely identfies the `<webview>` associated with this function call.
             * @param ruleIdentifiers If an array is passed, only rules with identifiers contained in this array are returned.
             * @param callback Called with registered rules.
             * @returns Rules that were registered, the optional parameters are filled with values.
             * @deprecated Firefox does not support this method; it does not exist at runtime.
             */
            getRules(eventName: string, webViewInstanceId: number, ruleIdentifiers: string[] | null | undefined, callback: ((rules: Rule[]) => void)): void;
            getRules(eventName: string, webViewInstanceId: number, callback: ((rules: Rule[]) => void)): void;
            /**
             * @param callback Listener whose registration status shall be tested.
             * @returns True if _callback_ is registered to the event.
             * @platform desktop, mobile
             */
            hasListener(callback: ((...args: any[]) => void)): boolean;
            /**
             * @returns True if any event listeners are registered to the event.
             * @platform desktop, mobile
             */
            hasListeners(): boolean;
            /**
             * Deregisters an event listener _callback_ from an event.
             *
             * @param callback Listener that shall be unregistered.
             * @platform desktop, mobile
             */
            removeListener(callback: ((...args: any[]) => void)): void;
            /**
             * Unregisters currently registered rules.
             *
             * @param eventName Name of the event this function affects.
             * @param webViewInstanceId If provided, this is an integer that uniquely identfies the `<webview>` associated with this function call.
             * @param ruleIdentifiers If an array is passed, only rules with identifiers contained in this array are unregistered.
             * @param callback Called when rules were unregistered.
             * @deprecated Firefox does not support this method; it does not exist at runtime.
             */
            removeRules(eventName: string, webViewInstanceId: number, ruleIdentifiers?: string[] | null, callback?: (() => void) | null): void;
        }

        /**
         * Description of a declarative rule for handling events.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/events.json
         * @platform desktop, mobile
         */
        export interface Rule {
            /**
             * List of actions that are triggered if one of the condtions is fulfilled.
             */
            actions: any[];
            /**
             * List of conditions that can trigger the actions.
             */
            conditions: any[];
            /**
             * Optional identifier that allows referencing this rule.
             */
            id?: string | undefined;
            /**
             * Optional priority of this rule. Defaults to 100.
             */
            priority?: number | undefined;
            /**
             * Tags can be used to annotate rules and perform operations on sets of rules.
             */
            tags?: string[] | undefined;
        }

        /**
         * Filters URLs for various criteria. See event filtering. All criteria are case sensitive.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/events.json
         * @platform desktop, mobile
         */
        export interface UrlFilter {
            /**
             * Matches if the host name of the URL contains a specified string. To test whether a host name component has a prefix 'foo', use hostContains: '.foo'. This matches 'www.foobar.com' and 'foo.com', because an implicit dot is added at the beginning of the host name. Similarly, hostContains can be used to match against component suffix ('foo.') and to exactly match against components ('.foo.'). Suffix- and exact-matching for the last components need to be done separately using hostSuffix, because no implicit dot is added at the end of the host name.
             */
            hostContains?: string | undefined;
            /**
             * Matches if the host name of the URL is equal to a specified string.
             */
            hostEquals?: string | undefined;
            /**
             * Matches if the host name of the URL starts with a specified string.
             */
            hostPrefix?: string | undefined;
            /**
             * Matches if the host name of the URL ends with a specified string.
             */
            hostSuffix?: string | undefined;
            /**
             * Matches if the URL without query segment and fragment identifier matches a specified regular expression. Port numbers are stripped from the URL if they match the default port number. The regular expressions use the [RE2 syntax](https://github.com/google/re2/blob/master/doc/syntax.txt).
             */
            originAndPathMatches?: string | undefined;
            /**
             * Matches if the path segment of the URL contains a specified string.
             */
            pathContains?: string | undefined;
            /**
             * Matches if the path segment of the URL is equal to a specified string.
             */
            pathEquals?: string | undefined;
            /**
             * Matches if the path segment of the URL starts with a specified string.
             */
            pathPrefix?: string | undefined;
            /**
             * Matches if the path segment of the URL ends with a specified string.
             */
            pathSuffix?: string | undefined;
            /**
             * Matches if the port of the URL is contained in any of the specified port lists. For example `[80, 443, [1000, 1200]]` matches all requests on port 80, 443 and in the range 1000-1200.
             */
            ports?: (number | [number, number])[] | undefined;
            /**
             * Matches if the query segment of the URL contains a specified string.
             */
            queryContains?: string | undefined;
            /**
             * Matches if the query segment of the URL is equal to a specified string.
             */
            queryEquals?: string | undefined;
            /**
             * Matches if the query segment of the URL starts with a specified string.
             */
            queryPrefix?: string | undefined;
            /**
             * Matches if the query segment of the URL ends with a specified string.
             */
            querySuffix?: string | undefined;
            /**
             * Matches if the scheme of the URL is equal to any of the schemes specified in the array.
             */
            schemes?: string[] | undefined;
            /**
             * Matches if the URL (without fragment identifier) contains a specified string. Port numbers are stripped from the URL if they match the default port number.
             */
            urlContains?: string | undefined;
            /**
             * Matches if the URL (without fragment identifier) is equal to a specified string. Port numbers are stripped from the URL if they match the default port number.
             */
            urlEquals?: string | undefined;
            /**
             * Matches if the URL (without fragment identifier) matches a specified regular expression. Port numbers are stripped from the URL if they match the default port number. The regular expressions use the [RE2 syntax](https://github.com/google/re2/blob/master/doc/syntax.txt).
             */
            urlMatches?: string | undefined;
            /**
             * Matches if the URL (without fragment identifier) starts with a specified string. Port numbers are stripped from the URL if they match the default port number.
             */
            urlPrefix?: string | undefined;
            /**
             * Matches if the URL (without fragment identifier) ends with a specified string. Port numbers are stripped from the URL if they match the default port number.
             */
            urlSuffix?: string | undefined;
        }

    }

    /**
     * Not available in content scripts or devtools pages.
     *
     * @platform desktop, mobile
     */
    export namespace experiments {
        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/experiments.json
         * @platform desktop, mobile
         */
        export type APIChildScope = "addon_child" | "content_child" | "devtools_child";

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/experiments.json
         * @platform desktop, mobile
         */
        export type APIEvent = "startup";

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/experiments.json
         * @platform desktop, mobile
         */
        export type APIEvents = APIEvent[];

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/experiments.json
         * @platform desktop, mobile
         */
        export type APIParentScope = "addon_parent" | "content_parent" | "devtools_parent";

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/experiments.json
         * @platform desktop, mobile
         */
        export type APIPath = string[];

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/experiments.json
         * @platform desktop, mobile
         */
        export type APIPaths = APIPath[];

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/experiments.json
         * @platform desktop, mobile
         */
        export interface ExperimentAPI {
            child?: {
                paths: APIPaths;
                scopes: APIChildScope[];
                script: ExperimentURL;
            } | undefined;
            parent?: {
                events?: APIEvents | undefined;
                paths?: APIPaths | undefined;
                scopes?: APIParentScope[] | undefined;
                script: ExperimentURL;
            } | undefined;
            schema: ExperimentURL;
        }

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/experiments.json
         * @platform desktop, mobile
         */
        export type ExperimentURL = string;

    }

    /**
     * The `browser.extension` API has utilities that can be used by any extension page. It includes support for exchanging messages between an extension and its content scripts or between extensions, as described in detail in Message Passing.
     *
     * Also available in content scripts and devtools pages.
     *
     * @platform desktop, mobile
     */
    export namespace extension {
        /**
         * The type of extension view.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/extension.json
         * @platform desktop, mobile
         */
        export type ViewType = "tab" | "popup" | "sidebar";

        /**
         * True for content scripts running inside incognito tabs, and for extension pages running inside an incognito process. The latter only applies to extensions with 'split' incognito_behavior.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/extension.json
         * @platform desktop, mobile
         */
        export const inIncognitoContext: boolean;
        /**
         * Set for the lifetime of a callback if an ansychronous extension api has resulted in an error. If no error has occured lastError will be `undefined`.
         *
         * Only available in manifest_version 2 or earlier.
         *
         * @deprecated Please use {@link browser.runtime.lastError}.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/extension.json
         * @platform desktop, mobile
         */
        export const lastError: {
            /**
             * Description of the error that has taken place.
             */
            message: string;
        };

        /**
         * Fired when a request is sent from either an extension process or a content script.
         *
         * Not available in content scripts or devtools pages.
         *
         * @param request The request sent by the calling script.
         * @param sendResponse Function to call (at most once) when you have a response. The argument should be any JSON-ifiable object, or undefined if there is no response. If you have more than one `onRequest` listener in the same document, then only one may send a response.
         * @deprecated Firefox does not support this event; it does not exist at runtime. Please use {@link browser.runtime.onMessage}.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/extension.json
         */
        export const onRequest: WebExtensionEvent<(request: any, sender: browser.runtime.MessageSender, sendResponse: ((...args: any[]) => void)) => void>;

        /**
         * Fired when a request is sent from another extension.
         *
         * Not available in content scripts or devtools pages.
         *
         * @param request The request sent by the calling script.
         * @param sendResponse Function to call when you have a response. The argument should be any JSON-ifiable object, or undefined if there is no response.
         * @deprecated Firefox does not support this event; it does not exist at runtime. Please use {@link browser.runtime.onMessageExternal}.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/extension.json
         */
        export const onRequestExternal: WebExtensionEvent<(request: any, sender: browser.runtime.MessageSender, sendResponse: ((...args: any[]) => void)) => void>;

        /**
         * Returns the JavaScript 'window' object for the background page running inside the current extension. Returns null if the extension has no background page.
         *
         * Not available in content scripts or devtools pages.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/extension.json
         * @platform desktop, mobile
         */
        export function getBackgroundPage(): Window | null;

        /**
         * Converts a relative path within an extension install directory to a fully-qualified URL.
         *
         * Only available in manifest_version 2 or earlier.
         *
         * @param path A path to a resource within an extension expressed relative to its install directory.
         * @returns The fully-qualified URL to the resource.
         * @deprecated Please use {@link browser.runtime.getURL}.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/extension.json
         * @platform desktop, mobile
         */
        export function getURL(path: string): string;

        /**
         * Returns an array of the JavaScript 'window' objects for each of the pages running inside the current extension.
         *
         * Not available in content scripts or devtools pages.
         *
         * @returns Array of global objects
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/extension.json
         * @platform desktop, mobile
         */
        export function getViews(fetchProperties?: getViews.FetchProperties | null): Window[];
        export namespace getViews {
            export type FetchProperties = {
                /**
                 * Find a view according to a tab id. If this field is omitted, returns all views.
                 */
                tabId?: number | undefined;
                /**
                 * The type of view to get. If omitted, returns all views (including background pages and tabs). Valid values: 'tab', 'popup', 'sidebar'.
                 */
                type?: ViewType | undefined;
                /**
                 * The window to restrict the search to. If omitted, returns all views.
                 */
                windowId?: number | undefined;
            };
        }

        /**
         * Retrieves the state of the extension's access to the 'file://' scheme (as determined by the user-controlled 'Allow access to File URLs' checkbox.
         *
         * Not available in content scripts or devtools pages.
         *
         * @returns True if the extension can access the 'file://' scheme, false otherwise.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/extension.json
         * @platform desktop, mobile
         */
        export function isAllowedFileSchemeAccess(): globalThis.Promise<boolean>;
        export function isAllowedFileSchemeAccess(callback: ((isAllowedAccess: boolean) => void)): void;

        /**
         * Retrieves the state of the extension's access to Incognito-mode (as determined by the user-controlled 'Allowed in Incognito' checkbox.
         *
         * Not available in content scripts or devtools pages.
         *
         * @returns True if the extension has access to Incognito mode, false otherwise.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/extension.json
         * @platform desktop, mobile
         */
        export function isAllowedIncognitoAccess(): globalThis.Promise<boolean>;
        export function isAllowedIncognitoAccess(callback: ((isAllowedAccess: boolean) => void)): void;

        /**
         * Sets the value of the ap CGI parameter used in the extension's update URL.  This value is ignored for extensions that are hosted in the browser vendor's store.
         *
         * Not available in content scripts or devtools pages.
         *
         * @deprecated Firefox does not support this function; it does not exist at runtime.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/extension.json
         */
        export function setUpdateUrlData(data: string): void;

    }

    /**
     * The `browser.extensionTypes` API contains type declarations for WebExtensions.
     *
     * Not available in content scripts or devtools pages.
     *
     * @platform desktop, mobile
     */
    export namespace extensionTypes {
        /**
         * The origin of the CSS to inject, this affects the cascading order (priority) of the stylesheet.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/extension_types.json
         * @platform desktop, mobile
         */
        export type CSSOrigin = "user" | "author";

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/extension_types.json
         * @platform desktop, mobile
         */
        export type Date = number | globalThis.Date | (string & {});

        /**
         * The JavaScript world for a script to execute within. `ISOLATED` is the default execution environment of content scripts, `MAIN` is the web page's execution environment.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/extension_types.json
         * @platform desktop, mobile
         */
        export type ExecutionWorld = "ISOLATED" | "MAIN";

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/extension_types.json
         * @platform desktop, mobile
         */
        export type ExtensionFileOrCode = {
            file: browser.manifest.ExtensionURL;
        } | {
            code: string;
        };

        /**
         * Details about the format, quality, area and scale of the capture.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/extension_types.json
         * @platform desktop, mobile
         */
        export interface ImageDetails {
            /**
             * The format of the resulting image.  Default is `"jpeg"`.
             */
            format?: ImageFormat | undefined;
            /**
             * When format is `"jpeg"`, controls the quality of the resulting image.  This value is ignored for PNG images.  As quality is decreased, the resulting image will have more visual artifacts, and the number of bytes needed to store it will decrease.
             */
            quality?: number | undefined;
            /**
             * The area of the document to capture, in CSS pixels, relative to the page.  If omitted, capture the visible viewport.
             */
            rect?: {
                height: number;
                width: number;
                x: number;
                y: number;
            } | undefined;
            /**
             * If true, temporarily resets the scroll position of the document to 0. Only takes effect if rect is also specified.
             */
            resetScrollPosition?: boolean | undefined;
            /**
             * The scale of the resulting image.  Defaults to `devicePixelRatio`.
             */
            scale?: number | undefined;
        }

        /**
         * The format of an image.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/extension_types.json
         * @platform desktop, mobile
         */
        export type ImageFormat = "jpeg" | "png";

        /**
         * Details of the script or CSS to inject. Either the code or the file property must be set, but both may not be set at the same time.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/extension_types.json
         * @platform desktop, mobile
         */
        export interface InjectDetails {
            /**
             * If allFrames is `true`, implies that the JavaScript or CSS should be injected into all frames of current page. By default, it's `false` and is only injected into the top frame.
             */
            allFrames?: boolean | undefined;
            /**
             * JavaScript or CSS code to inject.
             *
             * **Warning:**
             * Be careful using the `code` parameter. Incorrect use of it may open your extension to [cross site scripting](https://en.wikipedia.org/wiki/Cross-site_scripting) attacks.
             */
            code?: string | undefined;
            /**
             * The css origin of the stylesheet to inject. Defaults to "author".
             */
            cssOrigin?: CSSOrigin | undefined;
            /**
             * JavaScript or CSS file to inject.
             */
            file?: string | undefined;
            /**
             * The ID of the frame to inject the script into. This may not be used in combination with `allFrames`.
             */
            frameId?: number | undefined;
            /**
             * If matchAboutBlank is true, then the code is also injected in about:blank and about:srcdoc frames if your extension has access to its parent document. Code cannot be inserted in top-level about:-frames. By default it is `false`.
             */
            matchAboutBlank?: boolean | undefined;
            /**
             * The soonest that the JavaScript or CSS will be injected into the tab. Defaults to "document_idle".
             */
            runAt?: RunAt | undefined;
        }

        /**
         * A plain JSON value
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/extension_types.json
         * @platform desktop, mobile
         */
        export type PlainJSONValue = null | number | boolean | PlainJSONValue[] | { [key: string]: PlainJSONValue } | (string & {});

        /**
         * The soonest that the JavaScript or CSS will be injected into the tab.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/extension_types.json
         * @platform desktop, mobile
         */
        export type RunAt = "document_start" | "document_end" | "document_idle";

    }

    /**
     * Use the `browser.find` API to interact with the browser's `Find` interface.
     *
     * Not available in content scripts or devtools pages.
     *
     * @permission find
     * @platform desktop
     */
    export namespace find {
        /**
         * Search for text in document and store found ranges in array, in document order.
         *
         * @param queryphrase The string to search for.
         * @param params Search parameters.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/find.json
         * @platform desktop
         */
        export function find(queryphrase: string, params?: find.Params | null): globalThis.Promise<{ count: number; rangeData?: { framePos: number; text: string; startTextNodePos: number; startOffset: number; endTextNodePos: number; endOffset: number }[]; rectData?: { text: string; rectsAndTexts: { rectList: { top: number; left: number; bottom: number; right: number }[]; textList: string[] } }[] }>;
        export namespace find {
            /**
             * Search parameters.
             */
            export type Params = {
                /**
                 * Find only ranges with case sensitive match.
                 */
                caseSensitive?: boolean | undefined;
                /**
                 * Find only ranges that match entire word.
                 */
                entireWord?: boolean | undefined;
                /**
                 * Return range data which provides range data in a serializable form.
                 */
                includeRangeData?: boolean | undefined;
                /**
                 * Return rectangle data which describes visual position of search results.
                 */
                includeRectData?: boolean | undefined;
                /**
                 * Find only ranges with diacritic sensitive match.
                 */
                matchDiacritics?: boolean | undefined;
                /**
                 * Tab to query. Defaults to the active tab.
                 */
                tabId?: number | undefined;
            };
        }

        /**
         * Highlight a range
         *
         * @param params highlightResults parameters
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/find.json
         * @platform desktop
         */
        export function highlightResults(params?: highlightResults.Params | null): globalThis.Promise<void>;
        export namespace highlightResults {
            /**
             * highlightResults parameters
             */
            export type Params = {
                /**
                 * Don't scroll to highlighted item.
                 */
                noScroll?: boolean | undefined;
                /**
                 * Found range to be highlighted. Default highlights all ranges.
                 */
                rangeIndex?: number | undefined;
                /**
                 * Tab to highlight. Defaults to the active tab.
                 */
                tabId?: number | undefined;
            };
        }

        /**
         * Remove all highlighting from previous searches.
         *
         * @param tabId Tab to highlight. Defaults to the active tab.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/find.json
         * @platform desktop
         */
        export function removeHighlighting(tabId?: number | null): globalThis.Promise<void>;

    }

    /**
     * Exposes the browser's profiler.
     *
     * Not available in content scripts or devtools pages.
     *
     * @permission geckoProfiler
     * @platform desktop
     */
    export namespace geckoProfiler {
        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/geckoProfiler.json
         * @platform desktop
         */
        export type ProfilerFeature = "java" | "js" | "mainthreadio" | "fileio" | "fileioall" | "nomarkerstacks" | "screenshots" | "seqstyle" | "stackwalk" | "jsallocations" | "nostacksampling" | "nativeallocations" | "ipcmessages" | "audiocallbacktracing" | "notimerresolutionchange" | "cpuallthreads" | "samplingallthreads" | "markersallthreads" | "unregisteredthreads" | "processcpu" | "power" | "responsiveness" | "cpufreq" | "bandwidth" | "memory" | "tracing" | "sandbox" | "flows" | "jssources";

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/geckoProfiler.json
         * @platform desktop
         */
        export type supports = "windowLength";

        /**
         * Fires when the profiler starts/stops running.
         *
         * @param isRunning Whether the profiler is running or not. Pausing the profiler will not affect this value.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/geckoProfiler.json
         * @platform desktop
         */
        export const onRunning: WebExtensionEvent<(isRunning: boolean) => void>;

        /**
         * Gathers the profile data from the current profiling session, and writes it to disk. The returned promise resolves to a path that locates the created file.
         *
         * @param fileName The name of the file inside the profile/profiler directory
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/geckoProfiler.json
         * @platform desktop
         */
        export function dumpProfileToFile(fileName: string): globalThis.Promise<void>;

        /**
         * Gathers the profile data from the current profiling session.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/geckoProfiler.json
         * @platform desktop
         */
        export function getProfile(): globalThis.Promise<Record<string, unknown>>;

        /**
         * Gathers the profile data from the current profiling session. The returned promise resolves to an array buffer that contains a JSON string.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/geckoProfiler.json
         * @platform desktop
         */
        export function getProfileAsArrayBuffer(): globalThis.Promise<ArrayBuffer>;

        /**
         * Gathers the profile data from the current profiling session. The returned promise resolves to an array buffer that contains a gzipped JSON string.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/geckoProfiler.json
         * @platform desktop
         */
        export function getProfileAsGzippedArrayBuffer(): globalThis.Promise<ArrayBuffer>;

        /**
         * Gets the debug symbols for a particular library.
         *
         * @param debugName The name of the library's debug file. For example, 'xul.pdb
         * @param breakpadId The Breakpad ID of the library
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/geckoProfiler.json
         * @platform desktop
         */
        export function getSymbols(debugName: string, breakpadId: string): globalThis.Promise<[addresses: Uint32Array, index: Uint32Array, buffer: Uint8Array]>;

        /**
         * Pauses the profiler, keeping any profile data that is already written.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/geckoProfiler.json
         * @platform desktop
         */
        export function pause(): globalThis.Promise<void>;

        /**
         * Resumes the profiler with the settings that were initially used to start it.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/geckoProfiler.json
         * @platform desktop
         */
        export function resume(): globalThis.Promise<void>;

        /**
         * Starts the profiler with the specified settings.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/geckoProfiler.json
         * @platform desktop
         */
        export function start(settings: start.Settings): globalThis.Promise<void>;
        export namespace start {
            export type Settings = {
                /**
                 * The maximum size in bytes of the buffer used to store profiling data. A larger value allows capturing a profile that covers a greater amount of time.
                 */
                bufferSize: number;
                /**
                 * A list of active features for the profiler.
                 */
                features: ProfilerFeature[];
                /**
                 * Interval in milliseconds between samples of profiling data. A smaller value will increase the detail of the profiles captured.
                 */
                interval: number;
                /**
                 * A list of thread names for which to capture profiles.
                 */
                threads?: string[] | undefined;
                /**
                 * The length of the window of time that's kept in the buffer. Any collected samples are discarded as soon as they are older than the number of seconds specified in this setting. Zero means no duration restriction.
                 */
                windowLength?: number | undefined;
            };
        }

        /**
         * Stops the profiler and discards any captured profile data.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/geckoProfiler.json
         * @platform desktop
         */
        export function stop(): globalThis.Promise<void>;

    }

    /**
     * Use the `browser.history` API to interact with the browser's record of visited pages. You can add, remove, and query for URLs in the browser's history. To override the history page with your own version, see Override Pages.
     *
     * Not available in content scripts or devtools pages.
     *
     * @permission history
     * @platform desktop
     */
    export namespace history {
        /**
         * An object encapsulating one result of a history query.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/history.json
         * @platform desktop
         */
        export interface HistoryItem {
            /**
             * The unique identifier for the item.
             */
            id: string;
            /**
             * When this page was last loaded, represented in milliseconds since the epoch.
             */
            lastVisitTime?: number | undefined;
            /**
             * The title of the page when it was last loaded.
             */
            title?: string | undefined;
            /**
             * The number of times the user has navigated to this page by typing in the address.
             */
            typedCount?: number | undefined;
            /**
             * The URL navigated to by a user.
             */
            url?: string | undefined;
            /**
             * The number of times the user has navigated to this page.
             */
            visitCount?: number | undefined;
        }

        /**
         * The transition type for this visit from its referrer.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/history.json
         * @platform desktop
         */
        export type TransitionType = "link" | "typed" | "auto_bookmark" | "auto_subframe" | "manual_subframe" | "generated" | "auto_toplevel" | "form_submit" | "reload" | "keyword" | "keyword_generated";

        /**
         * An object encapsulating one visit to a URL.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/history.json
         * @platform desktop
         */
        export interface VisitItem {
            /**
             * The unique identifier for the item.
             */
            id: string;
            /**
             * The visit ID of the referrer.
             */
            referringVisitId: string;
            /**
             * The transition type for this visit from its referrer.
             */
            transition: TransitionType;
            /**
             * The unique identifier for this visit.
             */
            visitId: string;
            /**
             * When this visit occurred, represented in milliseconds since the epoch.
             */
            visitTime?: number | undefined;
        }

        /**
         * Fired when the title of a URL is changed in the browser history.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/history.json
         * @platform desktop
         */
        export const onTitleChanged: WebExtensionEvent<(changed: onTitleChanged.Changed) => void>;
        export namespace onTitleChanged {
            export type Changed = {
                /**
                 * The new title for the URL.
                 */
                title: string;
                /**
                 * The URL for which the title has changed
                 */
                url: string;
            };
        }

        /**
         * Fired when one or more URLs are removed from the history service.  When all visits have been removed the URL is purged from history.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/history.json
         * @platform desktop
         */
        export const onVisitRemoved: WebExtensionEvent<(removed: onVisitRemoved.Removed) => void>;
        export namespace onVisitRemoved {
            export type Removed = {
                /**
                 * True if all history was removed.  If true, then urls will be empty.
                 */
                allHistory: boolean;
                urls: string[];
            };
        }

        /**
         * Fired when a URL is visited, providing the HistoryItem data for that URL.  This event fires before the page has loaded.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/history.json
         * @platform desktop
         */
        export const onVisited: WebExtensionEvent<(result: HistoryItem) => void>;

        /**
         * Adds a URL to the history with a default visitTime of the current time and a default transition type of "link".
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/history.json
         * @platform desktop
         */
        export function addUrl(details: addUrl.Details): globalThis.Promise<void>;
        export function addUrl(details: addUrl.Details, callback: (() => void)): void;
        export namespace addUrl {
            export type Details = {
                /**
                 * The title of the page.
                 */
                title?: string | undefined;
                /**
                 * The transition type for this visit from its referrer.
                 */
                transition?: TransitionType | undefined;
                /**
                 * The URL to add. Must be a valid URL that can be added to history.
                 */
                url: string;
                /**
                 * The date when this visit occurred.
                 */
                visitTime?: browser.extensionTypes.Date | undefined;
            };
        }

        /**
         * Deletes all items from the history.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/history.json
         * @platform desktop
         */
        export function deleteAll(): globalThis.Promise<void>;
        export function deleteAll(callback: (() => void)): void;

        /**
         * Removes all items within the specified date range from the history.  Pages will not be removed from the history unless all visits fall within the range.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/history.json
         * @platform desktop
         */
        export function deleteRange(range: deleteRange.Range): globalThis.Promise<void>;
        export function deleteRange(range: deleteRange.Range, callback: (() => void)): void;
        export namespace deleteRange {
            export type Range = {
                /**
                 * Items added to history before this date.
                 */
                endTime: browser.extensionTypes.Date;
                /**
                 * Items added to history after this date.
                 */
                startTime: browser.extensionTypes.Date;
            };
        }

        /**
         * Removes all occurrences of the given URL from the history.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/history.json
         * @platform desktop
         */
        export function deleteUrl(details: deleteUrl.Details): globalThis.Promise<void>;
        export function deleteUrl(details: deleteUrl.Details, callback: (() => void)): void;
        export namespace deleteUrl {
            export type Details = {
                /**
                 * The URL to remove.
                 */
                url: string;
            };
        }

        /**
         * Retrieves information about visits to a URL.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/history.json
         * @platform desktop
         */
        export function getVisits(details: getVisits.Details): globalThis.Promise<VisitItem[]>;
        export function getVisits(details: getVisits.Details, callback: ((results: VisitItem[]) => void)): void;
        export namespace getVisits {
            export type Details = {
                /**
                 * The URL for which to retrieve visit information.  It must be in the format as returned from a call to history.search.
                 */
                url: string;
            };
        }

        /**
         * Searches the history for the last visit time of each page matching the query.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/history.json
         * @platform desktop
         */
        export function search(query: search.Query): globalThis.Promise<HistoryItem[]>;
        export function search(query: search.Query, callback: ((results: HistoryItem[]) => void)): void;
        export namespace search {
            export type Query = {
                /**
                 * Limit results to those visited before this date.
                 */
                endTime?: browser.extensionTypes.Date | undefined;
                /**
                 * The maximum number of results to retrieve.  Defaults to 100.
                 */
                maxResults?: number | undefined;
                /**
                 * Limit results to those visited after this date. If not specified, this defaults to 24 hours in the past.
                 */
                startTime?: browser.extensionTypes.Date | undefined;
                /**
                 * A free-text query to the history service.  Leave empty to retrieve all pages.
                 */
                text: string;
            };
        }

    }

    /**
     * Use the `browser.i18n` infrastructure to implement internationalization across your whole app or extension.
     *
     * Also available in content scripts and devtools pages.
     *
     * @platform desktop, mobile
     */
    export namespace i18n {
        /**
         * An ISO language code such as `en` or `fr`. For a complete list of languages supported by this method, see [kLanguageInfoTable](http://src.chromium.org/viewvc/chrome/trunk/src/third_party/cld/languages/internal/languages.cc). For an unknown language, `und` will be returned, which means that [percentage] of the text is unknown to CLD
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/i18n.json
         * @platform desktop, mobile
         */
        export type LanguageCode = string;

        /**
         * Detects the language of the provided text using CLD.
         *
         * @param text User input string to be translated.
         * @returns LanguageDetectionResult object that holds detected langugae reliability and array of DetectedLanguage
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/i18n.json
         * @platform desktop, mobile
         */
        export function detectLanguage(text: string): globalThis.Promise<detectLanguage.Result>;
        export function detectLanguage(text: string, callback: ((result: detectLanguage.Result) => void)): void;
        export namespace detectLanguage {
            /**
             * LanguageDetectionResult object that holds detected langugae reliability and array of DetectedLanguage
             */
            export type Result = {
                /**
                 * CLD detected language reliability
                 */
                isReliable: boolean;
                /**
                 * array of detectedLanguage
                 */
                languages: {
                    language: LanguageCode;
                    /**
                     * The percentage of the detected language
                     */
                    percentage: number;
                }[];
            };
        }

        /**
         * Gets the accept-languages of the browser. This is different from the locale used by the browser; to get the locale, use {@link browser.i18n.getUILanguage}.
         *
         * @returns Array of LanguageCode
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/i18n.json
         * @platform desktop, mobile
         */
        export function getAcceptLanguages(): globalThis.Promise<LanguageCode[]>;
        export function getAcceptLanguages(callback: ((languages: LanguageCode[]) => void)): void;

        /**
         * Gets the localized string for the specified message. If the message is missing, this method returns an empty string (''). If the format of the `getMessage()` call is wrong — for example, _messageName_ is not a string or the _substitutions_ array has more than 9 elements — this method returns `undefined`.
         *
         * @param messageName The name of the message, as specified in the `messages.json` file.
         * @param substitutions Substitution strings, if the message requires any.
         * @returns Message localized for current locale.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/i18n.json
         * @platform desktop, mobile
         */
        export function getMessage(messageName: string, substitutions?: any): string;

        /**
         * Gets the preferred locales of the operating system. This is different from the locales set in the browser; to get those, use {@link browser.i18n.getAcceptLanguages}.
         *
         * @returns Array of LanguageCode
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/i18n.json
         * @platform desktop, mobile
         */
        export function getPreferredSystemLanguages(): globalThis.Promise<LanguageCode[]>;
        export function getPreferredSystemLanguages(callback: ((languages: LanguageCode[]) => void)): void;

        /**
         * Gets the browser UI language of the browser. This is different from {@link browser.i18n.getAcceptLanguages} which returns the preferred user languages.
         *
         * @returns The browser UI language code such as en-US or fr-FR.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/i18n.json
         * @platform desktop, mobile
         */
        export function getUILanguage(): string;

    }

    /**
     * Use the chrome.identity API to get OAuth2 access tokens.
     *
     * Not available in content scripts or devtools pages.
     *
     * @permission identity
     * @platform desktop
     */
    export namespace identity {
        /**
         * An object encapsulating an OAuth account id.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/identity.json
         * @platform desktop
         */
        export interface AccountInfo {
            /**
             * A unique identifier for the account. This ID will not change for the lifetime of the account.
             */
            id: string;
        }

        /**
         * Fired when signin state changes for an account on the user's profile.
         *
         * @deprecated Firefox does not support this event; it does not exist at runtime.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/identity.json
         */
        export const onSignInChanged: WebExtensionEvent<(account: AccountInfo, signedIn: boolean) => void>;

        /**
         * Retrieves a list of AccountInfo objects describing the accounts present on the profile.
         *
         * @deprecated Firefox does not support this function; it does not exist at runtime.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/identity.json
         */
        export function getAccounts(): globalThis.Promise<AccountInfo[]>;
        export function getAccounts(callback: ((results: AccountInfo[]) => void)): void;

        /**
         * Gets an OAuth2 access token using the client ID and scopes specified in the oauth2 section of manifest.json.
         *
         * @deprecated Firefox does not support this function; it does not exist at runtime.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/identity.json
         */
        export function getAuthToken(details?: getAuthToken.Details | null): globalThis.Promise<AccountInfo[]>;
        export function getAuthToken(details: getAuthToken.Details | null | undefined, callback: ((results: AccountInfo[]) => void)): void;
        export function getAuthToken(callback: ((results: AccountInfo[]) => void)): void;
        export namespace getAuthToken {
            export type Details = {
                account?: AccountInfo | undefined;
                interactive?: boolean | undefined;
                scopes?: string[] | undefined;
            };
        }

        /**
         * Retrieves email address and obfuscated gaia id of the user signed into a profile.
         *
         * @deprecated Firefox does not support this function; it does not exist at runtime.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/identity.json
         */
        export function getProfileUserInfo(): globalThis.Promise<getProfileUserInfo.Result>;
        export function getProfileUserInfo(callback: ((userinfo: getProfileUserInfo.Result) => void)): void;
        export namespace getProfileUserInfo {
            export type Result = {
                email: string;
                id: string;
            };
        }

        /**
         * Generates a redirect URL to be used in |launchWebAuthFlow|.
         *
         * @param path The path appended to the end of the generated URL.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/identity.json
         * @platform desktop
         */
        export function getRedirectURL(path?: string | null): string;

        /**
         * Starts an auth flow at the specified URL.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/identity.json
         * @platform desktop
         */
        export function launchWebAuthFlow(details: launchWebAuthFlow.Details): globalThis.Promise<string | undefined>;
        export function launchWebAuthFlow(details: launchWebAuthFlow.Details, callback: (( responseUrl: string | undefined) => void)): void;
        export namespace launchWebAuthFlow {
            export type Details = {
                interactive?: boolean | undefined;
                url: browser.manifest.HttpURL;
            };
        }

        /**
         * Removes an OAuth2 access token from the Identity API's token cache.
         *
         * @deprecated Firefox does not support this function; it does not exist at runtime.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/identity.json
         */
        export function removeCachedAuthToken(details: removeCachedAuthToken.Details): globalThis.Promise<removeCachedAuthToken.Result>;
        export function removeCachedAuthToken(details: removeCachedAuthToken.Details, callback: ((userinfo: removeCachedAuthToken.Result) => void)): void;
        export namespace removeCachedAuthToken {
            export type Details = {
                token: string;
            };
            export type Result = {
                email: string;
                id: string;
            };
        }

    }

    /**
     * Use the `browser.idle` API to detect when the machine's idle state changes.
     *
     * Not available in content scripts or devtools pages.
     *
     * @permission idle
     * @platform desktop, mobile
     */
    export namespace idle {
        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/idle.json
         * @platform desktop, mobile
         */
        export type IdleState = "active" | "idle";

        /**
         * Fired when the system changes to an active or idle state. The event fires with "idle" if the the user has not generated any input for a specified number of seconds, and "active" when the user generates input on an idle system.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/idle.json
         * @platform desktop, mobile
         */
        export const onStateChanged: WebExtensionEvent<(newState: IdleState) => void>;

        /**
         * Returns "idle" if the user has not generated any input for a specified number of seconds, or "active" otherwise.
         *
         * @param detectionIntervalInSeconds The system is considered idle if detectionIntervalInSeconds seconds have elapsed since the last user input detected.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/idle.json
         * @platform desktop, mobile
         */
        export function queryState(detectionIntervalInSeconds: number): globalThis.Promise<IdleState>;
        export function queryState(detectionIntervalInSeconds: number, callback: ((newState: IdleState) => void)): void;

        /**
         * Sets the interval, in seconds, used to determine when the system is in an idle state for onStateChanged events. The default interval is 60 seconds.
         *
         * @param intervalInSeconds Threshold, in seconds, used to determine when the system is in an idle state.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/idle.json
         * @platform desktop, mobile
         */
        export function setDetectionInterval(intervalInSeconds: number): void;

    }

    /**
     * The `browser.management` API provides ways to manage the list of extensions that are installed and running.
     *
     * Not available in content scripts or devtools pages.
     *
     * @platform desktop, mobile
     */
    export namespace management {
        /**
         * A reason the item is disabled.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/management.json
         * @platform desktop, mobile
         */
        export type ExtensionDisabledReason = "unknown" | "permissions_increase";

        /**
         * Information about an installed extension.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/management.json
         * @platform desktop, mobile
         */
        export interface ExtensionInfo {
            /**
             * The description of this extension.
             */
            description: string;
            /**
             * A reason the item is disabled.
             */
            disabledReason?: ExtensionDisabledReason | undefined;
            /**
             * Whether it is currently enabled or disabled.
             */
            enabled: boolean;
            /**
             * The URL of the homepage of this extension.
             */
            homepageUrl?: string | undefined;
            /**
             * Returns a list of host based permissions.
             */
            hostPermissions?: string[] | undefined;
            /**
             * A list of icon information. Note that this just reflects what was declared in the manifest, and the actual image at that url may be larger or smaller than what was declared, so you might consider using explicit width and height attributes on img tags referencing these images. See the manifest documentation on icons for more details.
             */
            icons?: IconInfo[] | undefined;
            /**
             * The extension's unique identifier.
             */
            id: string;
            /**
             * How the extension was installed.
             */
            installType: ExtensionInstallType;
            /**
             * Whether this extension can be disabled or uninstalled by the user.
             */
            mayDisable: boolean;
            /**
             * The name of this extension.
             */
            name: string;
            /**
             * The url for the item's options page, if it has one.
             */
            optionsUrl: string;
            /**
             * Returns a list of API based permissions.
             */
            permissions?: string[] | undefined;
            /**
             * A short version of the name of this extension.
             */
            shortName?: string | undefined;
            /**
             * The type of this extension, 'extension' or 'theme'.
             */
            type: ExtensionType;
            /**
             * The update URL of this extension.
             */
            updateUrl?: string | undefined;
            /**
             * The version of this extension.
             */
            version: string;
            /**
             * The version name of this extension if the manifest specified one.
             */
            versionName?: string | undefined;
        }

        /**
         * How the extension was installed.
         *
         * - `development`: The extension was loaded unpacked in developer mode,
         * - `normal`: The extension was installed normally via an .xpi file
         * - `sideload`: The extension was installed by other software on the machine
         * - `admin`: The extension was installed by policy
         * - `other`: The extension was installed by other means.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/management.json
         * @platform desktop, mobile
         */
        export type ExtensionInstallType = "development" | "normal" | "sideload" | "admin" | "other";

        /**
         * The type of this extension, 'extension' or 'theme'.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/management.json
         * @platform desktop, mobile
         */
        export type ExtensionType = "extension" | "theme";

        /**
         * Information about an icon belonging to an extension.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/management.json
         * @platform desktop, mobile
         */
        export interface IconInfo {
            /**
             * A number representing the width and height of the icon. Likely values include (but are not limited to) 128, 48, 24, and 16.
             */
            size: number;
            /**
             * The URL for this icon image. To display a grayscale version of the icon (to indicate that an extension is disabled, for example), append `?grayscale=true` to the URL.
             */
            url: string;
        }

        /**
         * Fired when an addon has been disabled.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/management.json
         * @permission management
         * @platform desktop, mobile
         */
        export const onDisabled: WebExtensionEvent<(info: ExtensionInfo) => void>;

        /**
         * Fired when an addon has been enabled.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/management.json
         * @permission management
         * @platform desktop, mobile
         */
        export const onEnabled: WebExtensionEvent<(info: ExtensionInfo) => void>;

        /**
         * Fired when an addon has been installed.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/management.json
         * @permission management
         * @platform desktop, mobile
         */
        export const onInstalled: WebExtensionEvent<(info: ExtensionInfo) => void>;

        /**
         * Fired when an addon has been uninstalled.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/management.json
         * @permission management
         * @platform desktop, mobile
         */
        export const onUninstalled: WebExtensionEvent<(info: ExtensionInfo) => void>;

        /**
         * Returns information about the installed extension that has the given ID.
         *
         * @param id The ID from an item of {@link browser.management.ExtensionInfo}.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/management.json
         * @permission management
         * @platform desktop, mobile
         */
        export function get(id: browser.manifest.ExtensionID): globalThis.Promise<ExtensionInfo>;
        export function get(id: browser.manifest.ExtensionID, callback: ((result: ExtensionInfo) => void)): void;

        /**
         * Returns a list of information about installed extensions.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/management.json
         * @permission management
         * @platform desktop, mobile
         */
        export function getAll(): globalThis.Promise<ExtensionInfo[]>;
        export function getAll(callback: ((result: ExtensionInfo[]) => void)): void;

        /**
         * Returns information about the calling extension. Note: This function can be used without requesting the 'management' permission in the manifest.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/management.json
         * @platform desktop, mobile
         */
        export function getSelf(): globalThis.Promise<ExtensionInfo>;
        export function getSelf(callback: ((result: ExtensionInfo) => void)): void;

        /**
         * Installs and enables a theme extension from the given url.
         *
         * Must be called from a user input handler.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/management.json
         * @permission management
         * @platform desktop, mobile
         */
        export function install(options: install.Options): globalThis.Promise<install.Result>;
        export function install(options: install.Options, callback: ((result: install.Result) => void)): void;
        export namespace install {
            export type Options = {
                /**
                 * A hash of the XPI file, using sha256 or stronger.
                 */
                hash?: string | undefined;
                /**
                 * URL pointing to the XPI file on addons.mozilla.org or similar.
                 */
                url: browser.manifest.HttpURL;
            };
            export type Result = {
                id: browser.manifest.ExtensionID;
            };
        }

        /**
         * Enables or disables the given add-on.
         *
         * @param id ID of the add-on to enable/disable.
         * @param enabled Whether to enable or disable the add-on.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/management.json
         * @permission management
         * @platform desktop, mobile
         */
        export function setEnabled(id: string, enabled: boolean): globalThis.Promise<void>;
        export function setEnabled(id: string, enabled: boolean, callback: (() => void)): void;

        /**
         * Uninstalls the calling extension. Note: This function can be used without requesting the 'management' permission in the manifest.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/management.json
         * @platform desktop, mobile
         */
        export function uninstallSelf(options?: uninstallSelf.Options | null): globalThis.Promise<void>;
        export function uninstallSelf(options: uninstallSelf.Options | null | undefined, callback: (() => void)): void;
        export function uninstallSelf(callback: (() => void)): void;
        export namespace uninstallSelf {
            export type Options = {
                /**
                 * The message to display to a user when being asked to confirm removal of the extension.
                 */
                dialogMessage?: string | undefined;
                /**
                 * Whether or not a confirm-uninstall dialog should prompt the user. Defaults to false.
                 */
                showConfirmDialog?: boolean | undefined;
            };
        }

    }

    /**
     * Not available in content scripts or devtools pages.
     *
     * @platform desktop, mobile
     */
    export namespace manifest {
        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop, mobile
         */
        export interface ActionManifest {
            /**
             * Deprecated in Manifest V3.
             */
            browser_style?: boolean | undefined;
            /**
             * Defines the location the browserAction will appear by default.  The default location is navbar.
             */
            default_area?: "navbar" | "menupanel" | "tabstrip" | "personaltoolbar" | undefined;
            default_icon?: IconPath | undefined;
            default_popup?: string | undefined;
            default_title?: string | undefined;
            /**
             * Specifies icons to use for dark and light themes
             */
            theme_icons?: ThemeIcons[] | undefined;
        }

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         * @platform desktop, mobile
         */
        export interface BrowserSpecificSettings {
            gecko?: FirefoxSpecificProperties | undefined;
            gecko_android?: GeckoAndroidSpecificProperties | undefined;
        }

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/builtin_widget.json
         * @platform desktop
         */
        export interface BuiltinWidget {
            /**
             * Size the widget is displayed at until one is chosen. Defaults to the first of sizes.
             */
            default_size?: WidgetSize | undefined;
            /**
             * Path to the widget content.
             */
            page: ExtensionURL;
            /**
             * Pref branch that stores whether the widget is enabled and the size chosen for it, in `<pref_branch>`.enabled and `<pref_branch>`.size.
             */
            pref_branch?: string | undefined;
            /**
             * Sizes the widget can be displayed at.
             */
            sizes: WidgetSize[];
        }

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         * @platform desktop, mobile
         */
        export type CommonDataCollectionPermission = "authenticationInfo" | "bookmarksInfo" | "browsingActivity" | "financialAndPaymentInfo" | "healthInfo" | "locationInfo" | "personalCommunications" | "personallyIdentifyingInfo" | "searchTerms" | "websiteActivity" | "websiteContent";

        /**
         * Details of the script or CSS to inject. Either the code or the file property must be set, but both may not be set at the same time. Based on InjectDetails, but using underscore rather than camel case naming conventions.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         * @platform desktop, mobile
         */
        export interface ContentScript {
            /**
             * If allFrames is `true`, implies that the JavaScript or CSS should be injected into all frames of current page. By default, it's `false` and is only injected into the top frame.
             */
            all_frames?: boolean | undefined;
            /**
             * The list of CSS files to inject
             */
            css?: ExtensionURL[] | undefined;
            css_origin?: browser.extensionTypes.CSSOrigin | undefined;
            exclude_globs?: string[] | undefined;
            exclude_matches?: MatchPattern[] | undefined;
            include_globs?: string[] | undefined;
            /**
             * The list of JS files to inject
             */
            js?: ExtensionURL[] | undefined;
            /**
             * If match_about_blank is true, then the code is also injected in about:blank and about:srcdoc frames if your extension has access to its parent document. Ignored if match_origin_as_fallback is specified. By default it is `false`.
             */
            match_about_blank?: boolean | undefined;
            /**
             * If match_origin_as_fallback is true, then the code is also injected in about:, data:, blob: when their origin matches the pattern in 'matches', even if the actual document origin is opaque (due to the use of CSP sandbox or iframe sandbox). Match patterns in 'matches' must specify a wildcard path glob. By default it is `false`.
             */
            match_origin_as_fallback?: boolean | undefined;
            matches: MatchPattern[];
            /**
             * The soonest that the JavaScript or CSS will be injected into the tab. Defaults to "document_idle".
             */
            run_at?: browser.extensionTypes.RunAt | undefined;
            /**
             * The JavaScript world for a script to execute within. Defaults to "ISOLATED".
             */
            world?: browser.extensionTypes.ExecutionWorld | undefined;
        }

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         * @platform desktop, mobile
         */
        export type DataCollectionPermission = CommonDataCollectionPermission | "none";

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         * @platform desktop, mobile
         */
        export interface DeprecatedApplications {
            gecko?: FirefoxSpecificProperties | undefined;
            /**
             * @deprecated Firefox does not support this property and rejects an object that includes it.
             */
            readonly gecko_android?: GeckoAndroidSpecificProperties | undefined;
        }

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         * @platform desktop, mobile
         */
        export type ExtensionFileUrl = string;

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         * @platform desktop, mobile
         */
        export type ExtensionID = (string & {});

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         * @platform desktop, mobile
         */
        export type ExtensionURL = string;

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         * @platform desktop, mobile
         */
        export interface FirefoxSpecificProperties {
            admin_install_only?: boolean | undefined;
            data_collection_permissions?: {
                has_previous_consent?: boolean | undefined;
                optional?: OptionalDataCollectionPermission[] | undefined;
                required?: DataCollectionPermission[] | undefined;
            } | undefined;
            id?: ExtensionID | undefined;
            strict_max_version?: string | undefined;
            strict_min_version?: string | undefined;
            update_url?: string | undefined;
        }

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         * @platform desktop, mobile
         */
        export interface GeckoAndroidSpecificProperties {
            strict_max_version?: string | undefined;
            strict_min_version?: string | undefined;
        }

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         * @platform desktop, mobile
         */
        export type HttpURL = string;

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         * @platform desktop, mobile
         */
        export type IconImageData = { [key: number]: ImageData } | ImageData;

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         * @platform desktop, mobile
         */
        export type IconPath = { [key: number]: ExtensionFileUrl } | ExtensionFileUrl;

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         * @platform desktop, mobile
         */
        export type ImageData = globalThis.ImageData;

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         * @platform desktop, mobile
         */
        export type ImageDataOrExtensionURL = string;

        /**
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/commands.json
         * @platform desktop
         */
        export type KeyName = string;

        /**
         * Common properties for all manifest.json files
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         * @platform desktop, mobile
         */
        export interface ManifestBase {
            /**
             * The applications property is deprecated, please use 'browser_specific_settings'
             *
             * Only available in manifest_version 2 or earlier.
             */
            applications?: DeprecatedApplications | undefined;
            author?: string | undefined;
            browser_specific_settings?: BrowserSpecificSettings | undefined;
            description?: string | undefined;
            developer?: {
                name?: string | undefined;
                url?: string | undefined;
            } | undefined;
            homepage_url?: string | undefined;
            install_origins?: string[] | undefined;
            manifest_version: number;
            /**
             * Name must be at least 2, and should be at most 75 characters
             */
            name: string;
            short_name?: string | undefined;
            version: string;
        }

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         * @platform desktop, mobile
         */
        export type MatchPattern = "<all_urls>" | MatchPatternRestricted | MatchPatternUnestricted;

        /**
         * Same as MatchPattern above, but excludes `<all_urls>`
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         * @platform desktop, mobile
         */
        export type MatchPatternRestricted = (string & {});

        /**
         * Mostly unrestricted match patterns for privileged add-ons. This should technically be rejected for unprivileged add-ons, but, reasons. The MatchPattern class will still refuse privileged schemes for those extensions.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         * @platform desktop, mobile
         */
        export type MatchPatternUnestricted = (string & {});

        /**
         * Represents a native manifest file
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/native_manifest.json
         * @platform desktop, mobile
         */
        export type NativeManifest = {
            allowed_extensions: browser.manifest.ExtensionID[];
            description: string;
            name: string;
            path: string;
            type: "pkcs11" | "stdio";
        } | {
            data: Record<string, any>;
            description: string;
            name: browser.manifest.ExtensionID;
            type: "storage";
        };

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         * @platform desktop, mobile
         */
        export type OptionalDataCollectionPermission = CommonDataCollectionPermission | "technicalAndInteraction";

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         * @platform desktop, mobile
         */
        export type OptionalOnlyPermission =  | "trialML" | "userScripts";

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         * @platform desktop, mobile
         */
        export type OptionalPermission = OptionalPermissionNoPrompt | "clipboardRead" | "clipboardWrite" | "geolocation" | "notifications" | "browserSettings" | "browsingData" | "declarativeNetRequestFeedback" | "downloads" | "downloads.open" | "management" | "proxy" | "privacy" | "nativeMessaging" | "webNavigation" | "bookmarks" | "devtools" | "find" | "history" | "pkcs11" | "sessions" | "tabs" | "tabHide" | "topSites";

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         * @platform desktop, mobile
         */
        export type OptionalPermissionNoPrompt = "idle" | "cookies" | "publicSuffix" | "scripting" | "webRequest" | "webRequestAuthProvider" | "webRequestBlocking" | "webRequestFilterResponse" | "webRequestFilterResponse.serviceWorkerScript" | "menus.overrideContext" | "search" | "tabGroups" | "activeTab";

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         * @platform desktop, mobile
         */
        export type OptionalPermissionOrOrigin = OptionalPermission | OptionalOnlyPermission | MatchPattern;

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         * @platform desktop, mobile
         */
        export type Permission = PermissionNoPrompt | OptionalPermission | "declarativeNetRequest" | (string & {});

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         * @platform desktop, mobile
         */
        export type PermissionNoPrompt = OptionalPermissionNoPrompt | PermissionPrivileged | "alarms" | "storage" | "unlimitedStorage" | "captivePortal" | "contextualIdentities" | "declarativeNetRequestWithHostAccess" | "dns" | "geckoProfiler" | "identity" | "theme" | "menus" | "contextMenus";

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         * @platform desktop, mobile
         */
        export type PermissionOrOrigin = Permission | MatchPattern;

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         * @platform desktop, mobile
         */
        export type PermissionPrivileged = "mozillaAddons" | "activityLog" | "networkStatus" | "telemetry";

        /**
         * Represents a protocol handler definition.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/extension_protocol_handlers.json
         * @platform desktop, mobile
         */
        export interface ProtocolHandler {
            /**
             * A user-readable title string for the protocol handler. This will be displayed to the user in interface objects as needed.
             */
            name: string;
            /**
             * The protocol the site wishes to handle, specified as a string. For example, you can register to handle SMS text message links by registering to handle the "sms" scheme.
             */
            protocol: "bitcoin" | "dat" | "dweb" | "ftp" | "geo" | "gopher" | "im" | "ipfs" | "ipns" | "irc" | "ircs" | "magnet" | "mailto" | "matrix" | "mms" | "news" | "nntp" | "sip" | "sms" | "smsto" | "ssb" | "ssh" | "tel" | "urn" | "webcal" | "wtai" | "xmpp" | (string & {});
            /**
             * The URL of the handler, as a string. This string should include "%s" as a placeholder which will be replaced with the escaped URL of the document to be handled. This URL might be a true URL, or it could be a phone number, email address, or so forth.
             */
            uriTemplate: ExtensionURL | HttpURL;
        }

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/theme.json
         * @platform desktop, mobile
         */
        export type ThemeBackground = ImageDataOrExtensionURL | ThemeCSSGradient;

        /**
         * A CSS gradient that can be used as a theme background, in addition to image assets. The single property name selects the gradient function, and its value holds the gradient's arguments, e.g. `{ "linear-gradient": "to bottom, #FF6BBA, #FFC999" }`.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/theme.json
         * @platform desktop, mobile
         */
        export type ThemeCSSGradient = {
            "linear-gradient": string;
        } | {
            "radial-gradient": string;
        } | {
            "conic-gradient": string;
        } | {
            "repeating-linear-gradient": string;
        } | {
            "repeating-radial-gradient": string;
        } | {
            "repeating-conic-gradient": string;
        };

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/theme.json
         * @platform desktop, mobile
         */
        export type ThemeColor = [number, number, number] | [number, number, number, number] | (string & {});

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/theme.json
         * @platform desktop, mobile
         */
        export interface ThemeExperiment {
            colors?: { [key: string]: string } | undefined;
            images?: { [key: string]: string } | undefined;
            properties?: { [key: string]: string } | undefined;
            stylesheet?: ExtensionURL | undefined;
        }

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         * @platform desktop, mobile
         */
        export interface ThemeIcons {
            /**
             * The dark icon to use for light themes
             */
            dark: ExtensionURL;
            /**
             * A light icon to use for dark themes
             */
            light: ExtensionURL;
            /**
             * The size of the icons
             */
            size: number;
        }

        /**
         * Contents of manifest.json for a static theme
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/theme.json
         * @platform desktop, mobile
         */
        export interface ThemeManifest {
            /**
             * The applications property is deprecated, please use 'browser_specific_settings'
             *
             * Only available in manifest_version 2 or earlier.
             */
            applications?: DeprecatedApplications | undefined;
            author?: string | undefined;
            browser_specific_settings?: BrowserSpecificSettings | undefined;
            dark_theme?: ThemeType | undefined;
            default_locale?: string | undefined;
            description?: string | undefined;
            developer?: {
                name?: string | undefined;
                url?: string | undefined;
            } | undefined;
            homepage_url?: string | undefined;
            icons?: { [key: number]: string } | undefined;
            install_origins?: string[] | undefined;
            manifest_version: number;
            /**
             * Name must be at least 2, and should be at most 75 characters
             */
            name: string;
            short_name?: string | undefined;
            theme: ThemeType;
            theme_experiment?: ThemeExperiment | undefined;
            version: string;
        }

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/theme.json
         * @platform desktop, mobile
         */
        export interface ThemeType {
            colors?: {
                /**
                 * @deprecated Unsupported colors property, use 'theme.colors.frame', this alias is ignored in Firefox >= 70.
                 */
                accentcolor?: ThemeColor | undefined;
                bookmark_text?: ThemeColor | undefined;
                button_background_active?: ThemeColor | undefined;
                button_background_hover?: ThemeColor | undefined;
                frame?: ThemeColor | undefined;
                frame_inactive?: ThemeColor | undefined;
                icons?: ThemeColor | undefined;
                icons_attention?: ThemeColor | undefined;
                ntp_background?: ThemeColor | undefined;
                ntp_card_background?: ThemeColor | undefined;
                ntp_text?: ThemeColor | undefined;
                popup?: ThemeColor | undefined;
                popup_border?: ThemeColor | undefined;
                popup_highlight?: ThemeColor | undefined;
                popup_highlight_text?: ThemeColor | undefined;
                popup_text?: ThemeColor | undefined;
                sidebar?: ThemeColor | undefined;
                sidebar_border?: ThemeColor | undefined;
                sidebar_highlight?: ThemeColor | undefined;
                sidebar_highlight_text?: ThemeColor | undefined;
                sidebar_text?: ThemeColor | undefined;
                tab_background_separator?: ThemeColor | undefined;
                tab_background_text?: ThemeColor | undefined;
                tab_line?: ThemeColor | undefined;
                tab_loading?: ThemeColor | undefined;
                tab_selected?: ThemeColor | undefined;
                tab_text?: ThemeColor | undefined;
                /**
                 * @deprecated Unsupported color property, use 'theme.colors.tab_background_text', this alias is ignored in Firefox >= 70.
                 */
                textcolor?: ThemeColor | undefined;
                toolbar?: ThemeColor | undefined;
                toolbar_bottom_separator?: ThemeColor | undefined;
                toolbar_field?: ThemeColor | undefined;
                toolbar_field_border?: ThemeColor | undefined;
                toolbar_field_border_focus?: ThemeColor | undefined;
                toolbar_field_focus?: ThemeColor | undefined;
                toolbar_field_highlight?: ThemeColor | undefined;
                toolbar_field_highlight_text?: ThemeColor | undefined;
                /**
                 * @deprecated This color property is ignored in Firefox >= 89.
                 */
                toolbar_field_separator?: ThemeColor | undefined;
                toolbar_field_text?: ThemeColor | undefined;
                toolbar_field_text_focus?: ThemeColor | undefined;
                /**
                 * This color property is an alias of 'bookmark_text'.
                 */
                toolbar_text?: ThemeColor | undefined;
                toolbar_top_separator?: ThemeColor | undefined;
                toolbar_vertical_separator?: ThemeColor | undefined;
            } | undefined;
            images?: {
                additional_backgrounds?: ThemeBackground[] | undefined;
                /**
                 * @deprecated Unsupported images property, use 'theme.images.theme_frame', this alias is ignored in Firefox >= 70.
                 */
                headerURL?: ImageDataOrExtensionURL | undefined;
                theme_frame?: ThemeBackground | undefined;
            } | undefined;
            properties?: {
                additional_backgrounds_alignment?: ("bottom" | "center" | "left" | "right" | "top" | "center bottom" | "center center" | "center top" | "left bottom" | "left center" | "left top" | "right bottom" | "right center" | "right top")[] | undefined;
                additional_backgrounds_size?: string[] | undefined;
                additional_backgrounds_tiling?: ("no-repeat" | "repeat" | "repeat-x" | "repeat-y")[] | undefined;
                backgrounds_area?: "auto" | "window" | "top_toolbars" | undefined;
                color_scheme?: "auto" | "light" | "dark" | "system" | undefined;
                content_color_scheme?: "auto" | "light" | "dark" | "system" | undefined;
            } | undefined;
        }

        /**
         * @deprecated An unexpected property was found in the WebExtension manifest.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         * @platform desktop, mobile
         */
        export type UnrecognizedProperty = any;

        /**
         * Represents a WebExtension dictionary manifest.json file
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         * @platform desktop, mobile
         */
        export interface WebExtensionDictionaryManifest {
            /**
             * The applications property is deprecated, please use 'browser_specific_settings'
             *
             * Only available in manifest_version 2 or earlier.
             */
            applications?: DeprecatedApplications | undefined;
            author?: string | undefined;
            browser_specific_settings?: BrowserSpecificSettings | undefined;
            description?: string | undefined;
            developer?: {
                name?: string | undefined;
                url?: string | undefined;
            } | undefined;
            dictionaries: { [key: string]: string };
            homepage_url?: string | undefined;
            install_origins?: string[] | undefined;
            manifest_version: number;
            /**
             * Name must be at least 2, and should be at most 75 characters
             */
            name: string;
            short_name?: string | undefined;
            version: string;
        }

        /**
         * Represents a WebExtension language pack manifest.json file
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         * @platform desktop, mobile
         */
        export interface WebExtensionLangpackManifest {
            /**
             * The applications property is deprecated, please use 'browser_specific_settings'
             *
             * Only available in manifest_version 2 or earlier.
             */
            applications?: DeprecatedApplications | undefined;
            author?: string | undefined;
            browser_specific_settings?: BrowserSpecificSettings | undefined;
            description?: string | undefined;
            developer?: {
                name?: string | undefined;
                url?: string | undefined;
            } | undefined;
            homepage_url?: string | undefined;
            install_origins?: string[] | undefined;
            langpack_id: string;
            languages: { [key: string]: {
    chrome_resources: { [key: string]: ExtensionURL | { [key: string]: ExtensionURL } };
    version: string;
} };
            manifest_version: number;
            /**
             * Name must be at least 2, and should be at most 75 characters
             */
            name: string;
            short_name?: string | undefined;
            sources?: { [key: string]: {
    base_path: ExtensionURL;
    paths?: string[] | undefined;
} } | undefined;
            version: string;
        }

        /**
         * Represents a WebExtension manifest.json file
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         * @platform desktop, mobile
         */
        export interface WebExtensionManifest {
            /**
             * Requires manifest_version 3 or later.
             */
            action?: ActionManifest | undefined;
            /**
             * The applications property is deprecated, please use 'browser_specific_settings'
             *
             * Only available in manifest_version 2 or earlier.
             */
            applications?: DeprecatedApplications | undefined;
            author?: string | undefined;
            background?: {
                page?: ExtensionURL | undefined;
                /**
                 * Only available in manifest_version 2 or earlier.
                 */
                persistent?: boolean | undefined;
                preferred_environment?: ("service_worker" | "document")[] | undefined;
                scripts?: ExtensionURL[] | undefined;
                service_worker?: ExtensionURL | undefined;
                /**
                 * Only supported for page/scripts; not for service_worker yet, see bug 1775574
                 */
                type?: "module" | "classic" | undefined;
            } | undefined;
            /**
             * Only available in manifest_version 2 or earlier.
             */
            browser_action?: ActionManifest | undefined;
            browser_specific_settings?: BrowserSpecificSettings | undefined;
            /**
             * Declares a widget provided by a privileged extension.
             *
             * Only privileged extensions can use this key.
             */
            builtin_widget?: BuiltinWidget | undefined;
            chrome_settings_overrides?: {
                homepage?: string | undefined;
                search_provider?: {
                    /**
                     * @deprecated Unsupported on Firefox at this time.
                     */
                    alternate_urls?: string[] | undefined;
                    /**
                     * Encoding of the search term.
                     */
                    encoding?: string | undefined;
                    favicon_url?: (string & {}) | undefined;
                    /**
                     * @deprecated Unsupported on Firefox at this time.
                     */
                    image_url?: string | undefined;
                    /**
                     * @deprecated Unsupported on Firefox at this time.
                     */
                    image_url_post_params?: string | undefined;
                    /**
                     * @deprecated Unsupported on Firefox at this time.
                     */
                    instant_url?: string | undefined;
                    /**
                     * @deprecated Unsupported on Firefox at this time.
                     */
                    instant_url_post_params?: string | undefined;
                    /**
                     * Sets the default engine to a built-in engine only.
                     */
                    is_default?: boolean | undefined;
                    keyword?: (string & {}) | string[] | undefined;
                    name: string;
                    /**
                     * @deprecated Unsupported on Firefox.
                     */
                    prepopulated_id?: number | undefined;
                    /**
                     * @deprecated Unsupported on Firefox at this time.
                     */
                    search_form?: string | undefined;
                    search_url: string;
                    /**
                     * GET parameters to the search_url as a query string.
                     */
                    search_url_get_params?: string | undefined;
                    /**
                     * POST parameters to the search_url as a query string.
                     */
                    search_url_post_params?: string | undefined;
                    suggest_url?: string | undefined;
                    /**
                     * GET parameters to the suggest_url as a query string.
                     */
                    suggest_url_get_params?: string | undefined;
                    /**
                     * POST parameters to the suggest_url as a query string.
                     */
                    suggest_url_post_params?: string | undefined;
                } | undefined;
            } | undefined;
            chrome_url_overrides?: {
                /**
                 * @deprecated Firefox does not support this property and rejects an object that includes it.
                 */
                bookmarks?: ExtensionURL | undefined;
                /**
                 * @deprecated Firefox does not support this property and rejects an object that includes it.
                 */
                history?: ExtensionURL | undefined;
                newtab?: ExtensionURL | undefined;
            } | undefined;
            commands?: { [key: string]: {
    description?: string | undefined;
    suggested_key?: {
        /**
         * @deprecated Unknown platform name
         */
        additionalProperties?: string | undefined;
        android?: string | undefined;
        chromeos?: string | undefined;
        default?: KeyName | undefined;
        ios?: string | undefined;
        linux?: KeyName | undefined;
        mac?: KeyName | undefined;
        windows?: KeyName | undefined;
    } | undefined;
} } | undefined;
            content_scripts?: ContentScript[] | undefined;
            content_security_policy?: (string & {}) | {
                /**
                 * The Content Security Policy used for extension pages.
                 */
                extension_pages?: string | undefined;
                /**
                 * The content security policy used for sandboxed extension pages.
                 */
                sandbox?: string | undefined;
            } | undefined;
            declarative_net_request?: {
                rule_resources: {
                    /**
                     * Whether the ruleset is enabled by default.
                     */
                    enabled: boolean;
                    /**
                     * A non-empty string uniquely identifying the ruleset. IDs beginning with '_' are reserved for internal use.
                     */
                    id: string;
                    /**
                     * The path of the JSON ruleset relative to the extension directory.
                     */
                    path: browser.manifest.ExtensionURL;
                }[];
            } | undefined;
            default_locale?: string | undefined;
            description?: string | undefined;
            developer?: {
                name?: string | undefined;
                url?: string | undefined;
            } | undefined;
            devtools_page?: ExtensionURL | undefined;
            /**
             * Only privileged extensions can use this key.
             */
            experiment_apis?: { [key: string]: browser.experiments.ExperimentAPI } | undefined;
            granted_host_permissions?: boolean | undefined;
            hidden?: boolean | undefined;
            homepage_url?: string | undefined;
            /**
             * Requires manifest_version 3 or later.
             */
            host_permissions?: MatchPattern[] | undefined;
            icons?: { [key: number]: ExtensionFileUrl } | undefined;
            /**
             * The 'split' value is not supported.
             */
            incognito?: "not_allowed" | "spanning" | "split" | undefined;
            install_origins?: string[] | undefined;
            /**
             * Only privileged extensions can use this key.
             */
            l10n_resources?: string[] | undefined;
            manifest_version: number;
            minimum_chrome_version?: string | undefined;
            minimum_opera_version?: string | undefined;
            /**
             * Name must be at least 2, and should be at most 75 characters
             */
            name: string;
            omnibox?: {
                keyword: string;
            } | undefined;
            /**
             * Requires manifest_version 3 or later.
             */
            optional_host_permissions?: MatchPattern[] | undefined;
            optional_permissions?: OptionalPermissionOrOrigin[] | undefined;
            /**
             * Alias property for options_ui.page, ignored when options_ui.page is set. When using this property the options page is always opened in a new tab.
             */
            options_page?: ExtensionURL | undefined;
            options_ui?: {
                /**
                 * Defaults to true in Manifest V2; Deprecated in Manifest V3.
                 */
                browser_style?: boolean | undefined;
                /**
                 * chrome_style is ignored in Firefox. Its replacement (browser_style) has been deprecated.
                 *
                 * Only available in manifest_version 2 or earlier.
                 */
                chrome_style?: boolean | undefined;
                open_in_tab?: boolean | undefined;
                page: ExtensionURL;
            } | undefined;
            page_action?: {
                /**
                 * Deprecated in Manifest V3.
                 */
                browser_style?: boolean | undefined;
                default_icon?: IconPath | undefined;
                default_popup?: string | undefined;
                default_title?: string | undefined;
                hide_matches?: MatchPatternRestricted[] | undefined;
                pinned?: boolean | undefined;
                show_matches?: MatchPattern[] | undefined;
            } | undefined;
            permissions?: PermissionOrOrigin[] | Permission[] | undefined;
            /**
             * A list of protocol handler definitions.
             */
            protocol_handlers?: ProtocolHandler[] | undefined;
            sandbox?: {
                /**
                 * The content security policy used for sandboxed extension pages.
                 *
                 * Only available in manifest_version 2 or earlier.
                 */
                content_security_policy?: string | undefined;
                /**
                 * The list of pages in the form of globs to serve as sandboxed extension pages.
                 */
                pages: string[];
            } | undefined;
            short_name?: string | undefined;
            sidebar_action?: {
                /**
                 * Defaults to true in Manifest V2; Deprecated in Manifest V3.
                 */
                browser_style?: boolean | undefined;
                default_icon?: IconPath | undefined;
                default_panel: string;
                default_title?: string | undefined;
                /**
                 * Whether or not the sidebar is opened at install. Default is `true`.
                 */
                open_at_install?: boolean | undefined;
            } | undefined;
            theme_experiment?: ThemeExperiment | undefined;
            /**
             * Only available in manifest_version 2 or earlier.
             */
            user_scripts?: {
                api_script?: browser.manifest.ExtensionURL | undefined;
            } | undefined;
            version: string;
            web_accessible_resources?: string[] | ({
                extension_ids?: (ExtensionID | "*")[] | undefined;
                matches?: MatchPattern[] | undefined;
                resources: string[];
            })[] | undefined;
        }

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/builtin_widget.json
         * @platform desktop
         */
        export type WidgetSize = "small" | "medium" | "large";

    }

    /**
     * Use the browser.menus API to add items to the browser's menus. You can choose what types of objects your context menu additions apply to, such as images, hyperlinks, and pages.
     *
     * Also available in content scripts and devtools pages.
     *
     * @permission menus
     * @platform desktop
     */
    export namespace menus {
        /**
         * The different contexts a menu can appear in. Specifying 'all' is equivalent to the combination of all other contexts except for 'tab' and 'tools_menu'.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         * @platform desktop
         */
        export type ContextType = "all" | "page" | "frame" | "selection" | "link" | "editable" | "password" | "image" | "video" | "audio" | "launcher" | "bookmark" | "page_action" | "tab" | "tools_menu" | "browser_action" | "action";

        /**
         * The type of menu item.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         * @platform desktop
         */
        export type ItemType = "normal" | "checkbox" | "radio" | "separator";

        /**
         * Information sent when a context menu item is clicked.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         * @platform desktop
         */
        export interface OnClickData {
            /**
             * The id of the bookmark where the context menu was clicked, if it was on a bookmark.
             */
            bookmarkId?: string | undefined;
            /**
             * An integer value of button by which menu item was clicked.
             */
            button?: number | undefined;
            /**
             * A flag indicating the state of a checkbox or radio item after it is clicked.
             */
            checked?: boolean | undefined;
            /**
             * A flag indicating whether the element is editable (text input, textarea, etc.).
             */
            editable: boolean;
            /**
             * The id of the frame of the element where the context menu was clicked.
             */
            frameId?: number | undefined;
            /**
             * The URL of the frame of the element where the context menu was clicked, if it was in a frame.
             */
            frameUrl?: string | undefined;
            /**
             * If the element is a link, the text of that link.
             */
            linkText?: string | undefined;
            /**
             * If the element is a link, the URL it points to.
             */
            linkUrl?: string | undefined;
            /**
             * One of 'image', 'video', or 'audio' if the context menu was activated on one of these types of elements.
             */
            mediaType?: string | undefined;
            /**
             * The ID of the menu item that was clicked.
             */
            menuItemId: number | string;
            /**
             * An array of keyboard modifiers that were held while the menu item was clicked.
             */
            modifiers: ("Shift" | "Alt" | "Command" | "Ctrl" | "MacCtrl")[];
            /**
             * The URL of the page where the menu item was clicked. This property is not set if the click occured in a context where there is no current page, such as in a launcher context menu.
             */
            pageUrl?: string | undefined;
            /**
             * The parent ID, if any, for the item clicked.
             */
            parentMenuItemId?: number | string | undefined;
            /**
             * The text for the context selection, if any.
             */
            selectionText?: string | undefined;
            /**
             * Will be present for elements with a 'src' URL.
             */
            srcUrl?: string | undefined;
            /**
             * An identifier of the clicked element, if any. Use menus.getTargetElement in the page to find the corresponding element.
             */
            targetElementId?: number | undefined;
            /**
             * The type of view where the menu is clicked. May be unset if the menu is not associated with a view.
             */
            viewType?: browser.extension.ViewType | undefined;
            /**
             * A flag indicating the state of a checkbox or radio item before it was clicked.
             */
            wasChecked?: boolean | undefined;
        }

        /**
         * The maximum number of top level extension items that can be added to an extension action context menu. Any items beyond this limit will be ignored.
         *
         * Not available in content scripts or devtools pages.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         * @platform desktop
         */
        export const ACTION_MENU_TOP_LEVEL_LIMIT: number;

        /**
         * Fired when a context menu item is clicked.
         *
         * Not available in content scripts or devtools pages.
         *
         * @param info Information about the item clicked and the context where the click happened.
         * @param tab The details of the tab where the click took place. If the click did not take place in a tab, this parameter will be missing.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         * @platform desktop
         */
        export const onClicked: WebExtensionEvent<(info: OnClickData, tab?: browser.tabs.Tab) => void>;

        /**
         * Fired when a menu is hidden. This event is only fired if onShown has fired before.
         *
         * Not available in content scripts or devtools pages.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         * @platform desktop
         */
        export const onHidden: WebExtensionEvent<() => void>;

        /**
         * Fired when a menu is shown. The extension can add, modify or remove menu items and call menus.refresh() to update the menu.
         *
         * Not available in content scripts or devtools pages.
         *
         * @param info Information about the context of the menu action and the created menu items. For more information about each property, see OnClickData. The following properties are only set if the extension has host permissions for the given context: linkUrl, linkText, srcUrl, pageUrl, frameUrl, selectionText.
         * @param tab The details of the tab where the menu was opened.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         * @platform desktop
         */
        export const onShown: WebExtensionEvent<(info: onShown.Info, tab: browser.tabs.Tab) => void>;
        export namespace onShown {
            /**
             * Information about the context of the menu action and the created menu items. For more information about each property, see OnClickData. The following properties are only set if the extension has host permissions for the given context: linkUrl, linkText, srcUrl, pageUrl, frameUrl, selectionText.
             */
            export type Info = {
                /**
                 * A list of all contexts that apply to the menu.
                 */
                contexts: ContextType[];
                editable: boolean;
                frameUrl?: string | undefined;
                linkText?: string | undefined;
                linkUrl?: string | undefined;
                mediaType?: string | undefined;
                /**
                 * A list of IDs of the menu items that were shown.
                 */
                menuIds: (number | string)[];
                pageUrl?: string | undefined;
                selectionText?: string | undefined;
                srcUrl?: string | undefined;
                targetElementId?: number | undefined;
                viewType?: browser.extension.ViewType | undefined;
            };
        }

        /**
         * Creates a new context menu item. Note that if an error occurs during creation, you may not find out until the creation callback fires (the details will be in {@link browser.runtime.lastError}).
         *
         * Not available in content scripts or devtools pages.
         *
         * @param callback Called when the item has been created in the browser. If there were any problems creating the item, details will be available in {@link browser.runtime.lastError}.
         * @returns The ID of the newly created item.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         * @platform desktop
         */
        export function create(createProperties: create.CreateProperties, callback?: (() => void) | null): number | string;
        export namespace create {
            export type CreateProperties = {
                /**
                 * The initial state of a checkbox or radio item: true for selected and false for unselected. Only one radio item can be selected at a time in a given group of radio items.
                 */
                checked?: boolean | undefined;
                /**
                 * Specifies a command to issue for the context click.
                 */
                command?: (string & {}) | "_execute_browser_action" | "_execute_page_action" | "_execute_sidebar_action" | "_execute_action" | "_execute_page_action" | "_execute_sidebar_action" | undefined;
                /**
                 * List of contexts this menu item will appear in. Defaults to ['page'] if not specified.
                 */
                contexts?: ContextType[] | undefined;
                /**
                 * Lets you restrict the item to apply only to documents whose URL matches one of the given patterns. (This applies to frames as well.) For details on the format of a pattern, see Match Patterns.
                 */
                documentUrlPatterns?: string[] | undefined;
                /**
                 * Whether this context menu item is enabled or disabled. Defaults to true.
                 */
                enabled?: boolean | undefined;
                icons?: { [key: number]: string } | undefined;
                /**
                 * The unique ID to assign to this item. Mandatory for event pages. Cannot be the same as another ID for this extension.
                 */
                id?: string | undefined;
                /**
                 * A function that will be called back when the menu item is clicked. Event pages cannot use this; instead, they should register a listener for {@link browser.contextMenus.onClicked}.
                 *
                 * Only available in manifest_version 2 or earlier.
                 */
                onclick?: ((info: OnClickData, tab: browser.tabs.Tab) => void) | undefined;
                /**
                 * The ID of a parent menu item; this makes the item a child of a previously added item.
                 */
                parentId?: number | string | undefined;
                /**
                 * Similar to documentUrlPatterns, but lets you filter based on the src attribute of img/audio/video tags and the href of anchor tags.
                 */
                targetUrlPatterns?: string[] | undefined;
                /**
                 * The text to be displayed in the item; this is _required_ unless `type` is 'separator'. When the context is 'selection', you can use `%s` within the string to show the selected text. For example, if this parameter's value is "Translate '%s' to Pig Latin" and the user selects the word "cool", the context menu item for the selection is "Translate 'cool' to Pig Latin".
                 */
                title?: string | undefined;
                /**
                 * The type of menu item. Defaults to 'normal' if not specified.
                 */
                type?: ItemType | undefined;
                /**
                 * List of view types where the menu item will be shown. Defaults to any view, including those without a viewType.
                 */
                viewTypes?: browser.extension.ViewType[] | undefined;
                /**
                 * Whether the item is visible in the menu.
                 */
                visible?: boolean | undefined;
            };
        }

        /**
         * Retrieve the element that was associated with a recent contextmenu event.
         *
         * @param targetElementId The identifier of the clicked element, available as info.targetElementId in the menus.onShown, onClicked or onclick event.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus_child.json
         * @platform desktop
         */
        export function getTargetElement(targetElementId: number): Element | null;

        /**
         * Show the matching menu items from this extension instead of the default menu. This should be called during a 'contextmenu' DOM event handler, and only applies to the menu that opens after this event.
         *
         * Not available in content scripts or devtools pages.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         * @permission menus.overrideContext
         * @platform desktop
         */
        export function overrideContext(contextOptions: overrideContext.ContextOptions): void;
        export namespace overrideContext {
            export type ContextOptions = {
                /**
                 * Required when context is 'bookmark'. Requires 'bookmark' permission.
                 */
                bookmarkId?: string | undefined;
                /**
                 * ContextType to override, to allow menu items from other extensions in the menu. Currently only 'bookmark' and 'tab' are supported. showDefaults cannot be used with this option.
                 */
                context?: "bookmark" | "tab" | undefined;
                /**
                 * Whether to also include default menu items in the menu.
                 */
                showDefaults?: boolean | undefined;
                /**
                 * Required when context is 'tab'. Requires 'tabs' permission.
                 */
                tabId?: number | undefined;
            };
        }

        /**
         * Updates the extension items in the shown menu, including changes that have been made since the menu was shown. Has no effect if the menu is hidden. Rebuilding a shown menu is an expensive operation, only invoke this method when necessary.
         *
         * Not available in content scripts or devtools pages.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         * @platform desktop
         */
        export function refresh(): globalThis.Promise<void>;

        /**
         * Removes a context menu item.
         *
         * Not available in content scripts or devtools pages.
         *
         * @param menuItemId The ID of the context menu item to remove.
         * @param callback Called when the context menu has been removed.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         * @platform desktop
         */
        export function remove(menuItemId: number | string): globalThis.Promise<void>;
        export function remove(menuItemId: number | string, callback: (() => void)): void;

        /**
         * Removes all context menu items added by this extension.
         *
         * Not available in content scripts or devtools pages.
         *
         * @param callback Called when removal is complete.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         * @platform desktop
         */
        export function removeAll(): globalThis.Promise<void>;
        export function removeAll(callback: (() => void)): void;

        /**
         * Updates a previously created context menu item.
         *
         * Not available in content scripts or devtools pages.
         *
         * @param id The ID of the item to update.
         * @param updateProperties The properties to update. Accepts the same values as the create function.
         * @param callback Called when the context menu has been updated.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         * @platform desktop
         */
        export function update(id: number | string, updateProperties: update.UpdateProperties): globalThis.Promise<void>;
        export function update(id: number | string, updateProperties: update.UpdateProperties, callback: (() => void)): void;
        export namespace update {
            /**
             * The properties to update. Accepts the same values as the create function.
             */
            export type UpdateProperties = {
                checked?: boolean | undefined;
                contexts?: ContextType[] | undefined;
                documentUrlPatterns?: string[] | undefined;
                enabled?: boolean | undefined;
                icons?: { [key: number]: string } | undefined;
                /**
                 * Only available in manifest_version 2 or earlier.
                 */
                onclick?: ((info: OnClickData, tab: browser.tabs.Tab) => void) | undefined;
                /**
                 * Note: You cannot change an item to be a child of one of its own descendants.
                 */
                parentId?: number | string | undefined;
                targetUrlPatterns?: string[] | undefined;
                title?: string | undefined;
                type?: ItemType | undefined;
                viewTypes?: browser.extension.ViewType[] | undefined;
                /**
                 * Whether the item is visible in the menu.
                 */
                visible?: boolean | undefined;
            };
        }

    }

    /**
     * This API provides the ability to determine the status of and detect changes in the network connection. This API can only be used in privileged extensions.
     *
     * Only privileged extensions can use this API.
     * Not available in content scripts or devtools pages.
     *
     * @permission networkStatus
     * @platform desktop, mobile
     */
    export namespace networkStatus {
        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/network_status.json
         * @platform desktop, mobile
         */
        export interface NetworkLinkInfo {
            /**
             * If known, the network id or name.
             */
            id?: string | undefined;
            /**
             * Status of the network link, if "unknown" then link is usually assumed to be "up"
             */
            status: "unknown" | "up" | "down";
            /**
             * If known, the type of network connection that is avialable.
             */
            type: "unknown" | "ethernet" | "usb" | "wifi" | "wimax" | "mobile";
        }

        /**
         * Fired when the network connection state changes.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/network_status.json
         * @platform desktop, mobile
         */
        export const onConnectionChanged: WebExtensionEvent<(details: NetworkLinkInfo) => void>;

        /**
         * Returns the {@link browser.networkStatus.NetworkLinkInfo} of the current network connection.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/network_status.json
         * @platform desktop, mobile
         */
        export function getLinkInfo(): globalThis.Promise<NetworkLinkInfo>;

    }

    /**
     * Not available in content scripts or devtools pages.
     *
     * @permission notifications
     * @platform desktop, mobile
     */
    export namespace notifications {
        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/notifications.json
         * @platform desktop, mobile
         */
        export interface CreateNotificationOptions {
            /**
             * A URL to the app icon mask.
             */
            appIconMaskUrl?: string | undefined;
            /**
             * Text and icons for up to two notification action buttons.
             *
             * @deprecated Firefox does not support this property and rejects an object that includes it.
             */
            readonly buttons?: ({
                iconUrl?: string | undefined;
                title: string;
            })[] | undefined;
            /**
             * Alternate notification content with a lower-weight font.
             */
            contextMessage?: string | undefined;
            /**
             * A timestamp associated with the notification, in milliseconds past the epoch.
             */
            eventTime?: number | undefined;
            /**
             * A URL to the sender's avatar, app icon, or a thumbnail for image notifications.
             */
            iconUrl?: string | undefined;
            /**
             * A URL to the image thumbnail for image-type notifications.
             */
            imageUrl?: string | undefined;
            /**
             * Whether to show UI indicating that the app will visibly respond to clicks on the body of a notification.
             */
            isClickable?: boolean | undefined;
            /**
             * Items for multi-item notifications.
             */
            items?: NotificationItem[] | undefined;
            /**
             * Main notification content.
             */
            message: string;
            /**
             * Priority ranges from -2 to 2. -2 is lowest priority. 2 is highest. Zero is default.
             */
            priority?: number | undefined;
            /**
             * Current progress ranges from 0 to 100.
             */
            progress?: number | undefined;
            /**
             * Title of the notification (e.g. sender name for email).
             */
            title: string;
            /**
             * Which type of notification to display.
             */
            type: TemplateType;
        }

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/notifications.json
         * @platform desktop, mobile
         */
        export interface NotificationItem {
            /**
             * Additional details about this item.
             */
            message: string;
            /**
             * Title of one item of a list notification.
             */
            title: string;
        }

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/notifications.json
         * @platform desktop, mobile
         */
        export type PermissionLevel = "granted" | "denied";

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/notifications.json
         * @platform desktop, mobile
         */
        export type TemplateType = "basic" | "image" | "list" | "progress";

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/notifications.json
         * @platform desktop, mobile
         */
        export interface UpdateNotificationOptions {
            /**
             * A URL to the app icon mask.
             */
            appIconMaskUrl?: string | undefined;
            /**
             * Text and icons for up to two notification action buttons.
             *
             * @deprecated Firefox does not support this property and rejects an object that includes it.
             */
            readonly buttons?: ({
                iconUrl?: string | undefined;
                title: string;
            })[] | undefined;
            /**
             * Alternate notification content with a lower-weight font.
             */
            contextMessage?: string | undefined;
            /**
             * A timestamp associated with the notification, in milliseconds past the epoch.
             */
            eventTime?: number | undefined;
            /**
             * A URL to the sender's avatar, app icon, or a thumbnail for image notifications.
             */
            iconUrl?: string | undefined;
            /**
             * A URL to the image thumbnail for image-type notifications.
             */
            imageUrl?: string | undefined;
            /**
             * Whether to show UI indicating that the app will visibly respond to clicks on the body of a notification.
             */
            isClickable?: boolean | undefined;
            /**
             * Items for multi-item notifications.
             */
            items?: NotificationItem[] | undefined;
            /**
             * Main notification content.
             */
            message?: string | undefined;
            /**
             * Priority ranges from -2 to 2. -2 is lowest priority. 2 is highest. Zero is default.
             */
            priority?: number | undefined;
            /**
             * Current progress ranges from 0 to 100.
             */
            progress?: number | undefined;
            /**
             * Title of the notification (e.g. sender name for email).
             */
            title?: string | undefined;
            /**
             * Which type of notification to display.
             */
            type?: TemplateType | undefined;
        }

        /**
         * Fired when the  user pressed a button in the notification.
         *
         * @param notificationId The notificationId of the clicked notification.
         * @param buttonIndex The index of the button clicked by the user.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/notifications.json
         * @platform desktop, mobile
         */
        export const onButtonClicked: WebExtensionEvent<(notificationId: string, buttonIndex: number) => void>;

        /**
         * Fired when the user clicked in a non-button area of the notification.
         *
         * @param notificationId The notificationId of the clicked notification.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/notifications.json
         * @platform desktop, mobile
         */
        export const onClicked: WebExtensionEvent<(notificationId: string) => void>;

        /**
         * Fired when the notification closed, either by the system or by user action.
         *
         * @param notificationId The notificationId of the closed notification.
         * @param byUser True if the notification was closed by the user.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/notifications.json
         * @platform desktop, mobile
         */
        export const onClosed: WebExtensionEvent<(notificationId: string, byUser: boolean) => void>;

        /**
         * Fired when the user changes the permission level.
         *
         * @param level The new permission level.
         * @deprecated Firefox does not support this event; it does not exist at runtime.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/notifications.json
         */
        export const onPermissionLevelChanged: WebExtensionEvent<(level: PermissionLevel) => void>;

        /**
         * Fired when the user clicked on a link for the app's notification settings.
         *
         * @deprecated Firefox does not support this event; it does not exist at runtime.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/notifications.json
         */
        export const onShowSettings: WebExtensionEvent<() => void>;

        /**
         * Fired when the notification is shown.
         *
         * @param notificationId The notificationId of the shown notification.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/notifications.json
         * @platform desktop, mobile
         */
        export const onShown: WebExtensionEvent<(notificationId: string) => void>;

        /**
         * Clears an existing notification.
         *
         * @param notificationId The id of the notification to be updated.
         * @returns Indicates whether a matching notification existed.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/notifications.json
         * @platform desktop, mobile
         */
        export function clear(notificationId: string): globalThis.Promise<boolean>;
        export function clear(notificationId: string, callback: ((wasCleared: boolean) => void)): void;

        /**
         * Creates and displays a notification.
         *
         * @param notificationId Identifier of the notification. If it is empty, this method generates an id. If it matches an existing notification, this method first clears that notification before proceeding with the create operation.
         * @param options Contents of the notification.
         * @returns The notification id (either supplied or generated) that represents the created notification.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/notifications.json
         * @platform desktop, mobile
         */
        export function create(notificationId: string | null | undefined, options: CreateNotificationOptions): globalThis.Promise<string>;
        export function create(options: CreateNotificationOptions): globalThis.Promise<string>;
        export function create(notificationId: string | null | undefined, options: CreateNotificationOptions, callback: ((notificationId: string) => void)): void;
        export function create(options: CreateNotificationOptions, callback: ((notificationId: string) => void)): void;

        /**
         * Retrieves all the notifications.
         *
         * @returns The set of notifications currently in the system.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/notifications.json
         * @platform desktop, mobile
         */
        export function getAll(): globalThis.Promise<{ [key: string]: CreateNotificationOptions }>;
        export function getAll(callback: ((notifications: { [key: string]: CreateNotificationOptions }) => void)): void;

        /**
         * Retrieves whether the user has enabled notifications from this app or extension.
         *
         * @returns The current permission level.
         * @deprecated Firefox does not support this function; it does not exist at runtime.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/notifications.json
         */
        export function getPermissionLevel(): globalThis.Promise<PermissionLevel>;
        export function getPermissionLevel(callback: ((level: PermissionLevel) => void)): void;

        /**
         * Updates an existing notification.
         *
         * @param notificationId The id of the notification to be updated.
         * @param options Contents of the notification to update to.
         * @returns Indicates whether a matching notification existed.
         * @deprecated Firefox does not support this function; it does not exist at runtime.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/notifications.json
         */
        export function update(notificationId: string, options: UpdateNotificationOptions): globalThis.Promise<boolean>;
        export function update(notificationId: string, options: UpdateNotificationOptions, callback: ((wasUpdated: boolean) => void)): void;

    }

    /**
     * The omnibox API allows you to register a keyword with Firefox's address bar.
     *
     * Not available in content scripts or devtools pages.
     *
     * @permission manifest:omnibox
     * @platform desktop
     */
    export namespace omnibox {
        /**
         * A suggest result.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/omnibox.json
         * @platform desktop
         */
        export interface DefaultSuggestResult {
            /**
             * The text that is displayed in the URL dropdown.
             */
            description: string;
            /**
             * An array of style ranges for the description, as provided by the extension.
             *
             * @deprecated Firefox does not support this property and rejects an object that includes it.
             */
            readonly descriptionStyles?: ({
                length?: number | undefined;
                offset: number;
                /**
                 * The style type
                 */
                type: DescriptionStyleType;
            })[] | undefined;
            /**
             * An array of style ranges for the description, as provided by ToValue().
             *
             * @deprecated Firefox does not support this property and rejects an object that includes it.
             */
            readonly descriptionStylesRaw?: {
                offset: number;
                type: number;
            }[] | undefined;
        }

        /**
         * The style type.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/omnibox.json
         * @platform desktop
         */
        export type DescriptionStyleType = "url" | "match" | "dim";

        /**
         * The window disposition for the omnibox query. This is the recommended context to display results. For example, if the omnibox command is to navigate to a certain URL, a disposition of 'newForegroundTab' means the navigation should take place in a new selected tab.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/omnibox.json
         * @platform desktop
         */
        export type OnInputEnteredDisposition = "currentTab" | "newForegroundTab" | "newBackgroundTab";

        /**
         * A suggest result.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/omnibox.json
         * @platform desktop
         */
        export interface SuggestResult {
            /**
             * The text that is put into the URL bar, and that is sent to the extension when the user chooses this entry.
             */
            content: string;
            /**
             * Whether the suggest result can be deleted by the user.
             */
            deletable?: boolean | undefined;
            /**
             * The text that is displayed in the URL dropdown. Can contain XML-style markup for styling. The supported tags are 'url' (for a literal URL), 'match' (for highlighting text that matched what the user's query), and 'dim' (for dim helper text). The styles can be nested, eg. `<dim><match>`dimmed match`</match></dim>`. You must escape the five predefined entities to display them as text: stackoverflow.com/a/1091953/89484
             */
            description: string;
            /**
             * An array of style ranges for the description, as provided by the extension.
             *
             * @deprecated Firefox does not support this property and rejects an object that includes it.
             */
            readonly descriptionStyles?: ({
                length?: number | undefined;
                offset: number;
                /**
                 * The style type
                 */
                type: DescriptionStyleType;
            })[] | undefined;
            /**
             * An array of style ranges for the description, as provided by ToValue().
             *
             * @deprecated Firefox does not support this property and rejects an object that includes it.
             */
            readonly descriptionStylesRaw?: {
                offset: number;
                type: number;
            }[] | undefined;
        }

        /**
         * User has deleted a suggested result.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/omnibox.json
         * @platform desktop
         */
        export const onDeleteSuggestion: WebExtensionEvent<(text: string) => void>;

        /**
         * User has ended the keyword input session without accepting the input.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/omnibox.json
         * @platform desktop
         */
        export const onInputCancelled: WebExtensionEvent<() => void>;

        /**
         * User has changed what is typed into the omnibox.
         *
         * @param suggest A callback passed to the onInputChanged event used for sending suggestions back to the browser.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/omnibox.json
         * @platform desktop
         */
        export const onInputChanged: WebExtensionEvent<(text: string, suggest: ((suggestResults: SuggestResult[]) => void)) => void>;

        /**
         * User has accepted what is typed into the omnibox.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/omnibox.json
         * @platform desktop
         */
        export const onInputEntered: WebExtensionEvent<(text: string, disposition: OnInputEnteredDisposition) => void>;

        /**
         * User has started a keyword input session by typing the extension's keyword. This is guaranteed to be sent exactly once per input session, and before any onInputChanged events.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/omnibox.json
         * @platform desktop
         */
        export const onInputStarted: WebExtensionEvent<() => void>;

        /**
         * Sets the description and styling for the default suggestion. The default suggestion is the text that is displayed in the first suggestion row underneath the URL bar.
         *
         * @param suggestion A partial SuggestResult object, without the 'content' parameter.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/omnibox.json
         * @platform desktop
         */
        export function setDefaultSuggestion(suggestion: DefaultSuggestResult): void;

    }

    /**
     * Use the `browser.pageAction` API to put icons inside the address bar. Page actions represent actions that can be taken on the current page, but that aren't applicable to all pages.
     *
     * Not available in content scripts or devtools pages.
     *
     * @permission manifest:page_action
     * @platform desktop, mobile
     */
    export namespace pageAction {
        /**
         * Pixel data for an image. Must be an ImageData object (for example, from a `canvas` element).
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/page_action.json
         * @platform desktop, mobile
         */
        export type ImageDataType = globalThis.ImageData;

        /**
         * Information sent when a page action is clicked.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/page_action.json
         * @platform desktop, mobile
         */
        export interface OnClickData {
            /**
             * An integer value of button by which menu item was clicked.
             */
            button?: number | undefined;
            /**
             * An array of keyboard modifiers that were held while the menu item was clicked.
             */
            modifiers: ("Shift" | "Alt" | "Command" | "Ctrl" | "MacCtrl")[];
        }

        /**
         * Fired when a page action icon is clicked.  This event will not fire if the page action has a popup.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/page_action.json
         * @platform desktop, mobile
         */
        export const onClicked: WebExtensionEvent<(tab: browser.tabs.Tab, info?: OnClickData) => void>;

        /**
         * Gets the html document set as the popup for this page action.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/page_action.json
         * @platform desktop, mobile
         */
        export function getPopup(details: getPopup.Details): globalThis.Promise<string>;
        export function getPopup(details: getPopup.Details, callback: ((result: string) => void)): void;
        export namespace getPopup {
            export type Details = {
                /**
                 * Specify the tab to get the popup from.
                 */
                tabId: number;
            };
        }

        /**
         * Gets the title of the page action.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/page_action.json
         * @platform desktop, mobile
         */
        export function getTitle(details: getTitle.Details): globalThis.Promise<string>;
        export function getTitle(details: getTitle.Details, callback: ((result: string) => void)): void;
        export namespace getTitle {
            export type Details = {
                /**
                 * Specify the tab to get the title from.
                 */
                tabId: number;
            };
        }

        /**
         * Hides the page action.
         *
         * @param tabId The id of the tab for which you want to modify the page action.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/page_action.json
         * @platform desktop, mobile
         */
        export function hide(tabId: number): globalThis.Promise<void>;
        export function hide(tabId: number, callback: (() => void)): void;

        /**
         * Checks whether the page action is shown.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/page_action.json
         * @platform desktop, mobile
         */
        export function isShown(details: isShown.Details): globalThis.Promise<boolean>;
        export namespace isShown {
            export type Details = {
                /**
                 * Specify the tab to get the shownness from.
                 */
                tabId: number;
            };
        }

        /**
         * Opens the extension page action in the active window.
         *
         * Must be called from a user input handler.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/page_action.json
         * @platform desktop, mobile
         */
        export function openPopup(): globalThis.Promise<void>;

        /**
         * Sets the icon for the page action. The icon can be specified either as the path to an image file or as the pixel data from a canvas element, or as dictionary of either one of those. Either the **path** or the **imageData** property must be specified.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/page_action.json
         * @platform desktop, mobile
         */
        export function setIcon(details: setIcon.Details): globalThis.Promise<void>;
        export function setIcon(details: setIcon.Details, callback: (() => void)): void;
        export namespace setIcon {
            export type Details = {
                /**
                 * Either an ImageData object or a dictionary {size -> ImageData} representing icon to be set. If the icon is specified as a dictionary, the actual image to be used is chosen depending on screen's pixel density. If the number of image pixels that fit into one screen space unit equals `scale`, then image with size `scale` * 19 will be selected. Initially only scales 1 and 2 will be supported. At least one image must be specified. Note that 'details.imageData = foo' is equivalent to 'details.imageData = {'19': foo}'
                 */
                imageData?: ImageDataType | { [key: number]: ImageDataType } | undefined;
                /**
                 * Either a relative image path or a dictionary {size -> relative image path} pointing to icon to be set. If the icon is specified as a dictionary, the actual image to be used is chosen depending on screen's pixel density. If the number of image pixels that fit into one screen space unit equals `scale`, then image with size `scale` * 19 will be selected. Initially only scales 1 and 2 will be supported. At least one image must be specified. Note that 'details.path = foo' is equivalent to 'details.imageData = {'19': foo}'
                 */
                path?: string | { [key: number]: string } | undefined;
                /**
                 * The id of the tab for which you want to modify the page action.
                 */
                tabId: number;
            };
        }

        /**
         * Sets the html document to be opened as a popup when the user clicks on the page action's icon.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/page_action.json
         * @platform desktop, mobile
         */
        export function setPopup(details: setPopup.Details): globalThis.Promise<void>;
        export namespace setPopup {
            export type Details = {
                /**
                 * The html file to show in a popup.  If set to the empty string (''), no popup is shown.
                 */
                popup: string | null;
                /**
                 * The id of the tab for which you want to modify the page action.
                 */
                tabId: number;
            };
        }

        /**
         * Sets the title of the page action. This is displayed in a tooltip over the page action.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/page_action.json
         * @platform desktop, mobile
         */
        export function setTitle(details: setTitle.Details): void;
        export namespace setTitle {
            export type Details = {
                /**
                 * The id of the tab for which you want to modify the page action.
                 */
                tabId: number;
                /**
                 * The tooltip string.
                 */
                title: string | null;
            };
        }

        /**
         * Shows the page action. The page action is shown whenever the tab is selected.
         *
         * @param tabId The id of the tab for which you want to modify the page action.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/page_action.json
         * @platform desktop, mobile
         */
        export function show(tabId: number): globalThis.Promise<void>;
        export function show(tabId: number, callback: (() => void)): void;

    }

    /**
     * Not available in content scripts or devtools pages.
     *
     * @platform desktop, mobile
     */
    export namespace permissions {
        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/permissions.json
         * @platform desktop, mobile
         */
        export interface AnyPermissions {
            data_collection?: browser.manifest.OptionalDataCollectionPermission[] | undefined;
            origins?: browser.manifest.MatchPattern[] | undefined;
            permissions?: (browser.manifest.Permission | browser.manifest.OptionalOnlyPermission)[] | undefined;
        }

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/permissions.json
         * @platform desktop, mobile
         */
        export interface Permissions {
            data_collection?: browser.manifest.OptionalDataCollectionPermission[] | undefined;
            origins?: browser.manifest.MatchPattern[] | undefined;
            permissions?: (browser.manifest.OptionalPermission | browser.manifest.OptionalOnlyPermission)[] | undefined;
        }

        /**
         * Fired when the extension acquires new permissions.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/permissions.json
         * @platform desktop, mobile
         */
        export const onAdded: WebExtensionEvent<(permissions: Permissions) => void>;

        /**
         * Fired when permissions are removed from the extension.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/permissions.json
         * @platform desktop, mobile
         */
        export const onRemoved: WebExtensionEvent<(permissions: Permissions) => void>;

        /**
         * Check if the extension has the given permissions.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/permissions.json
         * @platform desktop, mobile
         */
        export function contains(permissions: AnyPermissions): globalThis.Promise<boolean>;
        export function contains(permissions: AnyPermissions, callback: ((result: boolean) => void)): void;

        /**
         * Get a list of all the extension's permissions.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/permissions.json
         * @platform desktop, mobile
         */
        export function getAll(): globalThis.Promise<AnyPermissions>;
        export function getAll(callback: ((permissions: AnyPermissions) => void)): void;

        /**
         * Relinquish the given permissions.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/permissions.json
         * @platform desktop, mobile
         */
        export function remove(permissions: Permissions): globalThis.Promise<boolean>;
        export function remove(permissions: Permissions, callback: ((result: boolean) => void)): void;

        /**
         * Request the given permissions.
         *
         * Must be called from a user input handler.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/permissions.json
         * @platform desktop, mobile
         */
        export function request(permissions: Permissions): globalThis.Promise<boolean>;
        export function request(permissions: Permissions, callback: ((granted: boolean) => void)): void;

    }

    /**
     * PKCS#11 module management API
     *
     * Not available in content scripts or devtools pages.
     *
     * @permission pkcs11
     * @platform desktop
     */
    export namespace pkcs11 {
        /**
         * Enumerate a module's slots, each with their name and whether a token is present
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/pkcs11.json
         * @platform desktop
         */
        export function getModuleSlots(name: string): globalThis.Promise<{ name: string; token: { name: string; manufacturer: string; HWVersion: string; FWVersion: string; serial: string; isLoggedIn: boolean } | null }[]>;

        /**
         * Install a PKCS#11 module with a given name
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/pkcs11.json
         * @platform desktop
         */
        export function installModule(name: string, flags?: number | null): globalThis.Promise<void>;

        /**
         * checks whether a PKCS#11 module, given by name, is installed
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/pkcs11.json
         * @platform desktop
         */
        export function isModuleInstalled(name: string): globalThis.Promise<boolean>;

        /**
         * Remove an installed PKCS#11 module from firefox
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/pkcs11.json
         * @platform desktop
         */
        export function uninstallModule(name: string): globalThis.Promise<void>;

    }

    /**
     * Not available in content scripts or devtools pages.
     *
     * @permission privacy
     * @platform desktop, mobile
     */
    export namespace privacy {
        /**
         * Use the `browser.privacy` API to control usage of the features in the browser that can affect a user's privacy.
         *
         * Not available in content scripts or devtools pages.
         *
         * @permission privacy
         * @platform desktop, mobile
         */
        export namespace network {
            /**
             * The mode for https-only mode.
             *
             * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/privacy.json
             * @platform desktop, mobile
             */
            export type HTTPSOnlyModeOption = "always" | "private_browsing" | "never";

            /**
             * The IP handling policy of WebRTC.
             *
             * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/privacy.json
             * @platform desktop, mobile
             */
            export type IPHandlingPolicy = "default" | "default_public_and_private_interfaces" | "default_public_interface_only" | "disable_non_proxied_udp" | "proxy_only";

            /**
             * An object which describes TLS minimum and maximum versions.
             *
             * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/privacy.json
             * @platform desktop, mobile
             */
            export interface tlsVersionRestrictionConfig {
                /**
                 * The maximum TLS version supported.
                 */
                maximum?: "TLSv1" | "TLSv1.1" | "TLSv1.2" | "TLSv1.3" | "unknown" | undefined;
                /**
                 * The minimum TLS version supported.
                 */
                minimum?: "TLSv1" | "TLSv1.1" | "TLSv1.2" | "TLSv1.3" | "unknown" | undefined;
            }

            /**
             * Allow users to query the status of 'Global Privacy Control'. This setting's value is of type boolean, defaulting to `false`.
             *
             * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/privacy.json
             * @platform desktop, mobile
             */
            export const globalPrivacyControl: browser.types.Setting;
            /**
             * Allow users to query the mode for 'HTTPS-Only Mode'. This setting's value is of type HTTPSOnlyModeOption, defaulting to `never`.
             *
             * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/privacy.json
             * @platform desktop, mobile
             */
            export const httpsOnlyMode: browser.types.Setting;
            /**
             * If enabled, the browser attempts to speed up your web browsing experience by pre-resolving DNS entries, prerendering sites (`<link rel='prefetch' ...>`), and preemptively opening TCP and SSL connections to servers.  This preference's value is a boolean, defaulting to `true`.
             *
             * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/privacy.json
             * @platform desktop, mobile
             */
            export const networkPredictionEnabled: browser.types.Setting;
            /**
             * Allow users to enable and disable RTCPeerConnections (aka WebRTC).
             *
             * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/privacy.json
             * @platform desktop, mobile
             */
            export const peerConnectionEnabled: browser.types.Setting;
            /**
             * This property controls the minimum and maximum TLS versions. This setting's value is an object of {@link browser.privacy.network.tlsVersionRestrictionConfig}.
             *
             * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/privacy.json
             * @platform desktop, mobile
             */
            export const tlsVersionRestriction: browser.types.Setting;
            /**
             * Allow users to specify the media performance/privacy tradeoffs which impacts how WebRTC traffic will be routed and how much local address information is exposed. This preference's value is of type IPHandlingPolicy, defaulting to `default`.
             *
             * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/privacy.json
             * @platform desktop, mobile
             */
            export const webRTCIPHandlingPolicy: browser.types.Setting;

        }
        /**
         * Use the `browser.privacy` API to control usage of the features in the browser that can affect a user's privacy.
         *
         * Not available in content scripts or devtools pages.
         *
         * @permission privacy
         * @platform desktop, mobile
         */
        export namespace services {
            /**
             * If enabled, the password manager will ask if you want to save passwords. This preference's value is a boolean, defaulting to `true`.
             *
             * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/privacy.json
             * @platform desktop, mobile
             */
            export const passwordSavingEnabled: browser.types.Setting;

        }
        /**
         * Use the `browser.privacy` API to control usage of the features in the browser that can affect a user's privacy.
         *
         * Not available in content scripts or devtools pages.
         *
         * @permission privacy
         * @platform desktop, mobile
         */
        export namespace websites {
            /**
             * The settings for cookies.
             *
             * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/privacy.json
             * @platform desktop, mobile
             */
            export interface CookieConfig {
                /**
                 * The type of cookies to allow.
                 */
                behavior?: "allow_all" | "reject_all" | "reject_third_party" | "allow_visited" | "reject_trackers" | "reject_trackers_and_partition_foreign" | undefined;
                /**
                 * Whether to create all cookies as nonPersistent (i.e., session) cookies.
                 *
                 * @deprecated This property has no effect anymore and its value is always `<code>`false`<code>`.
                 */
                nonPersistentCookies?: boolean | undefined;
            }

            /**
             * The mode for tracking protection.
             *
             * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/privacy.json
             * @platform desktop, mobile
             */
            export type TrackingProtectionModeOption = "always" | "never" | "private_browsing";

            /**
             * Allow users to specify the default settings for allowing cookies, as well as whether all cookies should be created as non-persistent cookies. This setting's value is of type CookieConfig.
             *
             * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/privacy.json
             * @platform desktop, mobile
             */
            export const cookieConfig: browser.types.Setting;
            /**
             * If enabled, the browser will associate all data (including cookies, HSTS data, cached images, and more) for any third party domains with the domain in the address bar. This prevents third party trackers from using directly stored information to identify you across different websites, but may break websites where you login with a third party account (such as a Facebook or Google login.) The value of this preference is of type boolean, and the default value is `false`.
             *
             * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/privacy.json
             * @platform desktop, mobile
             */
            export const firstPartyIsolate: browser.types.Setting;
            /**
             * If enabled, the browser sends auditing pings when requested by a website (`<a ping>`). The value of this preference is of type boolean, and the default value is `true`.
             *
             * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/privacy.json
             * @platform desktop, mobile
             */
            export const hyperlinkAuditingEnabled: browser.types.Setting;
            /**
             * **Available on Windows and ChromeOS only**: If enabled, the browser provides a unique ID to plugins in order to run protected content. The value of this preference is of type boolean, and the default value is `true`.
             *
             * @deprecated Firefox does not support this property; it does not exist at runtime.
             * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/privacy.json
             */
            export const protectedContentEnabled: browser.types.Setting;
            /**
             * If enabled, the browser sends `referer` headers with your requests. Yes, the name of this preference doesn't match the misspelled header. No, we're not going to change it. The value of this preference is of type boolean, and the default value is `true`.
             *
             * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/privacy.json
             * @platform desktop, mobile
             */
            export const referrersEnabled: browser.types.Setting;
            /**
             * If enabled, the browser attempts to appear similar to other users by reporting generic information to websites. This can prevent websites from uniquely identifying users. Examples of data that is spoofed include number of CPU cores, precision of JavaScript timers, the local timezone, and disabling features such as GamePad support, and the WebSpeech and Navigator APIs. The value of this preference is of type boolean, and the default value is `false`.
             *
             * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/privacy.json
             * @platform desktop, mobile
             */
            export const resistFingerprinting: browser.types.Setting;
            /**
             * If disabled, the browser blocks third-party sites from setting cookies. The value of this preference is of type boolean, and the default value is `true`.
             *
             * @deprecated Firefox does not support this property; it does not exist at runtime.
             * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/privacy.json
             */
            export const thirdPartyCookiesAllowed: browser.types.Setting;
            /**
             * Allow users to specify the mode for tracking protection. This setting's value is of type TrackingProtectionModeOption, defaulting to `private_browsing_only`.
             *
             * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/privacy.json
             * @platform desktop, mobile
             */
            export const trackingProtectionMode: browser.types.Setting;

        }
    }

    /**
     * Provides access to global proxy settings for Firefox and proxy event listeners to handle dynamic proxy implementations.
     *
     * Not available in content scripts or devtools pages.
     *
     * @permission proxy
     * @platform desktop, mobile
     */
    export namespace proxy {
        /**
         * An object which describes proxy settings.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/proxy.json
         * @platform desktop, mobile
         */
        export interface ProxyConfig {
            /**
             * A URL to use to configure the proxy.
             */
            autoConfigUrl?: string | undefined;
            /**
             * Do not prompt for authentication if password is saved.
             */
            autoLogin?: boolean | undefined;
            /**
             * The address of the ftp proxy, can include a port.  Deprecated since Firefox 88.
             *
             * @deprecated
             */
            ftp?: string | undefined;
            /**
             * The address of the http proxy, can include a port.
             */
            http?: string | undefined;
            /**
             * Use the http proxy server for all protocols.
             */
            httpProxyAll?: boolean | undefined;
            /**
             * A list of hosts which should not be proxied.
             */
            passthrough?: string | undefined;
            /**
             * Proxy DNS when using SOCKS. DNS queries get leaked to the network when set to false. True by default for SOCKS v5. False by default for SOCKS v4.
             */
            proxyDNS?: boolean | undefined;
            /**
             * The type of proxy to use.
             */
            proxyType?: "none" | "autoDetect" | "system" | "manual" | "autoConfig" | undefined;
            /**
             * If true (the default value), do not use newer TLS protocol features that might have interoperability problems on the Internet. This is intended only for use with critical infrastructure like the updates, and is only available to privileged addons.
             */
            respectBeConservative?: boolean | undefined;
            /**
             * The address of the socks proxy, can include a port.
             */
            socks?: string | undefined;
            /**
             * The version of the socks proxy.
             */
            socksVersion?: number | undefined;
            /**
             * The address of the ssl proxy, can include a port.
             */
            ssl?: string | undefined;
        }

        /**
         * Configures proxy settings. This setting's value is an object of type ProxyConfig.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/proxy.json
         * @platform desktop, mobile
         */
        export const settings: browser.types.Setting;

        /**
         * Notifies about errors caused by the invalid use of the proxy API.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/proxy.json
         * @platform desktop, mobile
         */
        export const onError: WebExtensionEvent<(error: { message: string; fileName: string; lineNumber: number; stack: string }) => void>;

        /**
         * Fired when proxy data is needed for a request.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/proxy.json
         * @platform desktop, mobile
         */
        export const onRequest: Omit<WebExtensionEvent<(details: onRequest.Details) => void>, "addListener"> & { addListener(callback: (details: onRequest.Details) => void, filter: browser.webRequest.RequestFilter, extraInfoSpec?: "requestHeaders"[] | null): void };
        export namespace onRequest {
            export type Details = {
                /**
                 * The cookie store ID of the contextual identity.
                 */
                cookieStoreId?: string | undefined;
                /**
                 * The UUID of the document making the request.
                 */
                documentId?: string | undefined;
                /**
                 * URL of the page into which the requested resource will be loaded.
                 */
                documentUrl?: string | undefined;
                /**
                 * The value 0 indicates that the request happens in the main frame; a positive value indicates the ID of a subframe in which the request happens. If the document of a (sub-)frame is loaded (`type` is `main_frame` or `sub_frame`), `frameId` indicates the ID of this frame, not the ID of the outer frame. Frame IDs are unique within a tab.
                 */
                frameId: number;
                /**
                 * Indicates if this response was fetched from disk cache.
                 */
                fromCache: boolean;
                /**
                 * True for private browsing requests.
                 */
                incognito?: boolean | undefined;
                /**
                 * Standard HTTP method.
                 */
                method: string;
                /**
                 * URL of the resource that triggered this request.
                 */
                originUrl?: string | undefined;
                /**
                 * The UUID of the parent document owning this frame. This is not set if there is no parent.
                 */
                parentDocumentId?: string | undefined;
                /**
                 * ID of frame that wraps the frame which sent the request. Set to -1 if no parent frame exists.
                 */
                parentFrameId: number;
                /**
                 * The HTTP request headers that are going to be sent out with this request.
                 */
                requestHeaders?: browser.webRequest.HttpHeaders | undefined;
                /**
                 * The ID of the request. Request IDs are unique within a browser session. As a result, they could be used to relate different events of the same request.
                 */
                requestId: string;
                /**
                 * The ID of the tab in which the request takes place. Set to -1 if the request isn't related to a tab.
                 */
                tabId: number;
                /**
                 * Indicates if this request and its content window hierarchy is third party.
                 */
                thirdParty: boolean;
                /**
                 * The time when this signal is triggered, in milliseconds since the epoch.
                 */
                timeStamp: number;
                /**
                 * How the requested resource will be used.
                 */
                type: browser.webRequest.ResourceType;
                url: string;
                /**
                 * Url classification if the request has been classified.
                 */
                urlClassification: browser.webRequest.UrlClassification;
            };
        }

    }

    /**
     * API to obtain the registrable domain / eTLD+1 from a domain name.
     *
     * Not available in content scripts or devtools pages.
     *
     * @permission publicSuffix
     * @platform desktop, mobile
     */
    export namespace publicSuffix {
        /**
         * The available encoding types for the returned domain.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/public_suffix.json
         * @platform desktop, mobile
         */
        export type DomainEncoding = "punycode" | "display";

        /**
         * Gets the eTLD+1 of a given hostname, or a variant such as IP address if the options allow.
         *
         * @returns The eTLD+1 (or a variant such as IP address if allowed) of the given hostname, or null if no such eTLD+1 (variant) exists.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/public_suffix.json
         * @platform desktop, mobile
         */
        export function getDomain(hostname: string, options?: getDomain.Options | null): string;
        export namespace getDomain {
            export type Options = {
                /**
                 * If true, and the input hostname is an IP address, then this is returned as-is.
                 */
                allowIPAddress?: boolean | undefined;
                /**
                 * If true, and the input hostname is itself a known eTLD (without a preceding label) then this is returned as-is.
                 */
                allowPlainSuffix?: boolean | undefined;
                /**
                 * If true, and the input hostname lacks a known eTLD, and is neither itself a known eTLD nor an IP address, then the returned domain consists of the penultimate two domain labels of the input.
                 */
                allowUnknownSuffix?: boolean | undefined;
                /**
                 * Determines how the returned domain should be encoded.
                 */
                encoding?: DomainEncoding | undefined;
            };
        }

        /**
         * Gets the known public suffix / eTLD (i.e. in the PSL), if any, of a given hostname.
         *
         * @returns The known eTLD of the given hostname, or null if no such known eTLD exists.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/public_suffix.json
         * @platform desktop, mobile
         */
        export function getKnownSuffix(hostname: string): string;

        /**
         * Checks if the given hostname is itself a known public suffix / eTLD (i.e. in the PSL).
         *
         * @returns True if the given hostname is itself a known eTLD.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/public_suffix.json
         * @platform desktop, mobile
         */
        export function isKnownSuffix(hostname: string): boolean;

    }

    /**
     * Use the `browser.runtime` API to retrieve the background page, return details about the manifest, and listen for and respond to events in the app or extension lifecycle. You can also use this API to convert the relative path of URLs to fully-qualified URLs.
     *
     * Also available in content scripts and devtools pages.
     *
     * @platform desktop, mobile
     */
    export namespace runtime {
        /**
         * An object containing information about the current browser.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export interface BrowserInfo {
            /**
             * The browser's build ID/date, for example '20160101'.
             */
            buildID: string;
            /**
             * The name of the browser, for example 'Firefox'.
             */
            name: string;
            /**
             * The name of the browser vendor, for example 'Mozilla'.
             */
            vendor: string;
            /**
             * The browser's version, for example '42.0.0' or '0.8.1pre'.
             */
            version: string;
        }

        /**
         * A filter to match against existing extension context. Matching contexts must match all specified filters.
         *
         * Requires manifest_version 3 or later.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export interface ContextFilter {
            contextIds?: string[] | undefined;
            contextTypes?: ContextType[] | undefined;
            documentIds?: string[] | undefined;
            documentOrigins?: string[] | undefined;
            documentUrls?: string[] | undefined;
            frameIds?: number[] | undefined;
            incognito?: boolean | undefined;
            tabIds?: number[] | undefined;
            windowIds?: number[] | undefined;
        }

        /**
         * The type of extension view.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export type ContextType = "BACKGROUND" | "POPUP" | "SIDE_PANEL" | "TAB";

        /**
         * A context hosting extension content
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export interface ExtensionContext {
            /**
             * An unique identifier associated to this context
             */
            contextId: string;
            /**
             * The type of the context
             */
            contextType: ContextType;
            /**
             * An UUID for the document associated with this context, or undefined if it is not hosted in a document
             */
            documentId?: string | undefined;
            /**
             * The origin of the document associated with this context, or undefined if it is not hosted in a document
             */
            documentOrigin?: string | undefined;
            /**
             * The URL of the document associated with this context, or undefined if it is not hosted in a document
             */
            documentUrl?: string | undefined;
            /**
             * The frame ID for this context, or -1 if it is not hosted in a frame.
             */
            frameId: number;
            /**
             * Whether the context is associated with an private browsing context.
             */
            incognito: boolean;
            /**
             * The tab ID for this context, or -1 if it is not hosted in a tab.
             */
            tabId: number;
            /**
             * The window ID for this context, or -1 if it is not hosted in a window.
             */
            windowId: number;
        }

        /**
         * An object containing information about the script context that sent a message or request.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export interface MessageSender {
            /**
             * A UUID of the document that opened the connection.
             */
            documentId?: string | undefined;
            /**
             * The frame that opened the connection. 0 for top-level frames, positive for child frames. This will only be set when `tab` is set.
             */
            frameId?: number | undefined;
            /**
             * The ID of the extension or app that opened the connection, if any.
             */
            id?: string | undefined;
            /**
             * The {@link browser.tabs.Tab} which opened the connection, if any. This property will **only** be present when the connection was opened from a tab (including content scripts), and **only** if the receiver is an extension, not an app.
             */
            tab?: browser.tabs.Tab | undefined;
            /**
             * The TLS channel ID of the page or frame that opened the connection, if requested by the extension or app, and if available.
             *
             * @deprecated Firefox does not support this property and rejects an object that includes it.
             */
            readonly tlsChannelId?: string | undefined;
            /**
             * The URL of the page or frame that opened the connection. If the sender is in an iframe, it will be iframe's URL not the URL of the page which hosts it.
             */
            url?: string | undefined;
            /**
             * The worldId of the USER_SCRIPT world that sent the message. Only present on onUserScriptMessage and onUserScriptConnect (in port.sender) events.
             */
            userScriptWorldId?: string | undefined;
            /**
             * The window ID of the document that opened the connection.
             */
            windowId?: number | undefined;
        }

        /**
         * The reason that this event is being dispatched.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export type OnInstalledReason = "install" | "update" | "browser_update";

        /**
         * The performance warning event category, e.g. 'content_script'.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export type OnPerformanceWarningCategory = "content_script";

        /**
         * The performance warning event severity. Will be 'high' for serious and user-visible issues.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export type OnPerformanceWarningSeverity = "low" | "medium" | "high";

        /**
         * The reason that the event is being dispatched. 'app_update' is used when the restart is needed because the application is updated to a newer version. 'os_update' is used when the restart is needed because the browser/OS is updated to a newer version. 'periodic' is used when the system runs for more than the permitted uptime set in the enterprise policy.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export type OnRestartRequiredReason = "app_update" | "os_update" | "periodic";

        /**
         * The machine's processor architecture.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export type PlatformArch = "arm" | "arm64" | "ppc64" | "riscv64" | "s390x" | "sparc64" | "x86-32" | "x86-64" | "noarch";

        /**
         * An object containing information about the current platform.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export interface PlatformInfo {
            /**
             * The machine's processor architecture.
             */
            arch: PlatformArch;
            /**
             * The native client architecture. This may be different from arch on some platforms.
             *
             * @deprecated Firefox does not support this property and rejects an object that includes it.
             */
            readonly nacl_arch: (string & {});
            /**
             * The operating system the browser is running on.
             */
            os: PlatformOs;
        }

        /**
         * The operating system the browser is running on.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export type PlatformOs = "mac" | "win" | "android" | "cros" | "linux" | "openbsd";

        /**
         * An object which allows two way communication with other pages.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export interface Port {
            disconnect: () => void;
            error: Error | null;
            name: string;
            onDisconnect: WebExtensionEvent<(port: Port) => void>;
            onMessage: WebExtensionEvent<(message: any, port: Port) => void>;
            postMessage: (message: any) => void;
            /**
             * This property will **only** be present on ports passed to onConnect/onConnectExternal listeners.
             */
            sender?: MessageSender | undefined;
        }

        /**
         * Result of the update check.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export type RequestUpdateCheckStatus = "throttled" | "no_update" | "update_available";

        /**
         * The ID of the extension/app.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export const id: string;
        /**
         * This will be defined during an API method callback if there was an error
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export const lastError: {
            /**
             * Details about the error which occurred.
             */
            message?: string | undefined;
        };

        /**
         * Fired when an update for the browser is available, but isn't installed immediately because a browser restart is required.
         *
         * Not available in content scripts or devtools pages.
         *
         * @deprecated Firefox does not support this event; it does not exist at runtime. Please use {@link browser.runtime.onRestartRequired}.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         */
        export const onBrowserUpdateAvailable: WebExtensionEvent<() => void>;

        /**
         * Fired when a connection is made from either an extension process or a content script.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export const onConnect: WebExtensionEvent<(port: Port) => void>;

        /**
         * Fired when a connection is made from another extension.
         *
         * Not available in content scripts or devtools pages.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export const onConnectExternal: WebExtensionEvent<(port: Port) => void>;

        /**
         * Fired when the extension is first installed, when the extension is updated to a new version, and when the browser is updated to a new version.
         *
         * Not available in content scripts or devtools pages.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export const onInstalled: WebExtensionEvent<(details: onInstalled.Details) => void>;
        export namespace onInstalled {
            export type Details = {
                /**
                 * Indicates the ID of the imported shared module extension which updated. This is present only if 'reason' is 'shared_module_update'.
                 *
                 * @deprecated Firefox does not support this property and rejects an object that includes it.
                 */
                id?: string | undefined;
                /**
                 * Indicates the previous version of the extension, which has just been updated. This is present only if 'reason' is 'update'.
                 */
                previousVersion?: string | undefined;
                /**
                 * The reason that this event is being dispatched.
                 */
                reason: OnInstalledReason;
                /**
                 * Indicates whether the addon is installed as a temporary extension.
                 */
                temporary: boolean;
            };
        }

        /**
         * Fired when a message is sent from either an extension process or a content script.
         *
         * @param message The message sent by the calling script.
         * @param sendResponse Function to call (at most once) when you have a response. The argument should be any JSON-ifiable object. If you have more than one `onMessage` listener in the same document, then only one may send a response. This function becomes invalid when the event listener returns, unless you return true from the event listener to indicate you wish to send a response asynchronously (this will keep the message channel open to the other end until `sendResponse` is called).
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export const onMessage: WebExtensionEvent<(message: any, sender: MessageSender, sendResponse: (response?: unknown) => void) => boolean | Promise<unknown> | void>;

        /**
         * Fired when a message is sent from another extension/app. Cannot be used in a content script.
         *
         * Not available in content scripts or devtools pages.
         *
         * @param message The message sent by the calling script.
         * @param sendResponse Function to call (at most once) when you have a response. The argument should be any JSON-ifiable object. If you have more than one `onMessage` listener in the same document, then only one may send a response. This function becomes invalid when the event listener returns, unless you return true from the event listener to indicate you wish to send a response asynchronously (this will keep the message channel open to the other end until `sendResponse` is called).
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export const onMessageExternal: WebExtensionEvent<(message: any, sender: MessageSender, sendResponse: (response?: unknown) => void) => boolean | Promise<unknown> | void>;

        /**
         * Fired when a runtime performance issue is detected with the extension. Observe this event to be proactively notified of runtime performance problems with the extension.
         *
         * Not available in content scripts or devtools pages.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export const onPerformanceWarning: WebExtensionEvent<(details: onPerformanceWarning.Details) => void>;
        export namespace onPerformanceWarning {
            export type Details = {
                /**
                 * The performance warning event category, e.g. 'content_script'.
                 */
                category: OnPerformanceWarningCategory;
                /**
                 * An explanation of what the warning means, and hopefully how to address it.
                 */
                description: string;
                /**
                 * The performance warning event severity, e.g. 'high'.
                 */
                severity: OnPerformanceWarningSeverity;
                /**
                 * The {@link browser.tabs.Tab} that the performance warning relates to, if any.
                 */
                tabId?: number | undefined;
            };
        }

        /**
         * Fired when an app or the device that it runs on needs to be restarted. The app should close all its windows at its earliest convenient time to let the restart to happen. If the app does nothing, a restart will be enforced after a 24-hour grace period has passed. Currently, this event is only fired for Chrome OS kiosk apps.
         *
         * Not available in content scripts or devtools pages.
         *
         * @param reason The reason that the event is being dispatched.
         * @deprecated Firefox does not support this event; it does not exist at runtime.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         */
        export const onRestartRequired: WebExtensionEvent<(reason: OnRestartRequiredReason) => void>;

        /**
         * Fired when a profile that has this extension installed first starts up. This event is not fired for incognito profiles.
         *
         * Not available in content scripts or devtools pages.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export const onStartup: WebExtensionEvent<() => void>;

        /**
         * Sent to the event page just before it is unloaded. This gives the extension opportunity to do some clean up. Note that since the page is unloading, any asynchronous operations started while handling this event are not guaranteed to complete. If more activity for the event page occurs before it gets unloaded the onSuspendCanceled event will be sent and the page won't be unloaded.
         *
         * Not available in content scripts or devtools pages.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export const onSuspend: WebExtensionEvent<() => void>;

        /**
         * Sent after onSuspend to indicate that the app won't be unloaded after all.
         *
         * Not available in content scripts or devtools pages.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export const onSuspendCanceled: WebExtensionEvent<() => void>;

        /**
         * Fired when an update is available, but isn't installed immediately because the app is currently running. If you do nothing, the update will be installed the next time the background page gets unloaded, if you want it to be installed sooner you can explicitly call {@link browser.runtime.reload}. If your extension is using a persistent background page, the background page of course never gets unloaded, so unless you call {@link browser.runtime.reload} manually in response to this event the update will not get installed until the next time the browser itself restarts. If no handlers are listening for this event, and your extension has a persistent background page, it behaves as if {@link browser.runtime.reload} is called in response to this event.
         *
         * Not available in content scripts or devtools pages.
         *
         * @param details The manifest details of the available update.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export const onUpdateAvailable: WebExtensionEvent<(details: onUpdateAvailable.Details) => void>;
        export namespace onUpdateAvailable {
            /**
             * The manifest details of the available update.
             */
            export type Details = {
                /**
                 * The version number of the available update.
                 */
                version: string;
            };
        }

        /**
         * Fired when a connection is made from a USER_SCRIPT world registered through the userScripts API.
         *
         * Not available in content scripts or devtools pages.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @permission userScripts
         * @platform desktop, mobile
         */
        export const onUserScriptConnect: WebExtensionEvent<(port: Port) => void>;

        /**
         * Fired when a message is sent from a USER_SCRIPT world registered through the userScripts API.
         *
         * Not available in content scripts or devtools pages.
         *
         * @param message The message sent by the calling script.
         * @param sendResponse Function to call (at most once) when you have a response. The argument should be any JSON-ifiable object. If you have more than one `onMessage` listener in the same document, then only one may send a response. This function becomes invalid when the event listener returns, unless you return true from the event listener to indicate you wish to send a response asynchronously (this will keep the message channel open to the other end until `sendResponse` is called).
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @permission userScripts
         * @platform desktop, mobile
         */
        export const onUserScriptMessage: WebExtensionEvent<(message: any, sender: MessageSender, sendResponse: (response?: unknown) => void) => boolean | Promise<unknown> | void>;

        /**
         * Attempts to connect to connect listeners within an extension/app (such as the background page), or other extensions/apps. This is useful for content scripts connecting to their extension processes, inter-app/extension communication, and web messaging. Note that this does not connect to any listeners in a content script. Extensions may connect to content scripts embedded in tabs via {@link browser.tabs.connect}.
         *
         * @param extensionId The ID of the extension or app to connect to. If omitted, a connection will be attempted with your own extension. Required if sending messages from a web page for web messaging.
         * @returns Port through which messages can be sent and received. The port's {@link browser.runtime.Port.onDisconnect} event is fired if the extension/app does not exist.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export function connect(connectInfo?: connect.ConnectInfo | null): Port;
        export function connect(extensionId?: string | null, connectInfo?: connect.ConnectInfo | null): Port;
        export namespace connect {
            export type ConnectInfo = {
                /**
                 * Whether the TLS channel ID will be passed into onConnectExternal for processes that are listening for the connection event.
                 */
                includeTlsChannelId?: boolean | undefined;
                /**
                 * Will be passed into onConnect for processes that are listening for the connection event.
                 */
                name?: string | undefined;
            };
        }

        /**
         * Connects to a native application in the host machine.
         *
         * Also available in content scripts, but not in devtools pages.
         *
         * @param application The name of the registered application to connect to.
         * @returns Port through which messages can be sent and received with the application
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @permission nativeMessaging
         * @platform desktop, mobile
         */
        export function connectNative(application: string): Port;

        /**
         * Retrieves the JavaScript 'window' object for the background page running inside the current extension/app. If the background page is an event page, the system will ensure it is loaded before calling the callback. If there is no background page, an error is set.
         *
         * Not available in content scripts or devtools pages.
         *
         * @returns The JavaScript 'window' object for the background page.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export function getBackgroundPage(): globalThis.Promise<Window | null>;
        export function getBackgroundPage(callback: ((backgroundPage: Window | null) => void)): void;

        /**
         * Returns information about the current browser.
         *
         * Not available in content scripts or devtools pages.
         *
         * @param callback Called with results
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export function getBrowserInfo(): globalThis.Promise<BrowserInfo>;
        export function getBrowserInfo(callback: ((browserInfo: BrowserInfo) => void)): void;

        /**
         * Fetches information about active contexts associated with this extension
         *
         * Not available in content scripts or devtools pages.
         *
         * @param filter A filter to find matching context.
         * @returns The matching contexts, if any.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export function getContexts(filter: ContextFilter): globalThis.Promise<ExtensionContext[]>;
        export function getContexts(filter: ContextFilter, callback: ((contexts: ExtensionContext[]) => void)): void;

        /**
         * Get the documentId of any window global or frame element. Throws for invalid targets, such as unloaded frames.
         *
         * @param target A WindowProxy or a browsing context container Element (iframe, frame, embed, or object) for the target frame.
         * @returns The documentId of the target document.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export function getDocumentId(target: any): string;

        /**
         * Get the frameId of any window global or frame element.
         *
         * @param target A WindowProxy or a browsing context container Element (iframe, frame, embed, or object) for the target frame.
         * @returns The frameId of the target frame, or -1 if it doesn't exist.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export function getFrameId(target: any): number;

        /**
         * Returns details about the app or extension from the manifest. The object returned is a serialization of the full manifest file.
         *
         * @returns The manifest details.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export function getManifest(): browser.manifest.WebExtensionManifest;

        /**
         * Returns a DirectoryEntry for the package directory.
         *
         * Not available in content scripts or devtools pages.
         *
         * @deprecated Firefox does not support this function; it does not exist at runtime.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         */
        export function getPackageDirectoryEntry(): globalThis.Promise<FileSystemDirectoryEntry>;
        export function getPackageDirectoryEntry(callback: ((directoryEntry: FileSystemDirectoryEntry) => void)): void;

        /**
         * Returns information about the current platform.
         *
         * Not available in content scripts or devtools pages.
         *
         * @param callback Called with results
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export function getPlatformInfo(): globalThis.Promise<PlatformInfo>;
        export function getPlatformInfo(callback: ((platformInfo: PlatformInfo) => void)): void;

        /**
         * Converts a relative path within an app/extension install directory to a fully-qualified URL.
         *
         * @param path A path to a resource within an app/extension expressed relative to its install directory.
         * @returns The fully-qualified URL to the resource.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export function getURL(path: string): string;

        /**
         * Returns the extension version as declared in the manifest.
         *
         * @returns The extension version.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export function getVersion(): string;

        /**
         * Open your Extension's options page, if possible.
         *
         * The precise behavior may depend on your manifest's `options_ui` or `options_page` key, or what the browser happens to support at the time.
         *
         * If your Extension does not declare an options page, or the browser failed to create one for some other reason, the callback will set {@link browser.runtime.lastError}.
         *
         * Not available in content scripts or devtools pages.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export function openOptionsPage(): globalThis.Promise<void>;
        export function openOptionsPage(callback: (() => void)): void;

        /**
         * Reloads the app or extension.
         *
         * Not available in content scripts or devtools pages.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export function reload(): void;

        /**
         * Requests an update check for this app/extension.
         *
         * Not available in content scripts or devtools pages.
         *
         * @deprecated Firefox does not support this function; it does not exist at runtime.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         */
        export function requestUpdateCheck(): globalThis.Promise<[status: RequestUpdateCheckStatus, details: requestUpdateCheck.Details | undefined]>;
        export function requestUpdateCheck(callback: ((status: RequestUpdateCheckStatus, details: requestUpdateCheck.Details | undefined) => void)): void;
        export namespace requestUpdateCheck {
            /**
             * If an update is available, this contains more information about the available update.
             */
            export type Details = {
                /**
                 * The version of the available update.
                 */
                version: string;
            };
        }

        /**
         * Restart the device when the app runs in kiosk mode. Otherwise, it's no-op.
         *
         * Not available in content scripts or devtools pages.
         *
         * @deprecated Firefox does not support this function; it does not exist at runtime.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         */
        export function restart(): void;

        /**
         * Sends a single message to event listeners within your extension/app or a different extension/app. Similar to {@link browser.runtime.connect} but only sends a single message, with an optional response. If sending to your extension, the {@link browser.runtime.onMessage} event will be fired in each page, or {@link browser.runtime.onMessageExternal}, if a different extension. Note that extensions cannot send messages to content scripts using this method. To send messages to content scripts, use {@link browser.tabs.sendMessage}.
         *
         * @param extensionId The ID of the extension/app to send the message to. If omitted, the message will be sent to your own extension/app. Required if sending messages from a web page for web messaging.
         * @returns The JSON response object sent by the handler of the message. If an error occurs while connecting to the extension, the callback will be called with no arguments and {@link browser.runtime.lastError} will be set to the error message.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export function sendMessage(extensionId: string | null | undefined, message: any, options?: sendMessage.Options | null): globalThis.Promise<any>;
        export function sendMessage(message: any, options?: sendMessage.Options | null): globalThis.Promise<any>;
        export function sendMessage(extensionId: string | null | undefined, message: any, options: sendMessage.Options | null | undefined, responseCallback: ((response: any) => void)): void;
        export function sendMessage(extensionId: string | null | undefined, message: any, responseCallback: ((response: any) => void)): void;
        export function sendMessage(message: any, options: sendMessage.Options | null | undefined, responseCallback: ((response: any) => void)): void;
        export function sendMessage(message: any, responseCallback: ((response: any) => void)): void;
        export namespace sendMessage {
            export type Options = {
                /**
                 * Whether the TLS channel ID will be passed into onMessageExternal for processes that are listening for the connection event.
                 *
                 * @deprecated Firefox does not support this property and rejects an object that includes it.
                 */
                includeTlsChannelId?: boolean | undefined;
            };
        }

        /**
         * Send a single message to a native application.
         *
         * Also available in content scripts, but not in devtools pages.
         *
         * @param application The name of the native messaging host.
         * @param message The message that will be passed to the native messaging host.
         * @returns The response message sent by the native messaging host. If an error occurs while connecting to the native messaging host, the callback will be called with no arguments and {@link browser.runtime.lastError} will be set to the error message.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @permission nativeMessaging
         * @platform desktop, mobile
         */
        export function sendNativeMessage(application: string, message: any): globalThis.Promise<any>;
        export function sendNativeMessage(application: string, message: any, responseCallback: ((response: any) => void)): void;

        /**
         * Sets the URL to be visited upon uninstallation. This may be used to clean up server-side data, do analytics, and implement surveys. Maximum 1023 characters.
         *
         * Not available in content scripts or devtools pages.
         *
         * @param url URL to be opened after the extension is uninstalled. This URL must have an http: or https: scheme. Set an empty string to not open a new tab upon uninstallation.
         * @param callback Called when the uninstall URL is set. If the given URL is invalid, {@link browser.runtime.lastError} will be set.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop, mobile
         */
        export function setUninstallURL(url?: string | null): globalThis.Promise<void>;
        export function setUninstallURL(url: string | null | undefined, callback: (() => void)): void;
        export function setUninstallURL(callback: (() => void)): void;

    }

    /**
     * Use the scripting API to execute script in different contexts.
     *
     * Not available in content scripts or devtools pages.
     *
     * @permission scripting
     * @platform desktop, mobile
     */
    export namespace scripting {
        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/scripting.json
         * @platform desktop, mobile
         */
        export interface CSSInjection {
            /**
             * A string containing the CSS to inject. Exactly one of `files` and `css` must be specified.
             */
            css?: string | undefined;
            /**
             * The path of the CSS files to inject, relative to the extension's root directory. Exactly one of `files` and `css` must be specified.
             */
            files?: string[] | undefined;
            /**
             * The style origin for the injection. Defaults to `'AUTHOR'`.
             */
            origin?: "USER" | "AUTHOR" | undefined;
            /**
             * Details specifying the target into which to inject the CSS.
             */
            target: InjectionTarget;
        }

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/scripting.json
         * @platform desktop, mobile
         */
        export interface ContentScriptFilter {
            /**
             * The IDs of specific scripts to retrieve with `getRegisteredContentScripts()` or to unregister with `unregisterContentScripts()`.
             */
            ids?: string[] | undefined;
        }

        /**
         * The JavaScript world for a script to execute within. `ISOLATED` is the default execution environment of content scripts, `MAIN` is the web page's execution environment.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/scripting.json
         * @platform desktop, mobile
         */
        export type ExecutionWorld = "ISOLATED" | "MAIN";

        /**
         * Result of a script injection.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/scripting.json
         * @platform desktop, mobile
         */
        export interface InjectionResult<Result = unknown> {
            /**
             * The document associated with the injection.
             */
            documentId: string;
            /**
             * The error property is set when the script execution failed. The value is typically an (Error) object with a message property, but could be any value (including primitives and undefined) if the script threw or rejected with such a value.
             */
            error?: any;
            /**
             * The frame ID associated with the injection.
             */
            frameId: number;
            /**
             * The result of the script execution.
             */
            result?: Result | undefined;
        }

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/scripting.json
         * @platform desktop, mobile
         */
        export interface InjectionTarget {
            /**
             * Whether the script should inject into all frames within the tab. Defaults to false. This must not be true if `frameIds` is specified.
             */
            allFrames?: boolean | undefined;
            /**
             * The IDs of specific documents to inject into. This must not be set if `frameIds` or `allFrames` is set.
             */
            documentIds?: string[] | undefined;
            /**
             * The IDs of specific frames to inject into.
             */
            frameIds?: number[] | undefined;
            /**
             * The ID of the tab into which to inject.
             */
            tabId: number;
        }

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/scripting.json
         * @platform desktop, mobile
         */
        export interface RegisteredContentScript {
            /**
             * If specified true, it will inject into all frames, even if the frame is not the top-most frame in the tab. Each frame is checked independently for URL requirements; it will not inject into child frames if the URL requirements are not met. Defaults to false, meaning that only the top frame is matched.
             */
            allFrames?: boolean | undefined;
            /**
             * The list of CSS files to be injected into matching pages. These are injected in the order they appear in this array.
             */
            css?: browser.manifest.ExtensionURL[] | undefined;
            cssOrigin?: browser.extensionTypes.CSSOrigin | undefined;
            /**
             * Excludes pages that this content script would otherwise be injected into.
             */
            excludeMatches?: string[] | undefined;
            /**
             * The id of the content script, specified in the API call.
             */
            id: string;
            /**
             * The list of JavaScript files to be injected into matching pages. These are injected in the order they appear in this array.
             */
            js?: browser.manifest.ExtensionURL[] | undefined;
            /**
             * If matchOriginAsFallback is true, then the code is also injected in about:, data:, blob: when their origin matches the pattern in 'matches', even if the actual document origin is opaque (due to the use of CSP sandbox or iframe sandbox). Match patterns in 'matches' must specify a wildcard path glob. By default it is `false`.
             */
            matchOriginAsFallback?: boolean | undefined;
            /**
             * Specifies which pages this content script will be injected into. Must be specified for `registerContentScripts()`.
             */
            matches?: string[] | undefined;
            /**
             * Specifies if this content script will persist into future sessions. Defaults to true.
             */
            persistAcrossSessions?: boolean | undefined;
            /**
             * Specifies when JavaScript files are injected into the web page. The preferred and default value is `document_idle`.
             */
            runAt?: browser.extensionTypes.RunAt | undefined;
            /**
             * The JavaScript world for a script to execute within. Defaults to "ISOLATED".
             */
            world?: ExecutionWorld | undefined;
        }

        /**
         * Details of a script injection
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/scripting.json
         * @platform desktop, mobile
         */
        export interface ScriptInjection<Args extends unknown[] = unknown[], Result = unknown> {
            /**
             * The arguments to curry into a provided function. This is only valid if the `func` parameter is specified. These arguments must be JSON-serializable.
             */
            args?: Args | undefined;
            /**
             * The path of the JS files to inject, relative to the extension's root directory. Exactly one of `files` and `func` must be specified.
             */
            files?: string[] | undefined;
            /**
             * A JavaScript function to inject. This function will be serialized, and then deserialized for injection. This means that any bound parameters and execution context will be lost. Exactly one of `files` and `func` must be specified.
             */
            func?: (...args: Args) => Result | undefined;
            /**
             * Whether the injection should be triggered in the target as soon as possible (but not necessarily prior to page load).
             */
            injectImmediately?: boolean | undefined;
            /**
             * Details specifying the target into which to inject the script.
             */
            target: InjectionTarget;
            world?: ExecutionWorld | undefined;
        }

        /**
         * Injects a script into a target context. The script will be run at `document_idle`.
         *
         * @param injection The details of the script which to inject.
         * @param callback Invoked upon completion of the injection. The resulting array contains the result of execution for each frame where the injection succeeded.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/scripting.json
         * @platform desktop, mobile
         */
        export function executeScript<Args extends unknown[], Result>(injection: ScriptInjection<Args, Result>): globalThis.Promise<InjectionResult<Awaited<Result>>[]>;
        export function executeScript<Args extends unknown[], Result>(injection: ScriptInjection<Args, Result>, callback: ((results: InjectionResult<Awaited<Result>>[]) => void)): void;

        /**
         * Returns all dynamically registered content scripts for this extension that match the given filter.
         *
         * @param filter An object to filter the extension's dynamically registered scripts.
         * @param callback The resulting array contains the registered content scripts.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/scripting.json
         * @platform desktop, mobile
         */
        export function getRegisteredContentScripts(filter?: ContentScriptFilter | null): globalThis.Promise<RegisteredContentScript[]>;
        export function getRegisteredContentScripts(filter: ContentScriptFilter | null | undefined, callback: ((scripts: RegisteredContentScript[]) => void)): void;
        export function getRegisteredContentScripts(callback: ((scripts: RegisteredContentScript[]) => void)): void;

        /**
         * Inserts a CSS stylesheet into a target context. If multiple frames are specified, unsuccessful injections are ignored.
         *
         * @param injection The details of the styles to insert.
         * @param callback Invoked upon completion of the injection.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/scripting.json
         * @platform desktop, mobile
         */
        export function insertCSS(injection: CSSInjection): globalThis.Promise<void>;
        export function insertCSS(injection: CSSInjection, callback: (() => void)): void;

        /**
         * Registers one or more content scripts for this extension.
         *
         * @param scripts Contains a list of scripts to be registered. If there are errors during script parsing/file validation, or if the IDs specified already exist, then no scripts are registered.
         * @param callback Invoked upon completion of the registration.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/scripting.json
         * @platform desktop, mobile
         */
        export function registerContentScripts(scripts: RegisteredContentScript[]): globalThis.Promise<void>;
        export function registerContentScripts(scripts: RegisteredContentScript[], callback: (() => void)): void;

        /**
         * Removes a CSS stylesheet that was previously inserted by this extension from a target context.
         *
         * @param injection The details of the styles to remove. Note that the `css`, `files`, and `origin` properties must exactly match the stylesheet inserted through `insertCSS`. Attempting to remove a non-existent stylesheet is a no-op.
         * @param callback Invoked upon completion of the injection.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/scripting.json
         * @platform desktop, mobile
         */
        export function removeCSS(injection: CSSInjection): globalThis.Promise<void>;
        export function removeCSS(injection: CSSInjection, callback: (() => void)): void;

        /**
         * Unregisters one or more content scripts for this extension.
         *
         * @param filter If specified, only unregisters dynamic content scripts which match the filter. Otherwise, all of the extension's dynamic content scripts are unregistered.
         * @param callback Invoked upon completion of the unregistration.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/scripting.json
         * @platform desktop, mobile
         */
        export function unregisterContentScripts(filter?: ContentScriptFilter | null): globalThis.Promise<void>;
        export function unregisterContentScripts(filter: ContentScriptFilter | null | undefined, callback: (() => void)): void;
        export function unregisterContentScripts(callback: (() => void)): void;

        /**
         * Updates one or more content scripts for this extension.
         *
         * @param scripts Contains a list of scripts to be updated. If there are errors during script parsing/file validation, or if the IDs specified do not already exist, then no scripts are updated.
         * @param callback Invoked when scripts have been updated.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/scripting.json
         * @platform desktop, mobile
         */
        export function updateContentScripts(scripts: ({
            /**
             * If specified true, it will inject into all frames, even if the frame is not the top-most frame in the tab. Each frame is checked independently for URL requirements; it will not inject into child frames if the URL requirements are not met. Defaults to false, meaning that only the top frame is matched.
             */
            allFrames?: boolean | undefined;
            /**
             * The list of CSS files to be injected into matching pages. These are injected in the order they appear in this array.
             */
            css?: browser.manifest.ExtensionURL[] | undefined;
            cssOrigin?: browser.extensionTypes.CSSOrigin | undefined;
            /**
             * Excludes pages that this content script would otherwise be injected into.
             */
            excludeMatches?: string[] | undefined;
            /**
             * The id of the content script, specified in the API call.
             */
            id: string;
            /**
             * The list of JavaScript files to be injected into matching pages. These are injected in the order they appear in this array.
             */
            js?: browser.manifest.ExtensionURL[] | undefined;
            /**
             * If matchOriginAsFallback is true, then the code is also injected in about:, data:, blob: when their origin matches the pattern in 'matches', even if the actual document origin is opaque (due to the use of CSP sandbox or iframe sandbox). Match patterns in 'matches' must specify a wildcard path glob. By default it is `false`.
             */
            matchOriginAsFallback?: boolean | undefined;
            /**
             * Specifies which pages this content script will be injected into. Must be specified for `registerContentScripts()`.
             */
            matches?: string[] | undefined;
            /**
             * Specifies if this content script will persist into future sessions.
             */
            persistAcrossSessions?: boolean | undefined;
            /**
             * Specifies when JavaScript files are injected into the web page. The preferred and default value is `document_idle`.
             */
            runAt?: browser.extensionTypes.RunAt | undefined;
            /**
             * The JavaScript world for a script to execute within. Defaults to "ISOLATED".
             */
            world?: ExecutionWorld | undefined;
        })[]): globalThis.Promise<void>;
        export function updateContentScripts(scripts: ({
            /**
             * If specified true, it will inject into all frames, even if the frame is not the top-most frame in the tab. Each frame is checked independently for URL requirements; it will not inject into child frames if the URL requirements are not met. Defaults to false, meaning that only the top frame is matched.
             */
            allFrames?: boolean | undefined;
            /**
             * The list of CSS files to be injected into matching pages. These are injected in the order they appear in this array.
             */
            css?: browser.manifest.ExtensionURL[] | undefined;
            cssOrigin?: browser.extensionTypes.CSSOrigin | undefined;
            /**
             * Excludes pages that this content script would otherwise be injected into.
             */
            excludeMatches?: string[] | undefined;
            /**
             * The id of the content script, specified in the API call.
             */
            id: string;
            /**
             * The list of JavaScript files to be injected into matching pages. These are injected in the order they appear in this array.
             */
            js?: browser.manifest.ExtensionURL[] | undefined;
            /**
             * If matchOriginAsFallback is true, then the code is also injected in about:, data:, blob: when their origin matches the pattern in 'matches', even if the actual document origin is opaque (due to the use of CSP sandbox or iframe sandbox). Match patterns in 'matches' must specify a wildcard path glob. By default it is `false`.
             */
            matchOriginAsFallback?: boolean | undefined;
            /**
             * Specifies which pages this content script will be injected into. Must be specified for `registerContentScripts()`.
             */
            matches?: string[] | undefined;
            /**
             * Specifies if this content script will persist into future sessions.
             */
            persistAcrossSessions?: boolean | undefined;
            /**
             * Specifies when JavaScript files are injected into the web page. The preferred and default value is `document_idle`.
             */
            runAt?: browser.extensionTypes.RunAt | undefined;
            /**
             * The JavaScript world for a script to execute within. Defaults to "ISOLATED".
             */
            world?: ExecutionWorld | undefined;
        })[], callback: (() => void)): void;

    }

    /**
     * Use browser.search to interact with search engines.
     *
     * Not available in content scripts or devtools pages.
     *
     * @permission search
     * @platform desktop
     */
    export namespace search {
        /**
         * Location where search results should be displayed.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/search.json
         * @platform desktop
         */
        export type Disposition = "CURRENT_TAB" | "NEW_TAB" | "NEW_WINDOW";

        /**
         * An object encapsulating a search engine
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/search.json
         * @platform desktop
         */
        export interface SearchEngine {
            alias?: string | undefined;
            favIconUrl?: string | undefined;
            isDefault: boolean;
            name: string;
        }

        /**
         * Gets a list of search engines.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/search.json
         * @platform desktop
         */
        export function get(): globalThis.Promise<SearchEngine[]>;

        /**
         * Use the chrome.search API to search via the default provider.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/search.json
         * @platform desktop
         */
        export function query(queryInfo: query.QueryInfo): globalThis.Promise<void>;
        export function query(queryInfo: query.QueryInfo, callback: (() => void)): void;
        export namespace query {
            export type QueryInfo = {
                /**
                 * Location where search results should be displayed. CURRENT_TAB is the default.
                 */
                disposition?: Disposition | undefined;
                /**
                 * Location where search results should be displayed. tabId cannot be used with disposition.
                 */
                tabId?: number | undefined;
                /**
                 * String to query with the default search provider.
                 */
                text: string;
            };
        }

        /**
         * Perform a search.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/search.json
         * @platform desktop
         */
        export function search(searchProperties: search.SearchProperties): globalThis.Promise<void>;
        export namespace search {
            export type SearchProperties = {
                /**
                 * Location where search results should be displayed. NEW_TAB is the default.
                 */
                disposition?: Disposition | undefined;
                /**
                 * Search engine to use. Uses the default if not specified.
                 */
                engine?: string | undefined;
                /**
                 * Terms to search for.
                 */
                query: string;
                /**
                 * The ID of the tab for the search results. If not specified, a new tab is created, unless disposition is set. tabId cannot be used with disposition.
                 */
                tabId?: number | undefined;
            };
        }

    }

    /**
     * Use the `chrome.sessions` API to query and restore tabs and windows from a browsing session.
     *
     * Not available in content scripts or devtools pages.
     *
     * @permission sessions
     * @platform desktop
     */
    export namespace sessions {
        /**
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sessions.json
         * @platform desktop
         */
        export interface Device {
            /**
             * The name of the foreign device.
             */
            deviceName: string;
            info: string;
            /**
             * A list of open window sessions for the foreign device, sorted from most recently to least recently modified session.
             */
            sessions: Session[];
        }

        /**
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sessions.json
         * @platform desktop
         */
        export interface Filter {
            /**
             * The maximum number of entries to be fetched in the requested list. Omit this parameter to fetch the maximum number of entries ({@link browser.sessions.MAX_SESSION_RESULTS}).
             */
            maxResults?: number | undefined;
        }

        /**
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sessions.json
         * @platform desktop
         */
        export interface Session {
            /**
             * The time when the window or tab was closed or modified, represented in milliseconds since the epoch.
             */
            lastModified: number;
            /**
             * The {@link browser.tabs.Tab}, if this entry describes a tab. Either this or {@link browser.sessions.Session.window} will be set.
             */
            tab?: browser.tabs.Tab | undefined;
            /**
             * The {@link browser.windows.Window}, if this entry describes a window. Either this or {@link browser.sessions.Session.tab} will be set.
             */
            window?: browser.windows.Window | undefined;
        }

        /**
         * The maximum number of {@link browser.sessions.Session} that will be included in a requested list.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sessions.json
         * @platform desktop
         */
        export const MAX_SESSION_RESULTS: number;

        /**
         * Fired when recently closed tabs and/or windows are changed. This event does not monitor synced sessions changes.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sessions.json
         * @platform desktop
         */
        export const onChanged: WebExtensionEvent<() => void>;

        /**
         * Forget a recently closed tab.
         *
         * @param windowId The windowId of the window to which the recently closed tab to be forgotten belongs.
         * @param sessionId The sessionId (closedId) of the recently closed tab to be forgotten.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sessions.json
         * @platform desktop
         */
        export function forgetClosedTab(windowId: number, sessionId: string): globalThis.Promise<void>;

        /**
         * Forget a recently closed window.
         *
         * @param sessionId The sessionId (closedId) of the recently closed window to be forgotten.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sessions.json
         * @platform desktop
         */
        export function forgetClosedWindow(sessionId: string): globalThis.Promise<void>;

        /**
         * Retrieves all devices with synced sessions.
         *
         * @returns The list of {@link browser.sessions.Device} objects for each synced session, sorted in order from device with most recently modified session to device with least recently modified session. {@link browser.tabs.Tab} objects are sorted by recency in the {@link browser.windows.Window} of the {@link browser.sessions.Session} objects.
         * @deprecated Firefox does not support this function; it does not exist at runtime.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sessions.json
         */
        export function getDevices(filter?: Filter | null): globalThis.Promise<Device[]>;
        export function getDevices(filter: Filter | null | undefined, callback: ((devices: Device[]) => void)): void;
        export function getDevices(callback: ((devices: Device[]) => void)): void;

        /**
         * Gets the list of recently closed tabs and/or windows.
         *
         * @returns The list of closed entries in reverse order that they were closed (the most recently closed tab or window will be at index `0`). The entries may contain either tabs or windows.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sessions.json
         * @platform desktop
         */
        export function getRecentlyClosed(filter?: Filter | null): globalThis.Promise<Session[]>;
        export function getRecentlyClosed(filter: Filter | null | undefined, callback: ((sessions: Session[]) => void)): void;
        export function getRecentlyClosed(callback: ((sessions: Session[]) => void)): void;

        /**
         * Retrieve a value that was set for a given key on a given tab.
         *
         * @param tabId The id of the tab whose value is being retrieved from.
         * @param key The key which corresponds to the value.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sessions.json
         * @platform desktop
         */
        export function getTabValue(tabId: number, key: string): globalThis.Promise<any>;

        /**
         * Retrieve a value that was set for a given key on a given window.
         *
         * @param windowId The id of the window whose value is being retrieved from.
         * @param key The key which corresponds to the value.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sessions.json
         * @platform desktop
         */
        export function getWindowValue(windowId: number, key: string): globalThis.Promise<any>;

        /**
         * Remove a key/value pair that was set on a given tab.
         *
         * @param tabId The id of the tab whose key/value pair is being removed.
         * @param key The key which corresponds to the value.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sessions.json
         * @platform desktop
         */
        export function removeTabValue(tabId: number, key: string): globalThis.Promise<void>;

        /**
         * Remove a key/value pair that was set on a given window.
         *
         * @param windowId The id of the window whose key/value pair is being removed.
         * @param key The key which corresponds to the value.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sessions.json
         * @platform desktop
         */
        export function removeWindowValue(windowId: number, key: string): globalThis.Promise<void>;

        /**
         * Reopens a {@link browser.windows.Window} or {@link browser.tabs.Tab}, with an optional callback to run when the entry has been restored.
         *
         * @param sessionId The {@link browser.windows.Window.sessionId}, or {@link browser.tabs.Tab.sessionId} to restore. If this parameter is not specified, the most recently closed session is restored.
         * @returns A {@link browser.sessions.Session} containing the restored {@link browser.windows.Window} or {@link browser.tabs.Tab} object.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sessions.json
         * @platform desktop
         */
        export function restore(sessionId?: string | null): globalThis.Promise<Session>;
        export function restore(sessionId: string | null | undefined, callback: ((restoredSession: Session) => void)): void;
        export function restore(callback: ((restoredSession: Session) => void)): void;

        /**
         * Set a key/value pair on a given tab.
         *
         * @param tabId The id of the tab that the key/value pair is being set on.
         * @param key The key which corresponds to the value being set.
         * @param value The value being set.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sessions.json
         * @platform desktop
         */
        export function setTabValue(tabId: number, key: string, value: any): globalThis.Promise<void>;

        /**
         * Set a key/value pair on a given window.
         *
         * @param windowId The id of the window that the key/value pair is being set on.
         * @param key The key which corresponds to the value being set.
         * @param value The value being set.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sessions.json
         * @platform desktop
         */
        export function setWindowValue(windowId: number, key: string, value: any): globalThis.Promise<void>;

    }

    /**
     * Use sidebar actions to add a sidebar to Firefox.
     *
     * Not available in content scripts or devtools pages.
     *
     * @permission manifest:sidebar_action
     * @platform desktop
     */
    export namespace sidebarAction {
        /**
         * Pixel data for an image. Must be an ImageData object (for example, from a `canvas` element).
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sidebar_action.json
         * @platform desktop
         */
        export type ImageDataType = globalThis.ImageData;

        /**
         * Closes the extension sidebar in the active window if the sidebar belongs to the extension.
         *
         * Must be called from a user input handler.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sidebar_action.json
         * @platform desktop
         */
        export function close(): globalThis.Promise<void>;

        /**
         * Gets the url to the html document set as the panel for this sidebar action.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sidebar_action.json
         * @platform desktop
         */
        export function getPanel(details: getPanel.Details): globalThis.Promise<string>;
        export namespace getPanel {
            export type Details = {
                /**
                 * Specify the tab to get the panel from. If no tab nor window is specified, the global panel is returned.
                 */
                tabId?: number | undefined;
                /**
                 * Specify the window to get the panel from. If no tab nor window is specified, the global panel is returned.
                 */
                windowId?: number | undefined;
            };
        }

        /**
         * Gets the title of the sidebar action.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sidebar_action.json
         * @platform desktop
         */
        export function getTitle(details: getTitle.Details): globalThis.Promise<string>;
        export namespace getTitle {
            export type Details = {
                /**
                 * Specify the tab to get the title from. If no tab nor window is specified, the global title is returned.
                 */
                tabId?: number | undefined;
                /**
                 * Specify the window to get the title from. If no tab nor window is specified, the global title is returned.
                 */
                windowId?: number | undefined;
            };
        }

        /**
         * Checks whether the sidebar action is open.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sidebar_action.json
         * @platform desktop
         */
        export function isOpen(details: isOpen.Details): globalThis.Promise<boolean>;
        export namespace isOpen {
            export type Details = {
                /**
                 * Specify the window to get the openness from.
                 */
                windowId?: number | undefined;
            };
        }

        /**
         * Opens the extension sidebar in the active window.
         *
         * Must be called from a user input handler.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sidebar_action.json
         * @platform desktop
         */
        export function open(): globalThis.Promise<void>;

        /**
         * Sets the icon for the sidebar action. The icon can be specified either as the path to an image file or as the pixel data from a canvas element, or as dictionary of either one of those. Either the **path** or the **imageData** property must be specified.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sidebar_action.json
         * @platform desktop
         */
        export function setIcon(details: setIcon.Details): globalThis.Promise<void>;
        export namespace setIcon {
            export type Details = {
                /**
                 * Either an ImageData object or a dictionary {size -> ImageData} representing icon to be set. If the icon is specified as a dictionary, the actual image to be used is chosen depending on screen's pixel density. If the number of image pixels that fit into one screen space unit equals `scale`, then image with size `scale` * 19 will be selected. Initially only scales 1 and 2 will be supported. At least one image must be specified. Note that 'details.imageData = foo' is equivalent to 'details.imageData = {'19': foo}'
                 */
                imageData?: ImageDataType | { [key: number]: ImageDataType } | undefined;
                /**
                 * Either a relative image path or a dictionary {size -> relative image path} pointing to icon to be set. If the icon is specified as a dictionary, the actual image to be used is chosen depending on screen's pixel density. If the number of image pixels that fit into one screen space unit equals `scale`, then image with size `scale` * 19 will be selected. Initially only scales 1 and 2 will be supported. At least one image must be specified. Note that 'details.path = foo' is equivalent to 'details.imageData = {'19': foo}'
                 */
                path?: string | { [key: string]: string } | undefined;
                /**
                 * Sets the sidebar icon for the tab specified by tabId. Automatically resets when the tab is closed.
                 */
                tabId?: number | undefined;
                /**
                 * Sets the sidebar icon for the window specified by windowId.
                 */
                windowId?: number | undefined;
            };
        }

        /**
         * Sets the url to the html document to be opened in the sidebar when the user clicks on the sidebar action's icon.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sidebar_action.json
         * @platform desktop
         */
        export function setPanel(details: setPanel.Details): globalThis.Promise<void>;
        export namespace setPanel {
            export type Details = {
                /**
                 * The url to the html file to show in a sidebar.  If set to the empty string (''), no sidebar is shown.
                 */
                panel: string | null;
                /**
                 * Sets the sidebar url for the tab specified by tabId. Automatically resets when the tab is closed.
                 */
                tabId?: number | undefined;
                /**
                 * Sets the sidebar url for the window specified by windowId.
                 */
                windowId?: number | undefined;
            };
        }

        /**
         * Sets the title of the sidebar action. This shows up in the tooltip.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sidebar_action.json
         * @platform desktop
         */
        export function setTitle(details: setTitle.Details): globalThis.Promise<void>;
        export namespace setTitle {
            export type Details = {
                /**
                 * Sets the sidebar title for the tab specified by tabId. Automatically resets when the tab is closed.
                 */
                tabId?: number | undefined;
                /**
                 * The string the sidebar action should display when moused over.
                 */
                title: string | null;
                /**
                 * Sets the sidebar title for the window specified by windowId.
                 */
                windowId?: number | undefined;
            };
        }

        /**
         * Toggles the extension sidebar in the active window.
         *
         * Must be called from a user input handler.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sidebar_action.json
         * @platform desktop
         */
        export function toggle(): globalThis.Promise<void>;

    }

    /**
     * Use the `browser.storage` API to store, retrieve, and track changes to user data.
     *
     * Also available in content scripts and devtools pages.
     *
     * @permission storage
     * @platform desktop, mobile
     */
    export namespace storage {
        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/storage.json
         * @platform desktop, mobile
         */
        export interface StorageArea {
            /**
             * Removes all items from storage.
             *
             * @param callback Callback on success, or on failure (in which case {@link browser.runtime.lastError} will be set).
             * @platform desktop, mobile
             */
            clear(): globalThis.Promise<void>;
            clear(callback: (() => void)): void;
            /**
             * Gets one or more items from storage.
             *
             * @param keys A single key to get, list of keys to get, or a dictionary specifying default values (see description of the object).  An empty list or object will return an empty result object.  Pass in `null` to get the entire contents of storage.
             * @param callback Callback with storage items, or on failure (in which case {@link browser.runtime.lastError} will be set).
             * @returns Object with items in their key-value mappings.
             * @platform desktop, mobile
             */
            get(keys?: string | string[] | Record<string, unknown> | null): globalThis.Promise<Record<string, any>>;
            get(keys: string | string[] | Record<string, any> | null | undefined, callback: ((items: Record<string, any>) => void)): void;
            get(callback: ((items: Record<string, any>) => void)): void;
            /**
             * Gets the amount of space (in bytes) being used by one or more items.
             *
             * @param keys A single key or list of keys to get the total usage for. An empty list will return 0. Pass in `null` to get the total usage of all of storage.
             * @param callback Callback with the amount of space being used by storage, or on failure (in which case {@link browser.runtime.lastError} will be set).
             * @returns Amount of space being used in storage, in bytes.
             * @platform desktop, mobile
             */
            getBytesInUse(keys?: string | string[] | null): globalThis.Promise<number>;
            getBytesInUse(keys: string | string[] | null | undefined, callback: ((bytesInUse: number) => void)): void;
            getBytesInUse(callback: ((bytesInUse: number) => void)): void;
            /**
             * Gets the keys of all items in storage.
             *
             * @param callback Callback with the keys of all items in storage, or on failure (in which case {@link browser.runtime.lastError} will be set).
             * @returns The keys of all items in storage.
             * @platform desktop, mobile
             */
            getKeys(): globalThis.Promise<string[]>;
            getKeys(callback: ((keys: string[]) => void)): void;
            /**
             * Removes one or more items from storage.
             *
             * @param keys A single key or a list of keys for items to remove.
             * @param callback Callback on success, or on failure (in which case {@link browser.runtime.lastError} will be set).
             * @platform desktop, mobile
             */
            remove(keys: string | string[]): globalThis.Promise<void>;
            remove(keys: string | string[], callback: (() => void)): void;
            /**
             * Sets multiple items.
             *
             * @param items An object which gives each key/value pair to update storage with. Any other key/value pairs in storage will not be affected.
             *
             * Primitive values such as numbers will serialize as expected. Values with a `typeof` `"object"` and `"function"` will typically serialize to `{}`, with the exception of `Array` (serializes as expected), `Date`, and `Regex` (serialize using their `String` representation).
             * @param callback Callback on success, or on failure (in which case {@link browser.runtime.lastError} will be set).
             * @platform desktop, mobile
             */
            set(items: Record<string, any>): globalThis.Promise<void>;
            set(items: Record<string, any>, callback: (() => void)): void;
            /**
             * Fired when one or more items change.
             *
             * @param changes Object mapping each key that changed to its corresponding {@link browser.storage.StorageChange} for that item.
             * @platform desktop, mobile
             */
            onChanged: WebExtensionEvent<(changes: { [key: string]: StorageChange }) => void>;
        }

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/storage.json
         * @platform desktop, mobile
         */
        export interface StorageChange {
            /**
             * The new value of the item, if there is a new value.
             */
            newValue?: any;
            /**
             * The old value of the item, if there was an old value.
             */
            oldValue?: any;
        }

        /**
         * Items in the `local` storage area are local to each machine.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/storage.json
         * @platform desktop, mobile
         */
        export const local: StorageArea;
        /**
         * Items in the `managed` storage area are set by administrators or native applications, and are read-only for the extension; trying to modify this namespace results in an error.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/storage.json
         * @platform desktop, mobile
         */
        export const managed: StorageArea;
        /**
         * Items in the `session` storage area are kept in memory, and only until the either browser or extension is closed or reloaded.
         *
         * Also available in devtools pages, but not in content scripts.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/storage.json
         * @platform desktop, mobile
         */
        export const session: StorageArea;
        /**
         * Items in the `sync` storage area are synced by the browser.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/storage.json
         * @platform desktop, mobile
         */
        export const sync: StorageArea;

        /**
         * Fired when one or more items change.
         *
         * @param changes Object mapping each key that changed to its corresponding {@link browser.storage.StorageChange} for that item.
         * @param areaName The name of the storage area (`"session"`, `"sync"`, `"local"` or `"managed"`) the changes are for.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/storage.json
         * @platform desktop, mobile
         */
        export const onChanged: WebExtensionEvent<(changes: { [key: string]: StorageChange }, areaName: string) => void>;

    }

    /**
     * Use the browser.tabGroups API to interact with the browser's tab grouping system. You can use this API to modify, and rearrange tab groups.
     *
     * Not available in content scripts or devtools pages.
     *
     * @permission tabGroups
     * @platform desktop
     */
    export namespace tabGroups {
        /**
         * The group's color, using 'grey' spelling for compatibility with Chromium.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabGroups.json
         * @platform desktop
         */
        export type Color = "blue" | "cyan" | "grey" | "green" | "orange" | "pink" | "purple" | "red" | "yellow";

        /**
         * State of a tab group inside of an open window.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabGroups.json
         * @platform desktop
         */
        export interface TabGroup {
            /**
             * Whether the tab group is collapsed or expanded in the tab strip.
             */
            collapsed: boolean;
            /**
             * User-selected color name for the tab group's label/icons.
             */
            color: Color;
            /**
             * Unique ID of the tab group.
             */
            id: number;
            /**
             * User-defined name of the tab group.
             */
            title?: string | undefined;
            /**
             * Window that the tab group is in.
             */
            windowId: number;
        }

        /**
         * An ID that represents the absence of a group.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabGroups.json
         * @platform desktop
         */
        export const TAB_GROUP_ID_NONE: number;

        /**
         * Fired when a tab group is created.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabGroups.json
         * @platform desktop
         */
        export const onCreated: WebExtensionEvent<(group: TabGroup) => void>;

        /**
         * Fired when a tab group is moved, within a window or to another window.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabGroups.json
         * @platform desktop
         */
        export const onMoved: WebExtensionEvent<(group: TabGroup) => void>;

        /**
         * Fired when a tab group is removed.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabGroups.json
         * @platform desktop
         */
        export const onRemoved: WebExtensionEvent<(group: TabGroup, removeInfo: onRemoved.RemoveInfo) => void>;
        export namespace onRemoved {
            export type RemoveInfo = {
                /**
                 * True when the tab group is being closed because its window is being closed.
                 */
                isWindowClosing: boolean;
            };
        }

        /**
         * Fired when a tab group is updated.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabGroups.json
         * @platform desktop
         */
        export const onUpdated: WebExtensionEvent<(group: TabGroup) => void>;

        /**
         * Retrieves details about the specified group.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabGroups.json
         * @platform desktop
         */
        export function get(groupId: number): globalThis.Promise<TabGroup>;
        export function get(groupId: number, callback: ((group: TabGroup) => void)): void;

        /**
         * Move a group within, or to another window.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabGroups.json
         * @platform desktop
         */
        export function move(groupId: number, moveProperties: move.MoveProperties): globalThis.Promise<TabGroup>;
        export function move(groupId: number, moveProperties: move.MoveProperties, callback: ((group: TabGroup) => void)): void;
        export namespace move {
            export type MoveProperties = {
                index: number;
                windowId?: number | undefined;
            };
        }

        /**
         * Return all grups, or find groups with specified properties.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabGroups.json
         * @platform desktop
         */
        export function query(queryInfo: query.QueryInfo): globalThis.Promise<TabGroup[]>;
        export function query(queryInfo: query.QueryInfo, callback: ((groups: TabGroup[]) => void)): void;
        export namespace query {
            export type QueryInfo = {
                collapsed?: boolean | undefined;
                color?: Color | undefined;
                title?: string | undefined;
                windowId?: number | undefined;
            };
        }

        /**
         * Modifies state of a specified group.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabGroups.json
         * @platform desktop
         */
        export function update(groupId: number, updateProperties: update.UpdateProperties): globalThis.Promise<TabGroup>;
        export function update(groupId: number, updateProperties: update.UpdateProperties, callback: ((group: TabGroup) => void)): void;
        export namespace update {
            export type UpdateProperties = {
                collapsed?: boolean | undefined;
                color?: Color | undefined;
                title?: string | undefined;
            };
        }

    }

    /**
     * Use the `browser.tabs` API to interact with the browser's tab system. You can use this API to create, modify, and rearrange tabs in the browser.
     *
     * Not available in content scripts or devtools pages.
     *
     * @platform desktop, mobile
     */
    export namespace tabs {
        /**
         * Tab muted state and the reason for the last state change.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop, mobile
         */
        export interface MutedInfo {
            /**
             * The ID of the extension that changed the muted state. Not set if an extension was not the reason the muted state last changed.
             */
            extensionId?: string | undefined;
            /**
             * Whether the tab is prevented from playing sound (but hasn't necessarily recently produced sound). Equivalent to whether the muted audio indicator is showing.
             */
            muted: boolean;
            /**
             * The reason the tab was muted or unmuted. Not set if the tab's mute state has never been changed.
             */
            reason?: MutedInfoReason | undefined;
        }

        /**
         * An event that caused a muted state change.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop, mobile
         */
        export type MutedInfoReason = "user" | "capture" | "extension";

        /**
         * Defines the page settings to be used when saving a page as a pdf file.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export interface PageSettings {
            /**
             * The spacing between the bottom of the footers and the bottom edge of the paper (inches). Default: 0.
             */
            edgeBottom?: number | undefined;
            /**
             * The spacing between the left header/footer and the left edge of the paper (inches). Default: 0.
             */
            edgeLeft?: number | undefined;
            /**
             * The spacing between the right header/footer and the right edge of the paper (inches). Default: 0.
             */
            edgeRight?: number | undefined;
            /**
             * The spacing between the top of the headers and the top edge of the paper (inches). Default: 0
             */
            edgeTop?: number | undefined;
            /**
             * The text for the page's center footer. Default: ''.
             */
            footerCenter?: string | undefined;
            /**
             * The text for the page's left footer. Default: '&PT'.
             */
            footerLeft?: string | undefined;
            /**
             * The text for the page's right footer. Default: '&D'.
             */
            footerRight?: string | undefined;
            /**
             * The text for the page's center header. Default: ''.
             */
            headerCenter?: string | undefined;
            /**
             * The text for the page's left header. Default: '&T'.
             */
            headerLeft?: string | undefined;
            /**
             * The text for the page's right header. Default: '&U'.
             */
            headerRight?: string | undefined;
            /**
             * The margin between the page content and the bottom edge of the paper (inches). Default: 0.5.
             */
            marginBottom?: number | undefined;
            /**
             * The margin between the page content and the left edge of the paper (inches). Default: 0.5.
             */
            marginLeft?: number | undefined;
            /**
             * The margin between the page content and the right edge of the paper (inches). Default: 0.5.
             */
            marginRight?: number | undefined;
            /**
             * The margin between the page content and the top edge of the paper (inches). Default: 0.5.
             */
            marginTop?: number | undefined;
            /**
             * The page content orientation: 0 = portrait, 1 = landscape. Default: 0.
             */
            orientation?: number | undefined;
            /**
             * The paper height in paper size units. Default: 11.0.
             */
            paperHeight?: number | undefined;
            /**
             * The page size unit: 0 = inches, 1 = millimeters. Default: 0.
             */
            paperSizeUnit?: number | undefined;
            /**
             * The paper width in paper size units. Default: 8.5.
             */
            paperWidth?: number | undefined;
            /**
             * The page content scaling factor: 1.0 = 100% = normal size. Default: 1.0.
             */
            scaling?: number | undefined;
            /**
             * Whether the page background colors should be shown. Default: false.
             */
            showBackgroundColors?: boolean | undefined;
            /**
             * Whether the page background images should be shown. Default: false.
             */
            showBackgroundImages?: boolean | undefined;
            /**
             * Whether the page content should shrink to fit the page width (overrides scaling). Default: true.
             */
            shrinkToFit?: boolean | undefined;
            /**
             * The name of the file. May include optional .pdf extension.
             */
            toFileName?: string | undefined;
        }

        /**
         * Tab sharing state for screen, microphone and camera.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop, mobile
         */
        export interface SharingState {
            /**
             * True if the tab is using the camera.
             */
            camera: boolean;
            /**
             * True if the tab is using the microphone.
             */
            microphone: boolean;
            /**
             * If the tab is sharing the screen the value will be one of "Screen", "Window", or "Application", or undefined if not screen sharing.
             */
            screen?: string | undefined;
        }

        /**
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop, mobile
         */
        export interface Tab {
            /**
             * Whether the tab is active in its window. (Does not necessarily mean the window is focused.)
             */
            active: boolean;
            /**
             * Whether the tab is drawing attention.
             */
            attention?: boolean | undefined;
            /**
             * Whether the tab has produced sound over the past couple of seconds (but it might not be heard if also muted). Equivalent to whether the speaker audio indicator is showing.
             */
            audible?: boolean | undefined;
            /**
             * Whether the tab can be discarded automatically by the browser when resources are low.
             */
            autoDiscardable?: boolean | undefined;
            /**
             * The CookieStoreId used for the tab.
             */
            cookieStoreId?: string | undefined;
            /**
             * True while the tab is not loaded with content.
             */
            discarded?: boolean | undefined;
            /**
             * The URL of the tab's favicon. This property is only present if the extension's manifest includes the `"tabs"` permission. It may also be an empty string if the tab is loading.
             *
             * @permission tabs
             */
            favIconUrl?: string | undefined;
            /**
             * The ID of the group that the tab belongs to. {@link browser.tabGroups.TAB_GROUP_ID_NONE} (-1) if the tab does not belong to a tab group.
             */
            groupId?: number | undefined;
            /**
             * The height of the tab in pixels.
             */
            height?: number | undefined;
            /**
             * True if the tab is hidden.
             */
            hidden?: boolean | undefined;
            /**
             * Whether the tab is highlighted. Works as an alias of active
             */
            highlighted: boolean;
            /**
             * The ID of the tab. Tab IDs are unique within a browser session. Under some circumstances a Tab may not be assigned an ID, for example when querying foreign tabs using the {@link browser.sessions} API, in which case a session ID may be present. Tab ID can also be set to {@link browser.tabs.TAB_ID_NONE} for apps and devtools windows.
             */
            id?: number | undefined;
            /**
             * Whether the tab is in an incognito window.
             */
            incognito: boolean;
            /**
             * The zero-based index of the tab within its window.
             */
            index: number;
            /**
             * Whether the document in the tab can be rendered in reader mode.
             */
            isArticle?: boolean | undefined;
            /**
             * Whether the document in the tab is being rendered in reader mode.
             */
            isInReaderMode?: boolean | undefined;
            /**
             * The last time the tab was accessed as the number of milliseconds since epoch.
             */
            lastAccessed?: number | undefined;
            /**
             * Current tab muted state and the reason for the last state change.
             */
            mutedInfo?: MutedInfo | undefined;
            /**
             * The ID of the tab that opened this tab, if any. This property is only present if the opener tab still exists.
             */
            openerTabId?: number | undefined;
            /**
             * Whether the tab is pinned.
             */
            pinned: boolean;
            /**
             * The session ID used to uniquely identify a Tab obtained from the {@link browser.sessions} API.
             */
            sessionId?: string | undefined;
            /**
             * Current tab sharing state for screen, microphone and camera.
             */
            sharingState?: SharingState | undefined;
            /**
             * The ID of the Split View that the tab belongs to. {@link browser.tabs.SPLIT_VIEW_ID_NONE} if the tab does not belong to a split view.
             */
            splitViewId?: number | undefined;
            /**
             * Either _loading_ or _complete_.
             */
            status?: string | undefined;
            /**
             * The ID of this tab's successor, if any; {@link browser.tabs.TAB_ID_NONE} otherwise.
             */
            successorTabId?: number | undefined;
            /**
             * The title of the tab. This property is only present if the extension's manifest includes the `"tabs"` permission.
             *
             * @permission tabs
             */
            title?: string | undefined;
            /**
             * The URL the tab is displaying. This property is only present if the extension's manifest includes the `"tabs"` permission.
             *
             * @permission tabs
             */
            url?: string | undefined;
            /**
             * The width of the tab in pixels.
             */
            width?: number | undefined;
            /**
             * The ID of the window the tab is contained within.
             */
            windowId?: number | undefined;
        }

        /**
         * Whether the tabs have completed loading.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop, mobile
         */
        export type TabStatus = "loading" | "complete";

        /**
         * An object describing filters to apply to tabs.onUpdated events.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export interface UpdateFilter {
            cookieStoreId?: string | undefined;
            /**
             * A list of property names. Events that do not match any of the names will be filtered out.
             */
            properties?: UpdatePropertyName[] | undefined;
            tabId?: number | undefined;
            /**
             * A list of URLs or URL patterns. Events that cannot match any of the URLs will be filtered out.  Filtering with urls requires the `"tabs"` or  `"activeTab"` permission.
             */
            urls?: string[] | undefined;
            windowId?: number | undefined;
        }

        /**
         * Event names supported in onUpdated.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export type UpdatePropertyName = "attention" | "audible" | "autoDiscardable" | "discarded" | "favIconUrl" | "groupId" | "hidden" | "isArticle" | "mutedInfo" | "pinned" | "sharingState" | "splitViewId" | "status" | "title" | "url";

        /**
         * The type of window.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop, mobile
         */
        export type WindowType = "normal" | "popup" | "panel" | "app" | "devtools";

        /**
         * Defines how zoom changes in a tab are handled and at what scope.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop, mobile
         */
        export interface ZoomSettings {
            /**
             * Used to return the default zoom level for the current tab in calls to tabs.getZoomSettings.
             */
            defaultZoomFactor?: number | undefined;
            /**
             * Defines how zoom changes are handled, i.e. which entity is responsible for the actual scaling of the page; defaults to `automatic`.
             */
            mode?: ZoomSettingsMode | undefined;
            /**
             * Defines whether zoom changes will persist for the page's origin, or only take effect in this tab; defaults to `per-origin` when in `automatic` mode, and `per-tab` otherwise.
             */
            scope?: ZoomSettingsScope | undefined;
        }

        /**
         * Defines how zoom changes are handled, i.e. which entity is responsible for the actual scaling of the page; defaults to `automatic`.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop, mobile
         */
        export type ZoomSettingsMode = "automatic" | "manual" | "disabled";

        /**
         * Defines whether zoom changes will persist for the page's origin, or only take effect in this tab; defaults to `per-origin` when in `automatic` mode, and `per-tab` otherwise.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop, mobile
         */
        export type ZoomSettingsScope = "per-origin" | "per-tab";

        /**
         * A value for use with splitViewId to represent that the tab is not a member of a Split View.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop, mobile
         */
        export const SPLIT_VIEW_ID_NONE: number;
        /**
         * An ID which represents the absence of a browser tab.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop, mobile
         */
        export const TAB_ID_NONE: number;

        /**
         * Fires when the active tab in a window changes. Note that the tab's URL may not be set at the time this event fired, but you can listen to onUpdated events to be notified when a URL is set.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop, mobile
         */
        export const onActivated: WebExtensionEvent<(activeInfo: onActivated.ActiveInfo) => void>;
        export namespace onActivated {
            export type ActiveInfo = {
                /**
                 * The ID of the tab that was previously active, if that tab is still open.
                 */
                previousTabId?: number | undefined;
                /**
                 * The ID of the tab that has become active.
                 */
                tabId: number;
                /**
                 * The ID of the window the active tab changed inside of.
                 */
                windowId: number;
            };
        }

        /**
         * Fired when a tab is attached to a window, for example because it was moved between windows.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop, mobile
         */
        export const onAttached: WebExtensionEvent<(tabId: number, attachInfo: onAttached.AttachInfo) => void>;
        export namespace onAttached {
            export type AttachInfo = {
                newPosition: number;
                newWindowId: number;
            };
        }

        /**
         * Fired when a tab is created. Note that the tab's URL may not be set at the time this event fired, but you can listen to onUpdated events to be notified when a URL is set.
         *
         * @param tab Details of the tab that was created.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop, mobile
         */
        export const onCreated: WebExtensionEvent<(tab: Tab) => void>;

        /**
         * Fired when a tab is detached from a window, for example because it is being moved between windows.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop, mobile
         */
        export const onDetached: WebExtensionEvent<(tabId: number, detachInfo: onDetached.DetachInfo) => void>;
        export namespace onDetached {
            export type DetachInfo = {
                oldPosition: number;
                oldWindowId: number;
            };
        }

        /**
         * Fired when the highlighted or selected tabs in a window changes.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop, mobile
         */
        export const onHighlighted: WebExtensionEvent<(highlightInfo: onHighlighted.HighlightInfo) => void>;
        export namespace onHighlighted {
            export type HighlightInfo = {
                /**
                 * All highlighted tabs in the window.
                 */
                tabIds: number[];
                /**
                 * The window whose tabs changed.
                 */
                windowId: number;
            };
        }

        /**
         * Fired when a tab is moved within a window. Only one move event is fired, representing the tab the user directly moved. Move events are not fired for the other tabs that must move in response. This event is not fired when a tab is moved between windows. For that, see {@link browser.tabs.onDetached}.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop, mobile
         */
        export const onMoved: WebExtensionEvent<(tabId: number, moveInfo: onMoved.MoveInfo) => void>;
        export namespace onMoved {
            export type MoveInfo = {
                fromIndex: number;
                toIndex: number;
                windowId: number;
            };
        }

        /**
         * Fired when a tab is closed.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop, mobile
         */
        export const onRemoved: WebExtensionEvent<(tabId: number, removeInfo: onRemoved.RemoveInfo) => void>;
        export namespace onRemoved {
            export type RemoveInfo = {
                /**
                 * True when the tab is being closed because its window is being closed.
                 */
                isWindowClosing: boolean;
                /**
                 * The window whose tab is closed.
                 */
                windowId: number;
            };
        }

        /**
         * Fired when a tab is replaced with another tab due to prerendering or instant.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop, mobile
         */
        export const onReplaced: WebExtensionEvent<(addedTabId: number, removedTabId: number) => void>;

        /**
         * Fired when a tab is updated.
         *
         * @param changeInfo Lists the changes to the state of the tab that was updated.
         * @param tab Gives the state of the tab that was updated.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop, mobile
         */
        export const onUpdated: Omit<WebExtensionEvent<(tabId: number, changeInfo: onUpdated.ChangeInfo, tab: Tab) => void>, "addListener"> & { addListener(callback: (tabId: number, changeInfo: onUpdated.ChangeInfo, tab: Tab) => void, filter?: UpdateFilter | null): void };
        export namespace onUpdated {
            /**
             * Lists the changes to the state of the tab that was updated.
             */
            export type ChangeInfo = {
                /**
                 * The tab's new attention state.
                 */
                attention?: boolean | undefined;
                /**
                 * The tab's new audible state.
                 */
                audible?: boolean | undefined;
                /**
                 * The tab's new autoDiscardable state.
                 */
                autoDiscardable?: boolean | undefined;
                /**
                 * True while the tab is not loaded with content.
                 */
                discarded?: boolean | undefined;
                /**
                 * The tab's new favicon URL. This property is only present if the extension's manifest includes the `"tabs"` permission.
                 *
                 * @permission tabs
                 */
                favIconUrl?: string | undefined;
                /**
                 * The tab's new group ID. {@link browser.tabGroups.TAB_GROUP_ID_NONE} (-1) if the tab no longer belongs to a tab group.
                 */
                groupId?: number | undefined;
                /**
                 * The tab's new hidden state.
                 */
                hidden?: boolean | undefined;
                /**
                 * Whether the document in the tab can be rendered in reader mode.
                 */
                isArticle?: boolean | undefined;
                /**
                 * The tab's new muted state and the reason for the change.
                 */
                mutedInfo?: MutedInfo | undefined;
                /**
                 * The tab's new pinned state.
                 */
                pinned?: boolean | undefined;
                /**
                 * The tab's new sharing state for screen, microphone and camera.
                 */
                sharingState?: SharingState | undefined;
                /**
                 * The ID of the Split View that the tab belongs to. {@link browser.tabs.SPLIT_VIEW_ID_NONE} if the tab does not belong to a split view.
                 */
                splitViewId?: number | undefined;
                /**
                 * The status of the tab. Can be either _loading_ or _complete_.
                 */
                status?: string | undefined;
                /**
                 * The title of the tab if it has changed. This property is only present if the extension's manifest includes the `"tabs"` permission.
                 *
                 * @permission tabs
                 */
                title?: string | undefined;
                /**
                 * The tab's URL if it has changed. This property is only present if the extension's manifest includes the `"tabs"` permission.
                 *
                 * @permission tabs
                 */
                url?: string | undefined;
            };
        }

        /**
         * Fired when a tab is zoomed.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export const onZoomChange: WebExtensionEvent<(ZoomChangeInfo: onZoomChange.ZoomChangeInfo) => void>;
        export namespace onZoomChange {
            export type ZoomChangeInfo = {
                newZoomFactor: number;
                oldZoomFactor: number;
                tabId: number;
                zoomSettings: ZoomSettings;
            };
        }

        /**
         * Captures an area of a specified tab. You must have `<all_urls>` permission to use this method.
         *
         * @param tabId The tab to capture. Defaults to the active tab of the current window.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @permission <all_urls>
         * @platform desktop, mobile
         */
        export function captureTab(options?: browser.extensionTypes.ImageDetails | null): globalThis.Promise<string>;
        export function captureTab(tabId?: number | null, options?: browser.extensionTypes.ImageDetails | null): globalThis.Promise<string>;

        /**
         * Captures an area of the currently active tab in the specified window. You must have `<all_urls>` or activeTab permission to use this method.
         *
         * @param windowId The target window. Defaults to the current window.
         * @returns A data URL which encodes an image of the visible area of the captured tab. May be assigned to the 'src' property of an HTML Image element for display.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @permission <all_urls> or activeTab
         * @platform desktop, mobile
         */
        export function captureVisibleTab(options?: browser.extensionTypes.ImageDetails | null): globalThis.Promise<string>;
        export function captureVisibleTab(windowId?: number | null, options?: browser.extensionTypes.ImageDetails | null): globalThis.Promise<string>;
        export function captureVisibleTab(options: browser.extensionTypes.ImageDetails | null | undefined, callback: ((dataUrl: string) => void)): void;
        export function captureVisibleTab(callback: ((dataUrl: string) => void)): void;
        export function captureVisibleTab(windowId: number | null | undefined, options: browser.extensionTypes.ImageDetails | null | undefined, callback: ((dataUrl: string) => void)): void;
        export function captureVisibleTab(windowId: number | null | undefined, callback: ((dataUrl: string) => void)): void;

        /**
         * Connects to the content script(s) in the specified tab. The {@link browser.runtime.onConnect} event is fired in each content script running in the specified tab for the current extension. For more details, see Content Script Messaging.
         *
         * @returns A port that can be used to communicate with the content scripts running in the specified tab. The port's {@link browser.runtime.Port} event is fired if the tab closes or does not exist.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop, mobile
         */
        export function connect(tabId: number, connectInfo?: connect.ConnectInfo | null): browser.runtime.Port;
        export namespace connect {
            export type ConnectInfo = {
                /**
                 * Open a port to a specific document identified by `documentId` instead of all frames in the tab.
                 */
                documentId?: string | undefined;
                /**
                 * Open a port to a specific frame identified by `frameId` instead of all frames in the tab.
                 */
                frameId?: number | undefined;
                /**
                 * Will be passed into onConnect for content scripts that are listening for the connection event.
                 */
                name?: string | undefined;
            };
        }

        /**
         * Creates a new tab.
         *
         * @returns Details about the created tab. Will contain the ID of the new tab.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop, mobile
         */
        export function create(createProperties: create.CreateProperties): globalThis.Promise<Tab | undefined>;
        export function create(createProperties: create.CreateProperties, callback: ((tab: Tab | undefined) => void)): void;
        export namespace create {
            export type CreateProperties = {
                /**
                 * Whether the tab should become the active tab in the window. Does not affect whether the window is focused (see {@link browser.windows.update}). Defaults to `true`.
                 */
                active?: boolean | undefined;
                /**
                 * The CookieStoreId for the tab that opened this tab.
                 */
                cookieStoreId?: string | undefined;
                /**
                 * Whether the tab is marked as 'discarded' when created.
                 */
                discarded?: boolean | undefined;
                /**
                 * The position the tab should take in the window. The provided value will be clamped to between zero and the number of tabs in the window.
                 */
                index?: number | undefined;
                /**
                 * Whether the tab should be muted when created.
                 */
                muted?: boolean | undefined;
                /**
                 * Whether the document in the tab should be opened in reader mode.
                 */
                openInReaderMode?: boolean | undefined;
                /**
                 * The ID of the tab that opened this tab. If specified, the opener tab must be in the same window as the newly created tab.
                 */
                openerTabId?: number | undefined;
                /**
                 * Whether the tab should be pinned. Defaults to `false`
                 */
                pinned?: boolean | undefined;
                /**
                 * The title used for display if the tab is created in discarded mode.
                 */
                title?: string | undefined;
                /**
                 * The URL to navigate the tab to initially. Fully-qualified URLs must include a scheme (i.e. 'http://www.google.com', not 'www.google.com'). Relative URLs will be relative to the current page within the extension. Defaults to the New Tab Page.
                 */
                url?: string | undefined;
                /**
                 * The window to create the new tab in. Defaults to the current window.
                 */
                windowId?: number | undefined;
            };
        }

        /**
         * Detects the primary language of the content in a tab.
         *
         * @param tabId Defaults to the active tab of the current window.
         * @returns An ISO language code such as `en` or `fr`. For a complete list of languages supported by this method, see [kLanguageInfoTable](http://src.chromium.org/viewvc/chrome/trunk/src/third_party/cld/languages/internal/languages.cc). The 2nd to 4th columns will be checked and the first non-NULL value will be returned except for Simplified Chinese for which zh-CN will be returned. For an unknown language, `und` will be returned.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop, mobile
         */
        export function detectLanguage(tabId?: number | null): globalThis.Promise<string>;
        export function detectLanguage(tabId: number | null | undefined, callback: ((language: string) => void)): void;
        export function detectLanguage(callback: ((language: string) => void)): void;

        /**
         * discards one or more tabs.
         *
         * @param tabIds The tab or list of tabs to discard.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function discard(tabIds: number | number[]): globalThis.Promise<void>;

        /**
         * Duplicates a tab.
         *
         * @param tabId The ID of the tab which is to be duplicated.
         * @returns Details about the duplicated tab. The {@link browser.tabs.Tab} object doesn't contain `url`, `title` and `favIconUrl` if the `"tabs"` permission has not been requested.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function duplicate(tabId: number, duplicateProperties?: duplicate.DuplicateProperties | null): globalThis.Promise<Tab | undefined>;
        export function duplicate(tabId: number, duplicateProperties: duplicate.DuplicateProperties | null | undefined, callback: ((tab: Tab | undefined) => void)): void;
        export function duplicate(tabId: number, callback: ((tab: Tab | undefined) => void)): void;
        export namespace duplicate {
            export type DuplicateProperties = {
                /**
                 * Whether the tab should become the active tab in the window. Does not affect whether the window is focused (see {@link browser.windows.update}). Defaults to `true`.
                 */
                active?: boolean | undefined;
                /**
                 * The position the new tab should take in the window. The provided value will be clamped to between zero and the number of tabs in the window.
                 */
                index?: number | undefined;
            };
        }

        /**
         * Injects JavaScript code into a page. For details, see the programmatic injection section of the content scripts doc.
         *
         * Only available in manifest_version 2 or earlier.
         *
         * @param tabId The ID of the tab in which to run the script; defaults to the active tab of the current window.
         * @param details Details of the script to run.
         * @param callback Called after all the JavaScript has been executed.
         * @returns The result of the script in every injected frame.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop, mobile
         */
        export function executeScript(tabId: number | null | undefined, details: browser.extensionTypes.InjectDetails): globalThis.Promise<any[] | undefined>;
        export function executeScript(details: browser.extensionTypes.InjectDetails): globalThis.Promise<any[] | undefined>;
        export function executeScript(tabId: number | null | undefined, details: browser.extensionTypes.InjectDetails, callback: ((result: any[] | undefined) => void)): void;
        export function executeScript(details: browser.extensionTypes.InjectDetails, callback: ((result: any[] | undefined) => void)): void;

        /**
         * Retrieves details about the specified tab.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop, mobile
         */
        export function get(tabId: number): globalThis.Promise<Tab>;
        export function get(tabId: number, callback: ((tab: Tab) => void)): void;

        /**
         * Gets the tab that this script call is being made from. May be undefined if called from a non-tab context (for example: a background page or popup view).
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop, mobile
         */
        export function getCurrent(): globalThis.Promise<Tab | undefined>;
        export function getCurrent(callback: ((tab: Tab | undefined) => void)): void;

        /**
         * Gets the current zoom factor of a specified tab.
         *
         * @param tabId The ID of the tab to get the current zoom factor from; defaults to the active tab of the current window.
         * @param callback Called with the tab's current zoom factor after it has been fetched.
         * @returns The tab's current zoom factor.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function getZoom(tabId?: number | null): globalThis.Promise<number>;
        export function getZoom(tabId: number | null | undefined, callback: ((zoomFactor: number) => void)): void;
        export function getZoom(callback: ((zoomFactor: number) => void)): void;

        /**
         * Gets the current zoom settings of a specified tab.
         *
         * @param tabId The ID of the tab to get the current zoom settings from; defaults to the active tab of the current window.
         * @param callback Called with the tab's current zoom settings.
         * @returns The tab's current zoom settings.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function getZoomSettings(tabId?: number | null): globalThis.Promise<ZoomSettings>;
        export function getZoomSettings(tabId: number | null | undefined, callback: ((zoomSettings: ZoomSettings) => void)): void;
        export function getZoomSettings(callback: ((zoomSettings: ZoomSettings) => void)): void;

        /**
         * Navigate to previous page in tab's history, if available.
         *
         * @param tabId The ID of the tab to navigate backward.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop, mobile
         */
        export function goBack(tabId?: number | null): globalThis.Promise<void>;
        export function goBack(tabId: number | null | undefined, callback: (() => void)): void;
        export function goBack(callback: (() => void)): void;

        /**
         * Navigate to next page in tab's history, if available
         *
         * @param tabId The ID of the tab to navigate forward.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop, mobile
         */
        export function goForward(tabId?: number | null): globalThis.Promise<void>;
        export function goForward(tabId: number | null | undefined, callback: (() => void)): void;
        export function goForward(callback: (() => void)): void;

        /**
         * Adds one or more tabs to a specified group, or if no group is specified, adds the given tabs to a newly created group.
         *
         * @returns The ID of the group that the tabs were added to.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function group(options: group.Options): globalThis.Promise<number>;
        export function group(options: group.Options, callback: ((groupId: number) => void)): void;
        export namespace group {
            export type Options = {
                /**
                 * Configurations for creating a group. Cannot be used if groupId is already specified.
                 */
                createProperties?: {
                    /**
                     * The window of the new group. Defaults to the current window.
                     */
                    windowId?: number | undefined;
                } | undefined;
                /**
                 * The ID of the group to add the tabs to. If not specified, a new group will be created.
                 */
                groupId?: number | undefined;
                /**
                 * The tab ID or list of tab IDs to add to the specified group.
                 */
                tabIds: number | number[];
            };
        }

        /**
         * Hides one or more tabs. The `"tabHide"` permission is required to hide tabs.  Not all tabs are hidable.  Returns an array of hidden tabs.
         *
         * @param tabIds The TAB ID or list of TAB IDs to hide.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @permission tabHide
         * @platform desktop
         */
        export function hide(tabIds: number | number[]): globalThis.Promise<number[]>;

        /**
         * Highlights the given tabs.
         *
         * @returns Contains details about the window whose tabs were highlighted.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function highlight(highlightInfo: highlight.HighlightInfo): globalThis.Promise<browser.windows.Window>;
        export function highlight(highlightInfo: highlight.HighlightInfo, callback: ((window: browser.windows.Window) => void)): void;
        export namespace highlight {
            export type HighlightInfo = {
                /**
                 * If true, the {@link browser.windows.Window} returned will have a `tabs` property that contains a list of the {@link browser.tabs.Tab} objects. The `Tab` objects only contain the `url`, `title` and `favIconUrl` properties if the extension's manifest file includes the `"tabs"` permission. If false, the {@link browser.windows.Window} won't have the `tabs` property.
                 */
                populate?: boolean | undefined;
                /**
                 * One or more tab indices to highlight.
                 */
                tabs: number[] | number;
                /**
                 * The window that contains the tabs.
                 */
                windowId?: number | undefined;
            };
        }

        /**
         * Injects CSS into a page. For details, see the programmatic injection section of the content scripts doc.
         *
         * Only available in manifest_version 2 or earlier.
         *
         * @param tabId The ID of the tab in which to insert the CSS; defaults to the active tab of the current window.
         * @param details Details of the CSS text to insert.
         * @param callback Called when all the CSS has been inserted.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop, mobile
         */
        export function insertCSS(tabId: number | null | undefined, details: browser.extensionTypes.InjectDetails): globalThis.Promise<void>;
        export function insertCSS(details: browser.extensionTypes.InjectDetails): globalThis.Promise<void>;
        export function insertCSS(tabId: number | null | undefined, details: browser.extensionTypes.InjectDetails, callback: (() => void)): void;
        export function insertCSS(details: browser.extensionTypes.InjectDetails, callback: (() => void)): void;

        /**
         * Moves one or more tabs to a new position within its window, or to a new window. Note that tabs can only be moved to and from normal (window.type === "normal") windows.
         *
         * @param tabIds The tab or list of tabs to move.
         * @returns Details about the moved tabs.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function move(tabIds: number | number[], moveProperties: move.MoveProperties): globalThis.Promise<Tab | Tab[]>;
        export function move(tabIds: number | number[], moveProperties: move.MoveProperties, callback: ((tabs: Tab | Tab[]) => void)): void;
        export namespace move {
            export type MoveProperties = {
                /**
                 * The position to move the window to. -1 will place the tab at the end of the window.
                 */
                index: number;
                /**
                 * Defaults to the window the tab is currently in.
                 */
                windowId?: number | undefined;
            };
        }

        /**
         * Removes an array of tabs from their lines of succession and prepends or appends them in a chain to another tab.
         *
         * @param tabIds An array of tab IDs to move in the line of succession. For each tab in the array, the tab's current predecessors will have their successor set to the tab's current successor, and each tab will then be set to be the successor of the previous tab in the array. Any tabs not in the same window as the tab indicated by the second argument (or the first tab in the array, if no second argument) will be skipped.
         * @param tabId The ID of a tab to set as the successor of the last tab in the array, or {@link browser.tabs.TAB_ID_NONE} to leave the last tab without a successor. If options.append is true, then this tab is made the predecessor of the first tab in the array instead.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function moveInSuccession(tabIds: number[], tabId?: number | null, options?: moveInSuccession.Options | null): globalThis.Promise<void>;
        export namespace moveInSuccession {
            export type Options = {
                /**
                 * Whether to move the tabs before (false) or after (true) tabId in the succession. Defaults to false.
                 */
                append?: boolean | undefined;
                /**
                 * Whether to link up the current predecessors or successor (depending on options.append) of tabId to the other side of the chain after it is prepended or appended. If true, one of the following happens: if options.append is false, the first tab in the array is set as the successor of any current predecessors of tabId; if options.append is true, the current successor of tabId is set as the successor of the last tab in the array. Defaults to false.
                 */
                insert?: boolean | undefined;
            };
        }

        /**
         * Prints page in active tab.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function print(): void;

        /**
         * Shows print preview for page in active tab.
         *
         * @param callback Called after print preview entered.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function printPreview(): globalThis.Promise<void>;
        export function printPreview(callback: (() => void)): void;

        /**
         * Gets all tabs that have the specified properties, or all tabs if no properties are specified.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop, mobile
         */
        export function query(queryInfo: query.QueryInfo): globalThis.Promise<Tab[]>;
        export function query(queryInfo: query.QueryInfo, callback: ((result: Tab[]) => void)): void;
        export namespace query {
            export type QueryInfo = {
                /**
                 * Whether the tabs are active in their windows.
                 */
                active?: boolean | undefined;
                /**
                 * Whether the tabs are drawing attention.
                 */
                attention?: boolean | undefined;
                /**
                 * Whether the tabs are audible.
                 */
                audible?: boolean | undefined;
                /**
                 * Whether the tab can be discarded automatically by the browser when resources are low.
                 */
                autoDiscardable?: boolean | undefined;
                /**
                 * True if the tab is using the camera.
                 */
                camera?: boolean | undefined;
                /**
                 * The CookieStoreId used for the tab.
                 */
                cookieStoreId?: string[] | string | undefined;
                /**
                 * Whether the tabs are in the current window.
                 */
                currentWindow?: boolean | undefined;
                /**
                 * True while the tabs are not loaded with content.
                 */
                discarded?: boolean | undefined;
                /**
                 * The ID of the group that the tabs are in, or {@link browser.tabGroups.TAB_GROUP_ID_NONE} (-1) for ungrouped tabs.
                 */
                groupId?: number | undefined;
                /**
                 * True while the tabs are hidden.
                 */
                hidden?: boolean | undefined;
                /**
                 * Whether the tabs are highlighted.  Works as an alias of active.
                 */
                highlighted?: boolean | undefined;
                /**
                 * The position of the tabs within their windows.
                 */
                index?: number | undefined;
                /**
                 * Whether the tabs are in the last focused window.
                 */
                lastFocusedWindow?: boolean | undefined;
                /**
                 * True if the tab is using the microphone.
                 */
                microphone?: boolean | undefined;
                /**
                 * Whether the tabs are muted.
                 */
                muted?: boolean | undefined;
                /**
                 * The ID of the tab that opened this tab. If specified, the opener tab must be in the same window as this tab.
                 */
                openerTabId?: number | undefined;
                /**
                 * Whether the tabs are pinned.
                 */
                pinned?: boolean | undefined;
                /**
                 * True for any screen sharing, or a string to specify type of screen sharing.
                 */
                screen?: "Screen" | "Window" | "Application" | boolean | undefined;
                /**
                 * The ID of the Split View that the tab belongs to. {@link browser.tabs.SPLIT_VIEW_ID_NONE} if the tab does not belong to a split view.
                 */
                splitViewId?: number | undefined;
                /**
                 * Whether the tabs have completed loading.
                 */
                status?: TabStatus | undefined;
                /**
                 * Match page titles against a pattern.
                 */
                title?: string | undefined;
                /**
                 * Match tabs against one or more URL patterns. Note that fragment identifiers are not matched.
                 */
                url?: string | string[] | undefined;
                /**
                 * The ID of the parent window, or {@link browser.windows.WINDOW_ID_CURRENT} for the current window.
                 */
                windowId?: number | undefined;
                /**
                 * The type of window the tabs are in.
                 */
                windowType?: WindowType | undefined;
            };
        }

        /**
         * Reload a tab.
         *
         * @param tabId The ID of the tab to reload; defaults to the selected tab of the current window.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop, mobile
         */
        export function reload(reloadProperties?: reload.ReloadProperties | null): globalThis.Promise<void>;
        export function reload(tabId?: number | null, reloadProperties?: reload.ReloadProperties | null): globalThis.Promise<void>;
        export function reload(reloadProperties: reload.ReloadProperties | null | undefined, callback: (() => void)): void;
        export function reload(callback: (() => void)): void;
        export function reload(tabId: number | null | undefined, reloadProperties: reload.ReloadProperties | null | undefined, callback: (() => void)): void;
        export function reload(tabId: number | null | undefined, callback: (() => void)): void;
        export namespace reload {
            export type ReloadProperties = {
                /**
                 * Whether using any local cache. Default is false.
                 */
                bypassCache?: boolean | undefined;
            };
        }

        /**
         * Closes one or more tabs.
         *
         * @param tabIds The tab or list of tabs to close.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop, mobile
         */
        export function remove(tabIds: number | number[]): globalThis.Promise<void>;
        export function remove(tabIds: number | number[], callback: (() => void)): void;

        /**
         * Removes injected CSS from a page. For details, see the programmatic injection section of the content scripts doc.
         *
         * Only available in manifest_version 2 or earlier.
         *
         * @param tabId The ID of the tab from which to remove the injected CSS; defaults to the active tab of the current window.
         * @param details Details of the CSS text to remove.
         * @param callback Called when all the CSS has been removed.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop, mobile
         */
        export function removeCSS(tabId: number | null | undefined, details: browser.extensionTypes.InjectDetails): globalThis.Promise<void>;
        export function removeCSS(details: browser.extensionTypes.InjectDetails): globalThis.Promise<void>;
        export function removeCSS(tabId: number | null | undefined, details: browser.extensionTypes.InjectDetails, callback: (() => void)): void;
        export function removeCSS(details: browser.extensionTypes.InjectDetails, callback: (() => void)): void;

        /**
         * Saves page in active tab as a PDF file.
         *
         * @param pageSettings The page settings used to save the PDF file.
         * @param callback Called after save as dialog closed.
         * @returns Save status: saved, replaced, canceled, not_saved, not_replaced.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function saveAsPDF(pageSettings: PageSettings): globalThis.Promise<string>;
        export function saveAsPDF(pageSettings: PageSettings, callback: ((status: string) => void)): void;

        /**
         * Sends a single message to the content script(s) in the specified tab, with an optional callback to run when a response is sent back.  The {@link browser.runtime.onMessage} event is fired in each content script running in the specified tab for the current extension.
         *
         * @returns The JSON response object sent by the handler of the message. If an error occurs while connecting to the specified tab, the callback will be called with no arguments and {@link browser.runtime.lastError} will be set to the error message.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop, mobile
         */
        export function sendMessage(tabId: number, message: any, options?: sendMessage.Options | null): globalThis.Promise<any>;
        export function sendMessage(tabId: number, message: any, options: sendMessage.Options | null | undefined, responseCallback: ((response: any) => void)): void;
        export function sendMessage(tabId: number, message: any, responseCallback: ((response: any) => void)): void;
        export namespace sendMessage {
            export type Options = {
                /**
                 * Send a message to a specific document identified by `documentId` instead of all frames in the tab.
                 */
                documentId?: string | undefined;
                /**
                 * Send a message to a specific frame identified by `frameId` instead of all frames in the tab.
                 */
                frameId?: number | undefined;
            };
        }

        /**
         * Zooms a specified tab.
         *
         * @param tabId The ID of the tab to zoom; defaults to the active tab of the current window.
         * @param zoomFactor The new zoom factor. Use a value of 0 here to set the tab to its current default zoom factor. Values greater than zero specify a (possibly non-default) zoom factor for the tab.
         * @param callback Called after the zoom factor has been changed.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function setZoom(tabId: number | null | undefined, zoomFactor: number): globalThis.Promise<void>;
        export function setZoom(zoomFactor: number): globalThis.Promise<void>;
        export function setZoom(tabId: number | null | undefined, zoomFactor: number, callback: (() => void)): void;
        export function setZoom(zoomFactor: number, callback: (() => void)): void;

        /**
         * Sets the zoom settings for a specified tab, which define how zoom changes are handled. These settings are reset to defaults upon navigating the tab.
         *
         * @param tabId The ID of the tab to change the zoom settings for; defaults to the active tab of the current window.
         * @param zoomSettings Defines how zoom changes are handled and at what scope.
         * @param callback Called after the zoom settings have been changed.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function setZoomSettings(tabId: number | null | undefined, zoomSettings: ZoomSettings): globalThis.Promise<void>;
        export function setZoomSettings(zoomSettings: ZoomSettings): globalThis.Promise<void>;
        export function setZoomSettings(tabId: number | null | undefined, zoomSettings: ZoomSettings, callback: (() => void)): void;
        export function setZoomSettings(zoomSettings: ZoomSettings, callback: (() => void)): void;

        /**
         * Shows one or more tabs.
         *
         * @param tabIds The TAB ID or list of TAB IDs to show.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @permission tabHide
         * @platform desktop
         */
        export function show(tabIds: number | number[]): globalThis.Promise<void>;

        /**
         * Toggles reader mode for the document in the tab.
         *
         * @param tabId Defaults to the active tab of the current window.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function toggleReaderMode(tabId?: number | null): globalThis.Promise<void>;

        /**
         * Removes one or more tabs from their respective groups. If any groups become empty, they are deleted.
         *
         * @param tabIds The tab ID or list of tab IDs to remove from their respective groups.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function ungroup(tabIds: number | number[]): globalThis.Promise<void>;

        /**
         * Modifies the properties of a tab. Properties that are not specified in `updateProperties` are not modified.
         *
         * @param tabId Defaults to the selected tab of the current window.
         * @returns Details about the updated tab. The {@link browser.tabs.Tab} object doesn't contain `url`, `title` and `favIconUrl` if the `"tabs"` permission has not been requested.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop, mobile
         */
        export function update(tabId: number | null | undefined, updateProperties: update.UpdateProperties): globalThis.Promise<Tab | undefined>;
        export function update(updateProperties: update.UpdateProperties): globalThis.Promise<Tab | undefined>;
        export function update(tabId: number | null | undefined, updateProperties: update.UpdateProperties, callback: ((tab: Tab | undefined) => void)): void;
        export function update(updateProperties: update.UpdateProperties, callback: ((tab: Tab | undefined) => void)): void;
        export namespace update {
            export type UpdateProperties = {
                /**
                 * Whether the tab should be active. Does not affect whether the window is focused (see {@link browser.windows.update}).
                 */
                active?: boolean | undefined;
                /**
                 * Whether the tab can be discarded automatically by the browser when resources are low.
                 */
                autoDiscardable?: boolean | undefined;
                /**
                 * Adds or removes the tab from the current selection.
                 */
                highlighted?: boolean | undefined;
                /**
                 * Whether the load should replace the current history entry for the tab.
                 */
                loadReplace?: boolean | undefined;
                /**
                 * Whether the tab should be muted.
                 */
                muted?: boolean | undefined;
                /**
                 * The ID of the tab that opened this tab. If specified, the opener tab must be in the same window as this tab.
                 */
                openerTabId?: number | undefined;
                /**
                 * Whether the tab should be pinned.
                 */
                pinned?: boolean | undefined;
                /**
                 * The ID of this tab's successor. If specified, the successor tab must be in the same window as this tab.
                 */
                successorTabId?: number | undefined;
                /**
                 * A URL to navigate the tab to.
                 */
                url?: string | undefined;
            };
        }

        /**
         * Warm up a tab
         *
         * @param tabId The ID of the tab to warm up.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function warmup(tabId: number): globalThis.Promise<void>;

    }

    /**
     * Use the `browser.telemetry` API to send telemetry data to the Mozilla Telemetry service. Restricted to Mozilla privileged webextensions.
     *
     * Only privileged extensions can use this API.
     * Not available in content scripts or devtools pages.
     *
     * @permission telemetry
     * @platform desktop, mobile
     */
    export namespace telemetry {
        /**
         * Represents registration data for a Telemetry event.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/telemetry.json
         * @platform desktop, mobile
         */
        export interface EventData {
            /**
             * True if this event entry is expired. This allows recording it without error, but it will be discarded.
             */
            expired?: boolean | undefined;
            /**
             * List of allowed extra keys for this event entry.
             */
            extra_keys: string[];
            /**
             * List of methods for this event entry.
             */
            methods: string[];
            /**
             * List of objects for this event entry.
             */
            objects: string[];
            /**
             * True if this data should be recorded on release.
             */
            record_on_release?: boolean | undefined;
        }

        /**
         * Represents registration data for a Telemetry scalar.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/telemetry.json
         * @platform desktop, mobile
         */
        export interface ScalarData {
            /**
             * True if this scalar entry is expired. This allows recording it without error, but it will be discarded.
             */
            expired?: boolean | undefined;
            /**
             * True if this is a keyed scalar.
             */
            keyed?: boolean | undefined;
            kind: ScalarType;
            /**
             * True if this data should be recorded on release.
             */
            record_on_release?: boolean | undefined;
        }

        /**
         * Type of scalar: 'count' for numeric values, 'string' for string values, 'boolean' for boolean values. Maps to `nsITelemetry.SCALAR_TYPE_*`.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/telemetry.json
         * @platform desktop, mobile
         */
        export type ScalarType = "count" | "string" | "boolean";

        /**
         * Checks if Telemetry upload is enabled.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/telemetry.json
         * @platform desktop, mobile
         */
        export function canUpload(): globalThis.Promise<boolean>;

        /**
         * Adds the value to the given keyed scalar.
         *
         * @param name The scalar name
         * @param key The key name
         * @param value The numeric value to add to the scalar. Only unsigned integers supported.
         * @deprecated `keyedScalarAdd` is a no-op since Firefox 134 (see bug 1930196)
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/telemetry.json
         * @platform desktop, mobile
         */
        export function keyedScalarAdd(name: string, key: string, value: number): globalThis.Promise<void>;

        /**
         * Sets the keyed scalar to the given value. Throws if the value type doesn't match the scalar type.
         *
         * @param name The scalar name.
         * @param key The key name.
         * @param value The value to set the scalar to.
         * @deprecated `keyedScalarSet` is a no-op since Firefox 134 (see bug 1930196)
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/telemetry.json
         * @platform desktop, mobile
         */
        export function keyedScalarSet(name: string, key: string, value: string | boolean | number | Record<string, any>): globalThis.Promise<void>;

        /**
         * Sets the keyed scalar to the maximum of the current and the passed value
         *
         * @param name The scalar name.
         * @param key The key name.
         * @param value The numeric value to set the scalar to. Only unsigned integers supported.
         * @deprecated `keyedScalarSetMaximum` is a no-op since Firefox 134 (see bug 1930196)
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/telemetry.json
         * @platform desktop, mobile
         */
        export function keyedScalarSetMaximum(name: string, key: string, value: number): globalThis.Promise<void>;

        /**
         * Record an event in Telemetry. Throws when trying to record an unknown event.
         *
         * @param category The category name.
         * @param method The method name.
         * @param object The object name.
         * @param value An optional string value to record.
         * @param extra An optional object of the form (string -> string). It should only contain registered extra keys.
         * @deprecated `recordEvent` is a no-op since Firefox 132 (see bug 1894533)
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/telemetry.json
         * @platform desktop, mobile
         */
        export function recordEvent(category: string, method: string, object: string, value?: string | null, extra?: { [key: string]: string } | null): globalThis.Promise<void>;

        /**
         * Register new events to record them from addons. See nsITelemetry.idl for more details.
         *
         * @param category The unique category the events are registered in.
         * @param data An object that contains registration data for 1+ events. Each property name is the category name, and the corresponding property value is an object of EventData type.
         * @deprecated `registerEvents` is a no-op since Firefox 132 (see bug 1894533)
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/telemetry.json
         * @platform desktop, mobile
         */
        export function registerEvents(category: string, data: { [key: string]: EventData }): globalThis.Promise<void>;

        /**
         * Register new scalars to record them from addons. See nsITelemetry.idl for more details.
         *
         * @param category The unique category the scalars are registered in.
         * @param data An object that contains registration data for multiple scalars. Each property name is the scalar name, and the corresponding property value is an object of ScalarData type.
         * @deprecated `registerScalars` is a no-op since Firefox 134 (see bug 1930196)
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/telemetry.json
         * @platform desktop, mobile
         */
        export function registerScalars(category: string, data: { [key: string]: ScalarData }): globalThis.Promise<void>;

        /**
         * Adds the value to the given scalar.
         *
         * @param name The scalar name.
         * @param value The numeric value to add to the scalar. Only unsigned integers supported.
         * @deprecated `scalarAdd` is a no-op since Firefox 134 (see bug 1930196)
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/telemetry.json
         * @platform desktop, mobile
         */
        export function scalarAdd(name: string, value: number): globalThis.Promise<void>;

        /**
         * Sets the named scalar to the given value. Throws if the value type doesn't match the scalar type.
         *
         * @param name The scalar name
         * @param value The value to set the scalar to
         * @deprecated `scalarSet` is a no-op since Firefox 134 (see bug 1930196)
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/telemetry.json
         * @platform desktop, mobile
         */
        export function scalarSet(name: string, value: string | boolean | number | Record<string, any>): globalThis.Promise<void>;

        /**
         * Sets the scalar to the maximum of the current and the passed value
         *
         * @param name The scalar name.
         * @param value The numeric value to set the scalar to. Only unsigned integers supported.
         * @deprecated `scalarSetMaximum` is a no-op since Firefox 134 (see bug 1930196)
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/telemetry.json
         * @platform desktop, mobile
         */
        export function scalarSetMaximum(name: string, value: number): globalThis.Promise<void>;

        /**
         * Enable recording of events in a category. Events default to recording enabled. This allows to toggle recording for all events in the specified category.
         *
         * @param category The category name.
         * @param enabled Whether recording is enabled for events in that category.
         * @deprecated `setEventRecordingEnabled` is a no-op since Firefox 133 (see bug 1920562)
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/telemetry.json
         * @platform desktop, mobile
         */
        export function setEventRecordingEnabled(category: string, enabled: boolean): globalThis.Promise<void>;

        /**
         * Submits a custom ping to the Telemetry back-end. See `submitExternalPing` inside TelemetryController.sys.mjs for more details.
         *
         * @param type The type of the ping.
         * @param message The data payload for the ping.
         * @param options Options object.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/telemetry.json
         * @platform desktop, mobile
         */
        export function submitPing(type: string, message: Record<string, any>, options: submitPing.Options): globalThis.Promise<void>;
        export namespace submitPing {
            /**
             * Options object.
             */
            export type Options = {
                /**
                 * True if the ping should contain the client id.
                 */
                addClientId?: boolean | undefined;
                /**
                 * True if the ping should contain the environment data.
                 */
                addEnvironment?: boolean | undefined;
                /**
                 * Set to override the environment data.
                 */
                overrideEnvironment?: Record<string, any> | undefined;
                /**
                 * If true, send the ping using the PingSender.
                 */
                usePingSender?: boolean | undefined;
            };
        }

    }

    /**
     * The theme API allows customizing of visual elements of the browser.
     *
     * Not available in content scripts or devtools pages.
     *
     * @platform desktop, mobile
     */
    export namespace theme {
        /**
         * Info provided in the onUpdated listener.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/theme.json
         * @platform desktop, mobile
         */
        export interface ThemeUpdateInfo {
            /**
             * The new theme after update
             */
            theme: Record<string, unknown>;
            /**
             * The id of the window the theme has been applied to
             */
            windowId?: number | undefined;
        }

        /**
         * Fired when a new theme has been applied
         *
         * @param updateInfo Details of the theme update
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/theme.json
         * @platform desktop, mobile
         */
        export const onUpdated: WebExtensionEvent<(updateInfo: ThemeUpdateInfo) => void>;

        /**
         * Returns the current theme for the specified window or the last focused window.
         *
         * @param windowId The window for which we want the theme.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/theme.json
         * @platform desktop, mobile
         */
        export function getCurrent(windowId?: number | null): globalThis.Promise<browser.manifest.ThemeType>;

        /**
         * Removes the updates made to the theme.
         *
         * @param windowId The id of the window to reset. No id resets all windows.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/theme.json
         * @permission theme
         * @platform desktop, mobile
         */
        export function reset(windowId?: number | null): globalThis.Promise<void>;

        /**
         * Make complete updates to the theme. Resolves when the update has completed.
         *
         * @param windowId The id of the window to update. No id updates all windows.
         * @param details The properties of the theme to update.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/theme.json
         * @permission theme
         * @platform desktop, mobile
         */
        export function update(windowId: number | null | undefined, details: browser.manifest.ThemeType): globalThis.Promise<void>;
        export function update(details: browser.manifest.ThemeType): globalThis.Promise<void>;

    }

    /**
     * Use the chrome.topSites API to access the top sites that are displayed on the new tab page.
     *
     * Not available in content scripts or devtools pages.
     *
     * @permission topSites
     * @platform desktop
     */
    export namespace topSites {
        /**
         * An object encapsulating a most visited URL, such as the URLs on the new tab page.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/top_sites.json
         * @platform desktop
         */
        export interface MostVisitedURL {
            /**
             * Data URL for the favicon, if available.
             */
            favicon?: string | undefined;
            /**
             * The title of the page.
             */
            title?: string | undefined;
            /**
             * The entry type, either `url` for a normal page link, or `search` for a search shortcut.
             */
            type?: "url" | "search" | undefined;
            /**
             * The most visited URL.
             */
            url: string;
        }

        /**
         * Gets a list of top sites.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/top_sites.json
         * @platform desktop
         */
        export function get(options?: get.Options | null): globalThis.Promise<MostVisitedURL[]>;
        export function get(options: get.Options | null | undefined, callback: ((results: MostVisitedURL[]) => void)): void;
        export function get(callback: ((results: MostVisitedURL[]) => void)): void;
        export namespace get {
            export type Options = {
                /**
                 * Include sites that the user has blocked from appearing on the Firefox new tab.
                 */
                includeBlocked?: boolean | undefined;
                /**
                 * Include sites favicon if available.
                 */
                includeFavicon?: boolean | undefined;
                /**
                 * Include sites that the user has pinned on the Firefox new tab.
                 */
                includePinned?: boolean | undefined;
                /**
                 * Include search shortcuts appearing on the Firefox new tab.
                 */
                includeSearchShortcuts?: boolean | undefined;
                /**
                 * The number of top sites to return, defaults to the value used by Firefox
                 */
                limit?: number | undefined;
                /**
                 * Return the sites that exactly appear on the user's new-tab page. When true, all other options are ignored except limit and includeFavicon. If the user disabled newtab Top Sites, the newtab parameter will be ignored.
                 */
                newtab?: boolean | undefined;
                /**
                 * Limit the result to a single top site link per domain
                 */
                onePerDomain?: boolean | undefined;
                /**
                 * @deprecated Please use the other options to tune the results received from topSites.
                 */
                providers?: string[] | undefined;
            };
        }

    }

    /**
     * Also available in content scripts, but not in devtools pages.
     *
     * @permission trialML
     * @platform desktop, mobile
     */
    export namespace trial {
        /**
         * Use the trial ML API to run Machine Learning models requests from extensions pages or content scripts.
         *
         * Also available in content scripts, but not in devtools pages.
         *
         * @permission trialML
         * @platform desktop, mobile
         */
        export namespace ml {
            /**
             * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/trial_ml.json
             * @platform desktop, mobile
             */
            export interface CreateEngineRequest {
                [key: string]: unknown;
            }

            /**
             * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/trial_ml.json
             * @platform desktop, mobile
             */
            export interface RunEngineRequest {
                [key: string]: unknown;
            }

            /**
             * Events from the inference engine.
             *
             * @param progressData Object containing the data, see https://firefox-source-docs.mozilla.org/toolkit/components/ml/notifications.html
             * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/trial_ml.json
             * @platform desktop, mobile
             */
            export const onProgress: WebExtensionEvent<(progressData: Record<string, unknown>) => void>;

            /**
             * Prepare the inference engine
             *
             * Not available in content scripts or devtools pages.
             *
             * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/trial_ml.json
             * @platform desktop, mobile
             */
            export function createEngine(request: CreateEngineRequest): globalThis.Promise<void>;

            /**
             * Delete the models the extension downloaded.
             *
             * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/trial_ml.json
             * @platform desktop, mobile
             */
            export function deleteCachedModels(): globalThis.Promise<boolean>;

            /**
             * Call the inference engine
             *
             * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/trial_ml.json
             * @platform desktop, mobile
             */
            export function runEngine(request: RunEngineRequest): globalThis.Promise<unknown>;

        }
    }

    /**
     * Contains types used by other schemas.
     *
     * Not available in content scripts or devtools pages.
     *
     * @platform desktop, mobile
     */
    export namespace types {
        /**
         * One of
         *
         * - `not_controllable`: cannot be controlled by any extension
         * - `controlled_by_other_extensions`: controlled by extensions with higher precedence
         * - `controllable_by_this_extension`: can be controlled by this extension
         * - `controlled_by_this_extension`: controlled by this extension
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/types.json
         * @platform desktop, mobile
         */
        export type LevelOfControl = "not_controllable" | "controlled_by_other_extensions" | "controllable_by_this_extension" | "controlled_by_this_extension";

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/types.json
         * @platform desktop, mobile
         */
        export interface Setting {
            /**
             * Clears the setting, restoring any default value.
             *
             * @param details Which setting to clear.
             * @param callback Called at the completion of the clear operation.
             * @platform desktop, mobile
             */
            clear(details: Setting.clear.Details): globalThis.Promise<boolean>;
            clear(details: Setting.clear.Details, callback: ((result: boolean) => void)): void;
            /**
             * Gets the value of a setting.
             *
             * @param details Which setting to consider.
             * @returns Details of the currently effective value.
             * @platform desktop, mobile
             */
            get(details: Setting.get.Details): globalThis.Promise<Setting.get.Result>;
            get(details: Setting.get.Details, callback: ((details: Setting.get.Result) => void)): void;
            /**
             * Sets the value of a setting.
             *
             * @param details Which setting to change.
             * @param callback Called at the completion of the set operation.
             * @platform desktop, mobile
             */
            set(details: Setting.set.Details): globalThis.Promise<boolean>;
            set(details: Setting.set.Details, callback: ((result: boolean) => void)): void;
            /**
             * Fired after the setting changes.
             *
             * @platform desktop, mobile
             */
            onChange: WebExtensionEvent<(details: Setting.onChange.Details) => void>;
        }
        export namespace Setting {
            export namespace clear {
                /**
                 * Which setting to clear.
                 */
                export type Details = {
                    /**
                     * Where to clear the setting (default: regular).
                     */
                    scope?: browser.types.SettingScope | undefined;
                };
            }
            export namespace get {
                /**
                 * Which setting to consider.
                 */
                export type Details = {
                    /**
                     * Whether to return the value that applies to the incognito session (default false).
                     */
                    incognito?: boolean | undefined;
                };
                /**
                 * Details of the currently effective value.
                 */
                export type Result = {
                    /**
                     * Whether the effective value is specific to the incognito session.
                     * This property will _only_ be present if the `incognito` property in the `details` parameter of `get()` was true.
                     */
                    incognitoSpecific?: boolean | undefined;
                    /**
                     * The level of control of the setting.
                     */
                    levelOfControl: browser.types.LevelOfControl;
                    /**
                     * The value of the setting.
                     */
                    value: any;
                };
            }
            export namespace set {
                /**
                 * Which setting to change.
                 */
                export type Details = {
                    /**
                     * Where to set the setting (default: regular).
                     */
                    scope?: browser.types.SettingScope | undefined;
                    /**
                     * The value of the setting.
                     * Note that every setting has a specific value type, which is described together with the setting. An extension should _not_ set a value of a different type.
                     */
                    value: any;
                };
            }
            export namespace onChange {
                export type Details = {
                    /**
                     * Whether the value that has changed is specific to the incognito session.
                     * This property will _only_ be present if the user has enabled the extension in incognito mode.
                     */
                    incognitoSpecific?: boolean | undefined;
                    /**
                     * The level of control of the setting.
                     */
                    levelOfControl: browser.types.LevelOfControl;
                    /**
                     * The value of the setting after the change.
                     */
                    value: any;
                };
            }
        }

        /**
         * The scope of the Setting. One of
         *
         * - `regular`: setting for the regular profile (which is inherited by the incognito profile if not overridden elsewhere),
         * - `regular_only`: setting for the regular profile only (not inherited by the incognito profile),
         * - `incognito_persistent`: setting for the incognito profile that survives browser restarts (overrides regular preferences),
         * - `incognito_session_only`: setting for the incognito profile that can only be set during an incognito session and is deleted when the incognito session ends (overrides regular and incognito_persistent preferences).
         *
         * Only `regular` is supported by Firefox at this time.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/types.json
         * @platform desktop, mobile
         */
        export type SettingScope = "regular" | "regular_only" | "incognito_persistent" | "incognito_session_only";

    }

    /**
     * Also available in content scripts, but not in devtools pages.
     *
     * @permission manifest:user_scripts or userScripts
     * @platform desktop, mobile
     */
    export namespace userScripts {
        /**
         * The JavaScript world for a script to execute within. `USER_SCRIPT` is the default execution environment of user scripts, `MAIN` is the web page's execution environment.
         *
         * Requires manifest_version 3 or later.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/user_scripts.json
         * @platform desktop, mobile
         */
        export type ExecutionWorld = "MAIN" | "USER_SCRIPT";

        /**
         * Result of a user script injection.
         *
         * Requires manifest_version 3 or later.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/user_scripts.json
         * @platform desktop, mobile
         */
        export interface InjectionResult {
            /**
             * Document ID associated with the injection.
             */
            documentId: string;
            /**
             * Error message if any. This is mutually exclusive with result. The value is typically an (Error) object with a message property, but could be any value (including primitives and undefined) if the user script threw or rejected with such a value.
             */
            error?: any;
            /**
             * Frame ID associated with the injection.
             */
            frameId: number;
            /**
             * Result of the script injection if any. This is mutually exclusive with error.
             */
            result?: any;
        }

        /**
         * Details specifying the target into which to inject the script.
         *
         * Requires manifest_version 3 or later.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/user_scripts.json
         * @platform desktop, mobile
         */
        export interface InjectionTarget {
            /**
             * Whether the script should inject into all frames within the tab. Defaults to false. This must not be true if `frameIds` is specified.
             */
            allFrames?: boolean | undefined;
            /**
             * The IDs of specific documentIds to inject into. This must not be set if frameIds is set.
             */
            documentIds?: string[] | undefined;
            /**
             * The IDs of specific frames to inject into.
             */
            frameIds?: number[] | undefined;
            /**
             * The ID of the tab into which to inject.
             */
            tabId: number;
        }

        /**
         * An object that represents a user script registered programmatically
         *
         * Requires manifest_version 3 or later.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/user_scripts.json
         * @platform desktop, mobile
         */
        export interface RegisteredUserScript {
            /**
             * If allFrames is `true`, implies that the JavaScript should be injected into all frames of current page. By default, it's `false` and is only injected into the top frame.
             */
            allFrames?: boolean | undefined;
            excludeGlobs?: string[] | undefined;
            excludeMatches?: browser.manifest.MatchPattern[] | undefined;
            /**
             * The ID of the user script specified in the API call. This property must not start with a '_' as it's reserved as a prefix for generated script IDs.
             */
            id: string;
            /**
             * At least one of matches or includeGlobs should be non-empty. The script runs in documents whose URL match either pattern.
             */
            includeGlobs?: string[] | undefined;
            /**
             * The list of ScriptSource objects defining sources of scripts to be injected into matching pages.
             */
            js: ScriptSource[];
            /**
             * At least one of matches or includeGlobs should be non-empty. The script runs in documents whose URL match either pattern.
             */
            matches?: browser.manifest.MatchPattern[] | undefined;
            /**
             * The soonest that the JavaScript will be injected into the tab. Defaults to "document_idle".
             */
            runAt?: browser.extensionTypes.RunAt | undefined;
            /**
             * The JavaScript script for a script to execute within. Defaults to "USER_SCRIPT".
             */
            world?: ExecutionWorld | undefined;
            /**
             * If specified, specifies a specific user script world ID to execute in. Only valid if `world` is omitted or is `USER_SCRIPT`. If `worldId` is omitted, the script will execute in the default user script world (""). Values with leading underscores (`_`) are reserved. The maximum length is 256.
             */
            worldId?: string | undefined;
        }

        /**
         * Object with file xor code property. Equivalent to the ExtensionFileOrCode, except the file remains a relative URL.
         *
         * Requires manifest_version 3 or later.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/user_scripts.json
         * @platform desktop, mobile
         */
        export type ScriptSource = {
            /**
             * The path of the JavaScript file to inject relative to the extension's root directory.
             */
            file: string;
        } | {
            code: string;
        };

        /**
         * Optional filter to use with getScripts() and unregister().
         *
         * Requires manifest_version 3 or later.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/user_scripts.json
         * @platform desktop, mobile
         */
        export interface UserScriptFilter {
            ids?: string[] | undefined;
        }

        /**
         * Details of a user script injection
         *
         * Requires manifest_version 3 or later.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/user_scripts.json
         * @platform desktop, mobile
         */
        export interface UserScriptInjection {
            /**
             * Whether the injection should be triggered in the target as soon as possible. Note that this is not a guarantee that injection will occur prior to page load, as the page may have already loaded by the time the script reaches the target.
             */
            injectImmediately?: boolean | undefined;
            /**
             * The list of ScriptSource objects defining sources of scripts to be injected into matching pages.
             */
            js: ScriptSource[];
            /**
             * Details specifying the target into which to inject the script.
             */
            target: InjectionTarget;
            /**
             * The JavaScript "world" to run the script in. The default is `USER_SCRIPT`.
             */
            world?: ExecutionWorld | undefined;
            /**
             * A specific user script world ID to execute in. Only valid if `world` is omitted or is `USER_SCRIPT`. If `worldId` is omitted, the default value is an empty string ("") and the script will execute in the default world.
             */
            worldId?: string | undefined;
        }

        /**
         * Details of a user script
         *
         * Only available in manifest_version 2 or earlier.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/user_scripts.json
         * @platform desktop, mobile
         */
        export interface UserScriptOptions {
            /**
             * If allFrames is `true`, implies that the JavaScript should be injected into all frames of current page. By default, it's `false` and is only injected into the top frame.
             */
            allFrames?: boolean | undefined;
            /**
             * limit the set of matched tabs to those that belong to the given cookie store id
             */
            cookieStoreId?: string[] | string | undefined;
            excludeGlobs?: string[] | undefined;
            excludeMatches?: browser.manifest.MatchPattern[] | undefined;
            includeGlobs?: string[] | undefined;
            /**
             * The list of JS files to inject
             */
            js: browser.extensionTypes.ExtensionFileOrCode[];
            /**
             * If matchAboutBlank is true, then the code is also injected in about:blank and about:srcdoc frames if your extension has access to its parent document. Code cannot be inserted in top-level about:-frames. By default it is `false`.
             */
            matchAboutBlank?: boolean | undefined;
            matches: browser.manifest.MatchPattern[];
            /**
             * The soonest that the JavaScript will be injected into the tab. Defaults to "document_idle".
             */
            runAt?: browser.extensionTypes.RunAt | undefined;
            /**
             * An opaque user script metadata value
             */
            scriptMetadata?: browser.extensionTypes.PlainJSONValue | undefined;
        }

        /**
         * The configuration of a USER_SCRIPT world.
         *
         * Requires manifest_version 3 or later.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/user_scripts.json
         * @platform desktop, mobile
         */
        export interface WorldProperties {
            /**
             * The world's Content Security Policy. Defaults to the CSP of regular content scripts, which prohibits dynamic code execution such as eval.
             */
            csp?: string | undefined;
            /**
             * Whether the runtime.sendMessage and runtime.connect methods are exposed. Defaults to not exposing these messaging APIs.
             */
            messaging?: boolean | undefined;
            /**
             * The identifier of the world. Values with leading underscores (`_`) are reserved. The maximum length is 256. Defaults to the default USER_SCRIPT world ("").
             */
            worldId?: string | undefined;
        }

        /**
         * Event called when a new userScript global has been created
         *
         * Only available in manifest_version 2 or earlier.
         * Only available in content scripts.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/user_scripts_content.json
         * @permission manifest:user_scripts.api_script
         * @platform desktop, mobile
         */
        export const onBeforeScript: WebExtensionEvent<(userScript: onBeforeScript.UserScript) => void>;
        export namespace onBeforeScript {
            export type UserScript = {
                /**
                 * Exports all the properties of a given plain object as userScript globals
                 */
                defineGlobals: ((sourceObject: Record<string, unknown>) => void);
                /**
                 * Convert a given value to make it accessible to the userScript code
                 */
                export: ((value: any) => any);
                /**
                 * The userScript global
                 */
                global: any;
                /**
                 * The userScript metadata (as set in userScripts.register)
                 */
                metadata: any;
            };
        }

        /**
         * Configures the environment for scripts running in a USER_SCRIPT world.
         *
         * Requires manifest_version 3 or later.
         * Not available in content scripts or devtools pages.
         *
         * @param properties The desired configuration for a USER_SCRIPT world.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/user_scripts.json
         * @platform desktop, mobile
         */
        export function configureWorld(properties: WorldProperties): globalThis.Promise<void>;

        /**
         * Executes one or more ephemeral user scripts into a specific tab.
         *
         * Requires manifest_version 3 or later.
         * Not available in content scripts or devtools pages.
         *
         * @param injection The details of the user script which to inject.
         * @param callback Invoked upon completion of the injection. The resulting array contains the result of execution for each frame where the injection succeeded.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/user_scripts.json
         * @platform desktop, mobile
         */
        export function execute(injection: UserScriptInjection): globalThis.Promise<InjectionResult[]>;
        export function execute(injection: UserScriptInjection, callback: ((results: InjectionResult[]) => void)): void;

        /**
         * Returns all dynamically-registered user scripts for this extension.
         *
         * Requires manifest_version 3 or later.
         * Not available in content scripts or devtools pages.
         *
         * @param filter If specified, this method returns only the user scripts that match it.
         * @returns List of registered user scripts.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/user_scripts.json
         * @platform desktop, mobile
         */
        export function getScripts(filter?: UserScriptFilter | null): globalThis.Promise<RegisteredUserScript[]>;
        export function getScripts(filter: UserScriptFilter | null | undefined, callback: ((scripts: RegisteredUserScript[]) => void)): void;
        export function getScripts(callback: ((scripts: RegisteredUserScript[]) => void)): void;

        /**
         * Returns all registered USER_SCRIPT world configurations.
         *
         * Requires manifest_version 3 or later.
         * Not available in content scripts or devtools pages.
         *
         * @returns All configurations registered with configureWorld().
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/user_scripts.json
         * @platform desktop, mobile
         */
        export function getWorldConfigurations(): globalThis.Promise<WorldProperties[]>;
        export function getWorldConfigurations(callback: ((configurations: WorldProperties[]) => void)): void;

        /**
         * Register a user script programmatically given its {@link browser.userScripts.UserScriptOptions}, and resolves to an object with the unregister() function
         *
         * Only available in manifest_version 2 or earlier.
         * Not available in content scripts or devtools pages.
         *
         * @returns An object that represents a user script registered programmatically
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/user_scripts.json
         * @platform desktop, mobile
         */
        export function register(userScriptOptions: UserScriptOptions): globalThis.Promise<register.Result>;
        export function register(userScriptOptions: UserScriptOptions, callback: ((legacyRegisteredUserScript: register.Result) => void)): void;
        /**
         * Registers one or more user scripts for this extension.
         *
         * Requires manifest_version 3 or later.
         * Not available in content scripts or devtools pages.
         *
         * @param scripts List of user scripts to be registered.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/user_scripts.json
         * @platform desktop, mobile
         */
        export function register(scripts: RegisteredUserScript[]): globalThis.Promise<void>;
        export namespace register {
            /**
             * An object that represents a user script registered programmatically
             */
            export type Result = {
                /**
                 * Unregister a user script registered programmatically
                 */
                unregister: (() => globalThis.Promise<void>);
            };
        }

        /**
         * Resets the configuration for a given world. That world will fall back to the default world's configuration.
         *
         * Requires manifest_version 3 or later.
         * Not available in content scripts or devtools pages.
         *
         * @param worldId The ID of the USER_SCRIPT world to reset. If omitted or empty, resets the default world's configuration.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/user_scripts.json
         * @platform desktop, mobile
         */
        export function resetWorldConfiguration(worldId?: string | null): globalThis.Promise<void>;

        /**
         * Unregisters all dynamically-registered user scripts for this extension.
         *
         * Requires manifest_version 3 or later.
         * Not available in content scripts or devtools pages.
         *
         * @param filter If specified, this method unregisters only the user scripts that match it.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/user_scripts.json
         * @platform desktop, mobile
         */
        export function unregister(filter?: UserScriptFilter | null): globalThis.Promise<void>;

        /**
         * Updates one or more user scripts for this extension.
         *
         * Requires manifest_version 3 or later.
         * Not available in content scripts or devtools pages.
         *
         * @param scripts List of user scripts to be updated.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/user_scripts.json
         * @platform desktop, mobile
         */
        export function update(scripts: ({
            /**
             * If allFrames is `true`, implies that the JavaScript should be injected into all frames of current page. By default, it's `false` and is only injected into the top frame.
             */
            allFrames?: boolean | undefined;
            excludeGlobs?: string[] | undefined;
            excludeMatches?: browser.manifest.MatchPattern[] | undefined;
            /**
             * The ID of the user script specified in the API call. This property must not start with a '_' as it's reserved as a prefix for generated script IDs.
             */
            id: string;
            /**
             * At least one of matches or includeGlobs should be non-empty. The script runs in documents whose URL match either pattern.
             */
            includeGlobs?: string[] | undefined;
            js?: ScriptSource[] | undefined;
            /**
             * At least one of matches or includeGlobs should be non-empty. The script runs in documents whose URL match either pattern.
             */
            matches?: browser.manifest.MatchPattern[] | undefined;
            /**
             * The soonest that the JavaScript will be injected into the tab. Defaults to "document_idle".
             */
            runAt?: browser.extensionTypes.RunAt | undefined;
            /**
             * The JavaScript script for a script to execute within. Defaults to "USER_SCRIPT".
             */
            world?: ExecutionWorld | undefined;
            /**
             * If specified, specifies a specific user script world ID to execute in. Only valid if `world` is omitted or is `USER_SCRIPT`. If `worldId` is omitted, the script will execute in the default user script world (""). Values with leading underscores (`_`) are reserved. The maximum length is 256.
             */
            worldId?: string | undefined;
        })[]): globalThis.Promise<void>;

    }

    /**
     * Use the `browser.webNavigation` API to receive notifications about the status of navigation requests in-flight.
     *
     * Not available in content scripts or devtools pages.
     *
     * @permission webNavigation
     * @platform desktop, mobile
     */
    export namespace webNavigation {
        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_navigation.json
         * @platform desktop, mobile
         */
        export interface EventUrlFilters {
            url: browser.events.UrlFilter[];
        }

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_navigation.json
         * @platform desktop, mobile
         */
        export type TransitionQualifier = "client_redirect" | "server_redirect" | "forward_back" | "from_address_bar";

        /**
         * Cause of the navigation. The same transition types as defined in the history API are used. These are the same transition types as defined in the history API except with `"start_page"` in place of `"auto_toplevel"` (for backwards compatibility).
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_navigation.json
         * @platform desktop, mobile
         */
        export type TransitionType = "link" | "typed" | "auto_bookmark" | "auto_subframe" | "manual_subframe" | "generated" | "start_page" | "form_submit" | "reload" | "keyword" | "keyword_generated";

        /**
         * Fired when a navigation is about to occur.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_navigation.json
         * @platform desktop, mobile
         */
        export const onBeforeNavigate: Omit<WebExtensionEvent<(details: onBeforeNavigate.Details) => void>, "addListener"> & { addListener(callback: (details: onBeforeNavigate.Details) => void, filters?: EventUrlFilters | null): void };
        export namespace onBeforeNavigate {
            export type Details = {
                /**
                 * 0 indicates the navigation happens in the tab content window; a positive value indicates navigation in a subframe. Frame IDs are unique for a given tab and process.
                 */
                frameId: number;
                /**
                 * A UUID of the parent document owning this frame. This is not set if there is no parent.
                 */
                parentDocumentId?: string | undefined;
                /**
                 * ID of frame that wraps the frame. Set to -1 of no parent frame exists.
                 */
                parentFrameId: number;
                /**
                 * The ID of the process runs the renderer for this tab.
                 *
                 * @deprecated Firefox does not support this property and rejects an object that includes it.
                 */
                processId: number;
                /**
                 * The ID of the tab in which the navigation is about to occur.
                 */
                tabId: number;
                /**
                 * The time when the browser was about to start the navigation, in milliseconds since the epoch.
                 */
                timeStamp: number;
                url: string;
            };
        }

        /**
         * Fired when a navigation is committed. The document (and the resources it refers to, such as images and subframes) might still be downloading, but at least part of the document has been received from the server and the browser has decided to switch to the new document.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_navigation.json
         * @platform desktop, mobile
         */
        export const onCommitted: Omit<WebExtensionEvent<(details: onCommitted.Details) => void>, "addListener"> & { addListener(callback: (details: onCommitted.Details) => void, filters?: EventUrlFilters | null): void };
        export namespace onCommitted {
            export type Details = {
                /**
                 * A UUID of the document loaded.
                 */
                documentId: string;
                /**
                 * 0 indicates the navigation happens in the tab content window; a positive value indicates navigation in a subframe. Frame IDs are unique within a tab.
                 */
                frameId: number;
                /**
                 * A UUID of the parent document owning this frame. This is not set if there is no parent.
                 */
                parentDocumentId?: string | undefined;
                /**
                 * The ID of the process runs the renderer for this tab.
                 *
                 * @deprecated Firefox does not support this property and rejects an object that includes it.
                 */
                processId: number;
                /**
                 * The ID of the tab in which the navigation occurs.
                 */
                tabId: number;
                /**
                 * The time when the navigation was committed, in milliseconds since the epoch.
                 */
                timeStamp: number;
                /**
                 * A list of transition qualifiers.
                 */
                transitionQualifiers: TransitionQualifier[];
                /**
                 * Cause of the navigation.
                 */
                transitionType: TransitionType;
                url: string;
            };
        }

        /**
         * Fired when a document, including the resources it refers to, is completely loaded and initialized.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_navigation.json
         * @platform desktop, mobile
         */
        export const onCompleted: Omit<WebExtensionEvent<(details: onCompleted.Details) => void>, "addListener"> & { addListener(callback: (details: onCompleted.Details) => void, filters?: EventUrlFilters | null): void };
        export namespace onCompleted {
            export type Details = {
                /**
                 * A UUID of the document loaded.
                 */
                documentId: string;
                /**
                 * 0 indicates the navigation happens in the tab content window; a positive value indicates navigation in a subframe. Frame IDs are unique within a tab.
                 */
                frameId: number;
                /**
                 * A UUID of the parent document owning this frame. This is not set if there is no parent.
                 */
                parentDocumentId?: string | undefined;
                /**
                 * The ID of the process runs the renderer for this tab.
                 *
                 * @deprecated Firefox does not support this property and rejects an object that includes it.
                 */
                processId: number;
                /**
                 * The ID of the tab in which the navigation occurs.
                 */
                tabId: number;
                /**
                 * The time when the document finished loading, in milliseconds since the epoch.
                 */
                timeStamp: number;
                url: string;
            };
        }

        /**
         * Fired when a new window, or a new tab in an existing window, is created to host a navigation.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_navigation.json
         * @platform desktop, mobile
         */
        export const onCreatedNavigationTarget: Omit<WebExtensionEvent<(details: onCreatedNavigationTarget.Details) => void>, "addListener"> & { addListener(callback: (details: onCreatedNavigationTarget.Details) => void, filters?: EventUrlFilters | null): void };
        export namespace onCreatedNavigationTarget {
            export type Details = {
                /**
                 * The ID of the frame with sourceTabId in which the navigation is triggered. 0 indicates the main frame.
                 */
                sourceFrameId: number;
                /**
                 * The ID of the process runs the renderer for the source tab.
                 */
                sourceProcessId: number;
                /**
                 * The ID of the tab in which the navigation is triggered.
                 */
                sourceTabId: number;
                /**
                 * The ID of the tab in which the url is opened
                 */
                tabId: number;
                /**
                 * The time when the browser was about to create a new view, in milliseconds since the epoch.
                 */
                timeStamp: number;
                /**
                 * The URL to be opened in the new window.
                 */
                url: string;
            };
        }

        /**
         * Fired when the page's DOM is fully constructed, but the referenced resources may not finish loading.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_navigation.json
         * @platform desktop, mobile
         */
        export const onDOMContentLoaded: Omit<WebExtensionEvent<(details: onDOMContentLoaded.Details) => void>, "addListener"> & { addListener(callback: (details: onDOMContentLoaded.Details) => void, filters?: EventUrlFilters | null): void };
        export namespace onDOMContentLoaded {
            export type Details = {
                /**
                 * A UUID of the document loaded.
                 */
                documentId: string;
                /**
                 * 0 indicates the navigation happens in the tab content window; a positive value indicates navigation in a subframe. Frame IDs are unique within a tab.
                 */
                frameId: number;
                /**
                 * A UUID of the parent document owning this frame. This is not set if there is no parent.
                 */
                parentDocumentId?: string | undefined;
                /**
                 * The ID of the process runs the renderer for this tab.
                 *
                 * @deprecated Firefox does not support this property and rejects an object that includes it.
                 */
                processId: number;
                /**
                 * The ID of the tab in which the navigation occurs.
                 */
                tabId: number;
                /**
                 * The time when the page's DOM was fully constructed, in milliseconds since the epoch.
                 */
                timeStamp: number;
                url: string;
            };
        }

        /**
         * Fired when an error occurs and the navigation is aborted. This can happen if either a network error occurred, or the user aborted the navigation.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_navigation.json
         * @platform desktop, mobile
         */
        export const onErrorOccurred: Omit<WebExtensionEvent<(details: onErrorOccurred.Details) => void>, "addListener"> & { addListener(callback: (details: onErrorOccurred.Details) => void, filters?: EventUrlFilters | null): void };
        export namespace onErrorOccurred {
            export type Details = {
                /**
                 * A UUID of the document loaded.
                 */
                documentId: string;
                /**
                 * The error description.
                 *
                 * @deprecated Firefox does not support this property and rejects an object that includes it.
                 */
                error: string;
                /**
                 * 0 indicates the navigation happens in the tab content window; a positive value indicates navigation in a subframe. Frame IDs are unique within a tab.
                 */
                frameId: number;
                /**
                 * A UUID of the parent document owning this frame. This is not set if there is no parent.
                 */
                parentDocumentId?: string | undefined;
                /**
                 * The ID of the process runs the renderer for this tab.
                 *
                 * @deprecated Firefox does not support this property and rejects an object that includes it.
                 */
                processId: number;
                /**
                 * The ID of the tab in which the navigation occurs.
                 */
                tabId: number;
                /**
                 * The time when the error occurred, in milliseconds since the epoch.
                 */
                timeStamp: number;
                url: string;
            };
        }

        /**
         * Fired when the frame's history was updated to a new URL. All future events for that frame will use the updated URL.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_navigation.json
         * @platform desktop, mobile
         */
        export const onHistoryStateUpdated: Omit<WebExtensionEvent<(details: onHistoryStateUpdated.Details) => void>, "addListener"> & { addListener(callback: (details: onHistoryStateUpdated.Details) => void, filters?: EventUrlFilters | null): void };
        export namespace onHistoryStateUpdated {
            export type Details = {
                /**
                 * A UUID of the document loaded.
                 */
                documentId: string;
                /**
                 * 0 indicates the navigation happens in the tab content window; a positive value indicates navigation in a subframe. Frame IDs are unique within a tab.
                 */
                frameId: number;
                /**
                 * A UUID of the parent document owning this frame. This is not set if there is no parent.
                 */
                parentDocumentId?: string | undefined;
                /**
                 * The ID of the process runs the renderer for this tab.
                 *
                 * @deprecated Firefox does not support this property and rejects an object that includes it.
                 */
                processId: number;
                /**
                 * The ID of the tab in which the navigation occurs.
                 */
                tabId: number;
                /**
                 * The time when the navigation was committed, in milliseconds since the epoch.
                 */
                timeStamp: number;
                /**
                 * A list of transition qualifiers.
                 */
                transitionQualifiers: TransitionQualifier[];
                /**
                 * Cause of the navigation.
                 */
                transitionType: TransitionType;
                url: string;
            };
        }

        /**
         * Fired when the reference fragment of a frame was updated. All future events for that frame will use the updated URL.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_navigation.json
         * @platform desktop, mobile
         */
        export const onReferenceFragmentUpdated: Omit<WebExtensionEvent<(details: onReferenceFragmentUpdated.Details) => void>, "addListener"> & { addListener(callback: (details: onReferenceFragmentUpdated.Details) => void, filters?: EventUrlFilters | null): void };
        export namespace onReferenceFragmentUpdated {
            export type Details = {
                /**
                 * A UUID of the document loaded.
                 */
                documentId: string;
                /**
                 * 0 indicates the navigation happens in the tab content window; a positive value indicates navigation in a subframe. Frame IDs are unique within a tab.
                 */
                frameId: number;
                /**
                 * A UUID of the parent document owning this frame. This is not set if there is no parent.
                 */
                parentDocumentId?: string | undefined;
                /**
                 * The ID of the process runs the renderer for this tab.
                 *
                 * @deprecated Firefox does not support this property and rejects an object that includes it.
                 */
                processId: number;
                /**
                 * The ID of the tab in which the navigation occurs.
                 */
                tabId: number;
                /**
                 * The time when the navigation was committed, in milliseconds since the epoch.
                 */
                timeStamp: number;
                /**
                 * A list of transition qualifiers.
                 */
                transitionQualifiers: TransitionQualifier[];
                /**
                 * Cause of the navigation.
                 */
                transitionType: TransitionType;
                url: string;
            };
        }

        /**
         * Fired when the contents of the tab is replaced by a different (usually previously pre-rendered) tab.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_navigation.json
         * @platform desktop, mobile
         */
        export const onTabReplaced: WebExtensionEvent<(details: onTabReplaced.Details) => void>;
        export namespace onTabReplaced {
            export type Details = {
                /**
                 * The ID of the tab that was replaced.
                 */
                replacedTabId: number;
                /**
                 * The ID of the tab that replaced the old tab.
                 */
                tabId: number;
                /**
                 * The time when the replacement happened, in milliseconds since the epoch.
                 */
                timeStamp: number;
            };
        }

        /**
         * Retrieves information about all frames of a given tab.
         *
         * @param details Information about the tab to retrieve all frames from.
         * @returns A list of frames in the given tab, null if the specified tab ID is invalid.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_navigation.json
         * @platform desktop, mobile
         */
        export function getAllFrames(details: getAllFrames.Details): globalThis.Promise<({
    /**
     * A UUID of the document loaded.
     */
    documentId: string;
    /**
     * True if the last navigation in this frame was interrupted by an error, i.e. the onErrorOccurred event fired.
     */
    errorOccurred?: boolean | undefined;
    /**
     * The ID of the frame. 0 indicates that this is the main frame; a positive value indicates the ID of a subframe.
     */
    frameId: number;
    /**
     * A UUID of the parent document owning this frame. This is not set if there is no parent.
     */
    parentDocumentId?: string | undefined;
    /**
     * ID of frame that wraps the frame. Set to -1 of no parent frame exists.
     */
    parentFrameId: number;
    /**
     * The ID of the process runs the renderer for this tab.
     *
     * @deprecated Firefox does not support this property and rejects an object that includes it.
     */
    processId: number;
    /**
     * The ID of the tab in which the frame is.
     */
    tabId: number;
    /**
     * The URL currently associated with this frame.
     */
    url: string;
})[] | null>;
        export function getAllFrames(details: getAllFrames.Details, callback: ((details: ({
            /**
             * A UUID of the document loaded.
             */
            documentId: string;
            /**
             * True if the last navigation in this frame was interrupted by an error, i.e. the onErrorOccurred event fired.
             */
            errorOccurred?: boolean | undefined;
            /**
             * The ID of the frame. 0 indicates that this is the main frame; a positive value indicates the ID of a subframe.
             */
            frameId: number;
            /**
             * A UUID of the parent document owning this frame. This is not set if there is no parent.
             */
            parentDocumentId?: string | undefined;
            /**
             * ID of frame that wraps the frame. Set to -1 of no parent frame exists.
             */
            parentFrameId: number;
            /**
             * The ID of the process runs the renderer for this tab.
             *
             * @deprecated Firefox does not support this property and rejects an object that includes it.
             */
            processId: number;
            /**
             * The ID of the tab in which the frame is.
             */
            tabId: number;
            /**
             * The URL currently associated with this frame.
             */
            url: string;
        })[] | undefined) => void)): void;
        export namespace getAllFrames {
            /**
             * Information about the tab to retrieve all frames from.
             */
            export type Details = {
                /**
                 * The ID of the tab.
                 */
                tabId: number;
            };
        }

        /**
         * Retrieves information about the given frame. A frame refers to an `<iframe>` or a `<frame>` of a web page and is identified by a tab ID and a frame ID, or by its document ID.
         *
         * @param details Information about the frame to retrieve information about.
         * @returns Information about the requested frame, null if the specified frame ID and/or tab ID are invalid.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_navigation.json
         * @platform desktop, mobile
         */
        export function getFrame(details: getFrame.Details): globalThis.Promise<getFrame.Result | null>;
        export function getFrame(details: getFrame.Details, callback: ((details: getFrame.Result | undefined) => void)): void;
        export namespace getFrame {
            /**
             * Information about the frame to retrieve information about.
             */
            export type Details = {
                /**
                 * The UUID of the document. If provided, tabId and frameId are optional. If all are provided, the frame is only returned if all properties match.
                 */
                documentId?: string | undefined;
                /**
                 * The ID of the frame in the given tab. Must be specified if documentId is not set.
                 */
                frameId?: number | undefined;
                /**
                 * The ID of the process runs the renderer for this tab.
                 */
                processId?: number | undefined;
                /**
                 * The ID of the tab in which the frame is. Must be specified if documentId is not set.
                 */
                tabId?: number | undefined;
            };
            /**
             * Information about the requested frame, null if the specified frame ID and/or tab ID are invalid.
             */
            export type Result = {
                /**
                 * A UUID of the document loaded.
                 */
                documentId: string;
                /**
                 * True if the last navigation in this frame was interrupted by an error, i.e. the onErrorOccurred event fired.
                 */
                errorOccurred?: boolean | undefined;
                /**
                 * The ID of the frame. 0 indicates that this is the main frame; a positive value indicates the ID of a subframe.
                 */
                frameId: number;
                /**
                 * A UUID of the parent document owning this frame. This is not set if there is no parent.
                 */
                parentDocumentId?: string | undefined;
                /**
                 * ID of frame that wraps the frame. Set to -1 of no parent frame exists.
                 */
                parentFrameId: number;
                /**
                 * The ID of the tab in which the frame is.
                 */
                tabId: number;
                /**
                 * The URL currently associated with this frame, if the frame identified by the frameId existed at one point in the given tab. The fact that an URL is associated with a given frameId does not imply that the corresponding frame still exists.
                 */
                url: string;
            };
        }

    }

    /**
     * Use the `browser.webRequest` API to observe and analyze traffic and to intercept, block, or modify requests in-flight.
     *
     * Not available in content scripts or devtools pages.
     *
     * @permission webRequest
     * @platform desktop, mobile
     */
    export namespace webRequest {
        /**
         * Returns value for event handlers that have the 'blocking' extraInfoSpec applied. Allows the event handler to modify network requests.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         * @platform desktop, mobile
         */
        export interface BlockingResponse {
            /**
             * Only used as a response to the onAuthRequired event. If set, the request is made using the supplied credentials.
             */
            authCredentials?: {
                password: string;
                username: string;
            } | undefined;
            /**
             * If true, the request is cancelled. Used in onBeforeRequest, this prevents the request from being sent.
             */
            cancel?: boolean | undefined;
            /**
             * Only used as a response to the onBeforeRequest and onHeadersReceived events. If set, the original request is prevented from being sent/completed and is instead redirected to the given URL. Redirections to non-HTTP schemes such as data: are allowed. Redirects initiated by a redirect action use the original request method for the redirect, with one exception: If the redirect is initiated at the onHeadersReceived stage, then the redirect will be issued using the GET method.
             */
            redirectUrl?: string | undefined;
            /**
             * Only used as a response to the onBeforeSendHeaders event. If set, the request is made with these request headers instead.
             */
            requestHeaders?: HttpHeaders | undefined;
            /**
             * Only used as a response to the onHeadersReceived event. If set, the server is assumed to have responded with these response headers instead. Only return `responseHeaders` if you really want to modify the headers in order to limit the number of conflicts (only one extension may modify `responseHeaders` for each request).
             */
            responseHeaders?: HttpHeaders | undefined;
            /**
             * Only used as a response to the onBeforeRequest event. If set, the original request is prevented from being sent/completed and is instead upgraded to a secure request.  If any extension returns `redirectUrl` during onBeforeRequest, `upgradeToSecure` will have no affect.
             */
            upgradeToSecure?: boolean | undefined;
        }

        /**
         * Contains the certificate properties of the request if it is a secure request.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         * @platform desktop, mobile
         */
        export interface CertificateInfo {
            fingerprint: {
                sha1: string;
                sha256: string;
            };
            isBuiltInRoot: boolean;
            issuer: string;
            rawDER?: number[] | undefined;
            serialNumber: string;
            subject: string;
            subjectPublicKeyInfoDigest: {
                sha256: string;
            };
            /**
             * Contains start and end timestamps.
             */
            validity: {
                end: number;
                start: number;
            };
        }

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         * @platform desktop, mobile
         */
        export type CertificateTransparencyStatus = "not_applicable" | "policy_compliant" | "policy_not_enough_scts" | "policy_not_diverse_scts";

        /**
         * An array of HTTP headers. Each header is represented as a dictionary containing the keys `name` and either `value` or `binaryValue`.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         * @platform desktop, mobile
         */
        export type HttpHeaders = ({
            /**
             * Value of the HTTP header if it cannot be represented by UTF-8, stored as individual byte values (0..255).
             */
            binaryValue?: number[] | undefined;
            /**
             * Name of the HTTP header.
             */
            name: string;
            /**
             * Value of the HTTP header if it can be represented by UTF-8.
             */
            value?: string | undefined;
        })[];

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         * @platform desktop, mobile
         */
        export type OnAuthRequiredOptions = "responseHeaders" | "blocking" | "asyncBlocking";

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         * @platform desktop, mobile
         */
        export type OnBeforeRedirectOptions = "responseHeaders";

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         * @platform desktop, mobile
         */
        export type OnBeforeRequestOptions = "blocking" | "requestBody";

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         * @platform desktop, mobile
         */
        export type OnBeforeSendHeadersOptions = "requestHeaders" | "blocking";

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         * @platform desktop, mobile
         */
        export type OnCompletedOptions = "responseHeaders";

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         * @platform desktop, mobile
         */
        export type OnHeadersReceivedOptions = "blocking" | "responseHeaders";

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         * @platform desktop, mobile
         */
        export type OnResponseStartedOptions = "responseHeaders";

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         * @platform desktop, mobile
         */
        export type OnSendHeadersOptions = "requestHeaders";

        /**
         * An object describing filters to apply to webRequest events.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         * @platform desktop, mobile
         */
        export interface RequestFilter {
            /**
             * If provided, requests that do not match the incognito state will be filtered out.
             */
            incognito?: boolean | undefined;
            tabId?: number | undefined;
            /**
             * A list of request types. Requests that cannot match any of the types will be filtered out.
             */
            types?: ResourceType[] | undefined;
            /**
             * A list of URLs or URL patterns. Requests that cannot match any of the URLs will be filtered out.
             */
            urls: string[];
            windowId?: number | undefined;
        }

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         * @platform desktop, mobile
         */
        export type ResourceType = "main_frame" | "sub_frame" | "stylesheet" | "script" | "image" | "object" | "xmlhttprequest" | "xslt" | "ping" | "beacon" | "xml_dtd" | "font" | "media" | "websocket" | "csp_report" | "imageset" | "web_manifest" | "speculative" | "json" | "other";

        /**
         * Contains the security properties of the request (ie. SSL/TLS information).
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         * @platform desktop, mobile
         */
        export interface SecurityInfo {
            /**
             * Certificate transparency compliance per RFC 6962.  See `https://www.certificate-transparency.org/what-is-ct` for more information.
             */
            certificateTransparencyStatus?: CertificateTransparencyStatus | undefined;
            /**
             * Certificate data if state is "secure".  Will only contain one entry unless `certificateChain` is passed as an option.
             */
            certificates: CertificateInfo[];
            /**
             * The cipher suite used in this request if state is "secure".
             */
            cipherSuite?: string | undefined;
            /**
             * Error message if state is "broken"
             */
            errorMessage?: string | undefined;
            /**
             * True if host uses Public Key Pinning and state is "secure".
             */
            hpkp?: string | undefined;
            /**
             * True if host uses Strict Transport Security and state is "secure".
             */
            hsts?: boolean | undefined;
            /**
             * The domain name does not match the certificate domain.
             *
             * @deprecated Please use {@link browser.webRequest.SecurityInfo.overridableErrorCategory}.
             */
            isDomainMismatch?: boolean | undefined;
            isExtendedValidation?: boolean | undefined;
            /**
             * The certificate is either expired or is not yet valid.  See `CertificateInfo.validity` for start and end dates.
             *
             * @deprecated Please use {@link browser.webRequest.SecurityInfo.overridableErrorCategory}.
             */
            isNotValidAtThisTime?: boolean | undefined;
            /**
             * @deprecated Please use {@link browser.webRequest.SecurityInfo.overridableErrorCategory}.
             */
            isUntrusted?: boolean | undefined;
            /**
             * The key exchange algorithm used in this request if state is "secure".
             */
            keaGroupName?: string | undefined;
            /**
             * The type of certificate error that was overridden for this connection, if any.
             */
            overridableErrorCategory?: "trust_error" | "domain_mismatch" | "expired_or_not_yet_valid" | undefined;
            /**
             * Protocol version if state is "secure"
             */
            protocolVersion?: "TLSv1" | "TLSv1.1" | "TLSv1.2" | "TLSv1.3" | "unknown" | undefined;
            /**
             * The length (in bits) of the secret key.
             */
            secretKeyLength?: number | undefined;
            /**
             * The signature scheme used in this request if state is "secure".
             */
            signatureSchemeName?: string | undefined;
            state: "insecure" | "weak" | "broken" | "secure";
            /**
             * True if the TLS connection used Delegated Credentials.
             */
            usedDelegatedCredentials?: boolean | undefined;
            /**
             * True if the TLS connection used Encrypted Client Hello.
             */
            usedEch?: boolean | undefined;
            /**
             * True if the TLS connection made OCSP requests.
             */
            usedOcsp?: boolean | undefined;
            /**
             * True if the TLS connection used a privacy-preserving DNS transport like DNS-over-HTTPS.
             */
            usedPrivateDns?: boolean | undefined;
            /**
             * list of reasons that cause the request to be considered weak, if state is "weak"
             */
            weaknessReasons?: TransportWeaknessReasons[] | undefined;
        }

        /**
         * @see https://searchfox.org/mozilla-central/source/dom/webidl/StreamFilter.webidl
         * @platform desktop, mobile
         */
        export interface StreamFilter extends EventTarget {
            suspend(): void;
            resume(): void;
            close(): void;
            disconnect(): void;
            write(data: ArrayBuffer | Uint8Array): void;
            readonly status: StreamFilterStatus;
            readonly error: string;
            ondata: ((this: StreamFilter, event: StreamFilterDataEvent) => any) | null;
            onstart: ((this: StreamFilter, event: Event) => any) | null;
            onstop: ((this: StreamFilter, event: Event) => any) | null;
            onerror: ((this: StreamFilter, event: Event) => any) | null;
        }

        /**
         * @see https://searchfox.org/mozilla-central/source/dom/webidl/StreamFilterDataEvent.webidl
         * @platform desktop, mobile
         */
        export interface StreamFilterDataEvent extends Event {
            readonly data: ArrayBuffer;
        }

        /**
         * @see https://searchfox.org/mozilla-central/source/dom/webidl/StreamFilter.webidl
         * @platform desktop, mobile
         */
        export type StreamFilterStatus = "uninitialized" | "transferringdata" | "finishedtransferringdata" | "suspended" | "closed" | "disconnected" | "failed";

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         * @platform desktop, mobile
         */
        export type TransportWeaknessReasons = "cipher";

        /**
         * Contains data uploaded in a URL request.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         * @platform desktop, mobile
         */
        export interface UploadData {
            /**
             * An ArrayBuffer with a copy of the data.
             */
            bytes?: ArrayBuffer | undefined;
            /**
             * A string with the file's path and name.
             */
            file?: string | undefined;
        }

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         * @platform desktop, mobile
         */
        export interface UrlClassification {
            /**
             * Classification flags if the request has been classified and it is first party.
             */
            firstParty: UrlClassificationParty;
            /**
             * Classification flags if the request has been classified and it or its window hierarchy is third party.
             */
            thirdParty: UrlClassificationParty;
        }

        /**
         * Tracking flags that match our internal tracking classification
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         * @platform desktop, mobile
         */
        export type UrlClassificationFlags = "fingerprinting" | "fingerprinting_content" | "cryptomining" | "cryptomining_content" | "emailtracking" | "emailtracking_content" | "tracking" | "tracking_ad" | "tracking_analytics" | "tracking_social" | "tracking_content" | "any_basic_tracking" | "any_strict_tracking" | "any_social_tracking" | "consentmanager" | "antifraud";

        /**
         * If the request has been classified this is an array of {@link browser.webRequest.UrlClassificationFlags}.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         * @platform desktop, mobile
         */
        export type UrlClassificationParty = UrlClassificationFlags[];

        /**
         * The maximum number of times that `handlerBehaviorChanged` can be called per 10 minute sustained interval. `handlerBehaviorChanged` is an expensive function call that shouldn't be called often.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         * @platform desktop, mobile
         */
        export const MAX_HANDLER_BEHAVIOR_CHANGED_CALLS_PER_10_MINUTES: number;

        /**
         * Fired when an authentication failure is received. The listener has three options: it can provide authentication credentials, it can cancel the request and display the error page, or it can take no action on the challenge. If bad user credentials are provided, this may be called multiple times for the same request.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         * @platform desktop, mobile
         */
        export const onAuthRequired: Omit<WebExtensionEvent<(details: onAuthRequired.Details, asyncCallback?: ((response: BlockingResponse) => void)) => browser.webRequest.BlockingResponse | Promise<browser.webRequest.BlockingResponse> | void>, "addListener"> & { addListener(callback: (details: onAuthRequired.Details, asyncCallback?: ((response: BlockingResponse) => void)) => browser.webRequest.BlockingResponse | Promise<browser.webRequest.BlockingResponse> | void, filter: RequestFilter, extraInfoSpec?: OnAuthRequiredOptions[] | null): void };
        export namespace onAuthRequired {
            export type Details = {
                /**
                 * The server requesting authentication.
                 */
                challenger: {
                    host: string;
                    port: number;
                };
                /**
                 * The cookie store ID of the contextual identity.
                 */
                cookieStoreId?: string | undefined;
                /**
                 * The UUID of the document making the request.
                 */
                documentId?: string | undefined;
                /**
                 * URL of the page into which the requested resource will be loaded.
                 */
                documentUrl?: string | undefined;
                /**
                 * The value 0 indicates that the request happens in the main frame; a positive value indicates the ID of a subframe in which the request happens. If the document of a (sub-)frame is loaded (`type` is `main_frame` or `sub_frame`), `frameId` indicates the ID of this frame, not the ID of the outer frame. Frame IDs are unique within a tab.
                 */
                frameId: number;
                /**
                 * True for private browsing requests.
                 */
                incognito?: boolean | undefined;
                /**
                 * True for Proxy-Authenticate, false for WWW-Authenticate.
                 */
                isProxy: boolean;
                /**
                 * Standard HTTP method.
                 */
                method: string;
                /**
                 * URL of the resource that triggered this request.
                 */
                originUrl?: string | undefined;
                /**
                 * The UUID of the parent document owning this frame. This is not set if there is no parent.
                 */
                parentDocumentId?: string | undefined;
                /**
                 * ID of frame that wraps the frame which sent the request. Set to -1 if no parent frame exists.
                 */
                parentFrameId: number;
                /**
                 * The authentication realm provided by the server, if there is one.
                 */
                realm?: string | undefined;
                /**
                 * The ID of the request. Request IDs are unique within a browser session. As a result, they could be used to relate different events of the same request.
                 */
                requestId: string;
                /**
                 * The HTTP response headers that were received along with this response.
                 */
                responseHeaders?: HttpHeaders | undefined;
                /**
                 * The authentication scheme, e.g. Basic or Digest.
                 */
                scheme: string;
                /**
                 * Standard HTTP status code returned by the server.
                 */
                statusCode: number;
                /**
                 * HTTP status line of the response or the 'HTTP/0.9 200 OK' string for HTTP/0.9 responses (i.e., responses that lack a status line) or an empty string if there are no headers.
                 */
                statusLine: string;
                /**
                 * The ID of the tab in which the request takes place. Set to -1 if the request isn't related to a tab.
                 */
                tabId: number;
                /**
                 * Indicates if this request and its content window hierarchy is third party.
                 */
                thirdParty: boolean;
                /**
                 * The time when this signal is triggered, in milliseconds since the epoch.
                 */
                timeStamp: number;
                /**
                 * How the requested resource will be used.
                 */
                type: ResourceType;
                url: string;
                /**
                 * Tracking classification if the request has been classified.
                 */
                urlClassification?: UrlClassification | undefined;
            };
        }

        /**
         * Fired when a server-initiated redirect is about to occur.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         * @platform desktop, mobile
         */
        export const onBeforeRedirect: Omit<WebExtensionEvent<(details: onBeforeRedirect.Details) => void>, "addListener"> & { addListener(callback: (details: onBeforeRedirect.Details) => void, filter: RequestFilter, extraInfoSpec?: OnBeforeRedirectOptions[] | null): void };
        export namespace onBeforeRedirect {
            export type Details = {
                /**
                 * The cookie store ID of the contextual identity.
                 */
                cookieStoreId?: string | undefined;
                /**
                 * The UUID of the document making the request.
                 */
                documentId?: string | undefined;
                /**
                 * URL of the page into which the requested resource will be loaded.
                 */
                documentUrl?: string | undefined;
                /**
                 * The value 0 indicates that the request happens in the main frame; a positive value indicates the ID of a subframe in which the request happens. If the document of a (sub-)frame is loaded (`type` is `main_frame` or `sub_frame`), `frameId` indicates the ID of this frame, not the ID of the outer frame. Frame IDs are unique within a tab.
                 */
                frameId: number;
                /**
                 * Indicates if this response was fetched from disk cache.
                 */
                fromCache: boolean;
                /**
                 * True for private browsing requests.
                 */
                incognito?: boolean | undefined;
                /**
                 * The server IP address that the request was actually sent to. Note that it may be a literal IPv6 address.
                 */
                ip?: string | undefined;
                /**
                 * Standard HTTP method.
                 */
                method: string;
                /**
                 * URL of the resource that triggered this request.
                 */
                originUrl?: string | undefined;
                /**
                 * The UUID of the parent document owning this frame. This is not set if there is no parent.
                 */
                parentDocumentId?: string | undefined;
                /**
                 * ID of frame that wraps the frame which sent the request. Set to -1 if no parent frame exists.
                 */
                parentFrameId: number;
                /**
                 * The new URL.
                 */
                redirectUrl: string;
                /**
                 * The ID of the request. Request IDs are unique within a browser session. As a result, they could be used to relate different events of the same request.
                 */
                requestId: string;
                /**
                 * The HTTP response headers that were received along with this redirect.
                 */
                responseHeaders?: HttpHeaders | undefined;
                /**
                 * Standard HTTP status code returned by the server.
                 */
                statusCode: number;
                /**
                 * HTTP status line of the response or the 'HTTP/0.9 200 OK' string for HTTP/0.9 responses (i.e., responses that lack a status line) or an empty string if there are no headers.
                 */
                statusLine: string;
                /**
                 * The ID of the tab in which the request takes place. Set to -1 if the request isn't related to a tab.
                 */
                tabId: number;
                /**
                 * Indicates if this request and its content window hierarchy is third party.
                 */
                thirdParty: boolean;
                /**
                 * The time when this signal is triggered, in milliseconds since the epoch.
                 */
                timeStamp: number;
                /**
                 * How the requested resource will be used.
                 */
                type: ResourceType;
                url: string;
                /**
                 * Tracking classification if the request has been classified.
                 */
                urlClassification?: UrlClassification | undefined;
            };
        }

        /**
         * Fired when a request is about to occur.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         * @platform desktop, mobile
         */
        export const onBeforeRequest: Omit<WebExtensionEvent<(details: onBeforeRequest.Details) => browser.webRequest.BlockingResponse | Promise<browser.webRequest.BlockingResponse> | void>, "addListener"> & { addListener(callback: (details: onBeforeRequest.Details) => browser.webRequest.BlockingResponse | Promise<browser.webRequest.BlockingResponse> | void, filter: RequestFilter, extraInfoSpec?: OnBeforeRequestOptions[] | null): void };
        export namespace onBeforeRequest {
            export type Details = {
                /**
                 * The cookie store ID of the contextual identity.
                 */
                cookieStoreId?: string | undefined;
                /**
                 * The UUID of the document making the request.
                 */
                documentId?: string | undefined;
                /**
                 * URL of the page into which the requested resource will be loaded.
                 */
                documentUrl?: string | undefined;
                /**
                 * The value 0 indicates that the request happens in the main frame; a positive value indicates the ID of a subframe in which the request happens. If the document of a (sub-)frame is loaded (`type` is `main_frame` or `sub_frame`), `frameId` indicates the ID of this frame, not the ID of the outer frame. Frame IDs are unique within a tab.
                 */
                frameId: number;
                /**
                 * True for private browsing requests.
                 */
                incognito?: boolean | undefined;
                /**
                 * Standard HTTP method.
                 */
                method: string;
                /**
                 * URL of the resource that triggered this request.
                 */
                originUrl?: string | undefined;
                /**
                 * The UUID of the parent document owning this frame. This is not set if there is no parent.
                 */
                parentDocumentId?: string | undefined;
                /**
                 * ID of frame that wraps the frame which sent the request. Set to -1 if no parent frame exists.
                 */
                parentFrameId: number;
                /**
                 * Contains the HTTP request body data. Only provided if extraInfoSpec contains 'requestBody'.
                 */
                requestBody?: {
                    /**
                     * Errors when obtaining request body data.
                     */
                    error?: string | undefined;
                    /**
                     * If the request method is POST and the body is a sequence of key-value pairs encoded in UTF8, encoded as either multipart/form-data, or application/x-www-form-urlencoded, this dictionary is present and for each key contains the list of all values for that key. If the data is of another media type, or if it is malformed, the dictionary is not present. An example value of this dictionary is {'key': ['value1', 'value2']}.
                     */
                    formData?: { [key: string]: string[] } | undefined;
                    /**
                     * If the request method is PUT or POST, and the body is not already parsed in formData, then the unparsed request body elements are contained in this array.
                     */
                    raw?: UploadData[] | undefined;
                } | undefined;
                /**
                 * The ID of the request. Request IDs are unique within a browser session. As a result, they could be used to relate different events of the same request.
                 */
                requestId: string;
                /**
                 * The ID of the tab in which the request takes place. Set to -1 if the request isn't related to a tab.
                 */
                tabId: number;
                /**
                 * Indicates if this request and its content window hierarchy is third party.
                 */
                thirdParty: boolean;
                /**
                 * The time when this signal is triggered, in milliseconds since the epoch.
                 */
                timeStamp: number;
                /**
                 * How the requested resource will be used.
                 */
                type: ResourceType;
                url: string;
                /**
                 * Tracking classification if the request has been classified.
                 */
                urlClassification?: UrlClassification | undefined;
            };
        }

        /**
         * Fired before sending an HTTP request, once the request headers are available. This may occur after a TCP connection is made to the server, but before any HTTP data is sent.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         * @platform desktop, mobile
         */
        export const onBeforeSendHeaders: Omit<WebExtensionEvent<(details: onBeforeSendHeaders.Details) => browser.webRequest.BlockingResponse | Promise<browser.webRequest.BlockingResponse> | void>, "addListener"> & { addListener(callback: (details: onBeforeSendHeaders.Details) => browser.webRequest.BlockingResponse | Promise<browser.webRequest.BlockingResponse> | void, filter: RequestFilter, extraInfoSpec?: OnBeforeSendHeadersOptions[] | null): void };
        export namespace onBeforeSendHeaders {
            export type Details = {
                /**
                 * The cookie store ID of the contextual identity.
                 */
                cookieStoreId?: string | undefined;
                /**
                 * The UUID of the document making the request.
                 */
                documentId?: string | undefined;
                /**
                 * URL of the page into which the requested resource will be loaded.
                 */
                documentUrl?: string | undefined;
                /**
                 * The value 0 indicates that the request happens in the main frame; a positive value indicates the ID of a subframe in which the request happens. If the document of a (sub-)frame is loaded (`type` is `main_frame` or `sub_frame`), `frameId` indicates the ID of this frame, not the ID of the outer frame. Frame IDs are unique within a tab.
                 */
                frameId: number;
                /**
                 * True for private browsing requests.
                 */
                incognito?: boolean | undefined;
                /**
                 * Standard HTTP method.
                 */
                method: string;
                /**
                 * URL of the resource that triggered this request.
                 */
                originUrl?: string | undefined;
                /**
                 * The UUID of the parent document owning this frame. This is not set if there is no parent.
                 */
                parentDocumentId?: string | undefined;
                /**
                 * ID of frame that wraps the frame which sent the request. Set to -1 if no parent frame exists.
                 */
                parentFrameId: number;
                /**
                 * The HTTP request headers that are going to be sent out with this request.
                 */
                requestHeaders?: HttpHeaders | undefined;
                /**
                 * The ID of the request. Request IDs are unique within a browser session. As a result, they could be used to relate different events of the same request.
                 */
                requestId: string;
                /**
                 * The ID of the tab in which the request takes place. Set to -1 if the request isn't related to a tab.
                 */
                tabId: number;
                /**
                 * Indicates if this request and its content window hierarchy is third party.
                 */
                thirdParty: boolean;
                /**
                 * The time when this signal is triggered, in milliseconds since the epoch.
                 */
                timeStamp: number;
                /**
                 * How the requested resource will be used.
                 */
                type: ResourceType;
                url: string;
                /**
                 * Tracking classification if the request has been classified.
                 */
                urlClassification?: UrlClassification | undefined;
            };
        }

        /**
         * Fired when a request is completed.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         * @platform desktop, mobile
         */
        export const onCompleted: Omit<WebExtensionEvent<(details: onCompleted.Details) => void>, "addListener"> & { addListener(callback: (details: onCompleted.Details) => void, filter: RequestFilter, extraInfoSpec?: OnCompletedOptions[] | null): void };
        export namespace onCompleted {
            export type Details = {
                /**
                 * The cookie store ID of the contextual identity.
                 */
                cookieStoreId?: string | undefined;
                /**
                 * The UUID of the document making the request.
                 */
                documentId?: string | undefined;
                /**
                 * URL of the page into which the requested resource will be loaded.
                 */
                documentUrl?: string | undefined;
                /**
                 * The value 0 indicates that the request happens in the main frame; a positive value indicates the ID of a subframe in which the request happens. If the document of a (sub-)frame is loaded (`type` is `main_frame` or `sub_frame`), `frameId` indicates the ID of this frame, not the ID of the outer frame. Frame IDs are unique within a tab.
                 */
                frameId: number;
                /**
                 * Indicates if this response was fetched from disk cache.
                 */
                fromCache: boolean;
                /**
                 * True for private browsing requests.
                 */
                incognito?: boolean | undefined;
                /**
                 * The server IP address that the request was actually sent to. Note that it may be a literal IPv6 address.
                 */
                ip?: string | undefined;
                /**
                 * Standard HTTP method.
                 */
                method: string;
                /**
                 * URL of the resource that triggered this request.
                 */
                originUrl?: string | undefined;
                /**
                 * The UUID of the parent document owning this frame. This is not set if there is no parent.
                 */
                parentDocumentId?: string | undefined;
                /**
                 * ID of frame that wraps the frame which sent the request. Set to -1 if no parent frame exists.
                 */
                parentFrameId: number;
                /**
                 * The ID of the request. Request IDs are unique within a browser session. As a result, they could be used to relate different events of the same request.
                 */
                requestId: string;
                /**
                 * For http requests, the bytes transferred in the request. Only available in onCompleted.
                 */
                requestSize: number;
                /**
                 * The HTTP response headers that were received along with this response.
                 */
                responseHeaders?: HttpHeaders | undefined;
                /**
                 * For http requests, the bytes received in the request. Only available in onCompleted.
                 */
                responseSize: number;
                /**
                 * Standard HTTP status code returned by the server.
                 */
                statusCode: number;
                /**
                 * HTTP status line of the response or the 'HTTP/0.9 200 OK' string for HTTP/0.9 responses (i.e., responses that lack a status line) or an empty string if there are no headers.
                 */
                statusLine: string;
                /**
                 * The ID of the tab in which the request takes place. Set to -1 if the request isn't related to a tab.
                 */
                tabId: number;
                /**
                 * Indicates if this request and its content window hierarchy is third party.
                 */
                thirdParty: boolean;
                /**
                 * The time when this signal is triggered, in milliseconds since the epoch.
                 */
                timeStamp: number;
                /**
                 * How the requested resource will be used.
                 */
                type: ResourceType;
                url: string;
                /**
                 * Tracking classification if the request has been classified.
                 */
                urlClassification: UrlClassification;
            };
        }

        /**
         * Fired when an error occurs.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         * @platform desktop, mobile
         */
        export const onErrorOccurred: Omit<WebExtensionEvent<(details: onErrorOccurred.Details) => void>, "addListener"> & { addListener(callback: (details: onErrorOccurred.Details) => void, filter: RequestFilter): void };
        export namespace onErrorOccurred {
            export type Details = {
                /**
                 * The cookie store ID of the contextual identity.
                 */
                cookieStoreId?: string | undefined;
                /**
                 * The UUID of the document making the request. This value is not present if the request is a navigation of a frame.
                 */
                documentId?: string | undefined;
                /**
                 * URL of the page into which the requested resource will be loaded.
                 */
                documentUrl?: string | undefined;
                /**
                 * The error description. This string is _not_ guaranteed to remain backwards compatible between releases. You must not parse and act based upon its content.
                 */
                error: string;
                /**
                 * The value 0 indicates that the request happens in the main frame; a positive value indicates the ID of a subframe in which the request happens. If the document of a (sub-)frame is loaded (`type` is `main_frame` or `sub_frame`), `frameId` indicates the ID of this frame, not the ID of the outer frame. Frame IDs are unique within a tab.
                 */
                frameId: number;
                /**
                 * Indicates if this response was fetched from disk cache.
                 */
                fromCache: boolean;
                /**
                 * True for private browsing requests.
                 */
                incognito?: boolean | undefined;
                /**
                 * The server IP address that the request was actually sent to. Note that it may be a literal IPv6 address.
                 */
                ip?: string | undefined;
                /**
                 * Standard HTTP method.
                 */
                method: string;
                /**
                 * URL of the resource that triggered this request.
                 */
                originUrl?: string | undefined;
                /**
                 * The UUID of the parent document owning this frame. This is not set if there is no parent.
                 */
                parentDocumentId?: string | undefined;
                /**
                 * ID of frame that wraps the frame which sent the request. Set to -1 if no parent frame exists.
                 */
                parentFrameId: number;
                /**
                 * The ID of the request. Request IDs are unique within a browser session. As a result, they could be used to relate different events of the same request.
                 */
                requestId: string;
                /**
                 * The ID of the tab in which the request takes place. Set to -1 if the request isn't related to a tab.
                 */
                tabId: number;
                /**
                 * Indicates if this request and its content window hierarchy is third party.
                 */
                thirdParty: boolean;
                /**
                 * The time when this signal is triggered, in milliseconds since the epoch.
                 */
                timeStamp: number;
                /**
                 * How the requested resource will be used.
                 */
                type: ResourceType;
                url: string;
                /**
                 * Tracking classification if the request has been classified.
                 */
                urlClassification?: UrlClassification | undefined;
            };
        }

        /**
         * Fired when HTTP response headers of a request have been received.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         * @platform desktop, mobile
         */
        export const onHeadersReceived: Omit<WebExtensionEvent<(details: onHeadersReceived.Details) => browser.webRequest.BlockingResponse | Promise<browser.webRequest.BlockingResponse> | void>, "addListener"> & { addListener(callback: (details: onHeadersReceived.Details) => browser.webRequest.BlockingResponse | Promise<browser.webRequest.BlockingResponse> | void, filter: RequestFilter, extraInfoSpec?: OnHeadersReceivedOptions[] | null): void };
        export namespace onHeadersReceived {
            export type Details = {
                /**
                 * The cookie store ID of the contextual identity.
                 */
                cookieStoreId?: string | undefined;
                /**
                 * The UUID of the document making the request.
                 */
                documentId?: string | undefined;
                /**
                 * URL of the page into which the requested resource will be loaded.
                 */
                documentUrl?: string | undefined;
                /**
                 * The value 0 indicates that the request happens in the main frame; a positive value indicates the ID of a subframe in which the request happens. If the document of a (sub-)frame is loaded (`type` is `main_frame` or `sub_frame`), `frameId` indicates the ID of this frame, not the ID of the outer frame. Frame IDs are unique within a tab.
                 */
                frameId: number;
                /**
                 * True for private browsing requests.
                 */
                incognito?: boolean | undefined;
                /**
                 * Standard HTTP method.
                 */
                method: string;
                /**
                 * URL of the resource that triggered this request.
                 */
                originUrl?: string | undefined;
                /**
                 * The UUID of the parent document owning this frame. This is not set if there is no parent.
                 */
                parentDocumentId?: string | undefined;
                /**
                 * ID of frame that wraps the frame which sent the request. Set to -1 if no parent frame exists.
                 */
                parentFrameId: number;
                /**
                 * The ID of the request. Request IDs are unique within a browser session. As a result, they could be used to relate different events of the same request.
                 */
                requestId: string;
                /**
                 * The HTTP response headers that have been received with this response.
                 */
                responseHeaders?: HttpHeaders | undefined;
                /**
                 * Standard HTTP status code returned by the server.
                 */
                statusCode: number;
                /**
                 * HTTP status line of the response or the 'HTTP/0.9 200 OK' string for HTTP/0.9 responses (i.e., responses that lack a status line).
                 */
                statusLine: string;
                /**
                 * The ID of the tab in which the request takes place. Set to -1 if the request isn't related to a tab.
                 */
                tabId: number;
                /**
                 * Indicates if this request and its content window hierarchy is third party.
                 */
                thirdParty: boolean;
                /**
                 * The time when this signal is triggered, in milliseconds since the epoch.
                 */
                timeStamp: number;
                /**
                 * How the requested resource will be used.
                 */
                type: ResourceType;
                url: string;
                /**
                 * Tracking classification if the request has been classified.
                 */
                urlClassification?: UrlClassification | undefined;
            };
        }

        /**
         * Fired when the first byte of the response body is received. For HTTP requests, this means that the status line and response headers are available.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         * @platform desktop, mobile
         */
        export const onResponseStarted: Omit<WebExtensionEvent<(details: onResponseStarted.Details) => void>, "addListener"> & { addListener(callback: (details: onResponseStarted.Details) => void, filter: RequestFilter, extraInfoSpec?: OnResponseStartedOptions[] | null): void };
        export namespace onResponseStarted {
            export type Details = {
                /**
                 * The cookie store ID of the contextual identity.
                 */
                cookieStoreId?: string | undefined;
                /**
                 * The UUID of the document making the request.
                 */
                documentId?: string | undefined;
                /**
                 * URL of the page into which the requested resource will be loaded.
                 */
                documentUrl?: string | undefined;
                /**
                 * The value 0 indicates that the request happens in the main frame; a positive value indicates the ID of a subframe in which the request happens. If the document of a (sub-)frame is loaded (`type` is `main_frame` or `sub_frame`), `frameId` indicates the ID of this frame, not the ID of the outer frame. Frame IDs are unique within a tab.
                 */
                frameId: number;
                /**
                 * Indicates if this response was fetched from disk cache.
                 */
                fromCache: boolean;
                /**
                 * True for private browsing requests.
                 */
                incognito?: boolean | undefined;
                /**
                 * The server IP address that the request was actually sent to. Note that it may be a literal IPv6 address.
                 */
                ip?: string | undefined;
                /**
                 * Standard HTTP method.
                 */
                method: string;
                /**
                 * URL of the resource that triggered this request.
                 */
                originUrl?: string | undefined;
                /**
                 * The UUID of the parent document owning this frame. This is not set if there is no parent.
                 */
                parentDocumentId?: string | undefined;
                /**
                 * ID of frame that wraps the frame which sent the request. Set to -1 if no parent frame exists.
                 */
                parentFrameId: number;
                /**
                 * The ID of the request. Request IDs are unique within a browser session. As a result, they could be used to relate different events of the same request.
                 */
                requestId: string;
                /**
                 * The HTTP response headers that were received along with this response.
                 */
                responseHeaders?: HttpHeaders | undefined;
                /**
                 * Standard HTTP status code returned by the server.
                 */
                statusCode: number;
                /**
                 * HTTP status line of the response or the 'HTTP/0.9 200 OK' string for HTTP/0.9 responses (i.e., responses that lack a status line) or an empty string if there are no headers.
                 */
                statusLine: string;
                /**
                 * The ID of the tab in which the request takes place. Set to -1 if the request isn't related to a tab.
                 */
                tabId: number;
                /**
                 * Indicates if this request and its content window hierarchy is third party.
                 */
                thirdParty: boolean;
                /**
                 * The time when this signal is triggered, in milliseconds since the epoch.
                 */
                timeStamp: number;
                /**
                 * How the requested resource will be used.
                 */
                type: ResourceType;
                url: string;
                /**
                 * Tracking classification if the request has been classified.
                 */
                urlClassification?: UrlClassification | undefined;
            };
        }

        /**
         * Fired just before a request is going to be sent to the server (modifications of previous onBeforeSendHeaders callbacks are visible by the time onSendHeaders is fired).
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         * @platform desktop, mobile
         */
        export const onSendHeaders: Omit<WebExtensionEvent<(details: onSendHeaders.Details) => void>, "addListener"> & { addListener(callback: (details: onSendHeaders.Details) => void, filter: RequestFilter, extraInfoSpec?: OnSendHeadersOptions[] | null): void };
        export namespace onSendHeaders {
            export type Details = {
                /**
                 * The cookie store ID of the contextual identity.
                 */
                cookieStoreId?: string | undefined;
                /**
                 * The UUID of the document making the request.
                 */
                documentId?: string | undefined;
                /**
                 * URL of the page into which the requested resource will be loaded.
                 */
                documentUrl?: string | undefined;
                /**
                 * The value 0 indicates that the request happens in the main frame; a positive value indicates the ID of a subframe in which the request happens. If the document of a (sub-)frame is loaded (`type` is `main_frame` or `sub_frame`), `frameId` indicates the ID of this frame, not the ID of the outer frame. Frame IDs are unique within a tab.
                 */
                frameId: number;
                /**
                 * True for private browsing requests.
                 */
                incognito?: boolean | undefined;
                /**
                 * Standard HTTP method.
                 */
                method: string;
                /**
                 * URL of the resource that triggered this request.
                 */
                originUrl?: string | undefined;
                /**
                 * The UUID of the parent document owning this frame. This is not set if there is no parent.
                 */
                parentDocumentId?: string | undefined;
                /**
                 * ID of frame that wraps the frame which sent the request. Set to -1 if no parent frame exists.
                 */
                parentFrameId: number;
                /**
                 * The HTTP request headers that have been sent out with this request.
                 */
                requestHeaders?: HttpHeaders | undefined;
                /**
                 * The ID of the request. Request IDs are unique within a browser session. As a result, they could be used to relate different events of the same request.
                 */
                requestId: string;
                /**
                 * The ID of the tab in which the request takes place. Set to -1 if the request isn't related to a tab.
                 */
                tabId: number;
                /**
                 * Indicates if this request and its content window hierarchy is third party.
                 */
                thirdParty: boolean;
                /**
                 * The time when this signal is triggered, in milliseconds since the epoch.
                 */
                timeStamp: number;
                /**
                 * How the requested resource will be used.
                 */
                type: ResourceType;
                url: string;
                /**
                 * Tracking classification if the request has been classified.
                 */
                urlClassification?: UrlClassification | undefined;
            };
        }

        /**
         * ...
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         * @permission webRequestBlocking
         * @platform desktop, mobile
         */
        export function filterResponseData(requestId: string): StreamFilter;

        /**
         * Retrieves the security information for the request.  Returns a promise that will resolve to a SecurityInfo object.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         * @platform desktop, mobile
         */
        export function getSecurityInfo(requestId: string, options?: getSecurityInfo.Options | null): globalThis.Promise<SecurityInfo | undefined>;
        export namespace getSecurityInfo {
            export type Options = {
                /**
                 * Include the entire certificate chain.
                 */
                certificateChain?: boolean | undefined;
                /**
                 * Include raw certificate data for processing by the extension.
                 */
                rawDER?: boolean | undefined;
            };
        }

        /**
         * Needs to be called when the behavior of the webRequest handlers has changed to prevent incorrect handling due to caching. This function call is expensive. Don't call it often.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         * @platform desktop, mobile
         */
        export function handlerBehaviorChanged(): globalThis.Promise<void>;
        export function handlerBehaviorChanged(callback: (() => void)): void;

    }

    /**
     * Use the `browser.windows` API to interact with browser windows. You can use this API to create, modify, and rearrange windows in the browser.
     *
     * Not available in content scripts or devtools pages.
     *
     * @platform desktop
     */
    export namespace windows {
        /**
         * Specifies what type of browser window to create. The 'panel' and 'detached_panel' types create a popup unless the '--enable-panels' flag is set.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/windows.json
         * @platform desktop
         */
        export type CreateType = "normal" | "popup" | "panel" | "detached_panel";

        /**
         * Specifies whether the {@link browser.windows.Window} returned should contain a list of the {@link browser.tabs.Tab} objects.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/windows.json
         * @platform desktop
         */
        export interface GetInfo {
            /**
             * If true, the {@link browser.windows.Window} returned will have a `tabs` property that contains a list of the {@link browser.tabs.Tab} objects. The `Tab` objects only contain the `url`, `title` and `favIconUrl` properties if the extension's manifest file includes the `"tabs"` permission.
             */
            populate?: boolean | undefined;
            /**
             * `windowTypes` is deprecated and ignored on Firefox.
             *
             * @deprecated
             */
            windowTypes?: WindowType[] | undefined;
        }

        /**
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/windows.json
         * @platform desktop
         */
        export interface Window {
            /**
             * Whether the window is set to be always on top.
             */
            alwaysOnTop: boolean;
            /**
             * Whether the window is currently the focused window.
             */
            focused: boolean;
            /**
             * The height of the window, including the frame, in pixels. Under some circumstances a Window may not be assigned height property, for example when querying closed windows from the {@link browser.sessions} API.
             */
            height?: number | undefined;
            /**
             * The ID of the window. Window IDs are unique within a browser session. Under some circumstances a Window may not be assigned an ID, for example when querying windows using the {@link browser.sessions} API, in which case a session ID may be present.
             */
            id?: number | undefined;
            /**
             * Whether the window is incognito.
             */
            incognito: boolean;
            /**
             * The offset of the window from the left edge of the screen in pixels. Under some circumstances a Window may not be assigned left property, for example when querying closed windows from the {@link browser.sessions} API.
             */
            left?: number | undefined;
            /**
             * The session ID used to uniquely identify a Window obtained from the {@link browser.sessions} API.
             */
            sessionId?: string | undefined;
            /**
             * The state of this browser window.
             */
            state?: WindowState | undefined;
            /**
             * Array of {@link browser.tabs.Tab} objects representing the current tabs in the window.
             */
            tabs?: browser.tabs.Tab[] | undefined;
            /**
             * The title of the window. Read-only.
             */
            title?: string | undefined;
            /**
             * The offset of the window from the top edge of the screen in pixels. Under some circumstances a Window may not be assigned top property, for example when querying closed windows from the {@link browser.sessions} API.
             */
            top?: number | undefined;
            /**
             * The type of browser window this is.
             */
            type?: WindowType | undefined;
            /**
             * The width of the window, including the frame, in pixels. Under some circumstances a Window may not be assigned width property, for example when querying closed windows from the {@link browser.sessions} API.
             */
            width?: number | undefined;
        }

        /**
         * The state of this browser window. Under some circumstances a Window may not be assigned state property, for example when querying closed windows from the {@link browser.sessions} API.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/windows.json
         * @platform desktop
         */
        export type WindowState = "normal" | "minimized" | "maximized" | "fullscreen" | "docked";

        /**
         * The type of browser window this is. Under some circumstances a Window may not be assigned type property, for example when querying closed windows from the {@link browser.sessions} API.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/windows.json
         * @platform desktop
         */
        export type WindowType = "normal" | "popup" | "panel" | "app" | "devtools";

        /**
         * The windowId value that represents the current window.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/windows.json
         * @platform desktop
         */
        export const WINDOW_ID_CURRENT: number;
        /**
         * The windowId value that represents the absence of a browser window.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/windows.json
         * @platform desktop
         */
        export const WINDOW_ID_NONE: number;

        /**
         * Fired when a window is created.
         *
         * @param window Details of the window that was created.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/windows.json
         * @platform desktop
         */
        export const onCreated: WebExtensionEvent<(window: Window) => void>;

        /**
         * Fired when the currently focused window changes. Will be {@link browser.windows.WINDOW_ID_NONE} if all browser windows have lost focus. Note: On some Linux window managers, WINDOW_ID_NONE will always be sent immediately preceding a switch from one browser window to another.
         *
         * @param windowId ID of the newly focused window.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/windows.json
         * @platform desktop
         */
        export const onFocusChanged: WebExtensionEvent<(windowId: number) => void>;

        /**
         * Fired when a window is removed (closed).
         *
         * @param windowId ID of the removed window.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/windows.json
         * @platform desktop
         */
        export const onRemoved: WebExtensionEvent<(windowId: number) => void>;

        /**
         * Creates (opens) a new browser with any optional sizing, position or default URL provided.
         *
         * @returns Contains details about the created window.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/windows.json
         * @platform desktop
         */
        export function create(createData?: create.CreateData | null): globalThis.Promise<Window | undefined>;
        export function create(createData: create.CreateData | null | undefined, callback: ((window: Window | undefined) => void)): void;
        export function create(callback: ((window: Window | undefined) => void)): void;
        export namespace create {
            export type CreateData = {
                /**
                 * Allow scripts to close the window.
                 */
                allowScriptsToClose?: boolean | undefined;
                /**
                 * The CookieStoreId to use for all tabs that were created when the window is opened.
                 */
                cookieStoreId?: string | undefined;
                /**
                 * If true, opens an active window. If false, opens an inactive window.
                 */
                focused?: true | false | undefined;
                /**
                 * The height in pixels of the new window, including the frame. If not specified defaults to a natural height.
                 */
                height?: number | undefined;
                /**
                 * Whether the new window should be an incognito window.
                 */
                incognito?: boolean | undefined;
                /**
                 * The number of pixels to position the new window from the left edge of the screen. If not specified, the new window is offset naturally from the last focused window. This value is ignored for panels.
                 */
                left?: number | undefined;
                /**
                 * The initial state of the window. The 'minimized', 'maximized' and 'fullscreen' states cannot be combined with 'left', 'top', 'width' or 'height'.
                 */
                state?: WindowState | undefined;
                /**
                 * The id of the tab for which you want to adopt to the new window.
                 */
                tabId?: number | undefined;
                /**
                 * A string to add to the beginning of the window title.
                 */
                titlePreface?: string | undefined;
                /**
                 * The number of pixels to position the new window from the top edge of the screen. If not specified, the new window is offset naturally from the last focused window. This value is ignored for panels.
                 */
                top?: number | undefined;
                /**
                 * Specifies what type of browser window to create. The 'panel' and 'detached_panel' types create a popup unless the '--enable-panels' flag is set.
                 */
                type?: CreateType | undefined;
                /**
                 * A URL or array of URLs to open as tabs in the window. Fully-qualified URLs must include a scheme (i.e. 'http://www.google.com', not 'www.google.com'). Relative URLs will be relative to the current page within the extension. Defaults to the New Tab Page.
                 */
                url?: string | string[] | undefined;
                /**
                 * The width in pixels of the new window, including the frame. If not specified defaults to a natural width.
                 */
                width?: number | undefined;
            };
        }

        /**
         * Gets details about a window.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/windows.json
         * @platform desktop
         */
        export function get(windowId: number, getInfo?: GetInfo | null): globalThis.Promise<Window>;
        export function get(windowId: number, getInfo: GetInfo | null | undefined, callback: ((window: Window) => void)): void;
        export function get(windowId: number, callback: ((window: Window) => void)): void;

        /**
         * Gets all windows.
         *
         * @param getInfo Specifies properties used to filter the {@link browser.windows.Window} returned and to determine whether they should contain a list of the {@link browser.tabs.Tab} objects.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/windows.json
         * @platform desktop
         */
        export function getAll(getInfo?: getAll.GetInfo | null): globalThis.Promise<Window[]>;
        export function getAll(getInfo: getAll.GetInfo | null | undefined, callback: ((windows: Window[]) => void)): void;
        export function getAll(callback: ((windows: Window[]) => void)): void;
        export namespace getAll {
            /**
             * Specifies properties used to filter the {@link browser.windows.Window} returned and to determine whether they should contain a list of the {@link browser.tabs.Tab} objects.
             */
            export type GetInfo = {
                /**
                 * If true, the {@link browser.windows.Window} returned will have a `tabs` property that contains a list of the {@link browser.tabs.Tab} objects. The `Tab` objects only contain the `url`, `title` and `favIconUrl` properties if the extension's manifest file includes the `"tabs"` permission.
                 */
                populate?: boolean | undefined;
                /**
                 * If set, the {@link browser.windows.Window} returned will be filtered based on its type. If unset the default filter is set to `['app', 'normal', 'panel', 'popup']`, with `'app'` and `'panel'` window types limited to the extension's own windows.
                 */
                windowTypes?: WindowType[] | undefined;
            };
        }

        /**
         * Gets the current window.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/windows.json
         * @platform desktop
         */
        export function getCurrent(getInfo?: GetInfo | null): globalThis.Promise<Window>;
        export function getCurrent(getInfo: GetInfo | null | undefined, callback: ((window: Window) => void)): void;
        export function getCurrent(callback: ((window: Window) => void)): void;

        /**
         * Gets the window that was most recently focused — typically the window 'on top'.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/windows.json
         * @platform desktop
         */
        export function getLastFocused(getInfo?: GetInfo | null): globalThis.Promise<Window>;
        export function getLastFocused(getInfo: GetInfo | null | undefined, callback: ((window: Window) => void)): void;
        export function getLastFocused(callback: ((window: Window) => void)): void;

        /**
         * Removes (closes) a window, and all the tabs inside it.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/windows.json
         * @platform desktop
         */
        export function remove(windowId: number): globalThis.Promise<void>;
        export function remove(windowId: number, callback: (() => void)): void;

        /**
         * Updates the properties of a window. Specify only the properties that you want to change; unspecified properties will be left unchanged.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/windows.json
         * @platform desktop
         */
        export function update(windowId: number, updateInfo: update.UpdateInfo): globalThis.Promise<Window>;
        export function update(windowId: number, updateInfo: update.UpdateInfo, callback: ((window: Window) => void)): void;
        export namespace update {
            export type UpdateInfo = {
                /**
                 * If true, causes the window to be displayed in a manner that draws the user's attention to the window, without changing the focused window. The effect lasts until the user changes focus to the window. This option has no effect if the window already has focus. Set to false to cancel a previous draw attention request.
                 */
                drawAttention?: boolean | undefined;
                /**
                 * If true, brings the window to the front. If false, brings the next window in the z-order to the front.
                 */
                focused?: boolean | undefined;
                /**
                 * The height to resize the window to in pixels. This value is ignored for panels.
                 */
                height?: number | undefined;
                /**
                 * The offset from the left edge of the screen to move the window to in pixels. This value is ignored for panels.
                 */
                left?: number | undefined;
                /**
                 * The new state of the window. The 'minimized', 'maximized' and 'fullscreen' states cannot be combined with 'left', 'top', 'width' or 'height'.
                 */
                state?: WindowState | undefined;
                /**
                 * A string to add to the beginning of the window title.
                 */
                titlePreface?: string | undefined;
                /**
                 * The offset from the top edge of the screen to move the window to in pixels. This value is ignored for panels.
                 */
                top?: number | undefined;
                /**
                 * The width to resize the window to in pixels. This value is ignored for panels.
                 */
                width?: number | undefined;
            };
        }

    }

}

export namespace chrome {
    export import action = browser.action;
    export import activityLog = browser.activityLog;
    export import alarms = browser.alarms;
    export import bookmarks = browser.bookmarks;
    export import browserAction = browser.browserAction;
    export import browserSettings = browser.browserSettings;
    export import browsingData = browser.browsingData;
    export import captivePortal = browser.captivePortal;
    export import clipboard = browser.clipboard;
    export import commands = browser.commands;
    export import contentScripts = browser.contentScripts;
    export import contextMenus = browser.contextMenus;
    export import contextualIdentities = browser.contextualIdentities;
    export import cookies = browser.cookies;
    export import declarativeNetRequest = browser.declarativeNetRequest;
    export import devtools = browser.devtools;
    export import dns = browser.dns;
    export import downloads = browser.downloads;
    export import events = browser.events;
    export import experiments = browser.experiments;
    export import extension = browser.extension;
    export import extensionTypes = browser.extensionTypes;
    export import find = browser.find;
    export import geckoProfiler = browser.geckoProfiler;
    export import history = browser.history;
    export import i18n = browser.i18n;
    export import identity = browser.identity;
    export import idle = browser.idle;
    export import management = browser.management;
    export import manifest = browser.manifest;
    export import menus = browser.menus;
    export import networkStatus = browser.networkStatus;
    export import notifications = browser.notifications;
    export import omnibox = browser.omnibox;
    export import pageAction = browser.pageAction;
    export import permissions = browser.permissions;
    export import pkcs11 = browser.pkcs11;
    export import privacy = browser.privacy;
    export import proxy = browser.proxy;
    export import publicSuffix = browser.publicSuffix;
    export import runtime = browser.runtime;
    export import scripting = browser.scripting;
    export import search = browser.search;
    export import sessions = browser.sessions;
    export import sidebarAction = browser.sidebarAction;
    export import storage = browser.storage;
    export import tabGroups = browser.tabGroups;
    export import tabs = browser.tabs;
    export import telemetry = browser.telemetry;
    export import theme = browser.theme;
    export import topSites = browser.topSites;
    export import trial = browser.trial;
    export import types = browser.types;
    export import userScripts = browser.userScripts;
    export import webNavigation = browser.webNavigation;
    export import webRequest = browser.webRequest;
    export import windows = browser.windows;
}

export default browser;
