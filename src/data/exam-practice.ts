// The question pools for exam practice (src/data/exam-practice-rules.ts has the
// settings): which questions a mock exam, a spotter or "Your weakest 20" draws from.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

import { getQuestion, getTopicQuestions, publishedTopics } from '@/data/curriculum';
import type { ExamSettings } from '@/data/exam-practice-rules';
import { weakestQuestionIds, localDay } from '@/data/learning/weakest';
import type { MemoryModel } from '@/data/learning/memory';
import type { SubjectId } from '@/data/lesson-types';
import { pastCourseForSubject } from '@/data/past-question-topics';
import { allPastQuestions, loadPastQuestions, pastCourseOf } from '@/data/past-questions';
import type { Question } from '@/data/questions';

export * from '@/data/exam-practice-rules';

export const EXAM_SUBJECTS: readonly SubjectId[] = ['anatomy', 'physiology', 'biochemistry'];
/** The HB2 past-paper banks (one per subject). */
export const EXAM_BANKS = EXAM_SUBJECTS.map(pastCourseForSubject);
export const SUBJECT_NAME: Record<SubjectId, string> = { anatomy: 'Anatomy', physiology: 'Physiology', biochemistry: 'Biochemistry' };
export const bankSubject = (bank: string) => EXAM_SUBJECTS.find((subject) => pastCourseForSubject(subject) === bank);

/** The past-paper banks an exam needs loaded before it can be planned. */
export function examBanks(exam: ExamSettings | null): string[] {
  if (!exam) return [];
  if (exam.kind === 'mock') return [exam.bank];
  if (exam.kind === 'spotter') return exam.subject === 'all' ? [...EXAM_BANKS] : [pastCourseForSubject(exam.subject)];
  // Daily 10 and sprints ask the app's own topic questions.
  if (exam.kind === 'daily' || exam.kind === 'sprint') return [];
  return [...EXAM_BANKS];
}

/** A mock exam's pool: every past question of the course (once). */
export const mockPool = (bank: string): Question[] => allPastQuestions(bank);

/**
 * A spotter's stations: questions asked on a picture — the lecture diagrams'
 * "what is the marked part?" questions and past-paper questions with a picture.
 */
export function spotterPool(subject: SubjectId | 'all'): Question[] {
  const subjects = subject === 'all' ? EXAM_SUBJECTS : [subject];
  const diagrams = publishedTopics
    .filter((topic) => subjects.includes(topic.subject))
    .flatMap((topic) => getTopicQuestions(topic.id))
    .filter((question) => question.figure?.spot && question.type === 'choice');
  const pictures = subjects.flatMap((item) => allPastQuestions(pastCourseForSubject(item))).filter((question) => Boolean(question.image));
  const seen = new Set<string>();
  return [...diagrams, ...pictures].filter((question) => (seen.has(question.id) ? false : (seen.add(question.id), true)));
}

/** "Your weakest 20": the most-missed questions the app can still show. */
export const weakestPool = (memory: MemoryModel): string[] => weakestQuestionIds(memory.questions.values(), (id) => Boolean(getQuestion(id)));

/** How many questions today's weakest 20 will have (past questions counted before their papers load). */
export const weakestCount = (memory: MemoryModel): number =>
  weakestQuestionIds(memory.questions.values(), (id) => Boolean(getQuestion(id)) || pastCourseOf(id) !== null).length;

/** Loads the past papers (so missed past questions can be asked), then picks the weakest 20. */
export async function prepareWeakest(memory: MemoryModel): Promise<string[]> {
  await Promise.allSettled(EXAM_BANKS.map(loadPastQuestions));
  return weakestPool(memory);
}

// ── "Your weakest 20" done today (this device) ──────────────────────

const WEAKEST_DAY_KEY = 'grateapex_weakest_day';
let weakestDay: string | null = null;
const listeners = new Set<() => void>();

export async function markWeakestDone() {
  weakestDay = localDay();
  listeners.forEach((listener) => listener());
  await AsyncStorage.setItem(WEAKEST_DAY_KEY, weakestDay).catch(() => undefined);
}

/** True once today's weakest 20 has been finished on this device. */
export function useWeakestDoneToday(): boolean {
  const [day, setDay] = useState(weakestDay);
  useEffect(() => {
    let live = true;
    const update = () => live && setDay(weakestDay);
    listeners.add(update);
    if (weakestDay === null)
      void AsyncStorage.getItem(WEAKEST_DAY_KEY)
        .then((value) => {
          if (value && weakestDay === null) weakestDay = value;
          update();
        })
        .catch(() => undefined);
    return () => {
      live = false;
      listeners.delete(update);
    };
  }, []);
  return day === localDay();
}
