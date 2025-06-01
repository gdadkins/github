/**
 * API Service for CPAP Analytics Platform
 * Handles all API calls to the backend
 */

import { User, AnalyticsData, AuthResponse, Session, FileUpload } from '../types';

// API Base URL - can be overridden in tests
const API_BASE_URL = process.env.NODE_ENV === 'test' 
  ? 'http://localhost:5000/api'
  : (globalThis as any).import?.meta?.env?.VITE_API_URL || 'http://localhost:5000/api';

// Additional interfaces for compatibility
export interface UserProfile {
  user: User & { full_name?: string };
  devices: Device[];
  statistics: Statistics;
}

export interface Device {
  id: number;
  manufacturer: string;
  model: string;
  serial_number: string;
  firmware_version: string;
  is_active: boolean;
  is_primary: boolean;
}

export interface Statistics {
  total_nights: number;
  average_ahi: number;
  average_duration_hours: number;
  compliance_rate_percent: number;
  date_range: {
    first_session: string;
    last_session: string;
  };
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('access_token');
  }

  private handleUnauthorized(): void {
    // Clear token and localStorage
    this.token = null;
    localStorage.removeItem('access_token');
    
    // Redirect to login page
    window.location.href = '/login';
  }

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async get(endpoint: string, options?: RequestInit): Promise<any> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: {
        ...this.getAuthHeaders(),
        ...options?.headers,
      },
      ...options,
    });

    if (response.status === 401) {
      this.handleUnauthorized();
      throw new Error('Authentication required');
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  async post(endpoint: string, data?: any, options?: RequestInit): Promise<any> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
        ...options?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (response.status === 401) {
      // Don't redirect on login endpoint failures
      if (!endpoint.includes('/auth/login')) {
        this.handleUnauthorized();
      }
      throw new Error('Authentication required');
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Auth methods
  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await this.post('/auth/login', { username, password });
    this.token = response.access_token;
    localStorage.setItem('access_token', this.token!);
    return response;
  }

  async register(username: string, email: string, password: string): Promise<{ message: string; user: User }> {
    return this.post('/auth/register', { username, email, password });
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('access_token');
  }

  // User methods
  async getUserProfile(): Promise<UserProfile> {
    try {
      // Get user profile
      const profileResponse = await this.get('/auth/profile');
      
      // Get analytics data
      const analyticsResponse = await this.get('/sessions/analytics');
      
      // Calculate compliance rate (nights with > 4 hours usage)
      const compliance_rate = analyticsResponse.recent_sessions 
        ? Math.round((analyticsResponse.recent_sessions.filter((s: any) => s.duration_hours >= 4).length / analyticsResponse.recent_sessions.length) * 100)
        : 0;
      
      // Get date range from sessions
      const sessions = analyticsResponse.recent_sessions || [];
      const first_session = sessions.length > 0 ? sessions[sessions.length - 1].date : new Date().toISOString().split('T')[0];
      const last_session = sessions.length > 0 ? sessions[0].date : new Date().toISOString().split('T')[0];
      
      return {
        user: { ...profileResponse.user, full_name: profileResponse.user.username },
        devices: [
          {
            id: 1,
            manufacturer: 'ResMed',
            model: 'AirSense 10',
            serial_number: 'RS123456789',
            firmware_version: '1.2.3',
            is_active: true,
            is_primary: true
          }
        ],
        statistics: {
          total_nights: analyticsResponse.summary?.total_sessions || 0,
          average_ahi: parseFloat((analyticsResponse.summary?.avg_ahi || 0).toFixed(1)),
          average_duration_hours: parseFloat((analyticsResponse.summary?.avg_duration || 0).toFixed(1)),
          compliance_rate_percent: compliance_rate,
          date_range: {
            first_session: first_session,
            last_session: last_session
          }
        }
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  // Analytics methods
  async getAnalytics(): Promise<AnalyticsData> {
    return this.get('/sessions/analytics');
  }

  async getInsights(): Promise<any> {
    return this.get('/sessions/insights');
  }

  // Session methods
  async getSessions(): Promise<Session[]> {
    return this.get('/sessions');
  }

  // Upload methods
  async uploadFile(file: File): Promise<FileUpload> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${this.baseURL}/upload/file`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
      body: formData,
    });

    if (response.status === 401) {
      this.handleUnauthorized();
      throw new Error('Authentication required');
    }

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }

    return response.json();
  }

  async getUploadHistory(): Promise<FileUpload[]> {
    const response = await this.get('/upload/history');
    return response.uploads;
  }
}

export const api = new ApiService();
export const apiService = api; // For compatibility
