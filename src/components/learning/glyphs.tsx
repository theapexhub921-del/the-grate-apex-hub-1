import { useId } from 'react';
import { type StyleProp, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { Icon } from '@/components/ui/icon';
import { Type } from '@/constants/theme';
import type { SubjectId } from '@/data/lesson-types';
import { useTheme } from '@/hooks/use-theme';

// Visual identity for subjects and topics — replaces emoji.
//
//   SubjectGlyph: a gradient tile with the subject's drawn icon.
//   TopicGlyph:   an element-style tile ("FA", "HM"…) in the subject's
//                 colour, like a periodic-table square.

export const SUBJECT_TINTS: Record<SubjectId, { gradient: readonly [string, string]; ink: string; soft: string }> = {
  biochemistry: { gradient: ['#3B5BDF', '#142A98'], ink: '#FFFFFF', soft: '#91A9FF' },
  physiology: { gradient: ['#1FA08F', '#0E6159'], ink: '#FFFFFF', soft: '#1FA08F' },
  anatomy: { gradient: ['#273766', '#121B3E'], ink: '#FDC00A', soft: '#6F7FB8' },
};

function GradientTile({ size, radius, colors: stops }: { size: number; radius: number; colors: readonly [string, string] }) {
  const id = `t${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={stops[0]} />
          <Stop offset="1" stopColor={stops[1]} />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={size} height={size} rx={radius} fill={`url(#${id})`} />
      <Rect x={0.5} y={0.5} width={size - 1} height={size - 1} rx={radius} fill="none" stroke="#FFFFFF" strokeOpacity={0.14} />
    </Svg>
  );
}

export function SubjectGlyph({ subject, size = 48, style }: { subject: SubjectId; size?: number; style?: StyleProp<ViewStyle> }) {
  const tint = SUBJECT_TINTS[subject];
  const radius = Math.round(size * 0.3);
  return (
    <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]} aria-hidden>
      <GradientTile size={size} radius={radius} colors={tint.gradient} />
      {/* Positioned above the tile: an absolutely positioned SVG would
          otherwise paint over an in-flow icon on the web. */}
      <View style={styles.glyphIcon}>
        <Icon name={subject} size={Math.round(size * 0.52)} color={tint.ink} strokeWidth={1.9} />
      </View>
    </View>
  );
}

const SKIP = new Set(['and', 'of', 'the', 'in', 'to', 'a', 'an', 'system:', 'system']);

// "Blood Coagulation and Fibrinolysis" → "BC"; "Haem and Haem Metabolism" → "HM".
export function topicMonogram(title: string) {
  const words = title
    .replace(/[^A-Za-z\s:]/g, ' ')
    .split(/\s+/)
    .filter((word) => word && !SKIP.has(word.toLowerCase()));
  const unique = words.filter((word, index) => words.findIndex((other) => other.toLowerCase() === word.toLowerCase()) === index);
  const letters = (unique.length >= 2 ? unique[0][0] + unique[1][0] : (unique[0] ?? '?').slice(0, 2)).toUpperCase();
  return letters.length === 2 ? letters[0] + letters[1].toLowerCase() : letters;
}

export function TopicGlyph({
  title,
  subject,
  index,
  size = 46,
  style,
}: {
  title: string;
  subject: SubjectId | null | undefined;
  index?: number;
  size?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const colors = useTheme();
  const tint = SUBJECT_TINTS[subject ?? 'biochemistry'];
  const radius = Math.round(size * 0.28);
  return (
    <View
      style={[
        styles.topic,
        { width: size, height: size, borderRadius: radius, backgroundColor: colors.surfaceMuted, borderColor: tint.soft + '66' },
        style,
      ]}
      aria-hidden
    >
      {index !== undefined ? <Text style={[styles.index, { color: colors.textTertiary, fontSize: Math.max(8, size * 0.19) }]}>{index}</Text> : null}
      <Text style={[styles.monogram, { color: colors.text, fontSize: size * 0.38 }]}>{topicMonogram(title)}</Text>
      <View style={[styles.bar, { backgroundColor: tint.soft }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  glyphIcon: { zIndex: 1 },
  topic: { alignItems: 'center', justifyContent: 'center', borderWidth: 1, overflow: 'hidden' },
  index: { position: 'absolute', top: 4, left: 6, ...Type.numeral, fontWeight: '700' },
  monogram: { ...Type.numeral, letterSpacing: -0.5 },
  bar: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 3 },
});
