import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from './layout/DashboardLayout';
import { apiService } from '../services/api';
import { LAYOUT_TYPES, DateRangeKey, LayoutType } from '../constants/dashboard';
import { generateMockData } from '../utils/mockDataHelpers';
import { getWidgetConfigs, getLayoutConfigs } from '../utils/widgetConfig';
import EnhancedDashboardHeader from './enhanced-dashboard/EnhancedDashboardHeader';
import WelcomeTour from './enhanced-dashboard/WelcomeTour';
import PremiumBanner from './enhanced-dashboard/PremiumBanner';
import DashboardFooter from './enhanced-dashboard/DashboardFooter';
import LoadingState from './enhanced-dashboard/LoadingState';
import ErrorState from './enhanced-dashboard/ErrorState';
import './EnhancedDashboard.css';

interface EnhancedDashboardProps {
  user: any;
  onLogout: () => void;
}

const EnhancedDashboard: React.FC<EnhancedDashboardProps> = ({ user, onLogout }) => {
  // Early return if user is not available yet
  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLayout, setSelectedLayout] = useState<LayoutType>(LAYOUT_TYPES.DEFAULT);
  const [isPremium] = useState(user?.subscription?.tier === 'premium' || user?.subscription?.tier === 'pro');
  const [dateRange, setDateRange] = useState<DateRangeKey>('30d');
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    loadDashboardData();
    checkFirstTimeUser();
  }, [dateRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [profile, analytics, insights] = await Promise.all([
        apiService.getUserProfile(),
        apiService.getAnalytics(),
        apiService.getInsights()
      ]);
      
      setDashboardData({
        profile,
        analytics,
        insights,
        mockData: generateMockData() // For demo purposes
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const checkFirstTimeUser = () => {
    const hasSeenWelcome = localStorage.getItem('has-seen-welcome');
    if (!hasSeenWelcome) {
      setShowWelcome(true);
      localStorage.setItem('has-seen-welcome', 'true');
    }
  };


  // Get widget configurations
  const widgets = useMemo(() => 
    getWidgetConfigs(dashboardData, dateRange, user?.id || 0),
    [dashboardData, dateRange, user?.id]
  );

  // Get layout configurations
  const layouts = useMemo(() => 
    getLayoutConfigs(widgets),
    [widgets]
  );

  const handleLayoutChange = () => {
    // Handle layout changes if needed
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={loadDashboardData} />;

  return (
    <div className="enhanced-dashboard">
      <EnhancedDashboardHeader
        user={user}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        selectedLayout={selectedLayout}
        onLayoutChange={setSelectedLayout}
        isPremium={isPremium}
        onLogout={onLogout}
      />

      {showWelcome && <WelcomeTour onClose={() => setShowWelcome(false)} />}

      {/* Main Dashboard Content */}
      <DashboardLayout
        widgets={layouts[selectedLayout as keyof typeof layouts] || layouts.default}
        layout={selectedLayout}
        onLayoutChange={handleLayoutChange}
        isPremium={isPremium}
      />

      {!isPremium && <PremiumBanner />}

      <DashboardFooter
        dataPointsCount={dashboardData?.analytics?.trends?.length || 0}
        lastSyncTime="2 minutes ago"
        deviceStatus="connected"
      />
    </div>
  );
};

export default EnhancedDashboard;