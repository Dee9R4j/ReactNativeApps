/**
 * Logging Utility
 * Centralized logging with environment awareness
 */
const isDev = __DEV__;

export const Logging = {
  Log: (message: string, ...args: unknown[]): void => {
    if (isDev) console.log(`[BitsHub] ${message}`, ...args);
  },

  LogError: (message: string, ...args: unknown[]): void => {
    console.error(`[BitsHub ERROR] ${message}`, ...args);
  },

  APIError: (message: string, ...args: unknown[]): void => {
    console.error(`[BitsHub API ERROR] ${message}`, ...args);
  },

  LogWarning: (message: string, ...args: unknown[]): void => {
    if (isDev) console.warn(`[BitsHub WARN] ${message}`, ...args);
  },
} as const;
