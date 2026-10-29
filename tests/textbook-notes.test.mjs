// Textbook notes (data/textbook-notes/): short summaries, in our own words, of
// what a section's textbook pages add. Run with: npm test
// - every note belongs to a real lesson section that has textbook pages
// - every book a note names is one of that section's textbooks
// - notes are a readable length, plain text, and not copied word for word
//   from the slides (no 12-word run shared with the section's own text)
// - the notes reach every anatomy and physiology topic with textbook pages
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

const { builtTopics } = await import('@/data/topics');
const { getSourceFile } = await import('@/data/content-catalog');
const { textbookNotesOf, textbookNoteTopics, textbookNoteFor } = await import('@/data/textbook-notes');

const BOOKS = { "Gray's": 'grays-anatomy-students-4e', Guyton: 'guyton-hall-14e', Costanzo: 'costanzo-physiology' };
const isTextbook = (ref) => getSourceFile(ref.sourceId)?.role === 'reference' && ref.page !== undefined;
const words = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().split(' ').filter(Boolean);
const runs = (text, n) => {
  const list = words(text);
  const out = new Set();
  for (let i = 0; i + n <= list.length; i += 1) out.add(list.slice(i, i + n).join(' '));
  return out;
};

describe('textbook notes', () => {
  const topics = new Map(builtTopics.map(({ topic }) => [topic.id, topic]));

  it('belong to real sections that have textbook pages, and name only those books', () => {
    for (const topicId of textbookNoteTopics) {
      const topic = topics.get(topicId);
      assert.ok(topic, `textbook-notes/${topicId}: no such topic`);
      const lessons = new Map(topic.lessons.map((lesson) => [lesson.id, lesson]));
      for (const [lessonId, byIndex] of Object.entries(textbookNotesOf(topicId))) {
        const lesson = lessons.get(lessonId);
        assert.ok(lesson, `${topicId}: no lesson ${lessonId}`);
        for (const [index, note] of Object.entries(byIndex)) {
          const chunk = lesson.chunks[Number(index)];
          assert.ok(chunk, `${lessonId} §${index}: no such section`);
          const books = new Set((chunk.sourceRefs ?? []).filter(isTextbook).map((ref) => ref.sourceId));
          assert.ok(books.size > 0, `${lessonId} §${index}: a note but no textbook pages`);
          assert.equal(chunk.textbookNote, note, `${lessonId} §${index}: buildTopic did not attach the note`);
          for (const [name, sourceId] of Object.entries(BOOKS)) {
            if (note.includes(name)) assert.ok(books.has(sourceId), `${lessonId} §${index}: names ${name}, which is not one of its textbooks`);
          }
        }
      }
    }
  });

  it('are readable plain text of a sensible length', () => {
    for (const topicId of textbookNoteTopics) {
      for (const [lessonId, byIndex] of Object.entries(textbookNotesOf(topicId))) {
        for (const [index, note] of Object.entries(byIndex)) {
          const where = `${lessonId} §${index}`;
          assert.ok(note.length >= 120 && note.length <= 700, `${where}: ${note.length} characters`);
          assert.ok(!/[<>]/.test(note), `${where}: no markup in notes`);
          assert.ok(/[.!?)]$/.test(note.trim()), `${where}: should end with a full stop`);
        }
      }
    }
  });

  it('add to the slides rather than repeat them', () => {
    for (const topicId of textbookNoteTopics) {
      const topic = topics.get(topicId);
      for (const lesson of topic.lessons) {
        lesson.chunks.forEach((chunk, index) => {
          const note = textbookNoteFor(topicId, lesson.id, index);
          if (!note) return;
          const own = runs(JSON.stringify({ ...chunk, textbookNote: undefined }), 12);
          const shared = [...runs(note, 12)].filter((run) => own.has(run));
          assert.deepEqual(shared, [], `${lesson.id} §${index}: repeats the slide text`);
        });
      }
    }
  });

  it('reach every anatomy and physiology topic with textbook pages', () => {
    for (const { topic } of builtTopics) {
      if (topic.subject !== 'anatomy' && topic.subject !== 'physiology') continue;
      const withPages = topic.lessons.flatMap((lesson) => lesson.chunks).filter((chunk) => (chunk.sourceRefs ?? []).some(isTextbook));
      if (!withPages.length) continue;
      const withNotes = withPages.filter((chunk) => chunk.textbookNote).length;
      assert.ok(withNotes / withPages.length >= 0.75, `${topic.id}: only ${withNotes} of ${withPages.length} sections have a textbook note`);
    }
  });
});
