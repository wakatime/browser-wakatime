import browser from 'webextension-polyfill';
import WakaTimeCore from './core/WakaTimeCore';
import { IS_CHROME } from './utils';

// Add a listener to resolve alarms
browser.alarms.onAlarm.addListener(async (alarm) => {
  // |alarm| can be undefined because onAlarm also gets called from
  // window.setTimeout on old chrome versions.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (alarm && alarm.name == 'heartbeatAlarm') {
    // Checks if the user is online and if there are cached heartbeats requests,
    // if so then procedd to send these payload to wakatime api
    if (navigator.onLine) {
      await WakaTimeCore.sendCachedHeartbeatsRequest();
    }
  }
});

// Create a new alarm for sending cached heartbeats.
browser.alarms.create('heartbeatAlarm', { periodInMinutes: 2 });

/**
 * Whenever a active tab is changed it records a heartbeat with that tab url.
 */
browser.tabs.onActivated.addListener(async () => {
  console.log('recording a heartbeat - active tab changed ');
  await WakaTimeCore.recordHeartbeat();
});

function injectedFunction() {
  console.log('doc', document);
  console.log('url', document.URL);
}

/**
 * Whenever a active window is changed it records a heartbeat with the active tab url.
 */
browser.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId != browser.windows.WINDOW_ID_NONE) {
    console.log('recording a heartbeat - active window changed');
    await WakaTimeCore.recordHeartbeat();
  }
});

/**
 * Whenever any tab is updated it checks if the updated tab is the tab that is
 * currently active and if it is, then it records a heartbeat.
 */
browser.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.status === 'complete') {
    console.log('COMPLETED', tabId);
    try {
      if (IS_CHROME) {
        await browser.scripting.executeScript({
          func: injectedFunction,
          target: { tabId },
        });
      } else {
        injectedFunction();
      }
    } catch (error: unknown) {
      console.log('Can not mount script yet');
    }
    // Get current tab URL.
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    // If tab updated is the same as active tab
    if (tabId == tab.id) {
      await WakaTimeCore.recordHeartbeat();
    }
  }
});

/**
 * Creates IndexedDB
 * https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
 */
self.addEventListener('activate', async () => {
  await WakaTimeCore.createDB();
});
