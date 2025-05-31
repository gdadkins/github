import React from 'react';

interface SleepStageAnalysisProps {
  data?: any;
}

const SleepStageAnalysis: React.FC<SleepStageAnalysisProps> = ({ data }) => {
  return (
    <div style={{ padding: '20px' }}>
      <h3>Sleep Stage Analysis</h3>
      <div style={{ marginTop: '20px' }}>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>REM Sleep</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>22%</div>
              <div style={{ flex: 1, height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px' }}>
                <div style={{ width: '22%', height: '100%', backgroundColor: '#8b5cf6', borderRadius: '4px' }}></div>
              </div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Deep Sleep</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>18%</div>
              <div style={{ flex: 1, height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px' }}>
                <div style={{ width: '18%', height: '100%', backgroundColor: '#3b82f6', borderRadius: '4px' }}></div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Light Sleep</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>52%</div>
              <div style={{ flex: 1, height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px' }}>
                <div style={{ width: '52%', height: '100%', backgroundColor: '#10b981', borderRadius: '4px' }}></div>
              </div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Awake</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>8%</div>
              <div style={{ flex: 1, height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px' }}>
                <div style={{ width: '8%', height: '100%', backgroundColor: '#ef4444', borderRadius: '4px' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SleepStageAnalysis;