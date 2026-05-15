// 读取系统当前语言.
// 优先级: 环境变量 AIOS_LANG > .aios/settings.json > 'zh'
// 主进程构建前端时会把 .aios/settings.json 里的 locale 同步注入到 AIOS_LANG.
import { readFileSync } from "fs";
import { resolve } from "path";

let cached = null;

const readFromSettings = () => {
    try {
        const raw = readFileSync(resolve(process.cwd(), ".aios/settings.json"), "utf-8");
        const data = JSON.parse(raw);
        return data?.locale || null;
    } catch {
        return null;
    }
};

const getSystemLanguage = () => {
    if (cached) return cached;
    cached = String(process.env.AIOS_LANG || readFromSettings() || "zh").trim() || "zh";
    return cached;
};

export { getSystemLanguage };
