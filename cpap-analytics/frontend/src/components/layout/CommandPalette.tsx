import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './CommandPalette.css';

interface CommandPaletteProps {
  onClose: () => void;
}

interface Command {
  id: string;
  label: string;
  description: string;
  icon: string;
  category: string;
  action: () => void;
  keywords: string[];
  shortcut?: string;
  isNew?: boolean;
  isPro?: boolean;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentCommands, setRecentCommands] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const commands: Command[] = [
    // Navigation Commands
    {
      id: 'nav-dashboard',
      label: 'Go to Dashboard',
      description: 'View your main dashboard with key metrics',
      icon: '📊',
      category: 'Navigation',
      action: () => navigate('/dashboard'),
      keywords: ['dashboard', 'home', 'main', 'overview'],
      shortcut: 'Ctrl+H'
    },
    {
      id: 'nav-analytics',
      label: 'Open Analytics',
      description: 'Detailed analytics and trend analysis',
      icon: '📈',
      category: 'Navigation',
      action: () => navigate('/analytics'),
      keywords: ['analytics', 'trends', 'data', 'analysis'],
      shortcut: 'Ctrl+A'
    },
    {
      id: 'nav-sessions',
      label: 'View Sleep Sessions',
      description: 'Browse your sleep session history',
      icon: '🌙',
      category: 'Navigation',
      action: () => navigate('/therapy/sessions'),
      keywords: ['sessions', 'sleep', 'history', 'nights'],
    },
    {
      id: 'nav-insights',
      label: 'AI Insights',
      description: 'Machine learning powered insights',
      icon: '🧠',
      category: 'Navigation',
      action: () => navigate('/analytics/insights'),
      keywords: ['ai', 'insights', 'machine learning', 'recommendations'],
      isPro: true,
      isNew: true
    },

    // Data Commands
    {
      id: 'data-upload',
      label: 'Upload CPAP Data',
      description: 'Import new data from your CPAP device',
      icon: '⬆️',
      category: 'Data',
      action: () => console.log('Upload data'),
      keywords: ['upload', 'import', 'data', 'file'],
      shortcut: 'Ctrl+U'
    },
    {
      id: 'data-export',
      label: 'Export Report',
      description: 'Generate and download detailed reports',
      icon: '📄',
      category: 'Data',
      action: () => console.log('Export report'),
      keywords: ['export', 'download', 'report', 'pdf'],
      shortcut: 'Ctrl+E'
    },
    {
      id: 'data-sync',
      label: 'Sync with Device',
      description: 'Automatically sync with your CPAP machine',
      icon: '🔄',
      category: 'Data',
      action: () => console.log('Sync data'),
      keywords: ['sync', 'device', 'automatic', 'cpap'],
      isPro: true
    },

    // Analysis Commands
    {
      id: 'analysis-ahi',
      label: 'Analyze AHI Trends',
      description: 'Deep dive into your AHI progression',
      icon: '📉',
      category: 'Analysis',
      action: () => navigate('/analytics/trends?metric=ahi'),
      keywords: ['ahi', 'apnea', 'hypopnea', 'index', 'trend'],
    },
    {
      id: 'analysis-compliance',
      label: 'Check Compliance',
      description: 'Review therapy compliance metrics',
      icon: '✅',
      category: 'Analysis',
      action: () => navigate('/therapy/compliance'),
      keywords: ['compliance', 'adherence', 'usage', 'therapy'],
    },
    {
      id: 'analysis-predictions',
      label: 'View Predictions',
      description: 'AI-powered sleep quality predictions',
      icon: '🔮',
      category: 'Analysis',
      action: () => navigate('/analytics/predictions'),
      keywords: ['predictions', 'forecast', 'ai', 'future'],
      isPro: true,
      isNew: true
    },

    // Quick Actions
    {
      id: 'quick-last-night',
      label: 'Last Night Summary',
      description: 'Quick overview of your latest session',
      icon: '🌛',
      category: 'Quick Actions',
      action: () => console.log('Show last night'),
      keywords: ['last night', 'recent', 'summary', 'latest'],
    },
    {
      id: 'quick-goals',
      label: 'Set Sleep Goals',
      description: 'Configure your therapy targets',
      icon: '🎯',
      category: 'Quick Actions',
      action: () => console.log('Set goals'),
      keywords: ['goals', 'targets', 'objectives', 'settings'],
    },
    {
      id: 'quick-doctor',
      label: 'Share with Doctor',
      description: 'Prepare report for healthcare provider',
      icon: '👨‍⚕️',
      category: 'Quick Actions',
      action: () => navigate('/doctor/sharing'),
      keywords: ['doctor', 'physician', 'share', 'healthcare'],
      isPro: true
    },

    // Settings Commands
    {
      id: 'settings-profile',
      label: 'Edit Profile',
      description: 'Update your account information',
      icon: '👤',
      category: 'Settings',
      action: () => console.log('Edit profile'),
      keywords: ['profile', 'account', 'user', 'settings'],
    },
    {
      id: 'settings-notifications',
      label: 'Notification Settings',
      description: 'Configure alerts and reminders',
      icon: '🔔',
      category: 'Settings',
      action: () => console.log('Notifications'),
      keywords: ['notifications', 'alerts', 'reminders', 'settings'],
    },
    {
      id: 'settings-privacy',
      label: 'Privacy Settings',
      description: 'Manage data privacy and sharing',
      icon: '🔒',
      category: 'Settings',
      action: () => console.log('Privacy'),
      keywords: ['privacy', 'security', 'data', 'sharing'],
    },
  ];

  const filteredCommands = query
    ? commands.filter(cmd => 
        cmd.label.toLowerCase().includes(query.toLowerCase()) ||
        cmd.description.toLowerCase().includes(query.toLowerCase()) ||
        cmd.keywords.some(keyword => keyword.toLowerCase().includes(query.toLowerCase()))
      )
    : commands;

  const groupedCommands = filteredCommands.reduce((groups, command) => {
    const category = command.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(command);
    return groups;
  }, {} as Record<string, Command[]>);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          const command = filteredCommands[selectedIndex];
          command.action();
          setRecentCommands(prev => [command.id, ...prev.filter(id => id !== command.id)].slice(0, 5));
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, filteredCommands, onClose]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const executeCommand = (command: Command) => {
    command.action();
    setRecentCommands(prev => [command.id, ...prev.filter(id => id !== command.id)].slice(0, 5));
    onClose();
  };

  return (
    <div className="command-palette-overlay" onClick={onClose}>
      <div className="command-palette" onClick={(e) => e.stopPropagation()}>
        <div className="palette-header">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a command or search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="command-input"
            />
            <div className="search-hints">
              <span className="hint">↑↓ Navigate</span>
              <span className="hint">↵ Select</span>
              <span className="hint">Esc Close</span>
            </div>
          </div>
        </div>

        <div className="palette-content">
          {Object.keys(groupedCommands).length === 0 ? (
            <div className="no-results">
              <div className="no-results-icon">🤔</div>
              <h3>No commands found</h3>
              <p>Try a different search term or browse available commands</p>
            </div>
          ) : (
            <div className="command-groups">
              {Object.entries(groupedCommands).map(([category, categoryCommands]) => (
                <div key={category} className="command-group">
                  <div className="group-header">
                    <span className="group-title">{category}</span>
                    <span className="group-count">{categoryCommands.length}</span>
                  </div>
                  <div className="group-commands">
                    {categoryCommands.map((command, index) => {
                      const globalIndex = filteredCommands.indexOf(command);
                      return (
                        <button
                          key={command.id}
                          className={`command-item ${globalIndex === selectedIndex ? 'command-selected' : ''}`}
                          onClick={() => executeCommand(command)}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                        >
                          <div className="command-icon">{command.icon}</div>
                          <div className="command-details">
                            <div className="command-title">
                              {command.label}
                              {command.isNew && <span className="command-badge new">NEW</span>}
                              {command.isPro && <span className="command-badge pro">PRO</span>}
                            </div>
                            <div className="command-description">{command.description}</div>
                          </div>
                          {command.shortcut && (
                            <div className="command-shortcut">{command.shortcut}</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {!query && recentCommands.length > 0 && (
          <div className="palette-footer">
            <div className="recent-commands">
              <span className="recent-title">Recent</span>
              <div className="recent-items">
                {recentCommands.slice(0, 3).map(commandId => {
                  const command = commands.find(c => c.id === commandId);
                  return command ? (
                    <button
                      key={command.id}
                      className="recent-item"
                      onClick={() => executeCommand(command)}
                    >
                      <span className="recent-icon">{command.icon}</span>
                      <span className="recent-label">{command.label}</span>
                    </button>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};