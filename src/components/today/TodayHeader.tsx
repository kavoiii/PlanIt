import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../constants/colors';
import { radius } from '../../constants/radius';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

function getGreeting(hour: number) {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function TodayHeader() {
  const now = useMemo(() => new Date(), []);
  const greeting = getGreeting(now.getHours());
  const date = now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <View style={styles.row}>
      <View style={styles.heading}>
        <Text style={styles.greeting}>{greeting}</Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel="Notifications" style={styles.action}>
        <View style={styles.bell}>
          <View style={styles.bellTop} />
          <View style={styles.bellBody} />
          <View style={styles.bellBase} />
          <View style={styles.clapper} />
        </View>
        <View style={styles.notificationDot} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  heading: { flex: 1 },
  greeting: { ...typography.h1, color: colors.text, fontSize: 27, lineHeight: 33 },
  date: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
  action: { width: 44, height: 44, borderRadius: radius.pill, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3 },
  bell: { height: 23, alignItems: 'center', justifyContent: 'flex-end' },
  bellTop: { width: 3, height: 3, borderTopLeftRadius: radius.pill, borderTopRightRadius: radius.pill, backgroundColor: colors.textSecondary },
  bellBody: { width: 15, height: 13, borderWidth: 1.8, borderColor: colors.textSecondary, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderBottomLeftRadius: 3, borderBottomRightRadius: 3 },
  bellBase: { width: 19, height: 2, borderRadius: radius.pill, backgroundColor: colors.textSecondary, marginTop: -1 },
  clapper: { width: 4, height: 3, borderBottomLeftRadius: radius.pill, borderBottomRightRadius: radius.pill, backgroundColor: colors.textSecondary, marginTop: 1 },
  notificationDot: { width: 6, height: 6, borderRadius: radius.pill, backgroundColor: colors.primary, alignSelf: 'flex-start', marginTop: 9 },
});
