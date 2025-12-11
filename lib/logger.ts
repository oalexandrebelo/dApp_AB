/**
 * Production-ready logger with conditional output
 * Only logs in development mode to keep production clean
 */

const isDev = process.env.NODE_ENV === 'development';

export const logger = {
    /**
     * Log general information (only in development)
     */
    log: (...args: any[]) => {
        if (isDev) {
            console.log(...args);
        }
    },

    /**
     * Log errors (always logged, even in production)
     */
    error: (...args: any[]) => {
        console.error(...args);
    },

    /**
     * Log warnings (only in development)
     */
    warn: (...args: any[]) => {
        if (isDev) {
            console.warn(...args);
        }
    },

    /**
     * Log debug information (only in development)
     */
    debug: (...args: any[]) => {
        if (isDev) {
            console.debug(...args);
        }
    },

    /**
     * Log info with prefix (only in development)
     */
    info: (prefix: string, ...args: any[]) => {
        if (isDev) {
            console.log(`[${prefix}]`, ...args);
        }
    }
};
