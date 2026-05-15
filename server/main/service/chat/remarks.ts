import {
  listHeadRemarkRows,
  listRemarkRows,
  listTailRemarkRows
} from "../../repository/chat/remarks.js";

const REMARK_RE = /<remark>([\s\S]*?)<\/remark>/g;
const PROBE = "<remark";

const extractRemark = (text) => {
  const src = String(text || "");
  const found = [];
  src.replace(REMARK_RE, (_, body) => {
    const trimmed = String(body || "").trim();
    if (trimmed) found.push(trimmed);
    return "";
  });
  const content = src.replace(REMARK_RE, "").replace(/\n{3,}/g, "\n\n").trim();
  const remark = found.length ? found.join("\n\n") : null;
  return { content, remark };
};

// 长对话注入策略:头 head 条 + 尾 tail 条,中间跳过(由 remark 自身承接)
const firstAndRecentRemarks = (conversationId, head = 10, tail = 20) => {
  const heads = listHeadRemarkRows(conversationId, head);
  const tails = listTailRemarkRows(conversationId, tail);
  const seen = new Set();
  const merged = [];
  for (const row of heads) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    merged.push(row);
  }
  for (const row of tails) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    merged.push(row);
  }
  merged.sort((a, b) => a.id - b.id);
  return merged.map((r) => r.remark);
};

// UI 面板用:返回当前对话的全部 remark,按时间正序
const listAllRemarks = (conversationId) => {
  return listRemarkRows(conversationId).map((r) => ({
    id: r.id,
    remark: r.remark,
    createdAt: r.created_at
  }));
};

// 流式过滤器:只要 buffer 出现 "<remark" 就停止向前端转发后续 delta,
// 等流结束后服务端再统一从完整 message.content 里抽 remark + 剥离正文.
const createRemarkStreamFilter = (forward) => {
  let buffer = "";
  let muted = false;
  return {
    push(chunk) {
      if (muted) return;
      buffer += String(chunk || "");
      const idx = buffer.indexOf(PROBE);
      if (idx !== -1) {
        if (idx > 0) forward(buffer.slice(0, idx));
        muted = true;
        buffer = "";
        return;
      }
      const safe = buffer.length - PROBE.length;
      if (safe > 0) {
        forward(buffer.slice(0, safe));
        buffer = buffer.slice(safe);
      }
    },
    flush() {
      if (!muted && buffer) forward(buffer);
      buffer = "";
    }
  };
};

export {
  extractRemark,
  firstAndRecentRemarks,
  listAllRemarks,
  createRemarkStreamFilter
};
