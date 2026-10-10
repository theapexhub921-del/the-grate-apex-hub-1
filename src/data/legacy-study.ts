// The original app's courses (HB1 Semester 1 and Semester 2), studied inside
// this app. Courses are kept exactly as the original app had them: a subject
// that appears in two classes (e.g. Biochemistry in HB1 S2 and HB2 S1) is two
// different courses with different content — never merged.
//
//   Lessons    read from the shared database, as the original app does:
//              lessons (titles, sections), lessonContent (the body — only for
//              the student's own class, by the deployed rules), lessonImages.
//   Questions  the original question banks, exported to public/curriculum/
//              (scripts/legacy-curriculum/export-banks.mjs), loaded on demand.
//   Progress   the original app's section counts (progress/{uid}.lessons) are
//              read, never rewritten; sections read here are kept on the device
//              and a finished lesson is recorded as a completion.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { Platform } from 'react-native';

import type { ClassSelection } from '@/data/class-curriculum';
import type { Question } from '@/data/questions';
import { auth, db } from '@/lib/firebase';

export type LegacyCourse = { id: string; name: string; icon: string; desc: string; classId: 'HB1'; semester: 1 | 2; gradient: readonly [string, string] };

// From old-reference/src/data/catalog.ts and access.json (and the course colours of the original Study screen).
export const LEGACY_COURSES: readonly LegacyCourse[] = [
  { id: 'biolchem', name: 'Biological Chemistry', icon: '⚗️', desc: 'Elements, bonds, carbohydrates, nucleic acids, proteins, enzymes, metabolism and lipids.', classId: 'HB1', semester: 1, gradient: ['#14b8a6', '#0f766e'] },
  { id: 'medgen', name: 'Basic Medical Genetics', icon: '🧬', desc: 'Cells, chromosomes, inheritance, molecular genetics and gene regulation.', classId: 'HB1', semester: 1, gradient: ['#ec4899', '#be185d'] },
  { id: 'cellstruct', name: 'Cell Structure', icon: '🔬', desc: 'Microscopy, prokaryotes vs eukaryotes, organelles and the plasma membrane.', classId: 'HB1', semester: 1, gradient: ['#06b6d4', '#0e7490'] },
  { id: 'bmc', name: 'Basic Medical Chemistry', icon: '🧫', desc: 'Organic chemistry for medicine: amines, alcohols, acids, aromatics, alkenes.', classId: 'HB1', semester: 1, gradient: ['#84cc16', '#4d7c0f'] },
  { id: 'algebra', name: 'Algebra', icon: '➗', desc: 'Sets, equations, logs, sequences, trigonometry, matrices, calculus.', classId: 'HB1', semester: 1, gradient: ['#6366f1', '#4338ca'] },
  { id: 'stats', name: 'Statistical Methods', icon: '📊', desc: 'Descriptive statistics, probability and distributions.', classId: 'HB1', semester: 1, gradient: ['#8b5cf6', '#6d28d9'] },
  { id: 'commskills', name: 'Communication Skills', icon: '🗣️', desc: 'Grammar, punctuation, concord, sentences and clear communication.', classId: 'HB1', semester: 1, gradient: ['#f97316', '#c2410c'] },
  { id: 'compapp', name: 'Computer Appreciation', icon: '💻', desc: 'Excel and PowerPoint skills for coursework and presentations.', classId: 'HB1', semester: 1, gradient: ['#0ea5e9', '#0369a1'] },
  { id: 'biochemistry', name: 'Biochemistry', icon: '🧪', desc: 'Metabolism, enzymes, and the pathways that keep cells running.', classId: 'HB1', semester: 2, gradient: ['#10b981', '#047857'] },
  { id: 'physiology', name: 'Physiology', icon: '🫀', desc: 'How the body’s systems work, from single cells to whole organs.', classId: 'HB1', semester: 2, gradient: ['#f43f5e', '#b91c3c'] },
  { id: 'anatomy', name: 'Anatomy', icon: '🩻', desc: 'Structures, regions, and how the body is put together.', classId: 'HB1', semester: 2, gradient: ['#3b82f6', '#1d4ed8'] },
  { id: 'behavioural', name: 'Behavioural Science', icon: '🧠', desc: 'Psychology, behaviour, and the mind behind medicine.', classId: 'HB1', semester: 2, gradient: ['#a855f7', '#7c3aed'] },
  { id: 'entomology', name: 'Entomology', icon: '🦟', desc: 'Insects, vectors, and the essentials of medical entomology.', classId: 'HB1', semester: 2, gradient: ['#f59e0b', '#d97706'] },
];

