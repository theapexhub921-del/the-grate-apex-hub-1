import { router } from 'expo-router';
import { type ReactNode, useMemo } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { SubjectGlyph, TopicGlyph } from '@/components/learning/glyphs';
import { MemoryDistribution } from '@/components/learning/memory-ui';
import { NextActionHero, NextActionList } from '@/components/learning/next-action-card';
import { QuestionOfTheDay } from '@/components/learning/question-of-the-day';
import { ReviewCalendar } from '@/components/learning/review-calendar';
import { LogoMark } from '@/components/logo-mark';
import { AnimatedContent } from '@/components/motion';
import { NotificationBell } from '@/components/notifications';
import { RankProgressCard } from '@/components/rank-progress';
import { AnimatedNumber } from '@/components/ui/animated-number';
import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { IconButton } from '@/components/ui/icon-button';
import { Card, Interactive, PressableCard } from '@/components/ui/interactive';
import { ProgressBar } from '@/components/ui/progress-bar';
import { ProgressRing } from '@/components/ui/progress-ring';
import { Columns, Screen, SectionHeader } from '@/components/ui/screen';
import { webStyle } from '@/components/ui/web';
import { isDesktopWidth, Type, type ThemeColors } from '@/constants/theme';
import { getTopic } from '@/data/curriculum';
import { APEX } from '@/data/learning/apex';
import { getFeaturedItem } from '@/data/explore';
import { type LearningEvent, useLearningEvents } from '@/data/learning/events';
import { getNextActions } from '@/data/learning/next-action';
import { curriculumProgress, subjectProgress } from '@/data/learning/progress-model';
import { addDays, describeAgo, endOfDay, startOfDay } from '@/data/learning/time';
import { useLearning } from '@/data/learning/use-learning';
import { getStreakStatus } from '@/data/progression';
import { getSubjectInfo, getSubjectStatus, subjects } from '@/data/subjects';
import { useDisplayName } from '@/data/user';
import { useGreeting } from '@/hooks/use-greeting';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';
import { isLocalPreview } from '@/lib/local-preview';
import { routes } from '@/lib/routes';

