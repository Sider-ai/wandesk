---
name: ghtrending
description: GitHub trending discovery app with repository analysis and digest generation.
backend: server/apps/ghtrending
frontend: gui/src/apps/ghtrending
database: database/apps/ghtrending.db
---

# ghtrending

- Role: lists recently created popular GitHub repositories, analyzes selected repositories, and stores analysis history.
- Frontend: `gui/src/apps/ghtrending`
- Backend: `server/apps/ghtrending`
- Data: `database/apps/ghtrending.db`
- External service: GitHub Search API
- Entry points:
  - `GET /apps/ghtrending/list`
  - `POST /apps/ghtrending/analyze`
  - `POST /apps/ghtrending/digest`
  - `POST /apps/ghtrending/check`
  - `GET /apps/ghtrending/history`
