import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TextInput } from '@/components/ui/text';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';

import { type AiLesson, ExplainSimplyButton } from '@/components/learning/ai-study';
import { SimulationStepView } from '@/components/learning/simulations/simulation-step';
import { PathwaySteps } from '@/components/pathway-steps';
import { QuestionCard } from '@/components/question-card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/interactive';
import { ProgressBar } from '@/components/ui/progress-bar';
import { InlineNotice } from '@/components/ui/state-views';
import { isWeb } from '@/components/ui/web';
import type { ThemeColors } from '@/constants/theme';
import { lessonToText } from '@/data/ai-study';
import type { InteractiveStep, Lesson, LessonTerm } from '@/data/lesson-types';
import { recordAnswer, recordRecall } from '@/data/learning/actions';
import { type LessonSession, saveLessonSession } from '@/data/learning/lesson-sessions';
import { type Answer, correctAnswerOf, isAnswerComplete, isAnswerCorrect, type Question } from '@/data/questions';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';
import { gradeRecallWithAi, type RecallGrade } from '@/lib/ai-study-api';

// Layer 1 of a lesson: learn by thinking and doing.
//
// One step at a time. 'learn' cards teach a small piece; 'ask' steps make
// the learner retrieve / predict / reason BEFORE the explanation is shown;
// 'recall' steps ask for open recall: the learner types an answer in their own
// words, the AI marks it against the lecture slides first (api/ai.mjs mode
// 'grade'), then the learner compares it with the model answer and rates it; 'simulate' steps ask for predictions (checkpoints), then let the
// learner explore a model (components/learning/simulations/). A checkpoint missed on the first try comes back once at the end
// (spaced retrieval inside the lesson), and every answer feeds the memory
// model, so missed concepts return in Review. Progress is saved after
// every step, so leaving half-way never loses the learner's place.
//
// "Previous" looks back at earlier steps, read-only (owner's request,
// 2026-10-19): explanations and model answers are shown, nothing is answered
// or counted again, and "Next" returns to the step the learner was on, with
// anything already chosen there kept.

