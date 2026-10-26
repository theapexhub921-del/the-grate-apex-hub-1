// Builds the question banks that XP battles are played from:
//   public/battle-bank/index.json      every course's topics, with how many questions each has per difficulty
//   public/battle-bank/<course>.json   the questions themselves (multiple choice only)
//
// The battle server (api/battle.mjs) picks a battle's questions from these files and
// keeps the answers to itself while the battle is played, so both players get the
// same questions and nobody can fake a score. The app reads index.json for the
// "On what?" and "Topics" choices, so the picker only offers what the server can serve.
//
// Run it after adding or changing questions (tests/battle-bank.test.mjs fails until you do):
//   node --import ./tests/register.mjs scripts/build-battle-bank.mjs
//
// Sources, per course:
//   HB2 (hb2-anatomy, hb2-physiology, hb2-biochemistry): this app's own topic questions
//     (src/data/topics, every published topic of the subject: e.g. Fatty Acid
//     Biosynthesis) plus the HB2 past questions (public/curriculum/hb2-*.json, by `tp`).
//   HB1 (the original app's courses): public/curriculum/<course>.json, by topic tag.
// Questions with a picture or a diagram are left out (a race should not wait for a
// picture to load), and so is any question that is not single-answer multiple choice.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { getSubjectTopics, getTopicQuestions } from '@/data/curriculum';
import { HB2_COURSES } from '@/data/hb2-study';
import { plainText } from '@/data/legacy-questions';
import { OTHER_PAST_TOPIC, PAST_TOPICS } from '@/data/past-question-topics';

