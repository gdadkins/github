import React from 'react';

interface PressureOptimizationProps {
  data?: any;
}

const PressureOptimization: React.FC<PressureOptimizationProps> = ({ data }) => {
  return (
    <div style={{ padding: '20px' }}>
      <h3>Pressure Optimization</h3>
      <p style={{ color: '#6b7280', marginBottom: '20px' }}>Analysis of your pressure settings</p>
      <div style={{ backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px' }}>
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Current Pressure</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>10.2 cmH₂O</div>
        </div>
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Recommended Range</div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>9.5 - 10.5 cmH₂O</div>
        </div>
        <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#d1fae5', borderRadius: '6px' }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#065f46' }}>
            ✓ Your pressure settings are optimal
          </p>
        </div>
      </div>
    </div>
  );
};

export default PressureOptimization;