import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import type { ThemeColors } from '@/constants/theme';
import { useThemedStyles } from '@/hooks/use-theme';

import type { Organ3DProps } from './organ-3d-types';

// The real 3D organ (from the atlas models) moving with the simulation: the viewer page
// public/sim3d/organ.html runs in a frame and is moved by messages (OrganFrame). Learners can
// turn it with a finger or the mouse. On small screens it waits for a tap, so a phone on
// mobile data downloads the model (about 5 MB, then kept by the browser) only when asked.
export function Organ3D({ scene, frame, label, height = 280 }: Organ3DProps) {
  const styles = useThemedStyles(createStyles);
  const { width } = useWindowDimensions();
  const [shown, setShown] = useState(width >= 700);
  const ref = useRef<HTMLIFrameElement>(null);
  const message = useMemo(() => JSON.stringify({ type: 'grateapex-organ', ...frame }), [frame]);
  const src = `/sim3d/organ.html?scene=${encodeURIComponent(scene)}`;

  useEffect(() => {
    if (!shown) return;
    const send = () => ref.current?.contentWindow?.postMessage(message, window.location.origin);
    send();
    // the page may still be loading: say it again shortly
    const t = setTimeout(send, 600);
    return () => clearTimeout(t);
  }, [message, shown]);

  if (!shown) {
    return (
      <View style={[styles.box, styles.placeholder, { height: 120 }]} accessibilityLabel={label}>
        <Text style={styles.hint}>See it on the real 3D organ</Text>
        <Button label="Show in 3D" variant="secondary" onPress={() => setShown(true)} />
      </View>
    );
  }
  return (
    <View style={[styles.box, { height }]} accessible accessibilityRole="image" accessibilityLabel={label}>
      <iframe ref={ref} src={src} title={label} style={{ border: 0, width: '100%', height: '100%', display: 'block', background: 'transparent' }} onLoad={() => ref.current?.contentWindow?.postMessage(message, window.location.origin)} />
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    box: { borderRadius: 12, overflow: 'hidden', backgroundColor: colors.surfaceMuted, borderWidth: 1, borderColor: colors.border },
    placeholder: { alignItems: 'center', justifyContent: 'center', gap: 10 },
    hint: { color: colors.textSecondary },
  });
