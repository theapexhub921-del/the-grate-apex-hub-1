import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Interactive, PressableCard } from '@/components/ui/interactive';
import { Pill } from '@/components/ui/pill';
import { Sheet } from '@/components/ui/sheet';
import { Text, TextInput } from '@/components/ui/text';
import { Type, type ThemeColors } from '@/constants/theme';
import { type Battle, type BattleCourse, battleRecord, battleStatus, createBattle, declineBattle, watchBattles } from '@/data/battles';
import { announceBattle, announceBattleResult } from '@/lib/web-push';
import { readClassSelection } from '@/data/class-curriculum';
import { getTopic, publishedTopics } from '@/data/curriculum';
import { bankQuestions, legacyCoursesForClass, loadLegacyBank } from '@/data/legacy-study';
import { OTHER_PAST_TOPIC, PAST_TOPICS } from '@/data/past-question-topics';
import { useProgress } from '@/data/progress';
import { personName, useSocial } from '@/data/social';
import { useAuth } from '@/hooks/use-auth';
import { useExperience } from '@/hooks/use-experience';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';
import { friendlyError } from '@/lib/errors';

// Connect → Battles (the original app's Compete tab, without XP stakes): the
// card opens a panel with your XP and record and "Challenge someone".
export function BattlesCard() {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const originals = useExperience() === 'originals';
  const { user } = useAuth();
  const uid = user?.uid ?? '';
  const progress = useProgress();
  const social = useSocial();
  const [open, setOpen] = useState(false);
  const [picking, setPicking] = useState(false);
  const [battles, setBattles] = useState<Battle[]>([]);
  const [opponentId, setOpponentId] = useState<string | null>(null);
  const [friendSearchOpen, setFriendSearchOpen] = useState(false);
  const [friendSearch, setFriendSearch] = useState('');
  const [courseKey, setCourseKey] = useState<string | null>(null);
  const [topicOptions, setTopicOptions] = useState<{ id: string; name: string }[]>([]);
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [topicSearch, setTopicSearch] = useState('');
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) {
      setBattles([]);
      return;
    }
    return watchBattles(uid, (next) => {
      setBattles(next);
      setError(null);
    }, (problem) => setError(friendlyError(problem, 'Battles could not be loaded.')));
  }, [uid]);

  // Courses to battle on: the learner's class courses (HB1), else this app's topics.
  const courses = useMemo<BattleCourse[]>(() => {
    const hb = legacyCoursesForClass(readClassSelection(user?.user_metadata)).map((course) => ({ kind: 'hb' as const, id: course.id, name: course.name }));
    return hb.length ? hb : publishedTopics.slice(0, 10).map((topic) => ({ kind: 'topic' as const, id: topic.id, name: topic.title }));
  }, [user?.user_metadata]);
  const people = social.people.filter((person) => person.relationship === 'friends');
  const visiblePeople = people.filter((person) => `${personName(person)} ${person.username ?? ''}`.toLowerCase().includes(friendSearch.trim().replace(/^@/, '').toLowerCase()));
  const selectedCourse = courses.find((item) => `${item.kind}:${item.id}` === courseKey) ?? null;
  const record = battleRecord(battles, uid);
  const yourTurn = battles.filter((battle) => battleStatus(battle, uid) === 'waiting-for-you').length;

  useEffect(() => {
    setSelectedTopicIds([]);
    setTopicSearch('');
    setTopicOptions([]);
    if (!selectedCourse) {
      setTopicsLoading(false);
      return;
    }
    if (selectedCourse.kind === 'topic') {
      const topic = getTopic(selectedCourse.id);
      setTopicOptions((topic?.lessons ?? []).map((lesson) => ({ id: lesson.id, name: lesson.title })));
      setTopicsLoading(false);
      return;
    }
    let live = true;
    setTopicsLoading(true);
    void loadLegacyBank(selectedCourse.id).then((bank) => {
      if (!live) return;
      const known = new Map((PAST_TOPICS[selectedCourse.id] ?? []).map((topic) => [topic.id, topic.title]));
      const names = new Map<string, string>();
      for (const question of bankQuestions(bank)) {
        const id = question.tp?.trim() || question.t?.trim() || 'general';
        const title = id === 'general' || id === OTHER_PAST_TOPIC ? 'Other / general' : known.get(id) ?? id;
        names.set(id, title);
      }
      setTopicOptions([...names].map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name)));
      setTopicsLoading(false);
    }).catch((problem) => {
      if (!live) return;
      setError(friendlyError(problem, 'Topics could not be loaded.'));
      setTopicsLoading(false);
    });
    return () => { live = false; };
  }, [courseKey, courses]);

  async function send() {
    const person = people.find((item) => item.userId === opponentId);
    const course = selectedCourse;
    if (!person || !course || busy) return;
    setBusy(true);
    setError(null);
    try {
      const selectedTopics = topicOptions.filter((topic) => selectedTopicIds.includes(topic.id));
      const battle = await createBattle({ userId: person.userId, username: person.username }, {
        ...course,
        topicIds: selectedTopicIds,
        topicNames: selectedTopicIds.length ? selectedTopics.map((topic) => topic.name) : [],
      });
      void announceBattle(battle.id, person.userId); // their phone is alerted (best effort)
      setOpen(false);
      setPicking(false);
      router.push({ pathname: '/social/battle', params: { id: battle.id } } as never);
    } catch (problem) {
      setError(friendlyError(problem, 'The challenge could not be sent.'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PressableCard onPress={() => setOpen(true)} accessibilityLabel="Battles" style={styles.entry}>
        <View style={styles.entryIcon}>{originals ? <Text style={styles.emoji}>⚔️</Text> : <Icon name="challenge" size={22} color={colors.accentText} />}</View>
        <View style={styles.flex}>
          <Text style={styles.entryTitle}>Battles</Text>
          <Text style={styles.entryText}>Go head-to-head on the same questions. The winner earns XP.</Text>
        </View>
        {yourTurn ? <Pill label={`${yourTurn} your turn`} tone="gold" /> : <Icon name="chevronRight" size={18} color={colors.textTertiary} />}
      </PressableCard>

      <Sheet visible={open} onClose={() => { setOpen(false); setPicking(false); }} title={originals ? '⚔️ Battles' : 'Battles'} subtitle="You both answer the same 10 questions. Higher score wins; a tie goes to the faster player. No XP changes hands.">
        <View style={styles.stats}>
          <View>
            <Text style={styles.statLabel}>YOUR XP</Text>
            <Text style={styles.statValue}>{progress.xp.toLocaleString()}</Text>
          </View>
          <View style={styles.statRight}>
            <Text style={styles.statLabel}>RECORD</Text>
            <Text style={styles.statRecord}>{record.wins}W · {record.losses}L · {record.draws}D</Text>
          </View>
        </View>

        {picking ? (
          <View style={styles.picker}>
            <View style={styles.sectionHeading}>
              <Text style={styles.pickLabel}>Who?</Text>
              <Button label={friendSearchOpen ? 'Close search' : 'Search friends'} variant="ghost" size="sm" icon={<Icon name="search" size={14} color={colors.textSecondary} />} onPress={() => { setFriendSearchOpen((open) => !open); setFriendSearch(''); }} />
            </View>
            {friendSearchOpen ? <TextInput value={friendSearch} onChangeText={setFriendSearch} placeholder="Search friends by name or username" placeholderTextColor={colors.textTertiary} autoCapitalize="none" style={styles.searchInput} accessibilityLabel="Search friends for a battle" /> : null}
            {people.length ? (
              <View style={styles.chips}>
                {visiblePeople.map((person) => (
                  <Interactive key={person.userId} onPress={() => setOpponentId(person.userId)} accessibilityRole="radio" accessibilityState={{ checked: opponentId === person.userId }} style={[styles.chip, opponentId === person.userId && styles.chipOn]}>
                    <Avatar uri={person.avatarUrl} name={personName(person)} size={22} />
                    <Text style={styles.chipText}>{personName(person)}</Text>
                  </Interactive>
                ))}
                {!visiblePeople.length ? <Text style={styles.muted}>No friends match that search.</Text> : null}
              </View>
            ) : (
              <Text style={styles.muted}>Add classmates and follow each other to make friends you can challenge.</Text>
            )}
            <Text style={styles.pickLabel}>On what?</Text>
            <View style={styles.chips}>
              {courses.map((course) => {
                const key = `${course.kind}:${course.id}`;
                return (
                  <Interactive key={key} onPress={() => setCourseKey(key)} accessibilityRole="radio" accessibilityState={{ checked: courseKey === key }} style={[styles.chip, courseKey === key && styles.chipOn]}>
                    <Text style={styles.chipText}>{course.name}</Text>
                  </Interactive>
                );
              })}
            </View>
            {selectedCourse ? (
              <>
                <Text style={styles.pickLabel}>Topics (choose one or more; all are selected by default)</Text>
                {topicsLoading ? <Text style={styles.muted}>Loading topics…</Text> : topicOptions.length ? (
                  <>
                    {topicOptions.length > 8 ? <TextInput value={topicSearch} onChangeText={setTopicSearch} placeholder="Find a topic" placeholderTextColor={colors.textTertiary} style={styles.searchInput} accessibilityLabel="Search battle topics" /> : null}
                    <ScrollView style={styles.topicList} nestedScrollEnabled>
                      <View style={styles.chips}>
                        {topicOptions.filter((topic) => topic.name.toLowerCase().includes(topicSearch.trim().toLowerCase())).map((topic) => {
                          const selected = selectedTopicIds.length === 0 || selectedTopicIds.includes(topic.id);
                          return (
                            <Interactive
                              key={topic.id}
                              onPress={() => setSelectedTopicIds((current) => {
                                if (current.length === 0) return topicOptions.filter((item) => item.id !== topic.id).map((item) => item.id);
                                const next = current.includes(topic.id) ? current.filter((id) => id !== topic.id) : [...current, topic.id];
                                return next.length === topicOptions.length ? [] : next;
                              })}
                              accessibilityRole="checkbox"
                              accessibilityState={{ checked: selected }}
                              style={[styles.chip, selected && styles.chipOn]}
                            >
                              <Text style={styles.chipText}>{topic.name}</Text>
                            </Interactive>
                          );
                        })}
                      </View>
                    </ScrollView>
                  </>
                ) : <Text style={styles.muted}>No topic tags are available; this battle will use the whole course.</Text>}
              </>
            ) : null}
            <View style={styles.row}>
              <Button label="Cancel" variant="ghost" onPress={() => setPicking(false)} />
              <Button label="Send challenge" onPress={() => void send()} loading={busy} disabled={!opponentId || !courseKey || topicsLoading} />
            </View>
          </View>
        ) : (
          <Button label="+ Challenge someone" size="lg" fullWidth onPress={() => setPicking(true)} />
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {battles.length === 0 && !picking ? <Text style={styles.muted}>No battles yet. Challenge a friend to get started.</Text> : null}
        <View style={styles.list}>
          {battles.slice(0, 12).map((battle) => {
            const status = battleStatus(battle, uid);
            const incoming = battle.opponentId === uid;
            const other = incoming ? battle.challengerName : battle.opponentName;
            const mine = incoming ? battle.opponent : battle.challenger;
            const theirs = incoming ? battle.challenger : battle.opponent;
            return (
              <View key={battle.id} style={styles.item}>
                <View style={styles.flex}>
                  <Text style={styles.itemTitle}>{battle.course.name}</Text>
                  <Text style={styles.muted}>
                    {incoming ? `From @${other ?? 'someone'}` : `With @${other ?? 'someone'}`}
                    {battle.course.topicNames?.length ? ` · ${battle.course.topicNames.join(', ')}` : ''}
                    {mine && theirs ? ` · ${mine.score}–${theirs.score}` : mine ? ` · you ${mine.score}/${mine.total}` : ''}
                  </Text>
                </View>
                {status === 'waiting-for-you' ? (
                  <View style={styles.row}>
                    <Button label="Play" size="sm" onPress={() => { setOpen(false); router.push({ pathname: '/social/battle', params: { id: battle.id } } as never); }} />
                    {incoming ? <Button label="Decline" size="sm" variant="ghost" onPress={() => void declineBattle(battle).then(() => { void announceBattleResult(battle.id, battle.challengerId); })} /> : null}
                  </View>
                ) : (
                  <Pill
                    label={status === 'won' ? 'Won' : status === 'lost' ? 'Lost' : status === 'draw' ? 'Draw' : status === 'declined' ? 'Declined' : 'Waiting'}
                    tone={status === 'won' ? 'success' : status === 'lost' ? 'error' : status === 'draw' ? 'gold' : 'neutral'}
                  />
                )}
              </View>
            );
          })}
        </View>
      </Sheet>
    </>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    flex: { flex: 1, minWidth: 0 },
    entry: { flexDirection: 'row', alignItems: 'center', gap: 14, borderColor: colors.accent + '66' },
    entryIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.accentSubtle, alignItems: 'center', justifyContent: 'center' },
    emoji: { fontSize: 24 },
    entryTitle: { ...Type.headline, color: colors.text },
    entryText: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
    stats: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceMuted, marginBottom: 14 },
    statRight: { alignItems: 'flex-end' },
    statLabel: { ...Type.overline, color: colors.textTertiary },
    statValue: { ...Type.title1, color: colors.text },
    statRecord: { fontSize: 18, fontWeight: '800', color: colors.text, marginTop: 4 },
    picker: { gap: 8 },
    sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    searchInput: { borderWidth: 1, borderColor: colors.border, borderRadius: 12, backgroundColor: colors.surface, color: colors.text, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
    topicList: { maxHeight: 180 },
    pickLabel: { fontSize: 13, fontWeight: '800', color: colors.text, marginTop: 6 },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 7, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
    chipOn: { borderColor: colors.primary, backgroundColor: colors.primarySubtle },
    chipText: { fontSize: 13, fontWeight: '700', color: colors.text },
    row: { flexDirection: 'row', gap: 8, justifyContent: 'flex-end' },
    error: { fontSize: 13, color: colors.error, marginTop: 8 },
    muted: { fontSize: 12.5, color: colors.textTertiary, marginTop: 8 },
    list: { gap: 8, marginTop: 12 },
    item: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
    itemTitle: { fontSize: 14, fontWeight: '800', color: colors.text },
  });
}
