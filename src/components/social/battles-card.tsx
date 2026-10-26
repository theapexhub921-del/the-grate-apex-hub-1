import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Interactive, PressableCard } from '@/components/ui/interactive';
import { Pill } from '@/components/ui/pill';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Sheet } from '@/components/ui/sheet';
import { Text, TextInput } from '@/components/ui/text';
import { Type, type ThemeColors } from '@/constants/theme';
import { acceptBattle, type Battle, battleRecord, battleStatus, type BattleStatus, declineBattle, watchBattles } from '@/data/battles';
import { available, BATTLE_RULES, type BankCourse, type BattleCount, type BattleDifficulty, DIFFICULTY_OPTIONS, difficultyName, tierFor } from '@/data/battle-race-rules';
import { acceptRace, createRace, declineRace, loadBattleIndex, raceView, type RaceRoom, type RaceStats, serverNow, watchMyRaces } from '@/data/battle-rooms';
import { announceBattleResult, announceRace } from '@/lib/web-push';
import { readClassSelection } from '@/data/class-curriculum';
import { HB2_COURSES } from '@/data/hb2-study';
import { legacyCoursesForClass } from '@/data/legacy-study';
import { useProgress } from '@/data/progress';
import { personName, predictLearners, searchLearners, useSocial, type SocialPerson } from '@/data/social';
import { rankAndFilterCandidates } from '@/data/social-search';
import { useAuth } from '@/hooks/use-auth';
import { useExperience } from '@/hooks/use-experience';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';
import { friendlyError } from '@/lib/errors';