export const legacyCourse = (id: string | undefined) => LEGACY_COURSES.find((course) => course.id === id) ?? null;

/** The original courses of a class (HB1 only: the original app taught HB1). */
export function legacyCoursesForClass(selection: ClassSelection | null | undefined): LegacyCourse[] {
  if (!selection || selection.classId !== 'HB1') return [];
  return LEGACY_COURSES.filter((course) => course.semester === selection.semester);
}

// ── Lessons ─────────────────────────────────────────────────────────

export type LegacyLessonMeta = {
  id: string; course: string; order: number; title: string; sub?: string; icon: string; summary: string; minutes: number;
  sections: { id: string; title: string }[]; qids?: string[]; qcount?: number; extras?: string[]; v?: string;
};
export type Rich = string;
export type Block =
  | { k: 'p'; x: Rich; lede?: 1 }
  | { k: 'h'; x: Rich; l: 3 | 4 }
  | { k: 'ul'; items: Rich[]; ol?: 1 }
  | { k: 'table'; head: Rich[]; rows: { c: Rich[] }[] }
  | { k: 'term'; name: Rich; def: Rich }
  | { k: 'box'; title: Rich; tone?: string; blocks: Block[] }
  | { k: 'step'; n: string; title: Rich; tone?: string; tags?: string[]; blocks?: Block[] }
  | { k: 'cards'; items: { title: Rich; blocks: Block[] }[] }
  | { k: 'video'; url: string; title: Rich; desc: Rich; tag?: string }
  | { k: 'fig'; svg?: string; img?: string; w?: number; h?: number; cap?: Rich; alt?: string };
export type LegacySection = { id: string; title: Rich; kicker?: string; blocks: Block[] };
export type LegacyExtras = { mnemonics?: { h: Rich; lines: Rich[] }[]; facts?: { h: Rich; lines: Rich[] }[]; steps?: { title: string; items: { t: Rich; d: Rich }[] } };
export type LegacyLessonBody = { sections: LegacySection[]; extras?: LegacyExtras };

let lessonList: Promise<LegacyLessonMeta[]> | null = null;

/** Every original lesson's title and sections (the list is open to any signed-in student). */
export function loadLegacyLessonList(): Promise<LegacyLessonMeta[]> {
  if (!lessonList) {
    lessonList = getDocs(collection(db, 'lessons'))
      .then((snap) => snap.docs.map((item) => ({ ...(item.data() as Omit<LegacyLessonMeta, 'id'>), id: item.id, course: item.id.split('-')[0] })).sort((a, b) => a.order - b.order))
      .catch((error) => {
        lessonList = null;
        throw error;
      });
  }
  return lessonList;
}

export async function loadLegacyLessons(courseId: string) {
  return (await loadLegacyLessonList()).filter((lesson) => lesson.course === courseId);
}

const bodyCache = new Map<string, LegacyLessonBody>();

/** A lesson's body. Only the student's own class can read it (deployed rules); a copy is kept for offline reading. */
export async function loadLegacyLessonBody(id: string): Promise<LegacyLessonBody> {
  const hit = bodyCache.get(id);
  if (hit) return hit;
  const key = `grateapex_legacy_lesson_${id}`;
  try {
    const snap = await getDoc(doc(db, 'lessonContent', id));
    if (!snap.exists()) throw new Error('This lesson has not been published yet.');
    const data = snap.data() as LegacyLessonBody;
    const body = { sections: data.sections ?? [], extras: data.extras };
    bodyCache.set(id, body);
    AsyncStorage.setItem(key, JSON.stringify(body)).catch(() => {});
    return body;
  } catch (error) {
    const saved = await AsyncStorage.getItem(key).catch(() => null);
    if (saved) {
      const body = JSON.parse(saved) as LegacyLessonBody;
      bodyCache.set(id, body);
      return body;
    }
    if ((error as { code?: string })?.code === 'permission-denied') throw new Error('This lesson belongs to another class. Choose that class to study it.');
    throw error;
  }
}

const images = new Map<string, Promise<string | null>>();

