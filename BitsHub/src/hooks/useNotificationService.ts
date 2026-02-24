/**
 * Notification Service Hook (Mock)
 */
import { useEffect, useState } from "react";

interface UseNotificationServiceOptions {
  enabled?: boolean;
  onTokenReceived?: (token: string) => void;
}

export const useNotificationService = (options: UseNotificationServiceOptions = {}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [pushToken, setPushToken] = useState<string | null>(null);

  useEffect(() => {
    if (!options.enabled) return;
    // Mock initialization
    const mockToken = "mock_push_token_" + Date.now();
    setPushToken(mockToken);
    setIsInitialized(true);
    options.onTokenReceived?.(mockToken);
  }, [options.enabled]);

  return { isInitialized, pushToken };
};
