import Ionicons from '@react-native-vector-icons/ionicons';
import { Pressable, Text, View } from 'react-native';

export interface TimeInfoProps {
  startLabel: string;
  startValue: string;
  endLabel: string;
  endValue: string;
  onAdjustStart?: () => void;
}

export function TimeInfo({
  startLabel,
  startValue,
  endLabel,
  endValue,
  onAdjustStart,
}: TimeInfoProps) {
  return (
    <View className="flex-row justify-between px-4">
      <View className="items-start gap-1">
        <Text className="text-[12px] font-medium text-text-tertiary">{startLabel}</Text>
        <Text className="font-bold text-[16px] text-foreground">{startValue}</Text>
        {onAdjustStart ? (
          <Pressable
            accessibilityRole="button"
            onPress={onAdjustStart}
            className="mt-0.5 flex-row items-center gap-1 rounded-lg bg-accent-bg px-2 py-1">
            <Ionicons name="pencil" size={11} color="#2563EB" />
            <Text className="font-semibold text-[12px] text-accent">Adjust</Text>
          </Pressable>
        ) : null}
      </View>
      <View className="items-end gap-1">
        <Text className="text-[12px] font-medium text-text-tertiary">{endLabel}</Text>
        <Text className="font-bold text-[16px] text-foreground">{endValue}</Text>
      </View>
    </View>
  );
}
