// Token redaction —— 三个挂点用同一个函数:
//   1. saveMessage 写库前
//   2. WebSocket send 推送前
//   3. logger 落盘前 (如有)
//
// 工作前提:启动时 token 已经从 DB 拉到 process.env.AIOS_API_TOKEN.
// AI 在 prompt 中被告知用 $AIOS_API_TOKEN,绝大多数情况下真值不出现;
// 这一层是对 env / echo / 误粘贴 等边界场景的兜底.

const PLACEHOLDER = "$AIOS_API_TOKEN";

const redact = (s) => {
  const token = process.env.AIOS_API_TOKEN;
  if (!token || typeof s !== "string" || s.length < token.length) return s;
  if (!s.includes(token)) return s;
  return s.split(token).join(PLACEHOLDER);
};

// 深度遍历对象/数组,对其中所有字符串调用 redact.
const redactDeep = (val) => {
  if (val == null) return val;
  if (typeof val === "string") return redact(val);
  if (Array.isArray(val)) return val.map(redactDeep);
  if (typeof val === "object") {
    const out: Record<string, any> = {};
    for (const k of Object.keys(val)) out[k] = redactDeep(val[k]);
    return out;
  }
  return val;
};

export { redact, redactDeep };
