import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../constants/colors';
import { radius } from '../../constants/radius';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

export function TodayEmptyState() {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconSurface}>
        <Text style={styles.icon}>✓</Text>
      </View>
      <Text style={styles.title}>Your day is clear</Text>
      <Text style={styles.subtitle}>Nothing scheduled for today.</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add something"
        style={({ pressed }) => [styles.cta, pressed && styles.pressed]}
      >
        <Text style={styles.ctaLabel}>Add something</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderRadius: radius.xl, paddingHorizontal: spacing.xl, paddingVertical: spacing.xxl, marginTop: spacing.sm },
  iconSurface: { width: 56, height: 56, borderRadius: radius.pill, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  icon: { color: colors.primary, fontSize: 28, lineHeight: 34, fontWeight: '600' },
  title: { ...typography.h2, color: colors.text, textAlign: 'center' },
  subtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xs },
  cta: { minHeight: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, borderRadius: radius.lg, paddingHorizontal: spacing.xl, marginTop: spacing.lg },
  pressed: { opacity: 0.82 },
  ctaLabel: { ...typography.bodyMedium, color: colors.white },
});
