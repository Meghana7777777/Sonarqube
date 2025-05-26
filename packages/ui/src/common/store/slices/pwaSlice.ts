import { createSlice } from '@reduxjs/toolkit';
import { SliceNamesEnum } from './redux-slice-names';

const initialState: any = {
  event: null,
  isPWASupported: false,
  isStandalone: window.matchMedia('(display-mode: standalone)').matches,
};

export const pwaSlice = createSlice({
  name: SliceNamesEnum.PWA,
  initialState,
  reducers: {
    addDeferredPrompt: (state, action) => {
      state.event = action.payload;
      state.isPWASupported = true;
    },
  },
});

export const { addDeferredPrompt } = pwaSlice.actions;

export default pwaSlice.reducer;
