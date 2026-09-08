// Type definitions for Firefox WebExtensions
// Project: firefox-webextension-types
// Target: Desktop
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
export interface WebExtensionWebRequestEvent<TListener extends (...args: any[]) => browser.webRequest.BlockingResponse | Promise<browser.webRequest.BlockingResponse> | void> {
    addListener(callback: TListener, filter?: browser.webRequest.RequestFilter, extraInfoSpec?: string[]): void;
    removeListener(callback: TListener): void;
    hasListener(callback: TListener): boolean;
}

export namespace browser {
    export namespace action {
        export type ColorArray = number[];

        /**
         * An array of four integers in the range [0,255] that make up the RGBA color of the badge. For example, opaque red is [255, 0, 0, 255]. Can also be a string with a CSS value, with opaque red being #FF0000 or #F00.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         */
        export type ColorValue = ColorArray | null | (string & {});

        /**
         * Specifies to which tab or window the value should be set, or from which one it should be retrieved. If no tab nor window is specified, the global value is set or retrieved.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         */
        export interface Details {
            /**
             * When setting a value, it will be specific to the specified tab, and will automatically reset when the tab navigates. When getting, specifies the tab to get the value from; if there is no tab-specific value, the window one will be inherited.
             */
            tabId?: number;
            /**
             * When setting a value, it will be specific to the specified window. When getting, specifies the window to get the value from; if there is no window-specific value, the global one will be inherited.
             */
            windowId?: number;
        }

        /**
         * Pixel data for an image. Must be an ImageData object (for example, from a canvas element).
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         */
        export interface ImageDataType {
            [key: string]: unknown;
        }

        /**
         * Information sent when a browser action is clicked.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         */
        export interface OnClickData {
            /**
             * An integer value of button by which menu item was clicked.
             */
            button?: number;
            /**
             * An array of keyboard modifiers that were held while the menu item was clicked.
             */
            modifiers: ("Shift" | "Alt" | "Command" | "Ctrl" | "MacCtrl")[];
        }

        /**
         * Fired when a browser action icon is clicked.  This event will not fire if the browser action has a popup.
         */
        export const onClicked: WebExtensionEvent<(tab: browser.tabs.Tab, info: OnClickData) => void>;

        /**
         * Fired when user-specified settings relating to an extension's action change.
         */
        export const onUserSettingsChanged: WebExtensionEvent<(change: {
isOnToolbar?: boolean;
}) => void>;

        /**
         * Disables the browser action for a tab.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop
         */
        export function disable(): globalThis.Promise<void>;
        export function disable(callback: (() => void)): void;
        export function disable(tabId: number): globalThis.Promise<void>;
        export function disable(tabId: number, callback: (() => void)): void;

        /**
         * Enables the browser action for a tab. By default, browser actions are enabled.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop
         */
        export function enable(): globalThis.Promise<void>;
        export function enable(callback: (() => void)): void;
        export function enable(tabId: number): globalThis.Promise<void>;
        export function enable(tabId: number, callback: (() => void)): void;

        /**
         * Gets the background color of the browser action badge.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop
         */
        export function getBadgeBackgroundColor(details: Details): globalThis.Promise<ColorArray>;
        export function getBadgeBackgroundColor(details: Details, callback: ((result: ColorArray) => void)): void;

        /**
         * Gets the badge text of the browser action. If no tab nor window is specified is specified, the global badge text is returned.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop
         */
        export function getBadgeText(details: Details): globalThis.Promise<string>;
        export function getBadgeText(details: Details, callback: ((result: string) => void)): void;

        /**
         * Gets the text color of the browser action badge.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop
         */
        export function getBadgeTextColor(details: Details): globalThis.Promise<void>;

        /**
         * Gets the html document set as the popup for this browser action.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop
         */
        export function getPopup(details: Details): globalThis.Promise<string>;
        export function getPopup(details: Details, callback: ((result: string) => void)): void;

        /**
         * Gets the title of the browser action.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop
         */
        export function getTitle(details: Details): globalThis.Promise<string>;
        export function getTitle(details: Details, callback: ((result: string) => void)): void;

        /**
         * Returns the user-specified settings relating to an extension's action.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop
         */
        export function getUserSettings(): globalThis.Promise<{
isOnToolbar?: boolean;
}>;
        export function getUserSettings(callback: ((userSettings: {
isOnToolbar?: boolean;
}) => void)): void;

        /**
         * Checks whether the browser action is enabled.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop
         */
        export function isEnabled(): globalThis.Promise<void>;
        export function isEnabled(details: Details | number): globalThis.Promise<void>;

        /**
         * Opens the extension popup window in the specified window.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop
         */
        export function openPopup(): globalThis.Promise<void>;
        export function openPopup(options: {
windowId?: number;
}): globalThis.Promise<void>;

        /**
         * Sets the background color for the badge.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop
         */
        export function setBadgeBackgroundColor(details: {
color: ColorValue;
tabId?: number;
windowId?: number;
}): globalThis.Promise<void>;
        export function setBadgeBackgroundColor(details: {
color: ColorValue;
tabId?: number;
windowId?: number;
}, callback: (() => void)): void;

        /**
         * Sets the badge text for the browser action. The badge is displayed on top of the icon.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop
         */
        export function setBadgeText(details: {
tabId?: number;
text: string | null;
windowId?: number;
}): globalThis.Promise<void>;
        export function setBadgeText(details: {
tabId?: number;
text: string | null;
windowId?: number;
}, callback: (() => void)): void;

        /**
         * Sets the text color for the badge.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop
         */
        export function setBadgeTextColor(details: {
color: ColorValue;
tabId?: number;
windowId?: number;
}): globalThis.Promise<void>;

        /**
         * Sets the icon for the browser action. The icon can be specified either as the path to an image file or as the pixel data from a canvas element, or as dictionary of either one of those. Either the path or the imageData property must be specified.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop
         */
        export function setIcon(details: {
imageData?: ImageDataType | Record<string, unknown>;
path?: string | Record<string, unknown>;
tabId?: number;
windowId?: number;
}): globalThis.Promise<void>;
        export function setIcon(details: {
imageData?: ImageDataType | Record<string, unknown>;
path?: string | Record<string, unknown>;
tabId?: number;
windowId?: number;
}, callback: (() => void)): void;

        /**
         * Sets the html document to be opened as a popup when the user clicks on the browser action's icon.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop
         */
        export function setPopup(details: {
popup: string | null;
tabId?: number;
windowId?: number;
}): globalThis.Promise<void>;
        export function setPopup(details: {
popup: string | null;
tabId?: number;
windowId?: number;
}, callback: (() => void)): void;

        /**
         * Sets the title of the browser action. This shows up in the tooltip.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop
         */
        export function setTitle(details: {
tabId?: number;
title: string | null;
windowId?: number;
}): globalThis.Promise<void>;
        export function setTitle(details: {
tabId?: number;
title: string | null;
windowId?: number;
}, callback: (() => void)): void;

    }

    export namespace activityLog {
        /**
         * Receives an activityItem for each logging event.
         */
        export const onExtensionActivity: WebExtensionEvent<(details: {
data: {
args?: any[];
result?: Record<string, unknown>;
tabId?: number;
url?: string;
};
name: string;
timeStamp: browser.extensionTypes.Date;
type: "api_call" | "api_event" | "content_script" | "user_script";
viewType?: "background" | "popup" | "sidebar" | "tab" | "devtools_page" | "devtools_panel";
}) => void>;

    }

    export namespace alarms {
        export interface Alarm {
            /**
             * Name of this alarm.
             */
            name: string;
            /**
             * When present, signals that the alarm triggers periodically after so many minutes.
             */
            periodInMinutes?: number;
            /**
             * Time when the alarm is scheduled to fire, in milliseconds past the epoch.
             */
            scheduledTime: number;
        }

        /**
         * Fired when an alarm has expired. Useful for transient background pages.
         */
        export const onAlarm: WebExtensionEvent<(name: Alarm) => void>;

        /**
         * Clears the alarm with the given name.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/alarms.json
         * @platform desktop
         */
        export function clear(): globalThis.Promise<boolean>;
        export function clear(callback: ((wasCleared: boolean) => void)): void;
        export function clear(name: string): globalThis.Promise<boolean>;
        export function clear(name: string, callback: ((wasCleared: boolean) => void)): void;

        /**
         * Clears all alarms.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/alarms.json
         * @platform desktop
         */
        export function clearAll(): globalThis.Promise<void>;
        export function clearAll(callback: (() => void)): void;

        /**
         * Creates an alarm. After the delay is expired, the onAlarm event is fired. If there is another alarm with the same name (or no name if none is specified), it will be cancelled and replaced by this alarm.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/alarms.json
         * @platform desktop
         */
        export function create(name: string, alarmInfo: {
delayInMinutes?: number;
periodInMinutes?: number;
when?: number;
}): globalThis.Promise<void>;
        export function create(name: string, alarmInfo: {
delayInMinutes?: number;
periodInMinutes?: number;
when?: number;
}, callback: (() => void)): void;
        export function create(alarmInfo: {
delayInMinutes?: number;
periodInMinutes?: number;
when?: number;
}): globalThis.Promise<void>;
        export function create(alarmInfo: {
delayInMinutes?: number;
periodInMinutes?: number;
when?: number;
}, callback: (() => void)): void;

        /**
         * Retrieves details about the specified alarm.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/alarms.json
         * @platform desktop
         */
        export function get(): globalThis.Promise<Alarm>;
        export function get(callback: ((alarm: Alarm) => void)): void;
        export function get(name: string): globalThis.Promise<Alarm>;
        export function get(name: string, callback: ((alarm: Alarm) => void)): void;

        /**
         * Gets an array of all the alarms.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/alarms.json
         * @platform desktop
         */
        export function getAll(): globalThis.Promise<Alarm[]>;
        export function getAll(callback: ((alarms: Alarm[]) => void)): void;

    }

    export namespace bookmarks {
        /**
         * A node (either a bookmark or a folder) in the bookmark tree.  Child nodes are ordered within their parent folder.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/bookmarks.json
         */
        export interface BookmarkTreeNode {
            /**
             * An ordered list of children of this node.
             */
            children?: BookmarkTreeNode[];
            /**
             * When this node was created, in milliseconds since the epoch (new Date(dateAdded)).
             */
            dateAdded?: number;
            /**
             * When the contents of this folder last changed, in milliseconds since the epoch.
             */
            dateGroupModified?: number;
            /**
             * The unique identifier for the node. IDs are unique within the current profile, and they remain valid even after the browser is restarted.
             */
            id: string;
            /**
             * The 0-based position of this node within its parent folder.
             */
            index?: number;
            /**
             * The id of the parent folder.  Omitted for the root node.
             */
            parentId?: string;
            /**
             * The text displayed for the node.
             */
            title: string;
            /**
             * Indicates the type of the BookmarkTreeNode, which can be one of bookmark, folder or separator.
             */
            type?: BookmarkTreeNodeType;
            /**
             * Indicates the reason why this node is unmodifiable. The managed value indicates that this node was configured by the system administrator or by the custodian of a supervised user. Omitted if the node can be modified by the user and the extension (default).
             */
            unmodifiable?: BookmarkTreeNodeUnmodifiable;
            /**
             * The URL navigated to when a user clicks the bookmark. Omitted for folders.
             */
            url?: string;
        }

        /**
         * Indicates the type of a BookmarkTreeNode, which can be one of bookmark, folder or separator.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/bookmarks.json
         */
        export type BookmarkTreeNodeType = "bookmark" | "folder" | "separator";

        /**
         * Indicates the reason why this node is unmodifiable. The managed value indicates that this node was configured by the system administrator or by the custodian of a supervised user. Omitted if the node can be modified by the user and the extension (default).
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/bookmarks.json
         */
        export type BookmarkTreeNodeUnmodifiable = "managed";

        /**
         * Object passed to the create() function.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/bookmarks.json
         */
        export interface CreateDetails {
            index?: number;
            /**
             * Defaults to the Other Bookmarks folder.
             */
            parentId?: string;
            title?: string;
            /**
             * Indicates the type of BookmarkTreeNode to create, which can be one of bookmark, folder or separator.
             */
            type?: BookmarkTreeNodeType;
            url?: string;
        }

        /**
         * Fired when a bookmark or folder changes.  Note: Currently, only title and url changes trigger this.
         */
        export const onChanged: WebExtensionEvent<(id: string, changeInfo: {
title: string;
url?: string;
}) => void>;

        /**
         * Fired when the children of a folder have changed their order due to the order being sorted in the UI.  This is not called as a result of a move().
         */
        export const onChildrenReordered: WebExtensionEvent<(id: string, reorderInfo: {
childIds: string[];
}) => void>;

        /**
         * Fired when a bookmark or folder is created.
         */
        export const onCreated: WebExtensionEvent<(id: string, bookmark: BookmarkTreeNode) => void>;

        /**
         * Fired when a bookmark import session is begun.  Expensive observers should ignore onCreated updates until onImportEnded is fired.  Observers should still handle other notifications immediately.
         */
        export const onImportBegan: WebExtensionEvent<() => void>;

        /**
         * Fired when a bookmark import session is ended.
         */
        export const onImportEnded: WebExtensionEvent<() => void>;

        /**
         * Fired when a bookmark or folder is moved to a different parent folder.
         */
        export const onMoved: WebExtensionEvent<(id: string, moveInfo: {
index: number;
oldIndex: number;
oldParentId: string;
parentId: string;
}) => void>;

        /**
         * Fired when a bookmark or folder is removed.  When a folder is removed recursively, a single notification is fired for the folder, and none for its contents.
         */
        export const onRemoved: WebExtensionEvent<(id: string, removeInfo: {
index: number;
node: BookmarkTreeNode;
parentId: string;
}) => void>;

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
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/bookmarks.json
         * @platform desktop
         */
        export function getRecent(numberOfItems: number): globalThis.Promise<BookmarkTreeNode[]>;
        export function getRecent(numberOfItems: number, callback: ((results: BookmarkTreeNode[]) => void)): void;

        /**
         * Retrieves part of the Bookmarks hierarchy, starting at the specified node.
         *
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
        export function move(id: string, destination: {
index?: number;
parentId?: string;
}): globalThis.Promise<BookmarkTreeNode>;
        export function move(id: string, destination: {
index?: number;
parentId?: string;
}, callback: ((result: BookmarkTreeNode) => void)): void;

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
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/bookmarks.json
         * @platform desktop
         */
        export function search(query: string | {
query?: string;
title?: string;
url?: string;
}): globalThis.Promise<BookmarkTreeNode[]>;
        export function search(query: string | {
query?: string;
title?: string;
url?: string;
}, callback: ((results: BookmarkTreeNode[]) => void)): void;

        /**
         * Updates the properties of a bookmark or folder. Specify only the properties that you want to change; unspecified properties will be left unchanged.  Note: Currently, only 'title' and 'url' are supported.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/bookmarks.json
         * @platform desktop
         */
        export function update(id: string, changes: {
title?: string;
url?: string;
}): globalThis.Promise<BookmarkTreeNode>;
        export function update(id: string, changes: {
title?: string;
url?: string;
}, callback: ((result: BookmarkTreeNode) => void)): void;

    }

    export namespace browserAction {
        export type ColorArray = number[];

        /**
         * An array of four integers in the range [0,255] that make up the RGBA color of the badge. For example, opaque red is [255, 0, 0, 255]. Can also be a string with a CSS value, with opaque red being #FF0000 or #F00.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         */
        export type ColorValue = ColorArray | null | (string & {});

        /**
         * Specifies to which tab or window the value should be set, or from which one it should be retrieved. If no tab nor window is specified, the global value is set or retrieved.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         */
        export interface Details {
            /**
             * When setting a value, it will be specific to the specified tab, and will automatically reset when the tab navigates. When getting, specifies the tab to get the value from; if there is no tab-specific value, the window one will be inherited.
             */
            tabId?: number;
            /**
             * When setting a value, it will be specific to the specified window. When getting, specifies the window to get the value from; if there is no window-specific value, the global one will be inherited.
             */
            windowId?: number;
        }

        /**
         * Pixel data for an image. Must be an ImageData object (for example, from a canvas element).
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         */
        export interface ImageDataType {
            [key: string]: unknown;
        }

        /**
         * Information sent when a browser action is clicked.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         */
        export interface OnClickData {
            /**
             * An integer value of button by which menu item was clicked.
             */
            button?: number;
            /**
             * An array of keyboard modifiers that were held while the menu item was clicked.
             */
            modifiers: ("Shift" | "Alt" | "Command" | "Ctrl" | "MacCtrl")[];
        }

        /**
         * Fired when a browser action icon is clicked.  This event will not fire if the browser action has a popup.
         */
        export const onClicked: WebExtensionEvent<(tab: browser.tabs.Tab, info: OnClickData) => void>;

        /**
         * Fired when user-specified settings relating to an extension's action change.
         */
        export const onUserSettingsChanged: WebExtensionEvent<(change: {
isOnToolbar?: boolean;
}) => void>;

        /**
         * Disables the browser action for a tab.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop
         */
        export function disable(): globalThis.Promise<void>;
        export function disable(callback: (() => void)): void;
        export function disable(tabId: number): globalThis.Promise<void>;
        export function disable(tabId: number, callback: (() => void)): void;

        /**
         * Enables the browser action for a tab. By default, browser actions are enabled.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop
         */
        export function enable(): globalThis.Promise<void>;
        export function enable(callback: (() => void)): void;
        export function enable(tabId: number): globalThis.Promise<void>;
        export function enable(tabId: number, callback: (() => void)): void;

        /**
         * Gets the background color of the browser action badge.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop
         */
        export function getBadgeBackgroundColor(details: Details): globalThis.Promise<ColorArray>;
        export function getBadgeBackgroundColor(details: Details, callback: ((result: ColorArray) => void)): void;

        /**
         * Gets the badge text of the browser action. If no tab nor window is specified is specified, the global badge text is returned.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop
         */
        export function getBadgeText(details: Details): globalThis.Promise<string>;
        export function getBadgeText(details: Details, callback: ((result: string) => void)): void;

        /**
         * Gets the text color of the browser action badge.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop
         */
        export function getBadgeTextColor(details: Details): globalThis.Promise<void>;

        /**
         * Gets the html document set as the popup for this browser action.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop
         */
        export function getPopup(details: Details): globalThis.Promise<string>;
        export function getPopup(details: Details, callback: ((result: string) => void)): void;

        /**
         * Gets the title of the browser action.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop
         */
        export function getTitle(details: Details): globalThis.Promise<string>;
        export function getTitle(details: Details, callback: ((result: string) => void)): void;

        /**
         * Returns the user-specified settings relating to an extension's action.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop
         */
        export function getUserSettings(): globalThis.Promise<{
isOnToolbar?: boolean;
}>;
        export function getUserSettings(callback: ((userSettings: {
isOnToolbar?: boolean;
}) => void)): void;

        /**
         * Checks whether the browser action is enabled.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop
         */
        export function isEnabled(): globalThis.Promise<void>;
        export function isEnabled(details: Details | number): globalThis.Promise<void>;

        /**
         * Opens the extension popup window in the specified window.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop
         */
        export function openPopup(): globalThis.Promise<void>;
        export function openPopup(options: {
windowId?: number;
}): globalThis.Promise<void>;

        /**
         * Sets the background color for the badge.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop
         */
        export function setBadgeBackgroundColor(details: {
color: ColorValue;
tabId?: number;
windowId?: number;
}): globalThis.Promise<void>;
        export function setBadgeBackgroundColor(details: {
color: ColorValue;
tabId?: number;
windowId?: number;
}, callback: (() => void)): void;

        /**
         * Sets the badge text for the browser action. The badge is displayed on top of the icon.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop
         */
        export function setBadgeText(details: {
tabId?: number;
text: string | null;
windowId?: number;
}): globalThis.Promise<void>;
        export function setBadgeText(details: {
tabId?: number;
text: string | null;
windowId?: number;
}, callback: (() => void)): void;

        /**
         * Sets the text color for the badge.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop
         */
        export function setBadgeTextColor(details: {
color: ColorValue;
tabId?: number;
windowId?: number;
}): globalThis.Promise<void>;

        /**
         * Sets the icon for the browser action. The icon can be specified either as the path to an image file or as the pixel data from a canvas element, or as dictionary of either one of those. Either the path or the imageData property must be specified.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop
         */
        export function setIcon(details: {
imageData?: ImageDataType | Record<string, unknown>;
path?: string | Record<string, unknown>;
tabId?: number;
windowId?: number;
}): globalThis.Promise<void>;
        export function setIcon(details: {
imageData?: ImageDataType | Record<string, unknown>;
path?: string | Record<string, unknown>;
tabId?: number;
windowId?: number;
}, callback: (() => void)): void;

        /**
         * Sets the html document to be opened as a popup when the user clicks on the browser action's icon.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop
         */
        export function setPopup(details: {
popup: string | null;
tabId?: number;
windowId?: number;
}): globalThis.Promise<void>;
        export function setPopup(details: {
popup: string | null;
tabId?: number;
windowId?: number;
}, callback: (() => void)): void;

        /**
         * Sets the title of the browser action. This shows up in the tooltip.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_action.json
         * @platform desktop
         */
        export function setTitle(details: {
tabId?: number;
title: string | null;
windowId?: number;
}): globalThis.Promise<void>;
        export function setTitle(details: {
tabId?: number;
title: string | null;
windowId?: number;
}, callback: (() => void)): void;

    }

    export namespace browserSettings {
        /**
         * Color management mode.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_settings.json
         */
        export type ColorManagementMode = "off" | "full" | "tagged_only";

        /**
         * After which mouse event context menus should popup.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_settings.json
         */
        export type ContextMenuMouseEvent = "mouseup" | "mousedown";

        /**
         * How images should be animated in the browser.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browser_settings.json
         */
        export type ImageAnimationBehavior = "normal" | "none" | "once";

        export const allowPopupsForUserEvents: browser.types.Setting;
        export const cacheEnabled: browser.types.Setting;
        export const closeTabsByDoubleClick: browser.types.Setting;
        export const contextMenuShowEvent: browser.types.Setting;
        export const ftpProtocolEnabled: browser.types.Setting;
        export const homepageOverride: browser.types.Setting;
        export const imageAnimationBehavior: browser.types.Setting;
        export const newTabPageOverride: browser.types.Setting;
        export const newTabPosition: browser.types.Setting;
        export const openBookmarksInNewTabs: browser.types.Setting;
        export const openSearchResultsInNewTabs: browser.types.Setting;
        export const openUrlbarResultsInNewTabs: browser.types.Setting;
        export const overrideContentColorScheme: browser.types.Setting;
        export const overrideDocumentColors: browser.types.Setting;
        export const useDocumentFonts: browser.types.Setting;
        export const verticalTabs: browser.types.Setting;
        export const webNotificationsDisabled: browser.types.Setting;
        export const zoomFullPage: browser.types.Setting;
        export const zoomSiteSpecific: browser.types.Setting;
        export namespace colorManagement {
            export const mode: browser.types.Setting;
            export const useNativeSRGB: browser.types.Setting;
            export const useWebRenderCompositor: browser.types.Setting;
        }
    }

    export namespace browsingData {
        /**
         * A set of data types. Missing data types are interpreted as false.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browsing_data.json
         */
        export interface DataTypeSet {
            /**
             * The browser's cache. Note: when removing data, this clears the entire cache: it is not limited to the range you specify.
             */
            cache?: boolean;
            /**
             * The browser's cookies.
             */
            cookies?: boolean;
            /**
             * The browser's download list.
             */
            downloads?: boolean;
            /**
             * The browser's stored form data.
             */
            formData?: boolean;
            /**
             * The browser's history.
             */
            history?: boolean;
            /**
             * Websites' IndexedDB data.
             */
            indexedDB?: boolean;
            /**
             * Websites' local storage data.
             */
            localStorage?: boolean;
            /**
             * Stored passwords.
             */
            passwords?: boolean;
            /**
             * Plugins' data.
             */
            pluginData?: boolean;
            /**
             * Server-bound certificates.
             */
            serverBoundCertificates?: boolean;
            /**
             * Service Workers.
             */
            serviceWorkers?: boolean;
        }

        /**
         * Options that determine exactly what data will be removed.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browsing_data.json
         */
        export interface RemovalOptions {
            /**
             * Only remove data associated with this specific cookieStoreId.
             */
            cookieStoreId?: string;
            /**
             * Only remove data associated with these hostnames (only applies to cookies and localStorage).
             */
            hostnames?: string[];
            /**
             * An object whose properties specify which origin types ought to be cleared. If this object isn't specified, it defaults to clearing only "unprotected" origins. Please ensure that you really want to remove application data before adding 'protectedWeb' or 'extensions'.
             */
            originTypes?: {
extension?: boolean;
protectedWeb?: boolean;
unprotectedWeb?: boolean;
};
            /**
             * Remove data accumulated on or after this date, represented in milliseconds since the epoch (accessible via the getTime method of the JavaScript Date object). If absent, defaults to 0 (which would remove all browsing data).
             */
            since?: browser.extensionTypes.Date;
        }

        /**
         * Clears various types of browsing data stored in a user's profile.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browsing_data.json
         * @platform desktop
         */
        export function remove(options: RemovalOptions, dataToRemove: DataTypeSet): globalThis.Promise<void>;
        export function remove(options: RemovalOptions, dataToRemove: DataTypeSet, callback: (() => void)): void;

        /**
         * Clears websites' appcache data.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browsing_data.json
         * @platform desktop
         */
        export function removeAppcache(options: RemovalOptions): globalThis.Promise<void>;
        export function removeAppcache(options: RemovalOptions, callback: (() => void)): void;

        /**
         * Clears the browser's cache.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browsing_data.json
         * @platform desktop
         */
        export function removeCache(options: RemovalOptions): globalThis.Promise<void>;
        export function removeCache(options: RemovalOptions, callback: (() => void)): void;

        /**
         * Clears the browser's cookies and server-bound certificates modified within a particular timeframe.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browsing_data.json
         * @platform desktop
         */
        export function removeCookies(options: RemovalOptions): globalThis.Promise<void>;
        export function removeCookies(options: RemovalOptions, callback: (() => void)): void;

        /**
         * Clears the browser's list of downloaded files (not the downloaded files themselves).
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browsing_data.json
         * @platform desktop
         */
        export function removeDownloads(options: RemovalOptions): globalThis.Promise<void>;
        export function removeDownloads(options: RemovalOptions, callback: (() => void)): void;

        /**
         * Clears websites' file system data.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browsing_data.json
         * @platform desktop
         */
        export function removeFileSystems(options: RemovalOptions): globalThis.Promise<void>;
        export function removeFileSystems(options: RemovalOptions, callback: (() => void)): void;

        /**
         * Clears the browser's stored form data (autofill).
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browsing_data.json
         * @platform desktop
         */
        export function removeFormData(options: RemovalOptions): globalThis.Promise<void>;
        export function removeFormData(options: RemovalOptions, callback: (() => void)): void;

        /**
         * Clears the browser's history.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browsing_data.json
         * @platform desktop
         */
        export function removeHistory(options: RemovalOptions): globalThis.Promise<void>;
        export function removeHistory(options: RemovalOptions, callback: (() => void)): void;

        /**
         * Clears websites' IndexedDB data.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browsing_data.json
         * @platform desktop
         */
        export function removeIndexedDB(options: RemovalOptions): globalThis.Promise<void>;
        export function removeIndexedDB(options: RemovalOptions, callback: (() => void)): void;

        /**
         * Clears websites' local storage data.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browsing_data.json
         * @platform desktop
         */
        export function removeLocalStorage(options: RemovalOptions): globalThis.Promise<void>;
        export function removeLocalStorage(options: RemovalOptions, callback: (() => void)): void;

        /**
         * Clears the browser's stored passwords.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browsing_data.json
         * @platform desktop
         */
        export function removePasswords(options: RemovalOptions): globalThis.Promise<void>;
        export function removePasswords(options: RemovalOptions, callback: (() => void)): void;

        /**
         * Clears plugins' data.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browsing_data.json
         * @platform desktop
         */
        export function removePluginData(options: RemovalOptions): globalThis.Promise<void>;
        export function removePluginData(options: RemovalOptions, callback: (() => void)): void;

        /**
         * Clears websites' WebSQL data.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browsing_data.json
         * @platform desktop
         */
        export function removeWebSQL(options: RemovalOptions): globalThis.Promise<void>;
        export function removeWebSQL(options: RemovalOptions, callback: (() => void)): void;

        /**
         * Reports which types of data are currently selected in the 'Clear browsing data' settings UI.  Note: some of the data types included in this API are not available in the settings UI, and some UI settings control more than one data type listed here.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/browsing_data.json
         * @platform desktop
         */
        export function settings(): globalThis.Promise<{
dataRemovalPermitted: DataTypeSet;
dataToRemove: DataTypeSet;
options: RemovalOptions;
}>;
        export function settings(callback: ((result: {
dataRemovalPermitted: DataTypeSet;
dataToRemove: DataTypeSet;
options: RemovalOptions;
}) => void)): void;

    }

    export namespace captivePortal {
        export const canonicalURL: browser.types.Setting;
        /**
         * This notification will be emitted when the captive portal service has determined that we can connect to the internet. The service will pass either `captive` if there is an unlocked captive portal present, or `clear` if no captive portal was detected.
         */
        export const onConnectivityAvailable: WebExtensionEvent<(status: "captive" | "clear") => void>;

        /**
         * Fired when the captive portal state changes.
         */
        export const onStateChanged: WebExtensionEvent<(details: {
state: "unknown" | "not_captive" | "unlocked_portal" | "locked_portal";
}) => void>;

        /**
         * Returns the time difference between NOW and the last time a request was completed in milliseconds.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/captive_portal.json
         * @platform desktop
         */
        export function getLastChecked(): globalThis.Promise<void>;

        /**
         * Returns the current portal state, one of `unknown`, `not_captive`, `unlocked_portal`, `locked_portal`.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/captive_portal.json
         * @platform desktop
         */
        export function getState(): globalThis.Promise<void>;

    }

    export namespace clipboard {
        /**
         * Copy an image to the clipboard. The image is re-encoded before it is written to the clipboard. If the image is invalid, the clipboard is not modified.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/clipboard.json
         * @platform desktop
         */
        export function setImageData(imageData: ArrayBuffer, imageType: "jpeg" | "png"): globalThis.Promise<void>;

    }

    export namespace commands {
        export interface Command {
            /**
             * The Extension Command description
             */
            description?: string;
            /**
             * The name of the Extension Command
             */
            name?: string;
            /**
             * The shortcut active for this command, or blank if not active.
             */
            shortcut?: string;
        }

        /**
         * Fired when a registered command's shortcut is changed.
         */
        export const onChanged: WebExtensionEvent<(changeInfo: {
name: string;
newShortcut: string;
oldShortcut: string;
}) => void>;

        /**
         * Fired when a registered command is activated using a keyboard shortcut.
         */
        export const onCommand: WebExtensionEvent<(command: string, tab: browser.tabs.Tab) => void>;

        /**
         * Returns all the registered extension commands for this extension and their shortcut (if active).
         *
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
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/commands.json
         * @platform desktop
         */
        export function reset(name: string): globalThis.Promise<void>;

        /**
         * Update the details of an already defined command.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/commands.json
         * @platform desktop
         */
        export function update(detail: {
description?: string;
name: string;
shortcut?: string;
}): globalThis.Promise<void>;

    }

    export namespace contentScripts {
        /**
         * An object that represents a content script registered programmatically
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/content_scripts.json
         */
        export interface RegisteredContentScript {
            /**
             * Unregister a content script registered programmatically
             *
             * @platform desktop
             */
            unregister(): globalThis.Promise<void>;
        }

