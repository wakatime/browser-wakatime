import { GrandTotal } from './summaries';

// The plugin status endpoint confirms authentication without exposing profile data.
export interface User {
  grand_total: GrandTotal;
}

export interface CurrentUser {
  error?: unknown;
  pending?: boolean;
  user?: User;
}

export interface ApiKeyPayload {
  data: ApiKey;
}

export interface ApiKey {
  api_key: string;
}
