// "Your memory hook" (2026-10-28): under an answered question, the learner can
// write their own mnemonic, picture or rhyme for the concept. It shows again
// every time the concept comes up, follows them to other devices, and can be
// shared with friends on the feed.
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import type { ThemeColors } from '@/constants/theme';
import { createCommunityPost } from '@/data/community';
import { HOOK_MAX_LENGTH, hookPostText } from '@/data/learning/memory-hook-rules';
import { saveMemoryHook, useMemoryHook } from '@/data/memory-hooks';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';

export function MemoryHookBox({ conceptKey, concept }: { conceptKey: string; concept: string }) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const hook = useMemoryHook(conceptKey);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [sharing, setSharing] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');

  function startEditing() {
    setDraft(hook);
    setEditing(true);
  }

  function save() {
    saveMemoryHook(conceptKey, draft);
    setEditing(false);
    setSharing('idle');
  }

  async function share() {
    if (!hook || sharing === 'busy') return;
    setSharing('busy');
    try {
      await createCommunityPost(hookPostText(concept, hook), undefined, null, undefined, 'friends');
      setSharing('done');
    } catch {
      setSharing('error');
    }
  }

  if (editing) {
    return (
      <View style={styles.box}>
        <Text style={styles.label}>Your memory hook for {concept}</Text>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="A rhyme, a picture, a silly story: anything that makes it stick."
          placeholderTextColor={colors.textTertiary}
          maxLength={HOOK_MAX_LENGTH}
          multiline
          style={styles.input}
          accessibilityLabel={`Memory hook for ${concept}`}
        />
        <View style={styles.row}>
          <Button label="Save" size="sm" onPress={save} disabled={!draft.trim() && !hook} />
          {hook ? <Button label="Remove" size="sm" variant="ghost" onPress={() => { saveMemoryHook(conceptKey, ''); setEditing(false); }} /> : null}
          <Button label="Cancel" size="sm" variant="ghost" onPress={() => setEditing(false)} />
        </View>
      </View>
    );
  }

  if (!hook) {
    return (
      <Button
        label="Add a memory hook"
        size="sm"
        variant="ghost"
        icon={<Icon name="edit" size={14} color={colors.primaryText} />}
        onPress={startEditing}
        accessibilityHint="Write your own way to remember this; it shows whenever this idea comes up"
      />
    );
  }

  return (
    <View style={styles.box}>
      <Text style={styles.label}>Your memory hook</Text>
      <Text style={styles.hook}>{hook}</Text>
      <View style={styles.row}>
        <Button label="Edit" size="sm" variant="ghost" onPress={startEditing} />
        <Button
          label={sharing === 'done' ? 'Shared with friends' : sharing === 'error' ? 'Could not share. Try again' : 'Share with friends'}
          size="sm"
          variant="ghost"
          onPress={() => void share()}
          loading={sharing === 'busy'}
          disabled={sharing === 'done'}
        />
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    box: { gap: 6, marginTop: 8, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
    label: { fontSize: 11, fontWeight: '800', letterSpacing: 0.8, color: colors.textTertiary },
    hook: { fontSize: 14, lineHeight: 20, color: colors.text, fontStyle: 'italic' },
    input: { minHeight: 60, padding: 8, borderRadius: 6, borderWidth: 1, borderColor: colors.border, color: colors.text, fontSize: 14, backgroundColor: colors.surfaceSunken, textAlignVertical: 'top' },
    row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  });
}
