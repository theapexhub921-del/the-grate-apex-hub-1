// Study games built outside the app (Godot) and published as web builds in
// public/game-builds/<id>/. Add a game here and it appears in Explore → Games.

export type StudyGame = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  /** In-app page that plays the game. */
  href: string;
  /** Path of the web build's page (inside public/). */
  buildPath: string;
  tags: readonly string[];
  /** The game page's own background (shown while it loads), so the frame never flashes another colour. */
  loadingColor: string;
  /** Short line for the Connect page; only games you can play with classmates are listed there. */
  connectText?: string;
};

export const STUDY_GAMES: readonly StudyGame[] = [
  {
    id: 'med-term-scramble',
    title: 'Med Term Scramble',
    tagline: 'Unscramble medical terms against the clock.',
    description:
      'Solve scrambled medical terms from a clinical clue before time runs out. Build streaks, try Medical Rush and Case Mode, and challenge classmates in live multiplayer rooms.',
    href: '/games/med-term-scramble',
    buildPath: '/game-builds/med-term-scramble/play.html',
    tags: ['112 terms', '14 subjects', 'Single player', 'Multiplayer'],
    loadingColor: '#14101e',
    connectText: 'Race your classmates to unscramble medical terms in a live room, or play solo.',
  },
  {
    id: 'golden-hour',
    title: 'Golden Hour',
    tagline: 'A night shift on a short-staffed ward. Can you keep every patient safe?',
    description:
      'Six nursing shifts in a 3D ward: vital signs, comfort rounds, cannulas and injections, medicines, triage and handover. Learn each skill, drill it against the clock, then prove it at the bedside while Sister Rebecca watches your safety and dignity scores.',
    href: '/games/golden-hour',
    buildPath: '/game-builds/golden-hour/play.html',
    tags: ['6 shifts', '3D ward', 'Nursing skills', 'Single player'],
    loadingColor: '#1144C3',
  },
  {
    id: 'pathway-lab',
    title: 'Pathway Lab',
    tagline: 'Put the pathways back together, one enzyme at a time.',
    description:
      '70 pathways from biochemistry, physiology, anatomy and immunology. Learn a pathway step by step, then drag the missing enzymes and molecules into place or put the shuffled steps back in order. Combos, stars, a daily pathway and practice on the steps you miss.',
    href: '/games/pathway-lab',
    buildPath: '/game-builds/pathway-lab/play.html',
    tags: ['70 pathways', '634 steps', 'Learn mode', 'Single player'],
    loadingColor: '#0d1215',
  },
];

/** The live site, used when the native app opens a web game in the browser. */
export { LIVE_SITE } from '@/lib/live-site';

export function getStudyGame(id: string) {
  return STUDY_GAMES.find((game) => game.id === id);
}