        /**
         * Details of a content script registered programmatically
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/content_scripts.json
         */
        export interface RegisteredContentScriptOptions {
            /**
             * If allFrames is true, implies that the JavaScript or CSS should be injected into all frames of current page. By default, it's false and is only injected into the top frame.
             */
            allFrames?: boolean;
            /**
             * limit the set of matched tabs to those that belong to the given cookie store id
             */
            cookieStoreId?: string[] | string;
            /**
             * The list of CSS files to inject
             */
            css?: browser.extensionTypes.ExtensionFileOrCode[];
            /**
             * The css origin of the stylesheet to inject. Defaults to "author".
             */
            cssOrigin?: browser.extensionTypes.CSSOrigin;
            excludeGlobs?: string[];
            excludeMatches?: browser.manifest.MatchPattern[];
            includeGlobs?: string[];
            /**
             * The list of JS files to inject
             */
            js?: browser.extensionTypes.ExtensionFileOrCode[];
            /**
             * If matchAboutBlank is true, then the code is also injected in about:blank and about:srcdoc frames if your extension has access to its parent document. Ignored if matchOriginAsFallback is specified. By default it is false.
             */
            matchAboutBlank?: boolean;
            /**
             * If matchOriginAsFallback is true, then the code is also injected in about:, data:, blob: when their origin matches the pattern in 'matches', even if the actual document origin is opaque (due to the use of CSP sandbox or iframe sandbox). Match patterns in 'matches' must specify a wildcard path glob. By default it is false.
             */
            matchOriginAsFallback?: boolean;
            matches: browser.manifest.MatchPattern[];
            /**
             * The soonest that the JavaScript or CSS will be injected into the tab. Defaults to "document_idle".
             */
            runAt?: browser.extensionTypes.RunAt;
            /**
             * The JavaScript world for a script to execute within. Defaults to "ISOLATED".
             */
            world?: browser.extensionTypes.ExecutionWorld;
        }

        /**
         * Register a content script programmatically
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/content_scripts.json
         * @platform desktop
         */
        export function register(contentScriptOptions: RegisteredContentScriptOptions): globalThis.Promise<void>;

    }

    export namespace contextMenus {
        /**
         * The different contexts a menu can appear in. Specifying 'all' is equivalent to the combination of all other contexts except for 'tab' and 'tools_menu'.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         */
        export type ContextType = "all" | "page" | "frame" | "selection" | "link" | "editable" | "password" | "image" | "video" | "audio" | "launcher" | "bookmark" | "page_action" | "tab" | "tools_menu" | "browser_action" | "action";

        /**
         * The type of menu item.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         */
        export type ItemType = "normal" | "checkbox" | "radio" | "separator";

        /**
         * Information sent when a context menu item is clicked.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         */
        export interface OnClickData {
            /**
             * The id of the bookmark where the context menu was clicked, if it was on a bookmark.
             */
            bookmarkId?: string;
            /**
             * An integer value of button by which menu item was clicked.
             */
            button?: number;
            /**
             * A flag indicating the state of a checkbox or radio item after it is clicked.
             */
            checked?: boolean;
            /**
             * A flag indicating whether the element is editable (text input, textarea, etc.).
             */
            editable: boolean;
            /**
             * The id of the frame of the element where the context menu was clicked.
             */
            frameId?: number;
            /**
             * The URL of the frame of the element where the context menu was clicked, if it was in a frame.
             */
            frameUrl?: string;
            /**
             * If the element is a link, the text of that link.
             */
            linkText?: string;
            /**
             * If the element is a link, the URL it points to.
             */
            linkUrl?: string;
            /**
             * One of 'image', 'video', or 'audio' if the context menu was activated on one of these types of elements.
             */
            mediaType?: string;
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
            pageUrl?: string;
            /**
             * The parent ID, if any, for the item clicked.
             */
            parentMenuItemId?: number | string;
            /**
             * The text for the context selection, if any.
             */
            selectionText?: string;
            /**
             * Will be present for elements with a 'src' URL.
             */
            srcUrl?: string;
            /**
             * An identifier of the clicked element, if any. Use menus.getTargetElement in the page to find the corresponding element.
             */
            targetElementId?: number;
            /**
             * The type of view where the menu is clicked. May be unset if the menu is not associated with a view.
             */
            viewType?: browser.extension.ViewType;
            /**
             * A flag indicating the state of a checkbox or radio item before it was clicked.
             */
            wasChecked?: boolean;
        }

        export const ACTION_MENU_TOP_LEVEL_LIMIT: number;
        /**
         * Fired when a context menu item is clicked.
         */
        export const onClicked: WebExtensionEvent<(info: OnClickData, tab: browser.tabs.Tab) => void>;

        /**
         * Fired when a menu is hidden. This event is only fired if onShown has fired before.
         */
        export const onHidden: WebExtensionEvent<() => void>;

        /**
         * Fired when a menu is shown. The extension can add, modify or remove menu items and call menus.refresh() to update the menu.
         */
        export const onShown: WebExtensionEvent<(info: {
contexts: ContextType[];
editable: boolean;
frameUrl?: string;
linkText?: string;
linkUrl?: string;
mediaType?: string;
menuIds: (number | string)[];
pageUrl?: string;
selectionText?: string;
srcUrl?: string;
targetElementId?: number;
viewType?: browser.extension.ViewType;
}, tab: browser.tabs.Tab) => void>;

        /**
         * Creates a new context menu item. Note that if an error occurs during creation, you may not find out until the creation callback fires (the details will be in browser.runtime.lastError).
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         * @platform desktop
         */
        export function create(createProperties: {
checked?: boolean;
command?: (string & {}) | "_execute_browser_action" | "_execute_page_action" | "_execute_sidebar_action" | "_execute_action" | "_execute_page_action" | "_execute_sidebar_action";
contexts?: ContextType[];
documentUrlPatterns?: string[];
enabled?: boolean;
icons?: Record<string, unknown>;
id?: string;
onclick?: ((info: OnClickData, tab: browser.tabs.Tab) => void);
parentId?: number | string;
targetUrlPatterns?: string[];
title?: string;
type?: ItemType;
viewTypes?: browser.extension.ViewType[];
visible?: boolean;
}, callback?: (() => void)): number | string;

        /**
         * Retrieve the element that was associated with a recent contextmenu event.
         *
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
        export function overrideContext(contextOptions: {
bookmarkId?: string;
context?: "bookmark" | "tab";
showDefaults?: boolean;
tabId?: number;
}): void;

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
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         * @platform desktop
         */
        export function remove(menuItemId: number | string): globalThis.Promise<void>;
        export function remove(menuItemId: number | string, callback: (() => void)): void;

        /**
         * Removes all context menu items added by this extension.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         * @platform desktop
         */
        export function removeAll(): globalThis.Promise<void>;
        export function removeAll(callback: (() => void)): void;

        /**
         * Updates a previously created context menu item.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         * @platform desktop
         */
        export function update(id: number | string, updateProperties: {
checked?: boolean;
contexts?: ContextType[];
documentUrlPatterns?: string[];
enabled?: boolean;
icons?: Record<string, unknown>;
onclick?: ((info: OnClickData, tab: browser.tabs.Tab) => void);
parentId?: number | string;
targetUrlPatterns?: string[];
title?: string;
type?: ItemType;
viewTypes?: browser.extension.ViewType[];
visible?: boolean;
}): globalThis.Promise<void>;
        export function update(id: number | string, updateProperties: {
checked?: boolean;
contexts?: ContextType[];
documentUrlPatterns?: string[];
enabled?: boolean;
icons?: Record<string, unknown>;
onclick?: ((info: OnClickData, tab: browser.tabs.Tab) => void);
parentId?: number | string;
targetUrlPatterns?: string[];
title?: string;
type?: ItemType;
viewTypes?: browser.extension.ViewType[];
visible?: boolean;
}, callback: (() => void)): void;

    }

    export namespace contextualIdentities {
        /**
         * Represents information about a contextual identity.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/contextual_identities.json
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
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/contextual_identities.json
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
         */
        export const onCreated: WebExtensionEvent<(changeInfo: {
contextualIdentity: ContextualIdentity;
}) => void>;

        /**
         * Fired when a container is removed.
         */
        export const onRemoved: WebExtensionEvent<(changeInfo: {
contextualIdentity: ContextualIdentity;
}) => void>;

        /**
         * Fired when a site-to-container association is added, changed, or removed.
         */
        export const onSiteAssociationChanged: WebExtensionEvent<(changeInfo: {
cookieStoreId?: string;
site: string;
}) => void>;

        /**
         * Fired when a container is updated.
         */
        export const onUpdated: WebExtensionEvent<(changeInfo: {
contextualIdentity: ContextualIdentity;
}) => void>;

        /**
         * Creates a contextual identity with the given data.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/contextual_identities.json
         * @platform desktop
         */
        export function create(details: {
color: string;
icon: string;
name: string;
}): globalThis.Promise<void>;

        /**
         * Retrieves information about a single contextual identity.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/contextual_identities.json
         * @platform desktop
         */
        export function get(cookieStoreId: string): globalThis.Promise<void>;

        /**
         * Retrieves the association of a site, or null if the site is not associated with any container.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/contextual_identities.json
         * @platform desktop
         */
        export function getSiteAssociation(details: {
site: string;
}): globalThis.Promise<SiteAssociation>;
        export function getSiteAssociation(details: {
site: string;
}, callback: ((association: SiteAssociation) => void)): void;

        /**
         * Retrieves the list of colors supported by contextual identities.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/contextual_identities.json
         * @platform desktop
         */
        export function getSupportedColors(): globalThis.Promise<{
color: string;
colorCode: string;
}[]>;
        export function getSupportedColors(callback: ((colors: {
color: string;
colorCode: string;
}[]) => void)): void;

        /**
         * Retrieves the list of icons supported by contextual identities.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/contextual_identities.json
         * @platform desktop
         */
        export function getSupportedIcons(): globalThis.Promise<{
icon: string;
iconUrl: string;
}[]>;
        export function getSupportedIcons(callback: ((icons: {
icon: string;
iconUrl: string;
}[]) => void)): void;

        /**
         * Reorder one or more contextual identities by their cookieStoreIDs to a given position.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/contextual_identities.json
         * @platform desktop
         */
        export function move(cookieStoreIds: string | string[], position: number): globalThis.Promise<void>;

        /**
         * Retrieves all contextual identities
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/contextual_identities.json
         * @platform desktop
         */
        export function query(details: {
name?: string;
}): globalThis.Promise<void>;

        /**
         * Retrieves the list of site-to-container associations.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/contextual_identities.json
         * @platform desktop
         */
        export function querySiteAssociations(details: {
cookieStoreId?: string;
}): globalThis.Promise<SiteAssociation[]>;
        export function querySiteAssociations(details: {
cookieStoreId?: string;
}, callback: ((associations: SiteAssociation[]) => void)): void;

        /**
         * Deletes a contextual identity by its cookie Store ID.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/contextual_identities.json
         * @platform desktop
         */
        export function remove(cookieStoreId: string): globalThis.Promise<void>;

        /**
         * Removes the container association for a site.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/contextual_identities.json
         * @platform desktop
         */
        export function removeSiteAssociation(details: {
site: string;
}): globalThis.Promise<void>;

        /**
         * Associates a site with a container. Top-level navigations to that site will load in the given container.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/contextual_identities.json
         * @platform desktop
         */
        export function setSiteAssociation(details: {
cookieStoreId: string;
site: string;
}): globalThis.Promise<void>;

        /**
         * Updates a contextual identity with the given data.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/contextual_identities.json
         * @platform desktop
         */
        export function update(cookieStoreId: string, details: {
color?: string;
icon?: string;
name?: string;
}): globalThis.Promise<void>;

    }

    export namespace cookies {
        /**
         * Represents information about an HTTP cookie.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/cookies.json
         */
        export interface Cookie {
            /**
             * The domain of the cookie (e.g. "www.google.com", "example.com").
             */
            domain: string;
            /**
             * The expiration date of the cookie as the number of seconds since the UNIX epoch. Not provided for session cookies.
             */
            expirationDate?: number;
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
            partitionKey?: PartitionKey;
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
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/cookies.json
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
         * The underlying reason behind the cookie's change. If a cookie was inserted, or removed via an explicit call to browser.cookies.remove, "cause" will be "explicit". If a cookie was automatically removed due to expiry, "cause" will be "expired". If a cookie was removed due to being overwritten with an already-expired expiration date, "cause" will be set to "expired_overwrite".  If a cookie was automatically removed due to garbage collection, "cause" will be "evicted".  If a cookie was automatically removed due to a "set" call that overwrote it, "cause" will be "overwrite". Plan your response accordingly.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/cookies.json
         */
        export type OnChangedCause = "evicted" | "expired" | "explicit" | "expired_overwrite" | "overwrite";

        /**
         * The description of the storage partition of a cookie. This object may be omitted (null) if a cookie is not partitioned.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/cookies.json
         */
        export interface PartitionKey {
            /**
             * Whether or not the cookie is in a third-party context, respecting ancestor chains.
             */
            hasCrossSiteAncestor?: boolean;
            /**
             * The first-party URL of the cookie, if the cookie is in storage partitioned by the top-level site.
             */
            topLevelSite?: string;
        }

        /**
         * A cookie's 'SameSite' state (https://tools.ietf.org/html/draft-west-first-party-cookies). 'no_restriction' corresponds to a cookie set without a 'SameSite' attribute, 'lax' to 'SameSite=Lax', and 'strict' to 'SameSite=Strict'.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/cookies.json
         */
        export type SameSiteStatus = "unspecified" | "no_restriction" | "lax" | "strict";

        /**
         * Fired when a cookie is set or removed. As a special case, note that updating a cookie's properties is implemented as a two step process: the cookie to be updated is first removed entirely, generating a notification with "cause" of "overwrite" .  Afterwards, a new cookie is written with the updated values, generating a second notification with "cause" "explicit".
         */
        export const onChanged: WebExtensionEvent<(changeInfo: {
cause: OnChangedCause;
cookie: Cookie;
removed: boolean;
}) => void>;

        /**
         * Retrieves information about a single cookie. If more than one cookie of the same name exists for the given URL, the one with the longest path will be returned. For cookies with the same path length, the cookie with the earliest creation time will be returned.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/cookies.json
         * @platform desktop
         */
        export function get(details: {
firstPartyDomain?: string;
name: string;
partitionKey?: PartitionKey;
storeId?: string;
url: string;
}): globalThis.Promise<Cookie>;
        export function get(details: {
firstPartyDomain?: string;
name: string;
partitionKey?: PartitionKey;
storeId?: string;
url: string;
}, callback: ((cookie: Cookie) => void)): void;

        /**
         * Retrieves all cookies from a single cookie store that match the given information.  The cookies returned will be sorted, with those with the longest path first.  If multiple cookies have the same path length, those with the earliest creation time will be first.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/cookies.json
         * @platform desktop
         */
        export function getAll(details: {
domain?: string;
firstPartyDomain?: string;
name?: string;
partitionKey?: PartitionKey;
path?: string;
secure?: boolean;
session?: boolean;
storeId?: string;
url?: string;
}): globalThis.Promise<Cookie[]>;
        export function getAll(details: {
domain?: string;
firstPartyDomain?: string;
name?: string;
partitionKey?: PartitionKey;
path?: string;
secure?: boolean;
session?: boolean;
storeId?: string;
url?: string;
}, callback: ((cookies: Cookie[]) => void)): void;

        /**
         * Lists all existing cookie stores.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/cookies.json
         * @platform desktop
         */
        export function getAllCookieStores(): globalThis.Promise<CookieStore[]>;
        export function getAllCookieStores(callback: ((cookieStores: CookieStore[]) => void)): void;

        /**
         * Deletes a cookie by name.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/cookies.json
         * @platform desktop
         */
        export function remove(details: {
firstPartyDomain?: string;
name: string;
partitionKey?: PartitionKey;
storeId?: string;
url: string;
}): globalThis.Promise<{
firstPartyDomain: string;
name: string;
partitionKey?: PartitionKey;
storeId: string;
url: string;
}>;
        export function remove(details: {
firstPartyDomain?: string;
name: string;
partitionKey?: PartitionKey;
storeId?: string;
url: string;
}, callback: ((details: {
firstPartyDomain: string;
name: string;
partitionKey?: PartitionKey;
storeId: string;
url: string;
}) => void)): void;

        /**
         * Sets a cookie with the given cookie data; may overwrite equivalent cookies if they exist.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/cookies.json
         * @platform desktop
         */
        export function set(details: {
domain?: string;
expirationDate?: number;
firstPartyDomain?: string;
httpOnly?: boolean;
name?: string;
partitionKey?: PartitionKey;
path?: string;
sameSite?: SameSiteStatus;
secure?: boolean;
storeId?: string;
url: string;
value?: string;
}): globalThis.Promise<Cookie>;
        export function set(details: {
domain?: string;
expirationDate?: number;
firstPartyDomain?: string;
httpOnly?: boolean;
name?: string;
partitionKey?: PartitionKey;
path?: string;
sameSite?: SameSiteStatus;
secure?: boolean;
storeId?: string;
url: string;
value?: string;
}, callback: ((cookie: Cookie) => void)): void;

    }

    export namespace declarativeNetRequest {
        export interface GetRulesFilter {
            /**
             * If specified, only rules with matching IDs are included.
             */
            ruleIds?: number[];
        }

        export interface MatchedRule {
            /**
             * ID of the extension, if this rule belongs to a different extension.
             */
            extensionId?: string;
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
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         */
        export type ResourceType = "main_frame" | "sub_frame" | "stylesheet" | "script" | "image" | "object" | "object_subrequest" | "xmlhttprequest" | "xslt" | "ping" | "beacon" | "xml_dtd" | "font" | "media" | "websocket" | "csp_report" | "imageset" | "web_manifest" | "speculative" | "json" | "other";

        export interface Rule {
            /**
             * The action to take if this rule is matched.
             */
            action: {
redirect?: {
extensionPath?: string;
regexSubstitution?: string;
transform?: URLTransform;
url?: string;
};
requestHeaders?: ({
header: string;
operation: "append" | "set" | "remove";
value?: string;
})[];
responseHeaders?: ({
header: string;
operation: "append" | "set" | "remove";
value?: string;
})[];
type: "block" | "redirect" | "allow" | "upgradeScheme" | "modifyHeaders" | "allowAllRequests";
};
            /**
             * The condition under which this rule is triggered.
             */
            condition: {
domainType?: "firstParty" | "thirdParty";
excludedInitiatorDomains?: string[];
excludedRequestDomains?: string[];
excludedRequestMethods?: string[];
excludedResourceTypes?: ResourceType[];
excludedTabIds?: number[];
initiatorDomains?: string[];
isUrlFilterCaseSensitive?: boolean;
regexFilter?: string;
requestDomains?: string[];
requestMethods?: string[];
resourceTypes?: ResourceType[];
tabIds?: number[];
urlFilter?: string;
};
            /**
             * An id which uniquely identifies a rule. Mandatory and should be >= 1.
             */
            id: number;
            /**
             * Rule priority. Defaults to 1. When specified, should be >= 1
             */
            priority?: number;
        }

        /**
         * Describes the type of the Rule.action.redirect.transform property.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         */
        export interface URLTransform {
            /**
             * The new fragment for the request. Should be either empty, in which case the existing fragment is cleared; or should begin with '#'.
             */
            fragment?: string;
            /**
             * The new host name for the request.
             */
            host?: string;
            /**
             * The new password for the request.
             */
            password?: string;
            /**
             * The new path for the request. If empty, the existing path is cleared.
             */
            path?: string;
            /**
             * The new port for the request. If empty, the existing port is cleared.
             */
            port?: string;
            /**
             * The new query for the request. Should be either empty, in which case the existing query is cleared; or should begin with '?'. Cannot be specified if 'queryTransform' is specified.
             */
            query?: string;
            /**
             * Add, remove or replace query key-value pairs. Cannot be specified if 'query' is specified.
             */
            queryTransform?: {
addOrReplaceParams?: {
key: string;
replaceOnly?: boolean;
value: string;
}[];
removeParams?: string[];
};
            /**
             * The new scheme for the request.
             */
            scheme?: "http" | "https" | "moz-extension";
            /**
             * The new username for the request.
             */
            username?: string;
        }

        /**
         * Describes the reason why a given regular expression isn't supported.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         */
        export type UnsupportedRegexReason = "syntaxError" | "memoryLimitExceeded";

        export const DYNAMIC_RULESET_ID: string;
        export const GUARANTEED_MINIMUM_STATIC_RULES: number;
        export const MAX_NUMBER_OF_DISABLED_STATIC_RULES: number;
        export const MAX_NUMBER_OF_DYNAMIC_AND_SESSION_RULES: number;
        export const MAX_NUMBER_OF_DYNAMIC_RULES: number;
        export const MAX_NUMBER_OF_ENABLED_STATIC_RULESETS: number;
        export const MAX_NUMBER_OF_REGEX_RULES: number;
        export const MAX_NUMBER_OF_SESSION_RULES: number;
        export const MAX_NUMBER_OF_STATIC_RULESETS: number;
        export const SESSION_RULESET_ID: string;
        /**
         * Returns the remaining number of static rules an extension can enable
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         * @platform desktop
         */
        export function getAvailableStaticRuleCount(): globalThis.Promise<number>;
        export function getAvailableStaticRuleCount(callback: ((count: number) => void)): void;

        /**
         * Returns the list of individual disabled static rules from a given static ruleset id.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         * @platform desktop
         */
        export function getDisabledRuleIds(options: {
rulesetId: string;
}): globalThis.Promise<number[]>;
        export function getDisabledRuleIds(options: {
rulesetId: string;
}, callback: ((disabledRuleIds: number[]) => void)): void;

        /**
         * Returns the current set of dynamic rules for the extension.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         * @platform desktop
         */
        export function getDynamicRules(): globalThis.Promise<Rule[]>;
        export function getDynamicRules(callback: ((dynamicRules: Rule[]) => void)): void;
        export function getDynamicRules(filter: GetRulesFilter): globalThis.Promise<Rule[]>;
        export function getDynamicRules(filter: GetRulesFilter, callback: ((dynamicRules: Rule[]) => void)): void;

        /**
         * Returns the ids for the current set of enabled static rulesets.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         * @platform desktop
         */
        export function getEnabledRulesets(): globalThis.Promise<string[]>;
        export function getEnabledRulesets(callback: ((rulesetIds: string[]) => void)): void;

        /**
         * Returns the current set of session scoped rules for the extension.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         * @platform desktop
         */
        export function getSessionRules(): globalThis.Promise<Rule[]>;
        export function getSessionRules(callback: ((sessionRules: Rule[]) => void)): void;
        export function getSessionRules(filter: GetRulesFilter): globalThis.Promise<Rule[]>;
        export function getSessionRules(filter: GetRulesFilter, callback: ((sessionRules: Rule[]) => void)): void;

        /**
         * Checks if the given regular expression will be supported as a 'regexFilter' rule condition.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         * @platform desktop
         */
        export function isRegexSupported(regexOptions: {
isCaseSensitive?: boolean;
regex: string;
requireCapturing?: boolean;
}): globalThis.Promise<{
isSupported: boolean;
reason?: UnsupportedRegexReason;
}>;
        export function isRegexSupported(regexOptions: {
isCaseSensitive?: boolean;
regex: string;
requireCapturing?: boolean;
}, callback: ((result: {
isSupported: boolean;
reason?: UnsupportedRegexReason;
}) => void)): void;

        /**
         * Checks if any of the extension's declarativeNetRequest rules would match a hypothetical request.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         * @permission declarativeNetRequestFeedback
         * @platform desktop
         */
        export function testMatchOutcome(request: {
initiator?: string;
method?: string;
tabId?: number;
type: ResourceType;
url: string;
}, options?: {
includeOtherExtensions?: boolean;
}): globalThis.Promise<{
matchedRules: MatchedRule[];
}>;
        export function testMatchOutcome(request: {
initiator?: string;
method?: string;
tabId?: number;
type: ResourceType;
url: string;
}, options: {
includeOtherExtensions?: boolean;
}, callback: ((result: {
matchedRules: MatchedRule[];
}) => void)): void;
        export function testMatchOutcome(request: {
initiator?: string;
method?: string;
tabId?: number;
type: ResourceType;
url: string;
}, callback: ((result: {
matchedRules: MatchedRule[];
}) => void)): void;

        /**
         * Modifies the current set of dynamic rules for the extension. The rules with IDs listed in options.removeRuleIds are first removed, and then the rules given in options.addRules are added. These rules are persisted across browser sessions and extension updates.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         * @platform desktop
         */
        export function updateDynamicRules(options: {
addRules?: Rule[];
removeRuleIds?: number[];
}): globalThis.Promise<void>;
        export function updateDynamicRules(options: {
addRules?: Rule[];
removeRuleIds?: number[];
}, callback: (() => void)): void;

        /**
         * Modifies the static rulesets enabled/disabled state.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         * @platform desktop
         */
        export function updateEnabledRulesets(updateRulesetOptions: {
disableRulesetIds?: string[];
enableRulesetIds?: string[];
}): globalThis.Promise<void>;
        export function updateEnabledRulesets(updateRulesetOptions: {
disableRulesetIds?: string[];
enableRulesetIds?: string[];
}, callback: (() => void)): void;

        /**
         * Modifies the current set of session scoped rules for the extension. The rules with IDs listed in options.removeRuleIds are first removed, and then the rules given in options.addRules are added. These rules are not persisted across sessions and are backed in memory.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         * @platform desktop
         */
        export function updateSessionRules(options: {
addRules?: Rule[];
removeRuleIds?: number[];
}): globalThis.Promise<void>;
        export function updateSessionRules(options: {
addRules?: Rule[];
removeRuleIds?: number[];
}, callback: (() => void)): void;

        /**
         * Modified individual static rules enabled/disabled state. Changes to rules belonging to a disabled ruleset will take effect when the ruleset becomes enabled.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/declarative_net_request.json
         * @platform desktop
         */
        export function updateStaticRules(options: {
disableRuleIds?: number[];
enableRuleIds?: number[];
rulesetId: string;
}): globalThis.Promise<void>;
        export function updateStaticRules(options: {
disableRuleIds?: number[];
enableRuleIds?: number[];
rulesetId: string;
}, callback: (() => void)): void;

    }

    export namespace devtools {
        export namespace inspectedWindow {
            /**
             * A resource within the inspected page, such as a document, a script, or an image.
             * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/devtools_inspected_window.json
             */
            export interface Resource {
                /**
                 * The URL of the resource.
                 */
                url: string;
                /**
                 * Gets the content of the resource.
                 *
                 * @platform desktop
                 */
                getContent(): globalThis.Promise<string>;
                getContent(callback: ((content: string, encoding: string) => void)): void;
                /**
                 * Sets the content of the resource.
                 *
                 * @platform desktop
                 */
                setContent(content: string, commit: boolean): globalThis.Promise<Record<string, unknown>>;
                setContent(content: string, commit: boolean, callback: ((error: Record<string, unknown>) => void)): void;
            }

            export const tabId: number;
            /**
             * Fired when a new resource is added to the inspected page.
             */
            export const onResourceAdded: WebExtensionEvent<(resource: browser.devtools.inspectedWindow.Resource) => void>;

            /**
             * Fired when a new revision of the resource is committed (e.g. user saves an edited version of the resource in the Developer Tools).
             */
            export const onResourceContentCommitted: WebExtensionEvent<(resource: browser.devtools.inspectedWindow.Resource, content: string) => void>;

            /**
             * Evaluates a JavaScript expression in the context of the main frame of the inspected page. The expression must evaluate to a JSON-compliant object, otherwise an exception is thrown. The eval function can report either a DevTools-side error or a JavaScript exception that occurs during evaluation. In either case, the result parameter of the callback is undefined. In the case of a DevTools-side error, the isException parameter is non-null and has isError set to true and code set to an error code. In the case of a JavaScript error, isException is set to true and value is set to the string value of thrown object.
             *
             * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/devtools_inspected_window.json
             * @platform desktop
             */
            function _eval(expression: string, options?: {
contextSecurityOrigin?: string;
frameURL?: string;
useContentScriptContext?: boolean;
}): globalThis.Promise<any>;
            function _eval(expression: string, options: {
contextSecurityOrigin?: string;
frameURL?: string;
useContentScriptContext?: boolean;
}, callback: ((result: any, exceptionInfo: {
code: string;
description: string;
details: any[];
isError: boolean;
isException: boolean;
value: string;
}) => void)): void;
            function _eval(expression: string, callback: ((result: any, exceptionInfo: {
code: string;
description: string;
details: any[];
isError: boolean;
isException: boolean;
value: string;
}) => void)): void;
            export { _eval as eval };

            /**
             * Retrieves the list of resources from the inspected page.
             *
             * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/devtools_inspected_window.json
             * @platform desktop
             */
            export function getResources(): globalThis.Promise<browser.devtools.inspectedWindow.Resource[]>;
            export function getResources(callback: ((resources: browser.devtools.inspectedWindow.Resource[]) => void)): void;

            /**
             * Reloads the inspected page.
             *
             * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/devtools_inspected_window.json
             * @platform desktop
             */
            export function reload(): void;
            export function reload(reloadOptions: {
ignoreCache?: boolean;
injectedScript?: string;
preprocessorScript?: string;
userAgent?: string;
}): void;

        }
        export namespace network {
            /**
             * Represents a network request for a document resource (script, image and so on). See HAR Specification for reference.
             * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/devtools_network.json
             */
            export interface Request {
                /**
                 * Returns content of the response body.
                 *
                 * @platform desktop
                 */
                getContent(): globalThis.Promise<string>;
                getContent(callback: ((content: string, encoding: string) => void)): void;
            }

            /**
             * Fired when the inspected window navigates to a new page.
             */
            export const onNavigated: WebExtensionEvent<(url: string) => void>;

            /**
             * Fired when a network request is finished and all request data are available.
             */
            export const onRequestFinished: WebExtensionEvent<(request: Request) => void>;

            /**
             * Returns HAR log that contains all known network requests.
             *
             * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/devtools_network.json
             * @platform desktop
             */
            export function getHAR(): globalThis.Promise<Record<string, unknown>>;
            export function getHAR(callback: ((harLog: Record<string, unknown>) => void)): void;

        }
        export namespace panels {
            /**
             * A button created by the extension.
             * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/devtools_panels.json
             */
            export interface Button {
                /**
                 * Updates the attributes of the button. If some of the arguments are omitted or null, the corresponding attributes are not updated.
                 *
                 * @platform desktop
                 */
                update(): void;
                update(disabled: boolean): void;
                update(tooltipText: string, disabled?: boolean): void;
                update(iconPath: string, tooltipText?: string, disabled?: boolean): void;
                /**
                 * Fired when the button is clicked.
                 */
                onClicked: WebExtensionEvent<() => void>;
            }

            /**
             * Represents the Elements panel.
             * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/devtools_panels.json
             */
            export interface ElementsPanel {
                /**
                 * Creates a pane within panel's sidebar.
                 *
                 * @platform desktop
                 */
                createSidebarPane(title: string): globalThis.Promise<ExtensionSidebarPane>;
                createSidebarPane(title: string, callback: ((result: ExtensionSidebarPane) => void)): void;
                /**
                 * Fired when an object is selected in the panel.
                 */
                onSelectionChanged: WebExtensionEvent<() => void>;
            }

            /**
             * Represents a panel created by extension.
             * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/devtools_panels.json
             */
            export interface ExtensionPanel {
                /**
                 * Appends a button to the status bar of the panel.
                 *
                 * @platform desktop
                 */
                createStatusBarButton(iconPath: string, tooltipText: string, disabled: boolean): Button;
                /**
                 * Fired when the user switches away from the panel.
                 */
                onHidden: WebExtensionEvent<() => void>;
                /**
                 * Fired upon a search action (start of a new search, search result navigation, or search being canceled).
                 */
                onSearch: WebExtensionEvent<(action: string, queryString: string) => void>;
                /**
                 * Fired when the user switches to the panel.
                 */
                onShown: WebExtensionEvent<(window: Window) => void>;
            }

            /**
             * A sidebar created by the extension.
             * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/devtools_panels.json
             */
            export interface ExtensionSidebarPane {
                /**
                 * Sets an expression that is evaluated within the inspected page. The result is displayed in the sidebar pane.
                 *
                 * @platform desktop
                 */
                setExpression(expression: string, rootTitle?: string): globalThis.Promise<void>;
                setExpression(expression: string, rootTitle: string, callback: ((...args: any[]) => void)): void;
                setExpression(expression: string, callback: ((...args: any[]) => void)): void;
                /**
                 * Sets the height of the sidebar.
                 *
                 * @platform desktop
                 */
                setHeight(height: string): void;
                /**
                 * Sets a JSON-compliant object to be displayed in the sidebar pane.
                 *
                 * @platform desktop
                 */
                setObject(jsonObject: string, rootTitle?: string): globalThis.Promise<void>;
                setObject(jsonObject: string, rootTitle: string, callback: ((...args: any[]) => void)): void;
                setObject(jsonObject: string, callback: ((...args: any[]) => void)): void;
                /**
                 * Sets an HTML page to be displayed in the sidebar pane.
                 *
                 * @platform desktop
                 */
                setPage(path: browser.manifest.ExtensionURL): globalThis.Promise<void>;
                /**
                 * Fired when the sidebar pane becomes hidden as a result of the user switching away from the panel that hosts the sidebar pane.
                 */
                onHidden: WebExtensionEvent<() => void>;
                /**
                 * Fired when the sidebar pane becomes visible as a result of user switching to the panel that hosts it.
                 */
                onShown: WebExtensionEvent<(window: Window) => void>;
            }

