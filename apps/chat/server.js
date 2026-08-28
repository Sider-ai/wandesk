// 助理 —— 界面来自 AGENT 仓库的 web/ui,后端就是内核的会话面。
//
// 整个后端只有两行:这正是「没有原生应用」想证明的事 ——
// 连对话都只是个普通应用,拿的是和记账本一模一样的 binding,没有任何特权。
//
// env.AI.fetch 把请求原样转给内核的会话 API(对话 / 消息 / 常驻 SSE / 设置 / 附件),
// 所以 AGENT 那套 UI 一行没改就能跑;换一套 UI 接同一个口子也一样。
export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname.startsWith("/api/")) return env.AI.fetch(req);
    return env.ASSETS.fetch(req);
  },
};
