import { CurrentUser } from './user';

export interface ApiKeyReducer {
  value: string;
}

export interface ReduxSelector {
  apiKey: ApiKeyReducer;
  currentUser: CurrentUser;
}
