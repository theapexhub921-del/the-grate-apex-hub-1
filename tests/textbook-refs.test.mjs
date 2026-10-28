// Textbook page references (data/textbook-refs/). Run with: npm test
// - every listed lesson and section exists, every book is a reference
//   textbook in the content catalog, and pages are sensible numbers
// - every course (anatomy, physiology, biochemistry) has textbook pages,
//   and every anatomy and physiology topic does
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

const { builtTopics } = await import('@/data/topics');
const { getSourceFile } = await import('@/data/content-catalog');
const { textbookRefsFor, textbookTopics } = await import('@/data/textbook-refs');

const isTextbook = (ref) => getSourceFile(ref.sourceId)?.role === 'reference' && ref.page !== undefined;

describe('textbook page references', () => {
  it('point at real sections, reference books and plausible pages', () => {
    const topics = new Map(builtTopics.map(({ topic }) => [topic.id, topic]));
    for (const id of textbookTopics) {
      const topic = topics.get(id);
      assert.ok(topic, `textbook-refs/${id}: no such topic`);
      for (const lesson of topic.lessons) {
        lesson.chunks.forEach((_, index) => {
          for (const ref of textbookRefsFor(id, lesson.id, index)) {
            assert.equal(getSourceFile(ref.sourceId)?.role, 'reference', `${lesson.id} §${index}: ${ref.sourceId} is not a reference textbook`);
            assert.ok(Number.isInteger(ref.page) && ref.page > 0 && ref.page < 1500, `${lesson.id} §${index}: page ${ref.page}`);
          }
        });
      }
    }
  });

  it('reach the reading sections of every course', () => {
    const bySubject = new Map();
    for (const { topic } of builtTopics) {
      const sections = topic.lessons.flatMap((lesson) => lesson.chunks);
      const withPages = sections.filter((chunk) => (chunk.sourceRefs ?? []).some(isTextbook)).length;
      bySubject.set(topic.subject, (bySubject.get(topic.subject) ?? 0) + withPages);
      if (topic.subject === 'anatomy' || topic.subject === 'physiology') {
        assert.ok(withPages > 0, `${topic.id}: no section has a textbook page`);
      }
    }
    for (const subject of ['anatomy', 'physiology', 'biochemistry']) {
      assert.ok((bySubject.get(subject) ?? 0) > 20, `${subject}: too few textbook pages`);
    }
  });
});
