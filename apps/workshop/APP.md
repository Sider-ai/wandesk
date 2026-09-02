# App Workshop (workshop)

Describe what you want in one sentence, and it hands the request to an agent, which writes app.json, server.js, public/index.html, and APP.md into `apps/<id>/`, and the desktop gets a new icon right away.

## What it can do

- Build a new app: describe the feature, watch it write the code in a live stream.
- Change an existing app: tell it which one, and it edits that directory directly.
- Apps it builds have no build step — the front end is a single file anyone can open and edit.

## Layout and customization

- The BRIEF constant in `server.js` is the rulebook the agent follows when building an app; changing it changes what the workshop produces.
- `public/index.html` is the single-file front end.
