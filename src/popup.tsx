import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import popupStore from './stores/popupStore';
import checkCurrentUser from './utils/checkCurrentUser';
import './less/app.less';
import MainList from './components/MainList';

const container = document.getElementById('wakatime');
const store = popupStore;
checkCurrentUser(store)(30 * 1000);

ReactDOM.render(
  <Provider store={store}>
    <MainList />
  </Provider>,
  container,
);
