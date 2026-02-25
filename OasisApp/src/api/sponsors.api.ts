/**
 * Mock Sponsors API — uses dummyData for UI testing
 */
import { MOCK_SPONSORS, simulateNetworkDelay } from "./dummyData";

export async function getSponsors() {
  await simulateNetworkDelay();
  return { success: true, data: MOCK_SPONSORS };
}
