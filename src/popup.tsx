import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createStore from './stores/createPopupStore';
import checkCurrentUser from './utils/checkCurrentUser';
import './less/app.less';
import MainList from './components/RenderMainList';

const container = document.getElementById('wakatime');
const store = createStore('WakaTime-Options');
checkCurrentUser(store)(30 * 1000);

ReactDOM.render(
  <Provider store={store}>
    <MainList />
  </Provider>,
  container,
);
