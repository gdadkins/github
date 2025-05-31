# Frontend Development Guide

React-based dashboard for CPAP therapy data visualization and analysis.

## Tech Stack

- **React 18** with TypeScript
- **Advanced Layout System** with modular components
- **Tailwind CSS** with comprehensive design system
- **Glass Morphism** UI with backdrop blur effects
- **Command Palette** with fuzzy search (⌘K)
- **Keyboard Shortcuts** for power users
- **Inter Font** for professional typography
- **Recharts** for data visualization
- **React Router** for navigation
- **Axios** for API communication

## Professional Design System

### CSS Component Classes
- **Buttons**: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-success` with size variants
- **Cards**: `.card`, `.card-hover`, `.card-gradient` for consistent container styling
- **Metrics**: `.metric-card` with status variants (excellent, warning, danger)
- **Effects**: `.glass-effect`, `.gradient-bg`, `.text-gradient` for modern aesthetics

### Color Scheme
- **Primary**: Slate and blue palette for professional medical appearance
- **Status Colors**: Emerald (excellent), amber (warning), red (danger)
- **Typography**: Inter font family with proper weight hierarchy

## Features

### Advanced Layout System ✨ NEW

- **AppLayout**: Main wrapper with ambient background effects and keyboard shortcuts
- **Sidebar**: Collapsible navigation with user profile, stats, and hierarchical menu
- **TopNavBar**: Modern header with search, notifications, and user controls
- **Command Palette**: Quick actions with fuzzy search (⌘K to open)
- **Notification Center**: Real-time alerts and system messages
- **Quick Actions**: Contextual buttons for common operations

### Keyboard Shortcuts

- **⌘K / Ctrl+K**: Open command palette for quick navigation
- **⌘B / Ctrl+B**: Toggle sidebar collapse/expand
- **⌘N / Ctrl+N**: Toggle notification center

### Dashboard

- Professional overview metrics with status indicators
- Recent sessions summary with enhanced visualizations
- Glass morphism header with gradient text effects
- Responsive metric cards with contextual status messages
- **Smart Insights Engine**: Rule-based intelligent analysis and recommendations

### Smart Insights Component

- **Insight Types**: Achievement, improvement, concern, recommendation, trend, alert
- **Visual Design**: Color-coded cards with priority badges and confidence indicators
- **Interactive Elements**: Expandable details with actionable next steps
- **Intelligence Source**: Rule-based expert system (not machine learning)
- **Data Analysis**: Statistical calculations with medical threshold rules

### Session Analysis

- Detailed session data visualization
- Quality score breakdown
- Trend analysis over time

### Data Upload

- File upload with progress tracking
- Drag-and-drop interface
- Processing status updates

### Responsive Design

- Mobile-first approach
- Tailwind CSS utility classes
- Accessible UI components

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

## Project Structure

```text
src/
├── components/
│   ├── Dashboard/
│   │   ├── Dashboard.tsx
│   │   ├── MetricsCard.tsx
│   │   └── RecentSessions.tsx
│   ├── layout/                   # ✨ NEW: Advanced Layout System
│   │   ├── AppLayout.tsx         # Main layout wrapper with shortcuts
│   │   ├── AppLayout.css         # Layout-specific styles
│   │   ├── Sidebar.tsx           # Collapsible navigation
│   │   ├── Sidebar.css           # Sidebar styles with glass morphism
│   │   ├── TopNavBar.tsx         # Header with search & notifications
│   │   ├── TopNavBar.css         # Navigation bar styles
│   │   ├── CommandPalette.tsx    # ⌘K quick actions with fuzzy search
│   │   ├── CommandPalette.css    # Command palette styles
│   │   ├── QuickActions.tsx      # Contextual action buttons
│   │   ├── QuickActions.css      # Quick actions styles
│   │   ├── NotificationCenter.tsx # Real-time notification system
│   │   ├── NotificationCenter.css # Notification styles
│   │   └── index.ts              # Layout component exports
│   ├── widgets/                  # ✨ NEW: Modular Widget Components
│   │   ├── MetricCard.tsx        # Professional metric display cards
│   │   ├── MetricCard.css        # Metric card specific styles
│   │   └── index.ts              # Widget exports
│   ├── SmartInsights.tsx         # NEW: AI-style insights component
│   ├── LoadingSpinner.tsx        # Professional loading states
│   ├── ErrorBoundary.tsx         # Enhanced error handling
│   ├── charts/
│   │   ├── AHITrendChart.tsx
│   │   ├── SleepQualityChart.tsx
│   │   ├── TherapyInsights.tsx
│   │   ├── ComplianceHeatmap.tsx
│   │   ├── EventBreakdownChart.tsx
│   │   └── index.ts
│   ├── Upload/
│   │   ├── UploadForm.tsx
│   │   └── FileDropzone.tsx
│   └── common/                   # Shared components
├── styles/                       # ✨ ENHANCED: Modern Design System
│   ├── index.css                 # Base styles with Inter font
│   ├── design-system.css         # ✨ NEW: Complete design tokens & glass morphism
│   └── tailwind.css              # Tailwind utilities
├── hooks/
│   ├── useAuth.ts
│   ├── useApi.ts
│   └── useLocalStorage.ts
├── services/
│   ├── api.ts
│   ├── auth.ts
│   └── sessions.ts
├── types/
│   ├── api.ts
│   ├── session.ts
│   └── user.ts
├── App.tsx                       # ✨ ENHANCED: Advanced layout integration
└── index.tsx
```

## Component Architecture

### Advanced Layout System

```typescript
// AppLayout - Main layout wrapper with keyboard shortcuts
interface AppLayoutProps {
  children: React.ReactNode;
  user: any;
  onLogout: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, user, onLogout }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  // Keyboard shortcuts: ⌘K, ⌘B, ⌘N
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key) {
          case 'k': setShowCommandPalette(true); break;
          case 'b': setSidebarCollapsed(!sidebarCollapsed); break;
          case 'n': setShowNotifications(!showNotifications); break;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="app-layout">
      <Sidebar collapsed={sidebarCollapsed} user={user} />
      <TopNavBar onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <main className="main-content">{children}</main>
      {showCommandPalette && <CommandPalette onClose={() => setShowCommandPalette(false)} />}
    </div>
  );
};
```

### Dashboard Component

```typescript
interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const { data: analytics, loading, error } = useApi('/api/analytics');
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MetricsCard title="Average AHI" value={analytics?.avg_ahi} />
      <MetricsCard title="Quality Score" value={analytics?.avg_quality} />
      <MetricsCard title="Total Sessions" value={analytics?.total_sessions} />
    </div>
  );
};
```

### Chart Components

```typescript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AHITrendChartProps {
  data: Array<{ date: string; ahi: number; target?: number }>;
  showTarget?: boolean;
}

