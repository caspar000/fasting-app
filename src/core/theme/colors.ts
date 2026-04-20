export const colors = {
  light: {
    background: '#FFFFFF',
    foreground: '#0A0A0A',
    surface: '#F5F5F5',
    'surface-elevated': '#FAFAFA',
    border: '#E5E5E5',
    muted: '#F5F5F5',
    'muted-foreground': '#737373',
    accent: '#000000',
    'accent-foreground': '#FFFFFF',
    destructive: '#DC2626',
  },
  dark: {
    background: '#0A0A0A',
    foreground: '#FAFAFA',
    surface: '#171717',
    'surface-elevated': '#262626',
    border: '#404040',
    muted: '#262626',
    'muted-foreground': '#A3A3A3',
    accent: '#FAFAFA',
    'accent-foreground': '#0A0A0A',
    destructive: '#EF4444',
  },
} as const;

export type ColorScheme = keyof typeof colors;
export type ColorToken = keyof (typeof colors)['light'];
