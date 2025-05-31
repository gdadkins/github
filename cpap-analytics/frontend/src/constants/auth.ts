import { AuthContextType } from '../types';

export const DEFAULT_AUTH_CONTEXT: AuthContextType = {
  user: null,
  loading: false,
  setUser: () => {}
};