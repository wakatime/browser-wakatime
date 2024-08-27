import { IDBPDatabase, openDB } from 'idb';
import browser, { Tabs } from 'webextension-polyfill';
/* eslint-disable no-fallthrough */
/* eslint-disable default-case */
import moment from 'moment';
import { getOperatingSystem, isCodeReviewing } from '../utils';
import { changeExtensionStatus } from '../utils/changeExtensionStatus';
import getDomainFromUrl, { getDomain } from '../utils/getDomainFromUrl';
import { getSettings, Settings } from '../utils/settings';

import config, { ExtensionStatus } from '../config/config';
import { Heartbeat } from '../types/heartbeats';
import { getApiKey } from '../utils/apiKey';
import contains from '../utils/contains';
import { getHeartbeatFromPage } from '../utils/heartbeat';
import { getLoggingType } from '../utils/logging';

class WakaTimeCore {
  tabsWithDevtoolsOpen: Tabs.Tab[];
  lastHeartbeat: Heartbeat | undefined;
  lastHeartbeatSentAt = 0;
  lastExtensionState: ExtensionStatus = 'allGood';
  db: IDBPDatabase | undefined;
  constructor() {
    this.tabsWithDevtoolsOpen = [];
  }

  /**
   * Creates a IndexDB using idb https://github.com/jakearchibald/idb
   * a library that adds promises to IndexedDB and makes it easy to use
   */
  async createDB() {
    const dbConnection = await openDB('wakatime', 1, {
      upgrade(db, oldVersion) {
        // Create a store of objects
        const store = db.createObjectStore('cacheHeartbeats', {
          // The `time` property of the object will be the key, and be incremented automatically
          keyPath: 'time',
        });
        // Switch over the oldVersion, *without breaks*, to allow the database to be incrementally upgraded.
        switch (oldVersion) {
          case 0:
          // Placeholder to execute when database is created (oldVersion is 0)
          case 1:
            // Create an index called `type` based on the `type` property of objects in the store
            store.createIndex('time', 'time');
        }
      },
    });
    this.db = dbConnection;
  }

  shouldSendHeartbeat(heartbeat: Heartbeat): boolean {
    if (!this.lastHeartbeat) return true;
    if (this.lastHeartbeat.entity !== heartbeat.entity) return true;
    if (this.lastHeartbeatSentAt + 120000 < Date.now()) return true;
    return false;
  }

  canSendHeartbeat(url: string, settings: Settings): boolean {
    if (!settings.trackSocialMedia) {
      const domain = getDomain(url);
      if (
        settings.socialMediaSites.find((pattern) => {
          const re = new RegExp(pattern.replace(/\*/g, '.*'));
          return re.test(domain);
        }) !== undefined
      ) {
        return false;
      }
    }

    if (settings.loggingStyle === 'deny') {
      return (
        settings.denyList.find((pattern) => {
          const re = new RegExp(pattern.replace(/\*/g, '.*'));
          return re.test(url);
        }) == undefined
      );
    }
    return (
      settings.allowList.find((pattern) => {
        const re = new RegExp(pattern.replace(/\*/g, '.*'));
        return re.test(url);
      }) !== undefined
    );
  }

  async handleActivity(url: string, heartbeat: Heartbeat) {
    const settings = await getSettings();
    if (!settings.loggingEnabled) {
      await changeExtensionStatus('notLogging');
      return;
    }

    if (!this.canSendHeartbeat(url, settings)) {
      await changeExtensionStatus('ignored');
      return;
    }

    if (settings.extensionStatus !== 'notSignedIn') {
      await changeExtensionStatus('allGood');
    }

    if (!this.shouldSendHeartbeat(heartbeat)) return;

    // append heartbeat to queue
    await this.db?.add('cacheHeartbeats', heartbeat);
  }

