/**
 * Logging utility — structured console logs with prefixes
 */
export const logger = {
  info: (tag: string, message: string, data?: unknown) => {
    console.log(`ℹ️ [${tag}] ${message}`, data ?? "");
  },
  warn: (tag: string, message: string, data?: unknown) => {
    console.warn(`⚠️ [${tag}] ${message}`, data ?? "");
  },
  error: (tag: string, message: string, error?: unknown) => {
    console.error(`❌ [${tag}] ${message}`, error ?? "");
  },
  success: (tag: string, message: string, data?: unknown) => {
    console.log(`✅ [${tag}] ${message}`, data ?? "");
  },
};
