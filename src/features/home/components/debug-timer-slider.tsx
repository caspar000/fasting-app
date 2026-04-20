import Slider from '@react-native-community/slider';
import { Text, View } from 'react-native';
import { formatElapsed } from '@/src/core/lib/time';
import { colors } from '@/src/core/theme/colors';
import { useColorScheme } from '@/src/hooks/use-color-scheme';

export interface DebugTimerSliderProps {
  value: number;
  maxMs: number;
  onChange: (ms: number) => void;
}

export function DebugTimerSlider({ value, maxMs, onChange }: DebugTimerSliderProps) {
  const scheme = useColorScheme();
  const theme = colors[scheme];
  const hours = Math.floor(maxMs / 3_600_000);

  return (
    <View
      className="rounded-card border border-dashed border-accent/40 bg-accent-bg/40 px-3 pt-2 pb-3"
      style={{ gap: 4 }}>
      <View className="flex-row items-center justify-between">
        <Text className="font-semibold text-[11px] uppercase tracking-wider text-accent">
          Debug · Timer
        </Text>
        <Text className="font-medium text-[12px] text-text-secondary">
          {formatElapsed(value)}
        </Text>
      </View>
      <Slider
        minimumValue={0}
        maximumValue={maxMs}
        step={60_000}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor={theme.accent}
        maximumTrackTintColor={theme.border}
        thumbTintColor={theme.accent}
      />
      <View className="flex-row justify-between">
        <Text className="text-[10px] text-text-tertiary">0h</Text>
        <Text className="text-[10px] text-text-tertiary">{hours}h</Text>
      </View>
    </View>
  );
}
