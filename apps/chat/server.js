// 助理 —— 产品本体,但它**就是一个普通应用**,没有任何特权。
//
// 这是「没有原生应用」这条规矩最硬的一处证明:连对话都跑在 workerd 里,
// 拿的是和笔记本一模一样的 binding。
//
// 关键在 /api/send:env.AI.stream 返回一个 Response,应用把它原样当自己的响应体
// 透传给前端 —— 这是 workerd 里唯一通的推送路径(同一条 HTTP 请求内的流式响应)。
const SCHEMA = `
CREATE TABLE IF NOT EXISTS turns (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  role       TEXT NOT NULL,
  text       TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

let ready = false;
const ensure = async (env) => { if (!ready) { await env.DB.exec(SCHEMA); ready = true; } };

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8" } });

export default {
  async fetch(req, env) {
    const url = new URL(req.url);

    if (url.pathname === "/api/history") {
      await ensure(env);
      const { results } = await env.DB.prepare("SELECT id, role, text FROM turns ORDER BY id").all();
      return json({ turns: results });
    }

    if (url.pathname === "/api/clear" && req.method === "POST") {
      await ensure(env);
      await env.DB.exec("DELETE FROM turns");
      return json({ ok: true });
    }

    if (url.pathname === "/api/send" && req.method === "POST") {
      await ensure(env);
      const { text } = await req.json();
      const prompt = String(text || "").trim();
      if (!prompt) return json({ error: "空消息" }, 400);

      await env.DB.prepare("INSERT INTO turns (role, text) VALUES ('user', ?)").bind(prompt).run();

      // 内核会在这一刻注入长期记忆与系统提示词。应用什么都不用管。
      return env.AI.stream({
        summary: `助理:${prompt.slice(0, 24)}`,
        prompt,
      });
    }

    // 流跑完后前端把最终文本回存(SSE 途中不写库,省得每个增量都落一次)
    if (url.pathname === "/api/record" && req.method === "POST") {
      await ensure(env);
      const { text } = await req.json();
      await env.DB.prepare("INSERT INTO turns (role, text) VALUES ('assistant', ?)").bind(String(text || "")).run();
      return json({ ok: true });
    }

    return env.ASSETS.fetch(req);
  },
};
