import { getAlarms } from '../alarms/alarmService';

export type TodayItem = {
  id: string;
  title: string;
  type: 'Alarm' | 'Reminder' | 'Task';
  scheduledAt: Date;
  detail?: string;
};

/** Read-only entry point for the items scheduled on a given local date. */
export async function getTodayItems(date: Date): Promise<TodayItem[]> {
  const alarms = await getAlarms();
  const weekday = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][date.getDay()];

  return alarms
    .filter((alarm) => alarm.enabled && (alarm.repeatDays.length === 0 || alarm.repeatDays.includes(weekday)))
    .map((alarm) => {
      const [hours, minutes] = alarm.time.split(':').map(Number);
      const scheduledAt = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes);
      return {
        id: alarm.id,
        title: alarm.label?.trim() || 'Alarm',
        type: 'Alarm' as const,
        scheduledAt,
        detail: alarm.label?.trim() ? undefined : alarm.time,
      };
    });
}

