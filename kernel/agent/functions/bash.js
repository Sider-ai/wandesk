// Bash executor.
import { spawn } from 'node:child_process';

const positive = (name, value) => {
    if (!Number.isInteger(value) || value <= 0) throw new Error(`${name} must be a positive integer`);
    return value;
};

export function bash({
    executable,
    args,
    minTimeoutMs,
    defaultTimeoutMs,
    maxTimeoutMs,
    maxOutputChars,
}) {
    if (typeof executable !== 'string' || !executable) throw new Error('bash.executable is required');
    if (!Array.isArray(args) || args.some((item) => typeof item !== 'string')) throw new Error('bash.args must be an array of strings');
    positive('bash.minTimeoutMs', minTimeoutMs);
    positive('bash.defaultTimeoutMs', defaultTimeoutMs);
    positive('bash.maxTimeoutMs', maxTimeoutMs);
    positive('bash.maxOutputChars', maxOutputChars);
    if (minTimeoutMs > defaultTimeoutMs || defaultTimeoutMs > maxTimeoutMs) throw new Error('bash timeout parameters are out of order');

    return (input = {}, context = {}) => {
        const command = String(input.command || '');
        if (!command) return Promise.resolve({ exit_code: -1, stdout: '', stderr: 'command must not be empty' });
        if (typeof context.cwd !== 'string' || !context.cwd) throw new Error('running bash requires context.cwd');
        const timeoutMs = Math.min(maxTimeoutMs, Math.max(minTimeoutMs, Number(input.timeout_ms) || defaultTimeoutMs));

        return new Promise((resolve, reject) => {
            const child = spawn(executable, [...args, command], {
                cwd: context.cwd,
                env: context.env && typeof context.env === 'object' ? context.env : {},
                detached: process.platform !== 'win32',
                stdio: ['ignore', 'pipe', 'pipe'],
            });
            let stdout = '';
            let stderr = '';
            let settled = false;
            const append = (current, chunk) => (current + chunk).slice(-maxOutputChars);
            child.stdout.setEncoding('utf8');
            child.stderr.setEncoding('utf8');
            child.stdout.on('data', (chunk) => { stdout = append(stdout, chunk); });
            child.stderr.on('data', (chunk) => { stderr = append(stderr, chunk); });

            const stop = () => {
                if (child.exitCode !== null) return;
                try {
                    if (process.platform !== 'win32') process.kill(-child.pid, 'SIGTERM');
                    else child.kill('SIGTERM');
                } catch { child.kill('SIGTERM'); }
            };
            const timer = setTimeout(stop, timeoutMs);
            const abort = () => stop();
            context.signal?.addEventListener('abort', abort, { once: true });

            child.on('error', (error) => {
                if (settled) return;
                settled = true;
                clearTimeout(timer);
                context.signal?.removeEventListener('abort', abort);
                reject(error);
            });
            child.on('close', (code, signalName) => {
                if (settled) return;
                settled = true;
                clearTimeout(timer);
                context.signal?.removeEventListener('abort', abort);
                resolve({
                    exit_code: Number.isInteger(code) ? code : -1,
                    stdout,
                    stderr: signalName ? `${stderr}${stderr ? '\n' : ''}terminated by ${signalName}` : stderr,
                });
            });
        });
    };
}
