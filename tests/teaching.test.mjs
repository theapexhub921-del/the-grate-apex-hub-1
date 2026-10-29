// Physiology taught like a textbook (data/teaching/). Run with: npm test
// - every teaching entry belongs to a real lesson section and is attached to it
// - every physiology reading section is taught (none left as slide notes only)
// - paragraphs are plain prose of a sensible length, and do not just repeat the
//   section's own lecture text
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

const { builtTopics } = await import('@/data/topics');
const { teachingOf, teachingTopics } = await import('@/data/teaching');

const words = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(' ').filter(Boolean);
const runs = (text, n) => {
  const list = words(text);
  const out = new Set();
  for (let i = 0; i + n <= list.length; i += 1) out.add(list.slice(i, i + n).join(' '));
  return out;
};

describe('physiology teaching', () => {
  const topics = new Map(builtTopics.map(({ topic }) => [topic.id, topic]));

  it('belongs to real sections and is attached by buildTopic', () => {
    for (const topicId of teachingTopics) {
      const topic = topics.get(topicId);
      assert.ok(topic, `teaching/${topicId}: no such topic`);
      const lessons = new Map(topic.lessons.map((lesson) => [lesson.id, lesson]));
      for (const [lessonId, byIndex] of Object.entries(teachingOf(topicId))) {
        const lesson = lessons.get(lessonId);
        assert.ok(lesson, `${topicId}: no lesson ${lessonId}`);
        for (const [index, paragraphs] of Object.entries(byIndex)) {
          const chunk = lesson.chunks[Number(index)];
          assert.ok(chunk, `${lessonId} §${index}: no such section`);
          assert.deepEqual(chunk.teach, paragraphs, `${lessonId} §${index}: not attached`);
        }
      }
    }
  });

  it('covers every reading section of every physiology topic', () => {
    for (const { topic } of builtTopics) {
      if (topic.subject !== 'physiology') continue;
      assert.ok(teachingTopics.includes(topic.id), `${topic.id}: no teaching file`);
      for (const lesson of topic.lessons) {
        lesson.chunks.forEach((chunk, index) => {
          assert.ok(chunk.teach?.length, `${lesson.id} §${index} (${chunk.title}): not taught yet`);
        });
      }
    }
  });

  it('is plain prose of a sensible length', () => {
    for (const topicId of teachingTopics) {
      for (const [lessonId, byIndex] of Object.entries(teachingOf(topicId))) {
        for (const [index, paragraphs] of Object.entries(byIndex)) {
          const where = `${lessonId} §${index}`;
          assert.ok(paragraphs.length >= 2 && paragraphs.length <= 6, `${where}: ${paragraphs.length} paragraphs`);
          for (const paragraph of paragraphs) {
            assert.ok(paragraph.length >= 80 && paragraph.length <= 1200, `${where}: a paragraph of ${paragraph.length} characters`);
            assert.ok(!/[<>*`]/.test(paragraph), `${where}: no markup in teaching text`);
            assert.ok(/[.!?)”’]$/.test(paragraph.trim()), `${where}: a paragraph should end with a full stop`);
            assert.ok(!/\bslides? \d/i.test(paragraph), `${where}: slide numbers belong in the key points, not the teaching`);
          }
        }
      }
    }
  });

  it('teaches rather than repeating the lecture text', () => {
    for (const topicId of teachingTopics) {
      for (const lesson of topics.get(topicId).lessons) {
        lesson.chunks.forEach((chunk, index) => {
          if (!chunk.teach) return;
          const own = runs(JSON.stringify({ ...chunk, teach: undefined, textbookNote: undefined }), 14);
          for (const paragraph of chunk.teach) {
            const shared = [...runs(paragraph, 14)].filter((run) => own.has(run));
            assert.deepEqual(shared, [], `${lesson.id} §${index}: copies the slide text`);
          }
        });
      }
    }
  });
});
