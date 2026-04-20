import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SettingsRow } from '@/src/features/settings/components/settings-row';
import { SettingsSection } from '@/src/features/settings/components/settings-section';
import { type ThemeMode, useAppStore } from '@/src/stores/app-store';

const THEME_OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

export default function SettingsScreen() {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView contentContainerClassName="pb-8">
        <View className="px-4 pt-2 pb-4">
          <Text className="text-3xl font-bold text-foreground">Settings</Text>
        </View>

        <SettingsSection title="Appearance">
          <View className="flex-row gap-2 p-3">
            {THEME_OPTIONS.map((opt) => {
              const active = theme === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => setTheme(opt.value)}
                  className={[
                    'flex-1 items-center rounded-xl border px-3 py-2',
                    active ? 'border-accent bg-accent' : 'border-border bg-surface',
                  ].join(' ')}>
                  <Text
                    className={[
                      'text-sm font-medium',
                      active ? 'text-accent-foreground' : 'text-foreground',
                    ].join(' ')}>
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </SettingsSection>

        <SettingsSection title="About" footer="Fasting App v1.0.0">
          <SettingsRow label="Version" value="1.0.0" showChevron={false} divider={false} />
        </SettingsSection>
      </ScrollView>
    </SafeAreaView>
  );
}
