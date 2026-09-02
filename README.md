# Wandesk

> 一个壳,一个知道一切的 AI 内核,一个 workerd。剩下的全是应用。

## 跑起来

```bash
npm install
npm run build:overseer   # 编 overseer(workerd 里的那层监理)
npm run dev              # 内核 9600 + 壳 5180
```

打开 <http://localhost:5180>,右键桌面 →「个性化」旁边的「设置」填模型(任何
Responses 或 Chat Completions 兼容接口),然后双击「应用工坊」,说一句话造个应用。

生产态单端口:

```bash
npm run build && npm start   # http://localhost:9600
```

## 它是怎么搭的

```text
shell/          🖥 壳:只管画
  ui/           React —— 桌面、窗口、任务栏、AppFrame(应用的 iframe 宿主)
  desktop/      Electron:拉起内核,窗口指向它
kernel/         🧠 内核:知道一切
  ai/ agent/    AI 内核(与 AGENT 仓库双向同步,纯 JS 零依赖)
  syscall/      一个文件一个 binding:ai / db / assets / proc / fs / ui
  apps/         应用生命周期:扫描 / token / 预装落地 / 目录监听
  memory/       长期记忆 —— 只经 env.AI 注入,应用读不到原文
  data/         内核自己的 SQLite(会话 / 记忆 / 设置 / 活动流水)
runtime/        ⚙️ workerd:应用的用户态
  overseer.js   路由 <token>.localhost + 注入 binding 垫片 + AppStore(env.DB 的 SQLite 就在这)
  supervisor.ts 起停 workerd
apps/           📦 预装应用 —— 每个都是完整的 Worker 网站
  chat/ notes/ files/ weather/ workshop/
```

## 一个应用长什么样

```text
apps/notes/
├── app.json     { id, name, icon, mounts }   ← 四个字段,没了
├── server.js    export default { async fetch(req, env) {…} }
└── public/      index.html + style.css
```

**「安装」= 目录存在,「移除」= 删目录。** AI 用 `write` 造应用,宿主零改动、不重启 ——
新目录一落地,桌面立刻长出图标。

完整契约见 **[APP.md](APP.md)**;仓库约定见 [AGENTS.md](AGENTS.md)。

## 每个应用一个 origin

应用挂在 `http://<token>.localhost:<port>/` —— 站在自己网站的根上,
所以 `/style.css`、`fetch("/api/…")` 这些绝对路径都成立,`localStorage` 也彼此隔开。
token 由装机密钥推导、跨重启稳定。

## 没有原生应用

活动栏和桌面上的一切都是应用,**包括助理和文件**。它们和你自己造的应用拿一样的
binding、跑在同一个 workerd 里、数据落在自己的库里(`apps/<id>/data.db` 能直接撬)。

壳里唯一不是应用的是「设置」和「个性化」—— 它们配置的是框架本身。
凡是「配置框架」的属于壳,凡是「做事」的一律是应用。

## env.AI:唯一的智能面

> 应用之间不共享数据,应用共享的是同一个知道一切的 agent。

应用不需要知道系统里有什么,它只说一句话:

```js
return env.AI.stream({ summary: "助理:回答用户", prompt: text });
```

记忆、上下文、工具的汇聚发生在内核。内核因此不必长出任何领域概念 ——
它永远不知道「笔记」是什么,这是 AI 能无限造应用的前提。

## 几句实话

- `env.AI.run` 背后的 agent 手里有**无沙箱 bash**,能力也是全开的 —— 只在你信任的机器上用。
- 提示词与注释均为中文。
- workerd 单平台约 150MB,发行包要带。
