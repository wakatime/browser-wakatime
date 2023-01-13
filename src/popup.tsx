import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import WakaTime from './components/WakaTime';
import createStore from './stores/createStore';
import checkCurrentUser from './utils/checkCurrentUser';

/* This is a fix for Bootstrap requiring jQuery */
global.jQuery = require('jquery');
require('bootstrap');

const container = document.getElementById('wakatime');
const root = createRoot(container!);
const store = createStore('WakaTime-Options');
checkCurrentUser(store)(30 * 1000);

const openOptions = async (): Promise<void> => {
  await browser.runtime.openOptionsPage();
};

root.render(
  <Provider store={store}>
    <WakaTime />
    <div onClick={openOptions}>Open options</div>
  </Provider>,
);
