import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';
import { colors } from '@/src/core/theme/colors';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { Card } from './card';

interface StreakCardsProps {
  current: number;
  best: number;
}

export function StreakCards({ current, best }: StreakCardsProps) {
  return (
    <View className="flex-row" style={{ gap: 12 }}>
      <StreakCard
        label="Current Streak"
        value={current}
        icon="flame"
        iconColor="#F97316"
        valueColorToken="accent"
      />
      <StreakCard
        label="Best Streak"
        value={best}
        icon="trophy"
        iconColor="#F59E0B"
        valueColorToken="accent-deep"
      />
    </View>
  );
}

interface StreakCardProps {
  label: string;
  value: number;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  valueColorToken: 'accent' | 'accent-deep';
}

function StreakCard({ label, value, icon, iconColor, valueColorToken }: StreakCardProps) {
  const scheme = useColorScheme();
  const theme = colors[scheme];

  return (
    <Card style={{ flex: 1 }}>
      <View style={{ padding: 16, gap: 4 }}>
        <Text
          className="font-medium text-[12px]"
          style={{ color: theme['text-secondary'] }}>
          {label}
        </Text>
        <View className="flex-row items-center" style={{ gap: 8 }}>
          <Ionicons name={icon} size={24} color={iconColor} />
          <Text
            className="font-display-bold text-[32px]"
            style={{ color: theme[valueColorToken], lineHeight: 38 }}>
            {value}
          </Text>
        </View>
      </View>
    </Card>
  );
}
