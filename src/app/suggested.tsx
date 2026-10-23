import { BackLink } from '@/components/learning/nav-bits';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';

import { openProfileCard, PersonAvatar } from '@/components/social/profile-card';
import { Button } from '@/components/ui/button';
import { Card, Interactive } from '@/components/ui/interactive';
import { LoadingState } from '@/components/ui/state-views';
import { PageHeader, Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { VerifiedBadge } from '@/components/ui/verified-badge';
import { Type, type ThemeColors } from '@/constants/theme';
import { refreshSocial, sendFriendRequest, useSocial } from '@/data/social';
import { loadGoldAccounts, type SuggestedAccount } from '@/data/verified';
import { useThemedStyles } from '@/hooks/use-theme';
import { friendlyError } from '@/lib/errors';

const COMMUNITY_SOCIALS = [
  { name: 'Instagram', url: 'https://www.instagram.com/grateapexhub?cplk=MWQxbHhva3xzNm1sbQ%3D%3D&utm_source=qr' },
  { name: 'X', url: 'https://x.com/grateapexhub' },
  { name: 'TikTok', url: 'https://www.tiktok.com/@grateapexhub?_r=1&_t=ZS-9AmIjv59dHo' },
];

// Shown once, right after the introduction: the gold-tick accounts to follow.
export default function SuggestedScreen() {
  const styles = useThemedStyles(createStyles);
  const social = useSocial();
  const [accounts, setAccounts] = useState<SuggestedAccount[] | null>(null);
  const [followed, setFollowed] = useState<string[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    void loadGoldAccounts().then((list) => { if (live) setAccounts(list); }).catch(() => { if (live) setAccounts([]); });
    return () => { live = false; };
  }, []);

  const following = (uid: string) => followed.includes(uid) || social.people.some((person) => person.userId === uid && (person.relationship === 'friends' || person.relationship === 'outgoing'));

  async function follow(uids: string[]) {
    setError(null);
    for (const uid of uids) {
      setBusy(uid);
      try {
        await sendFriendRequest(uid);
        setFollowed((list) => [...list, uid]);
      } catch (problem) {
        setError(friendlyError(problem, 'Could not follow right now.'));
      }
    }
    setBusy(null);
    void refreshSocial();
  }

  const left = (accounts ?? []).filter((account) => !following(account.uid)).map((account) => account.uid);

  return (
    <Screen width="prose">
      <BackLink fallback={'/' as never} />
      <PageHeader eyebrow="WELCOME TO GRATE APEX" title="Suggested for you" subtitle="Follow official and verified accounts for updates, tips and study help." />
      {accounts === null ? <LoadingState /> : null}
      {accounts && accounts.length > 1 && left.length ? <Button label={`Follow all (${left.length})`} variant="secondary" loading={busy !== null} onPress={() => void follow(left)} /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.list}>
        {(accounts ?? []).map((account) => {
          const name = account.displayName ?? `@${account.username}`;
          const on = following(account.uid);
          return (
            <Card key={account.uid} style={styles.row}>
              <Interactive onPress={() => openProfileCard(account.uid)} accessibilityRole="button" accessibilityLabel={`View ${name}`} style={styles.who}>
                <PersonAvatar uid={account.uid} uri={account.avatarUrl} name={name} size={48} ring="gold" />
                <View style={styles.text}>
                  <View style={styles.nameRow}>
                    <Text style={styles.name} numberOfLines={1}>{name}</Text>
                    <VerifiedBadge username={account.username} uid={account.uid} size={15} />
                  </View>
                  <Text style={styles.handle} numberOfLines={1}>@{account.username}</Text>
                  {account.bio ? <Text style={styles.bio} numberOfLines={2}>{account.bio}</Text> : null}
                </View>
              </Interactive>
              <Button label={on ? 'Following' : 'Follow'} size="sm" variant={on ? 'secondary' : 'primary'} disabled={on} loading={busy === account.uid} onPress={() => void follow([account.uid])} />
            </Card>
          );
        })}
        {accounts && !accounts.length ? <Text style={styles.bio}>No suggestions right now. You can find classmates any time in Connect.</Text> : null}
      </View>
      <Card style={styles.communityCard}>
        <Text style={styles.communityTitle}>Follow the GrAte Apex Community on Social Media.</Text>
        <View style={styles.socialLinks}>
          {COMMUNITY_SOCIALS.map((item) => (
            <Interactive
              key={item.name}
              onPress={() => void Linking.openURL(item.url).catch(() => {})}
              accessibilityRole="link"
              accessibilityLabel={`Follow GrAte Apex Hub on ${item.name}`}
              style={styles.socialLink}
            >
              <Text style={styles.socialLinkText}>{item.name}</Text>
              <Text style={styles.socialArrow}>↗</Text>
            </Interactive>
          ))}
        </View>
        <View style={styles.tagline}>
          <Text style={styles.taglineText}>Beginning of Something New.</Text>
          <Text style={styles.taglineMark}>GAPX</Text>
        </View>
      </Card>
      <Button label="Continue to GrAte Apex" trailing="→" onPress={() => router.replace('/')} />
    </Screen>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    list: { gap: 10 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    who: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 12 },
    text: { flex: 1, minWidth: 0, gap: 2 },
    nameRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    name: { ...Type.headline, color: colors.text, flexShrink: 1 },
    handle: { fontSize: 13, color: colors.textSecondary },
    bio: { fontSize: 13, lineHeight: 18, color: colors.textSecondary },
    error: { fontSize: 13, color: colors.error },
    communityCard: { gap: 14, marginTop: 8, padding: 18 },
    communityTitle: { ...Type.title3, color: colors.text },
    socialLinks: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    socialLink: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, backgroundColor: colors.primarySubtle, borderWidth: 1, borderColor: colors.primaryBorder },
    socialLinkText: { ...Type.callout, color: colors.primaryText, fontWeight: '700' },
    socialArrow: { fontSize: 14, color: colors.primaryText },
    tagline: { alignItems: 'center', gap: 2, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.divider },
    taglineText: { ...Type.headline, color: colors.text },
    taglineMark: { ...Type.overline, color: colors.accentText, letterSpacing: 3 },
  });
}
