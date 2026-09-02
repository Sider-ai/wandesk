// Small HTTP helpers. The api layer is thin — it only parses requests / assembles responses; the actual logic lives in syscall and data.
import type { IncomingMessage, ServerResponse } from "http";

export const json = (res: ServerResponse, status: number, body: unknown): true => {
  const text = JSON.stringify(body);
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  res.end(text);
  return true;
};

export const text = (res: ServerResponse, status: number, body: string, type = "text/plain; charset=utf-8"): true => {
  res.writeHead(status, { "content-type": type, "cache-control": "no-cache" });
  res.end(body);
  return true;
};

export const readJson = async (req: IncomingMessage): Promise<Record<string, unknown>> => {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += (chunk as Buffer).length;
    if (size > 32 * 1024 * 1024) throw new Error("Request body too large");
    chunks.push(chunk as Buffer);
  }
  if (!chunks.length) return {};
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { return {}; }
};
