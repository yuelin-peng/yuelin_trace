export enum ErrorCode {
  UNSPECIFIED = 0,
  ARTICLE_NOT_FOUND = 1000,
  ARTICLE_INVALID_STATE = 1001,
  ARTICLE_ACCESS_DENIED = 1002,
  ARTICLE_TITLE_INVALID = 1003,
  ARTICLE_CONTENT_INVALID = 1004,
  AUTH_INVALID_CREDENTIALS = 2000,
  AUTH_TOKEN_EXPIRED = 2001,
  AUTH_TOKEN_INVALID = 2002,
  AUTH_USER_EXISTS = 2003,
  AUTH_USER_NOT_FOUND = 2004,
  AUTH_PASSWORD_WEAK = 2005,
  COMMENT_NOT_FOUND = 3000,
  COMMENT_ACCESS_DENIED = 3001,
  COMMENT_CONTENT_INVALID = 3002,
  COMMENT_DEPTH_EXCEEDED = 3003,
  SEARCH_INVALID_QUERY = 4000,
  SEARCH_RESULT_EMPTY = 4001,
  TOPIC_NOT_FOUND = 5000,
  TOPIC_ALREADY_EXISTS = 5001,
  REVISION_NOT_FOUND = 6000,
  REVISION_RESTORE_FAILED = 6001,
}

export interface ErrorDetail {
  reason: number;
  displayMessage: string;
  metadata?: Record<string, string>;
}

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly details?: ErrorDetail;

  constructor(code: ErrorCode, message: string, details?: ErrorDetail) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = 'AppError';
  }
}

export function handleGrpcError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    if (error.message.includes('401') || error.message.includes('unauthorized')) {
      return new AppError(ErrorCode.AUTH_TOKEN_INVALID, 'Session expired. Please login again.');
    }
    if (error.message.includes('403') || error.message.includes('forbidden')) {
      return new AppError(ErrorCode.ARTICLE_ACCESS_DENIED, 'You do not have permission to perform this action.');
    }
    if (error.message.includes('404') || error.message.includes('not found')) {
      return new AppError(ErrorCode.ARTICLE_NOT_FOUND, 'The requested resource was not found.');
    }
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return new AppError(ErrorCode.UNSPECIFIED, 'Network error. Please check your connection.');
    }
    return new AppError(ErrorCode.UNSPECIFIED, error.message);
  }

  return new AppError(ErrorCode.UNSPECIFIED, 'An unexpected error occurred.');
}

export function showErrorToast(error: unknown, customMessage?: string): void {
  const appError = handleGrpcError(error);
  console.error(appError.message);
  alert(customMessage || appError.message);
}

export function showSuccessToast(message: string): void {
  console.log(message);
  alert(message);
}

export function showLoadingToast(message: string): () => void {
  console.log(message);
  return () => {};
}