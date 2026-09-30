import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

export default function PlannerScreen() {
  return <View style={styles.container}><Text style={styles.title}>Planner</Text><Text style={styles.description}>Plan your schedule here.</Text></View>;
}

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: colors.background, padding: spacing.xl, justifyContent: 'center' }, title: { ...typography.h1, color: colors.text }, description: { ...typography.body, color: colors.textSecondary, marginTop: spacing.sm } });
