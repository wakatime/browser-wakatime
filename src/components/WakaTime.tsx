import React, { useEffect, useState } from 'react';
import WakaTimeCore from '../core/WakaTimeCore';
import config from '../config/config';
import changeExtensionState from '../utils/changeExtensionState';
import NavBar from './NavBar';
import MainList from './MainList';

const API_KEY = 'waka_3766d693-bff3-4c63-8bf5-b439f3e12301';

export default function WakaTime() {
  const defaultState = {
    apiKey: '',
    loading: true,
    loggedIn: false,
    loggingEnabled: config.loggingEnabled,
    totalTimeLoggedToday: '0 minutes',
    user: {
      email: '',
      full_name: '',
      photo: '',
    },
  };
  const [state, setState] = useState(defaultState);

  const fetchUserData = async () => {
    // await browser.storage.sync.set({ apiKey: API_KEY });
    const { apiKey } = await browser.storage.sync.get({ apiKey: config.apiKey });

    if (!apiKey) {
      changeExtensionState('notSignedIn');
    }

    try {
      const data = await WakaTimeCore.checkAuth(apiKey as string);
      const items = await browser.storage.sync.get({ loggingEnabled: config.loggingEnabled });

      if (items.loggingEnabled === true) {
        changeExtensionState('allGood');
      } else {
        changeExtensionState('notLogging');
      }

      const totalTimeLoggedToday = await WakaTimeCore.getTotalTimeLoggedToday(apiKey as string);
      setState({
        ...state,
        apiKey,
        loading: false,
        loggedIn: true,
        loggingEnabled: items.loggingEnabled,
        totalTimeLoggedToday: totalTimeLoggedToday.text,
        user: {
          email: data.email,
          full_name: data.full_name,
          photo: data.photo,
        },
      });

      await WakaTimeCore.recordHeartbeat();
    } catch (err) {
      changeExtensionState('notSignedIn');
      setState({ ...defaultState, loading: false });
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const disableLogging = () => {
    setState({
      ...state,
      loggingEnabled: false,
    });

    changeExtensionState('notLogging');

    browser.storage.sync.set({
      loggingEnabled: false,
    });
  };

  const enableLogging = () => {
    setState({
      ...state,
      loggingEnabled: true,
    });

    changeExtensionState('allGood');

    browser.storage.sync.set({
      loggingEnabled: true,
    });
  };

  const logoutUser = async () => {
    await browser.storage.sync.set({ apiKey: '' });

    setState(defaultState);

    changeExtensionState('notSignedIn');
  };

  // if (state.loading === true) {
  //   return <div>Loading</div>
  // }

  return (
    <div>
      <NavBar user={state.user} loggedIn={state.loggedIn} />
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
