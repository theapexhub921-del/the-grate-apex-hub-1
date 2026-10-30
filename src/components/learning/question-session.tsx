import { type ReactNode, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Text } from '@/components/ui/text';

import { QuestionCard } from '@/components/question-card';
import { QuestionNote } from '@/components/learning/question-note';
import { ConfidenceToggle, confidenceNote } from '@/components/learning/confidence-toggle';
import type { Confidence } from '@/data/learning/scheduler';
import { prefetchQuestionPictures, questionPictureUri } from '@/components/learning/figure-view';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { toggleStar, useStarredIds } from '@/data/starred-questions';
import { Button } from '@/components/ui/button';
import { Card, Interactive } from '@/components/ui/interactive';
import { Pill } from '@/components/ui/pill';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Columns, Screen } from '@/components/ui/screen';
import { isWeb } from '@/components/ui/web';
import { isDesktopWidth, type ThemeColors } from '@/constants/theme';
import type { AttemptMode } from '@/data/learning-sync';
import { recordAnswer } from '@/data/learning/actions';
import type { SelectionReason } from '@/data/learning/selection';
import { formatDuration, secondsSince } from '@/data/learning/time';
import { type Answer, isAnswerComplete, isAnswerCorrect, type Question } from '@/data/questions';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { useThemedStyles } from '@/hooks/use-theme';

export type SessionItem = { question: Question; reason?: SelectionReason };
export type FeedbackMode = 'instant' | 'submit';

// The state of a session, saved so an unfinished quiz can be resumed (see src/data/quiz-drafts.ts).
export type SessionProgress = {
  index: number;
  answers: Record<string, Answer>;
  checked: string[];
  skipped: string[];
  recorded: string[];
  timedOut: string[];
  elapsed: number;
  confidence?: Record<string, Confidence>;
};

export type SessionResult = {
  answers: Record<string, Answer>;
  recordedIds: Set<string>;
  timeSeconds: number;
  /** "Sure / Guessing" per question id (only where the learner picked one). */
  confidence: Record<string, Confidence>;
};

const REASON_LABEL: Partial<Record<SelectionReason, { label: string; tone: 'warning' | 'error' | 'primary' | 'neutral' | 'gold' }>> = {
  missed: { label: 'Missed last time', tone: 'error' },
  due: { label: 'Due for review', tone: 'warning' },
  weak: { label: 'Weak concept', tone: 'error' },
  new: { label: 'New question', tone: 'primary' },
  cumulative: { label: 'From an earlier lesson', tone: 'neutral' },
  reinforce: { label: 'Keeping it fresh', tone: 'gold' },
};

// Correct answers move on by themselves after a moment; wrong answers
// wait, so the explanation can be read.
const AUTO_ADVANCE_CORRECT_MS = 1300;
// A picture that never reports it has loaded still lets the clock start after this long.
const PICTURE_WAIT_MS = 25_000;

