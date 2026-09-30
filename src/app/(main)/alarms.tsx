import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../../constants/colors';
import { radius } from '../../constants/radius';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import { deleteAlarm, getAlarms, updateAlarmEnabled, type Alarm } from '../../services/alarms/alarmService';

const dayLabels: Record<string, string> = {
  mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun',
};

function formatAlarmTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return time;
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

function findNextUpcomingAlarm(alarms: Alarm[], now: Date): Alarm | undefined {
  const weekdayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  let nextAlarm: Alarm | undefined;
  let nextTime: number | undefined;

  alarms.forEach((alarm) => {
    const [hours, minutes] = alarm.time.split(':').map(Number);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return;

    const lastDayOffset = alarm.repeatDays.length === 0 ? 1 : 7;
    for (let dayOffset = 0; dayOffset <= lastDayOffset; dayOffset += 1) {
      const scheduledAt = new Date(
        now.getFullYear(), now.getMonth(), now.getDate() + dayOffset, hours, minutes,
      );
      if (alarm.repeatDays.length > 0
        && !alarm.repeatDays.includes(weekdayKeys[scheduledAt.getDay()])) continue;

      const scheduledTime = scheduledAt.getTime();
      if (scheduledTime > now.getTime() && (nextTime === undefined || scheduledTime < nextTime)) {
        nextTime = scheduledTime;
        nextAlarm = alarm;
      }
    }
  });

  return nextAlarm;
}

function formatRepeatDays(repeatDays: string[]): string {
  if (repeatDays.length === 0) return 'One-time';
  if (repeatDays.length === 1) {
    const day = repeatDays[0];
    const fullDay = {
      mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday',
      fri: 'Friday', sat: 'Saturday', sun: 'Sunday',
    }[day];
    return fullDay ? `Every ${fullDay}` : day;
  }
  return repeatDays.map((day) => dayLabels[day] ?? day).join(' · ');
}

