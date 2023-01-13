import { createSlice } from '@reduxjs/toolkit';

interface setValueAction {
  payload: string;
  type: string;
}

export interface ApiKey {
  value: string;
}
export const initialState: ApiKey = { value: '' };

const apiKeySlice = createSlice({
  initialState,
  name: 'spiKey',
  reducers: {
    setValue: (state, action: setValueAction) => {
      state.value = action.payload;
    },
  },
});

export const actions = apiKeySlice.actions;
export const { setValue } = apiKeySlice.actions;
export default apiKeySlice.reducer;