// Home — the command centre. It answers "what should I do next?" first,
// then shows today, what is coming back for review, course mastery, rank,
// the study circle and something to discover. Every number is real.
export default function HomeScreen() {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const { width } = useWindowDimensions();
  const desktop = isDesktopWidth(width);
  const { greeting } = useGreeting();
  const displayName = useDisplayName();
  const { progress, inputs, memory, attempts, quizzes, now } = useLearning();
  const events = useLearningEvents();

  const actions = useMemo(() => getNextActions(inputs), [inputs]);
  const overall = useMemo(() => curriculumProgress(inputs), [inputs]);

  const name = displayName?.trim() ? `Doc. ${displayName.trim()}` : 'Doc.';
  const todayStart = startOfDay(now);
  const xpToday = progress.xpLedger.filter((entry) => entry.at >= todayStart).reduce((sum, entry) => sum + entry.amount, 0);
  const streakStatus = getStreakStatus(progress.streak, progress.lastActivityDate, new Date(now));
  const scheduled = Array.from(memory.concepts.values()).filter((concept) => concept.dueAt !== null);
  const dueToday = scheduled.filter((concept) => concept.dueAt! <= endOfDay(now)).length;
  const reviewedToday = attempts.filter((attempt) => (attempt.mode === 'review' || attempt.mode === 'recall') && attempt.attemptedAt >= todayStart).length;

  const subline =
    dueToday > 0
      ? `Your next reinforcement is ready — ${dueToday} concept${dueToday === 1 ? '' : 's'} due today.`
      : overall.lessonsCompleted === 0
        ? 'Your first lesson is ready. Let’s begin.'
        : 'Nothing due right now. Keep the momentum with something new.';

  // Where the learner is: the most recently studied topic.
  const current = [...overall.topics]
    .filter((topic) => topic.status !== 'not-started')
    .sort((a, b) => (b.lastRevisedAt ?? 0) - (a.lastRevisedAt ?? 0))[0];

  const position = (
    <PressableCard
      onPress={() => router.push(current ? routes.topic(current.topic.id) : routes.learn())}
      accessibilityLabel={current ? `Current position: ${current.topic.title}, ${current.completed} of ${current.total} lessons` : 'Open Learn'}
      style={styles.position}
    >
      {current ? (
        <TopicGlyph title={current.topic.title} subject={current.topic.subject} size={48} />
      ) : (
        <SubjectGlyph subject="biochemistry" size={48} />
      )}
      <View style={styles.flex}>
        <Text style={styles.positionKicker}>
          {current ? `${getSubjectInfo(current.topic.subject).name.toUpperCase()} · CURRENT TOPIC` : 'YOUR STARTING POINT'}
        </Text>
        <Text style={styles.positionTitle} numberOfLines={1}>
          {current ? current.topic.title : `${overall.topics.length} topics ready in Biochemistry`}
        </Text>
        <Text style={styles.positionMeta} numberOfLines={1}>
          {current
            ? `${current.completed} of ${current.total} lessons · last studied ${describeAgo(current.lastRevisedAt ?? now, now)}`
            : 'Lessons, quizzes and spaced review, built from your lectures.'}
        </Text>
      </View>
      {current ? (
        <ProgressRing value={current.total ? current.completed / current.total : 0} size={46} thickness={5} label="Topic progress">
          <Text style={styles.ringText}>{current.total ? Math.round((current.completed / current.total) * 100) : 0}%</Text>
        </ProgressRing>
      ) : (
        <Icon name="chevronRight" size={20} color={colors.textTertiary} />
      )}
    </PressableCard>
  );

  const hero = actions[0] ? <NextActionHero action={actions[0]} /> : null;

  const today = (
    <Card style={styles.todayCard}>
      <TodayStat
        icon="xp"
        tint={colors.accentText}
        value={<AnimatedNumber value={xpToday} signed style={[styles.statNumber, { color: colors.accentText }]} />}
        label="XP today"
      />
      <View style={styles.todayDivider} />
      <TodayStat
        icon="reinforce"
        tint={colors.primaryText}
        value={
          <Text style={styles.statNumber}>
            {reviewedToday}
            {dueToday > 0 ? <Text style={styles.statOf}> / {dueToday + reviewedToday}</Text> : null}
          </Text>
        }
        label="reviews today"
        hint={dueToday > 0 ? `${dueToday} still due` : 'nothing due'}
      />
      <View style={styles.todayDivider} />
      <TodayStat
        icon="streak"
        tint={progress.streak > 0 ? colors.accentText : colors.textTertiary}
        value={<Text style={styles.statNumber}>{progress.streak}</Text>}
        label="day streak"
        hint={streakStatus === 'continueToday' ? 'study today to keep it' : streakStatus === 'activeToday' ? 'done for today' : undefined}
      />
    </Card>
  );

  const calendar = (
    <Card style={styles.card}>
      <SectionHeader
        title="Reinforcement"
        subtitle={
          scheduled.length > 0
            ? 'When each concept comes back — just before you would forget it.'
            : 'Complete a lesson and its concepts are scheduled for review here.'
        }
        style={styles.noMargin}
      />
      <ReviewCalendar memory={memory} attempts={attempts} now={now} />
    </Card>
  );

  const courseMastery = (
    <Card style={styles.card}>
      <SectionHeader title="Course mastery" subtitle="Completed · due · mastered, per subject." style={styles.noMargin} />
      {subjects.map((subject) => {
        const status = getSubjectStatus(subject);
        const item = subjectProgress(subject.id, inputs);
        return (
          <Interactive
            key={subject.id}
            onPress={() => router.push(subject.href)}
            accessibilityRole="link"
            accessibilityLabel={`${subject.name}: ${item.lessonsCompleted} of ${item.lessonsTotal} lessons completed`}
            style={({ hovered }) => [styles.subjectRow, hovered && styles.rowHover]}
          >
            <SubjectGlyph subject={subject.id} size={40} />
            <View style={styles.flex}>
              <View style={styles.subjectTop}>
                <Text style={styles.subjectName}>{subject.name}</Text>
                <Text style={styles.subjectMeta}>
                  {status === 'available'
                    ? `${item.lessonsCompleted}/${item.lessonsTotal} lessons${item.due ? ` · ${item.due} due` : ''}`
                    : status === 'in-preparation'
                      ? 'Lessons in preparation'
                      : 'Awaiting lecture materials'}
                </Text>
              </View>
              {status === 'available' ? (
                <>
                  <ProgressBar value={item.lessonsTotal ? item.lessonsCompleted / item.lessonsTotal : 0} height={6} label={`${subject.name} progress`} />
                  {item.counts.tracked > 0 ? <MemoryDistribution counts={item.counts} legend={false} height={4} style={styles.miniDistribution} /> : null}
                </>
              ) : null}
            </View>
            {status === 'available' ? (
              <ProgressRing value={item.mastery} size={40} thickness={4} color={colors.stateMastered} label={`${subject.name} mastery`}>
                <Text style={styles.ringTextSmall}>{Math.round(item.mastery * 100)}</Text>
              </ProgressRing>
            ) : null}
          </Interactive>
        );
      })}
      {overall.counts.tracked > 0 ? <MemoryDistribution counts={overall.counts} /> : null}
    </Card>
  );

  // The study circle: the learner's real week. Classmate connections are
  // not built yet, so nothing here pretends otherwise.
  const weekStart = addDays(todayStart, -6);
  const lessonsThisWeek = Object.values(progress.lessonCompletedAt).filter((at) => at >= weekStart).length;
  const answersThisWeek = attempts.filter((attempt) => attempt.attemptedAt >= weekStart).length;
  const social = (
    <PressableCard onPress={() => router.push('/social' as never)} accessibilityLabel="Open Social" style={styles.card}>
      <View style={styles.cardTitleRow}>
        <Icon name="social" size={18} color={colors.primaryText} />
        <Text style={styles.cardTitle}>Your study week</Text>
      </View>
      <View style={styles.weekRow}>
        <WeekStat value={lessonsThisWeek} label="lessons" />
        <WeekStat value={answersThisWeek} label="answers" />
        <WeekStat value={progress.xpLedger.filter((entry) => entry.at >= weekStart).reduce((sum, entry) => sum + entry.amount, 0)} label="XP" />
      </View>
      <Text style={styles.muted}>Leagues and classmates open when connecting is ready.</Text>
    </PressableCard>
  );

  const featured = getFeaturedItem();
  const discovery = featured ? (
    <PressableCard
      onPress={() => router.push(`/explore/discovery?id=${featured.id}` as never)}
      accessibilityLabel={`Discover: ${featured.title}`}
      style={styles.card}
      tone="insight"
    >
      <View style={styles.cardTitleRow}>
        <Icon name="connection" size={18} color={colors.primaryText} />
        <Text style={styles.discoveryKicker}>DISCOVER · {featured.topic.toUpperCase()}</Text>
      </View>
      <Text style={styles.discoveryTitle}>{featured.title}</Text>
      <Text style={styles.muted} numberOfLines={2}>
        {featured.summary}
      </Text>
    </PressableCard>
  ) : null;

  const apex = (
    <PressableCard onPress={() => router.push(routes.apex())} style={styles.apexCard} accessibilityLabel="Apex Challenge: timed whole-course mastery event">
      <View style={styles.apexBadge}>
        <Icon name="challenge" size={18} color="#0A1F5C" filled />
      </View>
      <View style={styles.flex}>
        <Text style={styles.apexTitle}>Apex Challenge</Text>
        <Text style={styles.apexText}>Whole course · {APEX.secondsPerQuestion} seconds a question · no second chances.</Text>
      </View>
      <Icon name="arrowRight" size={18} color="#FDC00A" />
    </PressableCard>
  );

  const activity = <ActivityFeed events={events} quizzes={quizzes} now={now} />;

  return (
    <Screen width="wide">
      <View style={styles.header}>
        <View style={styles.brand}>
          <LogoMark height={desktop ? 30 : 26} />
          <Text style={styles.wordmark}>GRATEAPEX</Text>
        </View>
        <View style={styles.headerActions}>
          <NotificationBell />
          <IconButton icon="settings" label="Settings" onPress={() => router.push('/settings')} />
        </View>
      </View>

      <AnimatedContent>
        <Text style={styles.greeting} accessibilityRole="header">
          {greeting}, {name}
        </Text>
        <Text style={styles.subline}>{subline}</Text>
      </AnimatedContent>

      {desktop ? (
        <Columns
          sideWidth={360}
          main={
            <View style={styles.column}>
              {position}
              {hero}
              {isLocalPreview() ? <QuestionOfTheDay /> : null}
              {calendar}
              {courseMastery}
              {activity}
            </View>
          }
          side={
            <View style={styles.column}>
              <Text style={styles.kicker}>TODAY</Text>
              {today}
              <RankProgressCard lifetimeXp={progress.xp} />
              {actions.length > 1 ? (
                <View style={styles.columnTight}>
                  <Text style={styles.kicker}>ALSO SUGGESTED</Text>
                  <NextActionList actions={actions.slice(1, 4)} />
                </View>
              ) : null}
              {social}
              {discovery}
              {apex}
            </View>
          }
        />
      ) : (
        <View style={styles.column}>
          {position}
          {hero}
          {today}
          {isLocalPreview() ? <QuestionOfTheDay /> : null}
          {calendar}
          {courseMastery}
          <RankProgressCard lifetimeXp={progress.xp} />
          {actions.length > 1 ? <NextActionList actions={actions.slice(1, 3)} /> : null}
          {social}
          {discovery}
          {apex}
          {activity}
        </View>
      )}

      <Text style={styles.motto}>Reach the Apex of GrAteness</Text>
    </Screen>
  );
}

