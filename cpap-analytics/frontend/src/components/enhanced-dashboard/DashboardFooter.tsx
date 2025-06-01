import React from 'react';

interface DashboardFooterProps {
  dataPointsCount: number;
  lastSyncTime?: string;
  deviceStatus?: 'connected' | 'disconnected';
  onHelpClick?: () => void;
  onExportClick?: () => void;
  onSettingsClick?: () => void;
}

const DashboardFooter: React.FC<DashboardFooterProps> = ({
  dataPointsCount,
  lastSyncTime = '2 minutes ago',
  deviceStatus = 'connected',
  onHelpClick,
  onExportClick,
  onSettingsClick
}) => {
  return (
    <footer className="dashboard-footer">
      <div className="footer-stats">
        <div className="stat">
          <span className="stat-label">Data Points</span>
          <span className="stat-value">{dataPointsCount}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Last Sync</span>
          <span className="stat-value">{lastSyncTime}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Device Status</span>
          <span className={`stat-value ${deviceStatus === 'connected' ? 'status-good' : 'status-bad'}`}>
            {deviceStatus === 'connected' ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
      <div className="footer-actions">
        <button className="footer-link" onClick={onHelpClick}>Help Center</button>
        <button className="footer-link" onClick={onExportClick}>Export Data</button>
        <button className="footer-link" onClick={onSettingsClick}>Settings</button>
      </div>
    </footer>
  );
};

export default DashboardFooter;