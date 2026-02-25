/**
 * Fast store — Zustand + MMKV persistence
 * For cart data, preferences, merch, and fast non-sensitive state
 */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { mmkvZustandAdapter } from "./mmkv";
import { createFoodSlice, type FoodSlice } from "./slices/food";
import {
  createPreferencesSlice,
  type PreferencesSlice,
} from "./slices/preferences";
import { createMerchSlice, type MerchSlice } from "./slices/merch";

type FastStore = FoodSlice & PreferencesSlice & MerchSlice;

export const useFastStore = create<FastStore>()(
  persist(
    (...a) => ({
      ...createFoodSlice(...a),
      ...createPreferencesSlice(...a),
      ...createMerchSlice(...a),
    }),
    {
      name: "fast-storage",
      storage: createJSONStorage(() => mmkvZustandAdapter),
    },
  ),
);
