// Type definitions for Firefox WebExtensions
// Project: firefox-webextension-types
// Target: Mobile
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

/// <reference path="./global-mobile.d.ts" />

declare namespace chrome {
    export import action = browser.action;
    export import activityLog = browser.activityLog;
    export import alarms = browser.alarms;
    export import browserAction = browser.browserAction;
    export import browserSettings = browser.browserSettings;
    export import browsingData = browser.browsingData;
    export import clipboard = browser.clipboard;
    export import contentScripts = browser.contentScripts;
    export import cookies = browser.cookies;
    export import declarativeNetRequest = browser.declarativeNetRequest;
    export import dns = browser.dns;
    export import downloads = browser.downloads;
    export import events = browser.events;
    export import experiments = browser.experiments;
    export import extension = browser.extension;
    export import extensionTypes = browser.extensionTypes;
    export import i18n = browser.i18n;
    export import idle = browser.idle;
    export import management = browser.management;
    export import manifest = browser.manifest;
    export import networkStatus = browser.networkStatus;
    export import notifications = browser.notifications;
    export import pageAction = browser.pageAction;
    export import permissions = browser.permissions;
    export import privacy = browser.privacy;
    export import proxy = browser.proxy;
    export import publicSuffix = browser.publicSuffix;
    export import runtime = browser.runtime;
    export import scripting = browser.scripting;
    export import storage = browser.storage;
    export import tabs = browser.tabs;
    export import telemetry = browser.telemetry;
    export import theme = browser.theme;
    export import trial = browser.trial;
    export import types = browser.types;
    export import userScripts = browser.userScripts;
    export import webNavigation = browser.webNavigation;
    export import webRequest = browser.webRequest;
}
