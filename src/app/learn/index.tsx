import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { SubjectGlyph } from '@/components/learning/glyphs';
import { MemoryDistribution } from '@/components/learning/memory-ui';
import { NextActionHero, NextActionList } from '@/components/learning/next-action-card';
import { TopicCard } from '@/components/learning/topic-card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Card, PressableCard } from '@/components/ui/interactive';
import { Pill } from '@/components/ui/pill';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Columns, PageHeader, Screen, SectionHeader } from '@/components/ui/screen';
import { Type, type ThemeColors } from '@/constants/theme';
import { contentTopics } from '@/data/content-catalog';
import { getNextActions } from '@/data/learning/next-action';
import { curriculumProgress, subjectProgress } from '@/data/learning/progress-model';
import { useLearning } from '@/data/learning/use-learning';
import { getSubjectStatus, getSubjectStatusLabel, subjects } from '@/data/subjects';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';
import { routes } from '@/lib/routes';

// Learn — the academic workspace: what to do next, every subject, and the
// topics in progress. All numbers come from the learning engine.
export default function LearnScreen() {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const { inputs, now } = useLearning();
  const actions = useMemo(() => getNextActions(inputs), [inputs]);
  const overall = useMemo(() => curriculumProgress(inputs), [inputs]);
  const recent = overall.topics
    .filter((topic) => topic.status !== 'not-started')
    .sort((a, b) => (b.lastRevisedAt ?? 0) - (a.lastRevisedAt ?? 0))
    .slice(0, 3);

  const main = (
    <View style={styles.column}>
      {actions[0] ? <NextActionHero action={actions[0]} /> : null}

      <SectionHeader title="Subjects" subtitle="Subject → course → topic → lessons." style={styles.section} />
      {subjects.map((subject) => {
        const status = getSubjectStatus(subject);
        const progress = subjectProgress(subject.id, inputs);
        const received = contentTopics.filter((topic) => topic.subject === subject.id && topic.status !== 'empty').length;
        return (
          <PressableCard
            key={subject.id}
            onPress={() => router.push(subject.href)}
            accessibilityLabel={`${subject.name}. ${getSubjectStatusLabel(status, progress.percent)}`}
            style={styles.subjectCard}
          >
            <SubjectGlyph subject={subject.id} size={52} />
            <View style={styles.subjectInfo}>
              <View style={styles.subjectTitleRow}>
                <Text style={styles.subjectTitle}>{subject.name}</Text>
                {status !== 'available' ? (
                  <Pill label={getSubjectStatusLabel(status, progress.percent)} tone={status === 'awaiting' ? 'neutral' : 'warning'} />
                ) : progress.due > 0 ? (
                  <Pill label={`${progress.due} due`} tone="warning" />
                ) : null}
              </View>
              <Text style={styles.subjectTagline}>{subject.tagline}</Text>
              {status === 'available' ? (
                <>
                  <View style={styles.subjectProgressRow}>
                    <ProgressBar value={progress.lessonsTotal ? progress.lessonsCompleted / progress.lessonsTotal : 0} height={6} style={styles.flex} label={`${subject.name} lessons completed`} />
                    <Text style={styles.subjectMeta}>
                      {progress.topics.length} topic{progress.topics.length === 1 ? '' : 's'} · {progress.lessonsCompleted}/{progress.lessonsTotal} lessons
                    </Text>
                  </View>
                  {received > progress.topics.length ? (
                    <Text style={styles.subjectNote}>
                      + {received - progress.topics.length} more topics received, lessons in preparation
                    </Text>
                  ) : null}
                </>
              ) : status === 'in-preparation' ? (
                <Text style={styles.subjectNote}>{received} lecture topics received — lessons in preparation.</Text>
              ) : null}
            </View>
            <Icon name="chevronRight" size={20} color={colors.textTertiary} />
          </PressableCard>
        );
      })}

      {recent.length > 0 ? (
        <>
          <SectionHeader title="Your topics" subtitle="Where you have been learning recently." style={styles.section} />
          {recent.map((topic) => (
            <TopicCard key={topic.topic.id} progress={topic} now={now} compact />
          ))}
        </>
      ) : null}
    </View>
  );

  const side = (
    <View style={styles.column}>
      <Card style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <View style={styles.reviewIcon}>
            <Icon name="reinforce" size={18} color={colors.primaryText} />
          </View>
          <Text style={styles.kicker}>SPACED REVIEW</Text>
        </View>
        <Text style={styles.reviewTitle}>
          {overall.due > 0 ? `${overall.due} concept${overall.due === 1 ? '' : 's'} due` : 'Nothing due right now'}
        </Text>
        <Text style={styles.reviewText}>
          {overall.counts.tracked > 0
            ? 'Review brings back what you are most likely to forget — weak and due concepts first.'
            : 'Complete a lesson and its concepts will start coming back for review.'}
        </Text>
        {overall.counts.tracked > 0 ? <MemoryDistribution counts={overall.counts} /> : null}
        <Button
          label={overall.due > 0 ? 'Review now' : 'Practise anyway'}
          variant={overall.due > 0 ? 'primary' : 'secondary'}
          onPress={() => router.push(routes.review({ focus: overall.due > 0 ? 'due' : 'mixed' }))}
          disabled={overall.counts.tracked === 0}
          fullWidth
        />
      </Card>
      {actions.length > 1 ? (
        <>
          <Text style={styles.kicker}>ALSO SUGGESTED</Text>
          <NextActionList actions={actions.slice(1, 4)} />
        </>
      ) : null}
    </View>
  );

  return (
    <Screen width="wide">
      <PageHeader eyebrow="Your curriculum" title="Learn" subtitle="Lecture material, learned actively and reviewed on time." />
      <Columns main={main} side={side} sideWidth={360} />
    </Screen>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    column: { gap: 12 },
    section: { marginTop: 14, marginBottom: 0 },
    subjectCard: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    subjectInfo: { flex: 1, minWidth: 0, gap: 4 },
    subjectTitleRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
    subjectTitle: { ...Type.title3, color: colors.text },
    subjectTagline: { fontSize: 13, color: colors.textSecondary },
    subjectProgressRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
    flex: { flex: 1 },
    subjectMeta: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
    subjectNote: { fontSize: 12, color: colors.textTertiary },
    reviewCard: { gap: 10 },
    reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    reviewIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.primarySubtle, alignItems: 'center', justifyContent: 'center' },
    kicker: { ...Type.overline, color: colors.textTertiary },
    reviewTitle: { ...Type.title2, fontSize: 20, color: colors.text },
    reviewText: { fontSize: 13, lineHeight: 19, color: colors.textSecondary },
  });
}
