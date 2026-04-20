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
  developerMode: boolean;
  timerDebugSlider: boolean;
  debugElapsedMs: number;
  _hasHydrated: boolean;
  setTheme: (theme: ThemeMode) => void;
  setOnboardingComplete: (value: boolean) => void;
  setDeveloperMode: (value: boolean) => void;
  setTimerDebugSlider: (value: boolean) => void;
  setDebugElapsedMs: (value: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'system',
      hasCompletedOnboarding: false,
      developerMode: false,
      timerDebugSlider: false,
      debugElapsedMs: 0,
      _hasHydrated: false,
      setTheme: (theme) => set({ theme }),
      setOnboardingComplete: (value) => set({ hasCompletedOnboarding: value }),
      setDeveloperMode: (value) =>
        set({ developerMode: value, ...(value ? {} : { timerDebugSlider: false }) }),
      setTimerDebugSlider: (value) => set({ timerDebugSlider: value }),
      setDebugElapsedMs: (value) => set({ debugElapsedMs: Math.max(0, value) }),
    }),
    {
      name: STORE_NAME,
      storage: secureStorage,
      partialize: (state) => {
        const { _hasHydrated, debugElapsedMs, ...rest } = state;
        void debugElapsedMs;
        return rest;
      },
      onRehydrateStorage: () => () => {
        useAppStore.setState({ _hasHydrated: true });
      },
    },
  ),
);
