---
name: claude-code
description: Claude Code 应用，把本地 claude CLI 包装成 AIOS 对话界面。
backend: server/apps/claude-code
frontend: gui/src/apps/claude-code
database: database/apps/claude-code.db
---

# claude-code

- 定位：通过 AIOS 应用壳运行本地 Claude Code 会话。
- 前端：`gui/src/apps/claude-code`
- 后端：`server/apps/claude-code`
- 数据：`database/apps/claude-code.db`
- 运行依赖：本地 `claude` CLI。
- 工作区：每个会话使用独立工作目录。
- 入口：
  - `GET /apps/claude-code/status`
  - `GET /apps/claude-code/conversations`
  - `POST /apps/claude-code/conversations/create`
  - `POST /apps/claude-code/conversations/rename`
  - `POST /apps/claude-code/conversations/delete`
  - `GET /apps/claude-code/messages`
  - `POST /apps/claude-code/send`
