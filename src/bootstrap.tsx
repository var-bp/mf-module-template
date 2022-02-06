import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import App from './App';
import { store } from './app/store';
import './index.scss';

interface IElement {
  eventEmitterInstance?: Object;
  externalProps?: object;
}

const EventEmitterContext = React.createContext();
const ExternalPropsContext = React.createContext();

// eslint-disable-next-line @typescript-eslint/no-redeclare
const Element = ({ eventEmitterInstance, externalProps }: IElement) => (
  <React.StrictMode>
    <Provider store={store}>
      <EventEmitterContext.Provider value={eventEmitterInstance}>
        <ExternalPropsContext.Provider value={externalProps}>
          <App />
        </ExternalPropsContext.Provider>
      </EventEmitterContext.Provider>
    </Provider>
  </React.StrictMode>
);

Element.defaultProps = {
  eventEmitterInstance: undefined,
  externalProps: undefined,
};

// export const Element = () => <div>HELLO!</div>;

// const container = document.querySelector(`#${process.env.MICROFRONTEND_HOST_NAME}`);
const container = document.querySelector('#MFModuleTemplate');
if (container) {
  ReactDOM.render(<Element />, container);
}

export default Element;