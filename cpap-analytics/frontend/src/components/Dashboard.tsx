import React, { useState, useEffect, useMemo } from 'react';
import { apiService, UserProfile } from '../services/api';
import { AnalyticsData } from '../types';
import { AHITrendChart, SleepQualityChart, TherapyInsights, EventBreakdownChart } from './charts';
import { DateRangePreset } from './DateRangeSelector';
import ComplianceHeatmap from './charts/ComplianceHeatmap';
import SmartInsights from './SmartInsights';
import { QuickMetrics } from './widgets/therapy';
import { TherapyEffectivenessScore, MaskFitAnalytics } from './widgets/analytics';
import { GoalsTracker } from './widgets/compliance';
import { filterDataByDateRange } from '../utils/dateHelpers';
import DashboardHeader from './dashboard/DashboardHeader';
import StatisticsCards from './dashboard/StatisticsCards';
import DashboardControls from './dashboard/DashboardControls';
import SessionsList from './dashboard/SessionsList';
import SessionModal from './dashboard/SessionModal';

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

    const filteredTrends = filterDataByDateRange(analytics.trends, dateRange);
    const filteredSessions = filterDataByDateRange(analytics.recent_sessions, dateRange);

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
      <DashboardHeader 
        userName={user.full_name || user.email} 
        onLogout={handleLogout} 
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <DashboardControls 
          showSessionList={showSessionList}
          onToggleSessionList={() => setShowSessionList(!showSessionList)}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          isPremium={isPremium}
        />

        <StatisticsCards 
          statistics={statistics}
          onShowSessions={() => setShowSessionList(true)}
        />

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
          <SessionsList 
            sessions={filteredAnalytics.recent_sessions}
            dateRange={dateRange}
            onSessionSelect={setSelectedSession}
          />
        )}

        <SessionModal 
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />

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
