import React from 'react';
import { WIDGET_CATEGORIES, WIDGET_SIZES, WidgetCategory, WidgetSize } from '../constants/dashboard';

// Import critical widgets normally for immediate loading
import { QuickMetrics } from '../components/widgets/therapy';
import TherapyEffectivenessScore from '../components/widgets/analytics/TherapyEffectivenessScore';
import MaskFitAnalytics from '../components/widgets/analytics/MaskFitAnalytics';
import AHITrendChart from '../components/charts/AHITrendChart';
import SleepQualityChart from '../components/charts/SleepQualityChart';
import EventBreakdownChart from '../components/charts/EventBreakdownChart';
import ComplianceHeatmap from '../components/charts/ComplianceHeatmap';
import SmartInsights from '../components/SmartInsights';

// Import optional widgets with lazy loading
const PressureOptimization = React.lazy(() => import('../components/widgets/analytics/PressureOptimization'));
const SleepStageAnalysis = React.lazy(() => import('../components/widgets/analytics/SleepStageAnalysis'));
const TravelMode = React.lazy(() => import('../components/widgets/lifestyle/TravelMode'));
const ClinicalReports = React.lazy(() => import('../components/widgets/reports/ClinicalReports'));
const GoalsTracker = React.lazy(() => import('../components/widgets/compliance/GoalsTracker'));
const NotificationCenter = React.lazy(() => import('../components/widgets/compliance/NotificationCenter'));

export interface WidgetConfig {
  id: string;
  component: React.ComponentType<any>;
  title: string;
  description: string;
  size: WidgetSize;
  category: WidgetCategory;
  isPremium?: boolean;
  props: Record<string, any>;
}

export const getWidgetConfigs = (dashboardData: any, dateRange: string, userId: number): WidgetConfig[] => {
  if (!dashboardData) return [];

  return [
    {
      id: 'quick-metrics',
      component: QuickMetrics,
      title: 'Quick Metrics',
      description: 'At-a-glance view of your key therapy metrics',
      size: WIDGET_SIZES.FULL,
      category: WIDGET_CATEGORIES.CRITICAL,
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
      size: WIDGET_SIZES.MEDIUM,
      category: WIDGET_CATEGORIES.CRITICAL,
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
      size: WIDGET_SIZES.MEDIUM,
      category: WIDGET_CATEGORIES.PRIMARY,
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
      size: WIDGET_SIZES.LARGE,
      category: WIDGET_CATEGORIES.PRIMARY,
      props: {}
    },
    {
      id: 'ahi-trends',
      component: AHITrendChart,
      title: 'AHI Trends',
      description: 'Apnea-Hypopnea Index trending over time',
      size: WIDGET_SIZES.MEDIUM,
      category: WIDGET_CATEGORIES.PRIMARY,
      props: {
        data: dashboardData.analytics?.trends || []
      }
    },
    {
      id: 'sleep-quality',
      component: SleepQualityChart,
      title: 'Sleep Quality',
      description: 'Sleep quality metrics and patterns',
      size: WIDGET_SIZES.MEDIUM,
      category: WIDGET_CATEGORIES.SECONDARY,
      props: {
        data: dashboardData.analytics?.trends || []
      }
    },
    {
      id: 'compliance-heatmap',
      component: ComplianceHeatmap,
      title: 'Compliance Calendar',
      description: 'Visual compliance tracking calendar',
      size: WIDGET_SIZES.LARGE,
      category: WIDGET_CATEGORIES.PRIMARY,
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
      size: WIDGET_SIZES.MEDIUM,
      category: WIDGET_CATEGORIES.SECONDARY,
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
      size: WIDGET_SIZES.LARGE,
      category: WIDGET_CATEGORIES.OPTIONAL,
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
      size: WIDGET_SIZES.MEDIUM,
      category: WIDGET_CATEGORIES.SECONDARY,
      props: {
        data: dashboardData.analytics?.trends || []
      }
    },
    {
      id: 'goals-tracker',
      component: GoalsTracker,
      title: 'Goals & Progress',
      description: 'Track your therapy goals and achievements',
      size: WIDGET_SIZES.MEDIUM,
      category: WIDGET_CATEGORIES.PRIMARY,
      props: {
        userId
      }
    },
    {
      id: 'travel-mode',
      component: TravelMode,
      title: 'Travel Analytics',
      description: 'Special analytics for travel and timezone changes',
      size: WIDGET_SIZES.SMALL,
      category: WIDGET_CATEGORIES.OPTIONAL,
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
      size: WIDGET_SIZES.SMALL,
      category: WIDGET_CATEGORIES.OPTIONAL,
      isPremium: true,
      props: {
        userId
      }
    },
    {
      id: 'notifications',
      component: NotificationCenter,
      title: 'Notifications',
      description: 'Important alerts and notifications',
      size: WIDGET_SIZES.SMALL,
      category: WIDGET_CATEGORIES.CRITICAL,
      props: {
        userId
      }
    }
  ];
};

export const getLayoutConfigs = (widgets: WidgetConfig[]) => ({
  default: widgets,
  'compliance-focused': widgets.filter(w => 
    ['quick-metrics', 'compliance-heatmap', 'goals-tracker', 'notifications', 'smart-insights', 'therapy-effectiveness'].includes(w.id)
  ),
  'clinical-detail': widgets.filter(w => 
    ['therapy-effectiveness', 'mask-fit', 'pressure-optimization', 'clinical-reports'].includes(w.id)
  ),
  minimalist: widgets.filter(w => 
    ['quick-metrics', 'ahi-trends', 'smart-insights'].includes(w.id)
  ),
  'data-enthusiast': widgets // All widgets
});