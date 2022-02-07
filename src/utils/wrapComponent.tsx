import * as React from 'react';

interface IWrapper {
  error?: JSX.Element;
  delayed?: JSX.Element;
}

interface IProps extends IWrapper {
  children: React.ReactChild;
}

interface IState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<IProps, IState> {
  static defaultProps = {
    error: undefined,
    delayed: undefined,
  };

  state: IState = {
    hasError: false,
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getDerivedStateFromError(error: Error): IState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to some service
    console.error('Uncaught error:', error, errorInfo);
  }

  render() {
    const { error, delayed, children } = this.props;
    const { hasError } = this.state;

    if (hasError) {
      return error || <div>Something went wrong.</div>;
    }
    return <React.Suspense fallback={delayed || <div>Loading...</div>}>{children}</React.Suspense>;
  }
}

// const Header = wrapFederatedComponent(React.lazy(() => import(/* webpackPrefetch: true */ "nav/Header")));
const wrapFederatedComponent =
  (Component: React.LazyExoticComponent<React.ComponentType<any>>) =>
  ({ error, delayed, ...props }: IWrapper) =>
    (
      <ErrorBoundary error={error} delayed={delayed}>
        <Component {...props} />
      </ErrorBoundary>
    );

export default wrapFederatedComponent;
