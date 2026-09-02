// tsc only moves .ts/.js files. Non-code assets in the kernel (table-creation scripts) have to be copied over by hand.
import fs from "fs";
import path from "path";

const ASSETS = ["kernel/data/schema.sql"];

for (const rel of ASSETS) {
  const to = path.join("dist", rel);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(rel, to);
  console.log(`[assets] ${rel} → ${to}`);
}
