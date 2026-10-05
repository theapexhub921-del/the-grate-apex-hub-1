import { Href, router } from 'expo-router';
import { type ReactNode, useState } from 'react';
import { StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';

import { ATMOSPHERE } from '@/components/atmosphere/config';
import { AvatarPicker } from '@/components/avatar/avatar-picker';
import { BackLink } from '@/components/learning/nav-bits';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Interactive } from '@/components/ui/interactive';
import { PageHeader, Screen } from '@/components/ui/screen';
import { webStyle } from '@/components/ui/web';
import { cssTransition, MOTION } from '@/constants/motion';
import { Colors, elevation, isDesktopWidth, Radius, Type, type ThemeColors } from '@/constants/theme';
import { setTabBarMode, type TabBarMode, useTabBarMode } from '@/data/navigation-settings';
import { type AppearancePreference, setAppearancePreference, useAppearancePreference } from '@/data/settings';
import { setDisplayName, useAvatarUrl, useDisplayName } from '@/data/user';
import { useAuth } from '@/hooks/use-auth';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';
import { deleteMyAccount } from '@/lib/account';
import { routes } from '@/lib/routes';
import { supabase } from '@/lib/supabase';

const HOME_HREF = '/' as Href;

const appearanceOptions: { value: AppearancePreference; label: string; description: string }[] = [
  { value: 'apex', label: 'Apex', description: 'Royal blue and gold — the GRATEAPEX look.' },
  { value: 'light', label: 'Light', description: 'Soft off-white, easy in daylight.' },
  { value: 'dark', label: 'Dark', description: 'Layered charcoal for night study.' },
  { value: 'system', label: 'System', description: 'Follows your device: Light or Dark.' },
];

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

// Settings — quiet and grouped. Opened from the gear on Home, the rail
// and Profile. Each group is one <SettingsSection>; future groups
// (Notifications, Privacy, Data, About) are added once they really exist.
export default function SettingsScreen() {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const { width } = useWindowDimensions();
  const desktop = isDesktopWidth(width);
  const appearance = useAppearancePreference();
  const tabBarMode = useTabBarMode();
  const systemScheme = useColorScheme();
  const avatarUrl = useAvatarUrl();
  const [pickerOpen, setPickerOpen] = useState(false);

  // Display name.
  const savedName = useDisplayName();
  const [nameDraft, setNameDraft] = useState(savedName ?? '');
  const [nameSaved, setNameSaved] = useState(false);

  // Authentication session.
  const { user } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteText, setDeleteText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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
    if (deleting || deleteText.trim().toUpperCase() !== 'DELETE') return;
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

  return (
    <Screen width="prose">
      <BackLink fallback={HOME_HREF} />
      <PageHeader title="Settings" subtitle="Your profile, appearance and navigation." style={styles.header} />

      <SettingsSection title="Profile">
        <View style={styles.profileRow}>
          <Interactive onPress={() => setPickerOpen(true)} accessibilityLabel="Change your avatar" style={({ pressed }) => [pressed && styles.pressed]}>
            <Avatar uri={avatarUrl} name={savedName} size={64} ring="gold" />
            <View style={styles.editBadge}>
              <Icon name="camera" size={13} color="#0A1F5C" strokeWidth={2.2} />
            </View>
          </Interactive>
          <View style={styles.flex}>
            <Text style={styles.optionLabel}>Avatar</Text>
            <Text style={styles.optionDescription}>Illustrated male or female avatar, or your own photo.</Text>
            <Button label="Change avatar" size="sm" variant="secondary" onPress={() => setPickerOpen(true)} style={styles.inlineButton} />
          </View>
        </View>

        <View style={styles.divider} />

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
          {appearanceOptions.map((option) => {
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

      <SettingsSection title="Help">
        <Interactive
          onPress={() => router.push(routes.onboarding({ replay: true }))}
          accessibilityLabel="Replay the introduction"
          style={({ hovered }) => [styles.optionRow, hovered && styles.rowHover]}
        >
          <Icon name="play" size={18} color={colors.primaryText} />
          <View style={styles.flex}>
            <Text style={styles.optionLabel}>Replay the introduction</Text>
            <Text style={styles.optionDescription}>The interactive tour of how GRATEAPEX works. Nothing in it affects your progress.</Text>
          </View>
          <Icon name="chevronRight" size={18} color={colors.textTertiary} />
        </Interactive>
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
            {deleteOpen ? (
              <View style={[styles.optionRow, styles.rowDivider, styles.deleteBox]}>
                <Text style={[styles.optionLabel, styles.signOutText]}>Delete your account permanently?</Text>
                <Text style={styles.optionDescription}>
                  This erases your profile, progress, XP, quiz and review history, friends and notifications. It cannot be undone. Type DELETE to confirm.
                </Text>
                <TextInput
                  value={deleteText}
                  onChangeText={setDeleteText}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  placeholder="DELETE"
                  placeholderTextColor={colors.textTertiary}
                  accessibilityLabel="Type DELETE to confirm"
                  style={styles.deleteInput}
                />
                {deleteError ? <Text style={styles.signOutText}>{deleteError}</Text> : null}
                <View style={styles.deleteActions}>
                  <Button label="Delete my account" size="sm" onPress={() => void handleDeleteAccount()} loading={deleting} disabled={deleteText.trim().toUpperCase() !== 'DELETE' || deleting} />
                  <Button label="Cancel" size="sm" variant="secondary" onPress={() => { setDeleteOpen(false); setDeleteText(''); setDeleteError(null); }} disabled={deleting} />
                </View>
              </View>
            ) : (
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
            )}
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

      <AvatarPicker visible={pickerOpen} onClose={() => setPickerOpen(false)} />
    </Screen>
  );
}

// A miniature of the theme: its page light, a card and its accent.
function ThemeSwatch({ scheme, split }: { scheme: 'apex' | 'light' | 'dark'; split?: boolean }) {
  const styles = useThemedStyles(createStyles);
  const render = (name: 'apex' | 'light' | 'dark') => {
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
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    flex: { flex: 1, minWidth: 0 },
    header: { marginTop: 14 },
    pressed: { transform: [{ scale: 0.98 }] },
    section: { marginBottom: 22 },
    sectionTitle: { ...Type.overline, color: colors.textTertiary, marginBottom: 8, marginLeft: 4 },
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
    themeGridDesktop: { flexWrap: 'nowrap' },
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
    themeCardDesktop: { flex: 1 },
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
    deleteBox: { flexDirection: 'column', alignItems: 'stretch', gap: 8 },
    deleteInput: {
      minHeight: 42,
      paddingHorizontal: 12,
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: colors.errorBorder,
      color: colors.text,
      fontSize: 15,
    },
    deleteActions: { flexDirection: 'row', gap: 10 },
    signInText: { color: colors.primaryText },
  });
}
