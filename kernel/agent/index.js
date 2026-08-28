// 具有 Bash 和文件工具的 Agent 入口。
import { runAgent as runAi } from '../ai/index.js';
import { bash } from './functions/bash.js';
import { read } from './functions/read.js';
import { write } from './functions/write.js';
import { edit } from './functions/edit.js';
import { tools } from './tools.js';

export function runAgent({ bash: bashOptions, ...options }) {
    const executors = new Map([
        ['bash', bash(bashOptions)],
        ['read', read],
        ['write', write],
        ['edit', edit],
    ]);

    return runAi({
        ...options,
        tools,
        executors,
    });
}
