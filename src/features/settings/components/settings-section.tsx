import { memo } from 'react';
import { Text, View } from 'react-native';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
  footer?: string;
}

export const SettingsSection = memo(function SettingsSection({
  title,
  children,
  footer,
}: SettingsSectionProps) {
  return (
    <View className="gap-3 px-4 py-4">
      <Text className="pl-1 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
        {title}
      </Text>
      <View className="overflow-hidden rounded-2xl border border-border bg-surface-elevated">
        {children}
      </View>
      {footer ? (
        <Text className="px-2 text-center text-xs text-text-tertiary">{footer}</Text>
      ) : null}
    </View>
  );
});
