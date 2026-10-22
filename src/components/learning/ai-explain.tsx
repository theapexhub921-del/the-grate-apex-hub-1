import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/interactive';
import { InlineNotice } from '@/components/ui/state-views';
import { Text, TextInput } from '@/components/ui/text';
import { Radius, Type, type ThemeColors } from '@/constants/theme';
import type { AiLessonText } from '@/data/ai-context';
import { newAiChatId } from '@/data/ai-chat-history';
import { saveTutorChat } from '@/data/tutor-chats';
import { AiError, type ChatTurn, type ExplainItem, explainWithAi } from '@/lib/ai-study-api';
import { MarkdownMessage } from '@/components/chat/markdown-message';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';

// "Explain with AI" — a small button under a quiz answer, a reviewed answer or a
// flashcard. It asks /api/ai (mode 'explain') why the right answer is right and,
// when the learner got it wrong, why their pick was not, using the lesson's own
// lecture text. Follow-up questions stay in the same little thread.

const firstQuestion = (item: ExplainItem) =>
  item.kind === 'card'
    ? 'Explain this flashcard to me.'
    : item.picked
      ? 'Why is my answer wrong, and why is the correct answer right?'
      : 'Explain why this answer is correct.';

export function AiExplain({
  item,
  getLesson,
  label,
}: {
  item: ExplainItem;
  /** Finds the lecture text to explain from (null: the AI says it is going beyond the slides). */
  getLesson?: () => Promise<AiLessonText | null>;
  label?: string;
}) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lesson = useRef<Promise<AiLessonText | null> | null>(null);
  // Saved to the learner's AI chats (Study chat → Recent AI chats), one thread per opening.
  const saved = useRef<{ id: string; createdAt: string } | null>(null);
  const busyRef = useRef(false);
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; };
  }, []);

  async function ask(question: string, history: ChatTurn[]) {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setError(null);
    setTurns([...history, { role: 'user', text: question }]);
    try {
      if (!lesson.current) lesson.current = getLesson ? getLesson().catch(() => null) : Promise.resolve(null);
      const context = await lesson.current;
      const answer = await explainWithAi(context ? { title: context.title, text: context.text } : null, item, question, history);
      const finished: ChatTurn[] = [...history, { role: 'user', text: question }, { role: 'model', text: answer }];
      if (alive.current) setTurns(finished);
      saved.current ??= { id: newAiChatId('explain'), createdAt: new Date().toISOString() };
      void saveTutorChat({
        id: saved.current.id,
        createdAt: saved.current.createdAt,
        turns: finished,
        context: { kind: 'explain', item, ...(context ? { lessonId: context.id, lessonTitle: context.title } : {}) },
      }).catch(() => undefined); // a failed save never interrupts the explanation
    } catch (problem) {
      if (alive.current) {
        setTurns(history);
        setError(problem instanceof AiError ? problem.message : 'The AI could not answer right now. Please try again.');
      }
    } finally {
      busyRef.current = false;
      if (alive.current) setBusy(false);
    }
  }

  function start() {
    setOpen(true);
    if (!turns.length) void ask(firstQuestion(item), []);
  }

  function followUp() {
    const question = draft.trim();
    if (!question || busy) return;
    setDraft('');
    void ask(question, turns);
  }

  if (!open) {
    return (
      <Button
        label={label ?? (item.kind === 'card' ? 'Ask AI about this card' : item.picked ? 'Explain my mistake with AI' : 'Explain with AI')}
        variant="secondary"
        size="sm"
        icon={<Icon name="sparkle" size={15} color={colors.primaryText} />}
        onPress={start}
        style={styles.openButton}
        accessibilityHint="The AI explains this answer using your lecture notes"
      />
    );
  }

  // The first question is asked for the learner, so it is not shown as a bubble.
  const shown = turns.slice(1);
  return (
    <Card tone="muted" style={styles.box}>
      <View style={styles.head}>
        <Icon name="sparkle" size={15} color={colors.primaryText} />
        <Text style={styles.title}>AI explanation</Text>
        <Button label="Hide" variant="ghost" size="sm" onPress={() => setOpen(false)} />
      </View>
      {shown.map((turn, i) => (
        <View key={i} style={turn.role === 'user' ? styles.userTurn : styles.modelTurn}>
          {turn.role === 'user' ? <Text style={styles.who}>You asked</Text> : null}
          {turn.role === 'user' ? <Text selectable style={styles.userText}>{turn.text}</Text> : <MarkdownMessage text={turn.text} />}
        </View>
      ))}
      {busy ? <Text style={styles.thinking}>Thinking…</Text> : null}
      {error ? <InlineNotice tone="error" message={error} /> : null}
      {error && !turns.length ? <Button label="Try again" size="sm" variant="secondary" onPress={() => void ask(firstQuestion(item), [])} /> : null}
      {turns.length > 1 ? (
        <View style={styles.composer}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Ask a follow-up question"
            placeholderTextColor={colors.textTertiary}
            accessibilityLabel="Ask the AI a follow-up question"
            multiline
            maxLength={1000}
            style={styles.input}
          />
          <Button label="Ask" size="sm" onPress={followUp} loading={busy} disabled={busy || !draft.trim()} />
        </View>
      ) : null}
      <Text style={styles.note}>AI can make mistakes. Check important points against your lecture notes. Saved in Learn → Study chat → Recent AI chats.</Text>
    </Card>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    openButton: { alignSelf: 'flex-start', marginTop: 6 },
    box: { gap: 10, padding: 14, marginTop: 8 },
    head: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    title: { ...Type.headline, flex: 1, color: colors.text },
    who: { ...Type.overline, color: colors.primaryText },
    modelTurn: { gap: 2 },
    userTurn: { gap: 2, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: colors.primaryBorder },
    message: { fontSize: 14.5, lineHeight: 22, color: colors.text },
    userText: { fontSize: 14, lineHeight: 20, color: colors.textSecondary },
    thinking: { fontSize: 14, color: colors.textSecondary },
    composer: { gap: 8 },
    input: { minHeight: 52, borderWidth: 1, borderColor: colors.borderStrong, borderRadius: Radius.md, backgroundColor: colors.surfaceSunken, padding: 10, color: colors.text, fontSize: 14, textAlignVertical: 'top' },
    note: { fontSize: 12, color: colors.textTertiary },
  });
}
