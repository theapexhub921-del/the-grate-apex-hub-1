import { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { BackLink } from '@/components/learning/nav-bits';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/interactive';
import { ProgressRing } from '@/components/ui/progress-ring';
import { PageHeader, Screen } from '@/components/ui/screen';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Text } from '@/components/ui/text';
import { Type, type ThemeColors } from '@/constants/theme';
import { clock, FOCUS_PRESETS, type FocusPresetId, MIN_COUNTED_MINUTES, recordFocus, useFocusTotals } from '@/data/focus';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';
import { correctFeedback } from '@/lib/feedback';
import { routes } from '@/lib/routes';

// /learn/focus — a focus timer (owner's request, 2026-10-20): 25 minutes of
// study, then 5 of rest (or 50/10, 15/3). A finished focus block counts its
// minutes and keeps the learning streak; stopping early still counts once 5
// minutes were focused (data/focus.ts). The clock runs from an end time, so it
// stays right in a background tab, and it keeps going if you open another page
// and come back.

type Phase = 'focus' | 'rest';
type TimerState = { preset: FocusPresetId; phase: Phase; endsAt: number | null; remainingMs: number };

const presetOf = (id: FocusPresetId) => FOCUS_PRESETS.find((item) => item.id === id) ?? FOCUS_PRESETS[0];
const phaseMs = (id: FocusPresetId, phase: Phase) => (phase === 'focus' ? presetOf(id).focus : presetOf(id).rest) * 60_000;

// Kept outside the page, so the timer carries on while the learner looks at something else.
let kept: TimerState = { preset: '25-5', phase: 'focus', endsAt: null, remainingMs: phaseMs('25-5', 'focus') };

