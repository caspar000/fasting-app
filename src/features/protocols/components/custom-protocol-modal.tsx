import Ionicons from '@expo/vector-icons/Ionicons';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { colors } from '@/src/core/theme/colors';
import { useColorScheme } from '@/src/hooks/use-color-scheme';

const MIN_HOURS = 1;
const MAX_HOURS = 72;
const HOURS_RANGE = Array.from(
  { length: MAX_HOURS - MIN_HOURS + 1 },
  (_, i) => MIN_HOURS + i,
);

export interface CustomProtocolModalProps {
  visible: boolean;
  initialFastHours: number;
  onClose: () => void;
  onSave: (fastHours: number) => void;
}

export function CustomProtocolModal({
  visible,
  initialFastHours,
  onClose,
  onSave,
}: CustomProtocolModalProps) {
  const scheme = useColorScheme();
  const theme = colors[scheme];

  const [hours, setHours] = useState(() => clampHours(initialFastHours));

  useEffect(() => {
    if (visible) setHours(clampHours(initialFastHours));
  }, [visible, initialFastHours]);

  const summary = useMemo(() => {
    if (hours < 24) return `${hours}h fast · ${24 - hours}h eat · 24h cycle`;
    return `${hours}h fast`;
  }, [hours]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}>
      <View className="flex-1 justify-end" style={{ backgroundColor: '#00000050' }}>
        <Pressable className="flex-1" onPress={onClose} accessibilityLabel="Dismiss" />
        <View
          style={{
            backgroundColor: theme.surface,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            paddingTop: 12,
            paddingHorizontal: 24,
            paddingBottom: 32,
            gap: 20,
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowRadius: 24,
            shadowOffset: { width: 0, height: -4 },
          }}>
          <View className="items-center">
            <View
              style={{
                width: 36,
                height: 4,
                borderRadius: 2,
                backgroundColor: theme.border,
              }}
            />
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="font-bold text-[17px] text-foreground">Custom Protocol</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              onPress={onClose}
              className="h-8 w-8 items-center justify-center rounded-full bg-divider">
              <Ionicons name="close" size={16} color={theme['text-secondary']} />
            </Pressable>
          </View>

          <View className="items-center">
            <Picker
              selectedValue={hours}
              onValueChange={(v) => setHours(v)}
              itemStyle={{
                fontSize: 22,
                color: theme.foreground,
                fontFamily: 'Inter_600SemiBold',
              }}
              style={{ width: '100%', height: 180 }}>
              {HOURS_RANGE.map((h) => (
                <Picker.Item
                  key={h}
                  label={`${h}  hours`}
                  value={h}
                  color={theme.foreground}
                />
              ))}
            </Picker>
          </View>

          <View
            className="flex-row items-center justify-center"
            style={{ gap: 6, paddingVertical: 4 }}>
            <Ionicons name="timer-outline" size={16} color={theme['text-secondary']} />
            <Text className="font-medium text-[13px] text-text-secondary">{summary}</Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Save ${hours} hour protocol`}
            onPress={() => onSave(hours)}
            style={({ pressed }) => ({ opacity: pressed ? 0.92 : 1 })}>
            <View
              style={{
                borderRadius: 28,
                shadowColor: '#2563EB',
                shadowOpacity: 0.19,
                shadowRadius: 16,
                shadowOffset: { width: 0, height: 4 },
                elevation: 4,
              }}>
              <LinearGradient
                colors={['#3B82F6', '#1D4ED8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{
                  height: 56,
                  borderRadius: 28,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}>
                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                <Text className="font-bold text-[17px] text-white">Save Protocol</Text>
              </LinearGradient>
            </View>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function clampHours(h: number): number {
  if (!Number.isFinite(h)) return 16;
  return Math.max(MIN_HOURS, Math.min(MAX_HOURS, Math.round(h)));
}
