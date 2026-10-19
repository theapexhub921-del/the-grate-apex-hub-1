import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Sheet } from '@/components/ui/sheet';
import { Text } from '@/components/ui/text';
import { type ThemeColors } from '@/constants/theme';
import { claimIncomingCoins } from '@/data/apex-coins';
import { claimIncomingBoosts, describeGiftBoost } from '@/data/boost-gifts';
import { personName, useSocial } from '@/data/social';
import { useAuth } from '@/hooks/use-auth';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';

// Collects gifts from friends — Apex Coins (data/apex-coins.ts) and XP boosts
// (data/boost-gifts.ts) — on sign-in and then every few minutes, and says
// what arrived and from whom.
const EVERY_MS = 3 * 60_000;

type Arrival = { key: string; from: string; what: string; kind: 'coins' | 'boost' };

export function CoinGiftSync() {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const { user } = useAuth();
  const social = useSocial();
  const uid = user?.uid ?? null;
  const [arrivals, setArrivals] = useState<Arrival[]>([]);
  const people = useRef(social.people);
  useEffect(() => { people.current = social.people; }, [social.people]);

  useEffect(() => {
    if (!uid) return;
    let live = true;
    const nameOf = (id: string) => {
      const person = people.current.find((item) => item.userId === id);
      return person ? personName(person) : 'A friend';
    };
    async function collect() {
      const found: Arrival[] = [];
      await claimIncomingCoins((gift) => found.push({ key: `c:${gift.from}:${Date.now()}:${found.length}`, from: nameOf(gift.from), what: `${gift.amount.toLocaleString()} Apex Coins`, kind: 'coins' }));
      const boosts = await claimIncomingBoosts();
      boosts.forEach((boost) => found.push({ key: `b:${boost.id}`, from: boost.fromName, what: describeGiftBoost(boost), kind: 'boost' }));
      if (live && found.length) setArrivals((current) => [...current, ...found]);
    }
    void collect();
    const timer = setInterval(() => void collect(), EVERY_MS);
    return () => {
      live = false;
      clearInterval(timer);
    };
  }, [uid]);

  const hasBoost = arrivals.some((item) => item.kind === 'boost');
  return (
    <Sheet
      visible={arrivals.length > 0}
      onClose={() => setArrivals([])}
      title="Gifts from friends"
      subtitle="Added to your account"
      footer={
        <View style={styles.actions}>
          {hasBoost ? <Button label="See my boosts" variant="secondary" onPress={() => { setArrivals([]); router.push('/achievements' as never); }} /> : null}
          <Button label="Thanks!" onPress={() => setArrivals([])} />
        </View>
      }
    >
      {arrivals.map((item) => (
        <View key={item.key} style={styles.row}>
          <View style={styles.mark}><Icon name={item.kind === 'boost' ? 'sparkle' : 'achievement'} size={18} color={colors.accentText} /></View>
          <Text style={styles.text}><Text style={styles.strong}>{item.from}</Text> sent you {item.what}.</Text>
        </View>
      ))}
    </Sheet>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    mark: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.accentSubtle },
    text: { flex: 1, fontSize: 15, lineHeight: 21, color: colors.text },
    strong: { fontWeight: '800' },
    actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  });
}
