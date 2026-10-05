import { usePathname } from 'expo-router';

import type { ColorSchemeName } from '@/constants/theme';

// The GRATEAPEX page atmosphere: the layered light behind every screen.
//
//   base field → tonal fields → aurora → light rays → faint grid
//   → localized gold glow → grain → vignette
//
// Each screen has a MOOD that sets how much of it shows: Home is lively,
// Learn is calm, the quiz is nearly plain (readability first), Profile and
// Settings are quiet. The Apex arena paints its own darker stage.

export type AtmosphereMood = 'lively' | 'expressive' | 'calm' | 'focus' | 'quiet' | 'auth';

type Tint = readonly [color: string, opacity: number];

export type AtmospherePalette = {
  base: string;
  fieldA: Tint; // light from the top-left
  fieldB: Tint; // side field (right)
  fieldC: Tint; // depth at the bottom
  auroraA: Tint;
  auroraB: Tint;
  auroraC: Tint; // the gold one
  grid: Tint;
  ray: Tint;
  gold: Tint; // localized glow behind the hero area
  vignette: Tint;
  grain: number; // opacity of the noise layer
  grainBlend: 'overlay' | 'multiply' | 'soft-light';
};

export const ATMOSPHERE: Record<ColorSchemeName, AtmospherePalette> = {
  apex: {
    base: '#0A2572',
    fieldA: ['#2A62EC', 0.8],
    fieldB: ['#1245C4', 0.85],
    fieldC: ['#04123F', 0.9],
    auroraA: ['#3C78FF', 0.38],
    auroraB: ['#7C9CFF', 0.2],
    auroraC: ['#FDC00A', 0.12],
    grid: ['#B4CCFF', 0.07],
    ray: ['#C8DAFF', 0.09],
    gold: ['#FDC00A', 0.16],
    vignette: ['#020A28', 0.55],
    grain: 0.1,
    grainBlend: 'overlay',
  },
  light: {
    base: '#F3F5FA',
    fieldA: ['#1245C4', 0.09],
    fieldB: ['#5A8CFF', 0.1],
    fieldC: ['#DCE4F5', 0.8],
    auroraA: ['#1245C4', 0.1],
    auroraB: ['#7FA6FF', 0.14],
    auroraC: ['#FDC00A', 0.09],
    grid: ['#122864', 0.045],
    ray: ['#1245C4', 0.05],
    gold: ['#FDC00A', 0.1],
    vignette: ['#1A2E6E', 0.07],
    grain: 0.05,
    grainBlend: 'multiply',
  },
  dark: {
    base: '#0B0D12',
    fieldA: ['#2850C8', 0.16],
    fieldB: ['#1B2A5E', 0.22],
    fieldC: ['#05060A', 0.9],
    auroraA: ['#3B6BEA', 0.16],
    auroraB: ['#4F6FD8', 0.1],
    auroraC: ['#FDC00A', 0.05],
    grid: ['#FFFFFF', 0.03],
    ray: ['#9DB6FF', 0.045],
    gold: ['#FDC00A', 0.06],
    vignette: ['#000000', 0.5],
    grain: 0.07,
    grainBlend: 'overlay',
  },
};

// How strongly each layer shows, per mood (0–1 multipliers).
export type MoodLevels = {
  fields: number;
  aurora: number;
  rays: number;
  grid: number;
  gold: number;
  grain: number;
  vignette: number;
  animate: boolean;
};

export const MOODS: Record<AtmosphereMood, MoodLevels> = {
  lively: { fields: 1, aurora: 0.9, rays: 0.7, grid: 0.6, gold: 1, grain: 1, vignette: 1, animate: true },
  expressive: { fields: 1, aurora: 1, rays: 0.5, grid: 0.85, gold: 0.7, grain: 1, vignette: 1, animate: true },
  calm: { fields: 0.8, aurora: 0.4, rays: 0, grid: 0.35, gold: 0.25, grain: 0.8, vignette: 0.8, animate: false },
  focus: { fields: 0.45, aurora: 0, rays: 0, grid: 0, gold: 0, grain: 0.5, vignette: 0.5, animate: false },
  quiet: { fields: 0.65, aurora: 0.25, rays: 0, grid: 0, gold: 0.2, grain: 0.7, vignette: 0.7, animate: false },
  auth: { fields: 1, aurora: 1, rays: 0.9, grid: 0.7, gold: 1, grain: 1, vignette: 1, animate: true },
};

// The mood for the current route.
export function moodForPath(pathname: string): AtmosphereMood {
  if (pathname === '/' || pathname === '') return 'lively';
  if (pathname.startsWith('/login') || pathname.startsWith('/onboarding')) return 'auth';
  if (pathname.startsWith('/explore')) return 'expressive';
  if (pathname.startsWith('/social')) return 'lively';
  if (pathname.startsWith('/learn/quiz') || pathname.startsWith('/learn/review')) return 'focus';
  if (pathname.startsWith('/learn/lesson')) return 'focus';
  if (pathname.startsWith('/learn')) return 'calm';
  return 'quiet'; // profile, settings, progress
}

export function useAtmosphereMood(): AtmosphereMood {
  return moodForPath(usePathname());
}

// '#RRGGBB' + opacity → 'rgba(r, g, b, a)'.
export function rgba([hex, opacity]: Tint, scale = 1) {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  const a = Math.max(0, Math.min(1, opacity * scale));
  return `rgba(${r}, ${g}, ${b}, ${Number(a.toFixed(3))})`;
}
