import { runHermes } from "./exec.js";
import { listSessions } from "./sessions.js";

const parseQuietOutput = (stdout: string) => {
  const lines = stdout.replace(/\r/g, "").split("\n");
  let sessionId = "";
  const bodyLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    const sessionMatch = trimmed.match(/^session_id:\s*(\S+)/i);
    if (sessionMatch) {
      sessionId = sessionMatch[1];
      continue;
    }
    if (/^↻\s*Resumed session/i.test(trimmed)) continue;
    if (!trimmed && !bodyLines.length) continue;
    bodyLines.push(line);
  }

  return { sessionId, reply: bodyLines.join("\n").trim() };
};

const chat = async ({
  message,
  sessionId,
  model,
  provider,
  timeout = 240
}: {
  message?: string;
  sessionId?: string;
  model?: string;
  provider?: string;
  timeout?: number;
}) => {
  if (!message?.trim()) return { status: 400, message: "message is required" };

  const safeTimeout = Math.max(30, Math.min(Number(timeout) || 240, 900));
  const args = ["chat", "-q", message.trim(), "-Q", "--source", "tool"];
  if (sessionId?.trim()) args.push("--resume", sessionId.trim());
  if (model?.trim()) args.push("--model", model.trim());
  if (provider?.trim()) args.push("--provider", provider.trim());

  const started = Date.now();
  try {
    const raw = await runHermes(args, (safeTimeout + 20) * 1000);
    const parsed = parseQuietOutput(raw.stdout);
    if (!parsed.reply) return { status: 500, message: "Hermes did not return a reply" };
    let resolvedSessionId = parsed.sessionId || sessionId || "";
    if (!resolvedSessionId) {
      const recent = await listSessions(1);
      const first = Array.isArray((recent as any).sessions) ? (recent as any).sessions[0] : null;
      if (first?.id) resolvedSessionId = first.id;
    }
    return {
      success: true,
      reply: parsed.reply,
      meta: {
        sessionId: resolvedSessionId,
        durationMs: Date.now() - started,
        model: model || "",
        provider: provider || ""
      }
    };
  } catch (err: any) {
    return { status: 500, message: err?.message || "Hermes chat failed" };
  }
};

export { chat };
