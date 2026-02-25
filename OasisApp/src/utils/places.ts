/**
 * Places data for map screen — all exports referenced by old code
 */
export interface Place {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  latLng: { latitude: number; longitude: number };
  category: string;
  description: string;
}

export const MOCK_PLACES: Place[] = [
  { id: 1, name: "Main Stage", latitude: 15.3909, longitude: 73.8789, latLng: { latitude: 15.3909, longitude: 73.8789 }, category: "Venues", description: "Primary performance venue" },
  { id: 2, name: "Food Court A", latitude: 15.3915, longitude: 73.8795, latLng: { latitude: 15.3915, longitude: 73.8795 }, category: "Food", description: "Main food stalls area" },
  { id: 3, name: "Food Court B", latitude: 15.3912, longitude: 73.8800, latLng: { latitude: 15.3912, longitude: 73.88 }, category: "Food", description: "Additional food stalls" },
  { id: 4, name: "Registration", latitude: 15.3905, longitude: 73.8785, latLng: { latitude: 15.3905, longitude: 73.8785 }, category: "Info", description: "Registration desk" },
  { id: 5, name: "Auditorium", latitude: 15.3918, longitude: 73.8792, latLng: { latitude: 15.3918, longitude: 73.8792 }, category: "Venues", description: "Indoor performance hall" },
];

export const PLACE_CATEGORIES = ["All", "Venues", "Food", "Info"];

// Alias for old import name
export const places = MOCK_PLACES;

export function getPlaceByName(name: string): Place | undefined {
  return MOCK_PLACES.find((p) => p.name.toLowerCase().includes(name.toLowerCase()));
}
