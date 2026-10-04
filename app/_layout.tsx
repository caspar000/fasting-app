import '@/app/global.css';

import {
  DMSans_500Medium,
  DMSans_700Bold,
  DMSans_800ExtraBold,
} from '@expo-google-fonts/dm-sans';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router/react-navigation';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { colorScheme as nwColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { colors } from '@/src/core/theme/colors';
import { useGoalNotification } from '@/src/features/notifications/hooks/use-goal-notification';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { useAppStore } from '@/src/stores/app-store';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorSchemeResolved = useColorScheme();
  const theme = useAppStore((s) => s.theme);
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    DMSans_500Medium,
    DMSans_700Bold,
    DMSans_800ExtraBold,
  });

  useEffect(() => {
    nwColorScheme.set(theme);
  }, [theme]);

  useGoalNotification();

  if (!fontsLoaded) {
    return null;
  }

  SplashScreen.hideAsync();

  const bg = colors[colorSchemeResolved].background;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: bg }}>
      <ThemeProvider value={colorSchemeResolved === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="dev-fasts" options={{ title: 'Manage fasts' }} />
          <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
        </Stack>
        <StatusBar style={colorSchemeResolved === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
