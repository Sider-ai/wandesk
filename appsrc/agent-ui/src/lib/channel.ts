// 常驻事件通道(SSE)。断线重连是 EventSource 的原生能力,这里只维护
// 连接状态和一个统一的分发口 —— 谁关心哪个对话,自己按 conversationId 认领。
import { create } from 'zustand';
import { EVENT_NAMES } from '@shared/events';

export type ChannelEvent = { conversationId?: string } & Record<string, unknown>;
type Listener = (type: string, data: ChannelEvent) => void;

export const useChannel = create<{ connected: boolean }>(() => ({ connected: false }));

const listeners = new Set<Listener>();
let source: EventSource | null = null;

export function connectChannel() {
    if (source) return;
    source = new EventSource('/api/events');
    source.onopen = () => useChannel.setState({ connected: true });
    // 出错后 EventSource 自己按 retry 重连;这里只把状态摆出来
    source.onerror = () => useChannel.setState({ connected: false });
    for (const name of EVENT_NAMES) {
        source.addEventListener(name, (event) => {
            let data: ChannelEvent = {};
            try { data = JSON.parse((event as MessageEvent).data); } catch { /* 空事件体 */ }
            for (const listener of listeners) listener(name, data);
        });
    }
}

export function onChannel(listener: Listener) {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
}
