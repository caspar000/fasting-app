import type { PaletteStop } from '@/src/core/constants/zones';

const MAX_LAP_HOURS = 24;

export interface LapSpan {
  startHour: number;
  endHour: number;
}

export interface RingLayout {
  currentLap: LapSpan;
  // Fraction of the circle the current lap covers, 0 to 1.
  currentSweep: number;
  previousLap: LapSpan | null;
  // Where the goal sits on the current lap, as a fraction of the circle.
  // Only set for goals over 24h, and only on the lap the goal falls in.
  goalSweep: number | null;
}

// A lap is the goal for goals under 24h, otherwise 24h. Laps stack forever.
export function computeRingLayout(elapsedHours: number, goalHours: number): RingLayout {
  const elapsed = Math.max(0, elapsedHours);
  const lapHours = Math.min(Math.max(goalHours, 0.001), MAX_LAP_HOURS);
  const lapIndex = Math.floor(elapsed / lapHours);
  const lapStart = lapIndex * lapHours;

  const goalLapIndex = Math.ceil(goalHours / lapHours) - 1;
  const showGoal = goalHours > MAX_LAP_HOURS && lapIndex === goalLapIndex;

  return {
    currentLap: { startHour: lapStart, endHour: elapsed },
    currentSweep: (elapsed - lapStart) / lapHours,
    previousLap:
      lapIndex > 0 ? { startHour: lapStart - lapHours, endHour: lapStart } : null,
    goalSweep: showGoal ? (goalHours - goalLapIndex * lapHours) / lapHours : null,
  };
}

export interface GradientStop {
  pos: number;
  color: string;
}

export function samplePaletteAt(hour: number, palette: readonly PaletteStop[]): string {
  const first = palette[0];
  const last = palette[palette.length - 1];
  if (!first || !last) return '#000000';
  if (hour <= first.hour) return first.color;
  if (hour >= last.hour) return last.color;
  for (let i = 0; i < palette.length - 1; i++) {
    const a = palette[i]!;
    const b = palette[i + 1]!;
    if (hour >= a.hour && hour <= b.hour) {
      const span = b.hour - a.hour;
      return lerpHex(a.color, b.color, span === 0 ? 0 : (hour - a.hour) / span);
    }
  }
  return last.color;
}

// Gradient stops for the palette between two hours, positioned 0 to 1.
export function slicePalette(
  startHour: number,
  endHour: number,
  palette: readonly PaletteStop[],
): GradientStop[] {
  const startColor = samplePaletteAt(startHour, palette);
  if (endHour <= startHour) return [{ pos: 0, color: startColor }];
  const span = endHour - startHour;
  const stops: GradientStop[] = [{ pos: 0, color: startColor }];
  for (const p of palette) {
    if (p.hour > startHour && p.hour < endHour) {
      stops.push({ pos: (p.hour - startHour) / span, color: p.color });
    }
  }
  stops.push({ pos: 1, color: samplePaletteAt(endHour, palette) });
  return stops;
}

function lerpHex(a: string, b: string, k: number): string {
  const rgbA = hexToRgb(a);
  const rgbB = hexToRgb(b);
  const mix = (i: number) => Math.round(rgbA[i]! + (rgbB[i]! - rgbA[i]!) * k);
  return `#${toHex(mix(0))}${toHex(mix(1))}${toHex(mix(2))}`;
}

function hexToRgb(hex: string): [number, number, number] {
  const num = parseInt(hex.replace('#', ''), 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function toHex(n: number): string {
  return n.toString(16).padStart(2, '0');
}
