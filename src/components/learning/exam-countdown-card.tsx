import { createElement, type ReactElement, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/interactive';
import { List, ListRow } from '@/components/ui/list';
import { Text, TextInput } from '@/components/ui/text';
import { Type, type ThemeColors } from '@/constants/theme';
import { setExamDate, useExamDate } from '@/data/exam-plan';
import { dayKeyOf, examPlan, isValidExamDate, MAX_DAYS_AHEAD, REVISION_DAYS } from '@/data/exam-plan-rules';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';
import { routes } from '@/lib/routes';

// Exam countdown with a plan for today (owner, 2026-10-25), on the Study page.
// The numbers come from the learner's own data: lessons of their class not yet
// finished, lessons finished today and ideas due for review (rules in
// data/exam-plan-rules.ts).
export function ExamCountdownCard({
  lessonsLeft,
  lessonsDoneToday,
  reviewsDue,
  now,
  onContinue,
  onWeakest,
}: {
  lessonsLeft: number;
  lessonsDoneToday: number;
  reviewsDue: number;
  now: number;
  /** Opens the learner's next lesson. */
  onContinue: () => void;
  /** Opens "Your weakest 20" (undefined when there are none). */
  onWeakest?: () => void;
}) {
  const styles = useThemedStyles(createStyles);
  const { date, ready } = useExamDate();
  const [editing, setEditing] = useState(false);
  const today = dayKeyOf(now);
  if (!ready) return null;

  const plan = date ? examPlan({ today, examDate: date, lessonsLeft, lessonsDoneToday, reviewsDue }) : null;
  const choosing = editing || !plan;

  const heading = !plan
    ? 'When is your exam?'
    : plan.phase === 'passed'
      ? 'Your exam date has passed'
      : plan.phase === 'exam-day'
        ? 'Exam day. Good luck!'
        : plan.daysLeft === 1
          ? 'Your exam is tomorrow'
          : `${plan.daysLeft} days to your exam`;
  const sub = !plan
    ? 'Set the date and get a plan for each day: lessons to finish, reviews, then mock exams.'
    : plan.phase === 'passed'
      ? 'Set the date of your next exam to plan towards it.'
      : longDate(date!);

  const reviewRow = (
    <ListRow
      key="review"
      title={reviewsDue > 0 ? `Review ${reviewsDue} ${reviewsDue === 1 ? 'idea' : 'ideas'}` : 'Nothing due for review'}
      detail={reviewsDue > 0 ? 'What you are most likely to forget, before it slips.' : 'Ideas come back here as you finish lessons.'}
      meta={reviewsDue > 0 ? 'Due' : undefined}
      metaTone="attention"
      onPress={reviewsDue > 0 ? () => router.push(routes.review({ focus: 'due' })) : undefined}
      trailing={reviewsDue > 0 ? undefined : null}
    />
  );

  const rows: ReactElement[] = [];
  if (plan?.phase === 'learn') {
    const done = plan.lessonsStillToday === 0;
    rows.push(
      <ListRow
        key="lessons"
        title={done ? 'Today’s lessons are done' : `Finish ${plan.lessonsStillToday} ${plan.lessonsStillToday === 1 ? 'lesson' : 'lessons'} today`}
        detail={`${lessonsLeft} ${lessonsLeft === 1 ? 'lesson' : 'lessons'} left · ${plan.lessonTarget} a day finishes them ${REVISION_DAYS} days early, to revise.`}
        progress={plan.lessonTarget > 0 ? Math.min(1, lessonsDoneToday / plan.lessonTarget) : undefined}
        progressLabel="Today's lessons"
        meta={`${Math.min(lessonsDoneToday, plan.lessonTarget)}/${plan.lessonTarget}`}
        onPress={onContinue}
      />,
      reviewRow
    );
  } else if (plan?.phase === 'revise') {
    rows.push(
      reviewRow,
      <ListRow key="mock" title="Sit a mock exam" detail="A timed paper from the past papers, marked by topic so you know what to revise." onPress={() => router.push(routes.mockExamBuilder())} />,
    );
    if (onWeakest) rows.push(<ListRow key="weakest" title="Your weakest 20" detail="The questions you miss most, worst first." onPress={onWeakest} />);
    if (lessonsLeft > 0) rows.push(<ListRow key="left" title={`${lessonsLeft} ${lessonsLeft === 1 ? 'lesson' : 'lessons'} not finished`} detail="Revision days: go over these only if there is time." onPress={onContinue} />);
  } else if (plan?.phase === 'exam-day') {
    rows.push(
      onWeakest
        ? <ListRow key="weakest" title="A last look at your weakest questions" detail="Keep it light today, then rest." onPress={onWeakest} />
        : reviewRow
    );
  }

  return (
    <Card style={styles.card} tone="outline">
      <View style={styles.head}>
        <View style={styles.headText}>
          <Text style={styles.eyebrow}>EXAM COUNTDOWN</Text>
          <Text style={styles.title} accessibilityRole="header">{heading}</Text>
          <Text style={styles.sub}>{sub}</Text>
        </View>
        {plan && !editing ? <Button label="Change date" variant="ghost" size="sm" onPress={() => setEditing(true)} /> : null}
      </View>

      {plan?.phase === 'learn' || plan?.phase === 'revise' ? (
        <Text style={styles.phase}>{plan.phase === 'learn' ? 'Today’s plan' : `Revision days: practise like the exam`}</Text>
      ) : null}
      {rows.length && !choosing ? <List>{rows}</List> : null}

      {choosing ? (
        <ExamDateChooser
          today={today}
          current={date}
          onSave={(value) => { void setExamDate(value); setEditing(false); }}
          onRemove={date ? () => { void setExamDate(null); setEditing(false); } : undefined}
          onCancel={plan ? () => setEditing(false) : undefined}
        />
      ) : null}
    </Card>
  );
}

function ExamDateChooser({ today, current, onSave, onRemove, onCancel }: { today: string; current: string | null; onSave: (date: string) => void; onRemove?: () => void; onCancel?: () => void }) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const [value, setValue] = useState(current && isValidExamDate(current, today) ? current : '');
  const valid = isValidExamDate(value, today);
  const tomorrow = addDays(today, 1);
  const last = addDays(today, MAX_DAYS_AHEAD);
  return (
    <View style={styles.chooser}>
      <Text style={styles.label}>Exam date</Text>
      {Platform.OS === 'web' ? (
        // The browser's own date picker (calendar on phones and computers).
        createElement('input', {
          type: 'date',
          value,
          min: tomorrow,
          max: last,
          'aria-label': 'Exam date',
          onChange: (event: { target: { value: string } }) => setValue(event.target.value),
          style: { font: 'inherit', fontSize: 15, padding: '10px 12px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.surface, color: colors.text, colorScheme: 'light dark', maxWidth: 260 },
        })
      ) : (
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.textTertiary}
          style={styles.input}
          accessibilityLabel="Exam date, as year-month-day"
        />
      )}
      {value && !valid ? <Text style={styles.hint}>Choose a day from tomorrow onwards.</Text> : null}
      <View style={styles.actions}>
        <Button label="Save date" size="sm" disabled={!valid} onPress={() => onSave(value)} />
        {onCancel ? <Button label="Cancel" variant="ghost" size="sm" onPress={onCancel} /> : null}
        {onRemove ? <Button label="Remove date" variant="ghost" size="sm" onPress={onRemove} /> : null}
      </View>
    </View>
  );
}

function addDays(day: string, days: number) {
  const [y, m, d] = day.split('-').map(Number);
  return dayKeyOf(new Date(y, m - 1, d + days, 12).getTime());
}

function longDate(day: string) {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y, m - 1, d, 12).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: { gap: 12 },
    head: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
    headText: { flex: 1, minWidth: 0, gap: 2 },
    eyebrow: { ...Type.overline, color: colors.primaryText },
    title: { ...Type.title3, color: colors.text },
    sub: { ...Type.callout, color: colors.textSecondary },
    phase: { ...Type.caption, fontWeight: '600', color: colors.textSecondary },
    chooser: { gap: 8 },
    label: { fontSize: 13, fontWeight: '600', color: colors.text },
    input: { minHeight: 44, borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 12, fontSize: 15, color: colors.text, maxWidth: 260 },
    hint: { ...Type.caption, color: colors.textSecondary },
    actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  });
}
