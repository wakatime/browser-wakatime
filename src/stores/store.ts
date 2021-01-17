import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { reduxBatch } from '@manaflair/redux-batch';
import currentUserReducer, {
  initialState as InitalCurrentUser,
  CurrentUser,
} from '../reducers/currentUser';

export interface RootState {
  currentUser: CurrentUser;
}

const preloadedState: RootState = {
  currentUser: InitalCurrentUser,
};

const store = configureStore({
  devTools: true,
  enhancers: [reduxBatch],
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  preloadedState,
  reducer: {
    currentUser: currentUserReducer,
  },
});
export default store;