            /**
             * Represents the Sources panel.
             * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/devtools_panels.json
             */
            export interface SourcesPanel {
                /**
                 * Creates a pane within panel's sidebar.
                 *
                 * @platform desktop
                 */
                createSidebarPane(title: string, callback?: ((result: ExtensionSidebarPane) => void)): void;
                /**
                 * Fired when an object is selected in the panel.
                 */
                onSelectionChanged: WebExtensionEvent<() => void>;
            }

            export const elements: ElementsPanel;
            export const sources: SourcesPanel;
            export const themeName: string;
            /**
             * Fired when the devtools theme changes.
             */
            export const onThemeChanged: WebExtensionEvent<(themeName: string) => void>;

            /**
             * Creates an extension panel.
             *
             * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/devtools_panels.json
             * @platform desktop
             */
            export function create(title: string, iconPath: "" | browser.manifest.ExtensionURL, pagePath: browser.manifest.ExtensionURL): globalThis.Promise<browser.devtools.panels.ExtensionPanel>;
            export function create(title: string, iconPath: "" | browser.manifest.ExtensionURL, pagePath: browser.manifest.ExtensionURL, callback: ((panel: browser.devtools.panels.ExtensionPanel) => void)): void;

            /**
             * Requests DevTools to open a URL in a Developer Tools panel.
             *
             * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/devtools_panels.json
             * @platform desktop
             */
            export function openResource(url: string, lineNumber: number): globalThis.Promise<void>;
            export function openResource(url: string, lineNumber: number, callback: ((...args: any[]) => void)): void;

            /**
             * Specifies the function to be called when the user clicks a resource link in the Developer Tools window. To unset the handler, either call the method with no parameters or pass null as the parameter.
             *
             * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/devtools_panels.json
             * @platform desktop
             */
            export function setOpenResourceHandler(): globalThis.Promise<browser.devtools.inspectedWindow.Resource>;
            export function setOpenResourceHandler(callback: ((resource: browser.devtools.inspectedWindow.Resource) => void)): void;

        }
    }

    export namespace dns {
        /**
         * An object encapsulating a DNS Record.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/dns.json
         */
        export interface DNSRecord {
            addresses: string[];
            /**
             * The canonical hostname for this record.  this value is empty if the record was not fetched with the 'canonical_name' flag.
             */
            canonicalName?: string;
            /**
             * Record retreived with TRR.
             */
            isTRR: string;
        }

        export type ResolveFlags = ("allow_name_collisions" | "bypass_cache" | "canonical_name" | "disable_ipv4" | "disable_ipv6" | "disable_trr" | "offline" | "priority_low" | "priority_medium" | "speculate")[];

        /**
         * Resolves a hostname to a DNS record.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/dns.json
         * @platform desktop
         */
        export function resolve(hostname: string, flags?: ResolveFlags): globalThis.Promise<void>;

    }

    export namespace downloads {
        export interface BooleanDelta {
            current?: boolean;
            previous?: boolean;
        }

        /**
         * <dl><dt>file</dt><dd>The download's filename is suspicious.</dd><dt>url</dt><dd>The download's URL is known to be malicious.</dd><dt>content</dt><dd>The downloaded file is known to be malicious.</dd><dt>uncommon</dt><dd>The download's URL is not commonly downloaded and could be dangerous.</dd><dt>safe</dt><dd>The download presents no known danger to the user's computer.</dd></dl>These string constants will never change, however the set of DangerTypes may change.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         */
        export type DangerType = "file" | "url" | "content" | "uncommon" | "host" | "unwanted" | "safe" | "accepted";

        export interface DoubleDelta {
            current?: number;
            previous?: number;
        }

        export interface DownloadItem {
            byExtensionId?: string;
            byExtensionName?: string;
            /**
             * Number of bytes received so far from the host, without considering file compression.
             */
            bytesReceived: number;
            canResume: boolean;
            /**
             * The cookie store ID of the contextual identity.
             */
            cookieStoreId?: string;
            /**
             * Indication of whether this download is thought to be safe or known to be suspicious.
             */
            danger: DangerType;
            /**
             * Number of milliseconds between the unix epoch and when this download ended.
             */
            endTime?: string;
            /**
             * Number indicating why a download was interrupted.
             */
            error?: InterruptReason;
            estimatedEndTime?: string;
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
            mime?: string;
            /**
             * True if the download has stopped reading data from the host, but kept the connection open.
             */
            paused: boolean;
            referrer?: string;
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
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         */
        export interface DownloadQuery {
            /**
             * Number of bytes received so far from the host, without considering file compression.
             */
            bytesReceived?: number;
            /**
             * The cookie store ID of the contextual identity.
             */
            cookieStoreId?: string;
            /**
             * Indication of whether this download is thought to be safe or known to be suspicious.
             */
            danger?: DangerType;
            endTime?: string;
            /**
             * Limits results to downloads that ended after the given ms since the epoch.
             */
            endedAfter?: DownloadTime;
            /**
             * Limits results to downloads that ended before the given ms since the epoch.
             */
            endedBefore?: DownloadTime;
            /**
             * Why a download was interrupted.
             */
            error?: InterruptReason;
            exists?: boolean;
            /**
             * Number of bytes in the whole file post-decompression, or -1 if unknown.
             */
            fileSize?: number;
            /**
             * Absolute local path.
             */
            filename?: string;
            /**
             * Limits results to DownloadItems whose filename matches the given regular expression.
             */
            filenameRegex?: string;
            id?: number;
            /**
             * Setting this integer limits the number of results. Otherwise, all matching DownloadItems will be returned.
             */
            limit?: number;
            /**
             * The file's MIME type.
             */
            mime?: string;
            /**
             * Setting elements of this array to DownloadItem properties in order to sort the search results. For example, setting orderBy='startTime' sorts the DownloadItems by their start time in ascending order. To specify descending order, prefix orderBy with a hyphen: '-startTime'.
             */
            orderBy?: string[];
            /**
             * True if the download has stopped reading data from the host, but kept the connection open.
             */
            paused?: boolean;
            /**
             * This array of search terms limits results to DownloadItems whose filename or url contain all of the search terms that do not begin with a dash '-' and none of the search terms that do begin with a dash.
             */
            query?: string[];
            startTime?: string;
            /**
             * Limits results to downloads that started after the given ms since the epoch.
             */
            startedAfter?: DownloadTime;
            /**
             * Limits results to downloads that started before the given ms since the epoch.
             */
            startedBefore?: DownloadTime;
            /**
             * Indicates whether the download is progressing, interrupted, or complete.
             */
            state?: State;
            /**
             * Number of bytes in the whole file, without considering file compression, or -1 if unknown.
             */
            totalBytes?: number;
            /**
             * Limits results to downloads whose totalBytes is greater than the given integer.
             */
            totalBytesGreater?: number;
            /**
             * Limits results to downloads whose totalBytes is less than the given integer.
             */
            totalBytesLess?: number;
            /**
             * Absolute URL.
             */
            url?: string;
            /**
             * Limits results to DownloadItems whose url matches the given regular expression.
             */
            urlRegex?: string;
        }

        /**
         * A time specified as a Date object, a number or string representing milliseconds since the epoch, or an ISO 8601 string
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         */
        export type DownloadTime = browser.extensionTypes.Date | (string & {});

        export type FilenameConflictAction = "uniquify" | "overwrite" | "prompt";

        export type InterruptReason = "FILE_FAILED" | "FILE_ACCESS_DENIED" | "FILE_NO_SPACE" | "FILE_NAME_TOO_LONG" | "FILE_TOO_LARGE" | "FILE_VIRUS_INFECTED" | "FILE_TRANSIENT_ERROR" | "FILE_BLOCKED" | "FILE_SECURITY_CHECK_FAILED" | "FILE_TOO_SHORT" | "NETWORK_FAILED" | "NETWORK_TIMEOUT" | "NETWORK_DISCONNECTED" | "NETWORK_SERVER_DOWN" | "NETWORK_INVALID_REQUEST" | "SERVER_FAILED" | "SERVER_NO_RANGE" | "SERVER_BAD_CONTENT" | "SERVER_UNAUTHORIZED" | "SERVER_CERT_PROBLEM" | "SERVER_FORBIDDEN" | "USER_CANCELED" | "USER_SHUTDOWN" | "CRASH";

        /**
         * <dl><dt>in_progress</dt><dd>The download is currently receiving data from the server.</dd><dt>interrupted</dt><dd>An error broke the connection with the file host.</dd><dt>complete</dt><dd>The download completed successfully.</dd></dl>These string constants will never change, however the set of States may change.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         */
        export type State = "in_progress" | "interrupted" | "complete";

        export interface StringDelta {
            current?: string;
            previous?: string;
        }

        /**
         * When any of a DownloadItem's properties except bytesReceived changes, this event fires with the downloadId and an object containing the properties that changed.
         */
        export const onChanged: WebExtensionEvent<(downloadDelta: {
canResume?: BooleanDelta;
danger?: StringDelta;
endTime?: StringDelta;
error?: StringDelta;
exists?: BooleanDelta;
fileSize?: DoubleDelta;
filename?: StringDelta;
id: number;
mime?: StringDelta;
paused?: BooleanDelta;
startTime?: StringDelta;
state?: StringDelta;
totalBytes?: DoubleDelta;
url?: StringDelta;
}) => void>;

        /**
         * This event fires with the DownloadItem object when a download begins.
         */
        export const onCreated: WebExtensionEvent<(downloadItem: DownloadItem) => void>;

        /**
         * Fires with the downloadId when a download is erased from history.
         */
        export const onErased: WebExtensionEvent<(downloadId: number) => void>;

        /**
         * Prompt the user to either accept or cancel a dangerous download. acceptDanger() does not automatically accept dangerous downloads.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         * @platform desktop
         */
        export function acceptDanger(downloadId: number, callback?: (() => void)): void;

        /**
         * Cancel a download. When callback is run, the download is cancelled, completed, interrupted or doesn't exist anymore.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         * @platform desktop
         */
        export function cancel(downloadId: number): globalThis.Promise<void>;
        export function cancel(downloadId: number, callback: (() => void)): void;

        /**
         * Download a URL. If the URL uses the HTTP[S] protocol, then the request will include all cookies currently set for its hostname. If both filename and saveAs are specified, then the Save As dialog will be displayed, pre-populated with the specified filename. If the download started successfully, callback will be called with the new DownloadItem's downloadId. If there was an error starting the download, then callback will be called with downloadId=undefined and chrome.extension.lastError will contain a descriptive string. The error strings are not guaranteed to remain backwards compatible between releases. You must not parse it.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         * @platform desktop
         */
        export function download(options: {
allowHttpErrors?: boolean;
body?: string;
conflictAction?: FilenameConflictAction;
cookieStoreId?: string;
filename?: string;
headers?: {
name: string;
value: string;
}[];
incognito?: boolean;
method?: "GET" | "POST";
saveAs?: boolean;
url: string;
}): globalThis.Promise<number>;
        export function download(options: {
allowHttpErrors?: boolean;
body?: string;
conflictAction?: FilenameConflictAction;
cookieStoreId?: string;
filename?: string;
headers?: {
name: string;
value: string;
}[];
incognito?: boolean;
method?: "GET" | "POST";
saveAs?: boolean;
url: string;
}, callback: ((downloadId: number) => void)): void;

        /**
         * Initiate dragging the file to another application.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         * @platform desktop
         */
        export function drag(downloadId: number): void;

        /**
         * Erase matching DownloadItems from history
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         * @platform desktop
         */
        export function erase(query: DownloadQuery): globalThis.Promise<number[]>;
        export function erase(query: DownloadQuery, callback: ((erasedIds: number[]) => void)): void;

        /**
         * Retrieve an icon for the specified download. For new downloads, file icons are available after the onCreated event has been received. The image returned by this function while a download is in progress may be different from the image returned after the download is complete. Icon retrieval is done by querying the underlying operating system or toolkit depending on the platform. The icon that is returned will therefore depend on a number of factors including state of the download, platform, registered file types and visual theme. If a file icon cannot be determined, chrome.extension.lastError will contain an error message.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         * @platform desktop
         */
        export function getFileIcon(downloadId: number, options?: {
size?: number;
}): globalThis.Promise<string>;
        export function getFileIcon(downloadId: number, options: {
size?: number;
}, callback: ((iconURL: string) => void)): void;
        export function getFileIcon(downloadId: number, callback: ((iconURL: string) => void)): void;

        /**
         * Open the downloaded file.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         * @permission downloads.open
         * @platform desktop
         */
        export function open(downloadId: number): globalThis.Promise<void>;
        export function open(downloadId: number, callback: (() => void)): void;

        /**
         * Pause the download. If the request was successful the download is in a paused state. Otherwise chrome.extension.lastError contains an error message. The request will fail if the download is not active.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         * @platform desktop
         */
        export function pause(downloadId: number): globalThis.Promise<void>;
        export function pause(downloadId: number, callback: (() => void)): void;

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         * @platform desktop
         */
        export function removeFile(downloadId: number): globalThis.Promise<void>;
        export function removeFile(downloadId: number, callback: (() => void)): void;

        /**
         * Resume a paused download. If the request was successful the download is in progress and unpaused. Otherwise chrome.extension.lastError contains an error message. The request will fail if the download is not active.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         * @platform desktop
         */
        export function resume(downloadId: number): globalThis.Promise<void>;
        export function resume(downloadId: number, callback: (() => void)): void;

        /**
         * Find DownloadItems. Set query to the empty object to get all DownloadItems. To get a specific DownloadItem, set only the id field.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         * @platform desktop
         */
        export function search(query: DownloadQuery): globalThis.Promise<DownloadItem[]>;
        export function search(query: DownloadQuery, callback: ((results: DownloadItem[]) => void)): void;

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         * @platform desktop
         */
        export function setShelfEnabled(enabled: boolean): void;

        /**
         * Show the downloaded file in its folder in a file manager.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         * @platform desktop
         */
        export function show(downloadId: number): globalThis.Promise<boolean>;
        export function show(downloadId: number, callback: ((success: boolean) => void)): void;

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/downloads.json
         * @platform desktop
         */
        export function showDefaultFolder(): void;

    }

    export namespace events {
        /**
         * An object which allows the addition and removal of listeners for a Chrome event.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/events.json
         */
        export interface Event {
            /**
             * Registers an event listener callback to an event.
             *
             * @platform desktop
             */
            addListener(callback: ((...args: any[]) => void)): void;
            /**
             * Registers rules to handle events.
             *
             * @platform desktop
             */
            addRules(eventName: string, webViewInstanceId: number, rules: Rule[], callback?: ((rules: Rule[]) => void)): void;
            /**
             * Returns currently registered rules.
             *
             * @platform desktop
             */
            getRules(eventName: string, webViewInstanceId: number, ruleIdentifiers?: string[], callback?: ((rules: Rule[]) => void)): void;
            /**
             * @platform desktop
             */
            hasListener(callback: ((...args: any[]) => void)): boolean;
            /**
             * @platform desktop
             */
            hasListeners(): boolean;
            /**
             * Deregisters an event listener callback from an event.
             *
             * @platform desktop
             */
            removeListener(callback: ((...args: any[]) => void)): void;
            /**
             * Unregisters currently registered rules.
             *
             * @platform desktop
             */
            removeRules(eventName: string, webViewInstanceId: number, ruleIdentifiers?: string[], callback?: (() => void)): void;
        }

        /**
         * Description of a declarative rule for handling events.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/events.json
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
            id?: string;
            /**
             * Optional priority of this rule. Defaults to 100.
             */
            priority?: number;
            /**
             * Tags can be used to annotate rules and perform operations on sets of rules.
             */
            tags?: string[];
        }

        /**
         * Filters URLs for various criteria. See event filtering. All criteria are case sensitive.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/events.json
         */
        export interface UrlFilter {
            /**
             * Matches if the host name of the URL contains a specified string. To test whether a host name component has a prefix 'foo', use hostContains: '.foo'. This matches 'www.foobar.com' and 'foo.com', because an implicit dot is added at the beginning of the host name. Similarly, hostContains can be used to match against component suffix ('foo.') and to exactly match against components ('.foo.'). Suffix- and exact-matching for the last components need to be done separately using hostSuffix, because no implicit dot is added at the end of the host name.
             */
            hostContains?: string;
            /**
             * Matches if the host name of the URL is equal to a specified string.
             */
            hostEquals?: string;
            /**
             * Matches if the host name of the URL starts with a specified string.
             */
            hostPrefix?: string;
            /**
             * Matches if the host name of the URL ends with a specified string.
             */
            hostSuffix?: string;
            /**
             * Matches if the URL without query segment and fragment identifier matches a specified regular expression. Port numbers are stripped from the URL if they match the default port number. The regular expressions use the RE2 syntax (https://github.com/google/re2/blob/master/doc/syntax.txt).
             */
            originAndPathMatches?: string;
            /**
             * Matches if the path segment of the URL contains a specified string.
             */
            pathContains?: string;
            /**
             * Matches if the path segment of the URL is equal to a specified string.
             */
            pathEquals?: string;
            /**
             * Matches if the path segment of the URL starts with a specified string.
             */
            pathPrefix?: string;
            /**
             * Matches if the path segment of the URL ends with a specified string.
             */
            pathSuffix?: string;
            /**
             * Matches if the port of the URL is contained in any of the specified port lists. For example [80, 443, [1000, 1200]] matches all requests on port 80, 443 and in the range 1000-1200.
             */
            ports?: (number | number[])[];
            /**
             * Matches if the query segment of the URL contains a specified string.
             */
            queryContains?: string;
            /**
             * Matches if the query segment of the URL is equal to a specified string.
             */
            queryEquals?: string;
            /**
             * Matches if the query segment of the URL starts with a specified string.
             */
            queryPrefix?: string;
            /**
             * Matches if the query segment of the URL ends with a specified string.
             */
            querySuffix?: string;
            /**
             * Matches if the scheme of the URL is equal to any of the schemes specified in the array.
             */
            schemes?: string[];
            /**
             * Matches if the URL (without fragment identifier) contains a specified string. Port numbers are stripped from the URL if they match the default port number.
             */
            urlContains?: string;
            /**
             * Matches if the URL (without fragment identifier) is equal to a specified string. Port numbers are stripped from the URL if they match the default port number.
             */
            urlEquals?: string;
            /**
             * Matches if the URL (without fragment identifier) matches a specified regular expression. Port numbers are stripped from the URL if they match the default port number. The regular expressions use the RE2 syntax (https://github.com/google/re2/blob/master/doc/syntax.txt).
             */
            urlMatches?: string;
            /**
             * Matches if the URL (without fragment identifier) starts with a specified string. Port numbers are stripped from the URL if they match the default port number.
             */
            urlPrefix?: string;
            /**
             * Matches if the URL (without fragment identifier) ends with a specified string. Port numbers are stripped from the URL if they match the default port number.
             */
            urlSuffix?: string;
        }

    }

    export namespace experiments {
        export type APIChildScope = "addon_child" | "content_child" | "devtools_child";

        export type APIEvent = "startup";

        export type APIEvents = APIEvent[];

        export type APIParentScope = "addon_parent" | "content_parent" | "devtools_parent";

        export type APIPath = string[];

        export type APIPaths = APIPath[];

        export interface ExperimentAPI {
            child?: {
paths: APIPaths;
scopes: APIChildScope[];
script: ExperimentURL;
};
            parent?: {
events?: APIEvents;
paths?: APIPaths;
scopes?: APIParentScope[];
script: ExperimentURL;
};
            schema: ExperimentURL;
        }

        export type ExperimentURL = string;

    }

    export namespace extension {
        /**
         * The type of extension view.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/extension.json
         */
        export type ViewType = "tab" | "popup" | "sidebar";

        export const inIncognitoContext: boolean;
        export const lastError: {
message: string;
};
        /**
         * Fired when a request is sent from either an extension process or a content script.
         * @deprecated Please use browser.runtime.onMessage.
         */
        export const onRequest: WebExtensionEvent<(request: any, sender: browser.runtime.MessageSender, sendResponse: ((...args: any[]) => void)) => void>;

        /**
         * Fired when a request is sent from another extension.
         * @deprecated Please use browser.runtime.onMessageExternal.
         */
        export const onRequestExternal: WebExtensionEvent<(request: any, sender: browser.runtime.MessageSender, sendResponse: ((...args: any[]) => void)) => void>;

        /**
         * Returns the JavaScript 'window' object for the background page running inside the current extension. Returns null if the extension has no background page.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/extension.json
         * @platform desktop
         */
        export function getBackgroundPage(): Window | null;

        /**
         * Converts a relative path within an extension install directory to a fully-qualified URL.
         *
         * @deprecated Please use browser.runtime.getURL.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/extension.json
         * @platform desktop
         */
        export function getURL(path: string): string;

        /**
         * Returns an array of the JavaScript 'window' objects for each of the pages running inside the current extension.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/extension.json
         * @platform desktop
         */
        export function getViews(): Window[];
        export function getViews(fetchProperties: {
tabId?: number;
type?: ViewType;
windowId?: number;
}): Window[];

        /**
         * Retrieves the state of the extension's access to the 'file://' scheme (as determined by the user-controlled 'Allow access to File URLs' checkbox.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/extension.json
         * @platform desktop
         */
        export function isAllowedFileSchemeAccess(): globalThis.Promise<boolean>;
        export function isAllowedFileSchemeAccess(callback: ((isAllowedAccess: boolean) => void)): void;

        /**
         * Retrieves the state of the extension's access to Incognito-mode (as determined by the user-controlled 'Allowed in Incognito' checkbox.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/extension.json
         * @platform desktop
         */
        export function isAllowedIncognitoAccess(): globalThis.Promise<boolean>;
        export function isAllowedIncognitoAccess(callback: ((isAllowedAccess: boolean) => void)): void;

        /**
         * Sets the value of the ap CGI parameter used in the extension's update URL.  This value is ignored for extensions that are hosted in the browser vendor's store.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/extension.json
         * @platform desktop
         */
        export function setUpdateUrlData(data: string): void;

    }

    export namespace extensionTypes {
        /**
         * The origin of the CSS to inject, this affects the cascading order (priority) of the stylesheet.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/extension_types.json
         */
        export type CSSOrigin = "user" | "author";

        export type Date = number | globalThis.Date | (string & {});

        /**
         * The JavaScript world for a script to execute within. ISOLATED is the default execution environment of content scripts, MAIN is the web page's execution environment.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/extension_types.json
         */
        export type ExecutionWorld = "ISOLATED" | "MAIN";

        export type ExtensionFileOrCode = {
file: browser.manifest.ExtensionURL;
} | {
code: string;
};

        /**
         * Details about the format, quality, area and scale of the capture.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/extension_types.json
         */
        export interface ImageDetails {
            /**
             * The format of the resulting image.  Default is "jpeg".
             */
            format?: ImageFormat;
            /**
             * When format is "jpeg", controls the quality of the resulting image.  This value is ignored for PNG images.  As quality is decreased, the resulting image will have more visual artifacts, and the number of bytes needed to store it will decrease.
             */
            quality?: number;
            /**
             * The area of the document to capture, in CSS pixels, relative to the page.  If omitted, capture the visible viewport.
             */
            rect?: {
height: number;
width: number;
x: number;
y: number;
};
            /**
             * If true, temporarily resets the scroll position of the document to 0. Only takes effect if rect is also specified.
             */
            resetScrollPosition?: boolean;
            /**
             * The scale of the resulting image.  Defaults to devicePixelRatio.
             */
            scale?: number;
        }

        /**
         * The format of an image.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/extension_types.json
         */
        export type ImageFormat = "jpeg" | "png";

        /**
         * Details of the script or CSS to inject. Either the code or the file property must be set, but both may not be set at the same time.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/extension_types.json
         */
        export interface InjectDetails {
            /**
             * If allFrames is true, implies that the JavaScript or CSS should be injected into all frames of current page. By default, it's false and is only injected into the top frame.
             */
            allFrames?: boolean;
            /**
             * JavaScript or CSS code to inject.Warning:Be careful using the code parameter. Incorrect use of it may open your extension to cross site scripting (https://en.wikipedia.org/wiki/Cross-site_scripting) attacks.
             */
            code?: string;
            /**
             * The css origin of the stylesheet to inject. Defaults to "author".
             */
            cssOrigin?: CSSOrigin;
            /**
             * JavaScript or CSS file to inject.
             */
            file?: string;
            /**
             * The ID of the frame to inject the script into. This may not be used in combination with allFrames.
             */
            frameId?: number;
            /**
             * If matchAboutBlank is true, then the code is also injected in about:blank and about:srcdoc frames if your extension has access to its parent document. Code cannot be inserted in top-level about:-frames. By default it is false.
             */
            matchAboutBlank?: boolean;
            /**
             * The soonest that the JavaScript or CSS will be injected into the tab. Defaults to "document_idle".
             */
            runAt?: RunAt;
        }

        /**
         * A plain JSON value
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/extension_types.json
         */
        export type PlainJSONValue = null | number | boolean | PlainJSONValue[] | Record<string, unknown> | (string & {});

        /**
         * The soonest that the JavaScript or CSS will be injected into the tab.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/extension_types.json
         */
        export type RunAt = "document_start" | "document_end" | "document_idle";

    }

    export namespace find {
        /**
         * Search for text in document and store found ranges in array, in document order.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/find.json
         * @platform desktop
         */
        export function find(queryphrase: string, params?: {
caseSensitive?: boolean;
entireWord?: boolean;
includeRangeData?: boolean;
includeRectData?: boolean;
matchDiacritics?: boolean;
tabId?: number;
}): globalThis.Promise<void>;

        /**
         * Highlight a range
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/find.json
         * @platform desktop
         */
        export function highlightResults(): globalThis.Promise<void>;
        export function highlightResults(params: {
noScroll?: boolean;
rangeIndex?: number;
tabId?: number;
}): globalThis.Promise<void>;

        /**
         * Remove all highlighting from previous searches.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/find.json
         * @platform desktop
         */
        export function removeHighlighting(): globalThis.Promise<void>;
        export function removeHighlighting(tabId: number): globalThis.Promise<void>;

    }

    export namespace geckoProfiler {
        export type ProfilerFeature = "java" | "js" | "mainthreadio" | "fileio" | "fileioall" | "nomarkerstacks" | "screenshots" | "seqstyle" | "stackwalk" | "jsallocations" | "nostacksampling" | "nativeallocations" | "ipcmessages" | "audiocallbacktracing" | "notimerresolutionchange" | "cpuallthreads" | "samplingallthreads" | "markersallthreads" | "unregisteredthreads" | "processcpu" | "power" | "responsiveness" | "cpufreq" | "bandwidth" | "memory" | "tracing" | "sandbox" | "flows" | "jssources";

        export type supports = "windowLength";

        /**
         * Fires when the profiler starts/stops running.
         */
        export const onRunning: WebExtensionEvent<(isRunning: boolean) => void>;

        /**
         * Gathers the profile data from the current profiling session, and writes it to disk. The returned promise resolves to a path that locates the created file.
         *
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
        export function getProfile(): globalThis.Promise<void>;

        /**
         * Gathers the profile data from the current profiling session. The returned promise resolves to an array buffer that contains a JSON string.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/geckoProfiler.json
         * @platform desktop
         */
        export function getProfileAsArrayBuffer(): globalThis.Promise<void>;

        /**
         * Gathers the profile data from the current profiling session. The returned promise resolves to an array buffer that contains a gzipped JSON string.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/geckoProfiler.json
         * @platform desktop
         */
        export function getProfileAsGzippedArrayBuffer(): globalThis.Promise<void>;

        /**
         * Gets the debug symbols for a particular library.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/geckoProfiler.json
         * @platform desktop
         */
        export function getSymbols(debugName: string, breakpadId: string): globalThis.Promise<void>;

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
        export function start(settings: {
bufferSize: number;
features: ProfilerFeature[];
interval: number;
threads?: string[];
windowLength?: number;
}): globalThis.Promise<void>;

        /**
         * Stops the profiler and discards any captured profile data.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/geckoProfiler.json
         * @platform desktop
         */
        export function stop(): globalThis.Promise<void>;

    }

    export namespace history {
        /**
         * An object encapsulating one result of a history query.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/history.json
         */
        export interface HistoryItem {
            /**
             * The unique identifier for the item.
             */
            id: string;
            /**
             * When this page was last loaded, represented in milliseconds since the epoch.
             */
            lastVisitTime?: number;
            /**
             * The title of the page when it was last loaded.
             */
            title?: string;
            /**
             * The number of times the user has navigated to this page by typing in the address.
             */
            typedCount?: number;
            /**
             * The URL navigated to by a user.
             */
            url?: string;
            /**
             * The number of times the user has navigated to this page.
             */
            visitCount?: number;
        }

        /**
         * The browser.transition-types[transition type] for this visit from its referrer.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/history.json
         */
        export type TransitionType = "link" | "typed" | "auto_bookmark" | "auto_subframe" | "manual_subframe" | "generated" | "auto_toplevel" | "form_submit" | "reload" | "keyword" | "keyword_generated";

        /**
         * An object encapsulating one visit to a URL.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/history.json
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
             * The browser.transition-types[transition type] for this visit from its referrer.
             */
            transition: TransitionType;
            /**
             * The unique identifier for this visit.
             */
            visitId: string;
            /**
             * When this visit occurred, represented in milliseconds since the epoch.
             */
            visitTime?: number;
        }

        /**
         * Fired when the title of a URL is changed in the browser history.
         */
        export const onTitleChanged: WebExtensionEvent<(changed: {
title: string;
url: string;
}) => void>;

        /**
         * Fired when one or more URLs are removed from the history service.  When all visits have been removed the URL is purged from history.
         */
        export const onVisitRemoved: WebExtensionEvent<(removed: {
allHistory: boolean;
urls: string[];
}) => void>;

        /**
         * Fired when a URL is visited, providing the HistoryItem data for that URL.  This event fires before the page has loaded.
         */
        export const onVisited: WebExtensionEvent<(result: HistoryItem) => void>;

        /**
         * Adds a URL to the history with a default visitTime of the current time and a default browser.transition-types[transition type] of "link".
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/history.json
         * @platform desktop
         */
        export function addUrl(details: {
title?: string;
transition?: TransitionType;
url: string;
visitTime?: browser.extensionTypes.Date;
}): globalThis.Promise<void>;
        export function addUrl(details: {
title?: string;
transition?: TransitionType;
url: string;
visitTime?: browser.extensionTypes.Date;
}, callback: (() => void)): void;

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
        export function deleteRange(range: {
endTime: browser.extensionTypes.Date;
startTime: browser.extensionTypes.Date;
}): globalThis.Promise<void>;
        export function deleteRange(range: {
endTime: browser.extensionTypes.Date;
startTime: browser.extensionTypes.Date;
}, callback: (() => void)): void;

        /**
         * Removes all occurrences of the given URL from the history.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/history.json
         * @platform desktop
         */
        export function deleteUrl(details: {
url: string;
}): globalThis.Promise<void>;
        export function deleteUrl(details: {
url: string;
}, callback: (() => void)): void;

        /**
         * Retrieves information about visits to a URL.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/history.json
         * @platform desktop
         */
        export function getVisits(details: {
url: string;
}): globalThis.Promise<VisitItem[]>;
        export function getVisits(details: {
url: string;
}, callback: ((results: VisitItem[]) => void)): void;

        /**
         * Searches the history for the last visit time of each page matching the query.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/history.json
         * @platform desktop
         */
        export function search(query: {
endTime?: browser.extensionTypes.Date;
maxResults?: number;
startTime?: browser.extensionTypes.Date;
text: string;
}): globalThis.Promise<HistoryItem[]>;
        export function search(query: {
endTime?: browser.extensionTypes.Date;
maxResults?: number;
startTime?: browser.extensionTypes.Date;
text: string;
}, callback: ((results: HistoryItem[]) => void)): void;

    }