  /**
   * Depending on various factors detects the current active tab URL or domain,
   * and sends it to WakaTime for logging.
   */
  async recordHeartbeat(html: string, payload: Record<string, unknown> = {}): Promise<void> {
    const apiKey = await getApiKey();
    if (!apiKey) {
      return changeExtensionStatus('notLogging');
    }
    const items = await browser.storage.sync.get({
      allowList: '',
      denyList: '',
      hostname: config.hostname,
      loggingEnabled: config.loggingEnabled,
      loggingStyle: config.loggingStyle,
      socialMediaSites: config.socialMediaSites,
      trackSocialMedia: config.trackSocialMedia,
    });
    if (items.loggingEnabled === true) {
      await changeExtensionStatus('allGood');

      let newState = '';
      // Detects we are running this code in the extension scope
      if (browser.idle as browser.Idle.Static | undefined) {
        newState = await browser.idle.queryState(config.detectionIntervalInSeconds);
        if (newState !== 'active') {
          return changeExtensionStatus('notLogging');
        }
      }

      // Get current tab URL.
      let url = '';
      if (browser.tabs as browser.Tabs.Static | undefined) {
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        if (tabs.length == 0) return;
        const currentActiveTab = tabs[0];
        url = currentActiveTab.url as string;
      } else {
        url = document.URL;
      }

      for (const site of config.nonTrackableSites) {
        if (url.startsWith(site)) {
          // Don't send a heartbeat on sites like 'chrome://newtab/' or 'about:newtab'
          return;
        }
      }

      const hostname = getDomain(url);
      if (!items.trackSocialMedia) {
        if ((items.socialMediaSites as string[]).includes(hostname)) {
          return changeExtensionStatus('ignored');
        }
      }

      // Checks dev websites
      const project = getHeartbeatFromPage(url, html);

      // Check if code reviewing
      const codeReviewing = isCodeReviewing(url);
      if (codeReviewing) {
        payload.category = 'code reviewing';
      }

      if (items.loggingStyle == 'deny') {
        if (!contains(url, items.denyList as string)) {
          await this.sendHeartbeat(
            {
              branch: null,
              hostname: items.hostname as string,
              project,
              url,
            },
            apiKey,
            payload,
          );
        } else {
          await changeExtensionStatus('ignored');
          console.log(`${url} is on denyList.`);
        }
      } else if (items.loggingStyle == 'allow') {
        const heartbeat = this.getHeartbeat(url, items.allowList as string);
        if (heartbeat.url) {
          await this.sendHeartbeat(
            {
              ...heartbeat,
              branch: null,
              hostname: items.hostname as string,
              project: heartbeat.project ?? project,
            },
            apiKey,
            payload,
          );
        } else {
          await changeExtensionStatus('ignored');
          console.log(`${url} is not on allowList.`);
        }
      } else {
        throw Error(`Unknown logging styel: ${items.loggingStyle}`);
      }
    }
  }

  /**
   * Creates an array from list using \n as delimiter
   * and checks if any element in list is contained in the url.
   * Also checks if element is assigned to a project using @@ as delimiter
   *
   * @param url
   * @param list
   * @returns {object}
   */
  getHeartbeat(url: string, list: string) {
    const projectIndicatorCharacters = '@@';

    const lines = list.split('\n');
    for (let i = 0; i < lines.length; i++) {
      // strip (http:// or https://) and trailing (`/` or `@@`)
      const cleanLine = lines[i]
        .trim()
        .replace(/(\/|@@)$/, '')
        .replace(/^(?:https?:\/\/)?/i, '');
      if (cleanLine === '') continue;

      const projectIndicatorIndex = cleanLine.lastIndexOf(projectIndicatorCharacters);
      const projectIndicatorExists = projectIndicatorIndex > -1;
      let projectName = null;
      let urlFromLine = cleanLine;
      if (projectIndicatorExists) {
        const start = projectIndicatorIndex + projectIndicatorCharacters.length;
        projectName = cleanLine.substring(start);
        urlFromLine = cleanLine
          .replace(cleanLine.substring(projectIndicatorIndex), '')
          .replace(/\/$/, '');
      }
      const cleanUrl = url
        .trim()
        .replace(/(\/|@@)$/, '')
        .replace(/^(?:https?:\/\/)?/i, '');
      const startsWithUrl = cleanUrl.toLowerCase().includes(urlFromLine.toLowerCase());
      if (startsWithUrl) {
        return {
          project: projectName,
          url,
        };
      }

      const lineRe = new RegExp(cleanLine.replace('.', '.').replace('*', '.*'));

      // If url matches the current line return true
      if (lineRe.test(url)) {
        return {
          project: null,
          url,
        };
      }
    }

    return {
      project: null,
      url: null,
    };
  }

