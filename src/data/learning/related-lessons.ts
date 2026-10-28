// Links across courses (2026-10-28): lessons in OTHER subjects that share key
// words with this one (e.g. the heart in Gross Anatomy and in Cardiovascular
// Physiology, haemoglobin in Biochemistry and in Respiratory Physiology).
// Seeing the same idea from another course is one of the best memory hooks.
// Pure: checked by tests/learning-boosts.test.mjs.

export type LessonWords = { id: string; title: string; subject: string; topicId: string; words: readonly string[] };
export type RelatedLesson = { id: string; title: string; subject: string; topicId: string; shared: string[]; score: number };

/** A key word in one form: lower case, no brackets or abbreviations after it, simple plural removed. */
export function normWord(word: string): string {
  let text = word.toLowerCase().replace(/\(.*?\)/g, ' ').replace(/[“”"'’.,:;]/g, '').replace(/\s+/g, ' ').trim();
  if (text.length > 4 && text.endsWith('ies')) text = `${text.slice(0, -3)}y`;
  else if (text.length > 4 && text.endsWith('s') && !text.endsWith('ss') && !text.endsWith('us') && !text.endsWith('is')) text = text.slice(0, -1);
  return text;
}

/** Words in too many lessons (more than this share) are not useful links. */
const COMMON_SHARE = 0.05;
const MIN_LENGTH = 3;
const STOP = new Set(
  'primary secondary tertiary plate plates system systems region regions structure structures process processes about above after again against along also among anterior posterior superior inferior medial lateral between both cause caused cells change changes during each effect effects either factor factors final first found function functions general group groups higher important increase increased decrease decreased level levels lower major minor normal other place point produce produced reaction reactions right second several small their there these those three through types under where which while within without'.split(' ')
);

/** The single words of a key word worth linking on (long, not everyday). */
function tokens(word: string): string[] {
  return normWord(word)
    .split(/[^a-z0-9α-ω]+/)
    .map((part) => normWord(part))
    .filter((part) => part.length >= 5 && !STOP.has(part));
}

/**
 * Lessons in other subjects that share key words with this one, best first. A
 * shared whole key word counts most; otherwise at least two shared uncommon
 * words are needed, so one stray word never makes a link.
 */
export function relatedLessons(lessonId: string, lessons: readonly LessonWords[], limit = 4): RelatedLesson[] {
  const normalised = lessons.map((lesson) => ({
    ...lesson,
    set: new Set(lesson.words.map(normWord).filter((word) => word.length >= MIN_LENGTH)),
    parts: new Set([...lesson.words, lesson.title].flatMap(tokens)),
    display: new Map(lesson.words.map((word) => [normWord(word), word.replace(/\s*\(.*?\)\s*/g, ' ').trim()])),
  }));
  const self = normalised.find((lesson) => lesson.id === lessonId);
  if (!self || self.set.size === 0) return [];
  const df = new Map<string, number>();
  const partDf = new Map<string, number>();
  for (const lesson of normalised) {
    for (const word of lesson.set) df.set(word, (df.get(word) ?? 0) + 1);
    for (const part of lesson.parts) partDf.set(part, (partDf.get(part) ?? 0) + 1);
  }
  const cap = Math.max(3, Math.ceil(lessons.length * COMMON_SHARE));
  const out: RelatedLesson[] = [];
  for (const other of normalised) {
    if (other.id === self.id || other.subject === self.subject) continue;
    const shared = [...self.set].filter((word) => other.set.has(word) && (df.get(word) ?? 0) <= cap);
    const sharedParts = [...self.parts].filter((part) => other.parts.has(part) && (partDf.get(part) ?? 0) <= cap);
    if (shared.length === 0 && sharedParts.length < 2) continue;
    const score =
      shared.reduce((sum, word) => sum + 2 / (df.get(word) ?? 1), 0) + sharedParts.reduce((sum, part) => sum + 1 / (partDf.get(part) ?? 1), 0);
    const named = shared.map((word) => self.display.get(word) ?? word);
    const extra = sharedParts.filter((part) => !named.some((word) => normWord(word).includes(part)));
    out.push({ id: other.id, title: other.title, subject: other.subject, topicId: other.topicId, shared: [...named, ...extra].slice(0, 4), score });
  }
  return out.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title)).slice(0, limit);
}
