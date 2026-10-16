import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Interactive } from '@/components/ui/interactive';
import { Sheet } from '@/components/ui/sheet';
import { Text } from '@/components/ui/text';
import { Type, type ThemeColors } from '@/constants/theme';
import { BOOST_GIFTS_PER_FRIEND_PER_DAY, describeGiftBoost, sendBoostGift } from '@/data/boost-gifts';
import { usePowerups } from '@/data/learning/powerups';
import { personName, type SocialPerson, useSocial } from '@/data/social';
import { useAuth } from '@/hooks/use-auth';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';

// "Gift a boost": pick one of your XP boosts and an accepted friend. The boost
// leaves your inventory and arrives in theirs (data/boost-gifts.ts).
export function GiftBoostSheet({ visible, onClose, boostId }: { visible: boolean; onClose: () => void; boostId?: string | null }) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const { user } = useAuth();
  const social = useSocial();
  const inventory = usePowerups();
  const [chosen, setChosen] = useState<string | null>(boostId ?? null);
  const [friend, setFriend] = useState<SocialPerson | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    if (!visible) return;
    setChosen(boostId ?? null);
    setFriend(null);
    setMessage(null);
  }, [visible, boostId]);

  const friends = social.people.filter((person) => person.relationship === 'friends');
  const boost = inventory.find((item) => item.id === chosen) ?? null;
  const myName = social.username ? `@${social.username}` : user?.displayName || 'A friend';

  async function send() {
    if (!boost || !friend) return;
    setBusy(true);
    setMessage(null);
    try {
      await sendBoostGift(friend.userId, boost.id, myName);
      setMessage({ text: `${describeGiftBoost(boost)} sent to ${personName(friend)}.`, ok: true });
      setChosen(null);
      setFriend(null);
    } catch (error) {
      setMessage({ text: error instanceof Error ? error.message : 'The boost could not be sent. Please try again.', ok: false });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Sheet
      visible={visible}
      onClose={() => { if (!busy) onClose(); }}
      title="Gift a boost"
      subtitle={`Give one of your XP boosts to a friend. It leaves your boosts and arrives in theirs. Up to ${BOOST_GIFTS_PER_FRIEND_PER_DAY} a day per friend.`}
      footer={
        <View style={styles.actions}>
          <Button label="Close" variant="ghost" onPress={onClose} disabled={busy} />
          <Button label="Send boost" onPress={() => void send()} loading={busy} disabled={!boost || !friend || busy} />
        </View>
      }
    >
      <Text style={styles.label}>BOOST</Text>
      {inventory.length ? (
        <View style={styles.list}>
          {inventory.map((item) => (
            <Interactive key={item.id} onPress={() => { setChosen(item.id); setMessage(null); }} accessibilityRole="radio" accessibilityState={{ checked: chosen === item.id }} style={[styles.option, chosen === item.id && styles.optionOn]}>
              <Icon name="sparkle" size={16} color={colors.accentText} />
              <Text style={styles.optionText}>{describeGiftBoost(item)}</Text>
            </Interactive>
          ))}
        </View>
      ) : (
        <Text style={styles.detail}>You have no boosts to give right now. Complete achievement levels, lessons and quizzes to earn them.</Text>
      )}

      <Text style={styles.label}>FRIEND</Text>
      {friends.length ? (
        <View style={styles.list}>
          {friends.map((person) => (
            <Interactive key={person.userId} onPress={() => { setFriend(person); setMessage(null); }} accessibilityRole="radio" accessibilityState={{ checked: friend?.userId === person.userId }} style={[styles.option, friend?.userId === person.userId && styles.optionOn]}>
              <Avatar uri={person.avatarUrl} name={personName(person)} size={30} status={person.isOnline ? 'online' : null} />
              <Text style={styles.optionText}>{personName(person)}</Text>
            </Interactive>
          ))}
        </View>
      ) : (
        <Text style={styles.detail}>Add friends in Connect first: you can gift boosts to people you follow who follow you back.</Text>
      )}

      {message ? <Text style={[styles.message, !message.ok && styles.error]} accessibilityRole="alert">{message.text}</Text> : null}
    </Sheet>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    label: { ...Type.overline, color: colors.textSecondary, marginTop: 4 },
    list: { gap: 6 },
    option: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderRadius: 12, borderWidth: 1, borderColor: colors.hairline },
    optionOn: { borderColor: colors.primary, backgroundColor: colors.primarySubtle },
    optionText: { ...Type.callout, flex: 1, color: colors.text, fontWeight: '700' },
    detail: { ...Type.caption, color: colors.textSecondary },
    actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
    message: { ...Type.caption, color: colors.primaryText },
    error: { color: colors.error },
  });
}
