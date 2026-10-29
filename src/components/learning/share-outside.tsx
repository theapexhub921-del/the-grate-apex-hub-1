// "Share outside the app" (owner, 2026-10-29): a question or a finished quiz sent
// to WhatsApp, Instagram or anywhere, as a picture with the GrAte Apex logo plus
// a link that opens it in the app (data/share-card-rules.ts, lib/share-card.ts).
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import type { ThemeColors } from '@/constants/theme';
import { getTopic } from '@/data/curriculum';
import type { Question } from '@/data/questions';
import { questionShareCard, quizShareCard, type ShareCard } from '@/data/share-card-rules';
import { getSubjectInfo } from '@/data/subjects';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';
import { LIVE_SITE } from '@/lib/live-site';
import { routes } from '@/lib/routes';
import { shareCardOutside, shareNotice } from '@/lib/share-card';

/** "Anatomy · Upper Limb" for a question or topic. */
export function shareWhere(topicId: string | undefined, fallback = 'Question'): string {
  const topic = getTopic(topicId);
  if (!topic) return fallback;
  return `${getSubjectInfo(topic.subject)?.name ?? topic.subject} · ${topic.title}`;
}

/** The full link that opens these questions in the app (as a practice quiz). */
export const shareLink = (questionIds: string[]) => `${LIVE_SITE}${String(routes.practice(questionIds))}`;

function ShareButton({ build, label }: { build: () => ShareCard; label: string }) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function share() {
    if (busy) return;
    setBusy(true);
    setNotice(null);
    try {
      setNotice(shareNotice(await shareCardOutside(build())));
    } catch {
      setNotice('Could not share right now. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.wrap}>
      <Button
        label={label}
        size="sm"
        variant="ghost"
        icon={<Icon name="share" size={14} color={colors.primaryText} />}
        onPress={() => void share()}
        loading={busy}
        accessibilityHint="Sends a picture with the GrAte Apex logo and a link to WhatsApp or another app"
      />
      {notice ? <Text style={styles.notice}>{notice}</Text> : null}
    </View>
  );
}

/** Under an answered question. */
export function ShareQuestionButton({ question }: { question: Question }) {
  return <ShareButton label="Share outside the app" build={() => questionShareCard(question, shareWhere(question.topicId), shareLink([question.id]))} />;
}

/** On the results page: the same questions, so a friend can take the same quiz. */
export function ShareQuizButton(props: { title: string; topicId?: string; questionIds: string[]; score: number; total: number; timeLabel?: string }) {
  return (
    <ShareButton
      label="Share this quiz"
      build={() =>
        quizShareCard({
          title: props.title,
          where: shareWhere(props.topicId, 'Quiz'),
          score: props.score,
          total: props.total,
          timeLabel: props.timeLabel,
          url: shareLink(props.questionIds),
        })
      }
    />
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    wrap: { gap: 4, alignItems: 'flex-start' },
    notice: { fontSize: 12.5, lineHeight: 18, color: colors.textSecondary },
  });
}
