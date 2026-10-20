import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Interactive } from '@/components/ui/interactive';
import { Sheet } from '@/components/ui/sheet';
import { Text, TextInput } from '@/components/ui/text';
import { Type, type ThemeColors } from '@/constants/theme';
import { AlreadyReported, hasReported, REPORT_REASONS, reportQuestion, type ReportReason, useQuestionUnderReview } from '@/data/question-reports';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';

// "Report a problem" under an answered question, and the "being checked" note
// a question shows once several learners say its marked answer is wrong
// (src/data/question-reports.ts).

export function QuestionReportLink({ question, place }: { question: { id: string; prompt: string }; place: string }) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    void hasReported(question.id).then((value) => { if (live && value) setDone(true); });
    return () => { live = false; };
  }, [question.id]);

  const close = () => {
    if (busy) return;
    setOpen(false);
    setReason(null);
    setNote('');
    setError(null);
  };

  async function send() {
    if (!reason) return;
    if (reason === 'other' && note.trim().length < 5) {
      setError('Please describe the problem in a few words.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await reportQuestion(question, reason, note, place);
      setDone(true);
      setOpen(false);
      setReason(null);
      setNote('');
    } catch (problem) {
      if (problem instanceof AlreadyReported) {
        setDone(true);
        setOpen(false);
      } else {
        setError(problem instanceof Error ? problem.message : 'The report could not be sent.');
      }
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <View style={styles.linkRow}>
        <Icon name="flag" size={14} color={colors.textTertiary} filled />
        <Text style={styles.linkTextMuted}>Reported. Thank you, it will be checked.</Text>
      </View>
    );
  }

  return (
    <>
      <Interactive onPress={() => setOpen(true)} accessibilityRole="button" accessibilityLabel="Report a problem with this question" style={styles.linkRow}>
        <Icon name="flag" size={14} color={colors.textTertiary} />
        <Text style={styles.linkText}>Report a problem with this question</Text>
      </Interactive>
      <Sheet
        visible={open}
        onClose={close}
        title="Report this question"
        subtitle="What is wrong with it? Reports are private and go to the team."
        footer={
          <View style={styles.actions}>
            <Button label="Cancel" variant="ghost" onPress={close} disabled={busy} />
            <Button label="Send report" onPress={() => void send()} loading={busy} disabled={!reason} />
          </View>
        }
      >
        <Text style={styles.prompt} numberOfLines={3}>{question.prompt}</Text>
        <View style={styles.list} accessibilityRole="radiogroup">
          {REPORT_REASONS.map((item) => {
            const selected = reason === item.id;
            return (
              <Interactive key={item.id} onPress={() => setReason(item.id)} accessibilityRole="radio" accessibilityState={{ checked: selected }} style={[styles.reason, selected && styles.reasonOn]}>
                <View style={styles.flex}>
                  <Text style={styles.reasonLabel}>{item.label}</Text>
                  <Text style={styles.reasonDetail}>{item.detail}</Text>
                </View>
                <View style={[styles.radio, selected && { borderColor: colors.primary }]}>{selected ? <View style={[styles.dot, { backgroundColor: colors.primary }]} /> : null}</View>
              </Interactive>
            );
          })}
        </View>
        {reason ? (
          <View style={styles.writeWrap}>
            <Text style={styles.writeLabel}>
              {reason === 'other' ? 'What is the problem?' : reason === 'wrong-answer' ? 'What should the answer be, and where is it in your notes? (optional)' : 'Anything else? (optional)'}
            </Text>
            <TextInput value={note} onChangeText={setNote} placeholder="Write it in your own words." placeholderTextColor={colors.textTertiary} multiline maxLength={500} style={styles.input} accessibilityLabel="Details of the problem" />
          </View>
        ) : null}
        {error ? (
          <View style={styles.errorRow}>
            <Icon name="warning" size={14} color={colors.error} />
            <Text style={styles.error}>{error}</Text>
          </View>
        ) : null}
      </Sheet>
    </>
  );
}

/** Shown on an answered question that several learners have reported as having a wrong answer. */
export function UnderReviewNote({ questionId }: { questionId: string }) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const flagged = useQuestionUnderReview(questionId);
  if (!flagged) return null;
  return (
    <View style={styles.review} accessibilityRole="alert">
      <Icon name="flag" size={15} color={colors.warningStrong} filled />
      <Text style={styles.reviewText}>Being checked: several learners think the marked answer may be wrong. Check it against your notes.</Text>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    flex: { flex: 1, minWidth: 0 },
    linkRow: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingVertical: 6, marginTop: 4 },
    linkText: { fontSize: 13, color: colors.textTertiary, textDecorationLine: 'underline' },
    linkTextMuted: { fontSize: 13, color: colors.textTertiary },
    prompt: { fontSize: 14, lineHeight: 20, color: colors.textSecondary, marginBottom: 12 },
    list: { gap: 6 },
    reason: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
    reasonOn: { borderColor: colors.primary, backgroundColor: colors.primarySubtle },
    reasonLabel: { ...Type.headline, fontSize: 14.5, color: colors.text },
    reasonDetail: { fontSize: 12.5, color: colors.textSecondary, marginTop: 1 },
    radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.borderStrong, alignItems: 'center', justifyContent: 'center' },
    dot: { width: 10, height: 10, borderRadius: 5 },
    writeWrap: { gap: 6, marginTop: 12 },
    writeLabel: { fontSize: 13, fontWeight: '700', color: colors.text },
    input: { minHeight: 80, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, color: colors.text, padding: 12, fontSize: 15, textAlignVertical: 'top' },
    errorRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
    error: { fontSize: 13, color: colors.error },
    actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
    review: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: colors.warningBorder, backgroundColor: colors.warningSubtle, marginBottom: 8 },
    reviewText: { flex: 1, fontSize: 13.5, lineHeight: 19, color: colors.text },
  });
}
