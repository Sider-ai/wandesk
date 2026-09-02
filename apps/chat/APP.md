# Assistant (chat)

Talk to the agent inside the kernel. It has bash / read / write / edit, its working directory is the workspace root, and it can actually get things done: edit files, build apps, run commands.

## What it can do

- Multiple sessions, with history stored in the kernel database; every call sees the list of apps already installed on the desktop plus long-term memory.
- It calls the same agent shared by all apps (`env.AI`), with no special privileges.

## Layout and changes

- `src/` frontend source (React, mirrored from the AGENT repo's web/ui — keep it in sync) · `public/` build output · `server.js` backend, edit directly.
- To change the frontend: in this directory run `npm install && npm run build`.
