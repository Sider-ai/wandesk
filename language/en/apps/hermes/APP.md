---
name: Hermes
description: Operate the local Hermes Agent installation, including status, sessions, chat, dashboard, and scheduled routines.
---

# Hermes

Hermes connects Wandesk to the user's local `hermes` CLI. It is a long-running agent control desk for local sessions, memory, messaging gateways, scheduled routines, and dashboard access.

## API

- `GET /apps/hermes/status`
- `GET /apps/hermes/sessions?limit=20`
- `GET /apps/hermes/messages?sessionId=<id>`
- `GET /apps/hermes/routines`
- `POST /apps/hermes/chat`
- `POST /apps/hermes/dashboard/start`

The app uses local Hermes configuration and never exposes secrets or dashboard session tokens to the browser.
