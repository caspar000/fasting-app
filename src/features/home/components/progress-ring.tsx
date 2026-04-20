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

export interface GradientStop {
  pos: number;
  color: string;
}

export interface ProgressRingProps {
  size: number;
  strokeWidth: number;
  progress: number;
  stops: readonly GradientStop[];
  trackColor: string;
  children?: React.ReactNode;
}

const START_ANGLE = -90;
const MIN_VISUAL_PROGRESS = 0.015;

export function ProgressRing({
  size,
  strokeWidth,
  progress,
  stops,
  trackColor,
  children,
}: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(1, progress));
  const visualProgress = clamped > 0 ? Math.max(clamped, MIN_VISUAL_PROGRESS) : 0;
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;

  const arcPath = useMemo(() => {
    const p = Skia.Path.Make();
    if (visualProgress > 0) {
      const rect = Skia.XYWHRect(
        strokeWidth / 2,
        strokeWidth / 2,
        size - strokeWidth,
        size - strokeWidth,
      );
      p.addArc(rect, START_ANGLE, visualProgress * 360);
    }
    return p;
  }, [visualProgress, size, strokeWidth]);

  const colors = useMemo(() => stops.map((s) => s.color), [stops]);
  const positions = useMemo(() => stops.map((s) => s.pos), [stops]);

  const leadingAngleRad = ((START_ANGLE + visualProgress * 360) * Math.PI) / 180;
  const leadingX = cx + radius * Math.cos(leadingAngleRad);
  const leadingY = cy + radius * Math.sin(leadingAngleRad);
  const leadingColor = useMemo(
    () => sampleGradient(visualProgress, stops),
    [visualProgress, stops],
  );

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
        {visualProgress > 0 ? (
          <>
            <Path
              path={arcPath}
              style="stroke"
              strokeWidth={strokeWidth}
              strokeCap="butt">
              <SweepGradient
                c={vec(cx, cy)}
                colors={colors}
                positions={positions}
                mode="clamp"
                origin={vec(cx, cy)}
                transform={[{ rotate: (START_ANGLE * Math.PI) / 180 }]}
              />
            </Path>
            <Circle cx={leadingX} cy={leadingY} r={strokeWidth / 2} color={leadingColor} />
          </>
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

function sampleGradient(t: number, stops: readonly GradientStop[]): string {
  const first = stops[0];
  const last = stops[stops.length - 1];
  if (!first || !last) return '#000000';
  if (t <= first.pos) return first.color;
  if (t >= last.pos) return last.color;
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i]!;
    const b = stops[i + 1]!;
    if (t >= a.pos && t <= b.pos) {
      const span = b.pos - a.pos;
      const k = span === 0 ? 0 : (t - a.pos) / span;
      return lerpHex(a.color, b.color, k);
    }
  }
  return last.color;
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

export const RING_STOPS: readonly GradientStop[] = [
  { pos: 0, color: '#60A5FA' },
  { pos: 0.33, color: '#3B82F6' },
  { pos: 0.66, color: '#6366F1' },
  { pos: 1, color: '#8B5CF6' },
];
