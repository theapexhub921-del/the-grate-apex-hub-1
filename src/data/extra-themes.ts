// Themes added in this app, in the original themes' format so every experience
// can draw them the way it draws the legacy themes.
// - Parchment and Aurora (2026-10-10) unlock late (Level 22 and 25).
// - The seasonal themes (2026-10-18) unlock like Christmas and Valentine: earn the
//   matching "Special days" achievement by studying on that day (achievements.ts,
//   moving dates in data/holidays.ts). Independence uses the Ghana flag's colours.
// - MSA (red and white) unlocks at Level 15. Everything is free (owner, 2026-10-18).
import type { LegacyThemeDef } from '@/data/legacy-themes';

export const EXTRA_THEMES: readonly LegacyThemeDef[] = [
  {
    id: 'parchment', icon: '📜', name: 'Parchment', desc: 'Warm paper and ink, made for long reading.', unlock: 22, light: true,
    bg1: '#fdf7e8', bg2: '#f6ead0', bg3: '#f3e6c6', ink: '#33240f', silver: '#584529', dim: '#6f5a3b',
    panel: 'rgba(120,80,30,0.06)', panelBrd: 'rgba(120,80,30,0.2)', accent: '#9a4f1c', gold: '#8a5a08',
  },
  {
    id: 'aurora', icon: '🌌', name: 'Aurora', desc: 'Northern lights over a night sky.', unlock: 25, light: false,
    bg1: '#0f4c4a', bg2: '#1b2a6b', bg3: '#070b1f', ink: '#eef6ff', silver: '#c2dcea', dim: '#93b2c6',
    panel: 'rgba(120,255,214,0.06)', panelBrd: 'rgba(120,255,214,0.2)', accent: '#5ff2c4', gold: '#cfa8ff',
    gradient: ['#0f4c4a', '#16376a', '#2a1650', '#070b1f'],
  },
  {
    id: 'newyear', icon: '🎆', name: 'New Year', desc: 'Midnight blue and champagne gold for a fresh start.', unlock: 0, light: false, ach: 'ny',
    bg1: '#1c2156', bg2: '#11143c', bg3: '#05061c', ink: '#fffaf0', silver: '#e6dfc8', dim: '#b8ae92',
    panel: 'rgba(255,255,255,0.07)', panelBrd: 'rgba(255,215,120,0.32)', accent: '#ffcf5c', gold: '#ffe08a',
    gradient: ['#2a2f6e', '#161a48', '#0b0d2c', '#05061c'],
  },
  {
    id: 'independence', icon: '⭐', name: 'Independence', desc: 'Red, gold and green with the black star: the Ghana flag.', unlock: 0, light: false, ach: 'gh',
    bg1: '#9c0d1c', bg2: '#6b5200', bg3: '#003d24', ink: '#fffbe6', silver: '#ffeaa8', dim: '#e6cb6e',
    panel: 'rgba(0,0,0,0.24)', panelBrd: 'rgba(252,209,22,0.4)', accent: '#fcd116', gold: '#fcd116',
    gradient: ['#a10f1e', '#7a5c00', '#00512f'],
  },
  {
    id: 'easter', icon: '🐣', name: 'Easter', desc: 'Spring lilac, buttercup and mint.', unlock: 0, light: true, ach: 'easter',
    bg1: '#fbf5ff', bg2: '#efe6ff', bg3: '#e4f6ec', ink: '#2b1f40', silver: '#4a3c63', dim: '#66587d',
    panel: 'rgba(110,80,170,0.06)', panelBrd: 'rgba(110,80,170,0.2)', accent: '#7f4fcf', gold: '#9a6200',
    gradient: ['#fbf5ff', '#efe6ff', '#fff4d6', '#e4f6ec'],
  },
  {
    id: 'eidfitr', icon: '🌙', name: 'Eid al-Fitr', desc: 'Emerald night with a golden crescent.', unlock: 0, light: false, ach: 'eidfitr',
    bg1: '#0f5a45', bg2: '#093a2e', bg3: '#031d17', ink: '#f4fff9', silver: '#cdeee0', dim: '#93c7b2',
    panel: 'rgba(255,255,255,0.07)', panelBrd: 'rgba(230,190,90,0.34)', accent: '#e6be5a', gold: '#f2d27a',
  },
  {
    id: 'eidadha', icon: '🕌', name: 'Eid al-Adha', desc: 'Deep indigo and warm desert sand.', unlock: 0, light: false, ach: 'eidadha',
    bg1: '#24306b', bg2: '#161d48', bg3: '#080b24', ink: '#fbf7ef', silver: '#ddd5c2', dim: '#ab9f86',
    panel: 'rgba(255,255,255,0.07)', panelBrd: 'rgba(214,170,100,0.34)', accent: '#d9a85f', gold: '#e8c27f',
  },
  {
    id: 'msa', icon: '❤️', name: 'MSA', desc: 'Crisp white with bold red.', unlock: 15, light: true,
    bg1: '#ffffff', bg2: '#fff1f2', bg3: '#ffe1e4', ink: '#2b0a0e', silver: '#5c1f26', dim: '#7a3a41',
    panel: 'rgba(200,16,46,0.05)', panelBrd: 'rgba(200,16,46,0.24)', accent: '#c8102e', gold: '#a50d26',
  },
];
