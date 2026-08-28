-- 卦象历史(唯一真相:渲染历史卦签都从这里来,result 存解卦 JSON 全文)
CREATE TABLE IF NOT EXISTS app_fortune_readings (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  question   TEXT NOT NULL DEFAULT '',   -- 求问
  hexagram   TEXT NOT NULL DEFAULT '',   -- 所得卦名(如 "天火同人")
  result     TEXT NOT NULL DEFAULT '',   -- 解卦结果 JSON {signName,signPoem,good,bad,advice}
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
