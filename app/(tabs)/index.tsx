import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getProtocol } from '@/src/core/constants/protocols';
import { getZoneForElapsed, TIMELINE_END_HOUR, zonePalette } from '@/src/core/constants/zones';
import { computeStreaks } from '@/src/core/lib/streaks';
import { formatDurationHoursMinutes, formatElapsed, formatTimeOfDay, relativeDayLabel } from '@/src/core/lib/time';
import { colors } from '@/src/core/theme/colors';
import { ActionButton } from '@/src/features/home/components/action-button';
import { AdjustStartModal } from '@/src/features/home/components/adjust-start-modal';
import { DebugTimerSlider } from '@/src/features/home/components/debug-timer-slider';
import { GoalConfetti } from '@/src/features/home/components/goal-confetti';
import { ProgressRing } from '@/src/features/home/components/progress-ring';
import { ActiveTimerContent, IdleTimerContent } from '@/src/features/home/components/timer-display';
import { TimeInfo } from '@/src/features/home/components/time-info';
import { ZoneBar } from '@/src/features/home/components/zone-bar';
import { useElapsed } from '@/src/features/home/hooks/use-elapsed';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { useAppStore } from '@/src/stores/app-store';
import { useFastingStore } from '@/src/stores/fasting-store';

const RING_SIZE = 300;
const RING_STROKE = 18;
const HOUR_MS = 3_600_000;

export default function DashboardScreen() {
  const scheme = useColorScheme();
  const theme = colors[scheme];

  const activeFast = useFastingStore((s) => s.activeFast);
  const lastFast = useFastingStore((s) => s.lastFast);
  const completedFasts = useFastingStore((s) => s.completedFasts);
  const protocolId = useFastingStore((s) => s.protocolId);
  const startFast = useFastingStore((s) => s.startFast);
  const endFast = useFastingStore((s) => s.endFast);
  const adjustStart = useFastingStore((s) => s.adjustStart);

  const [adjustStartOpen, setAdjustStartOpen] = useState(false);
  const streak = useMemo(
    () => computeStreaks(completedFasts, new Date()).current,
    [completedFasts],
  );

  const timerDebugSlider = useAppStore((s) => s.timerDebugSlider);
  const debugElapsedMs = useAppStore((s) => s.debugElapsedMs);
  const setDebugElapsedMs = useAppStore((s) => s.setDebugElapsedMs);

  const customFastHours = useFastingStore((s) => s.customProtocolFastHours);
  const activeProtocol = getProtocol(activeFast?.protocolId ?? protocolId, customFastHours);
  const realElapsedMs = useElapsed(activeFast?.startedAt ?? null);

  const displayedElapsedMs = timerDebugSlider ? debugElapsedMs : realElapsedMs;
  const showActiveTimer = Boolean(activeFast) || timerDebugSlider;
  const elapsedHours = displayedElapsedMs / HOUR_MS;
  const currentZone = useMemo(() => getZoneForElapsed(elapsedHours), [elapsedHours]);
  const palette = useMemo(() => zonePalette(scheme), [scheme]);

  const goalDate = activeFast
    ? new Date(activeFast.startedAt + activeProtocol.fastHours * HOUR_MS)
    : null;
  const startedDate = activeFast ? new Date(activeFast.startedAt) : null;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}>
        <View
          className="flex-1 items-center justify-center px-6"
          style={{ gap: 24, paddingBottom: 24 }}>
          <ProgressRing
            size={RING_SIZE}
            strokeWidth={RING_STROKE}
            elapsedHours={showActiveTimer ? elapsedHours : 0}
            goalHours={activeProtocol.fastHours}
            palette={palette}
            trackColor={theme.border}
            goalTickColor={theme.foreground}>
            {showActiveTimer ? (
              <ActiveTimerContent
                elapsedText={formatElapsed(displayedElapsedMs)}
                protocol={activeProtocol}
                zone={currentZone}
                streak={streak}
              />
            ) : (
              <IdleTimerContent
                protocolLabel={activeProtocol.label}
                onChangeProtocol={() => router.navigate('/protocols')}
              />
            )}
          </ProgressRing>

          {activeFast ? (
            <ActionButton variant="end" onPress={() => endFast()} />
          ) : (
            <ActionButton variant="start" onPress={() => startFast()} />
          )}

          <View className="w-full" style={{ gap: 16 }}>
            {activeFast && startedDate && goalDate ? (
              <TimeInfo
                startLabel="Started"
                startValue={formatTimeOfDay(startedDate)}
                endLabel="Goal"
                endValue={formatTimeOfDay(goalDate)}
                onAdjustStart={() => setAdjustStartOpen(true)}
              />
            ) : lastFast ? (
              <TimeInfo
                startLabel="Last fast"
                startValue={relativeDayLabel(new Date(lastFast.endedAt))}
                endLabel="Duration"
                endValue={formatDurationHoursMinutes(lastFast.endedAt - lastFast.startedAt)}
              />
            ) : (
              <TimeInfo startLabel="Last fast" startValue="—" endLabel="Duration" endValue="—" />
            )}
            <ZoneBar activeZone={showActiveTimer ? currentZone : null} />
            {timerDebugSlider ? (
              <DebugTimerSlider
                value={debugElapsedMs}
                maxMs={TIMELINE_END_HOUR * HOUR_MS}
                onChange={setDebugElapsedMs}
              />
            ) : null}
          </View>
        </View>
      </ScrollView>
      {activeFast ? (
        <AdjustStartModal
          visible={adjustStartOpen}
          startedAt={activeFast.startedAt}
          onClose={() => setAdjustStartOpen(false)}
          onConfirm={(newStartedAt) => {
            adjustStart(newStartedAt);
            setAdjustStartOpen(false);
          }}
        />
      ) : null}
      <GoalConfetti
        elapsedMs={displayedElapsedMs}
        goalMs={activeProtocol.fastHours * HOUR_MS}
        debug={timerDebugSlider}
      />
    </SafeAreaView>
  );
}
