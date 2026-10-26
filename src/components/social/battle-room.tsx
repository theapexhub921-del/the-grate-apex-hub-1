import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { Arena, Countdown, Rule } from '@/components/learning/apex-arena';
import { PersonAvatar } from '@/components/social/profile-card';
import { Button } from '@/components/ui/button';
import { Interactive } from '@/components/ui/interactive';
import { Pill } from '@/components/ui/pill';
import { ProgressBar } from '@/components/ui/progress-bar';
import { LoadingState } from '@/components/ui/state-views';
import { Text } from '@/components/ui/text';
import { setPendingXpReward } from '@/components/xp-toast';
import { Type, type ThemeColors } from '@/constants/theme';
import { BATTLE_RULES, battleSummary, difficultyName, streakLine, tierName } from '@/data/battle-race-rules';
import {
  acceptRace, type AnswerResult, answerRace, createRace, declineRace, leaveRace, leaveRaceSoon, raceView, type RaceRoom, type RaceSide, readyRace, serverNow, watchRace,
} from '@/data/battle-rooms';
import { awardXp } from '@/data/progress';
import { useAuth } from '@/hooks/use-auth';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';
import { correctFeedback, wrongFeedback } from '@/lib/feedback';
import { friendlyError } from '@/lib/errors';
import { announceRace } from '@/lib/web-push';

// /social/battle?room=… — an XP battle (owner, 2026-10-26): a live room for two.
// Invite (5 minutes to accept) → lobby (both press Ready) → 3 · 2 · 1 → race through
// the same questions: a tap is marked by the server at once and the next question
// follows; right +5, wrong −1, skip 0 → results (most XP wins; level → first to
// finish everything), the answers, XP earned and a rematch.

const FEEDBACK_MS = 650;
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

/** Re-renders every `ms` while `on` (for countdowns). */
function useTicker(on: boolean, ms = 250) {
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!on) return;
    const timer = setInterval(() => setTick((tick) => tick + 1), ms);
    return () => clearInterval(timer);
  }, [on, ms]);
}

const clock = (ms: number) => {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
};

const at = (name: string | null | undefined, fallback = 'opponent') => `@${name || fallback}`;

export function BattleRoomScreen({ roomId }: { roomId: string }) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const { user } = useAuth();
  const uid = user?.uid ?? '';
  const [room, setRoom] = useState<RaceRoom | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  // One live listener on the room, only while this page is on screen.
  useFocusEffect(useCallback(() => {
    if (!uid) return;
    setError(null);
    return watchRace(roomId, (next) => setRoom((current) => newer(current, next)), (problem) => setError(friendlyError(problem, 'The battle could not be loaded.')));
  }, [roomId, uid]));

  const act = useCallback(async (name: string, run: () => Promise<RaceRoom | void>) => {
    setBusy(name);
    setError(null);
    try {
      const next = await run();
      if (next) setRoom((current) => newer(current, next));
    } catch (problem) {
      setError(friendlyError(problem, 'That did not work. Try again.'));
    } finally {
      setBusy(null);
    }
  }, []);

  if (!uid) return <LoadingState label="Signing in…" />;
  if (!room) {
    return (
      <Arena>
        {error ? (
          <View style={styles.center}>
            <Text style={styles.title}>Battle unavailable</Text>
            <Text style={styles.muted}>{error}</Text>
            <Button label="Back to Connect" variant="apex" onPress={() => router.replace('/social')} />
          </View>
        ) : <Text style={styles.muted}>Opening the battle room…</Text>}
      </Arena>
    );
  }
  if (!room.players.includes(uid)) {
    return (
      <Arena>
        <View style={styles.center}>
          <Text style={styles.title}>This battle is not yours</Text>
          <Button label="Back to Connect" variant="apex" onPress={() => router.replace('/social')} />
        </View>
      </Arena>
    );
  }

  const apply = (next: RaceRoom) => setRoom((current) => newer(current, next));
  const shared = { room, uid, busy, error, act, apply, styles, colors };
  if (room.status === 'invited') return <Invite {...shared} />;
  if (room.status === 'lobby') return <Lobby {...shared} />;
  if (room.status === 'live') return <Live {...shared} />;
  if (room.status === 'done') return <Results {...shared} />;
  return <Closed {...shared} />;
}

