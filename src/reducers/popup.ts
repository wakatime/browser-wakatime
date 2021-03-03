import currentUserReducer, { initialState as InitalCurrentUser, CurrentUser } from './currentUser';

export interface PopupState {
  currentUser: CurrentUser;
}
export const preloadedState: PopupState = {
  currentUser: InitalCurrentUser,
};

export default {
  currentUser: currentUserReducer,
};
