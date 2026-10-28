// Exam practice (owner's request, 2026-10-20): the mock exam builder, spotter
// mode for practicals, and "Your weakest 20". The settings travel in the quiz
// link (/learn/quiz?exam=…) and are kept on the attempt, so Results can name it
// and "Retake" builds the same kind of paper again. Pure: checked by
// tests/exam-practice.test.mjs.
import type { SubjectId } from '@/data/lesson-types';

export type ExamSettings =
  /** A timed paper mixed from one HB2 course's past papers, answers at the end. */
  | { kind: 'mock'; bank: string; size: number; minutes: number }
  /** Timed stations on pictures (lecture diagrams and past-paper pictures), answers at the end. */
  | { kind: 'spotter'; subject: SubjectId | 'all'; size: number; seconds: number }
  /** The learner's most-missed questions, with instant feedback. */
  | { kind: 'weakest' }
  /** Daily 10 (2026-10-28): due questions mixed across every course. */
  | { kind: 'daily' }
  /** 2-minute sprint: as many as possible from what has been studied. */
  | { kind: 'sprint' }
  /** Confused pairs: the answers the learner mixes up, asked side by side. */
  | { kind: 'pairs' };

export const MOCK_SIZES = [20, 40, 60, 100] as const;
export const MOCK_MINUTES = [15, 30, 45, 60, 90, 120] as const;
export const SPOTTER_STATIONS = [10, 20, 30, 40] as const;
export const SPOTTER_SECONDS = [30, 45, 60, 90] as const;
export const DEFAULT_SPOTTER_SECONDS = 45;

/** The usual pace: about a minute a question (rounded to a listed time). */
export function defaultMockMinutes(size: number): number {
  return MOCK_MINUTES.reduce((best, minutes) => (Math.abs(minutes - size) < Math.abs(best - size) ? minutes : best), MOCK_MINUTES[0]);
}

const SUBJECTS: readonly (SubjectId | 'all')[] = ['anatomy', 'physiology', 'biochemistry', 'all'];
const clampTo = (value: number, allowed: readonly number[], fallback: number) => (allowed.includes(value) ? value : fallback);

/** Reads exam settings from quiz-link values; null when they do not describe an exam. */
export function parseExam(get: (name: string) => string | undefined): ExamSettings | null {
  const kind = get('exam');
  if (kind === 'weakest' || kind === 'daily' || kind === 'sprint' || kind === 'pairs') return { kind };
  if (kind === 'mock') {
    const bank = get('bank') ?? '';
    if (!/^hb2-[a-z]+$/.test(bank)) return null;
    const size = clampTo(Number(get('size')), MOCK_SIZES, 40);
    return { kind: 'mock', bank, size, minutes: clampTo(Number(get('minutes')), MOCK_MINUTES, defaultMockMinutes(size)) };
  }
  if (kind === 'spotter') {
    const subject = get('subject') as SubjectId | 'all' | undefined;
    if (!subject || !SUBJECTS.includes(subject)) return null;
    return {
      kind: 'spotter',
      subject,
      size: clampTo(Number(get('size')), SPOTTER_STATIONS, 20),
      seconds: clampTo(Number(get('seconds')), SPOTTER_SECONDS, DEFAULT_SPOTTER_SECONDS),
    };
  }
  return null;
}

/** The quiz-link values for these settings (the opposite of parseExam). */
export function examQuery(exam: ExamSettings): Record<string, string | number> {
  switch (exam.kind) {
    case 'mock':
      return { exam: 'mock', bank: exam.bank, size: exam.size, minutes: exam.minutes };
    case 'spotter':
      return { exam: 'spotter', subject: exam.subject, size: exam.size, seconds: exam.seconds };
    case 'weakest':
    case 'daily':
    case 'sprint':
    case 'pairs':
      return { exam: exam.kind };
  }
}

/** Its title on the quiz and results pages. */
export function examTitle(exam: ExamSettings, courseName?: string): string {
  switch (exam.kind) {
    case 'mock':
      return `Mock exam${courseName ? ` · ${courseName}` : ''}`;
    case 'spotter':
      return `Spotter${exam.subject === 'all' ? '' : ` · ${exam.subject[0].toUpperCase()}${exam.subject.slice(1)}`}`;
    case 'weakest':
      return 'Your weakest 20';
    case 'daily':
      return 'Daily 10';
    case 'sprint':
      return '2-minute sprint';
    case 'pairs':
      return 'Confused pairs';
  }
}

/** Score per topic, weakest topic first (then by name). */
export function scoreByTopic(rows: readonly { topic: string; correct: boolean }[]) {
  const byTopic = new Map<string, { topic: string; right: number; total: number }>();
  for (const row of rows) {
    const entry = byTopic.get(row.topic) ?? { topic: row.topic, right: 0, total: 0 };
    entry.total += 1;
    if (row.correct) entry.right += 1;
    byTopic.set(row.topic, entry);
  }
  return [...byTopic.values()]
    .map((entry) => ({ ...entry, percent: Math.round((entry.right / entry.total) * 100) }))
    .sort((a, b) => a.percent - b.percent || a.topic.localeCompare(b.topic));
}
