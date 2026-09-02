// SQLite schema and data access.
// Schema changes go through the lightweight ensureColumn migration —— an existing local
// database just gets a column added, we never drop and recreate it.
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

export function openDatabase(file) {
    const path = resolve(file);
    mkdirSync(dirname(path), { recursive: true });
    const db = new DatabaseSync(path);
    db.exec('PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;');
    db.exec(`
        CREATE TABLE IF NOT EXISTS conversations (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            workdir TEXT NOT NULL,
            pinned INTEGER NOT NULL DEFAULT 0,
            context_json TEXT NOT NULL DEFAULT '[]',
            usage_json TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
            seq INTEGER NOT NULL,
            item_json TEXT NOT NULL,
            created_at TEXT NOT NULL,
            UNIQUE(conversation_id, seq)
        );
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS compactions (
            conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
            start_seq INTEGER NOT NULL CHECK (start_seq > 0),
            end_seq INTEGER NOT NULL CHECK (end_seq >= start_seq),
            summary TEXT NOT NULL,
            kind TEXT NOT NULL CHECK (kind IN ('summary', 'mechanical')),
            tokens INTEGER NOT NULL DEFAULT 0,
            at TEXT NOT NULL,
            PRIMARY KEY (conversation_id, end_seq)
        );
        CREATE INDEX IF NOT EXISTS idx_messages_conversation_seq
        ON messages(conversation_id, seq);
        CREATE INDEX IF NOT EXISTS idx_compactions_conversation
        ON compactions(conversation_id, end_seq);
    `);
    ensureColumn(db, 'conversations', 'pinned', 'INTEGER NOT NULL DEFAULT 0');
    db.exec('PRAGMA optimize;');
    return db;
}

/** CREATE TABLE IF NOT EXISTS does nothing to an old database —— new columns get added here. */
function ensureColumn(db, table, column, definition) {
    const columns = db.prepare(`PRAGMA table_info(${table})`).all();
    if (columns.some((item) => item.name === column)) return;
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
}

export function createStore(db) {
    const list = db.prepare(`SELECT id, title, workdir, pinned, created_at, updated_at
        FROM conversations ORDER BY pinned DESC, updated_at DESC`);
    const get = db.prepare('SELECT * FROM conversations WHERE id = ?');
    const insert = db.prepare(`INSERT INTO conversations
        (id, title, workdir, context_json, created_at, updated_at) VALUES (?, ?, ?, '[]', ?, ?)`);
    const remove = db.prepare('DELETE FROM conversations WHERE id = ?');
    const pageLatest = db.prepare(`SELECT id, seq, item_json, created_at FROM messages
        WHERE conversation_id = ? ORDER BY seq DESC LIMIT ?`);
    const pageBefore = db.prepare(`SELECT id, seq, item_json, created_at FROM messages
        WHERE conversation_id = ? AND seq < ? ORDER BY seq DESC LIMIT ?`);
    const nextSeq = db.prepare('SELECT COALESCE(MAX(seq), 0) + 1 AS seq FROM messages WHERE conversation_id = ?');
    const addMessage = db.prepare(`INSERT INTO messages (conversation_id, seq, item_json, created_at)
        VALUES (?, ?, ?, ?)`);
    const updateContext = db.prepare(`UPDATE conversations
        SET context_json = ?, usage_json = ?, updated_at = ? WHERE id = ?`);
    const updateTitle = db.prepare('UPDATE conversations SET title = ?, updated_at = ? WHERE id = ?');
    const updatePinned = db.prepare('UPDATE conversations SET pinned = ? WHERE id = ?');
    const updateWorkdir = db.prepare('UPDATE conversations SET workdir = ? WHERE id = ?');
    const touchRow = db.prepare('UPDATE conversations SET updated_at = ? WHERE id = ?');
    const listSettings = db.prepare('SELECT key, value FROM settings');
    const upsertSetting = db.prepare(`INSERT INTO settings (key, value) VALUES (?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value`);
    const latestMessageSeq = db.prepare('SELECT COALESCE(MAX(seq), 0) AS seq FROM messages WHERE conversation_id = ?');
    const lastCompaction = db.prepare('SELECT end_seq FROM compactions WHERE conversation_id = ? ORDER BY end_seq DESC LIMIT 1');
    const addCompaction = db.prepare(`INSERT INTO compactions
        (conversation_id, start_seq, end_seq, summary, kind, tokens, at) VALUES (?, ?, ?, ?, ?, ?, ?)`);

    const now = () => new Date().toISOString();
    const parseConversation = (row) => row && ({
        ...row,
        context: JSON.parse(row.context_json || '[]'),
        usage: row.usage_json ? JSON.parse(row.usage_json) : null,
    });

    return {
        getSettings: () => Object.fromEntries(listSettings.all().map((row) => [row.key, row.value])),
        setSettings(values) {
            db.exec('BEGIN');
            try {
                for (const [key, value] of Object.entries(values)) upsertSetting.run(key, String(value ?? ''));
                db.exec('COMMIT');
            } catch (error) { db.exec('ROLLBACK'); throw error; }
            return Object.fromEntries(listSettings.all().map((row) => [row.key, row.value]));
        },
        latestMessageSeq: (id) => Number(latestMessageSeq.get(id).seq) || 0,
        lastCompactionEnd: (id) => Number(lastCompaction.get(id)?.end_seq) || 0,
        appendCompaction(id, { startSeq, endSeq, summary, kind, tokens = 0 }) {
            addCompaction.run(id, startSeq, endSeq, summary, kind, tokens, now());
        },
        listConversations: () => list.all(),
        getConversation: (id) => parseConversation(get.get(id)),
        createConversation({ id, title, workdir }) {
            const at = now();
            insert.run(id, title, workdir, at, at);
            return parseConversation(get.get(id));
        },
        deleteConversation: (id) => remove.run(id).changes > 0,

        /** The most recent page (returned in ascending seq order); pass `before` as the previous page's earliest seq to page further back. */
        listMessages(id, { before = 0, limit = 60 } = {}) {
            const rows = before > 0 ? pageBefore.all(id, before, limit + 1) : pageLatest.all(id, limit + 1);
            const hasMore = rows.length > limit;
            const page = rows.slice(0, limit).reverse();
            return {
                messages: page.map((row) => ({ seq: row.seq, item: JSON.parse(row.item_json), createdAt: row.created_at })),
                hasMore,
            };
        },

        append(id, item) {
            const seq = Number(nextSeq.get(id).seq);
            const at = now();
            addMessage.run(id, seq, JSON.stringify(item), at);
            touchRow.run(at, id);
            return { seq, item, createdAt: at };
        },
        saveContext(id, context, usage) {
            updateContext.run(JSON.stringify(context), usage ? JSON.stringify(usage) : null, now(), id);
        },
        setTitle(id, title) { updateTitle.run(title, now(), id); },
        /** Pinning doesn't touch updated_at —— after pinning, ordering still follows last activity, so it doesn't jump to the top of the recent group. */
        setPinned(id, pinned) { updatePinned.run(pinned ? 1 : 0, id); },
        setWorkdir(id, workdir) { updateWorkdir.run(workdir, id); },
    };
}