    export namespace i18n {
        /**
         * An ISO language code such as en or fr. For a complete list of languages supported by this method, see kLanguageInfoTable. For an unknown language, und will be returned, which means that [percentage] of the text is unknown to CLD
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/i18n.json
         */
        export type LanguageCode = string;

        /**
         * Detects the language of the provided text using CLD.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/i18n.json
         * @platform desktop
         */
        export function detectLanguage(text: string): globalThis.Promise<{
isReliable: boolean;
languages: {
language: LanguageCode;
percentage: number;
}[];
}>;
        export function detectLanguage(text: string, callback: ((result: {
isReliable: boolean;
languages: {
language: LanguageCode;
percentage: number;
}[];
}) => void)): void;

        /**
         * Gets the accept-languages of the browser. This is different from the locale used by the browser; to get the locale, use browser.i18n.getUILanguage.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/i18n.json
         * @platform desktop
         */
        export function getAcceptLanguages(): globalThis.Promise<LanguageCode[]>;
        export function getAcceptLanguages(callback: ((languages: LanguageCode[]) => void)): void;

        /**
         * Gets the localized string for the specified message. If the message is missing, this method returns an empty string (''). If the format of the getMessage() call is wrong — for example, messageName is not a string or the substitutions array has more than 9 elements — this method returns undefined.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/i18n.json
         * @platform desktop
         */
        export function getMessage(messageName: string, substitutions?: any): string;

        /**
         * Gets the preferred locales of the operating system. This is different from the locales set in the browser; to get those, use browser.i18n.getAcceptLanguages.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/i18n.json
         * @platform desktop
         */
        export function getPreferredSystemLanguages(): globalThis.Promise<LanguageCode[]>;
        export function getPreferredSystemLanguages(callback: ((languages: LanguageCode[]) => void)): void;

        /**
         * Gets the browser UI language of the browser. This is different from browser.i18n.getAcceptLanguages which returns the preferred user languages.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/i18n.json
         * @platform desktop
         */
        export function getUILanguage(): string;

    }

    export namespace identity {
        /**
         * An object encapsulating an OAuth account id.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/identity.json
         */
        export interface AccountInfo {
            /**
             * A unique identifier for the account. This ID will not change for the lifetime of the account.
             */
            id: string;
        }

        /**
         * Fired when signin state changes for an account on the user's profile.
         */
        export const onSignInChanged: WebExtensionEvent<(account: AccountInfo, signedIn: boolean) => void>;

        /**
         * Retrieves a list of AccountInfo objects describing the accounts present on the profile.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/identity.json
         * @platform desktop
         */
        export function getAccounts(): globalThis.Promise<AccountInfo[]>;
        export function getAccounts(callback: ((results: AccountInfo[]) => void)): void;

        /**
         * Gets an OAuth2 access token using the client ID and scopes specified in the oauth2 section of manifest.json.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/identity.json
         * @platform desktop
         */
        export function getAuthToken(): globalThis.Promise<AccountInfo[]>;
        export function getAuthToken(callback: ((results: AccountInfo[]) => void)): void;
        export function getAuthToken(details: {
account?: AccountInfo;
interactive?: boolean;
scopes?: string[];
}): globalThis.Promise<AccountInfo[]>;
        export function getAuthToken(details: {
account?: AccountInfo;
interactive?: boolean;
scopes?: string[];
}, callback: ((results: AccountInfo[]) => void)): void;

        /**
         * Retrieves email address and obfuscated gaia id of the user signed into a profile.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/identity.json
         * @platform desktop
         */
        export function getProfileUserInfo(): globalThis.Promise<{
email: string;
id: string;
}>;
        export function getProfileUserInfo(callback: ((userinfo: {
email: string;
id: string;
}) => void)): void;

        /**
         * Generates a redirect URL to be used in |launchWebAuthFlow|.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/identity.json
         * @platform desktop
         */
        export function getRedirectURL(): string;
        export function getRedirectURL(path: string): string;

        /**
         * Starts an auth flow at the specified URL.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/identity.json
         * @platform desktop
         */
        export function launchWebAuthFlow(details: {
interactive?: boolean;
url: browser.manifest.HttpURL;
}): globalThis.Promise<string>;
        export function launchWebAuthFlow(details: {
interactive?: boolean;
url: browser.manifest.HttpURL;
}, callback: (( responseUrl: string) => void)): void;

        /**
         * Removes an OAuth2 access token from the Identity API's token cache.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/identity.json
         * @platform desktop
         */
        export function removeCachedAuthToken(details: {
token: string;
}): globalThis.Promise<{
email: string;
id: string;
}>;
        export function removeCachedAuthToken(details: {
token: string;
}, callback: ((userinfo: {
email: string;
id: string;
}) => void)): void;

    }

    export namespace idle {
        export type IdleState = "active" | "idle";

        /**
         * Fired when the system changes to an active or idle state. The event fires with "idle" if the the user has not generated any input for a specified number of seconds, and "active" when the user generates input on an idle system.
         */
        export const onStateChanged: WebExtensionEvent<(newState: IdleState) => void>;

        /**
         * Returns "idle" if the user has not generated any input for a specified number of seconds, or "active" otherwise.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/idle.json
         * @platform desktop
         */
        export function queryState(detectionIntervalInSeconds: number): globalThis.Promise<IdleState>;
        export function queryState(detectionIntervalInSeconds: number, callback: ((newState: IdleState) => void)): void;

        /**
         * Sets the interval, in seconds, used to determine when the system is in an idle state for onStateChanged events. The default interval is 60 seconds.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/idle.json
         * @platform desktop
         */
        export function setDetectionInterval(intervalInSeconds: number): void;

    }

    export namespace management {
        /**
         * A reason the item is disabled.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/management.json
         */
        export type ExtensionDisabledReason = "unknown" | "permissions_increase";

        /**
         * Information about an installed extension.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/management.json
         */
        export interface ExtensionInfo {
            /**
             * The description of this extension.
             */
            description: string;
            /**
             * A reason the item is disabled.
             */
            disabledReason?: ExtensionDisabledReason;
            /**
             * Whether it is currently enabled or disabled.
             */
            enabled: boolean;
            /**
             * The URL of the homepage of this extension.
             */
            homepageUrl?: string;
            /**
             * Returns a list of host based permissions.
             */
            hostPermissions?: string[];
            /**
             * A list of icon information. Note that this just reflects what was declared in the manifest, and the actual image at that url may be larger or smaller than what was declared, so you might consider using explicit width and height attributes on img tags referencing these images. See the manifest documentation on icons for more details.
             */
            icons?: IconInfo[];
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
            permissions?: string[];
            /**
             * A short version of the name of this extension.
             */
            shortName?: string;
            /**
             * The type of this extension, 'extension' or 'theme'.
             */
            type: ExtensionType;
            /**
             * The update URL of this extension.
             */
            updateUrl?: string;
            /**
             * The version of this extension.
             */
            version: string;
            /**
             * The version name of this extension if the manifest specified one.
             */
            versionName?: string;
        }

        /**
         * How the extension was installed.<dl><dt>development</dt><dd>The extension was loaded unpacked in developer mode,</dd><dt>normal</dt><dd>The extension was installed normally via an .xpi file</dd><dt>sideload</dt><dd>The extension was installed by other software on the machine</dd><dt>admin</dt><dd>The extension was installed by policy</dd><dt>other</dt><dd>The extension was installed by other means.</dd></dl>
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/management.json
         */
        export type ExtensionInstallType = "development" | "normal" | "sideload" | "admin" | "other";

        /**
         * The type of this extension, 'extension' or 'theme'.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/management.json
         */
        export type ExtensionType = "extension" | "theme";

        /**
         * Information about an icon belonging to an extension.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/management.json
         */
        export interface IconInfo {
            /**
             * A number representing the width and height of the icon. Likely values include (but are not limited to) 128, 48, 24, and 16.
             */
            size: number;
            /**
             * The URL for this icon image. To display a grayscale version of the icon (to indicate that an extension is disabled, for example), append ?grayscale=true to the URL.
             */
            url: string;
        }

        /**
         * Fired when an addon has been disabled.
         */
        export const onDisabled: WebExtensionEvent<(info: ExtensionInfo) => void>;

        /**
         * Fired when an addon has been enabled.
         */
        export const onEnabled: WebExtensionEvent<(info: ExtensionInfo) => void>;

        /**
         * Fired when an addon has been installed.
         */
        export const onInstalled: WebExtensionEvent<(info: ExtensionInfo) => void>;

        /**
         * Fired when an addon has been uninstalled.
         */
        export const onUninstalled: WebExtensionEvent<(info: ExtensionInfo) => void>;

        /**
         * Returns information about the installed extension that has the given ID.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/management.json
         * @permission management
         * @platform desktop
         */
        export function get(id: browser.manifest.ExtensionID): globalThis.Promise<ExtensionInfo>;
        export function get(id: browser.manifest.ExtensionID, callback: ((result: ExtensionInfo) => void)): void;

        /**
         * Returns a list of information about installed extensions.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/management.json
         * @permission management
         * @platform desktop
         */
        export function getAll(): globalThis.Promise<ExtensionInfo[]>;
        export function getAll(callback: ((result: ExtensionInfo[]) => void)): void;

        /**
         * Returns information about the calling extension. Note: This function can be used without requesting the 'management' permission in the manifest.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/management.json
         * @platform desktop
         */
        export function getSelf(): globalThis.Promise<ExtensionInfo>;
        export function getSelf(callback: ((result: ExtensionInfo) => void)): void;

        /**
         * Installs and enables a theme extension from the given url.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/management.json
         * @permission management
         * @platform desktop
         */
        export function install(options: {
hash?: string;
url: browser.manifest.HttpURL;
}): globalThis.Promise<{
id: browser.manifest.ExtensionID;
}>;
        export function install(options: {
hash?: string;
url: browser.manifest.HttpURL;
}, callback: ((result: {
id: browser.manifest.ExtensionID;
}) => void)): void;

        /**
         * Enables or disables the given add-on.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/management.json
         * @permission management
         * @platform desktop
         */
        export function setEnabled(id: string, enabled: boolean): globalThis.Promise<void>;
        export function setEnabled(id: string, enabled: boolean, callback: (() => void)): void;

        /**
         * Uninstalls the calling extension. Note: This function can be used without requesting the 'management' permission in the manifest.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/management.json
         * @platform desktop
         */
        export function uninstallSelf(): globalThis.Promise<void>;
        export function uninstallSelf(callback: (() => void)): void;
        export function uninstallSelf(options: {
dialogMessage?: string;
showConfirmDialog?: boolean;
}): globalThis.Promise<void>;
        export function uninstallSelf(options: {
dialogMessage?: string;
showConfirmDialog?: boolean;
}, callback: (() => void)): void;

    }

    export namespace manifest {
        export interface ActionManifest {
            /**
             * Deprecated in Manifest V3.
             */
            readonly browser_style?: boolean;
            /**
             * Defines the location the browserAction will appear by default.  The default location is navbar.
             */
            readonly default_area?: "navbar" | "menupanel" | "tabstrip" | "personaltoolbar";
            readonly default_icon?: IconPath;
            readonly default_popup?: string;
            readonly default_title?: string;
            /**
             * Specifies icons to use for dark and light themes
             */
            readonly theme_icons?: ThemeIcons[];
        }

        export interface BrowserSpecificSettings {
            readonly gecko?: FirefoxSpecificProperties;
            readonly gecko_android?: GeckoAndroidSpecificProperties;
        }

        export type CommonDataCollectionPermission = "authenticationInfo" | "bookmarksInfo" | "browsingActivity" | "financialAndPaymentInfo" | "healthInfo" | "locationInfo" | "personalCommunications" | "personallyIdentifyingInfo" | "searchTerms" | "websiteActivity" | "websiteContent";

        /**
         * Details of the script or CSS to inject. Either the code or the file property must be set, but both may not be set at the same time. Based on InjectDetails, but using underscore rather than camel case naming conventions.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         */
        export interface ContentScript {
            /**
             * If allFrames is true, implies that the JavaScript or CSS should be injected into all frames of current page. By default, it's false and is only injected into the top frame.
             */
            readonly all_frames?: boolean;
            /**
             * The list of CSS files to inject
             */
            readonly css?: ExtensionURL[];
            readonly css_origin?: browser.extensionTypes.CSSOrigin;
            readonly exclude_globs?: string[];
            readonly exclude_matches?: MatchPattern[];
            readonly include_globs?: string[];
            /**
             * The list of JS files to inject
             */
            readonly js?: ExtensionURL[];
            /**
             * If match_about_blank is true, then the code is also injected in about:blank and about:srcdoc frames if your extension has access to its parent document. Ignored if match_origin_as_fallback is specified. By default it is false.
             */
            readonly match_about_blank?: boolean;
            /**
             * If match_origin_as_fallback is true, then the code is also injected in about:, data:, blob: when their origin matches the pattern in 'matches', even if the actual document origin is opaque (due to the use of CSP sandbox or iframe sandbox). Match patterns in 'matches' must specify a wildcard path glob. By default it is false.
             */
            readonly match_origin_as_fallback?: boolean;
            readonly matches: MatchPattern[];
            /**
             * The soonest that the JavaScript or CSS will be injected into the tab. Defaults to "document_idle".
             */
            readonly run_at?: browser.extensionTypes.RunAt;
            /**
             * The JavaScript world for a script to execute within. Defaults to "ISOLATED".
             */
            readonly world?: browser.extensionTypes.ExecutionWorld;
        }

        export type DataCollectionPermission = CommonDataCollectionPermission | "none";

        export interface DeprecatedApplications {
            readonly gecko?: FirefoxSpecificProperties;
            readonly gecko_android?: GeckoAndroidSpecificProperties;
        }

        export type ExtensionFileUrl = string;

        export type ExtensionID = (string & {});

        export type ExtensionURL = string;

        export interface FirefoxSpecificProperties {
            readonly admin_install_only?: boolean;
            readonly data_collection_permissions?: {
has_previous_consent?: boolean;
optional?: OptionalDataCollectionPermission[];
required?: DataCollectionPermission[];
};
            readonly id?: ExtensionID;
            readonly strict_max_version?: string;
            readonly strict_min_version?: string;
            readonly update_url?: string;
        }

        export interface GeckoAndroidSpecificProperties {
            readonly strict_max_version?: string;
            readonly strict_min_version?: string;
        }

        export type HttpURL = string;

        export type IconImageData = Record<string, unknown> | ImageData;

        export type IconPath = Record<string, unknown> | ExtensionFileUrl;

        export interface ImageData {
            [key: string]: unknown;
        }

        export type ImageDataOrExtensionURL = string;

        export type KeyName = string;

        /**
         * Common properties for all manifest.json files
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         */
        export interface ManifestBase {
            /**
             * The applications property is deprecated, please use 'browser_specific_settings'
             */
            readonly applications?: DeprecatedApplications;
            readonly author?: string;
            readonly browser_specific_settings?: BrowserSpecificSettings;
            readonly description?: string;
            readonly developer?: {
name?: string;
url?: string;
};
            readonly homepage_url?: string;
            readonly install_origins?: string[];
            readonly manifest_version: number;
            /**
             * Name must be at least 2, and should be at most 75 characters
             */
            readonly name: string;
            readonly short_name?: string;
            readonly version: string;
        }

        export type MatchPattern = "<all_urls>" | MatchPatternRestricted | MatchPatternUnestricted;

        /**
         * Same as MatchPattern above, but excludes
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         */
        export type MatchPatternRestricted = (string & {});

        /**
         * Mostly unrestricted match patterns for privileged add-ons. This should technically be rejected for unprivileged add-ons, but, reasons. The MatchPattern class will still refuse privileged schemes for those extensions.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         */
        export type MatchPatternUnestricted = (string & {});

        /**
         * Represents a native manifest file
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/native_manifest.json
         */
        export type NativeManifest = {
allowed_extensions: browser.manifest.ExtensionID[];
description: string;
name: string;
path: string;
type: "pkcs11" | "stdio";
} | {
data: Record<string, unknown>;
description: string;
name: browser.manifest.ExtensionID;
type: "storage";
};

        export type OptionalDataCollectionPermission = CommonDataCollectionPermission | "technicalAndInteraction";

        export type OptionalOnlyPermission =  | "trialML" | "userScripts";

        export type OptionalPermission = OptionalPermissionNoPrompt | "clipboardRead" | "clipboardWrite" | "geolocation" | "notifications" | "browserSettings" | "browsingData" | "declarativeNetRequestFeedback" | "downloads" | "downloads.open" | "management" | "proxy" | "privacy" | "nativeMessaging" | "webNavigation" | "bookmarks" | "devtools" | "find" | "history" | "pkcs11" | "sessions" | "tabs" | "tabHide" | "topSites";

        export type OptionalPermissionNoPrompt = "idle" | "cookies" | "publicSuffix" | "scripting" | "webRequest" | "webRequestAuthProvider" | "webRequestBlocking" | "webRequestFilterResponse" | "webRequestFilterResponse.serviceWorkerScript" | "menus.overrideContext" | "search" | "tabGroups" | "activeTab";

        export type OptionalPermissionOrOrigin = OptionalPermission | OptionalOnlyPermission | MatchPattern;

        export type Permission = PermissionNoPrompt | OptionalPermission | "declarativeNetRequest" | (string & {});

        export type PermissionNoPrompt = OptionalPermissionNoPrompt | PermissionPrivileged | "alarms" | "storage" | "unlimitedStorage" | "captivePortal" | "contextualIdentities" | "declarativeNetRequestWithHostAccess" | "dns" | "geckoProfiler" | "identity" | "theme" | "menus" | "contextMenus";

        export type PermissionOrOrigin = Permission | MatchPattern;

        export type PermissionPrivileged = "mozillaAddons" | "activityLog" | "networkStatus" | "telemetry" | "normandyAddonStudy";

        /**
         * Represents a protocol handler definition.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/extension_protocol_handlers.json
         */
        export interface ProtocolHandler {
            /**
             * A user-readable title string for the protocol handler. This will be displayed to the user in interface objects as needed.
             */
            readonly name: string;
            /**
             * The protocol the site wishes to handle, specified as a string. For example, you can register to handle SMS text message links by registering to handle the "sms" scheme.
             */
            readonly protocol: "bitcoin" | "dat" | "dweb" | "ftp" | "geo" | "gopher" | "im" | "ipfs" | "ipns" | "irc" | "ircs" | "magnet" | "mailto" | "matrix" | "mms" | "news" | "nntp" | "sip" | "sms" | "smsto" | "ssb" | "ssh" | "tel" | "urn" | "webcal" | "wtai" | "xmpp" | (string & {});
            /**
             * The URL of the handler, as a string. This string should include "%s" as a placeholder which will be replaced with the escaped URL of the document to be handled. This URL might be a true URL, or it could be a phone number, email address, or so forth.
             */
            readonly uriTemplate: ExtensionURL | HttpURL;
        }

        export type ThemeBackground = ImageDataOrExtensionURL | ThemeCSSGradient;

        /**
         * A CSS gradient that can be used as a theme background, in addition to image assets. The single property name selects the gradient function, and its value holds the gradient's arguments, e.g. `{ "linear-gradient": "to bottom, #FF6BBA, #FFC999" }`.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/theme.json
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

        export type ThemeColor = number[] | (string & {});

        export interface ThemeExperiment {
            readonly colors?: Record<string, unknown>;
            readonly images?: Record<string, unknown>;
            readonly properties?: Record<string, unknown>;
            readonly stylesheet?: ExtensionURL;
        }

        export interface ThemeIcons {
            /**
             * The dark icon to use for light themes
             */
            readonly dark: ExtensionURL;
            /**
             * A light icon to use for dark themes
             */
            readonly light: ExtensionURL;
            /**
             * The size of the icons
             */
            readonly size: number;
        }

        /**
         * Contents of manifest.json for a static theme
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/theme.json
         */
        export interface ThemeManifest {
            /**
             * The applications property is deprecated, please use 'browser_specific_settings'
             */
            readonly applications?: DeprecatedApplications;
            readonly author?: string;
            readonly browser_specific_settings?: BrowserSpecificSettings;
            readonly dark_theme?: ThemeType;
            readonly default_locale?: string;
            readonly description?: string;
            readonly developer?: {
name?: string;
url?: string;
};
            readonly homepage_url?: string;
            readonly icons?: Record<string, unknown>;
            readonly install_origins?: string[];
            readonly manifest_version: number;
            /**
             * Name must be at least 2, and should be at most 75 characters
             */
            readonly name: string;
            readonly short_name?: string;
            readonly theme: ThemeType;
            readonly theme_experiment?: ThemeExperiment;
            readonly version: string;
        }

        export interface ThemeType {
            readonly colors?: {
accentcolor?: ThemeColor;
bookmark_text?: ThemeColor;
button_background_active?: ThemeColor;
button_background_hover?: ThemeColor;
frame?: ThemeColor;
frame_inactive?: ThemeColor;
icons?: ThemeColor;
icons_attention?: ThemeColor;
ntp_background?: ThemeColor;
ntp_card_background?: ThemeColor;
ntp_text?: ThemeColor;
popup?: ThemeColor;
popup_border?: ThemeColor;
popup_highlight?: ThemeColor;
popup_highlight_text?: ThemeColor;
popup_text?: ThemeColor;
sidebar?: ThemeColor;
sidebar_border?: ThemeColor;
sidebar_highlight?: ThemeColor;
sidebar_highlight_text?: ThemeColor;
sidebar_text?: ThemeColor;
tab_background_separator?: ThemeColor;
tab_background_text?: ThemeColor;
tab_line?: ThemeColor;
tab_loading?: ThemeColor;
tab_selected?: ThemeColor;
tab_text?: ThemeColor;
textcolor?: ThemeColor;
toolbar?: ThemeColor;
toolbar_bottom_separator?: ThemeColor;
toolbar_field?: ThemeColor;
toolbar_field_border?: ThemeColor;
toolbar_field_border_focus?: ThemeColor;
toolbar_field_focus?: ThemeColor;
toolbar_field_highlight?: ThemeColor;
toolbar_field_highlight_text?: ThemeColor;
toolbar_field_separator?: ThemeColor;
toolbar_field_text?: ThemeColor;
toolbar_field_text_focus?: ThemeColor;
toolbar_text?: ThemeColor;
toolbar_top_separator?: ThemeColor;
toolbar_vertical_separator?: ThemeColor;
};
            readonly images?: {
additional_backgrounds?: ThemeBackground[];
headerURL?: ImageDataOrExtensionURL;
theme_frame?: ThemeBackground;
};
            readonly properties?: {
additional_backgrounds_alignment?: ("bottom" | "center" | "left" | "right" | "top" | "center bottom" | "center center" | "center top" | "left bottom" | "left center" | "left top" | "right bottom" | "right center" | "right top")[];
additional_backgrounds_size?: string[];
additional_backgrounds_tiling?: ("no-repeat" | "repeat" | "repeat-x" | "repeat-y")[];
backgrounds_area?: "auto" | "window" | "top_toolbars";
color_scheme?: "auto" | "light" | "dark" | "system";
content_color_scheme?: "auto" | "light" | "dark" | "system";
};
        }

        /**
         * @deprecated An unexpected property was found in the WebExtension manifest.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         */
        export type UnrecognizedProperty = any;

        /**
         * Represents a WebExtension dictionary manifest.json file
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         */
        export interface WebExtensionDictionaryManifest {
            /**
             * The applications property is deprecated, please use 'browser_specific_settings'
             */
            readonly applications?: DeprecatedApplications;
            readonly author?: string;
            readonly browser_specific_settings?: BrowserSpecificSettings;
            readonly description?: string;
            readonly developer?: {
name?: string;
url?: string;
};
            readonly dictionaries: Record<string, unknown>;
            readonly homepage_url?: string;
            readonly install_origins?: string[];
            readonly manifest_version: number;
            /**
             * Name must be at least 2, and should be at most 75 characters
             */
            readonly name: string;
            readonly short_name?: string;
            readonly version: string;
        }

        /**
         * Represents a WebExtension language pack manifest.json file
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         */
        export interface WebExtensionLangpackManifest {
            /**
             * The applications property is deprecated, please use 'browser_specific_settings'
             */
            readonly applications?: DeprecatedApplications;
            readonly author?: string;
            readonly browser_specific_settings?: BrowserSpecificSettings;
            readonly description?: string;
            readonly developer?: {
name?: string;
url?: string;
};
            readonly homepage_url?: string;
            readonly install_origins?: string[];
            readonly langpack_id: string;
            readonly languages: Record<string, unknown>;
            readonly manifest_version: number;
            /**
             * Name must be at least 2, and should be at most 75 characters
             */
            readonly name: string;
            readonly short_name?: string;
            readonly sources?: Record<string, unknown>;
            readonly version: string;
        }

        /**
         * Represents a WebExtension manifest.json file
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/manifest.json
         */
        export interface WebExtensionManifest {
            readonly action?: ActionManifest;
            /**
             * The applications property is deprecated, please use 'browser_specific_settings'
             */
            readonly applications?: DeprecatedApplications;
            readonly author?: string;
            readonly background?: {
page?: ExtensionURL;
persistent?: boolean;
preferred_environment?: ("service_worker" | "document")[];
scripts?: ExtensionURL[];
service_worker?: ExtensionURL;
type?: "module" | "classic";
};
            readonly browser_action?: ActionManifest;
            readonly browser_specific_settings?: BrowserSpecificSettings;
            readonly chrome_settings_overrides?: {
homepage?: string;
search_provider?: {
alternate_urls?: string[];
encoding?: string;
favicon_url?: (string & {});
image_url?: string;
image_url_post_params?: string;
instant_url?: string;
instant_url_post_params?: string;
is_default?: boolean;
keyword?: (string & {}) | string[];
name: string;
prepopulated_id?: number;
search_form?: string;
search_url: string;
search_url_get_params?: string;
search_url_post_params?: string;
suggest_url?: string;
suggest_url_get_params?: string;
suggest_url_post_params?: string;
};
};
            readonly chrome_url_overrides?: {
bookmarks?: ExtensionURL;
history?: ExtensionURL;
newtab?: ExtensionURL;
};
            readonly commands?: Record<string, unknown>;
            readonly content_scripts?: ContentScript[];
            readonly content_security_policy?: (string & {}) | {
extension_pages?: string;
sandbox?: string;
};
            readonly declarative_net_request?: {
rule_resources: {
enabled: boolean;
id: string;
path: browser.manifest.ExtensionURL;
}[];
};
            readonly default_locale?: string;
            readonly description?: string;
            readonly developer?: {
name?: string;
url?: string;
};
            readonly devtools_page?: ExtensionURL;
            readonly experiment_apis?: Record<string, unknown>;
            readonly granted_host_permissions?: boolean;
            readonly hidden?: boolean;
            readonly homepage_url?: string;
            readonly host_permissions?: MatchPattern[];
            readonly icons?: Record<string, unknown>;
            /**
             * The 'split' value is not supported.
             */
            readonly incognito?: "not_allowed" | "spanning" | "split";
            readonly install_origins?: string[];
            readonly l10n_resources?: string[];
            readonly manifest_version: number;
            readonly minimum_chrome_version?: string;
            readonly minimum_opera_version?: string;
            /**
             * Name must be at least 2, and should be at most 75 characters
             */
            readonly name: string;
            readonly omnibox?: {
keyword: string;
};
            readonly optional_host_permissions?: MatchPattern[];
            readonly optional_permissions?: OptionalPermissionOrOrigin[];
            /**
             * Alias property for options_ui.page, ignored when options_ui.page is set. When using this property the options page is always opened in a new tab.
             */
            readonly options_page?: ExtensionURL;
            readonly options_ui?: {
browser_style?: boolean;
chrome_style?: boolean;
open_in_tab?: boolean;
page: ExtensionURL;
};
            readonly page_action?: {
browser_style?: boolean;
default_icon?: IconPath;
default_popup?: string;
default_title?: string;
hide_matches?: MatchPatternRestricted[];
pinned?: boolean;
show_matches?: MatchPattern[];
};
            readonly permissions?: PermissionOrOrigin[] | Permission[];
            /**
             * A list of protocol handler definitions.
             */
            readonly protocol_handlers?: ProtocolHandler[];
            readonly sandbox?: {
content_security_policy?: string;
pages: string[];
};
            readonly short_name?: string;
            readonly sidebar_action?: {
browser_style?: boolean;
default_icon?: IconPath;
default_panel: string;
default_title?: string;
open_at_install?: boolean;
};
            readonly theme_experiment?: ThemeExperiment;
            readonly user_scripts?: {
api_script?: browser.manifest.ExtensionURL;
};
            readonly version: string;
            readonly web_accessible_resources?: string[] | ({
extension_ids?: (ExtensionID | "*")[];
matches?: MatchPattern[];
resources: string[];
})[];
        }

    }

    export namespace menus {
        /**
         * The different contexts a menu can appear in. Specifying 'all' is equivalent to the combination of all other contexts except for 'tab' and 'tools_menu'.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         */
        export type ContextType = "all" | "page" | "frame" | "selection" | "link" | "editable" | "password" | "image" | "video" | "audio" | "launcher" | "bookmark" | "page_action" | "tab" | "tools_menu" | "browser_action" | "action";

        /**
         * The type of menu item.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         */
        export type ItemType = "normal" | "checkbox" | "radio" | "separator";

        /**
         * Information sent when a context menu item is clicked.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         */
        export interface OnClickData {
            /**
             * The id of the bookmark where the context menu was clicked, if it was on a bookmark.
             */
            bookmarkId?: string;
            /**
             * An integer value of button by which menu item was clicked.
             */
            button?: number;
            /**
             * A flag indicating the state of a checkbox or radio item after it is clicked.
             */
            checked?: boolean;
            /**
             * A flag indicating whether the element is editable (text input, textarea, etc.).
             */
            editable: boolean;
            /**
             * The id of the frame of the element where the context menu was clicked.
             */
            frameId?: number;
            /**
             * The URL of the frame of the element where the context menu was clicked, if it was in a frame.
             */
            frameUrl?: string;
            /**
             * If the element is a link, the text of that link.
             */
            linkText?: string;
            /**
             * If the element is a link, the URL it points to.
             */
            linkUrl?: string;
            /**
             * One of 'image', 'video', or 'audio' if the context menu was activated on one of these types of elements.
             */
            mediaType?: string;
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
            pageUrl?: string;
            /**
             * The parent ID, if any, for the item clicked.
             */
            parentMenuItemId?: number | string;
            /**
             * The text for the context selection, if any.
             */
            selectionText?: string;
            /**
             * Will be present for elements with a 'src' URL.
             */
            srcUrl?: string;
            /**
             * An identifier of the clicked element, if any. Use menus.getTargetElement in the page to find the corresponding element.
             */
            targetElementId?: number;
            /**
             * The type of view where the menu is clicked. May be unset if the menu is not associated with a view.
             */
            viewType?: browser.extension.ViewType;
            /**
             * A flag indicating the state of a checkbox or radio item before it was clicked.
             */
            wasChecked?: boolean;
        }

        export const ACTION_MENU_TOP_LEVEL_LIMIT: number;
        /**
         * Fired when a context menu item is clicked.
         */
        export const onClicked: WebExtensionEvent<(info: OnClickData, tab: browser.tabs.Tab) => void>;

        /**
         * Fired when a menu is hidden. This event is only fired if onShown has fired before.
         */
        export const onHidden: WebExtensionEvent<() => void>;

        /**
         * Fired when a menu is shown. The extension can add, modify or remove menu items and call menus.refresh() to update the menu.
         */
        export const onShown: WebExtensionEvent<(info: {
contexts: ContextType[];
editable: boolean;
frameUrl?: string;
linkText?: string;
linkUrl?: string;
mediaType?: string;
menuIds: (number | string)[];
pageUrl?: string;
selectionText?: string;
srcUrl?: string;
targetElementId?: number;
viewType?: browser.extension.ViewType;
}, tab: browser.tabs.Tab) => void>;

