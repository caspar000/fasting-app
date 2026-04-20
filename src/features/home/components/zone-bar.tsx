import { Text, View } from 'react-native';
import { ZONES, type ZoneId } from '@/src/core/constants/zones';

export interface ZoneBarProps {
  activeZoneId?: ZoneId | null;
}

const ZONE_COLORS: Record<ZoneId, string> = {
  fed: '#3B82F6',
  'fat-burn': '#2563EB',
  ketosis: '#4F46E5',
  'deep-ketosis': '#7C3AED',
};

export function ZoneBar({ activeZoneId }: ZoneBarProps) {
  const dim = activeZoneId == null;
  return (
    <View
      className="flex-row overflow-hidden rounded-xl"
      style={{ height: 36 }}>
      {ZONES.map((zone) => {
        const color = ZONE_COLORS[zone.id];
        const isActive = !dim && activeZoneId === zone.id;
        const bg = dim ? '#D1D5DB' : color;
        const opacity = dim ? 1 : isActive ? 1 : 0.85;
        return (
          <View
            key={zone.id}
            className="items-center justify-center"
            style={{ flex: 1, backgroundColor: bg, opacity }}>
            <Text
              className="font-semibold text-[11px]"
              style={{ color: dim ? '#4B5563' : '#FFFFFF' }}>
              {zone.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
