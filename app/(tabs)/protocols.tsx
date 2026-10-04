import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  buildCustomProtocol,
  CUSTOM_PROTOCOL_ID,
  getProtocol,
  getProtocolsByCategory,
  type Protocol,
} from '@/src/core/constants/protocols';
import { colors } from '@/src/core/theme/colors';
import { CustomProtocolModal } from '@/src/features/protocols/components/custom-protocol-modal';
import { DefaultProtocolCard } from '@/src/features/protocols/components/default-protocol-card';
import {
  ProtocolRow,
  ProtocolRowDivider,
} from '@/src/features/protocols/components/protocol-row';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { useFastingStore } from '@/src/stores/fasting-store';

const DEFAULT_NEW_CUSTOM_HOURS = 16;

export default function ProtocolsScreen() {
  const scheme = useColorScheme();
  const theme = colors[scheme];
  const protocolId = useFastingStore((s) => s.protocolId);
  const setProtocol = useFastingStore((s) => s.setProtocol);
  const customFastHours = useFastingStore((s) => s.customProtocolFastHours);
  const setCustomProtocol = useFastingStore((s) => s.setCustomProtocol);

  const [customModalOpen, setCustomModalOpen] = useState(false);

  const defaultProtocol = getProtocol(protocolId, customFastHours);
  const standardProtocols = getProtocolsByCategory('standard');
  const extendedProtocols = getProtocolsByCategory('extended');
  const customProtocol =
    customFastHours != null ? buildCustomProtocol(customFastHours) : null;

  const selectProtocol = (p: Protocol) => {
    setProtocol(p.id);
    router.navigate('/');
  };

  const openCustomModal = () => setCustomModalOpen(true);
  const closeCustomModal = () => setCustomModalOpen(false);

  const saveCustomProtocol = (fastHours: number) => {
    setCustomProtocol(fastHours);
    setProtocol(CUSTOM_PROTOCOL_ID);
    setCustomModalOpen(false);
    router.navigate('/');
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="items-center pb-2 pt-1">
        <Text className="font-bold text-[20px] text-foreground">Fasting Protocols</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32, gap: 20 }}>
        <DefaultProtocolCard
          protocol={defaultProtocol}
          onPress={
            protocolId === CUSTOM_PROTOCOL_ID && customProtocol ? openCustomModal : undefined
          }
        />

        <View style={{ gap: 8 }}>
          <Text
            className="px-1 font-semibold text-[12px] uppercase"
            style={{ color: theme['text-tertiary'], letterSpacing: 1 }}>
            Standard
          </Text>
          <ListCard>
            {standardProtocols.map((p, i) => (
              <View key={p.id}>
                {i > 0 ? <ProtocolRowDivider /> : null}
                <ProtocolRow
                  title={p.shortLabel}
                  subtitle={p.description}
                  selected={p.id === protocolId}
                  onPress={() => selectProtocol(p)}
                />
              </View>
            ))}
          </ListCard>
        </View>

        <View style={{ gap: 8 }}>
          <Text
            className="px-1 font-semibold text-[12px] uppercase"
            style={{ color: theme['text-tertiary'], letterSpacing: 1 }}>
            Extended & Custom
          </Text>
          <ListCard>
            {extendedProtocols.map((p, i) => (
              <View key={p.id}>
                {i > 0 ? <ProtocolRowDivider /> : null}
                <ProtocolRow
                  title={p.shortLabel}
                  subtitle={p.description}
                  selected={p.id === protocolId}
                  onPress={() => selectProtocol(p)}
                />
              </View>
            ))}
            <ProtocolRowDivider />
            {customProtocol ? (
              <ProtocolRow
                title={customProtocol.shortLabel}
                subtitle={customProtocol.description}
                selected={protocolId === CUSTOM_PROTOCOL_ID}
                onPress={openCustomModal}
              />
            ) : (
              <ProtocolRow
                title="Custom Protocol"
                subtitle="Create your own fasting window"
                accent
                leadingIcon="add"
                onPress={openCustomModal}
              />
            )}
          </ListCard>
        </View>
      </ScrollView>

      <CustomProtocolModal
        visible={customModalOpen}
        initialFastHours={customFastHours ?? DEFAULT_NEW_CUSTOM_HOURS}
        onClose={closeCustomModal}
        onSave={saveCustomProtocol}
      />
    </SafeAreaView>
  );
}

function ListCard({ children }: { children: React.ReactNode }) {
  return (
    <View
      className="overflow-hidden rounded-card bg-surface"
      style={{
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 1 },
        elevation: 1,
      }}>
      {children}
    </View>
  );
}
