---
name: codex
description: Codex 应用，把本地 codex CLI 包装成 AIOS 对话界面。
backend: server/apps/codex
frontend: gui/src/apps/codex
database: database/apps/codex.db
---

# codex

- 定位：通过 AIOS 应用壳运行本地 Codex 会话。
- 前端：`gui/src/apps/codex`
- 后端：`server/apps/codex`
- 数据：`database/apps/codex.db`
- 运行依赖：本地 `codex` CLI。
- 工作区：每个会话有选择的工作目录，并使用 registry 目录保存 thread 元数据。
- 权限模式：`workspaceWrite`、`readOnly`、`fullAuto`、`neverAsk`、`dangerFullAccess`、`bypassPermissions`。
- 入口：
  - `GET /apps/codex/status`
  - `GET /apps/codex/conversations`
  - `POST /apps/codex/conversations/create`
  - `POST /apps/codex/conversations/delete`
  - `GET /apps/codex/messages`
  - `POST /apps/codex/send`
  - `GET /apps/codex/history`
  - `GET /apps/codex/account`
  - `GET /apps/codex/settings`
  - `GET /apps/codex/mcp`
  - `GET /apps/codex/skills`
  - `GET /apps/codex/memory`
  - `GET /apps/codex/projects`
  - `GET /apps/codex/projects/dir`
  - `GET /apps/codex/projects/file`
  - `POST /apps/codex/memory/save`
  - `POST /apps/codex/settings/save`
