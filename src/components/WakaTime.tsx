import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ApiKeyReducer, ReduxSelector } from '../types/store';
import { fetchUserData } from '../utils/user';
import apiKeyInvalid from '../utils/apiKey';
import config from '../config/config';
import Alert from './Alert';
import NavBar from './NavBar';
import MainList from './MainList';

export default function WakaTime(): JSX.Element {
  const dispatch = useDispatch();
  const [extensionState, setExtensionState] = useState('');

  const {
    apiKey: apiKeyFromRedux,
    loggingEnabled,
    totalTimeLoggedToday,
  }: ApiKeyReducer = useSelector((selector: ReduxSelector) => selector.config);

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserData(apiKeyFromRedux, dispatch);
      const items = await browser.storage.sync.get({ extensionState: '' });
      setExtensionState(items.extensionState as string);
    };
    void fetchData();
  }, []);

  const isApiKeyValid = apiKeyInvalid(apiKeyFromRedux) === '';

  return (
    <div>
      <NavBar />
      {isApiKeyValid && extensionState === 'notSignedIn' && (
        <Alert
          type={config.alert.failure.type}
          text={'Invalid api key'}
          onClick={() => browser.runtime.openOptionsPage()}
          style={{ cursor: 'pointer' }}
        />
      )}
      {!isApiKeyValid && (
        <Alert
          type={config.alert.failure.type}
          text={'Please update your api key'}
          onClick={() => browser.runtime.openOptionsPage()}
          style={{ cursor: 'pointer' }}
        />
      )}
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <MainList loggingEnabled={loggingEnabled} totalTimeLoggedToday={totalTimeLoggedToday} />
          </div>
        </div>
      </div>
    </div>
  );
}
