import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../constants/colors';
import { radius } from '../../constants/radius';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import type { TodayItem } from '../../services/today/todayService';

const semantic: Record<TodayItem['type'], { color: string; icon: string }> = {
  Alarm: { color: colors.alarm, icon: '◷' },
  Reminder: { color: colors.reminder, icon: '♢' },
  Task: { color: colors.task, icon: '✓' },
};

export function TimelineItem({ item }: { item: TodayItem }) {
  const style = semantic[item.type];
  const time = item.scheduledAt.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return (
    <View style={styles.row}>
      <Text style={styles.time}>{time}</Text>
      <View style={[styles.marker, { backgroundColor: style.color }]} />
      <View style={[styles.card, { backgroundColor: `${style.color}14` }]}>
        <View style={[styles.iconWrap, { backgroundColor: `${style.color}20` }]}>
          <Text style={[styles.icon, { color: style.color }]}>{style.icon}</Text>
        </View>
        <View style={styles.copy}>
          <Text numberOfLines={1} style={styles.title}>{item.title}</Text>
          <Text numberOfLines={1} style={styles.meta}>{item.type}{item.detail ? `  ·  ${item.detail}` : ''}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 68, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  time: { width: 58, ...typography.caption, color: colors.textSecondary, fontWeight: '500' },
  marker: { width: 9, height: 9, borderRadius: radius.pill },
  card: { flex: 1, minHeight: 60, flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.lg },
  iconWrap: { width: 38, height: 38, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 22, lineHeight: 25, fontWeight: '700' },
  copy: { flex: 1 },
  title: { ...typography.bodyMedium, color: colors.text, fontSize: 15 },
  meta: { ...typography.caption, color: colors.textSecondary, marginTop: 1 },
});
