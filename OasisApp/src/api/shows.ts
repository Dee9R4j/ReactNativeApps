/**
 * Mock shows API — all functions referenced by old code
 * All functions accept an optional axios arg for backward compat (ignored in mock)
 */
import { MOCK_PROF_SHOWS, simulateNetworkDelay } from "./dummyData";

export async function getShows(axios?: any) {
  await simulateNetworkDelay();
  return { success: true, data: MOCK_PROF_SHOWS };
}

export async function getShowById(id: number) {
  await simulateNetworkDelay(100, 300);
  const show = MOCK_PROF_SHOWS.find((s) => s.id === id);
  return show
    ? { success: true, data: show }
    : { success: false, errorMessage: "Show not found" };
}

export function GetShowsPageIndex() {
  // Returns a number (not a promise) — the default starting page index
  return 0;
}

export async function GetPriceOfTicket(axios?: any) {
  await simulateNetworkDelay(100, 300);
  return 500;
}

export async function BuyN2OShowAPI(axios?: any) {
  await simulateNetworkDelay(500, 1000);
  console.log("[Mock] N2O ticket purchase");
  return { success: true, data: { ticket_id: Math.floor(Math.random() * 10000) } };
}

export async function GetUserN2OTicketStats(axios?: any) {
  await simulateNetworkDelay(100, 300);
  return { bought: 0, scanned: 0 };
}
