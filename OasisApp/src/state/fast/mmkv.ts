/**
 * MMKV instance — fast synchronous key-value storage
 * Used for cart data, preferences, and non-sensitive persistent state
 */
import { MMKV } from "react-native-mmkv";

export const mmkvStorage = new MMKV({
  id: "oasis-fast-storage",
});

/**
 * Zustand MMKV storage adapter
 */
export const mmkvZustandAdapter = {
  getItem: (name: string): string | null => {
    return mmkvStorage.getString(name) ?? null;
  },
  setItem: (name: string, value: string): void => {
    mmkvStorage.set(name, value);
  },
  removeItem: (name: string): void => {
    mmkvStorage.delete(name);
  },
};
