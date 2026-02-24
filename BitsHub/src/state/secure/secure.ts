/**
 * Secure Store (expo-secure-store backed)
 * Sensitive data: JWT tokens, user credentials
 */
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SecureStoreAdapter } from "@/state/secure/expo-secure-store-adapter";
import { AuthSlice, IAuthSlice } from "@/state/secure/slices/auth";

export const useSecureStore = create<IAuthSlice>()(
  persist(
    (...a) => ({
      ...AuthSlice(...a),
    }),
    {
      name: "secure-storage",
      storage: createJSONStorage(() => SecureStoreAdapter),
    },
  ),
);

export type SecureBoundStore = ReturnType<typeof useSecureStore>;
export type AuthStoreType = ReturnType<typeof AuthSlice>;
