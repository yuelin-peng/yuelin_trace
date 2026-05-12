const TOKEN_STORAGE_KEY = 'auth_tokens';

export interface TokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

class TokenStorage {
  private getStoredTokens(): TokenData | null {
    if (typeof window === 'undefined') return null;
    
    const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!stored) return null;
    
    try {
      return JSON.parse(stored) as TokenData;
    } catch {
      return null;
    }
  }

  private storeTokens(tokens: TokenData): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
  }

  private removeTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }

  setTokens(accessToken: string, refreshToken: string, expiresAt: Date): void {
    this.storeTokens({
      accessToken,
      refreshToken,
      expiresAt: expiresAt.toISOString(),
    });
  }

  getAccessToken(): string | null {
    const tokens = this.getStoredTokens();
    if (!tokens) return null;
    
    if (new Date(tokens.expiresAt) <= new Date()) {
      this.removeTokens();
      return null;
    }
    
    return tokens.accessToken;
  }

  getRefreshToken(): string | null {
    const tokens = this.getStoredTokens();
    return tokens?.refreshToken || null;
  }

  isAuthenticated(): boolean {
    return this.getAccessToken() !== null;
  }

  clearTokens(): void {
    this.removeTokens();
  }

  getTokenExpiry(): Date | null {
    const tokens = this.getStoredTokens();
    if (!tokens) return null;
    return new Date(tokens.expiresAt);
  }

  isTokenExpiringSoon(thresholdMs: number = 5 * 60 * 1000): boolean {
    const expiry = this.getTokenExpiry();
    if (!expiry) return true;
    
    const now = new Date();
    return expiry.getTime() - now.getTime() < thresholdMs;
  }
}

export const tokenStorage = new TokenStorage();