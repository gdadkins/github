import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar, PieChart, Pie, Cell } from 'recharts';
import { Calendar, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Wind, Clock, Activity, Droplets, Info } from 'lucide-react';

const CPAPDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Sample data - in production, this would come from the Python backend
  const sessionData = [
    { date: '2024-01-20', ahi: 2.3, leak95: 18, pressure95: 12.5, duration: 7.2, quality: 92 },
    { date: '2024-01-21', ahi: 3.1, leak95: 22, pressure95: 12.8, duration: 6.8, quality: 85 },
    { date: '2024-01-22', ahi: 1.8, leak95: 15, pressure95: 12.3, duration: 7.5, quality: 95 },
    { date: '2024-01-23', ahi: 2.5, leak95: 19, pressure95: 12.6, duration: 7.1, quality: 90 },
    { date: '2024-01-24', ahi: 4.2, leak95: 28, pressure95: 13.1, duration: 6.5, quality: 78 },
    { date: '2024-01-25', ahi: 2.0, leak95: 16, pressure95: 12.4, duration: 7.3, quality: 94 },
    { date: '2024-01-26', ahi: 1.5, leak95: 14, pressure95: 12.2, duration: 7.8, quality: 97 },
  ];

  const maskFitData = {
    avgLeak95: 18.7,
    leakVariance: 25.3,
    highLeakPercentage: 14.3,
    maskFitScore: 85,
    problemHours: ['02:00', '03:00', '04:00'],
    recommendations: [
      "Leaks increase during deep sleep - mask may shift with REM sleep movement",
      "Try a mask with better stability like ResMed F30i or DreamWear",
      "Consider using mask liners to improve seal"
    ]
  };

  const leakPatternData = [
    { hour: '22:00', leak: 12 },
    { hour: '23:00', leak: 14 },
    { hour: '00:00', leak: 16 },
    { hour: '01:00', leak: 18 },
    { hour: '02:00', leak: 24 },
    { hour: '03:00', leak: 28 },
    { hour: '04:00', leak: 26 },
    { hour: '05:00', leak: 20 },
    { hour: '06:00', leak: 15 },
  ];

  const latestSession = sessionData[sessionData.length - 1];
  const avgAHI = (sessionData.reduce((sum, s) => sum + s.ahi, 0) / sessionData.length).toFixed(1);
  const avgQuality = (sessionData.reduce((sum, s) => sum + s.quality, 0) / sessionData.length).toFixed(0);

  const MetricCard = ({ icon: Icon, label, value, unit, trend, status }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Icon className="h-5 w-5 text-gray-600 mr-2" />
          <span className="text-sm font-medium text-gray-600">{label}</span>
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${trend > 0 ? 'text-red-500' : 'text-green-500'}`}>
            {trend > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="flex items-baseline">
        <span className="text-3xl font-bold">{value}</span>
        <span className="text-gray-500 ml-2">{unit}</span>
      </div>
      {status && (
        <div className={`mt-2 text-sm ${status === 'good' ? 'text-green-600' : status === 'warning' ? 'text-yellow-600' : 'text-red-600'}`}>
          {status === 'good' ? <CheckCircle className="inline h-4 w-4 mr-1" /> : <AlertTriangle className="inline h-4 w-4 mr-1" />}
          {status === 'good' ? 'Excellent' : status === 'warning' ? 'Monitor' : 'Needs Attention'}
        </div>
      )}
    </div>
  );

  const QualityGauge = ({ score }) => {
    const data = [{ name: 'Quality', value: score, fill: score > 80 ? '#10b981' : score > 60 ? '#f59e0b' : '#ef4444' }];
    
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Therapy Quality Score</h3>
        <ResponsiveContainer width="100%" height={200}>
          <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={data}>
            <RadialBar dataKey="value" cornerRadius={10} fill={data[0].fill} />
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold">
              {score}%
            </text>
          </RadialBarChart>
        </ResponsiveContainer>
        <p className="text-center text-sm text-gray-600 mt-2">
          Based on AHI, leak rate, and usage time
        </p>
      </div>
    );
  };

  const TabButton = ({ id, label, icon: Icon, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center px-4 py-2 font-medium rounded-lg transition-colors ${
        active ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CPAP Therapy Dashboard</h1>
          <p className="text-gray-600">Real-time insights for your ResMed AirSense 10</p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-2">
            <TabButton id="overview" label="Overview" icon={Activity} active={activeTab === 'overview'} onClick={setActiveTab} />
            <TabButton id="trends" label="Trends" icon={TrendingUp} active={activeTab === 'trends'} onClick={setActiveTab} />
            <TabButton id="mask" label="Mask Fit" icon={Wind} active={activeTab === 'mask'} onClick={setActiveTab} />
          </div>
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard 
                icon={Activity} 
                label="AHI (Events/Hour)" 
                value={latestSession.ahi} 
                unit=""
                trend={-12}
                status={latestSession.ahi < 5 ? 'good' : latestSession.ahi < 15 ? 'warning' : 'bad'}
              />
              <MetricCard 
                icon={Wind} 
                label="Mask Leak (95%)" 
                value={latestSession.leak95} 
                unit="L/min"
                trend={8}
                status={latestSession.leak95 < 24 ? 'good' : 'warning'}
              />
              <MetricCard 
                icon={Clock} 
                label="Usage Time" 
                value={latestSession.duration} 
                unit="hours"
                status={latestSession.duration > 7 ? 'good' : latestSession.duration > 4 ? 'warning' : 'bad'}
              />
              <MetricCard 
                icon={Droplets} 
                label="Pressure (95%)" 
                value={latestSession.pressure95} 
                unit="cmH₂O"
                status="good"
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Quality Gauge */}
              <QualityGauge score={parseInt(avgQuality)} />

              {/* AHI Trend */}
              <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4">AHI Trend</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={sessionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="ahi" stroke="#3b82f6" fill="#93bbfc" />
                    <Line type="monotone" dataKey="ahi" stroke="#1e40af" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Sessions</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Date</th>
                      <th className="text-left py-2">Duration</th>
                      <th className="text-left py-2">AHI</th>
                      <th className="text-left py-2">Leak</th>
                      <th className="text-left py-2">Quality</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessionData.slice(-5).reverse().map((session, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="py-3">{session.date}</td>
                        <td className="py-3">{session.duration}h</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded text-sm ${
                            session.ahi < 5 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {session.ahi}
                          </span>
                        </td>
                        <td className="py-3">{session.leak95} L/min</td>
                        <td className="py-3">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  session.quality > 80 ? 'bg-green-500' : session.quality > 60 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${session.quality}%` }}
                              />
                            </div>
                            <span className="text-sm">{session.quality}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">AHI vs Leak Correlation</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sessionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="ahi" stroke="#3b82f6" name="AHI" />
                  <Line yAxisId="right" type="monotone" dataKey="leak95" stroke="#ef4444" name="Leak (L/min)" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Usage Duration Pattern</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sessionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="duration" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Mask Fit Tab */}
        {activeTab === 'mask' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Mask Fit Score</h3>
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2" style={{ color: maskFitData.maskFitScore > 80 ? '#10b981' : '#f59e0b' }}>
                    {maskFitData.maskFitScore}
                  </div>
                  <p className="text-gray-600">out of 100</p>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average Leak:</span>
                    <span className="font-medium">{maskFitData.avgLeak95} L/min</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>High Leak Sessions:</span>
                    <span className="font-medium">{maskFitData.highLeakPercentage}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Leak Pattern by Hour</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={leakPatternData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="leak" stroke="#ef4444" fill="#fca5a5" />
                  </AreaChart>
                </ResponsiveContainer>
                <p className="text-sm text-gray-600 mt-2">
                  Red zone indicates leak rates above 24 L/min threshold
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Info className="h-5 w-5 mr-2 text-blue-500" />
                Personalized Mask Recommendations
              </h3>
              <div className="space-y-4">
                {maskFitData.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{rec}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Recommended Masks Based on Your Data:</h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• ResMed F30i - Full face with top-of-head tube connection</li>
                  <li>• Philips DreamWear Full Face - Minimal contact design</li>
                  <li>• ResMed AirFit F20 - Traditional full face with excellent seal</li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CPAPDashboard;