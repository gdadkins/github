import React from 'react';
import './QuickMetrics.css';

interface QuickMetricsProps {
  data?: any;
  dateRange?: string;
}

const QuickMetrics: React.FC<QuickMetricsProps> = ({ data, dateRange }) => {
  const metrics = [
    {
      value: data?.ahi || '3.2',
      label: 'AHI',
      status: 'good',
      icon: '🎯',
      trend: '↓ 12%',
      description: 'Apnea-Hypopnea Index'
    },
    {
      value: data?.compliance || '92%',
      label: 'Compliance',
      status: 'excellent',
      icon: '✓',
      trend: '↑ 5%',
      description: 'Insurance compliance rate'
    },
    {
      value: data?.avgUsage || '7.2h',
      label: 'Avg Usage',
      status: 'good',
      icon: '⏱',
      trend: '→ 0%',
      description: 'Average nightly usage'
    },
    {
      value: data?.leakRate || '18',
      label: 'Leak Rate',
      status: 'warning',
      icon: '💨',
      trend: '↑ 8%',
      description: 'L/min mask leak'
    }
  ];

  const getDateRangeText = () => {
    switch (dateRange) {
      case '7d': return 'Last 7 Days';
      case '30d': return 'Last 30 Days';
      case '90d': return 'Last 90 Days';
      default: return 'Last 30 Days';
    }
  };

  return (
    <div className="quick-metrics">
      <div className="quick-metrics-header">
        <h3 className="quick-metrics-title">Quick Metrics Overview</h3>
        <span className="date-range-badge">{getDateRangeText()}</span>
      </div>
      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <div key={index} className={`metric-item ${metric.status}`}>
            <div className="metric-icon">{metric.icon}</div>
            <div className="metric-content">
              <div className="metric-value">{metric.value}</div>
              <div className="metric-label">{metric.label}</div>
              <div className="metric-trend">{metric.trend}</div>
            </div>
            <div className="metric-tooltip">{metric.description}</div>
          </div>
        ))}
      </div>
      <div className="quick-metrics-footer">
        <button className="view-details-button">View Detailed Analytics →</button>
      </div>
    </div>
  );
};

export default QuickMetrics;