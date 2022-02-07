import * as React from 'react';
// eslint-disable-next-line @typescript-eslint/no-redeclare
import { screen } from '@testing-library/react';
import { renderWithRedux } from './utils/renderWithRedux';
import App from './App';

describe('App', () => {
  test('renders without crashing', () => {
    renderWithRedux(<App />);
    expect(screen.getByTestId('app')).toBeInTheDocument();
  });
  test('renders users list without crashing', () => {
    renderWithRedux(<App />, {
      users: {
        usersList: {
          fetching: false,
          data: [
            {
              id: 1,
              name: 'Leanne Graham',
              username: 'Bret',
              email: 'Sincere@april.biz',
              address: {
                street: 'Kulas Light',
                suite: 'Apt. 556',
                city: 'Gwenborough',
                zipcode: '92998-3874',
                geo: {
                  lat: '-37.3159',
                  lng: '81.1496',
                },
              },
              phone: '1-770-736-8031 x56442',
              website: 'hildegard.org',
              company: {
                name: 'Romaguera-Crona',
                catchPhrase: 'Multi-layered client-server neural-net',
                bs: 'harness real-time e-markets',
              },
            },
          ],
          error: undefined,
        },
      },
    });
    expect(screen.getByTestId('app_list-item-1')).toBeInTheDocument();
  });
});
