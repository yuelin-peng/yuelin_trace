# Auth API Contract

## Service: AuthService (com.yuelin.auth.v1.AuthService)

## Endpoints

### Register

Registers a new user account.

**Request**: `RegisterRequest`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | User email (unique) |
| password | string | Yes | User password |
| display_name | string | Yes | Display name |

**Response**: `RegisterResponse`
| Field | Type | Description |
|-------|------|-------------|
| user | User | The registered user |
| access_token | string | JWT access token |
| refresh_token | string | JWT refresh token |
| expires_at | Timestamp | Token expiration |

**Errors**:
- `AUTH_USER_EXISTS` (2003): Email already registered
- `AUTH_PASSWORD_WEAK` (2005): Password does not meet requirements

**Auth**: None

---

### Login

Authenticates user credentials.

**Request**: `LoginRequest`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | User email |
| password | string | Yes | User password |

**Response**: `LoginResponse`
| Field | Type | Description |
|-------|------|-------------|
| user | User | The authenticated user |
| access_token | string | JWT access token |
| refresh_token | string | JWT refresh token |
| expires_at | Timestamp | Token expiration |

**Errors**:
- `AUTH_INVALID_CREDENTIALS` (2000): Wrong email or password

**Auth**: None

---

### Logout

Ends user session.

**Request**: `LogoutRequest`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| refresh_token | string | Yes | Refresh token to invalidate |

**Response**: `google.protobuf.Empty`

**Auth**: Required

---

### RefreshToken

Refreshes expired access token.

**Request**: `RefreshTokenRequest`
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| refresh_token | string | Yes | Current refresh token |

**Response**: `RefreshTokenResponse`
| Field | Type | Description |
|-------|------|-------------|
| access_token | string | New JWT access token |
| refresh_token | string | New JWT refresh token |
| expires_at | Timestamp | New expiration |

**Errors**:
- `AUTH_TOKEN_EXPIRED` (2001): Refresh token has expired
- `AUTH_TOKEN_INVALID` (2002): Refresh token is invalid

**Auth**: None

---

### GetCurrentUser

Gets the currently authenticated user info.

**Request**: `GetCurrentUserRequest` (empty)

**Response**: `GetCurrentUserResponse`
| Field | Type | Description |
|-------|------|-------------|
| user | User | The current user |

**Errors**:
- `AUTH_TOKEN_INVALID` (2002): No valid session

**Auth**: Required
