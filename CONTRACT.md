# Wandesk 应用契约(v1)

> 壳只管画,内核知道一切,应用一律是 worker 网站 —— **没有原生应用,一个例外都没有**。

本文件是唯一正典:manifest 词汇表 = binding 清单 = SDK 文档,一份三用。

## 一、应用 = 工作区里的一个目录,本身是一个标准 Cloudflare Worker 网站

```
<workspace>/apps/<id>/
  app.json     manifest
  APP.md       给 AI 看的说明(必备):第一段一句话简介,内核注入提示词;后面写数据与用法
  server.js    Worker:export default { async fetch(req, env) {…} }
  public/      静态资源(env.ASSETS 读这里)
  src/         前端源码(可选):有它就改它再构建,没有就直接改 public/
  package.json 有 src/ 才有:依赖清单 + build 脚本;node_modules 不随包发,谁改谁装
  data.db      数据 —— 指向真实库的链接,就在代码旁边,你和 AI 都能 sqlite3 撬开
```

真实库在 `<workspace>/.wandesk/store/` 里,由 workerd 自己的 SQLite 管(见「二」);
`data.db` 这个链接是内核在应用第一次开库时挂上的,不用自己建。

「安装」= 目录存在(扫描自动注册);「移除」= 删目录。AI 用 `write` 工具即可造应用,
**不碰宿主源码、不重启**。内核盯着 `apps/`,新目录一落地,桌面立刻长出图标。

预装应用随包发,首次启动落地到工作区;之后与用户自己造的应用再无区别,可改可删。

manifest 只有四个字段(外加可选的 `description`):

```json
{ "id": "notes", "name": "笔记本", "icon": "📔",
  "mounts": { "window": "/", "panel": "/panel.html" } }
```

- **挂载点是路由路径,不是文件名**:`window` 开窗口、`panel` 钉侧栏;至少一个,缺省 `window: "/"`。
  同一应用的两个挂载是两个实例,共享后端与数据。
- 没有 `capabilities` 字段 —— 见「五、当前取舍」。

### APP.md:应用的自我介绍

像 SKILL.md 一样,一个应用一份,放在自己目录里。第一行标题,第一段一句话简介,后面写数据表、能做什么、怎么调它。
内核把所有应用的「图标 + 名字 + 简介」注入每一次 AI 调用的提示词(助理和 `env.AI` 都是),
细节让模型自己 `read apps/<id>/APP.md`。清单没写 `description` 时,简介就取 APP.md 的第一段。

### 源码与产物:代码要能改,依赖不随包发

预装应用带 `src/`(React)和 `package.json`,`public/` 是编出来的产物,开箱即用。想改前端,
在应用目录里 `npm install && npm run build`,产物落回 `public/`,内核目录监听看到变化就刷新窗口。
宿主不参与编译、不带 esbuild、不带 node_modules —— 谁改谁装,需要本机有 Node.js。

`server.js` 永远是源码,改完下一次请求即生效。工坊造的应用是单文件前端,没有 `src/`,直接改 `public/`。

预装应用的升级判据只看 `src/`、`app.json`、`APP.md`、`server.js`、`package.json`;`public/`、`node_modules/`、`data.db` 不算。

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

## 九、语言

界面语言只有中 / 英两种,`"zh" | "en"`。内核的 `data/settings.ts` 是唯一真相:

- **设置键 `language`**:存在设置表里,和模型连接一样一条 KV。`currentLanguage()` 优先读它,
  没设置时看进程环境(`LANG` / `LC_ALL` 以 `en` 开头 → `en`,否则 `zh`)。壳的设置面板改它,
  走的还是现有的 `POST /api/settings`,没有专门的语言接口。
- **切换语言即广播**:`POST /api/settings` 写入的 `language` 只要变了,内核就广播
  `EV.LANGUAGE_CHANGED`(`"language.changed"`,带 `{ language }`)。壳订阅它:自己重渲染,
  并且**重新加载所有打开的应用窗口的 iframe**——应用只在页面加载那一刻读一次
  `window.wandesk.lang`,不重新加载就拿不到新语言。

- **应用怎么拿语言**:`<script src="/_wd/sdk.js">` 引入后,`window.wandesk.lang` 就是当前语言
  字符串(`"zh"` 或 `"en"`);同时内核已经把 `document.documentElement.lang` 设成了
  `zh-CN` / `en`。这个 SDK 是内核**按请求现拼**的,响应带 `cache-control: no-store`——
  别指望浏览器或任何一层缓存住旧语言。

- **应用内的文案约定**:有 `src/wandesk/` 目录的应用,里面有一份 `src/wandesk/i18n.ts`:

  ```ts
  export const lang: "zh" | "en";
  export const t: (key: string, vars?: Record<string, string | number>) => string;
  ```

  文案本体放 `src/locales/zh.json` 和 `src/locales/en.json`(纯 key → 文案的对象),
  组件里只写 `t("key")`,插值用 `{name}` 占位符,`t("greet", { name })` 替换。缺 key 回落中文,
  中文也没有就回显 key 本身——界面永远不会因为漏翻译而崩掉,只会露出没翻译的 key。
  `zh.json` / `en.json` 用 esbuild 原生的 JSON 导入,不需要额外配置。

- **app.json 的双语字段**:`name` 和 `description` 允许是字符串(默认中文),也允许写成

  ```json
  { "name": { "zh": "笔记本", "en": "Notes" }, "description": { "zh": "…", "en": "…" } }
  ```

  内核按 `currentLanguage()` 取,缺当前语言就回落 `zh`,连 `zh` 都没有就取任意一个写了的语言。
  对外(`/api/apps`、注入提示词的 `appsBlock()`)只暴露取好的那个字符串,壳与 AI 都看不到原始的双语对象。

- **`APP.md` 的英文版**:语言是 `en` 且应用目录里有 `APP.en.md` 时读它,否则回落 `APP.md`。
  没有 `APP.en.md` 不是错——大多数应用可以只维护一份中文说明。

- **内核给 AI 的语言说明**:`kernel/apps/scan.ts` 的 `languageBlock()` 生成一段
  「用户界面语言」提示词,接在 `appsBlock()` 之后、`memoryBlock()` 之前,注入
  `kernel/syscall/ai.ts`(`env.AI.ask/run/stream`)与 `kernel/conv/index.ts`(助理应用)的
  每一次 instructions——所有 agent 因此都知道该用中文还是英文回复,不需要应用自己去问。
