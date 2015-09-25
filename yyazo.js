/*
 * copyright (c) 2015 Susisu
 */

(function () {
    "use strict";

    chrome.browserAction.onClicked.addListener(function (tab) {
        chrome.tabs.sendMessage(tab.id, { action: "getCharacterSet" }, function (charset) {
            // TODO: send the current (appropriate) character set to the server

            // console.log(charset);
        });
    });

    chrome.webRequest.onHeadersReceived.addListener(function (details) {
        for (var i = 0; i < details.responseHeaders.length; i++) {
            var header = details.responseHeaders[i];
            if (header.name.toLowerCase() === "content-type" && header.value.toLowerCase().indexOf("text") >= 0) {
                // TODO: check `header.url` here (send http request to the server)
                //  and override the character set of the page

                // var request = new XMLHttpRequest();
                // request.open("GET", "http://localhost:3000", false);
                // request.send(null);
                // if (header.value.toLowerCase().indexOf("charset=") >= 0) {
                //     header.value = header.value.replace(/charset\=[^\s;]+/, "charset=UTF-8")
                // }
                // else {
                //     header.value = header.value + "; charset=UTF-8";
                // }
            }
        }
        return { "responseHeaders": details.responseHeaders };
    }, { "urls": ["<all_urls>"] }, ["blocking", "responseHeaders"]);
})();
