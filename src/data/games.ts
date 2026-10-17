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
  },
];

/** The live site, used when the native app opens a web game in the browser. */
export const LIVE_SITE = 'https://grateapex.vercel.app';

export function getStudyGame(id: string) {
  return STUDY_GAMES.find((game) => game.id === id);
}
