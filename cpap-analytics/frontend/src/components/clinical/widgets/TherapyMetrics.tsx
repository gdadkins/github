import React from 'react';
import './TherapyMetrics.css';

interface TherapyMetricsProps {
  data: any;
}

const TherapyMetrics: React.FC<TherapyMetricsProps> = ({ data }) => {
  // Calculate key therapy metrics
  const getLatestMetrics = () => {
    if (!data?.trends || data.trends.length === 0) {
      return {
        ahi: 0,
        pressure: 0,
        leakRate: 0,
        usageHours: 0,
        events: { central: 0, obstructive: 0, hypopnea: 0 }
      };
    }
    return data.trends[data.trends.length - 1];
  };

  const getAverageMetrics = () => {
    if (!data?.trends || data.trends.length === 0) {
      return { avgAHI: 0, avgPressure: 0, avgLeak: 0 };
    }
    
    const sum = data.trends.reduce((acc: any, day: any) => ({
      ahi: acc.ahi + day.ahi,
      pressure: acc.pressure + day.pressure,
      leak: acc.leak + day.leakRate
    }), { ahi: 0, pressure: 0, leak: 0 });

    const count = data.trends.length;
    return {
      avgAHI: (sum.ahi / count).toFixed(1),
      avgPressure: (sum.pressure / count).toFixed(1),
      avgLeak: (sum.leak / count).toFixed(1)
    };
  };

  const latest = getLatestMetrics();
  const averages = getAverageMetrics();

  const getAHIStatus = (ahi: number) => {
    if (ahi < 5) return { label: 'Normal', color: 'var(--status-optimal)' };
    if (ahi < 15) return { label: 'Mild', color: 'var(--status-good)' };
    if (ahi < 30) return { label: 'Moderate', color: 'var(--status-warning)' };
    return { label: 'Severe', color: 'var(--status-critical)' };
  };

  const getLeakStatus = (leak: number) => {
    if (leak < 24) return { label: 'Good Seal', color: 'var(--status-optimal)' };
    if (leak < 40) return { label: 'Minor Leak', color: 'var(--status-warning)' };
    return { label: 'Major Leak', color: 'var(--status-critical)' };
  };

  const ahiStatus = getAHIStatus(latest.ahi);
  const leakStatus = getLeakStatus(latest.leakRate);

  return (
    <div className="therapy-metrics clinical-card">
      <div className="widget-header">
        <h3 className="widget-title">Therapy Metrics</h3>
        <span className="last-updated">Last night</span>
      </div>

      <div className="metrics-grid">
        {/* AHI Metric */}
        <div className="metric-item primary">
          <div className="metric-header">
            <span className="metric-label">AHI</span>
            <span className="metric-status" style={{ color: ahiStatus.color }}>
              {ahiStatus.label}
            </span>
          </div>
          <div className="metric-value-container">
            <span className="metric-value">{latest.ahi.toFixed(1)}</span>
            <span className="metric-unit">events/hr</span>
          </div>
          <div className="metric-comparison">
            <span className="comparison-label">30-day avg:</span>
            <span className="comparison-value">{averages.avgAHI}</span>
          </div>
          <div className="metric-target">
            <span className="target-label">Target: {'<'}5.0</span>
            <div className="target-progress">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${Math.min((5 / latest.ahi) * 100, 100)}%`,
                  backgroundColor: ahiStatus.color
                }}
              />
            </div>
          </div>
        </div>

        {/* Pressure Metric */}
        <div className="metric-item">
          <div className="metric-header">
            <span className="metric-label">Pressure</span>
          </div>
          <div className="metric-value-container">
            <span className="metric-value">{latest.pressure.toFixed(1)}</span>
            <span className="metric-unit">cmH₂O</span>
          </div>
          <div className="metric-comparison">
            <span className="comparison-label">Average:</span>
            <span className="comparison-value">{averages.avgPressure}</span>
          </div>
        </div>

        {/* Leak Rate Metric */}
        <div className="metric-item">
          <div className="metric-header">
            <span className="metric-label">Leak Rate</span>
            <span className="metric-status" style={{ color: leakStatus.color }}>
              {leakStatus.label}
            </span>
          </div>
          <div className="metric-value-container">
            <span className="metric-value">{latest.leakRate.toFixed(0)}</span>
            <span className="metric-unit">L/min</span>
          </div>
          <div className="metric-comparison">
            <span className="comparison-label">Average:</span>
            <span className="comparison-value">{averages.avgLeak}</span>
          </div>
        </div>

        {/* Usage Hours */}
        <div className="metric-item">
          <div className="metric-header">
            <span className="metric-label">Usage</span>
          </div>
          <div className="metric-value-container">
            <span className="metric-value">{latest.usageHours.toFixed(1)}</span>
            <span className="metric-unit">hours</span>
          </div>
          <div className="metric-comparison">
            <span className="comparison-label">Target: ≥4.0</span>
          </div>
        </div>
      </div>

      {/* Event Breakdown */}
      <div className="event-breakdown">
        <h4 className="breakdown-title">Event Types (last night)</h4>
        <div className="event-bars">
          <div className="event-bar">
            <div className="event-label">
              <span>Central Apneas</span>
              <span className="event-count">{latest.events.central}</span>
            </div>
            <div className="event-progress">
              <div 
                className="event-fill central"
                style={{ width: `${(latest.events.central / (latest.events.central + latest.events.obstructive + latest.events.hypopnea)) * 100}%` }}
              />
            </div>
          </div>
          <div className="event-bar">
            <div className="event-label">
              <span>Obstructive Apneas</span>
              <span className="event-count">{latest.events.obstructive}</span>
            </div>
            <div className="event-progress">
              <div 
                className="event-fill obstructive"
                style={{ width: `${(latest.events.obstructive / (latest.events.central + latest.events.obstructive + latest.events.hypopnea)) * 100}%` }}
              />
            </div>
          </div>
          <div className="event-bar">
            <div className="event-label">
              <span>Hypopneas</span>
              <span className="event-count">{latest.events.hypopnea}</span>
            </div>
            <div className="event-progress">
              <div 
                className="event-fill hypopnea"
                style={{ width: `${(latest.events.hypopnea / (latest.events.central + latest.events.obstructive + latest.events.hypopnea)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapyMetrics;