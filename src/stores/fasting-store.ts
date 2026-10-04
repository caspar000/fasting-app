import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_PROTOCOL_ID } from '@/src/core/constants/protocols';
import { persistStorage } from './storage';

export interface ActiveFast {
  startedAt: number;
  protocolId: string;
}

export interface CompletedFast {
  id: string;
  startedAt: number;
  endedAt: number;
  protocolId: string;
}

function makeFastId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

interface FastingState {
  protocolId: string;
  activeFast: ActiveFast | null;
  lastFast: CompletedFast | null;
  completedFasts: CompletedFast[];
  customProtocolFastHours: number | null;
  setProtocol: (id: string) => void;
  startFast: (startedAt?: number) => void;
  endFast: (endedAt?: number) => void;
  adjustStart: (startedAt: number) => void;
  deleteFast: (id: string) => void;
  addCompletedFast: (fast: Omit<CompletedFast, 'id'> & { id?: string }) => void;
  updateCompletedFast: (id: string, updated: Omit<CompletedFast, 'id'>) => void;
  setCustomProtocol: (fastHours: number) => void;
}

function sortByEndedDesc(fasts: CompletedFast[]): CompletedFast[] {
  return [...fasts].sort((a, b) => b.endedAt - a.endedAt);
}

export const useFastingStore = create<FastingState>()(
  persist(
    (set, get) => ({
      protocolId: DEFAULT_PROTOCOL_ID,
      activeFast: null,
      lastFast: null,
      completedFasts: [],
      customProtocolFastHours: null,
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
          id: makeFastId(),
          startedAt: active.startedAt,
          endedAt,
          protocolId: active.protocolId,
        };
        set((s) => ({
          activeFast: null,
          lastFast: completed,
          completedFasts: [completed, ...s.completedFasts],
        }));
      },
      adjustStart: (startedAt) => {
        const active = get().activeFast;
        if (!active) return;
        set({ activeFast: { ...active, startedAt } });
      },
      deleteFast: (id) => {
        set((s) => {
          const completedFasts = s.completedFasts.filter((f) => f.id !== id);
          const lastFast = s.lastFast?.id === id ? (completedFasts[0] ?? null) : s.lastFast;
          return { completedFasts, lastFast };
        });
      },
      addCompletedFast: (fast) => {
        const withId: CompletedFast = { ...fast, id: fast.id ?? makeFastId() };
        set((s) => {
          const completedFasts = sortByEndedDesc([...s.completedFasts, withId]);
          const lastFast = completedFasts[0] ?? s.lastFast;
          return { completedFasts, lastFast };
        });
      },
      updateCompletedFast: (id, updated) => {
        set((s) => {
          const next = s.completedFasts.map((f) => (f.id === id ? { ...updated, id } : f));
          const completedFasts = sortByEndedDesc(next);
          const lastFast =
            s.lastFast?.id === id ? { ...updated, id } : (completedFasts[0] ?? s.lastFast);
          return { completedFasts, lastFast };
        });
      },
      setCustomProtocol: (fastHours) => {
        set({ customProtocolFastHours: fastHours });
      },
    }),
    {
      name: 'fasting-app-fast-state',
      storage: persistStorage,
      version: 4,
      migrate: (persisted, version) => {
        const state = persisted as Partial<FastingState> & {
          completedFasts?: (Partial<CompletedFast> & Omit<CompletedFast, 'id'>)[];
          lastFast?: (Partial<CompletedFast> & Omit<CompletedFast, 'id'>) | null;
        };
        if (version < 1 && !state.completedFasts) {
          state.completedFasts = state.lastFast ? [state.lastFast] : [];
        }
        if (version < 2) {
          state.completedFasts = (state.completedFasts ?? []).map((f) => ({
            ...f,
            id: f.id ?? makeFastId(),
          })) as CompletedFast[];
          if (state.lastFast) {
            state.lastFast = {
              ...state.lastFast,
              id: state.lastFast.id ?? makeFastId(),
            } as CompletedFast;
          }
        }
        if (version < 3) {
          state.customProtocolFastHours = state.customProtocolFastHours ?? null;
        }
        if (version < 4) {
          delete (state as { streakCount?: number }).streakCount;
        }
        return state as FastingState;
      },
    },
  ),
);
