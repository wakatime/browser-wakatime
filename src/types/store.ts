import { CurrentUser } from './user';

export interface ApiKeyReducer {
  apiKey: string;
  loggingEnabled: boolean;
  totalTimeLoggedToday: string;
}

export interface ReduxSelector {
  config: ApiKeyReducer;
  currentUser: CurrentUser;
}
