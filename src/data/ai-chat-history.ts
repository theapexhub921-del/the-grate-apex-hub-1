// AI chat history: what kind of chat a saved conversation is, and how it is
// stored. Pure, for tests. Saving and loading are in data/tutor-chats.ts.
//
// Every AI chat in the app is saved to the learner's account in
// users/{uid}/tutorChats/{chatId} (owner-only; the deployed rules allow
// { title ≤120, turns: list ≤100, createdAt, updatedAt } and ids
// /^[a-z0-9_-]{1,80}$/). Two things make that one place hold every kind:
//   • the id starts with the kind: tc_ Apex AI, la_<lesson>_ Ask AI in a
//     lesson, ex_ an "Explain with AI" thread, vt_ a Voice tutor session;
//   • the first stored turn is a context note ({ role: 'context', text: JSON })
//     with the lesson (and, for an explanation, the question) the chat is about,
//     so it can be continued later. Apex AI chats saved before this have no note.
import type { ChatTurn, ExplainItem } from '@/lib/ai-study-api';

export type AiChatKind = 'study' | 'lesson' | 'explain' | 'voice';

export type AiChatContext = {
  kind: AiChatKind;
  lessonId?: string;
  lessonTitle?: string;
  /** For an explanation: the question or flashcard it explains. */
  item?: ExplainItem;
};

export const AI_CHAT_KINDS: readonly AiChatKind[] = ['study', 'lesson', 'explain', 'voice'];

export const AI_CHAT_LABEL: Record<AiChatKind, string> = {
  study: 'Apex AI',
  lesson: 'Ask AI',
  explain: 'AI explanation',
  voice: 'Voice tutor',
};

const PREFIX: Record<AiChatKind, string> = { study: 'tc', lesson: 'la', explain: 'ex', voice: 'vt' };

/** Stored turns: the context note plus at most this many messages (the rules allow 100). */
export const MAX_SAVED_TURNS = 99;

const ID = /^[a-z0-9_-]{1,80}$/;

/** A lesson id as it can appear inside a chat id. */
export function lessonKey(lessonId: string): string {
  return lessonId.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || 'lesson';
}

/** The start shared by every saved chat about one lesson (so they can be listed by id). */
export function lessonChatPrefix(lessonId: string): string {
  return `${PREFIX.lesson}_${lessonKey(lessonId)}_`;
}

/** A new chat id, made on the device when the first answer arrives. */
export function newAiChatId(kind: AiChatKind, lessonId?: string, now = Date.now(), random = Math.random()): string {
  const stamp = `${now.toString(36)}${Math.floor(random * 36 ** 4).toString(36).padStart(4, '0')}`;
  const id = kind === 'lesson' && lessonId ? `${lessonChatPrefix(lessonId)}${stamp}` : `${PREFIX[kind]}_${stamp}`;
  if (!ID.test(id)) throw new Error(`Bad chat id ${id}`);
  return id;
}

/** The kind of a saved chat, from its id (older Apex AI chats: tc_…). */
export function kindOfChatId(id: string): AiChatKind {
  const prefix = id.split('_')[0];
  return (AI_CHAT_KINDS.find((kind) => PREFIX[kind] === prefix) ?? 'study');
}

/** The turns as saved: the context note first, then the newest messages. */
export function packTurns(context: AiChatContext, turns: readonly ChatTurn[]): { role: string; text: string }[] {
  const clean: AiChatContext = { kind: context.kind };
  if (context.lessonId) clean.lessonId = context.lessonId;
  if (context.lessonTitle) clean.lessonTitle = context.lessonTitle.slice(0, 160);
  if (context.item) clean.item = context.item;
  const messages = turns.slice(-MAX_SAVED_TURNS).map((turn) => ({ role: turn.role, text: String(turn.text) }));
  return [{ role: 'context', text: JSON.stringify(clean) }, ...messages];
}

/** Reads saved turns back: the context note (or null for an older chat) and the messages. */
export function unpackTurns(stored: unknown): { context: AiChatContext | null; turns: ChatTurn[] } {
  const list = Array.isArray(stored) ? stored : [];
  let context: AiChatContext | null = null;
  const turns: ChatTurn[] = [];
  for (const item of list) {
    if (!item || typeof item !== 'object') continue;
    const { role, text } = item as { role?: unknown; text?: unknown };
    if (typeof text !== 'string') continue;
    if (role === 'context') {
      try {
        const parsed = JSON.parse(text) as AiChatContext;
        if (parsed && AI_CHAT_KINDS.includes(parsed.kind)) context = parsed;
      } catch {
        // a damaged note: the messages still show
      }
      continue;
    }
    if ((role === 'user' || role === 'model') && text) turns.push({ role, text });
  }
  return { context, turns };
}

const short = (text: string, max: number) => {
  const flat = text.replace(/\s+/g, ' ').trim();
  return flat.length > max ? `${flat.slice(0, max - 1).trimEnd()}…` : flat;
};

/** The title shown in the list: what the learner asked (or the question explained). */
export function aiChatTitle(context: AiChatContext, turns: readonly ChatTurn[]): string {
  if (context.kind === 'explain' && context.item?.prompt) return short(context.item.prompt, 80);
  const first = turns.find((turn) => turn.role === 'user')?.text ?? '';
  if (first.trim()) return short(first, 80);
  return context.kind === 'voice' ? 'Voice tutor session' : AI_CHAT_LABEL[context.kind];
}

/** A chat can be continued in Apex AI unless it was a voice call. */
export const canContinue = (kind: AiChatKind) => kind !== 'voice';
