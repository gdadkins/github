import React, { useState } from 'react';
import './QuickActions.css';

export const QuickActions: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const actions = [
    {
      id: 'upload',
      icon: '⬆️',
      label: 'Upload Data',
      color: '#10b981',
      action: () => console.log('Upload data'),
    },
    {
      id: 'export',
      icon: '📊',
      label: 'Export Report',
      color: '#3b82f6',
      action: () => console.log('Export report'),
    },
    {
      id: 'insights',
      icon: '🧠',
      label: 'AI Insights',
      color: '#8b5cf6',
      action: () => console.log('AI insights'),
    },
    {
      id: 'doctor',
      icon: '👨‍⚕️',
      label: 'Share with Doctor',
      color: '#f59e0b',
      action: () => console.log('Share with doctor'),
    },
  ];

  return (
    <div className={`quick-actions ${isExpanded ? 'quick-actions-expanded' : ''}`}>
      <button
        className="quick-actions-trigger"
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={() => setShowTooltip('main')}
        onMouseLeave={() => setShowTooltip(null)}
      >
        <span className={`trigger-icon ${isExpanded ? 'trigger-icon-rotated' : ''}`}>
          ⚡
        </span>
        {showTooltip === 'main' && (
          <div className="quick-tooltip">
            Quick Actions
          </div>
        )}
      </button>

      <div className="quick-actions-menu">
        {actions.map((action, index) => (
          <button
            key={action.id}
            className="quick-action-item"
            onClick={action.action}
            onMouseEnter={() => setShowTooltip(action.id)}
            onMouseLeave={() => setShowTooltip(null)}
            style={{
              transitionDelay: `${index * 50}ms`,
              '--action-color': action.color
            } as React.CSSProperties}
          >
            <span className="action-icon">{action.icon}</span>
            {showTooltip === action.id && (
              <div className="quick-tooltip tooltip-left">
                {action.label}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};