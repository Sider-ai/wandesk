import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { detectLineEnding, restoreLineEnding, toLf } from './text.js';

export async function edit({ path, old_text, new_text = '', replace_all = false }, context = {}) {
    if (!context.cwd) throw new Error('edit 需要 context.cwd');
    if (!path) throw new Error('path 不能为空');
    if (!old_text) throw new Error('old_text 不能为空');

    const file = resolve(context.cwd, path);
    const raw = await readFile(file, 'utf8');

    // 归一化到 LF 再匹配：模型基于 read 的输出构造 old_text，而 read 也按 LF 返回。
    // 不这样做时，CRLF 文件上任何跨行的 old_text 都匹配不到。
    const ending = detectLineEnding(raw);
    const content = toLf(raw);
    const target = toLf(String(old_text));
    const replacement = toLf(String(new_text));

    const matches = content.split(target).length - 1;
    if (matches === 0) throw new Error('未找到 old_text');
    if (matches > 1 && !replace_all) throw new Error(`old_text 出现 ${matches} 次，请提供唯一文本或设置 replace_all`);

    // 按下标切片拼接，不走 String.replace：后者即使首参是普通字符串，
    // 也会把替换文本里的 $&、$`、$'、$n、$$ 当替换模式解释，静默写错内容。
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
