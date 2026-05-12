import '@testing-library/jest-dom';

global.fetch = jest.fn();

jest.mock('../src/services/grpc-client', () => ({
  grpcClient: {
    call: jest.fn(),
    getApiUrl: jest.fn(() => 'http://localhost:8080'),
  },
}));

jest.mock('../src/lib/token-storage', () => ({
  tokenStorage: {
    setTokens: jest.fn(),
    getAccessToken: jest.fn(() => 'mock-access-token'),
    getRefreshToken: jest.fn(() => 'mock-refresh-token'),
    isAuthenticated: jest.fn(() => true),
    clearTokens: jest.fn(),
    getTokenExpiry: jest.fn(() => new Date(Date.now() + 3600000)),
    isTokenExpiringSoon: jest.fn(() => false),
  },
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});
