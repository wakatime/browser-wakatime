import React, { useEffect } from 'react';
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

  const {
    apiKey: apiKeyFromRedux,
    loggingEnabled,
    totalTimeLoggedToday,
  }: ApiKeyReducer = useSelector((selector: ReduxSelector) => selector.config);

  useEffect(() => {
    void fetchUserData(apiKeyFromRedux, dispatch);
  }, []);

  const isApiKeyValid = apiKeyInvalid(apiKeyFromRedux) === '';

  return (
    <div>
      <NavBar />
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
