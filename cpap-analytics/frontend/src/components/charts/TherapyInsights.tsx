import React, { useMemo } from 'react';
import { TrendData, Session } from '../../types';

interface TherapyInsightsProps {
  data: TrendData[];
  recentSessions: Session[];
  title?: string;
}

interface Insight {
  type: 'success' | 'warning' | 'error' | 'info';
  icon: string;
  title: string;
  description: string;
  action?: string;
}

const TherapyInsights: React.FC<TherapyInsightsProps> = ({ 
  data, 
  recentSessions,
  title = "Therapy Insights & Recommendations" 
}) => {
  const insights = useMemo(() => {
    const insights: Insight[] = [];
    
    if (!data || data.length === 0) return insights;

    // Calculate metrics
    const recent7Days = data.slice(-7);
    const recent30Days = data;
    
    const avgAHI30 = recent30Days.reduce((sum, d) => sum + d.ahi, 0) / recent30Days.length;
    const avgAHI7 = recent7Days.reduce((sum, d) => sum + d.ahi, 0) / recent7Days.length;
    const avgQuality30 = recent30Days.reduce((sum, d) => sum + d.quality_score, 0) / recent30Days.length;
    const avgDuration30 = recent30Days.reduce((sum, d) => sum + d.duration_hours, 0) / recent30Days.length;
    
    // AHI trend analysis
    if (avgAHI7 < avgAHI30 * 0.8) {
      insights.push({
        type: 'success',
        icon: '📈',
        title: 'AHI Improving',
        description: `Your AHI has improved by ${Math.round((avgAHI30 - avgAHI7) * 10) / 10} events/hr this week!`,
        action: 'Keep up your current routine and sleep habits.'
      });
    } else if (avgAHI7 > avgAHI30 * 1.2) {
      insights.push({
        type: 'warning',
        icon: '⚠️',
        title: 'AHI Trending Up',
        description: `Your AHI has increased by ${Math.round((avgAHI7 - avgAHI30) * 10) / 10} events/hr this week.`,
        action: 'Check mask fit, clean equipment, and review sleep position.'
      });
    }

    // Quality analysis
    if (avgQuality30 >= 85) {
      insights.push({
        type: 'success',
        icon: '✨',
        title: 'Excellent Therapy Quality',
        description: `Your average quality score is ${Math.round(avgQuality30)}% - outstanding!`,
        action: 'Share these results with your sleep specialist.'
      });
    } else if (avgQuality30 < 60) {
      insights.push({
        type: 'error',
        icon: '🔴',
        title: 'Quality Needs Attention',
        description: `Quality score is ${Math.round(avgQuality30)}% - below optimal range.`,
        action: 'Schedule appointment with sleep specialist to review therapy settings.'
      });
    }

    // Duration compliance
    const complianceRate = recent30Days.filter(d => d.duration_hours >= 4).length / recent30Days.length;
    if (complianceRate >= 0.7) {
      insights.push({
        type: 'success',
        icon: '🏆',
        title: 'Insurance Compliant',
        description: `You’re using CPAP ${Math.round(complianceRate * 100)}% of nights (>4hrs).`,
        action: 'Great job! This meets insurance requirements.'
      });
    } else {
      insights.push({
        type: 'warning',
        icon: '📊',
        title: 'Compliance Below Target',
        description: `Only ${Math.round(complianceRate * 100)}% compliance. Target: 70%+ nights.`,
        action: 'Aim for 4+ hours nightly to maintain insurance coverage.'
      });
    }

    // Mask leak analysis from recent sessions
    if (recentSessions && recentSessions.length > 0) {
      const avgLeak = recentSessions.reduce((sum, s) => sum + s.mask_leak, 0) / recentSessions.length;
      if (avgLeak > 24) {
        insights.push({
          type: 'warning',
          icon: '😷',
          title: 'High Mask Leak Detected',
          description: `Average leak: ${Math.round(avgLeak)} L/min (target: <24 L/min).`,
          action: 'Check mask fit, replace cushions, or try different mask size.'
        });
      } else if (avgLeak < 10) {
        insights.push({
          type: 'success',
          icon: '😊',
          title: 'Excellent Mask Seal',
          description: `Low average leak of ${Math.round(avgLeak)} L/min - great fit!`,
          action: 'Your current mask setup is working well.'
        });
      }
    }

    // Consistency analysis
    const durationVariance = recent30Days.reduce((variance, d) => variance + Math.pow(d.duration_hours - avgDuration30, 2), 0) / recent30Days.length;
    if (durationVariance < 1) {
      insights.push({
        type: 'info',
        icon: '🕑',
        title: 'Consistent Sleep Schedule',
        description: 'Your sleep duration is very consistent night to night.',
        action: 'Excellent routine! Consistency improves therapy effectiveness.'
      });
    }

    return insights;
  }, [data, recentSessions]);

  const getInsightStyle = (type: Insight['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <p className="mt-2 text-sm text-gray-500">No insights available yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-6">{title}</h3>
      
      {insights.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Keep tracking your therapy for personalized insights!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div 
              key={index}
              className={`p-4 border rounded-lg ${getInsightStyle(insight.type)}`}
            >
              <div className="flex items-start space-x-3">
                <span className="text-2xl flex-shrink-0 mt-0.5">{insight.icon}</span>
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1">{insight.title}</h4>
                  <p className="text-sm mb-2 opacity-90">{insight.description}</p>
                  {insight.action && (
                    <p className="text-xs font-medium opacity-75">
                      💡 Action: {insight.action}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Stats Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Stats (Last 30 Days)</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {data.length}
            </p>
            <p className="text-xs text-gray-500">Nights Tracked</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {Math.round((data.filter(d => d.ahi < 5).length / data.length) * 100)}%
            </p>
            <p className="text-xs text-gray-500">Optimal AHI</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {Math.round((data.filter(d => d.quality_score >= 80).length / data.length) * 100)}%
            </p>
            <p className="text-xs text-gray-500">High Quality</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">
              {Math.round((data.filter(d => d.duration_hours >= 7).length / data.length) * 100)}%
            </p>
            <p className="text-xs text-gray-500">7+ Hours</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapyInsights;