import * as React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { mockStore } from '../store';

// NOTE: for testing only

export const renderWithRedux = (Component: JSX.Element, store?: object) =>
  render(<Provider store={mockStore(store)}>{Component}</Provider>);

export const withRedux = (Component: JSX.Element, store?: object) => (
  <Provider store={mockStore(store)}>{Component}</Provider>
);
