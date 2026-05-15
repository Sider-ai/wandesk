---
name: files
description: File manager for browsing, reading, writing, uploading, downloading, and deleting workspace files.
backend: server/main/api/fs.js
frontend: gui/src/apps/files
database: none
---

# files

- Role: core file management app mounted directly on the main service.
- Frontend: `gui/src/apps/files`
- Backend: `server/main/api/fs.js`
- Data: filesystem only, primarily the project `files/` directory plus allowed roots.
- Roots: `files`, `workspace`, `home`, and explicit `absolute` base paths.
- Entry points:
  - `GET /api/fs/roots`
  - `GET /api/fs/list`
  - `GET /api/fs/read`
  - `POST /api/fs/write`
  - `POST /api/fs/mkdir`
  - `POST /api/fs/delete`
  - `POST /api/fs/upload`
  - `GET /api/fs/download`
