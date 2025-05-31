import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from './layout/DashboardLayout';
import TherapyEffectivenessScore from './widgets/analytics/TherapyEffectivenessScore';
import MaskFitAnalytics from './widgets/analytics/MaskFitAnalytics';
import AHITrendChart from './charts/AHITrendChart';
import SleepQualityChart from './charts/SleepQualityChart';
import TherapyInsights from './charts/TherapyInsights';
import EventBreakdownChart from './charts/EventBreakdownChart';
import ComplianceHeatmap from './charts/ComplianceHeatmap';
import SmartInsights from './SmartInsights';
import { apiService } from '../services/api';
import './EnhancedDashboard.css';

// Import widgets from their respective categories
const QuickMetrics = React.lazy(() => import('./widgets/therapy/QuickMetrics'));
const PressureOptimization = React.lazy(() => import('./widgets/analytics/PressureOptimization'));
const SleepStageAnalysis = React.lazy(() => import('./widgets/analytics/SleepStageAnalysis'));
const TravelMode = React.lazy(() => import('./widgets/lifestyle/TravelMode'));
const ClinicalReports = React.lazy(() => import('./widgets/reports/ClinicalReports'));
const GoalsTracker = React.lazy(() => import('./widgets/compliance/GoalsTracker'));
const NotificationCenter = React.lazy(() => import('./widgets/compliance/NotificationCenter'));

interface EnhancedDashboardProps {
  user: any;
  onLogout: () => void;
}

