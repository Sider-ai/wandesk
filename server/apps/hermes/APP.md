---
name: Hermes
description: Operate the local Hermes Agent installation, including status, sessions, chat, dashboard, and scheduled routines.
---

# Hermes

Hermes connects Wandesk to the user's local `hermes` CLI. It is a long-running agent control desk for local sessions, memory, messaging gateways, scheduled routines, and dashboard access.

## API

- `GET /apps/hermes/status`
  - Detects the local Hermes CLI and returns version, model, provider, dashboard state, gateway state, session count, and cron job count.
- `GET /apps/hermes/sessions?limit=20`
  - Reads the local Hermes SQLite state store and returns recent sessions.
- `GET /apps/hermes/messages?sessionId=<id>`
  - Reads messages for a Hermes session.
- `GET /apps/hermes/routines`
  - Lists Hermes cron routines.
- `POST /apps/hermes/chat`
  - Body: `{ "message": "...", "sessionId": "optional existing session id" }`
  - Calls `hermes chat -q ... -Q --source tool`, optionally resuming an existing session, and returns the final reply plus the session id.
- `POST /apps/hermes/dashboard/start`
  - Starts `hermes dashboard --no-open --port 9119` if needed and returns the local dashboard URL.

## Notes

- The app uses the user's installed Hermes configuration and credentials. It never exposes `.env` or dashboard session tokens to the browser.
- Dashboard details are intentionally proxied through Wandesk backend APIs where needed.
- Gateway may be stopped while chat still works; gateway primarily affects message channels and cron delivery.
