import { createSlice } from '@reduxjs/toolkit';
import config from '../config/config';
import { ApiKeyReducer } from '../types/store';

interface SetApiKeyAction {
  payload: string;
  type: string;
}

interface SetLoggingEnabledAction {
  payload: boolean;
  type: string;
}

interface SetTotalTimeLoggedTodayAction {
  payload: string;
  type: string;
}

export const initialConfigState: ApiKeyReducer = {
  apiKey: '',
  loggingEnabled: config.loggingEnabled,
  totalTimeLoggedToday: '0 minutes',
};

const apiKeySlice = createSlice({
  initialState: initialConfigState,
  name: 'configReducer',
  reducers: {
    configLogout: (state) => {
      state.apiKey = '';
      state.loggingEnabled = config.loggingEnabled;
      state.totalTimeLoggedToday = '0 minutes';
    },
    setApiKey: (state, action: SetApiKeyAction) => {
      state.apiKey = action.payload;
    },
    setLoggingEnabled: (state, action: SetLoggingEnabledAction) => {
      state.loggingEnabled = action.payload;
    },
    setTotalTimeLoggedToday: (state, action: SetTotalTimeLoggedTodayAction) => {
      state.totalTimeLoggedToday = action.payload;
    },
  },
});

export const actions = apiKeySlice.actions;
export const { configLogout, setApiKey, setLoggingEnabled, setTotalTimeLoggedToday } =
  apiKeySlice.actions;
export default apiKeySlice.reducer;
