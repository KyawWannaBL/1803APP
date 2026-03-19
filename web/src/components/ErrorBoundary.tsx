import React from 'react';

type Props = { children: React.ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error('Unhandled application error', error);
  }

  render() {
    if (this.state.error) {
      return (
        <section className="page-card">
          <h1>Application error</h1>
          <p>{this.state.error.message}</p>
        </section>
      );
    }
    return this.props.children;
  }
}