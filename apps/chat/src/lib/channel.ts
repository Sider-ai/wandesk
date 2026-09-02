// Persistent event channel (SSE). Reconnect-on-disconnect is EventSource's native behavior;
// this module only tracks connection state and provides a single dispatch point —
// whoever cares about a given conversation claims it by conversationId.
import { create } from 'zustand';
import { EVENT_NAMES } from '../shared/events';

export type ChannelEvent = { conversationId?: string } & Record<string, unknown>;
type Listener = (type: string, data: ChannelEvent) => void;

export const useChannel = create<{ connected: boolean }>(() => ({ connected: false }));

const listeners = new Set<Listener>();
let source: EventSource | null = null;

export function connectChannel() {
    if (source) return;
    source = new EventSource('/api/events');
    source.onopen = () => useChannel.setState({ connected: true });
    // After an error, EventSource reconnects on its own using its retry policy; this just reflects the state
    source.onerror = () => useChannel.setState({ connected: false });
    for (const name of EVENT_NAMES) {
        source.addEventListener(name, (event) => {
            let data: ChannelEvent = {};
            try { data = JSON.parse((event as MessageEvent).data); } catch { /* empty event body */ }
            for (const listener of listeners) listener(name, data);
        });
    }
}

export function onChannel(listener: Listener) {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
}
