/**
 * Centralized Axios client for all API requests
 * Provides uniform configuration and centralized error handling
 */

import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { API_BASE_URL } from '@/types/global';
import { normalizeError } from '@/utils/errorHandler';
import { createLogger } from '@/utils/logger';

const logger = createLogger('API:Client');

/**
 * Default configuration for the API client
 */
const DEFAULT_CONFIG: AxiosRequestConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Centralized Axios instance with configured interceptors
 */
export const apiClient: AxiosInstance = axios.create(DEFAULT_CONFIG);

/**
 * Request interceptor for development logging
 */
apiClient.interceptors.request.use(
  (config) => {
    logger.debug(`Making ${config.method?.toUpperCase()} request to ${config.url}`, {
      params: config.params,
      data: config.data
    });
    return config;
  },
  (error) => {
    logger.error('Request error:', error);
    return Promise.reject(normalizeError(error, 'Request'));
  }
);

/**
 * Response interceptor for centralized error handling
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    logger.debug(`Received response from ${response.config.url}`, {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    const normalizedError = normalizeError(error, 'Response');
    logger.error('Response error:', normalizedError);
    return Promise.reject(normalizedError);
  }
);

/**
 * Utility methods for typed API requests
 */
export const api = {
  /**
   * Typed GET request
   */
  get: async <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  },

  /**
   * Typed POST request
   */
  post: async <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
  },

  /**
   * Typed PUT request
   */
  put: async <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.put<T>(url, data, config);
    return response.data;
  },

  /**
   * Typed PATCH request
   */
  patch: async <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.patch<T>(url, data, config);
    return response.data;
  },

  /**
   * Typed DELETE request
   */
  delete: async <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.delete<T>(url, config);
    return response.data;
  },
};

/**
 * Export default instance for compatibility
 */
export default apiClient;
