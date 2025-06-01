import React from 'react';
import { DATE_RANGES, LAYOUT_TYPES, DateRangeKey, LayoutType } from '../../constants/dashboard';

interface EnhancedDashboardHeaderProps {
  user: any;
  dateRange: DateRangeKey;
  onDateRangeChange: (range: DateRangeKey) => void;
  selectedLayout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
  isPremium: boolean;
  onLogout: () => void;
}

const EnhancedDashboardHeader: React.FC<EnhancedDashboardHeaderProps> = ({
  user,
  dateRange,
  onDateRangeChange,
  selectedLayout,
  onLayoutChange,
  isPremium,
  onLogout
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    return hour < 12 ? 'morning' : 'evening';
  };

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <h1 className="dashboard-title">Sleep Therapy Command Center</h1>
        <p className="dashboard-subtitle">
          Good {getGreeting()}, {user.full_name || user.email}
        </p>
      </div>
      
      <div className="header-center">
        <div className="date-range-selector">
          {Object.entries(DATE_RANGES).map(([key, config]) => (
            <button
              key={key}
              className={`range-button ${dateRange === key ? 'active' : ''}`}
              onClick={() => onDateRangeChange(key as DateRangeKey)}
              disabled={!isPremium && ('isPremium' in config && config.isPremium)}
            >
              {config.label}
              {!isPremium && ('isPremium' in config && config.isPremium) && ' 🔒'}
            </button>
          ))}
        </div>
      </div>

      <div className="header-right">
        <div className="layout-selector">
          <label>Layout:</label>
          <select 
            value={selectedLayout}
            onChange={(e) => onLayoutChange(e.target.value as LayoutType)}
            className="layout-select"
          >
            <option value={LAYOUT_TYPES.DEFAULT}>Default</option>
            <option value={LAYOUT_TYPES.COMPLIANCE_FOCUSED}>Compliance Focus</option>
            <option value={LAYOUT_TYPES.CLINICAL_DETAIL}>Clinical Detail</option>
            <option value={LAYOUT_TYPES.MINIMALIST}>Minimalist</option>
            <option value={LAYOUT_TYPES.DATA_ENTHUSIAST}>Data Enthusiast</option>
          </select>
        </div>
        
        <button className="header-button" onClick={onLogout}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
            <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
          </svg>
          Logout
        </button>
      </div>
    </header>
  );
};

export default EnhancedDashboardHeader;