function TodayStat({ icon, tint, value, label, hint }: { icon: IconName; tint: string; value: ReactNode; label: string; hint?: string }) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.todayStat}>
      <Icon name={icon} size={18} color={tint} filled={icon === 'xp' || icon === 'streak'} />
      {value}
      <Text style={styles.todayLabel}>{label}</Text>
      {hint ? <Text style={styles.todayHint}>{hint}</Text> : null}
    </View>
  );
}

function WeekStat({ value, label }: { value: number; label: string }) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.weekStat}>
      <AnimatedNumber value={value} style={styles.weekValue} />
      <Text style={styles.weekLabel}>{label}</Text>
    </View>
  );
}

function eventLine(event: LearningEvent): { icon: IconName; text: string } | null {
  const topic = getTopic(event.topicId)?.title;
  const data = event.data ?? {};
  switch (event.type) {
    case 'LESSON_COMPLETED':
      return { icon: 'check', text: `Completed a lesson${topic ? ` in ${topic}` : ''}` };
    case 'QUIZ_COMPLETED':
      return { icon: 'lesson', text: `Quiz ${typeof data.percentage === 'number' ? `${data.percentage}%` : 'completed'}${topic ? ` · ${topic}` : ''}` };
    case 'REVIEW_COMPLETED':
      return { icon: 'reinforce', text: `Review session ${typeof data.score === 'number' && typeof data.total === 'number' ? `${data.score}/${data.total}` : 'completed'}` };
    case 'TOPIC_COMPLETED':
      return { icon: 'achievement', text: `Finished the topic ${topic ?? ''}` };
    case 'CONCEPT_MASTERED':
      return { icon: 'mastery', text: 'Mastered a concept' };
    case 'APEX_CHALLENGE_COMPLETED':
      return { icon: 'challenge', text: `Apex Challenge ${typeof data.percentage === 'number' ? `${data.percentage}%` : 'run'}` };
    default:
      return null;
  }
}

