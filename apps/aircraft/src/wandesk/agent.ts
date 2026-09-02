// 应用调 AI。**为 v2 改过** —— 打自己的 /api/agent,后端接到 env.AI。
//
// 与旧版的差别:引擎不再是外部的 Claude Code / Codex,而是内核自己的 agent。
// conversationId 仍然收下并回传,但当前内核每轮独立,不做原生续聊。
export type AgentResult = {
  ok: boolean;
  result?: string;
  json?: unknown;
  conversationId?: string;
  tools?: string[];
  engine?: string;
  error?: string;
};

export type AgentOpts = {
  data?: unknown;
  system?: string;
  conversationId?: string;
  schema?: unknown;
  model?: string;
};

export async function agent(_appId: string, prompt: string, opts: AgentOpts = {}): Promise<AgentResult> {
  const r = await fetch("/api/agent", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      prompt,
      data: opts.data,
      system: opts.system,
      conversationId: opts.conversationId,
      schema: opts.schema,
      model: opts.model,
    }),
  });
  return r.json();
}
