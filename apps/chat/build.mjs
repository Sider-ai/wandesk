// 助理的构建:src/ → public/。源码来自 AGENT 仓库的 web/ui(与之同步,别在这里长出 Wandesk 概念)。
// 改了 src/ 之后在本目录跑:npm install && npm run build
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

// 挂载点是 #app 不是 #root —— 沿用 AGENT 自己的 index.html,写错一个字母就是整页白。
fs.writeFileSync(path.join(pub, "index.html"), `<!doctype html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>助理</title>
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
