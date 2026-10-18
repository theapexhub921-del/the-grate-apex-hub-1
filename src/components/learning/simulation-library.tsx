import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/interactive';
import { List, ListRow } from '@/components/ui/list';
import { SectionHeader } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { Type, type ThemeColors } from '@/constants/theme';
import type { SubjectId } from '@/data/lesson-types';
import { simulationLibrary } from '@/data/simulation-library';
import { useThemedStyles } from '@/hooks/use-theme';
import { routes } from '@/lib/routes';

// The Simulations tab (Physiology): every lesson simulation, grouped by
// topic in course order. Each opens on its own page (/learn/simulation).
export function SimulationLibrary({ subject = 'physiology' }: { subject?: SubjectId }) {
  const styles = useThemedStyles(createStyles);
  const groups = useMemo(() => simulationLibrary(subject), [subject]);
  const total = groups.reduce((sum, group) => sum + group.items.length, 0);

  if (!total) {
    return (
      <Card tone="insight" style={styles.intro}>
        <Text style={styles.title}>Simulations are on the way</Text>
        <Text style={styles.body}>Interactive models of each lesson will appear here as they are built.</Text>
      </Card>
    );
  }

  return (
    <View style={styles.wrap}>
      <Card style={styles.intro}>
        <Text style={styles.title}>Simulations</Text>
        <Text style={styles.body}>
          Change one thing and watch what happens. Each model starts with a few predictions, then lets you explore situations from the lecture and try its challenges. {total} simulations so far.
        </Text>
      </Card>
      {groups.map((group) => (
        <View key={group.topic.id} style={styles.group}>
          <SectionHeader title={group.topic.title} subtitle={`${group.items.length} simulation${group.items.length === 1 ? '' : 's'}`} />
          <List accessibilityLabel={`${group.topic.title} simulations`}>
            {group.items.map((item) => (
              <ListRow
                key={item.lesson.id}
                title={item.name}
                detail={item.lesson.title}
                onPress={() => router.push(routes.simulation(item.lesson.id))}
                accessibilityLabel={`${item.name}, from the lesson ${item.lesson.title}`}
              />
            ))}
          </List>
        </View>
      ))}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    wrap: { gap: 18 },
    group: { gap: 8 },
    intro: { gap: 6 },
    title: { ...Type.headline, color: colors.text },
    body: { ...Type.body, color: colors.textSecondary },
  });
}