export default function AlarmsScreen() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const router = useRouter();

  const refreshAlarms = useCallback(async () => {
    const data = await getAlarms();
    setAlarms(data.sort((first, second) => first.time.localeCompare(second.time)));
  }, []);

  useFocusEffect(useCallback(() => {
    void refreshAlarms().catch((error: unknown) => {
      console.warn('Unable to load alarms.', error);
    });
    return undefined;
  }, [refreshAlarms]));

  const confirmDelete = (alarm: Alarm) => {
    Alert.alert('Delete alarm?', `Delete ${alarm.label?.trim() || alarm.time}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          void deleteAlarm(alarm.id).then(refreshAlarms).catch((error: unknown) => {
            console.warn('Unable to delete alarm.', error);
            Alert.alert('Could not delete alarm', 'Please try again.');
          });
        },
      },
    ]);
  };

  const toggleAlarm = async (id: string, enabled: boolean) => {
    try {
      await updateAlarmEnabled(id, enabled);
      setAlarms((current) => current.map((alarm) => (
        alarm.id === id ? { ...alarm, enabled } : alarm
      )));
    } catch (error) {
      console.warn('Unable to update alarm state.', error);
      Alert.alert('Could not update alarm', 'Please try again.');
    }
  };

  const renderAction = (action: 'DELETE' | 'EDIT', alarm: Alarm) => (
    <Pressable
      accessibilityRole="button"
      onPress={() => {
        if (action === 'DELETE') confirmDelete(alarm);
        else router.push({ pathname: '/add-alarm', params: { alarmId: alarm.id } });
      }}
      style={[styles.swipeAction, action === 'DELETE' ? styles.deleteAction : styles.editAction]}
    >
      <Text style={styles.swipeActionText}>{action}</Text>
    </Pressable>
  );

  const openAddAlarm = () => router.push('/add-alarm');
  const enabledAlarms = alarms.filter((alarm) => alarm.enabled);
  const nextAlarm = findNextUpcomingAlarm(enabledAlarms, new Date());
  const alarmSummary = nextAlarm
    ? `${enabledAlarms.length} active \u00B7 Next at ${formatAlarmTime(nextAlarm.time)}`
    : `${enabledAlarms.length} active \u00B7 No active alarms`;

  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Profile settings"
          accessibilityHint="Profile navigation is not available yet"
          onPress={() => Alert.alert('Profile', 'Profile settings are not available yet.')}
          style={styles.headerButton}
        >
          <View style={styles.personIcon}>
            <View style={styles.personHead} />
            <View style={styles.personBody} />
          </View>
        </Pressable>
        <Text style={styles.title}>Alarms</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add alarm"
          onPress={openAddAlarm}
          style={[styles.headerButton, styles.addHeaderButton]}
        >
          <Text style={styles.addIcon}>+</Text>
        </Pressable>
      </View>

      <Text style={styles.summary}>
  {enabledAlarms.length} active ·{' '}
  {nextAlarm
    ? `Next ${formatAlarmTime(nextAlarm.time)}`
    : 'No active alarms'}
</Text>

      {alarms.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconWrap}>
            <Text style={styles.emptyIcon}>◷</Text>
          </View>
          <Text style={styles.emptyTitle}>No alarms yet</Text>
          <Text style={styles.emptyCopy}>
            Set your first alarm to stay on schedule and make the most of your day.
          </Text>
          <Pressable accessibilityRole="button" onPress={openAddAlarm} style={styles.emptyButton}>
            <Text style={styles.emptyButtonText}>+ Add Alarm</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {alarms.map((alarm) => (
            <ReanimatedSwipeable
              key={alarm.id}
              renderLeftActions={() => renderAction('DELETE', alarm)}
              renderRightActions={() => renderAction('EDIT', alarm)}
              overshootLeft={false}
              overshootRight={false}
            >
              <View style={[
                styles.alarmCard,
                alarm.id === nextAlarm?.id && styles.nextAlarmCard,
                !alarm.enabled && styles.disabledCard,
              ]}>
                <View style={styles.cardTopRow}>
                  <Text style={[styles.time, !alarm.enabled && styles.disabledText]}>
                    {formatAlarmTime(alarm.time)}
                  </Text>
                      <Switch
      accessibilityLabel={`${alarm.label?.trim() || 'Alarm'} ${alarm.enabled ? 'on' : 'off'}`}
      value={alarm.enabled}
      onValueChange={(enabled) => void toggleAlarm(alarm.id, enabled)}
      trackColor={{
        false: colors.border,
        true: colors.primary,
      }}
      thumbColor={colors.surface}
      ios_backgroundColor={colors.border}
    />
                </View>
                <Text style={[styles.label, !alarm.enabled && styles.disabledText]}>
                  {alarm.label?.trim() || 'No label'}
                </Text>
                <Text style={styles.repeatText}>{formatRepeatDays(alarm.repeatDays)}</Text>
              </View>
            </ReanimatedSwipeable>
          ))}
        </ScrollView>
      )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureRoot: { flex: 1, backgroundColor: colors.background },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  summary: {
  ...typography.caption,
  color: colors.textSecondary,
  textAlign: 'center',
  marginBottom: spacing.lg,
},
  headerButton: {
    width: spacing.xxxl,
    height: spacing.xxxl,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
  },
  title: { ...typography.h1, color: colors.text, flex: 1, textAlign: 'center' },
  personIcon: { alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  personHead: {
    width: spacing.sm,
    height: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  personBody: {
    width: spacing.md,
    height: spacing.sm,
    borderTopLeftRadius: radius.sm,
    borderTopRightRadius: radius.sm,
    backgroundColor: colors.primary,
  },
  addHeaderButton: { backgroundColor: colors.primary },
  addIcon: { ...typography.h2, color: colors.white, lineHeight: typography.h2.fontSize },
  listContent: { paddingBottom: spacing.xxxl },
  alarmCard: {
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  disabledCard: { backgroundColor: colors.background },
  nextAlarmCard: { backgroundColor: colors.primaryLight },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  time: { ...typography.h1, color: colors.text },
  label: { ...typography.bodyMedium, color: colors.text, marginTop: spacing.xs },
  repeatText: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xs },
  disabledText: { color: colors.textMuted },
  swipeAction: {
    width: spacing.xxxl * 2,
    marginBottom: spacing.md,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteAction: { backgroundColor: colors.danger },
  editAction: { backgroundColor: colors.primary },
  swipeActionText: { ...typography.caption, color: colors.white, fontWeight: '700' },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  emptyIconWrap: {
    width: spacing.xxxl * 2,
    height: spacing.xxxl * 2,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  emptyIcon: { ...typography.display, color: colors.primary },
  emptyTitle: { ...typography.h2, color: colors.text, marginBottom: spacing.sm },
  emptyCopy: { ...typography.body, color: colors.textSecondary, textAlign: 'center', marginBottom: spacing.xl },
  emptyButton: {
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
  },
  emptyButtonText: { ...typography.bodyMedium, color: colors.white },

  summaryCard: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.md,
  marginBottom: spacing.xl,
  borderRadius: radius.lg,
  backgroundColor: colors.primaryLight,
},

summaryActive: {
  ...typography.bodyMedium,
  color: colors.primaryDark,
},

summaryNext: {
  ...typography.caption,
  color: colors.textSecondary,
},
});
