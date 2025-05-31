import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './ClinicalAppShell.css';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  badge?: string;
  requiresPremium?: boolean;
}

const ClinicalAppShell: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems: NavItem[] = [
    { path: '/dashboard', label: 'Overview', icon: 'grid' },
    { path: '/compliance', label: 'Compliance', icon: 'check-circle' },
    { path: '/analytics', label: 'Analytics', icon: 'chart' },
    { path: '/reports', label: 'Reports', icon: 'document', badge: 'NEW' },
    { path: '/equipment', label: 'Equipment', icon: 'device' },
    { path: '/insights', label: 'AI Insights', icon: 'brain', requiresPremium: true },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getIcon = (iconName: string) => {
    const icons: Record<string, JSX.Element> = {
      grid: (
        <svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      'check-circle': (
        <svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      chart: (
        <svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
      ),
      document: (
        <svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-5L9 2H4z" clipRule="evenodd" />
        </svg>
      ),
      device: (
        <svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
        </svg>
      ),
      brain: (
        <svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13 7H7v6h6V7z" />
          <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
        </svg>
      ),
    };
    return icons[iconName] || icons.grid;
  };

  const getComplianceStatus = () => {
    // Mock compliance calculation - would come from real data
    const complianceRate = 92;
    if (complianceRate >= 90) return { status: 'excellent', color: 'var(--compliance-excellent)' };
    if (complianceRate >= 70) return { status: 'good', color: 'var(--compliance-good)' };
    if (complianceRate >= 50) return { status: 'fair', color: 'var(--compliance-fair)' };
    return { status: 'poor', color: 'var(--compliance-poor)' };
  };

  const compliance = getComplianceStatus();

  return (
    <div className="clinical-app-shell">
      {/* Top Navigation Bar */}
      <header className="clinical-header">
        <div className="header-left">
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label="Toggle sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
          <div className="logo">
            <span className="logo-icon">⚕️</span>
            <span className="logo-text">CPAP Analytics</span>
          </div>
        </div>

        <div className="header-center">
          <div className="quick-stats">
            <div className="stat-item">
              <span className="stat-label">Tonight's AHI</span>
              <span className="stat-value">2.8</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Compliance</span>
              <span className="stat-value" style={{ color: compliance.color }}>92%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Mask Fit</span>
              <span className="stat-value good">Good</span>
            </div>
          </div>
        </div>

        <div className="header-right">
          <button className="icon-button">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            <span className="notification-badge">3</span>
          </button>

          <div className="user-menu-container">
            <button 
              className="user-menu-trigger"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="user-avatar">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="user-name">{user?.name || 'User'}</span>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {showUserMenu && (
              <div className="user-menu-dropdown">
                <Link to="/profile" className="dropdown-item">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  Profile Settings
                </Link>
                <Link to="/subscription" className="dropdown-item">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                  Subscription
                </Link>
                <hr className="dropdown-divider" />
                <button onClick={handleLogout} className="dropdown-item">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="clinical-layout">
        {/* Sidebar Navigation */}
        <nav className={`clinical-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                >
                  {getIcon(item.icon)}
                  {!sidebarCollapsed && (
                    <>
                      <span className="nav-label">{item.label}</span>
                      {item.badge && <span className="nav-badge">{item.badge}</span>}
                      {item.requiresPremium && <span className="nav-badge premium">PRO</span>}
                    </>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {!sidebarCollapsed && (
            <div className="sidebar-footer">
              <div className="upgrade-prompt">
                <h4>Unlock Full Insights</h4>
                <p>Get AI-powered recommendations and advanced analytics</p>
                <Link to="/subscription" className="btn-clinical btn-primary">
                  Upgrade to Premium
                </Link>
              </div>
            </div>
          )}
        </nav>

        {/* Main Content Area */}
        <main className="clinical-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ClinicalAppShell;