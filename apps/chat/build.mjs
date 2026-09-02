// Build for Assistant: src/ → public/. Source mirrors the AGENT repo's web/ui (keep it in sync, don't grow Wandesk-specific concepts here).
// After changing src/, run in this directory: npm install && npm run build
import esbuild from "esbuild";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const pub = path.join(here, "public");
fs.mkdirSync(pub, { recursive: true });

await esbuild.build({
  entryPoints: [path.join(here, "src/main.tsx")],
  bundle: true,
  format: "esm",
  target: ["es2022"],
  jsx: "automatic",
  minify: true,
  legalComments: "none",
  loader: { ".png": "dataurl", ".svg": "dataurl" },
  outfile: path.join(pub, "app.js"),
  logLevel: "warning",
});

// The mount point is #app, not #root — this follows AGENT's own index.html; one wrong letter and the page goes blank.
fs.writeFileSync(path.join(pub, "index.html"), `<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>Assistant</title>
    <link rel="stylesheet" href="/app.css" />
    <script src="/_wd/sdk.js"></script>
</head>
<body>
    <div id="app"></div>
    <script type="module" src="/app.js"></script>
</body>
</html>
`);

const size = fs.readdirSync(pub).reduce((n, f) => n + fs.statSync(path.join(pub, f)).size, 0);
console.log(`chat: public/ ${Math.round(size / 1024)} KB`);
