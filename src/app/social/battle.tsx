import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BackLink } from '@/components/learning/nav-bits';
import { Arena, Countdown } from '@/components/learning/apex-arena';
import { BattleIntro } from '@/components/social/battle-intro';
import { QuestionSession, type SessionProgress, type SessionResult } from '@/components/learning/question-session';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/interactive';
import { Pill } from '@/components/ui/pill';
import { Screen } from '@/components/ui/screen';
import { ErrorScreen, LoadingState } from '@/components/ui/state-views';
import { Text } from '@/components/ui/text';
import { setPendingXpReward } from '@/components/xp-toast';
import { Type, type ThemeColors } from '@/constants/theme';
import { acceptBattle, type Battle, type BattleLive, type BattleSide, BATTLE_SECONDS, BATTLE_WIN_XP, battleStatus, declineBattle, getBattle, reportBattleProgress, submitBattleResult, watchBattles } from '@/data/battles';
import { announceBattleResult } from '@/lib/web-push';
import { getTopicQuestions } from '@/data/curriculum';
import { bankQuestions, buildPractice, loadLegacyBank } from '@/data/legacy-study';
import { awardXp } from '@/data/progress';
import { isAnswerCorrect, type Question } from '@/data/questions';
import { useAuth } from '@/hooks/use-auth';
import { useThemedStyles } from '@/hooks/use-theme';
import { param } from '@/lib/routes';
import { friendlyError } from '@/lib/errors';

// /social/battle?id=… — play your side of a battle: the same questions as your
// opponent (same course and seed), 15 seconds each. Then the result, once
// both have played. The winner earns XP from the app; nothing is taken from
// the other player.

/** The other player, live: finished, part-way through, or not started. */
function opponentLine(name: string | null, done: BattleSide | null, progress: BattleLive | null, total: number) {
  const who = `@${name ?? 'opponent'}`;
  if (done) return `${who} finished: ${done.score}/${done.total}`;
  if (progress && progress.answered > 0) return `${who} is playing: ${progress.answered}/${total} answered · ${progress.correct} correct`;
  return `${who} hasn't started yet`;
}

