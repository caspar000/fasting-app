import { Text, View } from 'react-native';
import type { Zone } from '@/src/core/constants/zones';

export function ZonePill({ zone }: { zone: Zone }) {
  return (
    <View className="flex-row items-center gap-1.5 rounded-full bg-accent-bg px-3 py-1">
      <View className="h-2 w-2 rounded-full" style={{ backgroundColor: zone.hex }} />
      <Text className="font-semibold text-[12px]" style={{ color: zone.hex }}>
        {zoneToStatus(zone.id)}
      </Text>
    </View>
  );
}

function zoneToStatus(id: Zone['id']): string {
  switch (id) {
    case 'fed':
      return 'Digesting';
    case 'fat-burn':
      return 'Fat Burning';
    case 'ketosis':
      return 'Ketosis';
    case 'deep-ketosis':
      return 'Deep Ketosis';
  }
}
