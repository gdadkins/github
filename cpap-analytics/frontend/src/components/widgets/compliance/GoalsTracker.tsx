import React from 'react';

interface GoalsTrackerProps {
  userId?: string;
}

const GoalsTracker: React.FC<GoalsTrackerProps> = ({ userId }) => {
  return (
    <div style={{ padding: '20px' }}>
      <h3>Goals & Progress</h3>
      <div style={{ marginTop: '16px' }}>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px' }}>Daily Usage Goal</span>
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>7.2/7.0 hrs</span>
          </div>
          <div style={{ height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px' }}>
            <div style={{ width: '100%', height: '100%', backgroundColor: '#10b981', borderRadius: '4px' }}></div>
          </div>
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px' }}>AHI Target</span>
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>3.2/5.0</span>
          </div>
          <div style={{ height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px' }}>
            <div style={{ width: '64%', height: '100%', backgroundColor: '#10b981', borderRadius: '4px' }}></div>
          </div>
        </div>
        
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px' }}>🏆</div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>15 day streak!</div>
        </div>
      </div>
    </div>
  );
};

export default GoalsTracker;