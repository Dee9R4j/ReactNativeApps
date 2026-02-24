/**
 * Notification Service Config
 * Mock notification service for UI development
 */
export const notificationService = {
  subscribeToAllTopic: async (): Promise<void> => {
    console.log("[Mock] Subscribed to all notifications topic");
  },
  unsubscribeFromAllTopic: async (): Promise<void> => {
    console.log("[Mock] Unsubscribed from all notifications topic");
  },
};
