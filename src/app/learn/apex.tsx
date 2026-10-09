import { router, useLocalSearchParams } from 'expo-router';
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { ApexWordmark } from '@/components/motion/apex-wordmark';
import { QuestionCard } from '@/components/question-card';
import { useTabBarScroll } from '@/components/tab-bar-visibility';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Interactive } from '@/components/ui/interactive';
import { ProgressRing } from '@/components/ui/progress-ring';
import { isWeb, webStyle } from '@/components/ui/web';
import { XpToast, type XpReward } from '@/components/xp-toast';
import { SPRING } from '@/constants/motion';
import { Type } from '@/constants/theme';
import { courseCatalog, getCourseInfo, getCourseTopics, getTopicQuestions } from '@/data/curriculum';
import { logSessionStart, submitQuiz, type QuizOutcome } from '@/data/learning/actions';
import { APEX } from '@/data/learning/apex';
import { courseProgress } from '@/data/learning/progress-model';
import { selectQuestions, type SelectedQuestion } from '@/data/learning/selection';
import { currentMemoryModel } from '@/data/learning/state';
import { formatDuration, nowMs, secondsSince } from '@/data/learning/time';
import { useLearning } from '@/data/learning/use-learning';
import { formatXp } from '@/data/learning/xp-rules';
import { type Answer, isAnswerCorrect, isApexEligible } from '@/data/questions';
import { ensureQuestionHistoryLoaded } from '@/data/question-history';
import { getQuizHistory } from '@/data/quiz-history';
import { useTheme } from '@/hooks/use-theme';
import { param, routes } from '@/lib/routes';

type Phase = 'intro' | 'countdown' | 'run' | 'done';

function eligibleCount(courseId: string) {
  return getCourseTopics(courseId)
    .flatMap((topic) => getTopicQuestions(topic.id))
    .filter(isApexEligible).length;
}

// /learn/apex[?course=<course id>] — the Apex Challenge.
// Deliberately NOT styled like a lesson quiz: a dark, high-stakes arena.
export default function ApexRoute() {
  const { course } = useLocalSearchParams<{ course?: string | string[] }>();
  const requested = getCourseInfo(param(course));
  const available = courseCatalog.filter((item) => eligibleCount(item.id) >= APEX.minimumQuestions);
  const chosen = requested && eligibleCount(requested.id) >= APEX.minimumQuestions ? requested : available.length === 1 ? available[0] : undefined;
  return <ApexArena key={chosen?.id ?? 'pick'} courseId={chosen?.id} available={available.map((item) => item.id)} />;
}

