// 消息流 —— 按轮收纳:
//   · 一条用户消息起一轮。轮内的思考 / 工具 / 中间文本是过程,最后那条正文是结果。
//   · 轮完成且有最终文本 → 过程整体收进「已工作X」折叠条,最终文本站在外面;
//   · 轮还在进行中(或没有最终文本,比如中途停掉)→ 平铺,过程依次展示;
//   · 用户消息是右侧灰底气泡;助理最终文本无气泡全宽 markdown,
//     悬停出现复制行,最后一条常显。
import { useEffect, useMemo, useRef } from 'react';

import { Icon, Mark } from '../icons/Icon';
import { toast } from '../overlay/toast';
import { TurnEntries, TurnFold, Working, type TurnEntry } from './Process';
import { dayLabel, renderMd } from './format';
import { loadOlder, retrySend, useConversation } from './store';
import { seedDraft } from './draft';
import type { Row } from './thread';

/** 空白对话的起手式:每一条都是这个 Agent 真做得到的事。点了填进输入框,不直接发。 */
const STARTERS: Array<{ icon: string; text: string }> = [
    { icon: 'doc', text: '看一下这个项目的结构,总结每个目录是干什么的' },
    { icon: 'terminal', text: '运行测试,把失败的原因整理给我' },
    { icon: 'pen', text: '把 README 里过时的部分改成现在的实际情况' },
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

    // 「粘底」:贴着底部时任何高度变化都跟着走;用户上滚就不打扰,滚回底部重新粘上
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
         * 收掉当前这轮。live = 最后一轮且还在跑。
         * 有最终文本且已完成 → 过程进折叠条、最终文本在外;否则平铺。
         * 最终文本 = 轮里最后一条带正文的已完成 assistant 行。
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
                flushTurn(false); // 换天先收上一轮,日期条不站在折叠条中间
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
                // 同一行可能既有思考又有正文 —— 思考属于过程,正文属于文本
                if (row.reasoning) entries.push({ kind: 'think', row });
                if (row.content) entries.push({ kind: 'text', row });
                noteAt(row.at);
                continue;
            }
            // 系统注解独立成块,不搅进轮里
            flushTurn(false);
            output.push({ kind: 'message', key: row.key, row });
        }
        flushTurn(busy);
        return output;
        // tick 是「行内容原地变过」的信号,必须进依赖,否则流式不重算
    }, [rows, busy, tick]);

    // 最后那条最终文本:复制行常显(其余悬停出现)
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
        // 正文在流式输出,或过程行自己带着扫光 —— 都轮不到等待动画
        if (last && last.kind === 'assistant' && last.streaming && last.content) return false;
        if (last && last.kind === 'tool' && last.status === 'running') return false;
        return true;
    }, [busy, rows, tick]);

    const onScroll = () => {
        const element = scrollRef.current;
        if (!element) return;
        stick.current = element.scrollHeight - element.scrollTop - element.clientHeight < 80;
        if (element.scrollTop < 60 && hasMore && !loadingOlder) {
            restoreFromTop.current = element.scrollHeight; // 记住旧高度,加载后保持视口
            void loadOlder();
        }
    };

    // 依赖 currentId:内层容器按对话 key 重挂,换对话后要观察的是新节点 ——
    // 盯着旧节点的观察器一次都不会再触发,粘底从此失灵
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

    // 切对话 / 自己发消息:强制回底并重新粘上
    useEffect(() => {
        stick.current = true;
        restoreFromTop.current = 0;
        const element = scrollRef.current;
        if (element) element.scrollTop = element.scrollHeight;
    }, [viewSeq]);

    // 自动填屏:首页不满一屏就没有滚动条,onScroll 永不触发 —— 有更早的就继续拉
    useEffect(() => {
        if (!ready || !hasMore || loadingOlder || !rows.length) return;
        const element = scrollRef.current;
        if (!element) return;
        if (element.scrollHeight <= element.clientHeight + 40) void loadOlder();
    }, [ready, hasMore, loadingOlder, rows.length]);

    const copyText = (content?: string) => {
        void navigator.clipboard.writeText(content || '');
        toast('已复制');
    };

    return (
        <main ref={scrollRef} className="stream" onScroll={onScroll}>
            {/* key 按对话换:换对话 = 整棵子树重挂,行数组是可变结构,重挂一了百了 */}
            <div key={currentId || '__draft__'} ref={innerRef} className="stream-inner">
                {loadingOlder && <span className="chip">加载更早的消息…</span>}
                {!loadingOlder && hasMore && rows.length > 0 && (
                    <button className="chip chip-btn" onClick={() => void loadOlder()}>查看更早的消息</button>
                )}

                {!ready && !rows.length && <span className="chip">正在打开对话…</span>}

                {ready && !rows.length && (
                    <div className="blank float-in">
                        <Mark size={60} />
                        <div className="blank-title">这次做点什么?</div>
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
                                {row.sending && <div className="send-state">发送中…</div>}
                                {!row.sending && row.failed && (
                                    <button className="send-retry" onClick={() => void retrySend(row)}>发送失败,点击重试</button>
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
                                    <button className="act" title="复制" onClick={() => copyText(row.content)}>
                                        <Icon name="copy" size={14} />
                                    </button>
                                </div>
                            </div>
                        );
                    }
                    return (
                        <span key={block.key} className={`chip${row.code === 'error' ? ' chip-bad' : ''}`}>
                            {row.code === 'stopped' ? '已停止' : row.content}
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
