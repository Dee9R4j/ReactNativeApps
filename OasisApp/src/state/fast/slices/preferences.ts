/**
 * Preferences slice — MMKV-backed user preferences and app state
 */
import type { StateCreator } from "zustand";

export interface PreferencesSlice {
  // Auth state (non-sensitive — just boolean flags)
  signedIn: boolean;
  signedStoreIn: boolean;
  shouldShowOnboarding: boolean;
  hasSeenOnboarding: boolean;

  // UI preferences
  vegOnly: boolean;
  lastSelectedStallId: string | null;

  // Actions
  setLoggedIn: (value: boolean) => void;
  setStoreLoggedIn: (value: boolean) => void;
  setShouldShowOnboarding: (value: boolean) => void;
  setHasSeenOnboarding: (value: boolean) => void;
  setVegOnly: (value: boolean) => void;
  setLastSelectedStallId: (id: string | null) => void;
  logout: () => void;
  setLogout: () => void;
  logOut: () => void;
}

export const createPreferencesSlice: StateCreator<
  PreferencesSlice,
  [],
  [],
  PreferencesSlice
> = (set) => ({
  signedIn: false,
  signedStoreIn: false,
  shouldShowOnboarding: false,
  hasSeenOnboarding: false,
  vegOnly: false,
  lastSelectedStallId: null,

  setLoggedIn: (value) => set({ signedIn: value }),
  setStoreLoggedIn: (value) => set({ signedStoreIn: value }),
  setShouldShowOnboarding: (value) => set({ shouldShowOnboarding: value }),
  setHasSeenOnboarding: (value) => set({ hasSeenOnboarding: value }),
  setVegOnly: (value) => set({ vegOnly: value }),
  setLastSelectedStallId: (id) => set({ lastSelectedStallId: id }),

  logout: () =>
    set({
      signedIn: false,
      signedStoreIn: false,
      shouldShowOnboarding: false,
      vegOnly: false,
      lastSelectedStallId: null,
    }),

  // Aliases for backward compat
  setLogout: () =>
    set({
      signedIn: false,
      signedStoreIn: false,
      shouldShowOnboarding: false,
      vegOnly: false,
      lastSelectedStallId: null,
    }),

  logOut: () =>
    set({
      signedIn: false,
      signedStoreIn: false,
      shouldShowOnboarding: false,
      vegOnly: false,
      lastSelectedStallId: null,
    }),
});
