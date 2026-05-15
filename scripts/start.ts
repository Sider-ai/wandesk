#!/usr/bin/env node

/**
 * start.ts
 *
 * AIOS 启动前置脚本。单文件负责：
 *
 *   1. 检查 .aios/settings.json 标记文件的 locale 字段
 *   2. 如果已经为请求的 locale 烘焙过，直接跳过（零开销放行）
 *   3. 否则把 language/<locale>/**\/*.json 的文案烘焙进源码：
 *      - 源码里 __T_<KEY_UPPER>__ 占位符被替换成真实文案
 *      - 支持双引号 / 单引号 / 反引号 / 裸文本四种上下文的正确转义
 *      - language/<locale>/apps/<app>/APP.md 烘焙到 apps/<app>/APP.md
 *      - apps/<app>/APP.md 覆盖到 server/apps/<app>/APP.md
 *      - language/<locale>/AGENTS.md / CLAUDE.md 烘焙到项目根目录
 *   4. 在 projectRoot 下写 .aios/settings.json（locale + appliedAt）
 *
 * 本脚本自定位到 dirname($0)/..，可以跑在 aios/ 源码仓或任何 aios/ 的运行副本里
 * （例如 wandesk-test/aios，或客户端打包时的 wandesk-client/tauri/resources/aios）。
 *
 * 用法:
 *   tsx scripts/start.ts                    # 默认 locale = zh，走缓存判断
 *   tsx scripts/start.ts en                 # 指定 locale
 *   tsx scripts/start.ts --force            # 忽略缓存标记，强制重烘
 *   tsx scripts/start.ts en --force         # 组合
 *   AIOS_LANG=en tsx scripts/start.ts       # 通过环境变量指定 locale
 *
 * npm 生命周期:
 *   predev / prebuild / prestart / prestart:apps 都挂这个脚本
 *   已烘焙过的情况下耗时 < 10ms，可以无脑挂
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const settingsDir = path.join(projectRoot, '.aios');
const settingsFile = path.join(settingsDir, 'settings.json');
const REPLACE_EXTS = new Set(['.js', '.mjs', '.ts', '.tsx', '.jsx', '.vue', '.json', '.md']);
const ROOT_EXCLUDE_DIRS = new Set(['apps', 'database', 'files', 'language', 'scripts']);
const ALWAYS_EXCLUDE_DIRS = new Set(['node_modules', '.git', '.aios', 'dist']);

const readSettings = () => {
  if (!fs.existsSync(settingsFile)) return null;
  try {
    return JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
  } catch {
    return null;
  }
};

const writeSettings = (patch) => {
  const current = readSettings() || {};
  const next = { ...current, ...patch };
  fs.mkdirSync(settingsDir, { recursive: true });
  fs.writeFileSync(settingsFile, JSON.stringify(next, null, 2) + '\n');
};

const rawArgs = process.argv.slice(2);
const force = rawArgs.includes('--force');
const locale = rawArgs.find((a) => !a.startsWith('--')) || process.env.AIOS_LANG || 'zh';

const hasUnresolvedTokens = () => {
  const stack = [projectRoot];
  while (stack.length) {
    const dir = stack.pop();
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (ALWAYS_EXCLUDE_DIRS.has(entry.name)) continue;
        if (dir === projectRoot && ROOT_EXCLUDE_DIRS.has(entry.name)) continue;
        stack.push(path.join(dir, entry.name));
        continue;
      }
      const file = path.join(dir, entry.name);
      if (!REPLACE_EXTS.has(path.extname(file))) continue;
      const src = fs.readFileSync(file, 'utf8');
      if (/__T_[A-Z0-9_]+__/.test(src)) return true;
    }
  }
  return false;
};

if (!force) {
  const current = readSettings()?.locale || null;
  if (current === locale && !hasUnresolvedTokens()) {
    console.log(`[start] language '${locale}' already applied, skipping`);
    process.exit(0);
  } else if (current === locale) {
    console.log(`[start] unresolved language tokens detected, re-applying '${locale}'`);
  } else if (current && current !== locale) {
    console.log(`[start] locale change detected: '${current}' -> '${locale}', re-applying`);
  } else {
    console.log(`[start] first run, applying '${locale}'`);
  }
} else {
  console.log(`[start] --force: re-applying '${locale}'`);
}

const langDir = path.join(projectRoot, 'language', locale);
if (!fs.existsSync(langDir)) {
  console.error(`[start] language pack not found: ${langDir}`);
  process.exit(1);
}

const walk = (dir, visit, { exclude = false, root = dir }: any = {}) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (exclude && ALWAYS_EXCLUDE_DIRS.has(entry.name)) continue;
      if (exclude && dir === root && ROOT_EXCLUDE_DIRS.has(entry.name)) continue;
      walk(path.join(dir, entry.name), visit, { exclude, root });
    } else {
      visit(path.join(dir, entry.name));
    }
  }
};

const tokenMap = new Map();
walk(langDir, (file) => {
  if (!file.endsWith('.json')) return;
  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    console.error(`[start] invalid JSON: ${file}\n  ${err.message}`);
    process.exit(1);
  }
  for (const [key, value] of Object.entries(data)) {
    if (typeof value !== 'string') continue;
    const token = `__T_${key.toUpperCase()}__`;
    if (tokenMap.has(token) && tokenMap.get(token) !== value) {
      console.warn(`[start] duplicate token ${token} with different values (later wins)`);
    }
    tokenMap.set(token, value);
  }
});
console.log(`[start] ${tokenMap.size} tokens loaded from ${path.relative(projectRoot, langDir)}`);

const sortedTokens = [...tokenMap.entries()].sort((a, b) => b[0].length - a[0].length);

const escapeForDoubleQuote = (s) => JSON.stringify(s).slice(1, -1);
const escapeForSingleQuote = (s) => s
  .replace(/\\/g, '\\\\')
  .replace(/'/g, "\\'")
  .replace(/\n/g, '\\n')
  .replace(/\r/g, '\\r')
  .replace(/\u2028/g, '\\u2028')
  .replace(/\u2029/g, '\\u2029');
const escapeForBacktick = (s) => s
  .replace(/\\/g, '\\\\')
  .replace(/`/g, '\\`')
  .replace(/\$\{/g, '\\${');

const replaceAllCounting = (src, needle, replacement) => {
  const parts = src.split(needle);
  return { src: parts.join(replacement), count: parts.length - 1 };
};

let replacedFiles = 0;
let replacedCount = 0;
walk(projectRoot, (file) => {
  const ext = path.extname(file);
  if (!REPLACE_EXTS.has(ext)) return;
  let src = fs.readFileSync(file, 'utf8');
  if (!src.includes('__T_')) return;
  let fileReplacements = 0;
  for (const [token, value] of sortedTokens) {
    if (!src.includes(token)) continue;
    let out;
    out = replaceAllCounting(src, `"${token}"`, `"${escapeForDoubleQuote(value)}"`);
    src = out.src; fileReplacements += out.count;
    out = replaceAllCounting(src, `'${token}'`, `'${escapeForSingleQuote(value)}'`);
    src = out.src; fileReplacements += out.count;
    out = replaceAllCounting(src, `\`${token}\``, `\`${escapeForBacktick(value)}\``);
    src = out.src; fileReplacements += out.count;
    out = replaceAllCounting(src, token, value);
    src = out.src; fileReplacements += out.count;
  }
  if (fileReplacements > 0) {
    fs.writeFileSync(file, src);
    replacedFiles++;
    replacedCount += fileReplacements;
  }
}, { exclude: true });
console.log(`[start] replaced ${replacedCount} tokens across ${replacedFiles} files`);

const removeDirContents = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir)) {
    fs.rmSync(path.join(dir, entry), { recursive: true, force: true });
  }
};

const copyDir = (src, dst) => {
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const dstPath = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, dstPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, dstPath);
    }
  }
};

const langAppsDir = path.join(langDir, 'apps');
const runtimeAppsDir = path.join(projectRoot, 'apps');
let mdCount = 0;
if (fs.existsSync(langAppsDir)) {
  fs.mkdirSync(runtimeAppsDir, { recursive: true });
  removeDirContents(runtimeAppsDir);
  copyDir(langAppsDir, runtimeAppsDir);
  for (const appName of fs.readdirSync(langAppsDir)) {
    const srcMd = path.join(runtimeAppsDir, appName, 'APP.md');
    const dstMd = path.join(projectRoot, 'server', 'apps', appName, 'APP.md');
    if (fs.existsSync(srcMd) && fs.existsSync(path.dirname(dstMd))) {
      fs.copyFileSync(srcMd, dstMd);
      mdCount++;
    }
  }
} else {
  console.warn(`[start] missing language/${locale}/apps, root apps left untouched`);
}
console.log(`[start] baked apps from language/${locale}/apps and mirrored ${mdCount} server app docs`);

// Bake runtime root markdown files for the active locale.
for (const fileName of ['AGENTS.md', 'CLAUDE.md']) {
  const srcMd = path.join(projectRoot, 'language', locale, fileName);
  const dstMd = path.join(projectRoot, fileName);
  if (fs.existsSync(srcMd)) {
    fs.copyFileSync(srcMd, dstMd);
    console.log(`[start] mirrored ${fileName} from language/${locale}`);
  } else {
    console.warn(`[start] missing language/${locale}/${fileName}, root ${fileName} left untouched`);
  }
}

let unresolvedCount = 0;
const unresolvedFiles = new Set();
walk(projectRoot, (file) => {
  const ext = path.extname(file);
  if (!REPLACE_EXTS.has(ext)) return;
  const src = fs.readFileSync(file, 'utf8');
  const matches = src.match(/__T_[A-Z0-9_]+__/g);
  if (matches) {
    unresolvedCount += matches.length;
    unresolvedFiles.add(path.relative(projectRoot, file));
  }
}, { exclude: true });
if (unresolvedCount > 0) {
  console.warn(`[start] ${unresolvedCount} unresolved tokens in ${unresolvedFiles.size} files:`);
  for (const f of [...unresolvedFiles].slice(0, 10)) console.warn(`  - ${f}`);
  if (unresolvedFiles.size > 10) console.warn(`  ... and ${unresolvedFiles.size - 10} more`);
}

writeSettings({ locale, appliedAt: new Date().toISOString() });
console.log(`[start] wrote .aios/settings.json (locale=${locale})`);
