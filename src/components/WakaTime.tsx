import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ApiKeyReducer, ReduxSelector } from '../types/store';
import config from '../config/config';
import { fetchUserData } from '../utils/user';
import changeExtensionState from '../utils/changeExtensionState';
import NavBar from './NavBar';
import MainList from './MainList';

export default function WakaTime(): JSX.Element {
  const dispatch = useDispatch();

  const defaultState = {
    loggingEnabled: config.loggingEnabled,
    totalTimeLoggedToday: '0 minutes',
  };
  const [state, setState] = useState(defaultState);
  const {
    apiKey: apiKeyFromRedux,
    loggingEnabled,
    totalTimeLoggedToday,
  }: ApiKeyReducer = useSelector((selector: ReduxSelector) => selector.config);

  useEffect(() => {
    fetchUserData(apiKeyFromRedux, dispatch);
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
              loggingEnabled={loggingEnabled}
              totalTimeLoggedToday={totalTimeLoggedToday}
              logoutUser={logoutUser}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
