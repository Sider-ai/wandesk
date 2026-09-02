// Event names shared between the server and the UI — the cross-process strings live only here.
// The server broadcasts them over /api/events (SSE); the UI claims them by conversationId.
export const EVENTS = Object.freeze({
    /** A turn has started running (the user message is already persisted). */
    START: 'conversation.start',
    /** Reasoning stream delta. */
    REASONING: 'conversation.reasoning',
    /** Main text stream delta. */
    DELTA: 'conversation.delta',
    /** The model has switched to emitting tool arguments: the text line ends here. */
    CALL_STARTED: 'conversation.callStarted',
    /** A batch of tool calls is ready (arguments complete) and about to run. */
    CALLS: 'conversation.calls',
    /** A tool call has produced a result. */
    CALL_OUTPUT: 'conversation.callOutput',
    /** Context compaction: start / done. */
    COMPACT_START: 'conversation.compactStart',
    COMPACT_DONE: 'conversation.compactDone',
    /** The three terminal states. */
    DONE: 'conversation.done',
    ABORTED: 'conversation.aborted',
    ERROR: 'conversation.error',
    /** The conversation list changed (title / pin / new conversation); the UI refetches the list. */
    CONVERSATIONS_CHANGED: 'conversations.changed',
    /** A conversation was deleted (possibly from another window). */
    CONVERSATION_DELETED: 'conversation.deleted',
});

/** Every event name that can appear on the SSE channel; the UI adds a listener for each of these. */
export const EVENT_NAMES = Object.freeze(Object.values(EVENTS));
