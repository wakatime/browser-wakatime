import { PopupStore } from '../stores/popupStore';
import { fetchCurrentUser } from '../reducers/currentUser';

type unsub = () => void;
export default (store: PopupStore) => (time: number): unsub => {
  const fetchUser = () => {
    store.dispatch(fetchCurrentUser());
  };
  fetchUser();
  const timeout = setInterval(fetchUser, time);
  return () => {
    clearInterval(timeout);
  };
};
