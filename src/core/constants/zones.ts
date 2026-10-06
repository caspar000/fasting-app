// Start hours follow docs/fasting-research.md. Real transitions vary by about
// ±12h with diet and exercise, so the ring blends colors between zone starts.

export type ZoneId =
  | 'fed'
  | 'early-fast'
  | 'fat-mobilization'
  | 'ketones-rising'
  | 'ketosis'
  | 'deep-ketosis';

export interface ThemedColor {
  light: string;
  dark: string;
}

export interface Zone {
  id: ZoneId;
  label: string;
  startHour: number;
  color: ThemedColor;
}

export const ZONES: readonly Zone[] = [
  { id: 'fed', label: 'Fed', startHour: 0, color: { light: '#93C5FD', dark: '#93C5FD' } },
  {
    id: 'early-fast',
    label: 'Early Fast',
    startHour: 5,
    color: { light: '#60A5FA', dark: '#60A5FA' },
  },
  {
    id: 'fat-mobilization',
    label: 'Fat Mobilization',
    startHour: 12,
    color: { light: '#3B82F6', dark: '#3B82F6' },
  },
  {
    id: 'ketones-rising',
    label: 'Ketones Rising',
    startHour: 24,
    color: { light: '#6366F1', dark: '#6366F1' },
  },
  { id: 'ketosis', label: 'Ketosis', startHour: 40, color: { light: '#7C3AED', dark: '#8B5CF6' } },
  {
    id: 'deep-ketosis',
    label: 'Deep Ketosis',
    startHour: 64,
    color: { light: '#5B21B6', dark: '#7C3AED' },
  },
];

// The gradient reaches its darkest color here and stays there.
export const TIMELINE_END_HOUR = 120;
const TIMELINE_END_COLOR: ThemedColor = { light: '#2E1065', dark: '#6D28D9' };

export interface PaletteStop {
  hour: number;
  color: string;
}

export function zonePalette(scheme: keyof ThemedColor): PaletteStop[] {
  return [
    ...ZONES.map((zone) => ({ hour: zone.startHour, color: zone.color[scheme] })),
    { hour: TIMELINE_END_HOUR, color: TIMELINE_END_COLOR[scheme] },
  ];
}

export function getZoneForElapsed(elapsedHours: number): Zone {
  let current: Zone = ZONES[0]!;
  for (const zone of ZONES) {
    if (elapsedHours >= zone.startHour) current = zone;
  }
  return current;
}

export function getZoneEndHour(zone: Zone): number | null {
  const next = ZONES[ZONES.indexOf(zone) + 1];
  return next ? next.startHour : null;
}
