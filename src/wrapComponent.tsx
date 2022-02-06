import React from 'react';

interface Wrapper {
  error?: React.ReactChild;
  delayed?: React.ReactChild;
}

interface Props extends Wrapper {
  children: React.ReactChild;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  static defaultProps = {
    error: undefined,
    delayed: undefined,
  };

  state: State = {
    hasError: false,
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getDerivedStateFromError(error: Error): State {
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
  ({ error, delayed, ...props }: Wrapper) =>
    (
      <ErrorBoundary error={error} delayed={delayed}>
        <Component {...props} />
      </ErrorBoundary>
    );

export default wrapFederatedComponent;
