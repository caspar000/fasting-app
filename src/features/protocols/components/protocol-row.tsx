import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';
import { colors } from '@/src/core/theme/colors';
import { useColorScheme } from '@/src/hooks/use-color-scheme';

export interface ProtocolRowProps {
  title: string;
  subtitle: string;
  selected?: boolean;
  accent?: boolean;
  leadingIcon?: React.ComponentProps<typeof Ionicons>['name'];
  onPress?: () => void;
}

export function ProtocolRow({
  title,
  subtitle,
  selected = false,
  accent = false,
  leadingIcon,
  onPress,
}: ProtocolRowProps) {
  const scheme = useColorScheme();
  const theme = colors[scheme];

  const titleColor = selected || accent ? theme.accent : theme.foreground;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
      className={[
        'flex-row items-center justify-between px-4 py-3.5',
        selected ? 'bg-accent-bg' : '',
      ].join(' ')}>
      <View className="flex-row items-center gap-2">
        {leadingIcon ? <Ionicons name={leadingIcon} size={18} color={theme.accent} /> : null}
        <View className="gap-0.5">
          <Text className="font-semibold text-[16px]" style={{ color: titleColor }}>
            {title}
          </Text>
          <Text className="text-[12px]" style={{ color: theme['text-tertiary'] }}>
            {subtitle}
          </Text>
        </View>
      </View>
      {selected ? (
        <View
          className="flex-row items-center rounded-lg px-2.5 py-1"
          style={{ backgroundColor: theme['accent-bg'], gap: 4 }}>
          <Ionicons name="checkmark" size={12} color={theme['accent-deep']} />
          <Text
            className="font-semibold text-[11px]"
            style={{ color: theme['accent-deep'] }}>
            Default
          </Text>
        </View>
      ) : (
        <Ionicons name="chevron-forward" size={16} color={theme['chevron']} />
      )}
    </Pressable>
  );
}

export function ProtocolRowDivider() {
  return <View className="h-px bg-divider" />;
}
