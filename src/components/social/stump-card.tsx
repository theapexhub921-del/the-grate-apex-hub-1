// Stump a friend (data/stumps.ts):
//   StumpCard      the question inside a feed post or a chat message. Pick an
//                  option, check it, then see the answer and the explanation.
//                  Who got it right or wrong is shown ONLY to the learner who
//                  sent it, so nobody is afraid to have a go.
//   StumpComposer  the sheet that sends a question — to the feed, to friends
//                  (each in your private chat) and to groups, in any mix.
//                  Opened from quiz results and from the stump button in a chat.
import { router } from 'expo-router';
import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { QuestionFigure } from '@/components/learning/figure-view';
import { PersonAvatar } from '@/components/social/profile-card';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Interactive } from '@/components/ui/interactive';
import { Pill } from '@/components/ui/pill';
import { Sheet } from '@/components/ui/sheet';
import { Text } from '@/components/ui/text';
import { Radius, Type, type ThemeColors } from '@/constants/theme';
import type { StumpRef } from '@/data/community';
import { type GroupSummary, listMyGroups } from '@/data/group-chat';
import type { ChoiceQuestion } from '@/data/questions';
import { personName, type SocialPerson, useSocial } from '@/data/social';
import { answerStump, canLoadStumpQuestion, LETTERS, listStumpAnswers, loadStumpQuestion, sendStump, STUMP_NOTE_MAX, stumpOptionOrder, stumpQuestion, type StumpAnswer, type StumpSendResult } from '@/data/stumps';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';

const errorText = (caught: unknown, fallback: string) => (caught instanceof Error && caught.message ? caught.message : fallback);

/** A stump inside a chat: its answers come from the chat's messages, and answering sends a message. */
export type ChatStumpSource = { answers: readonly StumpAnswer[]; answer: (pick: number, question: ChoiceQuestion) => Promise<StumpAnswer> };

type StumpCardProps = {
  postId: string; // the feed post id, or the chat message id
  question: ChoiceQuestion;
  stump: StumpRef;
  authorId: string;
  authorName: string; // the sender, as the post or chat shows them
  ownId: string | null;
  people: readonly SocialPerson[];
  /** Set for a stump sent in a chat. */
  chat?: ChatStumpSource;
};

/** A stump by its question id: loads a past-paper question first if needed; `fallback` when it can't be found. */
export function StumpById({ fallback, ...card }: Omit<StumpCardProps, 'question'> & { fallback: ReactNode }) {
  const question = useStumpQuestion(card.stump.qid);
  if (question === undefined) return <StumpLoading />;
  if (!question) return <>{fallback}</>;
  return <StumpCard {...card} question={question} />;
}

