import { GamePlayer } from '@/components/explore/game-player';
import { getStudyGame } from '@/data/games';

const game = getStudyGame('med-term-scramble')!;

// Plays Med Term Scramble (public/game-builds/med-term-scramble/); the page itself is GamePlayer.
export default function MedTermScrambleScreen() {
  return <GamePlayer game={game} />;
}
