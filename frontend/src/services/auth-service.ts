import { tokenStorage } from '../lib/token-storage';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  role: number;
}

export interface AuthResponse {
  user: AuthUser | null;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

interface ApiUser {
  id: string;
  email: string;
  displayName: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiAuthResponse {
  user: ApiUser;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

function mapRoleToNumber(role: string): number {
  const roleMap: Record<string, number> = {
    'ADMIN': 1,
    'AUTHOR': 2,
    'READER': 3,
    'GUEST': 4,
  };
  return roleMap[role] ?? 0;
}

function mapApiUserToAuthUser(apiUser: ApiUser): AuthUser {
  return {
    id: apiUser.id,
    email: apiUser.email,
    displayName: apiUser.displayName,
    role: mapRoleToNumber(apiUser.role),
  };
}

function mapApiResponseToAuthResponse(apiResponse: ApiAuthResponse): AuthResponse {
  return {
    user: mapApiUserToAuthUser(apiResponse.user),
    accessToken: apiResponse.accessToken,
    refreshToken: apiResponse.refreshToken,
    expiresAt: new Date(apiResponse.expiresAt),
  };
}

async function apiCall<T>(endpoint: string, body?: Record<string, unknown>): Promise<T> {
  const isGet = !body;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Forward auth token for GET /me
  if (isGet && typeof window !== 'undefined') {
    const token = tokenStorage.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(endpoint, {
    method: isGet ? 'GET' : 'POST',
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = data?.error?.displayMessage || `HTTP ${response.status}`;
    throw new Error(errorMessage);
  }

  return data as T;
}

class AuthService {
  async register(email: string, password: string, displayName: string): Promise<AuthResponse> {
    try {
      const apiResponse = await apiCall<ApiAuthResponse>('/api/auth/register', {
        email,
        password,
        displayName,
      });

      if (!apiResponse?.user || !apiResponse.accessToken) {
        throw new Error('Registration failed');
      }

      const authResponse = mapApiResponseToAuthResponse(apiResponse);
      tokenStorage.setTokens(authResponse.accessToken, authResponse.refreshToken, authResponse.expiresAt);
      return authResponse;
    } catch (error) {
      console.error('Register failed:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const apiResponse = await apiCall<ApiAuthResponse>('/api/auth/login', {
        email,
        password,
      });

      if (!apiResponse?.user || !apiResponse.accessToken) {
        throw new Error('Login failed');
      }

      const authResponse = mapApiResponseToAuthResponse(apiResponse);
      tokenStorage.setTokens(authResponse.accessToken, authResponse.refreshToken, authResponse.expiresAt);
      return authResponse;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = tokenStorage.getRefreshToken();
      if (refreshToken) {
        await apiCall('/api/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      tokenStorage.clearTokens();
    }
  }

  async refreshToken(): Promise<AuthResponse | null> {
    try {
      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) {
        return null;
      }

      const apiResponse = await apiCall<{
        accessToken: string;
        refreshToken: string;
        expiresAt: string;
      }>('/api/auth/refresh', { refreshToken });

      if (!apiResponse?.accessToken) {
        tokenStorage.clearTokens();
        return null;
      }

      const authResponse: AuthResponse = {
        user: null,
        accessToken: apiResponse.accessToken,
        refreshToken: apiResponse.refreshToken,
        expiresAt: new Date(apiResponse.expiresAt),
      };

      tokenStorage.setTokens(authResponse.accessToken, authResponse.refreshToken, authResponse.expiresAt);
      return authResponse;
    } catch (error) {
      console.error('Token refresh failed:', error);
      tokenStorage.clearTokens();
      return null;
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const apiResponse = await apiCall<ApiUser>('/api/auth/me');

      if (!apiResponse?.id) {
        return null;
      }

      return mapApiUserToAuthUser(apiResponse);
    } catch (error) {
      console.error('GetCurrentUser failed:', error);
      return null;
    }
  }

  getAccessToken(): string | null {
    return tokenStorage.getAccessToken();
  }

  isAuthenticated(): boolean {
    return tokenStorage.isAuthenticated();
  }
}

export const authService = new AuthService();
