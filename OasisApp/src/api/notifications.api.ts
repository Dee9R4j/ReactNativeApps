/**
 * Mock notifications API — uses dummyData for UI testing
 * Replaces real axios-based API calls with simulated responses
 */
import {
  MOCK_NOTIFICATIONS,
  simulateNetworkDelay,
  type NotificationItem,
} from "./dummyData";

interface NotificationsResult {
  success: boolean;
  data?: NotificationItem[];
  errorMessage?: string;
}

export async function fetchUserNotifications(): Promise<NotificationsResult> {
  await simulateNetworkDelay();
  return {
    success: true,
    data: MOCK_NOTIFICATIONS,
  };
}
