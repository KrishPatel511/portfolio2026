/* A small colouring pass for short code snippets (JS, CSS and HTML): comments, strings, keywords,
   numbers, tags and property names. It is not a full highlighter, but it adds almost nothing to the page. */

const TOKEN = new RegExp(
  [
    '(\\/\\/.*$|\\/\\*[\\s\\S]*?\\*\\/|<!--[\\s\\S]*?-->)', // 1 comments
    '("(?:[^"\\\\\\n]|\\\\.)*"|\'(?:[^\'\\\\\\n]|\\\\.)*\'|`(?:[^`\\\\]|\\\\.)*`)', // 2 strings
    '\\b(const|let|var|if|else|throw|new|from|import|export|return|await|async|function|for|of|in|true|false|null|default)\\b|(@[a-z-]+)', // 3 keywords, 4 at-rules
    '(<\\/?[a-zA-Z][\\w-]*|\\/?>)', // 5 tags
    '\\b(\\d+(?:\\.\\d+)?(?:px|rem|em|ms|s|%|deg)?)\\b', // 6 numbers
    '(--[\\w-]+|[A-Za-z_$][\\w$-]*)(?=\\s*:(?!:))', // 7 property names
  ].join('|'),
  'gm'
);

export const Highlighted = ({ code }) => {
  const out = [];
  let last = 0;
  let m;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(code))) {
    if (m[0] === '') { TOKEN.lastIndex += 1; continue; }
    if (m.index > last) out.push(code.slice(last, m.index));
    const cls = m[1] ? 'c' : m[2] ? 's' : m[3] || m[4] ? 'k' : m[5] ? 't' : m[6] ? 'n' : 'p';
    out.push(<span key={m.index} className={`bl-tok-${cls}`}>{m[0]}</span>);
    last = m.index + m[0].length;
  }
  out.push(code.slice(last));
  return out;
};