/** The listener and the server's replies can arrive in any order: keep the one further along. */
function newer(current: RaceRoom | null, next: RaceRoom) {
  if (!current || current.id !== next.id) return next;
  const order = ['invited', 'lobby', 'live', 'done'];
  const rank = (room: RaceRoom) => (order.includes(room.status) ? order.indexOf(room.status) : 9);
  if (rank(next) < rank(current) && rank(current) !== 9) return current;
  const progress = (room: RaceRoom) => room.players.reduce((sum, player) => sum + (room.sides[player]?.pos ?? 0) + (room.sides[player]?.finishedAt ? 1 : 0), 0)
    + Object.values(room.ready ?? {}).filter(Boolean).length + (room.rematch ? 1 : 0);
  return rank(next) === rank(current) && progress(next) < progress(current) ? current : next;
}

type Shared = {
  room: RaceRoom;
  uid: string;
  busy: string | null;
  error: string | null;
  act: (name: string, run: () => Promise<RaceRoom | void>) => Promise<void>;
  /** A room the server just sent back (newer than the listener's, often). */
  apply: (room: RaceRoom) => void;
  styles: ReturnType<typeof createStyles>;
  colors: ThemeColors;
};

function Versus({ room, uid, styles, ready }: Pick<Shared, 'room' | 'uid' | 'styles'> & { ready?: boolean }) {
  const { me, them } = raceView(room, uid);
  const person = (player: typeof me, label: string) => (
    <View style={styles.side}>
      <PersonAvatar uid={player.uid} name={player.name ?? label} size={76} ring="gold" />
      <Text style={styles.name} numberOfLines={1}>{label}</Text>
      {room.tiers?.[player.uid] ? <Text style={styles.tier}>{tierName(room.tiers[player.uid])} tier</Text> : null}
      {ready ? <Pill label={room.ready?.[player.uid] ? 'Ready' : 'Not ready'} tone={room.ready?.[player.uid] ? 'success' : 'neutral'} /> : null}
    </View>
  );
  return (
    <View style={styles.versus}>
      {person(me, 'You')}
      <Text style={styles.vs}>VS</Text>
      {person(them, at(them.name))}
    </View>
  );
}

function RulesList({ room, styles }: Pick<Shared, 'room' | 'styles'>) {
  return (
    <View style={styles.rules}>
      <Rule text={`${room.count} questions · ${difficultyName(room.difficulty)} · ${room.course.name}${room.course.topicNames?.length ? ` (${room.course.topicNames.slice(0, 4).join(', ')}${room.course.topicNames.length > 4 ? '…' : ''})` : ''}`} />
      <Rule text={`Right +${BATTLE_RULES.right} XP · wrong ${BATTLE_RULES.wrong} XP · skip 0. No clock per question: answers are marked at once and the next one follows`} />
      <Rule text="Most XP wins. Level on XP? The one who answered everything first wins" />
      <Rule text={`Leaving the room, or ${BATTLE_RULES.idleSeconds} seconds without answering, finishes you where you are`} />
      <Rule text={`Keep the XP you earn; the winner gets +${BATTLE_RULES.winBonus}. Nothing is taken from anyone`} />
      {room.note ? <Rule text={room.note} /> : null}
    </View>
  );
}

function Invite({ room, uid, busy, error, act, styles }: Shared) {
  useTicker(true, 500);
  const { them, iAmChallenger } = raceView(room, uid);
  const left = room.expiresAt - serverNow();
  return (
    <Arena>
      <Text style={styles.kicker}>{iAmChallenger ? 'CHALLENGE SENT' : 'YOU HAVE BEEN CHALLENGED'} · {room.course.name.toUpperCase()}</Text>
      <Versus room={room} uid={uid} styles={styles} />
      <Text style={styles.lead}>{iAmChallenger ? `Waiting for ${at(them.name)} to accept.` : `${at(them.name)} wants to battle you.`}</Text>
      <Text style={styles.timer} accessibilityLiveRegion="polite">{left > 0 ? `Expires in ${clock(left)}` : 'Expiring…'}</Text>
      <RulesList room={room} styles={styles} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.actions}>
        {iAmChallenger ? (
          <Button label="Withdraw challenge" variant="ghost" loading={busy === 'decline'} onPress={() => void act('decline', () => declineRace(room.id))} />
        ) : (
          <>
            <Button label="Accept & join room" variant="apex" size="lg" loading={busy === 'accept'} onPress={() => void act('accept', async () => {
              const next = await acceptRace(room.id);
              void announceRace('race-accepted', room.id, them.uid);
              return next;
            })} />
            <Button label="Decline" variant="ghost" loading={busy === 'decline'} onPress={() => void act('decline', () => declineRace(room.id))} />
          </>
        )}
      </View>
    </Arena>
  );
}

