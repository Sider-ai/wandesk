---
name: memory
description: Memory app for creating, editing, pinning, enabling, and deleting reusable AIOS memories.
backend: server/main/api/memory.js
frontend: gui/src/apps/memory
database: database/aios.db (memories)
---

# memory

- Role: stores reusable memory records for AIOS.
- Frontend: `gui/src/apps/memory`
- Backend: `server/main/api/memory.js`
- Data: `memories` table in `database/aios.db`
- Fields: `title`, `description`, `content`, `creator`, `pinned`, `enabled`, timestamps.
- Entry points:
  - `GET /api/memory/list`
  - `GET /api/memory/get`
  - `POST /api/memory/create`
  - `POST /api/memory/update`
  - `POST /api/memory/delete`
