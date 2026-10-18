// Tappable lecture diagrams (data/figures/).
//   FigureExplorer  in a lesson's reading section: a compact card (small
//                   preview + "Explore diagram"), so diagrams never take over the
//                   lesson. The interactive diagram opens in a sheet. "Explore": tap a numbered
//                   pin to see what it is. "Test yourself": the slide's own
//                   labels are covered; pick a pin, say the name to yourself,
//                   then reveal it.
//   QuestionFigure  with a quiz question: labels covered and the asked-about
//                   part marked; once answered, its label is uncovered.
//   QuestionImage   a plain picture with a question (past papers' diagrams).
import { Image } from 'expo-image';
import { useState, type ReactNode } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Interactive } from '@/components/ui/interactive';
import { Sheet } from '@/components/ui/sheet';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Text } from '@/components/ui/text';
import { elevation, Paper, Radius, Type, type ThemeColors } from '@/constants/theme';
import { getFigure, getSpot } from '@/data/figures';
import type { FigureSpot, LessonFigure } from '@/data/lesson-types';
import { useTheme, useThemedStyles } from '@/hooks/use-theme';

// Pictures are served from public/ by the website; the phone app loads
// them from the live site.
const SITE = 'https://grateapex.vercel.app';
const figureUri = (src: string) => (Platform.OS === 'web' ? src : `${SITE}${src}`);
const pct = (fraction: number) => `${fraction * 100}%` as const;

// Tall diagrams are kept short enough to see the picture and its panel together.
const MAX_HEIGHT = 480;
// In a quiz question the diagram stays modest beside the question and its options.
const QUESTION_MAX_HEIGHT = 280;
// The preview card in a lesson.
const PREVIEW_HEIGHT = 120;

/** A plain picture with a question (a past paper's labelled diagram). */
export function QuestionImage({ src, label = 'Diagram for this question' }: { src: string; label?: string }) {
  const styles = useThemedStyles(createStyles);
  return (
    <View style={[styles.canvas, styles.questionImage]}>
      <Image source={{ uri: figureUri(src) }} style={StyleSheet.absoluteFill} contentFit="contain" accessibilityLabel={label} transition={150} />
    </View>
  );
}

/** The picture at its own shape, with covers and pins drawn over it. */
function Canvas({ figure, children, label, maxHeight = MAX_HEIGHT }: { figure: LessonFigure; children?: ReactNode; label: string; maxHeight?: number }) {
  const styles = useThemedStyles(createStyles);
  const aspectRatio = figure.width / figure.height;
  return (
    <View style={[styles.canvas, { aspectRatio, maxWidth: Math.min(760, maxHeight * aspectRatio) }]}>
      <Image source={{ uri: figureUri(figure.src) }} style={StyleSheet.absoluteFill} contentFit="contain" accessibilityLabel={label} transition={150} />
      {children}
    </View>
  );
}

/** Covers the slide's printed label(s) for a spot. */
function Covers({ spot }: { spot: FigureSpot }) {
  const styles = useThemedStyles(createStyles);
  return (
    <>
      {spot.boxes?.map(([x, y, w, h], index) => (
        <View key={index} pointerEvents="none" style={[styles.cover, { left: pct(x), top: pct(y), width: pct(w), height: pct(h) }]} />
      ))}
    </>
  );
}

/** The selected part's name, in a small bubble beside its pin. */
function Bubble({ spot, text }: { spot: FigureSpot; text: string }) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const side = spot.x < 0.5 ? { left: pct(spot.x) } : { right: pct(1 - spot.x) };
  const level = spot.y < 0.75 ? { top: pct(spot.y), marginTop: 18 } : { bottom: pct(1 - spot.y), marginBottom: 18 };
  return (
    <View pointerEvents="none" style={[styles.bubble, elevation(colors, 2), side, level]}>
      <Text style={styles.bubbleText} numberOfLines={2}>{text}</Text>
    </View>
  );
}

type PinTone = 'idle' | 'selected' | 'done' | 'target';

function Pin({ spot, number, tone, onPress, label }: { spot: FigureSpot; number: string; tone: PinTone; onPress?: () => void; label: string }) {
  const styles = useThemedStyles(createStyles);
  const small = useWindowDimensions().width < 600; // phones: smaller pins, same touch area
  const body = (
    <View style={[styles.pin, small && styles.pinSmall, styles[`pin_${tone}`]]}>
      <Text style={[styles.pinText, small && styles.pinTextSmall, tone === 'selected' && styles.pinTextStrong]}>{number}</Text>
    </View>
  );
  return (
    <View pointerEvents="box-none" style={[styles.pinSlot, { left: pct(spot.x), top: pct(spot.y) }]}>
      {onPress ? (
        <Interactive onPress={onPress} accessibilityLabel={label} style={styles.pinHit}>
          {body}
        </Interactive>
      ) : (
        <View accessibilityLabel={label} style={styles.pinHit}>{body}</View>
      )}
    </View>
  );
}