const AHITrendChart: React.FC<AHITrendChartProps> = ({ data, showTarget = true }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="ahi" stroke="#3b82f6" strokeWidth={2} />
        {showTarget && <Line type="monotone" dataKey="target" stroke="#ef4444" strokeDasharray="5 5" />}
      </LineChart>
    </ResponsiveContainer>
  );
};
```

## API Integration

### Authentication Service

```typescript
class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/api/auth/login', credentials);
    this.setToken(response.data.token);
    return response.data;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  }
}
```

### Sessions Service

```typescript
class SessionsService {
  async getSessions(): Promise<Session[]> {
    const response = await api.get('/api/sessions');
    return response.data.sessions;
  }

  async getAnalytics(): Promise<Analytics> {
    const response = await api.get('/api/analytics');
    return response.data;
  }
}
```

## Styling Guidelines

### Design System Classes

```typescript
// Use design system classes for consistency
<button className="btn btn-primary btn-md">Primary Action</button>
<button className="btn btn-secondary btn-md">Secondary Action</button>
<button className="btn btn-success btn-md">Success Action</button>

// Metric cards with status indicators
<div className="metric-card metric-card-excellent">
<div className="metric-card metric-card-warning">
<div className="metric-card metric-card-danger">

// Modern effects and backgrounds
<div className="glass-effect">
<div className="gradient-bg">
<h1 className="text-gradient">
```

### Tailwind CSS Usage

```typescript
// Good: Use design system first, then utilities
<div className="card p-6 hover:shadow-lg transition-all duration-300">

// Good: Responsive design with consistent spacing
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Good: Professional color palette
<div className="bg-slate-50 text-slate-700 border-slate-300">
```

### Custom CSS (when needed)

```css
/* Use for complex animations or custom chart styling */
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}
```

## State Management

### Custom Hooks

```typescript
// useAuth hook for authentication state
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authService.verifyToken(token).then(setUser);
    }
    setLoading(false);
  }, []);

  return { user, loading, login, logout };
};
```

### API Data Fetching

```typescript
// useApi hook for data fetching
const useApi = <T>(url: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get(url)
      .then(response => setData(response.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
};
```

## TypeScript Types

### Core Types

```typescript
interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  is_active: boolean;
}

interface Session {
  id: number;
  date: string;
  duration_hours: number;
  ahi: number;
  mask_leak: number;
  pressure_avg: number;
  quality_score: number;
}

interface Analytics {
  summary: {
    total_sessions: number;
    avg_ahi: number;
    avg_quality: number;
  };
  trends: TrendData[];
  recent_sessions: Session[];
}

interface SmartInsight {
  type: 'achievement' | 'improvement' | 'concern' | 'recommendation' | 'trend' | 'alert';
  title: string;
  message: string;
  confidence: 'high' | 'medium' | 'low';
  clinical_relevance: 'high' | 'medium' | 'low';
  actionable: boolean;
  data_points?: Record<string, any>;
  next_steps?: string[];
  priority: number;
  timestamp: string;
}
```

## Development Workflow

```bash
# Start development with hot reload
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format

# Build and preview
npm run build
npm run preview
```

## Testing

```typescript
// Component testing with React Testing Library
import { render, screen } from '@testing-library/react';
import { Dashboard } from './Dashboard';

test('renders dashboard metrics', () => {
  render(<Dashboard user={mockUser} />);
  expect(screen.getByText('Average AHI')).toBeInTheDocument();
});
```

## Performance Optimization

- **Code Splitting**: Lazy load components with React.lazy()
- **Memoization**: Use React.memo for expensive components
- **Virtualization**: Use react-window for large data lists
- **Image Optimization**: WebP format with fallbacks
- **Bundle Analysis**: Use webpack-bundle-analyzer

## Accessibility

- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG AA compliance
- **Focus Management**: Logical tab order
- **Semantic HTML**: Proper heading structure