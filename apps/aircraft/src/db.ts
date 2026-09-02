// Aircraft — client-side data layer (high score).
import { db } from './wandesk/db';

export async function loadHiScore(appId: string): Promise<number> {
  try {
    const r = await db(appId, 'SELECT MAX(score) as best FROM app_aircraft_scores');
    return (r.rows?.[0] as any)?.best || 0;
  } catch { return 0; }
}

export function saveScore(appId: string, score: number, wave: number) {
  if (score > 0) db(appId, 'INSERT INTO app_aircraft_scores (score, wave) VALUES (?, ?)', [score, wave]).catch(() => {});
}
