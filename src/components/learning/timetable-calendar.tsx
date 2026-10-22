import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Card, Interactive } from '@/components/ui/interactive';
import { List, ListRow } from '@/components/ui/list';
import { ProgressBar } from '@/components/ui/progress-bar';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Text } from '@/components/ui/text';
import { Type, type ThemeColors } from '@/constants/theme';
import type { TimetableBlock } from '@/data/planning';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';

// The personal timetable as a calendar app: a toolbar (Today, previous / next,
// Day · Week · Month, Add), a side panel (month calendar, today's blocks,
// hours planned this week by subject) and the calendar itself — blocks drawn
// at their time and length, in a colour for their subject, with a line for now.

export type View3 = 'day' | 'week' | 'month';
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOUR = 58;

const minutesOf = (time: string) => {
  if (time.slice(0, 5) === '24:00') return 1440;
  const [h, m] = time.slice(0, 5).split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
};
const durationOf = (entry: TimetableBlock) => {
  const start = minutesOf(entry.start_time);
  let end = minutesOf(entry.end_time);
  if (end <= start) end += 1440;
  return end - start;
};
const hourLabel = (hour: number) => `${String(hour).padStart(2, '0')}:00`;
const dayStart = (date: Date) => { const d = new Date(date); d.setHours(0, 0, 0, 0); return d; };
const mondayOf = (date: Date) => { const d = dayStart(date); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d; };
const addDays = (date: Date, days: number) => { const d = new Date(date); d.setDate(d.getDate() + days); return d; };
const isoDay = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const weekdayOf = (date: Date) => (date.getDay() + 6) % 7;
const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

/** The blocks on a date: weekly ones on that weekday, and one-off ones dated that day. */
export function blocksOn(entries: readonly TimetableBlock[], date: Date) {
  const iso = isoDay(date);
  const previousIso = isoDay(addDays(date, -1));
  const day = weekdayOf(date);
  const previousDay = (day + 6) % 7;
  return entries
    .filter((entry) => {
      const startsToday = entry.event_date ? entry.event_date === iso : entry.weekday === day;
      const startedYesterday = entry.event_date ? entry.event_date === previousIso : entry.weekday === previousDay;
      return startsToday || (startedYesterday && durationOf(entry) > 1440 - minutesOf(entry.start_time));
    })
    .sort((a, b) => a.start_time.localeCompare(b.start_time));
}

/** The part of a block that falls on the selected date, in minutes from midnight. */
function segmentOn(entry: TimetableBlock, date: Date): [number, number] {
  const startsToday = entry.event_date ? entry.event_date === isoDay(date) : entry.weekday === weekdayOf(date);
  const start = startsToday ? minutesOf(entry.start_time) : 0;
  const end = startsToday ? Math.min(1440, start + durationOf(entry)) : Math.min(1440, durationOf(entry) - minutesOf(entry.start_time));
  return [start, Math.max(start + 15, end)];
}

