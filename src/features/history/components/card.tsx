import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  cornerRadius?: number;
}

export function Card({ children, style, cornerRadius = 16 }: CardProps) {
  return (
    <View
      className="overflow-hidden bg-surface"
      style={[
        {
          borderRadius: cornerRadius,
          shadowColor: '#000',
          shadowOpacity: 0.03,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 1 },
          elevation: 1,
        },
        style,
      ]}>
      {children}
    </View>
  );
}
