import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Interactive } from '@/components/ui/interactive';
import { Text } from '@/components/ui/text';
import { Radius, type ThemeColors } from '@/constants/theme';
import { type FriendStreakStatus, STUMP_STREAKS_FROM } from '@/data/friend-streaks';
import { protectFriendStreak } from '@/data/friend-streak-store';
import { RESTORE_COST } from '@/data/learning/streak-rules';
import { useProgress } from '@/data/progress';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';
import { friendlyError } from '@/lib/errors';

// Under a chat's header: "stump each other today" while a friend streak is at
// risk, and the freeze / coin restore when one has just ended (data/friend-streaks.ts).
// During the changeover days (before STUMP_STREAKS_FROM) a message still counts,
// and the notice says that stumps will be needed.
// Every notice can be closed (×). Closing is remembered on the device until the
// situation changes (another lost streak, a new day at risk); a closed "streak
// ended" notice can be reopened from the "Restore streak" chip in the chat header.

const HIDDEN_KEY = (friendId: string) => `grateapex_streak_notice_hidden:${friendId}`;

// Which notice is showing, so closing one does not hide the next, different one.
function noticeKey(status: FriendStreakStatus | null): string | null {
  if (!status) return null;
  if (status.lost) return `lost|${status.lost.streak}|${status.lost.missed.join(',')}`;
  if (status.atRisk && status.stumpsNeeded) return `risk|${new Date().toLocaleDateString('en-CA')}`;
  if (!status.stumpsNeeded && status.streak > 0) return 'switch';
  return null;
}

export function useStreakNoticeHidden(friendId: string, status: FriendStreakStatus | null) {
  const key = noticeKey(status);
  const [hiddenKey, setHiddenKey] = useState<string | null>(null);
  useEffect(() => {
    if (!friendId) return;
    let live = true;
    AsyncStorage.getItem(HIDDEN_KEY(friendId)).then((value) => { if (live) setHiddenKey(value); }).catch(() => {});
    return () => { live = false; };
  }, [friendId]);
  return {
    hidden: key !== null && hiddenKey === key,
    hide: () => {
      if (!key) return;
      setHiddenKey(key);
      void AsyncStorage.setItem(HIDDEN_KEY(friendId), key).catch(() => {});
    },
    show: () => {
      setHiddenKey(null);
      void AsyncStorage.removeItem(HIDDEN_KEY(friendId)).catch(() => {});
    },
  };
}

export function FriendStreakNotice({ status, friendId, friendName, onChanged, hidden, onHide }: { status: FriendStreakStatus | null; friendId: string; friendName: string; onChanged: () => void; hidden: boolean; onHide: () => void }) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const progress = useProgress();
  const [busy, setBusy] = useState<'freeze' | 'coins' | null>(null);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  if (!status) return null;
  const close = (onPress: () => void) => (
    <Interactive onPress={onPress} accessibilityRole="button" accessibilityLabel="Close" style={styles.close}>
      <Icon name="close" size={16} color={colors.textSecondary} />
    </Interactive>
  );
  const switchDay = new Date(`${STUMP_STREAKS_FROM}T12:00:00`).toLocaleDateString([], { day: 'numeric', month: 'long' });

  async function protect(method: 'freeze' | 'coins') {
    setBusy(method);
    setMessage(null);
    try {
      const streak = await protectFriendStreak(friendId, method);
      setMessage({ text: `Your ${streak}-day streak with ${friendName} is back.`, ok: true });
      onChanged();
    } catch (error) {
      setMessage({ text: friendlyError(error, 'The streak could not be restored.'), ok: false });
    } finally {
      setBusy(null);
    }
  }

  if (status.lost && !message?.ok && !hidden) {
    const days = status.lost.missed.length;
    const enough = progress.streakFreezes >= days;
    return (
      <View style={styles.box}>
        <View style={styles.row}>
          <Icon name="streak" size={16} color={colors.warningStrong} />
          <Text style={styles.text}>Your {status.lost.streak}-day streak with {friendName} ended: {days === 1 ? 'a day' : `${days} days`} without you both stumping each other.</Text>
          {close(onHide)}
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

  if (status.atRisk && status.stumpsNeeded && !hidden) {
    const waiting = !status.meToday ? `Stump ${friendName} today` : !status.friendToday ? `${friendName} hasn’t stumped you today yet` : '';
    return (
      <View style={[styles.box, styles.soft]}>
        <View style={styles.row}>
          <Icon name="streak" size={16} color={colors.accentText} />
          <Text style={styles.text}>Keep your {status.streak}-day streak: you both need to stump each other today. {waiting}.</Text>
          {close(onHide)}
        </View>
      </View>
    );
  }

  // The changeover days: a message still counts, but say what is coming.
  if (!status.stumpsNeeded && status.streak > 0 && !message && !hidden) {
    return (
      <View style={[styles.box, styles.soft]}>
        <View style={styles.row}>
          <Icon name="challenge" size={16} color={colors.primaryText} />
          <Text style={styles.text}>
            {status.atRisk ? `Keep your ${status.streak}-day streak: you both need to message today. ` : ''}
            From {switchDay}, friend streaks are kept by stumping each other every day. Tap the stump button beside the message box to send {friendName} a question.
          </Text>
          {close(onHide)}
        </View>
      </View>
    );
  }

  return message ? (
    <View style={[styles.box, styles.soft, styles.row]}>
      <Text style={[styles.small, styles.text]}>{message.text}</Text>
      {close(() => setMessage(null))}
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
    close: { padding: 4, margin: -4, borderRadius: 999 },
  });
}
