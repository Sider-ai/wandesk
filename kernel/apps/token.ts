// token 是**路由键**,不是权限凭据(能力全开,见 APP.md「当前取舍」)。
//
// overseer 靠 /app/<token>/… 认出这是哪个应用的请求 —— 应用的 URL 里带着它,
// 所以一个 token 只能对应一个应用,否则应用甲能用自己 URL 里的 token 去冒充应用乙。
// 每次进程启动重新生成。
import { randomBytes } from "crypto";

const byToken = new Map<string, string>();
const byApp = new Map<string, string>();

export const appToken = (appId: string): string => {
  const existing = byApp.get(appId);
  if (existing) return existing;
  const token = randomBytes(16).toString("hex");
  byToken.set(token, appId);
  byApp.set(appId, token);
  return token;
};

export const appIdForToken = (token: string): string | null => byToken.get(String(token || "")) ?? null;
