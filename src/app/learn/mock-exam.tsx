import { router } from 'expo-router';
import { useState } from 'react';

import { ExamBuilder } from '@/components/learning/exam-builder';
import { defaultMockMinutes, EXAM_BANKS, EXAM_SUBJECTS, MOCK_MINUTES, MOCK_SIZES, mockPool, SUBJECT_NAME } from '@/data/exam-practice';
import { pastCourseForSubject } from '@/data/past-question-topics';
import { usePastQuestions } from '@/data/past-questions';
import { routes } from '@/lib/routes';

// /learn/mock-exam — build a mock exam: a course, how many questions and how
// long. The paper is drawn at random from that course's HB2 past papers, sat
// with the answers at the end, handed in when the time runs out, and marked by
// topic on the results page (data/exam-practice.ts).
export default function MockExamBuilderScreen() {
  const ready = usePastQuestions(EXAM_BANKS);
  const [bank, setBank] = useState(pastCourseForSubject('anatomy'));
  const [size, setSize] = useState('40');
  const [minutes, setMinutes] = useState(String(defaultMockMinutes(40)));
  const available = ready ? mockPool(bank).length : 0;
  const count = Math.min(Number(size), available);
  const subject = EXAM_SUBJECTS.find((item) => pastCourseForSubject(item) === bank) ?? 'anatomy';

  return (
    <ExamBuilder
      eyebrow="Exam practice"
      title="Mock exam"
      subtitle={`A timed paper mixed from the real HB2 past papers. You can see the answers at the end, like the real exam, or after each question, and you get your score in each topic, so you know what to revise first.`}
      ready={ready}
      choices={[
        { label: 'Course', value: bank, options: EXAM_SUBJECTS.map((subject) => ({ value: pastCourseForSubject(subject), label: SUBJECT_NAME[subject] })), onChange: setBank },
        {
          label: 'Questions',
          value: size,
          options: MOCK_SIZES.map((value) => ({ value: String(value), label: String(value) })),
          onChange: (value: string) => {
            setSize(value);
            setMinutes(String(defaultMockMinutes(Number(value))));
          },
        },
        { label: 'Time for the whole paper', hint: 'About a minute a question is the usual exam pace.', value: minutes, options: MOCK_MINUTES.map((value) => ({ value: String(value), label: value < 60 ? `${value} min` : `${value / 60} h${value % 60 ? ` ${value % 60}` : ''}` })), onChange: setMinutes },
      ]}
      available={available}
      summary={`${count} questions from ${available.toLocaleString()} past questions in ${SUBJECT_NAME[subject]}, ${minutes} minutes. A new mix every time.`}
      emptyMessage="This course has no past questions yet."
      startLabel="Set the paper"
      onStart={() => router.push(routes.exam({ kind: 'mock', bank, size: Number(size), minutes: Number(minutes) }))}
    />
  );
}
