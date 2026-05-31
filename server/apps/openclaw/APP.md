---
name: openclaw
description: OpenClaw desk for the local CLI, Gateway, agent sessions, models, and scheduled work.
backend: server/apps/openclaw
---

# openclaw

- Role: detect the local OpenClaw CLI, drive `openclaw agent`, inspect Gateway/model/session state, and manage OpenClaw cron jobs.
- Backend: `server/apps/openclaw`
- Data: none locally — all state lives on the OpenClaw side (CLI + Gateway).
- Runtime dependency: local `openclaw` CLI and the OpenClaw Gateway listening on `localhost:18789`.
- Auth: Wandesk shells out to the local CLI. The CLI is responsible for Gateway tokens, model auth, and fallback behavior.

## Entry points

### `GET /apps/openclaw/status`
Detects the CLI, Gateway, default model, and recent session count.
- Response includes `online`, `version`, `gateway`, `serviceStatus`, `authCapability`, `model`, `modelConfigured`, `sessionsCount`, and dashboard URL.
- `online` is `false` (version `null`, "not installed") when `openclaw --version` fails.
- `gateway` is `true` when `openclaw gateway status --json` or the local dashboard probe succeeds.

### `GET /apps/openclaw/models`
Lists OpenClaw models via `openclaw models list --json`.
- Response: `{ success: true, count: number, models: Model[] }`.

### `POST /apps/openclaw/models/set`
Sets the default OpenClaw model via `openclaw models set <model>`.
- Body: `{ model: string }`
- Response: `{ success: true, output: string }`.

### `GET /apps/openclaw/sessions`
Lists recent OpenClaw sessions via `openclaw sessions --json --limit 20`.
- Response: `{ success: true, count: number, sessions: Session[] }`.

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
Runs one OpenClaw agent turn through the local CLI.
- Command: `openclaw agent --agent main --session-key <sessionKey> --message <message> --json`
- Body: `{ message: string, sessionKey?: string, agentId?: string, model?: string, thinking?: string, timeout?: number }`
- `message` is required (`400` otherwise).
- Response: `{ success: true, reply: string, meta }`.
- Gateway pairing issues can still be handled by OpenClaw's embedded fallback when its local provider auth is valid.
