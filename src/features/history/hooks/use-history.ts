import { useCallback, useMemo, useState } from 'react';
import type { CompletedFast } from '@/src/stores/fasting-store';
import { useFastingStore } from '@/src/stores/fasting-store';

export type IntensityLevel = 0 | 1 | 2 | 3;

export interface CalendarCell {
  day: number | null;
  hours: number;
  intensity: IntensityLevel;
  isToday: boolean;
}

export interface MonthState {
  year: number;
  month: number;
  label: string;
  weeks: CalendarCell[][];
  weekIndicatorRow: number | null;
  canGoForward: boolean;
  goPrev: () => void;
  goNext: () => void;
}

export interface MonthSummary {
  totalHoursLabel: string;
  fastsLabel: string;
  avgDurationLabel: string;
}

export interface WeekStripSegment {
  startHour: number;
  endHour: number;
}

export interface WeekStripState {
  label: string;
  totalHours: number;
  totalHoursLabel: string;
  segments: WeekStripSegment[];
  todayHour: number | null;
  canGoForward: boolean;
  goPrev: () => void;
  goNext: () => void;
}

export interface HistoryData {
  currentStreak: number;
  bestStreak: number;
  month: MonthState;
  summary: MonthSummary;
  weekStrip: WeekStripState;
}

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const WEEK_HOURS = 24 * 7;

const MONTH_FORMATTER = new Intl.DateTimeFormat(undefined, {
  month: 'long',
  year: 'numeric',
});

const WEEK_MONTH_FORMATTER = new Intl.DateTimeFormat(undefined, {
  month: 'short',
});

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function keyFromParts(year: number, month: number, day: number): string {
  return `${year}-${month}-${day}`;
}

function computeHoursByDay(fasts: CompletedFast[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const fast of fasts) {
    let cursor = fast.startedAt;
    while (cursor < fast.endedAt) {
      const cursorDate = new Date(cursor);
      cursorDate.setHours(0, 0, 0, 0);
      const nextDayStart = cursorDate.getTime() + DAY_MS;
      const sliceEnd = Math.min(fast.endedAt, nextDayStart);
      const hours = (sliceEnd - cursor) / HOUR_MS;
      const key = dayKey(cursorDate);
      map.set(key, (map.get(key) ?? 0) + hours);
      cursor = sliceEnd;
    }
  }
  return map;
}

function bucketHours(hours: number): IntensityLevel {
  if (hours <= 0) return 0;
  if (hours < 11) return 1;
  if (hours < 17) return 2;
  return 3;
}

function buildWeeks(
  year: number,
  month: number,
  hoursByDay: Map<string, number>,
  today: Date,
): CalendarCell[][] {
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leading = firstOfMonth.getDay();

  const cells: CalendarCell[] = [];
  for (let i = 0; i < leading; i++) {
    cells.push({ day: null, hours: 0, intensity: 0, isToday: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const key = keyFromParts(year, month, d);
    const isToday =
      today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
    const hours = hoursByDay.get(key) ?? 0;
    cells.push({
      day: d,
      hours,
      intensity: bucketHours(hours),
      isToday,
    });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ day: null, hours: 0, intensity: 0, isToday: false });
  }

  const weeks: CalendarCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

function findWeekIndicatorRow(
  weeks: CalendarCell[][],
  year: number,
  month: number,
  weekStart: Date,
): number | null {
  const weekStartMs = weekStart.getTime();
  const weekEndMs = weekStartMs + 7 * DAY_MS;
  for (let i = 0; i < weeks.length; i++) {
    for (const cell of weeks[i]!) {
      if (cell.day === null) continue;
      const cellMs = new Date(year, month, cell.day).getTime();
      if (cellMs >= weekStartMs && cellMs < weekEndMs) {
        return i;
      }
    }
  }
  return null;
}

function computeStreaks(fasts: CompletedFast[], today: Date): { current: number; best: number } {
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

function computeMonthSummary(
  fasts: CompletedFast[],
  year: number,
  month: number,
): MonthSummary {
  let totalMs = 0;
  let count = 0;
  for (const fast of fasts) {
    const end = new Date(fast.endedAt);
    if (end.getFullYear() === year && end.getMonth() === month) {
      totalMs += Math.max(0, fast.endedAt - fast.startedAt);
      count += 1;
    }
  }
  if (count === 0) {
    return { totalHoursLabel: '0h', fastsLabel: '0', avgDurationLabel: '—' };
  }
  const totalHours = totalMs / 3_600_000;
  const avgHours = totalHours / count;
  return {
    totalHoursLabel: `${Math.round(totalHours)}h`,
    fastsLabel: String(count),
    avgDurationLabel: `${avgHours.toFixed(1)}h`,
  };
}

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

function dominantMonth(weekStart: Date): { year: number; month: number } {
  const counts = new Map<string, { year: number; month: number; count: number }>();
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart.getTime() + i * DAY_MS);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const entry = counts.get(key);
    if (entry) entry.count += 1;
    else counts.set(key, { year: d.getFullYear(), month: d.getMonth(), count: 1 });
  }
  let best: { year: number; month: number; count: number } | null = null;
  for (const v of counts.values()) {
    if (!best || v.count > best.count) best = v;
  }
  return { year: best!.year, month: best!.month };
}

