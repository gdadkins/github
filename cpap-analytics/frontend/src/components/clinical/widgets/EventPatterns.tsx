import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import './EventPatterns.css';

interface EventPatternsProps {
  data?: any;
}

const EventPatterns: React.FC<EventPatternsProps> = ({ data }) => {
  // Calculate event distribution
  const getEventDistribution = () => {
    if (!data?.trends || data.trends.length === 0) {
      return [];
    }

    let totalCentral = 0;
    let totalObstructive = 0;
    let totalHypopnea = 0;

    data.trends.forEach((day: any) => {
      if (day.events) {
        totalCentral += day.events.central || 0;
        totalObstructive += day.events.obstructive || 0;
        totalHypopnea += day.events.hypopnea || 0;
      }
    });

    const total = totalCentral + totalObstructive + totalHypopnea;
    if (total === 0) {
      return [
        { name: 'No Events', value: 100, color: 'var(--status-optimal)' }
      ];
    }

    return [
      { 
        name: 'Central Apneas', 
        value: Math.round((totalCentral / total) * 100),
        count: totalCentral,
        color: 'var(--chart-central)' 
      },
      { 
        name: 'Obstructive Apneas', 
        value: Math.round((totalObstructive / total) * 100),
        count: totalObstructive,
        color: 'var(--chart-obstructive)' 
      },
      { 
        name: 'Hypopneas', 
        value: Math.round((totalHypopnea / total) * 100),
        count: totalHypopnea,
        color: 'var(--chart-hypopnea)' 
      }
    ].filter(item => item.value > 0);
  };

  // Get time-based patterns
  const getTimePatterns = () => {
    if (!data?.trends || data.trends.length === 0) {
      return { earlyNight: 0, midNight: 0, lateNight: 0 };
    }

    // Simulated time-based data (in real app, would come from detailed session data)
    return {
      earlyNight: 35,
      midNight: 45,
      lateNight: 20
    };
  };

  const eventDistribution = getEventDistribution();
  const timePatterns = getTimePatterns();
  const totalEvents = eventDistribution.reduce((sum, event) => sum + (event.count || 0), 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{payload[0].name}</p>
          <p className="tooltip-value">{payload[0].value}%</p>
          {payload[0].payload.count && (
            <p className="tooltip-count">{payload[0].payload.count} events</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="event-patterns clinical-card">
      <div className="widget-header">
        <h3 className="widget-title">Event Patterns</h3>
        <span className="total-events">{totalEvents} total events</span>
      </div>

      <div className="event-distribution">
        <h4>Event Type Distribution</h4>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={eventDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {eventDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="chart-center">
            <div className="center-value">{data?.summary?.avgAHI?.toFixed(1) || '0'}</div>
            <div className="center-label">Avg AHI</div>
          </div>
        </div>
        
        <div className="event-legend">
          {eventDistribution.map((event) => (
            <div key={event.name} className="legend-item">
              <span className="legend-color" style={{ backgroundColor: event.color }}></span>
              <span className="legend-label">{event.name}</span>
              <span className="legend-value">{event.value}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="time-patterns">
        <h4>When Events Occur</h4>
        <div className="time-bars">
          <div className="time-bar">
            <div className="bar-label">Early Night (10PM-1AM)</div>
            <div className="bar-container">
              <div 
                className="bar-fill"
                style={{ width: `${timePatterns.earlyNight}%` }}
              ></div>
            </div>
            <div className="bar-value">{timePatterns.earlyNight}%</div>
          </div>
          <div className="time-bar">
            <div className="bar-label">Mid Night (1AM-4AM)</div>
            <div className="bar-container">
              <div 
                className="bar-fill high"
                style={{ width: `${timePatterns.midNight}%` }}
              ></div>
            </div>
            <div className="bar-value">{timePatterns.midNight}%</div>
          </div>
          <div className="time-bar">
            <div className="bar-label">Late Night (4AM-7AM)</div>
            <div className="bar-container">
              <div 
                className="bar-fill"
                style={{ width: `${timePatterns.lateNight}%` }}
              ></div>
            </div>
            <div className="bar-value">{timePatterns.lateNight}%</div>
          </div>
        </div>
      </div>

      <div className="pattern-insights">
        <h4>Pattern Analysis</h4>
        <p className="insight-text">
          {timePatterns.midNight > 40 && 'Most events occur during REM sleep phases (1-4 AM).'}
          {eventDistribution.find(e => e.name === 'Central Apneas' && e.value > 30) && 
            ' High central apnea ratio may indicate pressure settings need adjustment.'}
          {totalEvents === 0 && 'Excellent! No significant events detected.'}
        </p>
      </div>
    </div>
  );
};

export default EventPatterns;