// Memory map on a topic page (2026-10-28): every concept as a tile, lesson by
// lesson, coloured by its memory state and filled by the mastery estimate, so
// the learner can see at a glance what is solid and what is fading. Tap a tile
// to see the concept; tap a lesson to open it.
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { MemoryHookBox } from '@/components/learning/memory-hook';
import { MemoryStateBadge, stateColor } from '@/components/learning/memory-ui';
import { Button } from '@/components/ui/button';
import { Card, Interactive } from '@/components/ui/interactive';
import { Text } from '@/components/ui/text';
import type { ThemeColors } from '@/constants/theme';
import { conceptKey, isTrackableConcept } from '@/data/curriculum';
import type { Topic } from '@/data/lesson-types';
import type { MemoryModel } from '@/data/learning/memory';
import { MEMORY_STATE_LABEL } from '@/data/learning/memory';
import { mapFocus, memoryMap, type MapCell } from '@/data/learning/memory-map';
import type { MemoryState } from '@/data/learning/scheduler';
import { describeDue } from '@/data/learning/time';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';
import { routes } from '@/lib/routes';

const LEGEND: MemoryState[] = ['mastered', 'remembered', 'learning', 'struggling', 'new'];

export function MemoryMap({ topic, memory, now }: { topic: Topic; memory: MemoryModel; now: number }) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const [selected, setSelected] = useState<MapCell | null>(null);
  const rows = useMemo(
    () =>
      memoryMap(
        topic.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          concepts: lesson.concepts.filter(isTrackableConcept).map((concept) => ({ key: conceptKey(topic.id, concept.id), name: concept.name })),
        })),
        (key) => memory.concepts.get(key)
      ),
    [topic, memory]
  );
  const focus = useMemo(() => mapFocus(rows), [rows]);
  if (rows.length === 0) return null;
  const started = rows.some((row) => row.cells.some((cell) => cell.state !== 'new'));

  return (
    <Card style={styles.card}>
      <Text style={styles.kicker}>MEMORY MAP</Text>
      <Text style={styles.muted}>
        {started ? 'Each square is one idea. Fuller squares are better remembered.' : 'Each square is one idea from this topic. They fill in as you learn and review.'}
      </Text>
      {rows.map((row) => (
        <View key={row.lessonId} style={styles.row}>
          <Interactive
            onPress={() => router.push(routes.lesson(row.lessonId, { layer: 'read' }))}
            accessibilityRole="link"
            accessibilityLabel={`${row.title}: ${Math.round(row.strength * 100)}% remembered`}
            style={({ hovered }) => [styles.rowHead, hovered && styles.rowHover]}
          >
            <Text style={styles.rowTitle} numberOfLines={1}>{row.title}</Text>
            <Text style={styles.rowPct}>{Math.round(row.strength * 100)}%</Text>
          </Interactive>
          <View style={styles.cells}>
            {row.cells.map((cell) => {
              const tint = stateColor(colors, cell.state);
              const on = selected?.key === cell.key;
              return (
                <Interactive
                  key={cell.key}
                  onPress={() => setSelected(on ? null : cell)}
                  accessibilityLabel={`${cell.name}: ${MEMORY_STATE_LABEL[cell.state]}${cell.due ? ', due' : ''}`}
                  style={[styles.cell, { borderColor: tint }, on && styles.cellOn]}
                >
                  <View style={[styles.fill, { backgroundColor: tint, height: `${Math.max(cell.state === 'new' ? 0 : 18, cell.mastery * 100)}%` }]} />
                  {cell.due ? <View style={[styles.dueDot, { backgroundColor: colors.warningStrong }]} /> : null}
                </Interactive>
              );
            })}
          </View>
        </View>
      ))}
      {selected ? (
        <View style={styles.detail} accessibilityLiveRegion="polite">
          <Text style={styles.detailName}>{selected.name}</Text>
          <MemoryStateBadge state={selected.state} due={selected.due} />
          <Text style={styles.muted}>
            {selected.state === 'new'
              ? 'Not studied yet.'
              : `About ${Math.round(selected.mastery * 100)}% remembered${selected.dueAt ? ` · back for review ${describeDue(selected.dueAt, now)}` : ''}.`}
          </Text>
          <MemoryHookBox key={selected.key} conceptKey={selected.key} concept={selected.name} />
        </View>
      ) : focus.length > 0 ? (
        <View style={styles.detail}>
          <Text style={styles.muted}>Start with: {focus.map((cell) => cell.name).join(' · ')}</Text>
        </View>
      ) : null}
      <View style={styles.legend}>
        {LEGEND.map((state) => (
          <View key={state} style={styles.legendItem}>
            <View style={[styles.legendSwatch, { backgroundColor: stateColor(colors, state) }]} />
            <Text style={styles.legendText}>{MEMORY_STATE_LABEL[state]}</Text>
          </View>
        ))}
      </View>
      {focus.length > 0 ? (
        <Button label="Review the faded ones" size="sm" variant="secondary" onPress={() => router.push(routes.review({ topicId: topic.id, focus: 'weak' }))} />
      ) : null}
    </Card>
  );
}

const CELL = 22;

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: { gap: 10 },
    kicker: { fontSize: 11, fontWeight: '800', letterSpacing: 1.1, color: colors.textTertiary },
    muted: { fontSize: 12.5, lineHeight: 18, color: colors.textSecondary },
    row: { gap: 5 },
    rowHead: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 6 },
    rowHover: { backgroundColor: colors.surfaceMuted },
    rowTitle: { flex: 1, fontSize: 13, fontWeight: '600', color: colors.text },
    rowPct: { fontSize: 12, fontWeight: '700', color: colors.textSecondary },
    cells: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
    cell: { width: CELL, height: CELL, borderRadius: 5, borderWidth: 1.5, overflow: 'hidden', justifyContent: 'flex-end', backgroundColor: colors.surface },
    cellOn: { borderWidth: 2.5, borderColor: colors.text },
    fill: { width: '100%', opacity: 0.85 },
    dueDot: { position: 'absolute', top: 2, right: 2, width: 5, height: 5, borderRadius: 3 },
    detail: { gap: 6, padding: 10, borderRadius: 8, backgroundColor: colors.surfaceMuted },
    detailName: { fontSize: 14, fontWeight: '700', color: colors.text },
    legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    legendSwatch: { width: 10, height: 10, borderRadius: 3 },
    legendText: { fontSize: 11.5, color: colors.textSecondary },
  });
}
