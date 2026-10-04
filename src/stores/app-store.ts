import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORE_NAME } from '@/src/core/constants/app';
import { persistStorage } from './storage';

export type ThemeMode = 'system' | 'light' | 'dark';

interface AppState {
  theme: ThemeMode;
  hasCompletedOnboarding: boolean;
  developerMode: boolean;
  timerDebugSlider: boolean;
  debugElapsedMs: number;
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
      setTheme: (theme) => set({ theme }),
      setOnboardingComplete: (value) => set({ hasCompletedOnboarding: value }),
      setDeveloperMode: (value) =>
        set({ developerMode: value, ...(value ? {} : { timerDebugSlider: false }) }),
      setTimerDebugSlider: (value) => set({ timerDebugSlider: value }),
      setDebugElapsedMs: (value) => set({ debugElapsedMs: Math.max(0, value) }),
    }),
    {
      name: STORE_NAME,
      storage: persistStorage,
      partialize: (state) => {
        const { debugElapsedMs, ...rest } = state;
        void debugElapsedMs;
        return rest;
      },
    },
  ),
);
