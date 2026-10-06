import { Text, View } from 'react-native';
import {
  getZoneEndHour,
  TIMELINE_END_HOUR,
  ZONES,
  type Zone,
} from '@/src/core/constants/zones';
import { colors } from '@/src/core/theme/colors';
import { useColorScheme } from '@/src/hooks/use-color-scheme';

export interface ZoneBarProps {
  activeZone?: Zone | null;
}

export function ZoneBar({ activeZone }: ZoneBarProps) {
  const scheme = useColorScheme();
  const idle = activeZone == null;
  return (
    <View style={{ gap: 8 }}>
      <View className="flex-row items-center justify-between">
        <Text className="font-semibold text-[13px] text-foreground">
          {activeZone ? activeZone.label : 'Fasting zones'}
        </Text>
        <Text className="font-medium text-[12px] text-text-tertiary">
          {activeZone ? zoneRangeLabel(activeZone) : `0–${TIMELINE_END_HOUR}h`}
        </Text>
      </View>
      <View className="flex-row" style={{ gap: 2 }}>
        {ZONES.map((zone) => {
          const endHour = getZoneEndHour(zone) ?? TIMELINE_END_HOUR;
          const isActive = activeZone?.id === zone.id;
          return (
            <View
              key={zone.id}
              className="rounded-full"
              style={{
                flex: endHour - zone.startHour,
                height: 8,
                backgroundColor: idle ? colors[scheme].border : zone.color[scheme],
                opacity: idle || isActive ? 1 : 0.3,
              }}
            />
          );
        })}
      </View>
    </View>
  );
}

function zoneRangeLabel(zone: Zone): string {
  const endHour = getZoneEndHour(zone);
  return endHour === null ? `${zone.startHour}h+` : `${zone.startHour}–${endHour}h`;
}
