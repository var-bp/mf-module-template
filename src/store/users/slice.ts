import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialState, { IUsersListData } from './initialState';
import { RootState } from '../../store';

export { initialState };

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    usersListFetching(state) {
      state.usersList.fetching = true;
    },
    usersListFetched(state, { payload }: PayloadAction<IUsersListData[]>) {
      state.usersList.fetching = false;
      state.usersList.data = payload;
      state.usersList.error = undefined;
    },
    usersListFetchFailed(state, { payload }: PayloadAction<any>) {
      state.usersList.fetching = false;
      state.usersList.data = [];
      state.usersList.error = payload;
    },
    resetUsersListState(state) {
      state.usersList = initialState.usersList;
    },
    resetState() {
      return initialState;
    },
  },
});

export const { usersListFetching, usersListFetched, usersListFetchFailed, resetUsersListState, resetState } =
  usersSlice.actions;

export const selectUsersListData = (state: RootState) => state.users.usersList.data;

export default usersSlice.reducer;