export function InteractiveLayer({
  lesson,
  session,
  onFinished,
  aiLesson,
}: {
  lesson: Lesson;
  session: LessonSession;
  onFinished: () => void;
  /** The lesson as text for the AI: adds "Explain it more simply" to the learn steps. */
  aiLesson?: AiLesson;
}) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const reduceMotion = useReducedMotion();
  const steps = lesson.interactive ?? [];
  const [answer, setAnswer] = useState<Answer | undefined>(undefined);
  const [revealed, setRevealed] = useState(false);
  const [recallShown, setRecallShown] = useState(false);
  // A recall step: what the learner typed, and the AI's mark for it.
  const [typed, setTyped] = useState('');
  const [grade, setGrade] = useState<RecallGrade | null>(null);
  const [grading, setGrading] = useState(false);
  const [gradeError, setGradeError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [simReady, setSimReady] = useState(false);
  // How many steps back the learner is looking (0 = the current step).
  const [back, setBack] = useState(0);

  const { queue, position } = session;
  const finished = position >= queue.length;
  const entry = finished ? null : queue[position];
  const step: InteractiveStep | undefined = entry ? steps[entry.step] : undefined;
  const lookingBack = back > 0 && !finished;
  const pastEntry = lookingBack ? queue[position - back] : null;
  const pastStep: InteractiveStep | undefined = pastEntry ? steps[pastEntry.step] : undefined;
  const previous = () => setBack((value) => Math.min(position, value + 1));
  const next = () => setBack((value) => Math.max(0, value - 1));
  const sessionId = `lesson:${lesson.id}:${session.startedAt}`;

  function advance(patch: Partial<LessonSession> = {}) {
    setAnswer(undefined);
    setRevealed(false);
    setRecallShown(false);
    setTyped('');
    setGrade(null);
    setGradeError(null);
    setSimReady(false);
    saveLessonSession({ ...session, ...patch, position: session.position + 1 });
  }

  // A prediction in a simulation step: a first-try checkpoint (no retry
  // queue — the simulation itself shows the answer).
  async function predicted(question: Question, value: Answer) {
    const correct = isAnswerCorrect(question, value);
    await recordAnswer(question, value, 'interactive', sessionId);
    saveLessonSession({
      ...session,
      checkpoints: session.checkpoints + 1,
      firstTryCorrect: session.firstTryCorrect + (correct ? 1 : 0),
      missed: correct || session.missed.includes(question.concept) ? session.missed : [...session.missed, question.concept],
    });
  }

  async function check() {
    if (!step || step.type !== 'ask' || !entry || revealed || busy) return;
    if (!isAnswerComplete(step.question, answer)) return;
    setBusy(true);
    const correct = isAnswerCorrect(step.question, answer);
    setRevealed(true);
    await recordAnswer(step.question, answer, entry.retry ? 'interactive-retry' : 'interactive', sessionId);
    if (!entry.retry) {
      saveLessonSession({
        ...session,
        checkpoints: session.checkpoints + 1,
        firstTryCorrect: session.firstTryCorrect + (correct ? 1 : 0),
        queue: correct ? session.queue : [...session.queue, { step: entry.step, retry: true }],
        missed:
          correct || session.missed.includes(step.question.concept)
            ? session.missed
            : [...session.missed, step.question.concept],
      });
    }
    setBusy(false);
  }

  // "Check my answer": the AI marks the typed answer against the slides, then the model answer is shown.
  async function checkRecall() {
    if (!step || step.type !== 'recall' || grading || !typed.trim()) return;
    setGrading(true);
    setGradeError(null);
    try {
      const result = await gradeRecallWithAi(
        { title: lesson.title, text: lessonToText(lesson) },
        { prompt: step.recall.prompt, model: step.recall.answer, answer: typed.trim() }
      );
      setGrade(result);
      setRecallShown(true);
    } catch (error) {
      setGradeError(error instanceof Error ? error.message : 'The AI could not mark that right now.');
    } finally {
      setGrading(false);
    }
  }

  async function rate(rating: 'yes' | 'partial' | 'no') {
    if (!step || step.type !== 'recall' || busy) return;
    setBusy(true);
    await recordRecall(step.recall, rating, sessionId);
    setBusy(false);
    advance({
      recalled: { ...session.recalled, [step.recall.id]: rating },
      missed:
        rating === 'no' && !session.missed.includes(step.recall.concept)
          ? [...session.missed, step.recall.concept]
          : session.missed,
    });
  }

  const canCheck = step?.type === 'ask' && isAnswerComplete(step.question, answer);
  useKeyboardShortcuts(
    {
      Enter: () => {
        if (lookingBack) return next();
        if (!step) return;
        if (step.type === 'ask') {
          if (!revealed && canCheck) void check();
          else if (revealed) advance();
        } else if (step.type === 'learn') advance();
        else if (step.type === 'recall' && !recallShown) {
          if (typed.trim()) void checkRecall();
          else setRecallShown(true);
        }
        else if (step.type === 'simulate' && simReady) advance();
      },
    },
    !finished,
    // Enter in a typed checkpoint answer checks it; in a recall answer it starts a new line.
    step?.type === 'recall' ? [] : ['Enter']
  );

  if (finished) {
    const checkpoints = steps.reduce(
      (count, item) => count + (item.type === 'ask' ? 1 : item.type === 'simulate' ? item.predictions.length : 0),
      0
    );
    return (
      <Card style={styles.summary}>
        <Text style={styles.kicker}>INTERACTIVE LESSON COMPLETE</Text>
        <Text style={styles.summaryTitle}>You worked it out — now consolidate it.</Text>
        {checkpoints > 0 ? (
          <Text style={styles.body}>
            {session.firstTryCorrect} of {checkpoints} checkpoint{checkpoints === 1 ? '' : 's'} right on the first try.
          </Text>
        ) : null}
        {session.missed.length > 0 ? (
          <View style={styles.revisit}>
            <Text style={styles.revisitTitle}>COMING BACK IN REVIEW</Text>
            {session.missed.map((concept) => (
              <Text key={concept} style={styles.revisitItem}>
                • {concept}
              </Text>
            ))}
          </View>
        ) : (
          <Text style={styles.body}>No weak spots this time.</Text>
        )}
        <Text style={styles.body}>Next: the reading summary — the structured version to revise from.</Text>
        <Button label="Continue to the reading summary" trailing="→" onPress={onFinished} />
      </Card>
    );
  }

  const progressValue = queue.length ? position / queue.length : 0;
  const stepLabel = lookingBack
    ? `Step ${position - back + 1} of ${queue.length} · looking back`
    : entry?.retry ? 'One more try' : `Step ${Math.min(position + 1, queue.length)} of ${queue.length}`;
  const previousButton = position - back > 0 ? (
    <Button label="Previous" variant="secondary" icon={<Icon name="chevronLeft" size={16} color={colors.text} strokeWidth={2.2} />} onPress={previous} />
  ) : null;

  if (lookingBack && pastStep && pastEntry) {
    return (
      <View>
        <View style={styles.progressRow}>
          <ProgressBar value={progressValue} style={styles.flex} label="Interactive lesson progress" />
          <Text style={styles.progressText}>{stepLabel}</Text>
        </View>
        <Animated.View key={`back:${position - back}`} entering={reduceMotion ? undefined : FadeInDown.duration(220)}>
          {pastStep.type === 'learn' ? <LearnCard step={pastStep} styles={styles} /> : null}
          {pastStep.type === 'ask' ? (
            <>
              <QuestionCard
                question={pastStep.question}
                value={correctAnswerOf(pastStep.question)}
                onChange={() => undefined}
                revealed
                heading="ALREADY ANSWERED · THE ANSWER"
                shuffleSeed={`${lesson.id}:${pastStep.question.id}:${pastEntry.retry ? 'retry' : 'first'}`}
                reviewNote={null}
              />
              {pastStep.reveal ? (
                <Card tone="primary" style={styles.revealCard}>
                  {pastStep.reveal.map((paragraph, index) => <Text key={index} style={styles.body}>{paragraph}</Text>)}
                </Card>
              ) : null}
            </>
          ) : null}
          {pastStep.type === 'simulate' ? (
            // Looking back: the model to explore again; predictions here are not recorded.
            <SimulationStepView step={pastStep} shuffleSeed={`${lesson.id}:${pastEntry.step}:back`} onPredict={() => undefined} onPredictionsDone={() => undefined} />
          ) : null}
          {pastStep.type === 'recall' ? (
            <Card style={styles.learnCard}>
              <Text style={styles.kicker}>RECALL · FROM MEMORY</Text>
              <Text style={styles.learnTitle}>{pastStep.recall.prompt}</Text>
              <View style={styles.modelAnswer}>
                <Text style={styles.modelTitle}>MODEL ANSWER</Text>
                {pastStep.recall.answer.map((point, index) => <Text key={index} style={styles.modelPoint}>• {point}</Text>)}
              </View>
            </Card>
          ) : null}
        </Animated.View>
        <View style={styles.actions}>
          {previousButton}
          <Button label={back === 1 ? 'Back to where I was' : 'Next'} trailing="→" onPress={next} shortcut={isWeb ? 'Enter' : undefined} />
        </View>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.progressRow}>
        <ProgressBar value={progressValue} style={styles.flex} label="Interactive lesson progress" />
        <Text style={styles.progressText}>{stepLabel}</Text>
      </View>

      {position === 0 ? <StartSimple lesson={lesson} styles={styles} /> : null}

      <Animated.View key={`${position}`} entering={reduceMotion ? undefined : FadeInDown.duration(220)}>
        {step?.type === 'learn' ? <LearnCard step={step} styles={styles} /> : null}
        {step?.type === 'learn' && aiLesson ? (
          <View style={styles.simpler}>
            <ExplainSimplyButton lesson={aiLesson} focus={step.title} />
          </View>
        ) : null}

        {step?.type === 'ask' ? (
          <>
            <QuestionCard
              question={step.question}
              value={answer}
              onChange={setAnswer}
              revealed={revealed}
              retry={entry?.retry}
              heading={entry?.retry ? undefined : 'CHECKPOINT · ANSWER FIRST'}
              shuffleSeed={`${lesson.id}:${step.question.id}:${entry?.retry ? 'retry' : 'first'}`}
              onSubmitTyped={() => void check()}
              keyboard={isWeb}
              reviewNote={entry?.retry ? null : 'This concept comes back for review tomorrow.'}
            />
            {revealed && step.reveal ? (
              <Card tone="primary" style={styles.revealCard}>
                {step.reveal.map((paragraph, index) => (
                  <Text key={index} style={styles.body}>
                    {paragraph}
                  </Text>
                ))}
              </Card>
            ) : null}
            {revealed && aiLesson ? (
              <View style={styles.simpler}>
                <ExplainSimplyButton lesson={aiLesson} focus={step.question.concept} />
              </View>
            ) : null}
          </>
        ) : null}

        {step?.type === 'simulate' && entry ? (
          <SimulationStepView
            step={step}
            shuffleSeed={`${lesson.id}:${entry.step}`}
            onPredict={predicted}
            onPredictionsDone={() => setSimReady(true)}
          />
        ) : null}

        {step?.type === 'recall' ? (
          <Card style={styles.learnCard}>
            <Text style={styles.kicker}>RECALL · FROM MEMORY</Text>
            <Text style={styles.learnTitle}>{step.recall.prompt}</Text>
            {!recallShown ? (
              <>
                <Text style={styles.body}>Type your answer in your own words. The AI marks it against your lecture slides, then you compare it with the model answer.</Text>
                <TextInput
                  value={typed}
                  onChangeText={setTyped}
                  placeholder="Type your answer here"
                  placeholderTextColor={colors.textTertiary}
                  accessibilityLabel="Your answer, in your own words"
                  multiline
                  maxLength={3000}
                  editable={!grading}
                  style={styles.recallInput}
                />
                {gradeError ? <InlineNotice tone="error" message={`${gradeError} You can still compare with the model answer yourself.`} /> : null}
              </>
            ) : (
              <>
              {typed.trim() ? (
                <View style={styles.yourAnswer}>
                  <Text style={styles.modelTitle}>YOUR ANSWER</Text>
                  <Text style={styles.modelPoint}>{typed.trim()}</Text>
                </View>
              ) : null}
              {grade ? (
                <View style={[styles.aiMark, grade.verdict === 'yes' ? styles.aiMarkGood : grade.verdict === 'no' ? styles.aiMarkLow : null]}>
                  <View style={styles.aiMarkHead}>
                    <Icon name="sparkle" size={15} color={colors.accentText} />
                    <Text style={styles.modelTitle}>AI MARK · FROM YOUR SLIDES</Text>
                  </View>
                  <Text style={styles.aiVerdict}>{VERDICT_LABEL[grade.verdict]}</Text>
                  <Text style={styles.modelPoint}>{grade.feedback}</Text>
                  {grade.missing.length ? (
                    <>
                      <Text style={styles.aiSub}>From the slides, add:</Text>
                      {grade.missing.map((point, index) => <Text key={index} style={styles.modelPoint}>• {point}</Text>)}
                    </>
                  ) : null}
                  {grade.beyond ? <Text style={styles.aiSub}>Beyond your slides (check your notes): {grade.beyond}</Text> : null}
                </View>
              ) : null}
              <View style={styles.modelAnswer}>
                <Text style={styles.modelTitle}>MODEL ANSWER</Text>
                {step.recall.answer.map((point, index) => (
                  <Text key={index} style={styles.modelPoint}>
                    • {point}
                  </Text>
                ))}
                <Text style={styles.ratePrompt}>{grade ? `How much did you recall? The AI says “${RATE_LABEL[grade.verdict]}” — keep it or choose your own.` : 'How much of that did you recall?'}</Text>
                <View style={styles.rateRow}>
                  {(['yes', 'partial', 'no'] as const).map((rating) => (
                    <Button
                      key={rating}
                      label={RATE_LABEL[rating]}
                      variant={(grade ? grade.verdict === rating : rating === 'yes') ? 'primary' : 'secondary'}
                      onPress={() => void rate(rating)}
                      disabled={busy}
                    />
                  ))}
                </View>
              </View>
              </>
            )}
          </Card>
        ) : null}
      </Animated.View>

      <View style={styles.actions}>
        {previousButton}
        {step?.type === 'learn' ? (
          <Button label="Continue" trailing="→" onPress={() => advance()} shortcut={isWeb ? 'Enter' : undefined} />
        ) : null}
        {step?.type === 'ask' ? (
          revealed ? (
            <Button label="Continue" trailing="→" onPress={() => advance()} shortcut={isWeb ? 'Enter' : undefined} />
          ) : (
            <Button label="Check" onPress={() => void check()} disabled={!canCheck || busy} shortcut={isWeb ? 'Enter' : undefined} />
          )
        ) : null}
        {step?.type === 'simulate' ? (
          <Button
            label={simReady ? 'Continue' : 'Answer the predictions to continue'}
            trailing={simReady ? '→' : undefined}
            onPress={() => advance()}
            disabled={!simReady}
            shortcut={isWeb && simReady ? 'Enter' : undefined}
          />
        ) : null}
        {step?.type === 'recall' && !recallShown ? (
          typed.trim() ? (
            <>
              <Button label="Check my answer" icon={<Icon name="sparkle" size={16} color={colors.onPrimary} />} onPress={() => void checkRecall()} loading={grading} disabled={grading} />
              <Button label="Show the model answer" variant="secondary" onPress={() => setRecallShown(true)} disabled={grading} />
            </>
          ) : (
            <Button label="Show the model answer" onPress={() => setRecallShown(true)} shortcut={isWeb ? 'Enter' : undefined} />
          )
        ) : null}
      </View>
    </View>
  );
}