const EnhancedDashboard: React.FC<EnhancedDashboardProps> = ({ user, onLogout }) => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLayout, setSelectedLayout] = useState('default');
  const [isPremium] = useState(user?.subscription?.tier === 'premium' || user?.subscription?.tier === 'pro');
  const [dateRange, setDateRange] = useState('30d');
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

  const generateMockData = () => ({
    currentSession: {
      leakRate: 18,
      duration: 7.5,
      pressure: 10.2
    },
    maskInfo: {
      type: 'Full-Face',
      model: 'ResMed AirFit F20',
      size: 'Medium',
      purchaseDate: '2023-08-15',
      usageHours: 890
    },
    therapyData: {
      ahi: 3.2,
      compliance: 92,
      leakRate: 22,
      usageHours: 7.2,
      pressure: 9.8,
      events: {
        central: 0.8,
        obstructive: 1.9,
        hypopnea: 0.5
      }
    }
  });

  // Define all available widgets with their configurations
  const widgets = useMemo(() => {
    if (!dashboardData) return [];

    return [
      {
        id: 'quick-metrics',
        component: QuickMetrics,
        title: 'Quick Metrics',
        description: 'At-a-glance view of your key therapy metrics',
        size: 'full' as const,
        category: 'critical' as const,
        props: {
          data: dashboardData.analytics,
          dateRange
        }
      },
      {
        id: 'therapy-effectiveness',
        component: TherapyEffectivenessScore,
        title: 'Therapy Effectiveness',
        description: 'Overall therapy quality score with detailed breakdown',
        size: 'medium' as const,
        category: 'critical' as const,
        props: {
          data: dashboardData.mockData.therapyData,
          historicalData: dashboardData.analytics?.trends
        }
      },
      {
        id: 'mask-fit',
        component: MaskFitAnalytics,
        title: 'Mask Fit Analytics',
        description: 'Detailed mask leak analysis and fitting recommendations',
        size: 'medium' as const,
        category: 'primary' as const,
        props: {
          currentSession: dashboardData.mockData.currentSession,
          recentSessions: dashboardData.analytics?.recent_sessions || [],
          maskInfo: dashboardData.mockData.maskInfo
        }
      },
      {
        id: 'smart-insights',
        component: SmartInsights,
        title: 'AI Insights',
        description: 'AI-powered therapy insights and recommendations',
        size: 'large' as const,
        category: 'primary' as const,
        props: {}
      },
      {
        id: 'ahi-trends',
        component: AHITrendChart,
        title: 'AHI Trends',
        description: 'Apnea-Hypopnea Index trending over time',
        size: 'medium' as const,
        category: 'primary' as const,
        props: {
          data: dashboardData.analytics?.trends || []
        }
      },
      {
        id: 'sleep-quality',
        component: SleepQualityChart,
        title: 'Sleep Quality',
        description: 'Sleep quality metrics and patterns',
        size: 'medium' as const,
        category: 'secondary' as const,
        props: {
          data: dashboardData.analytics?.trends || []
        }
      },
      {
        id: 'compliance-heatmap',
        component: ComplianceHeatmap,
        title: 'Compliance Calendar',
        description: 'Visual compliance tracking calendar',
        size: 'large' as const,
        category: 'secondary' as const,
        props: {
          data: dashboardData.analytics?.trends || [],
          months: 3
        }
      },
      {
        id: 'pressure-optimization',
        component: PressureOptimization,
        title: 'Pressure Optimization',
        description: 'Pressure settings analysis and optimization suggestions',
        size: 'medium' as const,
        category: 'secondary' as const,
        isPremium: true,
        props: {
          data: dashboardData.analytics
        }
      },
      {
        id: 'sleep-stages',
        component: SleepStageAnalysis,
        title: 'Sleep Stage Analysis',
        description: 'Detailed sleep stage breakdown and disruption patterns',
        size: 'large' as const,
        category: 'optional' as const,
        isPremium: true,
        props: {
          data: dashboardData.analytics
        }
      },
      {
        id: 'event-breakdown',
        component: EventBreakdownChart,
        title: 'Event Breakdown',
        description: 'Detailed breakdown of respiratory events',
        size: 'medium' as const,
        category: 'secondary' as const,
        props: {
          data: dashboardData.analytics?.trends || []
        }
      },
      {
        id: 'goals-tracker',
        component: GoalsTracker,
        title: 'Goals & Progress',
        description: 'Track your therapy goals and achievements',
        size: 'small' as const,
        category: 'optional' as const,
        props: {
          userId: user.id
        }
      },
      {
        id: 'travel-mode',
        component: TravelMode,
        title: 'Travel Analytics',
        description: 'Special analytics for travel and timezone changes',
        size: 'small' as const,
        category: 'optional' as const,
        isPremium: true,
        props: {
          data: dashboardData.analytics
        }
      },
      {
        id: 'clinical-reports',
        component: ClinicalReports,
        title: 'Clinical Reports',
        description: 'Generate and manage clinical reports',
        size: 'small' as const,
        category: 'optional' as const,
        isPremium: true,
        props: {
          userId: user.id
        }
      },
      {
        id: 'notifications',
        component: NotificationCenter,
        title: 'Notifications',
        description: 'Important alerts and notifications',
        size: 'small' as const,
        category: 'critical' as const,
        props: {
          userId: user.id
        }
      }
    ];
  }, [dashboardData, dateRange, user.id]);

  // Predefined layout configurations
  const layouts = {
    default: widgets,
    'compliance-focused': widgets.filter(w => 
      ['quick-metrics', 'compliance-heatmap', 'goals-tracker', 'smart-insights'].includes(w.id)
    ),
    'clinical-detail': widgets.filter(w => 
      ['therapy-effectiveness', 'mask-fit', 'pressure-optimization', 'clinical-reports'].includes(w.id)
    ),
    minimalist: widgets.filter(w => 
      ['quick-metrics', 'ahi-trends', 'smart-insights'].includes(w.id)
    ),
    'data-enthusiast': widgets // All widgets
  };

  const handleLayoutChange = (updatedWidgets: any[]) => {
    // Handle layout changes if needed
    console.log('Layout updated:', updatedWidgets);
  };

  if (loading) {
    return (
      <div className="enhanced-dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Analyzing your sleep data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="enhanced-dashboard-error">
        <h2>Unable to load dashboard</h2>
        <p>{error}</p>
        <button onClick={loadDashboardData}>Retry</button>
      </div>
    );
  }

  return (
    <div className="enhanced-dashboard">
      {/* Dashboard Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-title">Sleep Therapy Command Center</h1>
          <p className="dashboard-subtitle">
            Good {new Date().getHours() < 12 ? 'morning' : 'evening'}, {user.full_name || user.email}
          </p>
        </div>
        
        <div className="header-center">
          <div className="date-range-selector">
            {['7d', '30d', '90d', '180d', '365d', 'all'].map(range => (
              <button
                key={range}
                className={`range-button ${dateRange === range ? 'active' : ''}`}
                onClick={() => setDateRange(range)}
                disabled={!isPremium && ['180d', '365d', 'all'].includes(range)}
              >
                {range === '7d' ? '7 Days' :
                 range === '30d' ? '30 Days' :
                 range === '90d' ? '90 Days' :
                 range === '180d' ? '6 Months' :
                 range === '365d' ? '1 Year' : 'All Time'}
                {!isPremium && ['180d', '365d', 'all'].includes(range) && ' 🔒'}
              </button>
            ))}
          </div>
        </div>

        <div className="header-right">
          <div className="layout-selector">
            <label>Layout:</label>
            <select 
              value={selectedLayout}
              onChange={(e) => setSelectedLayout(e.target.value)}
              className="layout-select"
            >
              <option value="default">Default</option>
              <option value="compliance-focused">Compliance Focus</option>
              <option value="clinical-detail">Clinical Detail</option>
              <option value="minimalist">Minimalist</option>
              <option value="data-enthusiast">Data Enthusiast</option>
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

      {/* Welcome Tour for First-Time Users */}
      {showWelcome && (
        <div className="welcome-tour">
          <div className="welcome-content">
            <h2>Welcome to Your Sleep Therapy Command Center!</h2>
            <p>This dashboard provides comprehensive insights into your CPAP therapy.</p>
            <ul>
              <li>📊 Track your therapy metrics in real-time</li>
              <li>🎯 Set and monitor personal goals</li>
              <li>📈 Analyze trends and patterns</li>
              <li>🤖 Get AI-powered recommendations</li>
              <li>📱 Customize your dashboard layout</li>
            </ul>
            <button onClick={() => setShowWelcome(false)}>Get Started</button>
          </div>
        </div>
      )}

      {/* Main Dashboard Content */}
      <DashboardLayout
        widgets={layouts[selectedLayout as keyof typeof layouts] || layouts.default}
        layout={selectedLayout}
        onLayoutChange={handleLayoutChange}
        isPremium={isPremium}
      />

      {/* Premium Upgrade Banner */}
      {!isPremium && (
        <div className="premium-banner">
          <div className="banner-content">
            <div className="banner-text">
              <h3>Unlock Advanced Analytics</h3>
              <p>Get predictive insights, detailed reports, and unlimited data history</p>
            </div>
            <button className="upgrade-button">
              Upgrade to Premium - $9.99/month
            </button>
          </div>
        </div>
      )}

      {/* Footer with Quick Stats */}
      <footer className="dashboard-footer">
        <div className="footer-stats">
          <div className="stat">
            <span className="stat-label">Data Points</span>
            <span className="stat-value">{dashboardData?.analytics?.trends?.length || 0}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Last Sync</span>
            <span className="stat-value">2 minutes ago</span>
          </div>
          <div className="stat">
            <span className="stat-label">Device Status</span>
            <span className="stat-value status-good">Connected</span>
          </div>
        </div>
        <div className="footer-actions">
          <button className="footer-link">Help Center</button>
          <button className="footer-link">Export Data</button>
          <button className="footer-link">Settings</button>
        </div>
      </footer>
    </div>
  );
};

export default EnhancedDashboard;