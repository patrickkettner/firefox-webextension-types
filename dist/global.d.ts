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

import {
    browser as _browser,
    chrome as _chrome,
    WebExtensionEvent as _WebExtensionEvent,
    WebExtensionWebRequestEvent as _WebExtensionWebRequestEvent,
} from "./index.js";

declare global {
    export import browser = _browser;
    export import chrome = _chrome;
    type WebExtensionEvent<TCallback extends (...args: any[]) => any> = _WebExtensionEvent<TCallback>;
    type WebExtensionWebRequestEvent<TCallback extends (...args: any[]) => any> = _WebExtensionWebRequestEvent<TCallback>;
}

export {};