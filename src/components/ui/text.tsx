import { Children, createContext, forwardRef, type ReactNode, useContext, useEffect } from 'react';
import {
  Platform,
  Text as RNText,
  TextInput as RNTextInput,
  type TextInputProps,
  type TextProps,
  StyleSheet,
} from 'react-native';

import { experienceFont } from '@/data/experience-style';
import { isLabelStyle, originateFamily, originateWeight, sentenceCaseLabel } from '@/data/originate-type';
import { useExperience } from '@/hooks/use-experience';
import { loadLegacyWebFonts } from '@/lib/web-fonts';

// Text and TextInput for every screen. In Originate they apply the design
// system's type rules (data/originate-type.ts, docs/design-system.md): IBM Plex
// Sans (Source Serif 4 for reading text), weights 400/500/600 only, and
// sentence-case labels. In The Originals they apply the original app's font rule
// (Poppins headers, Roboto text, Montserrat subtext, Roboto inputs); in Hybrid
// only the original headings. Web only: the fonts are loaded from Google Fonts
// when an experience needs them, and phones keep their system font.

const FONTS_APPLY = Platform.OS === 'web';

type Flat = { fontSize?: number; fontWeight?: string | number; color?: unknown; letterSpacing?: number; fontFamily?: string };

// The family of the Text this one sits inside: a nested span (a bold word in a
// serif paragraph) keeps its paragraph's face unless it sets its own.
const ParentFamily = createContext<string | undefined>(undefined);

/** Originate's adjustments for one piece of text. */
function originateStyle(flat: Flat, parentFamily: string | undefined) {
  const label = isLabelStyle(flat);
  const weight = originateWeight(flat.fontWeight);
  const family = flat.fontFamily ? originateFamily(flat.fontFamily) : (parentFamily ?? originateFamily(undefined));
  return {
    ...(FONTS_APPLY ? { fontFamily: family } : null),
    ...(weight && weight !== String(flat.fontWeight) ? { fontWeight: weight } : null),
    ...(label ? { letterSpacing: 0, fontSize: Math.max(12, flat.fontSize ?? 12) } : null),
  };
}

function sentenceCaseChildren(children: ReactNode): ReactNode {
  if (typeof children === 'string') return sentenceCaseLabel(children);
  if (Array.isArray(children) && children.every((child) => typeof child === 'string' || typeof child === 'number')) {
    return sentenceCaseLabel(Children.toArray(children).join(''));
  }
  return children;
}

function useExperienceFont(style: TextProps['style'], input: boolean) {
  const experience = useExperience();
  const active = FONTS_APPLY && experience !== 'originate';
  useEffect(() => {
    if (active) loadLegacyWebFonts();
  }, [active]);
  if (!active) return null;
  const flat = (StyleSheet.flatten(style) ?? {}) as { fontSize?: number; fontWeight?: string | number; color?: unknown };
  return experienceFont(experience, flat, input);
}

export const Text = forwardRef<RNText, TextProps>(function Text({ style, children, ...rest }, ref) {
  const originate = useExperience() === 'originate';
  const parentFamily = useContext(ParentFamily);
  const font = useExperienceFont(style, false);
  if (originate) {
    const flat = (StyleSheet.flatten(style) ?? {}) as Flat;
    const label = isLabelStyle(flat);
    const own = originateStyle(flat, parentFamily);
    return (
      <ParentFamily.Provider value={own.fontFamily ?? parentFamily}>
        <RNText ref={ref} {...rest} style={[style, own]}>
          {label ? sentenceCaseChildren(children) : children}
        </RNText>
      </ParentFamily.Provider>
    );
  }
  return <RNText ref={ref} {...rest} style={font ? [style, font] : style}>{children}</RNText>;
});
// eslint-disable-next-line @typescript-eslint/no-redeclare -- the type of a Text ref, as with React Native's own
export type Text = RNText;

export const TextInput = forwardRef<RNTextInput, TextInputProps>(function TextInput({ style, ...rest }, ref) {
  const originate = useExperience() === 'originate';
  const font = useExperienceFont(style, true);
  if (originate) {
    const flat = (StyleSheet.flatten(style) ?? {}) as Flat;
    return <RNTextInput ref={ref} {...rest} style={[style, originateStyle(flat, undefined)]} />;
  }
  return <RNTextInput ref={ref} {...rest} style={font ? [style, font] : style} />;
});
// eslint-disable-next-line @typescript-eslint/no-redeclare -- the type of a TextInput ref (useRef<TextInput>)
export type TextInput = RNTextInput;
