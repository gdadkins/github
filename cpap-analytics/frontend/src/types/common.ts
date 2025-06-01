export interface BaseComponentProps {
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export interface BaseWidgetProps extends BaseComponentProps {
  data: any;
  className?: string;
}

export interface BaseChartProps extends BaseWidgetProps {
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
}

export interface AsyncDataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface DateRangeData {
  date?: string;
  session_date?: string;
}

export type StatusType = 'excellent' | 'good' | 'warning' | 'danger' | 'neutral';