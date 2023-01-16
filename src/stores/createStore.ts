import { configureStore, Store, combineReducers } from '@reduxjs/toolkit';
import { logger } from 'redux-logger';
import { reduxBatch } from '@manaflair/redux-batch';
import devToolsEnhancer from 'remote-redux-devtools';
import currentUserReducer, { initialState as InitalCurrentUser } from '../reducers/currentUser';
import configReducer, { initialConfigState } from '../reducers/configReducer';
import isProd from '../utils/isProd';

// Create the root reducer separately so we can extract the RootState type
const rootReducer = combineReducers({
  config: configReducer,
  currentUser: currentUserReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const preloadedState: RootState = {
  config: initialConfigState,
  currentUser: InitalCurrentUser,
};

export default (appName: string): Store<RootState> => {
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
    reducer: rootReducer,
  });

  return store;
};