function Lobby({ room, uid, busy, error, act, styles }: Shared) {
  useTicker(true, 1000);
  const iAmReady = room.ready?.[uid] === true;
  const { them } = raceView(room, uid);
  return (
    <Arena>
      <Text style={styles.kicker}>BATTLE ROOM · {room.course.name.toUpperCase()}</Text>
      <Versus room={room} uid={uid} styles={styles} ready />
      <Text style={styles.lead}>{iAmReady ? `Waiting for ${at(them.name)} to press Ready.` : 'Press Ready when you are set. You start together.'}</Text>
      <RulesList room={room} styles={styles} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.actions}>
        {!iAmReady ? <Button label="I'm ready" variant="apex" size="lg" trailing="⚔" loading={busy === 'ready'} onPress={() => void act('ready', () => readyRace(room.id))} /> : null}
        <Button label="Leave room" variant="ghost" loading={busy === 'leave'} onPress={() => void act('leave', async () => {
          await leaveRace(room.id);
          router.replace('/social');
        })} />
      </View>
    </Arena>
  );
}

function Live(props: Shared) {
  const { room, uid } = props;
  const before = serverNow() < room.startAt;
  useTicker(before, 100);
  const { mine } = raceView(room, uid);
  const mountedAt = useRef(Date.now());

  // Leaving the page mid-battle finishes you where you are (owner's rule). Going to
  // another app is covered by the server: 90 seconds without an answer finishes you too.
  const finished = Boolean(mine?.finishedAt);
  const playing = useRef(false);
  playing.current = !finished;
  useFocusEffect(useCallback(() => {
    const leaveOnClose = () => leaveRaceSoon(room.id);
    if (Platform.OS === 'web' && typeof window !== 'undefined') window.addEventListener('pagehide', leaveOnClose);
    return () => {
      if (Platform.OS === 'web' && typeof window !== 'undefined') window.removeEventListener('pagehide', leaveOnClose);
      if (playing.current && Date.now() - mountedAt.current > 1500) leaveRaceSoon(room.id);
    };
  }, [room.id]));

  if (before) {
    const left = room.startAt - serverNow();
    return (
      <Arena intensity="high">
        <Countdown count={Math.min(3, Math.max(1, Math.ceil(left / 1000)))} total={3} />
      </Arena>
    );
  }
  if (finished) return <Waiting room={props.room} uid={props.uid} styles={props.styles} />;
  return <Play {...props} />;
}

function RaceBar({ room, uid, styles }: Pick<Shared, 'room' | 'uid' | 'styles'>) {
  const colors = useTheme();
  const { them, mine, theirs } = raceView(room, uid);
  const row = (label: string, side: RaceSide | undefined, mineRow: boolean) => (
    <View style={styles.raceRow}>
      <Text style={styles.raceName} numberOfLines={1}>{label}</Text>
      <ProgressBar value={(side?.pos ?? 0) / room.count} height={10} color={mineRow ? colors.apexGlow : colors.apexMuted} style={styles.raceTrack} label={`${label}: ${side?.pos ?? 0} of ${room.count}`} />
      <Text style={styles.raceScore}>{side?.score ?? 0} XP</Text>
      <Text style={styles.raceCount}>{side?.finishedAt ? (side.left ? 'left' : 'done') : `${side?.pos ?? 0}/${room.count}`}</Text>
    </View>
  );
  return (
    <View style={styles.raceBar} accessibilityLiveRegion="polite">
      {row('You', mine, true)}
      {row(at(them.name), theirs, false)}
    </View>
  );
}

type Feedback = { index: number; pick: number | 'skip'; result: AnswerResult | null };

