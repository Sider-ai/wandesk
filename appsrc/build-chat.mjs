// 把 AGENT 仓库的 web/ui 编译成「助理」应用的 public/。
// 源码原样,一行没改;@shared 指向它自带的事件契约。
import esbuild from "esbuild";
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "appsrc/agent-ui");
const PUB = path.join(ROOT, "apps/chat/public");

fs.rmSync(PUB, { recursive: true, force: true });
fs.mkdirSync(PUB, { recursive: true });

await esbuild.build({
  entryPoints: [path.join(SRC, "src/main.tsx")],
  bundle: true,
  format: "esm",
  target: ["es2022"],
  jsx: "automatic",
  minify: true,
  legalComments: "none",
  alias: { "@shared": path.join(SRC, "shared") },
  loader: { ".png": "dataurl", ".svg": "dataurl" },
  outfile: path.join(PUB, "app.js"),
  logLevel: "warning",
});

fs.writeFileSync(path.join(PUB, "index.html"), `<!doctype html>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>助理</title>
<link rel="stylesheet" href="/app.css" />
<script src="/_wd/sdk.js"></script>
<div id="root"></div>
<script type="module" src="/app.js"></script>
`);

const size = fs.readdirSync(PUB).reduce((n, f) => n + fs.statSync(path.join(PUB, f)).size, 0);
console.log(`助理界面已编译:${Math.round(size / 1024)} KB`);
