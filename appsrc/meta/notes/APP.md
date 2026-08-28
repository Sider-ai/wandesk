# 笔记本（notes）

一本拟物的皮面笔记本。缝线书脊、横线/方格纸、丝带书签、压纹封面，配一支斜插的钢笔。
左侧是「目录」，可以翻到任意一页；右侧是摊开的纸页，写下即自动保存。
可选一个 ✦ AI 按钮，让 Claude 帮你**续写 / 总结 / 润色**当前这一页。

这是同一个 app（id 仍是 `notes`），换了一身拟物外观。

## 结构

一个 Wandesk 应用 = **共享同一个 id（`notes`）的两个文件夹**：

- `apps/notes/` — 定义（没有后端代码）：
  - `app.json` — 清单（id、name「笔记本」、icon 📔、version、description）
  - `schema.sql` — 表结构，首次启动时落进 `database/apps/notes.db`
  - `APP.md` — 本文件
- `ui/src/apps/notes/index.tsx` — React 前端，单文件、自带 `<style>`，由桌面外壳挂载

## 数据

私有数据库 `database/apps/notes.db`。主表是 `pages`，每行是本子里的一页：

```sql
pages(
  id INTEGER PK,
  title TEXT,          -- 页标题
  body  TEXT,          -- 正文
  paper INTEGER,       -- 纸张样式索引（横线/方格/点阵/牛皮…）
  pinned INTEGER,      -- 1 = 用丝带书签置顶
  created_at TEXT,
  updated_at TEXT
)
```

前端通过共享的 `db` 能力读写，没有每个应用单独的后端：

```ts
import { db } from '../../system/lib/db';

await db('notes', 'SELECT id, title, body, paper, pinned, updated_at FROM pages ORDER BY pinned DESC, updated_at DESC');
await db('notes', 'INSERT INTO pages (title, body, paper) VALUES (?, ?, ?)', [title, body, paper]);
await db('notes', 'UPDATE pages SET title=?, body=?, updated_at=datetime(\'now\') WHERE id=?', [title, body, id]);
await db('notes', 'DELETE FROM pages WHERE id = ?', [id]);
```

`db(appId, sql, params)` 会 POST 到 `/apps/<appId>/db`。app id 由外壳传入，查询里从不写死。

## AI（可选）

通过共享的 `agent` 能力调用用户自己的 Claude（无需 key）：

```ts
import { agent } from '../../system/lib/agent';

const r = await agent('notes', prompt, { data: 当前页正文, system: '你是写作助手…' });
// r.ok / r.result
```

界面里的 ✦ 按钮支持三种动作：**续写**、**总结**、**润色**，结果先进一个预览抽屉，
确认后再写回当前页。Claude 的一轮大约 3–10 秒。

## 改这个应用

改 `ui/src/apps/notes/index.tsx`（UI）和/或 `apps/notes/schema.sql`（表），
然后 `POST /api/reload` 让平台重新扫描。
