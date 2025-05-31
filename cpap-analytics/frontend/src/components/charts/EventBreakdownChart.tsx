import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendData } from '../../types';

interface EventBreakdownChartProps {
  data: TrendData[];
  title?: string;
}

interface EventData {
  date: string;
  central_apneas: number;
  obstructive_apneas: number;
  hypopneas: number;
  total_events: number;
}

const EventBreakdownChart: React.FC<EventBreakdownChartProps> = ({ 
  data, 
  title = "Sleep Event Type Breakdown" 
}) => {
  const chartData = useMemo(() => {
    return data.map((item, index) => {
      // For mock data, derive event breakdown from AHI
      // In real implementation, this would come from actual event data
      const total_events = Math.round(item.ahi * item.duration_hours);
      const central_ratio = 0.15; // ~15% central events
      const obstructive_ratio = 0.45; // ~45% obstructive events
      const hypopnea_ratio = 0.40; // ~40% hypopneas
      
      const central_apneas = Math.round(total_events * central_ratio);
      const obstructive_apneas = Math.round(total_events * obstructive_ratio);
      const hypopneas = total_events - central_apneas - obstructive_apneas;

      return {
        date: new Date(item.date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        central_apneas,
        obstructive_apneas,
        hypopneas,
        total_events,
        ahi: item.ahi
      };
    }).reverse(); // Show oldest to newest
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
    if (chartData.length === 0) return { central: 0, obstructive: 0, hypopneas: 0, total: 0 };
    
    const totals = chartData.reduce((acc, item) => ({
      central: acc.central + item.central_apneas,
      obstructive: acc.obstructive + item.obstructive_apneas,
      hypopneas: acc.hypopneas + item.hypopneas,
      total: acc.total + item.total_events
    }), { central: 0, obstructive: 0, hypopneas: 0, total: 0 });

    return {
      central: Math.round(totals.central / chartData.length),
      obstructive: Math.round(totals.obstructive / chartData.length),
      hypopneas: Math.round(totals.hypopneas / chartData.length),
      total: Math.round(totals.total / chartData.length)
    };
  }, [chartData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-sm text-gray-700 mb-2">AHI: {data.ahi} events/hr</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="inline-block w-3 h-3 bg-red-500 rounded mr-2"></span>
              Central Apneas: <span className="font-semibold">{data.central_apneas}</span>
            </p>
            <p className="text-sm">
              <span className="inline-block w-3 h-3 bg-orange-500 rounded mr-2"></span>
              Obstructive Apneas: <span className="font-semibold">{data.obstructive_apneas}</span>
            </p>
            <p className="text-sm">
              <span className="inline-block w-3 h-3 bg-yellow-500 rounded mr-2"></span>
              Hypopneas: <span className="font-semibold">{data.hypopneas}</span>
            </p>
            <p className="text-sm font-medium border-t pt-1">
              Total Events: {data.total_events}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white to-orange-50 p-6 rounded-xl shadow-lg border border-orange-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="mt-2 text-sm text-gray-500">No event data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-orange-50 p-6 rounded-xl shadow-lg border border-orange-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <div className="text-right">
          <p className="text-sm text-gray-500">Avg Events/Night</p>
          <p className="text-xl font-semibold text-gray-900">
            {averages.total}
            <span className="text-sm text-gray-500 ml-1">total</span>
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
            label={{ value: 'Number of Events', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="central_apneas" 
            stackId="events"
            fill="#ef4444" 
            name="Central Apneas"
            radius={[0, 0, 0, 0]}
          />
          <Bar 
            dataKey="obstructive_apneas" 
            stackId="events"
            fill="#f97316" 
            name="Obstructive Apneas"
            radius={[0, 0, 0, 0]}
          />
          <Bar 
            dataKey="hypopneas" 
            stackId="events"
            fill="#eab308" 
            name="Hypopneas"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Event Type Statistics */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
            <span className="text-sm font-medium text-red-800">Central Apneas</span>
          </div>
          <p className="text-lg font-semibold text-red-900">{averages.central}/night</p>
          <p className="text-xs text-red-700">
            {averages.total > 0 ? Math.round((averages.central / averages.total) * 100) : 0}% of events
          </p>
        </div>
        
        <div className="text-center p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <div className="w-3 h-3 bg-orange-500 rounded mr-2"></div>
            <span className="text-sm font-medium text-orange-800">Obstructive Apneas</span>
          </div>
          <p className="text-lg font-semibold text-orange-900">{averages.obstructive}/night</p>
          <p className="text-xs text-orange-700">
            {averages.total > 0 ? Math.round((averages.obstructive / averages.total) * 100) : 0}% of events
          </p>
        </div>
        
        <div className="text-center p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
            <span className="text-sm font-medium text-yellow-800">Hypopneas</span>
          </div>
          <p className="text-lg font-semibold text-yellow-900">{averages.hypopneas}/night</p>
          <p className="text-xs text-yellow-700">
            {averages.total > 0 ? Math.round((averages.hypopneas / averages.total) * 100) : 0}% of events
          </p>
        </div>
      </div>

      {/* Clinical Insights */}
      <div className="mt-4 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-100">
        <h4 className="text-sm font-medium text-orange-800 mb-2">🩺 Clinical Insights</h4>
        <div className="space-y-1 text-sm text-orange-700">
          {averages.central / (averages.total || 1) > 0.5 && (
            <p>⚠️ High central apnea ratio detected. This may indicate central sleep apnea - consult your physician.</p>
          )}
          {averages.obstructive / (averages.total || 1) > 0.7 && (
            <p>🔍 Predominantly obstructive events. Consider mask fit optimization and sleeping position.</p>
          )}
          {averages.hypopneas / (averages.total || 1) > 0.6 && (
            <p>💡 Many hypopneas detected. Good - CPAP is preventing full apneas but airway resistance remains.</p>
          )}
          {averages.total < 5 && (
            <p>✅ Low event count overall. Your therapy is working well!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventBreakdownChart;