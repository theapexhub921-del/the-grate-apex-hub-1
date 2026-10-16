import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { QuestionCard } from '@/components/question-card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Card, Interactive } from '@/components/ui/interactive';
import { InlineNotice } from '@/components/ui/state-views';
import { Text } from '@/components/ui/text';
import { isWeb } from '@/components/ui/web';
import type { ThemeColors } from '@/constants/theme';
import type { SimulationStep } from '@/data/lesson-types';
import { type Answer, isAnswerComplete, type Question } from '@/data/questions';
import { getSimulation, predictionValues } from '@/data/simulations';
import { formatReadout, goalMet, type SimDefinition, type SimReadout, type SimValues } from '@/data/simulations/types';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';

import { SimulationGraphic } from './graphics';
import { SimControls } from './sim-controls';
import { useSimClock } from './use-sim-clock';

// A "simulate" step of the interactive layer:
//   Predict   — answer a checkpoint first; the model then runs the change
//               and shows the result next to your answer.
//   Explore   — situations from the lecture, or move any control.
//   Challenge — reach a goal with some controls locked.
// Explore and Challenge open once the predictions are answered.

type Mode = 'predict' | 'explore' | 'challenge';

const TWEEN_MS = 1300;

export function SimulationStepView({
  step,
  shuffleSeed,
  onPredict,
  onPredictionsDone,
}: {
  step: SimulationStep;
  shuffleSeed: string;
  onPredict: (question: Question, answer: Answer) => Promise<void> | void;
  onPredictionsDone: () => void;
}) {
  const definition = getSimulation(step.sim);
  if (!definition) {
    return <InlineNotice tone="warning" message="This simulation is not available in this version of the app." />;
  }
  return <SimulationBody definition={definition} step={step} shuffleSeed={shuffleSeed} onPredict={onPredict} onPredictionsDone={onPredictionsDone} />;
}

