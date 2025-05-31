import React from 'react';
import './EquipmentHealth.css';

interface EquipmentHealthProps {
  data?: any;
}

const EquipmentHealth: React.FC<EquipmentHealthProps> = ({ data }) => {
  // Calculate equipment health metrics
  const calculateEquipmentHealth = () => {
    // Simulated equipment data (in real app, would come from device data)
    const currentDate = new Date();
    const maskAge = 92; // days
    const filterAge = 45; // days
    const tubeAge = 180; // days
    const machineHours = 4380; // total hours
    
    // Calculate health scores
    const maskHealth = Math.max(0, 100 - (maskAge / 90) * 100);
    const filterHealth = Math.max(0, 100 - (filterAge / 30) * 100);
    const tubeHealth = Math.max(0, 100 - (tubeAge / 365) * 100);
    const machineHealth = 85; // Based on various factors
    
    return {
      mask: {
        health: maskHealth,
        age: maskAge,
        maxAge: 90,
        status: maskHealth > 20 ? 'good' : 'replace',
        nextReplace: Math.max(0, 90 - maskAge)
      },
      filter: {
        health: filterHealth,
        age: filterAge,
        maxAge: 30,
        status: filterHealth > 20 ? 'good' : 'replace',
        nextReplace: Math.max(0, 30 - filterAge)
      },
      tube: {
        health: tubeHealth,
        age: tubeAge,
        maxAge: 365,
        status: tubeHealth > 20 ? 'good' : 'check',
        nextReplace: Math.max(0, 365 - tubeAge)
      },
      machine: {
        health: machineHealth,
        hours: machineHours,
        status: 'good',
        lastService: '3 months ago'
      }
    };
  };

  // Calculate average leak rate
  const getLeakRate = () => {
    if (!data?.trends || data.trends.length === 0) return 'Unknown';
    
    const recentDays = data.trends.slice(-7);
    const avgLeak = recentDays.reduce((sum: number, day: any) => 
      sum + (day.leakRate || 0), 0) / recentDays.length;
    
    return avgLeak.toFixed(1);
  };

  const equipment = calculateEquipmentHealth();
  const leakRate = getLeakRate();
  const leakStatus = parseFloat(leakRate) < 24 ? 'good' : 'high';

  const getHealthColor = (health: number) => {
    if (health > 70) return 'var(--status-optimal)';
    if (health > 30) return 'var(--status-warning)';
    return 'var(--status-critical)';
  };

  const components = [
    {
      name: 'Mask',
      icon: '😷',
      ...equipment.mask,
      recommendation: equipment.mask.status === 'replace' ? 
        'Replace soon for optimal seal' : 
        `Replace in ${equipment.mask.nextReplace} days`
    },
    {
      name: 'Filter',
      icon: '🔲',
      ...equipment.filter,
      recommendation: equipment.filter.status === 'replace' ? 
        'Replace immediately' : 
        `Replace in ${equipment.filter.nextReplace} days`
    },
    {
      name: 'Tubing',
      icon: '〰️',
      ...equipment.tube,
      recommendation: equipment.tube.status === 'check' ? 
        'Inspect for wear' : 
        `Good for ${equipment.tube.nextReplace} more days`
    }
  ];

  return (
    <div className="equipment-health clinical-card">
      <div className="widget-header">
        <h3 className="widget-title">Equipment Health</h3>
        <button className="action-button">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
          View Details
        </button>
      </div>

      <div className="machine-status">
        <div className="status-header">
          <span className="status-label">CPAP Machine</span>
          <span className={`status-badge ${equipment.machine.status}`}>
            {equipment.machine.status.toUpperCase()}
          </span>
        </div>
        <div className="status-details">
          <div className="detail-item">
            <span className="detail-label">Total Hours</span>
            <span className="detail-value">{equipment.machine.hours.toLocaleString()}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Last Service</span>
            <span className="detail-value">{equipment.machine.lastService}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Avg Leak Rate</span>
            <span className={`detail-value ${leakStatus}`}>
              {leakRate} L/min
            </span>
          </div>
        </div>
      </div>

      <div className="components-list">
        {components.map((component) => (
          <div key={component.name} className="component-item">
            <div className="component-header">
              <div className="component-icon">{component.icon}</div>
              <div className="component-info">
                <h4 className="component-name">{component.name}</h4>
                <p className="component-age">{component.age} days old</p>
              </div>
              <div className="component-health">
                <div 
                  className="health-bar"
                  style={{ 
                    width: `${component.health}%`,
                    backgroundColor: getHealthColor(component.health)
                  }}
                />
                <span className="health-percentage">
                  {Math.round(component.health)}%
                </span>
              </div>
            </div>
            <p className="component-recommendation">
              {component.recommendation}
            </p>
          </div>
        ))}
      </div>

      <div className="maintenance-alert">
        <div className="alert-icon">💡</div>
        <div className="alert-content">
          <h4>Maintenance Tip</h4>
          <p>
            {equipment.mask.health < 30 && 'Your mask cushion shows wear. A proper seal is crucial for effective therapy.'}
            {equipment.filter.health < 30 && equipment.mask.health >= 30 && 'Time to replace your filter for optimal air quality.'}
            {equipment.mask.health >= 30 && equipment.filter.health >= 30 && 'All components are in good condition. Keep up the regular maintenance!'}
          </p>
        </div>
      </div>

      <button className="btn-clinical btn-secondary full-width">
        Order Replacement Supplies
      </button>
    </div>
  );
};

export default EquipmentHealth;