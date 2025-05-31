import React, { useMemo } from 'react';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Line } from 'recharts';
import { TrendData } from '../../types';

interface SleepQualityChartProps {
  data: TrendData[];
  title?: string;
}

const SleepQualityChart: React.FC<SleepQualityChartProps> = ({ 
  data, 
  title = "Sleep Quality & Duration Trends" 
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
      quality_color: item.quality_score >= 80 ? '#10b981' : item.quality_score >= 60 ? '#f59e0b' : '#ef4444',
      duration_target: 7, // Target sleep duration
    })).reverse();
  }, [data]);

  // Calculate appropriate interval for X-axis ticks
  const tickInterval = useMemo(() => {
    const dataLength = chartData.length;
    if (dataLength <= 7) return 0; // Show all ticks
    if (dataLength <= 14) return 1; // Show every other tick
    if (dataLength <= 30) return Math.floor(dataLength / 6) - 1; // Show ~6 ticks
    return Math.floor(dataLength / 8) - 1; // Show ~8 ticks for larger datasets
  }, [chartData]);

  const averages = useMemo(() => {
    if (data.length === 0) return { quality: 0, duration: 0 };
    return {
      quality: Math.round(data.reduce((sum, item) => sum + item.quality_score, 0) / data.length),
      duration: Math.round((data.reduce((sum, item) => sum + item.duration_hours, 0) / data.length) * 10) / 10
    };
  }, [data]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const quality = payload.find((p: any) => p.dataKey === 'quality_score')?.value;
      const duration = payload.find((p: any) => p.dataKey === 'duration_hours')?.value;
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          {quality && (
            <p className="text-sm">
              Quality Score: <span className="font-semibold">{quality}%</span>
            </p>
          )}
          {duration && (
            <p className="text-sm">
              Sleep Duration: <span className="font-semibold">{duration} hrs</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white to-indigo-50 p-6 rounded-xl shadow-lg border border-indigo-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          <p className="mt-2 text-sm text-gray-500">No quality data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-indigo-50 p-6 rounded-xl shadow-lg border border-indigo-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <div className="flex space-x-6">
          <div className="text-right">
            <p className="text-sm text-gray-500">Avg Quality</p>
            <p className={`text-xl font-semibold ${
              averages.quality >= 80 ? 'text-green-600' : 
              averages.quality >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {averages.quality}%
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Avg Duration</p>
            <p className={`text-xl font-semibold ${
              averages.duration >= 7 ? 'text-green-600' : 
              averages.duration >= 4 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {averages.duration}h
            </p>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={chartData}>
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
            yAxisId="quality"
            orientation="left"
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
            label={{ value: 'Quality (%)', angle: -90, position: 'insideLeft' }}
            domain={[0, 100]}
          />
          <YAxis 
            yAxisId="duration"
            orientation="right"
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
            label={{ value: 'Duration (hrs)', angle: 90, position: 'insideRight' }}
            domain={[0, 12]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            yAxisId="quality"
            dataKey="quality_score" 
            fill="#3b82f6" 
            fillOpacity={0.7}
            name="Quality Score (%)"
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
            animationEasing="ease-in-out"
          />
          <Line 
            yAxisId="duration"
            type="monotone" 
            dataKey="duration_hours" 
            stroke="#10b981" 
            strokeWidth={3}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            name="Duration (hrs)"
            animationDuration={1500}
            animationEasing="ease-in-out"
          />
          <Legend />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Quality Insights */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
          <h4 className="text-sm font-medium text-blue-800 mb-2">📊 Quality Insights</h4>
          <div className="space-y-1 text-sm text-blue-700">
            {averages.quality >= 80 && (
              <p>✨ Excellent sleep quality! Keep up the great work.</p>
            )}
            {averages.quality >= 60 && averages.quality < 80 && (
              <p>🔍 Good quality with room for improvement. Check mask fit and comfort.</p>
            )}
            {averages.quality < 60 && (
              <p>⚠️ Quality concerns detected. Review equipment and consult your provider.</p>
            )}
          </div>
        </div>
        
        <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
          <h4 className="text-sm font-medium text-green-800 mb-2">⏰ Duration Insights</h4>
          <div className="space-y-1 text-sm text-green-700">
            {averages.duration >= 7 && (
              <p>✅ Great sleep duration! Meeting recommended 7+ hours.</p>
            )}
            {averages.duration >= 4 && averages.duration < 7 && (
              <p>🔸 Meeting insurance requirements but aim for 7+ hours nightly.</p>
            )}
            {averages.duration < 4 && (
              <p>🚨 Below insurance compliance threshold. Increase nightly usage.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SleepQualityChart;