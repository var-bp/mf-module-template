import * as React from 'react';
import { useAppDispatch, useAppSelector } from './store';
import { selectUsersListData } from './store/users/slice';
import { setUsers } from './store/users/thunk';

const App = () => {
  const dispatch = useAppDispatch();
  const usersListData = useAppSelector(selectUsersListData);

  React.useEffect(() => {
    dispatch(setUsers());
  }, [dispatch]);

  return (
    <div data-testid="app">
      <ul>
        {usersListData.map((item, index) => (
          <li data-testid={`app_list-item-${index + 1}`} key={item.id}>
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
