import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { DrillLaunchers, WhyCards } from '@/components/learning/anatomy-drills';
import { BackLink } from '@/components/learning/nav-bits';
import { Interactive } from '@/components/ui/interactive';
import { PageHeader, Screen, SectionHeader } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import type { ThemeColors } from '@/constants/theme';
import { allDrills, drillsFor } from '@/data/anatomy-drills';
import { getTopic } from '@/data/curriculum';
import { useThemedStyles } from '@/hooks/use-theme';
import { param, routes } from '@/lib/routes';

// /learn/anatomy-drills[?topic=<topic id>] — learning where things are without
// reading lists (owner, 2026-10-28): "Stack the layers" and "What gets hit?"
// (run as quizzes, so answers count for memory and Review) and "Why is it
// there?" flip cards. Everything is written from the topic's own lessons.
export default function AnatomyDrillsScreen() {
  const styles = useThemedStyles(createStyles);
  const params = useLocalSearchParams<{ topic?: string | string[] }>();
  const drills = drillsFor(param(params.topic)) ?? allDrills[0];
  const topic = getTopic(drills.topicId);

  return (
    <Screen width="learning">
      <BackLink fallback={'/learn' as never} />
      <PageHeader
        eyebrow="Gross anatomy"
        title="Anatomy drills"
        subtitle="Reading where things lie is the slow way to learn it. Here you build the order yourself, reason out what an injury would hit, and learn the reason behind each position."
      />
      <View style={styles.topics} accessibilityRole="tablist">
        {allDrills.map((item) => {
          const on = item.topicId === drills.topicId;
          return (
            <Interactive
              key={item.topicId}
              onPress={() => router.setParams({ topic: item.topicId })}
              accessibilityRole="tab"
              accessibilityState={{ selected: on }}
              style={({ hovered }) => [styles.chip, on && styles.chipOn, hovered && !on && styles.chipHover]}
            >
              <Text style={[styles.chipText, on && styles.chipTextOn]}>{getTopic(item.topicId)?.title ?? item.topicId}</Text>
            </Interactive>
          );
        })}
      </View>
      <SectionHeader title={topic?.title ?? 'Drills'} subtitle="Answers count towards your memory of each idea, like any quiz." right={topic ? <Text style={styles.link} onPress={() => router.push(routes.topic(topic.id))}>Open topic</Text> : undefined} />
      <DrillLaunchers drills={drills} hideWhy />
      <SectionHeader title="Why is it there?" subtitle="Think of the reason first, then reveal it." style={styles.section} />
      <WhyCards key={drills.topicId} cards={drills.why} />
    </Screen>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    topics: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
    chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
    chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
    chipHover: { borderColor: colors.primaryBorder },
    chipText: { fontSize: 13, fontWeight: '600', color: colors.text },
    chipTextOn: { color: colors.onPrimary },
    section: { marginTop: 18 },
    link: { fontSize: 13, fontWeight: '700', color: colors.primaryText },
  });
}