function Play({ room, uid, act, apply, styles }: Shared) {
  const { mine } = raceView(room, uid);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [problem, setProblem] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const index = feedback?.index ?? mine.pos;
  const question = room.questions[index];

  const pick = useCallback(async (choice: number | 'skip') => {
    if (feedback || !question) return;
    setProblem(null);
    setFeedback({ index, pick: choice, result: null });
    try {
      const { result, room: marked } = await answerRace(room.id, index, choice);
      if (choice !== 'skip') (result.right ? correctFeedback : wrongFeedback)();
      setFeedback({ index, pick: choice, result });
      timer.current = setTimeout(() => {
        apply(marked);
        setFeedback(null);
      }, choice === 'skip' ? 250 : FEEDBACK_MS);
    } catch (failure) {
      setFeedback(null);
      setProblem(friendlyError(failure, 'That answer did not reach the server. Try again.'));
    }
  }, [feedback, question, index, room.id, apply]);

  // Keyboard on a computer: 1–4 or A–D to answer, S to skip.
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || !question) return;
      const key = event.key.toLowerCase();
      if (key === 's') return void pick('skip');
      const number = /^[1-6]$/.test(key) ? Number(key) - 1 : LETTERS.map((letter) => letter.toLowerCase()).indexOf(key);
      if (number >= 0 && number < question.options.length) {
        event.preventDefault();
        void pick(number);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pick, question]);

  if (!question) return <Waiting room={room} uid={uid} styles={styles} />;
  const streak = streakLine(feedback?.result?.streak ?? mine.streak);

  return (
    <Arena intensity="low">
      <RaceBar room={room} uid={uid} styles={styles} />
      <View style={styles.questionHead}>
        <Text style={styles.kicker}>QUESTION {index + 1} OF {room.count}{question.level ? ` · ${difficultyName(question.level).toUpperCase()}` : ''}</Text>
        {streak ? <Text style={styles.streak}>{streak}</Text> : null}
      </View>
      <View style={styles.questionCard}>
        <Text style={styles.prompt}>{question.prompt}</Text>
        <View style={styles.options}>
          {question.options.map((option, i) => {
            const chosen = feedback?.pick === i;
            const result = feedback?.result;
            const isCorrect = result && result.correct === i;
            const tone = result ? (isCorrect ? styles.optionRight : chosen ? styles.optionWrong : styles.optionDim) : chosen ? styles.optionChosen : null;
            return (
              <Interactive
                key={`${index}:${i}`}
                onPress={() => void pick(i)}
                disabled={Boolean(feedback)}
                dimDisabled={false}
                accessibilityLabel={`${LETTERS[i]}: ${option}`}
                style={[styles.option, tone]}
              >
                <View style={styles.letter}><Text style={styles.letterText}>{LETTERS[i]}</Text></View>
                <Text style={styles.optionText}>{option}</Text>
                {result && isCorrect ? <Text style={styles.mark}>+{BATTLE_RULES.right}</Text> : result && chosen && !result.right ? <Text style={styles.markWrong}>{BATTLE_RULES.wrong}</Text> : null}
              </Interactive>
            );
          })}
        </View>
      </View>
      {problem ? <Text style={styles.error}>{problem}</Text> : null}
      <View style={styles.playActions}>
        <Button label="Skip (0 XP)" variant="secondary" disabled={Boolean(feedback)} onPress={() => void pick('skip')} />
        {leaving ? (
          <>
            <Text style={styles.muted}>Leave? You finish with {mine.score} XP.</Text>
            <Button label="Leave battle" variant="danger" size="sm" onPress={() => void act('leave', async () => {
              await leaveRace(room.id);
            })} />
            <Button label="Keep playing" variant="ghost" size="sm" onPress={() => setLeaving(false)} />
          </>
        ) : <Button label="Leave" variant="ghost" size="sm" onPress={() => setLeaving(true)} />}
      </View>
      {Platform.OS === 'web' ? <Text style={styles.hint}>Keys: 1–{question.options.length} or A–{LETTERS[question.options.length - 1]} to answer · S to skip</Text> : null}
    </Arena>
  );
}

function Waiting({ room, uid, styles }: Pick<Shared, 'room' | 'uid' | 'styles'>) {
  useTicker(true, 1000);
  const { them, mine, theirs } = raceView(room, uid);
  const quiet = theirs && !theirs.finishedAt ? Math.round((serverNow() - Math.max(theirs.lastAt, room.startAt)) / 1000) : 0;
  return (
    <Arena intensity="low">
      <Text style={styles.kicker}>{mine.left ? 'YOU LEFT THE BATTLE' : 'YOU FINISHED'}</Text>
      <Text style={styles.big}>{mine.score} XP</Text>
      <Text style={styles.lead}>{`Waiting for ${at(them.name)} to finish. If they score more, they win.`}</Text>
      <RaceBar room={room} uid={uid} styles={styles} />
      {quiet > 30 ? <Text style={styles.muted}>{at(them.name)} has not answered for {quiet} seconds. After {BATTLE_RULES.idleSeconds} they finish where they are.</Text> : null}
    </Arena>
  );
}

function Results({ room, uid, busy, error, act, styles }: Shared) {
  const { me, them, mine, theirs, result } = raceView(room, uid);
  const [reward, setReward] = useState(0);
  const earned = room.xp?.[uid] ?? 0;
  const [review, setReview] = useState(false);

  // The XP the server worked out, added to my progress once (the same battle never pays twice).
  useEffect(() => {
    let live = true;
    void awardXp({ sourceType: 'quiz', sourceId: `battle-room:${room.id}`, amount: earned, label: `XP battle · ${room.course.name}` })
      .then((xp) => {
        if (!live || xp <= 0) return;
        setPendingXpReward({ amount: xp, message: result === 'win' ? `Battle won · ${room.course.name}` : `XP battle · ${room.course.name}` });
        setReward(xp);
      })
      .catch(() => undefined);
    // The other player left: tell them how it ended (best effort, once).
    if (theirs?.left) void announceRace('race-result', room.id, them.uid);
    return () => { live = false; };
  }, [room.id, earned, result, room.course.name, theirs?.left, them.uid]);

  const minePace = battleSummary(mine, room.startAt);
  const theirPace = battleSummary(theirs, room.startAt);
  const headline = result === 'win' ? 'You won' : result === 'draw' ? 'Draw' : `${at(them.name)} won`;
  const why = room.winner === 'draw'
    ? 'Level on XP and nobody finished first.'
    : mine.score === theirs.score
      ? `Level on XP: ${result === 'win' ? 'you' : at(them.name)} answered everything first.`
      : `${Math.abs(mine.score - theirs.score)} XP between you.`;

  async function rematch() {
    await act('rematch', async () => {
      const next = await createRace({
        opponent: { uid: them.uid, name: them.name },
        course: room.course,
        count: room.count,
        difficulty: room.difficulty,
        rematchOf: room.id,
      });
      void announceRace('race', next.id, them.uid);
      router.replace({ pathname: '/social/battle', params: { room: next.id } } as never);
    });
  }

  const stat = (label: string, a: string | number, b: string | number) => (
    <View style={styles.statRow} key={label}>
      <Text style={styles.statMine}>{a}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statTheirs}>{b}</Text>
    </View>
  );

  return (
    <Arena intensity={result === 'win' ? 'high' : 'low'}>
      <Text style={styles.kicker}>BATTLE OVER · {room.course.name.toUpperCase()} · {room.count} · {difficultyName(room.difficulty).toUpperCase()}</Text>
      <Text style={[styles.big, result === 'win' ? styles.goldText : null]}>{headline}</Text>
      <Text style={styles.lead}>{why}</Text>
      <View style={styles.scoreLine}>
        <View style={styles.scoreSide}>
          <PersonAvatar uid={me.uid} name={me.name ?? 'You'} size={56} ring={result === 'win' ? 'gold' : undefined} />
          <Text style={styles.scoreBig}>{mine.score}</Text>
          <Text style={styles.muted}>You{mine.left ? ' · left' : ''}</Text>
        </View>
        <Text style={styles.vsSmall}>–</Text>
        <View style={styles.scoreSide}>
          <PersonAvatar uid={them.uid} name={them.name ?? 'opponent'} size={56} ring={result === 'loss' ? 'gold' : undefined} />
          <Text style={styles.scoreBig}>{theirs.score}</Text>
          <Text style={styles.muted}>{at(them.name)}{theirs.left ? ' · left' : ''}</Text>
        </View>
      </View>
      <View style={styles.stats}>
        {stat('Right', mine.right, theirs.right)}
        {stat('Wrong', mine.wrong, theirs.wrong)}
        {stat('Skipped', mine.skipped, theirs.skipped)}
        {stat('Accuracy', `${minePace.accuracy}%`, `${theirPace.accuracy}%`)}
        {stat('Best run', mine.best, theirs.best)}
        {stat('Time', `${minePace.seconds}s`, `${theirPace.seconds}s`)}
        {stat('Per question', `${minePace.perQuestion}s`, `${theirPace.perQuestion}s`)}
      </View>
      <Text style={styles.reward}>{reward > 0 ? `+${reward} XP added to your progress` : earned > 0 ? `+${earned} XP` : 'No XP this time: wrong answers cancelled out the right ones.'}{result === 'win' ? ` (includes the +${BATTLE_RULES.winBonus} win bonus)` : ''}</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.actions}>
        {room.rematch ? (
          <Button label="Join the rematch" variant="apex" size="lg" onPress={() => router.replace({ pathname: '/social/battle', params: { room: room.rematch! } } as never)} />
        ) : (
          <Button label="Rematch" variant="apex" size="lg" trailing="⚔" loading={busy === 'rematch'} onPress={() => void rematch()} />
        )}
        <Button label={review ? 'Hide answers' : 'See the answers'} variant="secondary" onPress={() => setReview((open) => !open)} />
        <Button label="Back to Connect" variant="ghost" onPress={() => router.replace('/social')} />
      </View>
      {review ? (
        <View style={styles.review}>
          {room.questions.map((question, i) => {
            const mark = mine.marks[i];
            const answer = room.answers?.[i];
            return (
              <View key={question.id} style={styles.reviewItem}>
                <Text style={[styles.reviewMark, mark === 'r' ? styles.rightText : mark === 'w' ? styles.wrongText : null]}>{mark === 'r' ? `+${BATTLE_RULES.right}` : mark === 'w' ? `${BATTLE_RULES.wrong}` : mark === 's' ? 'skip' : '—'}</Text>
                <View style={styles.flex}>
                  <Text style={styles.reviewPrompt}>{i + 1}. {question.prompt}</Text>
                  {answer !== undefined && answer !== null ? <Text style={styles.reviewAnswer}>Answer: {question.options[answer]}</Text> : null}
                </View>
              </View>
            );
          })}
        </View>
      ) : null}
    </Arena>
  );
}

