export type ZoneId = 'fed' | 'fat-burn' | 'ketosis' | 'deep-ketosis';

export interface Zone {
  id: ZoneId;
  label: string;
  startHour: number;
  colorToken: `zone-${ZoneId}`;
  hex: string;
}

export const ZONES: readonly Zone[] = [
  { id: 'fed', label: 'Fed', startHour: 0, colorToken: 'zone-fed', hex: '#60A5FA' },
  { id: 'fat-burn', label: 'Fat Burn', startHour: 4, colorToken: 'zone-fat-burn', hex: '#3B82F6' },
  { id: 'ketosis', label: 'Ketosis', startHour: 14, colorToken: 'zone-ketosis', hex: '#6366F1' },
  {
    id: 'deep-ketosis',
    label: 'Deep Ketosis',
    startHour: 18,
    colorToken: 'zone-deep-ketosis',
    hex: '#8B5CF6',
  },
] as const;

export function getZoneForElapsed(elapsedHours: number): Zone {
  let current: Zone = ZONES[0]!;
  for (const zone of ZONES) {
    if (elapsedHours >= zone.startHour) current = zone;
  }
  return current;
}