export function StumpCard({ postId, question, stump, authorId, authorName, ownId, people, chat }: StumpCardProps) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const order = useMemo(() => stumpOptionOrder(question), [question]);
  const [loaded, setLoaded] = useState<StumpAnswer[] | null>(null);
  const [saved, setSaved] = useState<StumpAnswer | null>(null);
  const [choice, setChoice] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (chat) return; // a chat stump reads its answers from the chat
    let live = true;
    listStumpAnswers(postId, authorId).then((list) => { if (live) setLoaded(list); }).catch(() => { if (live) setLoaded([]); });
    return () => { live = false; };
  }, [postId, chat, authorId]);

  const base = chat ? [...chat.answers] : loaded;
  const answers = base && saved && !base.some((item) => item.userId === saved.userId) ? [...base, saved] : base;
  const isMine = Boolean(ownId) && authorId === ownId;
  const mine = answers?.find((answer) => answer.userId === ownId) ?? null;
  const revealed = isMine || Boolean(mine);

  async function check() {
    if (choice === null || busy) return;
    setBusy(true);
    setError(null);
    try {
      const answer = chat ? await chat.answer(choice, question) : await answerStump(postId, question, choice, authorId);
      setSaved(answer);
      if (!chat) setLoaded((list) => [...(list ?? []).filter((item) => item.userId !== answer.userId), answer]);
    } catch (caught) {
      setError(errorText(caught, 'Could not save your answer.'));
    } finally {
      setBusy(false);
    }
  }

  // The sender's private view: each answerer and how they did.
  const right = (answers ?? []).filter((answer) => answer.ok).length;
  const nameOf = (answer: StumpAnswer) => {
    const person = people.find((item) => item.userId === answer.userId);
    return person ? personName(person) : answer.username ? `@${answer.username}` : 'A learner';
  };

  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <Icon name="challenge" size={16} color={colors.primaryText} />
        <Text style={styles.kicker}>STAMP A FRIEND</Text>
        <Pill label={question.concept} style={styles.concept} />
      </View>
      {stump.note ? <Text style={styles.note}>{stump.note}</Text> : null}
      <Text style={styles.prompt}>{question.prompt}</Text>
      {question.figure ? <QuestionFigure figure={question.figure} revealed={revealed} /> : null}
      <View style={styles.options}>
        {order.map((index, position) => {
          const isAnswer = index === question.answer;
          const picked = mine ? mine.pick === index : choice === index;
          const tone = revealed ? (isAnswer ? 'right' : picked ? 'wrong' : 'idle') : picked ? 'picked' : 'idle';
          return (
            <Interactive
              key={index}
              disabled={revealed || busy}
              dimDisabled={false}
              onPress={() => setChoice(index)}
              accessibilityRole="radio"
              accessibilityState={{ checked: picked }}
              accessibilityLabel={`Option ${LETTERS[position]}: ${question.options[index]}`}
              style={({ hovered }) => [styles.option, styles[tone], hovered && tone === 'idle' && styles.hover]}
            >
              <Text style={[styles.letter, tone === 'right' && styles.rightText, tone === 'wrong' && styles.wrongText]}>{LETTERS[position]}</Text>
              <Text style={styles.optionText}>{question.options[index]}</Text>
              {revealed && isAnswer ? <Icon name="check" size={16} color={colors.successText} /> : null}
              {revealed && picked && !isAnswer ? <Icon name="close" size={16} color={colors.error} /> : null}
            </Interactive>
          );
        })}
      </View>
      {!revealed ? (
        <View style={styles.row}>
          <Button label="Check answer" size="sm" onPress={() => void check()} loading={busy} disabled={choice === null || busy || answers === null} />
          <Text style={styles.muted}>One try, and it counts as revision. Only {authorName} sees how you did.</Text>
        </View>
      ) : (
        <View style={styles.reveal}>
          {mine ? <Text style={[styles.verdict, mine.ok ? styles.rightText : styles.wrongText]}>{mine.ok ? 'You got it.' : 'Not this time.'}</Text> : <Text style={styles.verdict}>Your question</Text>}
          {question.explanation ? <Text style={styles.explanation}>{question.explanation}</Text> : null}
          {mine ? <Text style={styles.muted}>Your answer is private: only {authorName} sees how you did.</Text> : null}
        </View>
      )}
      {error ? <Text style={styles.errorLine}>{error}</Text> : null}
      {isMine && answers ? (
        <View style={styles.results}>
          <Text style={styles.resultsTitle}>
            {answers.length === 0 ? 'Nobody has answered yet.' : `${right} of ${answers.length} got it right`}
          </Text>
          {answers.map((answer) => (
            <View key={answer.userId} style={styles.resultRow}>
              <Icon name={answer.ok ? 'check' : 'close'} size={14} color={answer.ok ? colors.successText : colors.error} />
              <Text style={styles.resultName} numberOfLines={1}>{nameOf(answer)}</Text>
              <Text style={[styles.resultVerdict, answer.ok ? styles.rightText : styles.wrongText]}>{answer.ok ? 'got it' : 'missed it'}</Text>
            </View>
          ))}
          <Text style={styles.muted}>Only you can see who got it right or wrong.</Text>
        </View>
      ) : null}
    </View>
  );
}

