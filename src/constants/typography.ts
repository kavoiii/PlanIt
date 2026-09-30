import type { TextStyle } from 'react-native';

type Typography = Record<'display' | 'h1' | 'h2' | 'body' | 'bodyMedium' | 'caption', TextStyle>;

export const typography: Typography = {
  display: { fontSize: 36, lineHeight: 42, fontWeight: '700' }, h1: { fontSize: 28, lineHeight: 34, fontWeight: '700' },
  h2: { fontSize: 22, lineHeight: 28, fontWeight: '600' }, body: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  bodyMedium: { fontSize: 16, lineHeight: 24, fontWeight: '500' }, caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
};
