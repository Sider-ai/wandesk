// 服务端与界面共用的事件名 —— 跨进程的字符串只写这一份。
// 服务端经 /api/events(SSE)广播,界面按 conversationId 认领。
export const EVENTS = Object.freeze({
    /** 一轮开始跑了(用户消息已落库)。 */
    START: 'conversation.start',
    /** 思考流增量。 */
    REASONING: 'conversation.reasoning',
    /** 正文流增量。 */
    DELTA: 'conversation.delta',
    /** 模型转去吐工具参数了:正文行到此为止。 */
    CALL_STARTED: 'conversation.callStarted',
    /** 一批工具调用已就绪(参数完整),即将执行。 */
    CALLS: 'conversation.calls',
    /** 某次工具调用出结果了。 */
    CALL_OUTPUT: 'conversation.callOutput',
    /** 上下文压缩:开始 / 结束。 */
    COMPACT_START: 'conversation.compactStart',
    COMPACT_DONE: 'conversation.compactDone',
    /** 终局三态。 */
    DONE: 'conversation.done',
    ABORTED: 'conversation.aborted',
    ERROR: 'conversation.error',
    /** 对话列表变了(标题 / 置顶 / 新建),界面重拉列表。 */
    CONVERSATIONS_CHANGED: 'conversations.changed',
    /** 某个对话被删了(可能来自另一个窗口)。 */
    CONVERSATION_DELETED: 'conversation.deleted',
});

/** SSE 通道上会出现的全部事件名,界面据此逐个 addEventListener。 */
export const EVENT_NAMES = Object.freeze(Object.values(EVENTS));
