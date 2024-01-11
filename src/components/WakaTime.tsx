import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import config from '../config/config';
import { ApiKeyReducer, ReduxSelector } from '../types/store';
import apiKeyInvalid from '../utils/apiKey';
import { fetchUserData } from '../utils/user';
import Alert from './Alert';
import MainList from './MainList';
import NavBar from './NavBar';

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
    <div className="py-4 px-2 pt-0">
      <NavBar />
      {isApiKeyValid && extensionState === 'notSignedIn' && (
        <Alert
          type={config.alert.failure.type}
          text={'Invalid API key or API url'}
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
      <div className="container mt-0">
        <div className="row">
          <div className="col-md-12">
            <MainList loggingEnabled={loggingEnabled} totalTimeLoggedToday={totalTimeLoggedToday} />
          </div>
        </div>
      </div>
    </div>
  );
}
