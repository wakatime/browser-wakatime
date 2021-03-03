import { configureStore, Store } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { reduxBatch } from '@manaflair/redux-batch';
import devToolsEnhancer from 'remote-redux-devtools';
import reducer, { preloadedState, PopupState } from '../reducers/popup';
import isProd from '../utils/isProd';

export default (appName: string): Store<PopupState> => {
  const enhancers = [];
  enhancers.push(reduxBatch);
  if (!isProd()) {
    enhancers.push(
      devToolsEnhancer({ hostname: 'localhost', name: appName, port: 8000, realtime: true }),
    );
  }
  const store = configureStore({
    devTools: true,
    enhancers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
    preloadedState,
    reducer,
  });

  return store;
};
