import { reduxBatch } from '@manaflair/redux-batch';
import { combineReducers, configureStore, Store } from '@reduxjs/toolkit';
import { logger } from 'redux-logger';
import configReducer, { initialConfigState } from '../reducers/configReducer';
import currentUserReducer, { initialState as InitalCurrentUser } from '../reducers/currentUser';

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

export default (): Store<RootState> => {
  const enhancers = [];
  enhancers.push(reduxBatch);
  const store = configureStore({
    devTools: true,
    enhancers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
    preloadedState,
    reducer: rootReducer,
  });

  return store;
};
