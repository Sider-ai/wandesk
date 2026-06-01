import { resolve } from "path";
import { existsSync, readFileSync, readdirSync } from "fs";

const systemDir = resolve(process.cwd(), "system");

let cache = null;

const loadSystemDocs = () => {
  if (cache !== null) return cache;
  if (!existsSync(systemDir)) {
    cache = "";
    return cache;
  }
  const files = readdirSync(systemDir).filter((name) => name.endsWith(".md")).sort();
  if (!files.length) {
    cache = "";
    return cache;
  }
  const parts = [];
  for (const name of files) {
    const content = readFileSync(resolve(systemDir, name), "utf8").trim();
    if (content) parts.push(content);
  }
  cache = parts.join("\n\n---\n\n");
  return cache;
};

const systemDocs = () => {
  const content = loadSystemDocs();
  return content ? `\n\n${content}` : "";
};

export {
  systemDocs
};
