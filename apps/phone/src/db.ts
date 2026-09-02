// Phone — client-side data layer. Screen history + the persistent conversation id are both
// stored in the db, so a cold start can resume the same unfolding life.
import { db } from './wandesk/db';
import type { Screen } from './lib/screen';

export const saveScreen = (appId: string, s: Screen) =>
  db(appId, 'INSERT INTO app_phone_screens (content, options) VALUES (?, ?)', [s.content, JSON.stringify(s.options || [])]);

// The whole phone is one persistent conversation: the conversationId is stored here, carrying
// the same unfolding life across windows/restarts
export const persistConv = (appId: string, id: string) =>
  db(appId, "INSERT INTO app_phone_state (key, value) VALUES ('conversation', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value", [id]);

// An older db may not have the state table yet (the schema only runs on db creation); add it idempotently
export const ensureStateTable = (appId: string) =>
  db(appId, 'CREATE TABLE IF NOT EXISTS app_phone_state (key TEXT PRIMARY KEY, value TEXT NOT NULL)');

export async function loadConv(appId: string): Promise<string | undefined> {
  const st = await db(appId, "SELECT value FROM app_phone_state WHERE key = 'conversation'");
  const row = st.rows && st.rows[0];
  const v = row && String((row as { value?: unknown }).value || '');
  return v || undefined;
}

export async function loadLastScreen(appId: string): Promise<Screen | null> {
  const res = await db(appId, 'SELECT content, options FROM app_phone_screens ORDER BY id DESC LIMIT 1');
  const row = res.rows && res.rows[0];
  if (!row || !row.content) return null;
  let options: { text: string }[] = [];
  try { options = JSON.parse(String(row.options || '[]')); } catch { options = []; }
  return { content: String(row.content), options };
}
