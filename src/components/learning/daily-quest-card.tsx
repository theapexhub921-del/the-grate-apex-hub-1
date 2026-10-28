// The daily quest (2026-10-28): three small steps a day — the Daily 10, label a
// diagram, finish a lesson / quiz / sprint — and XP once all three are done.
// Ticks live on this device for today (data/daily-quest.ts); the reward is paid
// once a day through the XP ledger (practice:daily-quest:<day>).
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Card, Interactive } from '@/components/ui/interactive';
import { Text } from '@/components/ui/text';
import type { ThemeColors } from '@/constants/theme';
import { DAILY_QUEST_XP, dailyQuest, type QuestStep } from '@/data/learning/daily-practice';
import { questAwardId, useQuestMarks } from '@/data/daily-quest';
import { awardXp, useProgress } from '@/data/progress';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';

export function DailyQuestCard({ onStep }: { onStep: (step: QuestStep['id']) => void }) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const marks = useQuestMarks();
  const progress = useProgress();
  const [claiming, setClaiming] = useState(false);
  const quest = dailyQuest(marks);
  const claimed = progress.awardedKeys.includes(`practice:${questAwardId(marks.day)}`);
  const doneCount = quest.steps.filter((step) => step.done).length;

  async function claim() {
    if (claiming || claimed || !quest.complete) return;
    setClaiming(true);
    try {
      await awardXp({ sourceType: 'practice', sourceId: questAwardId(marks.day), amount: DAILY_QUEST_XP, label: 'Daily quest' });
    } finally {
      setClaiming(false);
    }
  }

  return (
    <Card style={styles.card}>
      <View style={styles.head}>
        <View style={styles.flex}>
          <Text style={styles.kicker}>TODAY&apos;S QUEST</Text>
          <Text style={styles.title}>
            {claimed ? 'Quest complete. See you tomorrow.' : quest.complete ? 'All done: claim your reward' : `${doneCount} of 3 done`}
          </Text>
        </View>
        {quest.complete && !claimed ? (
          <Button label={`Claim +${DAILY_QUEST_XP} XP`} size="sm" variant="gold" onPress={() => void claim()} loading={claiming} />
        ) : (
          <Text style={styles.reward}>{claimed ? `+${DAILY_QUEST_XP} XP earned` : `+${DAILY_QUEST_XP} XP`}</Text>
        )}
      </View>
      <View style={styles.steps}>
        {quest.steps.map((step) => (
          <Interactive
            key={step.id}
            onPress={step.done ? undefined : () => onStep(step.id)}
            disabled={step.done}
            dimDisabled={false}
            accessibilityLabel={`${step.label}${step.done ? ', done' : ''}`}
            style={({ hovered }) => [styles.step, hovered && !step.done && styles.stepHover]}
          >
            <View style={[styles.tick, step.done && styles.tickOn]}>
              {step.done ? <Icon name="check" size={13} color="#FFFFFF" /> : null}
            </View>
            <Text style={[styles.stepText, step.done && styles.stepDone]}>{step.label}</Text>
            {!step.done ? <Icon name="chevronRight" size={16} color={colors.textTertiary} /> : null}
          </Interactive>
        ))}
      </View>
    </Card>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: { gap: 10 },
    head: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    flex: { flex: 1 },
    kicker: { fontSize: 11, fontWeight: '800', letterSpacing: 1.1, color: colors.textTertiary },
    title: { fontSize: 16, fontWeight: '700', color: colors.text, marginTop: 2 },
    reward: { fontSize: 13, fontWeight: '700', color: colors.textSecondary },
    steps: { gap: 4 },
    step: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, paddingHorizontal: 6, borderRadius: 8 },
    stepHover: { backgroundColor: colors.surfaceMuted },
    tick: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 1.5,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    tickOn: { backgroundColor: colors.success, borderColor: colors.success },
    stepText: { flex: 1, fontSize: 14, color: colors.text },
    stepDone: { color: colors.textSecondary, textDecorationLine: 'line-through' },
  });
}
