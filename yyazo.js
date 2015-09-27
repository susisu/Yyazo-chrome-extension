/*
 * copyright (c) 2015 Susisu
 */

(function () {
    "use strict";

    var settings = {
        "server_url": "http://localhost:3000"
    };

    chrome.browserAction.onClicked.addListener(function (tab) {
        chrome.tabs.sendMessage(tab.id, { action: "getCharacterSet" }, function (charset) {
            var params = "url=" + encodeURIComponent(tab.url) + "&charset=" + encodeURIComponent(charset);
            var request = new XMLHttpRequest();
            request.open("POST",
                settings["server_url"] + "/api/register"
            );
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.send(params);
        });
    });

    chrome.webRequest.onHeadersReceived.addListener(function (details) {
        for (var i = 0; i < details.responseHeaders.length; i++) {
            var header = details.responseHeaders[i];
            if (header.name.toLowerCase() === "content-type" && header.value.toLowerCase().indexOf("text") >= 0) {
                var request = new XMLHttpRequest();
                request.open("GET",
                    settings["server_url"] + "/api/charset?url=" + encodeURIComponent(details.url),
                    false
                );
                try {
                    request.send(null);
                    if (request.status === 200) {
                        var charset = request.responseText;
                        if (header.value.toLowerCase().indexOf("charset=") >= 0) {
                            header.value = header.value.replace(/charset\=[^\s;]+/, "charset=" + charset)
                        }
                        else {
                            header.value = header.value + "; charset=" + charset;
                        }
                    }
                }
                catch (error) {
                    // ignore
                }
                break;
            }
        }
        return { "responseHeaders": details.responseHeaders };
    }, { "urls": ["<all_urls>"] }, ["blocking", "responseHeaders"]);
})();
