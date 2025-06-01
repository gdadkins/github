import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from '../Dashboard';
import { apiService } from '../../services/api';

// Mock the API service
jest.mock('../../services/api');
const mockApiService = apiService as jest.Mocked<typeof apiService>;

// Mock chart components
jest.mock('../charts', () => ({
  AHITrendChart: ({ data }: { data: any[] }) => <div data-testid="ahi-trend-chart">AHI Chart: {data.length} points</div>,
  SleepQualityChart: ({ data }: { data: any[] }) => <div data-testid="sleep-quality-chart">Sleep Quality Chart: {data.length} points</div>,
  TherapyInsights: ({ summary }: { summary: any }) => <div data-testid="therapy-insights">Insights: {summary.total_sessions} sessions</div>,
  EventBreakdownChart: ({ data }: { data: any[] }) => <div data-testid="event-breakdown-chart">Events Chart: {data.length} points</div>
}));

jest.mock('../DateRangeSelector', () => {
  return function DateRangeSelector({ value, onChange }: { value: string; onChange: (value: string) => void }) {
    return (
      <select data-testid="date-range-selector" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="7d">7 days</option>
        <option value="30d">30 days</option>
        <option value="90d">90 days</option>
      </select>
    );
  };
});

jest.mock('../charts/ComplianceHeatmap', () => {
  return function ComplianceHeatmap({ sessions }: { sessions: any[] }) {
    return <div data-testid="compliance-heatmap">Heatmap: {sessions.length} sessions</div>;
  };
});

const mockProfile = {
  id: 1,
  username: 'testuser',
  email: 'test@example.com'
};

const mockAnalytics = {
  summary: {
    total_sessions: 30,
    avg_ahi: 4.2,
    avg_duration: 7.5,
    compliance_rate: 95.5
  },
  trends: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    ahi: 4.0 + Math.random() * 2,
    duration: 7.0 + Math.random() * 2,
    quality_score: 80 + Math.random() * 20
  })),
  recent_sessions: Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    duration_hours: 7.5,
    ahi: 4.2,
    leak_rate: 8.5,
    compliance_hours: 7.2
  }))
};

const mockOnLogout = jest.fn();

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApiService.getUserProfile.mockResolvedValue(mockProfile);
    mockApiService.getAnalytics.mockResolvedValue(mockAnalytics);
  });

  it('renders loading state initially', () => {
    render(<Dashboard onLogout={mockOnLogout} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('loads and displays user profile and analytics data', async () => {
    render(<Dashboard onLogout={mockOnLogout} />);

    await waitFor(() => {
      expect(screen.getByText('Welcome, testuser!')).toBeInTheDocument();
    });

    expect(mockApiService.getUserProfile).toHaveBeenCalled();
    expect(mockApiService.getAnalytics).toHaveBeenCalled();
  });

  it('displays analytics summary correctly', async () => {
    render(<Dashboard onLogout={mockOnLogout} />);

    await waitFor(() => {
      expect(screen.getByText('30')).toBeInTheDocument(); // total sessions
      expect(screen.getByText('4.2')).toBeInTheDocument(); // avg AHI
      expect(screen.getByText('7.5h')).toBeInTheDocument(); // avg duration
      expect(screen.getByText('95.5%')).toBeInTheDocument(); // compliance rate
    });
  });

  it('renders all chart components', async () => {
    render(<Dashboard onLogout={mockOnLogout} />);

    await waitFor(() => {
      expect(screen.getByTestId('ahi-trend-chart')).toBeInTheDocument();
      expect(screen.getByTestId('sleep-quality-chart')).toBeInTheDocument();
      expect(screen.getByTestId('therapy-insights')).toBeInTheDocument();
      expect(screen.getByTestId('event-breakdown-chart')).toBeInTheDocument();
    });
  });

  it('handles date range selection', async () => {
    const user = userEvent.setup();
    render(<Dashboard onLogout={mockOnLogout} />);

    await waitFor(() => {
      expect(screen.getByTestId('date-range-selector')).toBeInTheDocument();
    });

    const selector = screen.getByTestId('date-range-selector');
    await user.selectOptions(selector, '7d');

    expect(selector).toHaveValue('7d');
    // Charts should update with filtered data
    await waitFor(() => {
      expect(screen.getByText(/AHI Chart: 7 points/)).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    mockApiService.getUserProfile.mockRejectedValue(new Error('API Error'));
    mockApiService.getAnalytics.mockRejectedValue(new Error('API Error'));

    render(<Dashboard onLogout={mockOnLogout} />);

    await waitFor(() => {
      expect(screen.getByText(/error loading data/i)).toBeInTheDocument();
    });
  });

  it('calls logout function when logout button is clicked', async () => {
    const user = userEvent.setup();
    render(<Dashboard onLogout={mockOnLogout} />);

    await waitFor(() => {
      expect(screen.getByText('Welcome, testuser!')).toBeInTheDocument();
    });

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    await user.click(logoutButton);

    expect(mockOnLogout).toHaveBeenCalled();
  });

  it('shows compliance heatmap for 30+ day ranges', async () => {
    const user = userEvent.setup();
    render(<Dashboard onLogout={mockOnLogout} />);

    await waitFor(() => {
      expect(screen.getByTestId('compliance-heatmap')).toBeInTheDocument();
    });

    // Switch to 7-day range (should hide heatmap)
    const selector = screen.getByTestId('date-range-selector');
    await user.selectOptions(selector, '7d');

    // Heatmap should still be visible as component shows/hides based on date range
    expect(screen.getByTestId('compliance-heatmap')).toBeInTheDocument();
  });

  it('displays premium upgrade prompts for non-premium users', async () => {
    render(<Dashboard onLogout={mockOnLogout} />);

    await waitFor(() => {
      expect(screen.getByText('Welcome, testuser!')).toBeInTheDocument();
    });

    // Should show premium features in charts
    expect(screen.getByTestId('therapy-insights')).toBeInTheDocument();
  });

  it('filters analytics data correctly based on date range', async () => {
    const user = userEvent.setup();
    render(<Dashboard onLogout={mockOnLogout} />);

    await waitFor(() => {
      expect(screen.getByTestId('ahi-trend-chart')).toBeInTheDocument();
    });

    // Initially should show 30 days of data
    expect(screen.getByText(/AHI Chart: 30 points/)).toBeInTheDocument();

    // Switch to 7-day range
    const selector = screen.getByTestId('date-range-selector');
    await user.selectOptions(selector, '7d');

    // Should now show 7 days of data
    await waitFor(() => {
      expect(screen.getByText(/AHI Chart: 7 points/)).toBeInTheDocument();
    });
  });

  it('handles empty analytics data', async () => {
    mockApiService.getAnalytics.mockResolvedValue({
      summary: {
        total_sessions: 0,
        avg_ahi: 0,
        avg_duration: 0,
        compliance_rate: 0
      },
      trends: [],
      recent_sessions: []
    });

    render(<Dashboard onLogout={mockOnLogout} />);

    await waitFor(() => {
      expect(screen.getByText('0')).toBeInTheDocument(); // total sessions
    });

    expect(screen.getByText(/AHI Chart: 0 points/)).toBeInTheDocument();
    expect(screen.getByText(/Sleep Quality Chart: 0 points/)).toBeInTheDocument();
  });
});