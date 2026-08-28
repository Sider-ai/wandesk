// 飞机大战 — 客户端数据层(最高分)。
import { db } from '../../system/lib/db';

export async function loadHiScore(appId: string): Promise<number> {
  try {
    const r = await db(appId, 'SELECT MAX(score) as best FROM app_aircraft_scores');
    return (r.rows?.[0] as any)?.best || 0;
  } catch { return 0; }
}

export function saveScore(appId: string, score: number, wave: number) {
  if (score > 0) db(appId, 'INSERT INTO app_aircraft_scores (score, wave) VALUES (?, ?)', [score, wave]).catch(() => {});
}
