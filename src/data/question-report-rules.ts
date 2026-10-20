// Pure rules for "Report this question" (src/data/question-reports.ts),
// checked by tests/question-reports.test.mjs.

export const REPORT_REASONS = [
  { id: 'wrong-answer', label: 'The marked answer is wrong', detail: 'The answer key looks incorrect' },
  { id: 'typo', label: 'Typo or spelling mistake', detail: 'In the question or an option' },
  { id: 'unclear', label: 'Unclear or confusing', detail: 'Hard to tell what is being asked' },
  { id: 'options', label: 'Problem with the options', detail: 'Repeated, missing or more than one right' },
  { id: 'other', label: 'Something else', detail: 'Tell us in your own words' },
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number]['id'];

/** The public count of reports for one question (questionFlags/{key}). */
export type QuestionFlag = { qid: string; count: number; wrong: number; cleared: number };

/** How many learners must say "wrong answer" (since an admin last checked) before others see "being checked". */
export const UNDER_REVIEW_AFTER = 2;

/** A question id as a database document key: no slashes, at most 300 characters. */
export function questionKey(questionId: string): string {
  const key = questionId.replace(/\//g, '|').replace(/^\.+$/, '_').slice(0, 300);
  return /^__.*__$/.test(key) ? `q${key}` : key;
}

export function questionUnderReview(flag: Pick<QuestionFlag, 'wrong' | 'cleared'>): boolean {
  return flag.wrong - (flag.cleared ?? 0) >= UNDER_REVIEW_AFTER;
}
