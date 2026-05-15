---
name: finance
description: Ledger app for recording income, expenses, and notes.
backend: server/apps/finance
frontend: gui/src/apps/finance
database: database/apps/finance.db
---

# finance

- Role: a lightweight bookkeeping app.
- Frontend: `gui/src/apps/finance`
- Backend: `server/apps/finance`
- Data: `database/apps/finance.db`
- Entry points:
  - `GET /apps/finance/list`
  - `POST /apps/finance/create`
  - `POST /apps/finance/delete`
