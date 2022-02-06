import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-redeclare
import { screen, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';

test('renders learn react link', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
  );

  expect(screen.getByText(/learn/i)).toBeInTheDocument();
});