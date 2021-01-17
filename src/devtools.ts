// // Create a connection to the background page
// const backgroundPageConnection = browser.runtime.connect({
//   name: 'devtools-page',
// });

// // Send a message to background page with the current active tabId
// backgroundPageConnection.postMessage({
//   name: 'init',
//   tabId: browser.devtools.inspectedWindow.tabId,
// });

// eslint-disable-next-line @typescript-eslint/no-floating-promises
browser.devtools.panels.create('Wakatime', 'test.png', 'WakatimeDevPanel.html');
