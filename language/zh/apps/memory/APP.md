---
name: memory
description: 记忆应用，用于创建、编辑、置顶、启用和删除 AIOS 可复用记忆。
backend: server/main/api/memory.js
frontend: gui/src/apps/memory
database: database/aios.db (memories)
---

# memory

- 定位：存储 AIOS 可复用记忆记录。
- 前端：`gui/src/apps/memory`
- 后端：`server/main/api/memory.js`
- 数据：`database/aios.db` 中的 `memories` 表
- 字段：`title`、`description`、`content`、`creator`、`pinned`、`enabled`、时间戳。
- 入口：
  - `GET /api/memory/list`
  - `GET /api/memory/get`
  - `POST /api/memory/create`
  - `POST /api/memory/update`
  - `POST /api/memory/delete`
