/* global chrome */

// Create a connection to the background page
var backgroundPageConnection = chrome.runtime.connect({
    name: "devtools-page"
});

// Send a message to background page with the current active tabId
backgroundPageConnection.postMessage({
    name: 'init',
    tabId: chrome.devtools.inspectedWindow.tabId
});