export default function FocusTimerScreen() {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const totals = useFocusTotals();
  const [state, setStateRaw] = useState<TimerState>(kept);
  const [now, setNow] = useState(() => Date.now());
  const [note, setNote] = useState<string | null>(null);
  const handling = useRef(false);

  const setState = (next: TimerState) => {
    kept = next;
    setStateRaw(next);
  };

  const running = state.endsAt !== null;
  const remainingMs = running ? Math.max(0, (state.endsAt ?? 0) - now) : state.remainingMs;
  const fullMs = phaseMs(state.preset, state.phase);
  const preset = presetOf(state.preset);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(timer);
  }, [running]);

  // A phase has ended: count the focus block and start the rest, or get ready for the next block.
  useEffect(() => {
    if (!running || remainingMs > 0 || handling.current) return;
    handling.current = true;
    correctFeedback();
    if (state.phase === 'focus') {
      void recordFocus(preset.focus, true);
      setNote(`${preset.focus} minutes of focus counted. Take a ${preset.rest}-minute break.`);
      setState({ ...state, phase: 'rest', endsAt: Date.now() + phaseMs(state.preset, 'rest'), remainingMs: phaseMs(state.preset, 'rest') });
    } else {
      setNote('Break over. Ready for the next block?');
      setState({ ...state, phase: 'focus', endsAt: null, remainingMs: phaseMs(state.preset, 'focus') });
    }
    handling.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, remainingMs]);

  // The browser tab shows the clock while it runs.
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    const before = document.title;
    if (running) document.title = `${clock(remainingMs / 1000)} · ${state.phase === 'focus' ? 'Focus' : 'Break'}`;
    return () => {
      document.title = before;
    };
  }, [running, remainingMs, state.phase]);

  function start() {
    setNote(null);
    setNow(Date.now());
    setState({ ...state, endsAt: Date.now() + remainingMs });
  }

  function pause() {
    setState({ ...state, endsAt: null, remainingMs });
  }

  // Stop: a focus block stopped after 5+ minutes still counts what was done.
  function stop() {
    if (state.phase === 'focus') {
      const focused = Math.floor((fullMs - remainingMs) / 60_000);
      if (focused >= MIN_COUNTED_MINUTES) {
        void recordFocus(focused, false);
        setNote(`${focused} minutes of focus counted.`);
      } else setNote(null);
    } else setNote(null);
    setState({ ...state, phase: 'focus', endsAt: null, remainingMs: phaseMs(state.preset, 'focus') });
  }

  function choosePreset(id: FocusPresetId) {
    setNote(null);
    setState({ preset: id, phase: 'focus', endsAt: null, remainingMs: phaseMs(id, 'focus') });
  }

  const started = running || remainingMs < fullMs;
  const focusedNow = state.phase === 'focus' ? Math.floor((fullMs - remainingMs) / 60_000) : 0;

  return (
    <Screen width="content">
      <BackLink fallback={routes.learn()} />
      <PageHeader eyebrow="Study" title="Focus timer" subtitle="Study in focused blocks with short breaks. Focused minutes count for your streak and your focus goals." />
      <Card style={styles.card}>
        {!started ? (
          <SegmentedControl label="Focus and break length" options={FOCUS_PRESETS.map((item) => ({ value: item.id, label: item.label }))} value={state.preset} onChange={choosePreset} />
        ) : null}
        <View style={styles.center}>
          <ProgressRing
            value={fullMs ? 1 - remainingMs / fullMs : 0}
            size={220}
            thickness={12}
            color={state.phase === 'focus' ? colors.primary : colors.success}
            label={`${state.phase === 'focus' ? 'Focus' : 'Break'}: ${clock(remainingMs / 1000)} left`}
          >
            <View style={styles.ringInner}>
              <Text style={styles.phase}>{state.phase === 'focus' ? 'Focus' : 'Break'}</Text>
              <Text style={styles.clock} accessibilityLiveRegion="polite">{clock(remainingMs / 1000)}</Text>
              <Text style={styles.small}>{state.phase === 'focus' ? `${preset.focus} min block` : `${preset.rest} min rest`}</Text>
            </View>
          </ProgressRing>
        </View>
        {note ? <Text style={styles.note}>{note}</Text> : null}
        <View style={styles.actions}>
          {running ? (
            <Button label="Pause" variant="secondary" onPress={pause} />
          ) : (
            <Button label={started ? 'Resume' : state.phase === 'rest' ? 'Start break' : 'Start focusing'} onPress={start} size="lg" />
          )}
          {state.phase === 'rest' ? (
            <Button label="Skip break" variant="ghost" onPress={stop} />
          ) : started ? (
            <Button label={focusedNow >= MIN_COUNTED_MINUTES ? `Stop and count ${focusedNow} min` : 'Stop'} variant="ghost" onPress={stop} />
          ) : null}
        </View>
        <Text style={styles.small}>Put your phone face down and study one thing. Stopping early still counts once you have focused for {MIN_COUNTED_MINUTES} minutes.</Text>
      </Card>
      <View style={styles.stats}>
        <Stat label="Today" value={`${totals.today} min`} detail={`${totals.sessionsToday} block${totals.sessionsToday === 1 ? '' : 's'}`} styles={styles} />
        <Stat label="This week" value={`${totals.week} min`} styles={styles} />
        <Stat label="All time" value={`${totals.total} min`} styles={styles} />
      </View>
    </Screen>
  );
}

function Stat({ label, value, detail, styles }: { label: string; value: string; detail?: string; styles: ReturnType<typeof createStyles> }) {
  return (
    <Card style={styles.stat}>
      <Text style={styles.small}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
      {detail ? <Text style={styles.small}>{detail}</Text> : null}
    </Card>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: { gap: 18, maxWidth: 560 },
    center: { alignItems: 'center', paddingVertical: 8 },
    ringInner: { alignItems: 'center', gap: 2 },
    phase: { fontSize: 13, fontWeight: '700', letterSpacing: 0.6, color: colors.textSecondary },
    clock: { fontSize: 44, fontWeight: '700', color: colors.text, fontVariant: ['tabular-nums'] },
    small: { fontSize: 13, lineHeight: 18, color: colors.textSecondary },
    note: { ...Type.headline, color: colors.text, textAlign: 'center' },
    actions: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 10 },
    stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 14, maxWidth: 560 },
    stat: { flexGrow: 1, flexBasis: 140, gap: 2 },
    statValue: { fontSize: 22, fontWeight: '700', color: colors.text },
  });
}
