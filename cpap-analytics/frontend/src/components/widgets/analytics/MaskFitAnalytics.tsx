import React, { useMemo, useState } from 'react';
import { Line, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts';
import './MaskFitAnalytics.css';

interface MaskFitAnalyticsProps {
  currentSession?: {
    leakRate: number;
    duration: number;
    pressure: number;
  };
  recentSessions: Array<{
    date: string;
    leakRate: number;
    duration: number;
    events: number;
  }>;
  maskInfo: {
    type: string;
    model: string;
    size: string;
    purchaseDate: string;
    usageHours: number;
  };
}

const MaskFitAnalytics: React.FC<MaskFitAnalyticsProps> = ({ currentSession, recentSessions, maskInfo }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [showDetails, setShowDetails] = useState(false);

  const filteredSessions = useMemo(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    return recentSessions
      .filter(session => new Date(session.date) >= cutoff)
      .map(session => ({
        ...session,
        displayDate: new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }));
  }, [recentSessions, timeRange]);

  const maskFitScore = useMemo(() => {
    const avgLeakRate = filteredSessions.reduce((sum, s) => sum + s.leakRate, 0) / filteredSessions.length || 0;
    
    if (avgLeakRate < 20) return 100;
    if (avgLeakRate < 30) return 90;
    if (avgLeakRate < 40) return 80;
    if (avgLeakRate < 50) return 70;
    if (avgLeakRate < 60) return 60;
    return Math.max(20, 100 - avgLeakRate);
  }, [filteredSessions]);

  const leakPatterns = useMemo(() => {
    const patterns = {
      earlyNight: 0,
      midNight: 0,
      lateNight: 0,
      consistent: 0,
      variable: 0
    };

    // Analyze leak patterns (simplified for demo)
    filteredSessions.forEach(session => {
      if (session.leakRate > 40) {
        patterns.variable++;
      } else if (session.leakRate < 20) {
        patterns.consistent++;
      }
    });

    return patterns;
  }, [filteredSessions]);

  const getRecommendations = useMemo(() => {
    const recommendations = [];
    const avgLeakRate = filteredSessions.reduce((sum, s) => sum + s.leakRate, 0) / filteredSessions.length || 0;
    
    if (avgLeakRate > 60) {
      recommendations.push({
        priority: 'high',
        icon: '🚨',
        text: 'High leak rate detected. Schedule a mask fitting appointment.',
        action: 'Schedule Appointment'
      });
    }
    
    if (avgLeakRate > 40) {
      recommendations.push({
        priority: 'medium',
        icon: '⚠️',
        text: 'Moderate leaks may reduce therapy effectiveness.',
        action: 'View Fitting Guide'
      });
    }

    if (maskInfo.usageHours > 1500) {
      recommendations.push({
        priority: 'medium',
        icon: '🔄',
        text: 'Your mask has been used for over 1500 hours. Consider replacement.',
        action: 'Shop Masks'
      });
    }

    const monthsSincePurchase = (new Date().getTime() - new Date(maskInfo.purchaseDate).getTime()) / (1000 * 60 * 60 * 24 * 30);
    if (monthsSincePurchase > 6) {
      recommendations.push({
        priority: 'low',
        icon: '📅',
        text: 'Mask cushions should be replaced every 3-6 months for optimal seal.',
        action: 'Order Cushions'
      });
    }

    if (leakPatterns.variable > leakPatterns.consistent) {
      recommendations.push({
        priority: 'medium',
        icon: '📊',
        text: 'Leak rates vary significantly. This may indicate positioning issues.',
        action: 'Watch Tutorial'
      });
    }

    return recommendations;
  }, [filteredSessions, maskInfo, leakPatterns]);

  const maskTypeRecommendations: Record<string, string[]> = {
    'nasal': ['Ensure nose bridge is properly sealed', 'Check for mouth breathing'],
    'full-face': ['Adjust lower straps first', 'Check chin support'],
    'nasal-pillow': ['Select correct pillow size', 'Avoid over-tightening'],
    'hybrid': ['Balance seal between nose and mouth', 'Check all connection points']
  };

  return (
    <div className="mask-fit-analytics-widget">
      <div className="widget-header">
        <div className="header-content">
          <h3 className="widget-title">Mask Fit Analytics</h3>
          <p className="widget-subtitle">Optimize your mask seal for better therapy</p>
        </div>
        <div className="time-selector">
          {(['7d', '30d', '90d'] as const).map(range => (
            <button
              key={range}
              className={`time-button ${timeRange === range ? 'active' : ''}`}
              onClick={() => setTimeRange(range)}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      <div className="fit-score-section">
        <div className="score-circle">
          <svg viewBox="0 0 200 200" className="score-svg">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="12"
            />
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke={maskFitScore >= 80 ? '#10b981' : maskFitScore >= 60 ? '#f59e0b' : '#ef4444'}
              strokeWidth="12"
              strokeDasharray={`${(maskFitScore / 100) * 565.48} 565.48`}
              transform="rotate(-90 100 100)"
              className="score-circle-fill"
            />
            <text x="100" y="90" textAnchor="middle" className="score-text">
              {maskFitScore}
            </text>
            <text x="100" y="120" textAnchor="middle" className="score-label">
              Fit Score
            </text>
          </svg>
        </div>

        <div className="mask-info">
          <h4 className="info-title">Current Mask</h4>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Type:</span>
              <span className="info-value">{maskInfo.type}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Model:</span>
              <span className="info-value">{maskInfo.model}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Size:</span>
              <span className="info-value">{maskInfo.size}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Usage:</span>
              <span className="info-value">{maskInfo.usageHours} hours</span>
            </div>
          </div>
        </div>
      </div>

      <div className="leak-chart-section">
        <h4 className="section-title">Leak Rate Trends</h4>
        <ResponsiveContainer width="100%" height={250}>
          <ComposedChart data={filteredSessions}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="displayDate" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              label={{ value: 'Leak Rate (L/min)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Area
              type="monotone"
              dataKey="leakRate"
              fill="#3b82f6"
              fillOpacity={0.1}
              stroke="#3b82f6"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="leakRate"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              y={24}
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Target"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {currentSession && (
        <div className="current-session-alert">
          <div className="alert-icon">
            {currentSession.leakRate < 24 ? '✅' : currentSession.leakRate < 40 ? '⚠️' : '🚨'}
          </div>
          <div className="alert-content">
            <h5 className="alert-title">Current Session</h5>
            <p className="alert-text">
              Leak rate: {currentSession.leakRate} L/min 
              {currentSession.leakRate < 24 ? ' - Excellent seal' : 
               currentSession.leakRate < 40 ? ' - Moderate leak detected' : 
               ' - High leak affecting therapy'}
            </p>
          </div>
        </div>
      )}

      {getRecommendations.length > 0 && (
        <div className="recommendations-section">
          <h4 className="section-title">Recommendations</h4>
          <div className="recommendations-list">
            {getRecommendations.map((rec, index) => (
              <div key={index} className={`recommendation-card ${rec.priority}`}>
                <div className="rec-icon">{rec.icon}</div>
                <div className="rec-content">
                  <p className="rec-text">{rec.text}</p>
                  <button className="rec-action">{rec.action}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="fitting-tips">
        <button 
          className="tips-toggle"
          onClick={() => setShowDetails(!showDetails)}
        >
          <span>Fitting Tips for {maskInfo.type} Masks</span>
          <span className={`toggle-icon ${showDetails ? 'open' : ''}`}>▼</span>
        </button>
        
        {showDetails && (
          <div className="tips-content">
            {maskTypeRecommendations[maskInfo.type.toLowerCase().replace(' ', '-')] ? (
              <ul className="tips-list">
                {maskTypeRecommendations[maskInfo.type.toLowerCase().replace(' ', '-')].map((tip: string, index: number) => (
                  <li key={index} className="tip-item">
                    <span className="tip-bullet">•</span>
                    <span className="tip-text">{tip}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>General tips: Ensure straps are snug but not tight, clean mask daily.</p>
            )}
            <div className="tips-actions">
              <button className="tips-button">Watch Video Guide</button>
              <button className="tips-button secondary">Download Fitting Guide</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaskFitAnalytics;