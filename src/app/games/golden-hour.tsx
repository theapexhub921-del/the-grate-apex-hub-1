import { GamePlayer } from '@/components/explore/game-player';
import { getStudyGame } from '@/data/games';

const game = getStudyGame('golden-hour')!;

// Plays Golden Hour (public/game-builds/golden-hour/); the page itself is GamePlayer.
export default function GoldenHourScreen() {
  return <GamePlayer game={game} />;
}