function seededShuffle<T>(items: readonly T[], seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  const random = () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

async function battleQuestions(battle: Battle): Promise<Question[]> {
  if (battle.course.kind === 'hb') {
    const bank = await loadLegacyBank(battle.course.id);
    const selected = new Set(battle.course.topicIds ?? []);
    const source = bankQuestions(bank).filter((question) => !selected.size || selected.has(question.tp?.trim() || question.t?.trim() || 'general'));
    return buildPractice(source, { course: battle.course.id }, battle.count, battle.seed);
  }
  const selected = new Set(battle.course.topicIds ?? []);
  const pool = getTopicQuestions(battle.course.id).filter((question) => question.usage !== 'learn' && (!selected.size || selected.has(question.lessonId ?? '')));
  return seededShuffle(pool, battle.seed).slice(0, battle.count);
}

export default function BattleScreen() {
  const styles = useThemedStyles(createStyles);
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = param(params.id);
  const { user } = useAuth();
  const uid = user?.uid ?? '';
  const [battle, setBattle] = useState<Battle | null>(null);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [reward, setReward] = useState(0);
  // The intro (you vs them in the arena), then 3 · 2 · 1, then the questions.
  const [phase, setPhase] = useState<'intro' | 'countdown' | 'play'>('intro');
  const [count, setCount] = useState(3);
  useEffect(() => {
    if (phase !== 'countdown') return;
    const timer = setTimeout(() => {
      if (count <= 1) setPhase('play');
      else setCount(count - 1);
    }, 800);
    return () => clearTimeout(timer);
  }, [phase, count]);

  useEffect(() => {
    if (!id || !uid) return;
    let live = true;
    getBattle(id)
      .then(async (found) => {
        if (!live) return;
        if (!found) throw new Error('This battle could not be found.');
        setBattle(found);
        setQuestions(await battleQuestions(found));
      })
      .catch((problem) => { if (live) setError(friendlyError(problem, 'The battle could not be loaded.')); });
    return () => { live = false; };
  }, [id, uid]);

  // Follows the opponent live only while this page is on screen (it stays open in the background once visited).
  useFocusEffect(useCallback(() => {
    if (!id || !uid) return;
    let live = true;
    const stop = watchBattles(uid, (battles) => {
      const found = battles.find((battle) => battle.id === id);
      if (found && live) setBattle(found);
    }, (problem) => { if (live) setError(friendlyError(problem, 'The battle could not be loaded.')); });
    return () => { live = false; stop(); };
  }, [id, uid]));

  useEffect(() => {
    if (!battle || !uid || battleStatus(battle, uid) !== 'won') return;
    let live = true;
    void awardXp({ sourceType: 'quiz', sourceId: `battle:${battle.id}`, amount: BATTLE_WIN_XP, label: `Battle won · ${battle.course.name}` })
      .then((xp) => {
        if (!live || xp <= 0) return;
        setPendingXpReward({ amount: xp, message: `Battle won · ${battle.course.name}` });
        setReward(xp);
      })
      .catch(() => undefined);
    return () => { live = false; };
  }, [battle, uid]);

  const items = useMemo(() => (questions ?? []).map((question) => ({ question })), [questions]);

  // My progress goes to my own document as I answer, so the other player sees it live.
  const sentAnswered = useRef(-1);
  const progressed = useCallback((progress: SessionProgress) => {
    if (!battle || !questions) return;
    const answered = new Set([...progress.checked, ...progress.timedOut]).size;
    if (answered === sentAnswered.current) return;
    sentAnswered.current = answered;
    const correct = questions.filter((question) => progress.checked.includes(question.id) && isAnswerCorrect(question, progress.answers[question.id])).length;
    void reportBattleProgress(battle, { answered, correct }).catch(() => undefined);
  }, [battle, questions]);

  if (!id) return <ErrorScreen title="No battle chosen" message="Open a battle from Connect." primary={{ label: 'Back to Connect', onPress: () => router.replace('/social') }} />;
  if (error) return <ErrorScreen title="Battle unavailable" message={error} primary={{ label: 'Back to Connect', onPress: () => router.replace('/social') }} />;
  if (!battle || !questions) return <LoadingState label="Setting up the battle…" />;

  const status = battleStatus(battle, uid);
  const mine = battle.challengerId === uid ? battle.challenger : battle.opponent;
  const theirs = battle.challengerId === uid ? battle.opponent : battle.challenger;
  const otherName = battle.challengerId === uid ? battle.opponentName : battle.challengerName;
  const theirLive = battle.challengerId === uid ? battle.opponentLive : battle.challengerLive;
  const liveLine = opponentLine(otherName, theirs, theirLive, questions.length);

  async function acceptAndJoin() {
    try {
      await acceptBattle(battle!);
      const updated = await getBattle(battle!.id);
      if (updated) setBattle(updated);
    } catch (problem) {
      setError(friendlyError(problem, 'The battle could not be joined.'));
    }
  }

  async function rejectChallenge() {
    try {
      await declineBattle(battle!);
      void announceBattleResult(battle!.id, battle!.challengerId);
      router.replace('/social');
    } catch (problem) {
      setError(friendlyError(problem, 'The challenge could not be declined.'));
    }
  }

  async function submit(result: SessionResult) {
    const correct = questions!.filter((question) => isAnswerCorrect(question, result.answers[question.id])).length;
    const side = { score: correct, total: questions!.length, seconds: Math.round(result.timeSeconds) };
    await submitBattleResult(battle!, side);
    void announceBattleResult(battle!.id, battle!.challengerId === uid ? battle!.opponentId : battle!.challengerId); // tell the other player (best effort)
    const updated = await getBattle(battle!.id);
    if (updated) setBattle(updated);
    setDone(true);
  }

  if (done || (mine && status !== 'waiting-for-you')) {
    return (
      <Screen width="learning">
        <BackLink fallback={'/social' as never} />
        <Card style={styles.result}>
          <Text style={styles.resultTitle}>{battle.course.name}</Text>
          <View style={styles.scores}>
            <View style={styles.scoreBox}><Text style={styles.scoreLabel}>YOU</Text><Text style={styles.score}>{mine ? `${mine.score}/${mine.total}` : '—'}</Text><Text style={styles.muted}>{mine ? `${mine.seconds}s` : ''}</Text></View>
            <Text style={styles.vs}>vs</Text>
            <View style={styles.scoreBox}><Text style={styles.scoreLabel}>@{otherName ?? 'opponent'}</Text><Text style={styles.score}>{theirs ? `${theirs.score}/${theirs.total}` : theirLive?.answered ? `${theirLive.correct}/${theirLive.answered}` : '…'}</Text><Text style={styles.muted}>{theirs ? `${theirs.seconds}s` : theirLive?.answered ? `playing · ${theirLive.answered}/${questions.length}` : 'not played yet'}</Text></View>
          </View>
          <Pill
            label={status === 'won' ? 'You won' : status === 'lost' ? 'You lost' : status === 'draw' ? 'Draw' : status === 'declined' ? 'Declined' : 'Waiting for your opponent'}
            tone={status === 'won' ? 'success' : status === 'lost' ? 'error' : status === 'draw' ? 'gold' : 'neutral'}
          />
          {reward > 0 ? <Text style={styles.reward}>+{reward} XP</Text> : null}
          <Button label="Back to Connect" variant="secondary" onPress={() => router.replace('/social')} />
        </Card>
      </Screen>
    );
  }

  if (status === 'incoming-challenge') {
    return (
      <Screen width="learning">
        <BackLink fallback={'/social' as never} />
        <Card style={styles.lobby}>
          <Text style={styles.resultTitle}>Battle invitation</Text>
          <Text style={styles.muted}>@{otherName ?? 'your friend'} challenged you to {battle.course.name}{battle.course.topicNames?.length ? ` · ${battle.course.topicNames.join(', ')}` : ''}.</Text>
          <Text style={styles.muted}>Accept to join the shared room. You will both answer the same {questions.length} questions, wherever you are.</Text>
          <Button label="Accept & join room" variant="apex" onPress={() => { void acceptAndJoin(); }} />
          <Button label="Decline challenge" variant="secondary" onPress={() => { void rejectChallenge(); }} />
        </Card>
      </Screen>
    );
  }

  if (status === 'waiting-for-response') {
    return (
      <Screen width="learning">
        <BackLink fallback={'/social' as never} />
        <Card style={styles.lobby}>
          <Text style={styles.resultTitle}>Your battle room is ready</Text>
          <Text style={styles.muted}>Waiting for @{otherName ?? 'your friend'} to accept or decline {battle.course.name}. We’ll update this screen when they respond.</Text>
          <Button label="Back to Connect" variant="secondary" onPress={() => router.replace('/social')} />
        </Card>
      </Screen>
    );
  }

  if (phase === 'intro') {
    return (
      <BattleIntro
        course={battle.course.name}
        topics={battle.course.topicNames}
        me={{ uid, name: user?.profile?.username ?? 'You' }}
        opponent={{ uid: battle.challengerId === uid ? battle.opponentId : battle.challengerId, name: otherName ?? 'opponent' }}
        questions={questions.length}
        seconds={BATTLE_SECONDS}
        winXp={BATTLE_WIN_XP}
        onStart={() => { setCount(3); setPhase('countdown'); }}
      />
    );
  }
  if (phase === 'countdown') {
    return (
      <Arena intensity="high">
        <Countdown count={count} total={3} />
      </Arena>
    );
  }

  return (
    <Screen width="learning">
      <QuestionSession
        items={items}
        mode="instant"
        perQuestionSeconds={BATTLE_SECONDS}
        attemptMode="practice"
        sessionId={`battle:${battle.id}:${uid}`}
        seed={battle.seed}
        onProgress={progressed}
        onSubmit={submit}
        submitLabel="Finish the battle"
        reviewNote={null}
        header={
          <View style={styles.header}>
            <BackLink fallback={'/social' as never} />
            <Text style={styles.title}>Battle · {battle.course.name}</Text>
            <Text style={styles.muted}>Against @{otherName ?? 'opponent'} · {questions.length} questions · {BATTLE_SECONDS} seconds each</Text>
            <View style={styles.liveRow} accessibilityLiveRegion="polite">
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>{liveLine}</Text>
            </View>
          </View>
        }
      />
    </Screen>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    header: { gap: 4, marginBottom: 10 },
    liveRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6, alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999, backgroundColor: colors.primarySubtle },
    liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
    liveText: { fontSize: 13, fontWeight: '700', color: colors.primaryText },
    title: { ...Type.title2, color: colors.text },
    muted: { fontSize: 12.5, color: colors.textTertiary },
    result: { alignItems: 'center', gap: 14, padding: 26, marginTop: 10 },
    lobby: { alignItems: 'center', gap: 14, padding: 26, marginTop: 10 },
    resultTitle: { ...Type.title3, color: colors.text },
    scores: { flexDirection: 'row', alignItems: 'center', gap: 22 },
    scoreBox: { alignItems: 'center', gap: 2, minWidth: 110 },
    scoreLabel: { ...Type.overline, color: colors.textTertiary },
    score: { ...Type.display, color: colors.text },
    vs: { fontSize: 16, fontWeight: '800', color: colors.textTertiary },
    reward: { fontSize: 16, fontWeight: '800', color: colors.successText },
  });
}
