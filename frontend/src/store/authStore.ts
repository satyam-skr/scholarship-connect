import { create } from 'zustand';
import { User, UserRole } from '@/types';
import { api, setAuthToken } from '@/services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  clearError: () => void;
}

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

export const validatePassword = (password: string): string | null => {
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Must contain an uppercase letter';
  if (!/[a-z]/.test(password)) return 'Must contain a lowercase letter';
  if (!/\d/.test(password)) return 'Must contain a number';
  if (!/[@$!%*?&#]/.test(password)) return 'Must contain a special character (@$!%*?&#)';
  return null;
};

const storedUser = localStorage.getItem('authUser');

export const useAuthStore = create<AuthState>((set) => ({
  user: storedUser ? (JSON.parse(storedUser) as User) : null,
  isAuthenticated: Boolean(localStorage.getItem('authToken') && storedUser),
  error: null,
  login: async (email, password) => {
    try {
      const result = await api.post<{ success: boolean; token?: string; user?: User; error?: string }>('/auth/login', {
        email,
        password,
      });

      if (!result.success || !result.token || !result.user) {
        set({ error: result.error || 'Invalid email or password' });
        return false;
      }

      setAuthToken(result.token);
      localStorage.setItem('authUser', JSON.stringify(result.user));
      set({ user: result.user, isAuthenticated: true, error: null });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      set({ error: message });
      return false;
    }
  },
  signup: async (name, email, password, role) => {
    const pwError = validatePassword(password);
    if (pwError) return { success: false, error: pwError };

    try {
      const result = await api.post<{ success: boolean; token?: string; user?: User; error?: string }>('/auth/signup', {
        name,
        email,
        password,
        role,
      });

      if (!result.success || !result.token || !result.user) {
        return { success: false, error: result.error || 'Signup failed' };
      }

      setAuthToken(result.token);
      localStorage.setItem('authUser', JSON.stringify(result.user));
      set({ user: result.user, isAuthenticated: true, error: null });
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      return { success: false, error: message };
    }
  },
  logout: () => {
    setAuthToken(null);
    localStorage.removeItem('authUser');
    set({ user: null, isAuthenticated: false, error: null });
  },
  clearError: () => set({ error: null }),
}));
