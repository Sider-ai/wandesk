#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.resolve(__dirname, '..');
const workspaceDir = path.resolve(sourceDir, '..');
const devRootDir = path.join(workspaceDir, 'AIOS-dev');
const runtimeDir = path.join(devRootDir, 'aios');
const ports = ['5173', '9502', '9503'];

const rawArgs = process.argv.slice(2);
const locale = rawArgs.find((arg) => !arg.startsWith('--')) || process.env.AIOS_LANG || 'zh';

const run = (command, args, options: any = {}) => {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    ...options
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

const ensureDir = (dir) => {
  fs.mkdirSync(dir, { recursive: true });
};

const stopDevPorts = () => {
  for (const port of ports) {
    run('bash', ['-lc', `lsof -ti tcp:${port} 2>/dev/null | xargs -r kill -9 || true`]);
  }
};

const syncSourceToRuntime = () => {
  run('rsync', [
    '-a',
    '--delete',
    '--exclude', '/.git',
    '--exclude', '/node_modules',
    '--exclude', '/database',
    '--exclude', '/files',
    '--exclude', '/gui/dist',
    '--exclude', '/.aios',
    '--exclude', '.DS_Store',
    `${sourceDir}/`,
    `${runtimeDir}/`
  ]);
};

console.log(`[dev] source:  ${sourceDir}`);
console.log(`[dev] runtime: ${runtimeDir}`);
console.log(`[dev] locale:  ${locale}`);

ensureDir(devRootDir);
ensureDir(runtimeDir);

stopDevPorts();

syncSourceToRuntime();

run('npx', ['tsx', 'scripts/start.ts', locale, '--force'], {
  cwd: runtimeDir,
  env: { ...process.env, AIOS_LANG: locale }
});

const devScript = String(locale).toLowerCase() === 'zh' ? 'dev:zh' : 'dev';

run('npm', ['run', devScript], {
  cwd: runtimeDir,
  env: { ...process.env, AIOS_LANG: locale }
});