/** A lesson picture (stored in the shared database as base64), as a data address. */
export function loadLegacyImage(name: string): Promise<string | null> {
  const hit = images.get(name);
  if (hit) return hit;
  const promise = getDoc(doc(db, 'lessonImages', name.replace(/\.[a-z]+$/i, '')))
    .then((snap) => {
      const rec = snap.data() as { mime?: string; data?: string } | undefined;
      return rec?.mime && rec.data ? `data:${rec.mime};base64,${rec.data}` : null;
    })
    .catch(() => null);
  images.set(name, promise);
  return promise;
}

// ── Rich text (the original mini-markup: <b> <i> <sub> <sup> <term d="…">) ──

export type Run = { t: string; b?: boolean; i?: boolean; sub?: boolean; sup?: boolean; term?: string };
const unescape = (s: string) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
export const plainText = (s: string) => unescape(s.replace(/<[^>]+>/g, ''));

export function parseRich(src: string): Run[] {
  const runs: Run[] = [];
  const state = { b: 0, i: 0, sub: 0, sup: 0 };
  let term: string | undefined;
  const re = /<(\/?)(b|i|sub|sup|term)((?:\s+d="[^"]*")?)>|([^<]+)|(<)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    const text = m[4] ?? m[5];
    if (text !== undefined) {
      const run: Run = { t: unescape(text) };
      if (state.b) run.b = true;
      if (state.i) run.i = true;
      if (state.sub) run.sub = true;
      if (state.sup) run.sup = true;
      if (term) run.term = term;
      runs.push(run);
    } else {
      const close = m[1] === '/';
      const tag = m[2] as 'b' | 'i' | 'sub' | 'sup' | 'term';
      if (tag === 'term') {
        if (close) term = undefined;
        else {
          const d = /d="([^"]*)"/.exec(m[3] || '');
          term = d ? unescape(d[1]) : undefined;
        }
      } else state[tag] += close ? -1 : 1;
    }
  }
  return runs;
}

// ── Question banks ──────────────────────────────────────────────────

export type BankQuestion = { id: string; q: string; o: string[]; a: number; e: string; t: string; p?: string[]; kind?: 'input'; ans?: string };
export type LegacyBank = { id: string; name: string; sets: { id: string; name: string; questions: BankQuestion[] }[] };

const banks = new Map<string, Promise<LegacyBank>>();
const BASE = Platform.OS === 'web' ? '' : 'https://grateapex.vercel.app';

export function loadLegacyBank(courseId: string): Promise<LegacyBank> {
  const hit = banks.get(courseId);
  if (hit) return hit;
  const promise = fetch(`${BASE}/curriculum/${courseId}.json`)
    .then((response) => {
      if (!response.ok) throw new Error('The question bank could not be loaded.');
      return response.json() as Promise<LegacyBank>;
    })
    .catch((error) => {
      banks.delete(courseId);
      throw error;
    });
  banks.set(courseId, promise);
  return promise;
}

export const bankQuestions = (bank: LegacyBank) => bank.sets.flatMap((set) => set.questions.map((q) => ({ ...q, set: set.id, setName: set.name })));

// ── Original questions as this app's question types ────────────────

const ORDER_WORDS = /\b(all|none|both|neither) of the (above|following)|\b(a|b|c|d) (and|&) (b|c|d|e)\b|^all the above|^none of the above/i;

function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

type Base = { course: string; lessonId?: string; concept: string };

/** The original question, unchanged in meaning: multiple choice, or type-the-answer. */
export function toQuestion(q: BankQuestion, base: Base): Question {
  const common = { id: `legacy:${base.course}:${q.id}`, prompt: plainText(q.q), concept: base.concept || q.t || 'General', explanation: q.e ? plainText(q.e) : undefined, topicId: base.course, lessonId: base.lessonId, usage: 'quiz' as const, reviewEligible: false };
  if (q.kind === 'input' || !q.o?.length || q.a < 0) return { ...common, type: 'type', accept: [String(q.ans ?? '')] };
  const options = q.o.map(plainText);
  const trueFalse = options.length === 2 && /^true$/i.test(options[0]) && /^false$/i.test(options[1]);
  return { ...common, type: 'choice', options, answer: q.a, fixedOrder: trueFalse || options.some((option) => ORDER_WORDS.test(option)) };
}

const short = (text: string) => text.length <= 28 && text.split(/\s+/).length <= 4 && !ORDER_WORDS.test(text) && !/^(true|false|yes|no)$/i.test(text);

/**
 * A practice set from original questions, mixing this app's question types the
 * way the original material allows: multiple choice as written, true/false and
 * type-the-answer versions of some questions, and matching rounds built from
 * short answers. Deterministic for a seed.
 */
