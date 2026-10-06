import { Href, router } from 'expo-router';
import { type ReactNode, useEffect, useState } from 'react';
import { Linking, Platform, Share, StyleSheet, Switch, Text, TextInput, useWindowDimensions, View } from 'react-native';

import { ATMOSPHERE } from '@/components/atmosphere/config';
import { BackLink } from '@/components/learning/nav-bits';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Interactive } from '@/components/ui/interactive';
import { Sheet } from '@/components/ui/sheet';
import { PageHeader, Screen } from '@/components/ui/screen';
import { webStyle } from '@/components/ui/web';
import { cssTransition, MOTION } from '@/constants/motion';
import { Colors, elevation, isDesktopWidth, Radius, Type, type ThemeColors } from '@/constants/theme';
import { setTabBarMode, type TabBarMode, useTabBarMode } from '@/data/navigation-settings';
import {
  type AppearancePreference,
  type FontSizePreference,
  setPageZoomPreference,
  setAppearancePreference,
  setPushNotificationsPreference,
  setNotificationPreference,
  usePageZoomPreference,
  useAppearancePreference,
  APPEARANCE_OPTIONS,
  usePushNotificationsPreference,
  useNotificationPreferences,
  setFontSizePreference,
  useFontSizePreference,
  usePrivacyPreferences,
  setPrivacyPreference,
  syncSettingsFromAccount,
  type NotificationCategory,
} from '@/data/settings';
import { setDisplayName, useDisplayName } from '@/data/user';
import { ABOUT_US } from '@/data/about';
import { EXPLORE_TEAM } from '@/data/explore';
import { grantPowerup } from '@/data/learning/powerups';
import { dayKey } from '@/data/learning/time';
import { useAuth } from '@/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';
import { deleteMyAccount } from '@/lib/account';
import { routes } from '@/lib/routes';
import { supabase } from '@/lib/supabase';

const HOME_HREF = '/' as Href;
type ThemeSwatchScheme = Exclude<AppearancePreference, 'system'>;

const navigationOptions: { value: TabBarMode; label: string; description: string }[] = [
  {
    value: 'autoHide',
    label: 'Auto-hide',
    description: 'Phones: the tab bar slides away while you scroll down and returns when you scroll up. Laptops: the side navigation waits at the left edge.',
  },
  {
    value: 'alwaysVisible',
    label: 'Always visible',
    description: 'Keep the tab bar on screen and the side navigation docked.',
  },
];

const MAX_NAME_LENGTH = 30;
const notificationOptions: { key: NotificationCategory; label: string; description: string }[] = [
  { key: 'friendActivity', label: 'Friend activity', description: 'Learning milestones from friends.' },
  { key: 'friendRequests', label: 'Friend requests', description: 'Requests to connect with classmates.' },
  { key: 'messages', label: 'Messages', description: 'New direct messages.' },
  { key: 'groupActivity', label: 'Group activity', description: 'Invitations and study group discussions.' },
  { key: 'studyReminders', label: 'Study reminders', description: 'Reminders for your planned study time.' },
  { key: 'learningReminders', label: 'Learning reminders', description: 'Lessons and reviews you planned to complete.' },
  { key: 'goalReminders', label: 'Goal reminders', description: 'Progress toward your personal goals.' },
  { key: 'streakReminders', label: 'Streak reminders', description: 'A reminder when your learning streak is at risk.' },
  { key: 'announcements', label: 'Announcements', description: 'Platform news and feature updates.' },
  { key: 'socialEngagement', label: 'Social engagement', description: 'Reactions and replies to your posts.' },
];

