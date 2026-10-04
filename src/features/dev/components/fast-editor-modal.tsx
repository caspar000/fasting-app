import Ionicons from '@react-native-vector-icons/ionicons';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useMemo, useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { PROTOCOLS } from '@/src/core/constants/protocols';
import { formatDurationHoursMinutes } from '@/src/core/lib/time';
import { colors } from '@/src/core/theme/colors';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import type { CompletedFast } from '@/src/stores/fasting-store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface FastEditorModalProps {
  visible: boolean;
  fast: CompletedFast | null;
  defaultProtocolId: string;
  onClose: () => void;
  onSave: (fast: Omit<CompletedFast, 'id'>) => void;
  onDelete?: (id: string) => void;
}

const HOUR_MS = 3_600_000;

export function FastEditorModal({
  visible,
  fast,
  defaultProtocolId,
  onClose,
  onSave,
  onDelete,
}: FastEditorModalProps) {
  const scheme = useColorScheme();
  const theme = colors[scheme];
  const insets = useSafeAreaInsets();

  const [startedAt, setStartedAt] = useState<number>(() => fast?.startedAt ?? Date.now() - 16 * HOUR_MS);
  const [endedAt, setEndedAt] = useState<number>(() => fast?.endedAt ?? Date.now());
  const [protocolId, setProtocolId] = useState<string>(() => fast?.protocolId ?? defaultProtocolId);

  const durationMs = Math.max(0, endedAt - startedAt);
  const durationLabel = formatDurationHoursMinutes(durationMs);
  const invalid = endedAt <= startedAt;
  const bottomInset = Math.max(insets.bottom, 16);
  const showEditActions = Boolean(fast && onDelete);

  const title = fast ? 'Edit fast' : 'Add fast';

  const handleSave = () => {
    if (invalid) return;
    onSave({ startedAt, endedAt, protocolId });
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
            paddingHorizontal: 20,
            paddingBottom: Math.max(insets.bottom, 20),
            gap: 16,
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowRadius: 24,
            shadowOffset: { width: 0, height: -4 },
            maxHeight: '90%',
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
            <Text className="font-bold text-[17px] text-foreground">{title}</Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              onPress={onClose}
              className="h-8 w-8 items-center justify-center rounded-full bg-divider">
              <Ionicons name="close" size={16} color={theme['text-secondary']} />
            </Pressable>
          </View>

          <View style={{ flexShrink: 1, minHeight: 0 }}>
            <ScrollView
              style={{ minHeight: 0 }}
              contentContainerStyle={{ gap: 16, paddingBottom: bottomInset }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              <DateTimeField label="Start" value={startedAt} onChange={setStartedAt} />
              <DateTimeField label="End" value={endedAt} onChange={setEndedAt} />

              <View
                className="flex-row items-center justify-between rounded-card px-4 py-3"
                style={{ backgroundColor: theme['segment-bg'] }}>
                <Text className="font-medium text-[13px] text-text-secondary">Duration</Text>
                <Text
                  className="font-semibold text-[15px]"
                  style={{ color: invalid ? theme.destructive : theme.foreground }}>
                  {invalid ? 'End must be after start' : durationLabel}
                </Text>
              </View>

              <View style={{ gap: 8 }}>
                <Text
                  className="px-1 font-semibold text-[12px] uppercase"
                  style={{ color: theme['text-tertiary'], letterSpacing: 1 }}>
                  Protocol
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 8, paddingRight: 8 }}>
                  {PROTOCOLS.map((p) => {
                    const selected = p.id === protocolId;
                    return (
                      <Pressable
                        key={p.id}
                        onPress={() => setProtocolId(p.id)}
                        className="rounded-full px-3 py-2"
                        style={{
                          backgroundColor: selected ? theme.accent : theme['segment-bg'],
                        }}>
                        <Text
                          className="font-semibold text-[13px]"
                          style={{ color: selected ? '#FFFFFF' : theme.foreground }}>
                          {p.shortLabel}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>

              {showEditActions ? (
                <View style={{ gap: 10, paddingTop: 4 }}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Delete fast"
                    onPress={() => onDelete?.(fast!.id)}
                    className="flex-row items-center justify-center rounded-card px-4 py-3"
                    style={{
                      backgroundColor: `${theme.destructive}1A`,
                      width: '100%',
                      gap: 6,
                    }}>
                    <Ionicons name="trash-outline" size={16} color={theme.destructive} />
                    <Text className="font-semibold text-[15px]" style={{ color: theme.destructive }}>
                      Delete
                    </Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Save changes"
                    onPress={handleSave}
                    disabled={invalid}
                    className="flex-row items-center justify-center rounded-card px-4 py-3"
                    style={{
                      backgroundColor: invalid ? '#93C5FD' : theme.accent,
                      width: '100%',
                      gap: 6,
                    }}>
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    <Text className="font-semibold text-[15px] text-white">Save changes</Text>
                  </Pressable>
                </View>
              ) : (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Save fast"
                  onPress={handleSave}
                  disabled={invalid}
                  className="flex-row items-center justify-center rounded-card px-4 py-3"
                  style={{
                    backgroundColor: invalid ? '#93C5FD' : theme.accent,
                    width: '100%',
                    gap: 6,
                  }}>
                  <Ionicons name="add" size={16} color="#FFFFFF" />
                  <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '700' }}>
                    Save fast
                  </Text>
                </Pressable>
              )}
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function DateTimeField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (next: number) => void;
}) {
  const scheme = useColorScheme();
  const theme = colors[scheme];

  const date = useMemo(() => new Date(value), [value]);

  return (
    <View style={{ gap: 8 }}>
      <Text
        className="px-1 font-semibold text-[12px] uppercase"
        style={{ color: theme['text-tertiary'], letterSpacing: 1 }}>
        {label}
      </Text>
      {Platform.OS === 'ios' ? (
        <IOSDateTime value={date} onChange={(d) => onChange(d.getTime())} />
      ) : (
        <AndroidDateTime value={date} onChange={(d) => onChange(d.getTime())} />
      )}
    </View>
  );
}

function IOSDateTime({
  value,
  onChange,
}: {
  value: Date;
  onChange: (d: Date) => void;
}) {
  const scheme = useColorScheme();
  const handle = (_e: DateTimePickerEvent, d?: Date) => {
    if (d) onChange(d);
  };
  return (
    <View className="flex-row items-center justify-between" style={{ gap: 8, paddingHorizontal: 4 }}>
      <DateTimePicker
        value={value}
        mode="date"
        display="compact"
        themeVariant={scheme}
        onChange={handle}
      />
      <DateTimePicker
        value={value}
        mode="time"
        display="compact"
        themeVariant={scheme}
        onChange={handle}
      />
    </View>
  );
}

function AndroidDateTime({
  value,
  onChange,
}: {
  value: Date;
  onChange: (d: Date) => void;
}) {
  const scheme = useColorScheme();
  const theme = colors[scheme];
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const dateLabel = value.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const timeLabel = value.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

  return (
    <View className="flex-row" style={{ gap: 8 }}>
      <Pressable
        onPress={() => setShowDate(true)}
        className="rounded-card px-3 py-3"
        style={{ backgroundColor: theme['segment-bg'], flex: 2 }}>
        <Text className="font-semibold text-[14px]" style={{ color: theme.foreground }}>
          {dateLabel}
        </Text>
      </Pressable>
      <Pressable
        onPress={() => setShowTime(true)}
        className="rounded-card px-3 py-3"
        style={{ backgroundColor: theme['segment-bg'], flex: 1 }}>
        <Text className="font-semibold text-[14px]" style={{ color: theme.foreground }}>
          {timeLabel}
        </Text>
      </Pressable>
      {showDate ? (
        <DateTimePicker
          value={value}
          mode="date"
          onChange={(_e, d) => {
            setShowDate(false);
            if (d) {
              const next = new Date(value);
              next.setFullYear(d.getFullYear(), d.getMonth(), d.getDate());
              onChange(next);
            }
          }}
        />
      ) : null}
      {showTime ? (
        <DateTimePicker
          value={value}
          mode="time"
          onChange={(_e, d) => {
            setShowTime(false);
            if (d) {
              const next = new Date(value);
              next.setHours(d.getHours(), d.getMinutes(), 0, 0);
              onChange(next);
            }
          }}
        />
      ) : null}
    </View>
  );
}
