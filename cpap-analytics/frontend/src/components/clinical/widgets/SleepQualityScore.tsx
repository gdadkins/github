import React from 'react';
import './SleepQualityScore.css';

interface SleepQualityScoreProps {
  data?: any;
}

const SleepQualityScore: React.FC<SleepQualityScoreProps> = ({ data }) => {
  // Calculate sleep quality score based on multiple factors
  const calculateQualityScore = () => {
    if (!data?.summary) {
      return { score: 0, rating: 'Unknown', color: 'var(--text-tertiary)' };
    }

    const { avgAHI, avgUsageHours, complianceRate } = data.summary;
    
    // Score calculation:
    // AHI component (40% weight): Lower is better
    let ahiScore = 0;
    if (avgAHI < 5) ahiScore = 100;
    else if (avgAHI < 15) ahiScore = 75;
    else if (avgAHI < 30) ahiScore = 50;
    else ahiScore = 25;
    
    // Usage hours component (30% weight): Higher is better
    let usageScore = Math.min((avgUsageHours / 8) * 100, 100);
    
    // Compliance component (30% weight)
    let complianceScore = complianceRate;
    
    // Calculate weighted score
    const totalScore = Math.round(
      (ahiScore * 0.4) + (usageScore * 0.3) + (complianceScore * 0.3)
    );
    
    // Determine rating and color
    let rating, color;
    if (totalScore >= 90) {
      rating = 'Excellent';
      color = 'var(--status-optimal)';
    } else if (totalScore >= 75) {
      rating = 'Good';
      color = 'var(--status-good)';
    } else if (totalScore >= 60) {
      rating = 'Fair';
      color = 'var(--status-warning)';
    } else {
      rating = 'Poor';
      color = 'var(--status-critical)';
    }
    
    return { score: totalScore, rating, color };
  };

  const { score, rating, color } = calculateQualityScore();
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="sleep-quality-score clinical-card">
      <div className="widget-header">
        <h3 className="widget-title">Sleep Quality Score</h3>
        <span className="quality-rating" style={{ color }}>{rating}</span>
      </div>
      
      <div className="score-display">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="var(--clinical-border-light)"
            strokeWidth="10"
          />
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 60 60)"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className="score-text">
          <div className="score-value">{score}</div>
          <div className="score-label">out of 100</div>
        </div>
      </div>

      <div className="score-breakdown">
        <div className="breakdown-item">
          <span className="breakdown-label">AHI Score</span>
          <span className="breakdown-value">{data?.summary?.avgAHI?.toFixed(1) || '—'}</span>
        </div>
        <div className="breakdown-item">
          <span className="breakdown-label">Avg Usage</span>
          <span className="breakdown-value">{data?.summary?.avgUsageHours?.toFixed(1) || '—'}h</span>
        </div>
        <div className="breakdown-item">
          <span className="breakdown-label">Compliance</span>
          <span className="breakdown-value">{data?.summary?.complianceRate || 0}%</span>
        </div>
      </div>

      <div className="quality-tips">
        <h4>Tips to Improve</h4>
        {score < 90 && (
          <ul>
            {data?.summary?.avgAHI > 5 && <li>Work on reducing AHI events</li>}
            {data?.summary?.avgUsageHours < 7 && <li>Try to use CPAP for 7+ hours</li>}
            {data?.summary?.complianceRate < 90 && <li>Improve nightly compliance</li>}
          </ul>
        )}
        {score >= 90 && <p>Keep up the excellent work!</p>}
      </div>
    </div>
  );
};

export default SleepQualityScore;