        /**
         * Creates a new context menu item. Note that if an error occurs during creation, you may not find out until the creation callback fires (the details will be in browser.runtime.lastError).
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         * @platform desktop
         */
        export function create(createProperties: {
checked?: boolean;
command?: (string & {}) | "_execute_browser_action" | "_execute_page_action" | "_execute_sidebar_action" | "_execute_action" | "_execute_page_action" | "_execute_sidebar_action";
contexts?: ContextType[];
documentUrlPatterns?: string[];
enabled?: boolean;
icons?: Record<string, unknown>;
id?: string;
onclick?: ((info: OnClickData, tab: browser.tabs.Tab) => void);
parentId?: number | string;
targetUrlPatterns?: string[];
title?: string;
type?: ItemType;
viewTypes?: browser.extension.ViewType[];
visible?: boolean;
}, callback?: (() => void)): number | string;

        /**
         * Retrieve the element that was associated with a recent contextmenu event.
         *
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
        export function overrideContext(contextOptions: {
bookmarkId?: string;
context?: "bookmark" | "tab";
showDefaults?: boolean;
tabId?: number;
}): void;

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
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         * @platform desktop
         */
        export function remove(menuItemId: number | string): globalThis.Promise<void>;
        export function remove(menuItemId: number | string, callback: (() => void)): void;

        /**
         * Removes all context menu items added by this extension.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         * @platform desktop
         */
        export function removeAll(): globalThis.Promise<void>;
        export function removeAll(callback: (() => void)): void;

        /**
         * Updates a previously created context menu item.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/menus.json
         * @platform desktop
         */
        export function update(id: number | string, updateProperties: {
checked?: boolean;
contexts?: ContextType[];
documentUrlPatterns?: string[];
enabled?: boolean;
icons?: Record<string, unknown>;
onclick?: ((info: OnClickData, tab: browser.tabs.Tab) => void);
parentId?: number | string;
targetUrlPatterns?: string[];
title?: string;
type?: ItemType;
viewTypes?: browser.extension.ViewType[];
visible?: boolean;
}): globalThis.Promise<void>;
        export function update(id: number | string, updateProperties: {
checked?: boolean;
contexts?: ContextType[];
documentUrlPatterns?: string[];
enabled?: boolean;
icons?: Record<string, unknown>;
onclick?: ((info: OnClickData, tab: browser.tabs.Tab) => void);
parentId?: number | string;
targetUrlPatterns?: string[];
title?: string;
type?: ItemType;
viewTypes?: browser.extension.ViewType[];
visible?: boolean;
}, callback: (() => void)): void;

    }

    export namespace networkStatus {
        export interface NetworkLinkInfo {
            /**
             * If known, the network id or name.
             */
            id?: string;
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
         */
        export const onConnectionChanged: WebExtensionEvent<(details: NetworkLinkInfo) => void>;

        /**
         * Returns the browser.NetworkLinkInfo of the current network connection.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/network_status.json
         * @platform desktop
         */
        export function getLinkInfo(): globalThis.Promise<void>;

    }

    export namespace normandyAddonStudy {
        export interface Study {
            /**
             * The state of the study.
             */
            active: boolean;
            /**
             * The ID of the extension installed by the study.
             */
            addonId: string;
            /**
             * The URL of the XPI that was downloaded and installed by the study.
             */
            addonUrl: string;
            /**
             * The version of the extension installed by the study.
             */
            addonVersion: string;
            /**
             * The study branch in which the user is enrolled.
             */
            branch: string;
            /**
             * The record ID for the extension in Normandy server's database.
             */
            extensionApiId: number;
            /**
             * A hash of the extension XPI file.
             */
            extensionHash: string;
            /**
             * The algorithm used to hash the extension XPI file.
             */
            extensionHashAlgorithm: string;
            /**
             * The ID of the recipe for the study.
             */
            recipeId: number;
            /**
             * A slug to identify the study.
             */
            slug: string;
            /**
             * The end date for the study.
             */
            studyEndDate: browser.extensionTypes.Date;
            /**
             * The start date for the study.
             */
            studyStartDate: browser.extensionTypes.Date;
            /**
             * The description presented on about:studies.
             */
            userFacingDescription: string;
            /**
             * The name presented on about:studies.
             */
            userFacingName: string;
        }

        /**
         * Fired when a user unenrolls from a study but before the addon is uninstalled.
         */
        export const onUnenroll: WebExtensionEvent<(reason: string) => void>;

        /**
         * Marks the study as ended and then uninstalls the addon.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/normandyAddonStudy.json
         * @platform desktop
         */
        export function endStudy(reason: string): globalThis.Promise<void>;

        /**
         * Returns an object with metadata about the client which may be required for constructing survey URLs.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/normandyAddonStudy.json
         * @platform desktop
         */
        export function getClientMetadata(): globalThis.Promise<void>;

        /**
         * Returns a study object for the current study.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/normandyAddonStudy.json
         * @platform desktop
         */
        export function getStudy(): globalThis.Promise<void>;

    }

    export namespace notifications {
        export interface CreateNotificationOptions {
            /**
             * A URL to the app icon mask.
             */
            appIconMaskUrl?: string;
            /**
             * Text and icons for up to two notification action buttons.
             */
            readonly buttons?: {
iconUrl?: string;
title: string;
}[];
            /**
             * Alternate notification content with a lower-weight font.
             */
            contextMessage?: string;
            /**
             * A timestamp associated with the notification, in milliseconds past the epoch.
             */
            eventTime?: number;
            /**
             * A URL to the sender's avatar, app icon, or a thumbnail for image notifications.
             */
            iconUrl?: string;
            /**
             * A URL to the image thumbnail for image-type notifications.
             */
            imageUrl?: string;
            /**
             * Whether to show UI indicating that the app will visibly respond to clicks on the body of a notification.
             */
            isClickable?: boolean;
            /**
             * Items for multi-item notifications.
             */
            items?: NotificationItem[];
            /**
             * Main notification content.
             */
            message: string;
            /**
             * Priority ranges from -2 to 2. -2 is lowest priority. 2 is highest. Zero is default.
             */
            priority?: number;
            /**
             * Current progress ranges from 0 to 100.
             */
            progress?: number;
            /**
             * Title of the notification (e.g. sender name for email).
             */
            title: string;
            /**
             * Which type of notification to display.
             */
            type: TemplateType;
        }

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

        export type PermissionLevel = "granted" | "denied";

        export type TemplateType = "basic" | "image" | "list" | "progress";

        export interface UpdateNotificationOptions {
            /**
             * A URL to the app icon mask.
             */
            appIconMaskUrl?: string;
            /**
             * Text and icons for up to two notification action buttons.
             */
            readonly buttons?: {
iconUrl?: string;
title: string;
}[];
            /**
             * Alternate notification content with a lower-weight font.
             */
            contextMessage?: string;
            /**
             * A timestamp associated with the notification, in milliseconds past the epoch.
             */
            eventTime?: number;
            /**
             * A URL to the sender's avatar, app icon, or a thumbnail for image notifications.
             */
            iconUrl?: string;
            /**
             * A URL to the image thumbnail for image-type notifications.
             */
            imageUrl?: string;
            /**
             * Whether to show UI indicating that the app will visibly respond to clicks on the body of a notification.
             */
            isClickable?: boolean;
            /**
             * Items for multi-item notifications.
             */
            items?: NotificationItem[];
            /**
             * Main notification content.
             */
            message?: string;
            /**
             * Priority ranges from -2 to 2. -2 is lowest priority. 2 is highest. Zero is default.
             */
            priority?: number;
            /**
             * Current progress ranges from 0 to 100.
             */
            progress?: number;
            /**
             * Title of the notification (e.g. sender name for email).
             */
            title?: string;
            /**
             * Which type of notification to display.
             */
            type?: TemplateType;
        }

        /**
         * Fired when the  user pressed a button in the notification.
         */
        export const onButtonClicked: WebExtensionEvent<(notificationId: string, buttonIndex: number) => void>;

        /**
         * Fired when the user clicked in a non-button area of the notification.
         */
        export const onClicked: WebExtensionEvent<(notificationId: string) => void>;

        /**
         * Fired when the notification closed, either by the system or by user action.
         */
        export const onClosed: WebExtensionEvent<(notificationId: string, byUser: boolean) => void>;

        /**
         * Fired when the user changes the permission level.
         */
        export const onPermissionLevelChanged: WebExtensionEvent<(level: PermissionLevel) => void>;

        /**
         * Fired when the user clicked on a link for the app's notification settings.
         */
        export const onShowSettings: WebExtensionEvent<() => void>;

        /**
         * Fired when the notification is shown.
         */
        export const onShown: WebExtensionEvent<(notificationId: string) => void>;

        /**
         * Clears an existing notification.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/notifications.json
         * @platform desktop
         */
        export function clear(notificationId: string): globalThis.Promise<boolean>;
        export function clear(notificationId: string, callback: ((wasCleared: boolean) => void)): void;

        /**
         * Creates and displays a notification.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/notifications.json
         * @platform desktop
         */
        export function create(notificationId: string, options: CreateNotificationOptions): globalThis.Promise<string>;
        export function create(notificationId: string, options: CreateNotificationOptions, callback: ((notificationId: string) => void)): void;
        export function create(options: CreateNotificationOptions): globalThis.Promise<string>;
        export function create(options: CreateNotificationOptions, callback: ((notificationId: string) => void)): void;

        /**
         * Retrieves all the notifications.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/notifications.json
         * @platform desktop
         */
        export function getAll(): globalThis.Promise<Record<string, unknown>>;
        export function getAll(callback: ((notifications: Record<string, unknown>) => void)): void;

        /**
         * Retrieves whether the user has enabled notifications from this app or extension.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/notifications.json
         * @platform desktop
         */
        export function getPermissionLevel(): globalThis.Promise<PermissionLevel>;
        export function getPermissionLevel(callback: ((level: PermissionLevel) => void)): void;

        /**
         * Updates an existing notification.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/notifications.json
         * @platform desktop
         */
        export function update(notificationId: string, options: UpdateNotificationOptions): globalThis.Promise<boolean>;
        export function update(notificationId: string, options: UpdateNotificationOptions, callback: ((wasUpdated: boolean) => void)): void;

    }

    export namespace omnibox {
        /**
         * A suggest result.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/omnibox.json
         */
        export interface DefaultSuggestResult {
            /**
             * The text that is displayed in the URL dropdown.
             */
            description: string;
            /**
             * An array of style ranges for the description, as provided by the extension.
             */
            readonly descriptionStyles?: {
length?: number;
offset: number;
type: DescriptionStyleType;
}[];
            /**
             * An array of style ranges for the description, as provided by ToValue().
             */
            readonly descriptionStylesRaw?: {
offset: number;
type: number;
}[];
        }

        /**
         * The style type.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/omnibox.json
         */
        export type DescriptionStyleType = "url" | "match" | "dim";

        /**
         * The window disposition for the omnibox query. This is the recommended context to display results. For example, if the omnibox command is to navigate to a certain URL, a disposition of 'newForegroundTab' means the navigation should take place in a new selected tab.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/omnibox.json
         */
        export type OnInputEnteredDisposition = "currentTab" | "newForegroundTab" | "newBackgroundTab";

        /**
         * A suggest result.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/omnibox.json
         */
        export interface SuggestResult {
            /**
             * The text that is put into the URL bar, and that is sent to the extension when the user chooses this entry.
             */
            content: string;
            /**
             * Whether the suggest result can be deleted by the user.
             */
            deletable?: boolean;
            /**
             * The text that is displayed in the URL dropdown. Can contain XML-style markup for styling. The supported tags are 'url' (for a literal URL), 'match' (for highlighting text that matched what the user's query), and 'dim' (for dim helper text). The styles can be nested, eg. <dim><match>dimmed match</match></dim>. You must escape the five predefined entities to display them as text: stackoverflow.com/a/1091953/89484
             */
            description: string;
            /**
             * An array of style ranges for the description, as provided by the extension.
             */
            readonly descriptionStyles?: {
length?: number;
offset: number;
type: DescriptionStyleType;
}[];
            /**
             * An array of style ranges for the description, as provided by ToValue().
             */
            readonly descriptionStylesRaw?: {
offset: number;
type: number;
}[];
        }

        /**
         * User has deleted a suggested result.
         */
        export const onDeleteSuggestion: WebExtensionEvent<(text: string) => void>;

        /**
         * User has ended the keyword input session without accepting the input.
         */
        export const onInputCancelled: WebExtensionEvent<() => void>;

        /**
         * User has changed what is typed into the omnibox.
         */
        export const onInputChanged: WebExtensionEvent<(text: string, suggest: ((suggestResults: SuggestResult[]) => void)) => void>;

        /**
         * User has accepted what is typed into the omnibox.
         */
        export const onInputEntered: WebExtensionEvent<(text: string, disposition: OnInputEnteredDisposition) => void>;

        /**
         * User has started a keyword input session by typing the extension's keyword. This is guaranteed to be sent exactly once per input session, and before any onInputChanged events.
         */
        export const onInputStarted: WebExtensionEvent<() => void>;

        /**
         * Sets the description and styling for the default suggestion. The default suggestion is the text that is displayed in the first suggestion row underneath the URL bar.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/omnibox.json
         * @platform desktop
         */
        export function setDefaultSuggestion(suggestion: DefaultSuggestResult): void;

    }

    export namespace pageAction {
        /**
         * Pixel data for an image. Must be an ImageData object (for example, from a canvas element).
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/page_action.json
         */
        export interface ImageDataType {
            [key: string]: unknown;
        }

        /**
         * Information sent when a page action is clicked.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/page_action.json
         */
        export interface OnClickData {
            /**
             * An integer value of button by which menu item was clicked.
             */
            button?: number;
            /**
             * An array of keyboard modifiers that were held while the menu item was clicked.
             */
            modifiers: ("Shift" | "Alt" | "Command" | "Ctrl" | "MacCtrl")[];
        }

        /**
         * Fired when a page action icon is clicked.  This event will not fire if the page action has a popup.
         */
        export const onClicked: WebExtensionEvent<(tab: browser.tabs.Tab, info: OnClickData) => void>;

        /**
         * Gets the html document set as the popup for this page action.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/page_action.json
         * @platform desktop
         */
        export function getPopup(details: {
tabId: number;
}): globalThis.Promise<string>;
        export function getPopup(details: {
tabId: number;
}, callback: ((result: string) => void)): void;

        /**
         * Gets the title of the page action.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/page_action.json
         * @platform desktop
         */
        export function getTitle(details: {
tabId: number;
}): globalThis.Promise<string>;
        export function getTitle(details: {
tabId: number;
}, callback: ((result: string) => void)): void;

        /**
         * Hides the page action.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/page_action.json
         * @platform desktop
         */
        export function hide(tabId: number): globalThis.Promise<void>;
        export function hide(tabId: number, callback: (() => void)): void;

        /**
         * Checks whether the page action is shown.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/page_action.json
         * @platform desktop
         */
        export function isShown(details: {
tabId: number;
}): globalThis.Promise<void>;

        /**
         * Opens the extension page action in the active window.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/page_action.json
         * @platform desktop
         */
        export function openPopup(): globalThis.Promise<void>;

        /**
         * Sets the icon for the page action. The icon can be specified either as the path to an image file or as the pixel data from a canvas element, or as dictionary of either one of those. Either the path or the imageData property must be specified.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/page_action.json
         * @platform desktop
         */
        export function setIcon(details: {
imageData?: ImageDataType | Record<string, unknown>;
path?: string | Record<string, unknown>;
tabId: number;
}): globalThis.Promise<void>;
        export function setIcon(details: {
imageData?: ImageDataType | Record<string, unknown>;
path?: string | Record<string, unknown>;
tabId: number;
}, callback: (() => void)): void;

        /**
         * Sets the html document to be opened as a popup when the user clicks on the page action's icon.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/page_action.json
         * @platform desktop
         */
        export function setPopup(details: {
popup: string | null;
tabId: number;
}): globalThis.Promise<void>;

        /**
         * Sets the title of the page action. This is displayed in a tooltip over the page action.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/page_action.json
         * @platform desktop
         */
        export function setTitle(details: {
tabId: number;
title: string | null;
}): void;

        /**
         * Shows the page action. The page action is shown whenever the tab is selected.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/page_action.json
         * @platform desktop
         */
        export function show(tabId: number): globalThis.Promise<void>;
        export function show(tabId: number, callback: (() => void)): void;

    }

    export namespace permissions {
        export interface AnyPermissions {
            data_collection?: browser.manifest.OptionalDataCollectionPermission[];
            origins?: browser.manifest.MatchPattern[];
            permissions?: (browser.manifest.Permission | browser.manifest.OptionalOnlyPermission)[];
        }

        export interface Permissions {
            data_collection?: browser.manifest.OptionalDataCollectionPermission[];
            origins?: browser.manifest.MatchPattern[];
            permissions?: (browser.manifest.OptionalPermission | browser.manifest.OptionalOnlyPermission)[];
        }

        /**
         * Fired when the extension acquires new permissions.
         */
        export const onAdded: WebExtensionEvent<(permissions: Permissions) => void>;

        /**
         * Fired when permissions are removed from the extension.
         */
        export const onRemoved: WebExtensionEvent<(permissions: Permissions) => void>;

        /**
         * Check if the extension has the given permissions.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/permissions.json
         * @platform desktop
         */
        export function contains(permissions: AnyPermissions): globalThis.Promise<boolean>;
        export function contains(permissions: AnyPermissions, callback: ((result: boolean) => void)): void;

        /**
         * Get a list of all the extension's permissions.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/permissions.json
         * @platform desktop
         */
        export function getAll(): globalThis.Promise<AnyPermissions>;
        export function getAll(callback: ((permissions: AnyPermissions) => void)): void;

        /**
         * Relinquish the given permissions.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/permissions.json
         * @platform desktop
         */
        export function remove(permissions: Permissions): globalThis.Promise<void>;
        export function remove(permissions: Permissions, callback: (() => void)): void;

        /**
         * Request the given permissions.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/permissions.json
         * @platform desktop
         */
        export function request(permissions: Permissions): globalThis.Promise<boolean>;
        export function request(permissions: Permissions, callback: ((granted: boolean) => void)): void;

    }

    export namespace pkcs11 {
        /**
         * Enumerate a module's slots, each with their name and whether a token is present
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/pkcs11.json
         * @platform desktop
         */
        export function getModuleSlots(name: string): globalThis.Promise<void>;

        /**
         * Install a PKCS#11 module with a given name
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/pkcs11.json
         * @platform desktop
         */
        export function installModule(name: string, flags?: number): globalThis.Promise<void>;

        /**
         * checks whether a PKCS#11 module, given by name, is installed
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/pkcs11.json
         * @platform desktop
         */
        export function isModuleInstalled(name: string): globalThis.Promise<void>;

        /**
         * Remove an installed PKCS#11 module from firefox
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/pkcs11.json
         * @platform desktop
         */
        export function uninstallModule(name: string): globalThis.Promise<void>;

    }

    export namespace privacy {
        export namespace network {
            /**
             * The mode for https-only mode.
             * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/privacy.json
             */
            export type HTTPSOnlyModeOption = "always" | "private_browsing" | "never";

            /**
             * The IP handling policy of WebRTC.
             * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/privacy.json
             */
            export type IPHandlingPolicy = "default" | "default_public_and_private_interfaces" | "default_public_interface_only" | "disable_non_proxied_udp" | "proxy_only";

            /**
             * An object which describes TLS minimum and maximum versions.
             * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/privacy.json
             */
            export interface tlsVersionRestrictionConfig {
                /**
                 * The maximum TLS version supported.
                 */
                maximum?: "TLSv1" | "TLSv1.1" | "TLSv1.2" | "TLSv1.3" | "unknown";
                /**
                 * The minimum TLS version supported.
                 */
                minimum?: "TLSv1" | "TLSv1.1" | "TLSv1.2" | "TLSv1.3" | "unknown";
            }

            export const globalPrivacyControl: browser.types.Setting;
            export const httpsOnlyMode: browser.types.Setting;
            export const networkPredictionEnabled: browser.types.Setting;
            export const peerConnectionEnabled: browser.types.Setting;
            export const tlsVersionRestriction: browser.types.Setting;
            export const webRTCIPHandlingPolicy: browser.types.Setting;
        }
        export namespace services {
            export const passwordSavingEnabled: browser.types.Setting;
        }
        export namespace websites {
            /**
             * The settings for cookies.
             * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/privacy.json
             */
            export interface CookieConfig {
                /**
                 * The type of cookies to allow.
                 */
                behavior?: "allow_all" | "reject_all" | "reject_third_party" | "allow_visited" | "reject_trackers" | "reject_trackers_and_partition_foreign";
                /**
                 * Whether to create all cookies as nonPersistent (i.e., session) cookies.
                 */
                nonPersistentCookies?: boolean;
            }

            /**
             * The mode for tracking protection.
             * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/privacy.json
             */
            export type TrackingProtectionModeOption = "always" | "never" | "private_browsing";

            export const cookieConfig: browser.types.Setting;
            export const firstPartyIsolate: browser.types.Setting;
            export const hyperlinkAuditingEnabled: browser.types.Setting;
            export const protectedContentEnabled: browser.types.Setting;
            export const referrersEnabled: browser.types.Setting;
            export const resistFingerprinting: browser.types.Setting;
            export const thirdPartyCookiesAllowed: browser.types.Setting;
            export const trackingProtectionMode: browser.types.Setting;
        }
    }

    export namespace proxy {
        /**
         * An object which describes proxy settings.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/proxy.json
         */
        export interface ProxyConfig {
            /**
             * A URL to use to configure the proxy.
             */
            autoConfigUrl?: string;
            /**
             * Do not prompt for authentication if password is saved.
             */
            autoLogin?: boolean;
            /**
             * The address of the ftp proxy, can include a port.  Deprecated since Firefox 88.
             */
            ftp?: string;
            /**
             * The address of the http proxy, can include a port.
             */
            http?: string;
            /**
             * Use the http proxy server for all protocols.
             */
            httpProxyAll?: boolean;
            /**
             * A list of hosts which should not be proxied.
             */
            passthrough?: string;
            /**
             * Proxy DNS when using SOCKS. DNS queries get leaked to the network when set to false. True by default for SOCKS v5. False by default for SOCKS v4.
             */
            proxyDNS?: boolean;
            /**
             * The type of proxy to use.
             */
            proxyType?: "none" | "autoDetect" | "system" | "manual" | "autoConfig";
            /**
             * If true (the default value), do not use newer TLS protocol features that might have interoperability problems on the Internet. This is intended only for use with critical infrastructure like the updates, and is only available to privileged addons.
             */
            respectBeConservative?: boolean;
            /**
             * The address of the socks proxy, can include a port.
             */
            socks?: string;
            /**
             * The version of the socks proxy.
             */
            socksVersion?: number;
            /**
             * The address of the ssl proxy, can include a port.
             */
            ssl?: string;
        }

        export const settings: browser.types.Setting;
        /**
         * Notifies about errors caused by the invalid use of the proxy API.
         */
        export const onError: WebExtensionEvent<(error: Record<string, unknown>) => void>;

        /**
         * Fired when proxy data is needed for a request.
         */
        export const onRequest: WebExtensionEvent<(details: {
cookieStoreId?: string;
documentId?: string;
documentUrl?: string;
frameId: number;
fromCache: boolean;
incognito?: boolean;
method: string;
originUrl?: string;
parentDocumentId?: string;
parentFrameId: number;
requestHeaders?: browser.webRequest.HttpHeaders;
requestId: string;
tabId: number;
thirdParty: boolean;
timeStamp: number;
type: browser.webRequest.ResourceType;
url: string;
urlClassification: browser.webRequest.UrlClassification;
}) => void>;

    }

    export namespace publicSuffix {
        /**
         * The available encoding types for the returned domain.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/public_suffix.json
         */
        export type DomainEncoding = "punycode" | "display";

        /**
         * Gets the eTLD+1 of a given hostname, or a variant such as IP address if the options allow.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/public_suffix.json
         * @platform desktop
         */
        export function getDomain(hostname: string, options?: {
allowIPAddress?: boolean;
allowPlainSuffix?: boolean;
allowUnknownSuffix?: boolean;
encoding?: DomainEncoding;
}): string;

        /**
         * Gets the known public suffix / eTLD (i.e. in the PSL), if any, of a given hostname.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/public_suffix.json
         * @platform desktop
         */
        export function getKnownSuffix(hostname: string): string;

        /**
         * Checks if the given hostname is itself a known public suffix / eTLD (i.e. in the PSL).
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/public_suffix.json
         * @platform desktop
         */
        export function isKnownSuffix(hostname: string): boolean;

    }

    export namespace runtime {
        /**
         * An object containing information about the current browser.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
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
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         */
        export interface ContextFilter {
            contextIds?: string[];
            contextTypes?: ContextType[];
            documentIds?: string[];
            documentOrigins?: string[];
            documentUrls?: string[];
            frameIds?: number[];
            incognito?: boolean;
            tabIds?: number[];
            windowIds?: number[];
        }

        /**
         * The type of extension view.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         */
        export type ContextType = "BACKGROUND" | "POPUP" | "SIDE_PANEL" | "TAB";

        /**
         * A context hosting extension content
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
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
            documentId?: string;
            /**
             * The origin of the document associated with this context, or undefined if it is not hosted in a document
             */
            documentOrigin?: string;
            /**
             * The URL of the document associated with this context, or undefined if it is not hosted in a document
             */
            documentUrl?: string;
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
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         */
        export interface MessageSender {
            /**
             * A UUID of the document that opened the connection.
             */
            documentId?: string;
            /**
             * The browser.frame_ids[frame] that opened the connection. 0 for top-level frames, positive for child frames. This will only be set when tab is set.
             */
            frameId?: number;
            /**
             * The ID of the extension or app that opened the connection, if any.
             */
            id?: string;
            /**
             * The browser.tabs.Tab which opened the connection, if any. This property will only be present when the connection was opened from a tab (including content scripts), and only if the receiver is an extension, not an app.
             */
            tab?: browser.tabs.Tab;
            /**
             * The TLS channel ID of the page or frame that opened the connection, if requested by the extension or app, and if available.
             */
            readonly tlsChannelId?: string;
            /**
             * The URL of the page or frame that opened the connection. If the sender is in an iframe, it will be iframe's URL not the URL of the page which hosts it.
             */
            url?: string;
            /**
             * The worldId of the USER_SCRIPT world that sent the message. Only present on onUserScriptMessage and onUserScriptConnect (in port.sender) events.
             */
            userScriptWorldId?: string;
        }

        /**
         * The reason that this event is being dispatched.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         */
        export type OnInstalledReason = "install" | "update" | "browser_update";

        /**
         * The performance warning event category, e.g. 'content_script'.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         */
        export type OnPerformanceWarningCategory = "content_script";

        /**
         * The performance warning event severity. Will be 'high' for serious and user-visible issues.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         */
        export type OnPerformanceWarningSeverity = "low" | "medium" | "high";

        /**
         * The reason that the event is being dispatched. 'app_update' is used when the restart is needed because the application is updated to a newer version. 'os_update' is used when the restart is needed because the browser/OS is updated to a newer version. 'periodic' is used when the system runs for more than the permitted uptime set in the enterprise policy.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         */
        export type OnRestartRequiredReason = "app_update" | "os_update" | "periodic";

        /**
         * The machine's processor architecture.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         */
        export type PlatformArch = "aarch64" | "arm" | "ppc64" | "riscv64" | "s390x" | "sparc64" | "x86-32" | "x86-64" | "noarch";

        /**
         * An object containing information about the current platform.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         */
        export interface PlatformInfo {
            /**
             * The machine's processor architecture.
             */
            arch: PlatformArch;
            /**
             * The native client architecture. This may be different from arch on some platforms.
             */
            readonly nacl_arch: (string & {});
            /**
             * The operating system the browser is running on.
             */
            os: PlatformOs;
        }

        /**
         * The operating system the browser is running on.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         */
        export type PlatformOs = "mac" | "win" | "android" | "cros" | "linux" | "openbsd";

        /**
         * An object which allows two way communication with other pages.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         */
        export interface Port {
            disconnect: ((...args: any[]) => void);
            name: string;
            onDisconnect: browser.events.Event;
            onMessage: browser.events.Event;
            postMessage: ((...args: any[]) => void);
            /**
             * This property will only be present on ports passed to onConnect/onConnectExternal listeners.
             */
            sender?: MessageSender;
        }

        /**
         * Result of the update check.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         */
        export type RequestUpdateCheckStatus = "throttled" | "no_update" | "update_available";

        export const id: string;
        export const lastError: {
message?: string;
};
        /**
         * Fired when an update for the browser is available, but isn't installed immediately because a browser restart is required.
         * @deprecated Please use browser.runtime.onRestartRequired.
         */
        export const onBrowserUpdateAvailable: WebExtensionEvent<() => void>;

        /**
         * Fired when a connection is made from either an extension process or a content script.
         */
        export const onConnect: WebExtensionEvent<(port: Port) => void>;

        /**
         * Fired when a connection is made from another extension.
         */
        export const onConnectExternal: WebExtensionEvent<(port: Port) => void>;

        /**
         * Fired when the extension is first installed, when the extension is updated to a new version, and when the browser is updated to a new version.
         */
        export const onInstalled: WebExtensionEvent<(details: {
id?: string;
previousVersion?: string;
reason: OnInstalledReason;
temporary: boolean;
}) => void>;

        /**
         * Fired when a message is sent from either an extension process or a content script.
         */
        export const onMessage: WebExtensionEvent<(message: any, sender: MessageSender, sendResponse: ((...args: any[]) => void)) => void>;

        /**
         * Fired when a message is sent from another extension/app. Cannot be used in a content script.
         */
        export const onMessageExternal: WebExtensionEvent<(message: any, sender: MessageSender, sendResponse: ((...args: any[]) => void)) => void>;

        /**
         * Fired when a runtime performance issue is detected with the extension. Observe this event to be proactively notified of runtime performance problems with the extension.
         */
        export const onPerformanceWarning: WebExtensionEvent<(details: {
category: OnPerformanceWarningCategory;
description: string;
severity: OnPerformanceWarningSeverity;
tabId?: number;
}) => void>;

        /**
         * Fired when an app or the device that it runs on needs to be restarted. The app should close all its windows at its earliest convenient time to let the restart to happen. If the app does nothing, a restart will be enforced after a 24-hour grace period has passed. Currently, this event is only fired for Chrome OS kiosk apps.
         */
        export const onRestartRequired: WebExtensionEvent<(reason: OnRestartRequiredReason) => void>;

        /**
         * Fired when a profile that has this extension installed first starts up. This event is not fired for incognito profiles.
         */
        export const onStartup: WebExtensionEvent<() => void>;

        /**
         * Sent to the event page just before it is unloaded. This gives the extension opportunity to do some clean up. Note that since the page is unloading, any asynchronous operations started while handling this event are not guaranteed to complete. If more activity for the event page occurs before it gets unloaded the onSuspendCanceled event will be sent and the page won't be unloaded.
         */
        export const onSuspend: WebExtensionEvent<() => void>;

        /**
         * Sent after onSuspend to indicate that the app won't be unloaded after all.
         */
        export const onSuspendCanceled: WebExtensionEvent<() => void>;

        /**
         * Fired when an update is available, but isn't installed immediately because the app is currently running. If you do nothing, the update will be installed the next time the background page gets unloaded, if you want it to be installed sooner you can explicitly call browser.runtime.reload. If your extension is using a persistent background page, the background page of course never gets unloaded, so unless you call browser.runtime.reload manually in response to this event the update will not get installed until the next time the browser itself restarts. If no handlers are listening for this event, and your extension has a persistent background page, it behaves as if browser.runtime.reload is called in response to this event.
         */
        export const onUpdateAvailable: WebExtensionEvent<(details: {
version: string;
}) => void>;

        /**
         * Fired when a connection is made from a USER_SCRIPT world registered through the userScripts API.
         */
        export const onUserScriptConnect: WebExtensionEvent<(port: Port) => void>;

        /**
         * Fired when a message is sent from a USER_SCRIPT world registered through the userScripts API.
         */
        export const onUserScriptMessage: WebExtensionEvent<(message: any, sender: MessageSender, sendResponse: ((...args: any[]) => void)) => void>;

        /**
         * Attempts to connect to connect listeners within an extension/app (such as the background page), or other extensions/apps. This is useful for content scripts connecting to their extension processes, inter-app/extension communication, and browser.manifest/externally_connectable[web messaging]. Note that this does not connect to any listeners in a content script. Extensions may connect to content scripts embedded in tabs via browser.tabs.connect.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop
         */
        export function connect(): Port;
        export function connect(connectInfo: {
includeTlsChannelId?: boolean;
name?: string;
}): Port;
        export function connect(extensionId: string, connectInfo?: {
includeTlsChannelId?: boolean;
name?: string;
}): Port;

