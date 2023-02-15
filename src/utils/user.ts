import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { setApiKey, setLoggingEnabled, setTotalTimeLoggedToday } from '../reducers/configReducer';
import config from '../config/config';
import WakaTimeCore from '../core/WakaTimeCore';
import { setUser } from '../reducers/currentUser';
import changeExtensionState from './changeExtensionState';

export const logUserIn = async (apiKey: string): Promise<void> => {
  if (!apiKey) {
    await changeExtensionState('notSignedIn');
    return;
  }

  try {
    await WakaTimeCore.checkAuth(apiKey);
    const items = await browser.storage.sync.get({ loggingEnabled: config.loggingEnabled });

    if (items.loggingEnabled === true) {
      await changeExtensionState('allGood');
    } else {
      await changeExtensionState('notLogging');
    }
  } catch (err: unknown) {
    await changeExtensionState('notSignedIn');
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
      apiKey = await WakaTimeCore.fetchApiKey();
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
      WakaTimeCore.checkAuth(apiKey),
      WakaTimeCore.getTotalTimeLoggedToday(apiKey),
      browser.storage.sync.get({ loggingEnabled: config.loggingEnabled }),
    ]);
    dispatch(setUser(data));

    if (items.loggingEnabled === true) {
      await changeExtensionState('allGood');
    } else {
      await changeExtensionState('notLogging');
    }

    dispatch(setLoggingEnabled(items.loggingEnabled as boolean));
    dispatch(setTotalTimeLoggedToday(totalTimeLoggedTodayResponse.text));

    await WakaTimeCore.recordHeartbeat();
  } catch (err: unknown) {
    await changeExtensionState('notSignedIn');
  }
};
