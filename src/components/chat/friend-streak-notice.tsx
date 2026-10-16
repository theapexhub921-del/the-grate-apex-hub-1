import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { Radius, type ThemeColors } from '@/constants/theme';
import type { FriendStreakStatus } from '@/data/friend-streaks';
import { protectFriendStreak } from '@/data/friend-streak-store';
import { RESTORE_COST } from '@/data/learning/streak-rules';
import { useProgress } from '@/data/progress';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';

// Under a chat's header: "message each other today" while a friend streak is at
// risk, and the freeze / coin restore when one has just ended (data/friend-streaks.ts).
export function FriendStreakNotice({ status, friendId, friendName, onChanged }: { status: FriendStreakStatus | null; friendId: string; friendName: string; onChanged: () => void }) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const progress = useProgress();
  const [busy, setBusy] = useState<'freeze' | 'coins' | null>(null);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  if (!status) return null;

  async function protect(method: 'freeze' | 'coins') {
    setBusy(method);
    setMessage(null);
    try {
      const streak = await protectFriendStreak(friendId, method);
      setMessage({ text: `Your ${streak}-day streak with ${friendName} is back.`, ok: true });
      onChanged();
    } catch (error) {
      setMessage({ text: error instanceof Error ? error.message : 'The streak could not be restored.', ok: false });
    } finally {
      setBusy(null);
    }
  }

  if (status.lost && !message?.ok) {
    const days = status.lost.missed.length;
    const enough = progress.streakFreezes >= days;
    return (
      <View style={styles.box}>
        <View style={styles.row}>
          <Icon name="streak" size={16} color={colors.warningStrong} />
          <Text style={styles.text}>Your {status.lost.streak}-day streak with {friendName} ended: {days === 1 ? 'a day' : `${days} days`} without you both messaging.</Text>
        </View>
        <View style={styles.actions}>
          <Button label={`Use ${days} freeze${days === 1 ? '' : 's'}`} size="sm" variant="secondary" onPress={() => void protect('freeze')} loading={busy === 'freeze'} disabled={!enough || busy !== null} accessibilityHint={`You have ${progress.streakFreezes}`} />
          <Button label={`Restore · ${RESTORE_COST} coins`} size="sm" onPress={() => void protect('coins')} loading={busy === 'coins'} disabled={busy !== null} />
        </View>
        {!enough ? <Text style={styles.small}>You have {progress.streakFreezes} freeze{progress.streakFreezes === 1 ? '' : 's'}. Complete 5 lessons in a week to earn one.</Text> : null}
        {message ? <Text style={[styles.small, !message.ok && styles.error]}>{message.text}</Text> : null}
      </View>
    );
  }

  if (status.atRisk) {
    const waiting = !status.meToday ? 'Send a message today' : !status.friendToday ? `${friendName} hasn’t messaged today yet` : '';
    return (
      <View style={[styles.box, styles.soft]}>
        <View style={styles.row}>
          <Icon name="streak" size={16} color={colors.accentText} />
          <Text style={styles.text}>Keep your {status.streak}-day streak: you both need to message today. {waiting}.</Text>
        </View>
      </View>
    );
  }

  return message ? (
    <View style={[styles.box, styles.soft]}>
      <Text style={styles.small}>{message.text}</Text>
    </View>
  ) : null;
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    box: { gap: 8, marginHorizontal: 12, marginTop: 8, padding: 10, borderRadius: Radius.md, borderWidth: 1, borderColor: colors.warningBorder, backgroundColor: colors.warningSubtle },
    soft: { borderColor: colors.border, backgroundColor: colors.surfaceMuted },
    row: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
    text: { flex: 1, fontSize: 13.5, lineHeight: 19, color: colors.text },
    actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    small: { fontSize: 12.5, color: colors.textSecondary },
    error: { color: colors.error },
  });
}
