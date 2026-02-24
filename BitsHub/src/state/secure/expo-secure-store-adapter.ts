/**
 * Expo Secure Store Adapter for Zustand
 * Async adapter wrapping expo-secure-store for sensitive data
 */
import * as SecureStore from "expo-secure-store";
import { StateStorage } from "zustand/middleware";

export const SecureStoreAdapter: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(name);
    } catch (error) {
      console.error("[SecureStore] Error reading:", error);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(name, value);
    } catch (error) {
      console.error("[SecureStore] Error writing:", error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch (error) {
      console.error("[SecureStore] Error deleting:", error);
    }
  },
};
