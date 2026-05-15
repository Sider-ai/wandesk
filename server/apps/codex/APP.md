---
name: codex
description: Codex app that wraps the local codex CLI in an AIOS chat interface.
backend: server/apps/codex
frontend: gui/src/apps/codex
database: database/apps/codex.db
---

# codex

- Role: runs local Codex sessions through the AIOS app shell.
- Frontend: `gui/src/apps/codex`
- Backend: `server/apps/codex`
- Data: `database/apps/codex.db`
- Runtime dependency: local `codex` CLI.
- Workspace: each conversation has a selected working directory and a registry directory for thread metadata.
- Permission modes: `workspaceWrite`, `readOnly`, `fullAuto`, `neverAsk`, `dangerFullAccess`, `bypassPermissions`.
- Entry points:
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
