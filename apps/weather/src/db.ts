// 天气 — 客户端数据层(收藏城市的 CRUD)。
import { db } from './wandesk/db';
import type { City } from './lib/types';

export async function loadCities(appId: string): Promise<City[]> {
  const r = await db(appId, 'SELECT id, name, lat, lon, is_default, sort FROM app_weather_cities ORDER BY sort ASC, id ASC');
  return (r.rows as City[]) || [];
}

export async function insertCity(appId: string, name: string, lat: number, lon: number, isDefault: number, sort: number): Promise<number> {
  const ins = await db(appId, 'INSERT INTO app_weather_cities (name, lat, lon, is_default, sort) VALUES (?, ?, ?, ?, ?)', [name, lat, lon, isDefault, sort]);
  return Number(ins.lastInsertRowid) || Date.now();
}

export const deleteCity = (appId: string, id: number) =>
  db(appId, 'DELETE FROM app_weather_cities WHERE id = ?', [id]);

// mark exactly one city as default (is_default = 1 where id matches, else 0)
export const setDefaultCity = (appId: string, id: number) =>
  db(appId, 'UPDATE app_weather_cities SET is_default = (id = ?)', [id]);
