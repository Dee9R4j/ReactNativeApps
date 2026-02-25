/**
 * Mock FCM token API — all functions referenced by old code
 */
import { simulateNetworkDelay } from "./dummyData";

export async function registerFcmToken(token: string) {
  await simulateNetworkDelay(100, 300);
  console.log("[Mock] FCM token registered:", token.substring(0, 20) + "...");
  return { success: true };
}

export async function sendFcmToken(data: string | { fcm_token: string; jwt: string }) {
  await simulateNetworkDelay(100, 300);
  const token = typeof data === "string" ? data : data.fcm_token;
  console.log("[Mock] FCM token sent:", token.substring(0, 20) + "...");
  return { success: true, errorMessage: undefined as string | undefined };
}

export async function unregisterFcmToken() {
  await simulateNetworkDelay(100, 300);
  console.log("[Mock] FCM token unregistered");
  return { success: true };
}
