import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import axios, { AxiosResponse } from 'axios';
import browser from 'webextension-polyfill';
import { setApiKey, setLoggingEnabled, setTotalTimeLoggedToday } from '../reducers/configReducer';
import { ApiKeyPayload } from '../types/user';

import config from '../config/config';
import { setUser } from '../reducers/currentUser';
import changeExtensionState from './changeExtensionStatus';
import { getApiUrl } from './settings';
import { fetchStatusBarToday } from './statusBar';

export const logUserIn = async (apiKey: string): Promise<void> => {
  if (!apiKey) {
    await changeExtensionState('notSignedIn');
    return;
  }

  try {
    await fetchStatusBarToday(apiKey);
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
      apiKeyApiEndPoint: config.apiKeyApiEndPoint,
    });
    const apiUrl = await getApiUrl();
    const apiKeyResponse: AxiosResponse<ApiKeyPayload> = await axios.post(
      `${apiUrl}${items.apiKeyApiEndPoint}`,
    );
    return apiKeyResponse.data.data.api_key;
  } catch (err: unknown) {
    return '';
  }
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
    const [data, items] = await Promise.all([
      fetchStatusBarToday(apiKey),
      browser.storage.sync.get({ loggingEnabled: config.loggingEnabled }),
    ]);
    dispatch(setUser(data));

    if (items.loggingEnabled === true) {
      await changeExtensionState('allGood');
    } else {
      await changeExtensionState('trackingDisabled');
    }

    dispatch(setLoggingEnabled(items.loggingEnabled as boolean));
    dispatch(setTotalTimeLoggedToday(data.grand_total.text));
  } catch (err: unknown) {
    await changeExtensionState('notSignedIn');
  }
};
