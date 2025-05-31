import React from 'react';
import { AuthContextType } from '../types';
import { DEFAULT_AUTH_CONTEXT } from '../constants/auth';

// Auth context
export const AuthContext = React.createContext<AuthContextType>(DEFAULT_AUTH_CONTEXT);

// Hook to use auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  return {
    ...context,
    logout: async () => {
      // Clear user state first
      context.setUser(null);
      // Then remove token
      localStorage.removeItem('access_token');
      // Small delay to ensure state updates
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };
};