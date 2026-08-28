// 发给 AI 的工具定义表，不包含任何执行逻辑。
export const tools = [
    {
        type: 'function',
        name: 'bash',
        description: '在工作目录执行 bash 命令。',
        parameters: {
            type: 'object',
            properties: {
                summary: { type: 'string', description: '一句话说明调用这个工具的目的' },
                command: { type: 'string', description: '需要执行的命令' },
                timeout_ms: { type: 'integer', description: '超时时间（毫秒）' },
            },
            required: ['summary', 'command'],
            additionalProperties: false,
        },
    },
    {
        type: 'function',
        name: 'read',
        description: '读取文本文件，路径相对于工作目录。',
        parameters: {
            type: 'object',
            properties: {
                summary: { type: 'string', description: '一句话说明调用这个工具的目的' },
                path: { type: 'string', description: '文件路径' },
                offset: { type: 'integer', description: '起始行，从 1 开始' },
                limit: { type: 'integer', description: '最多读取的行数' },
            },
            required: ['summary', 'path'],
            additionalProperties: false,
        },
    },
    {
        type: 'function',
        name: 'write',
        description: '写入文件，文件存在时覆盖，路径相对于工作目录。',
        parameters: {
            type: 'object',
            properties: {
                summary: { type: 'string', description: '一句话说明调用这个工具的目的' },
                path: { type: 'string', description: '文件路径' },
                content: { type: 'string', description: '文件内容' },
            },
            required: ['summary', 'path', 'content'],
            additionalProperties: false,
        },
    },
    {
        type: 'function',
        name: 'edit',
        description: '通过精确替换修改文本文件。',
        parameters: {
            type: 'object',
            properties: {
                summary: { type: 'string', description: '一句话说明调用这个工具的目的' },
                path: { type: 'string', description: '文件路径' },
                old_text: { type: 'string', description: '要替换的原文' },
                new_text: { type: 'string', description: '替换后的文本' },
                replace_all: { type: 'boolean', description: '是否替换所有匹配' },
            },
            required: ['summary', 'path', 'old_text', 'new_text'],
            additionalProperties: false,
        },
    },
];
