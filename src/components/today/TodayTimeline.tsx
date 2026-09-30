import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import type { TodayItem } from '../../services/today/todayService';
import { TimelineItem } from './TimelineItem';

export function TodayTimeline({ items }: { items: TodayItem[] }) {
  const sorted = [...items].sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime());
  return (
    <View>
      <View style={styles.heading}>
        <Text style={styles.title}>Today</Text>
        <Text style={styles.count}>{sorted.length} scheduled</Text>
      </View>
      {sorted.length > 0 ? sorted.map((item) => <TimelineItem key={item.id} item={item} />) : (
        <Text style={styles.empty}>Nothing scheduled for today. Enjoy the breathing room.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: spacing.sm },
  title: { ...typography.h2, color: colors.text },
  count: { ...typography.caption, color: colors.textMuted },
  empty: { ...typography.body, color: colors.textSecondary, paddingVertical: spacing.xl },
});