        /**
         * Connects to a native application in the host machine.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @permission nativeMessaging
         * @platform desktop
         */
        export function connectNative(application: string): Port;

        /**
         * Retrieves the JavaScript 'window' object for the background page running inside the current extension/app. If the background page is an event page, the system will ensure it is loaded before calling the callback. If there is no background page, an error is set.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop
         */
        export function getBackgroundPage(): globalThis.Promise<Window>;
        export function getBackgroundPage(callback: ((backgroundPage: Window) => void)): void;

        /**
         * Returns information about the current browser.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop
         */
        export function getBrowserInfo(): globalThis.Promise<BrowserInfo>;
        export function getBrowserInfo(callback: ((browserInfo: BrowserInfo) => void)): void;

        /**
         * Fetches information about active contexts associated with this extension
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop
         */
        export function getContexts(filter: ContextFilter): globalThis.Promise<ExtensionContext[]>;
        export function getContexts(filter: ContextFilter, callback: ((contexts: ExtensionContext[]) => void)): void;

        /**
         * Get the documentId of any window global or frame element. Throws for invalid targets, such as unloaded frames.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop
         */
        export function getDocumentId(target: any): string;

        /**
         * Get the frameId of any window global or frame element.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop
         */
        export function getFrameId(target: any): number;

        /**
         * Returns details about the app or extension from the manifest. The object returned is a serialization of the full browser.manifest[manifest file].
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop
         */
        export function getManifest(): Record<string, unknown>;

        /**
         * Returns a DirectoryEntry for the package directory.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop
         */
        export function getPackageDirectoryEntry(): globalThis.Promise<Record<string, unknown>>;
        export function getPackageDirectoryEntry(callback: ((directoryEntry: Record<string, unknown>) => void)): void;

        /**
         * Returns information about the current platform.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop
         */
        export function getPlatformInfo(): globalThis.Promise<PlatformInfo>;
        export function getPlatformInfo(callback: ((platformInfo: PlatformInfo) => void)): void;

        /**
         * Converts a relative path within an app/extension install directory to a fully-qualified URL.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop
         */
        export function getURL(path: string): string;

        /**
         * Open your Extension's options page, if possible.The precise behavior may depend on your manifest's browser.optionsV2[options_ui] or browser.options[options_page] key, or what the browser happens to support at the time.If your Extension does not declare an options page, or the browser failed to create one for some other reason, the callback will set browser.lastError.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop
         */
        export function openOptionsPage(): globalThis.Promise<void>;
        export function openOptionsPage(callback: (() => void)): void;

        /**
         * Reloads the app or extension.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop
         */
        export function reload(): void;

        /**
         * Requests an update check for this app/extension.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop
         */
        export function requestUpdateCheck(): globalThis.Promise<RequestUpdateCheckStatus>;
        export function requestUpdateCheck(callback: ((status: RequestUpdateCheckStatus, details: {
version: string;
}) => void)): void;

        /**
         * Restart the device when the app runs in kiosk mode. Otherwise, it's no-op.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop
         */
        export function restart(): void;

        /**
         * Sends a single message to event listeners within your extension/app or a different extension/app. Similar to browser.runtime.connect but only sends a single message, with an optional response. If sending to your extension, the browser.runtime.onMessage event will be fired in each page, or browser.runtime.onMessageExternal, if a different extension. Note that extensions cannot send messages to content scripts using this method. To send messages to content scripts, use browser.tabs.sendMessage.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop
         */
        export function sendMessage(extensionId: string, message: any, options?: {
includeTlsChannelId?: boolean;
}): globalThis.Promise<any>;
        export function sendMessage(extensionId: string, message: any, options: {
includeTlsChannelId?: boolean;
}, responseCallback: ((response: any) => void)): void;
        export function sendMessage(extensionId: string, message: any, responseCallback: ((response: any) => void)): void;
        export function sendMessage(message: any, options?: {
includeTlsChannelId?: boolean;
}): globalThis.Promise<any>;
        export function sendMessage(message: any, options: {
includeTlsChannelId?: boolean;
}, responseCallback: ((response: any) => void)): void;
        export function sendMessage(message: any, responseCallback: ((response: any) => void)): void;

        /**
         * Send a single message to a native application.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @permission nativeMessaging
         * @platform desktop
         */
        export function sendNativeMessage(application: string, message: any): globalThis.Promise<any>;
        export function sendNativeMessage(application: string, message: any, responseCallback: ((response: any) => void)): void;

        /**
         * Sets the URL to be visited upon uninstallation. This may be used to clean up server-side data, do analytics, and implement surveys. Maximum 1023 characters.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/runtime.json
         * @platform desktop
         */
        export function setUninstallURL(): globalThis.Promise<void>;
        export function setUninstallURL(callback: (() => void)): void;
        export function setUninstallURL(url: string): globalThis.Promise<void>;
        export function setUninstallURL(url: string, callback: (() => void)): void;

    }

    export namespace scripting {
        export interface CSSInjection {
            /**
             * A string containing the CSS to inject. Exactly one of files and css must be specified.
             */
            css?: string;
            /**
             * The path of the CSS files to inject, relative to the extension's root directory. Exactly one of files and css must be specified.
             */
            files?: string[];
            /**
             * The style origin for the injection. Defaults to 'AUTHOR'.
             */
            origin?: "USER" | "AUTHOR";
            /**
             * Details specifying the target into which to inject the CSS.
             */
            target: InjectionTarget;
        }

        export interface ContentScriptFilter {
            /**
             * The IDs of specific scripts to retrieve with getRegisteredContentScripts() or to unregister with unregisterContentScripts().
             */
            ids?: string[];
        }

        /**
         * The JavaScript world for a script to execute within. ISOLATED is the default execution environment of content scripts, MAIN is the web page's execution environment.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/scripting.json
         */
        export type ExecutionWorld = "ISOLATED" | "MAIN";

        /**
         * Result of a script injection.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/scripting.json
         */
        export interface InjectionResult {
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
            result?: any;
        }

        export interface InjectionTarget {
            /**
             * Whether the script should inject into all frames within the tab. Defaults to false. This must not be true if frameIds is specified.
             */
            allFrames?: boolean;
            /**
             * The IDs of specific documents to inject into. This must not be set if frameIds or allFrames is set.
             */
            documentIds?: string[];
            /**
             * The IDs of specific frames to inject into.
             */
            frameIds?: number[];
            /**
             * The ID of the tab into which to inject.
             */
            tabId: number;
        }

        export interface RegisteredContentScript {
            /**
             * If specified true, it will inject into all frames, even if the frame is not the top-most frame in the tab. Each frame is checked independently for URL requirements; it will not inject into child frames if the URL requirements are not met. Defaults to false, meaning that only the top frame is matched.
             */
            allFrames?: boolean;
            /**
             * The list of CSS files to be injected into matching pages. These are injected in the order they appear in this array.
             */
            css?: browser.manifest.ExtensionURL[];
            cssOrigin?: browser.extensionTypes.CSSOrigin;
            /**
             * Excludes pages that this content script would otherwise be injected into.
             */
            excludeMatches?: string[];
            /**
             * The id of the content script, specified in the API call.
             */
            id: string;
            /**
             * The list of JavaScript files to be injected into matching pages. These are injected in the order they appear in this array.
             */
            js?: browser.manifest.ExtensionURL[];
            /**
             * If matchOriginAsFallback is true, then the code is also injected in about:, data:, blob: when their origin matches the pattern in 'matches', even if the actual document origin is opaque (due to the use of CSP sandbox or iframe sandbox). Match patterns in 'matches' must specify a wildcard path glob. By default it is false.
             */
            matchOriginAsFallback?: boolean;
            /**
             * Specifies which pages this content script will be injected into. Must be specified for registerContentScripts().
             */
            matches?: string[];
            /**
             * Specifies if this content script will persist into future sessions. Defaults to true.
             */
            persistAcrossSessions?: boolean;
            /**
             * Specifies when JavaScript files are injected into the web page. The preferred and default value is document_idle.
             */
            runAt?: browser.extensionTypes.RunAt;
            /**
             * The JavaScript world for a script to execute within. Defaults to "ISOLATED".
             */
            world?: ExecutionWorld;
        }

        /**
         * Details of a script injection
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/scripting.json
         */
        export interface ScriptInjection {
            /**
             * The arguments to curry into a provided function. This is only valid if the func parameter is specified. These arguments must be JSON-serializable.
             */
            args?: any[];
            /**
             * The path of the JS files to inject, relative to the extension's root directory. Exactly one of files and func must be specified.
             */
            files?: string[];
            /**
             * A JavaScript function to inject. This function will be serialized, and then deserialized for injection. This means that any bound parameters and execution context will be lost. Exactly one of files and func must be specified.
             */
            func?: ((...args: any[]) => void);
            /**
             * Whether the injection should be triggered in the target as soon as possible (but not necessarily prior to page load).
             */
            injectImmediately?: boolean;
            /**
             * Details specifying the target into which to inject the script.
             */
            target: InjectionTarget;
            world?: ExecutionWorld;
        }

        /**
         * Injects a script into a target context. The script will be run at document_idle.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/scripting.json
         * @platform desktop
         */
        export function executeScript(injection: ScriptInjection): globalThis.Promise<InjectionResult[]>;
        export function executeScript(injection: ScriptInjection, callback: ((results: InjectionResult[]) => void)): void;

        /**
         * Returns all dynamically registered content scripts for this extension that match the given filter.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/scripting.json
         * @platform desktop
         */
        export function getRegisteredContentScripts(): globalThis.Promise<RegisteredContentScript[]>;
        export function getRegisteredContentScripts(callback: ((scripts: RegisteredContentScript[]) => void)): void;
        export function getRegisteredContentScripts(filter: ContentScriptFilter): globalThis.Promise<RegisteredContentScript[]>;
        export function getRegisteredContentScripts(filter: ContentScriptFilter, callback: ((scripts: RegisteredContentScript[]) => void)): void;

        /**
         * Inserts a CSS stylesheet into a target context. If multiple frames are specified, unsuccessful injections are ignored.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/scripting.json
         * @platform desktop
         */
        export function insertCSS(injection: CSSInjection): globalThis.Promise<void>;
        export function insertCSS(injection: CSSInjection, callback: (() => void)): void;

        /**
         * Registers one or more content scripts for this extension.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/scripting.json
         * @platform desktop
         */
        export function registerContentScripts(scripts: RegisteredContentScript[]): globalThis.Promise<void>;
        export function registerContentScripts(scripts: RegisteredContentScript[], callback: (() => void)): void;

        /**
         * Removes a CSS stylesheet that was previously inserted by this extension from a target context.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/scripting.json
         * @platform desktop
         */
        export function removeCSS(injection: CSSInjection): globalThis.Promise<void>;
        export function removeCSS(injection: CSSInjection, callback: (() => void)): void;

        /**
         * Unregisters one or more content scripts for this extension.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/scripting.json
         * @platform desktop
         */
        export function unregisterContentScripts(): globalThis.Promise<void>;
        export function unregisterContentScripts(callback: (() => void)): void;
        export function unregisterContentScripts(filter: ContentScriptFilter): globalThis.Promise<void>;
        export function unregisterContentScripts(filter: ContentScriptFilter, callback: (() => void)): void;

        /**
         * Updates one or more content scripts for this extension.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/scripting.json
         * @platform desktop
         */
        export function updateContentScripts(scripts: {
allFrames?: boolean;
css?: browser.manifest.ExtensionURL[];
cssOrigin?: browser.extensionTypes.CSSOrigin;
excludeMatches?: string[];
id: string;
js?: browser.manifest.ExtensionURL[];
matchOriginAsFallback?: boolean;
matches?: string[];
persistAcrossSessions?: boolean;
runAt?: browser.extensionTypes.RunAt;
world?: ExecutionWorld;
}[]): globalThis.Promise<void>;
        export function updateContentScripts(scripts: {
allFrames?: boolean;
css?: browser.manifest.ExtensionURL[];
cssOrigin?: browser.extensionTypes.CSSOrigin;
excludeMatches?: string[];
id: string;
js?: browser.manifest.ExtensionURL[];
matchOriginAsFallback?: boolean;
matches?: string[];
persistAcrossSessions?: boolean;
runAt?: browser.extensionTypes.RunAt;
world?: ExecutionWorld;
}[], callback: (() => void)): void;

    }

    export namespace search {
        /**
         * Location where search results should be displayed.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/search.json
         */
        export type Disposition = "CURRENT_TAB" | "NEW_TAB" | "NEW_WINDOW";

        /**
         * An object encapsulating a search engine
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/search.json
         */
        export interface SearchEngine {
            alias?: string;
            favIconUrl?: string;
            isDefault: boolean;
            name: string;
        }

        /**
         * Gets a list of search engines.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/search.json
         * @platform desktop
         */
        export function get(): globalThis.Promise<void>;

        /**
         * Use the chrome.search API to search via the default provider.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/search.json
         * @platform desktop
         */
        export function query(queryInfo: {
disposition?: Disposition;
tabId?: number;
text: string;
}): globalThis.Promise<void>;
        export function query(queryInfo: {
disposition?: Disposition;
tabId?: number;
text: string;
}, callback: (() => void)): void;

        /**
         * Perform a search.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/search.json
         * @platform desktop
         */
        export function search(searchProperties: {
disposition?: Disposition;
engine?: string;
query: string;
tabId?: number;
}): globalThis.Promise<void>;

    }

    export namespace sessions {
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

        export interface Filter {
            /**
             * The maximum number of entries to be fetched in the requested list. Omit this parameter to fetch the maximum number of entries (browser.sessions.MAX_SESSION_RESULTS).
             */
            maxResults?: number;
        }

        export interface Session {
            /**
             * The time when the window or tab was closed or modified, represented in milliseconds since the epoch.
             */
            lastModified: number;
            /**
             * The browser.tabs.Tab, if this entry describes a tab. Either this or browser.sessions.Session.window will be set.
             */
            tab?: browser.tabs.Tab;
            /**
             * The browser.windows.Window, if this entry describes a window. Either this or browser.sessions.Session.tab will be set.
             */
            window?: browser.windows.Window;
        }

        export const MAX_SESSION_RESULTS: number;
        /**
         * Fired when recently closed tabs and/or windows are changed. This event does not monitor synced sessions changes.
         */
        export const onChanged: WebExtensionEvent<() => void>;

        /**
         * Forget a recently closed tab.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sessions.json
         * @platform desktop
         */
        export function forgetClosedTab(windowId: number, sessionId: string): globalThis.Promise<void>;

        /**
         * Forget a recently closed window.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sessions.json
         * @platform desktop
         */
        export function forgetClosedWindow(sessionId: string): globalThis.Promise<void>;

        /**
         * Retrieves all devices with synced sessions.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sessions.json
         * @platform desktop
         */
        export function getDevices(): globalThis.Promise<Device[]>;
        export function getDevices(callback: ((devices: Device[]) => void)): void;
        export function getDevices(filter: Filter): globalThis.Promise<Device[]>;
        export function getDevices(filter: Filter, callback: ((devices: Device[]) => void)): void;

        /**
         * Gets the list of recently closed tabs and/or windows.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sessions.json
         * @platform desktop
         */
        export function getRecentlyClosed(): globalThis.Promise<Session[]>;
        export function getRecentlyClosed(callback: ((sessions: Session[]) => void)): void;
        export function getRecentlyClosed(filter: Filter): globalThis.Promise<Session[]>;
        export function getRecentlyClosed(filter: Filter, callback: ((sessions: Session[]) => void)): void;

        /**
         * Retrieve a value that was set for a given key on a given tab.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sessions.json
         * @platform desktop
         */
        export function getTabValue(tabId: number, key: string): globalThis.Promise<void>;

        /**
         * Retrieve a value that was set for a given key on a given window.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sessions.json
         * @platform desktop
         */
        export function getWindowValue(windowId: number, key: string): globalThis.Promise<void>;

        /**
         * Remove a key/value pair that was set on a given tab.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sessions.json
         * @platform desktop
         */
        export function removeTabValue(tabId: number, key: string): globalThis.Promise<void>;

        /**
         * Remove a key/value pair that was set on a given window.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sessions.json
         * @platform desktop
         */
        export function removeWindowValue(windowId: number, key: string): globalThis.Promise<void>;

        /**
         * Reopens a browser.windows.Window or browser.tabs.Tab, with an optional callback to run when the entry has been restored.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sessions.json
         * @platform desktop
         */
        export function restore(): globalThis.Promise<Session>;
        export function restore(callback: ((restoredSession: Session) => void)): void;
        export function restore(sessionId: string): globalThis.Promise<Session>;
        export function restore(sessionId: string, callback: ((restoredSession: Session) => void)): void;

        /**
         * Set a key/value pair on a given tab.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sessions.json
         * @platform desktop
         */
        export function setTabValue(tabId: number, key: string, value: any): globalThis.Promise<void>;

        /**
         * Set a key/value pair on a given window.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sessions.json
         * @platform desktop
         */
        export function setWindowValue(windowId: number, key: string, value: any): globalThis.Promise<void>;

    }

    export namespace sidebarAction {
        /**
         * Pixel data for an image. Must be an ImageData object (for example, from a canvas element).
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sidebar_action.json
         */
        export interface ImageDataType {
            [key: string]: unknown;
        }

        /**
         * Closes the extension sidebar in the active window if the sidebar belongs to the extension.
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
        export function getPanel(details: {
tabId?: number;
windowId?: number;
}): globalThis.Promise<void>;

        /**
         * Gets the title of the sidebar action.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sidebar_action.json
         * @platform desktop
         */
        export function getTitle(details: {
tabId?: number;
windowId?: number;
}): globalThis.Promise<void>;

        /**
         * Checks whether the sidebar action is open.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sidebar_action.json
         * @platform desktop
         */
        export function isOpen(details: {
windowId?: number;
}): globalThis.Promise<void>;

        /**
         * Opens the extension sidebar in the active window.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sidebar_action.json
         * @platform desktop
         */
        export function open(): globalThis.Promise<void>;

        /**
         * Sets the icon for the sidebar action. The icon can be specified either as the path to an image file or as the pixel data from a canvas element, or as dictionary of either one of those. Either the path or the imageData property must be specified.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sidebar_action.json
         * @platform desktop
         */
        export function setIcon(details: {
imageData?: ImageDataType | Record<string, unknown>;
path?: string | Record<string, unknown>;
tabId?: number;
windowId?: number;
}): globalThis.Promise<void>;

        /**
         * Sets the url to the html document to be opened in the sidebar when the user clicks on the sidebar action's icon.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sidebar_action.json
         * @platform desktop
         */
        export function setPanel(details: {
panel: string | null;
tabId?: number;
windowId?: number;
}): globalThis.Promise<void>;

        /**
         * Sets the title of the sidebar action. This shows up in the tooltip.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sidebar_action.json
         * @platform desktop
         */
        export function setTitle(details: {
tabId?: number;
title: string | null;
windowId?: number;
}): globalThis.Promise<void>;

        /**
         * Toggles the extension sidebar in the active window.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/sidebar_action.json
         * @platform desktop
         */
        export function toggle(): globalThis.Promise<void>;

    }

    export namespace storage {
        export interface StorageArea {
            /**
             * Removes all items from storage.
             *
             * @platform desktop
             */
            clear(): globalThis.Promise<void>;
            clear(callback: (() => void)): void;
            /**
             * Gets one or more items from storage.
             *
             * @platform desktop
             */
            get(): globalThis.Promise<Record<string, unknown>>;
            get(callback: ((items: Record<string, unknown>) => void)): void;
            get(keys: string | string[] | Record<string, unknown>): globalThis.Promise<Record<string, unknown>>;
            get(keys: string | string[] | Record<string, unknown>, callback: ((items: Record<string, unknown>) => void)): void;
            /**
             * Gets the amount of space (in bytes) being used by one or more items.
             *
             * @platform desktop
             */
            getBytesInUse(): globalThis.Promise<number>;
            getBytesInUse(callback: ((bytesInUse: number) => void)): void;
            getBytesInUse(keys: string | string[]): globalThis.Promise<number>;
            getBytesInUse(keys: string | string[], callback: ((bytesInUse: number) => void)): void;
            /**
             * Gets the keys of all items in storage.
             *
             * @platform desktop
             */
            getKeys(): globalThis.Promise<string[]>;
            getKeys(callback: ((keys: string[]) => void)): void;
            /**
             * Removes one or more items from storage.
             *
             * @platform desktop
             */
            remove(keys: string | string[]): globalThis.Promise<void>;
            remove(keys: string | string[], callback: (() => void)): void;
            /**
             * Sets multiple items.
             *
             * @platform desktop
             */
            set(items: Record<string, unknown>): globalThis.Promise<void>;
            set(items: Record<string, unknown>, callback: (() => void)): void;
            /**
             * Fired when one or more items change.
             */
            onChanged: WebExtensionEvent<(changes: Record<string, unknown>) => void>;
        }

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

        export const local: StorageArea;
        export const managed: StorageArea;
        export const session: StorageArea;
        export const sync: StorageArea;
        /**
         * Fired when one or more items change.
         */
        export const onChanged: WebExtensionEvent<(changes: Record<string, unknown>, areaName: string) => void>;

    }

    export namespace tabGroups {
        /**
         * The group's color, using 'grey' spelling for compatibility with Chromium.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabGroups.json
         */
        export type Color = "blue" | "cyan" | "grey" | "green" | "orange" | "pink" | "purple" | "red" | "yellow";

        /**
         * State of a tab group inside of an open window.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabGroups.json
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
            title?: string;
            /**
             * Window that the tab group is in.
             */
            windowId: number;
        }

        export const TAB_GROUP_ID_NONE: number;
        /**
         * Fired when a tab group is created.
         */
        export const onCreated: WebExtensionEvent<(group: TabGroup) => void>;

        /**
         * Fired when a tab group is moved, within a window or to another window.
         */
        export const onMoved: WebExtensionEvent<(group: TabGroup) => void>;

        /**
         * Fired when a tab group is removed.
         */
        export const onRemoved: WebExtensionEvent<(group: TabGroup, removeInfo: {
isWindowClosing: boolean;
}) => void>;

        /**
         * Fired when a tab group is updated.
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
        export function move(groupId: number, moveProperties: {
index: number;
windowId?: number;
}): globalThis.Promise<TabGroup>;
        export function move(groupId: number, moveProperties: {
index: number;
windowId?: number;
}, callback: ((group: TabGroup) => void)): void;

        /**
         * Return all grups, or find groups with specified properties.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabGroups.json
         * @platform desktop
         */
        export function query(queryInfo: {
collapsed?: boolean;
color?: Color;
title?: string;
windowId?: number;
}): globalThis.Promise<TabGroup[]>;
        export function query(queryInfo: {
collapsed?: boolean;
color?: Color;
title?: string;
windowId?: number;
}, callback: ((groups: TabGroup[]) => void)): void;

        /**
         * Modifies state of a specified group.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabGroups.json
         * @platform desktop
         */
        export function update(groupId: number, updateProperties: {
collapsed?: boolean;
color?: Color;
title?: string;
}): globalThis.Promise<TabGroup>;
        export function update(groupId: number, updateProperties: {
collapsed?: boolean;
color?: Color;
title?: string;
}, callback: ((group: TabGroup) => void)): void;

    }

    export namespace tabs {
        /**
         * Tab muted state and the reason for the last state change.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         */
        export interface MutedInfo {
            /**
             * The ID of the extension that changed the muted state. Not set if an extension was not the reason the muted state last changed.
             */
            extensionId?: string;
            /**
             * Whether the tab is prevented from playing sound (but hasn't necessarily recently produced sound). Equivalent to whether the muted audio indicator is showing.
             */
            muted: boolean;
            /**
             * The reason the tab was muted or unmuted. Not set if the tab's mute state has never been changed.
             */
            reason?: MutedInfoReason;
        }

        /**
         * An event that caused a muted state change.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         */
        export type MutedInfoReason = "user" | "capture" | "extension";

        /**
         * Defines the page settings to be used when saving a page as a pdf file.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         */
        export interface PageSettings {
            /**
             * The spacing between the bottom of the footers and the bottom edge of the paper (inches). Default: 0.
             */
            edgeBottom?: number;
            /**
             * The spacing between the left header/footer and the left edge of the paper (inches). Default: 0.
             */
            edgeLeft?: number;
            /**
             * The spacing between the right header/footer and the right edge of the paper (inches). Default: 0.
             */
            edgeRight?: number;
            /**
             * The spacing between the top of the headers and the top edge of the paper (inches). Default: 0
             */
            edgeTop?: number;
            /**
             * The text for the page's center footer. Default: ''.
             */
            footerCenter?: string;
            /**
             * The text for the page's left footer. Default: '&PT'.
             */
            footerLeft?: string;
            /**
             * The text for the page's right footer. Default: '&D'.
             */
            footerRight?: string;
            /**
             * The text for the page's center header. Default: ''.
             */
            headerCenter?: string;
            /**
             * The text for the page's left header. Default: '&T'.
             */
            headerLeft?: string;
            /**
             * The text for the page's right header. Default: '&U'.
             */
            headerRight?: string;
            /**
             * The margin between the page content and the bottom edge of the paper (inches). Default: 0.5.
             */
            marginBottom?: number;
            /**
             * The margin between the page content and the left edge of the paper (inches). Default: 0.5.
             */
            marginLeft?: number;
            /**
             * The margin between the page content and the right edge of the paper (inches). Default: 0.5.
             */
            marginRight?: number;
            /**
             * The margin between the page content and the top edge of the paper (inches). Default: 0.5.
             */
            marginTop?: number;
            /**
             * The page content orientation: 0 = portrait, 1 = landscape. Default: 0.
             */
            orientation?: number;
            /**
             * The paper height in paper size units. Default: 11.0.
             */
            paperHeight?: number;
            /**
             * The page size unit: 0 = inches, 1 = millimeters. Default: 0.
             */
            paperSizeUnit?: number;
            /**
             * The paper width in paper size units. Default: 8.5.
             */
            paperWidth?: number;
            /**
             * The page content scaling factor: 1.0 = 100% = normal size. Default: 1.0.
             */
            scaling?: number;
            /**
             * Whether the page background colors should be shown. Default: false.
             */
            showBackgroundColors?: boolean;
            /**
             * Whether the page background images should be shown. Default: false.
             */
            showBackgroundImages?: boolean;
            /**
             * Whether the page content should shrink to fit the page width (overrides scaling). Default: true.
             */
            shrinkToFit?: boolean;
            /**
             * The name of the file. May include optional .pdf extension.
             */
            toFileName?: string;
        }

        /**
         * Tab sharing state for screen, microphone and camera.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
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
            screen?: string;
        }

        export interface Tab {
            /**
             * Whether the tab is active in its window. (Does not necessarily mean the window is focused.)
             */
            active: boolean;
            /**
             * Whether the tab is drawing attention.
             */
            attention?: boolean;
            /**
             * Whether the tab has produced sound over the past couple of seconds (but it might not be heard if also muted). Equivalent to whether the speaker audio indicator is showing.
             */
            audible?: boolean;
            /**
             * Whether the tab can be discarded automatically by the browser when resources are low.
             */
            autoDiscardable?: boolean;
            /**
             * The CookieStoreId used for the tab.
             */
            cookieStoreId?: string;
            /**
             * True while the tab is not loaded with content.
             */
            discarded?: boolean;
            /**
             * The URL of the tab's favicon. This property is only present if the extension's manifest includes the "tabs" permission. It may also be an empty string if the tab is loading.
             */
            favIconUrl?: string;
            /**
             * The ID of the group that the tab belongs to. browser.tabGroups.TAB_GROUP_ID_NONE (-1) if the tab does not belong to a tab group.
             */
            groupId?: number;
            /**
             * The height of the tab in pixels.
             */
            height?: number;
            /**
             * True if the tab is hidden.
             */
            hidden?: boolean;
            /**
             * Whether the tab is highlighted. Works as an alias of active
             */
            highlighted: boolean;
            /**
             * The ID of the tab. Tab IDs are unique within a browser session. Under some circumstances a Tab may not be assigned an ID, for example when querying foreign tabs using the browser.sessions API, in which case a session ID may be present. Tab ID can also be set to browser.tabs.TAB_ID_NONE for apps and devtools windows.
             */
            id?: number;
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
            isArticle?: boolean;
            /**
             * Whether the document in the tab is being rendered in reader mode.
             */
            isInReaderMode?: boolean;
            /**
             * The last time the tab was accessed as the number of milliseconds since epoch.
             */
            lastAccessed?: number;
            /**
             * Current tab muted state and the reason for the last state change.
             */
            mutedInfo?: MutedInfo;
            /**
             * The ID of the tab that opened this tab, if any. This property is only present if the opener tab still exists.
             */
            openerTabId?: number;
            /**
             * Whether the tab is pinned.
             */
            pinned: boolean;
            /**
             * The session ID used to uniquely identify a Tab obtained from the browser.sessions API.
             */
            sessionId?: string;
            /**
             * Current tab sharing state for screen, microphone and camera.
             */
            sharingState?: SharingState;
            /**
             * The ID of the Split View that the tab belongs to. browser.tabs.SPLIT_VIEW_ID_NONE if the tab does not belong to a split view.
             */
            splitViewId?: number;
            /**
             * Either loading or complete.
             */
            status?: string;
            /**
             * The ID of this tab's successor, if any; browser.tabs.TAB_ID_NONE otherwise.
             */
            successorTabId?: number;
            /**
             * The title of the tab. This property is only present if the extension's manifest includes the "tabs" permission.
             */
            title?: string;
            /**
             * The URL the tab is displaying. This property is only present if the extension's manifest includes the "tabs" permission.
             */
            url?: string;
            /**
             * The width of the tab in pixels.
             */
            width?: number;
            /**
             * The ID of the window the tab is contained within.
             */
            windowId?: number;
        }

        /**
         * Whether the tabs have completed loading.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         */
        export type TabStatus = "loading" | "complete";

        /**
         * An object describing filters to apply to tabs.onUpdated events.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         */
        export interface UpdateFilter {
            cookieStoreId?: string;
            /**
             * A list of property names. Events that do not match any of the names will be filtered out.
             */
            properties?: UpdatePropertyName[];
            tabId?: number;
            /**
             * A list of URLs or URL patterns. Events that cannot match any of the URLs will be filtered out.  Filtering with urls requires the "tabs" or  "activeTab" permission.
             */
            urls?: string[];
            windowId?: number;
        }

        /**
         * Event names supported in onUpdated.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         */
        export type UpdatePropertyName = "attention" | "audible" | "autoDiscardable" | "discarded" | "favIconUrl" | "groupId" | "hidden" | "isArticle" | "mutedInfo" | "pinned" | "sharingState" | "splitViewId" | "status" | "title" | "url";

        /**
         * The type of window.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         */
        export type WindowType = "normal" | "popup" | "panel" | "app" | "devtools";

        /**
         * Defines how zoom changes in a tab are handled and at what scope.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         */
        export interface ZoomSettings {
            /**
             * Used to return the default zoom level for the current tab in calls to tabs.getZoomSettings.
             */
            defaultZoomFactor?: number;
            /**
             * Defines how zoom changes are handled, i.e. which entity is responsible for the actual scaling of the page; defaults to automatic.
             */
            mode?: ZoomSettingsMode;
            /**
             * Defines whether zoom changes will persist for the page's origin, or only take effect in this tab; defaults to per-origin when in automatic mode, and per-tab otherwise.
             */
            scope?: ZoomSettingsScope;
        }

        /**
         * Defines how zoom changes are handled, i.e. which entity is responsible for the actual scaling of the page; defaults to automatic.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         */
        export type ZoomSettingsMode = "automatic" | "manual" | "disabled";

        /**
         * Defines whether zoom changes will persist for the page's origin, or only take effect in this tab; defaults to per-origin when in automatic mode, and per-tab otherwise.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         */
        export type ZoomSettingsScope = "per-origin" | "per-tab";

        export const SPLIT_VIEW_ID_NONE: number;
        export const TAB_ID_NONE: number;
        /**
         * Fires when the active tab in a window changes. Note that the tab's URL may not be set at the time this event fired, but you can listen to onUpdated events to be notified when a URL is set.
         */
        export const onActivated: WebExtensionEvent<(activeInfo: {
previousTabId?: number;
tabId: number;
windowId: number;
}) => void>;

