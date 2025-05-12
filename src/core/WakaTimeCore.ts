import { openDB } from 'idb';
import moment from 'moment';
import { v4 as uuid4 } from 'uuid';
import browser, { Tabs } from 'webextension-polyfill';
import config, { ExtensionStatus } from '../config/config';
import { EntityType, Heartbeat, HeartbeatsBulkResponse } from '../types/heartbeats';
import getDomainFromUrl, { getDomain } from '../utils/getDomainFromUrl';
import { IS_EDGE, IS_FIREFOX, getOperatingSystem } from '../utils/operatingSystem';
import { Settings, getApiUrl, getSettings } from '../utils/settings';

import { OptionalHeartbeat } from '../types/sites';
import { changeExtensionStatus } from '../utils/changeExtensionStatus';

/* eslint-disable no-fallthrough */
/* eslint-disable default-case */

class WakaTimeCore {
  tabsWithDevtoolsOpen: Tabs.Tab[];
  lastHeartbeat: Heartbeat | undefined;
  lastHeartbeatSentAt = 0;
  lastExtensionState: ExtensionStatus = 'allGood';
  constructor() {
    this.tabsWithDevtoolsOpen = [];
  }

  /**
   * Creates a IndexDB using idb https://github.com/jakearchibald/idb
   * a library that adds promises to IndexedDB and makes it easy to use
   */
  async db() {
    return openDB('wakatime', 2, {
      upgrade(db) {
        db.createObjectStore(config.queueName, {
          keyPath: 'id',
        });
      },
    });
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

  getProjectNameFromList(url: string, settings: Settings) {
    const site = settings.customProjectNames.find((pattern) => {
      const re = new RegExp(pattern.url);
      return re.test(url);
    });
    return site?.projectName;
  }

  async handleActivity(tabId: number, isPassiveActivity: boolean = false) {
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

    const heartbeat = await this.buildHeartbeat(url, settings, activeTab, isPassiveActivity);
    if (!heartbeat) {
      return;
    }

    if (!this.shouldSendHeartbeat(heartbeat)) return;

    // append heartbeat to queue
    await (await this.db()).add(config.queueName, heartbeat);

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

  async buildHeartbeat(
    url: string,
    settings: Settings,
    tab: browser.Tabs.Tab,
    isPassiveActivity: boolean,
  ): Promise<Heartbeat | undefined> {
    if (!tab.id) {
      throw Error('Missing tab id.');
    }

    const heartbeat = (
      (await browser.tabs.sendMessage(tab.id, { task: 'getHeartbeatFromPage', url })) as {
        heartbeat?: OptionalHeartbeat;
      }
    ).heartbeat;

    if (isPassiveActivity && !heartbeat) {
      return;
    }

    const entity = settings.loggingType === 'domain' ? getDomainFromUrl(url) : url;

    const projectNameFromList = this.getProjectNameFromList(url, settings);

    return {
      branch: heartbeat?.branch ?? '<<LAST_BRANCH>>',
      category: heartbeat?.category,
      entity: heartbeat?.entity ?? entity,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      id: uuid4(),
      language: heartbeat?.language,
      plugin: heartbeat?.plugin,
      project: projectNameFromList ?? heartbeat?.project ?? '<<LAST_PROJECT>>',
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
      heartbeatApiEndPoint: config.heartbeatApiEndPoint,
      hostname: '',
    });
    if (!settings.apiKey) {
      await changeExtensionStatus('notSignedIn');
      return;
    }

    const heartbeats = await this.getHeartbeatsFromQueue();
    if (heartbeats.length === 0) return;

    const userAgent = await this.getUserAgent();
    const apiUrl = await getApiUrl();

    try {
      const request: RequestInit = {
        body: JSON.stringify(
          heartbeats.map((heartbeat) => {
            return { ...heartbeat, plugin: userAgent };
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

      const url = `${apiUrl}${settings.heartbeatApiEndPoint}?api_key=${settings.apiKey}`;
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
      if (response.status === 202 || response.status === 201) {
        await Promise.all(
          (data.responses ?? []).map(async (resp, respNumber) => {
            const nestedResp = resp[0];
            const nestedStatus = resp[1];
            if (nestedResp.error) {
              await this.putHeartbeatsBackInQueue(heartbeats.filter((h, i) => i === respNumber));
              console.error(resp[0].error);
            } else if (nestedStatus >= 200 && nestedStatus <= 299) {
              await changeExtensionStatus('allGood');
            } else {
              if (nestedStatus !== 400) {
                await this.putHeartbeatsBackInQueue(heartbeats.filter((h, i) => i === respNumber));
              }
              console.error(
                `Heartbeat ${nestedResp.data?.id ?? respNumber} returned status: ${nestedStatus}`,
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

  async getHeartbeatsFromQueue(): Promise<Heartbeat[]> {
    const tx = (await this.db()).transaction(config.queueName, 'readwrite');

    const heartbeats = (await tx.store.getAll(undefined, 25)) as Heartbeat[] | undefined;
    if (!heartbeats || heartbeats.length === 0) return [];

    await Promise.all(
      heartbeats.map(async (heartbeat) => {
        return tx.store.delete(heartbeat.id);
      }),
    );

    await tx.done;

    return heartbeats;
  }

  async putHeartbeatsBackInQueue(heartbeats: Heartbeat[]): Promise<void> {
    await Promise.all(heartbeats.map(async (heartbeat) => this.putHeartbeatBackInQueue(heartbeat)));
  }

  async putHeartbeatBackInQueue(heartbeat: Heartbeat, tries = 0): Promise<void> {
    try {
      await (await this.db()).add(config.queueName, heartbeat);
    } catch (err: unknown) {
      if (tries < 10) {
        return await this.putHeartbeatBackInQueue(heartbeat, tries + 1);
      }
      console.error(err);
      console.error(`Unable to add heartbeat back into queue: ${heartbeat.id}`);
      console.error(JSON.stringify(heartbeat));
    }
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
