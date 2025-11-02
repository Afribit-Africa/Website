"use client";

import { Component, ReactNode } from 'react';
import { FiAlertCircle } from 'react-icons/fi';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 bg-red-500/10 border-2 border-red-500/30 rounded-full flex items-center justify-center">
                <FiAlertCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">
              Something went wrong
            </h1>
            
            <p className="text-gray-400 mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>

            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-bitcoin hover:bg-bitcoin-dark text-white font-bold rounded-xl transition-colors"
            >
              Refresh Page
            </button>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-400">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 p-4 bg-white/5 rounded-lg text-xs text-red-400 overflow-auto">
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
