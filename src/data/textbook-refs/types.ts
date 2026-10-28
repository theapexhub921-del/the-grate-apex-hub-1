// Textbook pages per reading section: lesson id → section index → the
// books (content-catalog source ids) and printed page numbers.
export type TextbookPages = Record<string, Record<number, [sourceId: string, pages: number[]][]>>;
