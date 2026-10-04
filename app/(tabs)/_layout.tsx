import Ionicons from '@react-native-vector-icons/ionicons';
import { Tabs } from 'expo-router';
import { colors } from '@/src/core/theme/colors';
import { useColorScheme } from '@/src/hooks/use-color-scheme';

export default function TabLayout() {
  const scheme = useColorScheme();
  const theme = colors[scheme];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme['text-tertiary'],
        tabBarLabelStyle: { fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 0.4 },
        tabBarStyle: {
          backgroundColor: theme['surface-elevated'],
          borderTopColor: theme.border,
          height: 84,
          paddingTop: 8,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'TIMER',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="timer-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="protocols"
        options={{
          title: 'PROTOCOLS',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="clipboard-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'STATS',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'SETTINGS',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