function SimulationBody({
  definition,
  step,
  shuffleSeed,
  onPredict,
  onPredictionsDone,
}: {
  definition: SimDefinition;
  step: SimulationStep;
  shuffleSeed: string;
  onPredict: (question: Question, answer: Answer) => Promise<void> | void;
  onPredictionsDone: () => void;
}) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const reduceMotion = useReducedMotion();
  const predictions = step.predictions;
  const hasPredictions = predictions.length > 0;

  const [mode, setMode] = useState<Mode>(hasPredictions ? 'predict' : 'explore');
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<Answer | undefined>(undefined);
  const [revealed, setRevealed] = useState(false);
  const [running, setRunning] = useState(false);
  const [answered, setAnswered] = useState(hasPredictions ? 0 : predictions.length);
  const [scenario, setScenario] = useState<string>(definition.scenarios[0]?.id ?? 'custom');
  const [challengeIndex, setChallengeIndex] = useState(0);

  const firstValues = hasPredictions ? predictionValues(definition, predictions[0]).before : definition.initial;
  const [values, setValues] = useState<SimValues>(firstValues);
  const [baselineValues, setBaselineValues] = useState<SimValues>(firstValues);

  const unlocked = answered >= predictions.length;
  const reported = useRef(false);
  useEffect(() => {
    if (unlocked && !reported.current) {
      reported.current = true;
      onPredictionsDone();
    }
  }, [unlocked, onPredictionsDone]);

  // Smoothly move the controls to new values (instantly under reduced motion).
  const tween = useRef<number | null>(null);
  useEffect(() => () => {
    if (tween.current !== null) cancelAnimationFrame(tween.current);
  }, []);
  function animateTo(target: SimValues, done?: () => void) {
    if (tween.current !== null) cancelAnimationFrame(tween.current);
    const from = values;
    const sliders = new Set(definition.controls.filter((c) => c.kind === 'slider').map((c) => c.key));
    if (reduceMotion) {
      setValues(target);
      done?.();
      return;
    }
    let start: number | null = null;
    const frame = (now: number) => {
      if (start === null) start = now;
      const k = Math.min(1, (now - start) / TWEEN_MS);
      const e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
      const next: SimValues = { ...target };
      for (const key of Object.keys(target)) {
        if (sliders.has(key) && from[key] !== undefined) next[key] = from[key] + (target[key] - from[key]) * e;
      }
      setValues(k >= 1 ? target : next);
      if (k < 1) tween.current = requestAnimationFrame(frame);
      else {
        tween.current = null;
        done?.();
      }
    };
    tween.current = requestAnimationFrame(frame);
  }

  const state = useMemo(() => definition.model(values), [definition, values]);
  const baseline = useMemo(() => definition.model(baselineValues), [definition, baselineValues]);
  const animating = Boolean(definition.animated) && !reduceMotion && !(values.paused === 1);
  const time = useSimClock(animating);

  const prediction = mode === 'predict' ? predictions[index] : undefined;
  const challenge = mode === 'challenge' ? definition.challenges[challengeIndex] : undefined;
  const canCheck = Boolean(prediction && !revealed && !running && isAnswerComplete(prediction.question, answer));

  async function check() {
    if (!prediction || !canCheck || answer === undefined) return;
    setRevealed(true);
    setRunning(true);
    // Only the first attempt counts as a checkpoint; replays are practice.
    if (index >= answered) await onPredict(prediction.question, answer);
    const { after } = predictionValues(definition, prediction);
    animateTo(after, () => {
      setRunning(false);
      setAnswered((count) => Math.max(count, index + 1));
    });
  }

  function startPrediction(next: number) {
    const { before } = predictionValues(definition, predictions[next]);
    setIndex(next);
    setAnswer(undefined);
    setRevealed(false);
    setValues(before);
    setBaselineValues(before);
  }

  function openMode(next: Mode) {
    if (next !== 'predict' && !unlocked) return;
    if (tween.current !== null) cancelAnimationFrame(tween.current);
    setRunning(false);
    setMode(next);
    if (next === 'predict') {
      startPrediction(0);
    } else if (next === 'explore') {
      const first = definition.scenarios[0];
      setScenario(first?.id ?? 'custom');
      setValues(first?.values ?? definition.initial);
      setBaselineValues(definition.initial);
    } else {
      startChallenge(0);
    }
  }

  function startChallenge(next: number) {
    const item = definition.challenges[next];
    if (!item) return;
    setChallengeIndex(next);
    setValues(item.start);
    setBaselineValues(item.start);
  }

  function change(key: string, value: number) {
    if (tween.current !== null) cancelAnimationFrame(tween.current);
    setValues((current) => ({ ...current, [key]: value }));
    if (mode === 'explore') setScenario('custom');
  }

  useKeyboardShortcuts({ Enter: () => void check() }, mode === 'predict' && canCheck, ['Enter']);

  const scenarioInfo = definition.scenarios.find((item) => item.id === scenario);
  const goalsMet = challenge ? challenge.goals.every((goal) => goalMet(goal, state.readouts)) : false;
  const watched = prediction ? definition.readouts.find((readout) => readout.key === prediction.watch) : undefined;
  const tabs: { mode: Mode; label: string; shown: boolean }[] = [
    { mode: 'predict', label: 'Predict', shown: hasPredictions },
    { mode: 'explore', label: 'Explore', shown: definition.scenarios.length > 0 },
    { mode: 'challenge', label: 'Challenge', shown: definition.challenges.length > 0 },
  ];

  return (
    <Card style={styles.card}>
      <View>
        <Text style={styles.kicker}>{`SIMULATE · ${definition.name.toUpperCase()}`}</Text>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.body}>{step.intro}</Text>
      </View>

      <View style={styles.tabs} accessibilityRole="tablist">
        {tabs
          .filter((tab) => tab.shown)
          .map((tab) => {
            const selected = tab.mode === mode;
            const locked = tab.mode !== 'predict' && !unlocked;
            return (
              <Interactive
                key={tab.mode}
                onPress={() => openMode(tab.mode)}
                disabled={locked}
                dimDisabled={false}
                accessibilityRole="tab"
                accessibilityState={{ selected, disabled: locked }}
                accessibilityLabel={locked ? `${tab.label} (answer the predictions first)` : tab.label}
                style={[styles.tab, selected && styles.tabOn]}
              >
                <View style={styles.tabInner}>
                  {locked ? <Icon name="lock" size={12} color={colors.textTertiary} /> : null}
                  <Text style={[styles.tabText, selected && styles.tabTextOn, locked && styles.tabTextLocked]}>{tab.label}</Text>
                </View>
              </Interactive>
            );
          })}
      </View>

      {prediction ? (
        <View style={styles.panel}>
          <QuestionCard
            question={prediction.question}
            value={answer}
            onChange={setAnswer}
            revealed={revealed}
            heading={`PREDICT FIRST · ${index + 1} OF ${predictions.length}`}
            shuffleSeed={`${shuffleSeed}:${prediction.question.id}`}
            keyboard={isWeb && !revealed}
            reviewNote={null}
          />
          {revealed && watched ? (
            <View style={styles.result}>
              <Text style={styles.resultLabel}>{running ? 'RUNNING THE MODEL…' : 'WHAT THE MODEL SHOWS'}</Text>
              <Text style={styles.resultText}>
                {`${watched.label}: ${formatReadout(watched, baseline.readouts)} → ${formatReadout(watched, state.readouts)}`}
              </Text>
            </View>
          ) : null}
          <View style={styles.actions}>
            {!revealed ? (
              <Button label="Check and run it" onPress={() => void check()} disabled={!canCheck} shortcut={isWeb ? 'Enter' : undefined} />
            ) : running ? null : index < predictions.length - 1 ? (
              <Button label="Next prediction" trailing="→" variant="secondary" onPress={() => startPrediction(index + 1)} />
            ) : (
              <Button label="Explore it yourself" trailing="→" variant="secondary" onPress={() => openMode('explore')} />
            )}
          </View>
        </View>
      ) : null}

      {mode === 'explore' ? (
        <View style={styles.panel}>
          <Text style={styles.kicker}>TRY A SITUATION FROM THE LECTURE, OR MOVE ANY CONTROL</Text>
          <View style={styles.chips}>
            {definition.scenarios.map((item) => {
              const selected = item.id === scenario;
              return (
                <Interactive
                  key={item.id}
                  onPress={() => {
                    setScenario(item.id);
                    animateTo(item.values);
                  }}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  style={[styles.chip, selected && styles.chipOn]}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextOn]}>{item.label}</Text>
                </Interactive>
              );
            })}
          </View>
          <Text style={styles.body}>{scenarioInfo ? scenarioInfo.caption : 'Your own settings. Faded marks show the starting point.'}</Text>
        </View>
      ) : null}

      {challenge ? (
        <View style={styles.panel}>
          {definition.challenges.length > 1 ? (
            <View style={styles.chips}>
              {definition.challenges.map((item, i) => {
                const selected = i === challengeIndex;
                return (
                  <Interactive key={item.id} onPress={() => startChallenge(i)} accessibilityState={{ selected }} style={[styles.chip, selected && styles.chipOn]}>
                    <Text style={[styles.chipText, selected && styles.chipTextOn]}>{`${i + 1} · ${item.label}`}</Text>
                  </Interactive>
                );
              })}
            </View>
          ) : null}
          <Text style={styles.question}>{challenge.prompt}</Text>
          {challenge.rules.map((rule) => (
            <Text key={rule} style={styles.rule}>{`• ${rule}`}</Text>
          ))}
          <View style={styles.goals}>
            {challenge.goals.map((goal) => {
              const met = goalMet(goal, state.readouts);
              return (
                <View key={goal.label} style={styles.goal}>
                  <View style={[styles.goalMark, met && styles.goalMarkOn]}>{met ? <Icon name="check" size={13} color={colors.onPrimary} /> : null}</View>
                  <Text style={[styles.goalText, met && styles.goalTextOn]}>{goal.label}</Text>
                </View>
              );
            })}
          </View>
          {goalsMet ? (
            <View style={styles.success}>
              <Text style={styles.successTitle}>Challenge complete</Text>
              <Text style={styles.successText}>{challenge.debrief}</Text>
            </View>
          ) : null}
          <View style={styles.actions}>
            <Button label="Start again" size="sm" variant="ghost" onPress={() => startChallenge(challengeIndex)} />
          </View>
        </View>
      ) : null}

      <SimulationGraphic id={step.sim} state={state} baseline={baseline} values={values} time={time} reduceMotion={reduceMotion} />

      {state.notes.map((note) => (
        <InlineNotice key={note} tone="warning" message={note} />
      ))}

      <ReadoutTiles readouts={definition.readouts} now={state.readouts} before={baseline.readouts} />

      <SimControls controls={definition.controls} values={values} onChange={change} lockAll={mode === 'predict' && (!revealed || running)} challenge={challenge} />

      {mode === 'predict' && !revealed ? <Text style={styles.note}>Answer first — the controls unlock once the model has run.</Text> : null}
      <Text style={styles.note}>{definition.modelNote}</Text>
    </Card>
  );
}