const RATE_LABEL = { yes: 'All of it', partial: 'Partly', no: 'Not really' } as const;
const VERDICT_LABEL = { yes: 'Well recalled', partial: 'Partly there', no: 'Not yet' } as const;

/** A teaching card (the current step, or an earlier one when looking back). */
/**
 * Before the first step: the lesson from zero (owner, 2026-10-24: "as though the
 * learner knew nothing, then move on to the complex stuff"). Built only from the
 * lesson's own lecture material: its big idea, the words it uses with their plain
 * meanings, and what the learner will be able to do. Shown above step 1 rather than
 * as a step, so lessons already in progress keep their place.
 */
function StartSimple({ lesson, styles }: { lesson: Lesson; styles: ReturnType<typeof createStyles> }) {
  const words = starterTerms(lesson);
  return (
    <Card tone="insight" style={styles.learnCard}>
      <Text style={styles.kicker}>START SIMPLE · NO BACKGROUND NEEDED</Text>
      <Text style={styles.learnTitle}>The big idea</Text>
      <Text style={styles.body}>{lesson.description}</Text>
      {words.length ? (
        <>
          <Text style={styles.simpleHeading}>Words you will meet</Text>
          <View style={styles.terms}>
            {words.map((term) => (
              <View key={term.term} style={styles.term}>
                <Text style={styles.termName}>{term.term}</Text>
                <Text style={styles.termMeaning}>{term.meaning}</Text>
              </View>
            ))}
          </View>
        </>
      ) : null}
      {lesson.objectives?.length ? (
        <>
          <Text style={styles.simpleHeading}>By the end you will be able to</Text>
          {lesson.objectives.map((objective) => <Text key={objective} style={styles.body}>• {objective}</Text>)}
        </>
      ) : null}
      <Text style={styles.body}>We start with the basics and build up one small step at a time. When a question comes before the explanation, just give it your best guess: being wrong is part of learning, and nothing is lost.</Text>
    </Card>
  );
}

