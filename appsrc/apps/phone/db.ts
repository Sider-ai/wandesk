// 手机 — 客户端数据层。屏幕历史 + 持久会话 id 都落库,冷启动据此续上同一段生活。
import { db } from '../../system/lib/db';
import type { Screen } from './lib/screen';

export const saveScreen = (appId: string, s: Screen) =>
  db(appId, 'INSERT INTO app_phone_screens (content, options) VALUES (?, ?)', [s.content, JSON.stringify(s.options || [])]);

// 整部手机 = 一个持久对话:conversationId 落库,跨窗口/跨重启接着同一段生活
export const persistConv = (appId: string, id: string) =>
  db(appId, "INSERT INTO app_phone_state (key, value) VALUES ('conversation', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value", [id]);

// 老库可能还没有 state 表(schema 只在建库时跑),幂等补上
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
