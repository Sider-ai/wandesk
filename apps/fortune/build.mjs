// This app's build: src/ → public/. After editing src/, run in this directory:
//   npm install && npm run build
// The output (public/app.js + app.css + index.html) lands back here, and the window
// picks it up on refresh. The host takes no part in compiling and carries no dependencies.
import esbuild from "esbuild";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(fs.readFileSync(path.join(here, "app.json"), "utf8"));
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
  loader: { ".png": "dataurl", ".jpg": "dataurl", ".svg": "dataurl" },
  outfile: path.join(pub, "app.js"),
  logLevel: "warning",
});

fs.writeFileSync(path.join(pub, "index.html"), `<!doctype html>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${manifest.name || manifest.id}</title>
<link rel="stylesheet" href="/app.css" />
<script src="/_wd/sdk.js"></script>
<div id="root"></div>
<script type="module" src="/app.js"></script>
`);

const size = fs.readdirSync(pub).reduce((n, f) => n + fs.statSync(path.join(pub, f)).size, 0);
console.log(`${manifest.id}: public/ ${Math.round(size / 1024)} KB`);
