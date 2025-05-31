import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

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
    const baseClasses = 'transform transition-all duration-200 hover:scale-[1.02] cursor-pointer';
    
    if (type === 'alert' || (type === 'concern' && clinicalRelevance === 'high')) {
      return `${baseClasses} bg-gradient-to-br from-red-50 to-red-100 border-l-4 border-red-500 hover:shadow-red-200`;
    }
    if (type === 'concern') {
      return `${baseClasses} bg-gradient-to-br from-amber-50 to-orange-100 border-l-4 border-amber-500 hover:shadow-amber-200`;
    }
    if (type === 'achievement') {
      return `${baseClasses} bg-gradient-to-br from-emerald-50 to-green-100 border-l-4 border-emerald-500 hover:shadow-emerald-200`;
    }
    if (type === 'improvement') {
      return `${baseClasses} bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-500 hover:shadow-blue-200`;
    }
    if (type === 'recommendation') {
      return `${baseClasses} bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-500 hover:shadow-purple-200`;
    }
    return `${baseClasses} bg-gradient-to-br from-slate-50 to-gray-100 border-l-4 border-slate-500 hover:shadow-slate-200`;
  };

  const getPriorityBadge = (priority: number, clinicalRelevance: SmartInsight['clinical_relevance']) => {
    if (priority >= 8 || clinicalRelevance === 'high') {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
          High Priority
        </span>
      );
    }
    if (priority >= 5) {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full">
          Medium Priority
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
        Low Priority
      </span>
    );
  };

  if (loading) {
    return (
      <div className="card p-6">
        <div className="animate-pulse">
          <div className="flex items-center mb-4">
            <div className="h-6 w-6 bg-slate-200 rounded mr-3"></div>
            <div className="h-6 bg-slate-200 rounded w-48"></div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-slate-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6">
        <div className="text-center">
          <div className="text-red-600 mb-2">⚠️ Unable to load insights</div>
          <p className="text-slate-600 text-sm">{error}</p>
          <button
            onClick={loadInsights}
            className="mt-3 btn btn-primary btn-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!insights || insights.insights.length === 0) {
    return (
      <div className="card p-6">
        <div className="text-center">
          <div className="text-slate-400 text-4xl mb-2">🧠</div>
          <h3 className="font-medium text-slate-700 mb-1">No insights available</h3>
          <p className="text-slate-500 text-sm">We need more data to generate personalized insights.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="text-2xl mr-3">🧠</div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Smart Insights</h2>
            <p className="text-sm text-slate-600">AI-powered therapy analysis and recommendations</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-500">
            {insights.total_insights} insights generated
          </div>
          <div className="text-xs text-slate-400">
            {new Date(insights.generated_at).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {insights.insights.map((insight, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg shadow-sm hover:shadow-md ${getInsightStyle(insight.type, insight.clinical_relevance)}`}
            onClick={() => setExpandedInsight(expandedInsight === index ? null : index)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className="text-xl mr-3">{getInsightIcon(insight.type)}</span>
                  <h3 className="font-medium text-slate-800 flex-1">{insight.title}</h3>
                  {getPriorityBadge(insight.priority, insight.clinical_relevance)}
                </div>
                
                <p className="text-slate-700 mb-3 leading-relaxed">{insight.message}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-xs text-slate-500">
                    <span className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-1 ${
                        insight.confidence === 'high' ? 'bg-green-500' :
                        insight.confidence === 'medium' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}></div>
                      {insight.confidence} confidence
                    </span>
                    <span className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-1 ${
                        insight.clinical_relevance === 'high' ? 'bg-red-500' :
                        insight.clinical_relevance === 'medium' ? 'bg-orange-500' : 'bg-blue-500'
                      }`}></div>
                      {insight.clinical_relevance} clinical relevance
                    </span>
                  </div>
                  
                  {(insight.next_steps && insight.next_steps.length > 0) && (
                    <button className="text-xs text-slate-600 hover:text-slate-800 flex items-center">
                      {expandedInsight === index ? 'Hide details' : 'View recommendations'}
                      <svg 
                        className={`w-3 h-3 ml-1 transform transition-transform ${expandedInsight === index ? 'rotate-180' : ''}`}
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
              <div className="mt-4 pt-4 border-t border-white/50">
                <h4 className="font-medium text-slate-700 mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Recommended Actions
                </h4>
                <ul className="space-y-2">
                  {insight.next_steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex items-start text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
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
      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-indigo-600 mr-3">✨</div>
            <div>
              <h3 className="text-sm font-medium text-indigo-800">Unlock Advanced AI Insights</h3>
              <p className="text-xs text-indigo-700 mt-1">
                Get predictive analytics, trend forecasting, and clinical-grade recommendations
              </p>
            </div>
          </div>
          <button className="btn btn-primary btn-sm bg-indigo-600 hover:bg-indigo-700">
            Upgrade
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartInsights;