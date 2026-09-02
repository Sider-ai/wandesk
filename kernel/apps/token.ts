// The token is a **routing key**, not an authorization credential (all capabilities are open — see "current tradeoffs" in CONTRACT.md).
//
// Apps are mounted at `http://<token>.localhost:<port>/` — each app gets a **real origin root**.
// This matters: an app is a complete website, so absolute paths like `/style.css` and `fetch("/api/…")` must work.
// Early on, apps were mounted under a `/app/<token>/` path prefix; absolute paths would escape the app root, and the contract simply couldn't hold.
//
// The token is derived from "install secret + appId", **stable across restarts** — otherwise the origin would change every time,
// and the app's localStorage / IndexedDB would be wiped on every restart.
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

/** 32 hex characters — also a valid DNS label. */
export const appToken = (appId: string): string =>
  createHmac("sha256", installSecret()).update(String(appId)).digest("hex").slice(0, 32);

/** Reverse lookup: scan the current app list and compare (a few dozen apps at most — not worth a separate table for this). */
export const appIdForToken = (token: string, ids: string[]): string | null => {
  const want = String(token || "").toLowerCase();
  return ids.find((id) => appToken(id) === want) ?? null;
};
