import { ScrollView, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';

import { Screen } from '../../components/common/Screen';
import { MorningBrief } from '../../components/today/MorningBrief';
import { QuickAddButton } from '../../components/today/QuickAddButton';
import { TodayHeader } from '../../components/today/TodayHeader';
import { TodayEmptyState } from '../../components/today/TodayEmptyState';
import { TodayTimeline } from '../../components/today/TodayTimeline';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { getTodayItems, type TodayItem } from '../../services/today/todayService';

export default function TodayScreen() {
  const [todayItems, setTodayItems] = useState<TodayItem[]>([]);
  const [referenceTime, setReferenceTime] = useState<number>();

  useEffect(() => {
    let active = true;
    const requestedAt = new Date();
    void getTodayItems(requestedAt).then((items) => {
      if (active) {
        setTodayItems(items);
        setReferenceTime(requestedAt.getTime());
      }
    }).catch(() => {
      if (active) setTodayItems([]);
    });

    return () => { active = false; };
  }, []);

  const alarmCount = todayItems.filter((item) => item.type === 'Alarm').length;
  const reminderCount = todayItems.filter((item) => item.type === 'Reminder').length;
  const nextItem = [...todayItems]
    .sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime())
    .find((item) => item.scheduledAt.getTime() >= (referenceTime ?? 0));

  return (
    <Screen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TodayHeader />
        {todayItems.length === 0 ? (
          <TodayEmptyState />
        ) : (
          <>
            <MorningBrief alarmCount={alarmCount} reminderCount={reminderCount} nextItem={nextItem} />
            <TodayTimeline items={todayItems} />
          </>
        )}
      </ScrollView>
      <QuickAddButton />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: 84, gap: spacing.xl },
});
