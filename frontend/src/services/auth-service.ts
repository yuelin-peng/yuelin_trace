import { grpcClient } from './grpc-client';
import {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  GetCurrentUserRequest,
  GetCurrentUserResponse,
} from '../generated/com/yuelin/auth/v1/auth';
import { User } from '../generated/com/yuelin/user/v1/user';
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

class AuthService {
  async register(email: string, password: string, displayName: string): Promise<AuthResponse> {
    try {
      const request: RegisterRequest = {
        email,
        password,
        displayName,
      };

      const response = await grpcClient.call<RegisterResponse>(
        'com.yuelin.auth.v1.AuthService',
        'Register',
        RegisterRequest.toJSON(request)
      );

      if (!response?.user || !response.accessToken) {
        throw new Error('Registration failed');
      }

      const user = User.fromJSON(response.user);
      const authResponse: AuthResponse = {
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          role: user.role,
        },
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresAt: response.expiresAt ? new Date(response.expiresAt) : new Date(),
      };

      tokenStorage.setTokens(authResponse.accessToken, authResponse.refreshToken, authResponse.expiresAt);
      return authResponse;
    } catch (error) {
      console.error('Register failed:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const request: LoginRequest = { email, password };

      const response = await grpcClient.call<LoginResponse>(
        'com.yuelin.auth.v1.AuthService',
        'Login',
        LoginRequest.toJSON(request)
      );

      if (!response?.user || !response.accessToken) {
        throw new Error('Login failed');
      }

      const user = User.fromJSON(response.user);
      const authResponse: AuthResponse = {
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          role: user.role,
        },
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresAt: response.expiresAt ? new Date(response.expiresAt) : new Date(),
      };

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
        const request: LogoutRequest = { refreshToken };
        await grpcClient.call(
          'com.yuelin.auth.v1.AuthService',
          'Logout',
          LogoutRequest.toJSON(request)
        );
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

      const request: RefreshTokenRequest = { refreshToken };
      const response = await grpcClient.call<RefreshTokenResponse>(
        'com.yuelin.auth.v1.AuthService',
        'RefreshToken',
        RefreshTokenRequest.toJSON(request)
      );

      if (!response?.accessToken) {
        tokenStorage.clearTokens();
        return null;
      }

      const authResponse: AuthResponse = {
        user: null,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresAt: response.expiresAt ? new Date(response.expiresAt) : new Date(),
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
      const request: GetCurrentUserRequest = {};
      const response = await grpcClient.call<GetCurrentUserResponse>(
        'com.yuelin.auth.v1.AuthService',
        'GetCurrentUser',
        GetCurrentUserRequest.toJSON(request)
      );

      if (!response?.user) {
        return null;
      }

      const user = User.fromJSON(response.user);
      return {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
      };
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