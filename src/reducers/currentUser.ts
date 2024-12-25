import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosResponse } from 'axios';
import browser from 'webextension-polyfill';
import { CurrentUser, User, UserPayload } from '../types/user';

import config from '../config/config';
import { getApiUrl } from '../utils/settings';

interface setUserAction {
  payload: User | undefined;
  type: string;
}

type NameType = 'currentUser';
export const name: NameType = 'currentUser';

export const fetchCurrentUser = createAsyncThunk<User, string>(
  `[${name}]`,
  async (api_key = '') => {
    const items = await browser.storage.sync.get({
      currentUserApiEndPoint: config.currentUserApiEndPoint,
    });
    const apiUrl = await getApiUrl();
    const userPayload: AxiosResponse<UserPayload> = await axios.get(
      `${apiUrl}${items.currentUserApiEndPoint}`,
      {
        params: { api_key },
      },
    );
    return userPayload.data.data;
  },
);

export const initialState: CurrentUser = {};

const currentUser = createSlice({
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
      state.user = payload;
      state.pending = false;
    });
    builder.addCase(fetchCurrentUser.rejected, (state, { error }) => {
      state.user = undefined;
      state.error = error;
      state.pending = false;
    });
  },
  initialState,
  name,
  reducers: {
    setUser: (state, action: setUserAction) => {
      state.user = action.payload;
    },
    userLogout: (state) => {
      state.user = undefined;
    },
  },
});

export const actions = currentUser.actions;
export const { setUser, userLogout } = currentUser.actions;
export default currentUser.reducer;
