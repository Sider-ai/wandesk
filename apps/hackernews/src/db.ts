import { db } from './wandesk/db';

const APP = 'hackernews';

export type Hit = {
  objectID: string; title: string; url: string | null; points: number;
  author: string; num_comments: number; created_at: string;
};
export type HistoryRow = { story_id: string; title: string; analysis: string; created_at: string };

export async function cachedAnalyses(ids: string[]): Promise<Record<string, string>> {
  if (!ids.length) return {};
  const ph = ids.map(() => '?').join(',');
  const r = await db(APP, `SELECT story_id, analysis FROM app_hackernews_analyses WHERE story_id IN (${ph})`, ids);
  const out: Record<string, string> = {};
  for (const row of (r.rows as { story_id: string; analysis: string }[]) || []) out[row.story_id] = row.analysis;
  return out;
}
export const saveAnalysis = (id: string, title: string, analysis: string) =>
  db(APP, 'INSERT OR REPLACE INTO app_hackernews_analyses (story_id, title, analysis) VALUES (?, ?, ?)', [id, title, analysis]);
export async function listHistory(): Promise<HistoryRow[]> {
  const r = await db(APP, 'SELECT story_id, title, analysis, created_at FROM app_hackernews_analyses ORDER BY created_at DESC LIMIT 100');
  return (r.rows as HistoryRow[]) || [];
}

export async function favSet(): Promise<Set<string>> {
  const r = await db(APP, 'SELECT item_id FROM app_hackernews_favorites');
  return new Set(((r.rows as { item_id: string }[]) || []).map((x) => x.item_id));
}
export async function listFavs(): Promise<Hit[]> {
  const r = await db(APP, 'SELECT data FROM app_hackernews_favorites ORDER BY created_at DESC LIMIT 200');
  const out: Hit[] = [];
  for (const row of (r.rows as { data: string }[]) || []) { try { out.push(JSON.parse(row.data)); } catch { /* skip */ } }
  return out;
}
export const addFav = (h: Hit) =>
  db(APP, 'INSERT OR REPLACE INTO app_hackernews_favorites (item_id, data) VALUES (?, ?)', [h.objectID, JSON.stringify(h)]);
export const removeFav = (id: string) => db(APP, 'DELETE FROM app_hackernews_favorites WHERE item_id=?', [id]);
