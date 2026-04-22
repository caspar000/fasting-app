import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';
import { colors } from '@/src/core/theme/colors';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import type { WeekStripState } from '../hooks/use-history';
import { Card } from './card';

const WEEK_HOURS = 168;
const WEEKDAY_INITIALS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface WeekStripBarProps {
  week: WeekStripState;
}

export function WeekStripBar({ week }: WeekStripBarProps) {
  const scheme = useColorScheme();
  const theme = colors[scheme];
  const todayDayIndex =
    week.todayHour === null ? null : Math.min(6, Math.floor(week.todayHour / 24));

  return (
    <Card>
      <View style={{ padding: 16, gap: 12 }}>
        <View
          className="flex-row items-center justify-between"
          style={{ paddingHorizontal: 4 }}>
          <NavButton
            icon="chevron-back"
            onPress={week.goPrev}
            color={theme['text-secondary']}
          />
          <Text className="font-semibold text-[14px]" style={{ color: theme.foreground }}>
            {week.label}
          </Text>
          <NavButton
            icon="chevron-forward"
            onPress={week.goNext}
            color={theme['text-secondary']}
            disabled={!week.canGoForward}
          />
        </View>

        <View className="flex-row items-end" style={{ gap: 6 }}>
          <Text
            className="font-display-bold text-[28px]"
            style={{ color: theme.accent, lineHeight: 32 }}>
            {week.totalHoursLabel}
          </Text>
          <Text
            className="font-medium text-[12px]"
            style={{ color: theme['text-secondary'], paddingBottom: 4 }}>
            / 168h fasted this week
          </Text>
        </View>

        <View
          style={{
            width: '100%',
            height: 28,
            backgroundColor: theme['calendar-started'],
            overflow: 'hidden',
          }}>
          {week.segments.map((s, i) => (
            <LinearGradient
              key={i}
              colors={['#3B82F6', '#1D4ED8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${(s.startHour / WEEK_HOURS) * 100}%`,
                width: `${((s.endHour - s.startHour) / WEEK_HOURS) * 100}%`,
              }}
            />
          ))}
          {week.todayHour !== null && (
            <View
              style={{
                position: 'absolute',
                top: -3,
                height: 34,
                width: 2,
                left: `${(week.todayHour / WEEK_HOURS) * 100}%`,
                transform: [{ translateX: -1 }],
                backgroundColor: theme.accent,
              }}
            />
          )}
        </View>

        <View className="flex-row">
          {WEEKDAY_INITIALS.map((label, i) => {
            const isToday = todayDayIndex === i;
            return (
              <Text
                key={i}
                className="font-medium text-[11px]"
                style={{
                  flex: 1,
                  textAlign: 'center',
                  color: isToday ? theme.accent : theme['text-tertiary'],
                  fontWeight: isToday ? '700' : '500',
                }}>
                {label}
              </Text>
            );
          })}
        </View>
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
