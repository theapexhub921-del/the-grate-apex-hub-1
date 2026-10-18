// Stump a friend — share one quiz question to the community feed; friends
// answer it right on the post.
//
// Stored on the shared Firestore rules with no rules change:
//   posts/{id}             a normal post plus stump: { qid, note }. The body
//                          spells the question out, so the original app (which
//                          doesn't know stumps) still shows a readable post.
//   posts/{id}/replies/*   each answer is a reply carrying stump: { pick, ok }.
//                          Answers are not comments: the comment list hides
//                          them and the comment count doesn't change.
// The question always comes from this app's bank (getQuestion), so the card
// shows the current wording and explanation. Only multiple-choice questions
// can be shared. Answering is also saved in the learner's question history
// (as practice), so it counts as revision. It earns no XP.
//
// Privacy (owner, 2026-10-18: answers must be private): only the sharer sees
// who got it right or wrong; everyone else sees just their own result. Answers
// are saved where the rules let only the answerer and the sharer read them:
//   posts/{id}/stumpAnswers/{uid}            feed stumps
//   groups/{gid}/stumpAnswers/{mid}_{uid}    group stumps (to = the sharer)
// A direct chat has only the two of you, so answers there stay chat messages.
// Until the new rules are published, saving falls back to the old public way
// (a reply / a group message), and older answers are still read from there.
import { collection, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, serverTimestamp, setDoc, type Unsubscribe, where } from 'firebase/firestore';

import { sendChatMessage } from '@/data/chat';
import { blockedLearners, type CommunityMessage, createCommunityPost, getOrCreateFriendConversation, type MessageShare, myUsername } from '@/data/community';
import { getQuestion } from '@/data/curriculum';
import { loadPastQuestions } from '@/data/past-questions';
import { forgetFriendStreak } from '@/data/friend-streak-store';
import { sendGroupMessage } from '@/data/group-chat';
import { getQuestionHistory, recordQuestionAttempts } from '@/data/question-history';
import { type ChoiceQuestion, type Question, stableShuffle } from '@/data/questions';
import { db } from '@/lib/firebase';
import { announceGroupMessage, announceMessage } from '@/lib/web-push';

export const STUMP_NOTE_MAX = 200;
export const LETTERS = 'ABCDEFGH';

export type StumpAnswer = { userId: string; username: string | null; pick: number; ok: boolean; at: string };

/** Questions that can be shared: multiple choice with a single right answer. */
export function canStump(question: Question | undefined | null): question is ChoiceQuestion {
  return Boolean(question && question.type === 'choice' && question.options.length >= 2 && question.options.length <= LETTERS.length);
}

/** The shared question, or null when it has left the bank or can't be stumped. */
export function stumpQuestion(questionId: string): ChoiceQuestion | null {
  const question = getQuestion(questionId);
  return canStump(question) ? question : null;
}

/** A past-paper question id (`legacy:<course>:<id>`): its paper can be loaded to find it. */
export const canLoadStumpQuestion = (questionId: string) => /^legacy:[^:]+:/.test(questionId);

/** The shared question, loading its past-paper bank first when this device hasn't yet. */
export async function loadStumpQuestion(questionId: string): Promise<ChoiceQuestion | null> {
  const found = stumpQuestion(questionId);
  if (found) return found;
  const course = /^legacy:([^:]+):/.exec(questionId)?.[1];
  if (!course) return null;
  await loadPastQuestions(course).catch(() => null);
  return stumpQuestion(questionId);
}

/**
 * The order options are shown in: the same everywhere this question is shared
 * (so the letters in the post text match the card), and the authored order
 * for True/False-style questions.
 */
export function stumpOptionOrder(question: ChoiceQuestion): number[] {
  return question.fixedOrder ? question.options.map((_, index) => index) : stableShuffle(question.options.length, `stump:${question.id}`);
}

