/* eslint-disable no-fallthrough */
/* eslint-disable default-case */
import axios, { AxiosResponse } from 'axios';
import { IDBPDatabase, openDB } from 'idb';
import moment from 'moment';
import browser, { Tabs } from 'webextension-polyfill';
import config from '../config/config';
import { SendHeartbeat } from '../types/heartbeats';
import { GrandTotal, SummariesPayload } from '../types/summaries';
import { ApiKeyPayload, AxiosUserResponse, User } from '../types/user';
import changeExtensionState from '../utils/changeExtensionState';
import contains from '../utils/contains';
import getDomainFromUrl from '../utils/getDomainFromUrl';

class WakaTimeCore {
  tabsWithDevtoolsOpen: Tabs.Tab[];
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

  setTabsWithDevtoolsOpen(tabs: Tabs.Tab[]): void {
    this.tabsWithDevtoolsOpen = tabs;
  }

  async getTotalTimeLoggedToday(api_key = ''): Promise<GrandTotal> {
    const items = await browser.storage.sync.get({
      apiUrl: config.apiUrl,
      summariesApiEndPoint: config.summariesApiEndPoint,
    });

    const today = moment().format('YYYY-MM-DD');
    const summariesAxiosPayload: AxiosResponse<SummariesPayload> = await axios.get(
      `${items.apiUrl}${items.summariesApiEndPoint}`,
      {
        params: {
          api_key,
          end: today,
          start: today,
        },
      },
    );
    return summariesAxiosPayload.data.data[0].grand_total;
  }

  /**
   * Fetches the api token for logged users in wakatime website
   *
   * @returns {*}
   */
  async fetchApiKey(): Promise<string> {
    try {
      const items = await browser.storage.sync.get({
        apiUrl: config.apiUrl,
        currentUserApiEndPoint: config.currentUserApiEndPoint,
      });

      const apiKeyResponse: AxiosResponse<ApiKeyPayload> = await axios.post(
        `${items.apiUrl}${items.currentUserApiEndPoint}/get_api_key`,
      );
      return apiKeyResponse.data.data.api_key;
    } catch (err: unknown) {
      return '';
    }
  }

  /**
   * Checks if the user is logged in.
   *
   * @returns {*}
   */
  async checkAuth(api_key = ''): Promise<User> {
    const items = await browser.storage.sync.get({
      apiUrl: config.apiUrl,
      currentUserApiEndPoint: config.currentUserApiEndPoint,
    });
    const userPayload: AxiosResponse<AxiosUserResponse> = await axios.get(
      `${items.apiUrl}${items.currentUserApiEndPoint}`,
      { params: { api_key } },
    );
    return userPayload.data.data;
  }

  async getApiKey(): Promise<string> {
    const storage = await browser.storage.sync.get({
      apiKey: config.apiKey,
    });
    const apiKey = storage.apiKey as string;
    return apiKey;
  }

