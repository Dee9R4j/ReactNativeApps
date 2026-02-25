/**
 * expo-secure-store adapter for Zustand persist
 * Stores auth tokens and sensitive data in encrypted storage
 */
import * as SecureStore from "expo-secure-store";
import type { StateStorage } from "zustand/middleware";

const STORAGE_KEY = "secure-storage";

export const secureStoreAdapter: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const value = await SecureStore.getItemAsync(name);
      return value;
    } catch (error: any) {
      console.error("SecureStore getItem error:", error);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(name, value);
    } catch (error: any) {
      console.error("SecureStore setItem error:", error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch (error: any) {
      console.error("SecureStore removeItem error:", error);
    }
  },
};