/**
 * The question a stump shares, by id. Past-paper questions are only known once
 * their paper's bank is loaded, so a friend who hasn't opened that paper gets
 * it loaded here first. undefined while loading, null when it can't be found.
 */
export function useStumpQuestion(questionId: string | null | undefined): ChoiceQuestion | null | undefined {
  const known = questionId ? stumpQuestion(questionId) : null;
  const [loaded, setLoaded] = useState<{ id: string; question: ChoiceQuestion | null } | null>(null);
  const needsLoading = Boolean(questionId) && !known && canLoadStumpQuestion(questionId ?? '');
  useEffect(() => {
    if (!needsLoading || !questionId) return;
    let live = true;
    void loadStumpQuestion(questionId).then((question) => { if (live) setLoaded({ id: questionId, question }); });
    return () => { live = false; };
  }, [needsLoading, questionId]);
  if (known || !questionId) return known;
  if (!needsLoading) return null;
  return loaded?.id === questionId ? loaded.question : undefined;
}

/** Shown while a stump's question loads. */
export function StumpLoading() {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <Icon name="challenge" size={16} color={colors.primaryText} />
        <Text style={styles.kicker}>STAMP A FRIEND</Text>
      </View>
      <Text style={styles.muted}>Loading the question…</Text>
    </View>
  );
}

/** A chat stump whose question has left the bank: just its text. */
export function StumpUnavailable({ text, note }: { text: string; note?: string }) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <Icon name="challenge" size={16} color={colors.primaryText} />
        <Text style={styles.kicker}>STAMP A FRIEND</Text>
      </View>
      {note ? <Text style={styles.note}>{note}</Text> : null}
      <Text style={styles.optionText}>{text}</Text>
      <Text style={styles.muted}>This question can’t be answered here any more.</Text>
    </View>
  );
}

/**
 * Sends a question to the feed, friends and groups. `friendIds` / `groupIds`
 * preselect where it goes (a chat preselects that chat); `feed` preselects the
 * feed (quiz results). `onAnother` adds a "Another question" button.
 */
