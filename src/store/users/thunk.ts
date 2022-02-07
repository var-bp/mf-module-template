import { AppThunk } from '../../store';
import { usersListFetching, usersListFetched, usersListFetchFailed } from './slice';
import { getUsers } from '../../services/users';

export const setUsers = (): AppThunk => async (dispatch) => {
  try {
    dispatch(usersListFetching());
    const result = await getUsers();
    dispatch(usersListFetched(result));
  } catch (error) {
    dispatch(usersListFetchFailed(error));
  }
};
