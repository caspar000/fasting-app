import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

export function StreakPill({ days }: { days: number }) {
  if (days <= 0) return null;
  return (
    <View className="flex-row items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5">
      <Ionicons name="flame" size={14} color="#F97316" />
      <Text className="font-semibold text-[12px]" style={{ color: '#C2410C' }}>
        {days === 1 ? '1 day streak' : `${days} day streak`}
      </Text>
    </View>
  );
}
