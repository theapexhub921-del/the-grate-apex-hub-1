// Every published lesson's key words, for the cross-course links shown at the
// end of a lesson's reading (components/learning/related-lessons.tsx).
import { publishedTopics } from '@/data/curriculum';
import { keyWordsFor } from '@/data/key-words';
import { relatedLessons, type LessonWords, type RelatedLesson } from '@/data/learning/related-lessons';

let index: LessonWords[] | null = null;

export function lessonWordIndex(): LessonWords[] {
  if (index) return index;
  index = publishedTopics.flatMap((topic) =>
    topic.lessons.map((lesson) => {
      const words = new Set<string>();
      for (const chunk of lesson.chunks) for (const term of chunk.terms ?? []) words.add(term.term);
      for (const step of lesson.interactive ?? []) {
        const terms = (step as { terms?: { term: string }[] }).terms;
        for (const term of terms ?? []) words.add(term.term);
      }
      for (const term of keyWordsFor(lesson.id)) words.add(term.term);
      for (const concept of lesson.concepts) words.add(concept.name);
      return { id: lesson.id, title: lesson.title, subject: topic.subject, topicId: topic.id, words: [...words] };
    })
  );
  return index;
}

export const relatedLessonsFor = (lessonId: string, limit?: number): RelatedLesson[] => relatedLessons(lessonId, lessonWordIndex(), limit);
