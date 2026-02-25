/**
 * Menu slice — fetches menu items per stall
 */
import type { StateCreator } from "zustand";
import type { MenuItem } from "@/models/food.models";
import { getMenu } from "@/api/food.api";

export interface MenuSlice {
  menu: MenuItem[];
  isLoadingMenu: boolean;
  menuError: string | null;
  currentStallId: number | null;

  fetchMenu: (stallId: number) => Promise<void>;
  clearMenu: () => void;
}

export const createMenuSlice: StateCreator<MenuSlice, [], [], MenuSlice> = (
  set,
) => ({
  menu: [],
  isLoadingMenu: false,
  menuError: null,
  currentStallId: null,

  fetchMenu: async (stallId: number) => {
    set({ isLoadingMenu: true, menuError: null, currentStallId: stallId });
    try {
      const result = await getMenu(stallId);
      if (result.success && result.data) {
        set({ menu: result.data, isLoadingMenu: false });
      } else {
        set({ menuError: "Failed to fetch menu", isLoadingMenu: false });
      }
    } catch (error: any) {
      set({ menuError: "Network error fetching menu", isLoadingMenu: false });
    }
  },

  clearMenu: () => {
    set({ menu: [], currentStallId: null, menuError: null });
  },
});
