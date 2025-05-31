import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './TrendAnalysis.css';

interface TrendAnalysisProps {
  data?: any;
  dateRange?: number;
}

const TrendAnalysis: React.FC<TrendAnalysisProps> = ({ data, dateRange = 30 }) => {
  // Prepare chart data
  const getChartData = () => {
    if (!data?.trends || data.trends.length === 0) {
      return [];
    }

    return data.trends.slice(-dateRange).map((day: any) => ({
      date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      ahi: day.ahi,
      usage: day.usageHours,
      pressure: day.pressure || 10,
      leakRate: day.leakRate || 0
    }));
  };

  // Calculate trend direction
  const calculateTrend = (metric: 'ahi' | 'usage' | 'pressure' | 'leakRate') => {
    if (!data?.trends || data.trends.length < 2) return 'stable';
    
    const recent = data.trends.slice(-7);
    const older = data.trends.slice(-14, -7);
    
    const recentAvg = recent.reduce((sum: number, day: any) => sum + (day[metric] || 0), 0) / recent.length;
    const olderAvg = older.reduce((sum: number, day: any) => sum + (day[metric] || 0), 0) / older.length;
    
    const change = ((recentAvg - olderAvg) / olderAvg) * 100;
    
    if (Math.abs(change) < 5) return 'stable';
    if (metric === 'ahi' || metric === 'leakRate') {
      return change > 0 ? 'worsening' : 'improving';
    } else {
      return change > 0 ? 'improving' : 'worsening';
    }
  };

  const chartData = getChartData();

  const metrics = [
    {
      key: 'ahi',
      label: 'AHI Trend',
      value: data?.summary?.avgAHI?.toFixed(1) || '—',
      unit: 'events/hr',
      trend: calculateTrend('ahi'),
      color: 'var(--chart-ahi)'
    },
    {
      key: 'usage',
      label: 'Usage Hours',
      value: data?.summary?.avgUsageHours?.toFixed(1) || '—',
      unit: 'hours',
      trend: calculateTrend('usage'),
      color: 'var(--chart-usage)'
    },
    {
      key: 'pressure',
      label: 'Avg Pressure',
      value: '10.5',
      unit: 'cmH₂O',
      trend: calculateTrend('pressure'),
      color: 'var(--chart-pressure)'
    },
    {
      key: 'leakRate',
      label: 'Leak Rate',
      value: '12',
      unit: 'L/min',
      trend: calculateTrend('leakRate'),
      color: 'var(--chart-leak)'
    }
  ];

  return (
    <div className="trend-analysis clinical-card">
      <div className="widget-header">
        <h3 className="widget-title">Trend Analysis</h3>
        <select className="trend-selector">
          <option value="all">All Metrics</option>
          <option value="ahi">AHI Only</option>
          <option value="usage">Usage Only</option>
          <option value="pressure">Pressure Only</option>
        </select>
      </div>

      <div className="trend-metrics">
        {metrics.map((metric) => (
          <div key={metric.key} className="metric-card">
            <div className="metric-header">
              <span className="metric-label">{metric.label}</span>
              <span className={`trend-indicator ${metric.trend}`}>
                {metric.trend === 'improving' && '↑'}
                {metric.trend === 'worsening' && '↓'}
                {metric.trend === 'stable' && '→'}
              </span>
            </div>
            <div className="metric-value">
              {metric.value}
              <span className="metric-unit">{metric.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="trend-chart">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--clinical-border-light)" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              stroke="var(--text-tertiary)"
            />
            <YAxis 
              yAxisId="left"
              tick={{ fontSize: 12 }}
              stroke="var(--text-tertiary)"
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              stroke="var(--text-tertiary)"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'var(--clinical-bg-secondary)',
                border: '1px solid var(--clinical-border)',
                borderRadius: 'var(--radius-md)'
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="ahi" 
              stroke="var(--chart-ahi)" 
              strokeWidth={2}
              dot={{ r: 3 }}
              name="AHI"
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="usage" 
              stroke="var(--chart-usage)" 
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Usage Hours"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="pressure" 
              stroke="var(--chart-pressure)" 
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Pressure"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="trend-insights">
        <h4>Key Insights</h4>
        <ul>
          {calculateTrend('ahi') === 'improving' && <li className="insight positive">AHI is improving - therapy is effective</li>}
          {calculateTrend('ahi') === 'worsening' && <li className="insight negative">AHI is increasing - consider adjusting settings</li>}
          {calculateTrend('usage') === 'worsening' && <li className="insight negative">Usage hours declining - check comfort settings</li>}
          {data?.summary?.avgUsageHours < 4 && <li className="insight warning">Average usage below insurance requirement</li>}
        </ul>
      </div>
    </div>
  );
};

export default TrendAnalysis;