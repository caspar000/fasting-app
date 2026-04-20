import {
  Canvas,
  Circle,
  Path,
  Skia,
  SweepGradient,
  vec,
} from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { View } from 'react-native';

interface GradientStop {
  pos: number;
  color: string;
}

export interface PaletteStop {
  hour: number;
  color: string;
}

export type HoursPalette = readonly PaletteStop[];

export interface ProgressRingProps {
  size: number;
  strokeWidth: number;
  elapsedHours: number;
  protocolHours: number;
  palette: HoursPalette;
  trackColor: string;
  maxLaps?: number;
  children?: React.ReactNode;
}

const START_ANGLE = -90;
const MIN_VISUAL_PROGRESS = 0.015;
const DEFAULT_MAX_LAPS = 3;

export function ProgressRing({
  size,
  strokeWidth,
  elapsedHours,
  protocolHours,
  palette,
  trackColor,
  maxLaps = DEFAULT_MAX_LAPS,
  children,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const gradientRotation = (START_ANGLE * Math.PI) / 180;

  const safeElapsed = Math.max(0, elapsedHours);
  const safeProtocol = Math.max(0.001, protocolHours);
  const rawProgress = safeElapsed / safeProtocol;
  const cappedProgress = Math.min(rawProgress, maxLaps);
  const atCap = cappedProgress >= maxLaps;
  const laps = Math.floor(cappedProgress);
  const lapProgress = cappedProgress - laps;

  let currentLapStart: number;
  let currentLapEnd: number;
  let currentLapSweep: number;
  let hasPrevious: boolean;
  let previousLapStart: number;
  let previousLapEnd: number;

  if (atCap) {
    currentLapStart = (maxLaps - 1) * safeProtocol;
    currentLapEnd = maxLaps * safeProtocol;
    currentLapSweep = 1;
    hasPrevious = maxLaps >= 2;
    previousLapStart = Math.max(0, (maxLaps - 2) * safeProtocol);
    previousLapEnd = (maxLaps - 1) * safeProtocol;
  } else {
    currentLapStart = laps * safeProtocol;
    currentLapEnd = safeElapsed;
    currentLapSweep = lapProgress;
    hasPrevious = laps >= 1;
    previousLapStart = Math.max(0, (laps - 1) * safeProtocol);
    previousLapEnd = laps * safeProtocol;
  }

  const visualCurrentSweep =
    cappedProgress > 0 ? Math.max(currentLapSweep, MIN_VISUAL_PROGRESS) : 0;

  const paddedEndHour =
    visualCurrentSweep > currentLapSweep
      ? currentLapStart + visualCurrentSweep * safeProtocol
      : currentLapEnd;

  const rect = useMemo(
    () =>
      Skia.XYWHRect(
        strokeWidth / 2,
        strokeWidth / 2,
        size - strokeWidth,
        size - strokeWidth,
      ),
    [size, strokeWidth],
  );

  const fullLapPath = useMemo(() => {
    const p = Skia.Path.Make();
    p.addArc(rect, START_ANGLE, 360);
    return p;
  }, [rect]);

  const currentLapPath = useMemo(() => {
    const p = Skia.Path.Make();
    if (visualCurrentSweep > 0) {
      p.addArc(rect, START_ANGLE, visualCurrentSweep * 360);
    }
    return p;
  }, [rect, visualCurrentSweep]);

  const currentStops = useMemo(
    () => slicePalette(currentLapStart, paddedEndHour, palette),
    [currentLapStart, paddedEndHour, palette],
  );
  const currentColors = useMemo(() => currentStops.map((s) => s.color), [currentStops]);
  const currentPositions = useMemo(
    () => currentStops.map((s) => s.pos * visualCurrentSweep),
    [currentStops, visualCurrentSweep],
  );

  const previousStops = useMemo(
    () => (hasPrevious ? slicePalette(previousLapStart, previousLapEnd, palette) : null),
    [hasPrevious, previousLapStart, previousLapEnd, palette],
  );
  const previousColors = useMemo(
    () => previousStops?.map((s) => s.color) ?? [],
    [previousStops],
  );
  const previousPositions = useMemo(
    () => previousStops?.map((s) => s.pos) ?? [],
    [previousStops],
  );

  const leadingAngleRad = ((START_ANGLE + visualCurrentSweep * 360) * Math.PI) / 180;
  const leadingX = cx + radius * Math.cos(leadingAngleRad);
  const leadingY = cy + radius * Math.sin(leadingAngleRad);
  const leadingColor = useMemo(
    () => samplePaletteAt(paddedEndHour, palette),
    [paddedEndHour, palette],
  );

  const showLeadingBall = !atCap && visualCurrentSweep > 0;

  return (
    <View style={{ width: size, height: size }}>
      <Canvas style={{ width: size, height: size }}>
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          style="stroke"
          strokeWidth={strokeWidth}
          color={trackColor}
        />
        {previousStops ? (
          <Path
            path={fullLapPath}
            style="stroke"
            strokeWidth={strokeWidth}
            strokeCap="butt">
            <SweepGradient
              c={vec(cx, cy)}
              colors={previousColors}
              positions={previousPositions}
              mode="clamp"
              origin={vec(cx, cy)}
              transform={[{ rotate: gradientRotation }]}
            />
          </Path>
        ) : null}
        {visualCurrentSweep > 0 ? (
          <Path
            path={currentLapPath}
            style="stroke"
            strokeWidth={strokeWidth}
            strokeCap="butt">
            <SweepGradient
              c={vec(cx, cy)}
              colors={currentColors}
              positions={currentPositions}
              mode="clamp"
              origin={vec(cx, cy)}
              transform={[{ rotate: gradientRotation }]}
            />
          </Path>
        ) : null}
        {showLeadingBall ? (
          <Circle cx={leadingX} cy={leadingY} r={strokeWidth / 2} color={leadingColor} />
        ) : null}
      </Canvas>
      {children ? (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {children}
        </View>
      ) : null}
    </View>
  );
}

function samplePaletteAt(hour: number, palette: HoursPalette): string {
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
      const t = span === 0 ? 0 : (hour - a.hour) / span;
      return lerpHex(a.color, b.color, t);
    }
  }
  return last.color;
}

