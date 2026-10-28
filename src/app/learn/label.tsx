import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { FigureExplorerBody } from '@/components/learning/figure-view';
import { BackLink } from '@/components/learning/nav-bits';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/interactive';
import { PageHeader, Screen } from '@/components/ui/screen';
import { EmptyState } from '@/components/ui/state-views';
import { Text } from '@/components/ui/text';
import type { ThemeColors } from '@/constants/theme';
import { findLesson } from '@/data/curriculum';
import { figureLessons, pickLabelFigure } from '@/data/figure-practice';
import { useProgress } from '@/data/progress';
import { useThemedStyles } from '@/hooks/use-theme';
import { routes } from '@/lib/routes';

// /learn/label — "Label a diagram" (2026-10-28): a lecture diagram from a lesson
// the learner has studied, with its labels covered. Pick a name, tap its pin.
// First tries are recorded like quiz answers; finishing one ticks the daily quest.
export default function LabelDiagramScreen() {
  const styles = useThemedStyles(createStyles);
  const progress = useProgress();
  const [pick, setPick] = useState(() => Math.random());
  const [figure, setFigure] = useState(() => pickLabelFigure(new Set(progress.completedLessons), pick));
  const [result, setResult] = useState<{ right: number; total: number } | null>(null);
  const lessonId = figure ? figureLessons().get(figure.id) : undefined;
  const lesson = lessonId ? findLesson(lessonId) : null;

  function another() {
    const next = Math.random();
    setPick(next);
    setResult(null);
    setFigure(pickLabelFigure(new Set(progress.completedLessons), next, figure?.id));
  }

  return (
    <Screen width="learning">
      <BackLink fallback={'/learn' as never} />
      <PageHeader eyebrow="Study" title="Label a diagram" subtitle="The labels are covered. Pick a name, then tap the pin it belongs to. Diagrams come from the lessons you have studied." />
      {figure ? (
        <Card style={styles.card}>
          <View style={styles.head}>
            <View style={styles.flex}>
              <Text style={styles.title}>{figure.title}</Text>
              {lesson ? <Text style={styles.muted}>From {lesson.lesson.title}</Text> : null}
            </View>
            <Button label="Another diagram" size="sm" variant="secondary" onPress={another} />
          </View>
          <FigureExplorerBody key={`${figure.id}:${pick}`} figure={figure} initialMode="label" onLabelled={(right, total) => setResult({ right, total })} />
          {result && lesson ? (
            <View style={styles.actions}>
              <Button label="Another diagram" onPress={another} />
              <Button label="Open the lesson" variant="ghost" onPress={() => router.push(routes.lesson(lesson.lesson.id, { layer: 'read' }))} />
            </View>
          ) : null}
        </Card>
      ) : (
        <EmptyState title="No diagrams yet" message="Diagrams appear here once lessons with lecture pictures are published." />
      )}
    </Screen>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: { gap: 12 },
    head: { flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
    flex: { flex: 1, minWidth: 200 },
    title: { fontSize: 17, fontWeight: '700', color: colors.text },
    muted: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
    actions: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  });
}
