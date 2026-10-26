// Text formatting in chat messages, the WhatsApp way (owner, 2026-10-26):
//   *bold*   _italic_   ~strikethrough~   `code`   ```monospace block```
// A marker only counts next to text (not spaces) and at a word's edge, so
// 2*3*4, snake_case and "a * b * c" stay as they are. Markers can be combined
// (*_both_*). Pure, so tests/chat-format.test.mjs can check it.

export type ChatSpan = { text: string; bold?: boolean; italic?: boolean; strike?: boolean; code?: boolean };
type Style = Omit<ChatSpan, 'text'>;

const MARKS: Record<string, keyof Style> = { '*': 'bold', _: 'italic', '~': 'strike' };
// Group 1: the character before the marker (or the start); group 2: the marker; group 3: the text inside.
const MARKED = /(^|[^\p{L}\p{N}*_~])([*_~])(\S(?:[^\n]*?\S)?)\2(?=$|[^\p{L}\p{N}*_~])/u;

function marked(text: string, style: Style): ChatSpan[] {
  const out: ChatSpan[] = [];
  let rest = text;
  while (rest) {
    const match = MARKED.exec(rest);
    if (!match) {
      out.push({ text: rest, ...style });
      break;
    }
    const start = match.index + match[1].length;
    if (start > 0) out.push({ text: rest.slice(0, start), ...style });
    out.push(...marked(match[3], { ...style, [MARKS[match[2]]]: true }));
    rest = rest.slice(match.index + match[0].length);
  }
  return out;
}

/** The message as spans of plain and formatted text. */
export function parseChatText(text: string): ChatSpan[] {
  const spans: ChatSpan[] = [];
  // ```blocks``` first (they may span lines), then `code`, then the markers.
  text.split(/(```[\s\S]+?```)/).forEach((block, blockIndex) => {
    if (!block) return;
    if (blockIndex % 2 === 1) {
      spans.push({ text: block.slice(3, -3), code: true });
      return;
    }
    block.split(/(`[^`\n]+`)/).forEach((part, partIndex) => {
      if (!part) return;
      if (partIndex % 2 === 1) spans.push({ text: part.slice(1, -1), code: true });
      else spans.push(...marked(part, {}));
    });
  });
  // Neighbours with the same style become one span.
  const merged: ChatSpan[] = [];
  for (const span of spans) {
    const prev = merged[merged.length - 1];
    if (prev && !!prev.bold === !!span.bold && !!prev.italic === !!span.italic && !!prev.strike === !!span.strike && !!prev.code === !!span.code) prev.text += span.text;
    else merged.push({ ...span });
  }
  return merged;
}

/** The message without its formatting markers (chat list previews, replies). */
export function plainChatText(text: string): string {
  return parseChatText(text).map((span) => span.text).join('');
}

/** True when the text uses any formatting (so plain messages skip the extra work). */
export function hasChatFormatting(text: string): boolean {
  return /[*_~`]/.test(text) && parseChatText(text).some((span) => span.bold || span.italic || span.strike || span.code);
}
