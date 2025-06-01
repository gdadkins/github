import React from 'react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data Available',
  message = 'There is no data to display at this time.',
  icon = '📊',
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-500 mb-4">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="btn btn-primary"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;