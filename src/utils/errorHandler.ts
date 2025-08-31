/**
 * Centralized error handler for normalizing API errors
 */

import type { AxiosError } from 'axios';
import { type ApiError, ApiErrorCode, DEFAULT_ERROR_MESSAGES } from '@/types/api/errors';
import { createLogger } from './logger';

const logger = createLogger('ErrorHandler');

/**
 * Normalizes an error into a standardized ApiError
 * @param error The error to normalize (usually from Axios)
 * @param context Optional context for logging
 * @returns A normalized ApiError
 */
export const normalizeError = (error: any, context?: string): ApiError => {
  const timestamp = new Date().toISOString();
  const logContext = context ? `${context}:` : '';

  // Timeout error
  if (error.code === 'ECONNABORTED') {
    const apiError: ApiError = {
      code: ApiErrorCode.TIMEOUT,
      message: DEFAULT_ERROR_MESSAGES[ApiErrorCode.TIMEOUT],
      timestamp,
      details: { originalError: error.message }
    };
    logger.warn(`${logContext}Timeout error`, apiError);
    return apiError;
  }

  // Network error (no response)
  if (error.request && !error.response) {
    const apiError: ApiError = {
      code: ApiErrorCode.NETWORK_ERROR,
      message: DEFAULT_ERROR_MESSAGES[ApiErrorCode.NETWORK_ERROR],
      timestamp,
      details: { originalError: error.message }
    };
    logger.error(`${logContext}Network error`, apiError);
    return apiError;
  }

  // Error with server response
  if (error.response) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    const responseData = axiosError.response?.data as any;

    let code: ApiErrorCode;
    let message: string;

    switch (status) {
      case 400:
        code = ApiErrorCode.BAD_REQUEST;
        message = responseData?.message || DEFAULT_ERROR_MESSAGES[code];
        break;
      case 401:
        code = ApiErrorCode.UNAUTHORIZED;
        message = responseData?.message || DEFAULT_ERROR_MESSAGES[code];
        break;
      case 403:
        code = ApiErrorCode.FORBIDDEN;
        message = responseData?.message || DEFAULT_ERROR_MESSAGES[code];
        break;
      case 404:
        code = ApiErrorCode.NOT_FOUND;
        message = responseData?.message || DEFAULT_ERROR_MESSAGES[code];
        break;
      case 422:
        code = ApiErrorCode.VALIDATION_ERROR;
        message = responseData?.message || DEFAULT_ERROR_MESSAGES[code];
        break;
      case 500:
        code = ApiErrorCode.INTERNAL_SERVER_ERROR;
        message = responseData?.message || DEFAULT_ERROR_MESSAGES[code];
        break;
      default:
        code = ApiErrorCode.SERVER_ERROR;
        message = responseData?.message || DEFAULT_ERROR_MESSAGES[code];
    }

    const apiError: ApiError = {
      code,
      message,
      status,
      timestamp,
      details: {
        responseData,
        originalError: error.message
      }
    };

    logger.error(`${logContext}Server error ${status}`, apiError);
    return apiError;
  }

  // Unknown error
  const apiError: ApiError = {
    code: ApiErrorCode.UNKNOWN,
    message: error.message || DEFAULT_ERROR_MESSAGES[ApiErrorCode.UNKNOWN],
    timestamp,
    details: { originalError: error }
  };

  logger.error(`${logContext}Unknown error`, apiError);
  return apiError;
};

/**
 * Checks if an error is an ApiError
 * @param error The error to check
 * @returns true if it's an ApiError
 */
export const isApiError = (error: any): error is ApiError => {
  return error && 
         typeof error === 'object' && 
         'code' in error && 
         'message' in error && 
         'timestamp' in error &&
         Object.values(ApiErrorCode).includes(error.code);
};

/**
 * Creates a custom ApiError
 * @param code The error code
 * @param message The error message (optional, uses default message if not provided)
 * @param details Additional details
 * @returns An ApiError
 */
export const createApiError = (
  code: ApiErrorCode, 
  message?: string, 
  details?: any
): ApiError => ({
  code,
  message: message || DEFAULT_ERROR_MESSAGES[code],
  timestamp: new Date().toISOString(),
  details
});
