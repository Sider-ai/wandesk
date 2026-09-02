# Wandesk 应用契约(v1)

> 壳只管画,内核知道一切,应用一律是 worker 网站 —— **没有原生应用,一个例外都没有**。

本文件是唯一正典:manifest 词汇表 = binding 清单 = SDK 文档,一份三用。

## 一、应用 = 工作区里的一个目录,本身是一个标准 Cloudflare Worker 网站

```
<workspace>/apps/<id>/
  app.json     manifest
  server.js    Worker:export default { async fetch(req, env) {…} }
  public/      静态资源(env.ASSETS 读这里)
  data.db      数据 —— 指向真实库的链接,就在代码旁边,你和 AI 都能 sqlite3 撬开
```

真实库在 `<workspace>/.wandesk/store/` 里,由 workerd 自己的 SQLite 管(见「二」);
`data.db` 这个链接是内核在应用第一次开库时挂上的,不用自己建。

「安装」= 目录存在(扫描自动注册);「移除」= 删目录。AI 用 `write` 工具即可造应用,
**不碰宿主源码、不重编译、不重启**。内核盯着 `apps/`,新目录一落地,桌面立刻长出图标。

预装应用随包发,首次启动落地到工作区;之后与用户自己造的应用再无区别,可改可删。

manifest 只有四个字段(外加可选的 `description`):

```json
{ "id": "notes", "name": "笔记本", "icon": "📔",
  "mounts": { "window": "/", "panel": "/panel.html" } }
```

- **挂载点是路由路径,不是文件名**:`window` 开窗口、`panel` 钉侧栏;至少一个,缺省 `window: "/"`。
  同一应用的两个挂载是两个实例,共享后端与数据。
- 没有 `capabilities` 字段 —— 见「五、当前取舍」。

## 二、架构:workerd 是唯一的用户态

```
壳(桌面 / 窗口 / 任务栏 / 壁纸)              ← 只管画,不知道「笔记」是什么
──────────────────────────────────────────
内核  env.AI —— 唯一的智能面,知道一切
      其余 binding:DB / ASSETS / PROC / FS / UI
──────────────────────────────────────────
应用(全部,含助理 / 文件 / 应用工坊)          ← 纯计算 worker,一视同仁
```

与 Cloudflare 平台同构 —— 不是比喻,是同一套写法:

| binding | 本地 | 上云对应 |
|---|---|---|
| `env.DB` | workerd 内置 SQLite(`.wandesk/store/`,`apps/<id>/data.db` 是链接) | **D1**(接口一致,代码一行不改) |
| `env.ASSETS` | `apps/<id>/public/` | Workers Assets |
| `env.AI` / `PROC` / `FS` / `UI` | Wandesk 专有 | 无,上云时降级 |

```js
export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname === "/api/notes") {
      const { results } = await env.DB.prepare("SELECT * FROM notes ORDER BY id DESC").all();
      return Response.json(results);
    }
    return env.ASSETS.fetch(req);
  },
};
```

**前端与自己的后端同源**,直接 `fetch("/api/…")`,不需要任何 SDK。
**出网直接 `fetch()`**,没有白名单、没有代发。

`env.DB` 不回内核:每个应用一个 Durable Object(`AppStore`),SQLite 引擎就在 workerd 进程里 ——
D1 在 Cloudflare 上本来就是这么搭的。查询不再经过 Node,应用再多也不会把内核堵住。
内核与 AI 要动应用数据,走内核的 `POST /api/apps/db { id, sql, params }`,它和应用的 `env.DB` 是同一个执行端;
只读排查直接 `sqlite3 apps/<id>/data.db` 也行。

## 三、env.AI —— 唯一的智能面

Wandesk 与普通 worker 平台的分界线,也是「Apps share context」的落点:

> **应用之间不共享数据,应用共享的是同一个知道一切的 agent。**

应用不需要知道系统里有什么,它只说一句话。记忆、上下文、工具的汇聚发生在内核那一层 ——
内核因此不必长出任何领域概念,它永远不知道「书签」是什么。

| API | 用途 |
|---|---|
| `env.AI.ask({ summary, prompt, system?, data? })` | 一次性补全,无工具。要个标题、润色一段文字 |
| `env.AI.run({ summary, prompt })` | 完整 agent 轮次,带 `bash` / `read` / `write` / `edit`,返回最终文本 |
| `env.AI.stream({ summary, prompt })` | 同 `run`,返回一个 `Response` —— **应用直接 `return` 它**,SSE 一路透到自己的前端 |

