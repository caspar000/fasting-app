import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View className="flex-1 items-center justify-center bg-background p-6">
        <Text className="text-xl font-semibold text-foreground">This screen doesn't exist.</Text>
        <Link href="/" className="mt-4">
          <Text className="text-accent">Go to home</Text>
        </Link>
      </View>
    </>
  );
}
