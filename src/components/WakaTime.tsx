import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setValue } from '../reducers/apiKey';
import { ReduxSelector } from '../types/store';
import { setUser } from '../reducers/currentUser';
import WakaTimeCore from '../core/WakaTimeCore';
import config from '../config/config';
import changeExtensionState from '../utils/changeExtensionState';
import NavBar from './NavBar';
import MainList from './MainList';

const API_KEY = 'waka_3766d693-bff3-4c63-8bf5-b439f3e12301';

export default function WakaTime(): JSX.Element {
  const dispatch = useDispatch();

  const defaultState = {
    loggedIn: false,
    loggingEnabled: config.loggingEnabled,
    totalTimeLoggedToday: '0 minutes',
  };
  const [state, setState] = useState(defaultState);
  const apiKeyFromRedux: string = useSelector((selector: ReduxSelector) => selector.apiKey.value);

  const fetchUserData = async (): Promise<void> => {
    // await browser.storage.sync.set({ apiKey: API_KEY });
    let apiKey = '';
    if (!apiKeyFromRedux) {
      const storage = await browser.storage.sync.get({
        apiKey: config.apiKey,
      });
      apiKey = storage.apiKey as string;
      dispatch(setValue(apiKey));
    }

    if (!apiKey) {
      await changeExtensionState('notSignedIn');
    }

    try {
      const data = await WakaTimeCore.checkAuth(apiKey);
      dispatch(setUser(data));
      const items = await browser.storage.sync.get({ loggingEnabled: config.loggingEnabled });

      if (items.loggingEnabled === true) {
        await changeExtensionState('allGood');
      } else {
        await changeExtensionState('notLogging');
      }

      const totalTimeLoggedToday = await WakaTimeCore.getTotalTimeLoggedToday(apiKey);
      setState({
        ...state,
        loggedIn: true,
        loggingEnabled: items.loggingEnabled as boolean,
        totalTimeLoggedToday: totalTimeLoggedToday.text,
      });

      await WakaTimeCore.recordHeartbeat();
    } catch (err: unknown) {
      await changeExtensionState('notSignedIn');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const disableLogging = async () => {
    setState({
      ...state,
      loggingEnabled: false,
    });

    await changeExtensionState('notLogging');

    await browser.storage.sync.set({
      loggingEnabled: false,
    });
  };

  const enableLogging = async () => {
    setState({
      ...state,
      loggingEnabled: true,
    });

    await changeExtensionState('allGood');

    await browser.storage.sync.set({
      loggingEnabled: true,
    });
  };

  const logoutUser = async () => {
    await browser.storage.sync.set({ apiKey: '' });

    setState(defaultState);

    await changeExtensionState('notSignedIn');
  };

  return (
    <div>
      <NavBar />
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <MainList
              disableLogging={disableLogging}
              enableLogging={enableLogging}
              loggingEnabled={state.loggingEnabled}
              totalTimeLoggedToday={state.totalTimeLoggedToday}
              logoutUser={logoutUser}
              loggedIn={state.loggedIn}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
