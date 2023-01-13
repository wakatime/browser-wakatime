import { configureStore, Store } from '@reduxjs/toolkit';
import { logger } from 'redux-logger';
import { reduxBatch } from '@manaflair/redux-batch';
import devToolsEnhancer from 'remote-redux-devtools';
import currentUserReducer, { initialState as InitalCurrentUser } from '../reducers/currentUser';
import apiKeyReducer from '../reducers/apiKey';
import isProd from '../utils/isProd';
import { CurrentUser } from '../types/user';

export interface RootState {
  currentUser: CurrentUser;
}

const preloadedState: RootState = {
  currentUser: InitalCurrentUser,
};

export type RootStore = Store<RootState>;
export default (appName: string): RootStore => {
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
    reducer: {
      apiKey: apiKeyReducer,
      currentUser: currentUserReducer,
    },
  });

  return store;
};