/** The post text: what the original app and reposts show. */
function stumpPostText(question: ChoiceQuestion, note: string) {
  const options = stumpOptionOrder(question).map((index, position) => `${LETTERS[position]}. ${question.options[index]}`);
  const text = [note, `Stump a friend: ${question.prompt}`, options.join('\n'), 'Answer it on GrAte Apex Hub.'].filter(Boolean).join('\n\n');
  return text.slice(0, 2000);
}

/** Shares a question to the community feed. */
export async function createStumpPost(question: ChoiceQuestion, note: string) {
  const cleanNote = note.trim().slice(0, STUMP_NOTE_MAX);
  return createCommunityPost(stumpPostText(question, cleanNote), undefined, null, { qid: question.id, note: cleanNote });
}

const isoOf = (value: unknown) => ((value as { toDate?: () => Date } | null)?.toDate ? (value as { toDate: () => Date }).toDate().toISOString() : new Date().toISOString());
const denied = (error: unknown) => (error as { code?: string } | null)?.code === 'permission-denied';

/** First answer per learner, oldest first, without blocked learners. */
export function firstAnswers(list: readonly StumpAnswer[], blocked: ReadonlySet<string> = new Set()): StumpAnswer[] {
  const seen = new Set<string>();
  return [...list]
    .sort((a, b) => Date.parse(a.at) - Date.parse(b.at))
    .filter((answer) => {
      if (!answer.userId || seen.has(answer.userId) || blocked.has(answer.userId)) return false;
      seen.add(answer.userId);
      return true;
    });
}

/** Answers I can see on a feed stump: all of them on my own, otherwise only mine. */
export async function listStumpAnswers(postId: string, sharerId?: string | null): Promise<StumpAnswer[]> {
  const me = (await myUsername().catch(() => null))?.uid ?? null;
  const privateAnswers = collection(db, 'posts', postId, 'stumpAnswers');
  const [legacy, hidden, blocked] = await Promise.all([
    // Answers saved before the private rules (public replies).
    getDocs(query(collection(db, 'posts', postId, 'replies'), orderBy('createdAt', 'asc'), limit(300))).then((snap) => snap.docs.flatMap((item) => {
      const d = item.data();
      if (!d.stump || typeof d.stump.pick !== 'number') return [];
      return [{ userId: String(d.authorUid ?? ''), username: typeof d.authorName === 'string' ? d.authorName : null, pick: d.stump.pick as number, ok: d.stump.ok === true, at: isoOf(d.createdAt) }];
    })).catch(() => [] as StumpAnswer[]),
    (me && sharerId === me
      ? getDocs(query(privateAnswers, limit(500))).then((snap) => snap.docs.map((item) => ({ id: item.id, d: item.data() })))
      : me ? getDoc(doc(privateAnswers, me)).then((item) => (item.exists() ? [{ id: item.id, d: item.data() }] : [])) : Promise.resolve([])
    ).catch(() => []),
    blockedLearners(),
  ]);
  const answers = hidden.map(({ id, d }) => ({ userId: id, username: typeof d.username === 'string' ? d.username : null, pick: Number(d.pick), ok: d.ok === true, at: isoOf(d.at) }));
  return firstAnswers([...legacy, ...answers], blocked);
}

/**
 * Saves my answer (pick = the option's index in the question) and returns it.
 * One try each: if I already answered (say, on another copy of the card), that
 * answer is returned and nothing new is saved.
 */
export async function answerStump(postId: string, question: ChoiceQuestion, pick: number, sharerId?: string | null): Promise<StumpAnswer> {
  const me = await myUsername();
  const earlier = (await listStumpAnswers(postId, sharerId)).find((answer) => answer.userId === me.uid);
  if (earlier) return earlier;
  const ok = pick === question.answer;
  try {
    await setDoc(doc(db, 'posts', postId, 'stumpAnswers', me.uid), { username: me.username, pick, ok, at: serverTimestamp() });
  } catch (error) {
    if (!denied(error)) throw error;
    // The private rules are not published yet: the old public way.
    await setDoc(doc(collection(db, 'posts', postId, 'replies')), {
      body: 'Answered this Stump a friend question.',
      authorUid: me.uid,
      authorName: me.username,
      createdAt: serverTimestamp(),
      stump: { pick, ok },
    });
  }
  recordStumpPractice(question, ok);
  return { userId: me.uid, username: me.username, pick, ok, at: new Date().toISOString() };
}

