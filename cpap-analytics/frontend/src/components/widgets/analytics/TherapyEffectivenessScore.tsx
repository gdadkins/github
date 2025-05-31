import React, { useMemo } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './TherapyEffectivenessScore.css';

interface TherapyEffectivenessProps {
  data: {
    ahi: number;
    compliance: number;
    leakRate: number;
    usageHours: number;
    pressure: number;
    events: {
      central: number;
      obstructive: number;
      hypopnea: number;
    };
  };
  historicalData?: any[];
}

const TherapyEffectivenessScore: React.FC<TherapyEffectivenessProps> = ({ data, historicalData }) => {
  const calculateScore = useMemo(() => {
    // AHI Score (40% weight)
    const ahiScore = Math.max(0, 100 - (data.ahi * 5));
    
    // Compliance Score (30% weight)
    const complianceScore = data.compliance;
    
    // Leak Management Score (20% weight)
    const leakScore = data.leakRate < 20 ? 100 : 
                      data.leakRate < 40 ? 80 :
                      data.leakRate < 60 ? 60 :
                      data.leakRate < 80 ? 40 : 20;
    
    // Sleep Quality Score (10% weight)
    const qualityScore = data.usageHours >= 7 ? 100 :
                        data.usageHours >= 6 ? 85 :
                        data.usageHours >= 4 ? 70 : 50;
    
    // Calculate weighted score
    const overallScore = Math.round(
      (ahiScore * 0.4) +
      (complianceScore * 0.3) +
      (leakScore * 0.2) +
      (qualityScore * 0.1)
    );

    return {
      overall: overallScore,
      components: {
        ahiControl: ahiScore,
        compliance: complianceScore,
        leakManagement: leakScore,
        sleepQuality: qualityScore
      }
    };
  }, [data]);

  const getTrend = useMemo(() => {
    if (!historicalData || historicalData.length < 7) return 'stable';
    
    const recentScores = historicalData.slice(-7).map(d => {
      const ahiScore = Math.max(0, 100 - (d.ahi * 5));
      const compScore = d.compliance || 0;
      return (ahiScore * 0.4) + (compScore * 0.3) + 50; // Simplified calculation
    });
    
    const avgRecent = recentScores.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const avgPrevious = recentScores.slice(0, 4).reduce((a, b) => a + b, 0) / 4;
    
    if (avgRecent > avgPrevious + 5) return 'improving';
    if (avgRecent < avgPrevious - 5) return 'declining';
    return 'stable';
  }, [historicalData]);

  const getRecommendations = useMemo(() => {
    const recommendations = [];
    
    if (calculateScore.components.ahiControl < 70) {
      recommendations.push('Consider consulting your physician about pressure adjustments');
    }
    if (calculateScore.components.compliance < 70) {
      recommendations.push('Try to use your CPAP for at least 4 hours each night');
    }
    if (calculateScore.components.leakManagement < 70) {
      recommendations.push('Check your mask fit - high leak rates reduce therapy effectiveness');
    }
    if (calculateScore.components.sleepQuality < 70) {
      recommendations.push('Aim for 7-8 hours of sleep for optimal health benefits');
    }
    
    return recommendations;
  }, [calculateScore]);

  const getScoreColor = (score: number) => {
    if (score >= 85) return '#10b981';
    if (score >= 70) return '#3b82f6';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const trend = getTrend;

  return (
    <div className="therapy-effectiveness-widget">
      <div className="widget-header">
        <h3 className="widget-title">Therapy Effectiveness Score</h3>
        <div className={`trend-indicator ${trend}`}>
          {trend === 'improving' && '📈 Improving'}
          {trend === 'stable' && '➡️ Stable'}
          {trend === 'declining' && '📉 Declining'}
        </div>
      </div>

      <div className="score-container">
        <div className="main-score">
          <CircularProgressbar
            value={calculateScore.overall}
            text={`${calculateScore.overall}`}
            styles={buildStyles({
              textSize: '28px',
              pathColor: getScoreColor(calculateScore.overall),
              textColor: '#1f2937',
              trailColor: '#e5e7eb',
              backgroundColor: '#f9fafb',
            })}
          />
          <p className="score-label">Overall Score</p>
          <p className="score-description">
            {calculateScore.overall >= 85 ? 'Excellent therapy effectiveness' :
             calculateScore.overall >= 70 ? 'Good therapy effectiveness' :
             calculateScore.overall >= 50 ? 'Moderate effectiveness - improvements possible' :
             'Low effectiveness - consultation recommended'}
          </p>
        </div>

        <div className="component-scores">
          <h4 className="components-title">Score Components</h4>
          
          <div className="component-item">
            <div className="component-header">
              <span className="component-name">AHI Control</span>
              <span className="component-value">{calculateScore.components.ahiControl}%</span>
            </div>
            <div className="component-bar">
              <div 
                className="component-fill"
                style={{ 
                  width: `${calculateScore.components.ahiControl}%`,
                  backgroundColor: getScoreColor(calculateScore.components.ahiControl)
                }}
              />
            </div>
          </div>

          <div className="component-item">
            <div className="component-header">
              <span className="component-name">Compliance</span>
              <span className="component-value">{calculateScore.components.compliance}%</span>
            </div>
            <div className="component-bar">
              <div 
                className="component-fill"
                style={{ 
                  width: `${calculateScore.components.compliance}%`,
                  backgroundColor: getScoreColor(calculateScore.components.compliance)
                }}
              />
            </div>
          </div>

          <div className="component-item">
            <div className="component-header">
              <span className="component-name">Leak Management</span>
              <span className="component-value">{calculateScore.components.leakManagement}%</span>
            </div>
            <div className="component-bar">
              <div 
                className="component-fill"
                style={{ 
                  width: `${calculateScore.components.leakManagement}%`,
                  backgroundColor: getScoreColor(calculateScore.components.leakManagement)
                }}
              />
            </div>
          </div>

          <div className="component-item">
            <div className="component-header">
              <span className="component-name">Sleep Quality</span>
              <span className="component-value">{calculateScore.components.sleepQuality}%</span>
            </div>
            <div className="component-bar">
              <div 
                className="component-fill"
                style={{ 
                  width: `${calculateScore.components.sleepQuality}%`,
                  backgroundColor: getScoreColor(calculateScore.components.sleepQuality)
                }}
              />
            </div>
          </div>
        </div>

        {getRecommendations.length > 0 && (
          <div className="recommendations-section">
            <h4 className="recommendations-title">Recommendations</h4>
            <ul className="recommendations-list">
              {getRecommendations.map((rec, index) => (
                <li key={index} className="recommendation-item">
                  <span className="recommendation-icon">💡</span>
                  <span className="recommendation-text">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="widget-footer">
        <button className="detail-button">View Detailed Analysis</button>
        <button className="share-button">Share with Provider</button>
      </div>
    </div>
  );
};

export default TherapyEffectivenessScore;