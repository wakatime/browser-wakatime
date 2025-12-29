import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import browser from 'webextension-polyfill';
import config from '../config/config';
import WakaTimeCore from '../core/WakaTimeCore';
import { ApiKeyReducer, ReduxSelector } from '../types/store';
import apiKeyInvalid from '../utils/apiKey';
import { getSettings, Settings } from '../utils/settings';
import { fetchUserData } from '../utils/user';
import Alert from './Alert';
import MainList from './MainList';
import NavBar from './NavBar';

export default function WakaTime(): JSX.Element {
  const dispatch = useDispatch();
  const [extensionStatus, setExtensionStatus] = useState('');
  const [currentTabUrl, setCurrentTabUrl] = useState<string>('');
  const [settings, setSettings] = useState<Settings | null>(null);

  const {
    apiKey: apiKeyFromRedux,
    loggingEnabled,
    totalTimeLoggedToday,
  }: ApiKeyReducer = useSelector((selector: ReduxSelector) => selector.config);

  useEffect(() => {
    // Fetch initial tab URL
    const fetchCurrentTab = async () => {
      const tabs = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (tabs[0]?.url) {
        setCurrentTabUrl(tabs[0].url);
      }
    };
    void fetchCurrentTab();

    // Listen for tab updates
    const handleTabUpdate = async (
      tabId: number,
      changeInfo: browser.Tabs.OnUpdatedChangeInfoType,
    ) => {
      if (changeInfo.url) {
        const tabs = await browser.tabs.query({
          active: true,
          currentWindow: true,
        });
        if (tabId === tabs[0]?.id) {
          setCurrentTabUrl(changeInfo.url);
        }
      }
    };

    browser.tabs.onUpdated.addListener(handleTabUpdate);

    // Cleanup listener on unmount
    return () => {
      browser.tabs.onUpdated.removeListener(handleTabUpdate);
    };
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      const fetchedSettings = await getSettings();
      setSettings(fetchedSettings);
    };
    void fetchSettings();
  }, []);

  const isIgnored = settings ? !WakaTimeCore.canSendHeartbeat(currentTabUrl, settings) : true;

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserData(apiKeyFromRedux, dispatch);
    };
    void fetchData();
  }, [apiKeyFromRedux, dispatch]);

  useEffect(() => {
    const init = async () => {
      const items = await browser.storage.sync.get({ extensionStatus: '' });
      setExtensionStatus(items.extensionStatus as string);
    };
    void init();
  }, []);

  const isApiKeyValid = apiKeyInvalid(apiKeyFromRedux) === '';

  return (
    <div className="py-4 px-2 pt-0">
      <NavBar />
      {isApiKeyValid && extensionStatus === 'notSignedIn' ? (
        <Alert
          type={config.alert.failure.type}
          text="Invalid API key or API url"
          onClick={() => browser.runtime.openOptionsPage()}
          style={{ cursor: 'pointer' }}
        />
      ) : null}
      {isApiKeyValid ? null : (
        <Alert
          type={config.alert.failure.type}
          text="Please update your api key"
          onClick={() => browser.runtime.openOptionsPage()}
          style={{ cursor: 'pointer' }}
        />
      )}
      <div className="container mt-0">
        <div className="row">
          <div className="col-md-12">
            <MainList
              isDomainIgnored={isIgnored}
              loggingEnabled={loggingEnabled}
              totalTimeLoggedToday={totalTimeLoggedToday}
              currentTabUrl={currentTabUrl}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
