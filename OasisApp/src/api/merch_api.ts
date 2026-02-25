/**
 * Mock merch API — all functions referenced by old code
 * All functions accept an optional axios arg for backward compat (ignored in mock)
 */
import { MOCK_MERCH, simulateNetworkDelay } from "./dummyData";

export async function getMerch(axios?: any) {
  await simulateNetworkDelay();
  return { success: true, data: MOCK_MERCH };
}

export async function getMerchById(id: number) {
  await simulateNetworkDelay(100, 300);
  const item = MOCK_MERCH.find((m) => m.id === id);
  return item
    ? { success: true, data: item }
    : { success: false, errorMessage: "Merch item not found" };
}

export async function FetchMerchData(axios?: any) {
  await simulateNetworkDelay();
  return MOCK_MERCH;
}

export async function FetchMerchSizes(merchId: number) {
  await simulateNetworkDelay(100, 300);
  const item = MOCK_MERCH.find((m) => m.id === merchId);
  return item?.sizes || [];
}

export async function BuyMerchAPI(data: any) {
  await simulateNetworkDelay(500, 1000);
  console.log("[Mock] Merch purchase:", data);
  return { success: true, data: { order_id: Math.floor(Math.random() * 10000) } };
}

export async function UserMerchAPICache(axios?: any) {
  await simulateNetworkDelay(100, 300);
  return { bought: [] as any[], collected: [] as any[] };
}

export async function RefreshBoughtCollectedCache(axios?: any) {
  await simulateNetworkDelay(100, 300);
  return { bought: [] as any[], collected: [] as any[] };
}
