import React from 'react';

interface NotificationCenterProps {
  userId?: string;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ userId }) => {
  return (
    <div style={{ padding: '20px' }}>
      <h3>Notifications</h3>
      <div style={{ marginTop: '16px' }}>
        <div style={{ padding: '12px', backgroundColor: '#fee2e2', borderRadius: '8px', marginBottom: '8px' }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#991b1b' }}>
            ⚠️ Mask replacement recommended
          </p>
        </div>
        <div style={{ padding: '12px', backgroundColor: '#dbeafe', borderRadius: '8px', marginBottom: '8px' }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#1e40af' }}>
            📊 Weekly report available
          </p>
        </div>
        <div style={{ padding: '12px', backgroundColor: '#d1fae5', borderRadius: '8px' }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#065f46' }}>
            ✅ Great compliance this week!
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;