function ApexArena({ courseId, available }: { courseId?: string; available: string[] }) {
  const colors = useTheme();
  const { inputs } = useLearning();
  const [phase, setPhase] = useState<Phase>('intro');
  const [items, setItems] = useState<SelectedQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [locked, setLocked] = useState(false);
  const [count, setCount] = useState<number>(APEX.countdownSeconds);
  const [outcome, setOutcome] = useState<QuizOutcome | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [xpReward, setXpReward] = useState<XpReward | null>(null);
  const responseMs = useRef<number[]>([]);
  const shownAt = useRef(0);
  const startedAt = useRef(0);
  const seed = useRef('');
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const advance = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeLeft = useSharedValue(1);

  const course = getCourseInfo(courseId);
  const progress = useMemo(() => (course ? courseProgress(course.id, inputs) : null), [course, inputs]);
  const pool = course ? eligibleCount(course.id) : 0;
  const runSize = Math.min(APEX.questionsPerRun, pool);
  const best = useMemo(
    () =>
      getQuizHistory()
        .filter((attempt) => attempt.kind === 'apex' && (attempt.courseId === courseId || attempt.topicId === courseId))
        .reduce((max, attempt) => Math.max(max, attempt.percentage), -1),
    [courseId]
  );

  useEffect(
    () => () => {
      if (timeout.current) clearTimeout(timeout.current);
      if (advance.current) clearTimeout(advance.current);
    },
    []
  );

  // Countdown 3-2-1, then the run starts.
  useEffect(() => {
    if (phase !== 'countdown') return;
    const timer = setTimeout(() => {
      if (count <= 1) {
        startedAt.current = nowMs();
        setLocked(false);
        setPhase('run');
      } else {
        setCount(count - 1);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [phase, count]);

  const current = items[index];

  // Each question: start its clock and its timeout.
  useEffect(() => {
    if (phase !== 'run' || !current) return;
    shownAt.current = nowMs();
    cancelAnimation(timeLeft);
    timeLeft.value = 1;
    timeLeft.value = withTiming(0, { duration: APEX.secondsPerQuestion * 1000, easing: Easing.linear });
    timeout.current = setTimeout(() => lockAndAdvance(undefined), APEX.secondsPerQuestion * 1000);
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
    // One clock per question.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, index]);

  const timerStyle = useAnimatedStyle(() => ({ width: `${timeLeft.value * 100}%` }));

  async function begin() {
    if (!course) return;
    setError(null);
    await ensureQuestionHistoryLoaded();
    const now = nowMs();
    seed.current = `apex:${course.id}:${now}`;
    const previous = getQuizHistory().find((attempt) => attempt.kind === 'apex' && attempt.courseId === course.id);
    const selected = selectQuestions(
      {
        scope: { kind: 'challenge', courseId: course.id },
        filters: { apexEligible: true },
        strategy: 'weighted',
        size: runSize,
        seed: seed.current,
        now,
        recentIds: previous?.questionIds,
        coverConcepts: true,
      },
      currentMemoryModel(now)
    );
    if (selected.length < APEX.minimumQuestions) {
      setError('This course does not have enough short questions for a fair Apex run yet.');
      return;
    }
    responseMs.current = [];
    setItems(selected);
    setAnswers({});
    setIndex(0);
    setCount(APEX.countdownSeconds);
    setOutcome(null);
    setPhase('countdown');
    logSessionStart('apex', { refId: course.id, data: { size: selected.length } });
  }

  function lockAndAdvance(answer: Answer | undefined) {
    if (!current || locked) return;
    if (timeout.current) clearTimeout(timeout.current);
    cancelAnimation(timeLeft);
    setLocked(true);
    if (answer !== undefined) {
      responseMs.current.push(nowMs() - shownAt.current);
      setAnswers((previous) => ({ ...previous, [current.question.id]: answer }));
    }
    advance.current = setTimeout(() => {
      if (index + 1 >= items.length) void finish(answer);
      else {
        setLocked(false);
        setIndex(index + 1);
      }
    }, APEX.revealMs);
  }

  async function finish(lastAnswer: Answer | undefined) {
    if (!course) return;
    setPhase('done');
    const finalAnswers = lastAnswer !== undefined && current ? { ...answers, [current.question.id]: lastAnswer } : answers;
    try {
      const result = await submitQuiz({
        kind: 'apex',
        mode: 'apex',
        sessionId: seed.current,
        courseId: course.id,
        questions: items.map((item) => item.question),
        answers: finalAnswers,
        recordedIds: new Set(),
        timeSeconds: secondsSince(startedAt.current),
        feedbackMode: 'timed',
      });
      setOutcome(result);
      if (result.xpApplied !== 0) {
        setXpReward({ amount: result.xpApplied, message: 'Apex Challenge complete!', lines: result.xp.lines });
      }
    } catch (problem) {
      console.warn('Could not save Apex run:', problem);
      setError('Your run finished but could not be saved. Your score is shown below.');
    }
  }

  // ── Course picker ──
  if (!course) {
    return (
      <Arena>
        <ApexWordmark size={64} />
        <Text style={[styles.lead, { color: colors.apexMuted }]}>Choose a course for your Apex run.</Text>
        {available.length === 0 ? (
          <Text style={[styles.body, { color: colors.apexMuted }]}>
            No course has enough published questions for a fair challenge yet.
          </Text>
        ) : (
          available.map((id) => {
            const info = getCourseInfo(id)!;
            return (
              <Interactive
                key={id}
                onPress={() => router.replace(routes.apex(id))}
                style={({ hovered }) => [styles.coursePick, hovered && styles.coursePickHover]}
              >
                <Text style={styles.coursePickTitle}>{info.title}</Text>
                <Text style={styles.coursePickMeta}>{eligibleCount(id)} challenge questions</Text>
              </Interactive>
            );
          })
        )}
        <Button label="Back to Study" variant="ghost" onPress={() => router.replace(routes.learn())} style={styles.ghost} />
      </Arena>
    );
  }

  const correctCount = items.filter((item) => isAnswerCorrect(item.question, answers[item.question.id])).length;
  const avgMs = responseMs.current.length ? responseMs.current.reduce((a, b) => a + b, 0) / responseMs.current.length : 0;
  let bestStreak = 0;
  let streak = 0;
  for (const item of items) {
    if (isAnswerCorrect(item.question, answers[item.question.id])) {
      streak += 1;
      bestStreak = Math.max(bestStreak, streak);
    } else streak = 0;
  }

  if (phase === 'intro') {
    return (
      <Arena>
        <Text style={styles.kicker}>APEX CHALLENGE · {course.title.toUpperCase()}</Text>
        <ApexWordmark size={76} />
        <Text style={[styles.lead, { color: colors.apexText }]}>The whole course. {APEX.secondsPerQuestion} seconds a question. No second chances.</Text>
        <View style={styles.rules}>
          <Rule text={`${runSize} questions drawn from every published topic in ${course.title}`} />
          <Rule text={`${APEX.secondsPerQuestion} seconds per question — time out and it counts as missed`} />
          <Rule text="No going back, no repeats within a run, answers lock instantly" />
          <Rule text="Separate from lesson quizzes: this is a mastery and endurance event" />
          {isWeb ? <Rule text="Keys 1–4 or A–D answer instantly" /> : null}
        </View>
        {progress && progress.lessonsCompleted === 0 ? (
          <Text style={styles.warning}>
            You haven&apos;t completed any lessons in this course yet. Direct entry is allowed — expect it to be brutal.
          </Text>
        ) : null}
        {best >= 0 ? <Text style={[styles.body, { color: colors.apexMuted }]}>Your best so far: {best}%</Text> : null}
        {error ? <Text style={styles.warning}>{error}</Text> : null}
        <View style={styles.actions}>
          <Button label="Enter the arena" variant="apex" size="lg" trailing="⚡" onPress={() => void begin()} />
          <Button label="Not now" variant="ghost" onPress={() => router.back()} style={styles.ghost} />
        </View>
      </Arena>
    );
  }

  if (phase === 'countdown') {
    return (
      <Arena intensity="high">
        <Countdown count={count} total={APEX.countdownSeconds} />
      </Arena>
    );
  }

  if (phase === 'run' && current) {
    return (
      <Arena scroll={false} intensity="low">
        <View style={styles.runHeader}>
          <Text style={styles.kicker}>
            {index + 1} / {items.length}
          </Text>
          <View style={styles.momentum} accessibilityLabel={`${correctCount} correct, streak ${streak}`}>
            <Icon name="check" size={14} color="#8BE39A" strokeWidth={2.6} />
            <Text style={styles.momentumText}>{correctCount}</Text>
            <View style={styles.momentumDivider} />
            <Icon name="streak" size={14} color={streak >= 3 ? '#FDC00A' : '#A9BCF0'} filled={streak >= 3} />
            <Text style={[styles.momentumText, streak >= 3 && styles.momentumHot]}>{streak >= 3 ? `Momentum ×${streak}` : `streak ${streak}`}</Text>
          </View>
        </View>
        <View style={styles.timerTrack} accessibilityLabel="Time left for this question">
          <Animated.View style={[styles.timerFill, timerStyle]} />
        </View>
        <View style={styles.cardWrap}>
          <QuestionCard
            key={current.question.id}
            question={current.question}
            value={answers[current.question.id]}
            onChange={(answer) => lockAndAdvance(answer)}
            revealed={locked}
            shuffleSeed={`${seed.current}:${current.question.id}`}
            keyboard={isWeb}
            compact
          />
        </View>
      </Arena>
    );
  }

  // ── Done ──
  const percentage = items.length ? Math.round((correctCount / items.length) * 100) : 0;
  return (
    <Arena>
      <Text style={styles.kicker}>RUN COMPLETE · {course.title.toUpperCase()}</Text>
      <Text style={styles.score}>{percentage}%</Text>
      <Text style={[styles.lead, { color: colors.apexText }]}>
        {correctCount} of {items.length} correct
      </Text>
      <View style={styles.statRow}>
        <Stat label="accuracy" value={`${percentage}%`} />
        <Stat label="avg answer" value={avgMs ? `${(avgMs / 1000).toFixed(1)}s` : '—'} />
        <Stat label="best streak" value={String(bestStreak)} />
        <Stat label="XP" value={outcome ? formatXp(outcome.xpApplied) : '…'} />
      </View>
      {outcome?.attempt ? (
        <Text style={[styles.body, { color: colors.apexMuted }]}>
          Time: {formatDuration(outcome.attempt.timeSeconds)} · timeouts are not counted against your memory record.
        </Text>
      ) : null}
      {error ? <Text style={styles.warning}>{error}</Text> : null}
      <View style={styles.actions}>
        <Button label="Run again" variant="apex" trailing="⚡" onPress={() => void begin()} />
        {outcome ? <Button label="See every answer" variant="secondary" onPress={() => router.push(routes.results(outcome.attempt.id))} /> : null}
        <Button label="Leave the arena" variant="ghost" onPress={() => router.replace(routes.learn())} style={styles.ghost} />
      </View>
      <XpToast reward={xpReward} onHide={() => setXpReward(null)} />
    </Arena>
  );
}

// The arena: a deep stage lit from above by gold rays, with a slow pulse
// behind the content. Deliberately unlike a lesson quiz. `intensity`
// dims the light while questions are on screen, so reading stays easy.
function Arena({ children, scroll = true, intensity = 'high' }: { children: ReactNode; scroll?: boolean; intensity?: 'high' | 'low' }) {
  const colors = useTheme();
  const tabBarScroll = useTabBarScroll();
  const inner = <View style={styles.inner}>{children}</View>;
  return (
    <View style={[styles.arena, { backgroundColor: colors.apexBackground }]}>
      <ArenaLight intensity={intensity} />
      {scroll ? <ScrollView {...tabBarScroll} contentContainerStyle={styles.scroll}>{inner}</ScrollView> : <View style={styles.scroll}>{inner}</View>}
    </View>
  );
}

function ArenaLight({ intensity }: { intensity: 'high' | 'low' }) {
  const reduceMotion = useReducedMotion();
  const pulse = useSharedValue(0);
  useEffect(() => {
    if (reduceMotion) return;
    pulse.value = withRepeat(withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [pulse, reduceMotion]);
  const ring = useAnimatedStyle(() => ({
    opacity: (intensity === 'high' ? 0.5 : 0.18) * (0.55 + pulse.value * 0.45),
    transform: [{ scale: 0.92 + pulse.value * 0.1 }],
  }));
  const strength = intensity === 'high' ? 1 : 0.45;
  return (
    <View style={[StyleSheet.absoluteFill, styles.noTouch]}>
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          <RadialGradient id="apexTop" cx="50%" cy="-10%" rx="70%" ry="60%" fx="50%" fy="-10%">
            <Stop offset="0" stopColor="#FDC00A" stopOpacity={0.22 * strength} />
            <Stop offset="1" stopColor="#FDC00A" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="apexBlue" cx="50%" cy="45%" rx="75%" ry="60%" fx="50%" fy="45%">
            <Stop offset="0" stopColor="#1C3FA8" stopOpacity={0.55 * strength} />
            <Stop offset="1" stopColor="#1C3FA8" stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="apexEdge" cx="50%" cy="50%" rx="85%" ry="75%" fx="50%" fy="50%">
            <Stop offset="0.55" stopColor="#000000" stopOpacity={0} />
            <Stop offset="1" stopColor="#000000" stopOpacity={0.6} />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#apexBlue)" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#apexTop)" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#apexEdge)" />
      </Svg>
      {isWeb ? <View style={[StyleSheet.absoluteFill, styles.rays, { opacity: strength }]} /> : null}
      <View style={styles.ringWrap}>
        <Animated.View style={[styles.ring, ring]} />
      </View>
    </View>
  );
}

// 3 · 2 · 1 · GO inside a ring that drains with each beat.
function Countdown({ count, total }: { count: number; total: number }) {
  const reduceMotion = useReducedMotion();
  const beat = useSharedValue(1);
  useEffect(() => {
    if (reduceMotion) return;
    beat.value = 1.18;
    beat.value = withSpring(1, SPRING.pop);
  }, [count, beat, reduceMotion]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: beat.value }] }));
  return (
    <View style={styles.countdownWrap}>
      <ProgressRing value={count > 0 ? count / total : 1} size={220} thickness={6} color="#FDC00A" trackColor="rgba(255,255,255,0.08)" label="Countdown">
        <Animated.Text style={[styles.countdown, style]} accessibilityLiveRegion="assertive">
          {count > 0 ? count : 'GO'}
        </Animated.Text>
      </ProgressRing>
      <Text style={styles.countdownHint}>Answer fast. Answers lock instantly.</Text>
    </View>
  );
}

function Rule({ text }: { text: string }) {
  const colors = useTheme();
  return (
    <View style={styles.rule}>
      <View style={styles.ruleIcon}>
        <Icon name="challenge" size={13} color="#0A1F5C" filled />
      </View>
      <Text style={[styles.ruleText, { color: colors.apexText }]}>{text}</Text>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  const colors = useTheme();
  return (
    <View style={[styles.stat, { backgroundColor: colors.apexSurface }]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.apexMuted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  arena: { flex: 1, overflow: 'hidden' },
  noTouch: { pointerEvents: 'none' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 20, paddingBottom: 110 },
  inner: { width: '100%', maxWidth: 760, alignSelf: 'center', alignItems: 'stretch', gap: 14 },
  rays: webStyle({
    backgroundImage:
      'conic-gradient(from 180deg at 50% -8%, transparent 0deg, rgba(253,192,10,0.10) 6deg, transparent 14deg, transparent 22deg, rgba(253,192,10,0.07) 28deg, transparent 36deg, transparent 324deg, rgba(253,192,10,0.07) 332deg, transparent 338deg, transparent 346deg, rgba(253,192,10,0.10) 354deg, transparent 360deg)',
    maskImage: 'linear-gradient(to bottom, #000 0%, transparent 70%)',
    WebkitMaskImage: 'linear-gradient(to bottom, #000 0%, transparent 70%)',
  }),
  ringWrap: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'center', justifyContent: 'center' },
  ring: {
    width: 420,
    height: 420,
    borderRadius: 210,
    borderWidth: 1.5,
    borderColor: 'rgba(253,192,10,0.45)',
    boxShadow: '0px 0px 60px rgba(253,192,10,0.18), inset 0px 0px 40px rgba(253,192,10,0.10)',
  },
  kicker: { ...Type.overline, letterSpacing: 1.6, color: '#FDC00A', textAlign: 'center' },
  lead: { fontSize: 18, fontWeight: '700', textAlign: 'center', lineHeight: 26 },
  body: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  rules: {
    gap: 10,
    marginVertical: 8,
    padding: 18,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(253,192,10,0.18)',
  },
  rule: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  ruleIcon: { width: 22, height: 22, borderRadius: 7, backgroundColor: '#FDC00A', alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  ruleText: { flex: 1, fontSize: 15, lineHeight: 22 },
  warning: { fontSize: 13, lineHeight: 19, color: '#FFC78A', textAlign: 'center' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 8 },
  ghost: { opacity: 0.9 },
  countdownWrap: { alignItems: 'center', gap: 22 },
  countdown: { ...Type.numeral, fontSize: 96, lineHeight: 110, color: '#FDC00A', textAlign: 'center' },
  countdownHint: { fontSize: 14, fontWeight: '700', color: '#A9BCF0', letterSpacing: 0.4 },
  runHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  momentum: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(253,192,10,0.2)',
  },
  momentumDivider: { width: 1, height: 14, backgroundColor: 'rgba(255,255,255,0.15)', marginHorizontal: 4 },
  momentumText: { fontSize: 12, fontWeight: '800', color: '#E3EBFD' },
  momentumHot: { color: '#FDC00A' },
  timerTrack: { height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.10)', overflow: 'hidden' },
  timerFill: { height: '100%', backgroundColor: '#FDC00A', borderRadius: 4, boxShadow: '0px 0px 14px rgba(253,192,10,0.7)' },
  cardWrap: { marginTop: 6 },
  score: { ...Type.numeral, fontSize: 88, lineHeight: 96, color: '#FDC00A', textAlign: 'center' },
  statRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  stat: {
    minWidth: 120,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(253,192,10,0.18)',
  },
  statValue: { ...Type.numeral, fontSize: 22, color: '#FFFFFF' },
  statLabel: { fontSize: 12, fontWeight: '700', marginTop: 2 },
  coursePick: {
    borderWidth: 1,
    borderColor: 'rgba(253,192,10,0.35)',
    borderRadius: 16,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  coursePickHover: { borderColor: '#FDC00A', backgroundColor: 'rgba(253,192,10,0.08)' },
  coursePickTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  coursePickMeta: { fontSize: 13, color: '#A9BCF0', marginTop: 2 },
});
