import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import axios, { AxiosResponse } from 'axios';
import browser from 'webextension-polyfill';

import moment from 'moment';
import config from '../config/config';
import { setApiKey, setLoggingEnabled, setTotalTimeLoggedToday } from '../reducers/configReducer';
import { setUser } from '../reducers/currentUser';
import { GrandTotal, Summaries } from '../types/summaries';
import { ApiKeyPayload, AxiosUserResponse, User } from '../types/user';
import changeExtensionState from './changeExtensionStatus';

export const getApiUrl = async () => {
  const settings = await browser.storage.sync.get({
    apiUrl: config.apiUrl,
  });
  let apiUrl = (settings.apiUrl as string) || config.apiUrl;
  const suffixes = [
    '/',
    '.bulk',
    '.bulk',
    '/users/current/heartbeats',
    '/heartbeats',
    '/heartbeat',
  ];
  for (const suffix of suffixes) {
    if (apiUrl.endsWith(suffix)) {
      apiUrl = apiUrl.slice(0, -suffix.length);
    }
  }
  if (!apiUrl.endsWith('/api/v1')) {
    apiUrl = `${apiUrl}/api/v1`;
  }
  return apiUrl;
};

/**
 * Checks if the user is logged in.
 *
 * @returns {*}
 */
const checkAuth = async (api_key = ''): Promise<User> => {
  const items = await browser.storage.sync.get({
    currentUserApiEndPoint: config.currentUserApiEndPoint,
  });
  const apiUrl = await getApiUrl();
  const userPayload: AxiosResponse<AxiosUserResponse> = await axios.get(
    `${apiUrl}${items.currentUserApiEndPoint}`,
    { params: { api_key } },
  );
  return userPayload.data.data;
};

export const logUserIn = async (apiKey: string): Promise<void> => {
  if (!apiKey) {
    await changeExtensionState('notSignedIn');
    return;
  }

  try {
    await checkAuth(apiKey);
    const items = await browser.storage.sync.get({ loggingEnabled: config.loggingEnabled });

    if (items.loggingEnabled === true) {
      await changeExtensionState('allGood');
    } else {
      await changeExtensionState('trackingDisabled');
    }
  } catch (err: unknown) {
    await changeExtensionState('notSignedIn');
  }
};

/**
 * Fetches the api token for logged users in wakatime website
 *
 * @returns {*}
 */
const fetchApiKey = async (): Promise<string> => {
  try {
    const items = await browser.storage.sync.get({
      currentUserApiEndPoint: config.currentUserApiEndPoint,
    });
    const apiUrl = await getApiUrl();
    const apiKeyResponse: AxiosResponse<ApiKeyPayload> = await axios.post(
      `${apiUrl}${items.currentUserApiEndPoint}/get_api_key`,
    );
    return apiKeyResponse.data.data.api_key;
  } catch (err: unknown) {
    return '';
  }
};

const getTotalTimeLoggedToday = async (api_key = ''): Promise<GrandTotal> => {
  const items = await browser.storage.sync.get({
    summariesApiEndPoint: config.summariesApiEndPoint,
  });
  const apiUrl = await getApiUrl();
  const today = moment().format('YYYY-MM-DD');
  const summariesAxiosPayload: AxiosResponse<Summaries> = await axios.get(
    `${apiUrl}${items.summariesApiEndPoint}`,
    {
      params: {
        api_key,
        end: today,
        start: today,
      },
    },
  );
  return summariesAxiosPayload.data.data[0].grand_total;
};

export const fetchUserData = async (
  apiKey: string,
  dispatch: Dispatch<AnyAction>,
): Promise<void> => {
  if (!apiKey) {
    const storage = await browser.storage.sync.get({
      apiKey: config.apiKey,
    });
    apiKey = storage.apiKey as string;
    if (!apiKey) {
      apiKey = await fetchApiKey();
      if (apiKey) {
        await browser.storage.sync.set({ apiKey });
      }
    }

    dispatch(setApiKey(apiKey));
  }

  if (!apiKey) {
    return changeExtensionState('notSignedIn');
  }

  try {
    const [data, totalTimeLoggedTodayResponse, items] = await Promise.all([
      checkAuth(apiKey),
      getTotalTimeLoggedToday(apiKey),
      browser.storage.sync.get({ loggingEnabled: config.loggingEnabled }),
    ]);
    dispatch(setUser(data));

    if (items.loggingEnabled === true) {
      await changeExtensionState('allGood');
    } else {
      await changeExtensionState('trackingDisabled');
    }

    dispatch(setLoggingEnabled(items.loggingEnabled as boolean));
    dispatch(setTotalTimeLoggedToday(totalTimeLoggedTodayResponse.text));
  } catch (err: unknown) {
    await changeExtensionState('notSignedIn');
  }
};
