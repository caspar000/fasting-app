import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';
import { getProtocol } from '@/src/core/constants/protocols';
import { formatDurationHoursMinutes, formatTimeOfDay } from '@/src/core/lib/time';
import { colors } from '@/src/core/theme/colors';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { type CompletedFast, useFastingStore } from '@/src/stores/fasting-store';

interface FastListItemProps {
  fast: CompletedFast;
  onPress: () => void;
  onDelete: () => void;
}

export function FastListItem({ fast, onPress, onDelete }: FastListItemProps) {
  const scheme = useColorScheme();
  const theme = colors[scheme];

  const customFastHours = useFastingStore((s) => s.customProtocolFastHours);
  const start = new Date(fast.startedAt);
  const end = new Date(fast.endedAt);
  const protocol = getProtocol(fast.protocolId, customFastHours);
  const durationMs = Math.max(0, fast.endedAt - fast.startedAt);
  const startDate = start.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Edit fast on ${startDate}`}
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
      className="flex-row items-center gap-3 px-4 py-3.5">
      <View className="flex-1 gap-0.5">
        <View className="flex-row items-center gap-2">
          <Text
            className="font-semibold text-[15px]"
            style={{ color: theme.foreground }}
            numberOfLines={1}>
            {startDate}
          </Text>
          <Text
            className="font-medium text-[12px]"
            style={{ color: theme['text-tertiary'] }}>
            · {protocol.shortLabel}
          </Text>
        </View>
        <Text
          className="text-[12px]"
          style={{ color: theme['text-tertiary'] }}
          numberOfLines={1}>
          {formatTimeOfDay(start)} → {formatTimeOfDay(end)} · {formatDurationHoursMinutes(durationMs)}
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Delete fast"
        onPress={onDelete}
        hitSlop={8}
        className="h-8 w-8 items-center justify-center rounded-full"
        style={({ pressed }) => ({
          backgroundColor: `${theme.destructive}1A`,
          opacity: pressed ? 0.6 : 1,
        })}>
        <Ionicons name="trash-outline" size={15} color={theme.destructive} />
      </Pressable>
    </Pressable>
  );
}

export function FastListItemDivider() {
  return <View className="ml-4 h-px bg-divider" />;
}
