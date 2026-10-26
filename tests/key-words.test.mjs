// "Start simple" shows a lesson's key words (owner, 2026-10-24/25). Lessons whose
// steps and sections name none get them from src/data/key-words/, written from
// the lesson's own text: every such word must appear in that lesson, so nothing
// is invented, and it must have a plain meaning.
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { KEY_WORD_LESSONS, keyWordsFor } from '../src/data/key-words/index.ts';
import { builtTopics } from '../src/data/topics/index.ts';

const lessons = new Map(builtTopics.flatMap(({ topic }) => topic.lessons.map((lesson) => [lesson.id, lesson])));
const ownWords = (lesson) =>
  (lesson.interactive ?? []).filter((step) => step.type === 'learn').reduce((sum, step) => sum + (step.terms?.length ?? 0), 0) +
  lesson.chunks.reduce((sum, chunk) => sum + (chunk.terms?.length ?? 0), 0);
const simple = (text) => text.toLowerCase().replace(/[‐-―−]/g, '-').replace(/\s+/g, ' ');

test('key words belong to real lessons, appear in their text and have a meaning', () => {
  for (const id of KEY_WORD_LESSONS) {
    const lesson = lessons.get(id);
    assert.ok(lesson, `${id} is not a lesson`);
    const text = simple(JSON.stringify(lesson));
    const words = keyWordsFor(id);
    assert.ok(words.length >= 3 && words.length <= 6, `${id}: 3 to 6 key words`);
    for (const { term, meaning } of words) {
      assert.ok(text.includes(simple(term)), `${id}: "${term}" does not appear in the lesson`);
      assert.ok(meaning.trim().length > 10, `${id}: "${term}" needs a meaning`);
    }
  }
});

test('every lesson has key words for "Start simple"', () => {
  const missing = [...lessons.values()].filter((lesson) => !ownWords(lesson) && !keyWordsFor(lesson.id).length).map((lesson) => lesson.id);
  assert.deepEqual(missing, [], `lessons with no key words: ${missing.join(', ')}`);
});
