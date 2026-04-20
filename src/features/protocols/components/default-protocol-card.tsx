import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';
import type { Protocol } from '@/src/core/constants/protocols';

export interface DefaultProtocolCardProps {
  protocol: Protocol;
  onPress?: () => void;
}

export function DefaultProtocolCard({ protocol, onPress }: DefaultProtocolCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Default protocol: ${protocol.label}`}
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.92 : 1 })}>
      <View
        style={{
          borderRadius: 16,
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
            borderRadius: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
          }}>
          <View style={{ gap: 4 }}>
            <Text className="font-medium text-[12px]" style={{ color: '#FFFFFFCC' }}>
              Default Protocol
            </Text>
            <Text className="font-bold text-[18px] text-white">{protocol.label}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#FFFFFFCC" />
        </LinearGradient>
      </View>
    </Pressable>
  );
}
