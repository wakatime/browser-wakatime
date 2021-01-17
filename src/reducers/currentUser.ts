import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosResponse } from 'axios';
import { User } from '../types/user';
import config from '../config';

type NameType = 'currentUser';
export const name: NameType = 'currentUser';

export const fetchCurrentUser = createAsyncThunk<User, undefined>(`[${name}]`, async () => {
  const userPayload: AxiosResponse<User> = await axios.get(config.currentUserApiUrl);
  return userPayload.data;
});

export interface CurrentUser {
  error?: unknown;
  pending?: boolean;
  user?: User;
}
export const initialState: CurrentUser = {};

const currentUser = createSlice({
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
      state.user = payload;
    });
    builder.addCase(fetchCurrentUser.rejected, (state, { error }) => {
      state.error = error;
    });
  },
  initialState,
  name,
  reducers: {},
});

export const actions = currentUser.actions;
export default currentUser.reducer;
