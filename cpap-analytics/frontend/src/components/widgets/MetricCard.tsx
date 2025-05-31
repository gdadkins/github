import React, { useState, useEffect } from 'react';
import './MetricCard.css';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: string;
  trend?: {
    value: number;
    period: string;
    isPositive?: boolean;
  };
  target?: {
    value: number;
    unit?: string;
  };
  status?: 'excellent' | 'good' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  icon,
  trend,
  target,
  status = 'good',
  size = 'md',
  interactive = false,
  loading = false,
  onClick,
  children
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);

  // Animate value changes
  useEffect(() => {
    if (typeof value === 'number') {
      setIsAnimating(true);
      const duration = 1000; // 1 second
      const steps = 30;
      const stepValue = value / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        setDisplayValue(Math.round(stepValue * currentStep * 10) / 10);
        
        if (currentStep >= steps) {
          clearInterval(timer);
          setDisplayValue(value);
          setIsAnimating(false);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [value]);

  const getProgressPercentage = () => {
    if (!target || typeof value !== 'number') return 0;
    return Math.min((value / target.value) * 100, 100);
  };

  const getStatusColor = () => {
    const colors = {
      excellent: 'var(--color-success-500)',
      good: 'var(--color-primary-500)',
      warning: 'var(--color-warning-500)',
      danger: 'var(--color-danger-500)'
    };
    return colors[status];
  };

  return (
    <div 
      className={`metric-card metric-card-${size} metric-card-${status} ${interactive ? 'metric-card-interactive' : ''} ${loading ? 'metric-card-loading' : ''}`}
      onClick={interactive ? onClick : undefined}
      style={{ '--status-color': getStatusColor() } as React.CSSProperties}
    >
      {/* Loading Overlay */}
      {loading && (
        <div className="metric-loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      {/* Status Indicator */}
      <div className="metric-status-indicator" />

      {/* Header */}
      <div className="metric-header">
        <div className="metric-icon-container">
          <span className="metric-icon">{icon}</span>
          {trend && (
            <div className={`trend-indicator ${trend.isPositive !== false ? 'trend-positive' : 'trend-negative'}`}>
              <span className="trend-arrow">
                {trend.isPositive !== false ? '↗️' : '↘️'}
              </span>
              <span className="trend-value">
                {Math.abs(trend.value)}%
              </span>
            </div>
          )}
        </div>
        
        <div className="metric-title-container">
          <h3 className="metric-title">{title}</h3>
          {trend && (
            <p className="metric-trend-text">
              {trend.isPositive !== false ? '+' : ''}{trend.value}% {trend.period}
            </p>
          )}
        </div>
      </div>

      {/* Value */}
      <div className="metric-value-section">
        <div className="metric-main-value">
          <span className={`metric-value ${isAnimating ? 'metric-value-animating' : ''}`}>
            {typeof value === 'number' ? displayValue : value}
          </span>
          {unit && <span className="metric-unit">{unit}</span>}
        </div>

        {target && (
          <div className="metric-target">
            <span className="target-label">Target: {target.value}{target.unit || unit}</span>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
            <span className="progress-percentage">{Math.round(getProgressPercentage())}%</span>
          </div>
        )}
      </div>

      {/* Custom Content */}
      {children && (
        <div className="metric-custom-content">
          {children}
        </div>
      )}

      {/* Interactive Indicator */}
      {interactive && (
        <div className="metric-interactive-hint">
          <span>Click for details</span>
          <span className="interactive-arrow">→</span>
        </div>
      )}

      {/* Pulse Animation */}
      <div className="metric-pulse-ring" />
    </div>
  );
};