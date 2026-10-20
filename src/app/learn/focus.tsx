import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { BackLink } from '@/components/learning/nav-bits';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/interactive';
import { ProgressRing } from '@/components/ui/progress-ring';
import { PageHeader, Screen } from '@/components/ui/screen';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Text } from '@/components/ui/text';
import { Type, type ThemeColors } from '@/constants/theme';
import { clock, FOCUS_PRESETS, MIN_COUNTED_MINUTES, useFocusTotals } from '@/data/focus';
import {
  chooseFocusPreset,
  focusPhaseMs,
  focusPresetOf,
  pauseFocusTimer,
  remainingOf,
  startFocusTimer,
  stopFocusTimer,
  useFocusTimer,
} from '@/data/focus-timer';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';
import { routes } from '@/lib/routes';

// /learn/focus — a focus timer (owner's request, 2026-10-20): 25 minutes of
// study, then 5 of rest (or 50/10, 15/3). The clock itself lives in
// data/focus-timer.ts, so it keeps running in the background (another page, a
// background tab) and rings an alarm when the time is up. A finished focus block
// counts its minutes and keeps the learning streak; stopping early still counts
// once 5 minutes were focused (data/focus.ts).
export default function FocusTimerScreen() {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const totals = useFocusTotals();
  const state = useFocusTimer();
  const [now, setNow] = useState(() => Date.now());

  const running = state.endsAt !== null;
  const remainingMs = remainingOf(state, now);
  const fullMs = focusPhaseMs(state.preset, state.phase);
  const preset = focusPresetOf(state.preset);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(timer);
  }, [running]);

  // The browser tab shows the clock while it runs.
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;
    const before = document.title;
    if (running) document.title = `${clock(remainingMs / 1000)} · ${state.phase === 'focus' ? 'Focus' : 'Break'}`;
    return () => {
      document.title = before;
    };
  }, [running, remainingMs, state.phase]);

  const started = running || remainingMs < fullMs;
  const focusedNow = state.phase === 'focus' ? Math.floor((fullMs - remainingMs) / 60_000) : 0;

  return (
    <Screen width="content">
      <BackLink fallback={routes.learn()} />
      <PageHeader eyebrow="Study" title="Focus timer" subtitle="Study in focused blocks with short breaks. Focused minutes count for your streak and your focus goals." />
      <Card style={styles.card}>
        {!started ? (
          <SegmentedControl label="Focus and break length" options={FOCUS_PRESETS.map((item) => ({ value: item.id, label: item.label }))} value={state.preset} onChange={chooseFocusPreset} />
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
        {state.note ? <Text style={styles.note}>{state.note}</Text> : null}
        <View style={styles.actions}>
          {running ? (
            <Button label="Pause" variant="secondary" onPress={pauseFocusTimer} />
          ) : (
            <Button label={started ? 'Resume' : state.phase === 'rest' ? 'Start break' : 'Start focusing'} onPress={startFocusTimer} size="lg" />
          )}
          {state.phase === 'rest' ? (
            <Button label="Skip break" variant="ghost" onPress={stopFocusTimer} />
          ) : started ? (
            <Button label={focusedNow >= MIN_COUNTED_MINUTES ? `Stop and count ${focusedNow} min` : 'Stop'} variant="ghost" onPress={stopFocusTimer} />
          ) : null}
        </View>
        <View style={styles.notice} accessibilityRole="text">
          <Icon name="bell" size={18} color={colors.accentText} />
          <View style={styles.flex}>
            <Text style={styles.noticeTitle}>{running ? 'Running in the background' : 'Runs in the background'}</Text>
            <Text style={styles.small}>
              You can leave this page, open your notes or switch tabs: the timer keeps going, and an alarm rings when the time is up. Keep GrAte Apex open (and your volume up) to hear it.
            </Text>
          </View>
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
    flex: { flex: 1, minWidth: 0 },
    notice: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceMuted },
    noticeTitle: { fontSize: 14, fontWeight: '600', color: colors.text },
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
