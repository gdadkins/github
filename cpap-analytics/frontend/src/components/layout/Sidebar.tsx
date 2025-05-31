import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  user: any;
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: string;
  notifications?: number;
  isActive?: boolean;
  children?: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle, user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<string[]>(['analytics']);

  const navigationItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      path: '/dashboard',
      isActive: location.pathname === '/dashboard'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '📈',
      path: '/analytics',
      children: [
        { id: 'trends', label: 'Trends', icon: '📉', path: '/analytics/trends' },
        { id: 'insights', label: 'AI Insights', icon: '🧠', path: '/analytics/insights', badge: 'PRO' },
        { id: 'reports', label: 'Reports', icon: '📋', path: '/analytics/reports' },
        { id: 'predictions', label: 'Predictions', icon: '🔮', path: '/analytics/predictions', badge: 'NEW' }
      ]
    },
    {
      id: 'therapy',
      label: 'Therapy Management',
      icon: '🫁',
      path: '/therapy',
      children: [
        { id: 'sessions', label: 'Sessions', icon: '🌙', path: '/therapy/sessions' },
        { id: 'compliance', label: 'Compliance', icon: '✅', path: '/therapy/compliance' },
        { id: 'devices', label: 'Devices', icon: '⚙️', path: '/therapy/devices' },
        { id: 'settings', label: 'Settings', icon: '🔧', path: '/therapy/settings' }
      ]
    },
    {
      id: 'health',
      label: 'Health Tracking',
      icon: '❤️',
      path: '/health',
      notifications: 3,
      children: [
        { id: 'vitals', label: 'Vitals', icon: '💓', path: '/health/vitals' },
        { id: 'sleep-quality', label: 'Sleep Quality', icon: '💤', path: '/health/sleep-quality' },
        { id: 'correlations', label: 'Correlations', icon: '🔗', path: '/health/correlations', badge: 'PRO' }
      ]
    },
    {
      id: 'data',
      label: 'Data Management',
      icon: '💾',
      path: '/data',
      children: [
        { id: 'uploads', label: 'Upload Data', icon: '⬆️', path: '/data/uploads' },
        { id: 'export', label: 'Export', icon: '⬇️', path: '/data/export' },
        { id: 'sync', label: 'Auto-Sync', icon: '🔄', path: '/data/sync', badge: 'PRO' }
      ]
    },
    {
      id: 'doctor',
      label: 'Doctor Portal',
      icon: '👨‍⚕️',
      path: '/doctor',
      badge: 'PRO',
      children: [
        { id: 'sharing', label: 'Data Sharing', icon: '🔗', path: '/doctor/sharing' },
        { id: 'appointments', label: 'Appointments', icon: '📅', path: '/doctor/appointments' },
        { id: 'telehealth', label: 'Telehealth', icon: '📞', path: '/doctor/telehealth' }
      ]
    }
  ];

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const renderNavItem = (item: NavItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');

    return (
      <div key={item.id} className={`nav-item-container ${level > 0 ? 'nav-item-child' : ''}`}>
        <button
          className={`nav-item ${isActive ? 'nav-item-active' : ''} ${level > 0 ? 'nav-item-nested' : ''}`}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            } else {
              handleNavigation(item.path);
            }
          }}
          title={collapsed ? item.label : undefined}
        >
          <div className="nav-item-content">
            <div className="nav-item-icon">
              {item.icon}
            </div>
            {!collapsed && (
              <>
                <span className="nav-item-label">{item.label}</span>
                <div className="nav-item-indicators">
                  {item.badge && (
                    <span className={`nav-badge ${item.badge.toLowerCase()}`}>
                      {item.badge}
                    </span>
                  )}
                  {item.notifications && (
                    <span className="nav-notification">
                      {item.notifications}
                    </span>
                  )}
                  {hasChildren && (
                    <div className={`nav-expand-icon ${isExpanded ? 'nav-expand-icon-open' : ''}`}>
                      ▶
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          {isActive && <div className="nav-item-indicator"></div>}
        </button>
        
        {hasChildren && (!collapsed || level > 0) && (
          <div className={`nav-children ${isExpanded ? 'nav-children-open' : ''}`}>
            {item.children!.map(child => renderNavItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Logo & Brand */}
      <div className="sidebar-header">
        <div className="brand">
          <div className="brand-icon">🫁</div>
          {!collapsed && (
            <div className="brand-text">
              <h1 className="brand-title">CPAP Analytics</h1>
              <p className="brand-subtitle">Professional Suite</p>
            </div>
          )}
        </div>
        <button className="sidebar-toggle" onClick={onToggle} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          <span className={`toggle-icon ${collapsed ? 'toggle-icon-collapsed' : ''}`}>⟨</span>
        </button>
      </div>

      {/* User Profile */}
      {!collapsed && (
        <div className="user-profile">
          <div className="user-avatar">
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.username || 'User')}&background=667eea&color=fff&size=40`}
              alt="User Avatar"
            />
            <div className="user-status"></div>
          </div>
          <div className="user-info">
            <p className="user-name">{user?.username || 'User'}</p>
            <p className="user-subscription">Premium Member</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-items">
            {navigationItems.map(item => renderNavItem(item))}
          </div>
        </div>
      </nav>

      {/* Quick Stats */}
      {!collapsed && (
        <div className="sidebar-stats">
          <div className="quick-stat">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <p className="stat-value">94%</p>
              <p className="stat-label">Compliance</p>
            </div>
          </div>
          <div className="quick-stat">
            <div className="stat-icon">💤</div>
            <div className="stat-content">
              <p className="stat-value">7.2h</p>
              <p className="stat-label">Last Night</p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="sidebar-footer">
        {!collapsed && (
          <div className="footer-actions">
            <button className="footer-action" title="Help & Support">
              <span className="action-icon">❓</span>
              <span className="action-label">Help</span>
            </button>
            <button className="footer-action" title="Settings">
              <span className="action-icon">⚙️</span>
              <span className="action-label">Settings</span>
            </button>
          </div>
        )}
        <div className="version-info">
          {!collapsed && <span>v2.1.0</span>}
        </div>
      </div>
    </aside>
  );
};