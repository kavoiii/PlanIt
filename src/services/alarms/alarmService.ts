import { getDatabase } from '../database/database';

//sending info to database
export type Alarm = {
  id: string;
  label?: string;
  time: string;
  repeatDays: string[];
  enabled: boolean;
  volume: number;
};

export async function createAlarm(alarm: Alarm): Promise<void> {
  const database = await getDatabase();

  await database.runAsync(
    `
      INSERT INTO alarms (
        id,
        label,
        time,
        repeat_days,
        enabled,
        volume
      )
      VALUES (?, ?, ?, ?, ?, ?);
    `,
    [
      alarm.id,
      alarm.label ?? null,
      alarm.time,
      JSON.stringify(alarm.repeatDays),
      alarm.enabled ? 1 : 0,
      alarm.volume,
    ]
  );
}

export async function updateAlarm(alarm: Alarm): Promise<void> {
  const database = await getDatabase();

  await database.runAsync(
    `
      UPDATE alarms
      SET label = ?, time = ?, repeat_days = ?, enabled = ?, volume = ?
      WHERE id = ?;
    `,
    [
      alarm.label ?? null,
      alarm.time,
      JSON.stringify(alarm.repeatDays),
      alarm.enabled ? 1 : 0,
      alarm.volume,
      alarm.id,
    ]
  );
}

export async function deleteAlarm(id: string): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM alarms WHERE id = ?;', [id]);
}

export async function updateAlarmEnabled(id: string, enabled: boolean): Promise<void> {
  const database = await getDatabase();
  await database.runAsync('UPDATE alarms SET enabled = ? WHERE id = ?;', [enabled ? 1 : 0, id]);
}

//getting info from database
export async function getAlarms(): Promise<Alarm[]> {
  const database = await getDatabase();

  const rows = await database.getAllAsync<{
    id: string;
    label: string | null;
    time: string;
    repeat_days: string;
    enabled: number;
    volume: number;
  }>('SELECT * FROM alarms');

  return rows.map((row) => ({
    id: row.id,
    label: row.label ?? undefined,
    time: row.time,
    repeatDays: JSON.parse(row.repeat_days),
    enabled: row.enabled === 1,
    volume: row.volume,
  }));
}