function formatWeekLabel(weekStart: Date): string {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const sameMonth = weekStart.getMonth() === weekEnd.getMonth();
  const startMonth = WEEK_MONTH_FORMATTER.format(weekStart);
  if (sameMonth) {
    return `${startMonth} ${weekStart.getDate()} – ${weekEnd.getDate()}`;
  }
  const endMonth = WEEK_MONTH_FORMATTER.format(weekEnd);
  return `${startMonth} ${weekStart.getDate()} – ${endMonth} ${weekEnd.getDate()}`;
}

function computeWeekStrip(
  fasts: CompletedFast[],
  weekStart: Date,
): { segments: WeekStripSegment[]; totalHours: number } {
  const weekStartMs = weekStart.getTime();
  const weekEndMs = weekStartMs + 7 * DAY_MS;
  const segments: WeekStripSegment[] = [];
  let totalMs = 0;
  for (const fast of fasts) {
    const start = Math.max(fast.startedAt, weekStartMs);
    const end = Math.min(fast.endedAt, weekEndMs);
    if (end <= start) continue;
    segments.push({
      startHour: (start - weekStartMs) / HOUR_MS,
      endHour: (end - weekStartMs) / HOUR_MS,
    });
    totalMs += end - start;
  }
  return { segments, totalHours: totalMs / HOUR_MS };
}

export function useHistory(): HistoryData {
  const completedFasts = useFastingStore((s) => s.completedFasts);

  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState<{ year: number; month: number }>(() => ({
    year: today.getFullYear(),
    month: today.getMonth(),
  }));
  const [weekCursor, setWeekCursor] = useState<Date>(() => startOfWeek(today));

  const goPrev = useCallback(() => {
    const d = new Date(cursor.year, cursor.month - 1, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    setCursor({ year, month });
    setWeekCursor(startOfWeek(new Date(year, month, 1)));
  }, [cursor]);

  const goNext = useCallback(() => {
    const nowY = new Date().getFullYear();
    const nowM = new Date().getMonth();
    if (cursor.year === nowY && cursor.month === nowM) return;
    const d = new Date(cursor.year, cursor.month + 1, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    setCursor({ year, month });
    setWeekCursor(startOfWeek(new Date(year, month, 1)));
  }, [cursor]);

  const goPrevWeek = useCallback(() => {
    const d = new Date(weekCursor);
    d.setDate(d.getDate() - 7);
    setWeekCursor(d);
    const { year, month } = dominantMonth(d);
    setCursor((c) => (c.year === year && c.month === month ? c : { year, month }));
  }, [weekCursor]);

  const goNextWeek = useCallback(() => {
    const todayWeekStart = startOfWeek(new Date()).getTime();
    const d = new Date(weekCursor);
    d.setDate(d.getDate() + 7);
    if (d.getTime() > todayWeekStart) return;
    setWeekCursor(d);
    const { year, month } = dominantMonth(d);
    setCursor((c) => (c.year === year && c.month === month ? c : { year, month }));
  }, [weekCursor]);

  return useMemo(() => {
    const hoursByDay = computeHoursByDay(completedFasts);
    const weeks = buildWeeks(cursor.year, cursor.month, hoursByDay, today);
    const canGoForward =
      cursor.year < today.getFullYear() ||
      (cursor.year === today.getFullYear() && cursor.month < today.getMonth());
    const monthLabel = MONTH_FORMATTER.format(new Date(cursor.year, cursor.month, 1));
    const { current, best } = computeStreaks(completedFasts, today);
    const summary = computeMonthSummary(completedFasts, cursor.year, cursor.month);

    const { segments, totalHours } = computeWeekStrip(completedFasts, weekCursor);
    const todayWeekStart = startOfWeek(today);
    const isCurrentWeek = weekCursor.getTime() === todayWeekStart.getTime();
    const todayHour = isCurrentWeek ? (today.getTime() - weekCursor.getTime()) / HOUR_MS : null;
    const weekIndicatorRow = findWeekIndicatorRow(weeks, cursor.year, cursor.month, weekCursor);

    const weekStrip: WeekStripState = {
      label: formatWeekLabel(weekCursor),
      totalHours,
      totalHoursLabel: `${Math.round(totalHours)}h`,
      segments,
      todayHour: todayHour !== null ? Math.min(WEEK_HOURS, Math.max(0, todayHour)) : null,
      canGoForward: !isCurrentWeek,
      goPrev: goPrevWeek,
      goNext: goNextWeek,
    };

    return {
      currentStreak: current,
      bestStreak: best,
      month: {
        year: cursor.year,
        month: cursor.month,
        label: monthLabel,
        weeks,
        weekIndicatorRow,
        canGoForward,
        goPrev,
        goNext,
      },
      summary,
      weekStrip,
    };
  }, [completedFasts, cursor, goNext, goPrev, goNextWeek, goPrevWeek, today, weekCursor]);
}
