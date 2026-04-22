import { Text, View } from 'react-native';
import { colors } from '@/src/core/theme/colors';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import type { MonthSummary } from '../hooks/use-history';
import { Card } from './card';

interface HistorySummaryProps {
  summary: MonthSummary;
}

export function HistorySummary({ summary }: HistorySummaryProps) {
  return (
    <View className="flex-row" style={{ gap: 8 }}>
      <SummaryTile value={summary.totalHoursLabel} label="Total Hours" />
      <SummaryTile value={summary.fastsLabel} label="Fasts" />
      <SummaryTile value={summary.avgDurationLabel} label="Avg Duration" />
    </View>
  );
}

function SummaryTile({ value, label }: { value: string; label: string }) {
  const scheme = useColorScheme();
  const theme = colors[scheme];
  return (
    <Card cornerRadius={12} style={{ flex: 1 }}>
      <View className="items-center" style={{ padding: 12, gap: 4 }}>
        <Text
          className="font-display-bold text-[18px]"
          style={{ color: theme.foreground }}>
          {value}
        </Text>
        <Text
          className="font-medium text-[11px]"
          style={{ color: theme['text-tertiary'] }}>
          {label}
        </Text>
      </View>
    </Card>
  );
}