- **`summary` 必填**,一句中文,落活动流水 —— 用户在任务栏看得见哪个应用在烧 token;
- 内核是 AGENT 仓库的 `ai/` + `agent/`,协议驱动化(`responses` / `chat` 双驱动),换供应商只换 URL。
  **改内核必须两边同步**,它不在日常迭代范围;
- `stream` 走「同一条 HTTP 请求内的流式响应」—— workerd 里唯一通的推送路径,见「七」。

```js
// 助理应用的全部后端逻辑
if (url.pathname === "/api/send") {
  const { text } = await req.json();
  return env.AI.stream({ summary: `助理:${text.slice(0, 24)}`, prompt: text });
}
```

## 四、其余 binding

| binding | API |
|---|---|
| `env.DB` | D1 接口:`prepare(sql).bind(…).all() / .first() / .run() / .raw()`、`exec(建表脚本)`、`batch([…])`(一个事务) |
| `env.ASSETS` | `fetch(req)` 读 `public/`;未命中且不像文件名时回落 `index.html`(SPA) |
| `env.PROC` | 受管子进程:`spawn(cmd, args, cwd)` / `exec(…)` / `list()` / `log(id, tail)` / `kill(id)` |
| `env.FS` | 用户真实文件(相对工作区根):`list` / `read` / `readBase64` / `write` / `mkdir` / `delete` |
| `env.UI` | 壳:`toast(text)` / `openApp(id, route)` / `openExternal(url)` |
| `env.log(...)` | 服务端日志回流内核控制台 —— AI 调试自己写的后端要看得见 |

前端另有一份镜像 `<script src="/_wd/sdk.js">`,只在要碰**壳本身**时用:

```js
window.wandesk.context()                     // { appId, mount }
window.wandesk.ui.toast / confirm / title / openApp / openExternal / copyText / close
window.wandesk.on(event, fn) / emit(event, payload)   // 同应用实例间(窗口 ↔ 面板)
```

## 五、每个应用一个 origin

应用挂在 **`http://<token>.localhost:<port>/`** —— 它站在自己网站的根上。
这不是细节,是契约成立的前提:`/style.css`、`fetch("/api/…")` 这些绝对路径必须对。
(早期把应用挂在 `/app/<token>/` 路径前缀下,绝对路径全都逃出应用根,契约立不住。)

- **token 跨重启稳定**:由「装机密钥 + appId」HMAC 推导。否则 origin 每次启动都变,
  应用的 `localStorage` / `IndexedDB` 每次重启都清空;
- **origin 天然隔开**:应用之间不会串 `localStorage`,壳在另一个 origin 上,iframe 碰不到壳的 DOM;
- `*.localhost` 由浏览器直接解析到 127.0.0.1(Chromium / Firefox 原生支持)。
  桌面壳是 Electron,所以生产路径稳;Safari 不支持 `*.localhost`,浏览器模式下请用 Chrome。

## 六、当前取舍:能力全开

**应用无需声明,所有 binding 一律可用。** 理由:应用是用户与 AI 自己造的,不是应用商店;
能力网关是拿隔离换体验,在这个场景下损失大于收益。

`appId` 随每次 syscall 由 `HostGate` 下传,应用伪造不了。留着零成本,哪天要收口有地方收。

> ⚠️ 应用能出网、能起进程、能读写真实文件,`env.AI.run` 背后的 agent 手里有无沙箱 `bash`。
> 这是本地 agent 工具的常态,与 `bash` 工具本身同一量级的信任假设。

## 七、数据产权

- **领域数据归应用**:自己的库里自建 schema;内核不提供任何域 API —— 这是 AI 能无限造应用的前提。
  删掉应用目录不会删它的库(和删 Worker 不会删 D1 一样),数据留在 `.wandesk/store/`,重装即回来;
- **产品本体数据归内核**:记忆、活动流水只经 `env.AI` 汇聚,应用读不到原文;
- **真实文件归用户**:`env.FS`,一律锁在工作区内。

## 八、已知边界

- **服务端→客户端推送**:同一条 HTTP 请求内可用(流式响应 / SSE,`env.AI.stream` 即走此路);
  后端主动找别的连接推事件做不到 —— workerd 会判定跨请求上下文并取消。
  要旁路推送与定时唤醒(alarms),需把会话搬进 Durable Object —— `env.DB` 已经站在 DO 上了,这一步不远。
- 应用后端**按需装载**(首个请求才起),按 `server.js` 内容哈希做版本键 —— 改完下次请求即新版。
- workerd 单平台约 150MB,Windows / Linux 需各带一份二进制。
