import React from 'react';
import './ComplianceTracker.css';

interface ComplianceTrackerProps {
  data: any;
  dateRange: number;
}

const ComplianceTracker: React.FC<ComplianceTrackerProps> = ({ data, dateRange }) => {
  // Calculate compliance metrics
  const calculateCompliance = () => {
    if (!data?.trends || data.trends.length === 0) {
      return {
        overall: 0,
        current30Day: 0,
        current90Day: 0,
        medicare: 0,
        daysCompliant: 0,
        totalDays: 0,
        streak: 0,
      };
    }

    const relevantDays = data.trends.slice(-dateRange);
    const compliantDays = relevantDays.filter((day: any) => day.usageHours >= 4).length;
    const totalDays = relevantDays.length;
    const complianceRate = totalDays > 0 ? (compliantDays / totalDays) * 100 : 0;

    // Calculate current streak
    let streak = 0;
    for (let i = relevantDays.length - 1; i >= 0; i--) {
      if (relevantDays[i].usageHours >= 4) {
        streak++;
      } else {
        break;
      }
    }

    // Medicare compliance (70% of nights with 4+ hours in 30-day period)
    const last30Days = data.trends.slice(-30);
    const medicare30Day = last30Days.filter((day: any) => day.usageHours >= 4).length;
    const medicareCompliance = (medicare30Day / 30) * 100;

    return {
      overall: Math.round(complianceRate),
      current30Day: Math.round(medicareCompliance),
      current90Day: Math.round(complianceRate), // Would calculate 90-day separately
      medicare: medicareCompliance >= 70,
      daysCompliant: compliantDays,
      totalDays,
      streak,
    };
  };

  const compliance = calculateCompliance();
  
  const getComplianceStatus = (rate: number) => {
    if (rate >= 90) return { label: 'Excellent', color: 'var(--compliance-excellent)' };
    if (rate >= 70) return { label: 'Good', color: 'var(--compliance-good)' };
    if (rate >= 50) return { label: 'Fair', color: 'var(--compliance-fair)' };
    return { label: 'Poor', color: 'var(--compliance-poor)' };
  };

  const status = getComplianceStatus(compliance.overall);

  return (
    <div className="compliance-tracker clinical-card">
      <div className="widget-header">
        <h3 className="widget-title">Compliance Tracker</h3>
        <span className="compliance-badge" style={{ backgroundColor: status.color }}>
          {status.label}
        </span>
      </div>

      <div className="compliance-main">
        <div className="compliance-percentage">
          <span className="percentage-value">{compliance.overall}</span>
          <span className="percentage-symbol">%</span>
        </div>
        <div className="compliance-details">
          <p className="compliance-text">
            {compliance.daysCompliant} of {compliance.totalDays} nights compliant
          </p>
          <p className="streak-text">
            Current streak: <strong>{compliance.streak} nights</strong>
          </p>
        </div>
      </div>

      <div className="compliance-bar-container">
        <div className="compliance-bar">
          <div 
            className={`compliance-fill ${status.label.toLowerCase()}`}
            style={{ width: `${compliance.overall}%` }}
          />
        </div>
        <div className="compliance-markers">
          <div className="marker" style={{ left: '70%' }}>
            <span className="marker-label">Medicare</span>
          </div>
          <div className="marker" style={{ left: '90%' }}>
            <span className="marker-label">Excellent</span>
          </div>
        </div>
      </div>

      <div className="insurance-status">
        <div className="status-row">
          <span className="status-label">Medicare Compliance (30-day)</span>
          <span className={`status-value ${compliance.medicare ? 'met' : 'not-met'}`}>
            {compliance.medicare ? 'Met' : 'Not Met'} ({compliance.current30Day}%)
          </span>
        </div>
        <div className="status-row">
          <span className="status-label">Insurance Requirement</span>
          <span className={`status-value ${compliance.overall >= 70 ? 'met' : 'not-met'}`}>
            {compliance.overall >= 70 ? 'Met' : 'At Risk'}
          </span>
        </div>
      </div>

      <div className="compliance-tips">
        <h4 className="tips-title">Tips to Improve</h4>
        {compliance.overall < 90 && (
          <ul className="tips-list">
            <li>Set a consistent bedtime routine</li>
            <li>Ensure mask comfort before sleep</li>
            <li>Use humidification if experiencing dryness</li>
          </ul>
        )}
        {compliance.overall >= 90 && (
          <p className="tips-excellent">Excellent compliance! Keep up the great work.</p>
        )}
      </div>
    </div>
  );
};

export default ComplianceTracker;