import Ionicons from '@react-native-vector-icons/ionicons';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { Modal, Platform, Pressable, Text, View } from 'react-native';
import { formatTimeOfDay } from '@/src/core/lib/time';
import { colors } from '@/src/core/theme/colors';
import { useColorScheme } from '@/src/hooks/use-color-scheme';

const HOUR_MS = 3_600_000;
const DAY_MS = 24 * HOUR_MS;

export interface AdjustStartModalProps {
  visible: boolean;
  startedAt: number;
  onClose: () => void;
  onConfirm: (newStartedAt: number) => void;
}

export function AdjustStartModal({
  visible,
  startedAt,
  onClose,
  onConfirm,
}: AdjustStartModalProps) {
  const scheme = useColorScheme();
  const theme = colors[scheme];
  const [pickedHour, setPickedHour] = useState(() => new Date(startedAt).getHours());
  const [pickedMinute, setPickedMinute] = useState(() => new Date(startedAt).getMinutes());

  const [wasVisible, setWasVisible] = useState(visible);
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) {
      const d = new Date(startedAt);
      setPickedHour(d.getHours());
      setPickedMinute(d.getMinutes());
    }
  }

  const newStartedAt = useMemo(
    () => resolvePastTimestamp(pickedHour, pickedMinute),
    [pickedHour, pickedMinute],
  );
  const newStartedDate = useMemo(() => new Date(newStartedAt), [newStartedAt]);
  const formattedTime = formatTimeOfDay(newStartedDate);

  const pickerValue = useMemo(() => {
    const d = new Date();
    d.setHours(pickedHour, pickedMinute, 0, 0);
    return d;
  }, [pickedHour, pickedMinute]);

  const handlePickerChange = (_event: DateTimePickerEvent, date?: Date) => {
    if (!date) return;
    setPickedHour(date.getHours());
    setPickedMinute(date.getMinutes());
  };

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
            <Text className="font-bold text-[17px] text-foreground">Adjust start time</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              onPress={onClose}
              className="h-8 w-8 items-center justify-center rounded-full bg-divider">
              <Ionicons name="close" size={16} color={theme['text-secondary']} />
            </Pressable>
          </View>

          <View className="items-center">
            <DateTimePicker
              value={pickerValue}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handlePickerChange}
              themeVariant={scheme}
              style={{ width: '100%', height: 180 }}
            />
          </View>

          <View className="flex-row items-center justify-center" style={{ gap: 6, paddingVertical: 4 }}>
            <Ionicons name="time-outline" size={16} color={theme['text-secondary']} />
            <Text className="font-medium text-[13px] text-text-secondary">
              Fast will be recalculated from {formattedTime}
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Update start to ${formattedTime}`}
            onPress={() => onConfirm(newStartedAt)}
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
                <Text className="font-bold text-[17px] text-white">
                  Update to {formattedTime}
                </Text>
              </LinearGradient>
            </View>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function resolvePastTimestamp(hour: number, minute: number): number {
  const now = Date.now();
  const today = new Date();
  today.setHours(hour, minute, 0, 0);
  let candidate = today.getTime();
  if (candidate > now) candidate -= DAY_MS;
  if (candidate > now) candidate = now;
  return candidate;
}
