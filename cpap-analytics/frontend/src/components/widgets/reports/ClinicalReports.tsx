import React from 'react';

interface ClinicalReportsProps {
  userId?: string;
}

const ClinicalReports: React.FC<ClinicalReportsProps> = ({ userId }) => {
  return (
    <div style={{ padding: '20px' }}>
      <h3>Clinical Reports</h3>
      <div style={{ marginTop: '16px' }}>
        <button 
          style={{ 
            width: '100%', 
            padding: '12px', 
            backgroundColor: '#3b82f6', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            fontSize: '14px', 
            fontWeight: '500',
            cursor: 'pointer',
            marginBottom: '12px'
          }}
        >
          Generate Monthly Report
        </button>
        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          <p style={{ margin: '8px 0' }}>Last report: 3 days ago</p>
          <p style={{ margin: '8px 0' }}>Next scheduled: 27 days</p>
        </div>
      </div>
    </div>
  );
};

export default ClinicalReports;