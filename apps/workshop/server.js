// 应用工坊 —— 「AI 造应用」这条闭环的落点。
//
// 它本身没有任何特权:调 env.AI.run,而 run 背后的 agent 手里有 write / bash,
// 工作目录就是工作区根。agent 往 apps/<id>/ 写三个文件,内核的目录监听发现变化,
// 广播 apps.changed,桌面立刻长出新图标 —— 全程没人碰宿主源码,没人重启。
//
// 这就是「安装 = 目录存在」的全部含义。
const BRIEF = `你在为 Wandesk 造一个应用。应用 = 工作区里的一个目录,本身是一个标准 Cloudflare Worker 网站。

在工作目录下创建 apps/<id>/,恰好四样东西:

1. apps/<id>/app.json —— 四个字段,不多不少:
   { "id": "<小写英文短横线>", "name": "<中文名>", "icon": "<一个 emoji>", "mounts": { "window": "/" } }
   可以再加一个 "description"(一句话)。

2. apps/<id>/server.js —— Worker:
   export default { async fetch(req, env) { … } }
   - /api/* 自己处理,其余 return env.ASSETS.fetch(req)
   - 数据用 env.DB(D1 接口):env.DB.exec(建表脚本)、
     env.DB.prepare(sql).bind(...).all() / .first() / .run()
   - 要用 AI 就调 env.AI.ask({ summary, prompt, system })。summary 必填,一句中文。
   - 建表用惰性 ensure(首次请求时 exec 一次),不要在模块顶层 await。

3. apps/<id>/public/index.html —— 前端,单文件,自带 <style>。
   与自己的后端同源,直接 fetch("/api/…"),不需要任何 SDK。
   要碰壳(弹提示、改标题)才 <script src="/_wd/sdk.js"></script>,用 window.wandesk.ui.*。

4. apps/<id>/APP.md —— 给 AI 看的说明:第一行 "# 名字(id)",第一段一句话说它是什么,
   后面写数据表和能做什么。内核会把这一句话注入以后每次 AI 调用,让所有 agent 知道有这个应用。

约束:
- 只写这四个文件,不要碰 apps/ 以外的任何东西,不要装依赖;
- 前端用原生 JS,不要 React、不要构建步骤;
- 中文界面,做成能真的用起来的样子,不是占位符;
- 做完用一句话回答造了什么,不要贴代码。`;

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8" } });

export default {
  async fetch(req, env) {
    const url = new URL(req.url);

    if (url.pathname === "/api/build" && req.method === "POST") {
      const { request } = await req.json();
      const want = String(request || "").trim();
      if (!want) return json({ error: "说说你想要什么" }, 400);

      // 流式:造应用要跑好几轮工具,得让用户看见它在干什么
      return env.AI.stream({
        summary: `造应用:${want.slice(0, 24)}`,
        system: BRIEF,
        prompt: `用户想要的应用:${want}`,
      });
    }

    return env.ASSETS.fetch(req);
  },
};
