import { configureStore, Store } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { reduxBatch } from '@manaflair/redux-batch';
import devToolsEnhancer from 'remote-redux-devtools';
import currentUserReducer, {
  initialState as InitalCurrentUser,
  CurrentUser,
} from '../reducers/currentUser';
import isProd from '../utils/isProd';

export interface RootState {
  currentUser: CurrentUser;
}

const preloadedState: RootState = {
  currentUser: InitalCurrentUser,
};

export type RootStore = Store<RootState>;
export default (appName: string): RootStore => {
  const enhancers = [reduxBatch];
  if (!isProd()) {
    enhancers.push(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      devToolsEnhancer({ hostname: 'localhost', name: appName, port: 8000, realtime: true }),
    );
  }
  const store = configureStore({
    devTools: true,
    enhancers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
    preloadedState,
    reducer: {
      currentUser: currentUserReducer,
    },
  });

  return store;
};
