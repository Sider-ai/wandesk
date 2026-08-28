// 把 appsrc/ 里的 React 应用编译成 v2 形制的 worker 网站。
//
// 源码原样来自 wandesk-skill,**一行没改** —— 唯一为 v2 改过的是
// appsrc/system/lib/{db,agent,http}.ts 这三个客户端垫片(它们本来就是宿主提供的)。
//
// 产物是标准的三件套:
//   apps/<id>/app.json    manifest(meta 里的原件 + mounts)
//   apps/<id>/server.js   统一后端:/api/db → env.DB,/api/agent → env.AI,/api/http → fetch()
//   apps/<id>/public/     index.html + app.js + app.css(esbuild 打包)
import esbuild from "esbuild";
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "appsrc");
const OUT = path.join(ROOT, "apps");
const TMP = path.join(SRC, ".entry");

const ids = fs.readdirSync(path.join(SRC, "apps"), { withFileTypes: true })
  .filter((e) => e.isDirectory()).map((e) => e.name).sort();

// ── 统一后端模板 ───────────────────────────────────────────────
// 每个应用都是同一份:把三个客户端垫片接到三个 binding 上,其余交给 env.ASSETS。
const serverTemplate = (id, schema) => `// ${id} —— 由 appsrc/build.mjs 生成,改这里会被下次构建覆盖。
// 前端源码在 appsrc/apps/${id}/,改完跑 \`npm run build:apps\`。
//
// 应用即网站:静态资源与 API 都由它自己应答。三个 API 是从 wandesk-skill 平移过来的
// 宿主能力,现在接在自己的 binding 上 —— 应用前端一行没改。
const SCHEMA = ${JSON.stringify(schema)};

let ready = false;
const ensure = async (env) => {
  if (ready) return;
  if (SCHEMA) await env.DB.exec(SCHEMA);
  ready = true;
};

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8" } });

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (!url.pathname.startsWith("/api/")) return env.ASSETS.fetch(req);

    try {
      // ── 自己的库(D1) ──
      if (url.pathname === "/api/db") {
        await ensure(env);
        const { sql, params } = await req.json();
        const stmt = env.DB.prepare(String(sql || ""));
        const r = await (Array.isArray(params) && params.length ? stmt.bind(...params) : stmt).all();
        return json({ ok: true, rows: r.results, changes: r.meta?.changes ?? 0, lastInsertRowid: r.meta?.last_row_id ?? 0 });
      }

      // ── 唯一的智能面 ──
      if (url.pathname === "/api/agent") {
        const { prompt, data, system, schema } = await req.json();
        const want = schema
          ? "\\n\\n只输出符合下面 JSON Schema 的 JSON,不要代码围栏、不要解释:\\n" + JSON.stringify(schema)
          : "";
        const out = await env.AI.ask({
          summary: \`${id}:\` + String(prompt || "").slice(0, 24),
          system: String(system || ""),
          prompt: String(prompt || "") + want,
          data,
        });
        if (!out.ok) return json({ ok: false, error: out.error });
        let parsed;
        if (schema) {
          try { parsed = JSON.parse(String(out.text).trim().replace(/^\\\`\\\`\\\`[a-z]*\\n?|\\\`\\\`\\\`$/g, "")); } catch { /* 模型没给出合法 JSON */ }
        }
        return json({ ok: true, result: out.text, json: parsed, engine: "wandesk" });
      }

      // ── 出网:能力全开,后端直接 fetch ──
      if (url.pathname === "/api/http") {
        const { url: target, method, headers, body } = await req.json();
        const res = await fetch(String(target), { method: method || "GET", headers, body });
        return json({ ok: res.ok, status: res.status, body: await res.text() });
      }

      return json({ ok: false, error: "not found" }, 404);
    } catch (e) {
      return json({ ok: false, error: String(e?.message || e) });
    }
  },
};
`;

const page = (name) => `<!doctype html>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${name}</title>
<link rel="stylesheet" href="/app.css" />
<script src="/_wd/sdk.js"></script>
<div id="root"></div>
<script type="module" src="/app.js"></script>
`;

fs.mkdirSync(TMP, { recursive: true });
const built = [];

for (const id of ids) {
  const metaDir = path.join(SRC, "meta", id);
  const manifest = JSON.parse(fs.readFileSync(path.join(metaDir, "app.json"), "utf8"));
  const schemaFile = path.join(metaDir, "schema.sql");
  const schema = fs.existsSync(schemaFile) ? fs.readFileSync(schemaFile, "utf8") : "";

  const outDir = path.join(OUT, id);
  const pub = path.join(outDir, "public");
  fs.rmSync(pub, { recursive: true, force: true });
  fs.mkdirSync(pub, { recursive: true });

  // 入口:应用本身导出的是一个组件(壳原来负责挂载),现在自己挂
  const entry = path.join(TMP, `${id}.tsx`);
  fs.writeFileSync(entry, `import { createRoot } from "react-dom/client";
import "../system/base.css";
import App from "../apps/${id}/index";
createRoot(document.getElementById("root")).render(<App appId=${JSON.stringify(id)} />);
`);

  await esbuild.build({
    entryPoints: [entry],
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

  fs.writeFileSync(path.join(pub, "index.html"), page(manifest.name || id));
  fs.writeFileSync(path.join(outDir, "server.js"), serverTemplate(id, schema));
  fs.writeFileSync(path.join(outDir, "app.json"), JSON.stringify({
    id: manifest.id || id,
    name: manifest.name || id,
    icon: manifest.icon || "📦",
    description: manifest.description || "",
    mounts: { window: "/" },
  }, null, 2) + "\n");

  const size = fs.readdirSync(pub).reduce((n, f) => n + fs.statSync(path.join(pub, f)).size, 0);
  built.push({ id, name: manifest.name, kb: Math.round(size / 1024) });
}

fs.rmSync(TMP, { recursive: true, force: true });
console.log(`\n构建了 ${built.length} 个应用:`);
for (const b of built) console.log(`  ${b.id.padEnd(11)} ${String(b.name).padEnd(10)} ${String(b.kb).padStart(5)} KB`);
