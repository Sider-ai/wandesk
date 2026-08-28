// 过程体系:思考 / 工具各是一行(图标位悬停换 chevron,展开转 90°),
// 相邻的已完成工具收成一行摘要,完成的一轮整体收进「已工作X」折叠条。
// 运行中的工具标签走扫光;整轮进行中时底部是转圈 + 「正在工作」。
import { useState, type ReactNode } from 'react';

import { Icon } from '../icons/Icon';
import { fmtArgs, fmtResult, isFailed, renderMd, toolMeta, formatDuration } from './format';
import type { Row } from './thread';

/** 一轮里按序排布的条目:过程(思考 / 工具)与中间文本。 */
export type TurnEntry = { kind: 'think' | 'tool' | 'text'; row: Row };

/* ── 行骨架:图标位(图形 ⇄ chevron)+ 标签,思考与工具共用 ── */

function StepIcon({ icon }: { icon: ReactNode }) {
    return (
        <span className="step-ic">
            <span className="step-glyph">{icon}</span>
            <span className="step-chev"><Icon name="chev" size={12} /></span>
        </span>
    );
}

/* ── 思考条目 ── */

export function ThinkItem({ row, compact }: { row: Row; compact?: boolean }) {
    const [open, setOpen] = useState(false);
    const thinking = Boolean(row.streaming && !row.content);
    return (
        <div className={`step${open ? ' open' : ''}${compact ? ' sm' : ''}`}>
            <button className="step-head" onClick={() => setOpen(!open)}>
                <StepIcon icon={<Icon name="spark" size={compact ? 12 : 14} />} />
                <span className="step-label"><i className={thinking ? 'sheen' : undefined}>{thinking ? '思考中' : '已思考'}</i></span>
            </button>
            {open && (
                <div className="step-body">
                    <div className="step-block">{row.reasoning}</div>
                </div>
            )}
        </div>
    );
}

/* ── 工具条目 ── */

export function ToolItem({ row, compact }: { row: Row; compact?: boolean }) {
    const [open, setOpen] = useState(false);
    const meta = toolMeta(row);
    const running = row.status === 'running';
    const failed = isFailed(row);
    return (
        <div className={`step${open ? ' open' : ''}${compact ? ' sm' : ''}${failed ? ' faded' : ''}`}>
            <button className="step-head" disabled={running} onClick={() => !running && setOpen(!open)}>
                <StepIcon icon={meta.icon} />
                <span className="step-label">
                    <i className={running ? 'sheen' : undefined}>{meta.label}</i>
                    {meta.pill && (
                        <span className="step-pill" style={meta.pillWide ? { maxWidth: 260 } : undefined}>
                            <span>{meta.pill}</span>
                        </span>
                    )}
                </span>
            </button>
            {open && (
                <div className="step-body">
                    <div className="step-block">{fmtArgs(row.args)}</div>
                    <div className="step-block">{row.result ? fmtResult(row.result) : '没有输出'}</div>
                </div>
            )}
        </div>
    );
}

/* ── 相邻已完成工具 ≥2 收成一行摘要 ── */

type GroupKind = 'create' | 'edit' | 'read' | 'exec';

function groupKind(row: Row): GroupKind {
    if (row.name === 'read') return 'read';
    if (row.name === 'write') return 'create';
    if (row.name === 'edit') return 'edit';
    return 'exec';
}

/** 文件类按去重后的路径数计,执行类按次数计。 */
function groupCount(rows: Row[], kind: GroupKind) {
    if (kind === 'exec') return rows.length;
    const paths = new Set<string>();
    for (const row of rows) paths.add(String(row.args?.path ?? '').trim() || row.callId || '');
    return paths.size;
}

const GROUP_TEXT: Record<GroupKind, (n: number) => string> = {
    create: (n) => `创建了 ${n} 个文件`,
    edit: (n) => `修改了 ${n} 个文件`,
    read: (n) => `读取了 ${n} 个文件`,
    exec: (n) => `执行了 ${n} 条命令`,
};