function ActivityFeed({
  events,
  quizzes,
  now,
}: {
  events: readonly LearningEvent[];
  quizzes: readonly { id: string; percentage: number; completedAt: number; kind: string }[];
  now: number;
}) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const lines = events
    .map((event) => ({ event, line: eventLine(event) }))
    .filter((item): item is { event: LearningEvent; line: { icon: IconName; text: string } } => item.line !== null)
    .slice(0, 6)
    .map((item) => ({ key: item.event.id, at: item.event.at, ...item.line, refId: item.event.refId, type: item.event.type }));

  // Before the event log existed: fall back to saved quiz attempts.
  const fallback =
    lines.length === 0
      ? quizzes.slice(0, 5).map((attempt) => ({
          key: attempt.id,
          at: attempt.completedAt,
          icon: (attempt.kind === 'apex' ? 'challenge' : 'lesson') as IconName,
          text: `${attempt.kind === 'apex' ? 'Apex Challenge' : 'Quiz'} ${attempt.percentage}%`,
          refId: attempt.id,
          type: 'QUIZ_COMPLETED',
        }))
      : lines;

  return (
    <Card style={styles.card}>
      <SectionHeader
        title="Recent activity"
        style={styles.noMargin}
        right={<Button label="My Progress" variant="ghost" size="sm" trailing="›" onPress={() => router.push(routes.progress())} />}
      />
      {fallback.length === 0 ? (
        <Text style={styles.muted}>Your learning history will appear here as you study.</Text>
      ) : (
        fallback.map((item) => {
          const opensResults = item.type === 'QUIZ_COMPLETED' || item.type === 'REVIEW_COMPLETED' || item.type === 'APEX_CHALLENGE_COMPLETED';
          return (
            <Interactive
              key={item.key}
              disabled={!opensResults || !item.refId}
              onPress={() => item.refId && router.push(routes.results(item.refId))}
              accessibilityRole={opensResults ? 'link' : 'text'}
              style={({ hovered }) => [styles.activityRow, hovered && styles.rowHover]}
            >
              <View style={styles.activityIcon}>
                <Icon name={item.icon} size={15} color={colors.primaryText} />
              </View>
              <Text style={styles.activityText} numberOfLines={1}>
                {item.text}
              </Text>
              <Text style={styles.activityTime}>{describeAgo(item.at, now)}</Text>
            </Interactive>
          );
        })
      )}
    </Card>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    flex: { flex: 1, minWidth: 0 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
    brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    wordmark: { fontSize: 15, fontWeight: '800', letterSpacing: 1.4, color: colors.logoLetters },
    headerActions: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    greeting: { ...Type.display, color: colors.text },
    subline: { ...Type.body, color: colors.textSecondary, marginTop: 6, marginBottom: 22 },
    column: { gap: 16 },
    columnTight: { gap: 10 },
    card: { gap: 12 },
    noMargin: { marginBottom: 0 },
    kicker: { ...Type.overline, color: colors.textTertiary },

    position: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
    positionKicker: { ...Type.overline, fontSize: 10, color: colors.textTertiary },
    positionTitle: { ...Type.headline, fontSize: 17, color: colors.text, marginTop: 3 },
    positionMeta: { ...Type.caption, color: colors.textSecondary, marginTop: 2 },
    ringText: { ...Type.numeral, fontSize: 11, color: colors.text },
    ringTextSmall: { ...Type.numeral, fontSize: 10, color: colors.textSecondary },

    todayCard: { flexDirection: 'row', alignItems: 'stretch', paddingVertical: 16, paddingHorizontal: 8 },
    todayStat: { flex: 1, minWidth: 0, alignItems: 'center', gap: 4, paddingHorizontal: 6 },
    todayDivider: { width: 1, backgroundColor: colors.divider, marginVertical: 4 },
    todayLabel: { fontSize: 11.5, fontWeight: '700', color: colors.textSecondary, textAlign: 'center' },
    todayHint: { fontSize: 10.5, color: colors.textTertiary, textAlign: 'center' },
    statNumber: { ...Type.numeral, fontSize: 22, color: colors.text },
    statOf: { fontSize: 14, color: colors.textTertiary, fontWeight: '700' },

    subjectRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8, paddingHorizontal: 6, borderRadius: 14 },
    rowHover: { backgroundColor: colors.surfaceMuted },
    subjectTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 6, marginBottom: 6 },
    subjectName: { ...Type.headline, color: colors.text },
    subjectMeta: { fontSize: 12, color: colors.textSecondary },
    miniDistribution: { marginTop: 5 },

    cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    cardTitle: { ...Type.headline, color: colors.text },
    weekRow: { flexDirection: 'row', gap: 8 },
    weekStat: { flex: 1, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, backgroundColor: colors.surfaceMuted },
    weekValue: { ...Type.numeral, fontSize: 20, color: colors.text },
    weekLabel: { fontSize: 11, fontWeight: '700', color: colors.textSecondary, marginTop: 1 },
    muted: { fontSize: 13, lineHeight: 19, color: colors.textSecondary },

    discoveryKicker: { ...Type.overline, fontSize: 10, color: colors.primaryText },
    discoveryTitle: { ...Type.title3, color: colors.text },

    apexCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      backgroundColor: colors.apexBackground,
      borderColor: 'rgba(253, 192, 10, 0.3)',
      ...webStyle({ backgroundImage: 'radial-gradient(120% 140% at 100% 0%, rgba(253,192,10,0.16), transparent 55%), linear-gradient(135deg, #0B1640 0%, #040A22 100%)' }),
    },
    apexBadge: { width: 38, height: 38, borderRadius: 12, backgroundColor: '#FDC00A', alignItems: 'center', justifyContent: 'center' },
    apexTitle: { ...Type.headline, fontWeight: '900', color: '#FFFFFF' },
    apexText: { fontSize: 12.5, lineHeight: 18, color: colors.apexMuted, marginTop: 2 },

    activityRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 7, paddingHorizontal: 6, borderRadius: 10 },
    activityIcon: { width: 28, height: 28, borderRadius: 9, backgroundColor: colors.surfaceMuted, alignItems: 'center', justifyContent: 'center' },
    activityText: { flex: 1, fontSize: 14, color: colors.text },
    activityTime: { fontSize: 12, color: colors.textTertiary },
    motto: { textAlign: 'center', ...Type.overline, letterSpacing: 1.6, color: colors.textTertiary, marginTop: 34 },
  });
}
