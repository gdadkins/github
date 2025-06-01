import React from 'react';
import './QuickMetrics.css';

interface QuickMetricsProps {
  data?: any;
  dateRange?: string;
}

const QuickMetrics: React.FC<QuickMetricsProps> = ({ data, dateRange }) => {
  // Extract values from analytics data structure or use defaults
  const ahi = data?.summary?.avg_ahi ?? 3.2;
  const avgDuration = data?.summary?.avg_duration ?? 7.2;
  const avgLeak = data?.summary?.avg_leak ?? 18;
  
  // Calculate compliance based on sessions with 4+ hours usage
  const compliance = data?.recent_sessions ? 
    Math.round((data.recent_sessions.filter((s: any) => s.duration_hours >= 4).length / data.recent_sessions.length) * 100) : 
    92;

  const metrics = [
    {
      value: ahi.toFixed(1),
      label: 'AHI',
      status: ahi < 5 ? 'excellent' : ahi < 15 ? 'good' : ahi < 30 ? 'warning' : 'poor',
      icon: 'target',
      trend: '↓ 12%',
      description: 'Apnea-Hypopnea Index'
    },
    {
      value: `${compliance}%`,
      label: 'Compliance',
      status: compliance >= 90 ? 'excellent' : compliance >= 70 ? 'good' : compliance >= 50 ? 'warning' : 'poor',
      icon: 'check',
      trend: '↑ 5%',
      description: 'Insurance compliance rate'
    },
    {
      value: `${avgDuration.toFixed(1)}h`,
      label: 'Avg Usage',
      status: avgDuration >= 7 ? 'excellent' : avgDuration >= 4 ? 'good' : avgDuration >= 2 ? 'warning' : 'poor',
      icon: 'clock',
      trend: '→ 0%',
      description: 'Average nightly usage'
    },
    {
      value: `${avgLeak.toFixed(0)}`,
      label: 'Leak Rate',
      status: avgLeak <= 20 ? 'good' : avgLeak <= 30 ? 'warning' : 'poor',
      icon: 'alert',
      trend: '↑ 8%',
      description: 'L/min mask leak rate'
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
            <div className={`metric-icon ${metric.icon}`} aria-label={metric.description}></div>
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