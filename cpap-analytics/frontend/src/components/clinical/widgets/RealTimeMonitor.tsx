import React, { useState, useEffect } from 'react';
import './RealTimeMonitor.css';

interface RealTimeData {
  timestamp: Date;
  pressure: number;
  flow: number;
  leak: number;
  tidalVolume: number;
  respiratoryRate: number;
  events: {
    type: 'obstructive' | 'central' | 'hypopnea' | 'rera';
    time: Date;
  }[];
}

const RealTimeMonitor: React.FC = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [currentData, setCurrentData] = useState<RealTimeData | null>(null);
  const [alertLevel, setAlertLevel] = useState<'normal' | 'warning' | 'critical'>('normal');
  
  // Simulate real-time data updates
  useEffect(() => {
    if (!isMonitoring) return;
    
    const interval = setInterval(() => {
      const mockData: RealTimeData = {
        timestamp: new Date(),
        pressure: 8.5 + Math.random() * 2,
        flow: 25 + Math.random() * 10,
        leak: 10 + Math.random() * 15,
        tidalVolume: 450 + Math.random() * 100,
        respiratoryRate: 14 + Math.random() * 4,
        events: []
      };
      
      // Simulate occasional events
      if (Math.random() > 0.95) {
        mockData.events.push({
          type: Math.random() > 0.5 ? 'obstructive' : 'hypopnea',
          time: new Date()
        });
      }
      
      setCurrentData(mockData);
      
      // Update alert level based on parameters
      if (mockData.leak > 24 || mockData.respiratoryRate > 20) {
        setAlertLevel('warning');
      } else if (mockData.leak > 40) {
        setAlertLevel('critical');
      } else {
        setAlertLevel('normal');
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isMonitoring]);

  return (
    <div className="realtime-monitor">
      <div className="monitor-header">
        <h2 className="monitor-title">Real-Time Therapy Monitor</h2>
        <div className="monitor-controls">
          <span className={`status-indicator ${isMonitoring ? 'active' : 'inactive'}`}>
            {isMonitoring ? 'Live' : 'Offline'}
          </span>
          <button 
            className={`monitor-toggle ${isMonitoring ? 'stop' : 'start'}`}
            onClick={() => setIsMonitoring(!isMonitoring)}
          >
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </button>
        </div>
      </div>

      {isMonitoring && currentData && (
        <>
          <div className={`alert-banner ${alertLevel}`}>
            <div className="alert-content">
              {alertLevel === 'normal' && 'All parameters within normal range'}
              {alertLevel === 'warning' && 'Elevated leak rate detected - Check mask fit'}
              {alertLevel === 'critical' && 'Critical leak detected - Immediate attention required'}
            </div>
          </div>

          <div className="vitals-grid">
            <div className="vital-card primary">
              <div className="vital-header">
                <span className="vital-label">Therapy Pressure</span>
                <span className="vital-unit">cmH₂O</span>
              </div>
              <div className="vital-value">{currentData.pressure.toFixed(1)}</div>
              <div className="vital-trend">
                <div className="trend-graph">
                  {/* Mini sparkline would go here */}
                  <svg viewBox="0 0 100 40" className="sparkline">
                    <polyline
                      fill="none"
                      stroke="var(--chart-primary)"
                      strokeWidth="2"
                      points="0,20 20,22 40,18 60,21 80,19 100,20"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="vital-card">
              <div className="vital-header">
                <span className="vital-label">Flow Rate</span>
                <span className="vital-unit">L/min</span>
              </div>
              <div className="vital-value">{currentData.flow.toFixed(0)}</div>
              <div className="vital-status good">Normal</div>
            </div>

            <div className={`vital-card ${alertLevel === 'warning' || alertLevel === 'critical' ? 'alert' : ''}`}>
              <div className="vital-header">
                <span className="vital-label">Leak Rate</span>
                <span className="vital-unit">L/min</span>
              </div>
              <div className="vital-value">{currentData.leak.toFixed(0)}</div>
              <div className={`vital-status ${currentData.leak > 24 ? 'warning' : 'good'}`}>
                {currentData.leak > 24 ? 'High' : 'Good Seal'}
              </div>
            </div>

            <div className="vital-card">
              <div className="vital-header">
                <span className="vital-label">Respiratory Rate</span>
                <span className="vital-unit">bpm</span>
              </div>
              <div className="vital-value">{currentData.respiratoryRate.toFixed(0)}</div>
              <div className="vital-status good">Normal</div>
            </div>

            <div className="vital-card">
              <div className="vital-header">
                <span className="vital-label">Tidal Volume</span>
                <span className="vital-unit">mL</span>
              </div>
              <div className="vital-value">{currentData.tidalVolume.toFixed(0)}</div>
              <div className="vital-status good">Adequate</div>
            </div>
          </div>

          <div className="waveform-section">
            <h3 className="section-title">Flow Waveform</h3>
            <div className="waveform-container">
              <svg viewBox="0 0 800 200" className="waveform">
                <defs>
                  <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="var(--chart-primary)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="var(--chart-primary)" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0,100 Q 50,50 100,100 T 200,100 T 300,100 T 400,100 T 500,100 T 600,100 T 700,100 T 800,100"
                  fill="url(#waveGradient)"
                  stroke="var(--chart-primary)"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>

          {currentData.events.length > 0 && (
            <div className="events-section">
              <h3 className="section-title">Recent Events</h3>
              <div className="events-list">
                {currentData.events.map((event, idx) => (
                  <div key={idx} className={`event-item ${event.type}`}>
                    <span className="event-time">
                      {event.time.toLocaleTimeString()}
                    </span>
                    <span className="event-type">
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)} Event
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {!isMonitoring && (
        <div className="monitor-placeholder">
          <div className="placeholder-icon">📡</div>
          <h3>Real-Time Monitoring Available</h3>
          <p>Connect to your CPAP device to monitor therapy parameters in real-time</p>
          <button 
            className="btn-clinical btn-primary"
            onClick={() => setIsMonitoring(true)}
          >
            Start Monitoring
          </button>
        </div>
      )}
    </div>
  );
};

export default RealTimeMonitor;