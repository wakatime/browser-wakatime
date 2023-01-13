import axios, { AxiosResponse } from 'axios';
import moment from 'moment';
import { Tabs } from 'webextension-polyfill-ts';
import { AxiosUserResponse, User } from '../types/user';
import config from '../config/config';
import { SummariesPayload, GrandTotal } from '../types/summaries';

class WakaTimeCore {
  tabsWithDevtoolsOpen: Tabs.Tab[];
  constructor() {
    this.tabsWithDevtoolsOpen = [];
  }

  setTabsWithDevtoolsOpen(tabs: Tabs.Tab[]): void {
    this.tabsWithDevtoolsOpen = tabs;
  }

  async getTotalTimeLoggedToday(api_key = ''): Promise<GrandTotal> {
    const today = moment().format('YYYY-MM-DD');
    const summariesAxiosPayload: AxiosResponse<SummariesPayload> = await axios.get(
      config.summariesApiUrl,
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

  async checkAuth(api_key = ''): Promise<User> {
    const userPayload: AxiosResponse<AxiosUserResponse> = await axios.get(
      config.currentUserApiUrl,
      { params: { api_key } },
    );
    return userPayload.data.data;
  }

  async recordHeartbeat(): Promise<void> {
    const items = await browser.storage.sync.get({
      blacklist: '',
      loggingEnabled: config.loggingEnabled,
      loggingStyle: config.loggingStyle,
      whitelist: '',
    });
  }
}

export default new WakaTimeCore();
