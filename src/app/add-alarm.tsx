import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DatePicker, Host } from '@expo/ui/swift-ui';
import { datePickerStyle } from '@expo/ui/swift-ui/modifiers';

import {
  createAlarm,
  getAlarms,
  updateAlarm,
  type Alarm,
} from '../services/alarms/alarmService';

import { colors } from '../constants/colors';
import { radius } from '../constants/radius';
import { spacing } from '../constants/spacing';
import { typography } from '../constants/typography';

export default function AddAlarmScreen() {
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [label, setLabel] = useState('');
  const [repeatDays, setRepeatDays] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [existingAlarm, setExistingAlarm] = useState<Alarm | null>(null);

  const router = useRouter();
  const { alarmId } = useLocalSearchParams<{ alarmId?: string }>();

  const editing = typeof alarmId === 'string' && alarmId.length > 0;

  const weekdays = [
    ['mon', 'M'],
    ['tue', 'T'],
    ['wed', 'W'],
    ['thu', 'T'],
    ['fri', 'F'],
    ['sat', 'S'],
    ['sun', 'S'],
  ] as const;

  useEffect(() => {
    if (!editing) return;

    let active = true;

    void getAlarms()
      .then((alarms) => {
        const alarm = alarms.find((item) => item.id === alarmId);

        if (!active) return;

        if (!alarm) {
          Alert.alert(
            'Alarm not found',
            'This alarm may have been deleted.',
          );
          router.back();
          return;
        }

        setExistingAlarm(alarm);
        setLabel(alarm.label ?? '');
        setRepeatDays(alarm.repeatDays);

        const [hours, minutes] = alarm.time.split(':').map(Number);

        const time = new Date();
        time.setHours(hours, minutes, 0, 0);

        setSelectedTime(time);
      })
      .catch((error: unknown) => {
        console.warn('Unable to load alarm for editing.', error);

        if (active) {
          Alert.alert(
            'Could not load alarm',
            'Please try again.',
          );
        }
      });

    return () => {
      active = false;
    };
  }, [alarmId, editing, router]);

  const saveAlarm = async () => {
    if (saving || (editing && !existingAlarm)) return;

    setSaving(true);

    const alarm: Alarm = {
      id: editing
        ? existingAlarm!.id
        : `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}-${Math.random()
            .toString(36)
            .slice(2)}`,
      label: label.trim() || undefined,
      time: `${String(selectedTime.getHours()).padStart(
        2,
        '0',
      )}:${String(selectedTime.getMinutes()).padStart(2, '0')}`,
      repeatDays,
      enabled: existingAlarm?.enabled ?? true,
      volume: existingAlarm?.volume ?? 1.0,
    };

    try {
      if (editing) {
        await updateAlarm(alarm);
      } else {
        await createAlarm(alarm);
      }

      router.back();
    } catch (error) {
      console.warn('Unable to save alarm.', error);

      Alert.alert(
        'Could not save alarm',
        'Please try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top', 'bottom']}
    >
      <View style={styles.grabber} />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.cancel}>Cancel</Text>
        </Pressable>

        <Text style={styles.title}>
          {editing ? 'Edit Alarm' : 'Add Alarm'}
        </Text>

        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionLabel}>TIME</Text>

        <View style={styles.timeCard}>
          <Host style={styles.timePickerHost}>
            <DatePicker
              title=""
              selection={selectedTime}
              displayedComponents={['hourAndMinute']}
              onDateChange={setSelectedTime}
              modifiers={[datePickerStyle('wheel')]}
            />
          </Host>
        </View>

        <Text
          style={[
            styles.sectionLabel,
            styles.fieldLabel,
          ]}
        >
          LABEL (OPTIONAL)
        </Text>

        <TextInput
          value={label}
          onChangeText={setLabel}
          placeholder="Alarm label"
          placeholderTextColor={colors.textSecondary}
          style={styles.labelInput}
          maxLength={80}
          returnKeyType="done"
        />

        <Text
          style={[
            styles.sectionLabel,
            styles.fieldLabel,
          ]}
        >
          REPEAT
        </Text>

        <View style={styles.daysRow}>
          {weekdays.map(([day, text]) => {
            const selected = repeatDays.includes(day);

            return (
              <Pressable
                key={day}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: selected }}
                accessibilityLabel={day}
                onPress={() =>
                  setRepeatDays((current) =>
                    selected
                      ? current.filter(
                          (value) => value !== day,
                        )
                      : [...current, day],
                  )
                }
                style={[
                  styles.dayButton,
                  selected && styles.dayButtonSelected,
                ]}
              >
                <Text
                  style={[
                    styles.dayText,
                    selected && styles.dayTextSelected,
                  ]}
                >
                  {text}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          onPress={() => void saveAlarm()}
          disabled={
            saving || (editing && !existingAlarm)
          }
          style={[
            styles.saveButton,
            saving && styles.saveButtonDisabled,
          ]}
        >
          <Text style={styles.saveButtonText}>
            {saving
              ? 'Saving...'
              : editing
                ? 'Save Changes'
                : 'Save Alarm'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },

  grabber: {
    width: 40,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginTop: spacing.sm,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },

  title: {
    ...typography.h2,
    color: colors.text,
  },

  cancel: {
    ...typography.bodyMedium,
    color: colors.primary,
  },

  headerSpacer: {
    width: 52,
  },

  content: {
    marginTop: spacing.xl,
  },

  sectionLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },

  timeCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },

  timePickerHost: {
    width: '100%',
    height: spacing.xxxl * 3,
  },

  fieldLabel: {
    marginTop: spacing.xl,
  },

  labelInput: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.text,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    ...typography.bodyMedium,
  },

  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },

  dayButton: {
    flex: 1,
    height: spacing.xxxl,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dayButtonSelected: {
    backgroundColor: colors.primary,
  },

  dayText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },

  dayTextSelected: {
    color: colors.surface,
  },

  saveButton: {
    marginTop: spacing.xl,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },

  saveButtonDisabled: {
    opacity: 0.6,
  },

  saveButtonText: {
    ...typography.bodyMedium,
    color: colors.surface,
  },
});