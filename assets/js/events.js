import WakaTime from "./WakaTime.js";

var wakatime = new WakaTime;

// Holds currently open connections (ports) with devtools
// Uses tabId as index key.
var connections = {};

/**
 * Whenever an alarms sets off, this function
 * gets called to detect the alarm name and
 * do appropriate action.
 *
 * @param alarm
 */
function resolveAlarm(alarm) {
    // |alarm| can be undefined because onAlarm also gets called from
    // window.setTimeout on old chrome versions.
    if (alarm && alarm.name == 'heartbeatAlarm') {

        console.log('recording a heartbeat - alarm triggered');

        wakatime.recordHeartbeat();
    }
}

// Add a listener to resolve alarms
chrome.alarms.onAlarm.addListener(resolveAlarm);

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
        chrome.tabs.query({active: true}, (tabs) => {
            // If tab updated is the same as active tab
            if (tabId == tabs[0].id) {
                console.log('recording a heartbeat - tab updated');

                wakatime.recordHeartbeat();
            }
        });
    }

});


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