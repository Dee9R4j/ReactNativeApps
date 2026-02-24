/**
 * Fast Store (MMKV-Persisted)
 * Hot Data: Events, Bookings, App Preferences
 * Uses MMKV for fast, synchronous persistence
 */
import { mmkvStorageAdapter } from "@/state/fast/mmkv";
import { AppPreferencesSlice, IAppPreferences } from "@/state/fast/slices/preferences";
import { EventsSlice, IEventsSlice } from "@/state/fast/slices/events";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type FastBoundStore = IAppPreferences & IEventsSlice;

export const useFastStore = create<FastBoundStore>()(
  persist(
    (...a) => ({
      ...AppPreferencesSlice(...a),
      ...EventsSlice(...a),
    }),
    {
      name: "fast-store",
      storage: mmkvStorageAdapter,
    },
  ),
);