// Settings are grouped into collapsible sections and opened from the gear
// on Home, the rail and Profile.
export default function SettingsScreen() {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const { width } = useWindowDimensions();
  const desktop = isDesktopWidth(width);
  const appearance = useAppearancePreference();
  const pageZoom = usePageZoomPreference();
  const fontSize = useFontSizePreference();
  const privacy = usePrivacyPreferences();
  const pushNotificationsEnabled = usePushNotificationsPreference();
  const notificationPreferences = useNotificationPreferences();
  const tabBarMode = useTabBarMode();
  const systemScheme = useColorScheme();

  // Display name.
  const savedName = useDisplayName();
  const [nameDraft, setNameDraft] = useState(savedName ?? '');
  const [nameSaved, setNameSaved] = useState(false);

  // Authentication session.
  const { user } = useAuth();
  const [preferenceSyncError, setPreferenceSyncError] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [sharingApp, setSharingApp] = useState(false);
  const [shareNotice, setShareNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    let active = true;
    syncSettingsFromAccount(user.id).then(() => {
      if (active) setPreferenceSyncError(false);
    }).catch(() => {
      if (active) setPreferenceSyncError(true);
    });
    return () => { active = false; };
  }, [user?.id]);

  // Refill the box whenever the saved name changes (e.g. after it loads).
  const [lastSavedName, setLastSavedName] = useState(savedName);
  if (savedName !== lastSavedName) {
    setLastSavedName(savedName);
    setNameDraft(savedName ?? '');
  }

  const nameChanged = nameDraft.trim() !== (savedName ?? '');

  async function saveName() {
    await setDisplayName(nameDraft);
    setNameSaved(true);
  }

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.warn('Error signing out:', error.message);
      }
    } catch (err) {
      console.warn('Unexpected error signing out:', err);
    } finally {
      setSigningOut(false);
      router.replace('/login');
    }
  }

  async function handleDeleteAccount() {
    if (deleting) return;
    setDeleting(true);
    setDeleteError(null);
    const { error } = await deleteMyAccount();
    setDeleting(false);
    if (error) {
      setDeleteError(error);
      return;
    }
    router.replace('/login');
  }

  async function shareApp() {
    if (sharingApp) return;
    setSharingApp(true);
    setShareNotice(null);
    try {
      let shared = false;
      let copiedLink = false;
      if (Platform.OS === 'web' && typeof navigator !== 'undefined') {
        const browserNavigator = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
        if (browserNavigator.share) {
          await browserNavigator.share({ title: 'GrAteApex Hub', text: 'Study, practise and connect with GrAteApex Hub.', url: 'https://grateapex.vercel.app/' });
          shared = true;
        } else if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText('https://grateapex.vercel.app/');
          shared = true;
          copiedLink = true;
        }
      } else {
        const result = await Share.share({ title: 'GrAteApex Hub', message: 'Study, practise and connect with GrAteApex Hub: https://grateapex.vercel.app/' });
        shared = result.action === Share.sharedAction;
      }
      if (!shared) {
        setShareNotice('Sharing was cancelled or is not available in this browser.');
        return;
      }
      const awarded = await grantPowerup('share', dayKey(Date.now()), 1.5);
      setShareNotice(awarded
        ? `${copiedLink ? 'Link copied.' : 'Thanks for sharing GrAteApex Hub.'} A 1.5× XP power-up is ready for your next lesson or quiz.`
        : `${copiedLink ? 'Link copied.' : 'Thanks for sharing GrAteApex Hub.'} You have already earned today’s share power-up.`);
    } catch (error) {
      const aborted = error instanceof Error && error.name === 'AbortError';
      setShareNotice(aborted ? 'Sharing was cancelled.' : 'Could not share the app. Please try again.');
    } finally {
      setSharingApp(false);
    }
  }

  return (
    <Screen width="prose">
      <BackLink fallback={HOME_HREF} />
      <PageHeader title="Settings" subtitle="Your profile, appearance and navigation." style={styles.header} />

      <SettingsSection title="Profile">
        <Text style={styles.optionLabel}>Display name</Text>
        <Text style={styles.optionDescription}>{nameSaved && !nameChanged ? 'Saved.' : 'Shown on Home as "Doc. <name>".'}</Text>
        <View style={styles.nameInputRow}>
          <TextInput
            style={styles.nameInput}
            value={nameDraft}
            onChangeText={(text) => {
              setNameDraft(text);
              setNameSaved(false);
            }}
            onSubmitEditing={() => nameChanged && saveName()}
            placeholder="Your name"
            placeholderTextColor={colors.textTertiary}
            maxLength={MAX_NAME_LENGTH}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="done"
            accessibilityLabel="Display name"
          />
          <Button label="Save" onPress={() => void saveName()} disabled={!nameChanged} />
        </View>
      </SettingsSection>

      <SettingsSection title="Appearance">
        <View style={[styles.themeGrid, desktop && styles.themeGridDesktop]}>
          {APPEARANCE_OPTIONS.map((option) => {
            const selected = appearance === option.value;
            const scheme = option.value === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : option.value;
            return (
              <Interactive
                key={option.value}
                onPress={() => setAppearancePreference(option.value)}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                accessibilityLabel={`${option.label} theme. ${option.description}`}
                style={({ hovered, pressed }) => [
                  styles.themeCard,
                  desktop ? styles.themeCardDesktop : styles.themeCardMobile,
                  hovered && styles.themeCardHover,
                  selected && styles.themeCardSelected,
                  pressed && styles.pressed,
                ]}
              >
                <ThemeSwatch scheme={scheme} split={option.value === 'system'} />
                <View style={styles.themeText}>
                  <View style={styles.themeTitleRow}>
                    <Text style={[styles.themeLabel, selected && styles.themeLabelSelected]}>{option.label}</Text>
                    {selected ? (
                      <View style={styles.check}>
                        <Icon name="check" size={11} color={colors.onPrimary} strokeWidth={3} />
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.themeDescription}>{option.description}</Text>
                </View>
              </Interactive>
            );
          })}
        </View>
      </SettingsSection>

      <SettingsSection title="Font size and zoom">
        <Text style={styles.optionDescription}>Font size changes text while preserving the page layout. Zoom changes the whole web app.</Text>
        <Text style={styles.optionLabel}>Font size</Text>
        <View style={styles.zoomOptions}>
          {([{ value: 'small', label: 'Small' }, { value: 'default', label: 'Default' }, { value: 'large', label: 'Large' }, { value: 'extra_large', label: 'Extra Large' }] as const).map((option) => (
            <Interactive key={option.value} onPress={() => void setFontSizePreference(option.value as FontSizePreference)} accessibilityRole="radio" accessibilityState={{ checked: fontSize === option.value }} style={[styles.zoomOption, fontSize === option.value && styles.zoomOptionSelected]}>
              <Text style={[styles.zoomText, fontSize === option.value && styles.zoomTextSelected]}>{option.label}</Text>
            </Interactive>
          ))}
        </View>
        {Platform.OS === 'web' ? (
          <View style={styles.zoomOptions}>
            {([80, 90, 100, 110, 125] as const).map((value) => (
              <Interactive
                key={value}
                onPress={() => void setPageZoomPreference(value)}
                accessibilityRole="radio"
                accessibilityState={{ checked: pageZoom === value }}
                accessibilityLabel={`${value}% app zoom`}
                style={[styles.zoomOption, pageZoom === value && styles.zoomOptionSelected]}
              >
                <Text style={[styles.zoomText, pageZoom === value && styles.zoomTextSelected]}>{value}%</Text>
              </Interactive>
            ))}
          </View>
        ) : null}
        {Platform.OS !== 'web' ? <Text style={styles.optionDescription}>App zoom is currently available in the web experience. Native screens continue to respect your device accessibility settings.</Text> : null}
      </SettingsSection>

      <SettingsSection title="Privacy">
        <Text style={styles.optionLabel}>Profile visibility</Text>
        <Text style={styles.optionDescription}>This preference is saved to your account. Privacy filtering is being applied to social queries as that backend migration is enabled.</Text>
        <View style={styles.zoomOptions}>{(['public', 'friends', 'private'] as const).map((value) => <Interactive key={value} onPress={() => void setPrivacyPreference('profileVisibility', value)} accessibilityRole="radio" accessibilityState={{ checked: privacy.profileVisibility === value }} style={[styles.zoomOption, privacy.profileVisibility === value && styles.zoomOptionSelected]}><Text style={[styles.zoomText, privacy.profileVisibility === value && styles.zoomTextSelected]}>{value[0].toUpperCase() + value.slice(1)}</Text></Interactive>)}</View>
        <PrivacySwitch label="Show my activity to friends" value={privacy.activityVisible} onChange={(value) => void setPrivacyPreference('activityVisible', value)} />
        <PrivacySwitch label="Show when I’m online" value={privacy.shareOnlineStatus} onChange={(value) => void setPrivacyPreference('shareOnlineStatus', value)} />
        <Text style={styles.optionDescription}>Only accepted friends can see your online status. It turns off automatically when you sign out.</Text>
        <PrivacySwitch label="Let students find me" value={privacy.discoverable} onChange={(value) => void setPrivacyPreference('discoverable', value)} />
        <View style={styles.optionRow}><View style={styles.flex}><Text style={styles.optionLabel}>Messages</Text><Text style={styles.optionDescription}>Choose who may start a conversation.</Text></View><View style={styles.zoomOptions}>{(['friends', 'everyone'] as const).map((value) => <Interactive key={value} onPress={() => void setPrivacyPreference('messagingPermission', value)} accessibilityRole="radio" accessibilityState={{ checked: privacy.messagingPermission === value }} style={[styles.zoomOption, privacy.messagingPermission === value && styles.zoomOptionSelected]}><Text style={[styles.zoomText, privacy.messagingPermission === value && styles.zoomTextSelected]}>{value}</Text></Interactive>)}</View></View>
        <View style={styles.optionRow}><View style={styles.flex}><Text style={styles.optionLabel}>Friend requests</Text><Text style={styles.optionDescription}>Choose who may send you a request.</Text></View><View style={styles.zoomOptions}>{(['everyone', 'friends'] as const).map((value) => <Interactive key={value} onPress={() => void setPrivacyPreference('friendRequestPermission', value)} accessibilityRole="radio" accessibilityState={{ checked: privacy.friendRequestPermission === value }} style={[styles.zoomOption, privacy.friendRequestPermission === value && styles.zoomOptionSelected]}><Text style={[styles.zoomText, privacy.friendRequestPermission === value && styles.zoomTextSelected]}>{value}</Text></Interactive>)}</View></View>
      </SettingsSection>

      <SettingsSection title="Navigation">
        {navigationOptions.map((option, index) => {
          const selected = tabBarMode === option.value;
          return (
            <Interactive
              key={option.value}
              onPress={() => setTabBarMode(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              accessibilityLabel={`${option.label}. ${option.description}`}
              style={({ hovered }) => [styles.optionRow, index > 0 && styles.rowDivider, hovered && styles.rowHover]}
            >
              <View style={styles.flex}>
                <Text style={[styles.optionLabel, selected && styles.optionLabelSelected]}>{option.label}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </View>
              <View style={[styles.radio, selected && styles.radioSelected]}>{selected ? <View style={styles.radioDot} /> : null}</View>
            </Interactive>
          );
        })}
      </SettingsSection>

      <SettingsSection title="Notifications">
        {preferenceSyncError ? <Text style={styles.optionDescription}>Your choices are saved on this device. Account sync is unavailable until the preferences database migration is applied.</Text> : null}
        <Text style={styles.optionDescription}>Category choices also filter the notifications shown in the app. Push delivery is not active yet.</Text>
        <View style={styles.optionRow}>
          <Icon name="bell" size={18} color={colors.primaryText} />
          <View style={styles.flex}>
            <Text style={styles.optionLabel}>Push notification preference</Text>
            <Text style={styles.optionDescription}>Save whether you want reminders. Push delivery is not connected yet; turning this on will not send notifications today.</Text>
          </View>
          <Switch
            value={pushNotificationsEnabled}
            onValueChange={(enabled) => void setPushNotificationsPreference(enabled)}
            trackColor={{ false: colors.track, true: colors.primary }}
            thumbColor={colors.surface}
            accessibilityLabel="Push notification preference"
          />
        </View>
        {notificationOptions.map((option) => (
          <View key={option.key} style={styles.optionRow}>
            <View style={styles.flex}>
              <Text style={styles.optionLabel}>{option.label}</Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
            </View>
            <Switch
              value={notificationPreferences[option.key]}
              onValueChange={(enabled) => void setNotificationPreference(option.key, enabled)}
              trackColor={{ false: colors.track, true: colors.primary }}
              thumbColor={colors.surface}
              accessibilityLabel={`${option.label} notification preference`}
            />
          </View>
        ))}
      </SettingsSection>

      <SettingsSection title="Legal">
        <Interactive onPress={() => router.push('/terms' as Href)} accessibilityRole="link" style={styles.optionRow}>
          <View style={styles.flex}><Text style={styles.optionLabel}>Terms & Conditions</Text><Text style={styles.optionDescription}>Read the terms that apply to your account.</Text></View>
          <Icon name="chevronRight" size={18} color={colors.textTertiary} />
        </Interactive>
        <Interactive onPress={() => router.push('/privacy' as Href)} accessibilityRole="link" style={[styles.optionRow, styles.rowDivider]}>
          <View style={styles.flex}><Text style={styles.optionLabel}>Privacy Policy</Text><Text style={styles.optionDescription}>Review how account and learning data are handled.</Text></View>
          <Icon name="chevronRight" size={18} color={colors.textTertiary} />
        </Interactive>
      </SettingsSection>

      <SettingsSection title="Help">
        <Interactive
          onPress={() => router.push(routes.onboarding({ replay: true }))}
          accessibilityLabel="Replay the introduction"
          style={({ hovered }) => [styles.optionRow, hovered && styles.rowHover]}
        >
          <Icon name="play" size={18} color={colors.primaryText} />
          <View style={styles.flex}>
            <Text style={styles.optionLabel}>Replay the introduction</Text>
            <Text style={styles.optionDescription}>The interactive tour of how GrAteApex Hub works. Nothing in it affects your progress.</Text>
          </View>
          <Icon name="chevronRight" size={18} color={colors.textTertiary} />
        </Interactive>
      </SettingsSection>

      <SettingsSection title="Install on your devices">
        <Text style={styles.optionDescription}>Install the web app from your browser. It works on phones, tablets and computers; an app-store download is not required.</Text>
        <View style={styles.optionRow}>
          <View style={styles.flex}>
            <Text style={styles.optionLabel}>iPhone and iPad</Text>
            <Text style={styles.optionDescription}>Open this site in Safari, tap Share, then choose Add to Home Screen.</Text>
          </View>
        </View>
        <View style={[styles.optionRow, styles.rowDivider]}>
          <View style={styles.flex}>
            <Text style={styles.optionLabel}>Android phones and tablets</Text>
            <Text style={styles.optionDescription}>Open in Chrome, tap ⋮, then choose Install app or Add to Home screen.</Text>
          </View>
        </View>
        <View style={[styles.optionRow, styles.rowDivider]}>
          <View style={styles.flex}>
            <Text style={styles.optionLabel}>Windows, Mac, Linux and Chromebook</Text>
            <Text style={styles.optionDescription}>In Chrome or Edge, use the install icon in the address bar or choose Install GrAteApex Hub from the browser menu. On Mac Safari, choose File → Add to Dock.</Text>
          </View>
        </View>
        <Interactive onPress={() => void Linking.openURL('https://grateapex.vercel.app/')} accessibilityRole="link" style={styles.optionRow}>
          <Icon name="share" size={18} color={colors.primaryText} />
          <View style={styles.flex}><Text style={styles.optionLabel}>Open GrAteApex Hub</Text><Text style={styles.optionDescription}>grateapex.vercel.app</Text></View>
          <Icon name="chevronRight" size={18} color={colors.textTertiary} />
        </Interactive>
      </SettingsSection>

      <SettingsSection title="Share the app">
        <Text style={styles.optionDescription}>Invite a classmate to study with you. After a successful share, earn one 1.5× XP power-up per day for your next lesson or quiz.</Text>
        <Button label={sharingApp ? 'Sharing…' : 'Share GrAteApex Hub'} variant="secondary" icon={<Icon name="share" size={17} color={colors.text} />} onPress={() => void shareApp()} disabled={sharingApp} />
        {shareNotice ? <Text style={styles.optionDescription} accessibilityLiveRegion="polite">{shareNotice}</Text> : null}
      </SettingsSection>

      <SettingsSection title="About us">
        <Text style={styles.optionDescription}>{ABOUT_US}</Text>
        <Text style={[styles.optionLabel, { marginTop: 16 }]}>Meet the team</Text>
        <View>
          {EXPLORE_TEAM.map((member, index) => (
            <View key={member.name} style={[styles.optionRow, index > 0 && styles.rowDivider]}>
              <Icon name={member.icon} size={18} color={colors.primaryText} />
              <View style={styles.flex}>
                <Text style={styles.optionLabel}>{member.name}</Text>
                <Text style={styles.optionDescription}>{member.role}</Text>
              </View>
            </View>
          ))}
        </View>
      </SettingsSection>

      <SettingsSection title="Account">
        {user ? (
          <>
            <View style={styles.optionRow}>
              <Icon name="mail" size={18} color={colors.textTertiary} />
              <View style={styles.flex}>
                <Text style={styles.optionLabel}>Signed in as</Text>
                <Text style={styles.optionDescription}>{user.email}</Text>
              </View>
            </View>
            <Interactive
              onPress={() => void handleSignOut()}
              disabled={signingOut}
              accessibilityLabel="Sign out"
              style={({ hovered }) => [styles.optionRow, styles.rowDivider, hovered && styles.rowHover]}
            >
              <Icon name="logout" size={18} color={colors.error} />
              <View style={styles.flex}>
                <Text style={[styles.optionLabel, styles.signOutText]}>{signingOut ? 'Signing out…' : 'Sign out'}</Text>
                <Text style={styles.optionDescription}>Sign out of your account on this device.</Text>
              </View>
            </Interactive>
            <Interactive
              onPress={() => setDeleteOpen(true)}
              accessibilityLabel="Delete account"
              style={({ hovered }) => [styles.optionRow, styles.rowDivider, hovered && styles.rowHover]}
            >
              <Icon name="warning" size={18} color={colors.error} />
              <View style={styles.flex}>
                <Text style={[styles.optionLabel, styles.signOutText]}>Delete account</Text>
                <Text style={styles.optionDescription}>Permanently erase your account and all your data.</Text>
              </View>
            </Interactive>
          </>
        ) : (
          <Interactive onPress={() => router.push('/login')} accessibilityLabel="Sign in" style={({ hovered }) => [styles.optionRow, hovered && styles.rowHover]}>
            <Icon name="key" size={18} color={colors.primaryText} />
            <View style={styles.flex}>
              <Text style={[styles.optionLabel, styles.signInText]}>Sign in</Text>
              <Text style={styles.optionDescription}>Sign in to sync your profile across devices.</Text>
            </View>
          </Interactive>
        )}
      </SettingsSection>

      <Sheet visible={deleteOpen} onClose={() => { if (!deleting) { setDeleteOpen(false); setDeleteError(null); } }} title="Delete your account?" subtitle="This action cannot be undone." footer={<View style={styles.confirmActions}><Button label="Cancel" variant="secondary" onPress={() => { setDeleteOpen(false); setDeleteError(null); }} disabled={deleting} /><Button label="Delete account" variant="danger" onPress={() => void handleDeleteAccount()} loading={deleting} /> </View>}>
        <Text style={styles.optionDescription}>Your profile, learning progress, XP, quiz and review history, friends and notifications will be permanently erased.</Text>
        {deleteError ? <Text style={styles.signOutText}>{deleteError}</Text> : null}
      </Sheet>

    </Screen>
  );
}

function PrivacySwitch({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) {
  const colors = useTheme();
  const styles = useThemedStyles(createStyles);
  return <View style={styles.optionRow}><Text style={[styles.optionLabel, styles.flex]}>{label}</Text><Switch value={value} onValueChange={onChange} trackColor={{ false: colors.track, true: colors.primary }} thumbColor={colors.surface} accessibilityLabel={label} /></View>;
}

// A miniature of the theme: its page light, a card and its accent.
function ThemeSwatch({ scheme, split }: { scheme: ThemeSwatchScheme; split?: boolean }) {
  const styles = useThemedStyles(createStyles);
  const render = (name: ThemeSwatchScheme) => {
    const palette = Colors[name];
    const field = ATMOSPHERE[name];
    return (
      <View style={[styles.swatchHalf, { backgroundColor: field.base }, webStyle({ backgroundImage: `radial-gradient(120% 90% at 0% 0%, ${field.fieldA[0]}55, transparent 60%)` })]}>
        <View style={[styles.swatchCard, { backgroundColor: palette.surface, borderColor: palette.hairline }]}>
          <View style={[styles.swatchLine, { backgroundColor: palette.text, opacity: 0.85 }]} />
          <View style={[styles.swatchLine, styles.swatchLineShort, { backgroundColor: palette.textTertiary }]} />
          <View style={[styles.swatchPill, { backgroundColor: palette.primary }]} />
        </View>
      </View>
    );
  };
  return (
    <View style={styles.swatch}>
      {split ? (
        <>
          {render('light')}
          {render('dark')}
        </>
      ) : (
        render(scheme)
      )}
    </View>
  );
}

// A titled group of settings rows.
function SettingsSection({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const colors = useTheme();
  const styles = useThemedStyles(createStyles);
  return <View style={styles.section}><Interactive onPress={() => setOpen((value) => !value)} accessibilityRole="button" accessibilityState={{ expanded: open }} style={styles.sectionToggle}><View style={styles.sectionTitleRow}><Text style={styles.sectionTitle}>{title}</Text><Text style={styles.sectionCount}>{open ? 'Hide' : 'Show'}</Text><Icon name={open ? 'chevronUp' : 'chevronDown'} size={16} color={colors.textTertiary} /></View></Interactive>{open ? <View style={styles.sectionCard}>{children}</View> : null}</View>;
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    flex: { flex: 1, minWidth: 0 },
    header: { marginTop: 14 },
    pressed: { transform: [{ scale: 0.98 }] },
    section: { marginBottom: 22 },
    sectionToggle: { paddingVertical: 8, paddingHorizontal: 4 },
    sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    sectionTitle: { ...Type.title3, color: colors.text, flex: 1 },
    sectionCount: { fontSize: 12, color: colors.textTertiary },
    sectionCard: {
      backgroundColor: colors.surface,
      borderRadius: Radius.lg,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.hairline,
      ...elevation(colors, 1),
    },
    profileRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    editBadge: {
      position: 'absolute',
      right: -2,
      bottom: -2,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: colors.surface,
    },
    inlineButton: { alignSelf: 'flex-start', marginTop: 8 },
    divider: { height: 1, backgroundColor: colors.divider, marginVertical: 16 },
    optionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 4, borderRadius: 12 },
    rowDivider: { borderTopWidth: 1, borderTopColor: colors.divider, borderRadius: 0 },
    rowHover: { backgroundColor: colors.surfaceMuted },
    optionLabel: { ...Type.headline, fontSize: 15, color: colors.text },
    optionLabelSelected: { color: colors.primaryText },
    optionDescription: { fontSize: 13, lineHeight: 18, color: colors.textSecondary, marginTop: 2 },
    nameInputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 },
    nameInput: {
      flex: 1,
      minHeight: 46,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      paddingHorizontal: 14,
      fontSize: 15,
      color: colors.text,
      backgroundColor: colors.surfaceSunken,
    },
    themeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    themeGridDesktop: { flexWrap: 'wrap' },
    zoomOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
    zoomOption: { minWidth: 54, minHeight: 40, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
    zoomOptionSelected: { borderColor: colors.primary, backgroundColor: colors.primarySubtle },
    zoomText: { fontSize: 13, fontWeight: '700', color: colors.textSecondary },
    zoomTextSelected: { color: colors.primaryText },
    themeCard: {
      borderRadius: 16,
      borderWidth: 2,
      borderColor: colors.hairline,
      backgroundColor: colors.surfaceMuted,
      padding: 8,
      gap: 10,
      ...webStyle(cssTransition('border-color, transform', MOTION.micro)),
    },
    themeCardMobile: { width: '48%', flexGrow: 1 },
    themeCardDesktop: { width: '31%', flexGrow: 1, minWidth: 180 },
    themeCardHover: { borderColor: colors.primaryBorder },
    themeCardSelected: { borderColor: colors.primary },
    themeText: { paddingHorizontal: 4, paddingBottom: 4 },
    themeTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    themeLabel: { fontSize: 14, fontWeight: '800', color: colors.text },
    themeLabelSelected: { color: colors.primaryText },
    themeDescription: { fontSize: 11.5, lineHeight: 16, color: colors.textSecondary, marginTop: 2 },
    check: { width: 18, height: 18, borderRadius: 9, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
    swatch: { height: 74, borderRadius: 11, overflow: 'hidden', flexDirection: 'row' },
    swatchHalf: { flex: 1, padding: 10, justifyContent: 'flex-end' },
    swatchCard: { borderRadius: 7, padding: 7, gap: 4, borderWidth: 1 },
    swatchLine: { height: 4, borderRadius: 2, width: '70%' },
    swatchLineShort: { width: '45%' },
    swatchPill: { height: 8, width: 26, borderRadius: 4, marginTop: 2 },
    radio: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: colors.borderStrong,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioSelected: { borderColor: colors.primary },
    radioDot: { width: 11, height: 11, borderRadius: 6, backgroundColor: colors.primary },
    signOutText: { color: colors.error },
    confirmActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
    signInText: { color: colors.primaryText },
  });
}
