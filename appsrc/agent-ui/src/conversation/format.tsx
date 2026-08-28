// 渲染与文案:markdown 净化、工具行的图形与标签、时间标签。
import { marked } from 'marked';
import type { ReactNode } from 'react';

import { Icon } from '../icons/Icon';
import type { Row } from './thread';

// 净化渲染:正文来自模型和工具输出,属不可信内容,却要经 dangerouslySetInnerHTML
// 落进页面。在 marked 层掐断 XSS:丢弃原始 HTML,中和 javascript:/data: 链接。
const renderer = new marked.Renderer();
renderer.html = () => '';

const badUrl = (url: unknown) => /^\s*(javascript|data|vbscript):/i.test(String(url || ''));
const baseLink = renderer.link.bind(renderer);
renderer.link = (token) => {
    if (badUrl(token.href)) token.href = '#';
    return baseLink(token);
};
const baseImage = renderer.image.bind(renderer);
renderer.image = (token) => {
    if (badUrl(token.href)) token.href = '';
    return baseImage(token);
};

marked.setOptions({ breaks: true, gfm: true, renderer });

export const renderMd = (value: unknown) => marked.parse(String(value || ''), { async: false });

/* ── 工具行的图形与文案 ── */

const basename = (value: unknown) => String(value ?? '').split('/').filter(Boolean).pop() || '';

export function toolMeta(row: Row): { icon: ReactNode; label: string; pill: string; pillWide: boolean } {
    const args = row.args || {};
    // summary 是每个工具必填的面向用户摘要,胶囊优先显示它;
    // 文件工具例外:文件名比一句话更紧凑,没路径才退回摘要
    const summary = String(args.summary ?? '');
    switch (row.name) {
        case 'read':
            return { icon: <Icon name="doc" size={15} />, label: '读取', pill: basename(args.path) || summary, pillWide: false };
        case 'write':
        case 'edit':
            return { icon: <Icon name="pen" size={13} />, label: '修改', pill: basename(args.path) || summary, pillWide: false };
        case 'bash':
            return { icon: <Icon name="terminal" size={15} />, label: '执行', pill: summary || String(args.command ?? ''), pillWide: true };
        default:
            return { icon: <Icon name="terminal" size={15} />, label: row.name || 'tool', pill: summary, pillWide: true };
    }
}

/** 失败判定:结果 JSON 里带 error。整行淡掉,不另立红旗。 */
export function isFailed(row: Row) {
    if (!row.result) return false;
    try { return Boolean(JSON.parse(row.result)?.error); } catch { return false; }
}

/** 展开的「输入」:summary 已在标题露过,去掉,只留真正的参数。 */
export function fmtArgs(args: Record<string, unknown> | undefined) {
    const { summary: _summary, ...rest } = args || {};
    try { return JSON.stringify(rest, null, 2); } catch { return String(args); }
}

/** 「输出」:常是压成一行的 JSON,能解析就缩进,否则原样。 */
export function fmtResult(value: unknown) {
    if (value == null || value === '') return '';
    const text = String(value);
    try { return JSON.stringify(JSON.parse(text), null, 2); } catch { return text; }
}

/* ── 时间 ── */

/** 消息流里的「今天 / 昨天 / M月D日」分隔标签。 */
export function dayLabel(at?: number) {
    if (!at) return '';
    const date = new Date(at);
    if (Number.isNaN(date.getTime())) return '';
    const startOf = (value: Date) => new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
    const diff = Math.round((startOf(new Date()) - startOf(date)) / 86_400_000);
    if (diff === 0) return '今天';
    if (diff === 1) return '昨天';
    return `${date.getMonth() + 1}月${date.getDate()}日`;
}

/** ≥60s 显示 "N分M秒",<60s 显示 "N秒";最小 1 秒。 */
export function formatDuration(ms: number) {
    const total = Math.max(1, Math.round(ms / 1000));
    if (total < 60) return `${total} 秒`;
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return seconds > 0 ? `${minutes} 分 ${seconds} 秒` : `${minutes} 分钟`;
}
