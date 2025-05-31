import React, { useMemo } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ReferenceLine } from 'recharts';
import { TrendData } from '../../types';

interface AHITrendChartProps {
  data: TrendData[];
  title?: string;
  showGoalLine?: boolean;
}

const AHITrendChart: React.FC<AHITrendChartProps> = ({ 
  data, 
  title = "AHI Trend Analysis", 
  showGoalLine = true 
}) => {
  const chartData = useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      originalDate: item.date,
      date: new Date(item.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      index: index,
      ahi_target: 5, // Target AHI for goal line
    })).reverse(); // Show oldest to newest
  }, [data]);

  // Calculate appropriate interval for X-axis ticks
  const tickInterval = useMemo(() => {
    const dataLength = chartData.length;
    if (dataLength <= 7) return 0; // Show all ticks
    if (dataLength <= 14) return 1; // Show every other tick
    if (dataLength <= 30) return Math.floor(dataLength / 6) - 1; // Show ~6 ticks
    return Math.floor(dataLength / 8) - 1; // Show ~8 ticks for larger datasets
  }, [chartData]);

  const averageAHI = useMemo(() => {
    if (data.length === 0) return 0;
    return Math.round((data.reduce((sum, item) => sum + item.ahi, 0) / data.length) * 10) / 10;
  }, [data]);

  const getAHIStatus = (ahi: number) => {
    if (ahi < 5) return { status: 'Excellent', color: '#10b981' };
    if (ahi < 15) return { status: 'Mild', color: '#f59e0b' };
    if (ahi < 30) return { status: 'Moderate', color: '#ef4444' };
    return { status: 'Severe', color: '#dc2626' };
  };

  const currentStatus = getAHIStatus(averageAHI);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const ahi = payload[0].value;
      const status = getAHIStatus(ahi);
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-gray-600 text-sm">{label}</p>
          <p className="font-semibold text-gray-900">
            AHI: <span style={{ color: status.color }}>{ahi} events/hr</span>
          </p>
          <p className="text-sm" style={{ color: status.color }}>
            Status: {status.status}
          </p>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-lg border border-blue-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="mt-2 text-sm text-gray-500">No trend data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-lg border border-blue-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">30-Day Average</p>
            <p className="text-xl font-semibold" style={{ color: currentStatus.color }}>
              {averageAHI}
              <span className="text-sm text-gray-500 ml-1">events/hr</span>
            </p>
            <p className="text-xs" style={{ color: currentStatus.color }}>
              {currentStatus.status}
            </p>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="ahiGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={currentStatus.color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={currentStatus.color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
            interval={tickInterval}
            angle={0}
            textAnchor="middle"
            height={60}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
            label={{ value: 'AHI (events/hr)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="ahi"
            stroke={currentStatus.color}
            strokeWidth={2}
            fill="url(#ahiGradient)"
            dot={{ fill: currentStatus.color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: currentStatus.color, strokeWidth: 2 }}
            animationDuration={1500}
            animationEasing="ease-in-out"
          />
          {showGoalLine && (
            <ReferenceLine
              y={5}
              stroke="#10b981"
              strokeDasharray="5 5"
              strokeWidth={2}
              label="Target AHI"
            />
          )}
          <Legend />
        </AreaChart>
      </ResponsiveContainer>

      {/* Insights */}
      <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        <h4 className="text-sm font-medium text-gray-700 mb-2">💡 Key Insights</h4>
        <div className="space-y-1 text-sm text-gray-600">
          {averageAHI < 5 && (
            <p>✅ Excellent therapy control! Your AHI is well within the optimal range.</p>
          )}
          {averageAHI >= 5 && averageAHI < 15 && (
            <p>⚠️ Mild sleep apnea detected. Consider reviewing mask fit and sleep position.</p>
          )}
          {averageAHI >= 15 && (
            <p>🔴 Elevated AHI levels. Consult your sleep specialist about therapy adjustments.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AHITrendChart;