function groupSummary(rows: Row[]) {
    const parts: string[] = [];
    for (const kind of ['create', 'edit', 'read', 'exec'] as GroupKind[]) {
        const matching = rows.filter((row) => groupKind(row) === kind);
        if (matching.length) parts.push(GROUP_TEXT[kind](groupCount(matching, kind)));
    }
    return parts.join(',');
}

/** 分组头部图标:取代表(edit > create > read > exec)。 */
function groupIcon(rows: Row[]) {
    const pick = rows.find((row) => groupKind(row) === 'edit')
        || rows.find((row) => groupKind(row) === 'create')
        || rows.find((row) => groupKind(row) === 'read')
        || rows[0];
    return toolMeta(pick).icon;
}

export function ToolGroup({ rows }: { rows: Row[] }) {
    const [open, setOpen] = useState(false);
    const faded = rows.every(isFailed);
    return (
        <div className={`step${open ? ' open' : ''}${faded ? ' faded' : ''}`}>
            <button className="step-head" onClick={() => setOpen(!open)}>
                <StepIcon icon={groupIcon(rows)} />
                <span className="step-label"><i>{groupSummary(rows)}</i></span>
            </button>
            {open && (
                <div className="step-group">
                    {rows.map((row) => <ToolItem key={row.key} row={row} compact />)}
                </div>
            )}
        </div>
    );
}

/* ── 轮折叠条:「已工作 X ›」+ 通栏细线 ── */

export function TurnFold({ durationMs, children }: { durationMs: number | null; children: ReactNode }) {
    const [open, setOpen] = useState(false);
    // 进折叠条的一定是已收尾的轮;算不出时长也绝不能显示成「执行中」
    const label = durationMs != null && durationMs > 0 ? `已工作 ${formatDuration(durationMs)}` : '过程';
    return (
        <div className={`fold${open ? ' open' : ''}`}>
            <button className="fold-head" onClick={() => setOpen(!open)}>
                <span className="fold-row">
                    <span className="fold-label">{label}</span>
                    <span className="fold-chev"><Icon name="chev" size={12} /></span>
                </span>
                <span className="fold-line" />
            </button>
            {open && <div className="fold-body">{children}</div>}
        </div>
    );
}

/* ── 有序渲染一串条目:过程做相邻分组,中间文本按 markdown 平铺 ──
   inFold=true 时条目裸排(折叠条内部自带 gap);否则每条包一层消息行。 */

export function TurnEntries({ items, inFold }: { items: TurnEntry[]; inFold?: boolean }) {
    const nodes: ReactNode[] = [];
    let pendingTools: Row[] = [];

    const flushTools = () => {
        if (!pendingTools.length) return;
        const rows = pendingTools;
        pendingTools = [];
        nodes.push(rows.length >= 2
            ? <ToolGroup key={`g:${rows[0].key}`} rows={rows} />
            : <ToolItem key={rows[0].key} row={rows[0]} />);
    };

    for (const item of items) {
        if (item.kind === 'tool') {
            // 运行中的工具不进分组 —— 它要单独一行走扫光
            if (item.row.status === 'running') {
                flushTools();
                nodes.push(<ToolItem key={item.row.key} row={item.row} />);
            } else {
                pendingTools.push(item.row);
            }
            continue;
        }
        flushTools();
        if (item.kind === 'think') {
            nodes.push(<ThinkItem key={`t:${item.row.key}`} row={item.row} />);
        } else {
            nodes.push(
                <div key={`x:${item.row.key}`} className="md" dangerouslySetInnerHTML={{ __html: renderMd(item.row.content) }} />,
            );
        }
    }
    flushTools();

    if (inFold) return <>{nodes}</>;
    return <>{nodes.map((node, index) => <div key={index} className="msg agent">{node}</div>)}</>;
}

/* ── 正在工作:转圈 + 扫光文字 ── */

export function Working() {
    return (
        <div className="working">
            <span className="orbit" />
            <span className="working-text sheen">正在工作…</span>
        </div>
    );
}
