/* global browser */

// Create a connection to the background page
var backgroundPageConnection = browser.runtime.connect({
  name: 'devtools-page',
});

// Send a message to background page with the current active tabId
backgroundPageConnection.postMessage({
  name: 'init',
  tabId: browser.devtools.inspectedWindow.tabId,
});
