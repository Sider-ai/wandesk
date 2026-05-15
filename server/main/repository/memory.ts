// 「记忆」是用户写给 AI 看的长期上下文条目。
// 数据存在独立的 memories 表;启用的条目由 service/prompt/memory.js
// 拼进 system prompt,让 AI 在所有对话里都能"想起来"。
import { db } from "./client.js";

const rowToMemory = (row) => row && {
    id: row.id,
    title: row.title || "",
    description: row.description || "",
    content: row.content || "",
    enabled: !!row.enabled,
    pinned: !!row.pinned,
    created_at: row.created_at || null,
    updated_at: row.updated_at || null
};

const listMemories = () => {
    const rows = db.prepare(`
        SELECT id, title, description, content, enabled, pinned, created_at, updated_at
        FROM memories
        ORDER BY pinned DESC, id DESC
    `).all();
    return rows.map(rowToMemory);
};

const listEnabledMemories = () => {
    const rows = db.prepare(`
        SELECT id, title, description, content, pinned, updated_at
        FROM memories
        WHERE enabled = 1
        ORDER BY pinned DESC, id DESC
    `).all();
    return rows;
};

const getMemory = (id) => {
    const row = db.prepare(
        "SELECT id, title, description, content, enabled, pinned, created_at, updated_at FROM memories WHERE id = ?"
    ).get(Number(id) || 0);
    return rowToMemory(row);
};

const createMemory = ({ title, description = "", content, enabled = true, pinned = false }) => {
    const ret = db.prepare(`
        INSERT INTO memories (title, description, content, enabled, pinned)
        VALUES (?, ?, ?, ?, ?)
    `).run(
        String(title || "").trim(),
        String(description || "").trim(),
        String(content || "").trim(),
        enabled ? 1 : 0,
        pinned ? 1 : 0
    );
    return getMemory(ret.lastInsertRowid);
};

const updateMemory = (id, patch: any = {}) => {
    const fields = [];
    const values = [];
    if (patch.title !== undefined) { fields.push("title = ?"); values.push(String(patch.title).trim()); }
    if (patch.description !== undefined) { fields.push("description = ?"); values.push(String(patch.description).trim()); }
    if (patch.content !== undefined) { fields.push("content = ?"); values.push(String(patch.content).trim()); }
    if (patch.enabled !== undefined) { fields.push("enabled = ?"); values.push(patch.enabled ? 1 : 0); }
    if (patch.pinned !== undefined) { fields.push("pinned = ?"); values.push(patch.pinned ? 1 : 0); }
    if (!fields.length) return getMemory(id);
    fields.push("updated_at = datetime('now')");
    values.push(Number(id) || 0);
    db.prepare(`UPDATE memories SET ${fields.join(", ")} WHERE id = ?`).run(...values);
    return getMemory(id);
};

const deleteMemory = (id) => {
    db.prepare("DELETE FROM memories WHERE id = ?").run(Number(id) || 0);
    return { success: true };
};

export { listMemories, listEnabledMemories, getMemory, createMemory, updateMemory, deleteMemory };
