import { GamePlayer } from '@/components/explore/game-player';
import { getStudyGame } from '@/data/games';

const game = getStudyGame('pathway-lab')!;

// Plays Pathway Lab (public/game-builds/pathway-lab/); the page itself is GamePlayer.
export default function PathwayLabScreen() {
  return <GamePlayer game={game} />;
}
