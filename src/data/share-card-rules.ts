// Sharing questions and quizzes outside the app (owner, 2026-10-29: "allow users
// to share quizzes, tests and questions outside the app, with the GRATEAPEX logo
// on what is sent"). What goes on the picture and in the message; the picture
// itself is drawn by lib/share-card.ts. Pure: tests/share-card.test.mjs.
//
// The answer is never shown: the point is for the friend to open the link and
// answer it in the app (signing up if they need to).
import type { Question } from '@/data/questions';

export const SHARE_BRAND = 'GrAte Apex';
export const SHARE_TAGLINE = 'Reach the Apex of GrAteness';

export type ShareCard = {
  /** Small line above the title, e.g. "ANATOMY · UPPER LIMB". */
  kicker: string;
  /** The big text: the question, or "I scored 8/10 …". */
  title: string;
  /** Options (A–D), items to order, or a few details. */
  lines: { label?: string; text: string }[];
  /** Under the lines, e.g. "Has a picture: open the link to see it." */
  note?: string;
  /** The call to action on the picture. */
  cta: string;
  /** Where the link opens (full address). */
  url: string;
  /** The message sent with the picture (or alone, where pictures cannot be shared). */
  message: string;
};

const LETTERS = 'ABCDEFGH';

/** A fixed shuffle (same question, same order), so the right answer is not always A. */
export function stableShuffle<T>(items: readonly T[], seed: string): T[] {
  let state = 2166136261;
  for (const char of seed) state = Math.imul(state ^ char.charCodeAt(0), 16777619) >>> 0;
  const next = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const upper = (text: string) => text.toUpperCase();

/** The card for one question. `where` is e.g. "Anatomy · Upper Limb"; `url` opens the question in the app. */
export function questionShareCard(question: Question, where: string, url: string): ShareCard {
  let lines: ShareCard['lines'] = [];
  let note: string | undefined;
  switch (question.type) {
    case 'choice':
    case 'multi': {
      const keepOrder = question.type === 'choice' && question.fixedOrder;
      const options = keepOrder ? question.options : stableShuffle(question.options, question.id);
      lines = options.slice(0, LETTERS.length).map((text, index) => ({ label: LETTERS[index], text }));
      if (question.type === 'multi') note = 'Choose all that apply.';
      break;
    }
    case 'order':
      lines = stableShuffle(question.items, question.id).map((text) => ({ text }));
      note = 'Put these in the right order.';
      break;
    case 'match':
      lines = question.pairs.map((pair) => ({ text: pair.left }));
      note = 'Match each one to its partner in the app.';
      break;
    case 'type':
      note = 'Type your answer in the app.';
      break;
  }
  if (question.figure || question.image) note = [note, 'It has a picture: open the link to see it.'].filter(Boolean).join(' ');
  const cta = 'Can you answer it? Try it free on GrAte Apex';
  return {
    kicker: upper(where),
    title: question.prompt,
    lines,
    note,
    cta,
    url,
    message: `Can you answer this? "${question.prompt}"\n\nAnswer it on ${SHARE_BRAND}: ${url}`,
  };
}

/** The card for a finished quiz or test. */
export function quizShareCard(input: {
  title: string;
  where: string;
  score: number;
  total: number;
  timeLabel?: string;
  url: string;
}): ShareCard {
  const percent = input.total > 0 ? Math.round((input.score / input.total) * 100) : 0;
  const lines: ShareCard['lines'] = [
    { label: 'Score', text: `${input.score} of ${input.total} (${percent}%)` },
    { label: 'Questions', text: String(input.total) },
  ];
  if (input.timeLabel) lines.push({ label: 'Time', text: input.timeLabel });
  return {
    kicker: upper(input.where || 'Quiz'),
    title: `I scored ${input.score}/${input.total} on ${input.title}. Can you beat me?`,
    lines,
    cta: 'Take the same quiz free on GrAte Apex',
    url: input.url,
    message: `I scored ${input.score}/${input.total} (${percent}%) on ${input.title} on ${SHARE_BRAND}. Can you beat me? Take the same quiz: ${input.url}`,
  };
}

/** The file name for the picture. */
export const shareFileName = (card: Pick<ShareCard, 'kicker'>) =>
  `grateapex-${card.kicker.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'share'}.png`;
