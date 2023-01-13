import { RootStore } from '../stores/createStore';
import { fetchCurrentUser } from '../reducers/currentUser';
import { ReduxSelector } from '../types/store';

type unsub = () => void;
export default (store: RootStore) =>
  (time: number): unsub => {
    const fetchUser = () => {
      const apiKey: string = (store.getState() as ReduxSelector).apiKey.value;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      store.dispatch(fetchCurrentUser(apiKey));
    };
    fetchUser();
    const timeout = setInterval(fetchUser, time);
    return () => {
      clearInterval(timeout);
    };
  };