function slicePalette(
  startHour: number,
  endHour: number,
  palette: HoursPalette,
): GradientStop[] {
  if (endHour <= startHour) {
    return [{ pos: 0, color: samplePaletteAt(startHour, palette) }];
  }
  const startColor = samplePaletteAt(startHour, palette);
  const endColor = samplePaletteAt(endHour, palette);
  const span = endHour - startHour;
  const stops: GradientStop[] = [{ pos: 0, color: startColor }];
  for (const p of palette) {
    if (p.hour > startHour && p.hour < endHour) {
      stops.push({ pos: (p.hour - startHour) / span, color: p.color });
    }
  }
  stops.push({ pos: 1, color: endColor });
  return stops;
}

function lerpHex(a: string, b: string, k: number): string {
  const rgbA = hexToRgb(a);
  const rgbB = hexToRgb(b);
  const r = Math.round(rgbA[0] + (rgbB[0] - rgbA[0]) * k);
  const g = Math.round(rgbA[1] + (rgbB[1] - rgbA[1]) * k);
  const bl = Math.round(rgbA[2] + (rgbB[2] - rgbA[2]) * k);
  return `#${toHex(r)}${toHex(g)}${toHex(bl)}`;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h;
  const num = parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function toHex(n: number): string {
  return n.toString(16).padStart(2, '0');
}

export const HOURS_PALETTE: HoursPalette = [
  { hour: 0, color: '#60A5FA' },
  { hour: 4, color: '#3B82F6' },
  { hour: 12, color: '#6366F1' },
  { hour: 18, color: '#8B5CF6' },
  { hour: 24, color: '#7C3AED' },
  { hour: 36, color: '#5B21B6' },
  { hour: 48, color: '#1E1B4B' },
];
