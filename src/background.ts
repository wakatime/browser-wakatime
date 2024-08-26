import browser from 'webextension-polyfill';
import WakaTimeCore from './core/WakaTimeCore';
import { PostHeartbeatMessage } from './types/heartbeats';
import { getHtmlContentByTabId } from './utils';

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
browser.tabs.onActivated.addListener(async (activeInfo) => {
  console.log('recording a heartbeat - active tab changed');
  let html = '';
  try {
    html = await getHtmlContentByTabId(activeInfo.tabId);
    // eslint-disable-next-line no-empty
  } catch (error: unknown) {}
  await WakaTimeCore.recordHeartbeat(html);
});

/**
 * Whenever a active window is changed it records a heartbeat with the active tab url.
 */
browser.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId != browser.windows.WINDOW_ID_NONE) {
    console.log('recording a heartbeat - active window changed');
    const tabs: browser.Tabs.Tab[] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });

    let html = '';
    const tabId = tabs[0]?.id;
    if (tabId) {
      try {
        html = await getHtmlContentByTabId(tabId);
        // eslint-disable-next-line no-empty
      } catch (error: unknown) {}
    }
    await WakaTimeCore.recordHeartbeat(html);
  }
});

/**
 * Whenever any tab is updated it checks if the updated tab is the tab that is
 * currently active and if it is, then it records a heartbeat.
 */
browser.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.status === 'complete') {
    // Get current tab URL.
    const tabs: browser.Tabs.Tab[] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    // If tab updated is the same as active tab
    if (tabId == tabs[0]?.id) {
      let html = '';
      try {
        html = await getHtmlContentByTabId(tabId);
        // eslint-disable-next-line no-empty
      } catch (error: unknown) {}
      await WakaTimeCore.recordHeartbeat(html);
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

browser.runtime.onMessage.addListener(async (request: PostHeartbeatMessage, sender) => {
  if (request.recordHeartbeat === true) {
    if (sender.tab?.id) {
      let html = '';
      try {
        html = await getHtmlContentByTabId(sender.tab.id);
        // eslint-disable-next-line no-empty
      } catch (error: unknown) {}
      await WakaTimeCore.recordHeartbeat(html, request.projectDetails);
    }
  }
});

/**
 * "Persistent" service worker via bug exploit
 * https://stackoverflow.com/questions/66618136/persistent-service-worker-in-chrome-extension
 */
const keepAlive = () => setInterval(chrome.runtime.getPlatformInfo, 20000);
chrome.runtime.onStartup.addListener(keepAlive);
keepAlive();
