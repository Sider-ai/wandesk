---
name: notebook
description: 轻量笔记应用，支持创建、编辑、搜索；AI 协助按钮基于系统上下文执行用户写下的指令。
backend: server/apps/notebook
frontend: ui/src/apps/notebook
database: database/apps/notebook.db
---

# notebook

- 定位：轻量笔记与内容整理应用。
- 前端：`ui/src/apps/notebook`
- 后端：`server/apps/notebook`
- 数据：`database/apps/notebook.db`
- 入口：
  - `GET /apps/notebook/list`
  - `POST /apps/notebook/create`
  - `POST /apps/notebook/update`
  - `POST /apps/notebook/delete`
  - `POST /apps/notebook/assist`
