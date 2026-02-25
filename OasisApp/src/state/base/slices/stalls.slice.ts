/**
 * Stalls slice — fetches stalls from mock API, stores in base state
 */
import type { StateCreator } from "zustand";
import type { Stall } from "@/models/food.models";
import { getStalls } from "@/api/food.api";
import { searchItems } from "@/utils/search";

export interface StallsSlice {
  stalls: Stall[];
  filteredStalls: Stall[];
  isLoadingStalls: boolean;
  stallsError: string | null;
  availableLocations: string[];
  selectedLocations: string[];

  fetchStalls: () => Promise<void>;
  filterStalls: (query: string) => void;
  setSelectedLocations: (locations: string[]) => void;
}

export const createStallsSlice: StateCreator<
  StallsSlice,
  [],
  [],
  StallsSlice
> = (set, get) => ({
  stalls: [],
  filteredStalls: [],
  isLoadingStalls: false,
  stallsError: null,
  availableLocations: [],
  selectedLocations: [],

  fetchStalls: async () => {
    set({ isLoadingStalls: true, stallsError: null });
    try {
      const result = await getStalls();
      if (result.success && result.data) {
        const locations = [
          ...new Set(result.data.map((s) => s.location).filter(Boolean)),
        ];
        set({
          stalls: result.data,
          filteredStalls: result.data,
          availableLocations: locations,
          isLoadingStalls: false,
        });
      } else {
        set({ stallsError: "Failed to fetch stalls", isLoadingStalls: false });
      }
    } catch (error: any) {
      set({
        stallsError: "Network error fetching stalls",
        isLoadingStalls: false,
      });
    }
  },

  filterStalls: (query: string) => {
    const { stalls, selectedLocations } = get();
    let filtered = stalls;

    if (query.trim()) {
      filtered = searchItems(filtered, query, ["name", "description"]);
    }

    if (selectedLocations.length > 0) {
      filtered = filtered.filter((s) =>
        selectedLocations.includes(s.location),
      );
    }

    set({ filteredStalls: filtered });
  },

  setSelectedLocations: (locations: string[]) => {
    set({ selectedLocations: locations });
    // Re-filter with current data
    const { stalls } = get();
    let filtered = stalls;
    if (locations.length > 0) {
      filtered = filtered.filter((s) => locations.includes(s.location));
    }
    set({ filteredStalls: filtered });
  },
});
