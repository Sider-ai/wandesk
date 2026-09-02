// Line-ending handling. What the model sees and what `edit` uses for matching must use the
// same line-ending convention.
//
// Only CRLF is handled: a lone \r (the classic Mac line ending) is left untouched, to avoid
// misinterpreting it as a line ending. As a result, a pure-LF file round-trips through
// normalization byte-for-byte identical, with no needless rewriting.

/** Get the file's dominant line ending. Whichever appears first wins. */
export function detectLineEnding(content) {
    const crlf = content.indexOf('\r\n');
    if (crlf === -1) return '\n';
    const lf = content.indexOf('\n');
    // The \n in a CRLF pair sits one position after the \r; if the first \n comes earlier,
    // the file is predominantly LF.
    return crlf < lf ? '\r\n' : '\n';
}

/** CRLF → LF. */
export function toLf(text) {
    return text.includes('\r\n') ? text.replace(/\r\n/g, '\n') : text;
}

/** LF → original line ending. */
export function restoreLineEnding(text, ending) {
    return ending === '\r\n' ? text.replace(/\n/g, '\r\n') : text;
}
