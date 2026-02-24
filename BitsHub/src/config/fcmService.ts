/**
 * FCM Service Config (Mock)
 */
let cachedFcmToken: string | null = null;

export const getCachedFcmToken = (): string | null => cachedFcmToken;

export const setCachedFcmToken = (token: string): void => {
  cachedFcmToken = token;
};

export const clearCachedFcmToken = (): void => {
  cachedFcmToken = null;
};
