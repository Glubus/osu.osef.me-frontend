/**
 * Centralized logging system for the application
 * Allows creating contextual loggers with uniform formatting
 */

export interface Logger {
  debug: (message: string, data?: unknown) => void;
  info: (message: string, data?: unknown) => void;
  warn: (message: string, data?: unknown) => void;
  error: (message: string, error?: unknown) => void;
}

/**
 * Creates a contextual logger with a specific prefix
 * @param context The logger context (ex: "API:BeatmapCount", "Hook:Filters")
 * @returns A logger object with debug, info, warn, error methods
 */
export const createLogger = (context: string): Logger => ({
  debug: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${context}] ${message}`, data !== undefined ? data : '');
    }
  },

  info: (message: string, data?: unknown) => {
    console.info(`[${context}] ${message}`, data !== undefined ? data : '');
  },

  warn: (message: string, data?: unknown) => {
    console.warn(`[${context}] ${message}`, data !== undefined ? data : '');
  },

  error: (message: string, error?: unknown) => {
    console.error(`[${context}] ${message}`, error !== undefined ? error : '');
  },
});

/**
 * Global logger for the application
 */
export const appLogger = createLogger('App');