// Connect → Battles: XP battles (owner, 2026-10-26). The card opens a panel with your
// battle tier and record and "Challenge someone": who, which course and topics, 10/20/30
// questions and a difficulty. A battle is a live room refereed by the server
// (components/social/battle-room.tsx, data/battle-rooms.ts). Battles from before then
// (each played in your own time) are kept under "Earlier".
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
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [topicSearch, setTopicSearch] = useState('');
  const [bankIndex, setBankIndex] = useState<BankCourse[] | null>(null);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [count, setCount] = useState<BattleCount>(10);
  const [difficulty, setDifficulty] = useState<BattleDifficulty>('mixed');
  const [rooms, setRooms] = useState<RaceRoom[]>([]);
  const [stats, setStats] = useState<RaceStats | null>(null);
  const refreshRooms = useRef<(() => void) | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Live only while Connect is on screen: the listeners follow every opponent's
  // profile, and Connect stays open in the background once visited.
  useFocusEffect(useCallback(() => {
    if (!uid) {
      setBattles([]);
      return;
    }
    const stopOlder = watchBattles(uid, (next) => {
      setBattles(next);
    }, () => undefined);
    const races = watchMyRaces(uid, (next) => {
      setRooms(next);
      setError(null);
    }, setStats, (problem) => setError(friendlyError(problem, 'Battles could not be loaded.')));
    refreshRooms.current = races.refresh;
    return () => {
      stopOlder();
      races.stop();
      refreshRooms.current = null;
    };
  }, [uid]));

  // Open invites count down: redraw every few seconds while the panel is open.
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!open || !rooms.length) return;
    const timer = setInterval(() => setTick((tick) => tick + 1), 5_000);
    return () => clearInterval(timer);
  }, [open, rooms.length]);

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

  // Courses to battle on: the learner's class courses, else HB2's three (this app's own topics).
  const courses = useMemo(() => {
    const mine = legacyCoursesForClass(readClassSelection(user?.user_metadata));
    return (mine.length ? mine : HB2_COURSES).map((course) => ({ kind: 'hb' as const, id: course.id, name: course.name }));
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
  const tier = tierFor(stats?.points ?? 0);
  const openRooms = rooms.filter((room) => room.open && !(room.status === 'invited' && serverNow() > room.expiresAt));
  const waitingOnMe = openRooms.filter((room) => (room.status === 'invited' && room.opponent.uid === uid) || (room.status === 'lobby' && !room.ready?.[uid]) || room.status === 'live').length;
  const yourTurn = waitingOnMe + battles.filter((battle) => battleStatus(battle, uid) === 'waiting-for-you').length;
  // Open battles first; finished ones and the older battles are one switch away
  // (owner, 2026-10-24: not everything at once).
  const [view, setView] = useState<BattleView>('open');
  const recent = stats?.recent ?? [];
  const olderOpen = battles.filter((battle) => OPEN.has(battleStatus(battle, uid)));

  const bankCourse = bankIndex?.find((course) => course.id === selectedCourse?.id) ?? null;
  const topicOptions = useMemo(() => (bankCourse?.topics ?? []).map((topic) => ({ id: topic.id, name: topic.title })), [bankCourse]);
  const supply = bankCourse ? available(bankCourse.topics, selectedTopicIds, difficulty) : null;
  const rated = bankCourse ? bankCourse.topics.some((topic) => topic.easy + topic.medium + topic.hard > 0) : true;

  // The topics come from the battle bank, the same file the server picks questions from,
  // so every topic with questions shows (e.g. Fatty Acid Biosynthesis in Biochemistry).
  useEffect(() => {
    setSelectedTopicIds([]);
    setTopicSearch('');
  }, [courseKey]);
  useEffect(() => {
    if (!picking || bankIndex) return;
    let live = true;
    setTopicsLoading(true);
    loadBattleIndex()
      .then((index) => { if (live) setBankIndex(index); })
      .catch((problem) => { if (live) setError(friendlyError(problem, 'Topics could not be loaded.')); })
      .finally(() => { if (live) setTopicsLoading(false); });
    return () => { live = false; };
  }, [picking, bankIndex]);

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
      const room = await createRace({
        opponent: { uid: person.userId, name: person.username },
        course: { kind: 'hb', id: course.id, name: course.name, topicIds: selectedTopicIds, topicNames: selectedTopics.map((topic) => topic.name) },
        count,
        difficulty,
      });
      void announceRace('race', room.id, person.userId); // their phone is alerted (best effort)
      refreshRooms.current?.();
      setOpen(false);
      setPicking(false);
      router.push({ pathname: '/social/battle', params: { room: room.id } } as never);
    } catch (problem) {
      setError(friendlyError(problem, 'The challenge could not be sent.'));
    } finally {
      setBusy(false);
    }
  }

  const enter = (room: RaceRoom) => {
    setOpen(false);
    router.push({ pathname: '/social/battle', params: { room: room.id } } as never);
  };

  return (
    <>
      <PressableCard onPress={() => setOpen(true)} accessibilityLabel="Battles" style={styles.entry}>
        <View style={styles.entryIcon}>{originals ? <Text style={styles.emoji}>⚔️</Text> : <Icon name="challenge" size={22} color={colors.accentText} />}</View>
        <View style={styles.flex}>
          <Text style={styles.entryTitle}>Battles</Text>
          <Text style={styles.entryText}>Race a friend through the same questions, live. Most XP wins.</Text>
        </View>
        {yourTurn ? <Pill label={`${yourTurn} your turn`} tone="gold" /> : <Icon name="chevronRight" size={18} color={colors.textTertiary} />}
      </PressableCard>

      <Sheet visible={open} onClose={() => { setOpen(false); setPicking(false); }} title={originals ? '⚔️ Battles' : 'Battles'} subtitle={`A live race through the same questions. Right +${BATTLE_RULES.right} XP, wrong ${BATTLE_RULES.wrong}, skip 0. Most XP wins; level goes to whoever finishes first. Nobody's XP is taken.`}>
        <View style={styles.stats}>
          <View>
            <Text style={styles.statLabel}>BATTLE TIER</Text>
            <Text style={styles.statValue}>{tier.name}</Text>
            <Text style={styles.tierNext}>{tier.next ? `${tier.points} points · ${tier.next.needed} to ${tier.next.name}` : `${tier.points} points · the top tier`}</Text>
          </View>
          <View style={styles.statRight}>
            <Text style={styles.statLabel}>RECORD</Text>
            <Text style={styles.statRecord}>{stats?.wins ?? 0}W · {stats?.losses ?? 0}L · {stats?.draws ?? 0}D</Text>
            <Text style={styles.tierNext}>{progress.xp.toLocaleString()} XP in all</Text>
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
                <Text style={styles.pickLabel}>Topics (all are chosen until you pick some)</Text>
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
                ) : bankIndex ? <Text style={styles.muted}>This course has no battle questions yet.</Text> : null}

                <Text style={styles.pickLabel}>How many questions?</Text>
                <View style={styles.chips}>
                  {BATTLE_RULES.counts.map((option) => {
                    const enough = !supply || supply.total >= option;
                    return (
                      <Interactive key={option} onPress={() => setCount(option)} disabled={!enough} accessibilityRole="radio" accessibilityState={{ checked: count === option, disabled: !enough }} style={[styles.chip, count === option && styles.chipOn]}>
                        <Text style={styles.chipText}>{option}</Text>
                      </Interactive>
                    );
                  })}
                </View>

                <Text style={styles.pickLabel}>Difficulty</Text>
                <View style={styles.chips}>
                  {DIFFICULTY_OPTIONS.map((option) => (
                    <Interactive key={option.value} onPress={() => setDifficulty(option.value)} disabled={!rated && option.value !== 'mixed'} accessibilityRole="radio" accessibilityState={{ checked: difficulty === option.value }} accessibilityHint={option.hint} style={[styles.chip, difficulty === option.value && styles.chipOn]}>
                      <Text style={styles.chipText}>{option.label}</Text>
                      <Text style={styles.chipTag}>{option.hint}</Text>
                    </Interactive>
                  ))}
                </View>
                {supply ? (
                  <Text style={[styles.muted, supply.total < count && styles.warn]}>
                    {supply.total < count
                      ? `These topics have ${supply.total} questions: choose more topics or fewer questions.`
                      : difficulty !== 'mixed' && supply.exact < count
                        ? `${supply.exact} ${difficultyName(difficulty)} questions on these topics; the rest will be the nearest level.`
                        : `${supply.total.toLocaleString()} questions to draw from${difficulty !== 'mixed' ? ` (${supply.exact.toLocaleString()} ${difficultyName(difficulty)})` : ''}. None repeat in a battle.`}
                  </Text>
                ) : null}
                {!rated ? <Text style={styles.muted}>This course's questions have no difficulty set yet, so its battles are Mixed.</Text> : null}
              </>
            ) : null}
            <Text style={styles.muted}>{`They have ${BATTLE_RULES.inviteMinutes} minutes to accept. Then you both press Ready and start together.`}</Text>
            <View style={styles.row}>
              <Button label="Cancel" variant="ghost" onPress={() => setPicking(false)} />
              <Button label="Send challenge" onPress={() => void send()} loading={busy} disabled={!opponentId || !courseKey || topicsLoading || Boolean(supply && supply.total < count)} />
            </View>
          </View>
        ) : (
          <Button label="+ Challenge someone" size="lg" fullWidth onPress={() => setPicking(true)} />
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.viewSwitch}>
          <SegmentedControl
            label="Show"
            value={view}
            onChange={setView}
            options={[
              { value: 'open', label: 'Open', count: openRooms.length },
              { value: 'recent', label: 'Recent', count: recent.length },
              ...(battles.length ? [{ value: 'earlier' as const, label: 'Earlier', count: olderOpen.length || undefined }] : []),
            ]}
          />
        </View>

        {view === 'open' ? (
          <View style={styles.list}>
            {openRooms.length === 0 ? <Text style={styles.muted}>{picking ? 'No open battles.' : 'No open battles. Challenge a friend to get started.'}</Text> : null}
            {openRooms.map((room) => {
              const { them, iAmChallenger } = raceView(room, uid);
              const left = room.expiresAt - serverNow();
              const line = room.status === 'invited'
                ? (iAmChallenger ? `Waiting for @${them.name ?? 'them'} · expires in ${Math.max(0, Math.ceil(left / 60_000))} min` : `From @${them.name ?? 'someone'} · ${Math.max(0, Math.ceil(left / 60_000))} min left to accept`)
                : room.status === 'lobby' ? `Room open with @${them.name ?? 'them'} · ${room.ready?.[uid] ? 'you are ready' : 'press Ready'}` : `Live with @${them.name ?? 'them'}`;
              return (
                <View key={room.id} style={styles.item}>
                  <View style={styles.flex}>
                    <Text style={styles.itemTitle}>{room.course.name} · {room.count} · {difficultyName(room.difficulty)}</Text>
                    <Text style={styles.muted}>{line}</Text>
                  </View>
                  {room.status === 'invited' && !iAmChallenger ? (
                    <View style={styles.row}>
                      <Button label="Accept & join" size="sm" onPress={() => { void acceptRace(room.id).then(() => { void announceRace('race-accepted', room.id, them.uid); enter(room); }).catch((problem) => setError(friendlyError(problem, 'The battle could not be joined.'))); }} />
                      <Button label="Decline" size="sm" variant="ghost" onPress={() => { void declineRace(room.id).then(() => refreshRooms.current?.()).catch((problem) => setError(friendlyError(problem, 'The challenge could not be declined.'))); }} />
                    </View>
                  ) : (
                    <Button label={room.status === 'live' ? 'Back to battle' : 'Open room'} size="sm" onPress={() => enter(room)} />
                  )}
                </View>
              );
            })}
          </View>
        ) : view === 'recent' ? (
          <View style={styles.list}>
            {recent.length === 0 ? <Text style={styles.muted}>Finished battles show here, with the score and the XP you earned.</Text> : null}
            {recent.map((entry) => (
              <Interactive key={entry.id} onPress={() => { setOpen(false); router.push({ pathname: '/social/battle', params: { room: entry.id } } as never); }} style={styles.item} accessibilityLabel={`${entry.course} against @${entry.withName ?? 'someone'}: ${entry.result}`}>
                <View style={styles.flex}>
                  <Text style={styles.itemTitle}>{entry.course} · {entry.count} · {difficultyName(entry.difficulty)}</Text>
                  <Text style={styles.muted}>With @{entry.withName ?? 'someone'} · {entry.mine}–{entry.theirs} XP · +{entry.xp} XP earned</Text>
                </View>
                <Pill label={entry.result === 'win' ? 'Won' : entry.result === 'loss' ? 'Lost' : 'Draw'} tone={entry.result === 'win' ? 'success' : entry.result === 'loss' ? 'error' : 'gold'} />
              </Interactive>
            ))}
          </View>
        ) : (
          <View style={styles.list}>
            <Text style={styles.muted}>Battles from before live rooms, each played in your own time. Record: {record.wins}W · {record.losses}L · {record.draws}D.</Text>
            {battles.map((battle) => {
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
                      <Button label="Play" size="sm" onPress={() => { setOpen(false); router.push({ pathname: '/social/battle', params: { id: battle.id } } as never); }} />
                    </View>
                  ) : (
                    <Pill
                      label={status === 'won' ? 'Won' : status === 'lost' ? 'Lost' : status === 'draw' ? 'Draw' : status === 'declined' ? 'Declined' : status === 'waiting-for-response' ? 'Waiting for response' : 'Waiting'}
                      tone={status === 'won' ? 'success' : status === 'lost' ? 'error' : status === 'draw' ? 'gold' : 'neutral'}
                    />
                  )}
                </View>
              );
            })}
          </View>
        )}
      </Sheet>
    </>
  );
}

type BattleView = 'open' | 'recent' | 'earlier';
// Still needs someone: a challenge to accept or decline, a turn to play, or a reply to come.
const OPEN = new Set<BattleStatus>(['incoming-challenge', 'waiting-for-you', 'waiting-for-response', 'waiting-for-them']);

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
    tierNext: { fontSize: 12, color: colors.textTertiary, marginTop: 2 },
    warn: { color: colors.error },
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
    viewSwitch: { marginTop: 14 },
    item: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
    itemTitle: { fontSize: 14, fontWeight: '800', color: colors.text },
  });
}
