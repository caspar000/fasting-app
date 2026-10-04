import Storage from 'expo-sqlite/kv-store';
import { createJSONStorage } from 'zustand/middleware';

// Synchronous reads let persisted stores hydrate before the first render.
export const persistStorage = createJSONStorage(() => ({
  getItem: (name: string) => Storage.getItemSync(name),
  setItem: (name: string, value: string) => Storage.setItem(name, value),
  removeItem: (name: string) => Storage.removeItem(name),
}));
