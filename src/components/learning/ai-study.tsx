import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import { useTabBarClearance } from '@/components/floating-tab-bar';
import { closeSidePanel, openSidePanel, updateSidePanel, useSidePanel, useSidePanelAvailable } from '@/components/side-panel';
import { type FlashcardLabels, FlashcardsPanel } from '@/components/learning/lesson-tools';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Card, Interactive } from '@/components/ui/interactive';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Sheet } from '@/components/ui/sheet';
import { InlineNotice } from '@/components/ui/state-views';
import { Text, TextInput } from '@/components/ui/text';
import { MarkdownMessage } from '@/components/chat/markdown-message';
import { elevation, isDesktopWidth, Radius, Type, type ThemeColors } from '@/constants/theme';
import { AI_CARDS_KEY, aiCards, mergeCards, parseSavedCards } from '@/data/ai-study';
import { newAiChatId } from '@/data/ai-chat-history';
import { getTutorChat, listLessonChats, saveTutorChat, type TutorChatSummary } from '@/data/tutor-chats';
import type { Flashcard } from '@/data/flashcards';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';
import { AiError, askLessonAi, type ChatTurn, type LessonQuestion, makeLessonCards, makeLessonQuestions } from '@/lib/ai-study-api';

// "Ask AI", "AI Flashcards" and "AI Questions" — tabs on every lesson. Both send the lesson's
// own text to Gemini 3.1 Flash-Lite through /api/ai, which keeps the key private.

export type AiLesson = { id: string; title: string; text: string };

const SUGGESTIONS = [
  'Explain this lesson in simple words',
  'What are the most important points to remember?',
  'Give me a memory trick for the hardest part',
  'Quiz me with one question',
];

const problemText = (problem: unknown) => (problem instanceof AiError ? problem.message : 'The AI could not answer right now. Please try again.');

// ── Ask AI ──────────────────────────────────────────────────────────

export function AskAiPanel({ lesson, focus, autoAsk, embedded = false, docked = false }: {
  lesson: AiLesson;
  /** The section being read, offered as a first question. */ focus?: string;
  /** Asked as soon as the panel opens ("Explain it more simply"). */ autoAsk?: string;
  /** Inside the "Ask AI" sheet: the sheet shows the title. */ embedded?: boolean;
  /** In the right-hand side panel: the conversation scrolls and the question box stays at the bottom. */ docked?: boolean;
}) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const scroll = useRef<ScrollView>(null);
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // This conversation's saved copy (data/tutor-chats.ts), and the lesson's earlier chats.
  const [chatId, setChatId] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [recent, setRecent] = useState<TutorChatSummary[]>([]);
  const busyRef = useRef(false);
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; };
  }, []);

  const loadRecent = useCallback(() => {
    listLessonChats(lesson.id, 10).then((list) => { if (alive.current) setRecent(list); }).catch(() => { if (alive.current) setRecent([]); });
  }, [lesson.id]);
  useEffect(() => { queueMicrotask(loadRecent); }, [loadRecent]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || busyRef.current) return;
    busyRef.current = true;
    const history = turns;
    const id = chatId ?? newAiChatId('lesson', lesson.id);
    const started = createdAt ?? new Date().toISOString();
    setChatId(id);
    setCreatedAt(started);
    setTurns([...history, { role: 'user', text: question }]);
    setDraft('');
    setError(null);
    setBusy(true);
    try {
      const answer = await askLessonAi(lesson, question, history);
      const finished: ChatTurn[] = [...history, { role: 'user', text: question }, { role: 'model', text: answer }];
      if (alive.current) setTurns(finished);
      // Saved to the learner's AI chats (Apex AI → Recent AI chats); a failed save never interrupts.
      void saveTutorChat({ id, turns: finished, createdAt: started, context: { kind: 'lesson', lessonId: lesson.id, lessonTitle: lesson.title } })
        .then(loadRecent)
        .catch(() => undefined);
    } catch (problem) {
      if (alive.current) setError(problemText(problem));
    } finally {
      busyRef.current = false;
      if (alive.current) setBusy(false);
    }
  }

  // "Explain it more simply": ask straight away, once.
  const asked = useRef(false);
  useEffect(() => {
    if (!autoAsk || asked.current) return;
    asked.current = true;
    void send(autoAsk);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once, when the panel opens
  }, [autoAsk]);

  async function openChat(id: string) {
    if (busyRef.current) return;
    setError(null);
    try {
      const chat = await getTutorChat(id);
      if (!alive.current) return;
      if (!chat) { setError('That chat could not be found. It may have been deleted.'); loadRecent(); return; }
      setChatId(chat.id);
      setCreatedAt(chat.createdAt);
      setTurns(chat.turns);
    } catch {
      if (alive.current) setError('That chat could not be opened right now. Please try again.');
    }
  }

  function newChat() {
    setTurns([]);
    setChatId(null);
    setCreatedAt(null);
    setError(null);
    loadRecent();
  }

  const conversation = (
    <>
      {embedded || docked ? null : <Text style={styles.panelTitle}>Ask AI</Text>}
      <Text style={styles.panelText}>Ask anything about “{lesson.title}”. The answers come from this lesson first. AI can make mistakes, so check important details against your lecture notes.</Text>

      {turns.length === 0 ? (
        <>
          <View style={styles.chips}>
            {(focus ? [`Explain “${focus}” in simple words`, ...SUGGESTIONS] : SUGGESTIONS).map((suggestion) => (
              <Interactive key={suggestion} onPress={() => void send(suggestion)} disabled={busy} accessibilityRole="button" style={({ hovered }) => [styles.chip, hovered && styles.chipHover]}>
                <Icon name="sparkle" size={14} color={colors.primaryText} />
                <Text style={styles.chipText}>{suggestion}</Text>
              </Interactive>
            ))}
          </View>
          {recent.length ? (
            <View style={styles.recent}>
              <Text style={styles.recentTitle}>Your recent chats about this lesson</Text>
              {recent.slice(0, 5).map((chat) => (
                <Interactive key={chat.id} onPress={() => void openChat(chat.id)} disabled={busy} accessibilityRole="button" accessibilityLabel={`Open chat: ${chat.title}`} style={({ hovered }) => [styles.recentRow, hovered && styles.chipHover]}>
                  <Icon name="comment" size={14} color={colors.textSecondary} />
                  <View style={styles.recentText}>
                    <Text style={styles.chipText} numberOfLines={1}>{chat.title}</Text>
                    <Text style={styles.recentMeta}>{chat.updatedAt ? new Date(chat.updatedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) : 'Just now'} · {chat.turnCount} messages</Text>
                  </View>
                  <Icon name="chevronRight" size={16} color={colors.textTertiary} />
                </Interactive>
              ))}
              <Text style={styles.recentMeta}>All your AI chats: Learn → Apex AI → Recent AI chats.</Text>
            </View>
          ) : null}
        </>
      ) : (
        <View style={styles.thread}>
          {turns.map((turn, i) => (
            <View key={i} style={[styles.row, turn.role === 'user' && styles.rowUser]}>
              <Card tone={turn.role === 'user' ? 'primary' : 'surface'} style={styles.bubble}>
                <Text style={styles.who}>{turn.role === 'user' ? 'You' : 'Ask AI'}</Text>
                <Text selectable style={styles.message}>{turn.text}</Text>
              </Card>
            </View>
          ))}
          {busy ? (
            <View style={styles.row}>
              <Card style={styles.bubble}>
                <Text style={styles.who}>Ask AI</Text>
                <Text style={styles.panelText}>Thinking…</Text>
              </Card>
            </View>
          ) : null}
        </View>
      )}

      {error ? <InlineNotice tone="error" message={error} /> : null}
    </>
  );

  const composer = (
    <>
      <View style={styles.composer}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Ask a question about this lesson"
          placeholderTextColor={colors.textTertiary}
          accessibilityLabel="Ask a question about this lesson"
          multiline
          maxLength={1000}
          // In the side panel, Enter sends (Shift + Enter for a new line), like a chat.
          onKeyPress={docked && Platform.OS === 'web' ? (event) => {
            const native = event.nativeEvent as unknown as { key: string; shiftKey?: boolean };
            if (native.key === 'Enter' && !native.shiftKey) { (event as unknown as { preventDefault?: () => void }).preventDefault?.(); void send(draft); }
          } : undefined}
          style={[styles.input, docked && styles.inputDocked]}
        />
        <Button label="Ask" icon={<Icon name="send" size={16} color={colors.onPrimary} />} onPress={() => void send(draft)} loading={busy} disabled={busy || !draft.trim()} />
      </View>
      {turns.length > 0 ? <Button label="New chat" variant="ghost" size="sm" onPress={newChat} disabled={busy} accessibilityHint="This chat stays saved in your recent chats" /> : null}
    </>
  );

  if (docked) {
    return (
      <View style={styles.docked}>
        <ScrollView ref={scroll} style={styles.dockedScroll} contentContainerStyle={styles.dockedBody} onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })}>
          {conversation}
        </ScrollView>
        <View style={styles.dockedFooter}>{composer}</View>
      </View>
    );
  }
  return (
    <View style={styles.panel}>
      {conversation}
      {composer}
    </View>
  );
}

// ── "Ask AI" while reading ──────────────────────────────────────────
// A floating button over the reading page, so the learner can ask about what
// they are reading without leaving the page. On a computer it opens a panel
// docked on the right (like Ask Gemini in Chrome: the page moves over and stays
// scrollable); on a phone or a narrow window, a sheet.
// Place it in a full-screen container (position: absolute, bottom right).

export function AskAiFab({ lesson, focus }: { lesson: AiLesson | null; focus?: string }) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const { width } = useWindowDimensions();
  const clearance = useTabBarClearance();
  const [open, setOpen] = useState(false);
  const docked = useSidePanelAvailable();
  const panelId = lesson ? `ask-ai:${lesson.id}` : '';
  const sidePanel = useSidePanel();
  const panelOpen = docked && sidePanel?.id === panelId;
  const subtitle = lesson ? (focus ? `While reading: ${focus}` : lesson.title) : '';

  // The panel belongs to this lesson: it closes when the learner leaves the page.
  useFocusEffect(useCallback(() => () => closeSidePanel(panelId), [panelId]));
  useEffect(() => () => closeSidePanel(panelId), [panelId]);
  // Keep "While reading: …" in step with the section on screen.
  useEffect(() => { updateSidePanel(panelId, { subtitle }); }, [panelId, subtitle]);

  if (!lesson) return null;
  const bottom = isDesktopWidth(width) ? 28 : clearance + 14;
  const toggle = () => {
    if (!docked) { setOpen(true); return; }
    if (panelOpen) closeSidePanel(panelId);
    else openSidePanel({ id: panelId, title: 'Ask AI', subtitle, content: <AskAiPanel lesson={lesson} focus={focus} docked /> });
  };
  return (
    <>
      <Interactive
        onPress={toggle}
        accessibilityRole="button"
        accessibilityLabel={panelOpen ? 'Close Ask AI' : 'Ask AI about what you are reading'}
        style={({ hovered, pressed }) => [styles.fab, { bottom }, elevation(colors, 3), hovered && styles.fabHover, pressed && styles.fabPressed]}
      >
        <Icon name={panelOpen ? 'close' : 'sparkle'} size={18} color={colors.onPrimary} />
        <Text style={styles.fabText}>{panelOpen ? 'Close AI' : 'Ask AI'}</Text>
      </Interactive>
      <Sheet visible={open && !docked} onClose={() => setOpen(false)} title="Ask AI" subtitle={subtitle} width={640}>
        <AskAiPanel lesson={lesson} focus={focus} embedded />
      </Sheet>
    </>
  );
}

/** The question behind "Explain it more simply": from zero, then up to the lecture. */
export const explainSimplyQuestion = (focus: string) =>
  `Explain “${focus}” from the very basics, as if I know nothing about it yet: start with a simple everyday picture, explain every technical word in plain language, then build up step by step to what the lecture says.`;

/**
 * "Explain it more simply" under a lesson step: opens Ask AI (docked on the right on a
 * computer, a sheet on a phone) and asks for a from-zero explanation of that step.
 */
export function ExplainSimplyButton({ lesson, focus }: { lesson: AiLesson; focus: string }) {
  const colors = useTheme();
  const [open, setOpen] = useState(false);
  const docked = useSidePanelAvailable();
  const panelId = `explain-simply:${lesson.id}`;
  useFocusEffect(useCallback(() => () => closeSidePanel(panelId), [panelId]));
  useEffect(() => () => closeSidePanel(panelId), [panelId]);
  const question = explainSimplyQuestion(focus);
  const press = () => {
    if (!docked) { setOpen(true); return; }
    // A new panel for each step (the key makes it ask again for the new step).
    openSidePanel({ id: panelId, title: 'Explain it more simply', subtitle: focus, content: <AskAiPanel key={focus} lesson={lesson} focus={focus} autoAsk={question} docked /> });
  };
  return (
    <>
      <Button
        label="Explain it more simply"
        variant="ghost"
        size="sm"
        icon={<Icon name="sparkle" size={14} color={colors.primaryText} />}
        onPress={press}
        accessibilityHint="Ask AI explains this step from the basics, using this lesson"
      />
      <Sheet visible={open && !docked} onClose={() => setOpen(false)} title="Explain it more simply" subtitle={focus} width={640}>
        {open ? <AskAiPanel lesson={lesson} focus={focus} autoAsk={question} embedded /> : null}
      </Sheet>
    </>
  );
}

// ── AI Flashcards ───────────────────────────────────────────────────

const AI_LABELS: FlashcardLabels = {
  title: 'AI flashcards',
  intro: 'Cards the AI wrote from this lesson. Answer in your head, flip, then rate how it went. Cards you rate come back on a spaced schedule, like Anki.',
  front: 'QUESTION',
  back: 'ANSWER',
  hint: 'Think of the answer first, then tap to flip.',
};

const COUNTS = [5, 10, 15];

export function AiFlashcardsPanel({ lesson }: { lesson: AiLesson }) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const [cards, setCards] = useState<Flashcard[] | null>(null);
  const [count, setCount] = useState(10);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const alive = useRef(true);
  const busyRef = useRef(false);
  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; };
  }, []);

  useEffect(() => {
    let live = true;
    AsyncStorage.getItem(AI_CARDS_KEY(lesson.id))
      .then((saved) => { if (live) setCards(parseSavedCards(saved)); })
      .catch(() => { if (live) setCards([]); });
    return () => { live = false; };
  }, [lesson.id]);

  async function generate(addTo: Flashcard[]) {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setError(null);
    setNote(null);
    try {
      const made = await makeLessonCards(lesson, count, addTo.map((card) => card.front));
      const fresh = aiCards(lesson.id, made);
      const all = mergeCards(addTo, fresh);
      if (!alive.current) return;
      if (all.length === addTo.length) {
        setNote('The AI only came back with cards you already have. Try again for different ones.');
        return;
      }
      setCards(all);
      void AsyncStorage.setItem(AI_CARDS_KEY(lesson.id), JSON.stringify(all)).catch(() => {});
    } catch (problem) {
      if (alive.current) setError(problemText(problem));
    } finally {
      busyRef.current = false;
      if (alive.current) setBusy(false);
    }
  }

  function startOver() {
    setCards([]);
    setNote(null);
    setError(null);
    void AsyncStorage.removeItem(AI_CARDS_KEY(lesson.id)).catch(() => {});
  }

  if (cards === null) {
    return (
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>AI flashcards</Text>
        <Text style={styles.panelText}>Loading your cards…</Text>
      </View>
    );
  }

  const picker = (
    <View style={styles.pickerRow}>
      <Text style={styles.pickerLabel}>Cards to make</Text>
      <SegmentedControl label="Cards to make" options={COUNTS.map((value) => ({ value: String(value), label: String(value) }))} value={String(count)} onChange={(value) => setCount(Number(value))} style={styles.picker} />
    </View>
  );

  if (cards.length === 0) {
    return (
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>AI flashcards</Text>
        <Text style={styles.panelText}>The AI reads “{lesson.title}” and writes question-and-answer cards for you. Then you study them with spaced repetition. AI can make mistakes, so check anything that looks wrong against your notes.</Text>
        {picker}
        {error ? <InlineNotice tone="error" message={error} /> : null}
        {note ? <InlineNotice tone="info" message={note} /> : null}
        <Button label={busy ? 'Writing your cards…' : 'Make flashcards'} icon={<Icon name="sparkle" size={16} color={colors.onPrimary} />} onPress={() => void generate([])} loading={busy} disabled={busy} />
      </View>
    );
  }

  return (
    <View style={styles.panel}>
      <FlashcardsPanel cards={cards} labels={AI_LABELS} aiLesson={lesson} />
      <Card tone="muted" style={styles.more}>
        <Text style={styles.moreTitle}>{cards.length} AI card{cards.length === 1 ? '' : 's'} for this lesson</Text>
        {picker}
        {error ? <InlineNotice tone="error" message={error} /> : null}
        {note ? <InlineNotice tone="info" message={note} /> : null}
        <View style={styles.moreActions}>
          <Button label={busy ? 'Writing…' : 'Add more cards'} variant="secondary" icon={<Icon name="plus" size={16} color={colors.text} />} onPress={() => void generate(cards)} loading={busy} disabled={busy} />
          <Button label="Delete these cards" variant="ghost" icon={<Icon name="trash" size={16} color={colors.textSecondary} />} onPress={startOver} disabled={busy} />
        </View>
      </Card>
    </View>
  );
}

// ── AI Questions ────────────────────────────────────────────────────

const QUESTION_COUNTS = [5, 10];

export function AiQuestionsPanel({ lesson }: { lesson: AiLesson }) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const [questions, setQuestions] = useState<LessonQuestion[] | null>(null);
  const [picks, setPicks] = useState<Record<number, number>>({});
  const [count, setCount] = useState(5);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const busyRef = useRef(false);
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; };
  }, []);

  // Questions are made fresh each time and never saved: they are practice, not course content.
  async function generate() {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setError(null);
    try {
      const made = await makeLessonQuestions(lesson, count, (questions ?? []).map((item) => item.question));
      if (alive.current) {
        setQuestions(made);
        setPicks({});
      }
    } catch (problem) {
      if (alive.current) setError(problemText(problem));
    } finally {
      busyRef.current = false;
      if (alive.current) setBusy(false);
    }
  }

  const answered = Object.keys(picks).length;
  const correct = questions ? questions.reduce((total, item, i) => total + (picks[i] === item.answer ? 1 : 0), 0) : 0;

  const picker = (
    <View style={styles.pickerRow}>
      <Text style={styles.pickerLabel}>Questions to make</Text>
      <SegmentedControl label="Questions to make" options={QUESTION_COUNTS.map((value) => ({ value: String(value), label: String(value) }))} value={String(count)} onChange={(value) => setCount(Number(value))} style={styles.picker} />
    </View>
  );

  if (!questions) {
    return (
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>AI questions</Text>
        <Text style={styles.panelText}>The AI reads “{lesson.title}” and writes multiple-choice questions to test yourself. Pick an answer to see if you were right and why. AI can make mistakes, so check anything that looks wrong against your notes.</Text>
        {picker}
        {error ? <InlineNotice tone="error" message={error} /> : null}
        <Button label={busy ? 'Writing your questions…' : 'Generate questions'} icon={<Icon name="sparkle" size={16} color={colors.onPrimary} />} onPress={() => void generate()} loading={busy} disabled={busy} />
      </View>
    );
  }

  return (
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>AI questions</Text>
      {answered > 0 ? <Text style={styles.panelText}>{correct} of {answered} answered correctly so far.</Text> : null}
      {questions.map((item, index) => {
        const chosen = picks[index];
        const done = chosen !== undefined;
        return (
          <Card key={index} style={styles.questionCard}>
            <Text style={styles.who}>Question {index + 1}</Text>
            <Text style={styles.questionText}>{item.question}</Text>
            <View style={styles.optionList}>
              {item.options.map((option, optionIndex) => {
                const isAnswer = optionIndex === item.answer;
                const isWrongPick = done && chosen === optionIndex && !isAnswer;
                return (
                  <Interactive
                    key={optionIndex}
                    disabled={done}
                    accessibilityRole="button"
                    onPress={() => setPicks((current) => ({ ...current, [index]: optionIndex }))}
                    style={({ hovered }) => [
                      styles.option,
                      done && isAnswer && styles.optionRight,
                      isWrongPick && styles.optionWrong,
                      !done && hovered && styles.optionHover,
                    ]}
                  >
                    <Text style={styles.optionLetter}>{String.fromCharCode(65 + optionIndex)}</Text>
                    <Text style={styles.optionText}>{option}</Text>
                  </Interactive>
                );
              })}
            </View>
            {done ? (
              <Text style={[styles.feedback, chosen === item.answer ? styles.feedbackRight : styles.feedbackWrong]}>
                {chosen === item.answer ? 'Correct. ' : 'Not quite. '}
                {item.explanation}
              </Text>
            ) : null}
          </Card>
        );
      })}

      <Card tone="muted" style={styles.more}>
        <Text style={styles.moreTitle}>New set</Text>
        {picker}
        {error ? <InlineNotice tone="error" message={error} /> : null}
        <View style={styles.moreActions}>
          <Button label={busy ? 'Writing…' : 'Make new questions'} variant="secondary" icon={<Icon name="sparkle" size={16} color={colors.text} />} onPress={() => void generate()} loading={busy} disabled={busy} />
          <Button label="Clear questions" variant="ghost" onPress={() => { setQuestions(null); setPicks({}); setError(null); }} disabled={busy} />
        </View>
      </Card>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    panel: { gap: 12 },
    panelTitle: { ...Type.title2, color: colors.text },
    panelText: { fontSize: 14, lineHeight: 21, color: colors.textSecondary },
    chips: { gap: 8 },
    chip: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 11, paddingHorizontal: 14, borderRadius: Radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
    chipHover: { borderColor: colors.primaryBorder },
    chipText: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.text },
    recent: { gap: 8, marginTop: 6 },
    recentTitle: { ...Type.overline, color: colors.textSecondary },
    recentRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 12, borderRadius: Radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
    recentText: { flex: 1, minWidth: 0, gap: 2 },
    recentMeta: { fontSize: 12.5, color: colors.textTertiary },
    thread: { gap: 10 },
    row: { flexDirection: 'row', justifyContent: 'flex-start' },
    rowUser: { justifyContent: 'flex-end' },
    bubble: { gap: 4, padding: 14, maxWidth: '92%' },
    who: { ...Type.overline, color: colors.primaryText },
    message: { fontSize: 14.5, lineHeight: 22, color: colors.text },
    composer: { gap: 10 },
    docked: { flex: 1, minHeight: 0 },
    dockedScroll: { flex: 1 },
    dockedBody: { gap: 12, padding: 18 },
    dockedFooter: { gap: 6, paddingHorizontal: 18, paddingTop: 12, paddingBottom: 16, borderTopWidth: 1, borderTopColor: colors.divider },
    inputDocked: { minHeight: 56, maxHeight: 160 },
    input: { minHeight: 74, borderWidth: 1, borderColor: colors.borderStrong, borderRadius: Radius.md, backgroundColor: colors.surfaceSunken, padding: 12, color: colors.text, fontSize: 14.5, textAlignVertical: 'top' },
    pickerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' },
    picker: { minWidth: 190 },
    pickerLabel: { fontSize: 14, fontWeight: '700', color: colors.text },
    more: { gap: 12, padding: 16, marginTop: 6 },
    moreTitle: { ...Type.headline, color: colors.text },
    moreActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    questionCard: { gap: 10, padding: 16 },
    questionText: { fontSize: 15.5, lineHeight: 23, fontWeight: '700', color: colors.text },
    optionList: { gap: 8 },
    option: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 11, paddingHorizontal: 12, borderRadius: Radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
    optionHover: { borderColor: colors.primaryBorder },
    optionRight: { borderColor: colors.success, backgroundColor: colors.surfaceSunken },
    optionWrong: { borderColor: colors.error, backgroundColor: colors.surfaceSunken },
    optionLetter: { width: 24, fontSize: 13, fontWeight: '800', color: colors.primaryText },
    optionText: { flex: 1, fontSize: 14.5, lineHeight: 21, color: colors.text },
    feedback: { fontSize: 14, lineHeight: 21, fontWeight: '600' },
    feedbackRight: { color: colors.success },
    feedbackWrong: { color: colors.error },
    fab: { position: 'absolute', right: 20, flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12, paddingHorizontal: 18, borderRadius: 999, backgroundColor: colors.primary, zIndex: 20 },
    fabHover: { opacity: 0.92 },
    fabPressed: { transform: [{ scale: 0.97 }] },
    fabText: { fontSize: 15, fontWeight: '800', color: colors.onPrimary },
  });
}
