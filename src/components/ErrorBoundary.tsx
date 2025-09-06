import type React from "react";
import type { ErrorInfo } from "react";
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-6">
          <AlertTriangle className="mx-auto text-error" size={64} />
        </div>
        
        <h2 className="text-2xl font-bold text-base-content mb-4">
          Oops! Something went wrong
        </h2>
        
        <div className="bg-base-200 p-4 rounded-lg mb-6">
          <p className="text-sm text-base-content/70 mb-2">Error details:</p>
          <pre className="text-xs text-left bg-base-300 p-3 rounded overflow-auto max-h-32">
            {error.message}
          </pre>
        </div>
        
        <div className="flex gap-3 justify-center">
          <button
            onClick={resetErrorBoundary}
            className="btn btn-primary"
            type="button"
          >
            <RefreshCw size={16} />
            Try again
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="btn btn-outline"
            type="button"
          >
            <Home size={16} />
            Go home
          </button>
        </div>
        
        <p className="text-xs text-base-content/50 mt-4">
          If the problem persists, please refresh the page or osef0760 on discord.
        </p>
      </div>
    </div>
  );
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children, onError }) => {
  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    
    // Call custom error handler if provided
    onError?.(error, errorInfo);
    
    // Optional: Send error to monitoring service in production
    // Example: Sentry.captureException(error, { extra: errorInfo });
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={handleError}
      onReset={() => {
        // Clean up application state and reload
        window.location.reload();
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
