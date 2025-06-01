import React from 'react';
import { AHI_THRESHOLDS, COMPLIANCE, getAHIStatus, getComplianceStatus } from '../../constants/medical';

interface Statistics {
  total_nights: number;
  average_ahi: number;
  average_duration_hours: number;
  compliance_rate_percent: number;
}

interface StatisticsCardsProps {
  statistics: Statistics;
  onShowSessions: () => void;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ statistics, onShowSessions }) => {
  const ahiStatus = getAHIStatus(statistics.average_ahi);
  const complianceStatus = getComplianceStatus(statistics.compliance_rate_percent);

  const getAHIStatusText = (ahi: number): string => {
    if (ahi < AHI_THRESHOLDS.EXCELLENT) return 'Excellent Control';
    if (ahi < AHI_THRESHOLDS.MILD) return 'Mild Apnea';
    return 'Needs Attention';
  };

  const getComplianceText = (rate: number): string => {
    return rate >= COMPLIANCE.TARGET_RATE ? 'Target Met' : 'Below Target';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Nights Card */}
      <div className="metric-card metric-card-good" onClick={onShowSessions}>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-600 uppercase tracking-wider">
              Total Nights
            </p>
            <p className="text-3xl font-bold text-slate-900">
              {statistics.total_nights}
            </p>
            <p className="text-xs text-slate-500">
              Sleep sessions tracked
            </p>
          </div>
          <div className="stat-icon bg-gradient-to-br from-blue-500 to-blue-600">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Average AHI Card */}
      <div className={`metric-card metric-card-${ahiStatus}`}>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-600 uppercase tracking-wider">
              Average AHI
            </p>
            <p className="text-3xl font-bold text-slate-900">
              {statistics.average_ahi}
              <span className="text-sm text-slate-500 ml-1">events/hr</span>
            </p>
            <p className={`text-xs font-medium ${
              ahiStatus === 'excellent' ? 'text-emerald-600' :
              ahiStatus === 'warning' ? 'text-amber-600' : 'text-red-600'
            }`}>
              {getAHIStatusText(statistics.average_ahi)}
            </p>
          </div>
          <div className={`stat-icon ${
            ahiStatus === 'excellent' 
              ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' 
              : ahiStatus === 'warning'
                ? 'bg-gradient-to-br from-amber-500 to-amber-600' 
                : 'bg-gradient-to-br from-red-500 to-red-600'
          }`}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Average Duration Card */}
      <div className="metric-card metric-card-good">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-600 uppercase tracking-wider">
              Avg Duration
            </p>
            <p className="text-3xl font-bold text-slate-900">
              {statistics.average_duration_hours}
              <span className="text-sm text-slate-500 ml-1">hours</span>
            </p>
            <p className="text-xs text-slate-500">
              Nightly usage
            </p>
          </div>
          <div className="stat-icon bg-gradient-to-br from-purple-500 to-purple-600">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Compliance Rate Card */}
      <div className={`metric-card metric-card-${complianceStatus}`}>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-600 uppercase tracking-wider">
              Compliance Rate
            </p>
            <p className="text-3xl font-bold text-slate-900">
              {statistics.compliance_rate_percent}%
            </p>
            <p className={`text-xs font-medium ${
              complianceStatus === 'excellent' ? 'text-emerald-600' : 'text-amber-600'
            }`}>
              {getComplianceText(statistics.compliance_rate_percent)}
            </p>
          </div>
          <div className={`stat-icon ${
            complianceStatus === 'excellent'
              ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' 
              : 'bg-gradient-to-br from-amber-500 to-amber-600'
          }`}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsCards;