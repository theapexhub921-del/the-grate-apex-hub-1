import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { MarkdownMessage } from '@/components/chat/markdown-message';
import { BackLink } from '@/components/learning/nav-bits';
import { Icon } from '@/components/ui/icon';
import { Card, Interactive } from '@/components/ui/interactive';
import { Pill } from '@/components/ui/pill';
import { PageHeader, Screen, SectionHeader } from '@/components/ui/screen';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { InlineNotice } from '@/components/ui/state-views';
import { Text, TextInput } from '@/components/ui/text';
import { Radius, Type, type ThemeColors } from '@/constants/theme';
import { aiLessonById } from '@/data/ai-context';
import { type AiChatContext, type AiChatKind, AI_CHAT_LABEL, canContinue, newAiChatId } from '@/data/ai-chat-history';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';
import { askStudyChat } from '@/lib/ai-chat-api';
import { AiError, askLessonAi, type ChatTurn, explainWithAi } from '@/lib/ai-study-api';
import {
  deleteTutorChat,
  getTutorChat,
  listTutorChats,
  saveTutorChat,
  type TutorChatSummary,
} from '@/data/tutor-chats';

// Study chat: ask the AI anything, not tied to a lesson. It is also the home of
// every saved AI chat in the app ("Recent AI chats"): Study chats, Ask AI in
// lessons, "Explain with AI" threads and Voice tutor sessions, all saved to the
// learner's account (data/tutor-chats.ts, data/ai-chat-history.ts). Any of them
// except a voice call can be opened here and continued.

const PROBLEM = 'A problem occurred. Please retry your message.';
const STUDY: AiChatContext = { kind: 'study' };

// A message whose answer failed, kept so it can be sent again.
type FailedMessage = { message: string; history: ChatTurn[] };

type Filter = 'all' | AiChatKind;
const FILTERS: readonly { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'study', label: 'Study' },
  { value: 'lesson', label: 'Lessons' },
  { value: 'explain', label: 'Explain' },
  { value: 'voice', label: 'Voice' },
];

const MODEL_NAME: Record<AiChatKind, string> = { study: 'Apex', lesson: 'Ask AI', explain: 'AI explanation', voice: 'Voice tutor' };

const SUGGESTIONS = [
  'Explain glycolysis like I am new to it',
  'Make me a 7-day study plan for my exams',
  'Give me a memory trick for the cranial nerves',
  'Quiz me on basic medical chemistry',
];

function formatDate(iso: string | null) {
  if (!iso) return 'Just now';
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Asks the right AI for the kind of chat that is open. */
async function answerFor(context: AiChatContext, message: string, history: ChatTurn[]): Promise<string> {
  if (context.kind === 'lesson') {
    const lesson = await aiLessonById(context.lessonId);
    if (!lesson) throw new AiError('That lesson could not be loaded right now, so this chat cannot continue. Check your connection.');
    return askLessonAi({ title: lesson.title, text: lesson.text }, message, history);
  }
  if (context.kind === 'explain' && context.item) {
    const lesson = await aiLessonById(context.lessonId).catch(() => null);
    return explainWithAi(lesson ? { title: lesson.title, text: lesson.text } : null, context.item, message, history);
  }
  return askStudyChat(message, history);
}

export default function StudyChatScreen() {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [context, setContext] = useState<AiChatContext>(STUDY);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failed, setFailed] = useState<FailedMessage | null>(null);
  const [saveFailed, setSaveFailed] = useState(false);
  const [past, setPast] = useState<TutorChatSummary[] | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const busyRef = useRef(false);
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; };
  }, []);

  const refreshPast = useCallback(async () => {
    try {
      const list = await listTutorChats();
      if (alive.current) setPast(list);
    } catch {
      if (alive.current) setPast([]);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => { void refreshPast(); });
  }, [refreshPast]);

  // Sends one message and saves the conversation. The learner's message stays in the thread
  // even if the answer fails, so Retry can send it again without repeating it.
  async function submit(message: string, history: ChatTurn[]) {
    if (busyRef.current || !canContinue(context.kind)) return;
    busyRef.current = true;
    const id = chatId ?? newAiChatId(context.kind, context.lessonId);
    const started = createdAt ?? new Date().toISOString();
    const asked: ChatTurn[] = [...history, { role: 'user', text: message }];
    setChatId(id);
    setCreatedAt(started);
    setTurns(asked);
    setDraft('');
    setError(null);
    setFailed(null);
    setBusy(true);
    try {
      const answer = await answerFor(context, message, history);
      const finished: ChatTurn[] = [...asked, { role: 'model', text: answer }];
      if (alive.current) setTurns(finished);
      try {
        await saveTutorChat({ id, turns: finished, createdAt: started, context });
        if (alive.current) setSaveFailed(false);
        void refreshPast();
      } catch {
        if (alive.current) setSaveFailed(true);
      }
    } catch (problem) {
      if (alive.current) {
        setFailed({ message, history });
        setError(problem instanceof AiError && context.kind !== 'study' ? problem.message : PROBLEM);
      }
    } finally {
      busyRef.current = false;
      if (alive.current) setBusy(false);
    }
  }

  function send(raw: string) {
    const message = raw.trim();
    if (!message) return;
    void submit(message, turns);
  }

  function retry() {
    if (failed) void submit(failed.message, failed.history);
  }

  function newChat() {
    setChatId(null);
    setContext(STUDY);
    setCreatedAt(null);
    setTurns([]);
    setError(null);
    setFailed(null);
    setSaveFailed(false);
    setPendingDelete(null);
  }

  async function openChat(id: string) {
    setError(null);
    setFailed(null);
    setPendingDelete(null);
    try {
      const chat = await getTutorChat(id);
      if (!alive.current) return;
      if (!chat) {
        setError('That chat could not be found. It may have been deleted.');
        void refreshPast();
        return;
      }
      setChatId(chat.id);
      setContext(chat.context);
      setCreatedAt(chat.createdAt);
      setTurns(chat.turns);
      setSaveFailed(false);
    } catch {
      if (alive.current) setError('That chat could not be opened right now. Please try again.');
    }
  }

  async function removeChat(id: string) {
    if (pendingDelete !== id) {
      setPendingDelete(id);
      return;
    }
    setPendingDelete(null);
    try {
      await deleteTutorChat(id);
      if (id === chatId) newChat();
      void refreshPast();
    } catch {
      if (alive.current) setError('That chat could not be deleted right now. Please try again.');
    }
  }

  const shown = (past ?? []).filter((chat) => filter === 'all' || chat.kind === filter);
  const about = context.kind === 'study' ? null : [AI_CHAT_LABEL[context.kind], context.kind === 'explain' ? context.item?.prompt : context.lessonTitle].filter(Boolean).join(' · ');
  const continuing = canContinue(context.kind);

  return (
    <Screen width="content">
      <BackLink fallback={'/learn' as never} />
      <PageHeader eyebrow="Learn" title="Study chat" subtitle="Ask anything: concepts, study plans, memory tricks, quizzes. Your AI chats from lessons, explanations and the voice tutor are saved below too. AI can make mistakes, so check exam details against your notes." />

      {about ? (
        <Card tone="muted" style={styles.about}>
          <Icon name="sparkle" size={16} color={colors.primaryText} />
          <Text style={styles.aboutText} numberOfLines={2}>{about}</Text>
          <Button label="New study chat" variant="ghost" size="sm" onPress={newChat} disabled={busy} />
        </Card>
      ) : null}

      {turns.length === 0 ? (
        <View style={styles.chips}>
          {SUGGESTIONS.map((suggestion) => (
            <Interactive key={suggestion} onPress={() => void send(suggestion)} disabled={busy} accessibilityRole="button" style={({ hovered }) => [styles.chip, hovered && styles.chipHover]}>
              <Icon name="sparkle" size={14} color={colors.primaryText} />
              <Text style={styles.chipText}>{suggestion}</Text>
            </Interactive>
          ))}
        </View>
      ) : (
        <View style={styles.thread}>
          {turns.map((turn, i) => (
            <View key={i} style={[styles.row, turn.role === 'user' && styles.rowUser]}>
              <Card tone={turn.role === 'user' ? 'primary' : 'surface'} style={styles.bubble}>
                <Text style={styles.who}>{turn.role === 'user' ? 'You' : MODEL_NAME[context.kind]}</Text>
                {turn.role === 'model' ? <MarkdownMessage text={turn.text} /> : <Text selectable style={styles.message}>{turn.text}</Text>}
              </Card>
            </View>
          ))}
          {busy ? (
            <View style={styles.row}>
              <Card style={styles.bubble}>
                <Text style={styles.who}>{MODEL_NAME[context.kind]}</Text>
                <Text style={styles.hint}>Thinking…</Text>
              </Card>
            </View>
          ) : null}
        </View>
      )}

      {error ? (
        <View style={styles.problem}>
          <InlineNotice tone="error" message={error} />
          {failed ? <Button label="Retry" variant="secondary" size="sm" icon={<Icon name="send" size={15} color={colors.text} />} onPress={retry} disabled={busy} /> : null}
        </View>
      ) : null}
      {saveFailed ? <InlineNotice tone="error" message="This chat could not be saved to your account. Check your connection; it will stay on this screen until you leave it." /> : null}

      {continuing ? (
        <View style={styles.composer}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder={context.kind === 'study' ? 'Ask anything' : 'Continue this chat'}
            placeholderTextColor={colors.textTertiary}
            accessibilityLabel={context.kind === 'study' ? 'Message Apex' : 'Continue this AI chat'}
            multiline
            maxLength={4000}
            style={styles.input}
          />
          <Button label="Send" icon={<Icon name="send" size={16} color={colors.onPrimary} />} onPress={() => void send(draft)} loading={busy} disabled={busy || !draft.trim()} />
        </View>
      ) : (
        <Text style={styles.hint}>This is the transcript of a voice tutor call. Start a new call from Voice tutor, or a new study chat here.</Text>
      )}
      {turns.length > 0 ? <Button label="New chat" variant="ghost" size="sm" onPress={newChat} disabled={busy} /> : null}

      <SectionHeader title="Recent AI chats" subtitle="Study chats, Ask AI in lessons, explanations and voice tutor calls. Saved to your account; only you can see them." style={styles.section} />
      <SegmentedControl options={FILTERS} value={filter} onChange={setFilter} label="Show" />
      {past === null ? (
        <Text style={styles.hint}>Loading your chats…</Text>
      ) : shown.length === 0 ? (
        <Card tone="muted" style={styles.emptyPast}>
          <Text style={styles.hint}>{filter === 'all' ? 'Your saved AI chats will appear here.' : `No ${AI_CHAT_LABEL[filter as AiChatKind].toLowerCase()} chats yet.`}</Text>
        </Card>
      ) : (
        <View style={styles.pastList}>
          {shown.map((chat) => (
            <Card key={chat.id} tone={chat.id === chatId ? 'primary' : 'surface'} style={styles.pastRow}>
              <View style={styles.pastHead}>
                <Pill label={AI_CHAT_LABEL[chat.kind]} tone={chat.kind === 'study' ? 'neutral' : 'primary'} />
                <Text style={styles.hint} numberOfLines={1}>{formatDate(chat.updatedAt)} · {chat.turnCount} messages</Text>
              </View>
              <Text style={styles.pastTitle}>{chat.title}</Text>
              {chat.lessonTitle ? <Text style={styles.hint} numberOfLines={1}>{chat.lessonTitle}</Text> : null}
              <View style={styles.pastActions}>
                <Button label={canContinue(chat.kind) ? 'Open' : 'Read'} variant="secondary" size="sm" onPress={() => void openChat(chat.id)} disabled={busy} />
                <Button
                  label={pendingDelete === chat.id ? 'Tap again to delete' : 'Delete'}
                  variant="ghost"
                  size="sm"
                  onPress={() => void removeChat(chat.id)}
                  disabled={busy}
                />
              </View>
            </Card>
          ))}
        </View>
      )}
    </Screen>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    about: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 },
    aboutText: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.text },
    chips: { gap: 8 },
    chip: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 11, paddingHorizontal: 14, borderRadius: Radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
    chipHover: { borderColor: colors.primaryBorder },
    chipText: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.text },
    thread: { gap: 10 },
    row: { flexDirection: 'row', justifyContent: 'flex-start' },
    rowUser: { justifyContent: 'flex-end' },
    bubble: { gap: 4, padding: 14, maxWidth: '92%' },
    who: { ...Type.overline, color: colors.primaryText },
    message: { fontSize: 14.5, lineHeight: 22, color: colors.text },
    hint: { fontSize: 14, lineHeight: 21, color: colors.textSecondary },
    composer: { gap: 10 },
    input: { minHeight: 74, borderWidth: 1, borderColor: colors.borderStrong, borderRadius: Radius.md, backgroundColor: colors.surfaceSunken, padding: 12, color: colors.text, fontSize: 14.5, textAlignVertical: 'top' },
    problem: { gap: 10 },
    section: { marginTop: 30 },
    emptyPast: { padding: 16 },
    pastList: { gap: 9 },
    pastRow: { gap: 6, padding: 14 },
    pastHead: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
    pastTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
    pastActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  });
}
