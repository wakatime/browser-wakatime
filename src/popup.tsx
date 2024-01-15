import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import WakaTime from './components/WakaTime';
import createStore from './stores/createStore';
import checkCurrentUser from './utils/checkCurrentUser';

import 'bootstrap/dist/js/bootstrap';

const container = document.getElementById('wakatime');
const root = createRoot(container!);
const store = createStore('WakaTime-Options');
checkCurrentUser(store)(30 * 1000);

root.render(
  <Provider store={store}>
    <WakaTime />
  </Provider>,
);
