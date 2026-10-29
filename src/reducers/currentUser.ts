import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { CurrentUser, User } from '../types/user';
import { fetchStatusBarToday } from '../utils/statusBar';

interface setUserAction {
  payload: User | undefined;
  type: string;
}

type NameType = 'currentUser';
export const name: NameType = 'currentUser';

export const fetchCurrentUser = createAsyncThunk<User, string>(`[${name}]`, fetchStatusBarToday);

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
