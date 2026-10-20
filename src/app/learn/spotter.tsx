import { router } from 'expo-router';
import { useState } from 'react';

import { ExamBuilder } from '@/components/learning/exam-builder';
import { DEFAULT_SPOTTER_SECONDS, EXAM_BANKS, EXAM_SUBJECTS, SPOTTER_SECONDS, SPOTTER_STATIONS, spotterPool, SUBJECT_NAME } from '@/data/exam-practice';
import type { SubjectId } from '@/data/lesson-types';
import { usePastQuestions } from '@/data/past-questions';
import { routes } from '@/lib/routes';

// /learn/spotter — spotter mode for practicals: timed stations on pictures (the
// lecture diagrams with a part marked, and past-paper pictures such as the
// histology practical). Each station has its own clock and moves on when it
// runs out, like the real practical; answers come at the end (data/exam-practice.ts).
export default function SpotterBuilderScreen() {
  const ready = usePastQuestions(EXAM_BANKS);
  const [subject, setSubject] = useState<SubjectId | 'all'>('anatomy');
  const [size, setSize] = useState('20');
  const [seconds, setSeconds] = useState(String(DEFAULT_SPOTTER_SECONDS));
  const available = ready ? spotterPool(subject).length : 0;
  const count = Math.min(Number(size), available);

  return (
    <ExamBuilder
      eyebrow="Practical practice"
      title="Spotter"
      subtitle="Timed stations, like a practical exam: look at the picture, name what is marked, and move on when the clock runs out. Answers at the end."
      ready={ready}
      choices={[
        { label: 'Subject', value: subject, options: [...EXAM_SUBJECTS.map((item) => ({ value: item, label: SUBJECT_NAME[item] })), { value: 'all', label: 'All' }], onChange: setSubject },
        { label: 'Stations', value: size, options: SPOTTER_STATIONS.map((value) => ({ value: String(value), label: String(value) })), onChange: setSize },
        { label: 'Time at each station', value: seconds, options: SPOTTER_SECONDS.map((value) => ({ value: String(value), label: `${value} s` })), onChange: setSeconds },
      ]}
      available={available}
      summary={`${count} stations from ${available} pictures (lecture diagrams and past-paper pictures), ${seconds} seconds each.`}
      emptyMessage="No pictures for this subject yet."
      startLabel="Start the spotter"
      onStart={() => router.push(routes.exam({ kind: 'spotter', subject, size: Number(size), seconds: Number(seconds) }))}
    />
  );
}
