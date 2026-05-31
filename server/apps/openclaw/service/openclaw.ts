import { runCmd } from "./exec.js";

type OpenClawRun = {
  stdout: string;
  stderr: string;
};

const jsonStarts = (text: string) => {
  const starts: number[] = [];
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (char === "{" || char === "[") starts.push(index);
  }
  return starts;
};

const parseJsonFromText = (text: string): any | null => {
  const trimmed = String(text || "").trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    // OpenClaw can print transport diagnostics before the JSON payload.
  }
  for (const start of jsonStarts(trimmed)) {
    try {
      return JSON.parse(trimmed.slice(start));
    } catch {
      // Try the next possible JSON boundary.
    }
  }
  return null;
};

const commandLabel = (args: string[]) => `openclaw ${args.join(" ")}`;

const runOpenClaw = async (args: string[], timeout = 15000): Promise<OpenClawRun> => {
  const result = await runCmd("openclaw", args, { timeout });
  if (!result.ok) {
    const detail = result.stderr?.trim() || result.stdout?.trim() || `${commandLabel(args)} failed`;
    throw new Error(detail);
  }
  return { stdout: result.stdout, stderr: result.stderr };
};

const runOpenClawJson = async (args: string[], timeout = 15000): Promise<{ data: any; raw: OpenClawRun }> => {
  const raw = await runOpenClaw(args, timeout);
  const data = parseJsonFromText(raw.stdout);
  if (!data) throw new Error(`${commandLabel(args)} 输出解析失败`);
  return { data, raw };
};

export { parseJsonFromText, runOpenClaw, runOpenClawJson };
