/**
 * Secure store — Zustand + expo-secure-store persistence
 * For sensitive data: JWT tokens, user credentials
 */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { secureStoreAdapter } from "./expo-secure-store-adapter";
import { createAuthSlice, type AuthSlice } from "./slices/auth";

export type AuthStoreType = AuthSlice;

export const useSecureStore = create<AuthSlice>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
    }),
    {
      name: "secure-storage",
      storage: createJSONStorage(() => secureStoreAdapter),
    },
  ),
);
