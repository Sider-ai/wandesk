// Message stream — organized by turn:
//   · One user message starts a turn. Reasoning / tools / intermediate text within the turn are
//     process, and the final text is the result.
//   · A completed turn with final text → the process collapses into a "Worked for X" fold, with
//     the final text standing outside it;
//   · A turn still in progress (or with no final text, e.g. stopped partway) → laid out flat,
//     process shown in order;
//   · User messages are gray bubbles on the right; the assistant's final text is bubble-free,
//     full-width markdown, with a copy row that appears on hover (always shown for the last one).
import { useEffect, useMemo, useRef } from 'react';

import { Icon, Mark } from '../icons/Icon';
import { toast } from '../overlay/toast';
import { TurnEntries, TurnFold, Working, type TurnEntry } from './Process';
import { dayLabel, renderMd } from './format';
import { loadOlder, retrySend, useConversation } from './store';
import { seedDraft } from './draft';
import type { Row } from './thread';

/** Starter prompts for a blank conversation: each one is something this Agent can actually do. Clicking fills the input, doesn't send. */
const STARTERS: Array<{ icon: string; text: string }> = [
    { icon: 'doc', text: 'Look at this project\'s structure and summarize what each directory is for' },
    { icon: 'terminal', text: 'Run the tests and summarize why any failures happened' },
    { icon: 'pen', text: 'Update the outdated parts of the README to match the current state' },
];

type Block =
    | { kind: 'day'; key: string; label: string }
    | { kind: 'message'; key: string; row: Row; final?: boolean }
    | { kind: 'flat'; key: string; items: TurnEntry[] }
    | { kind: 'turn'; key: string; items: TurnEntry[]; durationMs: number | null };

