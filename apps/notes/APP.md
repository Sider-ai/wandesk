# 笔记本（notes）

一本拟物的皮面笔记本。缝线书脊、横线/方格纸、丝带书签、压纹封面，配一支斜插的钢笔。
左侧是「目录」，可以翻到任意一页；右侧是摊开的纸页，写下即自动保存。
可选一个 ✦ AI 按钮，让 Claude 帮你**续写 / 总结 / 润色**当前这一页。

这是同一个 app（id 仍是 `notes`），换了一身拟物外观。

## 数据

私有数据库 `data.db`。主表是 `pages`，每行是本子里的一页：

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
import { db } from './wandesk/db';

await db('notes', 'SELECT id, title, body, paper, pinned, updated_at FROM pages ORDER BY pinned DESC, updated_at DESC');
await db('notes', 'INSERT INTO pages (title, body, paper) VALUES (?, ?, ?)', [title, body, paper]);
await db('notes', 'UPDATE pages SET title=?, body=?, updated_at=datetime(\'now\') WHERE id=?', [title, body, id]);
await db('notes', 'DELETE FROM pages WHERE id = ?', [id]);
```

`db(appId, sql, params)` 会 POST 到 `/api/db`。app id 由入口 main.tsx 传入，查询里从不写死。

## AI（可选）

通过共享的 `agent` 能力调用内核的 agent（用设置里配置的模型）：

```ts
import { agent } from './wandesk/agent';

const r = await agent('notes', prompt, { data: 当前页正文, system: '你是写作助手…' });
// r.ok / r.result
```

界面里的 ✦ 按钮支持三种动作：**续写**、**总结**、**润色**，结果先进一个预览抽屉，
确认后再写回当前页。Claude 的一轮大约 3–10 秒。

## 目录与修改

- `app.json` 清单 · `APP.md` 本文件 · `server.js` 后端(Worker,建表脚本在里面)· `public/` 前端产物 · `src/` 前端源码(React)
- **改前端**:改 `src/`,然后在本目录 `npm install && npm run build`,产物落回 `public/`,窗口刷新即生效。需要本机装有 Node.js;不改就不需要。
- **改后端**:直接改 `server.js`,下一次请求即生效,不用重启。
- **数据**:`data.db` 是本应用的 SQLite,`sqlite3 data.db` 可直接查;表结构见 `server.js` 顶部的 SCHEMA。