function Closed({ room, uid, busy, error, act, styles }: Shared) {
  const { them, iAmChallenger } = raceView(room, uid);
  const message = room.status === 'expired'
    ? `The challenge expired: it has to be accepted within ${BATTLE_RULES.inviteMinutes} minutes, and the room started within 5.`
    : room.status === 'declined'
      ? (iAmChallenger ? `${at(them.name)} declined this battle.` : 'You declined this battle.')
      : 'This battle was cancelled.';
  return (
    <Arena intensity="low">
      <View style={styles.center}>
        <Text style={styles.title}>{room.status === 'expired' ? 'Challenge expired' : room.status === 'declined' ? 'Declined' : 'Cancelled'}</Text>
        <Text style={styles.muted}>{message}</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.actions}>
          <Button label="Challenge again" variant="apex" loading={busy === 'again'} onPress={() => void act('again', async () => {
            const next = await createRace({ opponent: { uid: them.uid, name: them.name }, course: room.course, count: room.count, difficulty: room.difficulty });
            void announceRace('race', next.id, them.uid);
            router.replace({ pathname: '/social/battle', params: { room: next.id } } as never);
          })} />
          <Button label="Back to Connect" variant="ghost" onPress={() => router.replace('/social')} />
        </View>
      </View>
    </Arena>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    flex: { flex: 1, minWidth: 0 },
    center: { alignItems: 'center', gap: 14 },
    kicker: { ...Type.overline, letterSpacing: 1.4, color: colors.apexGlow, textAlign: 'center' },
    title: { ...Type.title2, color: colors.apexText, textAlign: 'center' },
    lead: { fontSize: 17, fontWeight: '700', textAlign: 'center', lineHeight: 25, color: colors.apexText },
    muted: { fontSize: 13.5, color: colors.apexMuted, textAlign: 'center', lineHeight: 20 },
    hint: { fontSize: 12, color: colors.apexMuted, textAlign: 'center', opacity: 0.8 },
    error: { fontSize: 14, color: colors.error, textAlign: 'center', fontWeight: '700' },
    timer: { ...Type.title3, color: colors.apexGlow, textAlign: 'center' },
    versus: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 22, marginVertical: 8 },
    side: { alignItems: 'center', gap: 8, width: 130 },
    name: { fontSize: 15, fontWeight: '800', textAlign: 'center', color: colors.apexText },
    tier: { fontSize: 12, fontWeight: '700', color: colors.apexGlow },
    vs: { ...Type.numeral, fontSize: 48, lineHeight: 56, color: colors.apexGlow },
    vsSmall: { ...Type.numeral, fontSize: 36, color: colors.apexMuted },
    rules: { gap: 10, padding: 16, borderRadius: 18, backgroundColor: colors.apexSurface, borderWidth: 1, borderColor: colors.apexGlow + '33' },
    actions: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 6 },
    raceBar: { gap: 8, padding: 12, borderRadius: 16, backgroundColor: colors.apexSurface },
    raceRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    raceName: { width: 92, fontSize: 13, fontWeight: '800', color: colors.apexText },
    raceTrack: { flex: 1, backgroundColor: colors.apexBackground },
    raceScore: { width: 58, textAlign: 'right', fontSize: 14, fontWeight: '800', color: colors.apexText },
    raceCount: { width: 44, textAlign: 'right', fontSize: 12, color: colors.apexMuted },
    goldText: { color: colors.apexGlow },
    questionHead: { alignItems: 'center', gap: 4 },
    streak: { fontSize: 14, fontWeight: '800', color: colors.apexGlow },
    questionCard: { gap: 14, padding: 18, borderRadius: 20, backgroundColor: colors.apexSurface, borderWidth: 1, borderColor: colors.apexGlow + '22' },
    prompt: { fontSize: 18, fontWeight: '700', lineHeight: 26, color: colors.apexText },
    options: { gap: 10 },
    option: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 52, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 14, borderWidth: 1.5, borderColor: colors.apexMuted + '44', backgroundColor: colors.apexBackground },
    optionChosen: { borderColor: colors.apexGlow },
    optionRight: { borderColor: colors.success, backgroundColor: colors.success + '33' },
    optionWrong: { borderColor: colors.error, backgroundColor: colors.error + '33' },
    optionDim: { opacity: 0.55 },
    letter: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.apexSurface },
    letterText: { fontSize: 13, fontWeight: '800', color: colors.apexGlow },
    optionText: { flex: 1, fontSize: 15.5, lineHeight: 22, fontWeight: '600', color: colors.apexText },
    mark: { fontSize: 14, fontWeight: '800', color: colors.success },
    markWrong: { fontSize: 14, fontWeight: '800', color: colors.error },
    playActions: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 10 },
    big: { ...Type.numeral, fontSize: 52, lineHeight: 60, color: colors.apexText, textAlign: 'center' },
    scoreLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24 },
    scoreSide: { alignItems: 'center', gap: 6, minWidth: 110 },
    scoreBig: { ...Type.numeral, fontSize: 40, lineHeight: 48, color: colors.apexText },
    stats: { padding: 14, borderRadius: 16, backgroundColor: colors.apexSurface, gap: 8 },
    statRow: { flexDirection: 'row', alignItems: 'center' },
    statMine: { flex: 1, fontSize: 16, fontWeight: '800', color: colors.apexText, textAlign: 'left' },
    statLabel: { flex: 1.2, fontSize: 12.5, color: colors.apexMuted, textAlign: 'center' },
    statTheirs: { flex: 1, fontSize: 16, fontWeight: '800', color: colors.apexText, textAlign: 'right' },
    reward: { fontSize: 15, fontWeight: '800', color: colors.apexGlow, textAlign: 'center' },
    review: { gap: 10, padding: 14, borderRadius: 16, backgroundColor: colors.apexSurface },
    reviewItem: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
    reviewMark: { width: 40, fontSize: 13, fontWeight: '800', color: colors.apexMuted },
    rightText: { color: colors.success },
    wrongText: { color: colors.error },
    reviewPrompt: { fontSize: 14, lineHeight: 20, color: colors.apexText },
    reviewAnswer: { fontSize: 13, color: colors.apexGlow, marginTop: 2 },
  });
}

