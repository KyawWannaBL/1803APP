import React from 'react';
import { logger } from '@/lib/logger';

type Props = { children: React.ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    logger.error('Unhandled application error', { error });
  }

  render() {
    if (this.state.error) {
      return (
        <section className="page-card">
          <h1>Application error</h1>
          <p>{this.state.error.message}</p>
          <p>Please check environment variables, backend connectivity, and runtime logs.</p>
        </section>
      );
    }
    return this.props.children;
  }
}
