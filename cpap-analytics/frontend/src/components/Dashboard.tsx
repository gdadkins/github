import React, { useState, useEffect, useMemo } from 'react';
import { apiService, UserProfile } from '../services/api';
import { AnalyticsData } from '../types';
import { AHITrendChart, SleepQualityChart, TherapyInsights, EventBreakdownChart } from './charts';
import DateRangeSelector, { DateRangePreset } from './DateRangeSelector';
import ComplianceHeatmap from './charts/ComplianceHeatmap';
import SmartInsights from './SmartInsights';
import { QuickMetrics } from './widgets/therapy';
import { TherapyEffectivenessScore, MaskFitAnalytics } from './widgets/analytics';
import { GoalsTracker } from './widgets/compliance';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [showSessionList, setShowSessionList] = useState(false);
  const [dateRange, setDateRange] = useState<DateRangePreset>('30d');
  const [isPremium] = useState(false); // TODO: Get from user subscription

  // Filter data based on selected date range
  const filteredAnalytics = useMemo(() => {
    if (!analytics) return null;

    const getDaysFromRange = (range: DateRangePreset): number => {
      switch (range) {
        case '7d': return 7;
        case '30d': return 30;
        case '90d': return 90;
        case '180d': return 180;
        case '365d': return 365;
        case 'all': return Infinity;
        default: return 30;
      }
    };

    const maxDays = getDaysFromRange(dateRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - maxDays);

    const filteredTrends = analytics.trends.filter(trend => {
      const trendDate = new Date(trend.date);
      return trendDate >= cutoffDate;
    });

    const filteredSessions = analytics.recent_sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= cutoffDate;
    });

    return {
      ...analytics,
      trends: filteredTrends,
      recent_sessions: filteredSessions
    };
  }, [analytics, dateRange]);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const [profileData, analyticsData] = await Promise.all([
        apiService.getUserProfile(),
        apiService.getAnalytics()
      ]);
      setProfile(profileData);
      setAnalytics(analyticsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    try {
      apiService.logout();
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
      // Still proceed with logout even if there's an error
      onLogout();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner h-12 w-12 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading your CPAP data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg">
            {error}
          </div>
          <button
            onClick={loadProfile}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const { user, devices, statistics } = profile;

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="glass-effect shadow-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-8">
            <div className="space-y-2">
              <h1 className="text-gradient font-bold tracking-tight">
                CPAP Analytics Dashboard
              </h1>
              <p className="text-slate-600 font-medium">Welcome back, {user.full_name || user.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm text-slate-500">Last active</p>
                <p className="text-sm font-medium text-slate-700">Today</p>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-md"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {/* Controls Section */}
        <div className="mb-8 card p-6 overflow-visible">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowSessionList(!showSessionList)}
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
            
            {/* Date Range Selector */}
            <DateRangeSelector 
              value={dateRange} 
              onChange={setDateRange} 
              isPremium={isPremium}
            />
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="metric-card metric-card-good" onClick={() => setShowSessionList(true)}>
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

          <div className={`metric-card ${
            statistics.average_ahi < 5 
              ? 'metric-card-excellent' 
              : statistics.average_ahi < 15 
                ? 'metric-card-warning' 
                : 'metric-card-danger'
          }`}>
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
                  statistics.average_ahi < 5 ? 'text-emerald-600' :
                  statistics.average_ahi < 15 ? 'text-amber-600' : 'text-red-600'
                }`}>
                  {statistics.average_ahi < 5 ? 'Excellent Control' :
                   statistics.average_ahi < 15 ? 'Mild Apnea' : 'Needs Attention'}
                </p>
              </div>
              <div className={`stat-icon ${
                statistics.average_ahi < 5 
                  ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' 
                  : statistics.average_ahi < 15 
                    ? 'bg-gradient-to-br from-amber-500 to-amber-600' 
                    : 'bg-gradient-to-br from-red-500 to-red-600'
              }`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

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

          <div className={`metric-card ${
            statistics.compliance_rate_percent >= 70 
              ? 'metric-card-excellent' 
              : 'metric-card-warning'
          }`}>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-600 uppercase tracking-wider">
                  Compliance Rate
                </p>
                <p className="text-3xl font-bold text-slate-900">
                  {statistics.compliance_rate_percent}%
                </p>
                <p className={`text-xs font-medium ${
                  statistics.compliance_rate_percent >= 70 ? 'text-emerald-600' : 'text-amber-600'
                }`}>
                  {statistics.compliance_rate_percent >= 70 ? 'Target Met' : 'Below Target'}
                </p>
              </div>
              <div className={`stat-icon ${
                statistics.compliance_rate_percent >= 70 
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

        {/* Smart AI Insights - Featured prominently */}
        <SmartInsights />

        {/* Widget Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          <QuickMetrics data={filteredAnalytics} dateRange={dateRange} />
          <TherapyEffectivenessScore 
            data={{
              ahi: statistics.average_ahi,
              compliance: statistics.compliance_rate_percent,
              leakRate: 18,
              usageHours: statistics.average_duration_hours,
              pressure: 12,
              events: { central: 2, obstructive: 5, hypopnea: 8 }
            }}
            historicalData={filteredAnalytics?.trends || []}
          />
          <MaskFitAnalytics 
            currentSession={{
              leakRate: 18,
              duration: statistics.average_duration_hours,
              pressure: 12
            }}
            recentSessions={filteredAnalytics?.recent_sessions?.map(s => ({
              date: s.date,
              leakRate: s.mask_leak,
              duration: s.duration_hours,
              events: s.ahi
            })) || []}
            maskInfo={{
              type: 'Full Face',
              model: 'ResMed AirFit F20',
              size: 'Medium',
              purchaseDate: '2024-01-01',
              usageHours: 1200
            }}
          />
          <GoalsTracker />
        </div>

        {/* Data Visualizations */}
        {filteredAnalytics && filteredAnalytics.trends && filteredAnalytics.trends.length > 0 && (
          <div className="space-y-6 mb-8 mt-8">
            {/* AHI Trend Chart */}
            <AHITrendChart data={filteredAnalytics.trends} />
            
            {/* Sleep Quality Chart */}
            <SleepQualityChart data={filteredAnalytics.trends} />
            
            {/* Event Breakdown Chart */}
            <EventBreakdownChart data={filteredAnalytics.trends} />
            
            {/* Compliance Heatmap - Show for 30+ days */}
            {dateRange !== '7d' && (
              <ComplianceHeatmap 
                data={filteredAnalytics.trends} 
                months={dateRange === '90d' ? 3 : dateRange === '180d' || dateRange === '365d' || dateRange === 'all' ? 6 : 1}
              />
            )}
            
            {/* Therapy Insights */}
            <TherapyInsights 
              data={filteredAnalytics.trends} 
              recentSessions={filteredAnalytics.recent_sessions}
            />
          </div>
        )}

        {/* Device Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Your CPAP Device</h3>
            </div>
            <div className="px-6 py-4">
              {devices.length > 0 ? (
                <div className="space-y-4">
                  {devices.map((device) => (
                    <div key={device.id} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {device.manufacturer} {device.model}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Serial: {device.serial_number}
                        </p>
                        <p className="text-sm text-gray-500">
                          Firmware: {device.firmware_version}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          device.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {device.is_active ? 'Active' : 'Inactive'}
                        </span>
                        {device.is_primary && (
                          <p className="text-xs text-blue-600 mt-1">Primary Device</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No devices found</p>
              )}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Sleep Summary</h3>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Data Period:</span>
                  <span className="font-medium">
                    {statistics.date_range.first_session} to {statistics.date_range.last_session}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">AHI Status:</span>
                  <span className={`font-medium ${
                    statistics.average_ahi < 5 
                      ? 'text-green-600' 
                      : statistics.average_ahi < 15 
                        ? 'text-yellow-600' 
                        : 'text-red-600'
                  }`}>
                    {statistics.average_ahi < 5 
                      ? 'Excellent' 
                      : statistics.average_ahi < 15 
                        ? 'Mild' 
                        : 'Needs Attention'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Compliance Goal:</span>
                  <span className={`font-medium ${
                    statistics.compliance_rate_percent >= 70 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {statistics.compliance_rate_percent >= 70 ? 'Met' : 'Below Target'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Session List */}
        {showSessionList && filteredAnalytics?.recent_sessions && (
          <div className="mb-8 bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Recent Sessions ({dateRange === '7d' ? 'Last 7 Days' : 
                                 dateRange === '30d' ? 'Last 30 Days' : 
                                 dateRange === '90d' ? 'Last 90 Days' : 
                                 dateRange === '180d' ? 'Last 6 Months' : 
                                 dateRange === '365d' ? 'Last Year' : 'All Time'})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      AHI
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mask Leak
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pressure
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quality Score
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAnalytics.recent_sessions.map((session, index) => (
                    <tr 
                      key={session.id || index} 
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedSession(session)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {new Date(session.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {session.duration_hours}h
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`font-medium ${
                          session.ahi < 5 ? 'text-green-600' : 
                          session.ahi < 15 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {session.ahi}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {session.mask_leak} L/min
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {session.pressure_avg} cmH₂O
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900 mr-2">
                            {session.quality_score}%
                          </span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                session.quality_score >= 80 ? 'bg-green-500' :
                                session.quality_score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${session.quality_score}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Selected Session Details Modal */}
        {selectedSession && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50" onClick={() => setSelectedSession(null)}>
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Session Details - {new Date(selectedSession.date).toLocaleDateString()}
                </h3>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Therapy Metrics</h4>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Duration:</dt>
                        <dd className="font-medium">{selectedSession.duration_hours} hours</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">AHI:</dt>
                        <dd className={`font-medium ${
                          selectedSession.ahi < 5 ? 'text-green-600' : 
                          selectedSession.ahi < 15 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {selectedSession.ahi} events/hour
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Quality Score:</dt>
                        <dd className="font-medium">{selectedSession.quality_score}%</dd>
                      </div>
                    </dl>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Equipment Metrics</h4>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Mask Leak:</dt>
                        <dd className="font-medium">{selectedSession.mask_leak} L/min</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Average Pressure:</dt>
                        <dd className="font-medium">{selectedSession.pressure_avg} cmH₂O</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setSelectedSession(null)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade Prompt for Free Users */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-purple-800">
                  🚀 Unlock Advanced Analytics
                </h3>
                <div className="mt-2 text-sm text-purple-700">
                  <p>
                    Get ML-powered insights, trend predictions, PDF reports for doctors, and unlimited data history.
                    <br />
                    <span className="font-medium">Upgrade to Premium for just $9.99/month.</span>
                  </p>
                </div>
              </div>
            </div>
            <button className="ml-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>

        {/* Platform Information */}
        <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                CPAP Analytics Platform
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Advanced sleep therapy analytics with {statistics.total_nights} nights tracked, 
                  average AHI of {statistics.average_ahi}, and {statistics.compliance_rate_percent}% compliance rate.
                  📊 Charts show trends and actionable insights for better therapy outcomes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
