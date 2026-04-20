import { useColorScheme as useRNColorScheme } from 'react-native';
import { useAppStore } from '@/src/stores/app-store';

export function useColorScheme(): 'light' | 'dark' {
  const storeTheme = useAppStore((s) => s.theme);
  const systemScheme = useRNColorScheme();
  if (storeTheme === 'system') return systemScheme === 'dark' ? 'dark' : 'light';
  return storeTheme;
}
