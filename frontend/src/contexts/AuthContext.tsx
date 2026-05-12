import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AuthUser, authService } from '../services/auth-service';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();

    const checkTokenExpiry = setInterval(async () => {
      if (authService.isAuthenticated()) {
        const authResponse = await authService.refreshToken();
        if (authResponse && authResponse.user) {
          setUser(authResponse.user);
        }
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(checkTokenExpiry);
  }, [fetchCurrentUser]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.login(email, password);
    if (response.user) {
      setUser(response.user);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const refreshToken = useCallback(async () => {
    const response = await authService.refreshToken();
    if (response && response.user) {
      setUser(response.user);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export default AuthContext;