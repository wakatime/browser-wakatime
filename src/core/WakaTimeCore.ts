import { IDBPDatabase, openDB } from 'idb';
import browser, { Tabs } from 'webextension-polyfill';
/* eslint-disable no-fallthrough */
/* eslint-disable default-case */
import moment from 'moment';
import { v4 as uuid4 } from 'uuid';
import { OptionalHeartbeat } from '../types/sites';
import { changeExtensionStatus } from '../utils/changeExtensionStatus';
import getDomainFromUrl, { getDomain } from '../utils/getDomainFromUrl';
import { getOperatingSystem, IS_EDGE, IS_FIREFOX } from '../utils/operatingSystem';
import { getSettings, Settings } from '../utils/settings';

import config, { ExtensionStatus } from '../config/config';
import { EntityType, Heartbeat, HeartbeatsBulkResponse } from '../types/heartbeats';

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
        const store = db.createObjectStore('heartbeatQueue', {
          keyPath: 'id',
        });
        // Switch over the oldVersion, *without breaks*, to allow the database to be incrementally upgraded.
        switch (oldVersion) {
          case 0:
          // Placeholder to execute when database is created (oldVersion is 0)
          case 1:
            store.createIndex('id', 'id');
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
    for (const site of config.nonTrackableSites) {
      if (url.startsWith(site)) {
        // Don't send a heartbeat on sites like 'chrome://newtab/' or 'about:newtab'
        return false;
      }
    }

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

  async handleActivity(tabId: number) {
    const settings = await getSettings();
    if (!settings.loggingEnabled) {
      await changeExtensionStatus('trackingDisabled');
      return;
    }

    const activeTab = await this.getCurrentTab(tabId);
    if (!activeTab) return;

    const url = activeTab.url as string;

    if (!this.canSendHeartbeat(url, settings)) {
      await changeExtensionStatus('ignored');
      return;
    }

    if (settings.extensionStatus !== 'notSignedIn') {
      await changeExtensionStatus('allGood');
    }

    const heartbeat = await this.buildHeartbeat(url, settings, activeTab);

    if (!this.shouldSendHeartbeat(heartbeat)) return;

    // append heartbeat to queue
    await this.db?.add('heartbeatQueue', heartbeat);

    await this.sendHeartbeats();
  }

  async getCurrentTab(tabId: number): Promise<browser.Tabs.Tab | undefined> {
    const tabs: browser.Tabs.Tab[] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    const activeTab = tabs[0];
    if (tabId !== activeTab.id) return;

    return activeTab;
  }

  async buildHeartbeat(url: string, settings: Settings, tab: browser.Tabs.Tab): Promise<Heartbeat> {
    if (!tab.id) {
      throw Error('Missing tab id.');
    }

    const heartbeat = (
      (await browser.tabs.sendMessage(tab.id, { task: 'getHeartbeatFromPage', url })) as {
        heartbeat?: OptionalHeartbeat;
      }
    ).heartbeat;

    const entity = settings.loggingType === 'domain' ? getDomainFromUrl(url) : url;
    return {
      branch: heartbeat?.branch ?? '<<LAST_BRANCH>>',
      category: heartbeat?.category,
      entity: heartbeat?.entity ?? entity,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      id: uuid4(),
      language: heartbeat?.language,
      plugin: heartbeat?.plugin,
      project: heartbeat?.project ?? '<<LAST_PROJECT>>',
      time: this.getCurrentTime(),
      type: heartbeat?.entityType ?? (settings.loggingType as EntityType),
    };
  }

  getCurrentTime(): string {
    const m = moment();
    return `${m.format('x').slice(0, -3)}.${m.format('x').slice(-3)}`;
  }

  async sendHeartbeats(): Promise<void> {
    const settings = await browser.storage.sync.get({
      apiKey: config.apiKey,
      apiUrl: config.apiUrl,
      heartbeatApiEndPoint: config.heartbeatApiEndPoint,
      hostname: '',
    });
    if (!settings.apiKey) {
      await changeExtensionStatus('notSignedIn');
      return;
    }

    const heartbeats = (await this.db?.getAll('heartbeatQueue', undefined, 50)) as
      | Heartbeat[]
      | undefined;
    if (!heartbeats || heartbeats.length === 0) return;

    await this.db?.delete(
      'heartbeatQueue',
      heartbeats.map((heartbeat) => heartbeat.id),
    );

    const userAgent = await this.getUserAgent();

    try {
      const request: RequestInit = {
        body: JSON.stringify(
          heartbeats.map((heartbeat) => {
            return { ...heartbeat, userAgent };
          }),
        ),
        credentials: 'omit',
        method: 'POST',
      };
      if (typeof settings.hostname === 'string' && settings.hostname) {
        request.headers = {
          'X-Machine-Name': settings.hostname,
        };
      }

      const url = `${settings.apiUrl}${settings.heartbeatApiEndPoint}?api_key=${settings.apiKey}`;
      const response = await fetch(url, request);
      if (response.status === 401) {
        await this.putHeartbeatsBackInQueue(heartbeats);
        await changeExtensionStatus('notSignedIn');
        return;
      }
      const data = (await response.json()) as HeartbeatsBulkResponse;
      if (data.error) {
        await this.putHeartbeatsBackInQueue(heartbeats);
        console.error(data.error);
        return;
      }
      if (response.status === 201) {
        await Promise.all(
          (data.responses ?? []).map(async (resp, respNumber) => {
            if (resp[0].error) {
              await this.putHeartbeatsBackInQueue(heartbeats.filter((h, i) => i === respNumber));
              console.error(resp[0].error);
            } else if (resp[1] === 201 && resp[0].data?.id) {
              await changeExtensionStatus('allGood');
              // await this.db?.delete('heartbeatQueue', resp[0].data.id);
            } else {
              if (resp[1] !== 400) {
                await this.putHeartbeatsBackInQueue(heartbeats.filter((h, i) => i === respNumber));
              }
              console.error(
                `Heartbeat ${resp[0].data?.id ?? respNumber} returned status: ${resp[1]}`,
              );
            }
            return resp;
          }),
        );
      } else {
        await this.putHeartbeatsBackInQueue(heartbeats);
        console.error(`Heartbeat response status: ${response.status}`);
      }
    } catch (err: unknown) {
      console.error(err);
      await this.putHeartbeatsBackInQueue(heartbeats);
    }
  }

  async putHeartbeatsBackInQueue(heartbeats: Heartbeat[]): Promise<void> {
    await Promise.all(
      heartbeats.map(async (heartbeat) => this.db?.add('heartbeatQueue', heartbeat)),
    );
  }

  async getUserAgent(): Promise<string> {
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
    return `${userAgent} ${os} ${browserName}-wakatime/${config.version}`;
  }
}

export default new WakaTimeCore();