        /**
         * Fired when a tab is attached to a window, for example because it was moved between windows.
         */
        export const onAttached: WebExtensionEvent<(tabId: number, attachInfo: {
newPosition: number;
newWindowId: number;
}) => void>;

        /**
         * Fired when a tab is created. Note that the tab's URL may not be set at the time this event fired, but you can listen to onUpdated events to be notified when a URL is set.
         */
        export const onCreated: WebExtensionEvent<(tab: Tab) => void>;

        /**
         * Fired when a tab is detached from a window, for example because it is being moved between windows.
         */
        export const onDetached: WebExtensionEvent<(tabId: number, detachInfo: {
oldPosition: number;
oldWindowId: number;
}) => void>;

        /**
         * Fired when the highlighted or selected tabs in a window changes.
         */
        export const onHighlighted: WebExtensionEvent<(highlightInfo: {
tabIds: number[];
windowId: number;
}) => void>;

        /**
         * Fired when a tab is moved within a window. Only one move event is fired, representing the tab the user directly moved. Move events are not fired for the other tabs that must move in response. This event is not fired when a tab is moved between windows. For that, see browser.tabs.onDetached.
         */
        export const onMoved: WebExtensionEvent<(tabId: number, moveInfo: {
fromIndex: number;
toIndex: number;
windowId: number;
}) => void>;

        /**
         * Fired when a tab is closed.
         */
        export const onRemoved: WebExtensionEvent<(tabId: number, removeInfo: {
isWindowClosing: boolean;
windowId: number;
}) => void>;

        /**
         * Fired when a tab is replaced with another tab due to prerendering or instant.
         */
        export const onReplaced: WebExtensionEvent<(addedTabId: number, removedTabId: number) => void>;

        /**
         * Fired when a tab is updated.
         */
        export const onUpdated: WebExtensionEvent<(tabId: number, changeInfo: {
attention?: boolean;
audible?: boolean;
autoDiscardable?: boolean;
discarded?: boolean;
favIconUrl?: string;
groupId?: number;
hidden?: boolean;
isArticle?: boolean;
mutedInfo?: MutedInfo;
pinned?: boolean;
sharingState?: SharingState;
splitViewId?: number;
status?: string;
title?: string;
url?: string;
}, tab: Tab) => void>;

        /**
         * Fired when a tab is zoomed.
         */
        export const onZoomChange: WebExtensionEvent<(ZoomChangeInfo: {
newZoomFactor: number;
oldZoomFactor: number;
tabId: number;
zoomSettings: ZoomSettings;
}) => void>;

        /**
         * Captures an area of a specified tab. You must have browser.declare_permissions[<all_urls>] permission to use this method.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @permission <all_urls>
         * @platform desktop
         */
        export function captureTab(): globalThis.Promise<void>;
        export function captureTab(options: browser.extensionTypes.ImageDetails): globalThis.Promise<void>;
        export function captureTab(tabId: number, options?: browser.extensionTypes.ImageDetails): globalThis.Promise<void>;

        /**
         * Captures an area of the currently active tab in the specified window. You must have <all_urls> or activeTab permission to use this method.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @permission <all_urls>
         * @permission activeTab
         * @platform desktop
         */
        export function captureVisibleTab(): globalThis.Promise<string>;
        export function captureVisibleTab(callback: ((dataUrl: string) => void)): void;
        export function captureVisibleTab(options: browser.extensionTypes.ImageDetails): globalThis.Promise<string>;
        export function captureVisibleTab(options: browser.extensionTypes.ImageDetails, callback: ((dataUrl: string) => void)): void;
        export function captureVisibleTab(windowId: number, options?: browser.extensionTypes.ImageDetails): globalThis.Promise<string>;
        export function captureVisibleTab(windowId: number, options: browser.extensionTypes.ImageDetails, callback: ((dataUrl: string) => void)): void;
        export function captureVisibleTab(windowId: number, callback: ((dataUrl: string) => void)): void;

        /**
         * Connects to the content script(s) in the specified tab. The browser.runtime.onConnect event is fired in each content script running in the specified tab for the current extension. For more details, see browser.messaging[Content Script Messaging].
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function connect(tabId: number, connectInfo?: {
documentId?: string;
frameId?: number;
name?: string;
}): browser.runtime.Port;

        /**
         * Creates a new tab.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function create(createProperties: {
active?: boolean;
cookieStoreId?: string;
discarded?: boolean;
index?: number;
muted?: boolean;
openInReaderMode?: boolean;
openerTabId?: number;
pinned?: boolean;
title?: string;
url?: string;
windowId?: number;
}): globalThis.Promise<Tab>;
        export function create(createProperties: {
active?: boolean;
cookieStoreId?: string;
discarded?: boolean;
index?: number;
muted?: boolean;
openInReaderMode?: boolean;
openerTabId?: number;
pinned?: boolean;
title?: string;
url?: string;
windowId?: number;
}, callback: ((tab: Tab) => void)): void;

        /**
         * Detects the primary language of the content in a tab.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function detectLanguage(): globalThis.Promise<string>;
        export function detectLanguage(callback: ((language: string) => void)): void;
        export function detectLanguage(tabId: number): globalThis.Promise<string>;
        export function detectLanguage(tabId: number, callback: ((language: string) => void)): void;

        /**
         * discards one or more tabs.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function discard(tabIds: number | number[]): globalThis.Promise<void>;

        /**
         * Duplicates a tab.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function duplicate(tabId: number, duplicateProperties?: {
active?: boolean;
index?: number;
}): globalThis.Promise<Tab>;
        export function duplicate(tabId: number, duplicateProperties: {
active?: boolean;
index?: number;
}, callback: ((tab: Tab) => void)): void;
        export function duplicate(tabId: number, callback: ((tab: Tab) => void)): void;

        /**
         * Injects JavaScript code into a page. For details, see the browser.content_scripts[programmatic injection] section of the content scripts doc.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function executeScript(tabId: number, details: browser.extensionTypes.InjectDetails): globalThis.Promise<any[]>;
        export function executeScript(tabId: number, details: browser.extensionTypes.InjectDetails, callback: ((result: any[]) => void)): void;
        export function executeScript(details: browser.extensionTypes.InjectDetails): globalThis.Promise<any[]>;
        export function executeScript(details: browser.extensionTypes.InjectDetails, callback: ((result: any[]) => void)): void;

        /**
         * Retrieves details about the specified tab.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function get(tabId: number): globalThis.Promise<Tab>;
        export function get(tabId: number, callback: ((tab: Tab) => void)): void;

        /**
         * Gets the tab that this script call is being made from. May be undefined if called from a non-tab context (for example: a background page or popup view).
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function getCurrent(): globalThis.Promise<Tab>;
        export function getCurrent(callback: ((tab: Tab) => void)): void;

        /**
         * Gets the current zoom factor of a specified tab.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function getZoom(): globalThis.Promise<number>;
        export function getZoom(callback: ((zoomFactor: number) => void)): void;
        export function getZoom(tabId: number): globalThis.Promise<number>;
        export function getZoom(tabId: number, callback: ((zoomFactor: number) => void)): void;

        /**
         * Gets the current zoom settings of a specified tab.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function getZoomSettings(): globalThis.Promise<ZoomSettings>;
        export function getZoomSettings(callback: ((zoomSettings: ZoomSettings) => void)): void;
        export function getZoomSettings(tabId: number): globalThis.Promise<ZoomSettings>;
        export function getZoomSettings(tabId: number, callback: ((zoomSettings: ZoomSettings) => void)): void;

        /**
         * Navigate to previous page in tab's history, if available.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function goBack(): globalThis.Promise<void>;
        export function goBack(callback: (() => void)): void;
        export function goBack(tabId: number): globalThis.Promise<void>;
        export function goBack(tabId: number, callback: (() => void)): void;

        /**
         * Navigate to next page in tab's history, if available
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function goForward(): globalThis.Promise<void>;
        export function goForward(callback: (() => void)): void;
        export function goForward(tabId: number): globalThis.Promise<void>;
        export function goForward(tabId: number, callback: (() => void)): void;

        /**
         * Adds one or more tabs to a specified group, or if no group is specified, adds the given tabs to a newly created group.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function group(options: {
createProperties?: {
windowId?: number;
};
groupId?: number;
tabIds: number | number[];
}): globalThis.Promise<number>;
        export function group(options: {
createProperties?: {
windowId?: number;
};
groupId?: number;
tabIds: number | number[];
}, callback: ((groupId: number) => void)): void;

        /**
         * Hides one or more tabs. The "tabHide" permission is required to hide tabs.  Not all tabs are hidable.  Returns an array of hidden tabs.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @permission tabHide
         * @platform desktop
         */
        export function hide(tabIds: number | number[]): globalThis.Promise<void>;

        /**
         * Highlights the given tabs.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function highlight(highlightInfo: {
populate?: boolean;
tabs: number[] | number;
windowId?: number;
}): globalThis.Promise<browser.windows.Window>;
        export function highlight(highlightInfo: {
populate?: boolean;
tabs: number[] | number;
windowId?: number;
}, callback: ((window: browser.windows.Window) => void)): void;

        /**
         * Injects CSS into a page. For details, see the browser.content_scripts[programmatic injection] section of the content scripts doc.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function insertCSS(tabId: number, details: browser.extensionTypes.InjectDetails): globalThis.Promise<void>;
        export function insertCSS(tabId: number, details: browser.extensionTypes.InjectDetails, callback: (() => void)): void;
        export function insertCSS(details: browser.extensionTypes.InjectDetails): globalThis.Promise<void>;
        export function insertCSS(details: browser.extensionTypes.InjectDetails, callback: (() => void)): void;

        /**
         * Moves one or more tabs to a new position within its window, or to a new window. Note that tabs can only be moved to and from normal (window.type === "normal") windows.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function move(tabIds: number | number[], moveProperties: {
index: number;
windowId?: number;
}): globalThis.Promise<Tab | Tab[]>;
        export function move(tabIds: number | number[], moveProperties: {
index: number;
windowId?: number;
}, callback: ((tabs: Tab | Tab[]) => void)): void;

        /**
         * Removes an array of tabs from their lines of succession and prepends or appends them in a chain to another tab.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function moveInSuccession(tabIds: number[], tabId?: number, options?: {
append?: boolean;
insert?: boolean;
}): globalThis.Promise<void>;

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
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function printPreview(): globalThis.Promise<void>;
        export function printPreview(callback: (() => void)): void;

        /**
         * Gets all tabs that have the specified properties, or all tabs if no properties are specified.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function query(queryInfo: {
active?: boolean;
attention?: boolean;
audible?: boolean;
autoDiscardable?: boolean;
camera?: boolean;
cookieStoreId?: string[] | string;
currentWindow?: boolean;
discarded?: boolean;
groupId?: number;
hidden?: boolean;
highlighted?: boolean;
index?: number;
lastFocusedWindow?: boolean;
microphone?: boolean;
muted?: boolean;
openerTabId?: number;
pinned?: boolean;
screen?: "Screen" | "Window" | "Application" | boolean;
splitViewId?: number;
status?: TabStatus;
title?: string;
url?: string | string[];
windowId?: number;
windowType?: WindowType;
}): globalThis.Promise<Tab[]>;
        export function query(queryInfo: {
active?: boolean;
attention?: boolean;
audible?: boolean;
autoDiscardable?: boolean;
camera?: boolean;
cookieStoreId?: string[] | string;
currentWindow?: boolean;
discarded?: boolean;
groupId?: number;
hidden?: boolean;
highlighted?: boolean;
index?: number;
lastFocusedWindow?: boolean;
microphone?: boolean;
muted?: boolean;
openerTabId?: number;
pinned?: boolean;
screen?: "Screen" | "Window" | "Application" | boolean;
splitViewId?: number;
status?: TabStatus;
title?: string;
url?: string | string[];
windowId?: number;
windowType?: WindowType;
}, callback: ((result: Tab[]) => void)): void;

        /**
         * Reload a tab.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function reload(): globalThis.Promise<void>;
        export function reload(callback: (() => void)): void;
        export function reload(reloadProperties: {
bypassCache?: boolean;
}): globalThis.Promise<void>;
        export function reload(reloadProperties: {
bypassCache?: boolean;
}, callback: (() => void)): void;
        export function reload(tabId: number, reloadProperties?: {
bypassCache?: boolean;
}): globalThis.Promise<void>;
        export function reload(tabId: number, reloadProperties: {
bypassCache?: boolean;
}, callback: (() => void)): void;
        export function reload(tabId: number, callback: (() => void)): void;

        /**
         * Closes one or more tabs.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function remove(tabIds: number | number[]): globalThis.Promise<void>;
        export function remove(tabIds: number | number[], callback: (() => void)): void;

        /**
         * Removes injected CSS from a page. For details, see the browser.content_scripts[programmatic injection] section of the content scripts doc.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function removeCSS(tabId: number, details: browser.extensionTypes.InjectDetails): globalThis.Promise<void>;
        export function removeCSS(tabId: number, details: browser.extensionTypes.InjectDetails, callback: (() => void)): void;
        export function removeCSS(details: browser.extensionTypes.InjectDetails): globalThis.Promise<void>;
        export function removeCSS(details: browser.extensionTypes.InjectDetails, callback: (() => void)): void;

        /**
         * Saves page in active tab as a PDF file.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function saveAsPDF(pageSettings: PageSettings): globalThis.Promise<string>;
        export function saveAsPDF(pageSettings: PageSettings, callback: ((status: string) => void)): void;

        /**
         * Sends a single message to the content script(s) in the specified tab, with an optional callback to run when a response is sent back.  The browser.runtime.onMessage event is fired in each content script running in the specified tab for the current extension.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function sendMessage(tabId: number, message: any, options?: {
documentId?: string;
frameId?: number;
}): globalThis.Promise<any>;
        export function sendMessage(tabId: number, message: any, options: {
documentId?: string;
frameId?: number;
}, responseCallback: ((response: any) => void)): void;
        export function sendMessage(tabId: number, message: any, responseCallback: ((response: any) => void)): void;

        /**
         * Zooms a specified tab.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function setZoom(tabId: number, zoomFactor: number): globalThis.Promise<void>;
        export function setZoom(tabId: number, zoomFactor: number, callback: (() => void)): void;
        export function setZoom(zoomFactor: number): globalThis.Promise<void>;
        export function setZoom(zoomFactor: number, callback: (() => void)): void;

        /**
         * Sets the zoom settings for a specified tab, which define how zoom changes are handled. These settings are reset to defaults upon navigating the tab.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function setZoomSettings(tabId: number, zoomSettings: ZoomSettings): globalThis.Promise<void>;
        export function setZoomSettings(tabId: number, zoomSettings: ZoomSettings, callback: (() => void)): void;
        export function setZoomSettings(zoomSettings: ZoomSettings): globalThis.Promise<void>;
        export function setZoomSettings(zoomSettings: ZoomSettings, callback: (() => void)): void;

        /**
         * Shows one or more tabs.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @permission tabHide
         * @platform desktop
         */
        export function show(tabIds: number | number[]): globalThis.Promise<void>;

        /**
         * Toggles reader mode for the document in the tab.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function toggleReaderMode(): globalThis.Promise<void>;
        export function toggleReaderMode(tabId: number): globalThis.Promise<void>;

        /**
         * Removes one or more tabs from their respective groups. If any groups become empty, they are deleted.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function ungroup(tabIds: number | number[]): globalThis.Promise<void>;

        /**
         * Modifies the properties of a tab. Properties that are not specified in updateProperties are not modified.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function update(tabId: number, updateProperties: {
active?: boolean;
autoDiscardable?: boolean;
highlighted?: boolean;
loadReplace?: boolean;
muted?: boolean;
openerTabId?: number;
pinned?: boolean;
successorTabId?: number;
url?: string;
}): globalThis.Promise<Tab>;
        export function update(tabId: number, updateProperties: {
active?: boolean;
autoDiscardable?: boolean;
highlighted?: boolean;
loadReplace?: boolean;
muted?: boolean;
openerTabId?: number;
pinned?: boolean;
successorTabId?: number;
url?: string;
}, callback: ((tab: Tab) => void)): void;
        export function update(updateProperties: {
active?: boolean;
autoDiscardable?: boolean;
highlighted?: boolean;
loadReplace?: boolean;
muted?: boolean;
openerTabId?: number;
pinned?: boolean;
successorTabId?: number;
url?: string;
}): globalThis.Promise<Tab>;
        export function update(updateProperties: {
active?: boolean;
autoDiscardable?: boolean;
highlighted?: boolean;
loadReplace?: boolean;
muted?: boolean;
openerTabId?: number;
pinned?: boolean;
successorTabId?: number;
url?: string;
}, callback: ((tab: Tab) => void)): void;

        /**
         * Warm up a tab
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function warmup(tabId: number): globalThis.Promise<void>;

    }

    export namespace telemetry {
        /**
         * Represents registration data for a Telemetry event.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/telemetry.json
         */
        export interface EventData {
            /**
             * True if this event entry is expired. This allows recording it without error, but it will be discarded.
             */
            expired?: boolean;
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
            record_on_release?: boolean;
        }

        /**
         * Represents registration data for a Telemetry scalar.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/telemetry.json
         */
        export interface ScalarData {
            /**
             * True if this scalar entry is expired. This allows recording it without error, but it will be discarded.
             */
            expired?: boolean;
            /**
             * True if this is a keyed scalar.
             */
            keyed?: boolean;
            kind: ScalarType;
            /**
             * True if this data should be recorded on release.
             */
            record_on_release?: boolean;
        }

        /**
         * Type of scalar: 'count' for numeric values, 'string' for string values, 'boolean' for boolean values. Maps to nsITelemetry.SCALAR_TYPE_*.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/telemetry.json
         */
        export type ScalarType = "count" | "string" | "boolean";

        /**
         * Checks if Telemetry upload is enabled.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/telemetry.json
         * @platform desktop
         */
        export function canUpload(): globalThis.Promise<void>;

        /**
         * Adds the value to the given keyed scalar.
         *
         * @deprecated `keyedScalarAdd` is a no-op since Firefox 134 (see bug 1930196)
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/telemetry.json
         * @platform desktop
         */
        export function keyedScalarAdd(name: string, key: string, value: number): globalThis.Promise<void>;

        /**
         * Sets the keyed scalar to the given value. Throws if the value type doesn't match the scalar type.
         *
         * @deprecated `keyedScalarSet` is a no-op since Firefox 134 (see bug 1930196)
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/telemetry.json
         * @platform desktop
         */
        export function keyedScalarSet(name: string, key: string, value: string | boolean | number | Record<string, unknown>): globalThis.Promise<void>;

        /**
         * Sets the keyed scalar to the maximum of the current and the passed value
         *
         * @deprecated `keyedScalarSetMaximum` is a no-op since Firefox 134 (see bug 1930196)
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/telemetry.json
         * @platform desktop
         */
        export function keyedScalarSetMaximum(name: string, key: string, value: number): globalThis.Promise<void>;

        /**
         * Record an event in Telemetry. Throws when trying to record an unknown event.
         *
         * @deprecated `recordEvent` is a no-op since Firefox 132 (see bug 1894533)
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/telemetry.json
         * @platform desktop
         */
        export function recordEvent(category: string, method: string, object: string, value?: string, extra?: Record<string, unknown>): globalThis.Promise<void>;

        /**
         * Register new events to record them from addons. See nsITelemetry.idl for more details.
         *
         * @deprecated `registerEvents` is a no-op since Firefox 132 (see bug 1894533)
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/telemetry.json
         * @platform desktop
         */
        export function registerEvents(category: string, data: Record<string, unknown>): globalThis.Promise<void>;

        /**
         * Register new scalars to record them from addons. See nsITelemetry.idl for more details.
         *
         * @deprecated `registerScalars` is a no-op since Firefox 134 (see bug 1930196)
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/telemetry.json
         * @platform desktop
         */
        export function registerScalars(category: string, data: Record<string, unknown>): globalThis.Promise<void>;

        /**
         * Adds the value to the given scalar.
         *
         * @deprecated `scalarAdd` is a no-op since Firefox 134 (see bug 1930196)
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/telemetry.json
         * @platform desktop
         */
        export function scalarAdd(name: string, value: number): globalThis.Promise<void>;

        /**
         * Sets the named scalar to the given value. Throws if the value type doesn't match the scalar type.
         *
         * @deprecated `scalarSet` is a no-op since Firefox 134 (see bug 1930196)
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/telemetry.json
         * @platform desktop
         */
        export function scalarSet(name: string, value: string | boolean | number | Record<string, unknown>): globalThis.Promise<void>;

        /**
         * Sets the scalar to the maximum of the current and the passed value
         *
         * @deprecated `scalarSetMaximum` is a no-op since Firefox 134 (see bug 1930196)
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/telemetry.json
         * @platform desktop
         */
        export function scalarSetMaximum(name: string, value: number): globalThis.Promise<void>;

        /**
         * Enable recording of events in a category. Events default to recording enabled. This allows to toggle recording for all events in the specified category.
         *
         * @deprecated `setEventRecordingEnabled` is a no-op since Firefox 133 (see bug 1920562)
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/telemetry.json
         * @platform desktop
         */
        export function setEventRecordingEnabled(category: string, enabled: boolean): globalThis.Promise<void>;

