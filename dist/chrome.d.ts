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

import { browser } from "./index.js";

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

export default chrome;