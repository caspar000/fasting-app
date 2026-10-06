import { Text, View } from 'react-native';
import type { Zone } from '@/src/core/constants/zones';
import { useColorScheme } from '@/src/hooks/use-color-scheme';

export function ZonePill({ zone }: { zone: Zone }) {
  const scheme = useColorScheme();
  return (
    <View className="flex-row items-center gap-1.5 rounded-full bg-accent-bg px-3 py-1">
      <View className="h-2 w-2 rounded-full" style={{ backgroundColor: zone.color[scheme] }} />
      <Text className="font-semibold text-[12px] text-foreground">{zone.label}</Text>
    </View>
  );
}
