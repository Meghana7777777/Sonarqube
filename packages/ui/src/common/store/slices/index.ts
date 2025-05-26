import userReducer from './userSlice';
import authReducer from './authSlice';
import nightModeReducer from './nightModeSlice';
import pwaReducer from './pwaSlice';
import ppsPOReducer from './pps-selected-po-slice';
import { combineReducers } from '@reduxjs/toolkit';

export default combineReducers({
  user: userReducer,
  auth: authReducer,
  nightMode: nightModeReducer,
  pwa: pwaReducer,
  ppsPo: ppsPOReducer,
});

export * from './pps-selected-po-slice';