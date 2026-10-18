import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { BackLink } from '@/components/learning/nav-bits';
import { SimulationStepView } from '@/components/learning/simulations/simulation-step';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/interactive';
import { Pill } from '@/components/ui/pill';
import { Screen } from '@/components/ui/screen';
import { ErrorScreen } from '@/components/ui/state-views';
import { Text } from '@/components/ui/text';
import { Type, type ThemeColors } from '@/constants/theme';
import { lessonSimulation } from '@/data/simulation-library';
import { useThemedStyles } from '@/hooks/use-theme';
import { param, routes } from '@/lib/routes';

// /learn/simulation?lesson=<lesson id> — one lesson's simulation on its own
// page, opened from Physiology → Simulations. Practice only: predictions
// here are not recorded (the same simulation inside the lesson is).
export default function SimulationScreen() {
  const styles = useThemedStyles(createStyles);
  const params = useLocalSearchParams<{ lesson?: string | string[] }>();
  const lessonId = param(params.lesson);
  const found = lessonSimulation(lessonId);

  if (!found) {
    return <ErrorScreen title="Simulation not found" message="Open a simulation from Physiology → Simulations." primary={{ label: 'Back to Study', onPress: () => router.replace(routes.learn()) }} />;
  }
  const { topic, lesson, step } = found;

  return (
    <Screen width="content">
      <BackLink fallback={routes.subject(topic.subject)} />
      <Card style={styles.header}>
        <View style={styles.pills}>
          <Pill label={topic.title} tone="primary" />
          <Pill label="Practice" tone="neutral" />
        </View>
        <Text style={styles.title} accessibilityRole="header">
          {step.title}
        </Text>
        <Text style={styles.body}>{`From the lesson “${lesson.title}”. Practice only: answers here are not recorded.`}</Text>
        <View style={styles.actions}>
          <Button label="Open the lesson" size="sm" variant="secondary" onPress={() => router.push(routes.lesson(lesson.id))} />
        </View>
      </Card>
      <SimulationStepView step={step} shuffleSeed={`library:${lesson.id}`} onPredict={() => undefined} onPredictionsDone={() => undefined} />
    </Screen>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    header: { gap: 8, marginBottom: 12 },
    pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    title: { ...Type.title2, color: colors.text },
    body: { ...Type.body, color: colors.textSecondary },
    actions: { flexDirection: 'row', gap: 8, marginTop: 4 },
  });
}