export function StumpComposer({ question, onClose, feed = true, friendIds = [], groupIds = [], onAnother, onSent }: {
  question: ChoiceQuestion | null;
  onClose: () => void;
  feed?: boolean;
  friendIds?: readonly string[];
  groupIds?: readonly string[];
  onAnother?: () => void;
  onSent?: (result: StumpSendResult) => void;
}) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const social = useSocial();
  const friends = social.people.filter((person) => person.relationship === 'friends');
  const [note, setNote] = useState('');
  const [toFeed, setToFeed] = useState(feed);
  const [pickedFriends, setPickedFriends] = useState<string[]>([...friendIds]);
  const [pickedGroups, setPickedGroups] = useState<string[]>([...groupIds]);
  const [groups, setGroups] = useState<GroupSummary[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState<StumpSendResult | null>(null);
  const open = question !== null;

  // A fresh sheet each time it opens; a new question ("Another question") keeps
  // the chosen people and note. Reset while rendering, when the key changes.
  const session = `${open}|${feed}|${friendIds.join(',')}|${groupIds.join(',')}`;
  const [shownSession, setShownSession] = useState(session);
  if (shownSession !== session) {
    setShownSession(session);
    setToFeed(feed);
    setPickedFriends([...friendIds]);
    setPickedGroups([...groupIds]);
    setSent(null);
    setError(null);
    setNote('');
  }
  const [shownQuestion, setShownQuestion] = useState(question?.id);
  if (shownQuestion !== question?.id) {
    setShownQuestion(question?.id);
    setSent(null);
    setError(null);
  }
  useEffect(() => {
    if (!open || groups) return;
    let live = true;
    listMyGroups().then((list) => { if (live) setGroups(list); }).catch(() => { if (live) setGroups([]); });
    return () => { live = false; };
  }, [open, groups]);

  const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((item) => item !== id) : [...list, id]);
  const count = (toFeed ? 1 : 0) + pickedFriends.length + pickedGroups.length;

  async function send() {
    if (!question || busy || !count) return;
    setBusy(true);
    setError(null);
    try {
      const result = await sendStump(question, note, { feed: toFeed, friendIds: pickedFriends, groupIds: pickedGroups });
      setSent(result);
      onSent?.(result);
    } catch (caught) {
      setError(errorText(caught, 'Could not send this question.'));
    } finally {
      setBusy(false);
    }
  }

  const summary = sent
    ? [sent.feed ? 'the feed' : null, sent.friends ? `${sent.friends} friend${sent.friends === 1 ? '' : 's'}` : null, sent.groups ? `${sent.groups} group${sent.groups === 1 ? '' : 's'}` : null].filter(Boolean).join(', ')
    : '';
  const order = question ? stumpOptionOrder(question) : [];

  return (
    <Sheet visible={open} onClose={onClose} title="Stamp a friend" subtitle="Send this question to the feed, to friends or to groups. Stamping a friend in your chat keeps your friend streak.">
      {question ? (
        <View style={styles.composer}>
          <View style={styles.preview}>
            <Text style={styles.prompt}>{question.prompt}</Text>
            {order.map((index, position) => (
              <Text key={index} style={styles.previewOption}>{LETTERS[position]}. {question.options[index]}</Text>
            ))}
            <Text style={styles.muted}>The answer stays hidden until someone answers.</Text>
            {onAnother && !sent ? <Button label="Another question" size="sm" variant="ghost" onPress={onAnother} style={styles.another} /> : null}
          </View>
          {sent ? (
            <>
              <Text style={styles.verdict}>Sent to {summary}.</Text>
              {sent.failed ? <Text style={styles.errorLine}>{sent.failed} could not be sent.</Text> : null}
              <View style={styles.row}>
                {sent.feed ? <Button label="See it on Home" size="sm" variant="secondary" onPress={() => { onClose(); router.push('/'); }} /> : null}
                <Button label="Done" size="sm" onPress={onClose} />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.section}>Send to</Text>
              <PickRow label="Post to the feed" detail="Everyone you share the feed with can answer." on={toFeed} onPress={() => setToFeed((value) => !value)} leading={<View style={styles.feedIcon}><Icon name="social" size={18} color={colors.primaryText} /></View>} />
              {friends.length ? <Text style={styles.subSection}>Friends</Text> : null}
              {friends.map((person) => (
                <PickRow key={person.userId} label={personName(person)} on={pickedFriends.includes(person.userId)} onPress={() => setPickedFriends((list) => toggle(list, person.userId))} leading={<PersonAvatar uid={person.userId} uri={person.avatarUrl} name={personName(person)} size={32} />} />
              ))}
              {groups?.length ? <Text style={styles.subSection}>Groups</Text> : null}
              {(groups ?? []).map((group) => (
                <PickRow key={group.id} label={group.name} detail={`${group.memberUids.length} members`} on={pickedGroups.includes(group.id)} onPress={() => setPickedGroups((list) => toggle(list, group.id))} leading={<Avatar name={group.name} size={32} />} />
              ))}
              {!friends.length ? <Text style={styles.muted}>Friends who follow you back appear here, so you can stamp them in your chat.</Text> : null}
              <TextInput
                value={note}
                onChangeText={setNote}
                maxLength={STUMP_NOTE_MAX}
                placeholder="Add a note (optional), e.g. “Bet you can’t get this one”"
                placeholderTextColor={colors.textTertiary}
                accessibilityLabel="Note to go with the question"
                style={styles.input}
              />
              {error ? <Text style={styles.errorLine}>{error}</Text> : null}
              <View style={styles.row}>
                <Button label={count ? `Send (${count})` : 'Send'} size="sm" onPress={() => void send()} loading={busy} disabled={busy || !count} />
                <Button label="Cancel" size="sm" variant="ghost" onPress={onClose} />
              </View>
            </>
          )}
        </View>
      ) : null}
    </Sheet>
  );
}

