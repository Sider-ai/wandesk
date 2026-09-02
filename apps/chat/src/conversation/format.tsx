// Rendering and copy: markdown sanitization, tool-row icons and labels, time labels.
import { marked } from 'marked';
import type { ReactNode } from 'react';

import { Icon } from '../icons/Icon';
import type { Row } from './thread';

// Sanitized rendering: the body text comes from the model and tool output, which is untrusted content,
// yet it still lands on the page via dangerouslySetInnerHTML. Cut off XSS at the marked layer:
// drop raw HTML and neutralize javascript:/data: links.
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

/* ── Tool-row icons and copy ── */

const basename = (value: unknown) => String(value ?? '').split('/').filter(Boolean).pop() || '';

export function toolMeta(row: Row): { icon: ReactNode; label: string; pill: string; pillWide: boolean } {
    const args = row.args || {};
    // summary is a user-facing blurb every tool must supply; the pill shows it first.
    // File tools are the exception: a filename is more compact than a sentence, and only fall back to the summary when there's no path
    const summary = String(args.summary ?? '');
    switch (row.name) {
        case 'read':
            return { icon: <Icon name="doc" size={15} />, label: 'Read', pill: basename(args.path) || summary, pillWide: false };
        case 'write':
        case 'edit':
            return { icon: <Icon name="pen" size={13} />, label: 'Edit', pill: basename(args.path) || summary, pillWide: false };
        case 'bash':
            return { icon: <Icon name="terminal" size={15} />, label: 'Run', pill: summary || String(args.command ?? ''), pillWide: true };
        default:
            return { icon: <Icon name="terminal" size={15} />, label: row.name || 'tool', pill: summary, pillWide: true };
    }
}

/** Failure check: the result JSON carries an `error` field. The whole row fades rather than raising a separate red flag. */
export function isFailed(row: Row) {
    if (!row.result) return false;
    try { return Boolean(JSON.parse(row.result)?.error); } catch { return false; }
}

/** The expanded "input": summary already showed up in the title, so drop it and keep only the real arguments. */
export function fmtArgs(args: Record<string, unknown> | undefined) {
    const { summary: _summary, ...rest } = args || {};
    try { return JSON.stringify(rest, null, 2); } catch { return String(args); }
}

/** The "output": usually JSON squashed onto one line — indent it if it parses, otherwise leave as-is. */
export function fmtResult(value: unknown) {
    if (value == null || value === '') return '';
    const text = String(value);
    try { return JSON.stringify(JSON.parse(text), null, 2); } catch { return text; }
}

/* ── Time ── */

/** The "Today / Yesterday / Month D" separator label in the message stream. */
export function dayLabel(at?: number) {
    if (!at) return '';
    const date = new Date(at);
    if (Number.isNaN(date.getTime())) return '';
    const startOf = (value: Date) => new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
    const diff = Math.round((startOf(new Date()) - startOf(date)) / 86_400_000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    return `${date.getMonth() + 1}/${date.getDate()}`;
}

/** ≥60s shows "Nm Ms", <60s shows "Ns"; minimum 1 second. */
export function formatDuration(ms: number) {
    const total = Math.max(1, Math.round(ms / 1000));
    if (total < 60) return `${total}s`;
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
}
