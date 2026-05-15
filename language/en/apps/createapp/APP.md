---
name: createapp
description: App creator that generates and modifies application code through conversation.
backend: server/apps/createapp
frontend: gui/src/apps/createapp
database: database/apps/createapp.db
---

# createapp

- Role: an app generation and transformation tool for developers.
- Frontend: `gui/src/apps/createapp`
- Backend: `server/apps/createapp`
- Data: `database/apps/createapp.db`
- Entry point: `/apps/createapp/*`
- Conventions:
  - Use `/api/runtime/reload/request` first after code changes
  - Use `/api/runtime/reload/test` only for preflight validation
