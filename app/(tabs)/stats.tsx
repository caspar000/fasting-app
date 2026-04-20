import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StatsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="font-bold text-2xl text-foreground">Stats</Text>
        <Text className="mt-2 text-center text-sm text-text-secondary">
          Aggregated trends and insights will live here.
        </Text>
      </View>
    </SafeAreaView>
  );
}
