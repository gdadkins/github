import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="enhanced-dashboard-loading">
      <div className="loading-spinner"></div>
      <p>Analyzing your sleep data...</p>
    </div>
  );
};

export default LoadingState;