  /**
   * Given the heartbeat and logging type it creates a payload and
   * sends an ajax post request to the API.
   *
   * @param heartbeat
   * @param debug
   */
  async sendHeartbeat(
    heartbeat: Heartbeat,
    apiKey: string,
    navigationPayload: Record<string, unknown>,
  ): Promise<void> {
    console.log('Sending Heartbeat', heartbeat);
    let payload;

    const loggingType = await getLoggingType();
    // Get only the domain from the entity.
    // And send that in heartbeat
    if (loggingType == 'domain') {
      heartbeat.url = getDomainFromUrl(heartbeat.url);
      payload = await this.preparePayload(heartbeat, 'domain');
      await this.sendPostRequestToApi(
        { ...payload, ...navigationPayload },
        apiKey,
        heartbeat.hostname,
      );
    }
    // Send entity in heartbeat
    else if (loggingType == 'url') {
      payload = await this.preparePayload(heartbeat, 'url');
      await this.sendPostRequestToApi(
        { ...payload, ...navigationPayload },
        apiKey,
        heartbeat.hostname,
      );
    }
  }

  /**
   * Creates payload for the heartbeat and returns it as JSON.
   *
   * @param heartbeat
   * @param type
   * @param debug
   * @returns {*}
   * @private
   */
  async preparePayload(heartbeat: Heartbeat, type: string): Promise<Record<string, unknown>> {
    const os = await getOperatingSystem();
    let browserName = 'chrome';
    let userAgent;
    if (IS_FIREFOX) {
      browserName = 'firefox';
      userAgent = navigator.userAgent.match(/Firefox\/\S+/g)?.[0];
    } else if (IS_EDGE) {
      browserName = 'edge';
      userAgent = navigator.userAgent;
    } else {
      userAgent = navigator.userAgent.match(/Chrome\/\S+/g)?.[0];
    }
    const payload: Record<string, unknown> = {
      entity: heartbeat.url,
      time: moment().format('X'),
      type: type,
      user_agent: `${userAgent} ${os} ${browserName}-wakatime/${config.version}`,
    };

    payload.project = heartbeat.project ?? '<<LAST_PROJECT>>';
    payload.branch = heartbeat.branch ?? '<<LAST_BRANCH>>';

    return payload;
  }

  /**
   * Sends AJAX request with payload to the heartbeat API as JSON.
   *
   * @param payload
   * @param method
   * @returns {*}
   */
  async sendPostRequestToApi(
    payload: Record<string, unknown>,
    apiKey = '',
    hostname = '',
  ): Promise<void> {
    try {
      const items = await browser.storage.sync.get({
        apiUrl: config.apiUrl,
        heartbeatApiEndPoint: config.heartbeatApiEndPoint,
      });

      const request: RequestInit = {
        body: JSON.stringify(payload),
        credentials: 'omit',
        method: 'POST',
      };
      if (hostname) {
        request.headers = {
          'X-Machine-Name': hostname,
        };
      }
      const response = await fetch(
        `${items.apiUrl}${items.heartbeatApiEndPoint}?api_key=${apiKey}`,
        request,
      );
      await response.json();
    } catch (err: unknown) {
      if (this.db) {
        await this.db.add('cacheHeartbeats', payload);
      }

      await changeExtensionStatus('notSignedIn');
    }
  }

  /**
   * Sends cached heartbeats request to wakatime api
   * @param requests
   */
  async sendCachedHeartbeatsRequest(): Promise<void> {
    const apiKey = await getApiKey();
    if (!apiKey) {
      return changeExtensionStatus('notLogging');
    }

    if (this.db) {
      const requests = await this.db.getAll('cacheHeartbeats');
      await this.db.clear('cacheHeartbeats');
      const chunkSize = 50; // Create batches of max 50 request
      for (let i = 0; i < requests.length; i += chunkSize) {
        const chunk = requests.slice(i, i + chunkSize);
        const requestsPromises: Promise<void>[] = [];
        chunk.forEach((request: Record<string, unknown>) =>
          requestsPromises.push(this.sendPostRequestToApi(request, apiKey)),
        );
        try {
          await Promise.all(requestsPromises);
        } catch (error: unknown) {
          console.log('Error sending heartbeats');
        }
      }
    }
  }
}

export default new WakaTimeCore();
