import * as SQLite from 'expo-sqlite';

const databaseName = 'planit.db';
let databasePromise: Promise<SQLite.SQLiteDatabase> | undefined;

export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  databasePromise ??= SQLite.openDatabaseAsync(databaseName);
  return databasePromise;
}

export async function initializeDatabase(): Promise<void> {
  const database = await getDatabase();

  await database.execAsync('PRAGMA journal_mode = WAL;');

  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS alarms (
      id TEXT PRIMARY KEY NOT NULL,
      label TEXT,
      time TEXT NOT NULL,
      repeat_days TEXT NOT NULL,
      enabled INTEGER NOT NULL DEFAULT 1,
      volume REAL NOT NULL DEFAULT 1.0
    );
  `);
}