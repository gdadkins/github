import React, { useState, useEffect } from 'react';
import { useAuth } from '../../App';
import { api } from '../../services/api';
import ComplianceTracker from './widgets/ComplianceTracker';
import TherapyMetrics from './widgets/TherapyMetrics';
import InsuranceCompliance from './widgets/InsuranceCompliance';
import EquipmentHealth from './widgets/EquipmentHealth';
import SleepQualityScore from './widgets/SleepQualityScore';
import ClinicalInsights from './widgets/ClinicalInsights';
import TrendAnalysis from './widgets/TrendAnalysis';
import EventPatterns from './widgets/EventPatterns';
import './ClinicalDashboard.css';

interface DashboardData {
  summary: {
    totalNights: number;
    avgAHI: number;
    avgUsageHours: number;
    complianceRate: number;
  };
  trends: Array<{
    date: string;
    ahi: number;
    usageHours: number;
    events: {
      central: number;
      obstructive: number;
      hypopnea: number;
    };
    leakRate: number;
    pressure: number;
  }>;
  recentSessions: any[];
}

const ClinicalDashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [dateRange, setDateRange] = useState(30); // days
  const [activeView, setActiveView] = useState<'overview' | 'detailed'>('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const analytics = await api.getAnalytics();
        
        // Transform the data to match expected format
        const transformedData: DashboardData = {
          summary: {
            totalNights: analytics.summary?.total_sessions || 0,
            avgAHI: analytics.summary?.avg_ahi || 0,
            avgUsageHours: analytics.summary?.avg_duration || 0,
            complianceRate: analytics.recent_sessions 
              ? Math.round((analytics.recent_sessions.filter((s: any) => s.duration_hours >= 4).length / analytics.recent_sessions.length) * 100)
              : 0
          },
          trends: analytics.trends || [],
          recentSessions: analytics.recent_sessions || []
        };
        
        setData(transformedData);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDateRangeChange = (days: number) => {
    setDateRange(days);
    // In real app, would refetch data with new range
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner clinical"></div>
        <p className="loading-text">Analyzing your sleep data...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="error-container">
        <p>Unable to load analytics data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="clinical-dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Sleep Therapy Overview</h1>
          <p className="dashboard-subtitle">
            Welcome back, {user?.username || user?.email}. Your therapy is tracking well.
          </p>
        </div>

        <div className="header-controls">
          <div className="date-range-selector">
            <label className="selector-label">Time Period</label>
            <select 
              value={dateRange} 
              onChange={(e) => handleDateRangeChange(Number(e.target.value))}
              className="date-select"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 3 months</option>
              <option value={180}>Last 6 months</option>
              <option value={365}>Last year</option>
            </select>
          </div>

          <div className="view-toggle">
            <button 
              className={`toggle-btn ${activeView === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveView('overview')}
            >
              Overview
            </button>
            <button 
              className={`toggle-btn ${activeView === 'detailed' ? 'active' : ''}`}
              onClick={() => setActiveView('detailed')}
            >
              Detailed
            </button>
          </div>
        </div>
      </div>

      {/* Primary Metrics Row */}
      <div className="metrics-grid primary">
        <TherapyMetrics data={data} />
        <ComplianceTracker data={data} dateRange={dateRange} />
        <SleepQualityScore data={data} />
        <InsuranceCompliance data={data} />
      </div>

      {/* Clinical Insights Section */}
      <div className="insights-section">
        <ClinicalInsights data={data} />
      </div>

      {/* Detailed Analytics Grid */}
      <div className="analytics-grid">
        <div className="analytics-primary">
          <TrendAnalysis data={data} dateRange={dateRange} />
        </div>
        <div className="analytics-secondary">
          <EventPatterns data={data} />
          <EquipmentHealth data={data} />
        </div>
      </div>

      {/* Action Cards */}
      <div className="action-cards">
        <div className="action-card">
          <div className="action-icon report"></div>
          <div className="action-content">
            <h3>Generate Compliance Report</h3>
            <p>Create a detailed report for your healthcare provider or insurance company</p>
          </div>
          <button className="btn-clinical btn-primary">Generate Report</button>
        </div>

        <div className="action-card">
          <div className="action-icon schedule"></div>
          <div className="action-content">
            <h3>Schedule Equipment Check</h3>
            <p>Your mask seal efficiency has decreased. Consider scheduling a fitting.</p>
          </div>
          <button className="btn-clinical btn-secondary">Schedule Now</button>
        </div>

        <div className="action-card premium">
          <div className="action-icon insights"></div>
          <div className="action-content">
            <h3>AI Sleep Coach</h3>
            <p>Get personalized recommendations to improve your therapy outcomes</p>
          </div>
          <button className="btn-clinical btn-primary">Unlock Premium</button>
        </div>
      </div>

      {/* Educational Content */}
      <div className="education-section">
        <h2 className="section-title">Understanding Your Metrics</h2>
        <div className="education-grid">
          <div className="education-card">
            <h4>AHI (Apnea-Hypopnea Index)</h4>
            <p>Events per hour. Goal: {'<'}5 for optimal therapy</p>
          </div>
          <div className="education-card">
            <h4>Compliance Rate</h4>
            <p>Usage ≥4 hours/night. Insurance typically requires 70%</p>
          </div>
          <div className="education-card">
            <h4>Leak Rate</h4>
            <p>Air leakage from mask. High leaks reduce therapy effectiveness</p>
          </div>
          <div className="education-card">
            <h4>Pressure Settings</h4>
            <p>Optimal pressure prevents apneas while maximizing comfort</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalDashboard;