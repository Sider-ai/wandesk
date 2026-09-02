// Tool definitions sent to the AI. Contains no execution logic.
export const tools = [
    {
        type: 'function',
        name: 'bash',
        description: 'Run a bash command in the working directory.',
        parameters: {
            type: 'object',
            properties: {
                summary: { type: 'string', description: 'A one-sentence explanation of why this tool is being called' },
                command: { type: 'string', description: 'The command to run' },
                timeout_ms: { type: 'integer', description: 'Timeout in milliseconds' },
            },
            required: ['summary', 'command'],
            additionalProperties: false,
        },
    },
    {
        type: 'function',
        name: 'read',
        description: 'Read a text file, with the path relative to the working directory.',
        parameters: {
            type: 'object',
            properties: {
                summary: { type: 'string', description: 'A one-sentence explanation of why this tool is being called' },
                path: { type: 'string', description: 'File path' },
                offset: { type: 'integer', description: 'Starting line, 1-indexed' },
                limit: { type: 'integer', description: 'Maximum number of lines to read' },
            },
            required: ['summary', 'path'],
            additionalProperties: false,
        },
    },
    {
        type: 'function',
        name: 'write',
        description: 'Write a file, overwriting it if it already exists, with the path relative to the working directory.',
        parameters: {
            type: 'object',
            properties: {
                summary: { type: 'string', description: 'A one-sentence explanation of why this tool is being called' },
                path: { type: 'string', description: 'File path' },
                content: { type: 'string', description: 'File content' },
            },
            required: ['summary', 'path', 'content'],
            additionalProperties: false,
        },
    },
    {
        type: 'function',
        name: 'edit',
        description: 'Modify a text file via an exact string replacement.',
        parameters: {
            type: 'object',
            properties: {
                summary: { type: 'string', description: 'A one-sentence explanation of why this tool is being called' },
                path: { type: 'string', description: 'File path' },
                old_text: { type: 'string', description: 'The original text to replace' },
                new_text: { type: 'string', description: 'The text to replace it with' },
                replace_all: { type: 'boolean', description: 'Whether to replace every match' },
            },
            required: ['summary', 'path', 'old_text', 'new_text'],
            additionalProperties: false,
        },
    },
];
