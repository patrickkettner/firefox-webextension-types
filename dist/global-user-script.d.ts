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

/**
 * `browser` in a user script whose world has messaging enabled. Firefox
 * builds it by hand with the functions below and nothing else, and a world
 * without messaging has no `browser`. `chrome` is the same object.
 */
declare namespace browser {
    export namespace runtime {
        /**
         * Opens a port to the extension, which receives it in `runtime.onUserScriptConnect`. A user script cannot connect to another extension.
         */
        export function connect(connectInfo?: import("./index.js").browser.runtime.connect.ConnectInfo | null): import("./index.js").browser.runtime.Port;
        /**
         * Sends a message to the extension, which receives it in `runtime.onUserScriptMessage`. Resolves with the response, or calls the callback with it.
         */
        export function sendMessage(message: any): globalThis.Promise<any>;
        export function sendMessage(message: any, responseCallback: (response: any) => void): void;
    }
}

declare namespace chrome {
    export import runtime = browser.runtime;
}
