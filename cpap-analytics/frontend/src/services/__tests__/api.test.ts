import { apiService } from '../api';

// Mock fetch
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  describe('Authentication', () => {
    it('should login successfully', async () => {
      const mockResponse = {
        access_token: 'mock-token',
        token_type: 'bearer',
        user: {
          id: 1,
          username: 'testuser',
          email: 'test@example.com'
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        status: 200,
      } as Response);

      const result = await apiService.login('testuser', 'password123');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/auth/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'testuser', password: 'password123' })
        }
      );

      expect(result).toEqual({
        token: 'mock-token',
        user: mockResponse.user
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('access_token', 'mock-token');
    });

    it('should handle login failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ detail: 'Invalid credentials' })
      } as Response);

      await expect(apiService.login('wronguser', 'wrongpass'))
        .rejects.toThrow('Invalid credentials');
    });

    it('should register new user', async () => {
      const mockUser = {
        id: 1,
        username: 'newuser',
        email: 'new@example.com'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
        status: 200,
      } as Response);

      const result = await apiService.register('newuser', 'new@example.com', 'password123');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/auth/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            username: 'newuser', 
            email: 'new@example.com', 
            password: 'password123' 
          })
        }
      );

      expect(result).toEqual(mockUser);
    });

    it('should logout successfully', async () => {
      mockLocalStorage.getItem.mockReturnValue('mock-token');
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Successfully logged out' }),
        status: 200,
      } as Response);

      await apiService.logout();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/auth/logout',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token'
          }
        }
      );

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('access_token');
    });
  });

  describe('Profile', () => {
    it('should get user profile', async () => {
      mockLocalStorage.getItem.mockReturnValue('mock-token');
      
      const mockProfile = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com'
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockProfile,
        status: 200,
      } as Response);

      const result = await apiService.getProfile();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/auth/profile',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token'
          }
        }
      );

      expect(result).toEqual(mockProfile);
    });

    it('should handle unauthorized profile request', async () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-token');
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ detail: 'Invalid token' })
      } as Response);

      await expect(apiService.getProfile()).rejects.toThrow('Invalid token');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('access_token');
    });
  });

  describe('Analytics', () => {
    it('should get analytics data', async () => {
      mockLocalStorage.getItem.mockReturnValue('mock-token');
      
      const mockAnalytics = {
        summary: {
          total_sessions: 30,
          avg_ahi: 4.2,
          avg_duration: 7.5,
          compliance_rate: 95.5
        },
        trends: [
          { date: '2025-01-01', ahi: 4.0, duration: 7.5, quality_score: 85 }
        ],
        recent_sessions: [
          { 
            id: 1, 
            date: '2025-01-01', 
            duration_hours: 7.5, 
            ahi: 4.2, 
            leak_rate: 8.5, 
            compliance_hours: 7.2 
          }
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockAnalytics,
        status: 200,
      } as Response);

      const result = await apiService.getAnalytics();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/sessions/analytics',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer mock-token'
          }
        }
      );

      expect(result).toEqual(mockAnalytics);
    });

    it('should handle analytics request without token', async () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      await expect(apiService.getAnalytics()).rejects.toThrow('No authentication token found');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(apiService.login('test', 'test')).rejects.toThrow('Network error');
    });

    it('should handle non-JSON responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => { throw new Error('Invalid JSON'); },
        text: async () => 'Internal Server Error'
      } as Response);

      await expect(apiService.login('test', 'test')).rejects.toThrow('HTTP error! status: 500');
    });

    it('should handle missing error details', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({})
      } as Response);

      await expect(apiService.login('test', 'test')).rejects.toThrow('HTTP error! status: 400');
    });
  });

  describe('Token Management', () => {
    it('should use stored token for authenticated requests', async () => {
      mockLocalStorage.getItem.mockReturnValue('stored-token');
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1, username: 'test' }),
        status: 200,
      } as Response);

      await apiService.getProfile();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer stored-token'
          })
        })
      );
    });

    it('should clear token on 401 responses', async () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-token');
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ detail: 'Token expired' })
      } as Response);

      await expect(apiService.getProfile()).rejects.toThrow();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('access_token');
    });
  });
});