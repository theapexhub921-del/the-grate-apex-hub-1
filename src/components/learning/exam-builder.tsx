import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { BackLink } from '@/components/learning/nav-bits';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/interactive';
import { PageHeader, Screen } from '@/components/ui/screen';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { InlineNotice, LoadingState } from '@/components/ui/state-views';
import { Text } from '@/components/ui/text';
import { Type, type ThemeColors } from '@/constants/theme';
import { useThemedStyles } from '@/hooks/use-theme';
import { routes } from '@/lib/routes';

// The shared page for the mock exam and spotter builders (/learn/mock-exam,
// /learn/spotter): a few choices, then one button that opens the paper.

export type BuilderChoice<T extends string> = {
  label: string;
  hint?: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
};

export function ExamBuilder({
  eyebrow,
  title,
  subtitle,
  ready,
  choices,
  summary,
  available,
  emptyMessage,
  startLabel,
  onStart,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  ready: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- each choice has its own value type
  choices: BuilderChoice<any>[];
  summary: string;
  available: number;
  emptyMessage: string;
  startLabel: string;
  onStart: () => void;
  children?: ReactNode;
}) {
  const styles = useThemedStyles(createStyles);
  return (
    <Screen width="content">
      <BackLink fallback={routes.learn()} />
      <PageHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />
      {!ready ? (
        <LoadingState label="Loading the questions…" />
      ) : (
        <Card style={styles.card}>
          {choices.map((choice) => (
            <View key={choice.label} style={styles.choice}>
              <Text style={styles.label}>{choice.label}</Text>
              {choice.hint ? <Text style={styles.hint}>{choice.hint}</Text> : null}
              <SegmentedControl label={choice.label} options={choice.options} value={choice.value} onChange={choice.onChange} />
            </View>
          ))}
          {children}
          {available === 0 ? (
            <InlineNotice tone="warning" message={emptyMessage} />
          ) : (
            <Text style={styles.summary}>{summary}</Text>
          )}
          <View style={styles.actions}>
            <Button label="Back" variant="ghost" onPress={() => (router.canGoBack() ? router.back() : router.replace(routes.learn()))} />
            <Button label={startLabel} trailing="→" size="lg" onPress={onStart} disabled={available === 0} />
          </View>
        </Card>
      )}
    </Screen>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: { gap: 18, maxWidth: 640 },
    choice: { gap: 6 },
    label: { ...Type.headline, color: colors.text },
    hint: { fontSize: 13, lineHeight: 18, color: colors.textSecondary },
    summary: { fontSize: 14, lineHeight: 20, color: colors.textSecondary },
    actions: { flexDirection: 'row', justifyContent: 'flex-end', flexWrap: 'wrap', gap: 10 },
  });
}
