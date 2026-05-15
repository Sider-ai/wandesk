import crypto from "crypto";
import { nowIso } from "../repository/client.js";
const signOkx = ({ ts, method, path, body, secret }) => {
  const prehash = `${ts}${method.toUpperCase()}${path}${body || ""}`;
  return crypto.createHmac("sha256", secret).update(prehash).digest("base64");
};
const okxRequest = async (cfg, method, path, payload = null) => {
  const ts = nowIso();
  const body = payload ? JSON.stringify(payload) : "";
  const sign = signOkx({ ts, method, path, body, secret: cfg.api_secret });
  const resp = await fetch(`${cfg.base_url}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "OK-ACCESS-KEY": cfg.api_key,
      "OK-ACCESS-SIGN": sign,
      "OK-ACCESS-TIMESTAMP": ts,
      "OK-ACCESS-PASSPHRASE": cfg.passphrase
    },
    body: body || void 0
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok || data.code !== "0") throw new Error(`OKX: ${data?.msg || resp.status}`);
  return data;
};
const fetchAccountTotalEq = async (cfg) => {
  const data = await okxRequest(cfg, "GET", "/api/v5/account/balance");
  return Number(data?.data?.[0]?.totalEq || 0) || 0;
};
export {
  fetchAccountTotalEq,
  okxRequest
};