/** In a lesson: a compact preview card; the interactive diagram opens in a sheet. */
export function FigureExplorer({ figureId }: { figureId: string }) {
  const styles = useThemedStyles(createStyles);
  const colors = useTheme();
  const [open, setOpen] = useState(false);
  const figure = getFigure(figureId);
  if (!figure) return null;
  const aspectRatio = figure.width / figure.height;
  return (
    <>
      <Interactive
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`Lecture diagram: ${figure.title}. Opens the interactive diagram.`}
        style={({ hovered }) => [styles.previewCard, hovered && styles.previewHover]}
      >
        <View style={[styles.previewImage, { width: Math.min(220, PREVIEW_HEIGHT * aspectRatio) }]}>
          <Image source={{ uri: figureUri(figure.src) }} style={StyleSheet.absoluteFill} contentFit="contain" accessibilityIgnoresInvertColors transition={150} />
        </View>
        <View style={styles.previewText}>
          <Text style={styles.kicker}>LECTURE DIAGRAM</Text>
          <Text style={styles.previewTitle} numberOfLines={2}>{figure.title}</Text>
          <Text style={styles.muted} numberOfLines={1}>{figure.spots.length} labelled parts · explore or test yourself</Text>
          <View style={styles.previewGo}>
            <Icon name="sparkle" size={14} color={colors.primaryText} />
            <Text style={styles.previewGoText}>Explore diagram</Text>
          </View>
        </View>
      </Interactive>
      <Sheet visible={open} onClose={() => setOpen(false)} title={figure.title} subtitle="Lecture diagram" width={860}>
        <FigureExplorerBody figure={figure} />
      </Sheet>
    </>
  );
}

function FigureExplorerBody({ figure }: { figure: LessonFigure }) {
  const styles = useThemedStyles(createStyles);
  const [mode, setMode] = useState<'explore' | 'test'>('explore');
  const [selected, setSelected] = useState<string | null>(null);
  const [shown, setShown] = useState<readonly string[]>([]);

  const testing = mode === 'test';
  const index = figure.spots.findIndex((spot) => spot.id === selected);
  const spot = index >= 0 ? figure.spots[index] : null;
  const isShown = (id: string) => shown.includes(id);
  const reveal = (id: string) => setShown((list) => (list.includes(id) ? list : [...list, id]));
  const switchMode = (next: 'explore' | 'test') => {
    setMode(next);
    setSelected(null);
    setShown([]);
  };

  return (
    <View style={styles.block}>
      <View style={styles.headRow}>
        <Text style={styles.kicker}>LECTURE DIAGRAM</Text>
        <SegmentedControl
          options={[{ value: 'explore', label: 'Explore' }, { value: 'test', label: 'Test yourself' }] as const}
          value={mode}
          onChange={switchMode}
          label="Diagram mode"
          style={styles.modes}
        />
      </View>
      <Canvas figure={figure} label={`${figure.title} — lecture diagram`}>
        {testing ? figure.spots.filter((item) => !isShown(item.id)).map((item) => <Covers key={item.id} spot={item} />) : null}
        {figure.spots.map((item, i) => (
          <Pin
            key={item.id}
            spot={item}
            number={String(i + 1)}
            tone={item.id === selected ? 'selected' : testing && isShown(item.id) ? 'done' : 'idle'}
            onPress={() => setSelected(item.id === selected ? null : item.id)}
            label={testing && !isShown(item.id) ? `Part ${i + 1}` : `Part ${i + 1}: ${item.label}`}
          />
        ))}
        {spot && (!testing || isShown(spot.id)) ? <Bubble spot={spot} text={spot.label} /> : null}
      </Canvas>
      <View style={styles.panel} accessibilityLiveRegion="polite">
        {spot ? (
          testing && !isShown(spot.id) ? (
            <View style={styles.panelRow}>
              <Text style={styles.panelTitle}>{index + 1}. What is this?</Text>
              <Button label="Show answer" size="sm" variant="secondary" onPress={() => reveal(spot.id)} />
            </View>
          ) : (
            <>
              <Text style={styles.panelTitle}>{index + 1}. {spot.label}</Text>
              {spot.note ? <Text style={styles.body}>{spot.note}</Text> : null}
            </>
          )
        ) : (
          <Text style={styles.muted}>
            {testing ? 'The labels are covered. Tap a number, name it, then check.' : 'Tap a number to see what it is.'}
          </Text>
        )}
        {testing ? (
          <View style={styles.panelRow}>
            <Text style={styles.muted}>{shown.length} of {figure.spots.length} checked</Text>
            {shown.length ? <Button label="Start again" size="sm" variant="ghost" onPress={() => switchMode('test')} /> : null}
            {shown.length < figure.spots.length ? <Button label="Show all" size="sm" variant="ghost" onPress={() => setShown(figure.spots.map((item) => item.id))} /> : null}
          </View>
        ) : null}
      </View>
      {figure.caption ? <Text style={styles.caption}>{figure.caption}</Text> : null}
    </View>
  );
}

