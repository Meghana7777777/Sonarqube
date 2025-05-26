// src/reducers.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeScreenData: null,
};

const activeScreenSlice = createSlice({
  name: 'activeScreen',
  initialState,
  reducers: {
    setActiveScreenData: (state, action) => {
      state.activeScreenData = action.payload;
    },
  },
});

export const { setActiveScreenData } = activeScreenSlice.actions;

export default activeScreenSlice.reducer;
