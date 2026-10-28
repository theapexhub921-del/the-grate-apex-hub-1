// Anatomy drills (2026-10-28): learning where things are without reading
// lists. "Stack the layers" and "What gets hit?" run in the quiz engine
// (/learn/quiz?exam=drill…); "Why is it there?" are flip cards here, each
// with "Ask AI more". Content: src/data/anatomy-drills/.
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AiQuestionButton } from '@/components/learning/ai-study';
import { Button } from '@/components/ui/button';
import { Icon, type IconName } from '@/components/ui/icon';
import { Card, Interactive } from '@/components/ui/interactive';
import { Text } from '@/components/ui/text';
import type { ThemeColors } from '@/constants/theme';
import { lessonToText } from '@/data/ai-study';
import type { TopicDrills, WhyCard } from '@/data/anatomy-drills';
import { findLesson } from '@/data/curriculum';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';
import { routes } from '@/lib/routes';

/** The three ways in, for one topic (drills page and topic page). */
export function DrillLaunchers({ drills, compact, hideWhy }: { drills: TopicDrills; compact?: boolean; hideWhy?: boolean }) {
  const styles = useThemedStyles(createStyles);
  const items: { icon: IconName; title: string; detail: string; count: number; onPress: () => void }[] = [
    {
      icon: 'grid',
      title: 'Stack the layers',
      detail: 'Put structures in order — front to back, outside in, along a route.',
      count: drills.layers.length,
      onPress: () => router.push(routes.exam({ kind: 'drill', topic: drills.topicId, drill: 'layers' })),
    },
    {
      icon: 'warning',
      title: 'What gets hit?',
      detail: 'An injury, a needle, a blockage: work out what it reaches or what follows.',
      count: drills.cases.length,
      onPress: () => router.push(routes.exam({ kind: 'drill', topic: drills.topicId, drill: 'cases' })),
    },
    {
      icon: 'info',
      title: 'Why is it there?',
      detail: 'The reason behind a position. Reasons stick far better than lists.',
      count: drills.why.length,
      onPress: () => router.push(routes.anatomyDrills(drills.topicId)),
    },
  ];
  return (
    <View style={[styles.launchers, compact && styles.launchersCompact]}>
      {items.filter((item) => !(hideWhy && item.title === 'Why is it there?')).map((item) => (
        <LaunchRow key={item.title} icon={item.icon} title={item.title} detail={item.detail} count={item.count} onPress={item.onPress} compact={compact} />
      ))}
    </View>
  );
}

function LaunchRow({ icon, title, detail, count, onPress, compact }: { icon: IconName; title: string; detail: string; count: number; onPress: () => void; compact?: boolean }) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  return (
    <Interactive
      onPress={onPress}
      disabled={count === 0}
      accessibilityLabel={`${title}: ${count}`}
      style={({ hovered }) => [styles.launch, hovered && styles.launchHover]}
    >
      <View style={styles.launchIcon}>
        <Icon name={icon} size={18} color={colors.primaryText} />
      </View>
      <View style={styles.flex}>
        <Text style={styles.launchTitle}>{title}</Text>
        {!compact ? <Text style={styles.muted}>{detail}</Text> : null}
      </View>
      <Text style={styles.count}>{count}</Text>
      <Icon name="chevronRight" size={16} color={colors.textTertiary} />
    </Interactive>
  );
}

/** "Why is it there?": one card at a time — think of the reason, then reveal it. */
export function WhyCards({ cards }: { cards: readonly WhyCard[] }) {
  const styles = useThemedStyles(createStyles);
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(false);
  const [knew, setKnew] = useState<Record<string, boolean>>({});
  const card = cards[Math.min(index, cards.length - 1)];
  const lesson = card ? findLesson(card.lessonId)?.lesson : undefined;
  const aiLesson = useMemo(() => (lesson ? { id: lesson.id, title: lesson.title, text: lessonToText(lesson) } : null), [lesson]);
  if (!card) return null;
  const rated = Object.keys(knew).length;
  const known = Object.values(knew).filter(Boolean).length;

  function go(next: number) {
    setIndex((next + cards.length) % cards.length);
    setShown(false);
  }

  function rate(value: boolean) {
    setKnew((previous) => ({ ...previous, [card.id]: value }));
    go(index + 1);
  }

  return (
    <Card style={styles.why}>
      <View style={styles.whyHead}>
        <Text style={styles.kicker}>
          WHY IS IT THERE? · {index + 1} OF {cards.length}
        </Text>
        {rated > 0 ? <Text style={styles.muted}>{known} of {rated} known</Text> : null}
      </View>
      <Text style={styles.whyQuestion}>{card.question}</Text>
      {lesson ? <Text style={styles.muted}>From {lesson.title}</Text> : null}
      {shown ? (
        <>
          <View style={styles.answer}>
            <Text style={styles.answerText}>{card.answer}</Text>
          </View>
          <View style={styles.row}>
            <Button label="I knew it" size="sm" onPress={() => rate(true)} />
            <Button label="Not yet" size="sm" variant="secondary" onPress={() => rate(false)} />
            {aiLesson ? (
              <AiQuestionButton
                lesson={aiLesson}
                focus={card.question}
                question={`${card.question} Explain the reason from the lecture in a few simple steps, then give me one way to remember it.`}
                label="Ask AI more"
                title="Why is it there?"
                hint="Ask AI explains the reason using this lesson"
              />
            ) : null}
          </View>
        </>
      ) : (
        <View style={styles.row}>
          <Button label="Show the reason" size="sm" onPress={() => setShown(true)} />
          <Text style={styles.muted}>Say your reason out loud first.</Text>
        </View>
      )}
      <View style={styles.row}>
        <Button label="Previous" size="sm" variant="ghost" onPress={() => go(index - 1)} />
        <Button label="Next" size="sm" variant="ghost" onPress={() => go(index + 1)} />
      </View>
    </Card>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    flex: { flex: 1, minWidth: 0 },
    launchers: { gap: 8 },
    launchersCompact: { gap: 4 },
    launch: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
    launchHover: { borderColor: colors.primaryBorder },
    launchIcon: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceMuted },
    launchTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
    count: { fontSize: 13, fontWeight: '700', color: colors.textSecondary },
    muted: { fontSize: 12.5, lineHeight: 18, color: colors.textSecondary },
    kicker: { fontSize: 11, fontWeight: '800', letterSpacing: 1.1, color: colors.textTertiary },
    why: { gap: 10 },
    whyHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
    whyQuestion: { fontSize: 17, lineHeight: 24, fontWeight: '700', color: colors.text },
    answer: { padding: 12, borderRadius: 8, backgroundColor: colors.surfaceMuted },
    answerText: { fontSize: 15, lineHeight: 22, color: colors.text },
    row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  });
}