export function QuestionSession({
  items,
  mode,
  onModeChange,
  modeSwitchAnytime = false,
  perQuestionSeconds,
  timeLimitSeconds,
  attemptMode,
  sessionId,
  seed,
  onSubmit,
  header,
  showReasons = false,
  reviewNote = 'This concept comes back for review tomorrow.',
  submitLabel = 'Finish',
  initial,
  onProgress,
  onSaveExit,
}: {
  items: SessionItem[];
  mode: FeedbackMode;
  onModeChange?: (mode: FeedbackMode) => void;
  /** Keep the "when to see the answers" switch for the whole quiz, not only before the first answer (past questions). */
  modeSwitchAnytime?: boolean;
  perQuestionSeconds?: number;
  /** A time limit for the whole paper (mock exams): when it runs out, the answers are submitted. */
  timeLimitSeconds?: number;
  attemptMode: AttemptMode;
  sessionId: string;
  seed: string;
  onSubmit: (result: SessionResult) => Promise<void>;
  header: ReactNode;
  showReasons?: boolean;
  reviewNote?: string | null;
  submitLabel?: string;
  /** Where to carry on from, when resuming a saved quiz. */
  initial?: SessionProgress;
  /** Called after every change, so the quiz can be saved as the learner goes. */
  onProgress?: (progress: SessionProgress) => void;
  /** Shows a "Save & exit" button: saves the quiz now, then leaves. */
  onSaveExit?: (progress: SessionProgress) => Promise<void> | void;
}) {
  const styles = useThemedStyles(createStyles);
  const { width } = useWindowDimensions();
  const desktop = isDesktopWidth(width);
  const scrollRef = useRef<ScrollView>(null);
  // Starred questions are shared with the Starred page.
  const starredIds = useStarredIds();
  const [index, setIndex] = useState(() => Math.max(0, Math.min(items.length, initial?.index ?? 0)));
  const [answers, setAnswers] = useState<Record<string, Answer>>(() => initial?.answers ?? {});
  const [checked, setChecked] = useState<Set<string>>(() => new Set(initial?.checked ?? []));
  const [skipped, setSkipped] = useState<Set<string>>(() => new Set(initial?.skipped ?? []));
  const [recorded, setRecorded] = useState<Set<string>>(() => new Set(initial?.recorded ?? []));
  const [timedOut, setTimedOut] = useState<Set<string>>(() => new Set(initial?.timedOut ?? []));
  const [confidence, setConfidence] = useState<Record<string, Confidence>>(() => initial?.confidence ?? {});
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startedAt] = useState(() => Date.now() - (initial?.elapsed ?? 0) * 1000);
  const [elapsed, setElapsed] = useState(initial?.elapsed ?? 0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remainingByQuestion = useRef(new Map<string, number>());
  const total = items.length;
  const current = items[index];
  const question = current?.question;
  const currentQuestionId = question?.id;
  const currentQuestionComplete = question ? isAnswerComplete(question, answers[question.id]) : false;

  // A question with a picture (spotter stations, diagrams): its clock starts only
  // once the picture has loaded, and the next pictures download in the background.
  const [picturesReady, setPicturesReady] = useState<Set<string>>(() => new Set());
  const pictureWaiting = Boolean(question && questionPictureUri(question) && !picturesReady.has(question.id));
  const markPictureReady = (id: string) =>
    setPicturesReady((previous) => (previous.has(id) ? previous : new Set(previous).add(id)));
  useEffect(() => {
    prefetchQuestionPictures(items.slice(index, index + 4).map((item) => item.question));
  }, [items, index]);
  // If a picture never reports back, the clock still starts after a while.
  useEffect(() => {
    if (!pictureWaiting || !currentQuestionId) return;
    const timer = setTimeout(() => markPictureReady(currentQuestionId), PICTURE_WAIT_MS);
    return () => clearTimeout(timer);
  }, [pictureWaiting, currentQuestionId]);

  useEffect(() => {
    const timer = setInterval(() => setElapsed(secondsSince(startedAt)), 1000);
    return () => clearInterval(timer);
  }, [startedAt]);

  useEffect(() => {
    if (!currentQuestionId || !perQuestionSeconds || currentQuestionComplete || timedOut.has(currentQuestionId) || pictureWaiting) return;

    const remaining = remainingByQuestion.current;
    let seconds = remaining.get(currentQuestionId) ?? perQuestionSeconds;
    setTimeLeft(seconds);
    const timer = setInterval(() => {
      seconds -= 1;
      remaining.set(currentQuestionId, seconds);
      setTimeLeft(seconds);
      if (seconds > 0) return;

      clearInterval(timer);
      setTimedOut((previous) => new Set(previous).add(currentQuestionId));
      setSkipped((previous) => new Set(previous).add(currentQuestionId));
      if (mode === 'instant') setChecked((previous) => new Set(previous).add(currentQuestionId));
      else {
        setIndex((currentIndex) => Math.min(total, currentIndex + 1));
        scrollRef.current?.scrollTo({ y: 0, animated: true });
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      remaining.set(currentQuestionId, seconds);
    };
  }, [currentQuestionComplete, currentQuestionId, index, mode, perQuestionSeconds, timedOut, total, pictureWaiting]);

  useEffect(
    () => () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    },
    []
  );

  // The whole paper's time limit (mock exams): at zero the answers are handed in, like the real exam.
  const paperLeft = timeLimitSeconds ? Math.max(0, timeLimitSeconds - elapsed) : null;
  const finishRef = useRef<() => Promise<void>>(async () => undefined);
  const timeUpRef = useRef(false);
  useEffect(() => {
    if (paperLeft === null || paperLeft > 0 || timeUpRef.current) return;
    timeUpRef.current = true;
    setConfirming(false);
    void finishRef.current();
  }, [paperLeft]);

  // Report the state for saving. Not on the first render, so opening a quiz never saves an empty draft.
  const progressRef = useRef(onProgress);
  useEffect(() => {
    progressRef.current = onProgress;
  });
  const firstReport = useRef(true);
  useEffect(() => {
    if (firstReport.current) {
      firstReport.current = false;
      return;
    }
    progressRef.current?.({
      index,
      answers,
      checked: [...checked],
      skipped: [...skipped],
      recorded: [...recorded],
      timedOut: [...timedOut],
      elapsed: secondsSince(startedAt),
      confidence,
    });
  }, [index, answers, checked, skipped, recorded, timedOut, startedAt, confidence]);

  const answeredCount = items.filter((item) => isAnswerComplete(item.question, answers[item.question.id])).length;
  const unanswered = total - answeredCount;
  const isChecked = question ? checked.has(question.id) : false;
  const isRecorded = question ? recorded.has(question.id) : false;
  const complete = question ? isAnswerComplete(question, answers[question.id]) : false;
  const anyAnswered = answeredCount > 0;

  function clearTimer() {
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
  }

  function go(next: number) {
    clearTimer();
    setIndex(Math.max(0, Math.min(total, next)));
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }

  function select(value: Answer) {
    if (!question || recorded.has(question.id) || timedOut.has(question.id)) return;
    setAnswers((previous) => ({ ...previous, [question.id]: value }));
    setSkipped((previous) => {
      if (!previous.has(question.id)) return previous;
      const next = new Set(previous);
      next.delete(question.id);
      return next;
    });
  }

  async function check() {
    if (!question || !complete || isChecked) return;
    const answer = answers[question.id];
    const correct = isAnswerCorrect(question, answer);
    setChecked((previous) => new Set(previous).add(question.id));
    setRecorded((previous) => new Set(previous).add(question.id));
    try {
      await recordAnswer(question, answer, attemptMode, sessionId, confidence[question.id]);
    } catch (problem) {
      console.warn('Could not record answer:', problem);
      setError('That answer could not be saved on this device. Your quiz continues; it will be saved when you finish.');
      setRecorded((previous) => {
        const next = new Set(previous);
        next.delete(question.id);
        return next;
      });
    }
    // A lucky guess waits like a wrong answer, so its note can be read.
    if (correct && confidence[question.id] !== 'guess') {
      clearTimer();
      advanceTimer.current = setTimeout(() => go(index + 1), AUTO_ADVANCE_CORRECT_MS);
    }
  }

  function skip() {
    if (!question || isRecorded || timedOut.has(question.id)) return;
    setAnswers((previous) => {
      const next = { ...previous };
      delete next[question.id];
      return next;
    });
    setSkipped((previous) => new Set(previous).add(question.id));
    go(index + 1);
  }

  function requestFinish() {
    if (unanswered > 0) {
      setConfirming(true);
      return;
    }
    void finish();
  }

  async function finish() {
    if (submitting) return;
    clearTimer();
    setSubmitting(true);
    setConfirming(false);
    setError(null);
    try {
      await onSubmit({ answers, recordedIds: recorded, timeSeconds: secondsSince(startedAt), confidence });
    } catch (problem) {
      console.warn('Could not submit:', problem);
      setError('Your answers could not be submitted. Nothing is lost — please try again.');
      setSubmitting(false);
    }
  }

  finishRef.current = finish;

  async function saveAndExit() {
    if (!onSaveExit || leaving || submitting) return;
    clearTimer();
    setLeaving(true);
    try {
      await onSaveExit({
        index,
        answers,
        checked: [...checked],
        skipped: [...skipped],
        recorded: [...recorded],
        timedOut: [...timedOut],
        elapsed: secondsSince(startedAt),
        confidence,
      });
    } catch (problem) {
      console.warn('Could not save and exit:', problem);
      setError('Your quiz could not be saved. Check your connection and try again.');
      setLeaving(false);
    }
  }

  function resumeAnswering() {
    const firstOpen = items.findIndex((item) => !isAnswerComplete(item.question, answers[item.question.id]));
    setConfirming(false);
    go(firstOpen >= 0 ? firstOpen : index);
  }

  useKeyboardShortcuts(
    {
      Enter: () => {
        if (confirming || submitting) return;
        // Enter inside the note box is a new line, not "next".
        if (typeof document !== 'undefined' && document.activeElement?.tagName === 'TEXTAREA') return;
        if (!question) return requestFinish();
        if (mode === 'instant') {
          if (!isChecked && complete) void check();
          else if (isChecked) go(index + 1);
        } else if (complete || (question && timedOut.has(question.id))) {
          go(index + 1);
        }
      },
      ArrowRight: () => go(index + 1),
      ArrowLeft: () => go(index - 1),
    },
    !confirming && !submitting,
    ['Enter']
  );

  const navigator = (
    <Card style={styles.navCard}>
      <View style={styles.navHeader}>
        <Text style={styles.kicker}>QUESTIONS</Text>
        {paperLeft !== null ? (
          <Text style={[styles.timer, paperLeft <= 300 && styles.timerLow]} accessibilityLabel={`Time left ${formatDuration(paperLeft)}`}>
            {formatDuration(paperLeft)} left
          </Text>
        ) : (
          <Text style={styles.timer} accessibilityLabel={`Time ${formatDuration(elapsed)}`}>
            ⏱ {formatDuration(elapsed)}
          </Text>
        )}
      </View>
      <View style={styles.navGrid}>
        {items.map((item, i) => {
          const id = item.question.id;
          const answered = isAnswerComplete(item.question, answers[id]);
          const revealedResult = checked.has(id);
          const right = revealedResult && isAnswerCorrect(item.question, answers[id]);
          return (
            <Interactive
              key={id}
              onPress={() => go(i)}
              accessibilityLabel={`Question ${i + 1}${answered ? ', answered' : skipped.has(id) ? ', skipped' : ''}`}
              style={({ hovered }) => [
                styles.navDot,
                answered && styles.navAnswered,
                skipped.has(id) && styles.navSkipped,
                revealedResult && (right ? styles.navRight : styles.navWrong),
                i === index && styles.navCurrent,
                hovered && styles.navHover,
              ]}
            >
              <Text style={[styles.navText, (answered || revealedResult) && styles.navTextOn]}>{i + 1}</Text>
            </Interactive>
          );
        })}
      </View>
      <Text style={styles.navMeta}>
        {answeredCount}/{total} answered{skipped.size > 0 ? ` · ${skipped.size} skipped` : ''}
      </Text>
      <Text style={styles.navMeta}>{mode === 'instant' ? 'Instant feedback' : 'Feedback when you finish'}</Text>
      {isWeb && desktop ? <Text style={styles.keys}>Keys: 1–4 / A–D choose · Enter check/next · ← → move</Text> : null}
      <Button label={submitLabel} variant="secondary" onPress={requestFinish} disabled={submitting || leaving} loading={submitting} fullWidth />
      {onSaveExit ? <Button label="Save & exit" variant="ghost" onPress={() => void saveAndExit()} disabled={submitting} loading={leaving} fullWidth /> : null}
    </Card>
  );

  const main = (
    <View>
      {header}
      {error ? (
        <Card tone="outline" style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
        </Card>
      ) : null}

      {!desktop ? (
        <View style={styles.mobileProgress}>
          <ProgressBar value={total ? (index + (question ? 0 : 1)) / total : 0} label="Quiz progress" />
          <Text style={styles.mobileMeta}>
            {question ? `Question ${index + 1} of ${total}` : 'All questions seen'} · {answeredCount} answered · {paperLeft !== null ? `${formatDuration(paperLeft)} left` : `⏱ ${formatDuration(elapsed)}`}
          </Text>
        </View>
      ) : null}

      {onModeChange && (modeSwitchAnytime || !anyAnswered) && question ? (
        <View style={styles.modeSwitch}>
          <Text style={styles.modeLabel}>When do you want to see the answers?</Text>
          <SegmentedControl
            label="When to see the answers"
            options={[
              { value: 'instant', label: 'After each question' },
              { value: 'submit', label: 'At the end' },
            ]}
            value={mode}
            onChange={(value) => onModeChange(value as FeedbackMode)}
          />
        </View>
      ) : null}

      {question ? (
        <>
          {perQuestionSeconds ? (
            <Pill
              label={timedOut.has(question.id) ? 'Time expired' : pictureWaiting ? 'The clock starts when the picture loads' : `Time left: ${timeLeft ?? perQuestionSeconds}s`}
              tone={timedOut.has(question.id) || (timeLeft !== null && timeLeft <= 5) ? 'warning' : 'primary'}
              style={styles.questionTimer}
            />
          ) : null}
          {showReasons && current.reason && REASON_LABEL[current.reason] ? (
            <Pill label={REASON_LABEL[current.reason]!.label} tone={REASON_LABEL[current.reason]!.tone} style={styles.reason} />
          ) : null}
          <QuestionCard
            key={question.id}
            question={question}
            starred={starredIds.has(question.id)}
            onStar={() => void toggleStar(question.id).catch(() => undefined)}
            value={answers[question.id]}
            onChange={select}
            revealed={isChecked}
            heading={`QUESTION ${index + 1} OF ${total}`}
            shuffleSeed={`${seed}:${question.id}`}
            onSubmitTyped={() => (mode === 'instant' ? void check() : go(index + 1))}
            keyboard={isWeb}
            reviewNote={reviewNote}
            showMeta
            onPictureReady={() => markPictureReady(question.id)}
          />
          {complete && !timedOut.has(question.id) && !(mode === 'instant' && isChecked) ? (
            <ConfidenceToggle
              value={confidence[question.id]}
              onChange={(value) =>
                setConfidence((previous) => {
                  const next = { ...previous };
                  if (value) next[question.id] = value;
                  else delete next[question.id];
                  return next;
                })
              }
            />
          ) : null}
          {mode === 'instant' && isChecked && confidenceNote(confidence[question.id], isAnswerCorrect(question, answers[question.id])) ? (
            <Text style={styles.confidenceNote}>{confidenceNote(confidence[question.id], isAnswerCorrect(question, answers[question.id]))}</Text>
          ) : null}
          <QuestionNote key={`note:${question.id}`} questionId={question.id} />
          <View style={styles.actions}>
            <Button label="Back" variant="ghost" onPress={() => go(index - 1)} disabled={index === 0} />
            <Button label="Skip" variant="secondary" onPress={skip} disabled={isRecorded || timedOut.has(question.id)} />
            <View style={styles.flex} />
            {mode === 'instant' ? (
              isChecked ? (
                <Button label={index === total - 1 ? 'Review & finish' : 'Next question'} trailing="→" onPress={() => go(index + 1)} shortcut={isWeb ? 'Enter' : undefined} />
              ) : (
                <Button label="Check answer" onPress={() => void check()} disabled={!complete} shortcut={isWeb ? 'Enter' : undefined} />
              )
            ) : (
              <Button
                label={timedOut.has(question.id) ? (index === total - 1 ? 'Finish' : 'Next question') : index === total - 1 ? 'Continue to finish' : 'Continue'}
                trailing="→"
                onPress={() => go(index + 1)}
                disabled={!complete && !timedOut.has(question.id)}
                shortcut={isWeb ? 'Enter' : undefined}
              />
            )}
          </View>
          {!desktop ? (
            <Button label={submitLabel} variant="ghost" onPress={requestFinish} disabled={submitting || leaving} style={styles.finishLink} />
          ) : null}
          {!desktop && onSaveExit ? (
            <Button label="Save & exit" variant="ghost" onPress={() => void saveAndExit()} disabled={submitting} loading={leaving} style={styles.finishLink} />
          ) : null}
        </>
      ) : (
        <Card style={styles.finishCard}>
          <Text style={styles.finishTitle}>Ready to finish?</Text>
          <Text style={styles.finishText}>
            {answeredCount} of {total} answered. {unanswered > 0 ? 'Unanswered questions count as not correct.' : 'Everything is answered.'}
          </Text>
          <View style={styles.actionsWrap}>
            {unanswered > 0 ? <Button label="Answer the rest" variant="secondary" onPress={resumeAnswering} /> : null}
            <Button label={submitLabel} onPress={() => void finish()} loading={submitting} />
          </View>
        </Card>
      )}
    </View>
  );

  return (
    <View style={styles.screen}>
      <Screen ref={scrollRef} width="wide">
        {desktop ? <Columns main={main} side={navigator} sideWidth={300} /> : main}
      </Screen>

      {confirming ? (
        <View style={styles.overlay} accessibilityViewIsModal>
          <Card style={styles.confirmCard}>
            <Text style={styles.finishTitle}>
              {unanswered} question{unanswered === 1 ? ' is' : 's are'} unanswered.
            </Text>
            <Text style={styles.finishText}>
              You can go back and answer them, or finish now. Unanswered questions are not counted as correct.
            </Text>
            <View style={styles.actionsWrap}>
              <Button label="Continue answering" variant="secondary" onPress={resumeAnswering} />
              <Button label="Submit anyway" onPress={() => void finish()} loading={submitting} />
            </View>
          </Card>
        </View>
      ) : null}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    screen: { flex: 1 },
    questionTimer: { marginBottom: 8 },
    confidenceNote: { marginTop: 10, fontSize: 13, lineHeight: 19, color: colors.textSecondary },
    modeSwitch: { gap: 6, marginBottom: 14, maxWidth: 460 },
    modeLabel: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
    flex: { flex: 1 },
    kicker: { fontSize: 11, fontWeight: '800', letterSpacing: 1.1, color: colors.textTertiary },
    navCard: { gap: 12 },
    navHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    timer: { fontSize: 13, fontWeight: '700', color: colors.textSecondary },
    timerLow: { color: colors.warningStrong },
    navGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    navDot: {
      width: 36,
      height: 36,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    navAnswered: { backgroundColor: colors.primary, borderColor: colors.primary },
    navSkipped: { backgroundColor: colors.warningSubtle, borderColor: colors.warningBorder },
    navRight: { backgroundColor: colors.success, borderColor: colors.success },
    navWrong: { backgroundColor: colors.error, borderColor: colors.error },
    navCurrent: { borderWidth: 2, borderColor: colors.text },
    navHover: { borderColor: colors.primaryBorder },
    navText: { fontSize: 12, fontWeight: '800', color: colors.textSecondary },
    navTextOn: { color: '#FFFFFF' },
    navMeta: { fontSize: 12, color: colors.textSecondary },
    keys: { fontSize: 11, color: colors.textTertiary },
    mobileProgress: { gap: 6, marginBottom: 14 },
    mobileMeta: { fontSize: 12, fontWeight: '600', color: colors.textSecondary },
    reason: { marginBottom: 8 },
    actions: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
    actionsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    finishLink: { marginTop: 8, alignSelf: 'center' },
    finishCard: { gap: 10 },
    finishTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
    finishText: { fontSize: 14, lineHeight: 21, color: colors.textSecondary },
    errorCard: { marginBottom: 12, borderColor: colors.errorBorder, backgroundColor: colors.errorSubtle },
    errorText: { fontSize: 13, color: colors.error },
    overlay: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: 'rgba(8, 12, 26, 0.55)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      zIndex: 20,
    },
    confirmCard: { gap: 10, width: '100%', maxWidth: 440 },
  });
}
