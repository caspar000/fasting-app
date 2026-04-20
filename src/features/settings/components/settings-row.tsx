import Ionicons from '@expo/vector-icons/Ionicons';
import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors } from '@/src/core/theme/colors';
import { useColorScheme } from '@/src/hooks/use-color-scheme';

interface SettingsRowProps {
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value?: string;
  onPress?: () => void;
  disabled?: boolean;
  rightElement?: React.ReactNode;
  destructive?: boolean;
  showChevron?: boolean;
  divider?: boolean;
}

export const SettingsRow = memo(function SettingsRow({
  icon,
  label,
  value,
  onPress,
  disabled,
  rightElement,
  destructive,
  showChevron = true,
  divider = true,
}: SettingsRowProps) {
  const scheme = useColorScheme();
  const iconColor = destructive ? colors[scheme].destructive : colors[scheme].foreground;
  const mutedColor = colors[scheme]['muted-foreground'];

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      accessibilityLabel={label}
      accessibilityRole="button"
      disabled={disabled}
      className={[
        'flex-row items-center px-4 py-3 min-h-[52px]',
        divider ? 'border-b border-border' : '',
        disabled ? 'opacity-40' : '',
      ].join(' ')}>
      {icon ? <Ionicons name={icon} size={20} color={iconColor} style={{ marginRight: 12 }} /> : null}
      <Text
        numberOfLines={1}
        className={[
          'flex-1 text-base',
          destructive ? 'text-destructive' : 'text-foreground',
        ].join(' ')}>
        {label}
      </Text>
      <View className="ml-2 flex-row items-center gap-1.5">
        {rightElement}
        {value ? (
          <Text numberOfLines={1} className="text-sm text-muted-foreground">
            {value}
          </Text>
        ) : null}
        {onPress && showChevron && !rightElement ? (
          <Ionicons name="chevron-forward" size={18} color={mutedColor} />
        ) : null}
      </View>
    </Pressable>
  );
});
