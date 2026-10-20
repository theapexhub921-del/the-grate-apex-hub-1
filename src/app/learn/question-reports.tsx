import type { Href } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useIsAdmin } from '@/components/experience/experience-sync';
import { BackLink } from '@/components/learning/nav-bits';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/interactive';
import { Pill } from '@/components/ui/pill';
import { PageHeader, Screen } from '@/components/ui/screen';
import { EmptyState, InlineNotice, LoadingState } from '@/components/ui/state-views';
import { Text } from '@/components/ui/text';
import { Type, type ThemeColors } from '@/constants/theme';
import { closeReport, listOpenReports, REPORT_REASONS, type QuestionReport } from '@/data/question-reports';
import { useThemedStyles } from '@/hooks/use-theme';

// /learn/question-reports — admins only (Settings → Help → Reported questions).
// The open "Report this question" reports, grouped by question, newest first.
// Fixing a question happens in the question bank itself; here an admin marks the
// reports "Fixed" or "Not an error", which also clears the question's
// "being checked" note (src/data/question-reports.ts).

type Group = { qid: string; text: string; where: string; reports: QuestionReport[] };

function groupReports(list: QuestionReport[]): Group[] {
  const groups = new Map<string, Group>();
  for (const report of list) {
    const group = groups.get(report.qid) ?? { qid: report.qid, text: report.text, where: report.where, reports: [] };
    group.reports.push(report);
    groups.set(report.qid, group);
  }
  return [...groups.values()].sort((a, b) => b.reports.length - a.reports.length || b.reports[0].createdAt - a.reports[0].createdAt);
}

const reasonLabel = (id: string) => REPORT_REASONS.find((item) => item.id === id)?.label ?? id;

export default function QuestionReportsScreen() {
  const styles = useThemedStyles(createStyles);
  const { isAdmin, checked } = useIsAdmin();
  const [groups, setGroups] = useState<Group[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(() => {
    setError(null);
    listOpenReports()
      .then((list) => setGroups(groupReports(list)))
      .catch(() => {
        setGroups([]);
        setError('The reports could not be loaded. Only admins can see them.');
      });
  }, []);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  async function close(group: Group, status: 'fixed' | 'dismissed') {
    setBusy(group.qid);
    try {
      for (const report of group.reports) await closeReport(report, status);
      setGroups((current) => (current ?? []).filter((item) => item.qid !== group.qid));
    } catch {
      setError('That could not be saved. Please try again.');
    } finally {
      setBusy(null);
    }
  }

  return (
    <Screen width="content">
      <BackLink fallback={'/settings' as Href} />
      <PageHeader eyebrow="Admin" title="Reported questions" subtitle="Questions learners flagged. Fix the question in its bank, then mark the reports here." />
      {!isAdmin ? (
        !checked ? <LoadingState label="Checking access…" /> : <EmptyState icon="lock" title="Admins only" message="This page lists question reports for the team." />
      ) : groups === null ? (
        <LoadingState label="Loading reports…" />
      ) : (
        <View style={styles.list}>
          {error ? <InlineNotice tone="error" message={error} /> : null}
          {groups.length === 0 && !error ? <EmptyState icon="check" title="No open reports" message="Nothing to check right now." /> : null}
          {groups.map((group) => (
            <Card key={group.qid} style={styles.card}>
              <View style={styles.head}>
                <Pill label={`${group.reports.length} report${group.reports.length === 1 ? '' : 's'}`} tone={group.reports.some((report) => report.reason === 'wrong-answer') ? 'warning' : 'neutral'} />
                <Text style={styles.where}>{group.where}</Text>
              </View>
              <Text style={styles.question}>{group.text}</Text>
              <Text selectable style={styles.id}>Question id: {group.qid}</Text>
              {group.reports.map((report) => (
                <View key={report.id} style={styles.report}>
                  <Text style={styles.reason}>{reasonLabel(report.reason)}</Text>
                  {report.note ? <Text style={styles.note}>“{report.note}”</Text> : null}
                  <Text style={styles.date}>{report.createdAt ? new Date(report.createdAt).toLocaleString() : ''}</Text>
                </View>
              ))}
              <View style={styles.actions}>
                <Button label="Fixed" size="sm" onPress={() => void close(group, 'fixed')} loading={busy === group.qid} disabled={busy !== null} />
                <Button label="Not an error" size="sm" variant="secondary" onPress={() => void close(group, 'dismissed')} disabled={busy !== null} />
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
    list: { gap: 12 },
    card: { gap: 8 },
    head: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
    where: { fontSize: 12.5, color: colors.textTertiary },
    question: { ...Type.headline, color: colors.text },
    id: { fontSize: 12, color: colors.textTertiary },
    report: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 8, gap: 2 },
    reason: { fontSize: 14, fontWeight: '600', color: colors.text },
    note: { fontSize: 14, color: colors.textSecondary },
    date: { fontSize: 12, color: colors.textTertiary },
    actions: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 4 },
  });
}
