// 笔记本 — 客户端数据层。所有 SQL 收在这里,组件/hook 只调这些函数。
import { db } from './wandesk/db';
import type { Page } from './lib/paper';

export async function loadPages(appId: string): Promise<Page[]> {
  const r = await db(appId, 'SELECT id, title, body, paper, pinned, updated_at FROM app_notes_pages ORDER BY updated_at DESC, id DESC');
  return (r.rows || []) as Page[];
}

export async function insertPage(appId: string, paper: number): Promise<number | undefined> {
  const r = await db(appId, 'INSERT INTO app_notes_pages (title, body, paper) VALUES (?, ?, ?)', ['', '', paper]);
  return Number(r.lastInsertRowid) || undefined;
}

export const deletePageRow = (appId: string, id: number) =>
  db(appId, 'DELETE FROM app_notes_pages WHERE id = ?', [id]);

export const updatePage = (appId: string, id: number, title: string, body: string, paper: number, pinned: number) =>
  db(appId, "UPDATE app_notes_pages SET title = ?, body = ?, paper = ?, pinned = ?, updated_at = datetime('now') WHERE id = ?", [title, body, paper, pinned, id]);
