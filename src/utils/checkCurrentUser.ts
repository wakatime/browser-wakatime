import { RootStore } from '../stores/createPopupStore';
import { fetchCurrentUser } from '../reducers/currentUser';

type unsub = () => void;
export default (store: RootStore) => (time: number): unsub => {
  const fetchUser = () => {
    store.dispatch(fetchCurrentUser());
  };
  fetchUser();
  const timeout = setInterval(fetchUser, time);
  return () => {
    clearInterval(timeout);
  };
};
