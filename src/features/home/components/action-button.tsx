import Ionicons from '@react-native-vector-icons/ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';

type Variant = 'start' | 'end';

export interface ActionButtonProps {
  variant: Variant;
  onPress: () => void;
}

export function ActionButton({ variant, onPress }: ActionButtonProps) {
  const isStart = variant === 'start';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={isStart ? 'Start fast' : 'End fast'}
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.92 : 1 })}>
      <View
        style={{
          width: 260,
          height: 60,
          borderRadius: 30,
          shadowColor: '#2563EB',
          shadowOpacity: 0.25,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 6 },
          elevation: 6,
        }}>
        <LinearGradient
          colors={['#3B82F6', '#1D4ED8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            flex: 1,
            borderRadius: 30,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons
            name={isStart ? 'play' : 'pause'}
            size={20}
            color="#FFFFFF"
            style={{ marginRight: 8 }}
          />
          <Text className="font-bold text-[18px] text-white">
            {isStart ? 'Start Fast' : 'End Fast'}
          </Text>
        </LinearGradient>
      </View>
    </Pressable>
  );
}
