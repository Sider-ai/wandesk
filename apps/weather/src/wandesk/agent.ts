// The app calling AI. **Changed for v2** — hits its own /api/agent, backend
// wired to env.AI.
//
// Difference from the old version: the engine is no longer an external
// Claude Code / Codex, but the kernel's own agent. conversationId is still
// accepted and echoed back, but the current kernel treats each turn
// independently and doesn't do native follow-up conversation.
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
