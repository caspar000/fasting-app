export type ProtocolCategory = 'standard' | 'extended';

export interface Protocol {
  id: string;
  label: string;
  shortLabel: string;
  fastHours: number;
  eatHours: number;
  description: string;
  category: ProtocolCategory;
}

export const PROTOCOLS: readonly Protocol[] = [
  {
    id: '12-12',
    label: '12:12 Circadian',
    shortLabel: '12:12',
    fastHours: 12,
    eatHours: 12,
    description: '12h fast · 12h eat · Beginner friendly',
    category: 'standard',
  },
  {
    id: '16-8',
    label: '16:8 Intermittent',
    shortLabel: '16:8',
    fastHours: 16,
    eatHours: 8,
    description: '16h fast · 8h eat · Most popular',
    category: 'standard',
  },
  {
    id: '18-6',
    label: '18:6 Intermediate',
    shortLabel: '18:6',
    fastHours: 18,
    eatHours: 6,
    description: '18h fast · 6h eat · Intermediate',
    category: 'standard',
  },
  {
    id: '20-4',
    label: '20:4 Warrior',
    shortLabel: '20:4',
    fastHours: 20,
    eatHours: 4,
    description: '20h fast · 4h eat · Advanced',
    category: 'standard',
  },
  {
    id: 'omad',
    label: 'OMAD (23:1)',
    shortLabel: 'OMAD (23:1)',
    fastHours: 23,
    eatHours: 1,
    description: '23h fast · 1h eat · One meal a day',
    category: 'standard',
  },
  {
    id: '24h',
    label: '24h Eat-Stop-Eat',
    shortLabel: '24h Eat-Stop-Eat',
    fastHours: 24,
    eatHours: 12,
    description: '24 hour fast · Dinner to dinner',
    category: 'extended',
  },
  {
    id: '36h',
    label: '36h Extended',
    shortLabel: '36h Extended',
    fastHours: 36,
    eatHours: 12,
    description: '36 hour fast · Deep autophagy',
    category: 'extended',
  },
  {
    id: '48h',
    label: '48h Extended',
    shortLabel: '48h Extended',
    fastHours: 48,
    eatHours: 12,
    description: '48 hour fast · Enhanced ketosis',
    category: 'extended',
  },
  {
    id: '72h',
    label: '72h Extended',
    shortLabel: '72h Extended',
    fastHours: 72,
    eatHours: 12,
    description: '3 day fast · Deep autophagy + stem cells',
    category: 'extended',
  },
  {
    id: '120h',
    label: '5-Day Extended',
    shortLabel: '5-Day Extended',
    fastHours: 120,
    eatHours: 12,
    description: '120 hour fast · Fasting-mimicking',
    category: 'extended',
  },
] as const;

export const DEFAULT_PROTOCOL_ID: Protocol['id'] = '16-8';

export function getProtocol(id: string): Protocol {
  return PROTOCOLS.find((p) => p.id === id) ?? PROTOCOLS.find((p) => p.id === DEFAULT_PROTOCOL_ID)!;
}

export function getProtocolsByCategory(category: ProtocolCategory): Protocol[] {
  return PROTOCOLS.filter((p) => p.category === category);
}
