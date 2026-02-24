/**
 * MMKV Storage Adapter for Zustand
 * Fast synchronous persistence using MMKV
 */
import { PersistStorage, StorageValue } from "zustand/middleware";
import { createMMKV } from "react-native-mmkv";

const storage = createMMKV();

export const mmkvStorageAdapter: PersistStorage<any> = {
  setItem: (name: string, value: StorageValue<any>): void => {
    storage.set(name, JSON.stringify(value));
  },
  getItem: (name: string): StorageValue<any> | null => {
    const value = storage.getString(name);
    return value ? (JSON.parse(value) as StorageValue<any>) : null;
  },
  removeItem: (name: string): void => {
    storage.remove(name);
  },
};
