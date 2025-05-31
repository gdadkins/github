import React from 'react';
import './ClinicalInsights.css';

interface Insight {
  id: string;
  type: 'positive' | 'warning' | 'critical' | 'recommendation';
  title: string;
  description: string;
  action?: string;
  metric?: string;
  trend?: 'improving' | 'stable' | 'declining';
}

interface ClinicalInsightsProps {
  data: any;
}

const ClinicalInsights: React.FC<ClinicalInsightsProps> = ({ data }) => {
  // Generate insights based on data patterns
  const generateInsights = (): Insight[] => {
    const insights: Insight[] = [];

    if (!data?.trends || data.trends.length === 0) return insights;

    // Analyze recent trends
    const recent7Days = data.trends.slice(-7);
    const recent30Days = data.trends.slice(-30);
    
    // AHI Trend Analysis
    const avgAHI7Day = recent7Days.reduce((sum: number, day: any) => sum + day.ahi, 0) / recent7Days.length;
    const avgAHI30Day = recent30Days.reduce((sum: number, day: any) => sum + day.ahi, 0) / recent30Days.length;
    
    if (avgAHI7Day < avgAHI30Day * 0.8) {
      insights.push({
        id: 'ahi-improving',
        type: 'positive',
        title: 'AHI Improving',
        description: 'Your AHI has decreased by 20% in the past week compared to your 30-day average.',
        metric: `${avgAHI7Day.toFixed(1)} vs ${avgAHI30Day.toFixed(1)}`,
        trend: 'improving'
      });
    }
    
    // Leak Rate Analysis
    const avgLeak = recent7Days.reduce((sum: number, day: any) => sum + day.leakRate, 0) / recent7Days.length;
    if (avgLeak > 24) {
      insights.push({
        id: 'leak-high',
        type: 'warning',
        title: 'High Mask Leak Detected',
        description: 'Your average leak rate exceeds recommended levels. This may reduce therapy effectiveness.',
        action: 'Check mask fit and seal',
        metric: `${avgLeak.toFixed(0)} L/min`,
        trend: 'stable'
      });
    }
    
    // Compliance Pattern
    const compliantNights = recent30Days.filter((day: any) => day.usageHours >= 4).length;
    const complianceRate = (compliantNights / recent30Days.length) * 100;
    
    if (complianceRate < 70) {
      insights.push({
        id: 'compliance-risk',
        type: 'critical',
        title: 'Insurance Compliance at Risk',
        description: 'Your 30-day compliance is below insurance requirements. Increase usage to maintain coverage.',
        action: 'Use CPAP for 4+ hours nightly',
        metric: `${complianceRate.toFixed(0)}% compliance`,
        trend: 'declining'
      });
    }
    
    // Pressure Optimization
    const avgPressure = recent7Days.reduce((sum: number, day: any) => sum + day.pressure, 0) / recent7Days.length;
    const pressureVariance = recent7Days.reduce((sum: number, day: any) => 
      sum + Math.abs(day.pressure - avgPressure), 0) / recent7Days.length;
    
    if (pressureVariance > 2) {
      insights.push({
        id: 'pressure-variance',
        type: 'recommendation',
        title: 'Pressure Fluctuations Detected',
        description: 'Your therapy pressure varies significantly. Consider discussing fixed pressure settings with your provider.',
        metric: `±${pressureVariance.toFixed(1)} cmH₂O`,
        trend: 'stable'
      });
    }
    
    // Event Pattern Analysis
    const totalEvents = recent7Days.reduce((sum: number, day: any) => 
      sum + day.events.central + day.events.obstructive + day.events.hypopnea, 0);
    const centralPercentage = recent7Days.reduce((sum: number, day: any) => 
      sum + day.events.central, 0) / totalEvents * 100;
    
    if (centralPercentage > 50) {
      insights.push({
        id: 'central-apnea',
        type: 'warning',
        title: 'High Central Apnea Percentage',
        description: 'Over 50% of your events are central apneas. This may indicate a need for different therapy.',
        action: 'Consult your sleep specialist',
        metric: `${centralPercentage.toFixed(0)}% central`,
        trend: 'stable'
      });
    }

    return insights;
  };

  const insights = generateInsights();

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return '✓';
      case 'warning':
        return '!';
      case 'critical':
        return '⚠';
      case 'recommendation':
        return '💡';
      default:
        return '•';
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'improving':
        return '↑';
      case 'declining':
        return '↓';
      case 'stable':
        return '→';
      default:
        return '';
    }
  };

  return (
    <div className="clinical-insights">
      <div className="insights-header">
        <h2 className="insights-title">Clinical Insights & Recommendations</h2>
        <span className="insights-badge">AI-Powered Analysis</span>
      </div>

      <div className="insights-grid">
        {insights.map((insight) => (
          <div key={insight.id} className={`insight-card ${insight.type}`}>
            <div className="insight-icon">
              {getInsightIcon(insight.type)}
            </div>
            
            <div className="insight-content">
              <div className="insight-header">
                <h3 className="insight-title">{insight.title}</h3>
                {insight.trend && (
                  <span className={`trend-indicator ${insight.trend}`}>
                    {getTrendIcon(insight.trend)} {insight.trend}
                  </span>
                )}
              </div>
              
              <p className="insight-description">{insight.description}</p>
              
              {insight.metric && (
                <div className="insight-metric">
                  <span className="metric-icon">📊</span>
                  <span className="metric-value">{insight.metric}</span>
                </div>
              )}
              
              {insight.action && (
                <div className="insight-action">
                  <button className="action-button">
                    {insight.action}
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {insights.length === 0 && (
          <div className="no-insights">
            <p>Analyzing your sleep data patterns. Check back after a few more nights of data.</p>
          </div>
        )}
      </div>

      <div className="insights-footer">
        <p className="insights-note">
          Insights are generated based on your therapy data patterns and clinical guidelines. 
          Always consult with your healthcare provider before making therapy changes.
        </p>
      </div>
    </div>
  );
};

export default ClinicalInsights;