const ROOT = new URL('../', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const OUT = join(ROOT, 'public/battle-bank');

// The original app's courses (the same list as LEGACY_COURSES in src/data/legacy-study.ts).
const HB1 = ['biolchem', 'medgen', 'cellstruct', 'bmc', 'algebra', 'stats', 'commskills', 'compapp', 'biochemistry', 'physiology', 'anatomy', 'behavioural', 'entomology'];

const LEVEL = { introductory: 'easy', intermediate: 'medium', advanced: 'hard' };
const ORDER_WORDS = /\b(all|none|both|neither) of the (above|following)|\b(a|b|c|d) (and|&) (b|c|d|e)\b|^all the above|^none of the above/i;
const clean = (text) => String(text ?? '').replace(/\s+/g, ' ').trim();
const promptKey = (text) => clean(text).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

function bank(course) {
  return JSON.parse(readFileSync(join(ROOT, 'public/curriculum', `${course}.json`), 'utf8'));
}

/** One bank question as a battle question, or null when it can't be raced on. */
function fromBank(q, topic, set) {
  if (q.img || q.kind === 'input' || !Array.isArray(q.o) || q.o.length < 2 || !(q.a >= 0 && q.a < q.o.length)) return null;
  const options = q.o.map((option) => clean(plainText(option)));
  if (options.some((option) => !option) || new Set(options).size !== options.length) return null;
  const trueFalse = options.length === 2 && /^true$/i.test(options[0]) && /^false$/i.test(options[1]);
  const letters = options.every((option) => /^[A-E]$/.test(option));
  return {
    id: `p:${set}:${q.id}`,
    topic,
    level: null,
    prompt: clean(plainText(q.q)),
    options,
    answer: q.a,
    fixed: trueFalse || letters || options.some((option) => ORDER_WORDS.test(option)) || undefined,
  };
}

/** One of this app's questions as a battle question, or null. */
function fromApp(question, topic) {
  if (question.type !== 'choice' || question.figure || question.image) return null;
  const options = question.options.map(clean);
  if (options.length < 2 || options.some((option) => !option) || new Set(options).size !== options.length) return null;
  if (!(question.answer >= 0 && question.answer < options.length)) return null;
  return {
    id: `a:${topic}:${question.id}`,
    topic,
    level: LEVEL[question.difficulty ?? 'introductory'] ?? 'easy',
    prompt: clean(question.prompt),
    options,
    answer: question.answer,
    fixed: question.fixedOrder || undefined,
  };
}

/** Drops questions that ask the same thing twice (same prompt and options), keeping the first. */
function unique(questions) {
  const seen = new Set();
  return questions.filter((question) => {
    const key = `${promptKey(question.prompt)}|${question.options.map(promptKey).sort().join('|')}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function summary(course, name, questions, titles) {
  const topics = new Map();
  for (const question of questions) {
    const entry = topics.get(question.topic) ?? { id: question.topic, title: titles.get(question.topic) ?? question.topic, easy: 0, medium: 0, hard: 0, unrated: 0 };
    entry[question.level ?? 'unrated'] += 1;
    topics.set(question.topic, entry);
  }
  // Topics in course order where there is one (titles is in that order), then the rest by name.
  const order = [...titles.keys()];
  const list = [...topics.values()].sort((a, b) => {
    const ia = order.indexOf(a.id);
    const ib = order.indexOf(b.id);
    if (ia !== -1 || ib !== -1) return (ia === -1 ? 1e9 : ia) - (ib === -1 ? 1e9 : ib);
    return a.title.localeCompare(b.title);
  });
  return { id: course, name, total: questions.length, topics: list };
}

/** Every course's battle questions and the index; pure apart from reading the banks. */
export function buildBattleBanks() {
  const courses = [];
  const files = {};

  for (const course of HB2_COURSES) {
    const titles = new Map();
    const questions = [];
    for (const topic of getSubjectTopics(course.subject)) {
      titles.set(topic.id, topic.title);
      for (const question of getTopicQuestions(topic.id)) {
        const item = fromApp(question, topic.id);
        if (item) questions.push(item);
      }
    }
    for (const topic of PAST_TOPICS[course.id] ?? []) {
      if (!titles.has(topic.id)) titles.set(topic.id, topic.id === OTHER_PAST_TOPIC ? 'Other topics' : topic.title);
    }
    for (const set of bank(course.id).sets) {
      for (const q of set.questions) {
        const topic = q.tp?.trim() || OTHER_PAST_TOPIC;
        const item = fromBank(q, topic, set.id);
        if (item) questions.push(item);
      }
    }
    const all = unique(questions);
    files[course.id] = { id: course.id, name: course.name, questions: all };
    courses.push(summary(course.id, course.name, all, titles));
  }

  for (const id of HB1) {
    const source = bank(id);
    const titles = new Map();
    const questions = [];
    for (const set of source.sets) {
      for (const q of set.questions) {
        const tag = q.tp?.trim() || q.t?.trim() || 'general';
        if (!titles.has(tag)) titles.set(tag, tag === 'general' ? 'Other / general' : tag);
        const item = fromBank(q, tag, set.id);
        if (item) questions.push(item);
      }
    }
    // Topics by name for the original courses (their tags are not in course order).
    const sorted = new Map([...titles].sort((a, b) => (a[0] === 'general') - (b[0] === 'general') || a[1].localeCompare(b[1])));
    const all = unique(questions);
    files[id] = { id, name: source.name, questions: all };
    courses.push(summary(id, source.name, all, sorted));
  }

  return { index: { version: 1, courses }, files };
}

/** The files as they are written: one line per question keeps diffs readable. */
export function serialise(value) {
  if (Array.isArray(value?.questions)) {
    const { questions, ...rest } = value;
    const head = JSON.stringify(rest).slice(0, -1);
    return `${head},"questions":[\n${questions.map((question) => JSON.stringify(question)).join(',\n')}\n]}\n`;
  }
  return `${JSON.stringify(value, null, 1)}\n`;
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('build-battle-bank.mjs')) {
  const { index, files } = buildBattleBanks();
  mkdirSync(OUT, { recursive: true });
  writeFileSync(join(OUT, 'index.json'), serialise(index));
  for (const [id, file] of Object.entries(files)) writeFileSync(join(OUT, `${id}.json`), serialise(file));
  for (const course of index.courses) console.log(`${course.id.padEnd(18)} ${String(course.total).padStart(5)} questions · ${course.topics.length} topics`);
}