function PickRow({ label, detail, on, onPress, leading }: { label: string; detail?: string; on: boolean; onPress: () => void; leading: ReactNode }) {
  const styles = useThemedStyles(createStyles);
  return (
    <Interactive onPress={onPress} accessibilityRole="checkbox" accessibilityState={{ checked: on }} accessibilityLabel={label} style={styles.pickRow}>
      {leading}
      <View style={styles.pickText}>
        <Text style={styles.pickLabel} numberOfLines={1}>{label}</Text>
        {detail ? <Text style={styles.muted} numberOfLines={1}>{detail}</Text> : null}
      </View>
      <View style={[styles.check, on && styles.checkOn]} />
    </Interactive>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: { gap: 10, borderWidth: 1, borderColor: colors.primaryBorder, borderRadius: 14, padding: 14, backgroundColor: colors.primarySubtle },
    head: { flexDirection: 'row', alignItems: 'center', gap: 7 },
    kicker: { fontSize: 11, fontWeight: '800', letterSpacing: 1, color: colors.primaryText },
    concept: { marginLeft: 'auto', maxWidth: '55%' },
    note: { ...Type.callout, color: colors.text, fontStyle: 'italic' },
    prompt: { ...Type.headline, color: colors.text },
    options: { gap: 8 },
    option: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 44, paddingVertical: 9, paddingHorizontal: 12, borderWidth: 1, borderRadius: Radius.md },
    idle: { borderColor: colors.border, backgroundColor: colors.surfaceSunken },
    hover: { borderColor: colors.borderStrong },
    picked: { borderColor: colors.primary, backgroundColor: colors.surfaceSunken },
    right: { borderColor: colors.successBorder, backgroundColor: colors.successSubtle },
    wrong: { borderColor: colors.errorBorder, backgroundColor: colors.errorSubtle },
    letter: { width: 18, fontWeight: '800', color: colors.textSecondary },
    optionText: { ...Type.callout, flex: 1, color: colors.text },
    rightText: { color: colors.successText },
    wrongText: { color: colors.error },
    errorLine: { ...Type.caption, color: colors.error },
    row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10 },
    reveal: { gap: 4 },
    verdict: { ...Type.headline, color: colors.text },
    explanation: { ...Type.callout, color: colors.textSecondary },
    results: { gap: 6, borderTopWidth: 1, borderTopColor: colors.divider, paddingTop: 10 },
    resultsTitle: { ...Type.callout, fontWeight: '700', color: colors.text },
    resultRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    resultName: { ...Type.callout, flex: 1, color: colors.text },
    resultVerdict: { ...Type.caption, fontWeight: '700' },
    muted: { ...Type.caption, color: colors.textTertiary, flexShrink: 1 },
    composer: { gap: 12 },
    preview: { gap: 6, borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 12, backgroundColor: colors.surfaceMuted },
    previewOption: { ...Type.callout, color: colors.text },
    another: { alignSelf: 'flex-start' },
    section: { ...Type.callout, fontWeight: '700', color: colors.text, marginTop: 4 },
    subSection: { ...Type.caption, fontWeight: '700', color: colors.textSecondary, marginTop: 4 },
    pickRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 },
    pickText: { flex: 1, minWidth: 0 },
    pickLabel: { ...Type.callout, color: colors.text },
    feedIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primarySubtle },
    check: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.borderStrong },
    checkOn: { backgroundColor: colors.primary, borderColor: colors.primary },
    input: { minHeight: 42, borderWidth: 1, borderColor: colors.borderStrong, borderRadius: Radius.md, backgroundColor: colors.surfaceSunken, paddingHorizontal: 12, color: colors.text, fontSize: 14 },
  });
}
