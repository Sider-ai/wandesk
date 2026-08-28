// 阅读 — 客户端数据层。书目/页面全量持久化,所有 SQL 收在这里。
import { db } from '../../system/lib/db';
import type { BookRow, Page } from './lib/types';
import { parseChoices } from './lib/story';

export async function loadBooks(appId: string): Promise<BookRow[]> {
  const r = await db(appId, 'SELECT id, title, premise, conversation_id, status, updated_at FROM app_reader_books ORDER BY updated_at DESC, id DESC');
  return (r.rows as BookRow[]) || [];
}

export async function loadCounts(appId: string): Promise<Record<number, number>> {
  const rc = await db(appId, 'SELECT book_id, COUNT(*) AS n FROM app_reader_pages GROUP BY book_id').catch(() => null);
  const map: Record<number, number> = {};
  if (rc) for (const row of (rc.rows as any[]) || []) map[Number(row.book_id)] = Number(row.n);
  return map;
}

export async function insertBook(appId: string, title: string, premise: string, convId: string | null, status: string): Promise<number> {
  const ins = await db(appId, 'INSERT INTO app_reader_books (title, premise, conversation_id, status) VALUES (?, ?, ?, ?)', [title, premise, convId, status]);
  return Number(ins.lastInsertRowid) || Date.now();
}

export const insertPage = (appId: string, bookId: number, idx: number, narrative: string, chosen: string, choices: string[]) =>
  db(appId, 'INSERT INTO app_reader_pages (book_id, idx, narrative, chosen, choices) VALUES (?, ?, ?, ?, ?)', [bookId, idx, narrative, chosen, JSON.stringify(choices)]);

export const setPageChoice = (appId: string, bookId: number, idx: number, chosen: string, choices: string[]) =>
  db(appId, 'UPDATE app_reader_pages SET chosen = ?, choices = ? WHERE book_id = ? AND idx = ?', [chosen, JSON.stringify(choices), bookId, idx]);

export const setPageChoices = (appId: string, bookId: number, idx: number, choices: string[]) =>
  db(appId, 'UPDATE app_reader_pages SET choices = ? WHERE book_id = ? AND idx = ?', [JSON.stringify(choices), bookId, idx]);

export const setBookState = (appId: string, bookId: number, convId: string | null, status: string) =>
  db(appId, "UPDATE app_reader_books SET conversation_id = ?, status = ?, updated_at = datetime('now') WHERE id = ?", [convId, status, bookId]);

export const setBookConv = (appId: string, bookId: number, convId: string | null) =>
  db(appId, 'UPDATE app_reader_books SET conversation_id = ? WHERE id = ?', [convId, bookId]);

export async function loadPages(appId: string, bookId: number): Promise<Page[]> {
  const r = await db(appId, 'SELECT idx, narrative, chosen, choices FROM app_reader_pages WHERE book_id = ? ORDER BY idx', [bookId]);
  return ((r.rows as any[]) || []).map((row) => ({
    idx: row.idx, narrative: row.narrative, chosen: row.chosen, choices: parseChoices(row.choices),
  }));
}

export async function deleteBook(appId: string, id: number) {
  await db(appId, 'DELETE FROM app_reader_pages WHERE book_id = ?', [id]);
  await db(appId, 'DELETE FROM app_reader_books WHERE id = ?', [id]);
}
