export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  is_active: boolean;
  name?: string;
  full_name?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
}

export interface Session {
  id: number;
  user_id: number;
  date: string;
  duration_hours: number;
  ahi: number;
  mask_leak: number;
  pressure_avg: number;
  pressure_95?: number;
  quality_score: number;
  central_apneas?: number;
  obstructive_apneas?: number;
  hypopneas?: number;
  created_at: string;
}

export interface FileUpload {
  id: number;
  user_id: number;
  filename: string;
  original_filename: string;
  file_size: number;
  file_type: string;
  upload_date: string;
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
  error_message?: string;
  sessions_imported: number;
}

export interface AnalyticsSummary {
  total_sessions: number;
  avg_ahi: number;
  avg_quality: number;
  avg_duration: number;
  avg_leak: number;
}

export interface TrendData {
  date: string;
  ahi: number;
  quality_score: number;
  duration_hours: number;
}

export interface AnalyticsData {
  summary: AnalyticsSummary;
  trends: TrendData[];
  recent_sessions: Session[];
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface ApiError {
  error: string;
}
