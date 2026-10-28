// Anatomy drills (data/anatomy-drills/). Run with: npm test
// - every gross anatomy topic has layers, cases and why cards
// - every item belongs to a real lesson of its topic and is written from that
//   lesson's text (its key words appear there), so nothing is invented
// - layers have distinct items; cases have three distinct wrong answers
// - every drill question is tied to a concept of its lesson
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

const { allDrills, drillQuestions, ensureDrillQuestions } = await import('@/data/anatomy-drills');
const { builtTopics } = await import('@/data/topics');
const { getQuestion, getConceptEntry, conceptKey } = await import('@/data/curriculum');
const { lessonToText } = await import('@/data/ai-study');
const { examQuery, parseExam } = await import('@/data/exam-practice-rules');

const STOP = new Set(
  'that this with from into than then them they their there where which while what when your have been were will would could should only also each both most more less very much many some such other about over under after before between because through along does done make made makes kind part parts side sides from first second third lies lying runs running called just like'.split(' ')
);
const norm = (text) =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, ' ');
const stem = (word) => (word.length > 4 && word.endsWith('s') && !word.endsWith('ss') ? word.slice(0, -1) : word);
const keyWords = (text) => norm(text).split(' ').filter((word) => word.length >= 4 && !STOP.has(word)).map(stem);

const problems = [];
function grounded(text, lessonText, share, label) {
  const words = keyWords(text);
  if (words.length === 0) return;
  const haystack = new Set(norm(lessonText).split(' ').map(stem));
  const found = words.filter((word) => haystack.has(word));
  if (found.length / words.length < share) problems.push(`${label}: not in its lesson: ${words.filter((word) => !haystack.has(word)).join(', ')}`);
}

const anatomyTopics = builtTopics.map(({ topic }) => topic).filter((topic) => topic.subject === 'anatomy' && topic.section === 'Gross Anatomy');

describe('anatomy drills', () => {
  it('cover every gross anatomy topic', () => {
    for (const topic of anatomyTopics) {
      const drills = allDrills.find((item) => item.topicId === topic.id);
      assert.ok(drills, `${topic.id}: no drills`);
      assert.ok(drills.layers.length >= 5, `${topic.id}: too few layer drills`);
      assert.ok(drills.cases.length >= 5, `${topic.id}: too few cases`);
      assert.ok(drills.why.length >= 5, `${topic.id}: too few why cards`);
    }
  });

  it('are written from their own lesson', () => {
    for (const drills of allDrills) {
      const topic = anatomyTopics.find((item) => item.id === drills.topicId);
      assert.ok(topic, `${drills.topicId}: not a gross anatomy topic`);
      const text = new Map(topic.lessons.map((lesson) => [lesson.id, lessonToText(lesson)]));
      const ids = new Set();
      for (const [kind, list] of [['layers', drills.layers], ['cases', drills.cases], ['why', drills.why]]) {
        for (const item of list) {
          const label = `${drills.topicId} ${kind} ${item.id}`;
          assert.ok(!ids.has(`${kind}:${item.id}`), `${label}: repeated id`);
          ids.add(`${kind}:${item.id}`);
          const lesson = text.get(item.lessonId);
          assert.ok(lesson, `${label}: lesson ${item.lessonId} is not in this topic`);
          if (kind === 'layers') {
            assert.ok(item.items.length >= 3, `${label}: needs at least 3 items`);
            assert.equal(new Set(item.items).size, item.items.length, `${label}: repeated item`);
            for (const entry of item.items) grounded(entry.replace(/\(.*?\)/g, ''), lesson, 0.5, `${label} "${entry}"`);
            grounded(item.explanation, lesson, 0.75, `${label} explanation`);
          } else if (kind === 'cases') {
            assert.equal(new Set([item.answer, ...item.wrong]).size, 4, `${label}: options must differ`);
            grounded(item.answer.replace(/\(.*?\)/g, ''), lesson, 0.5, `${label} answer`);
            grounded(item.explanation, lesson, 0.75, `${label} explanation`);
          } else {
            grounded(item.answer, lesson, 0.7, `${label} answer`);
          }
        }
      }
    }
    assert.deepEqual(problems, []);
  });

  it('become quiz questions tied to a concept of their lesson', () => {
    ensureDrillQuestions();
    for (const drills of allDrills) {
      for (const kind of ['layers', 'cases']) {
        const questions = drillQuestions(drills.topicId, kind);
        assert.equal(questions.length, drills[kind].length);
        for (const question of questions) {
          assert.equal(getQuestion(question.id), question, `${question.id}: not registered`);
          const entry = getConceptEntry(conceptKey(drills.topicId, question.conceptId));
          assert.ok(entry && entry.lesson.id === question.lessonId, `${question.id}: no concept in its lesson`);
          assert.equal(entry.concept.name, question.concept);
        }
      }
    }
  });

  it('survive the quiz link', () => {
    const exam = { kind: 'drill', topic: 'upper-limb', drill: 'cases' };
    assert.deepEqual(parseExam((name) => examQuery(exam)[name]?.toString()), exam);
    assert.equal(parseExam((name) => ({ exam: 'drill', topic: '../x', drill: 'cases' })[name]), null);
    assert.equal(parseExam((name) => ({ exam: 'drill', topic: 'upper-limb', drill: 'draw' })[name]), null);
  });
});
