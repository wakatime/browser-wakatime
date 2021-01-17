import axios, { AxiosResponse } from 'axios';
import moment from 'moment';
import { Tabs } from 'webextension-polyfill-ts';
import { User } from '../types/user';
import config from '../config';
import { SummariesPayload, GrandTotal } from '../types/summaries';

class WakaTimeCore {
  tabsWithDevtoolsOpen: Tabs.Tab[];
  constructor() {
    this.tabsWithDevtoolsOpen = [];
  }
  setTabsWithDevtoolsOpen(tabs: Tabs.Tab[]): void {
    this.tabsWithDevtoolsOpen = tabs;
  }
  async getTotalTimeLoggedToday(): Promise<GrandTotal> {
    const today = moment().format('YYYY-MM-DD');
    const summariesAxiosPayload: AxiosResponse<SummariesPayload> = await axios.get(
      config.summariesApiUrl,
      {
        data: {
          end: today,
          start: today,
        },
      },
    );
    return summariesAxiosPayload.data.data[0].grand_total;
  }
  async checkAuth(): Promise<User> {
    const userPayload: AxiosResponse<User> = await axios.get(config.currentUserApiUrl);
    return userPayload.data;
  }
}

export default new WakaTimeCore();
