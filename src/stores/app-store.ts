import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { STORE_NAME } from '@/src/core/constants/app';

export type ThemeMode = 'system' | 'light' | 'dark';

const secureStorage = createJSONStorage(() => ({
  getItem: (name: string) => SecureStore.getItemAsync(name),
  setItem: (name: string, value: string) => SecureStore.setItemAsync(name, value),
  removeItem: (name: string) => SecureStore.deleteItemAsync(name),
}));

interface AppState {
  theme: ThemeMode;
  hasCompletedOnboarding: boolean;
  _hasHydrated: boolean;
  setTheme: (theme: ThemeMode) => void;
  setOnboardingComplete: (value: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'system',
      hasCompletedOnboarding: false,
      _hasHydrated: false,
      setTheme: (theme) => set({ theme }),
      setOnboardingComplete: (value) => set({ hasCompletedOnboarding: value }),
    }),
    {
      name: STORE_NAME,
      storage: secureStorage,
      partialize: (state) => {
        const { _hasHydrated, ...rest } = state;
        return rest;
      },
      onRehydrateStorage: () => () => {
        useAppStore.setState({ _hasHydrated: true });
      },
    },
  ),
);
