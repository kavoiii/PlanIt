import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../../constants/colors';
import { radius } from '../../constants/radius';
import { spacing } from '../../constants/spacing';

export function QuickAddButton() {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Quick add" style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <Text style={styles.plus}>+</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { position: 'absolute', right: spacing.lg, bottom: spacing.md, width: 54, height: 54, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, shadowColor: colors.black, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 5 },
  pressed: { opacity: 0.82, transform: [{ scale: 0.97 }] },
  plus: { color: colors.white, fontSize: 32, lineHeight: 36, fontWeight: '300', marginTop: -2 },
});
