import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './stores/store';
const container = document.getElementById('wakatime');

const openOptions = async (): Promise<void> => {
  await browser.runtime.openOptionsPage();
};

ReactDOM.render(
  <Provider store={store}>
    <h1>POPUP GO HERE</h1>
    <div onClick={openOptions}>Open options</div>
  </Provider>,
  container,
);