/** Answering counts as revision in the learning engine (no XP). */
function recordStumpPractice(question: ChoiceQuestion, ok: boolean) {
  void recordQuestionAttempts([
    { questionId: question.id, topicId: question.topicId ?? '', lessonId: question.lessonId ?? '', concept: question.concept, conceptId: question.conceptId, correct: ok, attemptedAt: Date.now(), mode: 'practice' },
  ]).catch(() => undefined);
}

// ─── Stumps sent in chats (direct and group) ─────────────────────────
// Owner's request (2026-10-18): a stump can go to the feed, to friends (each
// in your private chat) and to groups, in any mix. A stump in a chat is a
// message with share: { kind: 'stump', id: <question id>, text, note }; an
// answer is a message with share: { kind: 'stumpAnswer', id: <stump message
// id>, pick, ok }. The deployed rules already allow `share` on chat and group
// messages (and the original app shows it as a shared post), so no rules
// change is needed. Stumps in a direct chat are what keep a friend streak
// (data/friend-streaks.ts).
//
// Answers are not shown as chat bubbles: the stump card reads them. As on the
// feed, only the sender sees who got it right or wrong; everyone else sees
// just their own result. In a group, answers are private documents
// (groups/{gid}/stumpAnswers, see the top of this file), so other members
// can't read them at all.

export type StumpTargets = { feed: boolean; friendIds: readonly string[]; groupIds: readonly string[] };
export type StumpSendResult = { feed: boolean; friends: number; groups: number; failed: number };

/** The stump's share text: what the original app and chat previews show. */
function stumpShareText(question: ChoiceQuestion) {
  const options = stumpOptionOrder(question).map((index, position) => `${LETTERS[position]}. ${question.options[index]}`);
  return [`Stump a friend: ${question.prompt}`, options.join('\n')].join('\n').slice(0, 280);
}

/** Sends one question wherever the learner chose. Partly failing sends still report what went out. */
export async function sendStump(question: ChoiceQuestion, note: string, targets: StumpTargets): Promise<StumpSendResult> {
  const cleanNote = note.trim().slice(0, STUMP_NOTE_MAX);
  if (!targets.feed && !targets.friendIds.length && !targets.groupIds.length) throw new Error('Choose the feed, a friend or a group to send it to.');
  const me = await myUsername();
  const share: MessageShare = { kind: 'stump', uid: me.uid, username: me.username, id: question.id, text: stumpShareText(question), ...(cleanNote ? { note: cleanNote } : {}) };
  const result: StumpSendResult = { feed: false, friends: 0, groups: 0, failed: 0 };

  if (targets.feed) {
    try { await createStumpPost(question, cleanNote); result.feed = true; } catch { result.failed += 1; }
  }
  for (const friendId of targets.friendIds) {
    try {
      const chatId = await getOrCreateFriendConversation(friendId);
      await sendChatMessage(chatId, cleanNote, { share });
      void announceMessage(chatId, friendId);
      forgetFriendStreak(chatId);
      result.friends += 1;
    } catch {
      result.failed += 1;
    }
  }
  for (const groupId of targets.groupIds) {
    try {
      await sendGroupMessage(groupId, cleanNote, { share });
      void announceGroupMessage(groupId);
      result.groups += 1;
    } catch {
      result.failed += 1;
    }
  }
  if (!result.feed && !result.friends && !result.groups) throw new Error('The question could not be sent. Check your connection and try again.');
  return result;
}

/**
 * Everyone's answers to a stump in a chat, first answer per learner: answer
 * messages (direct chats, and group answers saved before the private rules)
 * plus a group's private answers (`extra`).
 */
