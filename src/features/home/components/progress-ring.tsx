import {
  Canvas,
  Circle,
  Line,
  Path,
  Shadow,
  Skia,
  SweepGradient,
  vec,
  type SkPath,
  type SkRect,
} from '@shopify/react-native-skia';
import { useMemo } from 'react';
import { View } from 'react-native';
import type { PaletteStop } from '@/src/core/constants/zones';
import {
  computeRingLayout,
  samplePaletteAt,
  slicePalette,
  type LapSpan,
} from '@/src/features/home/lib/ring';

export interface ProgressRingProps {
  size: number;
  strokeWidth: number;
  elapsedHours: number;
  goalHours: number;
  palette: readonly PaletteStop[];
  trackColor: string;
  goalTickColor: string;
  children?: React.ReactNode;
}

const START_ANGLE = -90;
const MIN_VISUAL_SWEEP = 0.015;

export function ProgressRing({
  size,
  strokeWidth,
  elapsedHours,
  goalHours,
  palette,
  trackColor,
  goalTickColor,
  children,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  const layout = computeRingLayout(elapsedHours, goalHours);
  const active = elapsedHours > 0;
  const sweep = active ? Math.max(layout.currentSweep, MIN_VISUAL_SWEEP) : 0;

  const rect = useMemo(
    () => Skia.XYWHRect(strokeWidth / 2, strokeWidth / 2, size - strokeWidth, size - strokeWidth),
    [size, strokeWidth],
  );
  const fullLapPath = useMemo(() => arcPath(rect, 1), [rect]);
  const currentLapPath = useMemo(() => arcPath(rect, sweep), [rect, sweep]);

  const tip = pointOnRing(center, radius, sweep);
  const tipColor = samplePaletteAt(layout.currentLap.endHour, palette);

  return (
    <View style={{ width: size, height: size }}>
      <Canvas style={{ width: size, height: size }}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          style="stroke"
          strokeWidth={strokeWidth}
          color={trackColor}
        />
        {active && layout.previousLap ? (
          <LapArc
            path={fullLapPath}
            span={layout.previousLap}
            sweep={1}
            palette={palette}
            center={center}
            strokeWidth={strokeWidth}
          />
        ) : null}
        {active ? (
          <LapArc
            path={currentLapPath}
            span={layout.currentLap}
            sweep={sweep}
            palette={palette}
            center={center}
            strokeWidth={strokeWidth}
          />
        ) : null}
        {active && layout.goalSweep !== null ? (
          <Line
            p1={pointOnRing(center, radius - strokeWidth / 2 - 3, layout.goalSweep)}
            p2={pointOnRing(center, radius + strokeWidth / 2 + 3, layout.goalSweep)}
            color={goalTickColor}
            strokeWidth={3}
            strokeCap="round"
          />
        ) : null}
        {active ? (
          <Circle cx={tip.x} cy={tip.y} r={strokeWidth / 2} color={tipColor}>
            <Shadow dx={0} dy={0} blur={4} color="rgba(0, 0, 0, 0.35)" />
          </Circle>
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

interface LapArcProps {
  path: SkPath;
  span: LapSpan;
  sweep: number;
  palette: readonly PaletteStop[];
  center: number;
  strokeWidth: number;
}

function LapArc({ path, span, sweep, palette, center, strokeWidth }: LapArcProps) {
  const stops = useMemo(
    () => slicePalette(span.startHour, span.endHour, palette),
    [span.startHour, span.endHour, palette],
  );
  return (
    <Path path={path} style="stroke" strokeWidth={strokeWidth} strokeCap="butt">
      <SweepGradient
        c={vec(center, center)}
        colors={stops.map((s) => s.color)}
        positions={stops.map((s) => s.pos * sweep)}
        mode="clamp"
        origin={vec(center, center)}
        transform={[{ rotate: (START_ANGLE * Math.PI) / 180 }]}
      />
    </Path>
  );
}

function arcPath(rect: SkRect, sweep: number): SkPath {
  const p = Skia.Path.Make();
  if (sweep > 0) p.addArc(rect, START_ANGLE, sweep * 360);
  return p;
}

function pointOnRing(center: number, radius: number, sweep: number) {
  const angle = ((START_ANGLE + sweep * 360) * Math.PI) / 180;
  return vec(center + radius * Math.cos(angle), center + radius * Math.sin(angle));
}