export function buildPractice(source: readonly (BankQuestion & { setName?: string })[], base: Omit<Base, 'concept'>, count: number, seed: string): Question[] {
  const random = seeded(seed);
  const pool = [...source].sort(() => random() - 0.5).slice(0, count);
  const out: Question[] = [];
  const matchable: (BankQuestion & { setName?: string })[] = [];
  for (const q of pool) {
    const concept = q.t || q.setName || 'General';
    const original = toQuestion(q, { ...base, concept });
    const roll = random();
    if (original.type === 'choice' && q.o.length >= 3 && !/\bexcept\b|\bnot\b/i.test(q.q)) {
      const answer = plainText(q.o[q.a]);
      if (roll < 0.15 && short(answer) && !/which of the following/i.test(q.q)) {
        out.push({ ...original, id: `${original.id}:type`, type: 'type', accept: [answer], label: 'Type the answer' } as Question);
        continue;
      }
      if (roll < 0.3) {
        const showCorrect = random() < 0.5;
        const wrong = q.o.map(plainText).filter((_, index) => index !== q.a);
        const shown = showCorrect ? answer : wrong[Math.floor(random() * wrong.length)];
        out.push({ ...original, id: `${original.id}:tf`, type: 'choice', prompt: `True or false? For “${plainText(q.q)}”, the answer is “${shown}”.`, options: ['True', 'False'], answer: showCorrect ? 0 : 1, fixedOrder: true, label: 'True or false' } as Question);
        continue;
      }
      if (roll < 0.42 && short(answer) && plainText(q.q).length <= 140) {
        matchable.push(q);
        continue;
      }
    }
    out.push(original);
  }
  // Matching rounds of four short-answer questions (distinct answers); leftovers stay as asked.
  while (matchable.length >= 4) {
    const group: typeof matchable = [];
    while (group.length < 4 && matchable.length) {
      const next = matchable.shift()!;
      if (!group.some((item) => plainText(item.o[item.a]) === plainText(next.o[next.a]))) group.push(next);
      else out.push(toQuestion(next, { ...base, concept: next.t || 'General' }));
    }
    if (group.length < 4) {
      group.forEach((item) => out.push(toQuestion(item, { ...base, concept: item.t || 'General' })));
      break;
    }
    out.push({
      id: `legacy:${base.course}:match:${group.map((item) => item.id).join('-')}`,
      type: 'match',
      prompt: 'Match each question to its answer.',
      pairs: group.map((item) => ({ left: plainText(item.q), right: plainText(item.o[item.a]) })),
      concept: group[0].t || 'General',
      topicId: base.course,
      lessonId: base.lessonId,
      usage: 'quiz',
      reviewEligible: false,
      label: 'Matching',
    });
  }
  matchable.forEach((item) => out.push(toQuestion(item, { ...base, concept: item.t || 'General' })));
  return out.sort(() => random() - 0.5);
}

// ── Progress ────────────────────────────────────────────────────────

const SECTIONS_KEY = 'grateapex_legacy_sections';

/** Sections read per original lesson: the original app's own counts (read-only) and this device's, whichever is higher. */
export async function loadLegacySectionProgress(): Promise<Record<string, number>> {
  const local = JSON.parse((await AsyncStorage.getItem(SECTIONS_KEY).catch(() => null)) ?? '{}') as Record<string, number>;
  const uid = auth.currentUser?.uid;
  if (!uid) return local;
  try {
    const snap = await getDoc(doc(db, 'progress', uid));
    const lessons = (snap.data()?.lessons ?? {}) as Record<string, unknown>;
    const merged = { ...local };
    for (const [id, value] of Object.entries(lessons)) if (typeof value === 'number' && Number.isFinite(value) && value < 1000) merged[id] = Math.max(merged[id] ?? 0, value);
    return merged;
  } catch {
    return local;
  }
}

/** Remembers how many sections of an original lesson this learner has read (this device). */
export async function saveLegacySectionProgress(lessonId: string, sectionsRead: number) {
  const current = JSON.parse((await AsyncStorage.getItem(SECTIONS_KEY).catch(() => null)) ?? '{}') as Record<string, number>;
  if ((current[lessonId] ?? 0) >= sectionsRead) return;
  current[lessonId] = sectionsRead;
  await AsyncStorage.setItem(SECTIONS_KEY, JSON.stringify(current)).catch(() => {});
}
