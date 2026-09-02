import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { detectLineEnding, restoreLineEnding, toLf } from './text.js';

export async function edit({ path, old_text, new_text = '', replace_all = false }, context = {}) {
    if (!context.cwd) throw new Error('edit requires context.cwd');
    if (!path) throw new Error('path must not be empty');
    if (!old_text) throw new Error('old_text must not be empty');

    const file = resolve(context.cwd, path);
    const raw = await readFile(file, 'utf8');

    // Normalize to LF before matching: the model builds old_text from read's output, and read
    // also returns content with LF line endings. Without this, any multi-line old_text would
    // fail to match on a CRLF file.
    const ending = detectLineEnding(raw);
    const content = toLf(raw);
    const target = toLf(String(old_text));
    const replacement = toLf(String(new_text));

    const matches = content.split(target).length - 1;
    if (matches === 0) throw new Error('old_text not found');
    if (matches > 1 && !replace_all) throw new Error(`old_text occurs ${matches} times; provide a unique text or set replace_all`);

    // Concatenate via index slicing rather than String.replace: even with a plain string as
    // the first argument, replace() still interprets $&, $`, $', $n, $$ in the replacement
    // text as pattern substitutions, silently corrupting the written content.
    let result;
    if (replace_all) {
        result = content.split(target).join(replacement);
    } else {
        const at = content.indexOf(target);
        result = content.slice(0, at) + replacement + content.slice(at + target.length);
    }

    await writeFile(file, restoreLineEnding(result, ending), 'utf8');

    return { path: file, replacements: replace_all ? matches : 1 };
}
