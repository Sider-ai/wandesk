---
name: claude-code
description: Claude Code app that wraps the local claude CLI in an AIOS chat interface.
backend: server/apps/claude-code
frontend: gui/src/apps/claude-code
database: database/apps/claude-code.db
---

# claude-code

- Role: runs local Claude Code sessions through the AIOS app shell.
- Frontend: `gui/src/apps/claude-code`
- Backend: `server/apps/claude-code`
- Data: `database/apps/claude-code.db`
- Runtime dependency: local `claude` CLI.
- Workspace: each conversation has its own working directory.
- Entry points:
  - `GET /apps/claude-code/status`
  - `GET /apps/claude-code/conversations`
  - `POST /apps/claude-code/conversations/create`
  - `POST /apps/claude-code/conversations/rename`
  - `POST /apps/claude-code/conversations/delete`
  - `GET /apps/claude-code/messages`
  - `POST /apps/claude-code/send`
