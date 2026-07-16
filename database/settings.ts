// @/database/settings.ts
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("ahs.db"); // PENTING: cek poin di bawah

let initPromise: Promise<any> | null = null;
const ensureInit = () => {
  if (!initPromise) {
    initPromise = db.execAsync(
      `CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL);`
    );
  }
  return initPromise;
};

export const getSetting = async (key: string): Promise<string | null> => {
  await ensureInit();
  const row = await db.getFirstAsync<{ value: string }>(`SELECT value FROM settings WHERE key = ?;`, [key]);
  return row?.value ?? null;
};

export const setSetting = async (key: string, value: string) => {
  await ensureInit();
  await db.runAsync(
    `INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value;`,
    [key, value]
  );
};