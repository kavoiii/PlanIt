import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../constants/colors';
import { radius } from '../../constants/radius';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import type { TodayItem } from '../../services/today/todayService';

type MorningBriefProps = {
  alarmCount: number;
  reminderCount: number;
  nextItem?: TodayItem;
};

export function MorningBrief({ alarmCount, reminderCount, nextItem }: MorningBriefProps) {
  const nextTime = nextItem?.scheduledAt.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>MORNING BRIEF</Text>
      <Text style={styles.title}>Your day, at a glance</Text>
      <Text style={styles.subtitle}>A little plan goes a long way.</Text>
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={[styles.statCount, { color: colors.alarm }]}>{alarmCount}</Text>
          <Text style={styles.statLabel}>Alarms</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={[styles.statCount, { color: colors.reminder }]}>{reminderCount}</Text>
          <Text style={styles.statLabel}>Reminders</Text>
        </View>
      </View>
      <View style={styles.next}>
        <View style={styles.nextCopy}>
          <Text style={styles.nextEyebrow}>NEXT UP</Text>
          <Text numberOfLines={1} style={styles.nextTitle}>{nextItem?.title ?? 'Nothing scheduled yet'}</Text>
          <Text style={styles.nextTime}>{nextItem ? `${nextTime}  ·  ${nextItem.type}` : 'Enjoy a little open time'}</Text>
        </View>
        <View style={styles.nextMark}><Text style={styles.chevron}>›</Text></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.primaryLight, borderRadius: radius.xl, padding: spacing.lg },
  eyebrow: { ...typography.caption, color: colors.primary, fontWeight: '600', letterSpacing: 0.8 },
  title: { ...typography.h2, color: colors.text, marginTop: spacing.xs },
  subtitle: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  stats: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md, marginBottom: spacing.md },
  stat: { flex: 1, flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm },
  statCount: { fontSize: 24, lineHeight: 30, fontWeight: '700' },
  statLabel: { ...typography.caption, color: colors.textSecondary },
  divider: { width: 1, height: 27, backgroundColor: `${colors.primary}26`, marginHorizontal: spacing.md },
  next: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, gap: spacing.sm },
  nextCopy: { flex: 1 },
  nextEyebrow: { ...typography.caption, color: colors.textMuted, fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
  nextTitle: { ...typography.bodyMedium, color: colors.text, marginTop: 2 },
  nextTime: { ...typography.caption, color: colors.textSecondary, marginTop: 1 },
  nextMark: { width: 32, height: 32, borderRadius: radius.pill, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  chevron: { color: colors.primary, fontSize: 24, lineHeight: 27, marginTop: -2 },
});
