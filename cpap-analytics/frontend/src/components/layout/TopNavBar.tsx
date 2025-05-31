import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './TopNavBar.css';

interface TopNavBarProps {
  user: any;
  currentTime: Date;
  onShowNotifications: () => void;
  onShowCommandPalette: () => void;
  onLogout: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  user,
  currentTime,
  onShowNotifications,
  onShowCommandPalette,
  onLogout
}) => {
  const location = useLocation();
  const [aiInsight, setAiInsight] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Dynamic AI insights based on location
  useEffect(() => {
    const insights = {
      '/dashboard': 'Your AHI has improved 15% this week! 🎉',
      '/analytics/trends': 'Peak performance detected at 23:30 bedtime',
      '/therapy/sessions': 'Consistent 7+ hour sessions boost effectiveness',
      '/health/vitals': 'Blood pressure correlation found with sleep quality',
      '/analytics/insights': 'Machine learning model updated with latest data'
    };
    
    setAiInsight(insights[location.pathname as keyof typeof insights] || 'AI monitoring your sleep optimization');
  }, [location.pathname]);

  const getPageTitle = () => {
    const titles: { [key: string]: string } = {
      '/dashboard': 'Dashboard Overview',
      '/analytics': 'Analytics Suite',
      '/analytics/trends': 'Trend Analysis',
      '/analytics/insights': 'AI Insights',
      '/analytics/reports': 'Reports Generator',
      '/analytics/predictions': 'Predictive Analytics',
      '/therapy': 'Therapy Management',
      '/therapy/sessions': 'Sleep Sessions',
      '/therapy/compliance': 'Compliance Tracking',
      '/therapy/devices': 'Device Management',
      '/health': 'Health Tracking',
      '/health/vitals': 'Vital Signs',
      '/health/sleep-quality': 'Sleep Quality',
      '/data': 'Data Management',
      '/doctor': 'Doctor Portal'
    };
    
    return titles[location.pathname] || 'CPAP Analytics';
  };

  const getTimeGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return '🌅 Good Morning';
    if (hour < 17) return '☀️ Good Afternoon';
    if (hour < 21) return '🌆 Good Evening';
    return '🌙 Good Night';
  };

  const searchSuggestions = [
    'AHI trends last month',
    'Compliance rate analysis',
    'Sleep efficiency report',
    'Mask leak data',
    'Pressure settings',
    'Device maintenance',
    'Doctor appointments',
    'Export last 30 days'
  ];

  const filteredSuggestions = searchSuggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="top-navbar">
      {/* Left Section - Breadcrumb & Page Info */}
      <div className="navbar-left">
        <div className="page-breadcrumb">
          <h1 className="page-title">{getPageTitle()}</h1>
          <div className="ai-insight">
            <span className="ai-icon">🧠</span>
            <span className="ai-text">{aiInsight}</span>
          </div>
        </div>
      </div>

      {/* Center Section - Smart Search */}
      <div className="navbar-center">
        <div className={`smart-search ${isSearchFocused ? 'search-focused' : ''}`}>
          <div className="search-input-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search analytics, sessions, insights... (⌘K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="search-input"
            />
            <button 
              className="search-command-hint"
              onClick={onShowCommandPalette}
              title="Open Command Palette (⌘K)"
            >
              ⌘K
            </button>
          </div>
          
          {isSearchFocused && searchQuery && (
            <div className="search-suggestions">
              <div className="suggestions-header">
                <span>🎯 Quick Results</span>
              </div>
              {filteredSuggestions.map((suggestion, index) => (
                <button key={index} className="suggestion-item">
                  <span className="suggestion-icon">📊</span>
                  <span className="suggestion-text">{suggestion}</span>
                  <span className="suggestion-shortcut">↵</span>
                </button>
              ))}
              {filteredSuggestions.length === 0 && (
                <div className="no-suggestions">
                  <span>🤔 No matches found</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Section - User Controls */}
      <div className="navbar-right">
        {/* Time & Greeting */}
        <div className="time-greeting">
          <span className="greeting">{getTimeGreeting()}</span>
          <span className="current-time">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats-bar">
          <div className="quick-stat-item" title="Last Night's AHI">
            <span className="stat-icon">📊</span>
            <span className="stat-value">2.1</span>
          </div>
          <div className="quick-stat-item" title="Sleep Duration">
            <span className="stat-icon">⏰</span>
            <span className="stat-value">7.5h</span>
          </div>
          <div className="quick-stat-item" title="Compliance">
            <span className="stat-icon">✅</span>
            <span className="stat-value">94%</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          {/* Notifications */}
          <button 
            className="action-btn notification-btn" 
            onClick={onShowNotifications}
            title="Notifications (⌘N)"
          >
            <span className="btn-icon">🔔</span>
            <span className="notification-badge">3</span>
          </button>

          {/* AI Assistant */}
          <button className="action-btn ai-assistant-btn" title="AI Sleep Coach">
            <span className="btn-icon">🤖</span>
            <span className="assistant-status">●</span>
          </button>

          {/* Data Sync Status */}
          <button className="action-btn sync-btn" title="Data Sync Status">
            <span className="btn-icon sync-icon">🔄</span>
          </button>

          {/* Settings */}
          <button className="action-btn settings-btn" title="Quick Settings">
            <span className="btn-icon">⚙️</span>
          </button>
        </div>

        {/* User Menu */}
        <div className="user-menu">
          <button className="user-menu-trigger">
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'User')}&background=667eea&color=fff&size=32`}
              alt="User Avatar"
              className="user-avatar-small"
            />
            <div className="user-menu-info">
              <span className="user-name-small">{user?.username || 'User'}</span>
              <span className="user-status">Online</span>
            </div>
            <span className="menu-arrow">▼</span>
          </button>
          
          <div className="user-dropdown">
            <div className="dropdown-header">
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'User')}&background=667eea&color=fff&size=48`}
                alt="User Avatar"
                className="dropdown-avatar"
              />
              <div className="dropdown-user-info">
                <p className="dropdown-name">{user?.username || 'User'}</p>
                <p className="dropdown-email">{user?.email || 'user@example.com'}</p>
                <span className="dropdown-badge">👑 Premium</span>
              </div>
            </div>
            
            <div className="dropdown-menu">
              <button className="dropdown-item">
                <span className="item-icon">👤</span>
                <span>Profile Settings</span>
              </button>
              <button className="dropdown-item">
                <span className="item-icon">🔧</span>
                <span>Preferences</span>
              </button>
              <button className="dropdown-item">
                <span className="item-icon">📊</span>
                <span>Data Export</span>
              </button>
              <button className="dropdown-item">
                <span className="item-icon">💳</span>
                <span>Billing</span>
              </button>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item">
                <span className="item-icon">❓</span>
                <span>Help & Support</span>
              </button>
              <button className="dropdown-item" onClick={onLogout}>
                <span className="item-icon">🚪</span>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};