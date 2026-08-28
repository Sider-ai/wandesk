// 恋爱屋 — 客户端数据层。所有 SQL 收在这里,组件只调用这些函数(都吃 appId,不硬编码 id)。
import { db } from '../../system/lib/db';
import { MAX_MEMORIES, type CmtItem, type Moment, type Msg } from './lib/persona';

const num = (v: unknown) => Number(v) || 0;

export function parseMoment(row: any): Moment {
  let comments: CmtItem[] = [];
  try { comments = JSON.parse(String(row.comments || '[]')); } catch { comments = []; }
  return {
    id: num(row.id), emoji: String(row.emoji || ''), content: String(row.content || ''),
    likes: num(row.likes), liked: num(row.liked), comments,
    created_at: String(row.created_at || ''),
  };
}

// 老库可能还没有 moments 表(schema 只在建库时跑),幂等补上
export const ensureMomentsTable = (appId: string) =>
  db(appId, "CREATE TABLE IF NOT EXISTS app_lovehouse_moments (id INTEGER PRIMARY KEY AUTOINCREMENT, emoji TEXT NOT NULL DEFAULT '', content TEXT NOT NULL, likes INTEGER NOT NULL DEFAULT 1, liked INTEGER NOT NULL DEFAULT 0, comments TEXT NOT NULL DEFAULT '[]', created_at TEXT NOT NULL DEFAULT (datetime('now')))");

export async function loadMessages(appId: string): Promise<Msg[]> {
  const m = await db(appId, 'SELECT id, role, content, created_at FROM app_lovehouse_messages ORDER BY id');
  return (m.rows as Msg[]) || [];
}
export async function insertMessage(appId: string, role: 'user' | 'bot', content: string): Promise<number> {
  const r = await db(appId, 'INSERT INTO app_lovehouse_messages (role, content) VALUES (?, ?)', [role, content]);
  return Number(r.lastInsertRowid) || Date.now();
}

export async function loadMemories(appId: string): Promise<string[]> {
  const r = await db(appId, 'SELECT content FROM app_lovehouse_memories ORDER BY id');
  return (r.rows || []).map((x: any) => x.content as string);
}
export async function addMemory(appId: string, text: string): Promise<void> {
  await db(appId, 'INSERT INTO app_lovehouse_memories (content) VALUES (?)', [text]);
  await db(appId, `DELETE FROM app_lovehouse_memories WHERE id NOT IN (SELECT id FROM app_lovehouse_memories ORDER BY id DESC LIMIT ${MAX_MEMORIES})`);
}

export async function loadState(appId: string): Promise<Record<string, string>> {
  const s = await db(appId, 'SELECT key, value FROM app_lovehouse_state');
  const map: Record<string, string> = {};
  for (const row of (s.rows || []) as any[]) map[row.key] = row.value;
  return map;
}
export const saveState = (appId: string, key: string, value: string) =>
  db(appId, 'INSERT INTO app_lovehouse_state (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value', [key, value]);

export async function loadMoments(appId: string): Promise<Moment[]> {
  const r = await db(appId, 'SELECT * FROM app_lovehouse_moments ORDER BY id DESC LIMIT 20');
  return ((r.rows || []) as any[]).map(parseMoment);
}
export const insertMoment = (appId: string, emoji: string, content: string, likes: number) =>
  db(appId, 'INSERT INTO app_lovehouse_moments (emoji, content, likes) VALUES (?, ?, ?)', [emoji, content.slice(0, 80), likes]);
export const updateMomentLiked = (appId: string, id: number, liked: number) =>
  db(appId, 'UPDATE app_lovehouse_moments SET liked = ? WHERE id = ?', [liked, id]);
export const updateMomentComments = (appId: string, id: number, comments: CmtItem[]) =>
  db(appId, 'UPDATE app_lovehouse_moments SET comments = ? WHERE id = ?', [JSON.stringify(comments), id]);
