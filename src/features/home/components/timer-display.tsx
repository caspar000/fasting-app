import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';
import type { Protocol } from '@/src/core/constants/protocols';
import type { Zone } from '@/src/core/constants/zones';
import { StreakPill } from './streak-pill';
import { ZonePill } from './zone-pill';

export interface ActiveTimerContentProps {
  elapsedText: string;
  protocol: Protocol;
  zone: Zone;
  streak: number;
}

export function ActiveTimerContent({
  elapsedText,
  protocol,
  zone,
  streak,
}: ActiveTimerContentProps) {
  return (
    <View className="items-center" style={{ gap: 6 }}>
      <Text
        className="text-foreground"
        style={{ fontFamily: 'DMSans_800ExtraBold', fontSize: 52, letterSpacing: -2 }}>
        {elapsedText}
      </Text>
      <Text className="font-medium text-[15px] text-text-secondary">{protocol.label}</Text>
      <ZonePill zone={zone} />
      <StreakPill days={streak} />
    </View>
  );
}

export interface IdleTimerContentProps {
  placeholderText?: string;
  protocolLabel: string;
  onChangeProtocol?: () => void;
}

export function IdleTimerContent({
  placeholderText = '00:00:00',
  protocolLabel,
  onChangeProtocol,
}: IdleTimerContentProps) {
  return (
    <View className="items-center" style={{ gap: 10 }}>
      <Text
        className="text-text-tertiary"
        style={{ fontFamily: 'DMSans_800ExtraBold', fontSize: 48, letterSpacing: -2 }}>
        {placeholderText}
      </Text>
      <Text className="font-medium text-[15px] text-text-secondary">Ready to fast</Text>
      <Pressable
        accessibilityRole="button"
        onPress={onChangeProtocol}
        className="flex-row items-center gap-1 rounded-full bg-accent-bg px-3 py-1.5">
        <Ionicons name="chevron-down" size={14} color="#2563EB" />
        <Text className="font-semibold text-[13px] text-accent">{protocolLabel}</Text>
      </Pressable>
    </View>
  );
}
