import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import usersReducer from './users/slice';

const reducer = {
  users: usersReducer,
};

export const store = configureStore({
  reducer,
});

// NOTE: for testing only, look at src/utils/renderWithRedux.jsx
export const mockStore = (preloadedState?: object) =>
  configureStore({
    ...(preloadedState ? { preloadedState } : {}),
    reducer,
  });

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
