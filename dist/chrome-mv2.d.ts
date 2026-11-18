// Type definitions for Firefox WebExtensions
// Project: firefox-webextension-types
// Target: Desktop
// Firefox Version: 162.0a1
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

import { browser, type Normalizable, type Normalized } from "./index.js";

/**
 * `chrome` in a page or devtools page of a Manifest V2 extension. Every async
 * function takes a callback and returns undefined, even when it is called
 * without one. Content scripts get the same object as `browser`.
 */
export namespace chrome {
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
        export import ColorArray = browser.action.ColorArray;
        export import ColorValue = browser.action.ColorValue;
        export import Details = browser.action.Details;
        export import ImageDataType = browser.action.ImageDataType;
        export import OnClickData = browser.action.OnClickData;
        export import onClicked = browser.action.onClicked;
        export import onUserSettingsChanged = browser.action.onUserSettingsChanged;
        /**
         * Disables the browser action for a tab.
         *
         * @param tabId The id of the tab for which you want to modify the browser action.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_action.json
         */
        export function disable(tabId?: number | null): void;
        export function disable(tabId: number | null | undefined, callback: (() => void)): void;
        export function disable(callback: (() => void)): void;
        /**
         * Enables the browser action for a tab. By default, browser actions are enabled.
         *
         * @param tabId The id of the tab for which you want to modify the browser action.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_action.json
         */
        export function enable(tabId?: number | null): void;
        export function enable(tabId: number | null | undefined, callback: (() => void)): void;
        export function enable(callback: (() => void)): void;
        /**
         * Gets the background color of the browser action badge.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_action.json
         */
        export function getBadgeBackgroundColor(details: Details): void;
        export function getBadgeBackgroundColor(details: Details, callback: ((result: ColorArray) => void)): void;
        /**
         * Gets the badge text of the browser action. If no tab nor window is specified is specified, the global badge text is returned.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_action.json
         */
        export function getBadgeText(details: Details): void;
        export function getBadgeText(details: Details, callback: ((result: string) => void)): void;
        /**
         * Gets the text color of the browser action badge.
         *
         * @returns The text color of the badge.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_action.json
         */
        export function getBadgeTextColor(details: Details): void;
        export function getBadgeTextColor(details: Details, callback: ((result: ColorArray) => void)): void;
        /**
         * Gets the html document set as the popup for this browser action.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_action.json
         */
        export function getPopup(details: Details): void;
        export function getPopup(details: Details, callback: ((result: string) => void)): void;
        /**
         * Gets the title of the browser action.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_action.json
         */
        export function getTitle(details: Details): void;
        export function getTitle(details: Details, callback: ((result: string) => void)): void;
        /**
         * Returns the user-specified settings relating to an extension's action.
         *
         * @returns The collection of user-specified settings relating to an extension's action.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_action.json
         */
        export function getUserSettings(): void;
        export function getUserSettings(callback: ((userSettings: getUserSettings.Result) => void)): void;
        export namespace getUserSettings {
            export type Result = browser.action.getUserSettings.Result;
        }
        /**
         * Checks whether the browser action is enabled.
         *
         * @param details
         * - `number`: The id of the tab for which you want to query its enabled state.
         * @returns Whether the browser action is enabled.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_action.json
         */
        export function isEnabled(details?: Details | number | null): void;
        export function isEnabled(details: Details | number | null | undefined, callback: ((result: boolean) => void)): void;
        export function isEnabled(callback: ((result: boolean) => void)): void;
        /**
         * Opens the extension popup window in the specified window.
         *
         * @param options An object with information about the popup to open.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_action.json
         */
        export function openPopup(options?: openPopup.Options | null): void;
        export namespace openPopup {
            export type Options = browser.action.openPopup.Options;
        }
        /**
         * Sets the background color for the badge.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_action.json
         */
        export function setBadgeBackgroundColor(details: setBadgeBackgroundColor.Details): void;
        export function setBadgeBackgroundColor(details: setBadgeBackgroundColor.Details, callback: (() => void)): void;
        export namespace setBadgeBackgroundColor {
            export type Details = browser.action.setBadgeBackgroundColor.Details;
        }
        /**
         * Sets the badge text for the browser action. The badge is displayed on top of the icon.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_action.json
         */
        export function setBadgeText(details: setBadgeText.Details): void;
        export function setBadgeText(details: setBadgeText.Details, callback: (() => void)): void;
        export namespace setBadgeText {
            export type Details = browser.action.setBadgeText.Details;
        }
        /**
         * Sets the text color for the badge.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_action.json
         */
        export function setBadgeTextColor(details: setBadgeTextColor.Details): void;
        export namespace setBadgeTextColor {
            export type Details = browser.action.setBadgeTextColor.Details;
        }
        /**
         * Sets the icon for the browser action. The icon can be specified either as the path to an image file or as the pixel data from a canvas element, or as dictionary of either one of those. Either the **path** or the **imageData** property must be specified.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_action.json
         */
        export function setIcon(details: setIcon.Details): void;
        export function setIcon(details: setIcon.Details, callback: (() => void)): void;
        export namespace setIcon {
            export type Details = browser.action.setIcon.Details;
        }
        /**
         * Sets the html document to be opened as a popup when the user clicks on the browser action's icon.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_action.json
         */
        export function setPopup(details: setPopup.Details): void;
        export function setPopup(details: setPopup.Details, callback: (() => void)): void;
        export namespace setPopup {
            export type Details = browser.action.setPopup.Details;
        }
        /**
         * Sets the title of the browser action. This shows up in the tooltip.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_action.json
         */
        export function setTitle(details: setTitle.Details): void;
        export function setTitle(details: setTitle.Details, callback: (() => void)): void;
        export namespace setTitle {
            export type Details = browser.action.setTitle.Details;
        }
    }
    export import activityLog = browser.activityLog;
    /**
     * Not available in content scripts or devtools pages.
     *
     * @permission alarms
     * @platform desktop, mobile
     */
    export namespace alarms {
        export import Alarm = browser.alarms.Alarm;
        export import onAlarm = browser.alarms.onAlarm;
        /**
         * Clears the alarm with the given name.
         *
         * @param name The name of the alarm to clear. Defaults to the empty string.
         * @returns Whether an alarm of the given name was found to clear.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/alarms.json
         */
        export function clear(name?: string | null): void;
        export function clear(name: string | null | undefined, callback: ((wasCleared: boolean) => void)): void;
        export function clear(callback: ((wasCleared: boolean) => void)): void;
        /**
         * Clears all alarms.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/alarms.json
         */
        export function clearAll(): void;
        export function clearAll(callback: (() => void)): void;
        /**
         * Creates an alarm. After the delay is expired, the onAlarm event is fired. If there is another alarm with the same name (or no name if none is specified), it will be cancelled and replaced by this alarm.
         *
         * @param name Optional name to identify this alarm. Defaults to the empty string.
         * @param alarmInfo Details about the alarm. The alarm first fires either at 'when' milliseconds past the epoch (if 'when' is provided), after 'delayInMinutes' minutes from the current time (if 'delayInMinutes' is provided instead), or after 'periodInMinutes' minutes from the current time (if only 'periodInMinutes' is provided). Users should never provide both 'when' and 'delayInMinutes'. If 'periodInMinutes' is provided, then the alarm recurs repeatedly after that many minutes.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/alarms.json
         */
        export function create(name: string | null | undefined, alarmInfo: create.AlarmInfo): void;
        export function create(alarmInfo: create.AlarmInfo): void;
        export function create(name: string | null | undefined, alarmInfo: create.AlarmInfo, callback: (() => void)): void;
        export function create(alarmInfo: create.AlarmInfo, callback: (() => void)): void;
        export namespace create {
            export type AlarmInfo = browser.alarms.create.AlarmInfo;
        }
        /**
         * Retrieves details about the specified alarm.
         *
         * @param name The name of the alarm to get. Defaults to the empty string.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/alarms.json
         */
        export function get(name?: string | null): void;
        export function get(name: string | null | undefined, callback: ((alarm: Alarm | undefined) => void)): void;
        export function get(callback: ((alarm: Alarm | undefined) => void)): void;
        /**
         * Gets an array of all the alarms.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/alarms.json
         */
        export function getAll(): void;
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
        export import BookmarkTreeNode = browser.bookmarks.BookmarkTreeNode;
        export import BookmarkTreeNodeType = browser.bookmarks.BookmarkTreeNodeType;
        export import BookmarkTreeNodeUnmodifiable = browser.bookmarks.BookmarkTreeNodeUnmodifiable;
        export import CreateDetails = browser.bookmarks.CreateDetails;
        export import onChanged = browser.bookmarks.onChanged;
        export import onChildrenReordered = browser.bookmarks.onChildrenReordered;
        export import onCreated = browser.bookmarks.onCreated;
        export import onImportBegan = browser.bookmarks.onImportBegan;
        export import onImportEnded = browser.bookmarks.onImportEnded;
        export import onMoved = browser.bookmarks.onMoved;
        export import onRemoved = browser.bookmarks.onRemoved;
        /**
         * Creates a bookmark or folder under the specified parentId.  If url is NULL or missing, it will be a folder.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/bookmarks.json
         */
        export function create(bookmark: CreateDetails): void;
        export function create(bookmark: CreateDetails, callback: ((result: BookmarkTreeNode) => void)): void;
        /**
         * Retrieves the specified BookmarkTreeNode(s).
         *
         * @param idOrIdList A single string-valued id, or an array of string-valued ids
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/bookmarks.json
         */
        export function get(idOrIdList: string | string[]): void;
        export function get(idOrIdList: string | string[], callback: ((results: BookmarkTreeNode[]) => void)): void;
        /**
         * Retrieves the children of the specified BookmarkTreeNode id.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/bookmarks.json
         */
        export function getChildren(id: string): void;
        export function getChildren(id: string, callback: ((results: BookmarkTreeNode[]) => void)): void;
        /**
         * Retrieves the recently added bookmarks.
         *
         * @param numberOfItems The maximum number of items to return.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/bookmarks.json
         */
        export function getRecent(numberOfItems: number): void;
        export function getRecent(numberOfItems: number, callback: ((results: BookmarkTreeNode[]) => void)): void;
        /**
         * Retrieves part of the Bookmarks hierarchy, starting at the specified node.
         *
         * @param id The ID of the root of the subtree to retrieve.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/bookmarks.json
         */
        export function getSubTree(id: string): void;
        export function getSubTree(id: string, callback: ((results: BookmarkTreeNode[]) => void)): void;
        /**
         * Retrieves the entire Bookmarks hierarchy.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/bookmarks.json
         */
        export function getTree(): void;
        export function getTree(callback: ((results: BookmarkTreeNode[]) => void)): void;
        /**
         * Moves the specified BookmarkTreeNode to the provided location.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/bookmarks.json
         */
        export function move(id: string, destination: move.Destination): void;
        export function move(id: string, destination: move.Destination, callback: ((result: BookmarkTreeNode) => void)): void;
        export namespace move {
            export type Destination = browser.bookmarks.move.Destination;
        }
        /**
         * Removes a bookmark or an empty bookmark folder.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/bookmarks.json
         */
        export function remove(id: string): void;
        export function remove(id: string, callback: (() => void)): void;
        /**
         * Recursively removes a bookmark folder.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/bookmarks.json
         */
        export function removeTree(id: string): void;
        export function removeTree(id: string, callback: (() => void)): void;
        /**
         * Searches for BookmarkTreeNodes matching the given query. Queries specified with an object produce BookmarkTreeNodes matching all specified properties.
         *
         * @param query Either a string of words that are matched against bookmark URLs and titles, or an object. If an object, the properties `query`, `url`, and `title` may be specified and bookmarks matching all specified properties will be produced.
         * - `string`: A string of words that are matched against bookmark URLs and titles.
         * - `object`: An object specifying properties and values to match when searching. Produces bookmarks matching all properties.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/bookmarks.json
         */
        export function search(query: string | {
            /**
             * A string of words that are matched against bookmark URLs and titles.
             */
            query?: string | null | undefined;
            /**
             * The title of the bookmark; matches verbatim.
             */
            title?: string | null | undefined;
            /**
             * The URL of the bookmark; matches verbatim. Note that folders have no URL.
             */
            url?: string | null | undefined;
        }): void;
        export function search(query: string | {
            /**
             * A string of words that are matched against bookmark URLs and titles.
             */
            query?: string | null | undefined;
            /**
             * The title of the bookmark; matches verbatim.
             */
            title?: string | null | undefined;
            /**
             * The URL of the bookmark; matches verbatim. Note that folders have no URL.
             */
            url?: string | null | undefined;
        }, callback: ((results: BookmarkTreeNode[]) => void)): void;
        /**
         * Updates the properties of a bookmark or folder. Specify only the properties that you want to change; unspecified properties will be left unchanged.  **Note:** Currently, only 'title' and 'url' are supported.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/bookmarks.json
         */
        export function update(id: string, changes: update.Changes): void;
        export function update(id: string, changes: update.Changes, callback: ((result: BookmarkTreeNode) => void)): void;
        export namespace update {
            export type Changes = browser.bookmarks.update.Changes;
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
        export import ColorArray = browser.browserAction.ColorArray;
        export import ColorValue = browser.browserAction.ColorValue;
        export import Details = browser.browserAction.Details;
        export import ImageDataType = browser.browserAction.ImageDataType;
        export import OnClickData = browser.browserAction.OnClickData;
        export import onClicked = browser.browserAction.onClicked;
        export import onUserSettingsChanged = browser.browserAction.onUserSettingsChanged;
        /**
         * Disables the browser action for a tab.
         *
         * @param tabId The id of the tab for which you want to modify the browser action.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_action.json
         */
        export function disable(tabId?: number | null): void;
        export function disable(tabId: number | null | undefined, callback: (() => void)): void;
        export function disable(callback: (() => void)): void;
        /**
         * Enables the browser action for a tab. By default, browser actions are enabled.
         *
         * @param tabId The id of the tab for which you want to modify the browser action.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_action.json
         */
        export function enable(tabId?: number | null): void;
        export function enable(tabId: number | null | undefined, callback: (() => void)): void;
        export function enable(callback: (() => void)): void;
        /**
         * Gets the background color of the browser action badge.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_action.json
         */
        export function getBadgeBackgroundColor(details: Details): void;
        export function getBadgeBackgroundColor(details: Details, callback: ((result: ColorArray) => void)): void;
        /**
         * Gets the badge text of the browser action. If no tab nor window is specified is specified, the global badge text is returned.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_action.json
         */
        export function getBadgeText(details: Details): void;
        export function getBadgeText(details: Details, callback: ((result: string) => void)): void;
        /**
         * Gets the text color of the browser action badge.
         *
         * @returns The text color of the badge.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_action.json
         */
        export function getBadgeTextColor(details: Details): void;
        export function getBadgeTextColor(details: Details, callback: ((result: ColorArray) => void)): void;
        /**
         * Gets the html document set as the popup for this browser action.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_action.json
         */
        export function getPopup(details: Details): void;
        export function getPopup(details: Details, callback: ((result: string) => void)): void;
        /**
         * Gets the title of the browser action.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_action.json
         */
        export function getTitle(details: Details): void;
        export function getTitle(details: Details, callback: ((result: string) => void)): void;
        /**
         * Returns the user-specified settings relating to an extension's action.
         *
         * @returns The collection of user-specified settings relating to an extension's action.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_action.json
         */
        export function getUserSettings(): void;
        export function getUserSettings(callback: ((userSettings: getUserSettings.Result) => void)): void;
        export namespace getUserSettings {
            export type Result = browser.browserAction.getUserSettings.Result;
        }
        /**
         * Checks whether the browser action is enabled.
         *
         * @param details
         * - `number`: The id of the tab for which you want to query its enabled state.
         * @returns Whether the browser action is enabled.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_action.json
         */
        export function isEnabled(details?: Details | number | null): void;
        export function isEnabled(details: Details | number | null | undefined, callback: ((result: boolean) => void)): void;
        export function isEnabled(callback: ((result: boolean) => void)): void;
        /**
         * Opens the extension popup window in the specified window.
         *
         * @param options An object with information about the popup to open.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_action.json
         */
        export function openPopup(options?: openPopup.Options | null): void;
        export namespace openPopup {
            export type Options = browser.browserAction.openPopup.Options;
        }
        /**
         * Sets the background color for the badge.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_action.json
         */
        export function setBadgeBackgroundColor(details: setBadgeBackgroundColor.Details): void;
        export function setBadgeBackgroundColor(details: setBadgeBackgroundColor.Details, callback: (() => void)): void;
        export namespace setBadgeBackgroundColor {
            export type Details = browser.browserAction.setBadgeBackgroundColor.Details;
        }
        /**
         * Sets the badge text for the browser action. The badge is displayed on top of the icon.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_action.json
         */
        export function setBadgeText(details: setBadgeText.Details): void;
        export function setBadgeText(details: setBadgeText.Details, callback: (() => void)): void;
        export namespace setBadgeText {
            export type Details = browser.browserAction.setBadgeText.Details;
        }
        /**
         * Sets the text color for the badge.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_action.json
         */
        export function setBadgeTextColor(details: setBadgeTextColor.Details): void;
        export namespace setBadgeTextColor {
            export type Details = browser.browserAction.setBadgeTextColor.Details;
        }
        /**
         * Sets the icon for the browser action. The icon can be specified either as the path to an image file or as the pixel data from a canvas element, or as dictionary of either one of those. Either the **path** or the **imageData** property must be specified.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_action.json
         */
        export function setIcon(details: setIcon.Details): void;
        export function setIcon(details: setIcon.Details, callback: (() => void)): void;
        export namespace setIcon {
            export type Details = browser.browserAction.setIcon.Details;
        }
        /**
         * Sets the html document to be opened as a popup when the user clicks on the browser action's icon.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_action.json
         */
        export function setPopup(details: setPopup.Details): void;
        export function setPopup(details: setPopup.Details, callback: (() => void)): void;
        export namespace setPopup {
            export type Details = browser.browserAction.setPopup.Details;
        }
        /**
         * Sets the title of the browser action. This shows up in the tooltip.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_action.json
         */
        export function setTitle(details: setTitle.Details): void;
        export function setTitle(details: setTitle.Details, callback: (() => void)): void;
        export namespace setTitle {
            export type Details = browser.browserAction.setTitle.Details;
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
        export import ColorManagementMode = browser.browserSettings.ColorManagementMode;
        export import ContextMenuMouseEvent = browser.browserSettings.ContextMenuMouseEvent;
        export import ImageAnimationBehavior = browser.browserSettings.ImageAnimationBehavior;
        /**
         * Allows or disallows pop-up windows from opening in response to user events.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_settings.json
         */
        export const allowPopupsForUserEvents: chrome.types.Setting;
        /**
         * Enables or disables the browser cache.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_settings.json
         */
        export const cacheEnabled: chrome.types.Setting;
        /**
         * This boolean setting controls whether the selected tab can be closed with a double click.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_settings.json
         */
        export const closeTabsByDoubleClick: chrome.types.Setting;
        /**
         * Controls after which mouse event context menus popup. This setting's value is of type ContextMenuMouseEvent, which has possible values of `mouseup` and `mousedown`.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_settings.json
         */
        export const contextMenuShowEvent: chrome.types.Setting;
        /**
         * Returns whether the FTP protocol is enabled. Read-only.
         *
         * @deprecated FTP support was removed from Firefox in bug 1574475
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_settings.json
         */
        export const ftpProtocolEnabled: chrome.types.Setting;
        /**
         * Returns the value of the overridden home page. Read-only.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_settings.json
         */
        export const homepageOverride: chrome.types.Setting;
        /**
         * Controls the behaviour of image animation in the browser. This setting's value is of type ImageAnimationBehavior, defaulting to `normal`.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_settings.json
         */
        export const imageAnimationBehavior: chrome.types.Setting;
        /**
         * Returns the value of the overridden new tab page. Read-only.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_settings.json
         */
        export const newTabPageOverride: chrome.types.Setting;
        /**
         * Controls where new tabs are opened. `afterCurrent` will open all new tabs next to the current tab, `relatedAfterCurrent` will open only related tabs next to the current tab, and `atEnd` will open all tabs at the end of the tab strip. The default is `relatedAfterCurrent`.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_settings.json
         */
        export const newTabPosition: chrome.types.Setting;
        /**
         * This boolean setting controls whether bookmarks are opened in the current tab or in a new tab.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_settings.json
         */
        export const openBookmarksInNewTabs: chrome.types.Setting;
        /**
         * This boolean setting controls whether search results are opened in the current tab or in a new tab.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_settings.json
         */
        export const openSearchResultsInNewTabs: chrome.types.Setting;
        /**
         * This boolean setting controls whether urlbar results are opened in the current tab or in a new tab.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_settings.json
         */
        export const openUrlbarResultsInNewTabs: chrome.types.Setting;
        /**
         * This setting controls whether a light or dark color scheme overrides the page's preferred color scheme.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_settings.json
         */
        export const overrideContentColorScheme: chrome.types.Setting;
        /**
         * This setting controls whether the user-chosen colors override the page's colors.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_settings.json
         */
        export const overrideDocumentColors: chrome.types.Setting;
        /**
         * This setting controls whether the document's fonts are used.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_settings.json
         */
        export const useDocumentFonts: chrome.types.Setting;
        /**
         * This boolean setting controls whether vertical tabs are enabled.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_settings.json
         */
        export const verticalTabs: chrome.types.Setting;
        /**
         * Disables webAPI notifications.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_settings.json
         */
        export const webNotificationsDisabled: chrome.types.Setting;
        /**
         * This boolean setting controls whether zoom is applied to the full page or to text only.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_settings.json
         */
        export const zoomFullPage: chrome.types.Setting;
        /**
         * This boolean setting controls whether zoom is applied on a per-site basis or to the current tab only. If privacy.resistFingerprinting is true, this setting has no effect and zoom is applied to the current tab only.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_settings.json
         */
        export const zoomSiteSpecific: chrome.types.Setting;
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
             * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_settings.json
             */
            export const mode: chrome.types.Setting;
            /**
             * This boolean setting controls whether or not native sRGB color management is used.
             *
             * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_settings.json
             */
            export const useNativeSRGB: chrome.types.Setting;
            /**
             * This boolean setting controls whether or not the WebRender compositor is used.
             *
             * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browser_settings.json
             */
            export const useWebRenderCompositor: chrome.types.Setting;
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
        export import DataTypeSet = browser.browsingData.DataTypeSet;
        export import RemovalOptions = browser.browsingData.RemovalOptions;
        /**
         * Clears various types of browsing data stored in a user's profile.
         *
         * @param dataToRemove The set of data types to remove.
         * @param callback Called when deletion has completed.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browsing_data.json
         */
        export function remove(options: Normalizable<RemovalOptions>, dataToRemove: Normalizable<DataTypeSet>): void;
        export function remove(options: Normalizable<RemovalOptions>, dataToRemove: Normalizable<DataTypeSet>, callback: (() => void)): void;
        /**
         * Clears websites' appcache data.
         *
         * @param callback Called when websites' appcache data has been cleared.
         * @deprecated Firefox does not support this function. It does not exist at runtime.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browsing_data.json
         */
        export function removeAppcache(options: Normalizable<RemovalOptions>): void;
        export function removeAppcache(options: Normalizable<RemovalOptions>, callback: (() => void)): void;
        /**
         * Clears the browser's cache.
         *
         * @param callback Called when the browser's cache has been cleared.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browsing_data.json
         */
        export function removeCache(options: Normalizable<RemovalOptions>): void;
        export function removeCache(options: Normalizable<RemovalOptions>, callback: (() => void)): void;
        /**
         * Clears the browser's cookies and server-bound certificates modified within a particular timeframe.
         *
         * @param callback Called when the browser's cookies and server-bound certificates have been cleared.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browsing_data.json
         */
        export function removeCookies(options: Normalizable<RemovalOptions>): void;
        export function removeCookies(options: Normalizable<RemovalOptions>, callback: (() => void)): void;
        /**
         * Clears the browser's list of downloaded files (_not_ the downloaded files themselves).
         *
         * @param callback Called when the browser's list of downloaded files has been cleared.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browsing_data.json
         */
        export function removeDownloads(options: Normalizable<RemovalOptions>): void;
        export function removeDownloads(options: Normalizable<RemovalOptions>, callback: (() => void)): void;
        /**
         * Clears websites' file system data.
         *
         * @param callback Called when websites' file systems have been cleared.
         * @deprecated Firefox does not support this function. It does not exist at runtime.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browsing_data.json
         */
        export function removeFileSystems(options: Normalizable<RemovalOptions>): void;
        export function removeFileSystems(options: Normalizable<RemovalOptions>, callback: (() => void)): void;
        /**
         * Clears the browser's stored form data (autofill).
         *
         * @param callback Called when the browser's form data has been cleared.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browsing_data.json
         */
        export function removeFormData(options: Normalizable<RemovalOptions>): void;
        export function removeFormData(options: Normalizable<RemovalOptions>, callback: (() => void)): void;
        /**
         * Clears the browser's history.
         *
         * @param callback Called when the browser's history has cleared.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browsing_data.json
         */
        export function removeHistory(options: Normalizable<RemovalOptions>): void;
        export function removeHistory(options: Normalizable<RemovalOptions>, callback: (() => void)): void;
        /**
         * Clears websites' IndexedDB data.
         *
         * @param callback Called when websites' IndexedDB data has been cleared.
         * @deprecated Firefox does not support this function. It does not exist at runtime.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browsing_data.json
         */
        export function removeIndexedDB(options: Normalizable<RemovalOptions>): void;
        export function removeIndexedDB(options: Normalizable<RemovalOptions>, callback: (() => void)): void;
        /**
         * Clears websites' local storage data.
         *
         * @param callback Called when websites' local storage has been cleared.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browsing_data.json
         */
        export function removeLocalStorage(options: Normalizable<RemovalOptions>): void;
        export function removeLocalStorage(options: Normalizable<RemovalOptions>, callback: (() => void)): void;
        /**
         * Clears the browser's stored passwords.
         *
         * @param callback Called when the browser's passwords have been cleared.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browsing_data.json
         */
        export function removePasswords(options: Normalizable<RemovalOptions>): void;
        export function removePasswords(options: Normalizable<RemovalOptions>, callback: (() => void)): void;
        /**
         * Clears plugins' data.
         *
         * @param callback Called when plugins' data has been cleared.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browsing_data.json
         */
        export function removePluginData(options: Normalizable<RemovalOptions>): void;
        export function removePluginData(options: Normalizable<RemovalOptions>, callback: (() => void)): void;
        /**
         * Clears websites' WebSQL data.
         *
         * @param callback Called when websites' WebSQL databases have been cleared.
         * @deprecated Firefox does not support this function. It does not exist at runtime.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browsing_data.json
         */
        export function removeWebSQL(options: Normalizable<RemovalOptions>): void;
        export function removeWebSQL(options: Normalizable<RemovalOptions>, callback: (() => void)): void;
        /**
         * Reports which types of data are currently selected in the 'Clear browsing data' settings UI.  Note: some of the data types included in this API are not available in the settings UI, and some UI settings control more than one data type listed here.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/browsing_data.json
         */
        export function settings(): void;
        export function settings(callback: ((result: settings.Result) => void)): void;
        export namespace settings {
            export type Result = browser.browsingData.settings.Result;
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
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/captive_portal.json
         */
        export const canonicalURL: chrome.types.Setting;
        export import onConnectivityAvailable = browser.captivePortal.onConnectivityAvailable;
        export import onStateChanged = browser.captivePortal.onStateChanged;
        /**
         * Returns the time difference between NOW and the last time a request was completed in milliseconds.
         *
         * @returns The time in milliseconds since the last request was completed.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/captive_portal.json
         */
        export function getLastChecked(): void;
        export function getLastChecked(callback: ((lastChecked: number) => void)): void;
        /**
         * Returns the current portal state, one of `unknown`, `not_captive`, `unlocked_portal`, `locked_portal`.
         *
         * @returns The current captive portal state.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/captive_portal.json
         */
        export function getState(): void;
        export function getState(callback: ((state: "unknown" | "not_captive" | "unlocked_portal" | "locked_portal") => void)): void;
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
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/clipboard.json
         */
        export function setImageData(imageData: ArrayBuffer, imageType: "jpeg" | "png"): void;
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
        export import Command = browser.commands.Command;
        export import onChanged = browser.commands.onChanged;
        export import onCommand = browser.commands.onCommand;
        /**
         * Returns all the registered extension commands for this extension and their shortcut (if active).
         *
         * @param callback Called to return the registered commands.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/commands.json
         */
        export function getAll(): void;
        export function getAll(callback: ((commands: Command[]) => void)): void;
        /**
         * Open extension shortcuts configuration page.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/commands.json
         */
        export function openShortcutSettings(): void;
        /**
         * Reset a command's details to what is specified in the manifest.
         *
         * @param name The name of the command.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/commands.json
         */
        export function reset(name: string): void;
        /**
         * Update the details of an already defined command.
         *
         * @param detail The new description for the command.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/commands.json
         */
        export function update(detail: update.Detail): void;
        export namespace update {
            export type Detail = browser.commands.update.Detail;
        }
    }
    /**
     * Only available in manifest_version 2 or earlier.
     * Not available in content scripts or devtools pages.
     *
     * @platform desktop, mobile
     */
    export namespace contentScripts {
        export import RegisteredContentScript = browser.contentScripts.RegisteredContentScript;
        export import RegisteredContentScriptOptions = browser.contentScripts.RegisteredContentScriptOptions;
        /**
         * Register a content script programmatically
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/content_scripts.json
         */
        export function register(contentScriptOptions: RegisteredContentScriptOptions): void;
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
        export import ContextType = browser.contextMenus.ContextType;
        export import ItemType = browser.contextMenus.ItemType;
        export import OnClickData = browser.contextMenus.OnClickData;
        export import ACTION_MENU_TOP_LEVEL_LIMIT = browser.contextMenus.ACTION_MENU_TOP_LEVEL_LIMIT;
        export import onClicked = browser.contextMenus.onClicked;
        export import onHidden = browser.contextMenus.onHidden;
        export import onShown = browser.contextMenus.onShown;
        export import create = browser.contextMenus.create;
        export import getTargetElement = browser.contextMenus.getTargetElement;
        export import overrideContext = browser.contextMenus.overrideContext;
        /**
         * Updates the extension items in the shown menu, including changes that have been made since the menu was shown. Has no effect if the menu is hidden. Rebuilding a shown menu is an expensive operation, only invoke this method when necessary.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/menus.json
         */
        export function refresh(): void;
        /**
         * Removes a context menu item.
         *
         * @param menuItemId The ID of the context menu item to remove.
         * @param callback Called when the context menu has been removed.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/menus.json
         */
        export function remove(menuItemId: number | string): void;
        export function remove(menuItemId: number | string, callback: (() => void)): void;
        /**
         * Removes all context menu items added by this extension.
         *
         * @param callback Called when removal is complete.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/menus.json
         */
        export function removeAll(): void;
        export function removeAll(callback: (() => void)): void;
        /**
         * Updates a previously created context menu item.
         *
         * @param id The ID of the item to update.
         * @param updateProperties The properties to update. Accepts the same values as the create function.
         * @param callback Called when the context menu has been updated.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/menus.json
         */
        export function update(id: number | string, updateProperties: update.UpdateProperties): void;
        export function update(id: number | string, updateProperties: update.UpdateProperties, callback: (() => void)): void;
        export namespace update {
            export type UpdateProperties = browser.contextMenus.update.UpdateProperties;
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
        export import ContextualIdentity = browser.contextualIdentities.ContextualIdentity;
        export import SiteAssociation = browser.contextualIdentities.SiteAssociation;
        export import onCreated = browser.contextualIdentities.onCreated;
        export import onRemoved = browser.contextualIdentities.onRemoved;
        export import onSiteAssociationChanged = browser.contextualIdentities.onSiteAssociationChanged;
        export import onUpdated = browser.contextualIdentities.onUpdated;
        /**
         * Creates a contextual identity with the given data.
         *
         * @param details Details about the contextual identity being created.
         * @returns The created contextual identity.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/contextual_identities.json
         */
        export function create(details: create.Details): void;
        export function create(details: create.Details, callback: ((contextualIdentity: ContextualIdentity) => void)): void;
        export namespace create {
            export type Details = browser.contextualIdentities.create.Details;
        }
        /**
         * Retrieves information about a single contextual identity.
         *
         * @param cookieStoreId The ID of the contextual identity cookie store.
         * @returns The requested contextual identity.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/contextual_identities.json
         */
        export function get(cookieStoreId: string): void;
        export function get(cookieStoreId: string, callback: ((contextualIdentity: ContextualIdentity) => void)): void;
        /**
         * Retrieves the association of a site, or null if the site is not associated with any container.
         *
         * @param details Details about the site to look up.
         * @returns The association of the site, null if the site is not associated with any container.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/contextual_identities.json
         */
        export function getSiteAssociation(details: getSiteAssociation.Details): void;
        export function getSiteAssociation(details: getSiteAssociation.Details, callback: ((association: SiteAssociation | null) => void)): void;
        export namespace getSiteAssociation {
            export type Details = browser.contextualIdentities.getSiteAssociation.Details;
        }
        /**
         * Retrieves the list of colors supported by contextual identities.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/contextual_identities.json
         */
        export function getSupportedColors(): void;
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
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/contextual_identities.json
         */
        export function getSupportedIcons(): void;
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
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/contextual_identities.json
         */
        export function move(cookieStoreIds: string | string[], position: number): void;
        /**
         * Retrieves all contextual identities
         *
         * @param details Information to filter the contextual identities being retrieved.
         * @returns The contextual identities that match the filter.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/contextual_identities.json
         */
        export function query(details: query.Details): void;
        export function query(details: query.Details, callback: ((contextualIdentities: ContextualIdentity[]) => void)): void;
        export namespace query {
            export type Details = browser.contextualIdentities.query.Details;
        }
        /**
         * Retrieves the list of site-to-container associations.
         *
         * @param details Information to filter the associations being retrieved.
         * @returns The site-to-container associations.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/contextual_identities.json
         */
        export function querySiteAssociations(details: querySiteAssociations.Details): void;
        export function querySiteAssociations(details: querySiteAssociations.Details, callback: ((associations: SiteAssociation[]) => void)): void;
        export namespace querySiteAssociations {
            export type Details = browser.contextualIdentities.querySiteAssociations.Details;
        }
        /**
         * Deletes a contextual identity by its cookie Store ID.
         *
         * @param cookieStoreId The ID of the contextual identity cookie store.
         * @returns The removed contextual identity.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/contextual_identities.json
         */
        export function remove(cookieStoreId: string): void;
        export function remove(cookieStoreId: string, callback: ((contextualIdentity: ContextualIdentity) => void)): void;
        /**
         * Removes the container association for a site.
         *
         * @param details Details about the site association to remove.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/contextual_identities.json
         */
        export function removeSiteAssociation(details: removeSiteAssociation.Details): void;
        export namespace removeSiteAssociation {
            export type Details = browser.contextualIdentities.removeSiteAssociation.Details;
        }
        /**
         * Associates a site with a container. Top-level navigations to that site will load in the given container.
         *
         * @param details Details about the site association.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/contextual_identities.json
         */
        export function setSiteAssociation(details: setSiteAssociation.Details): void;
        export namespace setSiteAssociation {
            export type Details = browser.contextualIdentities.setSiteAssociation.Details;
        }
        /**
         * Updates a contextual identity with the given data.
         *
         * @param cookieStoreId The ID of the contextual identity cookie store.
         * @param details Details about the contextual identity being created.
         * @returns The updated contextual identity.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/contextual_identities.json
         */
        export function update(cookieStoreId: string, details: update.Details): void;
        export function update(cookieStoreId: string, details: update.Details, callback: ((contextualIdentity: ContextualIdentity) => void)): void;
        export namespace update {
            export type Details = browser.contextualIdentities.update.Details;
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
        export import Cookie = browser.cookies.Cookie;
        export import CookieStore = browser.cookies.CookieStore;
        export import OnChangedCause = browser.cookies.OnChangedCause;
        export import PartitionKey = browser.cookies.PartitionKey;
        export import SameSiteStatus = browser.cookies.SameSiteStatus;
        export import onChanged = browser.cookies.onChanged;
        /**
         * Retrieves information about a single cookie. If more than one cookie of the same name exists for the given URL, the one with the longest path will be returned. For cookies with the same path length, the cookie with the earliest creation time will be returned.
         *
         * @param details Details to identify the cookie being retrieved.
         * @returns Contains details about the cookie. This parameter is null if no such cookie was found.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/cookies.json
         */
        export function get(details: get.Details): void;
        export function get(details: get.Details, callback: ((cookie: Cookie | null) => void)): void;
        export namespace get {
            export type Details = browser.cookies.get.Details;
        }
        /**
         * Retrieves all cookies from a single cookie store that match the given information.  The cookies returned will be sorted, with those with the longest path first.  If multiple cookies have the same path length, those with the earliest creation time will be first.
         *
         * @param details Information to filter the cookies being retrieved.
         * @returns All the existing, unexpired cookies that match the given cookie info.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/cookies.json
         */
        export function getAll(details: getAll.Details): void;
        export function getAll(details: getAll.Details, callback: ((cookies: Cookie[]) => void)): void;
        export namespace getAll {
            export type Details = browser.cookies.getAll.Details;
        }
        /**
         * Lists all existing cookie stores.
         *
         * @returns All the existing cookie stores.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/cookies.json
         */
        export function getAllCookieStores(): void;
        export function getAllCookieStores(callback: ((cookieStores: CookieStore[]) => void)): void;
        /**
         * Deletes a cookie by name.
         *
         * @param details Information to identify the cookie to remove.
         * @returns Contains details about the cookie that's been removed.  If removal failed for any reason, this will be "null", and {@link browser.runtime.lastError} will be set.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/cookies.json
         */
        export function remove(details: remove.Details): void;
        export function remove(details: remove.Details, callback: ((details: remove.Result | null) => void)): void;
        export namespace remove {
            export type Details = browser.cookies.remove.Details;
            export type Result = browser.cookies.remove.Result;
        }
        /**
         * Sets a cookie with the given cookie data; may overwrite equivalent cookies if they exist.
         *
         * @param details Details about the cookie being set.
         * @returns Contains details about the cookie that's been set.  If setting failed for any reason, this will be "null", and {@link browser.runtime.lastError} will be set.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/cookies.json
         */
        export function set(details: set.Details): void;
        export function set(details: set.Details, callback: ((cookie: Cookie | null) => void)): void;
        export namespace set {
            export type Details = browser.cookies.set.Details;
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
        export import GetRulesFilter = browser.declarativeNetRequest.GetRulesFilter;
        export import MatchedRule = browser.declarativeNetRequest.MatchedRule;
        export import ResourceType = browser.declarativeNetRequest.ResourceType;
        export import Rule = browser.declarativeNetRequest.Rule;
        export import URLTransform = browser.declarativeNetRequest.URLTransform;
        export import UnsupportedRegexReason = browser.declarativeNetRequest.UnsupportedRegexReason;
        export import DYNAMIC_RULESET_ID = browser.declarativeNetRequest.DYNAMIC_RULESET_ID;
        export import GUARANTEED_MINIMUM_STATIC_RULES = browser.declarativeNetRequest.GUARANTEED_MINIMUM_STATIC_RULES;
        export import MAX_NUMBER_OF_DISABLED_STATIC_RULES = browser.declarativeNetRequest.MAX_NUMBER_OF_DISABLED_STATIC_RULES;
        export import MAX_NUMBER_OF_DYNAMIC_AND_SESSION_RULES = browser.declarativeNetRequest.MAX_NUMBER_OF_DYNAMIC_AND_SESSION_RULES;
        export import MAX_NUMBER_OF_DYNAMIC_RULES = browser.declarativeNetRequest.MAX_NUMBER_OF_DYNAMIC_RULES;
        export import MAX_NUMBER_OF_ENABLED_STATIC_RULESETS = browser.declarativeNetRequest.MAX_NUMBER_OF_ENABLED_STATIC_RULESETS;
        export import MAX_NUMBER_OF_REGEX_RULES = browser.declarativeNetRequest.MAX_NUMBER_OF_REGEX_RULES;
        export import MAX_NUMBER_OF_SESSION_RULES = browser.declarativeNetRequest.MAX_NUMBER_OF_SESSION_RULES;
        export import MAX_NUMBER_OF_STATIC_RULESETS = browser.declarativeNetRequest.MAX_NUMBER_OF_STATIC_RULESETS;
        export import SESSION_RULESET_ID = browser.declarativeNetRequest.SESSION_RULESET_ID;
        /**
         * Returns the remaining number of static rules an extension can enable
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/declarative_net_request.json
         */
        export function getAvailableStaticRuleCount(): void;
        export function getAvailableStaticRuleCount(callback: ((count: number) => void)): void;
        /**
         * Returns the list of individual disabled static rules from a given static ruleset id.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/declarative_net_request.json
         */
        export function getDisabledRuleIds(options: getDisabledRuleIds.Options): void;
        export function getDisabledRuleIds(options: getDisabledRuleIds.Options, callback: ((disabledRuleIds: number[]) => void)): void;
        export namespace getDisabledRuleIds {
            export type Options = browser.declarativeNetRequest.getDisabledRuleIds.Options;
        }
        /**
         * Returns the current set of dynamic rules for the extension.
         *
         * @param filter An object to filter the set of dynamic rules for the extension.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/declarative_net_request.json
         */
        export function getDynamicRules(filter?: GetRulesFilter | null): void;
        export function getDynamicRules(filter: GetRulesFilter | null | undefined, callback: ((dynamicRules: Rule[]) => void)): void;
        export function getDynamicRules(callback: ((dynamicRules: Rule[]) => void)): void;
        /**
         * Returns the ids for the current set of enabled static rulesets.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/declarative_net_request.json
         */
        export function getEnabledRulesets(): void;
        export function getEnabledRulesets(callback: ((rulesetIds: string[]) => void)): void;
        /**
         * Returns the current set of session scoped rules for the extension.
         *
         * @param filter An object to filter the set of session scoped rules for the extension.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/declarative_net_request.json
         */
        export function getSessionRules(filter?: GetRulesFilter | null): void;
        export function getSessionRules(filter: GetRulesFilter | null | undefined, callback: ((sessionRules: Rule[]) => void)): void;
        export function getSessionRules(callback: ((sessionRules: Rule[]) => void)): void;
        /**
         * Checks if the given regular expression will be supported as a 'regexFilter' rule condition.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/declarative_net_request.json
         */
        export function isRegexSupported(regexOptions: isRegexSupported.RegexOptions): void;
        export function isRegexSupported(regexOptions: isRegexSupported.RegexOptions, callback: ((result: isRegexSupported.Result) => void)): void;
        export namespace isRegexSupported {
            export type RegexOptions = browser.declarativeNetRequest.isRegexSupported.RegexOptions;
            export type Result = browser.declarativeNetRequest.isRegexSupported.Result;
        }
        /**
         * Checks if any of the extension's declarativeNetRequest rules would match a hypothetical request.
         *
         * @param request The details of the request to test.
         * @param callback Called with the details of matched rules.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/declarative_net_request.json
         * @permission declarativeNetRequestFeedback
         */
        export function testMatchOutcome(request: testMatchOutcome.Request, options?: testMatchOutcome.Options | null): void;
        export function testMatchOutcome(request: testMatchOutcome.Request, options: testMatchOutcome.Options | null | undefined, callback: ((result: testMatchOutcome.Result) => void)): void;
        export function testMatchOutcome(request: testMatchOutcome.Request, callback: ((result: testMatchOutcome.Result) => void)): void;
        export namespace testMatchOutcome {
            export type Request = browser.declarativeNetRequest.testMatchOutcome.Request;
            export type Options = browser.declarativeNetRequest.testMatchOutcome.Options;
            export type Result = browser.declarativeNetRequest.testMatchOutcome.Result;
        }
        /**
         * Modifies the current set of dynamic rules for the extension. The rules with IDs listed in options.removeRuleIds are first removed, and then the rules given in options.addRules are added. These rules are persisted across browser sessions and extension updates.
         *
         * @param callback Called when the dynamic rules have been updated
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/declarative_net_request.json
         */
        export function updateDynamicRules(options: updateDynamicRules.Options): void;
        export function updateDynamicRules(options: updateDynamicRules.Options, callback: (() => void)): void;
        export namespace updateDynamicRules {
            export type Options = browser.declarativeNetRequest.updateDynamicRules.Options;
        }
        /**
         * Modifies the static rulesets enabled/disabled state.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/declarative_net_request.json
         */
        export function updateEnabledRulesets(updateRulesetOptions: updateEnabledRulesets.UpdateRulesetOptions): void;
        export function updateEnabledRulesets(updateRulesetOptions: updateEnabledRulesets.UpdateRulesetOptions, callback: (() => void)): void;
        export namespace updateEnabledRulesets {
            export type UpdateRulesetOptions = browser.declarativeNetRequest.updateEnabledRulesets.UpdateRulesetOptions;
        }
        /**
         * Modifies the current set of session scoped rules for the extension. The rules with IDs listed in options.removeRuleIds are first removed, and then the rules given in options.addRules are added. These rules are not persisted across sessions and are backed in memory.
         *
         * @param callback Called when the session rules have been updated
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/declarative_net_request.json
         */
        export function updateSessionRules(options: updateSessionRules.Options): void;
        export function updateSessionRules(options: updateSessionRules.Options, callback: (() => void)): void;
        export namespace updateSessionRules {
            export type Options = browser.declarativeNetRequest.updateSessionRules.Options;
        }
        /**
         * Modified individual static rules enabled/disabled state. Changes to rules belonging to a disabled ruleset will take effect when the ruleset becomes enabled.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/declarative_net_request.json
         */
        export function updateStaticRules(options: updateStaticRules.Options): void;
        export function updateStaticRules(options: updateStaticRules.Options, callback: (() => void)): void;
        export namespace updateStaticRules {
            export type Options = browser.declarativeNetRequest.updateStaticRules.Options;
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
            export import Resource = browser.devtools.inspectedWindow.Resource;
            export import tabId = browser.devtools.inspectedWindow.tabId;
            export import onResourceAdded = browser.devtools.inspectedWindow.onResourceAdded;
            export import onResourceContentCommitted = browser.devtools.inspectedWindow.onResourceContentCommitted;
            /**
             * Evaluates a JavaScript expression in the context of the main frame of the inspected page. The expression must evaluate to a JSON-compliant object, otherwise an exception is thrown. The eval function can report either a DevTools-side error or a JavaScript exception that occurs during evaluation. In either case, the `result` parameter of the callback is `undefined`. In the case of a DevTools-side error, the `isException` parameter is non-null and has `isError` set to true and `code` set to an error code. In the case of a JavaScript error, `isException` is set to true and `value` is set to the string value of thrown object.
             *
             * @param expression An expression to evaluate.
             * @param options The options parameter can contain one or more options.
             * @param callback A function called when evaluation completes.
             * @returns
             * - `result`: The result of evaluation.
             * - `exceptionInfo`: An object providing details if an exception occurred while evaluating the expression.
             * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/devtools_inspected_window.json
             */
            function _eval(expression: string, options?: _eval.Options | null): void;
            function _eval(expression: string, options: _eval.Options | null | undefined, callback: ((result: any, exceptionInfo: _eval.ExceptionInfo | undefined) => void)): void;
            function _eval(expression: string, callback: ((result: any, exceptionInfo: _eval.ExceptionInfo | undefined) => void)): void;
            export { _eval as eval };
            export namespace _eval {
                export type Options = browser.devtools.inspectedWindow._eval.Options;
                export type ExceptionInfo = browser.devtools.inspectedWindow._eval.ExceptionInfo;
            }
            /**
             * Retrieves the list of resources from the inspected page.
             *
             * @param callback A function that receives the list of resources when the request completes.
             * @returns The resources within the page.
             * @deprecated Firefox does not support this function. It does not exist at runtime.
             * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/devtools_inspected_window.json
             */
            export function getResources(): void;
            export function getResources(callback: ((resources: browser.devtools.inspectedWindow.Resource[]) => void)): void;
            export import reload = browser.devtools.inspectedWindow.reload;
        }
        /**
         * Use the `chrome.devtools.network` API to retrieve the information about network requests displayed by the Developer Tools in the Network panel.
         *
         * Only available in devtools pages.
         *
         * @platform desktop
         */
        export namespace network {
            export import Request = browser.devtools.network.Request;
            export import onNavigated = browser.devtools.network.onNavigated;
            export import onRequestFinished = browser.devtools.network.onRequestFinished;
            /**
             * Returns HAR log that contains all known network requests.
             *
             * @param callback A function that receives the HAR log when the request completes.
             * @returns A HAR log. See HAR specification for details.
             * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/devtools_network.json
             */
            export function getHAR(): void;
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
            export import Button = browser.devtools.panels.Button;
            export interface ElementsPanel extends Omit<browser.devtools.panels.ElementsPanel, "createSidebarPane"> {
                /**
                 * Creates a pane within panel's sidebar.
                 *
                 * @param title Text that is displayed in sidebar caption.
                 * @param callback A callback invoked when the sidebar is created.
                 * @returns An ExtensionSidebarPane object for created sidebar pane.
                 */
                createSidebarPane(title: string): void;
                createSidebarPane(title: string, callback: ((result: ExtensionSidebarPane) => void)): void;
            }
            export import ExtensionPanel = browser.devtools.panels.ExtensionPanel;
            export import ExtensionSidebarPane = browser.devtools.panels.ExtensionSidebarPane;
            export import SourcesPanel = browser.devtools.panels.SourcesPanel;
            /**
             * Elements panel.
             *
             * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/devtools_panels.json
             */
            export const elements: chrome.devtools.panels.ElementsPanel;
            export import sources = browser.devtools.panels.sources;
            export import themeName = browser.devtools.panels.themeName;
            export import onThemeChanged = browser.devtools.panels.onThemeChanged;
            /**
             * Creates an extension panel.
             *
             * @param title Title that is displayed next to the extension icon in the Developer Tools toolbar.
             * @param iconPath Path of the panel's icon relative to the extension directory, or an empty string to use the default extension icon as the panel icon.
             * @param pagePath Path of the panel's HTML page relative to the extension directory.
             * @param callback A function that is called when the panel is created.
             * @returns An ExtensionPanel object representing the created panel.
             * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/devtools_panels.json
             */
            export function create(title: string, iconPath: "" | browser.manifest.ExtensionURL, pagePath: browser.manifest.ExtensionURL): void;
            export function create(title: string, iconPath: "" | browser.manifest.ExtensionURL, pagePath: browser.manifest.ExtensionURL, callback: ((panel: browser.devtools.panels.ExtensionPanel) => void)): void;
            /**
             * Requests DevTools to open a URL in a Developer Tools panel.
             *
             * @param url The URL of the resource to open.
             * @param lineNumber Specifies the line number to scroll to when the resource is loaded.
             * @param callback A function that is called when the resource has been successfully loaded.
             * @deprecated Firefox does not support this function. It does not exist at runtime.
             * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/devtools_panels.json
             */
            export function openResource(url: string, lineNumber: number): void;
            export function openResource(url: string, lineNumber: number, callback: ((...args: any[]) => void)): void;
            /**
             * Specifies the function to be called when the user clicks a resource link in the Developer Tools window. To unset the handler, either call the method with no parameters or pass null as the parameter.
             *
             * @param callback A function that is called when the user clicks on a valid resource link in Developer Tools window. Note that if the user clicks an invalid URL or an XHR, this function is not called.
             * @returns A {@link browser.devtools.inspectedWindow.Resource} object for the resource that was clicked.
             * @deprecated Firefox does not support this function. It does not exist at runtime.
             * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/devtools_panels.json
             */
            export function setOpenResourceHandler(): void;
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
        export import DNSRecord = browser.dns.DNSRecord;
        export import ResolveFlags = browser.dns.ResolveFlags;
        /**
         * Resolves a hostname to a DNS record.
         *
         * @param flags Defaults to `[]`.
         * @returns The DNS record for the hostname.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/dns.json
         */
        export function resolve(hostname: string, flags?: ResolveFlags | null): void;
        export function resolve(hostname: string, flags: ResolveFlags | null | undefined, callback: ((record: DNSRecord) => void)): void;
        export function resolve(hostname: string, callback: ((record: DNSRecord) => void)): void;
    }
    /**
     * Not available in content scripts or devtools pages.
     *
     * @permission downloads
     * @platform desktop, mobile
     */
    export namespace downloads {
        export import BooleanDelta = browser.downloads.BooleanDelta;
        export import DangerType = browser.downloads.DangerType;
        export import DoubleDelta = browser.downloads.DoubleDelta;
        export import DownloadItem = browser.downloads.DownloadItem;
        export import DownloadQuery = browser.downloads.DownloadQuery;
        export import DownloadTime = browser.downloads.DownloadTime;
        export import FilenameConflictAction = browser.downloads.FilenameConflictAction;
        export import InterruptReason = browser.downloads.InterruptReason;
        export import State = browser.downloads.State;
        export import StringDelta = browser.downloads.StringDelta;
        export import onChanged = browser.downloads.onChanged;
        export import onCreated = browser.downloads.onCreated;
        export import onErased = browser.downloads.onErased;
        export import acceptDanger = browser.downloads.acceptDanger;
        /**
         * Cancel a download. When `callback` is run, the download is cancelled, completed, interrupted or doesn't exist anymore.
         *
         * @param downloadId The id of the download to cancel.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/downloads.json
         */
        export function cancel(downloadId: number): void;
        export function cancel(downloadId: number, callback: (() => void)): void;
        /**
         * Download a URL. If the URL uses the HTTP[S] protocol, then the request will include all cookies currently set for its hostname. If both `filename` and `saveAs` are specified, then the Save As dialog will be displayed, pre-populated with the specified `filename`. If the download started successfully, `callback` will be called with the new DownloadItem's `downloadId`. If there was an error starting the download, then `callback` will be called with `downloadId=undefined` and chrome.extension.lastError will contain a descriptive string. The error strings are not guaranteed to remain backwards compatible between releases. You must not parse it.
         *
         * @param options What to download and how.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/downloads.json
         */
        export function download(options: download.Options): void;
        export function download(options: download.Options, callback: ((downloadId: number) => void)): void;
        export namespace download {
            export type Options = browser.downloads.download.Options;
        }
        export import drag = browser.downloads.drag;
        /**
         * Erase matching DownloadItems from history
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/downloads.json
         */
        export function erase(query: DownloadQuery): void;
        export function erase(query: DownloadQuery, callback: ((erasedIds: number[]) => void)): void;
        /**
         * Retrieve an icon for the specified download. For new downloads, file icons are available after the onCreated event has been received. The image returned by this function while a download is in progress may be different from the image returned after the download is complete. Icon retrieval is done by querying the underlying operating system or toolkit depending on the platform. The icon that is returned will therefore depend on a number of factors including state of the download, platform, registered file types and visual theme. If a file icon cannot be determined, chrome.extension.lastError will contain an error message.
         *
         * @param downloadId The identifier for the download.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/downloads.json
         */
        export function getFileIcon(downloadId: number, options?: getFileIcon.Options | null): void;
        export function getFileIcon(downloadId: number, options: getFileIcon.Options | null | undefined, callback: ((iconURL: string) => void)): void;
        export function getFileIcon(downloadId: number, callback: ((iconURL: string) => void)): void;
        export namespace getFileIcon {
            export type Options = browser.downloads.getFileIcon.Options;
        }
        /**
         * Open the downloaded file.
         *
         * Must be called from a user input handler.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/downloads.json
         * @permission downloads.open
         */
        export function open(downloadId: number): void;
        export function open(downloadId: number, callback: (() => void)): void;
        /**
         * Pause the download. If the request was successful the download is in a paused state. Otherwise chrome.extension.lastError contains an error message. The request will fail if the download is not active.
         *
         * @param downloadId The id of the download to pause.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/downloads.json
         */
        export function pause(downloadId: number): void;
        export function pause(downloadId: number, callback: (() => void)): void;
        /**
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/downloads.json
         */
        export function removeFile(downloadId: number): void;
        export function removeFile(downloadId: number, callback: (() => void)): void;
        /**
         * Resume a paused download. If the request was successful the download is in progress and unpaused. Otherwise chrome.extension.lastError contains an error message. The request will fail if the download is not active.
         *
         * @param downloadId The id of the download to resume.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/downloads.json
         */
        export function resume(downloadId: number): void;
        export function resume(downloadId: number, callback: (() => void)): void;
        /**
         * Find DownloadItems. Set `query` to the empty object to get all DownloadItems. To get a specific DownloadItem, set only the `id` field.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/downloads.json
         */
        export function search(query: DownloadQuery): void;
        export function search(query: DownloadQuery, callback: ((results: DownloadItem[]) => void)): void;
        export import setShelfEnabled = browser.downloads.setShelfEnabled;
        /**
         * Show the downloaded file in its folder in a file manager.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/downloads.json
         */
        export function show(downloadId: number): void;
        export function show(downloadId: number, callback: ((success: boolean) => void)): void;
        export import showDefaultFolder = browser.downloads.showDefaultFolder;
    }
    export import events = browser.events;
    export import experiments = browser.experiments;
    /**
     * The `browser.extension` API has utilities that can be used by any extension page. It includes support for exchanging messages between an extension and its content scripts or between extensions, as described in detail in Message Passing.
     *
     * Also available in content scripts and devtools pages.
     *
     * @platform desktop, mobile
     */
    export namespace extension {
        export import ViewType = browser.extension.ViewType;
        export import inIncognitoContext = browser.extension.inIncognitoContext;
        export import lastError = browser.extension.lastError;
        export import onRequest = browser.extension.onRequest;
        export import onRequestExternal = browser.extension.onRequestExternal;
        export import getBackgroundPage = browser.extension.getBackgroundPage;
        export import getURL = browser.extension.getURL;
        export import getViews = browser.extension.getViews;
        /**
         * Retrieves the state of the extension's access to the 'file://' scheme (as determined by the user-controlled 'Allow access to File URLs' checkbox.
         *
         * Not available in content scripts or devtools pages.
         *
         * @returns True if the extension can access the 'file://' scheme, false otherwise.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/extension.json
         */
        export function isAllowedFileSchemeAccess(): void;
        export function isAllowedFileSchemeAccess(callback: ((isAllowedAccess: boolean) => void)): void;
        /**
         * Retrieves the state of the extension's access to Incognito-mode (as determined by the user-controlled 'Allowed in Incognito' checkbox.
         *
         * Not available in content scripts or devtools pages.
         *
         * @returns True if the extension has access to Incognito mode, false otherwise.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/extension.json
         */
        export function isAllowedIncognitoAccess(): void;
        export function isAllowedIncognitoAccess(callback: ((isAllowedAccess: boolean) => void)): void;
        export import setUpdateUrlData = browser.extension.setUpdateUrlData;
    }
    export import extensionTypes = browser.extensionTypes;
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
         * @returns The number of matches found, and the range and rectangle data if requested.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/find.json
         */
        export function find(queryphrase: string, params?: find.Params | null): void;
        export function find(queryphrase: string, params: find.Params | null | undefined, callback: ((results: find.Result) => void)): void;
        export function find(queryphrase: string, callback: ((results: find.Result) => void)): void;
        export namespace find {
            export type Params = browser.find.find.Params;
            export type Result = browser.find.find.Result;
        }
        /**
         * Highlight a range
         *
         * @param params highlightResults parameters
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/find.json
         */
        export function highlightResults(params?: highlightResults.Params | null): void;
        export namespace highlightResults {
            export type Params = browser.find.highlightResults.Params;
        }
        /**
         * Remove all highlighting from previous searches.
         *
         * @param tabId Tab to highlight. Defaults to the active tab.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/find.json
         */
        export function removeHighlighting(tabId?: number | null): void;
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
        export import ProfilerFeature = browser.geckoProfiler.ProfilerFeature;
        export import supports = browser.geckoProfiler.supports;
        export import onRunning = browser.geckoProfiler.onRunning;
        /**
         * Gathers the profile data from the current profiling session, and writes it to disk. The returned promise resolves to a path that locates the created file.
         *
         * @param fileName The name of the file inside the profile/profiler directory
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/geckoProfiler.json
         */
        export function dumpProfileToFile(fileName: string): void;
        /**
         * Gathers the profile data from the current profiling session.
         *
         * @returns The profile data, parsed from JSON.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/geckoProfiler.json
         */
        export function getProfile(): void;
        export function getProfile(callback: ((profile: Record<string, unknown>) => void)): void;
        /**
         * Gathers the profile data from the current profiling session. The returned promise resolves to an array buffer that contains a JSON string.
         *
         * @returns An array buffer that contains the profile data as a JSON string.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/geckoProfiler.json
         */
        export function getProfileAsArrayBuffer(): void;
        export function getProfileAsArrayBuffer(callback: ((profile: ArrayBuffer) => void)): void;
        /**
         * Gathers the profile data from the current profiling session. The returned promise resolves to an array buffer that contains a gzipped JSON string.
         *
         * @returns An array buffer that contains the profile data as a gzipped JSON string.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/geckoProfiler.json
         */
        export function getProfileAsGzippedArrayBuffer(): void;
        export function getProfileAsGzippedArrayBuffer(callback: ((profile: ArrayBuffer) => void)): void;
        /**
         * Gets the debug symbols for a particular library.
         *
         * @param debugName The name of the library's debug file. For example, 'xul.pdb
         * @param breakpadId The Breakpad ID of the library
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/geckoProfiler.json
         */
        export function getSymbols(debugName: string, breakpadId: string): void;
        /**
         * Pauses the profiler, keeping any profile data that is already written.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/geckoProfiler.json
         */
        export function pause(): void;
        /**
         * Resumes the profiler with the settings that were initially used to start it.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/geckoProfiler.json
         */
        export function resume(): void;
        /**
         * Starts the profiler with the specified settings.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/geckoProfiler.json
         */
        export function start(settings: start.Settings): void;
        export namespace start {
            export type Settings = browser.geckoProfiler.start.Settings;
        }
        /**
         * Stops the profiler and discards any captured profile data.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/geckoProfiler.json
         */
        export function stop(): void;
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
        export import HistoryItem = browser.history.HistoryItem;
        export import TransitionType = browser.history.TransitionType;
        export import VisitItem = browser.history.VisitItem;
        export import onTitleChanged = browser.history.onTitleChanged;
        export import onVisitRemoved = browser.history.onVisitRemoved;
        export import onVisited = browser.history.onVisited;
        /**
         * Adds a URL to the history with a default visitTime of the current time and a default transition type of "link".
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/history.json
         */
        export function addUrl(details: addUrl.Details): void;
        export function addUrl(details: addUrl.Details, callback: (() => void)): void;
        export namespace addUrl {
            export type Details = browser.history.addUrl.Details;
        }
        /**
         * Deletes all items from the history.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/history.json
         */
        export function deleteAll(): void;
        export function deleteAll(callback: (() => void)): void;
        /**
         * Removes all items within the specified date range from the history.  Pages will not be removed from the history unless all visits fall within the range.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/history.json
         */
        export function deleteRange(range: deleteRange.Range): void;
        export function deleteRange(range: deleteRange.Range, callback: (() => void)): void;
        export namespace deleteRange {
            export type Range = browser.history.deleteRange.Range;
        }
        /**
         * Removes all occurrences of the given URL from the history.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/history.json
         */
        export function deleteUrl(details: deleteUrl.Details): void;
        export function deleteUrl(details: deleteUrl.Details, callback: (() => void)): void;
        export namespace deleteUrl {
            export type Details = browser.history.deleteUrl.Details;
        }
        /**
         * Retrieves information about visits to a URL.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/history.json
         */
        export function getVisits(details: getVisits.Details): void;
        export function getVisits(details: getVisits.Details, callback: ((results: VisitItem[]) => void)): void;
        export namespace getVisits {
            export type Details = browser.history.getVisits.Details;
        }
        /**
         * Searches the history for the last visit time of each page matching the query.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/history.json
         */
        export function search(query: search.Query): void;
        export function search(query: search.Query, callback: ((results: HistoryItem[]) => void)): void;
        export namespace search {
            export type Query = browser.history.search.Query;
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
        export import LanguageCode = browser.i18n.LanguageCode;
        /**
         * Detects the language of the provided text using CLD.
         *
         * @param text User input string to be translated.
         * @returns LanguageDetectionResult object that holds detected langugae reliability and array of DetectedLanguage
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/i18n.json
         */
        export function detectLanguage(text: string): void;
        export function detectLanguage(text: string, callback: ((result: detectLanguage.Result) => void)): void;
        export namespace detectLanguage {
            export type Result = browser.i18n.detectLanguage.Result;
        }
        /**
         * Gets the accept-languages of the browser. This is different from the locale used by the browser; to get the locale, use {@link browser.i18n.getUILanguage}.
         *
         * @returns Array of LanguageCode
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/i18n.json
         */
        export function getAcceptLanguages(): void;
        export function getAcceptLanguages(callback: ((languages: LanguageCode[]) => void)): void;
        export import getMessage = browser.i18n.getMessage;
        /**
         * Gets the preferred locales of the operating system. This is different from the locales set in the browser; to get those, use {@link browser.i18n.getAcceptLanguages}.
         *
         * @returns Array of LanguageCode
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/i18n.json
         */
        export function getPreferredSystemLanguages(): void;
        export function getPreferredSystemLanguages(callback: ((languages: LanguageCode[]) => void)): void;
        export import getUILanguage = browser.i18n.getUILanguage;
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
        export import AccountInfo = browser.identity.AccountInfo;
        export import onSignInChanged = browser.identity.onSignInChanged;
        /**
         * Retrieves a list of AccountInfo objects describing the accounts present on the profile.
         *
         * @deprecated Firefox does not support this function. It does not exist at runtime.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/identity.json
         */
        export function getAccounts(): void;
        export function getAccounts(callback: ((results: AccountInfo[]) => void)): void;
        /**
         * Gets an OAuth2 access token using the client ID and scopes specified in the oauth2 section of manifest.json.
         *
         * @deprecated Firefox does not support this function. It does not exist at runtime.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/identity.json
         */
        export function getAuthToken(details?: getAuthToken.Details | null): void;
        export function getAuthToken(details: getAuthToken.Details | null | undefined, callback: ((results: AccountInfo[]) => void)): void;
        export function getAuthToken(callback: ((results: AccountInfo[]) => void)): void;
        export namespace getAuthToken {
            export type Details = browser.identity.getAuthToken.Details;
        }
        /**
         * Retrieves email address and obfuscated gaia id of the user signed into a profile.
         *
         * @deprecated Firefox does not support this function. It does not exist at runtime.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/identity.json
         */
        export function getProfileUserInfo(): void;
        export function getProfileUserInfo(callback: ((userinfo: getProfileUserInfo.Result) => void)): void;
        export namespace getProfileUserInfo {
            export type Result = browser.identity.getProfileUserInfo.Result;
        }
        export import getRedirectURL = browser.identity.getRedirectURL;
        /**
         * Starts an auth flow at the specified URL.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/identity.json
         */
        export function launchWebAuthFlow(details: launchWebAuthFlow.Details): void;
        export function launchWebAuthFlow(details: launchWebAuthFlow.Details, callback: (( responseUrl: string) => void)): void;
        export namespace launchWebAuthFlow {
            export type Details = browser.identity.launchWebAuthFlow.Details;
        }
        /**
         * Removes an OAuth2 access token from the Identity API's token cache.
         *
         * @deprecated Firefox does not support this function. It does not exist at runtime.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/identity.json
         */
        export function removeCachedAuthToken(details: removeCachedAuthToken.Details): void;
        export function removeCachedAuthToken(details: removeCachedAuthToken.Details, callback: ((userinfo: removeCachedAuthToken.Result) => void)): void;
        export namespace removeCachedAuthToken {
            export type Details = browser.identity.removeCachedAuthToken.Details;
            export type Result = browser.identity.removeCachedAuthToken.Result;
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
        export import IdleState = browser.idle.IdleState;
        export import onStateChanged = browser.idle.onStateChanged;
        /**
         * Returns "idle" if the user has not generated any input for a specified number of seconds, or "active" otherwise.
         *
         * @param detectionIntervalInSeconds The system is considered idle if detectionIntervalInSeconds seconds have elapsed since the last user input detected.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/idle.json
         */
        export function queryState(detectionIntervalInSeconds: number): void;
        export function queryState(detectionIntervalInSeconds: number, callback: ((newState: IdleState) => void)): void;
        export import setDetectionInterval = browser.idle.setDetectionInterval;
    }
    /**
     * The `browser.management` API provides ways to manage the list of extensions that are installed and running.
     *
     * Not available in content scripts or devtools pages.
     *
     * @platform desktop, mobile
     */
    export namespace management {
        export import ExtensionDisabledReason = browser.management.ExtensionDisabledReason;
        export import ExtensionInfo = browser.management.ExtensionInfo;
        export import ExtensionInstallType = browser.management.ExtensionInstallType;
        export import ExtensionType = browser.management.ExtensionType;
        export import IconInfo = browser.management.IconInfo;
        export import onDisabled = browser.management.onDisabled;
        export import onEnabled = browser.management.onEnabled;
        export import onInstalled = browser.management.onInstalled;
        export import onUninstalled = browser.management.onUninstalled;
        /**
         * Returns information about the installed extension that has the given ID.
         *
         * @param id The ID from an item of {@link browser.management.ExtensionInfo}.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/management.json
         * @permission management
         */
        export function get(id: browser.manifest.ExtensionID): void;
        export function get(id: browser.manifest.ExtensionID, callback: ((result: ExtensionInfo) => void)): void;
        /**
         * Returns a list of information about installed extensions.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/management.json
         * @permission management
         */
        export function getAll(): void;
        export function getAll(callback: ((result: ExtensionInfo[]) => void)): void;
        /**
         * Returns information about the calling extension. Note: This function can be used without requesting the 'management' permission in the manifest.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/management.json
         */
        export function getSelf(): void;
        export function getSelf(callback: ((result: ExtensionInfo) => void)): void;
        /**
         * Installs and enables a theme extension from the given url.
         *
         * Must be called from a user input handler.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/management.json
         * @permission management
         */
        export function install(options: install.Options): void;
        export function install(options: install.Options, callback: ((result: install.Result) => void)): void;
        export namespace install {
            export type Options = browser.management.install.Options;
            export type Result = browser.management.install.Result;
        }
        /**
         * Enables or disables the given add-on.
         *
         * @param id ID of the add-on to enable/disable.
         * @param enabled Whether to enable or disable the add-on.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/management.json
         * @permission management
         */
        export function setEnabled(id: string, enabled: boolean): void;
        export function setEnabled(id: string, enabled: boolean, callback: (() => void)): void;
        /**
         * Uninstalls the calling extension. Note: This function can be used without requesting the 'management' permission in the manifest.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/management.json
         */
        export function uninstallSelf(options?: uninstallSelf.Options | null): void;
        export function uninstallSelf(options: uninstallSelf.Options | null | undefined, callback: (() => void)): void;
        export function uninstallSelf(callback: (() => void)): void;
        export namespace uninstallSelf {
            export type Options = browser.management.uninstallSelf.Options;
        }
    }
    export import manifest = browser.manifest;
    /**
     * Use the browser.menus API to add items to the browser's menus. You can choose what types of objects your context menu additions apply to, such as images, hyperlinks, and pages.
     *
     * Also available in content scripts and devtools pages.
     *
     * @permission menus
     * @platform desktop
     */
    export namespace menus {
        export import ContextType = browser.menus.ContextType;
        export import ItemType = browser.menus.ItemType;
        export import OnClickData = browser.menus.OnClickData;
        export import ACTION_MENU_TOP_LEVEL_LIMIT = browser.menus.ACTION_MENU_TOP_LEVEL_LIMIT;
        export import onClicked = browser.menus.onClicked;
        export import onHidden = browser.menus.onHidden;
        export import onShown = browser.menus.onShown;
        export import create = browser.menus.create;
        export import getTargetElement = browser.menus.getTargetElement;
        export import overrideContext = browser.menus.overrideContext;
        /**
         * Updates the extension items in the shown menu, including changes that have been made since the menu was shown. Has no effect if the menu is hidden. Rebuilding a shown menu is an expensive operation, only invoke this method when necessary.
         *
         * Not available in content scripts or devtools pages.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/menus.json
         */
        export function refresh(): void;
        /**
         * Removes a context menu item.
         *
         * Not available in content scripts or devtools pages.
         *
         * @param menuItemId The ID of the context menu item to remove.
         * @param callback Called when the context menu has been removed.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/menus.json
         */
        export function remove(menuItemId: number | string): void;
        export function remove(menuItemId: number | string, callback: (() => void)): void;
        /**
         * Removes all context menu items added by this extension.
         *
         * Not available in content scripts or devtools pages.
         *
         * @param callback Called when removal is complete.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/menus.json
         */
        export function removeAll(): void;
        export function removeAll(callback: (() => void)): void;
        /**
         * Updates a previously created context menu item.
         *
         * Not available in content scripts or devtools pages.
         *
         * @param id The ID of the item to update.
         * @param updateProperties The properties to update. Accepts the same values as the create function.
         * @param callback Called when the context menu has been updated.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/menus.json
         */
        export function update(id: number | string, updateProperties: update.UpdateProperties): void;
        export function update(id: number | string, updateProperties: update.UpdateProperties, callback: (() => void)): void;
        export namespace update {
            export type UpdateProperties = browser.menus.update.UpdateProperties;
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
        export import NetworkLinkInfo = browser.networkStatus.NetworkLinkInfo;
        export import onConnectionChanged = browser.networkStatus.onConnectionChanged;
        /**
         * Returns the {@link browser.networkStatus.NetworkLinkInfo} of the current network connection.
         *
         * @returns The link info of the current network connection.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/network_status.json
         */
        export function getLinkInfo(): void;
        export function getLinkInfo(callback: ((linkInfo: NetworkLinkInfo) => void)): void;
    }
    /**
     * Not available in content scripts or devtools pages.
     *
     * @permission notifications
     * @platform desktop, mobile
     */
    export namespace notifications {
        export import CreateNotificationOptions = browser.notifications.CreateNotificationOptions;
        export import NotificationItem = browser.notifications.NotificationItem;
        export import PermissionLevel = browser.notifications.PermissionLevel;
        export import TemplateType = browser.notifications.TemplateType;
        export import UpdateNotificationOptions = browser.notifications.UpdateNotificationOptions;
        export import onButtonClicked = browser.notifications.onButtonClicked;
        export import onClicked = browser.notifications.onClicked;
        export import onClosed = browser.notifications.onClosed;
        export import onPermissionLevelChanged = browser.notifications.onPermissionLevelChanged;
        export import onShowSettings = browser.notifications.onShowSettings;
        export import onShown = browser.notifications.onShown;
        /**
         * Clears an existing notification.
         *
         * @param notificationId The id of the notification to be updated.
         * @returns Indicates whether a matching notification existed.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/notifications.json
         */
        export function clear(notificationId: string): void;
        export function clear(notificationId: string, callback: ((wasCleared: boolean) => void)): void;
        /**
         * Creates and displays a notification.
         *
         * @param notificationId Identifier of the notification. If it is empty, this method generates an id. If it matches an existing notification, this method first clears that notification before proceeding with the create operation.
         * @param options Contents of the notification.
         * @returns The notification id (either supplied or generated) that represents the created notification.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/notifications.json
         */
        export function create(notificationId: string | null | undefined, options: CreateNotificationOptions): void;
        export function create(options: CreateNotificationOptions): void;
        export function create(notificationId: string | null | undefined, options: CreateNotificationOptions, callback: ((notificationId: string) => void)): void;
        export function create(options: CreateNotificationOptions, callback: ((notificationId: string) => void)): void;
        /**
         * Retrieves all the notifications.
         *
         * @returns The set of notifications currently in the system.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/notifications.json
         */
        export function getAll(): void;
        export function getAll(callback: ((notifications: { [key: string]: CreateNotificationOptions }) => void)): void;
        /**
         * Retrieves whether the user has enabled notifications from this app or extension.
         *
         * @returns The current permission level.
         * @deprecated Firefox does not support this function. It does not exist at runtime.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/notifications.json
         */
        export function getPermissionLevel(): void;
        export function getPermissionLevel(callback: ((level: PermissionLevel) => void)): void;
        /**
         * Updates an existing notification.
         *
         * @param notificationId The id of the notification to be updated.
         * @param options Contents of the notification to update to.
         * @returns Indicates whether a matching notification existed.
         * @deprecated Firefox does not support this function. It does not exist at runtime.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/notifications.json
         */
        export function update(notificationId: string, options: UpdateNotificationOptions): void;
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
        export import DefaultSuggestResult = browser.omnibox.DefaultSuggestResult;
        export import DescriptionStyleType = browser.omnibox.DescriptionStyleType;
        export import OnInputEnteredDisposition = browser.omnibox.OnInputEnteredDisposition;
        export import SuggestResult = browser.omnibox.SuggestResult;
        export import onDeleteSuggestion = browser.omnibox.onDeleteSuggestion;
        export import onInputCancelled = browser.omnibox.onInputCancelled;
        export import onInputChanged = browser.omnibox.onInputChanged;
        export import onInputEntered = browser.omnibox.onInputEntered;
        export import onInputStarted = browser.omnibox.onInputStarted;
        /**
         * Sets the description and styling for the default suggestion. The default suggestion is the text that is displayed in the first suggestion row underneath the URL bar.
         *
         * @param suggestion A partial SuggestResult object, without the 'content' parameter.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/omnibox.json
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
        export import ImageDataType = browser.pageAction.ImageDataType;
        export import OnClickData = browser.pageAction.OnClickData;
        export import onClicked = browser.pageAction.onClicked;
        /**
         * Gets the html document set as the popup for this page action.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/page_action.json
         */
        export function getPopup(details: getPopup.Details): void;
        export function getPopup(details: getPopup.Details, callback: ((result: string) => void)): void;
        export namespace getPopup {
            export type Details = browser.pageAction.getPopup.Details;
        }
        /**
         * Gets the title of the page action.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/page_action.json
         */
        export function getTitle(details: getTitle.Details): void;
        export function getTitle(details: getTitle.Details, callback: ((result: string) => void)): void;
        export namespace getTitle {
            export type Details = browser.pageAction.getTitle.Details;
        }
        /**
         * Hides the page action.
         *
         * @param tabId The id of the tab for which you want to modify the page action.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/page_action.json
         */
        export function hide(tabId: number): void;
        export function hide(tabId: number, callback: (() => void)): void;
        /**
         * Checks whether the page action is shown.
         *
         * @returns Whether the page action is shown in the tab.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/page_action.json
         */
        export function isShown(details: isShown.Details): void;
        export function isShown(details: isShown.Details, callback: ((result: boolean) => void)): void;
        export namespace isShown {
            export type Details = browser.pageAction.isShown.Details;
        }
        /**
         * Opens the extension page action in the active window.
         *
         * Must be called from a user input handler.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/page_action.json
         */
        export function openPopup(): void;
        /**
         * Sets the icon for the page action. The icon can be specified either as the path to an image file or as the pixel data from a canvas element, or as dictionary of either one of those. Either the **path** or the **imageData** property must be specified.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/page_action.json
         */
        export function setIcon(details: setIcon.Details): void;
        export function setIcon(details: setIcon.Details, callback: (() => void)): void;
        export namespace setIcon {
            export type Details = browser.pageAction.setIcon.Details;
        }
        /**
         * Sets the html document to be opened as a popup when the user clicks on the page action's icon.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/page_action.json
         */
        export function setPopup(details: setPopup.Details): void;
        export namespace setPopup {
            export type Details = browser.pageAction.setPopup.Details;
        }
        export import setTitle = browser.pageAction.setTitle;
        /**
         * Shows the page action. The page action is shown whenever the tab is selected.
         *
         * @param tabId The id of the tab for which you want to modify the page action.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/page_action.json
         */
        export function show(tabId: number): void;
        export function show(tabId: number, callback: (() => void)): void;
    }
    /**
     * Not available in content scripts or devtools pages.
     *
     * @platform desktop, mobile
     */
    export namespace permissions {
        export import AnyPermissions = browser.permissions.AnyPermissions;
        export import Permissions = browser.permissions.Permissions;
        export import onAdded = browser.permissions.onAdded;
        export import onRemoved = browser.permissions.onRemoved;
        /**
         * Check if the extension has the given permissions.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/permissions.json
         */
        export function contains(permissions: Normalizable<AnyPermissions>): void;
        export function contains(permissions: Normalizable<AnyPermissions>, callback: ((result: boolean) => void)): void;
        /**
         * Get a list of all the extension's permissions.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/permissions.json
         */
        export function getAll(): void;
        export function getAll(callback: ((permissions: AnyPermissions) => void)): void;
        /**
         * Relinquish the given permissions.
         *
         * @returns True if the permissions were removed.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/permissions.json
         */
        export function remove(permissions: Normalizable<Permissions>): void;
        export function remove(permissions: Normalizable<Permissions>, callback: ((removed: boolean) => void)): void;
        /**
         * Request the given permissions.
         *
         * Must be called from a user input handler.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/permissions.json
         */
        export function request(permissions: Normalizable<Permissions>): void;
        export function request(permissions: Normalizable<Permissions>, callback: ((granted: boolean) => void)): void;
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
         * @returns The slots of the module.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/pkcs11.json
         */
        export function getModuleSlots(name: string): void;
        export function getModuleSlots(name: string, callback: ((slots: ({
            /**
             * The name of the slot.
             */
            name: string;
            /**
             * The token in the slot, or null if the slot is disabled or empty.
             */
            token: {
                FWVersion: string;
                HWVersion: string;
                isLoggedIn: boolean;
                manufacturer: string;
                name: string;
                serial: string;
            } | null;
        })[]) => void)): void;
        /**
         * Install a PKCS#11 module with a given name
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/pkcs11.json
         */
        export function installModule(name: string, flags?: number | null): void;
        /**
         * checks whether a PKCS#11 module, given by name, is installed
         *
         * @returns Whether the module is installed.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/pkcs11.json
         */
        export function isModuleInstalled(name: string): void;
        export function isModuleInstalled(name: string, callback: ((result: boolean) => void)): void;
        /**
         * Remove an installed PKCS#11 module from firefox
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/pkcs11.json
         */
        export function uninstallModule(name: string): void;
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
            export import HTTPSOnlyModeOption = browser.privacy.network.HTTPSOnlyModeOption;
            export import IPHandlingPolicy = browser.privacy.network.IPHandlingPolicy;
            export import tlsVersionRestrictionConfig = browser.privacy.network.tlsVersionRestrictionConfig;
            /**
             * Allow users to query the status of 'Global Privacy Control'. This setting's value is of type boolean, defaulting to `false`.
             *
             * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/privacy.json
             */
            export const globalPrivacyControl: chrome.types.Setting;
            /**
             * Allow users to query the mode for 'HTTPS-Only Mode'. This setting's value is of type HTTPSOnlyModeOption, defaulting to `never`.
             *
             * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/privacy.json
             */
            export const httpsOnlyMode: chrome.types.Setting;
            /**
             * If enabled, the browser attempts to speed up your web browsing experience by pre-resolving DNS entries, prerendering sites (`<link rel='prefetch' ...>`), and preemptively opening TCP and SSL connections to servers.  This preference's value is a boolean, defaulting to `true`.
             *
             * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/privacy.json
             */
            export const networkPredictionEnabled: chrome.types.Setting;
            /**
             * Allow users to enable and disable RTCPeerConnections (aka WebRTC).
             *
             * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/privacy.json
             */
            export const peerConnectionEnabled: chrome.types.Setting;
            /**
             * This property controls the minimum and maximum TLS versions. This setting's value is an object of {@link browser.privacy.network.tlsVersionRestrictionConfig}.
             *
             * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/privacy.json
             */
            export const tlsVersionRestriction: chrome.types.Setting;
            /**
             * Allow users to specify the media performance/privacy tradeoffs which impacts how WebRTC traffic will be routed and how much local address information is exposed. This preference's value is of type IPHandlingPolicy, defaulting to `default`.
             *
             * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/privacy.json
             */
            export const webRTCIPHandlingPolicy: chrome.types.Setting;
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
             * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/privacy.json
             */
            export const passwordSavingEnabled: chrome.types.Setting;
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
            export import CookieConfig = browser.privacy.websites.CookieConfig;
            export import TrackingProtectionModeOption = browser.privacy.websites.TrackingProtectionModeOption;
            /**
             * Allow users to specify the default settings for allowing cookies, as well as whether all cookies should be created as non-persistent cookies. This setting's value is of type CookieConfig.
             *
             * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/privacy.json
             */
            export const cookieConfig: chrome.types.Setting;
            /**
             * If enabled, the browser will associate all data (including cookies, HSTS data, cached images, and more) for any third party domains with the domain in the address bar. This prevents third party trackers from using directly stored information to identify you across different websites, but may break websites where you login with a third party account (such as a Facebook or Google login.) The value of this preference is of type boolean, and the default value is `false`.
             *
             * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/privacy.json
             */
            export const firstPartyIsolate: chrome.types.Setting;
            /**
             * If enabled, the browser sends auditing pings when requested by a website (`<a ping>`). The value of this preference is of type boolean, and the default value is `true`.
             *
             * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/privacy.json
             */
            export const hyperlinkAuditingEnabled: chrome.types.Setting;
            /**
             * **Available on Windows and ChromeOS only**: If enabled, the browser provides a unique ID to plugins in order to run protected content. The value of this preference is of type boolean, and the default value is `true`.
             *
             * @deprecated Firefox does not support this property. It does not exist at runtime.
             * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/privacy.json
             */
            export const protectedContentEnabled: chrome.types.Setting;
            /**
             * If enabled, the browser sends `referer` headers with your requests. Yes, the name of this preference doesn't match the misspelled header. No, we're not going to change it. The value of this preference is of type boolean, and the default value is `true`.
             *
             * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/privacy.json
             */
            export const referrersEnabled: chrome.types.Setting;
            /**
             * If enabled, the browser attempts to appear similar to other users by reporting generic information to websites. This can prevent websites from uniquely identifying users. Examples of data that is spoofed include number of CPU cores, precision of JavaScript timers, the local timezone, and disabling features such as GamePad support, and the WebSpeech and Navigator APIs. The value of this preference is of type boolean, and the default value is `false`.
             *
             * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/privacy.json
             */
            export const resistFingerprinting: chrome.types.Setting;
            /**
             * If disabled, the browser blocks third-party sites from setting cookies. The value of this preference is of type boolean, and the default value is `true`.
             *
             * @deprecated Firefox does not support this property. It does not exist at runtime.
             * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/privacy.json
             */
            export const thirdPartyCookiesAllowed: chrome.types.Setting;
            /**
             * Allow users to specify the mode for tracking protection. This setting's value is of type TrackingProtectionModeOption, defaulting to `private_browsing_only`.
             *
             * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/privacy.json
             */
            export const trackingProtectionMode: chrome.types.Setting;
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
        export import ProxyConfig = browser.proxy.ProxyConfig;
        /**
         * Configures proxy settings. This setting's value is an object of type ProxyConfig.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/proxy.json
         */
        export const settings: chrome.types.Setting;
        export import onError = browser.proxy.onError;
        export import onRequest = browser.proxy.onRequest;
    }
    export import publicSuffix = browser.publicSuffix;
    /**
     * Use the `browser.runtime` API to retrieve the background page, return details about the manifest, and listen for and respond to events in the app or extension lifecycle. You can also use this API to convert the relative path of URLs to fully-qualified URLs.
     *
     * Also available in content scripts and devtools pages.
     *
     * @platform desktop, mobile
     */
    export namespace runtime {
        export import BrowserInfo = browser.runtime.BrowserInfo;
        export import ContextFilter = browser.runtime.ContextFilter;
        export import ContextType = browser.runtime.ContextType;
        export import ExtensionContext = browser.runtime.ExtensionContext;
        export import MessageSender = browser.runtime.MessageSender;
        export import OnInstalledReason = browser.runtime.OnInstalledReason;
        export import OnPerformanceWarningCategory = browser.runtime.OnPerformanceWarningCategory;
        export import OnPerformanceWarningSeverity = browser.runtime.OnPerformanceWarningSeverity;
        export import OnRestartRequiredReason = browser.runtime.OnRestartRequiredReason;
        export import PlatformArch = browser.runtime.PlatformArch;
        export import PlatformInfo = browser.runtime.PlatformInfo;
        export import PlatformOs = browser.runtime.PlatformOs;
        export import Port = browser.runtime.Port;
        export import RequestUpdateCheckStatus = browser.runtime.RequestUpdateCheckStatus;
        export import id = browser.runtime.id;
        export import lastError = browser.runtime.lastError;
        export import onBrowserUpdateAvailable = browser.runtime.onBrowserUpdateAvailable;
        export import onConnect = browser.runtime.onConnect;
        export import onConnectExternal = browser.runtime.onConnectExternal;
        export import onInstalled = browser.runtime.onInstalled;
        export import onMessage = browser.runtime.onMessage;
        export import onMessageExternal = browser.runtime.onMessageExternal;
        export import onPerformanceWarning = browser.runtime.onPerformanceWarning;
        export import onRestartRequired = browser.runtime.onRestartRequired;
        export import onStartup = browser.runtime.onStartup;
        export import onSuspend = browser.runtime.onSuspend;
        export import onSuspendCanceled = browser.runtime.onSuspendCanceled;
        export import onUpdateAvailable = browser.runtime.onUpdateAvailable;
        export import onUserScriptConnect = browser.runtime.onUserScriptConnect;
        export import onUserScriptMessage = browser.runtime.onUserScriptMessage;
        export import connect = browser.runtime.connect;
        export import connectNative = browser.runtime.connectNative;
        /**
         * Retrieves the JavaScript 'window' object for the background page running inside the current extension/app. If the background page is an event page, the system will ensure it is loaded before calling the callback. If there is no background page, an error is set.
         *
         * Not available in content scripts or devtools pages.
         *
         * @returns The JavaScript 'window' object for the background page.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/runtime.json
         */
        export function getBackgroundPage(): void;
        export function getBackgroundPage(callback: ((backgroundPage: Window | null) => void)): void;
        /**
         * Returns information about the current browser.
         *
         * Not available in content scripts or devtools pages.
         *
         * @param callback Called with results
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/runtime.json
         */
        export function getBrowserInfo(): void;
        export function getBrowserInfo(callback: ((browserInfo: BrowserInfo) => void)): void;
        /**
         * Fetches information about active contexts associated with this extension
         *
         * Not available in content scripts or devtools pages.
         *
         * @param filter A filter to find matching context.
         * @returns The matching contexts, if any.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/runtime.json
         */
        export function getContexts(filter: ContextFilter): void;
        export function getContexts(filter: ContextFilter, callback: ((contexts: ExtensionContext[]) => void)): void;
        export import getDocumentId = browser.runtime.getDocumentId;
        export import getFrameId = browser.runtime.getFrameId;
        export import getManifest = browser.runtime.getManifest;
        /**
         * Returns a DirectoryEntry for the package directory.
         *
         * Not available in content scripts or devtools pages.
         *
         * @deprecated Firefox does not support this function. It does not exist at runtime.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/runtime.json
         */
        export function getPackageDirectoryEntry(): void;
        export function getPackageDirectoryEntry(callback: ((directoryEntry: FileSystemDirectoryEntry) => void)): void;
        /**
         * Returns information about the current platform.
         *
         * Not available in content scripts or devtools pages.
         *
         * @param callback Called with results
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/runtime.json
         */
        export function getPlatformInfo(): void;
        export function getPlatformInfo(callback: ((platformInfo: PlatformInfo) => void)): void;
        export import getURL = browser.runtime.getURL;
        export import getVersion = browser.runtime.getVersion;
        /**
         * Open your Extension's options page, if possible.
         *
         * The precise behavior may depend on your manifest's `options_ui` or `options_page` key, or what the browser happens to support at the time.
         *
         * If your Extension does not declare an options page, or the browser failed to create one for some other reason, the callback will set {@link browser.runtime.lastError}.
         *
         * Not available in content scripts or devtools pages.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/runtime.json
         */
        export function openOptionsPage(): void;
        export function openOptionsPage(callback: (() => void)): void;
        export import reload = browser.runtime.reload;
        /**
         * Requests an update check for this app/extension.
         *
         * Not available in content scripts or devtools pages.
         *
         * @returns
         * - `status`: Result of the update check.
         * - `details`: If an update is available, this contains more information about the available update.
         * @deprecated Firefox does not support this function. It does not exist at runtime.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/runtime.json
         */
        export function requestUpdateCheck(): void;
        export function requestUpdateCheck(callback: ((status: RequestUpdateCheckStatus, details: requestUpdateCheck.Details | undefined) => void)): void;
        export namespace requestUpdateCheck {
            export type Details = browser.runtime.requestUpdateCheck.Details;
        }
        export import restart = browser.runtime.restart;
        /**
         * Sends a single message to event listeners within your extension/app or a different extension/app. Similar to {@link browser.runtime.connect} but only sends a single message, with an optional response. If sending to your extension, the {@link browser.runtime.onMessage} event will be fired in each page, or {@link browser.runtime.onMessageExternal}, if a different extension. Note that extensions cannot send messages to content scripts using this method. To send messages to content scripts, use {@link browser.tabs.sendMessage}.
         *
         * @param extensionId The ID of the extension/app to send the message to. If omitted, the message will be sent to your own extension/app. Required if sending messages from a web page for web messaging.
         * @returns The JSON response object sent by the handler of the message. If an error occurs while connecting to the extension, the callback will be called with no arguments and {@link browser.runtime.lastError} will be set to the error message.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/runtime.json
         */
        export function sendMessage(message: any, options?: Record<string, never> | null): void;
        export function sendMessage(message: any, responseCallback: ((response: any) => void)): void;
        export function sendMessage(extensionId: string | null | undefined, message: any, options?: Record<string, never> | null): void;
        export function sendMessage(message: any, options: Record<string, never> | null | undefined, responseCallback: ((response: any) => void)): void;
        export function sendMessage(extensionId: string | null | undefined, message: any, responseCallback: ((response: any) => void)): void;
        export function sendMessage(extensionId: string | null | undefined, message: any, options: Record<string, never> | null | undefined, responseCallback: ((response: any) => void)): void;
        /**
         * Send a single message to a native application.
         *
         * Also available in content scripts, but not in devtools pages.
         *
         * @param application The name of the native messaging host.
         * @param message The message that will be passed to the native messaging host.
         * @returns The response message sent by the native messaging host. If an error occurs while connecting to the native messaging host, the callback will be called with no arguments and {@link browser.runtime.lastError} will be set to the error message.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/runtime.json
         * @permission nativeMessaging
         */
        export function sendNativeMessage(application: string, message: any): void;
        export function sendNativeMessage(application: string, message: any, responseCallback: ((response: any) => void)): void;
        /**
         * Sets the URL to be visited upon uninstallation. This may be used to clean up server-side data, do analytics, and implement surveys. Maximum 1023 characters.
         *
         * Not available in content scripts or devtools pages.
         *
         * @param url URL to be opened after the extension is uninstalled. This URL must have an http: or https: scheme. Set an empty string to not open a new tab upon uninstallation.
         * @param callback Called when the uninstall URL is set. If the given URL is invalid, {@link browser.runtime.lastError} will be set.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/runtime.json
         */
        export function setUninstallURL(url?: string | null): void;
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
        export import CSSInjection = browser.scripting.CSSInjection;
        export import ContentScriptFilter = browser.scripting.ContentScriptFilter;
        export import ExecutionWorld = browser.scripting.ExecutionWorld;
        export import InjectionResult = browser.scripting.InjectionResult;
        export import InjectionTarget = browser.scripting.InjectionTarget;
        export import RegisteredContentScript = browser.scripting.RegisteredContentScript;
        export import ScriptInjection = browser.scripting.ScriptInjection;
        /**
         * Injects a script into a target context. The script will be run at `document_idle`.
         *
         * @param injection The details of the script which to inject.
         * @param callback Invoked upon completion of the injection. The resulting array contains the result of execution for each frame where the injection succeeded.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/scripting.json
         */
        export function executeScript<Args extends unknown[], Result>(injection: ScriptInjection<Args, Result>): void;
        export function executeScript<Args extends unknown[], Result>(injection: ScriptInjection<Args, Result>, callback: ((results: InjectionResult<Awaited<Result>>[]) => void)): void;
        /**
         * Returns all dynamically registered content scripts for this extension that match the given filter.
         *
         * @param filter An object to filter the extension's dynamically registered scripts.
         * @param callback The resulting array contains the registered content scripts.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/scripting.json
         */
        export function getRegisteredContentScripts(filter?: ContentScriptFilter | null): void;
        export function getRegisteredContentScripts(filter: ContentScriptFilter | null | undefined, callback: ((scripts: RegisteredContentScript[]) => void)): void;
        export function getRegisteredContentScripts(callback: ((scripts: RegisteredContentScript[]) => void)): void;
        /**
         * Inserts a CSS stylesheet into a target context. If multiple frames are specified, unsuccessful injections are ignored.
         *
         * @param injection The details of the styles to insert.
         * @param callback Invoked upon completion of the injection.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/scripting.json
         */
        export function insertCSS(injection: CSSInjection): void;
        export function insertCSS(injection: CSSInjection, callback: (() => void)): void;
        /**
         * Registers one or more content scripts for this extension.
         *
         * @param scripts Contains a list of scripts to be registered. If there are errors during script parsing/file validation, or if the IDs specified already exist, then no scripts are registered.
         * @param callback Invoked upon completion of the registration.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/scripting.json
         */
        export function registerContentScripts(scripts: Normalizable<RegisteredContentScript>[]): void;
        export function registerContentScripts(scripts: Normalizable<RegisteredContentScript>[], callback: (() => void)): void;
        /**
         * Removes a CSS stylesheet that was previously inserted by this extension from a target context.
         *
         * @param injection The details of the styles to remove. Note that the `css`, `files`, and `origin` properties must exactly match the stylesheet inserted through `insertCSS`. Attempting to remove a non-existent stylesheet is a no-op.
         * @param callback Invoked upon completion of the injection.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/scripting.json
         */
        export function removeCSS(injection: CSSInjection): void;
        export function removeCSS(injection: CSSInjection, callback: (() => void)): void;
        /**
         * Unregisters one or more content scripts for this extension.
         *
         * @param filter If specified, only unregisters dynamic content scripts which match the filter. Otherwise, all of the extension's dynamic content scripts are unregistered.
         * @param callback Invoked upon completion of the unregistration.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/scripting.json
         */
        export function unregisterContentScripts(filter?: ContentScriptFilter | null): void;
        export function unregisterContentScripts(filter: ContentScriptFilter | null | undefined, callback: (() => void)): void;
        export function unregisterContentScripts(callback: (() => void)): void;
        /**
         * Updates one or more content scripts for this extension.
         *
         * @param scripts Contains a list of scripts to be updated. If there are errors during script parsing/file validation, or if the IDs specified do not already exist, then no scripts are updated.
         * @param callback Invoked when scripts have been updated.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/scripting.json
         */
        export function updateContentScripts(scripts: ({
            /**
             * If specified true, it will inject into all frames, even if the frame is not the top-most frame in the tab. Each frame is checked independently for URL requirements; it will not inject into child frames if the URL requirements are not met. Defaults to false, meaning that only the top frame is matched.
             */
            allFrames?: boolean | null | undefined;
            /**
             * The list of CSS files to be injected into matching pages. These are injected in the order they appear in this array.
             */
            css?: browser.manifest.ExtensionURL[] | null | undefined;
            cssOrigin?: browser.extensionTypes.CSSOrigin | null | undefined;
            /**
             * Excludes pages that this content script would otherwise be injected into.
             */
            excludeMatches?: string[] | null | undefined;
            /**
             * The id of the content script, specified in the API call.
             */
            id: string;
            /**
             * The list of JavaScript files to be injected into matching pages. These are injected in the order they appear in this array.
             */
            js?: browser.manifest.ExtensionURL[] | null | undefined;
            /**
             * If matchOriginAsFallback is true, then the code is also injected in about:, data:, blob: when their origin matches the pattern in 'matches', even if the actual document origin is opaque (due to the use of CSP sandbox or iframe sandbox). Match patterns in 'matches' must specify a wildcard path glob. By default it is `false`.
             */
            matchOriginAsFallback?: boolean | null | undefined;
            /**
             * Specifies which pages this content script will be injected into. Must be specified for `registerContentScripts()`.
             */
            matches?: string[] | null | undefined;
            /**
             * Specifies if this content script will persist into future sessions.
             */
            persistAcrossSessions?: boolean | null | undefined;
            /**
             * Specifies when JavaScript files are injected into the web page. The preferred and default value is `document_idle`.
             */
            runAt?: browser.extensionTypes.RunAt | null | undefined;
            /**
             * The JavaScript world for a script to execute within. Defaults to "ISOLATED".
             */
            world?: ExecutionWorld | null | undefined;
        })[]): void;
        export function updateContentScripts(scripts: ({
            /**
             * If specified true, it will inject into all frames, even if the frame is not the top-most frame in the tab. Each frame is checked independently for URL requirements; it will not inject into child frames if the URL requirements are not met. Defaults to false, meaning that only the top frame is matched.
             */
            allFrames?: boolean | null | undefined;
            /**
             * The list of CSS files to be injected into matching pages. These are injected in the order they appear in this array.
             */
            css?: browser.manifest.ExtensionURL[] | null | undefined;
            cssOrigin?: browser.extensionTypes.CSSOrigin | null | undefined;
            /**
             * Excludes pages that this content script would otherwise be injected into.
             */
            excludeMatches?: string[] | null | undefined;
            /**
             * The id of the content script, specified in the API call.
             */
            id: string;
            /**
             * The list of JavaScript files to be injected into matching pages. These are injected in the order they appear in this array.
             */
            js?: browser.manifest.ExtensionURL[] | null | undefined;
            /**
             * If matchOriginAsFallback is true, then the code is also injected in about:, data:, blob: when their origin matches the pattern in 'matches', even if the actual document origin is opaque (due to the use of CSP sandbox or iframe sandbox). Match patterns in 'matches' must specify a wildcard path glob. By default it is `false`.
             */
            matchOriginAsFallback?: boolean | null | undefined;
            /**
             * Specifies which pages this content script will be injected into. Must be specified for `registerContentScripts()`.
             */
            matches?: string[] | null | undefined;
            /**
             * Specifies if this content script will persist into future sessions.
             */
            persistAcrossSessions?: boolean | null | undefined;
            /**
             * Specifies when JavaScript files are injected into the web page. The preferred and default value is `document_idle`.
             */
            runAt?: browser.extensionTypes.RunAt | null | undefined;
            /**
             * The JavaScript world for a script to execute within. Defaults to "ISOLATED".
             */
            world?: ExecutionWorld | null | undefined;
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
        export import Disposition = browser.search.Disposition;
        export import SearchEngine = browser.search.SearchEngine;
        /**
         * Gets a list of search engines.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/search.json
         */
        export function get(): void;
        /**
         * Use the chrome.search API to search via the default provider.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/search.json
         */
        export function query(queryInfo: query.QueryInfo): void;
        export function query(queryInfo: query.QueryInfo, callback: (() => void)): void;
        export namespace query {
            export type QueryInfo = browser.search.query.QueryInfo;
        }
        /**
         * Perform a search.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/search.json
         */
        export function search(searchProperties: search.SearchProperties): void;
        export namespace search {
            export type SearchProperties = browser.search.search.SearchProperties;
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
        export import Device = browser.sessions.Device;
        export import Filter = browser.sessions.Filter;
        export import Session = browser.sessions.Session;
        export import MAX_SESSION_RESULTS = browser.sessions.MAX_SESSION_RESULTS;
        export import onChanged = browser.sessions.onChanged;
        /**
         * Forget a recently closed tab.
         *
         * @param windowId The windowId of the window to which the recently closed tab to be forgotten belongs.
         * @param sessionId The sessionId (closedId) of the recently closed tab to be forgotten.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/sessions.json
         */
        export function forgetClosedTab(windowId: number, sessionId: string): void;
        /**
         * Forget a recently closed window.
         *
         * @param sessionId The sessionId (closedId) of the recently closed window to be forgotten.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/sessions.json
         */
        export function forgetClosedWindow(sessionId: string): void;
        /**
         * Retrieves all devices with synced sessions.
         *
         * @returns The list of {@link browser.sessions.Device} objects for each synced session, sorted in order from device with most recently modified session to device with least recently modified session. {@link browser.tabs.Tab} objects are sorted by recency in the {@link browser.windows.Window} of the {@link browser.sessions.Session} objects.
         * @deprecated Firefox does not support this function. It does not exist at runtime.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/sessions.json
         */
        export function getDevices(filter?: Filter | null): void;
        export function getDevices(filter: Filter | null | undefined, callback: ((devices: Device[]) => void)): void;
        export function getDevices(callback: ((devices: Device[]) => void)): void;
        /**
         * Gets the list of recently closed tabs and/or windows.
         *
         * @param filter Defaults to `{}`.
         * @returns The list of closed entries in reverse order that they were closed (the most recently closed tab or window will be at index `0`). The entries may contain either tabs or windows.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/sessions.json
         */
        export function getRecentlyClosed(filter?: Filter | null): void;
        export function getRecentlyClosed(filter: Filter | null | undefined, callback: ((sessions: Session[]) => void)): void;
        export function getRecentlyClosed(callback: ((sessions: Session[]) => void)): void;
        /**
         * Retrieve a value that was set for a given key on a given tab.
         *
         * @param tabId The id of the tab whose value is being retrieved from.
         * @param key The key which corresponds to the value.
         * @returns The value, or undefined if the key is not set.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/sessions.json
         */
        export function getTabValue(tabId: number, key: string): void;
        export function getTabValue(tabId: number, key: string, callback: ((value: any) => void)): void;
        /**
         * Retrieve a value that was set for a given key on a given window.
         *
         * @param windowId The id of the window whose value is being retrieved from.
         * @param key The key which corresponds to the value.
         * @returns The value, or undefined if the key is not set.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/sessions.json
         */
        export function getWindowValue(windowId: number, key: string): void;
        export function getWindowValue(windowId: number, key: string, callback: ((value: any) => void)): void;
        /**
         * Remove a key/value pair that was set on a given tab.
         *
         * @param tabId The id of the tab whose key/value pair is being removed.
         * @param key The key which corresponds to the value.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/sessions.json
         */
        export function removeTabValue(tabId: number, key: string): void;
        /**
         * Remove a key/value pair that was set on a given window.
         *
         * @param windowId The id of the window whose key/value pair is being removed.
         * @param key The key which corresponds to the value.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/sessions.json
         */
        export function removeWindowValue(windowId: number, key: string): void;
        /**
         * Reopens a {@link browser.windows.Window} or {@link browser.tabs.Tab}, with an optional callback to run when the entry has been restored.
         *
         * @param sessionId The {@link browser.windows.Window.sessionId}, or {@link browser.tabs.Tab.sessionId} to restore. If this parameter is not specified, the most recently closed session is restored.
         * @returns A {@link browser.sessions.Session} containing the restored {@link browser.windows.Window} or {@link browser.tabs.Tab} object.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/sessions.json
         */
        export function restore(sessionId?: string | null): void;
        export function restore(sessionId: string | null | undefined, callback: ((restoredSession: Session) => void)): void;
        export function restore(callback: ((restoredSession: Session) => void)): void;
        /**
         * Set a key/value pair on a given tab.
         *
         * @param tabId The id of the tab that the key/value pair is being set on.
         * @param key The key which corresponds to the value being set.
         * @param value The value being set.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/sessions.json
         */
        export function setTabValue(tabId: number, key: string, value: any): void;
        /**
         * Set a key/value pair on a given window.
         *
         * @param windowId The id of the window that the key/value pair is being set on.
         * @param key The key which corresponds to the value being set.
         * @param value The value being set.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/sessions.json
         */
        export function setWindowValue(windowId: number, key: string, value: any): void;
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
        export import ImageDataType = browser.sidebarAction.ImageDataType;
        /**
         * Closes the extension sidebar in the active window if the sidebar belongs to the extension.
         *
         * Must be called from a user input handler.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/sidebar_action.json
         */
        export function close(): void;
        /**
         * Gets the url to the html document set as the panel for this sidebar action.
         *
         * @returns The URL of the document set as the panel.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/sidebar_action.json
         */
        export function getPanel(details: getPanel.Details): void;
        export function getPanel(details: getPanel.Details, callback: ((result: string) => void)): void;
        export namespace getPanel {
            export type Details = browser.sidebarAction.getPanel.Details;
        }
        /**
         * Gets the title of the sidebar action.
         *
         * @returns The title of the sidebar action.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/sidebar_action.json
         */
        export function getTitle(details: getTitle.Details): void;
        export function getTitle(details: getTitle.Details, callback: ((result: string) => void)): void;
        export namespace getTitle {
            export type Details = browser.sidebarAction.getTitle.Details;
        }
        /**
         * Checks whether the sidebar action is open.
         *
         * @returns Whether the sidebar action is open.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/sidebar_action.json
         */
        export function isOpen(details: isOpen.Details): void;
        export function isOpen(details: isOpen.Details, callback: ((result: boolean) => void)): void;
        export namespace isOpen {
            export type Details = browser.sidebarAction.isOpen.Details;
        }
        /**
         * Opens the extension sidebar in the active window.
         *
         * Must be called from a user input handler.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/sidebar_action.json
         */
        export function open(): void;
        /**
         * Sets the icon for the sidebar action. The icon can be specified either as the path to an image file or as the pixel data from a canvas element, or as dictionary of either one of those. Either the **path** or the **imageData** property must be specified.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/sidebar_action.json
         */
        export function setIcon(details: setIcon.Details): void;
        export namespace setIcon {
            export type Details = browser.sidebarAction.setIcon.Details;
        }
        /**
         * Sets the url to the html document to be opened in the sidebar when the user clicks on the sidebar action's icon.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/sidebar_action.json
         */
        export function setPanel(details: setPanel.Details): void;
        export namespace setPanel {
            export type Details = browser.sidebarAction.setPanel.Details;
        }
        /**
         * Sets the title of the sidebar action. This shows up in the tooltip.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/sidebar_action.json
         */
        export function setTitle(details: setTitle.Details): void;
        export namespace setTitle {
            export type Details = browser.sidebarAction.setTitle.Details;
        }
        /**
         * Toggles the extension sidebar in the active window.
         *
         * Must be called from a user input handler.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/sidebar_action.json
         */
        export function toggle(): void;
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
        export interface StorageArea extends Omit<browser.storage.StorageArea, "clear" | "get" | "getBytesInUse" | "getKeys" | "remove" | "set"> {
            /**
             * Removes all items from storage.
             *
             * @param callback Callback on success, or on failure (in which case {@link browser.runtime.lastError} will be set).
             */
            clear(): void;
            clear(callback: (() => void)): void;
            /**
             * Gets one or more items from storage.
             *
             * @param keys A single key to get, list of keys to get, or a dictionary specifying default values (see description of the object).  An empty list or object will return an empty result object.  Pass in `null` to get the entire contents of storage.
             * - `Record<string, any>`: Storage items to return in the callback, where the values are replaced with those from storage if they exist.
             * @param callback Callback with storage items, or on failure (in which case {@link browser.runtime.lastError} will be set).
             * @returns Object with items in their key-value mappings.
             */
            get(keys?: string | string[] | Record<string, unknown> | null): void;
            get(keys: string | string[] | Record<string, any> | null | undefined, callback: ((items: Record<string, any>) => void)): void;
            get(callback: ((items: Record<string, any>) => void)): void;
            /**
             * Gets the amount of space (in bytes) being used by one or more items.
             *
             * @param keys A single key or list of keys to get the total usage for. An empty list will return 0. Pass in `null` to get the total usage of all of storage.
             * @param callback Callback with the amount of space being used by storage, or on failure (in which case {@link browser.runtime.lastError} will be set).
             * @returns Amount of space being used in storage, in bytes.
             */
            getBytesInUse(keys?: string | string[] | null): void;
            getBytesInUse(keys: string | string[] | null | undefined, callback: ((bytesInUse: number) => void)): void;
            getBytesInUse(callback: ((bytesInUse: number) => void)): void;
            /**
             * Gets the keys of all items in storage.
             *
             * @param callback Callback with the keys of all items in storage, or on failure (in which case {@link browser.runtime.lastError} will be set).
             * @returns The keys of all items in storage.
             */
            getKeys(): void;
            getKeys(callback: ((keys: string[]) => void)): void;
            /**
             * Removes one or more items from storage.
             *
             * @param keys A single key or a list of keys for items to remove.
             * @param callback Callback on success, or on failure (in which case {@link browser.runtime.lastError} will be set).
             */
            remove(keys: string | string[]): void;
            remove(keys: string | string[], callback: (() => void)): void;
            /**
             * Sets multiple items.
             *
             * @param items An object which gives each key/value pair to update storage with. Any other key/value pairs in storage will not be affected.
             *
             * Primitive values such as numbers will serialize as expected. Values with a `typeof` `"object"` and `"function"` will typically serialize to `{}`, with the exception of `Array` (serializes as expected), `Date`, and `Regex` (serialize using their `String` representation).
             * @param callback Callback on success, or on failure (in which case {@link browser.runtime.lastError} will be set).
             */
            set(items: Record<string, any>): void;
            set(items: Record<string, any>, callback: (() => void)): void;
        }
        export import StorageChange = browser.storage.StorageChange;
        /**
         * Items in the `local` storage area are local to each machine.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/storage.json
         */
        export const local: chrome.storage.StorageArea;
        /**
         * Items in the `managed` storage area are set by administrators or native applications, and are read-only for the extension; trying to modify this namespace results in an error.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/storage.json
         */
        export const managed: chrome.storage.StorageArea;
        /**
         * Items in the `session` storage area are kept in memory, and only until the either browser or extension is closed or reloaded.
         *
         * Also available in devtools pages, but not in content scripts.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/storage.json
         */
        export const session: chrome.storage.StorageArea;
        /**
         * Items in the `sync` storage area are synced by the browser.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/storage.json
         */
        export const sync: chrome.storage.StorageArea;
        export import onChanged = browser.storage.onChanged;
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
        export import Color = browser.tabGroups.Color;
        export import TabGroup = browser.tabGroups.TabGroup;
        export import TAB_GROUP_ID_NONE = browser.tabGroups.TAB_GROUP_ID_NONE;
        export import onCreated = browser.tabGroups.onCreated;
        export import onMoved = browser.tabGroups.onMoved;
        export import onRemoved = browser.tabGroups.onRemoved;
        export import onUpdated = browser.tabGroups.onUpdated;
        /**
         * Retrieves details about the specified group.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/tabGroups.json
         */
        export function get(groupId: number): void;
        export function get(groupId: number, callback: ((group: TabGroup) => void)): void;
        /**
         * Move a group within, or to another window.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/tabGroups.json
         */
        export function move(groupId: number, moveProperties: move.MoveProperties): void;
        export function move(groupId: number, moveProperties: move.MoveProperties, callback: ((group: TabGroup) => void)): void;
        export namespace move {
            export type MoveProperties = browser.tabGroups.move.MoveProperties;
        }
        /**
         * Return all grups, or find groups with specified properties.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/tabGroups.json
         */
        export function query(queryInfo: query.QueryInfo): void;
        export function query(queryInfo: query.QueryInfo, callback: ((groups: TabGroup[]) => void)): void;
        export namespace query {
            export type QueryInfo = browser.tabGroups.query.QueryInfo;
        }
        /**
         * Modifies state of a specified group.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/tabGroups.json
         */
        export function update(groupId: number, updateProperties: update.UpdateProperties): void;
        export function update(groupId: number, updateProperties: update.UpdateProperties, callback: ((group: TabGroup) => void)): void;
        export namespace update {
            export type UpdateProperties = browser.tabGroups.update.UpdateProperties;
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
        export import MutedInfo = browser.tabs.MutedInfo;
        export import MutedInfoReason = browser.tabs.MutedInfoReason;
        export import PageSettings = browser.tabs.PageSettings;
        export import SharingState = browser.tabs.SharingState;
        export import Tab = browser.tabs.Tab;
        export import TabStatus = browser.tabs.TabStatus;
        export import UpdateFilter = browser.tabs.UpdateFilter;
        export import UpdatePropertyName = browser.tabs.UpdatePropertyName;
        export import WindowType = browser.tabs.WindowType;
        export import ZoomSettings = browser.tabs.ZoomSettings;
        export import ZoomSettingsMode = browser.tabs.ZoomSettingsMode;
        export import ZoomSettingsScope = browser.tabs.ZoomSettingsScope;
        export import SPLIT_VIEW_ID_NONE = browser.tabs.SPLIT_VIEW_ID_NONE;
        export import TAB_ID_NONE = browser.tabs.TAB_ID_NONE;
        export import onActivated = browser.tabs.onActivated;
        export import onAttached = browser.tabs.onAttached;
        export import onCreated = browser.tabs.onCreated;
        export import onDetached = browser.tabs.onDetached;
        export import onHighlighted = browser.tabs.onHighlighted;
        export import onMoved = browser.tabs.onMoved;
        export import onRemoved = browser.tabs.onRemoved;
        export import onReplaced = browser.tabs.onReplaced;
        export import onUpdated = browser.tabs.onUpdated;
        export import onZoomChange = browser.tabs.onZoomChange;
        /**
         * Captures an area of a specified tab. You must have `<all_urls>` permission to use this method.
         *
         * @param tabId The tab to capture. Defaults to the active tab of the current window.
         * @returns A data URL which encodes an image of the captured area of the tab.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/tabs.json
         * @permission <all_urls>
         */
        export function captureTab(options?: browser.extensionTypes.ImageDetails | null): void;
        export function captureTab(tabId?: number | null, options?: browser.extensionTypes.ImageDetails | null): void;
        export function captureTab(options: browser.extensionTypes.ImageDetails | null | undefined, callback: ((dataUrl: string) => void)): void;
        export function captureTab(callback: ((dataUrl: string) => void)): void;
        export function captureTab(tabId: number | null | undefined, options: browser.extensionTypes.ImageDetails | null | undefined, callback: ((dataUrl: string) => void)): void;
        export function captureTab(tabId: number | null | undefined, callback: ((dataUrl: string) => void)): void;
        /**
         * Captures an area of the currently active tab in the specified window. You must have `<all_urls>` or activeTab permission to use this method.
         *
         * @param windowId The target window. Defaults to the current window.
         * @returns A data URL which encodes an image of the visible area of the captured tab. May be assigned to the 'src' property of an HTML Image element for display.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/tabs.json
         * @permission <all_urls> or activeTab
         */
        export function captureVisibleTab(options?: browser.extensionTypes.ImageDetails | null): void;
        export function captureVisibleTab(windowId?: number | null, options?: browser.extensionTypes.ImageDetails | null): void;
        export function captureVisibleTab(options: browser.extensionTypes.ImageDetails | null | undefined, callback: ((dataUrl: string) => void)): void;
        export function captureVisibleTab(callback: ((dataUrl: string) => void)): void;
        export function captureVisibleTab(windowId: number | null | undefined, options: browser.extensionTypes.ImageDetails | null | undefined, callback: ((dataUrl: string) => void)): void;
        export function captureVisibleTab(windowId: number | null | undefined, callback: ((dataUrl: string) => void)): void;
        export import connect = browser.tabs.connect;
        /**
         * Creates a new tab.
         *
         * @returns Details about the created tab. Will contain the ID of the new tab.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/tabs.json
         */
        export function create(createProperties: create.CreateProperties): void;
        export function create(createProperties: create.CreateProperties, callback: ((tab: Tab) => void)): void;
        export namespace create {
            export type CreateProperties = browser.tabs.create.CreateProperties;
        }
        /**
         * Detects the primary language of the content in a tab.
         *
         * @param tabId Defaults to the active tab of the current window.
         * @returns An ISO language code such as `en` or `fr`. For a complete list of languages supported by this method, see [kLanguageInfoTable](http://src.chromium.org/viewvc/chrome/trunk/src/third_party/cld/languages/internal/languages.cc). The 2nd to 4th columns will be checked and the first non-NULL value will be returned except for Simplified Chinese for which zh-CN will be returned. For an unknown language, `und` will be returned.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/tabs.json
         */
        export function detectLanguage(tabId?: number | null): void;
        export function detectLanguage(tabId: number | null | undefined, callback: ((language: string) => void)): void;
        export function detectLanguage(callback: ((language: string) => void)): void;
        /**
         * discards one or more tabs.
         *
         * @param tabIds The tab or list of tabs to discard.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function discard(tabIds: number | number[]): void;
        /**
         * Duplicates a tab.
         *
         * @param tabId The ID of the tab which is to be duplicated.
         * @returns Details about the duplicated tab. The {@link browser.tabs.Tab} object doesn't contain `url`, `title` and `favIconUrl` if the `"tabs"` permission has not been requested.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function duplicate(tabId: number, duplicateProperties?: duplicate.DuplicateProperties | null): void;
        export function duplicate(tabId: number, duplicateProperties: duplicate.DuplicateProperties | null | undefined, callback: ((tab: Tab) => void)): void;
        export function duplicate(tabId: number, callback: ((tab: Tab) => void)): void;
        export namespace duplicate {
            export type DuplicateProperties = browser.tabs.duplicate.DuplicateProperties;
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
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/tabs.json
         */
        export function executeScript(tabId: number | null | undefined, details: browser.extensionTypes.InjectDetails): void;
        export function executeScript(details: browser.extensionTypes.InjectDetails): void;
        export function executeScript(tabId: number | null | undefined, details: browser.extensionTypes.InjectDetails, callback: ((result: any[]) => void)): void;
        export function executeScript(details: browser.extensionTypes.InjectDetails, callback: ((result: any[]) => void)): void;
        /**
         * Retrieves details about the specified tab.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/tabs.json
         */
        export function get(tabId: number): void;
        export function get(tabId: number, callback: ((tab: Tab) => void)): void;
        /**
         * Gets the tab that this script call is being made from. May be undefined if called from a non-tab context (for example: a background page or popup view).
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/tabs.json
         */
        export function getCurrent(): void;
        export function getCurrent(callback: ((tab: Tab | undefined) => void)): void;
        /**
         * Gets the current zoom factor of a specified tab.
         *
         * @param tabId The ID of the tab to get the current zoom factor from; defaults to the active tab of the current window.
         * @param callback Called with the tab's current zoom factor after it has been fetched.
         * @returns The tab's current zoom factor.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function getZoom(tabId?: number | null): void;
        export function getZoom(tabId: number | null | undefined, callback: ((zoomFactor: number) => void)): void;
        export function getZoom(callback: ((zoomFactor: number) => void)): void;
        /**
         * Gets the current zoom settings of a specified tab.
         *
         * @param tabId The ID of the tab to get the current zoom settings from; defaults to the active tab of the current window.
         * @param callback Called with the tab's current zoom settings.
         * @returns The tab's current zoom settings.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function getZoomSettings(tabId?: number | null): void;
        export function getZoomSettings(tabId: number | null | undefined, callback: ((zoomSettings: ZoomSettings) => void)): void;
        export function getZoomSettings(callback: ((zoomSettings: ZoomSettings) => void)): void;
        /**
         * Navigate to previous page in tab's history, if available.
         *
         * @param tabId The ID of the tab to navigate backward.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/tabs.json
         */
        export function goBack(tabId?: number | null): void;
        export function goBack(tabId: number | null | undefined, callback: (() => void)): void;
        export function goBack(callback: (() => void)): void;
        /**
         * Navigate to next page in tab's history, if available
         *
         * @param tabId The ID of the tab to navigate forward.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/tabs.json
         */
        export function goForward(tabId?: number | null): void;
        export function goForward(tabId: number | null | undefined, callback: (() => void)): void;
        export function goForward(callback: (() => void)): void;
        /**
         * Adds one or more tabs to a specified group, or if no group is specified, adds the given tabs to a newly created group.
         *
         * @returns The ID of the group that the tabs were added to.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function group(options: group.Options): void;
        export function group(options: group.Options, callback: ((groupId: number) => void)): void;
        export namespace group {
            export type Options = browser.tabs.group.Options;
        }
        /**
         * Hides one or more tabs. The `"tabHide"` permission is required to hide tabs.  Not all tabs are hidable.  Returns an array of hidden tabs.
         *
         * @param tabIds The TAB ID or list of TAB IDs to hide.
         * @returns The IDs of the tabs that were hidden.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/tabs.json
         * @permission tabHide
         * @platform desktop
         */
        export function hide(tabIds: number | number[]): void;
        export function hide(tabIds: number | number[], callback: ((tabIds: number[]) => void)): void;
        /**
         * Highlights the given tabs.
         *
         * @returns Contains details about the window whose tabs were highlighted.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function highlight(highlightInfo: highlight.HighlightInfo): void;
        export function highlight(highlightInfo: highlight.HighlightInfo, callback: ((window: browser.windows.Window) => void)): void;
        export namespace highlight {
            export type HighlightInfo = browser.tabs.highlight.HighlightInfo;
        }
        /**
         * Injects CSS into a page. For details, see the programmatic injection section of the content scripts doc.
         *
         * Only available in manifest_version 2 or earlier.
         *
         * @param tabId The ID of the tab in which to insert the CSS; defaults to the active tab of the current window.
         * @param details Details of the CSS text to insert.
         * @param callback Called when all the CSS has been inserted.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/tabs.json
         */
        export function insertCSS(tabId: number | null | undefined, details: browser.extensionTypes.InjectDetails): void;
        export function insertCSS(details: browser.extensionTypes.InjectDetails): void;
        export function insertCSS(tabId: number | null | undefined, details: browser.extensionTypes.InjectDetails, callback: (() => void)): void;
        export function insertCSS(details: browser.extensionTypes.InjectDetails, callback: (() => void)): void;
        /**
         * Moves one or more tabs to a new position within its window, or to a new window. Note that tabs can only be moved to and from normal (window.type === "normal") windows.
         *
         * @param tabIds The tab or list of tabs to move.
         * @returns Details about the moved tabs.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function move(tabIds: number | number[], moveProperties: move.MoveProperties): void;
        export function move(tabIds: number | number[], moveProperties: move.MoveProperties, callback: ((tabs: Tab | Tab[]) => void)): void;
        export namespace move {
            export type MoveProperties = browser.tabs.move.MoveProperties;
        }
        /**
         * Removes an array of tabs from their lines of succession and prepends or appends them in a chain to another tab.
         *
         * @param tabIds An array of tab IDs to move in the line of succession. For each tab in the array, the tab's current predecessors will have their successor set to the tab's current successor, and each tab will then be set to be the successor of the previous tab in the array. Any tabs not in the same window as the tab indicated by the second argument (or the first tab in the array, if no second argument) will be skipped.
         * @param tabId The ID of a tab to set as the successor of the last tab in the array, or {@link browser.tabs.TAB_ID_NONE} to leave the last tab without a successor. If options.append is true, then this tab is made the predecessor of the first tab in the array instead. Defaults to `-1`.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function moveInSuccession(tabIds: number[], tabId?: number | null, options?: moveInSuccession.Options | null): void;
        export namespace moveInSuccession {
            export type Options = browser.tabs.moveInSuccession.Options;
        }
        export import print = browser.tabs.print;
        /**
         * Shows print preview for page in active tab.
         *
         * @param callback Called after print preview entered.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function printPreview(): void;
        export function printPreview(callback: (() => void)): void;
        /**
         * Gets all tabs that have the specified properties, or all tabs if no properties are specified.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/tabs.json
         */
        export function query(queryInfo: query.QueryInfo): void;
        export function query(queryInfo: query.QueryInfo, callback: ((result: Tab[]) => void)): void;
        export namespace query {
            export type QueryInfo = browser.tabs.query.QueryInfo;
        }
        /**
         * Reload a tab.
         *
         * @param tabId The ID of the tab to reload; defaults to the selected tab of the current window.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/tabs.json
         */
        export function reload(reloadProperties?: reload.ReloadProperties | null): void;
        export function reload(tabId?: number | null, reloadProperties?: reload.ReloadProperties | null): void;
        export function reload(reloadProperties: reload.ReloadProperties | null | undefined, callback: (() => void)): void;
        export function reload(callback: (() => void)): void;
        export function reload(tabId: number | null | undefined, reloadProperties: reload.ReloadProperties | null | undefined, callback: (() => void)): void;
        export function reload(tabId: number | null | undefined, callback: (() => void)): void;
        export namespace reload {
            export type ReloadProperties = browser.tabs.reload.ReloadProperties;
        }
        /**
         * Closes one or more tabs.
         *
         * @param tabIds The tab or list of tabs to close.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/tabs.json
         */
        export function remove(tabIds: number | number[]): void;
        export function remove(tabIds: number | number[], callback: (() => void)): void;
        /**
         * Removes injected CSS from a page. For details, see the programmatic injection section of the content scripts doc.
         *
         * Only available in manifest_version 2 or earlier.
         *
         * @param tabId The ID of the tab from which to remove the injected CSS; defaults to the active tab of the current window.
         * @param details Details of the CSS text to remove.
         * @param callback Called when all the CSS has been removed.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/tabs.json
         */
        export function removeCSS(tabId: number | null | undefined, details: browser.extensionTypes.InjectDetails): void;
        export function removeCSS(details: browser.extensionTypes.InjectDetails): void;
        export function removeCSS(tabId: number | null | undefined, details: browser.extensionTypes.InjectDetails, callback: (() => void)): void;
        export function removeCSS(details: browser.extensionTypes.InjectDetails, callback: (() => void)): void;
        /**
         * Saves page in active tab as a PDF file.
         *
         * @param pageSettings The page settings used to save the PDF file.
         * @param callback Called after save as dialog closed.
         * @returns Save status: saved, replaced, canceled, not_saved, not_replaced.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function saveAsPDF(pageSettings: PageSettings): void;
        export function saveAsPDF(pageSettings: PageSettings, callback: ((status: string) => void)): void;
        /**
         * Sends a single message to the content script(s) in the specified tab, with an optional callback to run when a response is sent back.  The {@link browser.runtime.onMessage} event is fired in each content script running in the specified tab for the current extension.
         *
         * @returns The JSON response object sent by the handler of the message. If an error occurs while connecting to the specified tab, the callback will be called with no arguments and {@link browser.runtime.lastError} will be set to the error message.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/tabs.json
         */
        export function sendMessage(tabId: number, message: any, options?: sendMessage.Options | null): void;
        export function sendMessage(tabId: number, message: any, options: sendMessage.Options | null | undefined, responseCallback: ((response: any) => void)): void;
        export function sendMessage(tabId: number, message: any, responseCallback: ((response: any) => void)): void;
        export namespace sendMessage {
            export type Options = browser.tabs.sendMessage.Options;
        }
        /**
         * Zooms a specified tab.
         *
         * @param tabId The ID of the tab to zoom; defaults to the active tab of the current window.
         * @param zoomFactor The new zoom factor. Use a value of 0 here to set the tab to its current default zoom factor. Values greater than zero specify a (possibly non-default) zoom factor for the tab.
         * @param callback Called after the zoom factor has been changed.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function setZoom(tabId: number | null | undefined, zoomFactor: number): void;
        export function setZoom(zoomFactor: number): void;
        export function setZoom(tabId: number | null | undefined, zoomFactor: number, callback: (() => void)): void;
        export function setZoom(zoomFactor: number, callback: (() => void)): void;
        /**
         * Sets the zoom settings for a specified tab, which define how zoom changes are handled. These settings are reset to defaults upon navigating the tab.
         *
         * @param tabId The ID of the tab to change the zoom settings for; defaults to the active tab of the current window.
         * @param zoomSettings Defines how zoom changes are handled and at what scope.
         * @param callback Called after the zoom settings have been changed.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function setZoomSettings(tabId: number | null | undefined, zoomSettings: Normalizable<ZoomSettings>): void;
        export function setZoomSettings(zoomSettings: Normalizable<ZoomSettings>): void;
        export function setZoomSettings(tabId: number | null | undefined, zoomSettings: Normalizable<ZoomSettings>, callback: (() => void)): void;
        export function setZoomSettings(zoomSettings: Normalizable<ZoomSettings>, callback: (() => void)): void;
        /**
         * Shows one or more tabs.
         *
         * @param tabIds The TAB ID or list of TAB IDs to show.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/tabs.json
         * @permission tabHide
         * @platform desktop
         */
        export function show(tabIds: number | number[]): void;
        /**
         * Toggles reader mode for the document in the tab.
         *
         * @param tabId Defaults to the active tab of the current window.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function toggleReaderMode(tabId?: number | null): void;
        /**
         * Removes one or more tabs from their respective groups. If any groups become empty, they are deleted.
         *
         * @param tabIds The tab ID or list of tab IDs to remove from their respective groups.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function ungroup(tabIds: number | number[]): void;
        /**
         * Modifies the properties of a tab. Properties that are not specified in `updateProperties` are not modified.
         *
         * @param tabId Defaults to the selected tab of the current window.
         * @returns Details about the updated tab. The {@link browser.tabs.Tab} object doesn't contain `url`, `title` and `favIconUrl` if the `"tabs"` permission has not been requested.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/tabs.json
         */
        export function update(tabId: number | null | undefined, updateProperties: update.UpdateProperties): void;
        export function update(updateProperties: update.UpdateProperties): void;
        export function update(tabId: number | null | undefined, updateProperties: update.UpdateProperties, callback: ((tab: Tab) => void)): void;
        export function update(updateProperties: update.UpdateProperties, callback: ((tab: Tab) => void)): void;
        export namespace update {
            export type UpdateProperties = browser.tabs.update.UpdateProperties;
        }
        /**
         * Warm up a tab
         *
         * @param tabId The ID of the tab to warm up.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/tabs.json
         * @platform desktop
         */
        export function warmup(tabId: number): void;
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
        export import EventData = browser.telemetry.EventData;
        export import ScalarData = browser.telemetry.ScalarData;
        export import ScalarType = browser.telemetry.ScalarType;
        /**
         * Checks if Telemetry upload is enabled.
         *
         * @returns Whether Telemetry upload is enabled.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/telemetry.json
         */
        export function canUpload(): void;
        export function canUpload(callback: ((result: boolean) => void)): void;
        /**
         * Adds the value to the given keyed scalar.
         *
         * @param name The scalar name
         * @param key The key name
         * @param value The numeric value to add to the scalar. Only unsigned integers supported.
         * @deprecated `keyedScalarAdd` is a no-op since Firefox 134 (see bug 1930196)
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/telemetry.json
         */
        export function keyedScalarAdd(name: string, key: string, value: number): void;
        /**
         * Sets the keyed scalar to the given value. Throws if the value type doesn't match the scalar type.
         *
         * @param name The scalar name.
         * @param key The key name.
         * @param value The value to set the scalar to.
         * @deprecated `keyedScalarSet` is a no-op since Firefox 134 (see bug 1930196)
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/telemetry.json
         */
        export function keyedScalarSet(name: string, key: string, value: string | boolean | number | Record<string, any>): void;
        /**
         * Sets the keyed scalar to the maximum of the current and the passed value
         *
         * @param name The scalar name.
         * @param key The key name.
         * @param value The numeric value to set the scalar to. Only unsigned integers supported.
         * @deprecated `keyedScalarSetMaximum` is a no-op since Firefox 134 (see bug 1930196)
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/telemetry.json
         */
        export function keyedScalarSetMaximum(name: string, key: string, value: number): void;
        /**
         * Record an event in Telemetry. Throws when trying to record an unknown event.
         *
         * @param category The category name.
         * @param method The method name.
         * @param object The object name.
         * @param value An optional string value to record.
         * @param extra An optional object of the form (string -> string). It should only contain registered extra keys.
         * @deprecated `recordEvent` is a no-op since Firefox 132 (see bug 1894533)
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/telemetry.json
         */
        export function recordEvent(category: string, method: string, object: string, value?: string | null, extra?: { [key: string]: string } | null): void;
        /**
         * Register new events to record them from addons. See nsITelemetry.idl for more details.
         *
         * @param category The unique category the events are registered in.
         * @param data An object that contains registration data for 1+ events. Each property name is the category name, and the corresponding property value is an object of EventData type.
         * @deprecated `registerEvents` is a no-op since Firefox 132 (see bug 1894533)
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/telemetry.json
         */
        export function registerEvents(category: string, data: { [key: string]: EventData }): void;
        /**
         * Register new scalars to record them from addons. See nsITelemetry.idl for more details.
         *
         * @param category The unique category the scalars are registered in.
         * @param data An object that contains registration data for multiple scalars. Each property name is the scalar name, and the corresponding property value is an object of ScalarData type.
         * @deprecated `registerScalars` is a no-op since Firefox 134 (see bug 1930196)
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/telemetry.json
         */
        export function registerScalars(category: string, data: { [key: string]: ScalarData }): void;
        /**
         * Adds the value to the given scalar.
         *
         * @param name The scalar name.
         * @param value The numeric value to add to the scalar. Only unsigned integers supported.
         * @deprecated `scalarAdd` is a no-op since Firefox 134 (see bug 1930196)
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/telemetry.json
         */
        export function scalarAdd(name: string, value: number): void;
        /**
         * Sets the named scalar to the given value. Throws if the value type doesn't match the scalar type.
         *
         * @param name The scalar name
         * @param value The value to set the scalar to
         * @deprecated `scalarSet` is a no-op since Firefox 134 (see bug 1930196)
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/telemetry.json
         */
        export function scalarSet(name: string, value: string | boolean | number | Record<string, any>): void;
        /**
         * Sets the scalar to the maximum of the current and the passed value
         *
         * @param name The scalar name.
         * @param value The numeric value to set the scalar to. Only unsigned integers supported.
         * @deprecated `scalarSetMaximum` is a no-op since Firefox 134 (see bug 1930196)
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/telemetry.json
         */
        export function scalarSetMaximum(name: string, value: number): void;
        /**
         * Enable recording of events in a category. Events default to recording enabled. This allows to toggle recording for all events in the specified category.
         *
         * @param category The category name.
         * @param enabled Whether recording is enabled for events in that category.
         * @deprecated `setEventRecordingEnabled` is a no-op since Firefox 133 (see bug 1920562)
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/telemetry.json
         */
        export function setEventRecordingEnabled(category: string, enabled: boolean): void;
        /**
         * Submits a custom ping to the Telemetry back-end. See `submitExternalPing` inside TelemetryController.sys.mjs for more details.
         *
         * @param type The type of the ping.
         * @param message The data payload for the ping.
         * @param options Options object.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/telemetry.json
         */
        export function submitPing(type: string, message: Record<string, any>, options: submitPing.Options): void;
        export namespace submitPing {
            export type Options = browser.telemetry.submitPing.Options;
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
        export import ThemeUpdateInfo = browser.theme.ThemeUpdateInfo;
        export import onUpdated = browser.theme.onUpdated;
        /**
         * Returns the current theme for the specified window or the last focused window.
         *
         * @param windowId The window for which we want the theme.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/theme.json
         */
        export function getCurrent(windowId?: number | null): void;
        /**
         * Removes the updates made to the theme.
         *
         * @param windowId The id of the window to reset. No id resets all windows.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/theme.json
         * @permission theme
         */
        export function reset(windowId?: number | null): void;
        /**
         * Make complete updates to the theme. Resolves when the update has completed.
         *
         * @param windowId The id of the window to update. No id updates all windows.
         * @param details The properties of the theme to update.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/theme.json
         * @permission theme
         */
        export function update(windowId: number | null | undefined, details: browser.manifest.ThemeType): void;
        export function update(details: browser.manifest.ThemeType): void;
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
        export import MostVisitedURL = browser.topSites.MostVisitedURL;
        /**
         * Gets a list of top sites.
         *
         * @param options Defaults to `{}`.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/top_sites.json
         */
        export function get(options?: get.Options | null): void;
        export function get(options: get.Options | null | undefined, callback: ((results: MostVisitedURL[]) => void)): void;
        export function get(callback: ((results: MostVisitedURL[]) => void)): void;
        export namespace get {
            export type Options = browser.topSites.get.Options;
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
            export import CreateEngineRequest = browser.trial.ml.CreateEngineRequest;
            export import RunEngineRequest = browser.trial.ml.RunEngineRequest;
            export import onProgress = browser.trial.ml.onProgress;
            /**
             * Prepare the inference engine
             *
             * Not available in content scripts or devtools pages.
             *
             * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/trial_ml.json
             */
            export function createEngine(createEngineRequest: CreateEngineRequest): void;
            /**
             * Delete the models the extension downloaded.
             *
             * @returns True once the models are deleted.
             * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/trial_ml.json
             */
            export function deleteCachedModels(): void;
            export function deleteCachedModels(callback: ((result: boolean) => void)): void;
            /**
             * Call the inference engine
             *
             * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/trial_ml.json
             */
            export function runEngine(runEngineRequest: RunEngineRequest): void;
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
        export import LevelOfControl = browser.types.LevelOfControl;
        export interface Setting extends Omit<browser.types.Setting, "clear" | "get" | "set"> {
            /**
             * Clears the setting, restoring any default value.
             *
             * @param details Which setting to clear.
             * @param callback Called at the completion of the clear operation.
             * @returns True if the setting was cleared, false otherwise.
             */
            clear(details: Setting.clear.Details): void;
            clear(details: Setting.clear.Details, callback: ((result: boolean) => void)): void;
            /**
             * Gets the value of a setting.
             *
             * @param details Which setting to consider.
             * @returns Details of the currently effective value.
             */
            get(details: Setting.get.Details): void;
            get(details: Setting.get.Details, callback: ((details: Setting.get.Result) => void)): void;
            /**
             * Sets the value of a setting.
             *
             * @param details Which setting to change.
             * @param callback Called at the completion of the set operation.
             * @returns True if the setting was modified, false otherwise.
             */
            set(details: Setting.set.Details): void;
            set(details: Setting.set.Details, callback: ((result: boolean) => void)): void;
        }
        export namespace Setting {
            export import clear = browser.types.Setting.clear;
            export import get = browser.types.Setting.get;
            export import set = browser.types.Setting.set;
        }
        export import SettingScope = browser.types.SettingScope;
    }
    /**
     * Also available in content scripts, but not in devtools pages.
     *
     * @permission manifest:user_scripts or userScripts
     * @platform desktop, mobile
     */
    export namespace userScripts {
        export import ExecutionWorld = browser.userScripts.ExecutionWorld;
        export import InjectionResult = browser.userScripts.InjectionResult;
        export import InjectionTarget = browser.userScripts.InjectionTarget;
        export import RegisteredUserScript = browser.userScripts.RegisteredUserScript;
        export import ScriptSource = browser.userScripts.ScriptSource;
        export import UserScriptFilter = browser.userScripts.UserScriptFilter;
        export import UserScriptInjection = browser.userScripts.UserScriptInjection;
        export import UserScriptOptions = browser.userScripts.UserScriptOptions;
        export import WorldProperties = browser.userScripts.WorldProperties;
        export import onBeforeScript = browser.userScripts.onBeforeScript;
        /**
         * Configures the environment for scripts running in a USER_SCRIPT world.
         *
         * Requires manifest_version 3 or later.
         * Not available in content scripts or devtools pages.
         *
         * @param properties The desired configuration for a USER_SCRIPT world.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/user_scripts.json
         */
        export function configureWorld(properties: WorldProperties): void;
        /**
         * Executes one or more ephemeral user scripts into a specific tab.
         *
         * Requires manifest_version 3 or later.
         * Not available in content scripts or devtools pages.
         *
         * @param injection The details of the user script which to inject.
         * @param callback Invoked upon completion of the injection. The resulting array contains the result of execution for each frame where the injection succeeded.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/user_scripts.json
         */
        export function execute(injection: UserScriptInjection): void;
        export function execute(injection: UserScriptInjection, callback: ((results: InjectionResult[]) => void)): void;
        /**
         * Returns all dynamically-registered user scripts for this extension.
         *
         * Requires manifest_version 3 or later.
         * Not available in content scripts or devtools pages.
         *
         * @param filter If specified, this method returns only the user scripts that match it.
         * @returns List of registered user scripts.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/user_scripts.json
         */
        export function getScripts(filter?: UserScriptFilter | null): void;
        export function getScripts(filter: UserScriptFilter | null | undefined, callback: ((scripts: RegisteredUserScript[]) => void)): void;
        export function getScripts(callback: ((scripts: RegisteredUserScript[]) => void)): void;
        /**
         * Returns all registered USER_SCRIPT world configurations.
         *
         * Requires manifest_version 3 or later.
         * Not available in content scripts or devtools pages.
         *
         * @returns All configurations registered with configureWorld().
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/user_scripts.json
         */
        export function getWorldConfigurations(): void;
        export function getWorldConfigurations(callback: ((configurations: WorldProperties[]) => void)): void;
        /**
         * Register a user script programmatically given its {@link browser.userScripts.UserScriptOptions}, and resolves to an object with the unregister() function
         *
         * Only available in manifest_version 2 or earlier.
         * Not available in content scripts or devtools pages.
         *
         * @returns An object that represents a user script registered programmatically
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/user_scripts.json
         */
        export function register(userScriptOptions: UserScriptOptions): void;
        export function register(userScriptOptions: UserScriptOptions, callback: ((legacyRegisteredUserScript: register.Result) => void)): void;
        /**
         * Registers one or more user scripts for this extension.
         *
         * Requires manifest_version 3 or later.
         * Not available in content scripts or devtools pages.
         *
         * @param scripts List of user scripts to be registered.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/user_scripts.json
         */
        export function register(scripts: RegisteredUserScript[]): void;
        export namespace register {
            export type Result = browser.userScripts.register.Result;
        }
        /**
         * Resets the configuration for a given world. That world will fall back to the default world's configuration.
         *
         * Requires manifest_version 3 or later.
         * Not available in content scripts or devtools pages.
         *
         * @param worldId The ID of the USER_SCRIPT world to reset. If omitted or empty, resets the default world's configuration. Defaults to `""`.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/user_scripts.json
         */
        export function resetWorldConfiguration(worldId?: string | null): void;
        /**
         * Unregisters all dynamically-registered user scripts for this extension.
         *
         * Requires manifest_version 3 or later.
         * Not available in content scripts or devtools pages.
         *
         * @param filter If specified, this method unregisters only the user scripts that match it.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/user_scripts.json
         */
        export function unregister(filter?: UserScriptFilter | null): void;
        /**
         * Updates one or more user scripts for this extension.
         *
         * Requires manifest_version 3 or later.
         * Not available in content scripts or devtools pages.
         *
         * @param scripts List of user scripts to be updated.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/user_scripts.json
         */
        export function update(scripts: ({
            /**
             * If allFrames is `true`, implies that the JavaScript should be injected into all frames of current page. By default, it's `false` and is only injected into the top frame.
             */
            allFrames?: boolean | null | undefined;
            excludeGlobs?: string[] | null | undefined;
            excludeMatches?: browser.manifest.MatchPattern[] | null | undefined;
            /**
             * The ID of the user script specified in the API call. This property must not start with a '_' as it's reserved as a prefix for generated script IDs.
             */
            id: string;
            /**
             * At least one of matches or includeGlobs should be non-empty. The script runs in documents whose URL match either pattern.
             */
            includeGlobs?: string[] | null | undefined;
            js?: ScriptSource[] | null | undefined;
            /**
             * At least one of matches or includeGlobs should be non-empty. The script runs in documents whose URL match either pattern.
             */
            matches?: browser.manifest.MatchPattern[] | null | undefined;
            /**
             * The soonest that the JavaScript will be injected into the tab. Defaults to "document_idle".
             */
            runAt?: browser.extensionTypes.RunAt | null | undefined;
            /**
             * The JavaScript script for a script to execute within. Defaults to "USER_SCRIPT".
             */
            world?: ExecutionWorld | null | undefined;
            /**
             * If specified, specifies a specific user script world ID to execute in. Only valid if `world` is omitted or is `USER_SCRIPT`. If `worldId` is omitted, the script will execute in the default user script world (""). Values with leading underscores (`_`) are reserved. The maximum length is 256.
             */
            worldId?: string | null | undefined;
        })[]): void;
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
        export import EventUrlFilters = browser.webNavigation.EventUrlFilters;
        export import TransitionQualifier = browser.webNavigation.TransitionQualifier;
        export import TransitionType = browser.webNavigation.TransitionType;
        export import onBeforeNavigate = browser.webNavigation.onBeforeNavigate;
        export import onCommitted = browser.webNavigation.onCommitted;
        export import onCompleted = browser.webNavigation.onCompleted;
        export import onCreatedNavigationTarget = browser.webNavigation.onCreatedNavigationTarget;
        export import onDOMContentLoaded = browser.webNavigation.onDOMContentLoaded;
        export import onErrorOccurred = browser.webNavigation.onErrorOccurred;
        export import onHistoryStateUpdated = browser.webNavigation.onHistoryStateUpdated;
        export import onReferenceFragmentUpdated = browser.webNavigation.onReferenceFragmentUpdated;
        export import onTabReplaced = browser.webNavigation.onTabReplaced;
        /**
         * Retrieves information about all frames of a given tab.
         *
         * @param details Information about the tab to retrieve all frames from.
         * @returns A list of frames in the given tab, null if the specified tab ID is invalid.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/web_navigation.json
         */
        export function getAllFrames(details: getAllFrames.Details): void;
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
             * @deprecated Firefox does not support this property and never sets it.
             */
            processId?: undefined;
            /**
             * The ID of the tab in which the frame is.
             */
            tabId: number;
            /**
             * The URL currently associated with this frame.
             */
            url: string;
        })[] | null) => void)): void;
        export namespace getAllFrames {
            export type Details = browser.webNavigation.getAllFrames.Details;
        }
        /**
         * Retrieves information about the given frame. A frame refers to an `<iframe>` or a `<frame>` of a web page and is identified by a tab ID and a frame ID, or by its document ID.
         *
         * @param details Information about the frame to retrieve information about.
         * @returns Information about the requested frame, null if the specified frame ID and/or tab ID are invalid.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/web_navigation.json
         */
        export function getFrame(details: getFrame.Details): void;
        export function getFrame(details: getFrame.Details, callback: ((details: getFrame.Result | null) => void)): void;
        export namespace getFrame {
            export type Details = browser.webNavigation.getFrame.Details;
            export type Result = browser.webNavigation.getFrame.Result;
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
        export import BlockingResponse = browser.webRequest.BlockingResponse;
        export import CertificateInfo = browser.webRequest.CertificateInfo;
        export import CertificateTransparencyStatus = browser.webRequest.CertificateTransparencyStatus;
        export import HttpHeaders = browser.webRequest.HttpHeaders;
        export import OnAuthRequiredOptions = browser.webRequest.OnAuthRequiredOptions;
        export import OnBeforeRedirectOptions = browser.webRequest.OnBeforeRedirectOptions;
        export import OnBeforeRequestOptions = browser.webRequest.OnBeforeRequestOptions;
        export import OnBeforeSendHeadersOptions = browser.webRequest.OnBeforeSendHeadersOptions;
        export import OnCompletedOptions = browser.webRequest.OnCompletedOptions;
        export import OnHeadersReceivedOptions = browser.webRequest.OnHeadersReceivedOptions;
        export import OnResponseStartedOptions = browser.webRequest.OnResponseStartedOptions;
        export import OnSendHeadersOptions = browser.webRequest.OnSendHeadersOptions;
        export import RequestFilter = browser.webRequest.RequestFilter;
        export import ResourceType = browser.webRequest.ResourceType;
        export import SecurityInfo = browser.webRequest.SecurityInfo;
        export import StreamFilter = browser.webRequest.StreamFilter;
        export import StreamFilterDataEvent = browser.webRequest.StreamFilterDataEvent;
        export import StreamFilterStatus = browser.webRequest.StreamFilterStatus;
        export import TransportWeaknessReasons = browser.webRequest.TransportWeaknessReasons;
        export import UploadData = browser.webRequest.UploadData;
        export import UrlClassification = browser.webRequest.UrlClassification;
        export import UrlClassificationFlags = browser.webRequest.UrlClassificationFlags;
        export import UrlClassificationParty = browser.webRequest.UrlClassificationParty;
        export import MAX_HANDLER_BEHAVIOR_CHANGED_CALLS_PER_10_MINUTES = browser.webRequest.MAX_HANDLER_BEHAVIOR_CHANGED_CALLS_PER_10_MINUTES;
        export import onAuthRequired = browser.webRequest.onAuthRequired;
        export import onBeforeRedirect = browser.webRequest.onBeforeRedirect;
        export import onBeforeRequest = browser.webRequest.onBeforeRequest;
        export import onBeforeSendHeaders = browser.webRequest.onBeforeSendHeaders;
        export import onCompleted = browser.webRequest.onCompleted;
        export import onErrorOccurred = browser.webRequest.onErrorOccurred;
        export import onHeadersReceived = browser.webRequest.onHeadersReceived;
        export import onResponseStarted = browser.webRequest.onResponseStarted;
        export import onSendHeaders = browser.webRequest.onSendHeaders;
        export import filterResponseData = browser.webRequest.filterResponseData;
        /**
         * Retrieves the security information for the request.  Returns a promise that will resolve to a SecurityInfo object.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/web_request.json
         */
        export function getSecurityInfo(requestId: string, options?: getSecurityInfo.Options | null): void;
        export namespace getSecurityInfo {
            export type Options = browser.webRequest.getSecurityInfo.Options;
        }
        /**
         * Needs to be called when the behavior of the webRequest handlers has changed to prevent incorrect handling due to caching. This function call is expensive. Don't call it often.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/toolkit/components/extensions/schemas/web_request.json
         */
        export function handlerBehaviorChanged(): void;
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
        export import CreateType = browser.windows.CreateType;
        export import GetInfo = browser.windows.GetInfo;
        export import Window = browser.windows.Window;
        export import WindowState = browser.windows.WindowState;
        export import WindowType = browser.windows.WindowType;
        export import WINDOW_ID_CURRENT = browser.windows.WINDOW_ID_CURRENT;
        export import WINDOW_ID_NONE = browser.windows.WINDOW_ID_NONE;
        export import onCreated = browser.windows.onCreated;
        export import onFocusChanged = browser.windows.onFocusChanged;
        export import onRemoved = browser.windows.onRemoved;
        /**
         * Creates (opens) a new browser with any optional sizing, position or default URL provided.
         *
         * @param createData Defaults to `{}`.
         * @returns Contains details about the created window.
         * @deprecated `focused: false` is deprecated: Opening inactive windows is not supported.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/windows.json
         */
        export function create(createData: create.CreateData & { focused: false }): void;
        /**
         * Creates (opens) a new browser with any optional sizing, position or default URL provided.
         *
         * @param createData Defaults to `{}`.
         * @returns Contains details about the created window.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/windows.json
         */
        export function create(createData?: create.CreateData | null): void;
        /**
         * Creates (opens) a new browser with any optional sizing, position or default URL provided.
         *
         * @param createData Defaults to `{}`.
         * @returns Contains details about the created window.
         * @deprecated `focused: false` is deprecated: Opening inactive windows is not supported.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/windows.json
         */
        export function create(createData: create.CreateData & { focused: false }, callback: ((window: Window) => void)): void;
        export function create(createData: create.CreateData | null | undefined, callback: ((window: Window) => void)): void;
        export function create(callback: ((window: Window) => void)): void;
        export namespace create {
            export type CreateData = browser.windows.create.CreateData;
        }
        /**
         * Gets details about a window.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/windows.json
         */
        export function get(windowId: number, getInfo?: GetInfo | null): void;
        export function get(windowId: number, getInfo: GetInfo | null | undefined, callback: ((window: Window) => void)): void;
        export function get(windowId: number, callback: ((window: Window) => void)): void;
        /**
         * Gets all windows.
         *
         * @param getInfo Specifies properties used to filter the {@link browser.windows.Window} returned and to determine whether they should contain a list of the {@link browser.tabs.Tab} objects.
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/windows.json
         */
        export function getAll(getInfo?: getAll.GetInfo | null): void;
        export function getAll(getInfo: getAll.GetInfo | null | undefined, callback: ((windows: Window[]) => void)): void;
        export function getAll(callback: ((windows: Window[]) => void)): void;
        export namespace getAll {
            export type GetInfo = browser.windows.getAll.GetInfo;
        }
        /**
         * Gets the current window.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/windows.json
         */
        export function getCurrent(getInfo?: GetInfo | null): void;
        export function getCurrent(getInfo: GetInfo | null | undefined, callback: ((window: Window) => void)): void;
        export function getCurrent(callback: ((window: Window) => void)): void;
        /**
         * Gets the window that was most recently focused, typically the window 'on top'.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/windows.json
         */
        export function getLastFocused(getInfo?: GetInfo | null): void;
        export function getLastFocused(getInfo: GetInfo | null | undefined, callback: ((window: Window) => void)): void;
        export function getLastFocused(callback: ((window: Window) => void)): void;
        /**
         * Removes (closes) a window, and all the tabs inside it.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/windows.json
         */
        export function remove(windowId: number): void;
        export function remove(windowId: number, callback: (() => void)): void;
        /**
         * Updates the properties of a window. Specify only the properties that you want to change; unspecified properties will be left unchanged.
         *
         * @see https://searchfox.org/firefox-main/rev/41db707342feaa6722e4a2076a24ec3d01fe96d2/browser/components/extensions/schemas/windows.json
         */
        export function update(windowId: number, updateInfo: update.UpdateInfo): void;
        export function update(windowId: number, updateInfo: update.UpdateInfo, callback: ((window: Window) => void)): void;
        export namespace update {
            export type UpdateInfo = browser.windows.update.UpdateInfo;
        }
    }
}

export default chrome;
