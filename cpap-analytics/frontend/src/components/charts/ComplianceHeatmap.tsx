import React, { useMemo } from 'react';
import { TrendData } from '../../types';

interface ComplianceHeatmapProps {
  data: TrendData[];
  title?: string;
  months?: number;
}

const ComplianceHeatmap: React.FC<ComplianceHeatmapProps> = ({ 
  data, 
  title = "Daily Compliance Calendar",
  months = 3
}) => {
  const calendarData = useMemo(() => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth() - months + 1, 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    // Create calendar grid
    const weeks = [];
    const currentDate = new Date(startDate);
    
    // Align to start of week (Sunday)
    currentDate.setDate(currentDate.getDate() - currentDate.getDay());
    
    while (currentDate <= endDate) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const sessionData = data.find(d => d.date === dateStr);
        
        week.push({
          date: new Date(currentDate),
          dateStr,
          duration: sessionData?.duration_hours || 0,
          hasData: !!sessionData,
          isCurrentMonth: currentDate >= startDate && currentDate <= endDate
        });
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      weeks.push(week);
    }
    
    return weeks;
  }, [data, months]);

  const getComplianceColor = (duration: number, hasData: boolean) => {
    if (!hasData) return 'bg-gray-100';
    if (duration >= 7) return 'bg-green-500'; // Excellent
    if (duration >= 6) return 'bg-green-400'; // Good
    if (duration >= 4) return 'bg-yellow-400'; // Medicare compliant
    if (duration > 0) return 'bg-red-400'; // Poor
    return 'bg-red-500'; // No usage
  };

  const getComplianceLevel = (duration: number) => {
    if (duration >= 7) return 'Excellent (7+ hrs)';
    if (duration >= 6) return 'Good (6-7 hrs)';
    if (duration >= 4) return 'Compliant (4-6 hrs)';
    if (duration > 0) return 'Poor (<4 hrs)';
    return 'No usage';
  };

  const stats = useMemo(() => {
    const validDays = data.filter(d => d.duration_hours > 0);
    const compliantDays = validDays.filter(d => d.duration_hours >= 4);
    const excellentDays = validDays.filter(d => d.duration_hours >= 7);
    
    return {
      totalDays: data.length,
      usageDays: validDays.length,
      complianceRate: data.length > 0 ? Math.round((compliantDays.length / data.length) * 100) : 0,
      excellenceRate: data.length > 0 ? Math.round((excellentDays.length / data.length) * 100) : 0,
      avgUsage: validDays.length > 0 ? 
        Math.round((validDays.reduce((sum, d) => sum + d.duration_hours, 0) / validDays.length) * 10) / 10 : 0
    };
  }, [data]);

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const today = new Date().toDateString();

  return (
    <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-xl shadow-lg border border-green-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <div className="text-right">
          <p className="text-sm text-gray-500">Compliance Rate</p>
          <p className={`text-xl font-semibold ${
            stats.complianceRate >= 70 ? 'text-green-600' : 
            stats.complianceRate >= 50 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {stats.complianceRate}%
          </p>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="mb-6">
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day, index) => (
            <div key={index} className="text-center text-sm font-medium text-gray-500 p-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar weeks */}
        <div className="space-y-1">
          {calendarData.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1">
              {week.map((day, dayIndex) => {
                const isToday = day.date.toDateString() === today;
                return (
                  <div
                    key={dayIndex}
                    className={`
                      relative aspect-square flex items-center justify-center text-sm rounded cursor-pointer
                      transition-all duration-200 hover:scale-110 hover:z-10
                      ${getComplianceColor(day.duration, day.hasData)}
                      ${day.isCurrentMonth ? 'opacity-100' : 'opacity-30'}
                      ${isToday ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                    `}
                    title={`${day.date.toLocaleDateString()}: ${
                      day.hasData ? `${day.duration}h - ${getComplianceLevel(day.duration)}` : 'No data'
                    }`}
                  >
                    <span className={`font-medium ${
                      day.duration >= 4 ? 'text-white' : 'text-gray-700'
                    }`}>
                      {day.date.getDate()}
                    </span>
                    {isToday && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Usage Hours</p>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-100 rounded mr-1"></div>
            <span className="text-gray-600">No data</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded mr-1"></div>
            <span className="text-gray-600">0h</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-400 rounded mr-1"></div>
            <span className="text-gray-600">&lt;4h</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-400 rounded mr-1"></div>
            <span className="text-gray-600">4-6h</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-400 rounded mr-1"></div>
            <span className="text-gray-600">6-7h</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
            <span className="text-gray-600">7+h</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-500">Avg Usage</p>
          <p className="text-lg font-semibold text-gray-900">{stats.avgUsage}h</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Usage Days</p>
          <p className="text-lg font-semibold text-gray-900">{stats.usageDays}/{stats.totalDays}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Compliance</p>
          <p className={`text-lg font-semibold ${
            stats.complianceRate >= 70 ? 'text-green-600' : 
            stats.complianceRate >= 50 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {stats.complianceRate}%
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Excellence</p>
          <p className={`text-lg font-semibold ${
            stats.excellenceRate >= 50 ? 'text-green-600' : 
            stats.excellenceRate >= 25 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {stats.excellenceRate}%
          </p>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
        <h4 className="text-sm font-medium text-green-800 mb-2">📋 Compliance Insights</h4>
        <div className="space-y-1 text-sm text-green-700">
          {stats.complianceRate >= 70 && (
            <p>✅ Excellent compliance! You're meeting insurance requirements consistently.</p>
          )}
          {stats.complianceRate >= 50 && stats.complianceRate < 70 && (
            <p>⚠️ Moderate compliance. Try to use your CPAP for at least 4 hours per night.</p>
          )}
          {stats.complianceRate < 50 && (
            <p>🚨 Low compliance detected. Contact your provider for support and guidance.</p>
          )}
          {stats.excellenceRate >= 50 && (
            <p>⭐ Outstanding! You're achieving 7+ hours most nights.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplianceHeatmap;