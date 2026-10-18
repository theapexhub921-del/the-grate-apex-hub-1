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
// Privacy: only the sharer's card lists who got it right or wrong; everyone
// else sees just their own result. (The shared rules let any signed-in learner
// read replies, so this is a screen rule, not a database one.)
import { collection, doc, getDocs, limit, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';

import { sendChatMessage } from '@/data/chat';
import { blockedLearners, type CommunityMessage, createCommunityPost, getOrCreateFriendConversation, type MessageShare, myUsername } from '@/data/community';
import { getQuestion, getTopicQuestions, publishedTopics } from '@/data/curriculum';
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

/** Everyone's answers to a stump, first answer per learner, oldest first. */
export async function listStumpAnswers(postId: string): Promise<StumpAnswer[]> {
  const [snap, blocked] = await Promise.all([
    getDocs(query(collection(db, 'posts', postId, 'replies'), orderBy('createdAt', 'asc'), limit(300))),
    blockedLearners(),
  ]);
  const seen = new Set<string>();
  const answers: StumpAnswer[] = [];
  for (const item of snap.docs) {
    const d = item.data();
    const userId = String(d.authorUid ?? '');
    if (!d.stump || typeof d.stump.pick !== 'number' || !userId || seen.has(userId) || blocked.has(userId)) continue;
    seen.add(userId);
    answers.push({
      userId,
      username: typeof d.authorName === 'string' ? d.authorName : null,
      pick: d.stump.pick,
      ok: d.stump.ok === true,
      at: d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : new Date().toISOString(),
    });
  }
  return answers;
}

/**
 * Saves my answer (pick = the option's index in the question) and returns it.
 * One try each: if I already answered (say, on another copy of the card), that
 * answer is returned and nothing new is saved.
 */
export async function answerStump(postId: string, question: ChoiceQuestion, pick: number): Promise<StumpAnswer> {
  const me = await myUsername();
  const earlier = (await listStumpAnswers(postId)).find((answer) => answer.userId === me.uid);
  if (earlier) return earlier;
  const ok = pick === question.answer;
  await setDoc(doc(collection(db, 'posts', postId, 'replies')), {
    body: 'Answered this Stump a friend question.',
    authorUid: me.uid,
    authorName: me.username,
    createdAt: serverTimestamp(),
    stump: { pick, ok },
  });
  // Counts as revision in the learning engine (no XP).
  void recordQuestionAttempts([
    {
      questionId: question.id,
      topicId: question.topicId ?? '',
      lessonId: question.lessonId ?? '',
      concept: question.concept,
      conceptId: question.conceptId,
      correct: ok,
      attemptedAt: Date.now(),
      mode: 'practice',
    },
  ]).catch(() => undefined);
  return { userId: me.uid, username: me.username, pick, ok, at: new Date().toISOString() };
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
// just their own result (a screen rule — chat members can read each other's
// messages).

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

/** Everyone's answers to a stump in a chat (from the chat's messages), first answer per learner. */
export function chatStumpAnswers(messages: readonly CommunityMessage[], stumpMessageId: string): StumpAnswer[] {
  const seen = new Set<string>();
  const answers: StumpAnswer[] = [];
  for (const message of messages) {
    const share = message.share;
    if (share?.kind !== 'stumpAnswer' || share.id !== stumpMessageId || typeof share.pick !== 'number') continue;
    if (seen.has(message.sender_id)) continue;
    seen.add(message.sender_id);
    answers.push({ userId: message.sender_id, username: share.username, pick: share.pick, ok: share.ok === true, at: message.created_at });
  }
  return answers;
}

/** Saves my answer to a stump in a chat. One try: an earlier answer is returned unchanged. */
export async function answerChatStump(
  where: { chatId: string; friendId?: string; groupId?: string },
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
  if (where.groupId) await sendGroupMessage(where.groupId, '', { share });
  else await sendChatMessage(where.chatId, '', { share });
  void recordQuestionAttempts([
    { questionId: question.id, topicId: question.topicId ?? '', lessonId: question.lessonId ?? '', concept: question.concept, conceptId: question.conceptId, correct: ok, attemptedAt: Date.now(), mode: 'practice' },
  ]).catch(() => undefined);
  return { userId: me.uid, username: me.username, pick, ok, at: new Date().toISOString() };
}

/**
 * A question to stump a friend with, picked at random: first from questions I
 * have answered (most recent 200), else from any published lesson. `skip`
 * avoids repeats when the learner asks for another one.
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
  const pool = recent.length ? recent : publishedTopics.flatMap((topic) => getTopicQuestions(topic.id)).filter((item): item is ChoiceQuestion => canStump(item) && !skip.has(item.id));
  return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
}