/** The lesson's key words with their plain meanings, in the order they come up (at most six). */
function starterTerms(lesson: Lesson): LessonTerm[] {
  const seen = new Set<string>();
  const out: LessonTerm[] = [];
  const add = (terms: readonly LessonTerm[] | undefined) => {
    for (const term of terms ?? []) {
      const key = term.term.trim().toLowerCase();
      if (!key || seen.has(key) || out.length >= 6) continue;
      seen.add(key);
      out.push(term);
    }
  };
  for (const step of lesson.interactive ?? []) if (step.type === 'learn') add(step.terms);
  for (const chunk of lesson.chunks) add(chunk.terms);
  return out;
}

function LearnCard({ step, styles }: { step: Extract<InteractiveStep, { type: 'learn' }>; styles: ReturnType<typeof createStyles> }) {
  return (
    <Card style={styles.learnCard}>
      <Text style={styles.kicker}>LEARN</Text>
      <Text style={styles.learnTitle}>{step.title}</Text>
      {step.body.map((paragraph, index) => (
        <Text key={index} style={styles.body}>
          {paragraph}
        </Text>
      ))}
      {step.steps ? <PathwaySteps steps={step.steps} /> : null}
      {step.terms ? (
        <View style={styles.terms}>
          {step.terms.map((term) => (
            <View key={term.term} style={styles.term}>
              <Text style={styles.termName}>{term.term}</Text>
              <Text style={styles.termMeaning}>{term.meaning}</Text>
            </View>
          ))}
        </View>
      ) : null}
      {step.keyPoint ? (
        <View style={styles.keyPoint}>
          <Text style={styles.keyPointText}>★ {step.keyPoint}</Text>
        </View>
      ) : null}
    </Card>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    flex: { flex: 1 },
    progressRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
    progressText: { fontSize: 12, fontWeight: '700', color: colors.textTertiary },
    kicker: { fontSize: 11, fontWeight: '800', letterSpacing: 1.1, color: colors.textTertiary, marginBottom: 8 },
    learnCard: { marginBottom: 16, gap: 4 },
    simpler: { alignItems: 'flex-start', marginTop: -8, marginBottom: 12 },
    simpleHeading: { fontSize: 15, fontWeight: '800', color: colors.text, marginTop: 8, marginBottom: 6 },
    learnTitle: { fontSize: 21, fontWeight: '800', lineHeight: 28, color: colors.text, marginBottom: 8 },
    body: { fontSize: 16, lineHeight: 25, color: colors.textSecondary, marginBottom: 10 },
    terms: { gap: 8, marginTop: 4 },
    term: { borderLeftWidth: 3, borderLeftColor: colors.primary, paddingLeft: 10 },
    termName: { fontSize: 14, fontWeight: '800', color: colors.text },
    termMeaning: { fontSize: 14, lineHeight: 20, color: colors.textSecondary },
    keyPoint: { backgroundColor: colors.accentSubtle, borderRadius: 12, padding: 12, marginTop: 6 },
    keyPointText: { fontSize: 14, lineHeight: 20, fontWeight: '700', color: colors.accentText },
    revealCard: { marginTop: -6, marginBottom: 16 },
    modelAnswer: { backgroundColor: colors.surfaceMuted, borderRadius: 14, padding: 14, gap: 6 },
    modelTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 1, color: colors.textTertiary },
    modelPoint: { fontSize: 15, lineHeight: 22, color: colors.text },
    ratePrompt: { fontSize: 14, fontWeight: '700', color: colors.text, marginTop: 8 },
    rateRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    recallInput: { minHeight: 110, borderWidth: 1, borderColor: colors.borderStrong, borderRadius: 12, backgroundColor: colors.surfaceSunken, padding: 12, color: colors.text, fontSize: 15.5, lineHeight: 22, textAlignVertical: 'top', marginBottom: 8 },
    yourAnswer: { borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 14, gap: 6, marginBottom: 10 },
    aiMark: { borderWidth: 1, borderColor: colors.primaryBorder, backgroundColor: colors.primarySubtle, borderRadius: 14, padding: 14, gap: 6, marginBottom: 10 },
    aiMarkGood: { borderColor: colors.successBorder, backgroundColor: colors.successSubtle },
    aiMarkLow: { borderColor: colors.warningBorder, backgroundColor: colors.warningSubtle },
    aiMarkHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    aiVerdict: { fontSize: 16, fontWeight: '700', color: colors.text },
    aiSub: { fontSize: 13.5, fontWeight: '600', color: colors.textSecondary, marginTop: 4 },
    actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
    summary: { gap: 10 },
    summaryTitle: { fontSize: 21, fontWeight: '800', color: colors.text },
    revisit: { backgroundColor: colors.primarySubtle, borderRadius: 14, padding: 14 },
    revisitTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 1, color: colors.primaryText, marginBottom: 6 },
    revisitItem: { fontSize: 14, lineHeight: 21, color: colors.text },
  });
}
