/**
 * Mock Split / Friends API — uses dummyData for UI testing
 */
import {
  MOCK_FRIENDS,
  MOCK_SPLITS,
  MOCK_FRIEND_REQUEST_URL,
  simulateNetworkDelay,
} from "./dummyData";

export async function getAllSplits() {
  await simulateNetworkDelay();
  return { success: true, data: MOCK_SPLITS };
}

export async function getFriends() {
  await simulateNetworkDelay();
  return { success: true, data: MOCK_FRIENDS };
}

export async function addFriend(token: string) {
  await simulateNetworkDelay(300, 600);
  console.log("[Mock] Friend added with token:", token);
  return { success: true, data: { message: "Friend added successfully" } };
}

export async function removeFriend(friendId: number) {
  await simulateNetworkDelay(300, 600);
  console.log("[Mock] Friend removed:", friendId);
  return { success: true, data: { message: "Friend removed" } };
}

export async function generateFriendRequestUrl() {
  await simulateNetworkDelay(200, 400);
  return { success: true, data: { url: MOCK_FRIEND_REQUEST_URL } };
}

export async function qrAddFriend(qr_data: string) {
  await simulateNetworkDelay(300, 600);
  console.log("[Mock] QR friend add:", qr_data);
  return { success: true, data: { message: "Friend added via QR" } };
}

export async function getSplitStatus(splitId: number) {
  await simulateNetworkDelay();
  const split = MOCK_SPLITS.find((s) => s.id === splitId);
  return split
    ? { success: true, data: split }
    : { success: false, errorMessage: "Split not found" };
}

export async function approveSplit(splitId: number) {
  await simulateNetworkDelay(500, 1000);
  console.log("[Mock] Split approved:", splitId);
  return { success: true, data: { message: "Split approved" } };
}

export async function createSplit(data: any) {
  await simulateNetworkDelay(500, 1000);
  console.log("[Mock] Split created:", data);
  return {
    success: true,
    data: {
      id: Math.floor(Math.random() * 10000),
      ...data,
      status: "pending",
      created_at: new Date().toISOString(),
    },
  };
}
