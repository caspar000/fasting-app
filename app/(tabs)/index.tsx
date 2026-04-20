import { router } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getProtocol } from '@/src/core/constants/protocols';
import { getZoneForElapsed } from '@/src/core/constants/zones';
import { formatDurationHoursMinutes, formatElapsed, formatTimeOfDay, relativeDayLabel } from '@/src/core/lib/time';
import { colors } from '@/src/core/theme/colors';
import { ActionButton } from '@/src/features/home/components/action-button';
import { DebugTimerSlider } from '@/src/features/home/components/debug-timer-slider';
import { ProgressRing, RING_STOPS } from '@/src/features/home/components/progress-ring';
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
  const streakCount = useFastingStore((s) => s.streakCount);
  const protocolId = useFastingStore((s) => s.protocolId);
  const startFast = useFastingStore((s) => s.startFast);
  const endFast = useFastingStore((s) => s.endFast);

  const timerDebugSlider = useAppStore((s) => s.timerDebugSlider);
  const debugElapsedMs = useAppStore((s) => s.debugElapsedMs);
  const setDebugElapsedMs = useAppStore((s) => s.setDebugElapsedMs);

  const activeProtocol = getProtocol(activeFast?.protocolId ?? protocolId);
  const realElapsedMs = useElapsed(activeFast?.startedAt ?? null);

  const displayedElapsedMs = timerDebugSlider ? debugElapsedMs : realElapsedMs;
  const showActiveTimer = Boolean(activeFast) || timerDebugSlider;
  const elapsedHours = displayedElapsedMs / HOUR_MS;
  const progress = displayedElapsedMs / (activeProtocol.fastHours * HOUR_MS);
  const currentZone = useMemo(() => getZoneForElapsed(elapsedHours), [elapsedHours]);

  const goalDate = activeFast
    ? new Date(activeFast.startedAt + activeProtocol.fastHours * HOUR_MS)
    : null;
  const startedDate = activeFast ? new Date(activeFast.startedAt) : null;

  const sliderMaxMs = Math.max(activeProtocol.fastHours, 20) * HOUR_MS;

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
            progress={showActiveTimer ? progress : 0}
            stops={RING_STOPS}
            trackColor={theme.border}>
            {showActiveTimer ? (
              <ActiveTimerContent
                elapsedText={formatElapsed(displayedElapsedMs)}
                protocol={activeProtocol}
                zone={currentZone}
                streak={streakCount}
              />
            ) : (
              <IdleTimerContent
                protocolLabel={activeProtocol.label}
                onChangeProtocol={() => router.push('/protocols')}
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
                onAdjustStart={() => {
                  /* backdate modal to be wired */
                }}
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
            <ZoneBar activeZoneId={showActiveTimer ? currentZone.id : null} />
            {timerDebugSlider ? (
              <DebugTimerSlider
                value={debugElapsedMs}
                maxMs={sliderMaxMs}
                onChange={setDebugElapsedMs}
              />
            ) : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