export function TimetableCalendar({ entries, name, onAdd, onSelect }: {
  entries: readonly TimetableBlock[];
  name?: string | null;
  onAdd: (defaults?: { weekday: number; start: string }) => void;
  onSelect: (entry: TimetableBlock) => void;
}) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const { width } = useWindowDimensions();
  const wide = width >= 1100;
  const compact = width < 700;
  const [now, setNow] = useState(() => new Date());
  const [view, setView] = useState<View3>(width < 700 ? 'day' : 'week');
  const [anchor, setAnchor] = useState(() => dayStart(new Date()));
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const palette = useMemo(() => [
    { bg: colors.primarySubtle, edge: colors.primary, text: colors.primaryText },
    { bg: colors.successSubtle, edge: colors.success, text: colors.successText },
    { bg: colors.accentSubtle, edge: colors.accent, text: colors.accentText },
    { bg: colors.infoSubtle, edge: colors.info, text: colors.infoText },
    { bg: colors.errorSubtle, edge: colors.error, text: colors.error },
    { bg: colors.warningSubtle, edge: colors.warningStrong, text: colors.warningText },
  ], [colors]);
  const tintOf = (entry: TimetableBlock) => {
    const key = (entry.subject || entry.title).toLowerCase();
    let h = 0;
    for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
    return palette[h % palette.length];
  };

  const monday = mondayOf(anchor);
  const days = view === 'day' ? [anchor] : Array.from({ length: 7 }, (_, i) => addDays(monday, i));
  const step = (direction: number) => {
    if (view === 'day') setAnchor(addDays(anchor, direction));
    else if (view === 'week') setAnchor(addDays(anchor, 7 * direction));
    else setAnchor(new Date(anchor.getFullYear(), anchor.getMonth() + direction, 1));
  };
  const range = view === 'day'
    ? anchor.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })
    : view === 'week'
      ? `${monday.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })} – ${addDays(monday, 6).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}`
      : anchor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  // Hours shown: the blocks' span, at least 07:00–19:00.
  const [first, last] = useMemo(() => {
    const hasLongBlock = entries.some((entry) => durationOf(entry) >= 1440 || durationOf(entry) > 1440 - minutesOf(entry.start_time));
    let start = hasLongBlock ? 0 : 7 * 60;
    let end = hasLongBlock ? 24 * 60 : 19 * 60;
    for (const entry of entries) {
      start = Math.min(start, minutesOf(entry.start_time));
      end = Math.max(end, minutesOf(entry.end_time));
    }
    return [Math.max(0, Math.floor(start / 60)), Math.min(24, Math.ceil(end / 60))];
  }, [entries]);
  const hours = Array.from({ length: last - first }, (_, i) => first + i);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const nowTop = ((nowMinutes - first * 60) / 60) * HOUR;

  // This week's planned hours, by subject.
  const weekHours = useMemo(() => {
    const totals = new Map<string, number>();
    for (let i = 0; i < 7; i++) {
      for (const entry of blocksOn(entries, addDays(mondayOf(now), i))) {
        const key = entry.subject?.trim() || entry.title;
        // Count recurring blocks on their start day only; overnight portions are
        // visible the next day but belong to the same planned session.
        const startsOnThisDay = entry.event_date
          ? entry.event_date === isoDay(addDays(mondayOf(now), i))
          : entry.weekday === i;
        if (startsOnThisDay) totals.set(key, (totals.get(key) ?? 0) + durationOf(entry) / 60);
      }
    }
    return [...totals.entries()].sort((a, b) => b[1] - a[1]);
  }, [entries, now]);
  const totalHours = weekHours.reduce((sum, [, value]) => sum + value, 0);
  const today = blocksOn(entries, now);

  const toolbar = (
    <View style={styles.toolbar}>
      <View style={styles.greeting}>
        <Text style={styles.hello}>{name ? `Hi, ${name}` : 'Your timetable'}</Text>
        <Text style={styles.helloSub}>Keep moving forward</Text>
      </View>
      <View style={styles.controls}>
        <View style={styles.nav}>
          <Interactive onPress={() => step(-1)} accessibilityRole="button" accessibilityLabel={`Previous ${view}`} style={styles.navButton}><Icon name="chevronLeft" size={16} color={colors.text} /></Interactive>
          <Button label="Today" size="sm" variant="secondary" onPress={() => setAnchor(dayStart(new Date()))} />
          <Interactive onPress={() => step(1)} accessibilityRole="button" accessibilityLabel={`Next ${view}`} style={styles.navButton}><Icon name="chevronRight" size={16} color={colors.text} /></Interactive>
          <Text style={styles.range}>{range}</Text>
        </View>
        <View style={styles.viewSwitch}>
          <SegmentedControl label="Calendar view" options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]} value={view} onChange={(value) => setView(value as View3)} />
        </View>
        <Button label="Add" size="sm" icon={<Icon name="plus" size={15} color={colors.onPrimary} />} onPress={() => onAdd()} />
      </View>
    </View>
  );

  const grid = view === 'month' ? (
    <MonthGrid anchor={anchor} entries={entries} now={now} tintOf={tintOf} onPick={(date) => { setAnchor(date); setView('day'); }} />
  ) : (
    <ScrollView horizontal={view === 'week'} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroller}>
      <View style={[styles.grid, view === 'week' && styles.gridWeek]}>
        <View style={styles.headRow}>
          <View style={styles.gutter} />
          {days.map((date) => {
            const isToday = sameDay(date, now);
            return (
              <View key={date.toISOString()} style={styles.dayHead}>
                <Text style={[styles.dayName, isToday && styles.dayNameToday]}>{DAYS[weekdayOf(date)]}</Text>
                <View style={[styles.dateChip, isToday && styles.dateChipToday]}>
                  <Text style={[styles.dateText, isToday && styles.dateTextToday]}>{date.getDate()}</Text>
                </View>
              </View>
            );
          })}
        </View>
        <View style={styles.body}>
          <View style={styles.gutter}>
            {hours.map((hour) => <Text key={hour} style={[styles.hour, { height: HOUR }]}>{hourLabel(hour)}</Text>)}
          </View>
          {days.map((date) => {
            const isToday = sameDay(date, now);
            return (
              <View key={date.toISOString()} style={[styles.column, { height: hours.length * HOUR }, isToday && styles.columnToday]}>
                {hours.map((hour) => (
                  <Interactive key={hour} onPress={() => onAdd({ weekday: weekdayOf(date), start: hourLabel(hour) })} accessibilityRole="button" accessibilityLabel={`Add a block on ${DAYS[weekdayOf(date)]} at ${hourLabel(hour)}`} style={[styles.slot, { top: (hour - first) * HOUR, height: HOUR }]}><View /></Interactive>
                ))}
                {blocksOn(entries, date).map((entry) => {
                  const [start, end] = segmentOn(entry, date);
                  const tint = tintOf(entry);
                  const tall = end - start >= 60;
                  return (
                    <Interactive
                      key={entry.id}
                      onPress={() => onSelect(entry)}
                      accessibilityRole="button"
                      accessibilityLabel={`${entry.title}, ${entry.start_time.slice(0, 5)} to ${entry.end_time.slice(0, 5)}${entry.subject ? `, ${entry.subject}` : ''}`}
                      style={({ hovered }) => [styles.block, { top: ((start - first * 60) / 60) * HOUR + 2, height: ((end - start) / 60) * HOUR - 4, backgroundColor: tint.bg, borderLeftColor: tint.edge }, hovered && styles.blockHover]}
                    >
                      <Text style={[styles.blockTitle, { color: tint.text }]} numberOfLines={tall ? 2 : 1}>{entry.title}</Text>
                      <Text style={styles.blockTime} numberOfLines={1}>{entry.start_time.slice(0, 5)} – {entry.end_time.slice(0, 5)}</Text>
                      {tall && entry.subject ? <Text style={styles.blockSubject} numberOfLines={1}>{entry.subject}</Text> : null}
                      {view === 'day' && entry.notes ? <Text style={styles.blockSubject} numberOfLines={2}>{entry.notes}</Text> : null}
                    </Interactive>
                  );
                })}
                {isToday && nowMinutes >= first * 60 && nowMinutes <= last * 60 ? (
                  <View style={[styles.now, { top: nowTop }]} pointerEvents="none"><View style={styles.nowDot} /></View>
                ) : null}
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );

  const side = (
    <View style={styles.side}>
      {/* Remounts when the chosen month changes, so it follows Today and the arrows. */}
      <MiniMonth key={`${anchor.getFullYear()}-${anchor.getMonth()}`} anchor={anchor} now={now} entries={entries} onPick={(date) => setAnchor(date)} />
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Today</Text>
        {today.length ? today.map((entry) => {
          const tint = tintOf(entry);
          return (
            <Interactive key={entry.id} onPress={() => onSelect(entry)} accessibilityRole="button" style={styles.agendaRow}>
              <View style={[styles.agendaDot, { backgroundColor: tint.edge }]} />
              <View style={styles.flex}>
                <Text style={styles.agendaTitle} numberOfLines={1}>{entry.title}</Text>
                <Text style={styles.agendaTime}>{entry.start_time.slice(0, 5)} – {entry.end_time.slice(0, 5)}</Text>
              </View>
            </Interactive>
          );
        }) : <Text style={styles.agendaTime}>Nothing planned today.</Text>}
      </View>
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>This week</Text>
        <Text style={styles.bigNumber}>{totalHours % 1 ? totalHours.toFixed(1) : totalHours}<Text style={styles.agendaTime}> hours planned</Text></Text>
        {weekHours.slice(0, 5).map(([subject, value]) => (
          <View key={subject} style={styles.subjectRow}>
            <View style={styles.subjectHead}><Text style={styles.agendaTitle} numberOfLines={1}>{subject}</Text><Text style={styles.agendaTime}>{value % 1 ? value.toFixed(1) : value} h</Text></View>
            <ProgressBar value={totalHours ? value / totalHours : 0} height={5} label={`${subject} hours`} />
          </View>
        ))}
      </View>
    </View>
  );

  // Phones and narrow windows: the same timetable as a list you can read at a
  // glance — the day's blocks in time order, the week day by day, or the month
  // with a dot for each block — instead of a wide hour grid.
  if (compact) {
    const viewedDays = view === 'week' ? Array.from({ length: 7 }, (_, i) => addDays(monday, i)) : [anchor];
    const blockRow = (entry: TimetableBlock) => (
      <ListRow
        key={entry.id}
        leading={<View style={[styles.phoneBar, { backgroundColor: tintOf(entry).edge }]} />}
        title={entry.title}
        detail={entry.subject || undefined}
        meta={`${entry.start_time.slice(0, 5)}–${entry.end_time.slice(0, 5)}`}
        onPress={() => onSelect(entry)}
        accessibilityLabel={`${entry.title}, ${entry.start_time.slice(0, 5)} to ${entry.end_time.slice(0, 5)}${entry.subject ? `, ${entry.subject}` : ''}. Edit`}
      />
    );
    const showingToday = view === 'day' ? sameDay(anchor, now) : view === 'week' ? mondayOf(now).getTime() === monday.getTime() : anchor.getMonth() === now.getMonth() && anchor.getFullYear() === now.getFullYear();
    return (
      <Card style={styles.phoneCard}>
        <View style={styles.phoneHead}>
          <View style={styles.flex}>
            <Text style={styles.phoneTitle}>Timetable</Text>
            <Text style={styles.agendaTime}>Classes and study blocks that repeat every week.</Text>
          </View>
          <Button label="Add" size="sm" icon={<Icon name="plus" size={15} color={colors.onPrimary} />} onPress={() => onAdd({ weekday: weekdayOf(view === 'day' ? anchor : now), start: '09:00' })} />
        </View>
        <View style={styles.phoneNav}>
          <Interactive onPress={() => step(-1)} accessibilityRole="button" accessibilityLabel={`Previous ${view}`} style={styles.navButton}><Icon name="chevronLeft" size={16} color={colors.text} /></Interactive>
          <View style={styles.phoneRange}>
            <Text style={styles.range} numberOfLines={1}>{range}</Text>
            {!showingToday ? (
              <Interactive onPress={() => setAnchor(dayStart(new Date()))} accessibilityRole="button" accessibilityLabel="Go to today">
                <Text style={styles.todayLink}>Back to today</Text>
              </Interactive>
            ) : null}
          </View>
          <Interactive onPress={() => step(1)} accessibilityRole="button" accessibilityLabel={`Next ${view}`} style={styles.navButton}><Icon name="chevronRight" size={16} color={colors.text} /></Interactive>
        </View>
        <SegmentedControl label="Calendar view" options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]} value={view} onChange={(value) => setView(value as View3)} />

        {view === 'month' ? (
          <>
            <PhoneMonth anchor={anchor} entries={entries} now={now} tintOf={tintOf} onPick={(date) => { setAnchor(date); setView('day'); }} />
            <Text style={styles.agendaTime}>A dot is a class or study block. Tap a day to see it.</Text>
          </>
        ) : view === 'day' ? (
          blocksOn(entries, anchor).length ? (
            <List accessibilityLabel={`Blocks on ${range}`}>{blocksOn(entries, anchor).map(blockRow)}</List>
          ) : (
            <View style={styles.phoneEmpty}>
              <Text style={styles.agendaTitle}>Nothing planned for {anchor.toLocaleDateString(undefined, { weekday: 'long' })}.</Text>
              <Text style={styles.agendaTime}>Tap Add to put a class or study block on this day. It repeats every week.</Text>
            </View>
          )
        ) : (
          <View style={styles.phoneWeek}>
            {viewedDays.map((date) => {
              const blocks = blocksOn(entries, date);
              const isToday = sameDay(date, now);
              return (
                <View key={date.toISOString()} style={styles.phoneDay}>
                  <View style={styles.phoneDayHead}>
                    <Text style={[styles.phoneDayName, isToday && styles.dayNameToday]}>
                      {date.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' })}{isToday ? ' · Today' : ''}
                    </Text>
                    {!blocks.length ? <Text style={styles.agendaTime}>Free</Text> : null}
                  </View>
                  {blocks.length ? <List>{blocks.map(blockRow)}</List> : null}
                </View>
              );
            })}
          </View>
        )}

        {totalHours > 0 ? (
          <View style={styles.phoneSummary}>
            <Text style={styles.panelTitle}>This week: {totalHours % 1 ? totalHours.toFixed(1) : totalHours} hours planned</Text>
            {weekHours.slice(0, 5).map(([subject, value]) => (
              <View key={subject} style={styles.subjectRow}>
                <View style={styles.subjectHead}><Text style={styles.agendaTitle} numberOfLines={1}>{subject}</Text><Text style={styles.agendaTime}>{value % 1 ? value.toFixed(1) : value} h</Text></View>
                <ProgressBar value={totalHours ? value / totalHours : 0} height={5} label={`${subject} hours`} />
              </View>
            ))}
          </View>
        ) : null}
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      {toolbar}
      <View style={[styles.layout, wide && styles.layoutWide]}>
        {wide ? side : null}
        <View style={styles.main}>{grid}</View>
      </View>
      {!wide ? side : null}
      {entries.length === 0 ? <Text style={styles.empty}>Tap any hour, or Add, to put your first class or study block on the calendar.</Text> : null}
    </Card>
  );
}

function MiniMonth({ anchor, now, entries, onPick }: { anchor: Date; now: Date; entries: readonly TimetableBlock[]; onPick: (date: Date) => void }) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const [month, setMonth] = useState(() => new Date(anchor.getFullYear(), anchor.getMonth(), 1));
  const start = mondayOf(month);
  const cells = Array.from({ length: 42 }, (_, i) => addDays(start, i));
  const week = mondayOf(anchor).getTime();
  return (
    <View style={styles.panel}>
      <View style={styles.miniHead}>
        <Interactive onPress={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} accessibilityLabel="Previous month" style={styles.miniNav}><Icon name="chevronLeft" size={14} color={colors.text} /></Interactive>
        <Text style={styles.panelTitle}>{month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</Text>
        <Interactive onPress={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} accessibilityLabel="Next month" style={styles.miniNav}><Icon name="chevronRight" size={14} color={colors.text} /></Interactive>
      </View>
      <View style={styles.miniGrid}>
        {DAYS.map((day) => <Text key={day} style={styles.miniLabel}>{day[0]}</Text>)}
        {cells.map((date) => {
          const inMonth = date.getMonth() === month.getMonth();
          const isToday = sameDay(date, now);
          const inWeek = mondayOf(date).getTime() === week;
          const busy = blocksOn(entries, date).length > 0;
          return (
            <Interactive key={date.toISOString()} onPress={() => onPick(dayStart(date))} accessibilityLabel={date.toDateString()} style={[styles.miniCell, inWeek && styles.miniWeek, isToday && styles.miniToday]}>
              <Text style={[styles.miniDay, !inMonth && styles.miniOut, isToday && styles.miniTodayText]}>{date.getDate()}</Text>
              {busy ? <View style={[styles.miniDot, isToday && styles.miniDotToday]} /> : null}
            </Interactive>
          );
        })}
      </View>
    </View>
  );
}

/** The month on a phone: each day shows its date and a dot per block (up to three). */
function PhoneMonth({ anchor, entries, now, tintOf, onPick }: { anchor: Date; entries: readonly TimetableBlock[]; now: Date; tintOf: (entry: TimetableBlock) => { bg: string; edge: string; text: string }; onPick: (date: Date) => void }) {
  const styles = useThemedStyles(createStyles);
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const start = mondayOf(first);
  const cells = Array.from({ length: 42 }, (_, i) => addDays(start, i));
  return (
    <View>
      <View style={styles.monthHead}>{DAYS.map((day) => <Text key={day} style={styles.monthLabel}>{day.slice(0, 2)}</Text>)}</View>
      <View style={styles.miniGrid}>
        {cells.map((date) => {
          const blocks = blocksOn(entries, date);
          const inMonth = date.getMonth() === first.getMonth();
          const isToday = sameDay(date, now);
          return (
            <Interactive key={date.toISOString()} onPress={() => onPick(dayStart(date))} accessibilityRole="button" accessibilityLabel={`${date.toDateString()}, ${blocks.length} block${blocks.length === 1 ? '' : 's'}`} style={styles.phoneMonthCell}>
              <View style={[styles.monthDate, isToday && styles.dateChipToday]}>
                <Text style={[styles.monthDateText, !inMonth && styles.miniOut, isToday && styles.dateTextToday]}>{date.getDate()}</Text>
              </View>
              <View style={styles.phoneDots}>
                {blocks.slice(0, 3).map((entry) => <View key={entry.id} style={[styles.phoneDot, { backgroundColor: tintOf(entry).edge }]} />)}
              </View>
            </Interactive>
          );
        })}
      </View>
    </View>
  );
}

function MonthGrid({ anchor, entries, now, tintOf, onPick }: { anchor: Date; entries: readonly TimetableBlock[]; now: Date; tintOf: (entry: TimetableBlock) => { bg: string; edge: string; text: string }; onPick: (date: Date) => void }) {
  const styles = useThemedStyles(createStyles);
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const start = mondayOf(first);
  const cells = Array.from({ length: 42 }, (_, i) => addDays(start, i));
  return (
    <View>
      <View style={styles.monthHead}>{DAYS.map((day) => <Text key={day} style={styles.monthLabel}>{day}</Text>)}</View>
      <View style={styles.monthGrid}>
        {cells.map((date) => {
          const blocks = blocksOn(entries, date);
          const inMonth = date.getMonth() === first.getMonth();
          const isToday = sameDay(date, now);
          return (
            <Interactive key={date.toISOString()} onPress={() => onPick(dayStart(date))} accessibilityRole="button" accessibilityLabel={`${date.toDateString()}, ${blocks.length} blocks`} style={({ hovered }) => [styles.monthCell, !inMonth && styles.monthOut, hovered && styles.blockHover]}>
              <View style={[styles.monthDate, isToday && styles.dateChipToday]}><Text style={[styles.monthDateText, isToday && styles.dateTextToday]}>{date.getDate()}</Text></View>
              {blocks.slice(0, 3).map((entry) => {
                const tint = tintOf(entry);
                return <Text key={entry.id} style={[styles.monthChip, { backgroundColor: tint.bg, color: tint.text }]} numberOfLines={1}>{entry.start_time.slice(0, 5)} {entry.title}</Text>;
              })}
              {blocks.length > 3 ? <Text style={styles.agendaTime}>+{blocks.length - 3} more</Text> : null}
            </Interactive>
          );
        })}
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    flex: { flex: 1, minWidth: 0 },
    card: { gap: 16, padding: 18 },
    toolbar: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 14 },
    greeting: { gap: 2 },
    hello: { ...Type.title2, color: colors.text },
    helloSub: { fontSize: 13.5, color: colors.textSecondary },
    controls: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10, flexShrink: 1, maxWidth: '100%' },
    nav: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6, maxWidth: '100%' },
    navButton: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
    range: { fontSize: 13.5, fontWeight: '700', color: colors.text, marginLeft: 6 },
    viewSwitch: { minWidth: 220, maxWidth: '100%', flexGrow: 1 },
    layout: { gap: 16 },
    layoutWide: { flexDirection: 'row', alignItems: 'flex-start' },
    main: { flex: 1, minWidth: 0 },
    side: { width: '100%', maxWidth: 280, gap: 14 },
    panel: { gap: 8, padding: 14, borderRadius: 16, backgroundColor: colors.surfaceMuted, borderWidth: 1, borderColor: colors.border },
    panelTitle: { ...Type.headline, color: colors.text },
    agendaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4 },
    agendaDot: { width: 8, height: 8, borderRadius: 4 },
    agendaTitle: { fontSize: 13.5, fontWeight: '700', color: colors.text, flexShrink: 1 },
    agendaTime: { fontSize: 12, color: colors.textSecondary },
    bigNumber: { ...Type.title1, color: colors.text },
    subjectRow: { gap: 4 },
    subjectHead: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
    scroller: { minWidth: '100%' },
    grid: { flex: 1 },
    gridWeek: { minWidth: 720 },
    headRow: { flexDirection: 'row', marginBottom: 8 },
    gutter: { width: 54 },
    dayHead: { flex: 1, alignItems: 'center', gap: 4 },
    dayName: { fontSize: 12, fontWeight: '700', color: colors.textTertiary },
    dayNameToday: { color: colors.primaryText },
    dateChip: { minWidth: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
    dateChipToday: { backgroundColor: colors.primary },
    dateText: { fontSize: 17, fontWeight: '800', color: colors.text },
    dateTextToday: { color: colors.onPrimary },
    body: { flexDirection: 'row' },
    hour: { fontSize: 11, color: colors.textTertiary, marginTop: -7 },
    column: { flex: 1, borderLeftWidth: 1, borderLeftColor: colors.divider, position: 'relative' },
    columnToday: { backgroundColor: colors.primarySubtle },
    slot: { position: 'absolute', left: 0, right: 0, borderTopWidth: 1, borderTopColor: colors.divider },
    block: { position: 'absolute', left: 4, right: 4, borderRadius: 12, borderLeftWidth: 4, paddingVertical: 6, paddingHorizontal: 8, overflow: 'hidden', gap: 2 },
    blockHover: { opacity: 0.92 },
    blockTitle: { fontSize: 12.5, fontWeight: '800' },
    blockTime: { fontSize: 11, color: colors.textSecondary },
    blockSubject: { fontSize: 11, color: colors.textTertiary },
    now: { position: 'absolute', left: 0, right: 0, height: 2, backgroundColor: colors.error },
    nowDot: { position: 'absolute', left: -4, top: -3, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.error },
    empty: { fontSize: 13, color: colors.textSecondary, textAlign: 'center' },
    miniHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    miniNav: { padding: 6 },
    miniGrid: { flexDirection: 'row', flexWrap: 'wrap' },
    miniLabel: { width: `${100 / 7}%`, textAlign: 'center', fontSize: 11, fontWeight: '700', color: colors.textTertiary, paddingVertical: 4 },
    miniCell: { width: `${100 / 7}%`, alignItems: 'center', paddingVertical: 4, borderRadius: 8 },
    miniWeek: { backgroundColor: colors.primarySubtle },
    miniToday: { backgroundColor: colors.primary },
    miniDay: { fontSize: 12.5, fontWeight: '700', color: colors.text },
    miniOut: { color: colors.textTertiary, opacity: 0.6 },
    miniTodayText: { color: colors.onPrimary },
    miniDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.primary, marginTop: 1 },
    miniDotToday: { backgroundColor: colors.onPrimary },
    monthHead: { flexDirection: 'row', marginBottom: 6 },
    monthLabel: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '700', color: colors.textTertiary },
    monthGrid: { flexDirection: 'row', flexWrap: 'wrap', borderTopWidth: 1, borderLeftWidth: 1, borderColor: colors.divider },
    monthCell: { width: `${100 / 7}%`, minHeight: 96, padding: 6, gap: 3, borderRightWidth: 1, borderBottomWidth: 1, borderColor: colors.divider },
    monthOut: { opacity: 0.45 },
    monthDate: { alignSelf: 'flex-start', minWidth: 24, height: 24, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    monthDateText: { fontSize: 13, fontWeight: '800', color: colors.text },
    phoneCard: { gap: 14, padding: 16 },
    phoneHead: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
    phoneTitle: { ...Type.title3, color: colors.text },
    phoneNav: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    phoneRange: { flex: 1, minWidth: 0, alignItems: 'center', gap: 2 },
    todayLink: { fontSize: 12.5, fontWeight: '600', color: colors.primaryText },
    phoneBar: { width: 4, alignSelf: 'stretch', borderRadius: 2 },
    phoneEmpty: { gap: 4, paddingVertical: 16 },
    phoneWeek: { gap: 14 },
    phoneDay: { gap: 4 },
    phoneDayHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
    phoneDayName: { fontSize: 13.5, fontWeight: '700', color: colors.textSecondary },
    phoneSummary: { gap: 8, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.divider },
    phoneMonthCell: { width: `${100 / 7}%`, alignItems: 'center', paddingVertical: 4, gap: 3, minHeight: 46 },
    phoneDots: { flexDirection: 'row', gap: 3, height: 6 },
    phoneDot: { width: 6, height: 6, borderRadius: 3 },
    monthChip: { fontSize: 10.5, fontWeight: '700', paddingVertical: 2, paddingHorizontal: 5, borderRadius: 6, overflow: 'hidden' },
  });
}
