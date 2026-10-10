import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card, Interactive } from '@/components/ui/interactive';
import { PageHeader, Screen } from '@/components/ui/screen';
import { Radius, type ThemeColors, Type } from '@/constants/theme';
import { EXPERIENCE_INFO, EXPERIENCES, type ExperienceId, isExperience, saveExperience } from '@/data/experience';
import { useAuth } from '@/hooks/use-auth';
import { useThemedStyles } from '@/hooks/use-theme';

// /choose-experience — hidden. The route guard sends a learner here when the
// experience switch is on and they have not chosen yet (there is no default).
// Settings → Experience opens the same choice later.
export default function ChooseExperienceScreen() {
  const styles = useThemedStyles(createStyles);
  const { user } = useAuth();
  const saved = isExperience(user?.profile?.experience) ? user?.profile?.experience : null;
  const [choice, setChoice] = useState<ExperienceId | null>(saved ?? null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    if (!choice || saving) return;
    setSaving(true);
    setError(null);
    try {
      await saveExperience(choice);
      router.replace('/');
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : 'Your experience could not be saved.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen width="content" contentStyle={styles.page}>
      <PageHeader eyebrow="Your app" title="Choose your experience" subtitle="This changes how the app looks and is laid out — not your account, progress, friends, messages, achievements or XP. You can change it any time in Settings." />
      <View style={styles.list} accessibilityRole="radiogroup">
        {EXPERIENCES.map((id) => {
          const selected = choice === id;
          return (
            <Interactive key={id} onPress={() => setChoice(id)} accessibilityRole="radio" accessibilityState={{ selected }} accessibilityLabel={`${EXPERIENCE_INFO[id].name}: ${EXPERIENCE_INFO[id].summary}`}>
              <Card style={[styles.option, selected ? styles.selected : null]}>
                <Text style={styles.name}>{EXPERIENCE_INFO[id].name}</Text>
                <Text style={styles.summary}>{EXPERIENCE_INFO[id].summary}</Text>
              </Card>
            </Interactive>
          );
        })}
      </View>
      {error ? <Text style={styles.error} accessibilityRole="alert">{error}</Text> : null}
      <Button label="Continue" size="lg" fullWidth disabled={!choice} loading={saving} onPress={() => void confirm()} />
    </Screen>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    page: { paddingBottom: 120, gap: 14 },
    list: { gap: 10 },
    option: { gap: 4, borderWidth: 2, borderColor: 'transparent', borderRadius: Radius.lg },
    selected: { borderColor: colors.primary },
    name: { ...Type.headline, color: colors.text },
    summary: { fontSize: 13.5, lineHeight: 19, color: colors.textSecondary },
    error: { fontSize: 13, color: colors.error },
  });
}