function ReadoutTiles({ readouts, now, before }: { readouts: SimReadout[]; now: Record<string, number>; before: Record<string, number> }) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.tiles}>
      {readouts
        .filter((readout) => !readout.hidden)
        .map((readout) => {
          const value = now[readout.key] ?? 0;
          const was = before[readout.key] ?? 0;
          const decimals = readout.decimals ?? 0;
          const diff = Number((value - was).toFixed(decimals));
          const delta = readout.noDelta || readout.text ? null : diff === 0 ? 'no change' : `${diff > 0 ? '↑ +' : '↓ '}${diff.toFixed(decimals)}`;
          const changedText = readout.text && formatReadout(readout, now) !== formatReadout(readout, before);
          return (
            <View key={readout.key} style={[styles.tile, readout.primary && styles.tilePrimary]}>
              <Text style={styles.tileLabel}>{readout.label.toUpperCase()}</Text>
              <Text style={[styles.tileValue, readout.primary && styles.tileValuePrimary, readout.text && styles.tileValueText]}>{formatReadout(readout, now)}</Text>
              {delta ? <Text style={styles.tileDelta}>{delta}</Text> : changedText ? <Text style={styles.tileDelta}>{`was: ${formatReadout(readout, before)}`}</Text> : null}
            </View>
          );
        })}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: { marginBottom: 16, gap: 14 },
    kicker: { fontSize: 11, fontWeight: '800', letterSpacing: 1.1, color: colors.primaryText, marginBottom: 6 },
    title: { fontSize: 21, fontWeight: '800', lineHeight: 28, color: colors.text, marginBottom: 6 },
    body: { fontSize: 15, lineHeight: 23, color: colors.textSecondary },
    tabs: { flexDirection: 'row', backgroundColor: colors.surfaceSunken, borderRadius: 14, padding: 4, gap: 4 },
    tab: { flex: 1, borderRadius: 10, paddingVertical: 9, alignItems: 'center' },
    tabOn: { backgroundColor: colors.surface },
    tabInner: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    tabText: { fontSize: 14, fontWeight: '800', color: colors.textSecondary },
    tabTextOn: { color: colors.primaryText },
    tabTextLocked: { color: colors.textTertiary },
    panel: { backgroundColor: colors.surfaceMuted, borderRadius: 16, padding: 14, gap: 10 },
    question: { fontSize: 16, lineHeight: 23, fontWeight: '800', color: colors.text },
    rule: { fontSize: 14, lineHeight: 20, color: colors.textSecondary },
    actions: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 8 },
    result: { backgroundColor: colors.primarySubtle, borderRadius: 12, padding: 12, gap: 4 },
    resultLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1, color: colors.primaryText },
    resultText: { fontSize: 15, lineHeight: 22, fontWeight: '800', color: colors.text },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: { borderRadius: 999, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface, paddingVertical: 7, paddingHorizontal: 13 },
    chipOn: { borderColor: colors.primary, backgroundColor: colors.primarySubtle },
    chipText: { fontSize: 13, fontWeight: '800', color: colors.textSecondary },
    chipTextOn: { color: colors.primaryText },
    goals: { gap: 6 },
    goal: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    goalMark: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center' },
    goalMarkOn: { backgroundColor: colors.success, borderColor: colors.success },
    goalText: { fontSize: 14, fontWeight: '700', color: colors.textSecondary, flexShrink: 1 },
    goalTextOn: { color: colors.successText },
    success: { backgroundColor: colors.successSubtle, borderColor: colors.successBorder, borderWidth: 1, borderRadius: 12, padding: 12, gap: 4 },
    successTitle: { fontSize: 15, fontWeight: '900', color: colors.successText },
    successText: { fontSize: 14, lineHeight: 21, color: colors.text },
    tiles: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    tile: { flexGrow: 1, flexBasis: 124, minWidth: 0, backgroundColor: colors.surfaceMuted, borderRadius: 14, paddingVertical: 10, paddingHorizontal: 12, gap: 2 },
    tilePrimary: { backgroundColor: colors.primarySubtle },
    tileLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.6, color: colors.textTertiary },
    tileValue: { fontSize: 20, fontWeight: '900', color: colors.text, fontVariant: ['tabular-nums'] },
    tileValuePrimary: { color: colors.primaryText },
    tileValueText: { fontSize: 15, lineHeight: 21 },
    tileDelta: { fontSize: 12, fontWeight: '800', color: colors.textTertiary, fontVariant: ['tabular-nums'] },
    note: { fontSize: 12, lineHeight: 18, color: colors.textTertiary },
  });
}
