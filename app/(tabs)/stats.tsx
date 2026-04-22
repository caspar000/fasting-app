import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HistoryCalendar } from '@/src/features/history/components/history-calendar';
import { HistorySummary } from '@/src/features/history/components/history-summary';
import { StreakCards } from '@/src/features/history/components/streak-cards';
import { WeekStripBar } from '@/src/features/history/components/week-strip-bar';
import { useHistory } from '@/src/features/history/hooks/use-history';

export default function StatsScreen() {
  const { currentStreak, bestStreak, month, summary, weekStrip } = useHistory();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="items-center pb-2 pt-1">
        <Text className="font-bold text-[20px] text-foreground">Stats</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32, gap: 16 }}
        showsVerticalScrollIndicator={false}>
        <StreakCards current={currentStreak} best={bestStreak} />
        <WeekStripBar week={weekStrip} />
        <HistoryCalendar month={month} />
        <HistorySummary summary={summary} />
      </ScrollView>
    </SafeAreaView>
  );
}
