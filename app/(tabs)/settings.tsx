import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SettingsRow } from '@/src/features/settings/components/settings-row';
import { SettingsSection } from '@/src/features/settings/components/settings-section';
import { type ThemeMode, useAppStore } from '@/src/stores/app-store';

const THEME_OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

const APP_VERSION = Constants.expoConfig?.version ?? '';

const UNLOCK_TAPS = 10;
const TAP_RESET_MS = 2000;

export default function SettingsScreen() {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const developerMode = useAppStore((s) => s.developerMode);
  const setDeveloperMode = useAppStore((s) => s.setDeveloperMode);
  const timerDebugSlider = useAppStore((s) => s.timerDebugSlider);
  const setTimerDebugSlider = useAppStore((s) => s.setTimerDebugSlider);

  const [unlockHint, setUnlockHint] = useState<string | null>(null);
  const tapCount = useRef(0);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleVersionTap = () => {
    if (developerMode) return;
    tapCount.current += 1;
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => {
      tapCount.current = 0;
      setUnlockHint(null);
    }, TAP_RESET_MS);

    const remaining = UNLOCK_TAPS - tapCount.current;
    if (remaining <= 0) {
      tapCount.current = 0;
      if (resetTimer.current) clearTimeout(resetTimer.current);
      setDeveloperMode(true);
      setUnlockHint('Developer mode enabled');
      setTimeout(() => setUnlockHint(null), 2500);
    } else if (remaining <= 3) {
      setUnlockHint(`${remaining} tap${remaining === 1 ? '' : 's'} to developer mode`);
    }
  };

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

        <SettingsSection title="About" footer={unlockHint ?? `Fasting App v${APP_VERSION}`}>
          <SettingsRow
            label="Version"
            value={APP_VERSION}
            onPress={handleVersionTap}
            showChevron={false}
            divider={false}
          />
        </SettingsSection>

        {developerMode ? (
          <SettingsSection
            title="Developer"
            footer="Internal tools. Tap Disable to hide this section.">
            <SettingsRow
              label="Timer debug slider"
              divider
              rightElement={
                <Switch
                  value={timerDebugSlider}
                  onValueChange={setTimerDebugSlider}
                  accessibilityLabel="Toggle timer debug slider"
                />
              }
              showChevron={false}
            />
            <SettingsRow
              label="Manage fasts"
              icon="list-outline"
              onPress={() => router.navigate('/dev-fasts')}
              divider
            />
            <SettingsRow
              label="Disable developer mode"
              destructive
              onPress={() => setDeveloperMode(false)}
              showChevron={false}
              divider={false}
            />
          </SettingsSection>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
