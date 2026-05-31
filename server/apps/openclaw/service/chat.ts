import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const GATEWAY = "http://localhost:18789";

const getToken = (): string => {
  try {
    const cfg = JSON.parse(readFileSync(join(homedir(), ".openclaw/openclaw.json"), "utf-8"));
    return cfg?.gateway?.auth?.token || "";
  } catch {
    return "";
  }
};

type ChatMessage = { role: string; content: string };

const chat = async ({ message, history = [] }: { message?: string; history?: ChatMessage[] }) => {
  if (!message?.trim()) return { status: 400, message: "message 不能为空" };

  const messages = [
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: message }
  ];

  const token = getToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${GATEWAY}/v1/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify({ model: "openclaw:main", messages, stream: false })
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return { status: res.status, message: `OpenClaw Gateway 错误: ${res.status} ${text}` };
  }

  const data: any = await res.json();
  const reply = data.choices?.[0]?.message?.content || "";
  return { success: true, reply };
};

export { chat };
