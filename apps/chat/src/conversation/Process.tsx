// Process system: reasoning / tools each get one row (the icon swaps to a chevron on hover,
// rotating 90° when expanded); adjacent completed tools collapse into a one-line summary, and a
// completed turn collapses as a whole into a "Worked for X" fold.
// A running tool's label gets a shimmer; while the whole turn is in progress the bottom shows a
// spinner plus "Working…".
import { useState, type ReactNode } from 'react';

import { Icon } from '../icons/Icon';
import { fmtArgs, fmtResult, isFailed, renderMd, toolMeta, formatDuration } from './format';
import type { Row } from './thread';

/** Entries within a turn, in order: process (reasoning / tools) and intermediate text. */
export type TurnEntry = { kind: 'think' | 'tool' | 'text'; row: Row };

/* ── Row skeleton: icon slot (glyph ⇄ chevron) + label, shared by reasoning and tools ── */

function StepIcon({ icon }: { icon: ReactNode }) {
    return (
        <span className="step-ic">
            <span className="step-glyph">{icon}</span>
            <span className="step-chev"><Icon name="chev" size={12} /></span>
        </span>
    );
}

/* ── Reasoning entry ── */

export function ThinkItem({ row, compact }: { row: Row; compact?: boolean }) {
    const [open, setOpen] = useState(false);
    const thinking = Boolean(row.streaming && !row.content);
    return (
        <div className={`step${open ? ' open' : ''}${compact ? ' sm' : ''}`}>
            <button className="step-head" onClick={() => setOpen(!open)}>
                <StepIcon icon={<Icon name="spark" size={compact ? 12 : 14} />} />
                <span className="step-label"><i className={thinking ? 'sheen' : undefined}>{thinking ? 'Thinking' : 'Thought'}</i></span>
            </button>
            {open && (
                <div className="step-body">
                    <div className="step-block">{row.reasoning}</div>
                </div>
            )}
        </div>
    );
}

/* ── Tool entry ── */

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
                    <div className="step-block">{row.result ? fmtResult(row.result) : 'No output'}</div>
                </div>
            )}
        </div>
    );
}

/* ── 2 or more adjacent completed tools collapse into a one-line summary ── */

type GroupKind = 'create' | 'edit' | 'read' | 'exec';

function groupKind(row: Row): GroupKind {
    if (row.name === 'read') return 'read';
    if (row.name === 'write') return 'create';
    if (row.name === 'edit') return 'edit';
    return 'exec';
}

/** File-based kinds are counted by deduplicated path; the exec kind is counted by call count. */
function groupCount(rows: Row[], kind: GroupKind) {
    if (kind === 'exec') return rows.length;
    const paths = new Set<string>();
    for (const row of rows) paths.add(String(row.args?.path ?? '').trim() || row.callId || '');
    return paths.size;
}

const GROUP_TEXT: Record<GroupKind, (n: number) => string> = {
    create: (n) => `Created ${n} file${n === 1 ? '' : 's'}`,
    edit: (n) => `Edited ${n} file${n === 1 ? '' : 's'}`,
    read: (n) => `Read ${n} file${n === 1 ? '' : 's'}`,
    exec: (n) => `Ran ${n} command${n === 1 ? '' : 's'}`,
};

function groupSummary(rows: Row[]) {
    const parts: string[] = [];
    for (const kind of ['create', 'edit', 'read', 'exec'] as GroupKind[]) {
        const matching = rows.filter((row) => groupKind(row) === kind);
        if (matching.length) parts.push(GROUP_TEXT[kind](groupCount(matching, kind)));
    }
    return parts.join(', ');
}

/** Group header icon: pick a representative one (edit > create > read > exec). */
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

/* ── Turn fold: "Worked for X ›" + a full-width hairline ── */

export function TurnFold({ durationMs, children }: { durationMs: number | null; children: ReactNode }) {
    const [open, setOpen] = useState(false);
    // Anything that reaches the fold is a turn that's already wrapped up; even if the duration can't be computed, it must never read as "running"
    const label = durationMs != null && durationMs > 0 ? `Worked for ${formatDuration(durationMs)}` : 'Process';
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

/* ── Render a sequence of entries in order: process items group when adjacent, intermediate text
   is laid out flat as markdown — with inFold=true, entries render bare (the fold provides its own
   gap); otherwise each one is wrapped in a message row. ── */

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
            // A running tool doesn't join a group — it gets its own row with the shimmer
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

/* ── Working: spinner + shimmering text ── */

export function Working() {
    return (
        <div className="working">
            <span className="orbit" />
            <span className="working-text sheen">Working…</span>
        </div>
    );
}
