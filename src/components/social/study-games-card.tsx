import { GamesEntry } from '@/components/explore/games-section';

// Connect → the Games button, shown under Battles (where the games were).
// It opens the Games page (/games), which lists every study game; Med Term
// Scramble's Multiplayer button creates or joins a live room from there.
export function StudyGamesCard() {
  return <GamesEntry />;
}
