import type { PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { colors } from '../../constants/colors';

type ScreenProps = PropsWithChildren<{
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
}>;

export function Screen({ children, edges, style }: ScreenProps) {
  return (
    <SafeAreaView edges={edges} style={[styles.screen, style]}>
      {children}
    </SafeAreaView>
  );
}

const styles = {
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
};
