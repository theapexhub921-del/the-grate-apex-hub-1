import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, Interactive } from '@/components/ui/interactive';
import { Sheet } from '@/components/ui/sheet';
import { Type, type ThemeColors } from '@/constants/theme';
import { readApexCoinBalance, sendApexCoins } from '@/data/apex-coins';
import { personName, type SocialPerson, useSocial } from '@/data/social';
import { useAuth } from '@/hooks/use-auth';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';

export function ApexCoinWalletCard() {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const { user } = useAuth();
  const social = useSocial();
  const [balance, setBalance] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [recipient, setRecipient] = useState<SocialPerson | null>(null);
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) { setBalance(null); return; }
    try { setBalance(await readApexCoinBalance()); } catch { /* Keep the last known balance while offline. */ }
  }, [user]);

  useEffect(() => {
    void refresh();
    const timer = setInterval(() => void refresh(), 60_000);
    return () => clearInterval(timer);
  }, [refresh]);

  async function gift() {
    if (!recipient) { setMessage('Choose a friend to receive your coins.'); return; }
    const value = Number(amount);
    if (!Number.isSafeInteger(value) || value < 1) { setMessage('Enter a whole number greater than zero.'); return; }
    setBusy(true);
    setMessage(null);
    try {
      setBalance(await sendApexCoins(recipient.userId, value));
      setMessage(`${value} Apex Coins sent to ${personName(recipient)}.`);
      setRecipient(null);
      setAmount('');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Coins could not be sent. Please try again.');
    } finally { setBusy(false); }
  }

  if (!user) return null;
  const friends = social.people.filter((person) => person.relationship === 'friends');
  return (
    <>
      <Card tone="reward" style={styles.card}>
        <View style={styles.copy}>
          <Text style={styles.label}>APEX COINS</Text>
          <Text style={styles.balance}>{balance === null ? '—' : balance.toLocaleString()}</Text>
          <Text style={styles.detail}>Earned coins to use and share with friends.</Text>
        </View>
        <Button label="Share coins" variant="secondary" size="sm" onPress={() => { setMessage(null); setOpen(true); }} disabled={!friends.length} />
      </Card>
      <Sheet visible={open} onClose={() => { if (!busy) setOpen(false); }} title="Share Apex Coins" subtitle="Send earned coins to an accepted friend." footer={<View style={styles.actions}><Button label="Cancel" variant="ghost" onPress={() => setOpen(false)} disabled={busy} /><Button label="Send coins" onPress={() => void gift()} loading={busy} disabled={!recipient || !amount} /></View>}>
        {friends.length ? <View style={styles.friendList}>{friends.map((friend) => <Interactive key={friend.userId} onPress={() => { setRecipient(friend); setMessage(null); }} accessibilityRole="radio" accessibilityState={{ checked: recipient?.userId === friend.userId }} style={[styles.friend, recipient?.userId === friend.userId && styles.friendSelected]}><Avatar uri={friend.avatarUrl} name={personName(friend)} size={34} status={friend.isOnline ? 'online' : null} /><Text style={styles.friendName}>{personName(friend)}</Text></Interactive>)}</View> : <Text style={styles.detail}>Add friends in Connect before sharing coins.</Text>}
        <Text style={styles.inputLabel}>AMOUNT</Text>
        <TextInput value={amount} onChangeText={(value) => setAmount(value.replace(/[^0-9]/g, ''))} placeholder="How many coins?" placeholderTextColor={colors.textTertiary} keyboardType="number-pad" accessibilityLabel="Amount of Apex Coins" style={styles.input} />
        {balance !== null ? <Text style={styles.detail}>Available: {balance.toLocaleString()} Apex Coins</Text> : null}
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </Sheet>
    </>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 14 },
    copy: { flex: 1, minWidth: 0 },
    label: { ...Type.overline, color: colors.accentText, letterSpacing: 1 },
    balance: { ...Type.display, color: colors.text, marginTop: 3 },
    detail: { ...Type.caption, color: colors.textSecondary, marginTop: 3 },
    actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
    friendList: { gap: 6, marginBottom: 14 },
    friend: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 8, borderRadius: 12, borderWidth: 1, borderColor: colors.hairline },
    friendSelected: { borderColor: colors.primary, backgroundColor: colors.primarySubtle },
    friendName: { ...Type.callout, color: colors.text, fontWeight: '700' },
    inputLabel: { ...Type.overline, color: colors.textSecondary, marginBottom: 6 },
    input: { color: colors.text, backgroundColor: colors.surfaceMuted, borderColor: colors.border, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, fontSize: 16, marginBottom: 6 },
    message: { ...Type.caption, color: colors.primaryText, marginTop: 8 },
  });
}
