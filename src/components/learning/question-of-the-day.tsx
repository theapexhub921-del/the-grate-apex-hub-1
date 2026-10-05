import AsyncStorage from '@react-native-async-storage/async-storage';
import { type Href, router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { QuestionCard } from '@/components/question-card';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/interactive';
import { Pill } from '@/components/ui/pill';
import { Type, type ThemeColors } from '@/constants/theme';
import { findLesson, publishedTopics, getTopicQuestions } from '@/data/curriculum';
import { type Answer, isAnswerCorrect, type Question } from '@/data/questions';
import { useThemedStyles } from '@/hooks/use-theme';
import { routes } from '@/lib/routes';

// Question of the Day (ported from the older Grate Apex Hub site).
// One single-answer question per day from the published question banks —
// the same question for every learner on a given day. Practice only: the
// answer is remembered on this device for the day and never affects XP,
// memory or review schedules.
const STORAGE_KEY = 'grateapex_qotd';

function dayKey(now: Date) {
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

function pickQuestion(day: string): Question | null {
  const pool = publishedTopics
    .flatMap((topic) => getTopicQuestions(topic.id))
    .filter((question) => question.type === 'choice' && question.usage !== 'learn' && question.options.length > 2);
  if (pool.length === 0) return null;
  return pool[hash(day) % pool.length];
}

export function QuestionOfTheDay() {
  const styles = useThemedStyles(createStyles);
  const day = dayKey(new Date());
  const question = useMemo(() => pickQuestion(day), [day]);
  const [answer, setAnswer] = useState<Answer | undefined>(undefined);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        const parsed = saved ? (JSON.parse(saved) as { day: string; answer: Answer }) : null;
        if (alive && parsed?.day === day) {
          setAnswer(parsed.answer);
          setRevealed(true);
        }
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [day]);

  if (!question) return null;
  const entry = findLesson(question.lessonId);

  function check() {
    if (answer === undefined) return;
    setRevealed(true);
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ day, answer })).catch(() => undefined);
  }

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Question of the Day</Text>
        <Pill label="Practice · not scored" />
      </View>
      {entry ? <Text style={styles.source}>{entry.topic.title} · {entry.lesson.title}</Text> : null}
      <QuestionCard question={question} value={answer} onChange={setAnswer} revealed={revealed} shuffleSeed={day} compact />
      {revealed ? (
        <View style={styles.footer}>
          <Text style={styles.result}>{isAnswerCorrect(question, answer) ? 'Correct — nice start to the day.' : 'Not this time — see why above.'}</Text>
          {entry ? (
            <View style={styles.links}>
              <Button label="Open the lesson" size="sm" variant="secondary" onPress={() => router.push(routes.lesson(entry.lesson.id, { layer: 'read' }))} />
              <Button label="Flashcards" size="sm" variant="secondary" onPress={() => router.push(`/learn/flashcards?lesson=${encodeURIComponent(entry.lesson.id)}` as Href)} />
            </View>
          ) : null}
        </View>
      ) : (
        <Button label="Check answer" size="sm" onPress={check} disabled={answer === undefined} />
      )}
    </Card>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: { gap: 12 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
    title: { ...Type.title3, color: colors.text },
    source: { fontSize: 12.5, color: colors.textSecondary },
    footer: { gap: 10 },
    links: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    result: { fontSize: 14, fontWeight: '700', color: colors.text },
  });
}
