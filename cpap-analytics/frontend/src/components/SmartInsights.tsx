import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import './SmartInsights.css';

interface SmartInsight {
  type: 'achievement' | 'improvement' | 'concern' | 'recommendation' | 'trend' | 'alert';
  title: string;
  message: string;
  confidence: 'high' | 'medium' | 'low';
  clinical_relevance: 'high' | 'medium' | 'low';
  actionable: boolean;
  data_points?: Record<string, any>;
  next_steps?: string[];
  priority: number;
  timestamp: string;
}

interface InsightsData {
  insights: SmartInsight[];
  total_insights: number;
  generated_at: string;
}

const SmartInsights: React.FC = () => {
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedInsight, setExpandedInsight] = useState<number | null>(null);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      setLoading(true);
      const data = await apiService.getInsights();
      setInsights(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load insights');
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type: SmartInsight['type']) => {
    switch (type) {
      case 'achievement':
        return '🏆';
      case 'improvement':
        return '📈';
      case 'concern':
        return '⚠️';
      case 'recommendation':
        return '💡';
      case 'trend':
        return '📊';
      case 'alert':
        return '🚨';
      default:
        return '📝';
    }
  };

  const getInsightStyle = (type: SmartInsight['type'], clinicalRelevance: SmartInsight['clinical_relevance']) => {
    if (type === 'alert' || (type === 'concern' && clinicalRelevance === 'high')) {
      return 'insight-card insight-card--alert';
    }
    if (type === 'concern') {
      return 'insight-card insight-card--concern';
    }
    if (type === 'achievement') {
      return 'insight-card insight-card--achievement';
    }
    if (type === 'improvement') {
      return 'insight-card insight-card--improvement';
    }
    if (type === 'recommendation') {
      return 'insight-card insight-card--recommendation';
    }
    return 'insight-card insight-card--trend';
  };

  const getPriorityBadge = (priority: number, clinicalRelevance: SmartInsight['clinical_relevance']) => {
    if (priority >= 8 || clinicalRelevance === 'high') {
      return (
        <span className="priority-badge priority-badge--high">
          High Priority
        </span>
      );
    }
    if (priority >= 5) {
      return (
        <span className="priority-badge priority-badge--medium">
          Medium Priority
        </span>
      );
    }
    return (
      <span className="priority-badge priority-badge--low">
        Low Priority
      </span>
    );
  };

  if (loading) {
    return (
      <div className="smart-insights-container">
        <div className="insights-loading">
          <div className="loading-header">
            <div className="loading-icon loading-skeleton"></div>
            <div className="loading-title loading-skeleton"></div>
          </div>
          <div className="loading-cards">
            {[1, 2, 3].map((i) => (
              <div key={i} className="loading-card loading-skeleton"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="smart-insights-container">
        <div className="insights-error">
          <div className="error-icon">⚠️ Unable to load insights</div>
          <p className="error-text">{error}</p>
          <button
            onClick={loadInsights}
            className="retry-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!insights || insights.insights.length === 0) {
    return (
      <div className="smart-insights-container">
        <div className="insights-empty">
          <div className="empty-icon">🧠</div>
          <h3 className="empty-title">No insights available</h3>
          <p className="empty-text">We need more data to generate personalized insights.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="smart-insights-container">
      <div className="insights-header">
        <div className="insights-header-content">
          <div className="insights-icon">🧠</div>
          <div>
            <h2 className="insights-title">Smart Insights</h2>
            <p className="insights-subtitle">AI-powered therapy analysis and recommendations</p>
          </div>
        </div>
        <div className="insights-meta">
          <div className="insights-count">
            {insights.total_insights} insights generated
          </div>
          <div className="insights-timestamp">
            {new Date(insights.generated_at).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="insight-list">
        {insights.insights.map((insight, index) => (
          <div
            key={index}
            className={getInsightStyle(insight.type, insight.clinical_relevance)}
            onClick={() => setExpandedInsight(expandedInsight === index ? null : index)}
          >
            <div className="insight-content">
              <div className="insight-main">
                <div className="insight-header">
                  <span className="insight-type-icon">{getInsightIcon(insight.type)}</span>
                  <h3 className="insight-title">{insight.title}</h3>
                  {getPriorityBadge(insight.priority, insight.clinical_relevance)}
                </div>
                
                <p className="insight-message">{insight.message}</p>
                
                <div className="insight-footer">
                  <div className="insight-metadata">
                    <span className="confidence-indicator">
                      <div className={`indicator-dot indicator-dot--${
                        insight.confidence === 'high' ? 'high' :
                        insight.confidence === 'medium' ? 'medium' : 'low'
                      }`}></div>
                      {insight.confidence} confidence
                    </span>
                    <span className="relevance-indicator">
                      <div className={`indicator-dot relevance-dot--${
                        insight.clinical_relevance === 'high' ? 'high' :
                        insight.clinical_relevance === 'medium' ? 'medium' : 'low'
                      }`}></div>
                      {insight.clinical_relevance} clinical relevance
                    </span>
                  </div>
                  
                  {(insight.next_steps && insight.next_steps.length > 0) && (
                    <button className="expand-button">
                      {expandedInsight === index ? 'Hide details' : 'View recommendations'}
                      <svg 
                        className={`expand-icon ${expandedInsight === index ? 'expand-icon--expanded' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedInsight === index && insight.next_steps && insight.next_steps.length > 0 && (
              <div className="insight-details">
                <h4 className="details-title">
                  <svg className="details-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Recommended Actions
                </h4>
                <ul className="next-steps-list">
                  {insight.next_steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="next-step-item">
                      <div className="step-bullet"></div>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Upgrade Prompt for Advanced Insights */}
      <div className="upgrade-prompt">
        <div className="upgrade-content">
          <div className="upgrade-icon">✨</div>
          <div>
            <h3 className="upgrade-title">Unlock Advanced AI Insights</h3>
            <p className="upgrade-description">
              Get predictive analytics, trend forecasting, and clinical-grade recommendations
            </p>
          </div>
        </div>
        <button className="upgrade-button">
          Upgrade
        </button>
      </div>
    </div>
  );
};

export default SmartInsights;