/** The diagram for a quiz question: labels covered, the asked-about part marked. */
export function QuestionFigure({ figure: ref, revealed }: { figure: { id: string; spot?: string }; revealed: boolean }) {
  const styles = useThemedStyles(createStyles);
  const figure = getFigure(ref.id);
  if (!figure) return null;
  const target = getSpot(figure, ref.spot);
  return (
    <View style={styles.questionFigure}>
      <Canvas figure={figure} maxHeight={QUESTION_MAX_HEIGHT} label={`${figure.title} — lecture diagram${target ? ', one part marked' : ''}`}>
        {figure.spots.filter((spot) => !(revealed && spot.id === target?.id)).map((spot) => <Covers key={spot.id} spot={spot} />)}
        {target ? <Pin spot={target} number="?" tone="target" label="The marked part" /> : null}
      </Canvas>
    </View>
  );
}

const PIN = 26;

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    block: { gap: 10, marginTop: 4 },
    headRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
    modes: { minWidth: 230 },
    kicker: { fontSize: 11, fontWeight: '800', letterSpacing: 1, color: colors.textTertiary },
    title: { ...Type.headline, color: colors.text },
    canvas: { width: '100%', maxWidth: 760, alignSelf: 'center', borderRadius: Radius.md, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, backgroundColor: Paper },
    cover: { position: 'absolute', borderRadius: 4, backgroundColor: colors.surfaceSunken, borderWidth: 1, borderColor: colors.borderStrong },
    pinSlot: { position: 'absolute', width: 0, height: 0, alignItems: 'center', justifyContent: 'center', overflow: 'visible' },
    pinHit: { position: 'absolute', width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    pin: { width: PIN, height: PIN, borderRadius: PIN / 2, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
    pinSmall: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5 },
    pinTextSmall: { fontSize: 10 },
    pin_idle: { backgroundColor: colors.primary, borderColor: colors.surface },
    pin_selected: { backgroundColor: colors.surface, borderColor: colors.primary, transform: [{ scale: 1.15 }] },
    pin_done: { backgroundColor: colors.success, borderColor: colors.surface },
    pin_target: { width: PIN + 6, height: PIN + 6, borderRadius: (PIN + 6) / 2, backgroundColor: colors.error, borderColor: colors.surface, borderWidth: 3 },
    pinText: { fontSize: 12, fontWeight: '800', color: colors.onPrimary },
    pinTextStrong: { color: colors.text },
    bubble: { position: 'absolute', maxWidth: 220, paddingVertical: 5, paddingHorizontal: 9, borderRadius: Radius.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.primary },
    bubbleText: { ...Type.caption, fontWeight: '700', color: colors.text },
    panel: { gap: 6, padding: 12, borderRadius: Radius.md, backgroundColor: colors.surfaceMuted, minHeight: 48, justifyContent: 'center' },
    panelRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10 },
    panelTitle: { ...Type.headline, color: colors.text },
    body: { ...Type.callout, color: colors.textSecondary },
    muted: { ...Type.caption, color: colors.textTertiary },
    caption: { ...Type.caption, color: colors.textTertiary },
    questionFigure: { marginVertical: 4 },
    questionImage: { height: QUESTION_MAX_HEIGHT, marginVertical: 4 },
    previewCard: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 10, marginVertical: 6, borderRadius: Radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
    previewHover: { borderColor: colors.primaryBorder },
    previewImage: { height: PREVIEW_HEIGHT, maxWidth: '45%', borderRadius: Radius.sm, overflow: 'hidden', backgroundColor: Paper },
    previewText: { flex: 1, minWidth: 0, gap: 3 },
    previewTitle: { ...Type.headline, color: colors.text },
    previewGo: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
    previewGoText: { fontSize: 13.5, fontWeight: '800', color: colors.primaryText },
  });
}
