import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosResponse } from 'axios';
import { CurrentUser, User, UserPayload } from '../types/user';
import config from '../config/config';

interface setUserAction {
  payload: User | undefined;
  type: string;
}

type NameType = 'currentUser';
export const name: NameType = 'currentUser';

export const fetchCurrentUser = createAsyncThunk<User, string>(
  `[${name}]`,
  async (api_key = '') => {
    const userPayload: AxiosResponse<UserPayload> = await axios.get(config.currentUserApiUrl, {
      params: { api_key },
    });
    return userPayload.data.data;
  },
);

export const initialState: CurrentUser = {};

const currentUser = createSlice({
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentUser.fulfilled, (state, { payload }) => {
      state.user = payload;
    });
    builder.addCase(fetchCurrentUser.rejected, (state, { error }) => {
      state.user = undefined;
      state.error = error;
    });
  },
  initialState,
  name,
  reducers: {
    setUser: (state, action: setUserAction) => {
      state.user = action.payload;
    },
  },
});

export const actions = currentUser.actions;
export const { setUser } = currentUser.actions;
export default currentUser.reducer;
