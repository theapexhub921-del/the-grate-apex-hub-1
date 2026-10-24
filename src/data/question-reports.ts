import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, doc, getDoc, getDocs, limit, query, runTransaction, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { questionKey, questionUnderReview, type QuestionFlag, type ReportReason } from '@/data/question-report-rules';
import { auth, db } from '@/lib/firebase';
import { API_BASE } from '@/lib/live-site';

// "Report this question" (owner's request, 2026-10-20). A learner reports a
// problem with a question once; the report is private (the learner and the
// admins read it). Alongside it, a public counter per question
// (questionFlags/{key}) counts the reports, so a question that several
// learners say has a wrong answer shows "being checked" to everyone.
// The database rules only let a learner add to the counter together with
// their own new report (firestore.rules → questionReports, questionFlags).
//
// Reads (free plan): flagged questions are read ONCE per session with one
// query (only questions with 2+ "wrong answer" reports, a short list);
// reporting reads two documents. Nothing polls.

export { REPORT_REASONS, type ReportReason } from '@/data/question-report-rules';

const REPORTED_KEY = 'grateapex_reported_questions';

export class AlreadyReported extends Error {}

export type QuestionReport = {
  id: string;
  qid: string;
  qkey: string;
  uid: string;
  reason: ReportReason;
  note: string;
  text: string;
  where: string;
  status: 'open' | 'fixed' | 'dismissed';
  createdAt: number;
};

async function reportedHere(): Promise<Set<string>> {
  try {
    return new Set(JSON.parse((await AsyncStorage.getItem(REPORTED_KEY)) ?? '[]') as string[]);
  } catch {
    return new Set();
  }
}

/** Whether this learner already reported the question on this device. */
export async function hasReported(questionId: string): Promise<boolean> {
  return (await reportedHere()).has(questionId);
}

/** Sends a report: the private report and the public count, in one transaction. */
export async function reportQuestion(question: { id: string; prompt: string }, reason: ReportReason, note: string, place: string): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Sign in to report a question.');
  const qkey = questionKey(question.id);
  const reportRef = doc(db, 'questionReports', `${qkey}_${uid}`);
  const flagRef = doc(db, 'questionFlags', qkey);
  const wrong = reason === 'wrong-answer' ? 1 : 0;
  try {
    await runTransaction(db, async (tx) => {
      const [mine, flag] = await Promise.all([tx.get(reportRef), tx.get(flagRef)]);
      if (mine.exists()) throw new AlreadyReported('You have already reported this question. Thank you.');
      tx.set(reportRef, {
        qid: question.id.slice(0, 300),
        qkey,
        uid,
        reason,
        note: note.trim().slice(0, 500),
        text: question.prompt.slice(0, 600),
        where: place.slice(0, 120),
        status: 'open',
        createdAt: serverTimestamp(),
      });
      if (flag.exists()) {
        const data = flag.data() as { count?: number; wrong?: number };
        tx.update(flagRef, { count: (data.count ?? 0) + 1, wrong: (data.wrong ?? 0) + wrong, updatedAt: serverTimestamp() });
      } else {
        tx.set(flagRef, { qid: question.id.slice(0, 300), count: 1, wrong, cleared: 0, updatedAt: serverTimestamp() });
      }
    });
  } catch (error) {
    if (error instanceof AlreadyReported) {
      await remember(question.id);
      throw error;
    }
    const code = (error as { code?: string })?.code;
    if (code === 'permission-denied') throw new Error('Reports are not switched on yet. Please try again later.');
    throw new Error('The report could not be sent. Check your connection and try again.');
  }
  await remember(question.id);
  // The team is emailed through the server (api/question-report.mjs: Resend, then
  // Formspree), so no mail credentials ship in the app. The report is already saved and
  // admins see it in Settings → Help → Reported questions, so a failed email never shows
  // the learner an error (they could not send the report again anyway).
  const currentUser = auth.currentUser;
  if (!currentUser) return;
  const token = await currentUser.getIdToken().catch(() => null);
  if (!token) return;
  const mailResponse = await fetch(`${API_BASE}/api/question-report`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify({ questionId: question.id, prompt: question.prompt, reason, note: note.trim(), place }),
  }).catch(() => null);
  if (!mailResponse?.ok) {
    const message = await mailResponse?.json().then((body) => body?.error).catch(() => null);
    console.warn('The question report was saved, but its email was not sent:', message ?? mailResponse?.status ?? 'no connection');
  }
}

async function remember(questionId: string) {
  const set = await reportedHere();
  set.add(questionId);
  await AsyncStorage.setItem(REPORTED_KEY, JSON.stringify([...set].slice(-2000))).catch(() => {});
}

// ── Questions under review (read once per session) ──────────────────

let flagged: Promise<Map<string, QuestionFlag>> | null = null;
const listeners = new Set<() => void>();

function loadFlagged(): Promise<Map<string, QuestionFlag>> {
  if (flagged) return flagged;
  const loading: Promise<Map<string, QuestionFlag>> = getDocs(query(collection(db, 'questionFlags'), where('wrong', '>=', 2), limit(500)))
    .then((snap) => {
      const map = new Map<string, QuestionFlag>();
      snap.forEach((item) => {
        const data = item.data() as Partial<QuestionFlag>;
        if (typeof data.qid === 'string') map.set(data.qid, { qid: data.qid, count: data.count ?? 0, wrong: data.wrong ?? 0, cleared: data.cleared ?? 0 });
      });
      return map;
    })
    .catch(() => new Map<string, QuestionFlag>());
  flagged = loading;
  void loading.then(() => listeners.forEach((listener) => listener()));
  return loading;
}

/** True when several learners have said the question's marked answer is wrong (and no admin has checked it since). */
export function useQuestionUnderReview(questionId: string, enabled = true): boolean {
  const [map, setMap] = useState<Map<string, QuestionFlag> | null>(null);
  useEffect(() => {
    if (!enabled || !auth.currentUser) return;
    let live = true;
    void loadFlagged().then((value) => { if (live) setMap(value); });
    return () => { live = false; };
  }, [enabled]);
  const flag = map?.get(questionId);
  return Boolean(flag && questionUnderReview(flag));
}

// ── Admin review ────────────────────────────────────────────────────

/** Open reports, newest first (admins only; the rules refuse anyone else). */
export async function listOpenReports(): Promise<QuestionReport[]> {
  const snap = await getDocs(query(collection(db, 'questionReports'), where('status', '==', 'open'), limit(300)));
  const list: QuestionReport[] = [];
  snap.forEach((item) => {
    const data = item.data() as Omit<QuestionReport, 'id' | 'createdAt'> & { createdAt?: { toMillis?: () => number } };
    list.push({ ...data, id: item.id, createdAt: data.createdAt?.toMillis?.() ?? 0 });
  });
  return list.sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Closes a report. "Fixed" or "Not an error" both mean an admin has checked the
 * question, so its "being checked" note is cleared until new reports arrive.
 */
export async function closeReport(report: QuestionReport, status: 'fixed' | 'dismissed'): Promise<void> {
  await updateDoc(doc(db, 'questionReports', report.id), { status });
  const flagRef = doc(db, 'questionFlags', report.qkey);
  const flag = await getDoc(flagRef);
  const wrong = (flag.data()?.wrong as number | undefined) ?? 0;
  if (flag.exists()) await updateDoc(flagRef, { cleared: wrong });
  flagged = null;
}

