import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';
import { colors } from '@/src/core/theme/colors';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import type { CalendarCell, MonthState } from '../hooks/use-history';
import { Card } from './card';

const WEEKDAY_INITIALS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface HistoryCalendarProps {
  month: MonthState;
}

export function HistoryCalendar({ month }: HistoryCalendarProps) {
  const scheme = useColorScheme();
  const theme = colors[scheme];

  return (
    <Card>
      <View style={{ gap: 6, paddingBottom: 8 }}>
        <View
          className="flex-row items-center justify-between"
          style={{ paddingHorizontal: 12, paddingVertical: 12 }}>
          <NavButton
            icon="chevron-back"
            onPress={month.goPrev}
            color={theme['text-secondary']}
          />
          <Text className="font-semibold text-[16px]" style={{ color: theme.foreground }}>
            {month.label}
          </Text>
          <NavButton
            icon="chevron-forward"
            onPress={month.goNext}
            color={theme['text-secondary']}
            disabled={!month.canGoForward}
          />
        </View>

        <View className="flex-row" style={{ paddingHorizontal: 8 }}>
          {WEEKDAY_INITIALS.map((l, i) => (
            <Text
              key={`${l}-${i}`}
              className="font-semibold text-[12px]"
              style={{
                flex: 1,
                textAlign: 'center',
                color: theme['text-tertiary'],
              }}>
              {l}
            </Text>
          ))}
        </View>

        {month.weeks.map((week, wi) => {
          const isIndicatorRow = wi === month.weekIndicatorRow;
          return (
            <View
              key={`w-${wi}`}
              className="flex-row"
              style={{
                gap: 4,
                paddingHorizontal: 8,
                paddingVertical: 6,
                backgroundColor: isIndicatorRow ? theme['accent-bg'] : undefined,
                borderRadius: isIndicatorRow ? 12 : 0,
              }}>
              {week.map((cell, ci) => (
                <CalendarCellView key={`c-${wi}-${ci}`} cell={cell} />
              ))}
            </View>
          );
        })}

        <Legend />
      </View>
    </Card>
  );
}

function NavButton({
  icon,
  onPress,
  color,
  disabled,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
  color: string;
  disabled?: boolean;
}) {
  if (disabled) {
    return <View style={{ width: 20, height: 20 }} />;
  }
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
      <Ionicons name={icon} size={20} color={color} />
    </Pressable>
  );
}

function CalendarCellView({ cell }: { cell: CalendarCell }) {
  const scheme = useColorScheme();
  const theme = colors[scheme];

  if (cell.day === null) {
    return <View style={{ flex: 1, height: 40 }} />;
  }

  if (cell.isToday) {
    return (
      <View style={{ flex: 1 }}>
        <LinearGradient
          colors={['#3B82F6', '#1D4ED8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            height: 40,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: theme.accent,
          }}>
          <Text className="font-bold text-[13px]" style={{ color: '#FFFFFF' }}>
            {cell.day}
          </Text>
        </LinearGradient>
      </View>
    );
  }

  const fill =
    cell.intensity === 0
      ? undefined
      : cell.intensity === 1
        ? theme['calendar-heat-1']
        : cell.intensity === 2
          ? theme['calendar-heat-2']
          : theme['calendar-heat-3'];

  const textColor =
    cell.intensity === 0
      ? theme.foreground
      : cell.intensity === 1
        ? theme.accent
        : cell.intensity === 2
          ? theme['accent-deep']
          : '#FFFFFF';

  return (
    <View
      style={{
        flex: 1,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: fill,
      }}>
      <Text
        className="font-semibold text-[13px]"
        style={{ color: textColor }}>
        {cell.day}
      </Text>
    </View>
  );
}

function Legend() {
  const scheme = useColorScheme();
  const theme = colors[scheme];
  return (
    <View
      className="flex-row items-center justify-center"
      style={{ gap: 14, paddingTop: 6, paddingBottom: 4 }}>
      <View className="flex-row items-center" style={{ gap: 6 }}>
        <Text
          className="font-medium text-[12px]"
          style={{ color: theme['text-secondary'] }}>
          Less
        </Text>
        <View className="flex-row" style={{ gap: 3 }}>
          <Swatch color={theme['calendar-heat-1']} />
          <Swatch color={theme['calendar-heat-2']} />
          <Swatch color={theme['calendar-heat-3']} />
        </View>
        <Text
          className="font-medium text-[12px]"
          style={{ color: theme['text-secondary'] }}>
          More
        </Text>
      </View>
      <View className="flex-row items-center" style={{ gap: 4 }}>
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            borderWidth: 2,
            borderColor: theme.accent,
          }}
        />
        <Text
          className="font-medium text-[12px]"
          style={{ color: theme['text-secondary'] }}>
          Today
        </Text>
      </View>
    </View>
  );
}

function Swatch({ color }: { color: string }) {
  return (
    <View style={{ width: 10, height: 10, borderRadius: 2, backgroundColor: color }} />
  );
}
