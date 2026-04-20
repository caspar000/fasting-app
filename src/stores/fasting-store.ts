import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { DEFAULT_PROTOCOL_ID } from '@/src/core/constants/protocols';

export interface ActiveFast {
  startedAt: number;
  protocolId: string;
}

export interface CompletedFast {
  startedAt: number;
  endedAt: number;
  protocolId: string;
}

interface FastingState {
  protocolId: string;
  activeFast: ActiveFast | null;
  lastFast: CompletedFast | null;
  streakCount: number;
  setProtocol: (id: string) => void;
  startFast: (startedAt?: number) => void;
  endFast: (endedAt?: number) => void;
  adjustStart: (startedAt: number) => void;
}

const secureStorage = createJSONStorage(() => ({
  getItem: (name: string) => SecureStore.getItemAsync(name),
  setItem: (name: string, value: string) => SecureStore.setItemAsync(name, value),
  removeItem: (name: string) => SecureStore.deleteItemAsync(name),
}));

export const useFastingStore = create<FastingState>()(
  persist(
    (set, get) => ({
      protocolId: DEFAULT_PROTOCOL_ID,
      activeFast: null,
      lastFast: null,
      streakCount: 0,
      setProtocol: (id) => {
        set({ protocolId: id });
        const active = get().activeFast;
        if (active) set({ activeFast: { ...active, protocolId: id } });
      },
      startFast: (startedAt = Date.now()) => {
        if (get().activeFast) return;
        set({ activeFast: { startedAt, protocolId: get().protocolId } });
      },
      endFast: (endedAt = Date.now()) => {
        const active = get().activeFast;
        if (!active) return;
        const completed: CompletedFast = {
          startedAt: active.startedAt,
          endedAt,
          protocolId: active.protocolId,
        };
        set((s) => ({
          activeFast: null,
          lastFast: completed,
          streakCount: s.streakCount + 1,
        }));
      },
      adjustStart: (startedAt) => {
        const active = get().activeFast;
        if (!active) return;
        set({ activeFast: { ...active, startedAt } });
      },
    }),
    {
      name: 'fasting-app-fast-state',
      storage: secureStorage,
    },
  ),
);
