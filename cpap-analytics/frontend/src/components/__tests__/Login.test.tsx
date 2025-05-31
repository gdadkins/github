import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Login from '../Login';
import { api } from '../../services/api';

// Mock the API
jest.mock('../../services/api');
const mockApi = api as jest.Mocked<typeof api>;

// Mock the auth context
const mockSetUser = jest.fn();
const mockNavigate = jest.fn();

jest.mock('../../App', () => ({
  useAuth: () => ({
    setUser: mockSetUser
  })
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const renderLogin = () => {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form correctly', () => {
    renderLogin();
    
    expect(screen.getByText('Sign in to CPAP Analytics')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.getByText(/Test credentials:/)).toBeInTheDocument();
  });

  it('updates input values when user types', async () => {
    const user = userEvent.setup();
    renderLogin();
    
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    
    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'testpass');
    
    expect(usernameInput).toHaveValue('testuser');
    expect(passwordInput).toHaveValue('testpass');
  });

  it('shows loading state during login', async () => {
    const user = userEvent.setup();
    mockApi.login.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    renderLogin();
    
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });
    
    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'testpass');
    await user.click(submitButton);
    
    expect(screen.getByText('Signing in...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('handles successful login', async () => {
    const user = userEvent.setup();
    const mockUser = { id: 1, username: 'testuser', email: 'test@example.com' };
    mockApi.login.mockResolvedValue({ user: mockUser, token: 'mock-token' });
    
    renderLogin();
    
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });
    
    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'testpass');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockApi.login).toHaveBeenCalledWith('testuser', 'testpass');
      expect(mockSetUser).toHaveBeenCalledWith(mockUser);
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('handles login error', async () => {
    const user = userEvent.setup();
    mockApi.login.mockRejectedValue(new Error('Invalid credentials'));
    
    renderLogin();
    
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });
    
    await user.type(usernameInput, 'wronguser');
    await user.type(passwordInput, 'wrongpass');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
    });
    
    expect(mockSetUser).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('prevents submission with empty fields', async () => {
    const user = userEvent.setup();
    renderLogin();
    
    const submitButton = screen.getByRole('button', { name: 'Sign in' });
    await user.click(submitButton);
    
    // Form should not submit due to required attributes
    expect(mockApi.login).not.toHaveBeenCalled();
  });

  it('clears error when user starts typing after error', async () => {
    const user = userEvent.setup();
    mockApi.login.mockRejectedValue(new Error('Invalid credentials'));
    
    renderLogin();
    
    const usernameInput = screen.getByPlaceholderText('Username');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign in' });
    
    // Trigger error
    await user.type(usernameInput, 'wronguser');
    await user.type(passwordInput, 'wrongpass');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
    });
    
    // Clear the form and type new values
    await user.clear(usernameInput);
    await user.clear(passwordInput);
    
    // Mock successful login for next attempt
    mockApi.login.mockResolvedValue({ 
      user: { id: 1, username: 'testuser', email: 'test@example.com' }, 
      token: 'mock-token' 
    });
    
    await user.type(usernameInput, 'testuser');
    await user.type(passwordInput, 'testpass');
    await user.click(submitButton);
    
    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByText('Invalid username or password')).not.toBeInTheDocument();
    });
  });

  it('has proper form accessibility', () => {
    renderLogin();
    
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    expect(usernameInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('required');
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});