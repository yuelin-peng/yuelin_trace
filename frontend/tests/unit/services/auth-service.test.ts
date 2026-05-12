import { authService } from '../../../src/services/auth-service';
import { grpcClient } from '../../../src/services/grpc-client';
import { tokenStorage } from '../../../src/lib/token-storage';

jest.mock('../../../src/services/grpc-client');
jest.mock('../../../src/lib/token-storage');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const mockResponse = {
        user: {
          id: 'user-new',
          email: 'new@example.com',
          displayName: 'New User',
          role: 2,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
      };

      (grpcClient.call as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await authService.register('new@example.com', 'password123', 'New User');

      expect(result.user?.email).toBe('new@example.com');
      expect(result.accessToken).toBe('mock-access-token');
      expect(tokenStorage.setTokens).toHaveBeenCalled();
    });

    it('should throw error when registration fails', async () => {
      (grpcClient.call as jest.Mock).mockRejectedValueOnce(new Error('Email already exists'));

      await expect(
        authService.register('existing@example.com', 'password123', 'User')
      ).rejects.toThrow('Email already exists');
    });
  });

  describe('login', () => {
    it('should login user with valid credentials', async () => {
      const mockResponse = {
        user: {
          id: 'user-123',
          email: 'user@example.com',
          displayName: 'Test User',
          role: 2,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
      };

      (grpcClient.call as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await authService.login('user@example.com', 'password123');

      expect(result.user?.email).toBe('user@example.com');
      expect(result.accessToken).toBe('mock-access-token');
    });

    it('should throw error for invalid credentials', async () => {
      (grpcClient.call as jest.Mock).mockRejectedValueOnce(new Error('Invalid credentials'));

      await expect(
        authService.login('wrong@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('logout', () => {
    it('should logout and clear tokens', async () => {
      (grpcClient.call as jest.Mock).mockResolvedValueOnce({});
      (tokenStorage.getRefreshToken as jest.Mock).mockReturnValue('refresh-token');

      await authService.logout();

      expect(grpcClient.call).toHaveBeenCalledWith(
        'com.yuelin.auth.v1.AuthService',
        'Logout',
        expect.any(Object)
      );
      expect(tokenStorage.clearTokens).toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const mockResponse = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
      };

      (grpcClient.call as jest.Mock).mockResolvedValueOnce(mockResponse);
      (tokenStorage.getRefreshToken as jest.Mock).mockReturnValue('old-refresh-token');

      const result = await authService.refreshToken();

      expect(result?.accessToken).toBe('new-access-token');
      expect(tokenStorage.setTokens).toHaveBeenCalled();
    });

    it('should return null when no refresh token', async () => {
      (tokenStorage.getRefreshToken as jest.Mock).mockReturnValue(null);

      const result = await authService.refreshToken();

      expect(result).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should fetch current user', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'user@example.com',
        displayName: 'Test User',
        role: 2,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      };
      const mockResponse = { user: mockUser };

      (grpcClient.call as jest.Mock).mockResolvedValueOnce(mockResponse);

      const result = await authService.getCurrentUser();

      expect(result?.email).toBe('user@example.com');
    });

    it('should return null when not authenticated', async () => {
      (grpcClient.call as jest.Mock).mockResolvedValueOnce({ user: null });

      const result = await authService.getCurrentUser();

      expect(result).toBeNull();
    });
  });

  describe('getAccessToken', () => {
    it('should return access token from storage', () => {
      (tokenStorage.getAccessToken as jest.Mock).mockReturnValue('stored-token');

      const result = authService.getAccessToken();

      expect(result).toBe('stored-token');
    });
  });

  describe('isAuthenticated', () => {
    it('should return authentication status from storage', () => {
      (tokenStorage.isAuthenticated as jest.Mock).mockReturnValue(true);

      expect(authService.isAuthenticated()).toBe(true);

      (tokenStorage.isAuthenticated as jest.Mock).mockReturnValue(false);

      expect(authService.isAuthenticated()).toBe(false);
    });
  });
});