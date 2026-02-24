/**
 * Campus Places / Map Locations
 */
export interface Place {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  category: string;
  description?: string;
}

export const CAMPUS_PLACES: Place[] = [
  { id: 1, name: "Main Auditorium", latitude: 28.3624, longitude: 75.5870, category: "venue", description: "Main event venue" },
  { id: 2, name: "Open Air Theatre", latitude: 28.3630, longitude: 75.5875, category: "venue", description: "Outdoor performances" },
  { id: 3, name: "Food Court A", latitude: 28.3620, longitude: 75.5865, category: "food", description: "Main food stalls area" },
  { id: 4, name: "Food Court B", latitude: 28.3618, longitude: 75.5868, category: "food", description: "Secondary food stalls" },
  { id: 5, name: "Food Court C", latitude: 28.3615, longitude: 75.5862, category: "food", description: "Beverages and snacks" },
  { id: 6, name: "Merch Store", latitude: 28.3622, longitude: 75.5872, category: "shop", description: "Official festival merchandise" },
  { id: 7, name: "Main Stage", latitude: 28.3628, longitude: 75.5878, category: "venue", description: "Pro-nights and DJ performances" },
  { id: 8, name: "Computer Center", latitude: 28.3632, longitude: 75.5860, category: "venue", description: "Hackathon and tech events" },
  { id: 9, name: "Registration Desk", latitude: 28.3625, longitude: 75.5869, category: "info", description: "Check-in and information" },
  { id: 10, name: "First Aid", latitude: 28.3621, longitude: 75.5871, category: "amenity", description: "Medical assistance" },
];

export const MAP_CATEGORIES = ["All", "venue", "food", "shop", "info", "amenity"] as const;
