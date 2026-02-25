/**
 * Mock Wallet API — uses dummyData for UI testing
 */
import {
  MOCK_WALLET_BALANCE,
  MOCK_WALLET_TRANSACTIONS,
  MOCK_KIND_STORE,
  simulateNetworkDelay,
} from "./dummyData";

let mockBalance = MOCK_WALLET_BALANCE.total;

export async function getWalletBalance() {
  await simulateNetworkDelay();
  return { success: true, data: { total: mockBalance } };
}

export async function getWalletTransactions() {
  await simulateNetworkDelay();
  return { success: true, data: { txns: MOCK_WALLET_TRANSACTIONS } };
}

export async function addCash(amount: number) {
  await simulateNetworkDelay(500, 1000);
  mockBalance += amount;
  console.log("[Mock] Added cash:", amount, "New balance:", mockBalance);
  return { success: true, data: { total: mockBalance } };
}

export async function transferMoney(data: { to_user_id: number; amount: number }) {
  await simulateNetworkDelay(500, 1000);
  if (data.amount > mockBalance) {
    return { success: false, errorMessage: "Insufficient balance" };
  }
  mockBalance -= data.amount;
  console.log("[Mock] Transferred:", data.amount, "to user:", data.to_user_id);
  return { success: true, data: { total: mockBalance } };
}

export async function getUserByQR(qr_data: string) {
  await simulateNetworkDelay(200, 500);
  return {
    success: true,
    data: {
      user_id: 1002,
      name: "Aarav Patel",
      photo: "https://ui-avatars.com/api/?name=Aarav+Patel&background=random",
    },
  };
}

export async function getKindStore() {
  await simulateNetworkDelay();
  return { success: true, data: MOCK_KIND_STORE };
}
