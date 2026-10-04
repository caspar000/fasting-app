import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { getProtocol } from '@/src/core/constants/protocols';
import { useFastingStore } from '@/src/stores/fasting-store';

const HOUR_MS = 3_600_000;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Syncs run one after another so a quick start/adjust/end can't schedule out of order.
let queue = Promise.resolve();

async function syncGoalNotification(goalAt: number | null, protocolLabel: string) {
  // The goal notification is the only one the app schedules.
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (goalAt === null || goalAt <= Date.now()) return;

  let { granted, canAskAgain } = await Notifications.getPermissionsAsync();
  if (!granted && canAskAgain) ({ granted } = await Notifications.requestPermissionsAsync());
  if (!granted) return;

  await Notifications.scheduleNotificationAsync({
    content: { title: 'Fast complete', body: `You reached your ${protocolLabel} goal.` },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: goalAt },
  });
}

/** Keeps a single notification scheduled for the active fast's goal time. */
export function useGoalNotification() {
  const goalAt = useFastingStore((s) =>
    s.activeFast
      ? s.activeFast.startedAt +
        getProtocol(s.activeFast.protocolId, s.customProtocolFastHours).fastHours * HOUR_MS
      : null,
  );
  const protocolLabel = useFastingStore(
    (s) => getProtocol(s.activeFast?.protocolId ?? s.protocolId, s.customProtocolFastHours).label,
  );

  useEffect(() => {
    queue = queue
      .then(() => syncGoalNotification(goalAt, protocolLabel))
      .catch((e: unknown) => console.warn('Failed to sync goal notification', e));
  }, [goalAt, protocolLabel]);
}
