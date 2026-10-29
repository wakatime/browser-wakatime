import axios, { AxiosResponse } from 'axios';
import browser from 'webextension-polyfill';
import config from '../config/config';
import { User } from '../types/user';
import { getApiUrl } from './settings';

export const fetchStatusBarToday = async (api_key = ''): Promise<User> => {
  const items = await browser.storage.sync.get({
    statusBarApiEndPoint: config.statusBarApiEndPoint,
  });
  const apiUrl = await getApiUrl();
  const response: AxiosResponse<{ data: User }> = await axios.get(
    `${apiUrl}${items.statusBarApiEndPoint}`,
    { params: { api_key } },
  );
  return response.data.data;
};
