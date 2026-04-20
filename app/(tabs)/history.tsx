import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="font-bold text-2xl text-foreground">History</Text>
        <Text className="mt-2 text-center text-sm text-text-secondary">
          Your fasting calendar will live here.
        </Text>
      </View>
    </SafeAreaView>
  );
}
