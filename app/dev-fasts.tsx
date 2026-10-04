import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/src/core/theme/colors';
import {
  FastListItem,
  FastListItemDivider,
} from '@/src/features/dev/components/fast-list-item';
import { FastEditorModal } from '@/src/features/dev/components/fast-editor-modal';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { useAppStore } from '@/src/stores/app-store';
import { type CompletedFast, useFastingStore } from '@/src/stores/fasting-store';

export default function DevFastsScreen() {
  const scheme = useColorScheme();
  const theme = colors[scheme];

  const developerMode = useAppStore((s) => s.developerMode);
  const completedFasts = useFastingStore((s) => s.completedFasts);
  const protocolId = useFastingStore((s) => s.protocolId);
  const addCompletedFast = useFastingStore((s) => s.addCompletedFast);
  const updateCompletedFast = useFastingStore((s) => s.updateCompletedFast);
  const deleteFast = useFastingStore((s) => s.deleteFast);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<CompletedFast | null>(null);
  // Bumped on every open so the editor remounts and re-reads its initial values.
  const [editorKey, setEditorKey] = useState(0);

  useEffect(() => {
    if (!developerMode) router.back();
  }, [developerMode]);

  const sorted = useMemo(
    () => [...completedFasts].sort((a, b) => b.endedAt - a.endedAt),
    [completedFasts],
  );

  const openAdd = () => {
    setEditing(null);
    setEditorKey((k) => k + 1);
    setEditorOpen(true);
  };

  const openEdit = (fast: CompletedFast) => {
    setEditing(fast);
    setEditorKey((k) => k + 1);
    setEditorOpen(true);
  };

  const close = () => {
    setEditorOpen(false);
    setEditing(null);
  };

  const confirmDelete = (id: string) => {
    Alert.alert('Delete fast?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteFast(id),
      },
    ]);
  };

  const handleSave = (fast: Omit<CompletedFast, 'id'>) => {
    if (editing) {
      updateCompletedFast(editing.id, fast);
    } else {
      addCompletedFast(fast);
    }
    close();
  };

  const handleDeleteFromEditor = (id: string) => {
    Alert.alert('Delete fast?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteFast(id);
          close();
        },
      },
    ]);
  };

  if (!developerMode) return null;

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Manage fasts',
          headerBackTitle: 'Settings',
          headerRight: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Add fast"
              onPress={openAdd}
              style={({ pressed }) => ({
                paddingHorizontal: 4,
                paddingVertical: 4,
                opacity: pressed ? 0.85 : 1,
              })}>
              <Ionicons name="add" size={24} color="#111111" />
            </Pressable>
          ),
        }}
      />
      <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
        <View
          className="border-b border-border px-4 py-3"
          style={{ backgroundColor: theme.surface }}>
          <Text
            className="font-semibold text-[13px] uppercase"
            style={{ color: theme['text-tertiary'], letterSpacing: 1 }}>
            {sorted.length} {sorted.length === 1 ? 'fast' : 'fasts'}
          </Text>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
          {sorted.length === 0 ? (
            <View className="items-center px-6 pt-16">
              <Ionicons name="server-outline" size={32} color={theme['text-tertiary']} />
              <Text
                className="mt-3 font-semibold text-[15px]"
                style={{ color: theme.foreground }}>
                No fasts yet
              </Text>
              <Text
                className="mt-1 text-center text-[13px]"
                style={{ color: theme['text-tertiary'] }}>
                Tap Add fast to insert one directly into the store.
              </Text>
            </View>
          ) : (
            <View className="bg-surface">
              {sorted.map((fast, i) => (
                <View key={fast.id}>
                  {i > 0 ? <FastListItemDivider /> : null}
                  <FastListItem
                    fast={fast}
                    onPress={() => openEdit(fast)}
                    onDelete={() => confirmDelete(fast.id)}
                  />
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        <FastEditorModal
          key={editorKey}
          visible={editorOpen}
          fast={editing}
          defaultProtocolId={protocolId}
          onClose={close}
          onSave={handleSave}
          onDelete={handleDeleteFromEditor}
        />
      </SafeAreaView>
    </>
  );
}
