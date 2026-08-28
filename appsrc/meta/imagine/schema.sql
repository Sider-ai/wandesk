-- 想象 (imagine) — 创意发散画布。项目 = 一棵树;节点 = 一版 HTML 设计稿。
CREATE TABLE IF NOT EXISTS app_imagine_projects (
  id         TEXT PRIMARY KEY,
  title      TEXT NOT NULL DEFAULT '',
  prompt     TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS app_imagine_nodes (
  id          TEXT PRIMARY KEY,
  project_id  TEXT NOT NULL,
  parent_id   TEXT,                         -- NULL = 根节点
  instruction TEXT NOT NULL DEFAULT '',     -- 生成这一版用的指令/方向
  title       TEXT,                         -- 产物首行 <!--TITLE--> 抓的短标题
  html        TEXT NOT NULL DEFAULT '',     -- 产物(自包含 HTML);tree 查询不取,按节点懒加载
  status      TEXT NOT NULL DEFAULT 'generating',  -- generating | done | error
  error       TEXT NOT NULL DEFAULT '',
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_app_imagine_nodes_project ON app_imagine_nodes (project_id, created_at);
