/**
 * Types for centralized API error handling
 */

/**
 * Interface for normalized API errors
 */
export interface ApiError {
  /** Standardized error code */
  code: ApiErrorCode;
  /** User-readable error message */
  message: string;
  /** HTTP status code if available */
  status?: number;
  /** Additional details for debugging */
  details?: any;
  /** Error timestamp */
  timestamp: string;
}

/**
 * Standardized error codes for the API
 */
export enum ApiErrorCode {
  // Network errors
  TIMEOUT = 'TIMEOUT',
  NETWORK_ERROR = 'NETWORK_ERROR',
  
  // Server errors
  SERVER_ERROR = 'SERVER_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  
  // Client errors
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  
  // Unknown errors
  UNKNOWN = 'UNKNOWN',
}

/**
 * Default error messages for each code
 */
export const DEFAULT_ERROR_MESSAGES: Record<ApiErrorCode, string> = {
  [ApiErrorCode.TIMEOUT]: 'Request timeout - server took too long to respond',
  [ApiErrorCode.NETWORK_ERROR]: 'Network error - unable to reach the server',
  [ApiErrorCode.SERVER_ERROR]: 'Server error occurred',
  [ApiErrorCode.INTERNAL_SERVER_ERROR]: 'Internal server error',
  [ApiErrorCode.BAD_REQUEST]: 'Bad request - invalid parameters',
  [ApiErrorCode.UNAUTHORIZED]: 'Unauthorized access',
  [ApiErrorCode.FORBIDDEN]: 'Forbidden access',
  [ApiErrorCode.NOT_FOUND]: 'Resource not found',
  [ApiErrorCode.VALIDATION_ERROR]: 'Validation error',
  [ApiErrorCode.UNKNOWN]: 'An unknown error occurred',
};
