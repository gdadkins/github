import React from 'react';
import './InsuranceCompliance.css';

interface InsuranceComplianceProps {
  data: any;
}

const InsuranceCompliance: React.FC<InsuranceComplianceProps> = ({ data }) => {
  // Calculate insurance-specific compliance windows
  const calculateInsuranceMetrics = () => {
    if (!data?.trends || data.trends.length === 0) {
      return {
        medicare30: { compliant: 0, required: 21, percentage: 0 },
        medicare90: { compliant: 0, required: 63, percentage: 0 },
        commercial30: { compliant: 0, required: 21, percentage: 0 },
        daysUntilReview: 30,
        atRisk: false,
      };
    }

    // Medicare: 70% of nights with 4+ hours
    const last30 = data.trends.slice(-30);
    const last90 = data.trends.slice(-90);
    
    const compliant30 = last30.filter((day: any) => day.usageHours >= 4).length;
    const compliant90 = last90.filter((day: any) => day.usageHours >= 4).length;
    
    const medicare30 = {
      compliant: compliant30,
      required: 21, // 70% of 30 days
      percentage: (compliant30 / 30) * 100
    };
    
    const medicare90 = {
      compliant: compliant90,
      required: 63, // 70% of 90 days
      percentage: (compliant90 / 90) * 100
    };

    // Calculate days until next review
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + 30);
    const daysUntilReview = 30 - (compliant30 < 21 ? 30 - compliant30 : 0);

    return {
      medicare30,
      medicare90,
      commercial30: medicare30, // Same as Medicare for most commercial plans
      daysUntilReview,
      atRisk: medicare30.percentage < 70,
    };
  };

  const metrics = calculateInsuranceMetrics();
  
  const getComplianceColor = (percentage: number) => {
    if (percentage >= 70) return 'var(--status-optimal)';
    if (percentage >= 60) return 'var(--status-warning)';
    return 'var(--status-critical)';
  };

  return (
    <div className="insurance-compliance clinical-card">
      <div className="widget-header">
        <h3 className="widget-title">Insurance Requirements</h3>
        {metrics.atRisk && (
          <span className="risk-badge">At Risk</span>
        )}
      </div>

      <div className="compliance-windows">
        {/* 30-Day Window */}
        <div className="window-card">
          <div className="window-header">
            <span className="window-title">30-Day Window</span>
            <span 
              className="window-status"
              style={{ color: getComplianceColor(metrics.medicare30.percentage) }}
            >
              {metrics.medicare30.percentage >= 70 ? 'Compliant' : 'Non-Compliant'}
            </span>
          </div>
          
          <div className="window-metrics">
            <div className="metric-row">
              <span className="metric-label">Nights Used (≥4hrs)</span>
              <span className="metric-value">
                {metrics.medicare30.compliant} / 30
              </span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Required for Medicare</span>
              <span className="metric-value">≥21 nights (70%)</span>
            </div>
          </div>

          <div className="compliance-visual">
            <div className="visual-bar">
              <div 
                className="visual-fill"
                style={{ 
                  width: `${(metrics.medicare30.compliant / 30) * 100}%`,
                  backgroundColor: getComplianceColor(metrics.medicare30.percentage)
                }}
              />
              <div className="requirement-marker" style={{ left: '70%' }}>
                <span className="marker-line"></span>
              </div>
            </div>
            <div className="visual-labels">
              <span>0</span>
              <span>Medicare Minimum (70%)</span>
              <span>30</span>
            </div>
          </div>
        </div>

        {/* 90-Day Window */}
        <div className="window-card">
          <div className="window-header">
            <span className="window-title">90-Day Window</span>
            <span 
              className="window-status"
              style={{ color: getComplianceColor(metrics.medicare90.percentage) }}
            >
              {metrics.medicare90.percentage >= 70 ? 'Compliant' : 'Non-Compliant'}
            </span>
          </div>
          
          <div className="window-metrics">
            <div className="metric-row">
              <span className="metric-label">Nights Used (≥4hrs)</span>
              <span className="metric-value">
                {metrics.medicare90.compliant} / 90
              </span>
            </div>
            <div className="metric-row">
              <span className="metric-label">Compliance Rate</span>
              <span className="metric-value">{metrics.medicare90.percentage.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Items */}
      {metrics.atRisk && (
        <div className="risk-alert">
          <div className="alert-icon">⚠️</div>
          <div className="alert-content">
            <h4>Action Required</h4>
            <p>You need {21 - metrics.medicare30.compliant} more compliant nights in the next {metrics.daysUntilReview} days to maintain coverage.</p>
          </div>
        </div>
      )}

      <div className="insurance-info">
        <h4 className="info-title">Coverage Details</h4>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Insurance Type</span>
            <span className="info-value">Medicare DME</span>
          </div>
          <div className="info-item">
            <span className="info-label">Next Review</span>
            <span className="info-value">In {metrics.daysUntilReview} days</span>
          </div>
          <div className="info-item">
            <span className="info-label">Equipment Status</span>
            <span className="info-value">Rental Period</span>
          </div>
        </div>
      </div>

      <button className="btn-clinical btn-secondary full-width">
        Download Compliance Report
      </button>
    </div>
  );
};

export default InsuranceCompliance;