  /**
   * Depending on various factors detects the current active tab URL or domain,
   * and sends it to WakaTime for logging.
   */
  async recordHeartbeat(): Promise<void> {
    const apiKey = await this.getApiKey();
    if (!apiKey) {
      return changeExtensionState('notLogging');
    }
    const items = await browser.storage.sync.get({
      blacklist: '',
      hostname: config.hostname,
      loggingEnabled: config.loggingEnabled,
      loggingStyle: config.loggingStyle,
      socialMediaSites: config.socialMediaSites,
      trackSocialMedia: config.trackSocialMedia,
      whitelist: '',
    });
    if (items.loggingEnabled === true) {
      await changeExtensionState('allGood');

      const newState = await browser.idle.queryState(config.detectionIntervalInSeconds);

      if (newState === 'active') {
        // Get current tab URL.
        const tabs = await browser.tabs.query({ active: true, currentWindow: true });
        if (tabs.length == 0) return;

        const currentActiveTab = tabs[0];

        if (!items.trackSocialMedia) {
          if (contains(currentActiveTab.url as string, items.socialMediaSites as string)) {
            return changeExtensionState('blacklisted');
          }
        }

        // Checks dev websites
        const project = this.generateProjectFromDevSites(currentActiveTab.url as string);

        if (items.loggingStyle == 'blacklist') {
          if (!contains(currentActiveTab.url as string, items.blacklist as string)) {
            await this.sendHeartbeat(
              {
                hostname: items.hostname as string,
                project,
                url: currentActiveTab.url as string,
              },
              apiKey,
            );
          } else {
            await changeExtensionState('blacklisted');
            console.log(`${currentActiveTab.url} is on a blacklist.`);
          }
        }

        if (items.loggingStyle == 'whitelist') {
          const heartbeat = this.getHeartbeat(
            currentActiveTab.url as string,
            items.whitelist as string,
          );
          if (heartbeat.url) {
            await this.sendHeartbeat(
              {
                ...heartbeat,
                hostname: items.hostname as string,
                project: heartbeat.project ?? project,
              },
              apiKey,
            );
          } else {
            await changeExtensionState('whitelisted');
            console.log(`${currentActiveTab.url} is not on a whitelist.`);
          }
        }
      }
    } else {
      await changeExtensionState('notLogging');
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
      const schemaHttpExists = url.match(/^http:\/\//i);
      const schemaHttpsExists = url.match(/^https:\/\//i);
      let schema = '';
      if (schemaHttpExists) {
        schema = 'http://';
      }
      if (schemaHttpsExists) {
        schema = 'https://';
      }
      const cleanUrl = url
        .trim()
        .replace(/(\/|@@)$/, '')
        .replace(/^(?:https?:\/\/)?/i, '');
      const startsWithUrl = cleanUrl.toLowerCase().includes(urlFromLine.toLowerCase());
      if (startsWithUrl) {
        return {
          project: projectName,
          url: schema + urlFromLine,
        };
      }

      const lineRe = new RegExp(cleanLine.replace('.', '.').replace('*', '.*'));

      // If url matches the current line return true
      if (lineRe.test(url)) {
        return {
          project: null,
          url: schema + urlFromLine,
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
  async sendHeartbeat(heartbeat: SendHeartbeat, apiKey: string): Promise<void> {
    let payload;

    const loggingType = await this.getLoggingType();
    // Get only the domain from the entity.
    // And send that in heartbeat
    if (loggingType == 'domain') {
      heartbeat.url = getDomainFromUrl(heartbeat.url);
      payload = this.preparePayload(heartbeat, 'domain');
      await this.sendPostRequestToApi(payload, apiKey, heartbeat.hostname);
    }
    // Send entity in heartbeat
    else if (loggingType == 'url') {
      payload = this.preparePayload(heartbeat, 'url');
      await this.sendPostRequestToApi(payload, apiKey, heartbeat.hostname);
    }
  }

  /**
   * Returns a promise with logging type variable.
   *
   * @returns {*}
   * @private
   */
  async getLoggingType(): Promise<string> {
    const items = await browser.storage.sync.get({
      loggingType: config.loggingType,
    });

    return items.loggingType;
  }

  generateProjectFromDevSites(url: string): string | null {
    const githubUrls = ['https://github.com/', 'https://github.dev/'];
    for (const githubUrl of githubUrls) {
      if (url.startsWith(githubUrl)) {
        const newUrl = url.replace(githubUrl, '');
        return newUrl.split('/')[1] || null;
      }
    }
    return null;
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
  preparePayload(heartbeat: SendHeartbeat, type: string): Record<string, unknown> {
    let browserName = 'chrome';
    let userAgent;
    if (navigator.userAgent.includes('Firefox')) {
      browserName = 'firefox';
      userAgent = navigator.userAgent.match(/Firefox\/\S+/g)![0];
    } else {
      userAgent = navigator.userAgent.match(/Chrome\/\S+/g)![0];
    }
    const payload: Record<string, unknown> = {
      entity: heartbeat.url,
      time: moment().format('X'),
      type: type,
      user_agent: `${userAgent} ${browserName}-wakatime/${config.version}`,
    };

    if (heartbeat.project) {
      payload.project = heartbeat.project;
    }

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

      await changeExtensionState('notSignedIn');
    }
  }

  /**
   * Sends cached heartbeats request to wakatime api
   * @param requests
   */
  async sendCachedHeartbeatsRequest(): Promise<void> {
    const apiKey = await this.getApiKey();
    if (!apiKey) {
      return changeExtensionState('notLogging');
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
