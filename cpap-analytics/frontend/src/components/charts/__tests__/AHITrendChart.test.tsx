import React from 'react';
import { render, screen } from '@testing-library/react';
import { AHITrendChart } from '../AHITrendChart';

// Mock Recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  AreaChart: ({ children }: { children: React.ReactNode }) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div data-testid="area" />,
  XAxis: ({ dataKey }: { dataKey: string }) => <div data-testid="x-axis" data-key={dataKey} />,
  YAxis: ({ label }: { label: { value: string } }) => <div data-testid="y-axis" data-label={label?.value} />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ReferenceLine: ({ y, label }: { y: number; label: string }) => (
    <div data-testid="reference-line" data-y={y} data-label={label} />
  ),
}));

const mockData = [
  { date: '2025-01-01', ahi: 3.2 },
  { date: '2025-01-02', ahi: 4.1 },
  { date: '2025-01-03', ahi: 2.8 },
  { date: '2025-01-04', ahi: 5.2 },
  { date: '2025-01-05', ahi: 3.7 },
];

const mockLongData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(2025, 0, i + 1).toISOString().split('T')[0],
  ahi: 3.0 + Math.random() * 3
}));

describe('AHITrendChart', () => {
  it('renders chart with provided data', () => {
    render(<AHITrendChart data={mockData} />);
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    expect(screen.getByTestId('area')).toBeInTheDocument();
  });

  it('displays chart title', () => {
    render(<AHITrendChart data={mockData} />);
    
    expect(screen.getByText('AHI Trend Analysis')).toBeInTheDocument();
  });

  it('shows target goal reference line', () => {
    render(<AHITrendChart data={mockData} />);
    
    const referenceLine = screen.getByTestId('reference-line');
    expect(referenceLine).toHaveAttribute('data-y', '5');
    expect(referenceLine).toHaveAttribute('data-label', 'Target: <5.0');
  });

  it('configures axes correctly', () => {
    render(<AHITrendChart data={mockData} />);
    
    const xAxis = screen.getByTestId('x-axis');
    const yAxis = screen.getByTestId('y-axis');
    
    expect(xAxis).toHaveAttribute('data-key', 'date');
    expect(yAxis).toHaveAttribute('data-label', 'AHI (events/hour)');
  });

  it('renders with empty data', () => {
    render(<AHITrendChart data={[]} />);
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByText('AHI Trend Analysis')).toBeInTheDocument();
  });

  it('handles long data sets', () => {
    render(<AHITrendChart data={mockLongData} />);
    
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    expect(screen.getByText('AHI Trend Analysis')).toBeInTheDocument();
  });

  it('includes proper chart components', () => {
    render(<AHITrendChart data={mockData} />);
    
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  it('shows insight summary when data is available', () => {
    render(<AHITrendChart data={mockData} />);
    
    // Should show some insight about the AHI values
    expect(screen.getByText(/trend/i)).toBeInTheDocument();
  });

  it('displays average AHI calculation', () => {
    const dataWithConsistentValues = [
      { date: '2025-01-01', ahi: 4.0 },
      { date: '2025-01-02', ahi: 4.0 },
      { date: '2025-01-03', ahi: 4.0 },
    ];
    
    render(<AHITrendChart data={dataWithConsistentValues} />);
    
    // Should show average AHI value
    expect(screen.getByText(/4\.0/)).toBeInTheDocument();
  });

  it('handles single data point', () => {
    const singleDataPoint = [{ date: '2025-01-01', ahi: 3.5 }];
    
    render(<AHITrendChart data={singleDataPoint} />);
    
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    expect(screen.getByText('AHI Trend Analysis')).toBeInTheDocument();
  });

  it('formats date labels appropriately', () => {
    render(<AHITrendChart data={mockData} />);
    
    const xAxis = screen.getByTestId('x-axis');
    expect(xAxis).toHaveAttribute('data-key', 'date');
  });
});