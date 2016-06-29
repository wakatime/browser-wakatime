/* global chrome */

// Core
var WakaTimeCore = require("./core/WakaTimeCore").default;

// initialize class
var wakatime = new WakaTimeCore();

// Holds currently open connections (ports) with devtools
// Uses tabId as index key.
var connections = {};

// Add a listener to resolve alarms
chrome.alarms.onAlarm.addListener(function (alarm) {
    // |alarm| can be undefined because onAlarm also gets called from
    // window.setTimeout on old chrome versions.
    if (alarm && alarm.name == 'heartbeatAlarm') {

        console.log('recording a heartbeat - alarm triggered');

        wakatime.recordHeartbeat();
    }
});

// Create a new alarm for heartbeats.
chrome.alarms.create('heartbeatAlarm', {periodInMinutes: 2});

/**
 * Whenever a active tab is changed it records a heartbeat with that tab url.
 */
chrome.tabs.onActivated.addListener(function (activeInfo) {

    chrome.tabs.get(activeInfo.tabId, function (tab) {

        console.log('recording a heartbeat - active tab changed');

        wakatime.recordHeartbeat();
    });

});

/**
 * Whenever any tab is updated it checks if the updated tab is the tab that is
 * currently active and if it is, then it records a heartbeat.
 */
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

    if (changeInfo.status === 'complete') {
        // Get current tab URL.
        chrome.tabs.query({active: true}, function(tabs) {
            // If tab updated is the same as active tab
            if (tabId == tabs[0].id) {
                console.log('recording a heartbeat - tab updated');

                wakatime.recordHeartbeat();
            }
        });
    }

});


/**
 * This is in charge of detecting if devtools are opened or closed
 * and sending a heartbeat depending on that.
 */
chrome.runtime.onConnect.addListener(function (port) {

    if (port.name == "devtools-page") {

        // Listen to messages sent from the DevTools page
        port.onMessage.addListener(function (message, sender, sendResponse) {
            if (message.name == "init") {

                connections[message.tabId] = port;

                wakatime.setTabsWithDevtoolsOpen(Object.keys(connections));

                wakatime.recordHeartbeat();
            }
        });

        port.onDisconnect.addListener(function (port) {

            var tabs = Object.keys(connections);

            for (var i = 0, len = tabs.length; i < len; i ++) {
                if (connections[tabs[i]] == port) {
                    delete connections[tabs[i]];
                    break;
                }
            }

            wakatime.setTabsWithDevtoolsOpen(Object.keys(connections));

            wakatime.recordHeartbeat();
        });

    }
});
