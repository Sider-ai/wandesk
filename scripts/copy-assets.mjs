// tsc 只搬 .ts/.js。内核里的非代码资源(建表脚本)得自己带过去。
import fs from "fs";
import path from "path";

const ASSETS = ["kernel/data/schema.sql"];

for (const rel of ASSETS) {
  const to = path.join("dist", rel);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(rel, to);
  console.log(`[assets] ${rel} → ${to}`);
}
