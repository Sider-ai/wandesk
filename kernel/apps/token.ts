// token 是**路由键**,不是权限凭据(能力全开,见 CONTRACT.md「当前取舍」)。
//
// 应用挂在 `http://<token>.localhost:<port>/` —— 每个应用一个**真正的 origin 根**。
// 这一点很关键:应用是完整网站,`/style.css`、`fetch("/api/…")` 这些绝对路径必须成立。
// 早期把应用挂在 `/app/<token>/` 路径前缀下,绝对路径会逃出应用根,契约根本立不住。
//
// token 由「装机密钥 + appId」推导,**跨重启稳定** —— 否则 origin 每次都变,
// 应用的 localStorage / IndexedDB 每次重启都清空。
import { createHmac, randomBytes } from "crypto";
import { readSettings, writeSettings } from "../data/settings.js";

let secret = "";

const installSecret = (): string => {
  if (secret) return secret;
  const saved = readSettings().installSecret;
  if (saved) { secret = saved; return secret; }
  secret = randomBytes(32).toString("hex");
  writeSettings({ installSecret: secret });
  return secret;
};

/** 32 位十六进制 —— 同时是合法的 DNS label。 */
export const appToken = (appId: string): string =>
  createHmac("sha256", installSecret()).update(String(appId)).digest("hex").slice(0, 32);

/** 反解:遍历当前应用列表比对(应用个数是几十量级,不值得再存一张表)。 */
export const appIdForToken = (token: string, ids: string[]): string | null => {
  const want = String(token || "").toLowerCase();
  return ids.find((id) => appToken(id) === want) ?? null;
};
