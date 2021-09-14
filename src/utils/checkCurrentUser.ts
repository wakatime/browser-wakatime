import {RootStore} from '../stores/createStore';
import {fetchCurrentUser} from '../reducers/currentUser';

type unsub = () => void;
export default (store: RootStore) => (time: number): unsub => {
    const fetchUser = () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        store.dispatch(fetchCurrentUser());
    };
    fetchUser();
    const timeout = setInterval(fetchUser, time);
    return () => {
        clearInterval(timeout);
    };
};