export function MessageStream() {
    const { rows, busy, ready, hasMore, loadingOlder, tick, viewSeq, currentId } = useConversation();
    const scrollRef = useRef<HTMLElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);

    // "Stick to bottom": while pinned to the bottom, any height change follows along; scrolling up
    // stops the auto-follow, and scrolling back to the bottom re-engages it
    const stick = useRef(true);
    const restoreFromTop = useRef(0);

    const blocks = useMemo<Block[]>(() => {
        const output: Block[] = [];
        let lastDay = '';

        let entries: TurnEntry[] = [];
        let turnStartAt: number | undefined;
        let turnLastAt: number | undefined;
        let turnKey = '__head__';

        const noteAt = (at?: number) => { if (at) turnLastAt = at; };

        /**
         * Flush the current turn. live = it's the last turn and still running.
         * Has final text and is complete → process goes into the fold, final text stays outside; otherwise flat.
         * Final text = the last completed assistant row in the turn that carries body text.
         */
        const flushTurn = (live: boolean) => {
            if (!entries.length) { turnStartAt = undefined; turnLastAt = undefined; return; }
            const list = entries;
            entries = [];

            let finalIndex = -1;
            for (let i = list.length - 1; i >= 0; i--) {
                if (list[i].kind === 'text' && !list[i].row.streaming) { finalIndex = i; break; }
            }
            if (live || finalIndex < 0) {
                output.push({ kind: 'flat', key: `flat:${turnKey}`, items: list });
            } else {
                const final = list[finalIndex];
                const process = list.filter((_, index) => index !== finalIndex);
                if (process.length) {
                    const durationMs = turnStartAt && turnLastAt && turnLastAt > turnStartAt ? turnLastAt - turnStartAt : null;
                    output.push({ kind: 'turn', key: `turn:${turnKey}`, items: process, durationMs });
                }
                output.push({ kind: 'message', key: final.row.key, row: final.row, final: true });
            }
            turnStartAt = undefined;
            turnLastAt = undefined;
        };

        for (const row of rows) {
            const day = dayLabel(row.at);
            if (day && day !== lastDay) {
                flushTurn(false); // flush the previous turn before switching days, so the date chip doesn't end up inside the fold
                output.push({ kind: 'day', key: `day:${row.key}`, label: day });
                lastDay = day;
            }

            if (row.kind === 'user') {
                flushTurn(false);
                turnKey = row.key;
                turnStartAt = row.at;
                output.push({ kind: 'message', key: row.key, row });
                continue;
            }
            if (row.kind === 'tool') {
                entries.push({ kind: 'tool', row });
                noteAt(row.at);
                continue;
            }
            if (row.kind === 'assistant') {
                // One row can carry both reasoning and body text — reasoning is process, body is text
                if (row.reasoning) entries.push({ kind: 'think', row });
                if (row.content) entries.push({ kind: 'text', row });
                noteAt(row.at);
                continue;
            }
            // System notes form their own block and don't get mixed into a turn
            flushTurn(false);
            output.push({ kind: 'message', key: row.key, row });
        }
        flushTurn(busy);
        return output;
        // tick signals "row content changed in place" and must be a dependency, or streaming won't recompute
    }, [rows, busy, tick]);

    // The last final-text row: its copy row is always shown (others appear on hover)
    const lastFinalKey = useMemo(() => {
        for (let i = blocks.length - 1; i >= 0; i--) {
            const block = blocks[i];
            if (block.kind === 'message' && block.final) return block.key;
        }
        return '';
    }, [blocks]);

    const showWorking = useMemo(() => {
        if (!busy) return false;
        const last = rows[rows.length - 1];
        // Body text is streaming, or a process row already has its own shimmer — either way, no waiting animation needed
        if (last && last.kind === 'assistant' && last.streaming && last.content) return false;
        if (last && last.kind === 'tool' && last.status === 'running') return false;
        return true;
    }, [busy, rows, tick]);

    const onScroll = () => {
        const element = scrollRef.current;
        if (!element) return;
        stick.current = element.scrollHeight - element.scrollTop - element.clientHeight < 80;
        if (element.scrollTop < 60 && hasMore && !loadingOlder) {
            restoreFromTop.current = element.scrollHeight; // remember the old height so the viewport holds steady after loading
            void loadOlder();
        }
    };

    // Depends on currentId: the inner container remounts keyed by conversation, and after switching
    // the node to observe is a new one — an observer still watching the old node would never fire
    // again, and stick-to-bottom would silently break
    useEffect(() => {
        const element = scrollRef.current;
        const inner = innerRef.current;
        if (!element || !inner) return;
        element.scrollTop = element.scrollHeight;
        const observer = new ResizeObserver(() => {
            if (restoreFromTop.current) {
                element.scrollTop = element.scrollHeight - restoreFromTop.current;
                restoreFromTop.current = 0;
            } else if (stick.current) {
                element.scrollTop = element.scrollHeight;
            }
        });
        observer.observe(inner);
        return () => observer.disconnect();
    }, [currentId]);

    // Switching conversations / sending your own message: force back to the bottom and re-engage sticking
    useEffect(() => {
        stick.current = true;
        restoreFromTop.current = 0;
        const element = scrollRef.current;
        if (element) element.scrollTop = element.scrollHeight;
    }, [viewSeq]);

    // Auto-fill the screen: if the first page doesn't fill the viewport there's no scrollbar and
    // onScroll never fires — keep pulling more while there's earlier content available
    useEffect(() => {
        if (!ready || !hasMore || loadingOlder || !rows.length) return;
        const element = scrollRef.current;
        if (!element) return;
        if (element.scrollHeight <= element.clientHeight + 40) void loadOlder();
    }, [ready, hasMore, loadingOlder, rows.length]);

    const copyText = (content?: string) => {
        void navigator.clipboard.writeText(content || '');
        toast('Copied');
    };

    return (
        <main ref={scrollRef} className="stream" onScroll={onScroll}>
            {/* key changes per conversation: switching conversations remounts the whole subtree; the rows array is a mutable structure, and remounting sidesteps that entirely */}
            <div key={currentId || '__draft__'} ref={innerRef} className="stream-inner">
                {loadingOlder && <span className="chip">Loading earlier messages…</span>}
                {!loadingOlder && hasMore && rows.length > 0 && (
                    <button className="chip chip-btn" onClick={() => void loadOlder()}>View earlier messages</button>
                )}

                {!ready && !rows.length && <span className="chip">Opening conversation…</span>}

                {ready && !rows.length && (
                    <div className="blank float-in">
                        <Mark size={60} />
                        <div className="blank-title">What should we do?</div>
                        <div className="starters">
                            {STARTERS.map((starter) => (
                                <button key={starter.text} className="starter" onClick={() => seedDraft(starter.text)}>
                                    <span className="starter-ic"><Icon name={starter.icon} size={15} /></span>
                                    <span className="starter-text">{starter.text}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {blocks.map((block) => {
                    if (block.kind === 'day') return <span key={block.key} className="day-chip">{block.label}</span>;
                    if (block.kind === 'flat') return <TurnEntries key={block.key} items={block.items} />;
                    if (block.kind === 'turn') {
                        return (
                            <div key={block.key} className="msg agent">
                                <TurnFold durationMs={block.durationMs}>
                                    <TurnEntries items={block.items} inFold />
                                </TurnFold>
                            </div>
                        );
                    }

                    const row = block.row;
                    if (row.kind === 'user') {
                        return (
                            <div key={block.key} className="msg mine float-in">
                                <div className="bubble">
                                    {!!row.attachments?.length && <div className="message-files">{row.attachments.map((file) => (
                                        file.mimeType.startsWith('image/')
                                            ? <a key={file.id} href={file.url} target="_blank" rel="noreferrer"><img src={file.url} alt={file.name} /></a>
                                            : <a key={file.id} className="message-file" href={file.url} target="_blank" rel="noreferrer"><Icon name="doc" size={14} />{file.name}</a>
                                    ))}</div>}
                                    {row.content}
                                </div>
                                {row.sending && <div className="send-state">Sending…</div>}
                                {!row.sending && row.failed && (
                                    <button className="send-retry" onClick={() => void retrySend(row)}>Failed to send, click to retry</button>
                                )}
                            </div>
                        );
                    }
                    if (row.kind === 'assistant') {
                        const always = block.key === lastFinalKey && !busy;
                        return (
                            <div key={block.key} className="msg agent float-in">
                                <div className="md" dangerouslySetInnerHTML={{ __html: renderMd(row.content) }} />
                                <div className={`act-row${always ? ' always' : ''}`}>
                                    <button className="act" title="Copy" onClick={() => copyText(row.content)}>
                                        <Icon name="copy" size={14} />
                                    </button>
                                </div>
                            </div>
                        );
                    }
                    return (
                        <span key={block.key} className={`chip${row.code === 'error' ? ' chip-bad' : ''}`}>
                            {row.code === 'stopped' ? 'Stopped' : row.content}
                        </span>
                    );
                })}

                {showWorking && (
                    <div className="msg agent float-in">
                        <Working />
                    </div>
                )}
            </div>
        </main>
    );
}
