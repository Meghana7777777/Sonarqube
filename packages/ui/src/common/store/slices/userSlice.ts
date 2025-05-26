import { createAction, createSlice, PrepareAction } from '@reduxjs/toolkit';
import { readUser, persistUser } from '../../utils/localStorage.service';
import { SliceNamesEnum } from './redux-slice-names';
import { ActionNamesEnum } from './redux-action-names';

export interface UserState {
  //TODO: UserModel to do
  user: any | null;
}

const initialState: UserState = {
  user: readUser(),
};

export const setUser = createAction<PrepareAction<any>>(`${SliceNamesEnum.USER}/${ActionNamesEnum.setUser}`, (newUser) => {
  persistUser(newUser);

  return {
    payload: newUser,
  };
});

export const userSlice = createSlice({
  name: SliceNamesEnum.USER,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setUser, (state, action) => {
      state.user = action.payload;
    });
  },
});

export default userSlice.reducer;
