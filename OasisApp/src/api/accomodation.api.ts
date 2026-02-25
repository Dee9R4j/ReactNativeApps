/**
 * Mock accommodation API — uses dummy data
 */
import { simulateNetworkDelay } from "./dummyData";

export interface AccommodationInfo {
  leader_name: string;
  leader_phone: number;
  bhawan: string;
  room: string;
}

const MOCK_ACCOMMODATION: AccommodationInfo = {
  leader_name: "Rahul Sharma",
  leader_phone: 9876543210,
  bhawan: "Vyas Bhawan",
  room: "V-123",
};

export const getAccommodationInfo = async (): Promise<AccommodationInfo> => {
  await simulateNetworkDelay();
  return MOCK_ACCOMMODATION;
};