        /**
         * Submits a custom ping to the Telemetry back-end. See submitExternalPing inside TelemetryController.sys.mjs for more details.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/telemetry.json
         * @platform desktop
         */
        export function submitPing(type: string, message: Record<string, unknown>, options: {
addClientId?: boolean;
addEnvironment?: boolean;
overrideEnvironment?: Record<string, unknown>;
usePingSender?: boolean;
}): globalThis.Promise<void>;

    }

    export namespace test {
        export type ExpectedError = RegExp | ((...args: any[]) => void) | (string & {});

        export type Promise = {
then: ((...args: any[]) => void);
} | globalThis.Promise<any>;

        /**
         * Used to test sending messages to extensions.
         */
        export const onMessage: WebExtensionEvent<(message: string, argument: any) => void>;

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/test.json
         * @platform desktop
         */
        export function assertBool(test: string | boolean, expected: boolean, message?: string): void;

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/test.json
         * @platform desktop
         */
        export function assertDeepEq(expected: any, actual: any, message?: string): void;

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/test.json
         * @platform desktop
         */
        export function assertEq(): void;
        export function assertEq(message: string): void;
        export function assertEq(actual: any, message?: string): void;
        export function assertEq(expected: any, actual?: any, message?: string): void;

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/test.json
         * @platform desktop
         */
        export function assertFalse(): void;
        export function assertFalse(message: string): void;
        export function assertFalse(test: any, message?: string): void;

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/test.json
         * @platform desktop
         */
        export function assertLastError(expectedError: string): void;

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/test.json
         * @platform desktop
         */
        export function assertNoLastError(): void;

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/test.json
         * @platform desktop
         */
        export function assertRejects(promise: globalThis.Promise<any>, expectedError: ExpectedError, message?: string): globalThis.Promise<void>;

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/test.json
         * @platform desktop
         */
        export function assertThrows(func: ((...args: any[]) => void), expectedError?: ExpectedError, message?: string): void;

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/test.json
         * @platform desktop
         */
        export function assertTrue(): void;
        export function assertTrue(message: string): void;
        export function assertTrue(test: any, message?: string): void;

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/test.json
         * @platform desktop
         */
        export function fail(): void;
        export function fail(message: any): void;

        /**
         * Logs a message during internal unit testing.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/test.json
         * @platform desktop
         */
        export function log(message: string): void;

        /**
         * Notifies the browser process that test code running in the extension failed.  This is only used for internal unit testing.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/test.json
         * @platform desktop
         */
        export function notifyFail(message: string): void;

        /**
         * Notifies the browser process that test code running in the extension passed.  This is only used for internal unit testing.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/test.json
         * @platform desktop
         */
        export function notifyPass(): void;
        export function notifyPass(message: string): void;

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/test.json
         * @platform desktop
         */
        export function runTests(tests: ((...args: any[]) => void)[]): globalThis.Promise<void>;

        /**
         * Sends a string message to the browser process, generating a Notification that C++ test code can wait for.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/test.json
         * @platform desktop
         */
        export function sendMessage(): void;
        export function sendMessage(arg2: any): void;
        export function sendMessage(arg1: any, arg2?: any): void;

        /**
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/test.json
         * @platform desktop
         */
        export function succeed(): void;
        export function succeed(message: any): void;

        /**
         * Calls the callback function wrapped with user input set.  This is only used for internal unit testing.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/test.json
         * @platform desktop
         */
        export function withHandlingUserInput(callback: ((...args: any[]) => void)): void;

    }

    export namespace theme {
        /**
         * Info provided in the onUpdated listener.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/theme.json
         */
        export interface ThemeUpdateInfo {
            /**
             * The new theme after update
             */
            theme: Record<string, unknown>;
            /**
             * The id of the window the theme has been applied to
             */
            windowId?: number;
        }

        /**
         * Fired when a new theme has been applied
         */
        export const onUpdated: WebExtensionEvent<(updateInfo: ThemeUpdateInfo) => void>;

        /**
         * Returns the current theme for the specified window or the last focused window.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/theme.json
         * @platform desktop
         */
        export function getCurrent(): globalThis.Promise<void>;
        export function getCurrent(windowId: number): globalThis.Promise<void>;

        /**
         * Removes the updates made to the theme.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/theme.json
         * @permission theme
         * @platform desktop
         */
        export function reset(): globalThis.Promise<void>;
        export function reset(windowId: number): globalThis.Promise<void>;

        /**
         * Make complete updates to the theme. Resolves when the update has completed.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/theme.json
         * @permission theme
         * @platform desktop
         */
        export function update(windowId: number, details: browser.manifest.ThemeType): globalThis.Promise<void>;
        export function update(details: browser.manifest.ThemeType): globalThis.Promise<void>;

    }

    export namespace topSites {
        /**
         * An object encapsulating a most visited URL, such as the URLs on the new tab page.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/top_sites.json
         */
        export interface MostVisitedURL {
            /**
             * Data URL for the favicon, if available.
             */
            favicon?: string;
            /**
             * The title of the page.
             */
            title?: string;
            /**
             * The entry type, either url for a normal page link, or search for a search shortcut.
             */
            type?: "url" | "search";
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
        export function get(): globalThis.Promise<MostVisitedURL[]>;
        export function get(callback: ((results: MostVisitedURL[]) => void)): void;
        export function get(options: {
includeBlocked?: boolean;
includeFavicon?: boolean;
includePinned?: boolean;
includeSearchShortcuts?: boolean;
limit?: number;
newtab?: boolean;
onePerDomain?: boolean;
providers?: string[];
}): globalThis.Promise<MostVisitedURL[]>;
        export function get(options: {
includeBlocked?: boolean;
includeFavicon?: boolean;
includePinned?: boolean;
includeSearchShortcuts?: boolean;
limit?: number;
newtab?: boolean;
onePerDomain?: boolean;
providers?: string[];
}, callback: ((results: MostVisitedURL[]) => void)): void;

    }

    export namespace trial {
        export namespace ml {
            export interface CreateEngineRequest {
                [key: string]: unknown;
            }

            export interface RunEngineRequest {
                [key: string]: unknown;
            }

            /**
             * Events from the inference engine.
             */
            export const onProgress: WebExtensionEvent<(progressData: Record<string, unknown>) => void>;

            /**
             * Prepare the inference engine
             *
             * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/trial_ml.json
             * @platform desktop
             */
            export function createEngine(request: CreateEngineRequest): globalThis.Promise<void>;

            /**
             * Delete the models the extension downloaded.
             *
             * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/trial_ml.json
             * @platform desktop
             */
            export function deleteCachedModels(): globalThis.Promise<void>;

            /**
             * Call the inference engine
             *
             * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/trial_ml.json
             * @platform desktop
             */
            export function runEngine(request: RunEngineRequest): globalThis.Promise<void>;

        }
    }

    export namespace types {
        /**
         * One ofnot_controllable: cannot be controlled by any extensioncontrolled_by_other_extensions: controlled by extensions with higher precedencecontrollable_by_this_extension: can be controlled by this extensioncontrolled_by_this_extension: controlled by this extension
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/types.json
         */
        export type LevelOfControl = "not_controllable" | "controlled_by_other_extensions" | "controllable_by_this_extension" | "controlled_by_this_extension";

        export interface Setting {
            /**
             * Clears the setting, restoring any default value.
             *
             * @platform desktop
             */
            clear(details: {
scope?: browser.types.SettingScope;
}): globalThis.Promise<void>;
            clear(details: {
scope?: browser.types.SettingScope;
}, callback: (() => void)): void;
            /**
             * Gets the value of a setting.
             *
             * @platform desktop
             */
            get(details: {
incognito?: boolean;
}): globalThis.Promise<{
incognitoSpecific?: boolean;
levelOfControl: browser.types.LevelOfControl;
value: any;
}>;
            get(details: {
incognito?: boolean;
}, callback: ((details: {
incognitoSpecific?: boolean;
levelOfControl: browser.types.LevelOfControl;
value: any;
}) => void)): void;
            /**
             * Sets the value of a setting.
             *
             * @platform desktop
             */
            set(details: {
scope?: browser.types.SettingScope;
value: any;
}): globalThis.Promise<void>;
            set(details: {
scope?: browser.types.SettingScope;
value: any;
}, callback: (() => void)): void;
            /**
             * Fired after the setting changes.
             */
            onChange: WebExtensionEvent<(details: {
incognitoSpecific?: boolean;
levelOfControl: browser.types.LevelOfControl;
value: any;
}) => void>;
        }

        /**
         * The scope of the Setting. One ofregular: setting for the regular profile (which is inherited by the incognito profile if not overridden elsewhere),regular_only: setting for the regular profile only (not inherited by the incognito profile),incognito_persistent: setting for the incognito profile that survives browser restarts (overrides regular preferences),incognito_session_only: setting for the incognito profile that can only be set during an incognito session and is deleted when the incognito session ends (overrides regular and incognito_persistent preferences). Only regular is supported by Firefox at this time.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/types.json
         */
        export type SettingScope = "regular" | "regular_only" | "incognito_persistent" | "incognito_session_only";

    }

    export namespace userScripts {
        /**
         * The JavaScript world for a script to execute within. USER_SCRIPT is the default execution environment of user scripts, MAIN is the web page's execution environment.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/user_scripts.json
         */
        export type ExecutionWorld = "MAIN" | "USER_SCRIPT";

        /**
         * Result of a user script injection.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/user_scripts.json
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
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/user_scripts.json
         */
        export interface InjectionTarget {
            /**
             * Whether the script should inject into all frames within the tab. Defaults to false. This must not be true if `frameIds` is specified.
             */
            allFrames?: boolean;
            /**
             * The IDs of specific documentIds to inject into. This must not be set if frameIds is set.
             */
            documentIds?: string[];
            /**
             * The IDs of specific frames to inject into.
             */
            frameIds?: number[];
            /**
             * The ID of the tab into which to inject.
             */
            tabId: number;
        }

        /**
         * An object that represents a user script registered programmatically
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/user_scripts.json
         */
        export interface RegisteredUserScript {
            /**
             * If allFrames is true, implies that the JavaScript should be injected into all frames of current page. By default, it's false and is only injected into the top frame.
             */
            allFrames?: boolean;
            excludeGlobs?: string[];
            excludeMatches?: browser.manifest.MatchPattern[];
            /**
             * The ID of the user script specified in the API call. This property must not start with a '_' as it's reserved as a prefix for generated script IDs.
             */
            id: string;
            /**
             * At least one of matches or includeGlobs should be non-empty. The script runs in documents whose URL match either pattern.
             */
            includeGlobs?: string[];
            /**
             * The list of ScriptSource objects defining sources of scripts to be injected into matching pages.
             */
            js: ScriptSource[];
            /**
             * At least one of matches or includeGlobs should be non-empty. The script runs in documents whose URL match either pattern.
             */
            matches?: browser.manifest.MatchPattern[];
            /**
             * The soonest that the JavaScript will be injected into the tab. Defaults to "document_idle".
             */
            runAt?: browser.extensionTypes.RunAt;
            /**
             * The JavaScript script for a script to execute within. Defaults to "USER_SCRIPT".
             */
            world?: ExecutionWorld;
            /**
             * If specified, specifies a specific user script world ID to execute in. Only valid if `world` is omitted or is `USER_SCRIPT`. If `worldId` is omitted, the script will execute in the default user script world (""). Values with leading underscores (`_`) are reserved. The maximum length is 256.
             */
            worldId?: string;
        }

        /**
         * Object with file xor code property. Equivalent to the ExtensionFileOrCode, except the file remains a relative URL.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/user_scripts.json
         */
        export type ScriptSource = {
file: string;
} | {
code: string;
};

        /**
         * Optional filter to use with getScripts() and unregister().
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/user_scripts.json
         */
        export interface UserScriptFilter {
            ids?: string[];
        }

        /**
         * Details of a user script injection
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/user_scripts.json
         */
        export interface UserScriptInjection {
            /**
             * Whether the injection should be triggered in the target as soon as possible. Note that this is not a guarantee that injection will occur prior to page load, as the page may have already loaded by the time the script reaches the target.
             */
            injectImmediately?: boolean;
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
            world?: ExecutionWorld;
            /**
             * A specific user script world ID to execute in. Only valid if `world` is omitted or is `USER_SCRIPT`. If `worldId` is omitted, the default value is an empty string ("") and the script will execute in the default world.
             */
            worldId?: string;
        }

        /**
         * Details of a user script
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/user_scripts.json
         */
        export interface UserScriptOptions {
            /**
             * If allFrames is true, implies that the JavaScript should be injected into all frames of current page. By default, it's false and is only injected into the top frame.
             */
            allFrames?: boolean;
            /**
             * limit the set of matched tabs to those that belong to the given cookie store id
             */
            cookieStoreId?: string[] | string;
            excludeGlobs?: string[];
            excludeMatches?: browser.manifest.MatchPattern[];
            includeGlobs?: string[];
            /**
             * The list of JS files to inject
             */
            js: browser.extensionTypes.ExtensionFileOrCode[];
            /**
             * If matchAboutBlank is true, then the code is also injected in about:blank and about:srcdoc frames if your extension has access to its parent document. Code cannot be inserted in top-level about:-frames. By default it is false.
             */
            matchAboutBlank?: boolean;
            matches: browser.manifest.MatchPattern[];
            /**
             * The soonest that the JavaScript will be injected into the tab. Defaults to "document_idle".
             */
            runAt?: browser.extensionTypes.RunAt;
            /**
             * An opaque user script metadata value
             */
            scriptMetadata?: browser.extensionTypes.PlainJSONValue;
        }

        /**
         * The configuration of a USER_SCRIPT world.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/user_scripts.json
         */
        export interface WorldProperties {
            /**
             * The world's Content Security Policy. Defaults to the CSP of regular content scripts, which prohibits dynamic code execution such as eval.
             */
            csp?: string;
            /**
             * Whether the runtime.sendMessage and runtime.connect methods are exposed. Defaults to not exposing these messaging APIs.
             */
            messaging?: boolean;
            /**
             * The identifier of the world. Values with leading underscores (`_`) are reserved. The maximum length is 256. Defaults to the default USER_SCRIPT world ("").
             */
            worldId?: string;
        }

        /**
         * Event called when a new userScript global has been created
         */
        export const onBeforeScript: WebExtensionEvent<(userScript: {
defineGlobals: ((sourceObject: Record<string, unknown>) => void);
export: ((value: any) => any);
global: any;
metadata: any;
}) => void>;

        /**
         * Configures the environment for scripts running in a USER_SCRIPT world.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/user_scripts.json
         * @platform desktop
         */
        export function configureWorld(properties: WorldProperties): globalThis.Promise<void>;

        /**
         * Executes one or more ephemeral user scripts into a specific tab.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/user_scripts.json
         * @platform desktop
         */
        export function execute(injection: UserScriptInjection): globalThis.Promise<InjectionResult[]>;
        export function execute(injection: UserScriptInjection, callback: ((results: InjectionResult[]) => void)): void;

        /**
         * Returns all dynamically-registered user scripts for this extension.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/user_scripts.json
         * @platform desktop
         */
        export function getScripts(): globalThis.Promise<RegisteredUserScript[]>;
        export function getScripts(callback: ((scripts: RegisteredUserScript[]) => void)): void;
        export function getScripts(filter: UserScriptFilter): globalThis.Promise<RegisteredUserScript[]>;
        export function getScripts(filter: UserScriptFilter, callback: ((scripts: RegisteredUserScript[]) => void)): void;

        /**
         * Returns all registered USER_SCRIPT world configurations.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/user_scripts.json
         * @platform desktop
         */
        export function getWorldConfigurations(): globalThis.Promise<WorldProperties[]>;
        export function getWorldConfigurations(callback: ((configurations: WorldProperties[]) => void)): void;

        /**
         * Registers one or more user scripts for this extension.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/user_scripts.json
         * @platform desktop
         */
        export function register(scripts: RegisteredUserScript[]): globalThis.Promise<void>;

        /**
         * Resets the configuration for a given world. That world will fall back to the default world's configuration.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/user_scripts.json
         * @platform desktop
         */
        export function resetWorldConfiguration(): globalThis.Promise<void>;
        export function resetWorldConfiguration(worldId: string): globalThis.Promise<void>;

        /**
         * Unregisters all dynamically-registered user scripts for this extension.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/user_scripts.json
         * @platform desktop
         */
        export function unregister(): globalThis.Promise<void>;
        export function unregister(filter: UserScriptFilter): globalThis.Promise<void>;

        /**
         * Updates one or more user scripts for this extension.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/user_scripts.json
         * @platform desktop
         */
        export function update(scripts: {
allFrames?: boolean;
excludeGlobs?: string[];
excludeMatches?: browser.manifest.MatchPattern[];
id: string;
includeGlobs?: string[];
js?: ScriptSource[];
matches?: browser.manifest.MatchPattern[];
runAt?: browser.extensionTypes.RunAt;
world?: ExecutionWorld;
worldId?: string;
}[]): globalThis.Promise<void>;

    }

    export namespace webNavigation {
        export interface EventUrlFilters {
            url: browser.events.UrlFilter[];
        }

        export type TransitionQualifier = "client_redirect" | "server_redirect" | "forward_back" | "from_address_bar";

        /**
         * Cause of the navigation. The same transition types as defined in the history API are used. These are the same transition types as defined in the browser.transition_types[history API] except with "start_page" in place of "auto_toplevel" (for backwards compatibility).
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_navigation.json
         */
        export type TransitionType = "link" | "typed" | "auto_bookmark" | "auto_subframe" | "manual_subframe" | "generated" | "start_page" | "form_submit" | "reload" | "keyword" | "keyword_generated";

        /**
         * Fired when a navigation is about to occur.
         */
        export const onBeforeNavigate: WebExtensionEvent<(details: {
frameId: number;
parentDocumentId?: string;
parentFrameId: number;
processId: number;
tabId: number;
timeStamp: number;
url: string;
}) => void>;

        /**
         * Fired when a navigation is committed. The document (and the resources it refers to, such as images and subframes) might still be downloading, but at least part of the document has been received from the server and the browser has decided to switch to the new document.
         */
        export const onCommitted: WebExtensionEvent<(details: {
documentId: string;
frameId: number;
parentDocumentId?: string;
processId: number;
tabId: number;
timeStamp: number;
transitionQualifiers: TransitionQualifier[];
transitionType: TransitionType;
url: string;
}) => void>;

        /**
         * Fired when a document, including the resources it refers to, is completely loaded and initialized.
         */
        export const onCompleted: WebExtensionEvent<(details: {
documentId: string;
frameId: number;
parentDocumentId?: string;
processId: number;
tabId: number;
timeStamp: number;
url: string;
}) => void>;

        /**
         * Fired when a new window, or a new tab in an existing window, is created to host a navigation.
         */
        export const onCreatedNavigationTarget: WebExtensionEvent<(details: {
sourceFrameId: number;
sourceProcessId: number;
sourceTabId: number;
tabId: number;
timeStamp: number;
url: string;
}) => void>;

        /**
         * Fired when the page's DOM is fully constructed, but the referenced resources may not finish loading.
         */
        export const onDOMContentLoaded: WebExtensionEvent<(details: {
documentId: string;
frameId: number;
parentDocumentId?: string;
processId: number;
tabId: number;
timeStamp: number;
url: string;
}) => void>;

        /**
         * Fired when an error occurs and the navigation is aborted. This can happen if either a network error occurred, or the user aborted the navigation.
         */
        export const onErrorOccurred: WebExtensionEvent<(details: {
documentId: string;
error: string;
frameId: number;
parentDocumentId?: string;
processId: number;
tabId: number;
timeStamp: number;
url: string;
}) => void>;

        /**
         * Fired when the frame's history was updated to a new URL. All future events for that frame will use the updated URL.
         */
        export const onHistoryStateUpdated: WebExtensionEvent<(details: {
documentId: string;
frameId: number;
parentDocumentId?: string;
processId: number;
tabId: number;
timeStamp: number;
transitionQualifiers: TransitionQualifier[];
transitionType: TransitionType;
url: string;
}) => void>;

        /**
         * Fired when the reference fragment of a frame was updated. All future events for that frame will use the updated URL.
         */
        export const onReferenceFragmentUpdated: WebExtensionEvent<(details: {
documentId: string;
frameId: number;
parentDocumentId?: string;
processId: number;
tabId: number;
timeStamp: number;
transitionQualifiers: TransitionQualifier[];
transitionType: TransitionType;
url: string;
}) => void>;

        /**
         * Fired when the contents of the tab is replaced by a different (usually previously pre-rendered) tab.
         */
        export const onTabReplaced: WebExtensionEvent<(details: {
replacedTabId: number;
tabId: number;
timeStamp: number;
}) => void>;

        /**
         * Retrieves information about all frames of a given tab.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_navigation.json
         * @platform desktop
         */
        export function getAllFrames(details: {
tabId: number;
}): globalThis.Promise<{
documentId: string;
errorOccurred?: boolean;
frameId: number;
parentDocumentId?: string;
parentFrameId: number;
processId: number;
tabId: number;
url: string;
}[]>;
        export function getAllFrames(details: {
tabId: number;
}, callback: ((details: {
documentId: string;
errorOccurred?: boolean;
frameId: number;
parentDocumentId?: string;
parentFrameId: number;
processId: number;
tabId: number;
url: string;
}[]) => void)): void;

        /**
         * Retrieves information about the given frame. A frame refers to an <iframe> or a <frame> of a web page and is identified by a tab ID and a frame ID, or by its document ID.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_navigation.json
         * @platform desktop
         */
        export function getFrame(details: {
documentId?: string;
frameId?: number;
processId?: number;
tabId?: number;
}): globalThis.Promise<{
documentId: string;
errorOccurred?: boolean;
frameId: number;
parentDocumentId?: string;
parentFrameId: number;
tabId: number;
url: string;
}>;
        export function getFrame(details: {
documentId?: string;
frameId?: number;
processId?: number;
tabId?: number;
}, callback: ((details: {
documentId: string;
errorOccurred?: boolean;
frameId: number;
parentDocumentId?: string;
parentFrameId: number;
tabId: number;
url: string;
}) => void)): void;

    }

    export namespace webRequest {
        /**
         * Returns value for event handlers that have the 'blocking' extraInfoSpec applied. Allows the event handler to modify network requests.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         */
        export interface BlockingResponse {
            /**
             * Only used as a response to the onAuthRequired event. If set, the request is made using the supplied credentials.
             */
            authCredentials?: {
password: string;
username: string;
};
            /**
             * If true, the request is cancelled. Used in onBeforeRequest, this prevents the request from being sent.
             */
            cancel?: boolean;
            /**
             * Only used as a response to the onBeforeRequest and onHeadersReceived events. If set, the original request is prevented from being sent/completed and is instead redirected to the given URL. Redirections to non-HTTP schemes such as data: are allowed. Redirects initiated by a redirect action use the original request method for the redirect, with one exception: If the redirect is initiated at the onHeadersReceived stage, then the redirect will be issued using the GET method.
             */
            redirectUrl?: string;
            /**
             * Only used as a response to the onBeforeSendHeaders event. If set, the request is made with these request headers instead.
             */
            requestHeaders?: HttpHeaders;
            /**
             * Only used as a response to the onHeadersReceived event. If set, the server is assumed to have responded with these response headers instead. Only return responseHeaders if you really want to modify the headers in order to limit the number of conflicts (only one extension may modify responseHeaders for each request).
             */
            responseHeaders?: HttpHeaders;
            /**
             * Only used as a response to the onBeforeRequest event. If set, the original request is prevented from being sent/completed and is instead upgraded to a secure request.  If any extension returns redirectUrl during onBeforeRequest, upgradeToSecure will have no affect.
             */
            upgradeToSecure?: boolean;
        }

        /**
         * Contains the certificate properties of the request if it is a secure request.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         */
        export interface CertificateInfo {
            fingerprint: {
sha1: string;
sha256: string;
};
            isBuiltInRoot: boolean;
            issuer: string;
            rawDER?: number[];
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

        export type CertificateTransparencyStatus = "not_applicable" | "policy_compliant" | "policy_not_enough_scts" | "policy_not_diverse_scts";

        /**
         * An array of HTTP headers. Each header is represented as a dictionary containing the keys name and either value or binaryValue.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         */
        export type HttpHeaders = {
binaryValue?: number[];
name: string;
value?: string;
}[];

        export type OnAuthRequiredOptions = "responseHeaders" | "blocking" | "asyncBlocking";

        export type OnBeforeRedirectOptions = "responseHeaders";

        export type OnBeforeRequestOptions = "blocking" | "requestBody";

        export type OnBeforeSendHeadersOptions = "requestHeaders" | "blocking";

        export type OnCompletedOptions = "responseHeaders";

        export type OnHeadersReceivedOptions = "blocking" | "responseHeaders";

        export type OnResponseStartedOptions = "responseHeaders";

        export type OnSendHeadersOptions = "requestHeaders";

        /**
         * An object describing filters to apply to webRequest events.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         */
        export interface RequestFilter {
            /**
             * If provided, requests that do not match the incognito state will be filtered out.
             */
            incognito?: boolean;
            tabId?: number;
            /**
             * A list of request types. Requests that cannot match any of the types will be filtered out.
             */
            types?: ResourceType[];
            /**
             * A list of URLs or URL patterns. Requests that cannot match any of the URLs will be filtered out.
             */
            urls: string[];
            windowId?: number;
        }

        export type ResourceType = "main_frame" | "sub_frame" | "stylesheet" | "script" | "image" | "object" | "xmlhttprequest" | "xslt" | "ping" | "beacon" | "xml_dtd" | "font" | "media" | "websocket" | "csp_report" | "imageset" | "web_manifest" | "speculative" | "json" | "other";

        /**
         * Contains the security properties of the request (ie. SSL/TLS information).
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         */
        export interface SecurityInfo {
            /**
             * Certificate transparency compliance per RFC 6962.  See https://www.certificate-transparency.org/what-is-ct for more information.
             */
            certificateTransparencyStatus?: CertificateTransparencyStatus;
            /**
             * Certificate data if state is "secure".  Will only contain one entry unless certificateChain is passed as an option.
             */
            certificates: CertificateInfo[];
            /**
             * The cipher suite used in this request if state is "secure".
             */
            cipherSuite?: string;
            /**
             * Error message if state is "broken"
             */
            errorMessage?: string;
            /**
             * True if host uses Public Key Pinning and state is "secure".
             */
            hpkp?: string;
            /**
             * True if host uses Strict Transport Security and state is "secure".
             */
            hsts?: boolean;
            /**
             * The domain name does not match the certificate domain.
             */
            isDomainMismatch?: boolean;
            isExtendedValidation?: boolean;
            /**
             * The certificate is either expired or is not yet valid.  See CertificateInfo.validity for start and end dates.
             */
            isNotValidAtThisTime?: boolean;
            isUntrusted?: boolean;
            /**
             * The key exchange algorithm used in this request if state is "secure".
             */
            keaGroupName?: string;
            /**
             * The type of certificate error that was overridden for this connection, if any.
             */
            overridableErrorCategory?: "trust_error" | "domain_mismatch" | "expired_or_not_yet_valid";
            /**
             * Protocol version if state is "secure"
             */
            protocolVersion?: "TLSv1" | "TLSv1.1" | "TLSv1.2" | "TLSv1.3" | "unknown";
            /**
             * The length (in bits) of the secret key.
             */
            secretKeyLength?: number;
            /**
             * The signature scheme used in this request if state is "secure".
             */
            signatureSchemeName?: string;
            state: "insecure" | "weak" | "broken" | "secure";
            /**
             * True if the TLS connection used Delegated Credentials.
             */
            usedDelegatedCredentials?: boolean;
            /**
             * True if the TLS connection used Encrypted Client Hello.
             */
            usedEch?: boolean;
            /**
             * True if the TLS connection made OCSP requests.
             */
            usedOcsp?: boolean;
            /**
             * True if the TLS connection used a privacy-preserving DNS transport like DNS-over-HTTPS.
             */
            usedPrivateDns?: boolean;
            /**
             * list of reasons that cause the request to be considered weak, if state is "weak"
             */
            weaknessReasons?: TransportWeaknessReasons[];
        }

        export type TransportWeaknessReasons = "cipher";

        /**
         * Contains data uploaded in a URL request.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         */
        export interface UploadData {
            /**
             * An ArrayBuffer with a copy of the data.
             */
            bytes?: ArrayBuffer;
            /**
             * A string with the file's path and name.
             */
            file?: string;
        }

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
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         */
        export type UrlClassificationFlags = "fingerprinting" | "fingerprinting_content" | "cryptomining" | "cryptomining_content" | "emailtracking" | "emailtracking_content" | "tracking" | "tracking_ad" | "tracking_analytics" | "tracking_social" | "tracking_content" | "any_basic_tracking" | "any_strict_tracking" | "any_social_tracking" | "consentmanager" | "antifraud";

        /**
         * If the request has been classified this is an array of browser.UrlClassificationFlags.
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         */
        export type UrlClassificationParty = UrlClassificationFlags[];

        export const MAX_HANDLER_BEHAVIOR_CHANGED_CALLS_PER_10_MINUTES: number;
        /**
         * Fired when an authentication failure is received. The listener has three options: it can provide authentication credentials, it can cancel the request and display the error page, or it can take no action on the challenge. If bad user credentials are provided, this may be called multiple times for the same request.
         */
        export const onAuthRequired: WebExtensionWebRequestEvent<(details: {
challenger: {
host: string;
port: number;
};
cookieStoreId?: string;
documentId?: string;
documentUrl?: string;
frameId: number;
incognito?: boolean;
isProxy: boolean;
method: string;
originUrl?: string;
parentDocumentId?: string;
parentFrameId: number;
realm?: string;
requestId: string;
responseHeaders?: HttpHeaders;
scheme: string;
statusCode: number;
statusLine: string;
tabId: number;
thirdParty: boolean;
timeStamp: number;
type: ResourceType;
url: string;
urlClassification?: UrlClassification;
}, asyncCallback: ((response: BlockingResponse) => void)) => browser.webRequest.BlockingResponse | Promise<browser.webRequest.BlockingResponse> | void>;

        /**
         * Fired when a server-initiated redirect is about to occur.
         */
        export const onBeforeRedirect: WebExtensionWebRequestEvent<(details: {
cookieStoreId?: string;
documentId?: string;
documentUrl?: string;
frameId: number;
fromCache: boolean;
incognito?: boolean;
ip?: string;
method: string;
originUrl?: string;
parentDocumentId?: string;
parentFrameId: number;
redirectUrl: string;
requestId: string;
responseHeaders?: HttpHeaders;
statusCode: number;
statusLine: string;
tabId: number;
thirdParty: boolean;
timeStamp: number;
type: ResourceType;
url: string;
urlClassification?: UrlClassification;
}) => browser.webRequest.BlockingResponse | Promise<browser.webRequest.BlockingResponse> | void>;

        /**
         * Fired when a request is about to occur.
         */
        export const onBeforeRequest: WebExtensionWebRequestEvent<(details: {
cookieStoreId?: string;
documentId?: string;
documentUrl?: string;
frameId: number;
incognito?: boolean;
method: string;
originUrl?: string;
parentDocumentId?: string;
parentFrameId: number;
requestBody?: {
error?: string;
formData?: Record<string, unknown>;
raw?: UploadData[];
};
requestId: string;
tabId: number;
thirdParty: boolean;
timeStamp: number;
type: ResourceType;
url: string;
urlClassification?: UrlClassification;
}) => browser.webRequest.BlockingResponse | Promise<browser.webRequest.BlockingResponse> | void>;

        /**
         * Fired before sending an HTTP request, once the request headers are available. This may occur after a TCP connection is made to the server, but before any HTTP data is sent.
         */
        export const onBeforeSendHeaders: WebExtensionWebRequestEvent<(details: {
cookieStoreId?: string;
documentId?: string;
documentUrl?: string;
frameId: number;
incognito?: boolean;
method: string;
originUrl?: string;
parentDocumentId?: string;
parentFrameId: number;
requestHeaders?: HttpHeaders;
requestId: string;
tabId: number;
thirdParty: boolean;
timeStamp: number;
type: ResourceType;
url: string;
urlClassification?: UrlClassification;
}) => browser.webRequest.BlockingResponse | Promise<browser.webRequest.BlockingResponse> | void>;

        /**
         * Fired when a request is completed.
         */
        export const onCompleted: WebExtensionWebRequestEvent<(details: {
cookieStoreId?: string;
documentId?: string;
documentUrl?: string;
frameId: number;
fromCache: boolean;
incognito?: boolean;
ip?: string;
method: string;
originUrl?: string;
parentDocumentId?: string;
parentFrameId: number;
requestId: string;
requestSize: number;
responseHeaders?: HttpHeaders;
responseSize: number;
statusCode: number;
statusLine: string;
tabId: number;
thirdParty: boolean;
timeStamp: number;
type: ResourceType;
url: string;
urlClassification: UrlClassification;
}) => browser.webRequest.BlockingResponse | Promise<browser.webRequest.BlockingResponse> | void>;

        /**
         * Fired when an error occurs.
         */
        export const onErrorOccurred: WebExtensionWebRequestEvent<(details: {
cookieStoreId?: string;
documentId?: string;
documentUrl?: string;
error: string;
frameId: number;
fromCache: boolean;
incognito?: boolean;
ip?: string;
method: string;
originUrl?: string;
parentDocumentId?: string;
parentFrameId: number;
requestId: string;
tabId: number;
thirdParty: boolean;
timeStamp: number;
type: ResourceType;
url: string;
urlClassification?: UrlClassification;
}) => browser.webRequest.BlockingResponse | Promise<browser.webRequest.BlockingResponse> | void>;

        /**
         * Fired when HTTP response headers of a request have been received.
         */
        export const onHeadersReceived: WebExtensionWebRequestEvent<(details: {
cookieStoreId?: string;
documentId?: string;
documentUrl?: string;
frameId: number;
incognito?: boolean;
method: string;
originUrl?: string;
parentDocumentId?: string;
parentFrameId: number;
requestId: string;
responseHeaders?: HttpHeaders;
statusCode: number;
statusLine: string;
tabId: number;
thirdParty: boolean;
timeStamp: number;
type: ResourceType;
url: string;
urlClassification?: UrlClassification;
}) => browser.webRequest.BlockingResponse | Promise<browser.webRequest.BlockingResponse> | void>;

        /**
         * Fired when the first byte of the response body is received. For HTTP requests, this means that the status line and response headers are available.
         */
        export const onResponseStarted: WebExtensionWebRequestEvent<(details: {
cookieStoreId?: string;
documentId?: string;
documentUrl?: string;
frameId: number;
fromCache: boolean;
incognito?: boolean;
ip?: string;
method: string;
originUrl?: string;
parentDocumentId?: string;
parentFrameId: number;
requestId: string;
responseHeaders?: HttpHeaders;
statusCode: number;
statusLine: string;
tabId: number;
thirdParty: boolean;
timeStamp: number;
type: ResourceType;
url: string;
urlClassification?: UrlClassification;
}) => browser.webRequest.BlockingResponse | Promise<browser.webRequest.BlockingResponse> | void>;

        /**
         * Fired just before a request is going to be sent to the server (modifications of previous onBeforeSendHeaders callbacks are visible by the time onSendHeaders is fired).
         */
        export const onSendHeaders: WebExtensionWebRequestEvent<(details: {
cookieStoreId?: string;
documentId?: string;
documentUrl?: string;
frameId: number;
incognito?: boolean;
method: string;
originUrl?: string;
parentDocumentId?: string;
parentFrameId: number;
requestHeaders?: HttpHeaders;
requestId: string;
tabId: number;
thirdParty: boolean;
timeStamp: number;
type: ResourceType;
url: string;
urlClassification?: UrlClassification;
}) => browser.webRequest.BlockingResponse | Promise<browser.webRequest.BlockingResponse> | void>;

        /**
         * ...
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         * @permission webRequestBlocking
         * @platform desktop
         */
        export function filterResponseData(requestId: string): Record<string, unknown>;

        /**
         * Retrieves the security information for the request.  Returns a promise that will resolve to a SecurityInfo object.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         * @platform desktop
         */
        export function getSecurityInfo(requestId: string, options?: {
certificateChain?: boolean;
rawDER?: boolean;
}): globalThis.Promise<void>;

        /**
         * Needs to be called when the behavior of the webRequest handlers has changed to prevent incorrect handling due to caching. This function call is expensive. Don't call it often.
         *
         * @see https://searchfox.org/mozilla-central/source/toolkit/components/extensions/schemas/web_request.json
         * @platform desktop
         */
        export function handlerBehaviorChanged(): globalThis.Promise<void>;
        export function handlerBehaviorChanged(callback: (() => void)): void;

    }

    export namespace windows {
        /**
         * Specifies what type of browser window to create. The 'panel' and 'detached_panel' types create a popup unless the '--enable-panels' flag is set.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/windows.json
         */
        export type CreateType = "normal" | "popup" | "panel" | "detached_panel";

        /**
         * Specifies whether the browser.windows.Window returned should contain a list of the browser.tabs.Tab objects.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/windows.json
         */
        export interface GetInfo {
            /**
             * If true, the browser.windows.Window returned will have a tabs property that contains a list of the browser.tabs.Tab objects. The Tab objects only contain the url, title and favIconUrl properties if the extension's manifest file includes the "tabs" permission.
             */
            populate?: boolean;
            /**
             * windowTypes is deprecated and ignored on Firefox.
             */
            windowTypes?: WindowType[];
        }

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
             * The height of the window, including the frame, in pixels. Under some circumstances a Window may not be assigned height property, for example when querying closed windows from the browser.sessions API.
             */
            height?: number;
            /**
             * The ID of the window. Window IDs are unique within a browser session. Under some circumstances a Window may not be assigned an ID, for example when querying windows using the browser.sessions API, in which case a session ID may be present.
             */
            id?: number;
            /**
             * Whether the window is incognito.
             */
            incognito: boolean;
            /**
             * The offset of the window from the left edge of the screen in pixels. Under some circumstances a Window may not be assigned left property, for example when querying closed windows from the browser.sessions API.
             */
            left?: number;
            /**
             * The session ID used to uniquely identify a Window obtained from the browser.sessions API.
             */
            sessionId?: string;
            /**
             * The state of this browser window.
             */
            state?: WindowState;
            /**
             * Array of browser.tabs.Tab objects representing the current tabs in the window.
             */
            tabs?: browser.tabs.Tab[];
            /**
             * The title of the window. Read-only.
             */
            title?: string;
            /**
             * The offset of the window from the top edge of the screen in pixels. Under some circumstances a Window may not be assigned top property, for example when querying closed windows from the browser.sessions API.
             */
            top?: number;
            /**
             * The type of browser window this is.
             */
            type?: WindowType;
            /**
             * The width of the window, including the frame, in pixels. Under some circumstances a Window may not be assigned width property, for example when querying closed windows from the browser.sessions API.
             */
            width?: number;
        }

        /**
         * The state of this browser window. Under some circumstances a Window may not be assigned state property, for example when querying closed windows from the browser.sessions API.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/windows.json
         */
        export type WindowState = "normal" | "minimized" | "maximized" | "fullscreen" | "docked";

        /**
         * The type of browser window this is. Under some circumstances a Window may not be assigned type property, for example when querying closed windows from the browser.sessions API.
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/windows.json
         */
        export type WindowType = "normal" | "popup" | "panel" | "app" | "devtools";

        export const WINDOW_ID_CURRENT: number;
        export const WINDOW_ID_NONE: number;
        /**
         * Fired when a window is created.
         */
        export const onCreated: WebExtensionEvent<(window: Window) => void>;

        /**
         * Fired when the currently focused window changes. Will be browser.windows.WINDOW_ID_NONE if all browser windows have lost focus. Note: On some Linux window managers, WINDOW_ID_NONE will always be sent immediately preceding a switch from one browser window to another.
         */
        export const onFocusChanged: WebExtensionEvent<(windowId: number) => void>;

        /**
         * Fired when a window is removed (closed).
         */
        export const onRemoved: WebExtensionEvent<(windowId: number) => void>;

        /**
         * Creates (opens) a new browser with any optional sizing, position or default URL provided.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/windows.json
         * @platform desktop
         */
        export function create(): globalThis.Promise<Window>;
        export function create(callback: ((window: Window) => void)): void;
        export function create(createData: {
allowScriptsToClose?: boolean;
cookieStoreId?: string;
focused?: true | false;
height?: number;
incognito?: boolean;
left?: number;
state?: WindowState;
tabId?: number;
titlePreface?: string;
top?: number;
type?: CreateType;
url?: string | string[];
width?: number;
}): globalThis.Promise<Window>;
        export function create(createData: {
allowScriptsToClose?: boolean;
cookieStoreId?: string;
focused?: true | false;
height?: number;
incognito?: boolean;
left?: number;
state?: WindowState;
tabId?: number;
titlePreface?: string;
top?: number;
type?: CreateType;
url?: string | string[];
width?: number;
}, callback: ((window: Window) => void)): void;

        /**
         * Gets details about a window.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/windows.json
         * @platform desktop
         */
        export function get(windowId: number, getInfo?: GetInfo): globalThis.Promise<Window>;
        export function get(windowId: number, getInfo: GetInfo, callback: ((window: Window) => void)): void;
        export function get(windowId: number, callback: ((window: Window) => void)): void;

        /**
         * Gets all windows.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/windows.json
         * @platform desktop
         */
        export function getAll(): globalThis.Promise<Window[]>;
        export function getAll(callback: ((windows: Window[]) => void)): void;
        export function getAll(getInfo: {
populate?: boolean;
windowTypes?: WindowType[];
}): globalThis.Promise<Window[]>;
        export function getAll(getInfo: {
populate?: boolean;
windowTypes?: WindowType[];
}, callback: ((windows: Window[]) => void)): void;

        /**
         * Gets the browser.current-window[current window].
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/windows.json
         * @platform desktop
         */
        export function getCurrent(): globalThis.Promise<Window>;
        export function getCurrent(callback: ((window: Window) => void)): void;
        export function getCurrent(getInfo: GetInfo): globalThis.Promise<Window>;
        export function getCurrent(getInfo: GetInfo, callback: ((window: Window) => void)): void;

        /**
         * Gets the window that was most recently focused — typically the window 'on top'.
         *
         * @see https://searchfox.org/mozilla-central/source/browser/components/extensions/schemas/windows.json
         * @platform desktop
         */
        export function getLastFocused(): globalThis.Promise<Window>;
        export function getLastFocused(callback: ((window: Window) => void)): void;
        export function getLastFocused(getInfo: GetInfo): globalThis.Promise<Window>;
        export function getLastFocused(getInfo: GetInfo, callback: ((window: Window) => void)): void;

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
        export function update(windowId: number, updateInfo: {
drawAttention?: boolean;
focused?: boolean;
height?: number;
left?: number;
state?: WindowState;
titlePreface?: string;
top?: number;
width?: number;
}): globalThis.Promise<Window>;
        export function update(windowId: number, updateInfo: {
drawAttention?: boolean;
focused?: boolean;
height?: number;
left?: number;
state?: WindowState;
titlePreface?: string;
top?: number;
width?: number;
}, callback: ((window: Window) => void)): void;

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
    export import normandyAddonStudy = browser.normandyAddonStudy;
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
    export import test = browser.test;
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
