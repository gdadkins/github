import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopNavBar } from './TopNavBar';
import { QuickActions } from './QuickActions';
import { NotificationCenter } from './NotificationCenter';
import { CommandPalette } from './CommandPalette';
import './AppLayout.css';

interface AppLayoutProps {
  children: React.ReactNode;
  user: any;
  onLogout: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, user, onLogout }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            setShowCommandPalette(true);
            break;
          case 'b':
            e.preventDefault();
            setSidebarCollapsed(!sidebarCollapsed);
            break;
          case 'n':
            e.preventDefault();
            setShowNotifications(!showNotifications);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarCollapsed, showNotifications]);

  return (
    <div className="app-layout">
      {/* Ambient Background Effects */}
      <div className="ambient-bg">
        <div className="ambient-orb ambient-orb-1"></div>
        <div className="ambient-orb ambient-orb-2"></div>
        <div className="ambient-orb ambient-orb-3"></div>
      </div>

      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        user={user}
      />

      {/* Main Content Area */}
      <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Top Navigation */}
        <TopNavBar 
          user={user}
          currentTime={currentTime}
          onShowNotifications={() => setShowNotifications(true)}
          onShowCommandPalette={() => setShowCommandPalette(true)}
          onLogout={onLogout}
        />

        {/* Page Content */}
        <main className="page-content">
          {children}
        </main>

        {/* Quick Actions Floating Panel */}
        <QuickActions />
      </div>

      {/* Global Overlays */}
      {showCommandPalette && (
        <CommandPalette onClose={() => setShowCommandPalette(false)} />
      )}

      {showNotifications && (
        <NotificationCenter onClose={() => setShowNotifications(false)} />
      )}

      {/* Background Pattern */}
      <div className="bg-pattern"></div>
    </div>
  );
};