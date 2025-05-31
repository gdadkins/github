import React, { useState } from 'react';
import './NotificationCenter.css';

interface NotificationCenterProps {
  onClose: () => void;
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'insight';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  isStarred: boolean;
  category: string;
  actions?: Array<{
    label: string;
    action: () => void;
    isPrimary?: boolean;
  }>;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'starred'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Great Sleep Night!',
      message: 'Your AHI of 1.8 last night was excellent. Keep up the good work with your therapy routine.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: false,
      isStarred: true,
      category: 'Sleep Quality',
      actions: [
        { label: 'View Details', action: () => console.log('View details') },
        { label: 'Share', action: () => console.log('Share'), isPrimary: true }
      ]
    },
    {
      id: '2',
      type: 'insight',
      title: 'AI Sleep Coach Recommendation',
      message: 'Based on your data patterns, going to bed 30 minutes earlier could improve your sleep efficiency by 12%.',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      isRead: false,
      isStarred: false,
      category: 'AI Insights',
      actions: [
        { label: 'Set Reminder', action: () => console.log('Set reminder'), isPrimary: true },
        { label: 'Learn More', action: () => console.log('Learn more') }
      ]
    },
    {
      id: '3',
      type: 'warning',
      title: 'Mask Leak Detected',
      message: 'Your mask leak rate was higher than usual (28 L/min) for the past 2 nights. Check mask fit.',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      isRead: true,
      isStarred: false,
      category: 'Equipment',
      actions: [
        { label: 'Troubleshoot', action: () => console.log('Troubleshoot'), isPrimary: true },
        { label: 'Contact Support', action: () => console.log('Contact support') }
      ]
    },
    {
      id: '4',
      type: 'info',
      title: 'Weekly Report Ready',
      message: 'Your weekly therapy summary is ready for download. Share it with your doctor for your next appointment.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isRead: true,
      isStarred: false,
      category: 'Reports',
      actions: [
        { label: 'Download', action: () => console.log('Download'), isPrimary: true }
      ]
    },
    {
      id: '5',
      type: 'success',
      title: 'Compliance Goal Achieved',
      message: 'Congratulations! You\'ve maintained 95% compliance for 30 consecutive days. Excellent progress!',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isRead: true,
      isStarred: true,
      category: 'Milestones'
    }
  ]);

  const filteredNotifications = notifications.filter(notification => {
    switch (activeTab) {
      case 'unread':
        return !notification.isRead;
      case 'starred':
        return notification.isStarred;
      default:
        return true;
    }
  });

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const toggleStar = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isStarred: !notif.isStarred } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const getNotificationIcon = (type: Notification['type']) => {
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      insight: '🧠'
    };
    return icons[type];
  };

  const getRelativeTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const starredCount = notifications.filter(n => n.isStarred).length;

  return (
    <div className="notification-overlay" onClick={onClose}>
      <div className="notification-center" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="notification-header">
          <div className="header-content">
            <h2 className="notification-title">Notifications</h2>
            <div className="header-actions">
              {unreadCount > 0 && (
                <button className="mark-all-read" onClick={markAllAsRead}>
                  Mark all read
                </button>
              )}
              <button className="close-button" onClick={onClose}>
                ✕
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="notification-tabs">
            <button
              className={`tab ${activeTab === 'all' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All
              <span className="tab-count">{notifications.length}</span>
            </button>
            <button
              className={`tab ${activeTab === 'unread' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('unread')}
            >
              Unread
              {unreadCount > 0 && <span className="tab-count unread">{unreadCount}</span>}
            </button>
            <button
              className={`tab ${activeTab === 'starred' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('starred')}
            >
              Starred
              {starredCount > 0 && <span className="tab-count">{starredCount}</span>}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="notification-content">
          {filteredNotifications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No notifications</h3>
              <p>
                {activeTab === 'unread' 
                  ? "You're all caught up!" 
                  : activeTab === 'starred'
                  ? "No starred notifications yet"
                  : "No notifications to show"}
              </p>
            </div>
          ) : (
            <div className="notification-list">
              {filteredNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.isRead ? 'notification-unread' : ''} notification-${notification.type}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="notification-main">
                    <div className="notification-icon">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="notification-body">
                      <div className="notification-meta">
                        <span className="notification-category">{notification.category}</span>
                        <span className="notification-time">{getRelativeTime(notification.timestamp)}</span>
                      </div>
                      
                      <h4 className="notification-heading">{notification.title}</h4>
                      <p className="notification-message">{notification.message}</p>
                      
                      {notification.actions && (
                        <div className="notification-actions">
                          {notification.actions.map((action, index) => (
                            <button
                              key={index}
                              className={`action-button ${action.isPrimary ? 'action-primary' : 'action-secondary'}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                action.action();
                              }}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="notification-controls">
                      <button
                        className={`star-button ${notification.isStarred ? 'starred' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStar(notification.id);
                        }}
                        title={notification.isStarred ? 'Remove star' : 'Add star'}
                      >
                        ⭐
                      </button>
                      {!notification.isRead && (
                        <div className="unread-indicator" title="Unread notification"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};