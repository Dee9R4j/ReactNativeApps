/**
 * App Preferences Slice (MMKV-Persisted)
 * Sign-in state, onboarding flags, and app settings
 */
import { StateCreator } from "zustand";

export interface IAppPreferences {
  signedIn: boolean;
  signedStoreIn: boolean;
  shouldShowOnboarding: boolean;

  setLoggedIn: (val: boolean) => void;
  setStoreLoggedIn: (val: boolean) => void;
  setShouldShowOnboarding: (val: boolean) => void;
  setLogout: () => void;
}

export const AppPreferencesSlice: StateCreator<any, [], [], IAppPreferences> = (
  set,
) => ({
  signedIn: false,
  signedStoreIn: false,
  shouldShowOnboarding: false,

  setLoggedIn: (val: boolean) => set({ signedIn: val }),
  setStoreLoggedIn: (val: boolean) => set({ signedStoreIn: val }),
  setShouldShowOnboarding: (val: boolean) =>
    set({ shouldShowOnboarding: val }),

  setLogout: () =>
    set({
      signedIn: false,
      signedStoreIn: false,
      shouldShowOnboarding: false,
    }),
});
