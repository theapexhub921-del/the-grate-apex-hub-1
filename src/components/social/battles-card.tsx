import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Interactive, PressableCard } from '@/components/ui/interactive';
import { Pill } from '@/components/ui/pill';
import { Sheet } from '@/components/ui/sheet';
import { Text, TextInput } from '@/components/ui/text';
import { Type, type ThemeColors } from '@/constants/theme';
import { acceptBattle, type Battle, type BattleCourse, battleRecord, battleStatus, createBattle, declineBattle, watchBattles } from '@/data/battles';
import { announceBattle, announceBattleResult } from '@/lib/web-push';
import { readClassSelection } from '@/data/class-curriculum';
import { getTopic, publishedTopics } from '@/data/curriculum';
import { bankQuestions, legacyCoursesForClass, loadLegacyBank } from '@/data/legacy-study';
import { OTHER_PAST_TOPIC, PAST_TOPICS } from '@/data/past-question-topics';
import { useProgress } from '@/data/progress';
import { personName, predictLearners, searchLearners, useSocial, type SocialPerson } from '@/data/social';
import { rankAndFilterCandidates } from '@/data/social-search';
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
  const [selectedOpponent, setSelectedOpponent] = useState<SocialPerson | null>(null);
  const [friendSearchOpen, setFriendSearchOpen] = useState(false);
  const [friendSearch, setFriendSearch] = useState('');
  const [remoteResults, setRemoteResults] = useState<SocialPerson[]>([]);
  const [searchingRemote, setSearchingRemote] = useState(false);
  const [courseKey, setCourseKey] = useState<string | null>(null);
  const [topicOptions, setTopicOptions] = useState<{ id: string; name: string }[]>([]);
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [topicSearch, setTopicSearch] = useState('');
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Live only while Connect is on screen: the listeners follow every opponent's
  // profile, and Connect stays open in the background once visited.
  useFocusEffect(useCallback(() => {
    if (!uid) {
      setBattles([]);
      return;
    }
    return watchBattles(uid, (next) => {
      setBattles(next);
      setError(null);
    }, (problem) => setError(friendlyError(problem, 'Battles could not be loaded.')));
  }, [uid]));

  // Debounced search for learners across the app when searching for battle opponents
  useEffect(() => {
    const trimmed = friendSearch.trim().replace(/^@+/, '');
    if (!trimmed) {
      setRemoteResults([]);
      setSearchingRemote(false);
      return;
    }
    let cancelled = false;
    setSearchingRemote(true);
    const timer = setTimeout(() => {
      searchLearners(trimmed)
        .then((found) => {
          if (!cancelled) {
            setRemoteResults(found);
            setSearchingRemote(false);
          }
        })
        .catch(() => {
          if (!cancelled) setSearchingRemote(false);
        });
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [friendSearch]);

  // Courses to battle on: the learner's class courses (HB1), else this app's topics.
  const courses = useMemo<BattleCourse[]>(() => {
    const hb = legacyCoursesForClass(readClassSelection(user?.user_metadata)).map((course) => ({ kind: 'hb' as const, id: course.id, name: course.name }));
    return hb.length ? hb : publishedTopics.slice(0, 10).map((topic) => ({ kind: 'topic' as const, id: topic.id, name: topic.title }));
  }, [user?.user_metadata]);

  const defaultPeople = useMemo(() => {
    const friends = social.people.filter((person) => person.relationship === 'friends');
    return friends.length ? friends : social.people;
  }, [social.people]);

  const visiblePeople = useMemo(() => {
    const trimmed = friendSearch.trim().replace(/^@+/, '');
    if (!trimmed) return defaultPeople;
    const local = predictLearners(trimmed, social.people);
    return rankAndFilterCandidates([...local, ...remoteResults], trimmed, 20);
  }, [friendSearch, defaultPeople, social.people, remoteResults]);
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
    const person =
      (selectedOpponent && selectedOpponent.userId === opponentId)
        ? selectedOpponent
        : visiblePeople.find((item) => item.userId === opponentId) ??
          social.people.find((item) => item.userId === opponentId) ??
          remoteResults.find((item) => item.userId === opponentId);
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
            {friendSearchOpen ? (
              <TextInput
                value={friendSearch}
                onChangeText={setFriendSearch}
                placeholder="Search friends or classmates by name or username"
                placeholderTextColor={colors.textTertiary}
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.searchInput}
                accessibilityLabel="Search friends or classmates for a battle"
              />
            ) : null}
            {visiblePeople.length ? (
              <View style={styles.chips}>
                {visiblePeople.map((person) => {
                  const isSelected = opponentId === person.userId;
                  const isFriend = person.relationship === 'friends';
                  return (
                    <Interactive
                      key={person.userId}
                      onPress={() => {
                        setOpponentId(person.userId);
                        setSelectedOpponent(person);
                      }}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: isSelected }}
                      style={[styles.chip, isSelected && styles.chipOn]}
                    >
                      <Avatar uri={person.avatarUrl} name={personName(person)} size={22} />
                      <Text style={styles.chipText}>{personName(person)}</Text>
                      {isFriend ? (
                        <Text style={styles.chipTag}>Friend</Text>
                      ) : person.username ? (
                        <Text style={styles.chipTag}>@{person.username}</Text>
                      ) : null}
                    </Interactive>
                  );
                })}
              </View>
            ) : searchingRemote ? (
              <Text style={styles.muted}>Searching for “{friendSearch.trim()}”…</Text>
            ) : friendSearch.trim() ? (
              <Text style={styles.muted}>No learners match “{friendSearch.trim()}”.</Text>
            ) : (
              <Text style={styles.muted}>Search for any classmate or friend by name or username to challenge them.</Text>
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
                {status === 'incoming-challenge' ? (
                  <View style={styles.row}>
                    <Button label="Accept & join" size="sm" onPress={() => { void acceptBattle(battle).then(() => { setOpen(false); router.push({ pathname: '/social/battle', params: { id: battle.id } } as never); }).catch((problem) => setError(friendlyError(problem, 'The battle could not be joined.'))); }} />
                    <Button label="Decline" size="sm" variant="ghost" onPress={() => { void declineBattle(battle).then(() => announceBattleResult(battle.id, battle.challengerId)).catch((problem) => setError(friendlyError(problem, 'The challenge could not be declined.'))); }} />
                  </View>
                ) : status === 'waiting-for-you' ? (
                  <View style={styles.row}>
                    <Button label="Join room" size="sm" onPress={() => { setOpen(false); router.push({ pathname: '/social/battle', params: { id: battle.id } } as never); }} />
                  </View>
                ) : (
                  <Pill
                    label={status === 'won' ? 'Won' : status === 'lost' ? 'Lost' : status === 'draw' ? 'Draw' : status === 'declined' ? 'Declined' : status === 'waiting-for-response' ? 'Waiting for response' : 'In room · waiting'}
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
    chipTag: { fontSize: 11, color: colors.textTertiary, fontWeight: '500' },
    row: { flexDirection: 'row', gap: 8, justifyContent: 'flex-end' },
    error: { fontSize: 13, color: colors.error, marginTop: 8 },
    muted: { fontSize: 12.5, color: colors.textTertiary, marginTop: 8 },
    list: { gap: 8, marginTop: 12 },
    item: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
    itemTitle: { fontSize: 14, fontWeight: '800', color: colors.text },
  });
}
