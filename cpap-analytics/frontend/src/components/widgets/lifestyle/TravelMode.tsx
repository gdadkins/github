import React from 'react';

interface TravelModeProps {
  data?: any;
}

const TravelMode: React.FC<TravelModeProps> = ({ data }) => {
  return (
    <div style={{ padding: '20px' }}>
      <h3>Travel Analytics</h3>
      <div style={{ marginTop: '16px' }}>
        <div style={{ padding: '16px', backgroundColor: '#fef3c7', borderRadius: '8px', marginBottom: '16px' }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#92400e' }}>
            🌍 Travel mode detected: Different timezone
          </p>
        </div>
        <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Current Location</div>
        <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>PST (UTC-8)</div>
        
        <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Sleep Pattern Adjustment</div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ fontSize: '16px' }}>-2 hours shift detected</div>
          <span style={{ fontSize: '12px', padding: '2px 8px', backgroundColor: '#10b981', color: 'white', borderRadius: '4px' }}>Adapting</span>
        </div>
      </div>
    </div>
  );
};

export default TravelMode;