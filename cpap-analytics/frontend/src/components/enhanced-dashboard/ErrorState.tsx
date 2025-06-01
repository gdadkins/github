import React from 'react';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="enhanced-dashboard-error">
      <h2>Unable to load dashboard</h2>
      <p>{error}</p>
      <button onClick={onRetry}>Retry</button>
    </div>
  );
};

export default ErrorState;