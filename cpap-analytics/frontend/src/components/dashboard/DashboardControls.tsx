import React from 'react';
import DateRangeSelector, { DateRangePreset } from '../DateRangeSelector';

interface DashboardControlsProps {
  showSessionList: boolean;
  onToggleSessionList: () => void;
  dateRange: DateRangePreset;
  onDateRangeChange: (range: DateRangePreset) => void;
  isPremium: boolean;
}

const DashboardControls: React.FC<DashboardControlsProps> = ({
  showSessionList,
  onToggleSessionList,
  dateRange,
  onDateRangeChange,
  isPremium
}) => {
  return (
    <div className="mb-8 card p-6 overflow-visible">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onToggleSessionList}
            className="btn btn-primary btn-md"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            {showSessionList ? 'Hide Sessions' : 'View All Sessions'}
          </button>
          <button className="btn btn-success btn-md">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload New Data
          </button>
        </div>
        
        <DateRangeSelector 
          value={dateRange} 
          onChange={onDateRangeChange} 
          isPremium={isPremium}
        />
      </div>
    </div>
  );
};

export default DashboardControls;