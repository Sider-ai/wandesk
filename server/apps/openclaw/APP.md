---
name: openclaw
description: OpenClaw app that wraps the local openclaw CLI and Gateway in an AIOS chat interface.
backend: server/apps/openclaw
---

# openclaw

- Role: detect the local OpenClaw CLI, forward chat to the OpenClaw Gateway, and manage OpenClaw cron jobs.
- Backend: `server/apps/openclaw`
- Data: none locally — all state lives on the OpenClaw side (CLI + Gateway).
- Runtime dependency: local `openclaw` CLI and the OpenClaw Gateway listening on `localhost:18789`.
- Auth: chat requests read the bearer token from `~/.openclaw/openclaw.json` (`gateway.auth.token`) when present.

## Entry points

### `GET /apps/openclaw/status`
Detects the CLI and Gateway.
- Response: `{ online: boolean, version: string | null, gateway: boolean }`
- `online` is `false` (version `null`, "not installed") when `openclaw --version` fails.
- `gateway` is `true` when `http://localhost:18789/` responds (status `< 500`).

### `GET /apps/openclaw/cron/list`
Lists OpenClaw cron jobs via `openclaw cron list --json`.
- Response: `{ success: true, jobs: Job[] }`
- Each `Job` is normalized with `schedule` (`{ cron }` | `{ at }` | `{ every }`), `prompt`, and `lastRunAt` (`YYYY-MM-DD HH:MM:SS` or empty).
- Error: `{ success: false, message }` with a non-200 status.

### `POST /apps/openclaw/cron/add`
Adds a cron job via `openclaw cron add`.
- Body: `{ name: string, schedule: { cron?, at?, every? }, prompt: string, sessionTarget?: string }`
- `name` and `prompt` are required (`400` otherwise).
- Response: `{ success: true, output: string }`.

### `POST /apps/openclaw/cron/run`
Runs a cron job now via `openclaw cron run <jobId> --session main`.
- Body: `{ jobId: string }` (required, `400` otherwise).
- Response: `{ success: true, output: string }`.

### `POST /apps/openclaw/cron/delete`
Deletes a cron job via `openclaw cron delete <jobId>`.
- Body: `{ jobId: string }` (required, `400` otherwise).
- Response: `{ success: true, output: string }`.

### `POST /apps/openclaw/chat`
Forwards a chat to the OpenClaw Gateway (`POST http://localhost:18789/v1/chat/completions`, model `openclaw:main`, non-streaming).
- Body: `{ message: string, history?: { role, content }[] }`
- `message` is required (`400` otherwise).
- Response: `{ success: true, reply: string }`.
- Gateway errors are surfaced as `{ success: false, message }` with the upstream status.
