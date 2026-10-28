import { collection, deleteDoc, doc, documentId, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, Timestamp, where } from 'firebase/firestore';

import { type AiChatContext, type AiChatKind, aiChatTitle, kindOfChatId, lessonChatPrefix, newAiChatId, packTurns, unpackTurns } from '@/data/ai-chat-history';
import { auth, db } from '@/lib/firebase';
import type { ChatTurn } from '@/lib/ai-study-api';

// AI chat history (every AI chat in the app: Apex AI, Ask AI in lessons,
// "Explain with AI" and Voice tutor), saved to the signed-in learner's account at
// users/{uid}/tutorChats/{chatId} = { title, turns, createdAt, updatedAt }.
// Only the owner can read, change or delete their chats (firestore.rules).
// How one collection holds every kind: data/ai-chat-history.ts.

export type TutorChatSummary = {
  id: string;
  kind: AiChatKind;
  title: string;
  /** The lesson an Ask AI chat or explanation is about. */
  lessonId: string | null;
  lessonTitle: string | null;
  turnCount: number;
  updatedAt: string | null;
};

export type TutorChat = TutorChatSummary & {
  turns: ChatTurn[];
  context: AiChatContext;
  createdAt: string;
};

const MAX_LIST = 50;

function requireUid(): string {
  const user = auth.currentUser;
  if (!user) throw new Error('Sign in to use your AI chat history.');
  return user.uid;
}

function chatsCollection(uid: string) {
  return collection(db, 'users', uid, 'tutorChats');
}

function toIso(value: unknown): string | null {
  return value instanceof Timestamp ? value.toDate().toISOString() : null;
}

function read(id: string, data: Record<string, unknown>) {
  const { context, turns } = unpackTurns(data.turns);
  const full: AiChatContext = context ?? { kind: kindOfChatId(id) };
  return {
    summary: {
      id,
      kind: full.kind,
      title: typeof data.title === 'string' && data.title ? data.title : aiChatTitle(full, turns),
      lessonId: full.lessonId ?? null,
      lessonTitle: full.lessonTitle ?? null,
      turnCount: turns.length,
      updatedAt: toIso(data.updatedAt),
    } satisfies TutorChatSummary,
    context: full,
    turns,
  };
}

/** A new Apex AI id (other kinds: newAiChatId in data/ai-chat-history.ts). */
export function newTutorChatId(): string {
  return newAiChatId('study');
}

/** My most recent AI chats of every kind, newest first. */
export async function listTutorChats(): Promise<TutorChatSummary[]> {
  const uid = requireUid();
  const snap = await getDocs(query(chatsCollection(uid), orderBy('updatedAt', 'desc'), limit(MAX_LIST)));
  return snap.docs.map((item) => read(item.id, item.data()).summary);
}

/** My Ask AI chats about one lesson, newest first (only that lesson's are read). */
export async function listLessonChats(lessonId: string, max = 10): Promise<TutorChatSummary[]> {
  const uid = requireUid();
  const prefix = lessonChatPrefix(lessonId);
  const snap = await getDocs(query(chatsCollection(uid), where(documentId(), '>=', prefix), where(documentId(), '<', `${prefix}`), limit(max)));
  return snap.docs
    .map((item) => read(item.id, item.data()).summary)
    .filter((chat) => !chat.lessonId || chat.lessonId === lessonId)
    .sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''));
}

export async function getTutorChat(id: string): Promise<TutorChat | null> {
  const uid = requireUid();
  const snap = await getDoc(doc(chatsCollection(uid), id));
  if (!snap.exists()) return null;
  const data = snap.data();
  const { summary, context, turns } = read(snap.id, data);
  return { ...summary, context, turns, createdAt: typeof data.createdAt === 'string' ? data.createdAt : new Date().toISOString() };
}

export async function saveTutorChat(chat: { id: string; turns: readonly ChatTurn[]; createdAt: string; context?: AiChatContext }): Promise<void> {
  const uid = requireUid();
  const context = chat.context ?? { kind: kindOfChatId(chat.id) };
  const turns = packTurns(context, chat.turns);
  await setDoc(doc(chatsCollection(uid), chat.id), {
    title: aiChatTitle(context, chat.turns),
    turns: JSON.parse(JSON.stringify(turns)),
    createdAt: chat.createdAt,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteTutorChat(id: string): Promise<void> {
  const uid = requireUid();
  await deleteDoc(doc(chatsCollection(uid), id));
}
