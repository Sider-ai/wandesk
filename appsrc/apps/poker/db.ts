// 炸金花 — 客户端数据层。钱包(单行)+ 战绩表。
import { db } from '../../system/lib/db';

export async function loadBank(appId: string): Promise<{ chips: number; win: number; lose: number }> {
  const w = await db(appId, 'SELECT chips FROM app_poker_wallet WHERE id = 1');
  const chips = (w.rows && w.rows[0] && Number(w.rows[0].chips)) || 0;
  const s = await db(appId, "SELECT SUM(result='win') AS win, SUM(result='lose') AS lose FROM app_poker_stats");
  const row = (s.rows && s.rows[0]) || {};
  return { chips, win: Number(row.win) || 0, lose: Number(row.lose) || 0 };
}

export const saveChips = (appId: string, next: number) =>
  db(appId, 'UPDATE app_poker_wallet SET chips = ? WHERE id = 1', [next]);

export const insertStat = (appId: string, result: 'win' | 'lose', delta: number) =>
  db(appId, 'INSERT INTO app_poker_stats (result, delta) VALUES (?, ?)', [result, delta]);

export async function resetBank(appId: string) {
  await db(appId, 'UPDATE app_poker_wallet SET chips = 1000 WHERE id = 1');
  await db(appId, 'DELETE FROM app_poker_stats');
}
