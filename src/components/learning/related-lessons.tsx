// "Links to your other courses" (2026-10-28), at the end of a lesson's
// reading: lessons in other subjects that share its key words, each with "How
// do these link?" (Ask AI explains the connection and gives a memory hook).
import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AiQuestionButton, linkLessonsQuestion } from '@/components/learning/ai-study';
import { Card, Interactive } from '@/components/ui/interactive';
import { Text } from '@/components/ui/text';
import type { ThemeColors } from '@/constants/theme';
import { lessonToText } from '@/data/ai-study';
import type { Lesson, SubjectId } from '@/data/lesson-types';
import { relatedLessonsFor } from '@/data/related-lessons';
import { getSubjectInfo } from '@/data/subjects';
import { useThemedStyles } from '@/hooks/use-theme';
import { routes } from '@/lib/routes';

export function RelatedLessons({ lesson }: { lesson: Lesson }) {
  const styles = useThemedStyles(createStyles);
  const related = useMemo(() => relatedLessonsFor(lesson.id, 3), [lesson.id]);
  const aiLesson = useMemo(() => ({ id: lesson.id, title: lesson.title, text: lessonToText(lesson) }), [lesson]);
  if (related.length === 0) return null;
  return (
    <Card style={styles.card}>
      <Text style={styles.kicker}>LINKS TO YOUR OTHER COURSES</Text>
      <Text style={styles.muted}>The same ideas come up elsewhere. Seeing them from another course helps them stick.</Text>
      {related.map((item) => (
        <View key={item.id} style={styles.row}>
          <Interactive
            onPress={() => router.push(routes.lesson(item.id, { layer: 'read' }))}
            accessibilityRole="link"
            style={({ hovered }) => [styles.link, hovered && styles.linkHover]}
          >
            <Text style={styles.subject}>{getSubjectInfo(item.subject as SubjectId)?.name ?? item.subject}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.muted}>Both cover: {item.shared.join(', ')}</Text>
          </Interactive>
          <AiQuestionButton
            lesson={aiLesson}
            focus={item.title}
            question={linkLessonsQuestion(lesson.title, item.title, item.shared)}
            label="How do these link?"
            title="How do these link?"
            hint="Ask AI explains the connection between the two lessons"
          />
        </View>
      ))}
    </Card>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: { gap: 10 },
    kicker: { fontSize: 11, fontWeight: '800', letterSpacing: 1.1, color: colors.textTertiary },
    muted: { fontSize: 12.5, lineHeight: 18, color: colors.textSecondary },
    row: { gap: 2, alignItems: 'flex-start' },
    link: { alignSelf: 'stretch', gap: 2, padding: 8, borderRadius: 8 },
    linkHover: { backgroundColor: colors.surfaceMuted },
    subject: { fontSize: 11, fontWeight: '700', letterSpacing: 0.6, color: colors.primaryText },
    title: { fontSize: 14.5, fontWeight: '700', color: colors.text },
  });
}