export function chatStumpAnswers(messages: readonly CommunityMessage[], stumpMessageId: string, extra: readonly StumpAnswer[] = []): StumpAnswer[] {
  const fromMessages = messages.flatMap((message) => {
    const share = message.share;
    if (share?.kind !== 'stumpAnswer' || share.id !== stumpMessageId || typeof share.pick !== 'number') return [];
    return [{ userId: message.sender_id, username: share.username, pick: share.pick, ok: share.ok === true, at: message.created_at }];
  });
  return firstAnswers([...fromMessages, ...extra]);
}

/**
 * A group's private stump answers I may read, live, by stump message id: the
 * answers to my stumps, and my own answers. Empty until the rules allow it.
 */
export function watchGroupStumpAnswers(groupId: string, me: string, onAnswers: (byStump: ReadonlyMap<string, StumpAnswer[]>) => void): Unsubscribe {
  const toMe = new Map<string, StumpAnswer & { stump: string }>();
  const fromMe = new Map<string, StumpAnswer & { stump: string }>();
  const emit = () => {
    const byStump = new Map<string, StumpAnswer[]>();
    for (const answer of [...toMe.values(), ...fromMe.values()]) byStump.set(answer.stump, [...(byStump.get(answer.stump) ?? []), answer]);
    onAnswers(byStump);
  };
  const listen = (field: 'to' | 'from', into: Map<string, StumpAnswer & { stump: string }>) => onSnapshot(
    query(collection(db, 'groups', groupId, 'stumpAnswers'), where(field, '==', me), limit(500)),
    (snap) => {
      into.clear();
      for (const item of snap.docs) {
        const d = item.data({ serverTimestamps: 'estimate' });
        into.set(item.id, { stump: String(d.stump ?? ''), userId: String(d.from ?? ''), username: typeof d.username === 'string' ? d.username : null, pick: Number(d.pick), ok: d.ok === true, at: isoOf(d.at) });
      }
      emit();
    },
    () => {} // the private rules are not published yet
  );
  const stops = [listen('to', toMe), listen('from', fromMe)];
  return () => stops.forEach((stop) => stop());
}

/** Saves my answer to a stump in a chat. One try: an earlier answer is returned unchanged. */
export async function answerChatStump(
  place: { chatId: string; friendId?: string; groupId?: string; sharerId?: string },
  stumpMessageId: string,
  question: ChoiceQuestion,
  pick: number,
  earlier: readonly StumpAnswer[],
): Promise<StumpAnswer> {
  const me = await myUsername();
  const mine = earlier.find((answer) => answer.userId === me.uid);
  if (mine) return mine;
  const ok = pick === question.answer;
  const share: MessageShare = { kind: 'stumpAnswer', uid: me.uid, username: me.username, id: stumpMessageId, text: 'Answered a Stump a friend question.', pick, ok };
  if (place.groupId) {
    try {
      await setDoc(doc(db, 'groups', place.groupId, 'stumpAnswers', `${stumpMessageId}_${me.uid}`), {
        from: me.uid, to: place.sharerId ?? '', stump: stumpMessageId, username: me.username, pick, ok, at: serverTimestamp(),
      });
    } catch (error) {
      if (!denied(error)) throw error;
      await sendGroupMessage(place.groupId, '', { share }); // the private rules are not published yet
    }
  } else {
    await sendChatMessage(place.chatId, '', { share });
  }
  recordStumpPractice(question, ok);
  return { userId: me.uid, username: me.username, pick, ok, at: new Date().toISOString() };
}

/**
 * A question to stump a friend with, picked at random from questions I have
 * answered myself (most recent 200) — never one I haven't met (owner,
 * 2026-10-18). `skip` avoids repeats when the learner asks for another one.
 */
export function pickStumpQuestion(skip: ReadonlySet<string> = new Set()): ChoiceQuestion | null {
  const recent: ChoiceQuestion[] = [];
  const seen = new Set<string>();
  const history = getQuestionHistory();
  for (let index = history.length - 1; index >= 0 && recent.length < 200; index -= 1) {
    const id = history[index].questionId;
    if (seen.has(id)) continue;
    seen.add(id);
    const question = stumpQuestion(id);
    if (question && !skip.has(id)) recent.push(question);
  }
  return recent.length ? recent[Math.floor(Math.random() * recent.length)] : null;
}
