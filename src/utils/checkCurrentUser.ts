import { Store } from '@reduxjs/toolkit';
import { RootState } from '../stores/createStore';
import { fetchCurrentUser } from '../reducers/currentUser';
import { ReduxSelector } from '../types/store';

type unsub = () => void;
export default (store: Store<RootState>) =>
  (time: number): unsub => {
    const fetchUser = () => {
      const apiKey: string = (store.getState() as ReduxSelector).config.apiKey;

      // @ts-expect-error be able to dispatch async thunk
      store.dispatch(fetchCurrentUser(apiKey));
    };
    fetchUser();
    const timeout = setInterval(fetchUser, time);
    return () => {
      clearInterval(timeout);
    };
  };
