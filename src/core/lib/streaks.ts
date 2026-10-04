import type { CompletedFast } from '@/src/stores/fasting-store';

const DAY_MS = 24 * 60 * 60 * 1000;

export function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/** Streaks count consecutive calendar days on which at least one fast ended. */
export function computeStreaks(fasts: CompletedFast[], today: Date): { current: number; best: number } {
  if (fasts.length === 0) return { current: 0, best: 0 };

  const completedDays = new Set<string>();
  for (const fast of fasts) {
    completedDays.add(dayKey(new Date(fast.endedAt)));
  }

  let current = 0;
  const cursor = new Date(today);
  cursor.setHours(0, 0, 0, 0);
  const hasToday = completedDays.has(dayKey(cursor));
  if (!hasToday) cursor.setDate(cursor.getDate() - 1);
  while (completedDays.has(dayKey(cursor))) {
    current += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  const sortedDays = Array.from(completedDays)
    .map((k) => {
      const [y, m, d] = k.split('-').map(Number);
      return new Date(y!, m!, d!).getTime();
    })
    .sort((a, b) => a - b);

  let best = 1;
  let run = 1;
  for (let i = 1; i < sortedDays.length; i++) {
    const prev = sortedDays[i - 1]!;
    const curr = sortedDays[i]!;
    const diff = Math.round((curr - prev) / DAY_MS);
    if (diff === 1) {
      run += 1;
      if (run > best) best = run;
    } else if (diff > 1) {
      run = 1;
    }
  }

  best = Math.max(best, current);
  return { current, best };
}
