// What to do when the event page first loads?
//
// Functional style
//
// 1. Run a function every 2 mins DONE
// 2. Check if the user is active (not idle)
// If the user is active, get the current active tab URL
// and send heartbeat to wakatime.
//

var WakaTime = require('./WakaTime');

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

        console.log('heartbeatAlarm triggered');

        var wakatime = new WakaTime;

        wakatime.recordHeartbeat();
    }
}

// Add a listener to resolve alarms
chrome.alarms.onAlarm.addListener(resolveAlarm);

// Create a new alarm for heartbeats.
chrome.alarms.create('heartbeatAlarm', {periodInMinutes: 1});
